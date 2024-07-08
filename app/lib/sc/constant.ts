import { Connection } from "@solana/web3.js";

export const rpcConnection = new Connection(
  process.env.RPC_CONNECTION!,
  "processed"
);

export const isDevnet = rpcConnection.rpcEndpoint.includes("devnet");

export const GCR_TOKEN_MINT = isDevnet
  ? ""
  : "3de2yRhtD4VbJBb8EQAQffYMPLU4EnSHT1eveBwiL3tn";
