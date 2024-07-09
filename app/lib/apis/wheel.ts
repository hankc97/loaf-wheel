"use server";

import axios from "axios";
import base58 from "bs58";
import { cookies } from "next/headers";
import { VersionedTransaction, Connection } from "@solana/web3.js";
import { TransactionsService } from "../service/transactions/general-transaction";

export const spinWheel = async ({ publicKey }: { publicKey?: string }) => {
  const cookieStore = cookies();
  const jwt = cookieStore.get("jwt");
  if (!jwt) {
    return Response.json({ error: true });
  }

  const { data } = await axios.post(
    `${process.env.HM_API_URL!}/hello-moon/idle-games`,
    {
      game: "general-coinflip-game",
      action: "spin-wheel-token-loaf",
      data: {
        wallet: publicKey,
        jwt: jwt.value,
        gameName: process.env.APPLICATION,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HM_API_KEY}`,
      },
    }
  );

  console.log({ data });
  const versionedTxn = VersionedTransaction.deserialize(
    base58.decode(data.signedTxn)
  );

  const TransactionService = new TransactionsService("single");
  const txnRes = await TransactionService.sendTxn(versionedTxn);

  console.log({ txnRes });

  const connection = new Connection(process.env.RPC_CONNECTION!);
  const confirmed = await connection.confirmTransaction(
    txnRes.transactionId,
    "single"
  );

  console.log({ confirmed });

  return data;
};

export const getWheelRewards = async () => {
  const { data } = await axios.get(
    `${process.env.HM_API_URL!}/loaf/wheel/get-rewards-meta`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HM_API_KEY}`,
      },
    }
  );

  return data;
};
