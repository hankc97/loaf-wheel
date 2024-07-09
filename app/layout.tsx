"use client";

import "./globals.css";
import "./text.css";
import "./hamburger.css";
import "./css/wheel_desktop.css";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { SessionProvider } from "next-auth/react";
import { CookiesProvider } from "react-cookie";
import Footer from "./ui/footer";
import { Header } from "./ui/header";
import { Toaster } from "sonner";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Toaster as ReactHotToast } from "react-hot-toast";

require("@solana/wallet-adapter-react-ui/styles.css");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  const endpoint =
    process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl("devnet");

  return (
    <html lang="en" className="">
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <body className={``}>
                <Toaster richColors position="bottom-center" />
                <ReactHotToast
                  position="bottom-center"
                  toastOptions={{
                    style: {
                      backgroundColor: "#334155",
                      color: "#f9fafb",
                      minWidth: "250px",
                      wordBreak: "break-all",
                    },
                  }}
                />
                <Header />
                {children}
                <Footer />
              </body>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </CookiesProvider>
    </html>
  );
}
