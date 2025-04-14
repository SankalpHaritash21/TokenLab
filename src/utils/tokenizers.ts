import DOMPurify from "dompurify";
import { SPECIAL_TOKENS, SUBWORD_REGEX, WORD_REGEX } from "./constants";
import { Model, Token, TokenizationMode } from "../types";
import { hashString, sanitizeToken } from "./helper";

// Unicode-aware regex patterns

// Model-specific formatting rules
const MODEL_FORMATTERS: Record<Model, (input: string) => string> = {
  GPT: (input) => `<|startoftext|>${input}<|endoftext|>`,
  Alpaca: (input) => `[INST] ${input} [/INST]`,
  LLaMA: (input) => `<s>[INST] ${input} [/INST]`,
  BERT: (input) => `[CLS] ${input} [SEP]`,
  Vicuna: (input) => `USER: ${input}\nASSISTANT: `,
  OpenAI: (input) =>
    `<|im_start|>user\n${input}<|im_end|>\n<|im_start|>assistant`,
  ChatML: (input) =>
    `<|im_start|>system\nYou are a helpful assistant<|im_end|>\n` +
    `<|im_start|>user\n${input}<|im_end|>\n<|im_start|>assistant`,
};

export function formatForModel(model: Model, input: string): string {
  const rawFormatted = MODEL_FORMATTERS[model](input);
  return DOMPurify.sanitize(rawFormatted, { ALLOWED_TAGS: [] });
}

export function tokenizeWithMode(
  text: string,
  model: Model,
  mode: TokenizationMode
): Token[] {
  try {
    const regex = mode === "word" ? WORD_REGEX : SUBWORD_REGEX;
    const tokens = (text.match(regex) || [])
      .filter((t) => t?.trim().length > 0)
      .map((t) => t.trim());

    return tokens.map((token): Token => {
      const isSpecial = Object.keys(SPECIAL_TOKENS[model]).includes(token);
      const cleanToken = sanitizeToken(token);
      const bytes = Array.from(new TextEncoder().encode(cleanToken));

      return {
        text: cleanToken,
        id: isSpecial ? SPECIAL_TOKENS[model][token] : hashString(cleanToken),
        type: isSpecial
          ? "special"
          : mode === "subword"
          ? "subword"
          : "regular",
        bytes,
      };
    });
  } catch (error) {
    console.error("Tokenization error:", error);
    return [];
  }
}
