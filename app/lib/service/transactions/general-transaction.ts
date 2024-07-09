import { Commitment, Keypair, TransactionSignature } from "@solana/web3.js";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import base58 from "bs58";
import { SEND_TXN_MAX_RETRIES } from "./web3";
import { JITO_CONN_TXN_URL, TXN_RPC_URLS } from "./jito";

export const DEFAULT_RPC_URL =
  "https://rpc.hellomoon.io/dcc501a2-187a-469b-af8c-1d8c92c18ac8";
export const CONFIRMATION_STATUS = "confirmed";

export class TransactionsService {
  private readonly conn: Connection;

  constructor(confirmationStatus: Commitment = CONFIRMATION_STATUS) {
    this.conn = new Connection(DEFAULT_RPC_URL, confirmationStatus);
  }

  async sendTxn(
    signedTxn: VersionedTransaction,
    keypair?: Keypair,
    onPollSuccess?: () => Promise<void>
  ): Promise<any> {
    const transactionSim = await this.conn.simulateTransaction(signedTxn);
    if (transactionSim.value.err) {
      console.error("Txn Simulation Error:", JSON.stringify(transactionSim));
    }
    const transactionId = base58.encode(signedTxn.signatures[0]);
    const rpcUrls = [JITO_CONN_TXN_URL, ...TXN_RPC_URLS];

    console.debug(
      `${new Date().toLocaleString("en-US")}: sending Txn ${transactionId} to ${
        rpcUrls.length
      } RPCs`
    );

    const serializedTxn = signedTxn.serialize();

    const promises: Promise<TransactionSignature>[] = [];
    // send to as many RPCs as possible - make sure we are resilient to failures in Jito and elsewhere
    for (const url of rpcUrls) {
      promises.push(
        new Connection(url, CONFIRMATION_STATUS).sendRawTransaction(
          serializedTxn,
          {
            skipPreflight: true,
            maxRetries: SEND_TXN_MAX_RETRIES,
          }
        )
      );
    }
    await Promise.allSettled(promises);

    return { transactionId };
  }
}
