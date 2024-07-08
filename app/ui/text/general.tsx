import { twMerge } from "tailwind-merge";

export const TitleText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return <div className={twMerge(className, "")}>{text}</div>;
};
