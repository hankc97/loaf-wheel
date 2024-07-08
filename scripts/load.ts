import { buildDepositFundsTxn } from "../app/lib/apis/wheel";
import {
  VersionedTransaction,
  Keypair,
  Connection,
  Transaction,
} from "@solana/web3.js";
import base58 from "bs58";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

const buildAndSign = async (
  wallet: string,
  walletSk: string,
  connection: Connection = new Connection("https://api.devnet.solana.com")
) => {
  const encodedTxn = await buildDepositFundsTxn(wallet, 0.1);

  const transaction = Transaction.from(Buffer.from(encodedTxn, "base64"));

  const signer = Keypair.fromSecretKey(base58.decode(walletSk));
  const adminWallet = new NodeWallet(signer);
  const signedTxn = await adminWallet.signTransaction(transaction);

  await connection.sendRawTransaction(signedTxn.serialize());

  console.debug("Transaction sent", {
    wallet,
  });
};

const main = async () => {
  const signers = [
    {
      publicKey: "8VrQeSRxymJBTsP6cd59dE5VGKECnsHo5nen3vCe631x",
      secretKey:
        "Moc6zTo6ZvhbdETwpavJjMJMtJtqh7AuMsMoPQodwk7WbxpsQPe3WRnAxTNZV8UJCXqAZcpopUVZTUiFg4DGCR4",
    },
    {
      publicKey: "8k3kzy8nJhEcC6tFNnTQDtqZuswFcMtiRQuQZt2BpAhf",
      secretKey:
        "2yd4UoE4iVHL2ZTydKX5sRoAucA41oLBWRZX7pHgy1Ay6QVKEVRvL2gyavmMG798HA6ejyAmwqigS4keT9LqkoSR",
    },
    {
      publicKey: "C2HpHqoZ4NdF8HpXsYP14RvJf85aVqH6eG3LGTW6SCqD",
      secretKey:
        "21o4sVb6dkgnz2N28kuK32gZpyFPcySdEPis6HMZUAbdT1qQJMt9sci39TgsbirnWBwakLfHQFxEwfsBS7fsjBTM",
    },
  ];

  for (const signer of signers) {
    await buildAndSign(signer.publicKey, signer.secretKey);
  }
};

main()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
