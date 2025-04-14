// src/pages/index.tsx
import { useState, useEffect, useCallback } from "react";

import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { Model, Token, TokenizationMode } from "./types";
import { formatForModel } from "./utils/formatters";
import { tokenizeWithMode } from "./utils/tokenizers";
import ModelSelect from "./components/ModelSelect";
import TokenizationModeToggle from "./components/TokenizationModeToggle";
import TokenVisualization from "./components/TokenVisualization";

export default function Home() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<Model>("GPT");
  const [mode, setMode] = useState<TokenizationMode>("word");
  const [formatted, setFormatted] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);

  // Memoized tokenization handler
  const handleTokenization = useCallback(() => {
    const formattedText = formatForModel(model, input);
    setFormatted(formattedText);
    setTokens(tokenizeWithMode(formattedText, model, mode));
  }, [input, model, mode]);

  useEffect(() => {
    const debounceTimer = setTimeout(handleTokenization, 300);
    return () => clearTimeout(debounceTimer);
  }, [handleTokenization]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">TokenLab</h1>
          <p className="text-gray-600">Visual LLM Tokenization Playground</p>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <ModelSelect model={model} setModel={setModel} />
          <TokenizationModeToggle mode={mode} setMode={setMode} />
          <div className="text-sm text-gray-600">
            Tokens: {tokens.length} (Mode: {mode})
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to tokenize..."
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 h-32 bg-white"
              maxLength={1000}
            />

            <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
              <SyntaxHighlighter
                language="json"
                style={atomOneDark}
                customStyle={{ padding: "1rem", minHeight: "200px" }}
              >
                {formatted || "// Formatted input will appear here"}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <TokenVisualization tokens={tokens} />
          </div>
        </div>
      </div>
    </div>
  );
}
