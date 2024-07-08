import { createSingleton } from "../../cache";
import sequelize from "../../db/sequelize";
import { WheelDetailsModel } from "../../db/models/wheelDetails";
import { WheelModel } from "../../db/models/wheel";
import {
  ComputeBudgetProgram,
  Connection,
  GetProgramAccountsFilter,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import Decimal from "decimal.js";
import * as anchor from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { IDL, FluffiesWheel } from "./fluffys-idl";
import { IPlayerDetails } from "../../type";
import { WheelSnapShotModel } from "../../db/models/wheelSnapShot";
import { pickAReward } from "../../../../app/util/odds";

const WHEEL_SEED = Buffer.from(anchor.utils.bytes.utf8.encode("wheel"));
const USER_SEED = Buffer.from(anchor.utils.bytes.utf8.encode("user"));
const PROGRAM_ID = new PublicKey("fLufkZLHGvi7k3ZyQTUbVPDKou2wNYYeaxHxYmm4qe1");
const RPC_URL = "https://api.devnet.solana.com";

class GameImpl {
  async buildDepositFundsTxn(wallet: string, amount: number) {
    const connection = new Connection(RPC_URL);
    const program = await getProgram(
      new NodeWallet(Keypair.generate()),
      PROGRAM_ID,
      connection
    );
    const [wheelState] = await wheelStatePda();
    const [userState] = await userStatePda(new PublicKey(wallet));

    const adminSigner = await getAdminSigner();
    const adminWallet = new NodeWallet(adminSigner);

    // Get the current game id from the chain.
    const wheelStateData = await program.account.wheelState.fetch(wheelState);
    const gameId = wheelStateData.gameId;

    const amountLamports = amount * LAMPORTS_PER_SOL;

    const ix = await program.methods
      .enterGame(new anchor.BN(amountLamports))
      .accounts({
        admin: adminWallet.publicKey,
        owner: new PublicKey(wallet),
        wheelState: wheelState,
        gameId: gameId,
        userState: userState,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    const transaction = new Transaction();

    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 25_000 })
    );
    transaction.add(ix);

    transaction.feePayer = new PublicKey(wallet);
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("finalized")
    ).blockhash;
    transaction.partialSign(adminSigner);

    const transactionEncoded = transaction
      .serialize({ requireAllSignatures: false })
      .toString("base64");

    return transactionEncoded;
  }

  async getPlayerDetails() {
    return await WheelDetailsModel.findAll();
  }

  // if GameDetails .length === 0, then game is not started
  // we want to create a single row in the game details table
  async getGameByAll() {
    return await WheelModel.findAll();
  }

  async createNewWheel() {
    return await WheelModel.create({
      // 30 seconds from now
      endTimestamp: new Date(Date.now() + 30 * 1000),
      gameState: "started",
    });
  }

  // getWinner, pulls winner and stores winner on chain, changing winner state from 1111 to winner_wallet
  async endGame() {
    const connection = new Connection(RPC_URL);
    const program = await getProgram(
      new NodeWallet(Keypair.generate()),
      PROGRAM_ID,
      connection
    );
    const [wheelState] = await wheelStatePda();
    const adminSigner = await getAdminSigner();
    const adminWallet = new NodeWallet(adminSigner);
    const winnerWallet = await getWinner();
    console.log({ winnerWallet });
    if (!winnerWallet) {
      return;
    }

    // Game id is a random public key.
    const gameId = new Keypair().publicKey;

    const ixPayoutWinner = await program.methods
      .payoutPrizeAdmin()
      .accounts({
        admin: adminWallet.publicKey,
        wheelState: wheelState,
        winner: winnerWallet,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    const ixCreateGame = await program.methods
      .createGameAdmin()
      .accounts({
        admin: adminWallet.publicKey,
        wheelState: wheelState,
        gameId: gameId,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    const transaction = new Transaction();
    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 25_000 })
    );
    // transaction.add(await getJitoTip(adminWallet.publicKey));
    transaction.add(ixPayoutWinner);
    transaction.add(ixCreateGame);
    transaction.feePayer = adminWallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("finalized")
    ).blockhash;
    transaction.partialSign(adminSigner);

    let txRes = await connection.sendRawTransaction(transaction.serialize());
  }

  async resetGame(wallet: string, amount: number) {
    return sequelize.transaction(async (transaction) => {
      await sequelize.query("TRUNCATE TABLE fluffy_wheel CASCADE", {
        transaction,
      });

      const gameDetails = await WheelModel.create(
        {
          // 30 seconds from now
          endTimestamp: new Date(Date.now() + 30 * 1000),
          gameState: "started",
        },
        { transaction }
      );

      const { id, endTimestamp, gameState } = gameDetails.toJSON();

      await WheelDetailsModel.create(
        {
          walletId: wallet,
          depositAmount: amount,
          gameId: id,
        },
        { transaction }
      );

      return gameDetails;
    });
  }

  getPlayerInfoPg = async (gameId: string): Promise<WheelSnapShotModel[]> => {
    return await WheelSnapShotModel.findAll();
  };

  getPlayerInfo = async (): Promise<IPlayerDetails[]> => {
    const connection = new Connection(RPC_URL); // todo config
    const program = await getProgram(
      new NodeWallet(Keypair.generate()),
      PROGRAM_ID,
      connection
    );
    const [wheelState] = await wheelStatePda();
    const wheelStateData = await program.account.wheelState.fetch(wheelState);
    const currentGameId = wheelStateData.gameId;

    const filters: GetProgramAccountsFilter[] = [
      {
        memcmp: {
          offset: 8 + 32, // 8 bytes for the account discriminator + 32 bytes for the for owner, then game Id.
          bytes: currentGameId.toString(),
        },
      },
    ];

    const usersInGame = await program.account.userState.all(filters);
    const userStates = await Promise.all(
      usersInGame.map(async (user) => {
        return {
          walletId: user.account.owner.toString(),
          depositAmount: user.account.usdValue.toString() / Math.pow(10, 9),
          id: user.publicKey.toString(), // just the pda key
        };
      })
    );

    return userStates;
  };

  async getAllGameInfo(): Promise<{
    amount: number;
    gameId: string;
    endTimestamp: Date;
    winner: string;
  }> {
    const connection = new Connection(RPC_URL); // todo config
    const program = await getProgram(
      new NodeWallet(Keypair.generate()),
      PROGRAM_ID,
      connection
    );
    const [wheelState] = await wheelStatePda();
    const wheelStateData = await program.account.wheelState.fetch(wheelState);
    const currentGameId = wheelStateData.gameId;

    return {
      amount: Number(wheelStateData.usdValue),
      gameId: currentGameId.toString(),
      endTimestamp: new Date(
        parseInt(wheelStateData.timestampEnds.toString()) * 1000
      ),
      winner: wheelStateData.winner.toString(),
    };
  }

  async snapshotGame(game: IPlayerDetails[]) {
    return sequelize.transaction(async (transaction) => {
      await sequelize.query("TRUNCATE TABLE fluffy_wheel_snapshot", {
        transaction,
      });
      return await WheelSnapShotModel.bulkCreate(game, {
        returning: false,
        transaction,
      });
    });
  }
}

