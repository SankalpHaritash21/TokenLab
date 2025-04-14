import { SpecialTokenMap } from "../types";

export const MODEL_NAMES = [
  "GPT",
  "Alpaca",
  "LLaMA",
  "BERT",
  "Vicuna",
  "OpenAI",
  "ChatML",
] as const;

export const SPECIAL_TOKENS: SpecialTokenMap = {
  GPT: { "<|startoftext|>": 100, "<|endoftext|>": 101 },
  Alpaca: { "[INST]": 200, "[/INST]": 201 },
  LLaMA: { "<s>": 300, "</s>": 301 },
  BERT: { "[CLS]": 400, "[SEP]": 401 },
  Vicuna: { "USER:": 500, "ASSISTANT:": 501 },
  OpenAI: { "<|im_start|>": 600, "<|im_end|>": 601 },
  ChatML: { "<|im_start|>": 700, "<|im_end|>": 701 },
};

export const WORD_REGEX = /(\p{L}+[\p{L}\p{M}\p{N}_'-]*)|([^\p{L}\s]+)/gu;
export const SUBWORD_REGEX = /(\s+|<\||\|>|\[|\]|[\p{L}\p{N}]+|.)/gu;
