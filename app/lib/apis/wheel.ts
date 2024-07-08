"use server";

import axios from "axios";
import { cookies } from "next/headers";

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
      action: "spin-wheel-gcr",
      data: {
        wallet: publicKey,
        jwt: jwt.value,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HM_API_KEY}`,
      },
    }
  );

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

  console.log({ data });

  return data;
};
