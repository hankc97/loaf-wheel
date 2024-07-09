import InputBox from "@/app/ui/input/general";
import { TitleText } from "@/app/ui/text/general";
import { useEffect, useState } from "react";
import LoafGif from "@/public/loaf/loaf.gif";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import ButtonWithLoader from "@/app/ui/button/withLoader";
import { Transaction, VersionedTransaction } from "@solana/web3.js";
import ArrowRightSvg from "@/public/arrow-right.svg";
import { useGetLoafBalance } from "../hooks/useBalance";
import SolanaSvg from "@/public/solana.svg";
import { LOAF_TOKEN, SOL_TOKEN } from "./_constants";
import axios from "axios";
import base58 from "bs58";
import { sendAndConfirmTransaction } from "../lib/apis/sc";
import { showToastWithSolLink } from "../ui/toast/withSolLink";

const ToggleType = ({
  toggleType,
  setToggleType,
}: {
  toggleType: "deposit" | "withdraw";
  setToggleType: (type: "deposit" | "withdraw") => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-center gap-x-2 border-loaf-brown-200 border rounded-xl py-1 px-1">
      <div
        className={`text-sm font-[400] ${
          toggleType === "deposit"
            ? "bg-loaf-brown-200 text-white"
            : "text-gray-500"
        }  p-1  rounded-lg cursor-pointer`}
        onClick={() => setToggleType("deposit")}
      >
        Deposit
      </div>
      <div
        className={`text-sm font-[400] ${
          toggleType === "withdraw"
            ? "bg-loaf-brown-200 text-white"
            : "text-gray-500"
        }  p-1  rounded-lg cursor-pointer `}
        onClick={() => setToggleType("withdraw")}
      >
        Withdraw
      </div>
    </div>
  );
};

const LAMPORTS_TO_SOL = 10 ** 9;