export const GameService = createSingleton(() =>
  Promise.resolve(new GameImpl())
);

export async function getProgram(
  wallet: any,
  programId: PublicKey,
  connection: Connection
): Promise<anchor.Program<FluffiesWheel>> {
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "recent",
  });
  try {
    const idl = IDL;
    const program = new anchor.Program(idl, programId, provider);
    return program;
  } catch {
    throw new Error("Failed to get program");
  }
}

export async function getWinner(): Promise<string | null> {
  const GameServiceValue = await GameService.getValue();
  const users = await GameServiceValue.getPlayerInfo();

  const gameInfo = await GameServiceValue.getAllGameInfo();
  GameServiceValue.snapshotGame(
    users.map((user) => {
      return {
        walletId: user.walletId,
        depositAmount: user.depositAmount,
        gameId: gameInfo.gameId,
      };
    })
  );

  const totalDepositAmount = users.reduce(
    (sum: Decimal, user: any) => sum.plus(new Decimal(user.depositAmount)),
    new Decimal(0)
  );

  const playerPool = users.map((user) => {
    return {
      id: user.walletId,
      depositAmount: user.depositAmount,
      odds:
        new Decimal(user.depositAmount).div(totalDepositAmount).toNumber() *
        100 * // convert to percentage
        10_000, // for better precision
    };
  });

  const reward = pickAReward(playerPool);

  return reward.id;
}

async function wheelStatePda(): Promise<[anchor.web3.PublicKey, number]> {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(WHEEL_SEED)],
    PROGRAM_ID
  );
}

async function userStatePda(
  user: PublicKey
): Promise<[anchor.web3.PublicKey, number]> {
  let res = anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(USER_SEED), user.toBuffer()],
    PROGRAM_ID
  );

  return res;
}

async function getAdminSigner() {
  return Keypair.fromSecretKey(
    new Uint8Array(
      JSON.parse(
        "[47,95,109,249,153,180,171,109,112,96,59,206,65,238,207,84,100,245,200,90,97,19,99,96,0,164,170,92,153,181,101,139,8,132,148,138,99,199,22,220,213,152,22,70,179,221,222,232,227,173,42,3,216,35,171,106,173,204,221,81,157,140,100,197]" as string
      )
    )
  );
}
