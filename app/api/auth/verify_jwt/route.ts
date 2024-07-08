import { NextApiResponse } from "next";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(request: Request, res: NextApiResponse<any>) {
  const cookieStore = cookies();
  const jwt = cookieStore.get("jwt");
  if (!jwt) {
    return Response.json({ error: true });
  }

  const { wallet } = await request.json();

  try {
    const { data: response } = await axios.post(
      "https://rest-api.hellomoon.io/v0/" + "auth/verify_jwt_with_wallet",
      {
        jwt: jwt.value,
        wallet,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HM_API_KEY}`,
        },
      }
    );

    if (!response.error) {
      return Response.json({
        error: false,
      });
    } else {
      return Response.json({ error: true });
    }
  } catch (err: any) {
    Response.json({ error: true });
  }
}
