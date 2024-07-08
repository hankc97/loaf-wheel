import InputBox from "@/app/ui/input/general";
import { TitleText } from "@/app/ui/text/general";
import { useState } from "react";
// import SolanaSvg from "@/public/solana.svg";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import ButtonWithLoader from "@/app/ui/button/withLoader";
import { Transaction } from "@solana/web3.js";
import base58 from "bs58";
import ArrowRightSvg from "@/public/arrow-right.svg";
import { useGetLoafBalance } from "../hooks/useBalance";

const Deposit = ({ handleViewPlayers }: { handleViewPlayers: () => void }) => {
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [depositAmountFluffy, setDepositAmountFluffy] = useState<string>("");
  const wallet = useWallet();
  const { publicKey, signTransaction } = wallet;

  const { data: loafBalance, mutate: loafBalanceMutate } = useGetLoafBalance({
    wallet: publicKey,
  });

  const handleDeposit = async () => {
    // if (!depositAmount && !depositAmountFluffy) {
    //   toast.error("Please enter a valid amount");
    //   return;
    // }
    // if (!publicKey) {
    //   toast.error("Please connect your wallet");
    //   return;
    // }
    // try {
    //   const encodedTxn = await buildDepositFundsTxn(
    //     publicKey!.toBase58(),
    //     parseFloat(depositAmount),
    //     parseInt(depositAmountFluffy)
    //   );
    //   const transaction = Transaction.from(Buffer.from(encodedTxn, "base64"));
    //   const signedTransaction = await signTransaction!(transaction);
    //   const encodedSerializedTxn = base58.encode(signedTransaction.serialize());
    //   await signDepositFundsTxn(encodedSerializedTxn);
    // } catch (e: any) {
    //   toast.error(e.message);
    //   return;
    // }
    // toast.success("Deposit successful");
    // playerDetailsMutate();
    // solBalanceMutate();
    // reset();
  };

  return (
    <div className="relative bg-[#ffe6b9] w-[300px] h-[400px] border-[10px] border-[#8b4513] border-solid rounded-lg">
      <div className="absolute w-full h-full z-50 font-[700] font-sans">
        <div className="border-0 border-b border-b-[#d0a08e] p-4 flex flex-row items-center justify-between font-sans">
          <TitleText text="Deposit" />
          <TitleText
            text={`LOAF: ${(loafBalance || 0).toFixed(4) || "0"}`}
            className="text-gcr-black-350 font-[400] text-sm"
          />
        </div>
        <div className="px-4 pt-4 ">
          {/* <div className="w-full text-center  text-black">Round: {round}</div> */}
          {/* <div className="mb-4 text-center w-full text-gray-500 text-xxs font-[400]">
            Total Bets: 0 SOL
          </div> */}
          <div>
            <div className="flex flex-row items-center gap-x-2 mb-2 ">
              {/* <SolanaSvg className="h-[25px] w-[25px]" /> */}
              <TitleText text="Deposit Loaf" className="font-[600] text-sm " />
            </div>
            <InputBox setInput={setDepositAmount} />
          </div>

          <ButtonWithLoader
            buttonText="Deposit"
            onClick={handleDeposit}
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
