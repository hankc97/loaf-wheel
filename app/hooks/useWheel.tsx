import useSWR from "swr";
import { getWheelRewards } from "../lib/apis/wheel";

export const useLoafWheelRewards = () => {
  const { data, error, mutate } = useSWR(
    [`useLoafWheelRewards`],
    async () => {
      return getWheelRewards();
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
