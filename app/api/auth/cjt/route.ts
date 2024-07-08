import { NextApiResponse } from "next";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request, res: NextApiResponse<any>) {
  const { wallet, signature } = await request.json();

  try {
    const { data: response } = await axios.post(
      "https://rest-api.hellomoon.io/v0/auth/create_jwt",
      {
        wallet,
        signature,
        isTransaction: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HM_API_KEY}`,
        },
      }
    );

    cookies().set({
      name: "jwt",
      value: response.jwt,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1, // 1 hour
      path: "/",
    });

    // // Serialize a cookie
    // const serialized = serialize("jwt", response.jwt, {
    //   httpOnly: true,
    //   secure: true,
    //   maxAge: 60 * 60 * 1, // 1 hour
    //   sameSite: "strict",
    //   path: "/",
    // });

    // // Set the cookie in the response header
    // res.setHeader("Set-Cookie", serialized);

    return Response.json({
      error: false,
    });
  } catch (err: any) {
    return Response.json({ error: true });
  }
}

// const handler = async (
//   req: NextApiRequest,
//   res: NextApiResponse<any>
// ): Promise<void> => {
//   const { wallet, signature } = req.body;

//   console.log({ wallet, signature });

//   try {
//     const { data: response } = await axios.post(
//       "https://rest-api.hellomoon.io/v0/auth/create_jwt",
//       {
//         wallet,
//         signature,
//         isTransaction: true,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HM_API_KEY}`,
//         },
//       }
//     );

//     // Serialize a cookie
//     const serialized = serialize("jwt", response.jwt, {
//       httpOnly: true,
//       secure: true,
//       maxAge: 60 * 60 * 1, // 1 hour
//       sameSite: "strict",
//       path: "/",
//     });

//     // Set the cookie in the response header
//     res.setHeader("Set-Cookie", serialized);

//     return res.status(200).json({
//       error: false,
//     });
//   } catch (err: any) {
//     return res.status(400).json({ error: true });
//   }
// };

// export default handler;
