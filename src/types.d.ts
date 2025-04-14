// src/types/types.ts
export type Model =
  | "GPT"
  | "Alpaca"
  | "LLaMA"
  | "BERT"
  | "Vicuna"
  | "OpenAI"
  | "ChatML";

export type TokenizationMode = "word" | "subword";

export interface Token {
  text: string;
  id: number;
  type: "special" | "subword" | "regular";
  bytes: number[];
}

// Optionally export a union type of all models if needed
export const MODEL_NAMES = [
  "GPT",
  "Alpaca",
  "LLaMA",
  "BERT",
  "Vicuna",
  "OpenAI",
  "ChatML",
] as const;

export type ModelName = (typeof MODEL_NAMES)[number];

export interface SpecialTokenMap {
  [modelName: string]: { [token: string]: number };
}
