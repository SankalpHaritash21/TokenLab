import { TokenizationMode } from "../types";

const TokenizationModeToggle = ({
  mode,
  setMode,
}: {
  mode: TokenizationMode;
  setMode: (mode: TokenizationMode) => void;
}) => {
  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
      {(["word", "subword"] as const).map((option) => (
        <button
          key={option}
          onClick={() => setMode(option)}
          className={`px-3 py-1 rounded-md text-sm ${
            mode === option ? "bg-white shadow-sm" : "text-gray-500"
          }`}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
};
export default TokenizationModeToggle;
