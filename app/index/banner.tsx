import BannerPng from "@/public/loaf/banner.png";
import { WheelRewards } from "../type";

export const getRewardText = (reward: WheelRewards) => {
  if (reward.rewardName === "TRY AGAIN") {
    return "TRY AGAIN";
  } else {
    return `YOU WON ${reward.rewardName}`;
  }
};

export const RewardBanner = ({ reward }: { reward: WheelRewards }) => {
  return (
    <div className="absolute top-[55%] translate-x-[-50%] left-1/2 translate-y-[-50%] z-50 w-[280px] h-[100px]">
      <div className="relative w-full h-full">
        <img src={BannerPng.src} className="w-full h-full" />
        <span className="absolute top-1/2 translate-x-[-50%] left-1/2 translate-y-[-50%]">
          {getRewardText(reward)}
        </span>
      </div>
    </div>
  );
};
