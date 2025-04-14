import { Model } from "../types";
import { MODEL_NAMES } from "../utils/constants";

const ModelSelect = ({
  model,
  setModel,
}: {
  model: Model;
  setModel: (model: Model) => void;
}) => {
  return (
    <select
      value={model}
      onChange={(e) => setModel(e.target.value as Model)}
      className="p-2 border rounded-lg bg-white shadow-sm text-sm"
    >
      {MODEL_NAMES.map((model) => (
        <option key={model} value={model}>
          {model}
        </option>
      ))}
    </select>
  );
};

export default ModelSelect;
