"use server";

import { Connection, PublicKey } from "@solana/web3.js";
import { GCR_TOKEN_MINT, rpcConnection } from "../sc/constant";

export const getLoafBalance = async (walletId: string) => {
  const accounts = await rpcConnection.getParsedTokenAccountsByOwner(
    new PublicKey(walletId),
    {
      mint: new PublicKey(GCR_TOKEN_MINT),
    }
  );

  if (accounts.value.length === 0) {
    return 0;
  }
  return accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
};
