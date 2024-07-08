import { Dispatch, SetStateAction } from "react";

const InputBox = ({
  setInput,
}: {
  setInput: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <input
      type="text"
      className="w-full rounded-lg bg-white py-1.5 px-3 text-sm/6 font-semibold text-black shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
      onChange={(e) => setInput(e.target.value)}
    />
  );
};

export default InputBox;
