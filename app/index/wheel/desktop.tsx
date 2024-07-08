import { WheelRewards } from "@/app/type";
import { RefObject } from "react";

const RewardAsset = ({
  angle,
  direction,
  distance,
  imageSrc,
  minWidth,
  rewardText,
}: {
  angle: string;
  distance: string;
  direction: string;
  minWidth: string;
  imageSrc: string;
  rewardText?: string;
}) => {
  return (
    <div
      className="flex absolute-div point wheel-text font-ModeSeven"
      id="asset-wheel"
      style={{
        //@ts-ignore
        "--angle": angle, // angle around wheel
        "--distance": distance, // distance from center
        "--direction": direction, // angle facing from center
        minWidth: minWidth, // min width of the asset
        textAlign: "center", // center the text
      }}
    >
      <div className="flex items-center ">
        <span>{rewardText}</span>
      </div>
    </div>
  );
};

const DesktopWheel = ({
  wheelRef,
  wheelRewards,
}: {
  wheelRef: RefObject<HTMLDivElement>;
  wheelRewards: WheelRewards[];
}) => {
  return (
    <div
      ref={wheelRef}
      className="w-[450px] h-[450px] bg-center bg-cover bg-wheel relative"
    >
      <div className="relative w-full h-full ">
        <RewardAsset
          angle="-20deg"
          direction="315deg"
          distance="115px"
          minWidth="60px"
          imageSrc="prizes/1.svg"
          rewardText={wheelRewards[0].rewardName}
        />
        <RewardAsset
          angle="35deg"
          direction="205deg"
          distance="130px"
          minWidth="60px"
          imageSrc="prizes/2.svg"
          rewardText={wheelRewards[1].rewardName}
        />
        <RewardAsset
          angle="90deg"
          direction="89deg"
          distance="134px"
          minWidth="60px"
          imageSrc="prizes/3.svg"
          rewardText={wheelRewards[2].rewardName}
        />
        <RewardAsset
          angle="145deg"
          direction="335deg"
          distance="135px"
          minWidth="60px"
          imageSrc="prizes/4.svg"
          rewardText={wheelRewards[3].rewardName}
        />
        <RewardAsset
          angle="202deg"
          direction="215deg"
          distance="120px"
          minWidth="60px"
          imageSrc="prizes/5.svg"
          rewardText={wheelRewards[4].rewardName}
        />
        <RewardAsset
          angle="270deg"
          direction="90deg"
          distance="105px"
          minWidth="60px"
          imageSrc="prizes/6.svg"
          rewardText={wheelRewards[5].rewardName}
        />
      </div>
    </div>
  );
};

export default DesktopWheel;
