import { Commitment, Connection, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";

const QUICK_NODE_CONNECTION = new Connection(
  "https://lingering-special-daylight.solana-mainnet.quiknode.pro/6597b9924b286067070d23e5e2080228c5b3b429/"
);
const HELLO_MOON_CONNECTION = new Connection(
  "https://global.rpc.hellomoon.io/68ff79c0-666f-4e3a-9c0a-140fde1f521e"
);
const HELIUS_CONNECTION = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=74b110ab-eda6-4e21-9f40-90f406f79c0a"
);

export const sendTransaction = async (txn: string) => {
  const sendRawTxn = async (conn: Connection, txn: VersionedTransaction) => {
    const res = await conn.sendRawTransaction(txn.serialize());
    return { tx: res, rpc: conn.rpcEndpoint };
  };

  const sendTxn = async (tx: VersionedTransaction) => {
    const txns = await Promise.allSettled(
      [HELIUS_CONNECTION, HELLO_MOON_CONNECTION, QUICK_NODE_CONNECTION].map(
        async (conn) => await sendRawTxn(conn, tx)
      )
    );
    //@ts-ignore
    return txns.find((txn) => txn.status === "fulfilled")?.value as {
      tx: string;
      rpc: string;
    };
  };

  const versionedTxn = VersionedTransaction.deserialize(bs58.decode(txn));

  console.log("Sending txn...");
  const sendResponse = await sendTxn(versionedTxn);

  console.log({ sendResponse });
  if (sendResponse) {
    console.log(`Sent txn to ${sendResponse.rpc}`);
    return sendResponse.tx;
  } else {
    throw new Error("Failed to send transaction");
  }
};

// export const rpcConnection = new Connection(process.env.HM_RPC!, "processed");
// export const isDevnet = rpcConnection.rpcEndpoint.includes("devnet");

export const confirmTransaction = async ({
  signature,
  commitment,
  connection = HELLO_MOON_CONNECTION,
  ...rest
}: {
  signature: string;
  commitment?: Commitment;
  sleepMillis?: number;
  iterations?: number;
  connection?: Connection;
}) => {
  // const connection = HELLO_MOON_CONNECTION;
  let isConfirmed = false;
  const iterations = rest.iterations ?? 10;
  const sleepMills = rest.sleepMillis ?? 500;
  for (let i = 0; i < iterations && !isConfirmed; i++) {
    const blockhash = await connection.getLatestBlockhash();
    try {
      const res = await connection.confirmTransaction(
        {
          signature,
          ...blockhash,
        },
        commitment ?? "confirmed"
      );
      isConfirmed = !res.value.err;
    } catch (error) {
      // continue on
    }
    await new Promise((resolve) => setTimeout(resolve, sleepMills));
  }
  return { confirmed: isConfirmed, signature };
};

export const sendAndConfirmTransaction = async (
  transaction: string,
  options?: {
    commitment?: Commitment;
    sleepMillis?: number;
    iterations?: number;
  }
) => {
  console.log("sending transaction...");
  const signature = await sendTransaction(transaction);

  console.log({ signature });

  const txns = await Promise.allSettled(
    [HELIUS_CONNECTION, HELLO_MOON_CONNECTION, QUICK_NODE_CONNECTION].map(
      async (conn) =>
        await confirmTransaction({ signature, ...(options ?? {}) })
    )
  );
  // console.log({ txns });
  //@ts-ignore
  return txns.find((txn) => txn.status === "fulfilled")?.value as {
    tx: string;
    rpc: string;
  } as {
    confirmed: boolean;
    signature: string;
  };
};
