import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export const PUBLIC_KEY_LOCALSTORAGE_KEY = "pubk" as const;

export const LoafConnectButton = () => {
  const { connected, publicKey } = useWallet();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connected && publicKey != null) {
      const wallet_id = publicKey.toString();
      localStorage.setItem(PUBLIC_KEY_LOCALSTORAGE_KEY, wallet_id);
      sessionStorage.setItem(PUBLIC_KEY_LOCALSTORAGE_KEY, wallet_id);
    } else {
      localStorage.setItem(PUBLIC_KEY_LOCALSTORAGE_KEY, "");
      sessionStorage.setItem(PUBLIC_KEY_LOCALSTORAGE_KEY, "");
    }
  }, [publicKey, connected]);

  // Don't render wallet button modal if we're not on the client, because it prevent hydration errors
  if (!mounted) return null;

  return (
    <div className="">
      <div
        className={`
        [&_.wallet-adapter-button-start-icon]:hidden
        [&_.wallet-adapter-button-trigger]:lg:w-[173px]
        [&_.wallet-adapter-button-trigger]:lg:h-[48px]
        [&_.wallet-adapter-button-trigger]:lg:text-[16px]

        [&_.wallet-adapter-button-trigger]:md:w-[180px]
        [&_.wallet-adapter-button-trigger]:md:h-[40px]
        [&_.wallet-adapter-button-trigger]:md:text-[18px]

        [&_.wallet-adapter-button-trigger]:sm:w-[120px]
        [&_.wallet-adapter-button-trigger]:sm:h-[30px]
        [&_.wallet-adapter-button-trigger]:sm:text-[16px]

        [&_.wallet-adapter-button-trigger]:xs:w-[100px]
        [&_.wallet-adapter-button-trigger]:xs:h-[25px]
        [&_.wallet-adapter-button-trigger]:xs:text-[12px]

        [&_.wallet-adapter-button-trigger]:justify-center
        [&_.wallet-adapter-button-trigger]:bg-loaf-brown-100
        [&_.wallet-adapter-button-trigger]:text-loaf-white-100
        [&_.wallet-adapter-button-trigger]:rounded-[45px]
      `}
      >
        {connected ? (
          <WalletMultiButton className="" />
        ) : (
          <WalletMultiButton className="">Connect</WalletMultiButton>
        )}
      </div>
    </div>
  );
};
