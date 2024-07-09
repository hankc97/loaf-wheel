import { toast } from "react-hot-toast";
import SolscanSvg from "@/public/solscan.svg";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export const ellipseBookend = (value?: string, size = 4) => {
  if (!value) {
    return "";
  }
  if (value.length <= size * 2) {
    return value;
  }
  return `${value.slice(0, size)}..${value.slice(-size)}`;
};

export const showToastWithSolLink = ({
  text,
  signature,
  duration,
  isDevnet = false,
}: {
  text: string;
  signature: string;
  duration?: number;
  isDevnet?: boolean;
}) => {
  toast(
    (t) => (
      <div>
        <Link
          href={`https://solscan.io/tx/${signature}${
            isDevnet ? "?cluster=devnet" : ""
          }`}
          target="_blank"
          title="Transaction on Solscan"
          rel="noreferrer"
          className="flex flex-col items-center space-y-2"
        >
          <div className="text-super-green-300 text-lg">{text}</div>
          <div className="flex flex-row items-center space-x-2">
            <SolscanSvg className="w-6 h-6" />
            <div className={twMerge("text-super-white-100 text-lg")}>
              {ellipseBookend(signature, 4)}
            </div>
          </div>
        </Link>
      </div>
    ),
    {
      // Styling and positioning options
      duration: duration ?? 10_000,
    }
  );
};
