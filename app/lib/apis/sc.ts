"use server";

import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  VersionedTransaction,
} from "@solana/web3.js";
import base58 from "bs58";
import { isDevnet, rpcConnection } from "../sc/constant";
import {
  DEFAULT_RPC_URL,
  TransactionsService,
} from "../service/transactions/general-transaction";

const SEND_TXN_MAX_RETRIES = 4;
export const sendAndConfirmTransaction = async (
  signedTxn: string
): Promise<string> => {
  const versionedTxn = VersionedTransaction.deserialize(
    base58.decode(signedTxn)
  );

  if (isDevnet) {
    const connection = rpcConnection;

    const transactionSim = await connection.simulateTransaction(versionedTxn);
    if (transactionSim.value.err) {
      console.error("Txn Simulation Error:", JSON.stringify(transactionSim));
    }

    const signature = await connection.sendRawTransaction(
      versionedTxn.serialize(),
      {
        skipPreflight: true,
        maxRetries: SEND_TXN_MAX_RETRIES,
      }
    );

    console.log({ signature });

    return signature;
  } else {
    const TransactionService = new TransactionsService("single");
    const txnRes = await TransactionService.sendTxn(versionedTxn);

    console.log({ txnRes });

    const connection = new Connection(DEFAULT_RPC_URL);
    const signature = await connection.confirmTransaction(
      txnRes.transactionId,
      "single"
    );

    console.log({ signature });
    return txnRes.transactionId;
  }
};
