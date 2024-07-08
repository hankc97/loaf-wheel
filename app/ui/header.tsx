import { monaExtraLight } from "@/app/fonts/fonts";
import DiscordSVG from "@/public/discord.svg";
import XSVG from "@/public/x.svg";
import TelegramSvg from "@/public/telegram.svg";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoafConnectButton } from "./solana/connect";
import LoafGif from "@/public/loaf/loaf.gif";

interface TabWithLinkProps {
  currentPathName: string;
  matchedPathName: string;
  tabText: string;
  // if link should open in a new tab
  target?: string;
  handleUnToggle?: () => void;
}

const TabWithLink = ({
  currentPathName,
  matchedPathName,
  tabText,
  target,
  handleUnToggle,
}: TabWithLinkProps) => {
  return (
    <Link
      href={`${matchedPathName}`}
      passHref
      target={target}
      className={` whitespace-nowrap ${
        currentPathName === matchedPathName ? "animated-text" : "text-white-0"
      }`}
      onClick={handleUnToggle}
    >
      {tabText}
    </Link>
  );
};

export const Header = () => {
  const pathName = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleToggleSidebar = () => {
    let bars = document.querySelectorAll(".bar");

    bars.forEach((bar) => bar.classList.toggle("x"));

    setSidebarOpen(!sidebarOpen);
  };

  const handleUnToggleSidebar = () => {
    let bars = document.querySelectorAll(".bar");

    bars.forEach((bar) => bar.classList.remove("x"));

    setSidebarOpen(!sidebarOpen);
  };

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (document.getElementById("trigger") === null) return;

    const triggerPoint = document.getElementById("trigger")!.offsetTop;
    if (window.pageYOffset >= triggerPoint) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <header className="flex items-center p-4 m-4 rounded-full space-x-8 relative z-50">
      <img src={LoafGif.src} alt="GCR" className="h-12" />
      <nav
        className={twMerge(
          "flex justify-between w-full items-center ",
          monaExtraLight.className
        )}
      >
        <ul className="lg:flex space-x-8 hidden">
          {/* <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li> */}
        </ul>
        <div className="flex items-center justify-between">
          <div className="lg:flex items-center space-x-6 hidden lg:mr-[24px] ">
            <Link
              href="https://x.com/LoafCatHQ"
              target="_blank"
              title="X"
              rel="noreferrer"
            >
              <XSVG className="h-6 w-6 text-loaf-brown-100 hover:opacity-80" />
            </Link>
            <Link
              href="https://t.me/loafcat_sol"
              target="_blank"
              title="Telegram"
              rel="noreferrer"
            >
              <TelegramSvg className="h-6 w-6 text-loaf-brown-100 hover:opacity-80" />
            </Link>
          </div>
          <LoafConnectButton />
        </div>
        <a
          className="z-50 lg:hidden nav-toggle flex"
          onClick={handleToggleSidebar}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </a>
        {/* Sidebar */}
        <div
          className={`lg:hidden sidebar ${
            sidebarOpen ? "open" : ""
          } flex justify-center pt-40 h-screen `}
        >
          <ul className="[&>a]:text-[20px] [&>a]:mb-5 flex flex-col items-center">
            <TabWithLink
              currentPathName={pathName}
              matchedPathName="/"
              tabText="Home"
              handleUnToggle={handleUnToggleSidebar}
            />
            {/* <TabWithLink
              currentPathName={pathName}
              matchedPathName="/leaderboard"
              tabText="Leaderboard"
              handleUnToggle={handleUnToggleSidebar}
            />
            <TabWithLink
              currentPathName={pathName}
              matchedPathName="/dashboard"
              tabText="Dashboard"
              handleUnToggle={handleUnToggleSidebar}
            />
            <TabWithLink
              currentPathName={pathName}
              matchedPathName="/rewards"
              tabText="Rewards"
              handleUnToggle={handleUnToggleSidebar} */}
            {/* /> */}
          </ul>
        </div>
      </nav>
    </header>
  );
};
