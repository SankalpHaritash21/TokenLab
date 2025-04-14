import { Tooltip } from "react-tooltip";
import { Token } from "../types";

const TokenTooltipContent = ({ token }: { token: Token }) => (
  <div className="text-xs space-y-1">
    <div>
      <strong>Text:</strong> {token.text}
    </div>
    <div>
      <strong>ID:</strong> #{token.id}
    </div>
    <div>
      <strong>Bytes:</strong> [{token.bytes.join(", ")}]
    </div>
    <div>
      <strong>Length:</strong> {token.bytes.length} bytes
    </div>
  </div>
);

const TokenVisualization = ({ tokens }: { tokens: Token[] }) => {
  const getTokenColor = (token: Token) => {
    switch (token.type) {
      case "special":
        return "bg-purple-100 border-purple-300";
      case "subword":
        return "bg-yellow-100 border-yellow-300";
      default:
        return "bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500">
        <span className="col-span-6">Token</span>
        <span className="col-span-3">ID</span>
        <span className="col-span-3">Bytes</span>
      </div>

      {tokens.map((token, i) => (
        <div
          key={i}
          className={`${getTokenColor(
            token
          )} p-2 rounded border grid grid-cols-12 gap-2 items-center text-sm`}
          data-tooltip-id={`token-${i}`}
        >
          <span
            className="col-span-6 font-mono truncate"
            dangerouslySetInnerHTML={{ __html: token.text }}
          />
          <span className="col-span-3">#{token.id}</span>
          <span className="col-span-3 font-mono">
            [{token.bytes.slice(0, 3).join(",")}...]
          </span>

          <Tooltip
            id={`token-${i}`}
            place="top"
            render={() => <TokenTooltipContent token={token} />}
            className="!bg-white !text-gray-700 !shadow-lg !border !rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};

export default TokenVisualization;
