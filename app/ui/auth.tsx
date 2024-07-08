import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PropsWithChildren, ReactElement, useEffect, useState } from "react";
import base58 from "bs58";
import axios from "axios";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { LoafConnectButton } from "./solana/connect";

const ConnectYourWalletComponent = ({
  ConnectButton,
}: {
  ConnectButton: JSX.Element;
}) => {
  return (
    <div className="mb-4 w-96 text-hmio-black-100 flex items-center flex-col">
      <h2 className="flex flex-col mb-10 text-center font-[500] text-lg text-white font-sans">
        <span>
          By confirming your wallet you will not need to sign a transaction per
          play!
        </span>
      </h2>
      <span className="text-sm text-white mb-1">No Fees Included</span>
      <div className="multi-wallet-button-auth">{ConnectButton}</div>
    </div>
  );
};

const SignInButton = ({ signInWithJwt }: { signInWithJwt: any }) => (
  <button
    className="justify-center bg-gcr-clay-100 text-black rounded-[45px] py-4 px-2 text-[16px] bg-black-0 font-[700]"
    onClick={() => {
      signInWithJwt();
    }}
  >
    Approve Your Wallet On Chain
  </button>
);

export interface AuthorizedContainerProps {}

export const AuthorizedContainer = ({
  children,
}: PropsWithChildren<AuthorizedContainerProps>): ReactElement => {
  const { connection } = useConnection();
  const { publicKey, signMessage, signTransaction } = useWallet();
  const [trigger, setTrigger] = useState(false);
  const [hasJwt, setHasJwt] = useState(false);

  const buildAuthTx = async (
    timestamp_in_sec: string
  ): Promise<Transaction> => {
    const tx = new Transaction();
    const recentBlockhash = await connection.getRecentBlockhash();
    tx.recentBlockhash = recentBlockhash.blockhash;
    tx.feePayer = publicKey!;

    tx.add(
      new TransactionInstruction({
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        keys: [],
        data: Buffer.from(timestamp_in_sec, "utf8"),
      })
    );
    return tx;
  };

  const handleOwnershipLedger = async () => {
    try {
      const authTx = buildAuthTx(Math.floor(Date.now() / 1000).toString());
      const signedTx = await signTransaction!(await authTx);

      if (signedTx) {
        const { data: error } = await axios.post("/api/auth/cjt", {
          wallet: publicKey?.toBase58(),
          signature: base58.encode(signedTx.serialize()),
        });

        if (!error.error) {
          setTrigger((prev) => !prev);
          setHasJwt(true);
        }
      }
    } catch (error) {}
  };

  const verifyJwt = async () => {
    try {
      const { data: res } = await axios.post("/api/auth/verify_jwt", {
        wallet: publicKey?.toBase58(),
      });

      if (res.error) {
        handleOwnershipLedger();
      } else {
        setHasJwt(true);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (!publicKey || !signMessage) {
      return;
    }

    verifyJwt();
  }, [publicKey]);

  if (publicKey && hasJwt) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen ">
      {!publicKey ? (
        <ConnectYourWalletComponent ConnectButton={<LoafConnectButton />} />
      ) : (
        <ConnectYourWalletComponent
          ConnectButton={<SignInButton signInWithJwt={handleOwnershipLedger} />}
        />
      )}
    </div>
  );
};
