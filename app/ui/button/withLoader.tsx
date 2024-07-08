import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";

const ButtonWithLoader = ({
  buttonText,
  onClick,
  loaderColor = "#ffffff",
  loaderSize = 35,
  className,
}: {
  buttonText: string;
  onClick: () => Promise<void>;
  loaderColor?: string;
  loaderSize?: number;
  className?: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    // setLoading(true);
    await onClick();
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className={twMerge(
          "bg-loaf-brown-100 text-white w-full p-2 rounded-lg mt-4 relative flex items-center justify-center"
        )}
        onClick={handleClick}
        disabled={loading}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ClipLoader
              color={loaderColor}
              loading={loading}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
        <span
          className={`transition-opacity ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        >
          {buttonText}
        </span>
      </button>
    </div>
  );
};

export default ButtonWithLoader;
