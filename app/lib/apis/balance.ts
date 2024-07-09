"use server";

import { Connection, PublicKey } from "@solana/web3.js";
import { LOAF_TOKEN_MINT, rpcConnection } from "../sc/constant";
import axios from "axios";

export const getLoafBalance = async (walletId: string) => {
  const accounts = await rpcConnection.getParsedTokenAccountsByOwner(
    new PublicKey(walletId),
    {
      mint: new PublicKey(LOAF_TOKEN_MINT),
    }
  );

  if (accounts.value.length === 0) {
    return 0;
  }
  return accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
};

export const getLoafBalanceInEscrowProgram = async (walletId: string) => {
  if (
    !process.env.HM_API_URL ||
    !process.env.HM_API_KEY ||
    !process.env.APPLICATION
  ) {
    console.error("Missing environment variables");
    return;
  }

  const { data } = await axios.post(
    `${process.env.HM_API_URL}hello-moon/idle-games`,
    {
      game: "general-game",
      action: "escrow-details-full",
      data: {
        wallet: walletId,
        application: process.env.APPLICATION,
        tokens: [LOAF_TOKEN_MINT],
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HM_API_KEY}`,
      },
    }
  );

  return {
    loaf: data.data.splBalance[LOAF_TOKEN_MINT],
    sol: data.data.solanaBalance,
  };
};