const Deposit = ({ handleViewPlayers }: { handleViewPlayers: () => void }) => {
  const [solAmount, setSolAmount] = useState<string>("");
  const [loafAmount, setLoafAmount] = useState<string>("");
  const wallet = useWallet();
  const { publicKey, signTransaction } = wallet;

  const { data: loafBalance, mutate: loafBalanceMutate } = useGetLoafBalance({
    wallet: publicKey,
  });

  const [type, setType] = useState<"deposit" | "withdraw">("deposit");

  // RESET INPUTS ON TYPE CHANGE
  useEffect(() => {
    setSolAmount("");
    setLoafAmount("");
  }, [type]);

  const handleWithdraw = async () => {
    if (!solAmount && !loafAmount) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    const depositAmounts = [];
    const depositTokenTypes = [];

    if (solAmount) {
      depositAmounts.push(parseFloat(solAmount) * LAMPORTS_TO_SOL);
      depositTokenTypes.push(SOL_TOKEN);
    }

    if (loafAmount) {
      depositAmounts.push(parseFloat(loafAmount) * Math.pow(10, 6));
      depositTokenTypes.push(LOAF_TOKEN);
    }

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_HM_API_URL}hello-moon/idle-games`,
        {
          game: "general-game",
          action: "withdraw-escrow-multi",
          data: {
            wallet: wallet?.publicKey?.toBase58(),
            amounts: depositAmounts,
            application: process.env.NEXT_PUBLIC_APPLICATION,
            tokens: depositTokenTypes,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HM_API_KEY}`,
          },
        }
      );

      const recoveredTransaction = Transaction.from(
        Buffer.from(data.data, "base64")
      );
      const signedTxn = await signTransaction!(recoveredTransaction);
      const serializedTxn = base58.encode(signedTxn.serialize());

      const txnSig = await sendAndConfirmTransaction(serializedTxn);

      showToastWithSolLink({
        text: "Withdraw successful",
        signature: txnSig,
        duration: 5000,
      });

      loafBalanceMutate();
    } catch (error) {
      toast.error("error depositing, please try again...");
    }
  };

  const handleDeposit = async () => {
    if (!solAmount && !loafAmount) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    const depositAmounts = [];
    const depositTokenTypes = [];

    if (solAmount) {
      depositAmounts.push(parseFloat(solAmount) * LAMPORTS_TO_SOL);
      depositTokenTypes.push(SOL_TOKEN);
    }

    if (loafAmount) {
      depositAmounts.push(parseFloat(loafAmount) * Math.pow(10, 6));
      depositTokenTypes.push(LOAF_TOKEN);
    }

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_HM_API_URL}hello-moon/idle-games`,
        {
          game: "general-game",
          action: "withdraw-escrow-multi",
          data: {
            wallet: wallet?.publicKey?.toBase58(),
            amounts: depositAmounts,
            application: process.env.NEXT_PUBLIC_APPLICATION,
            tokens: depositTokenTypes,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HM_API_KEY}`,
          },
        }
      );

      const recoveredTransaction = Transaction.from(
        Buffer.from(data.data, "base64")
      );
      const signedTxn = await signTransaction!(recoveredTransaction);
      const serializedTxn = base58.encode(signedTxn.serialize());

      const txnSig = await sendAndConfirmTransaction(serializedTxn);

      showToastWithSolLink({
        text: "Deposit successful",
        signature: txnSig,
        duration: 5000,
      });

      loafBalanceMutate();
    } catch (error) {
      toast.error("error depositing, please try again...");
    }
  };

  return (
    <div className="relative bg-[#ffe6b9] w-[320px] h-[400px] border-[10px] border-loaf-brown-200 border-solid rounded-lg">
      <div className="absolute w-full h-full z-50 font-[700] font-sans">
        <div className="border-0 border-b border-b-[#d0a08e] p-4 flex flex-row items-center justify-between font-sans">
          <ToggleType setToggleType={setType} toggleType={type} />
          <div>
            <TitleText
              text={`LOAF: ${(loafBalance?.loaf || 0).toFixed(4) || "0"}`}
              className="text-loaf-black-350 font-[400]  text-xxs"
            />
            <TitleText
              text={`SOL: ${(loafBalance?.sol || 0).toFixed(6) || "0"}`}
              className="text-loaf-black-350 font-[400]  text-xxs"
            />
          </div>
        </div>
        <div className="px-4 pt-4 ">
          {/* <div className="w-full text-center  text-black">Round: {round}</div> */}
          {/* <div className="mb-4 text-center w-full text-gray-500 text-xxs font-[400]">
            Total Bets: 0 SOL
          </div> */}
          <div className="mb-2">
            <div className="flex flex-row items-center gap-x-2 mb-2 ">
              <img src={LoafGif.src} className="w-[25px] h-[25px]" />
              <TitleText
                text={`${type === "deposit" ? "Deposit" : "Withdraw"} Loaf`}
                className="font-[600] text-sm "
              />
            </div>
            <InputBox setInput={setLoafAmount} />
          </div>
          <div>
            <div className="flex flex-row items-center gap-x-2 mb-2 ">
              <SolanaSvg className="h-[25px] w-[25px]" />
              <TitleText
                text={`${type === "deposit" ? "Deposit" : "Withdraw"} Sol`}
                className="font-[600] text-sm "
              />
            </div>
            <InputBox setInput={setSolAmount} />
          </div>

          <ButtonWithLoader
            buttonText={type === "deposit" ? "Deposit" : "Withdraw"}
            onClick={type === "deposit" ? handleDeposit : handleWithdraw}
            loaderSize={100}
          />

          <div
            onClick={handleViewPlayers}
            className="flex flex-row items-center absolute bottom-[12px] right-[12px] hover:text-black cursor-pointer text-gray-500"
          >
            <div className="text-sm font-[500] mr-2 font-sans  ">
              View Rewards
            </div>
            <ArrowRightSvg className="w-[25px] h-[25px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
