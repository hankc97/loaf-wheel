import useSWR from "swr";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getLoafBalance } from "../lib/apis/balance";

export const useGetLoafBalance = ({ wallet }: { wallet: PublicKey | null }) => {
  const { data, error, mutate } = useSWR(
    wallet ? [`useGetLoafBalance`, wallet] : null,
    async () => {
      return getLoafBalance(wallet!.toBase58());
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 30_000,
    }
  );

  return {
    data,
    error,
    mutate,
    isLoading: !data && !error,
  };
};

export const useGetSolanaBalance = ({
  wallet,
}: {
  wallet: PublicKey | null;
}) => {
  const { data, error, mutate } = useSWR(
    wallet ? [`useGetSolanaBalance`, wallet] : null,
    async () => {
      const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT!);

      const solBalance = await connection.getBalance(wallet!);

      return (solBalance / LAMPORTS_PER_SOL).toFixed(2);
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 10_000,
    }
  );

  return {
    data,
    error,
    mutate,
    isLoading: !data && !error,
  };
};
