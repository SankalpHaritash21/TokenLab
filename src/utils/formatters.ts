import { Model } from "../types";

export const formatForModel = (model: Model, input: string): string => {
  const formatters: Record<Model, (input: string) => string> = {
    GPT: () => `<|startoftext|>${input}<|endoftext|>`,
    Alpaca: () => `[INST] ${input} [/INST]`,
    LLaMA: () => `<s>[INST] ${input} [/INST]`,
    BERT: () => `[CLS] ${input} [SEP]`,
    Vicuna: () => `USER: ${input}\nASSISTANT: `,
    OpenAI: () => `<|im_start|>user\n${input}<|im_end|>\n<|im_start|>assistant`,
    ChatML: () =>
      `<|im_start|>system\nYou are a helpful assistant<|im_end|>\n<|im_start|>user\n${input}<|im_end|>\n<|im_start|>assistant`,
  };
  return formatters[model](input);
};
