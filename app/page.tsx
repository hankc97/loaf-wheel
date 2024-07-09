"use client";

import { useEffect, useRef, useState } from "react";
import DesktopWheel from "./index/wheel/desktop";
import { toast } from "sonner";
import { WheelRewards } from "./type";
import gsap from "gsap";
import { WHEEL_REWARDS } from "./index/_constants";
import { AuthorizedContainer } from "./ui/auth";
import { spinWheel } from "./lib/apis/wheel";
import { useWallet } from "@solana/wallet-adapter-react";
import Deposit from "./index/deposit";
import ViewRewards from "./index/rewards";
import LoafWheelPng from "@/public/loaf/wheel.png";
import FortuneButtonPng from "@/public/loaf/fortune_btn_browns.png";
import { RewardBanner } from "./index/banner";

export function getRandomNumber() {
  const random = Math.random() * 0.7; // generate a random number between 0 and 0.7
  const rounded = parseFloat(random.toFixed(2)); // round to at most 2 decimal places
  return rounded;
}

export const orderByTrueWheelPosition = (
  wheelRewards: WheelRewards[],
  reward: { rewardName: string; rewardAmount: number; id: string }
) => {
  const realDisplayIndex = 10;

  const slicedArray = wheelRewards.slice(0, realDisplayIndex).reverse();
  // Get the start of the array from 0 to 10
  const startArray = wheelRewards.slice(realDisplayIndex).reverse();
  const newArray = slicedArray.concat(startArray);

  const foundIndex = newArray.findIndex((wheelReward, index) => {
    return wheelReward.id === reward?.id;
  });

  return foundIndex;
};

const SpinButton = ({
  allowWheelSpin,
  spinWheel,
}: {
  allowWheelSpin: boolean;
  spinWheel: () => void;
}) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpinClick = () => {
    if (!isSpinning && allowWheelSpin) {
      setIsSpinning(true);
      spinWheel();
      setTimeout(() => {
        setIsSpinning(false);
      }, 5000); // Assuming the spinning animation lasts for 5 seconds
    } else if (isSpinning) {
      toast.error("Please wait for the wheel to stop spinning...", {
        duration: 1000,
      });
    }
  };

  return (
    <>
      <div
        className="font-ModeSeven cursor-pointer rounded-full hover:opacity-80 relative w-[300px] h-[200px] flex justify-center"
        onClick={handleSpinClick}
      >
        <img
          src={FortuneButtonPng.src}
          className="absolute top-0 left-1/2 translate-x-[-50%] z-10 "
        />
        <span className="text-xl text-white z-50 relative mt-[27px]">
          Spin The Wheel
        </span>
      </div>
    </>
  );
};

export const ResetBufferTime = 2000;

export default function Home() {
  const { publicKey } = useWallet();
  const wheelRef = useRef<HTMLDivElement>(null);
  const [allowWheelSpin, setAllowWheelSpin] = useState<boolean>(true);
  const [isWheelSpinning, setIsWheelSpinning] = useState<boolean>(false);
  const [reward, setReward] = useState<WheelRewards | null>(null);

  const handleSpinWheel = async () => {
    try {
      const reward = await spinWheel({ publicKey: publicKey?.toBase58() });

      setReward(reward);
      setAllowWheelSpin(false);
      setIsWheelSpinning(true);
    } catch (err) {
      toast.error("Error spinning the wheel, please try again...", {
        duration: 5000,
      });
      return;
    }
  };

  const [showResult, setShowResult] = useState<boolean>(false);
  const handleShowResult = async () => {
    setShowResult(true); // Immediately set showResult to true

    // Wait for 4 seconds and then set showResult back to false
    setTimeout(() => {
      setShowResult(false);
    }, ResetBufferTime);
  };
  useEffect(() => {
    if (isWheelSpinning) {
      if (!wheelRef.current || !reward) return;

      const foundIndex = orderByTrueWheelPosition(WHEEL_REWARDS, reward);

      const randomPositionWithinPrizeSection = getRandomNumber();
      const position =
        (foundIndex + randomPositionWithinPrizeSection) * (360 / 6);

      gsap.to(wheelRef.current, {
        rotation: 5000 + position,
        duration: 5,
        opacity: 1,
        ease: "power3.out",
        onComplete: () => {
          setTimeout(() => {
            // Reset the wheel's rotation to its original position
            gsap.set(wheelRef.current, { rotation: 0 });
          }, ResetBufferTime);

          handleShowResult();

          // Reset any other states or properties
          setIsWheelSpinning(false);
          setAllowWheelSpin(true);
        },
      });
    }
  }, [isWheelSpinning]);

  const [modalHelperView, setModalHelperView] = useState<"deposit" | "rewards">(
    "deposit"
  );

  return (
    <AuthorizedContainer>
      <main className="min-h-screen ">
        <div className="relative ">
          <img
            src={LoafWheelPng.src}
            className="absolute  left-1/2 translate-x-[-50%] "
          />
          <div className="md:absolute md:block hidden top-[50px] left-1/2 translate-x-[-52%] z-10">
            <div className="relative w-full h-full">
              {showResult && reward ? <RewardBanner reward={reward} /> : null}
              <DesktopWheel wheelRef={wheelRef} wheelRewards={WHEEL_REWARDS} />
              <div className="absolute right-[-350px] top-1/2 translate-y-[-35%] z-50">
                {modalHelperView === "deposit" ? (
                  <Deposit
                    handleViewPlayers={() => setModalHelperView("rewards")}
                  />
                ) : (
                  <ViewRewards
                    handleViewDeposit={() => setModalHelperView("deposit")}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="md:block hidden">
            <div className="absolute top-[580px] left-1/2 translate-x-[-52%] z-50 flex items-center flex-col ">
              <SpinButton
                allowWheelSpin={allowWheelSpin}
                spinWheel={() => handleSpinWheel()}
              />
            </div>
          </div>
        </div>
      </main>
    </AuthorizedContainer>
  );
}
