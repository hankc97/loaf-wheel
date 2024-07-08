import { TitleText } from "@/app/ui/text/general";
import { RandomAvatar } from "react-random-avatars";
import ArrowRightSvg from "@/public/arrow-right.svg";
import { WheelRewards } from "../type";
import { useLoafWheelRewards } from "../hooks/useWheel";

const Reward = ({ reward }: { reward: WheelRewards }) => {
  return (
    <div className="bg-fluff-blue-550 rounded-lg px-2 py-3 flex flex-row gap-x-2 items-center  font-sans">
      <div className="w-[40px] h-[40px] flex items-center">
        <RandomAvatar name={reward.id} size={40} />
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-col">
          <span className="text-fluff-black-350 text-sm">
            {reward.rewardName}
          </span>
        </div>
        <div className="font-[700] text-sm">
          {(reward.odds || 0).toFixed(2) + "%"}
        </div>
      </div>
    </div>
  );
};

const ViewRewards = ({
  handleViewDeposit,
}: {
  handleViewDeposit: () => void;
}) => {
  const { data: wheelRewards } = useLoafWheelRewards();

  return (
    <div className="relative bg-[#ffe6b9] w-[300px] h-[400px] border-[10px] border-[#8b4513] border-solid rounded-lg">
      <div className="absolute w-full h-full z-50 font-[700] font-sans">
        <TitleText
          text={`${wheelRewards ? wheelRewards.length : 0} Rewards`}
          className="border-0 border-b border-b-[#d0a08e] p-4"
        />
        <div className="p-4 space-y-2 h-[280px] overflow-y-auto">
          {wheelRewards &&
            wheelRewards.map((reward: any) => <Reward reward={reward} />)}
        </div>
        <div
          onClick={handleViewDeposit}
          className="flex flex-row items-center absolute bottom-[12px] right-[12px] hover:text-black cursor-pointer text-gray-500"
        >
          <div className="text-sm font-[500] mr-2 font-sans  ">
            View Deposit
          </div>
          <ArrowRightSvg className="w-[25px] h-[25px]" />
        </div>
      </div>
    </div>
  );
};

export default ViewRewards;
