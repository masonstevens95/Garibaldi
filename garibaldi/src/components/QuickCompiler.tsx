/*
QuickCompiler
*/

import React, { useState } from "react";
import { BinaryLexer, type Token } from "../utils/BinaryLexer";
import { classifierParser } from "../utils/ClassifierParser";

// QuickCompiler Component
interface Props {}

export const QuickCompiler = ({}: Props) => {
  const [tokens, setTokens] = useState<Token[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const lexer = new BinaryLexer(buffer);

      const parsedTokens: Token[] = [];
      let token: Token;
      let limit = 0;

      while (
        (token = lexer.getNextToken()).type !== "END_OF_FILE" &&
        limit++ < 50
      ) {
        parsedTokens.push(token);
      }

      setTokens(parsedTokens);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 text-neutral-100">
      <h2 className="text-xl font-bold mb-2">Upload Vic 3 Save File</h2>
      <input
        type="file"
        accept=".v3,.sav,.bin"
        onChange={handleFileChange}
        className="mb-4"
      />

      {/* {tokens.length > 0 && (
        <div className="bg-neutral-900 p-4 rounded-md max-h-96 overflow-y-auto text-sm">
          {tokens.map((token, idx) => (
            <pre key={idx} className="whitespace-pre-wrap">
              {JSON.stringify(token, null, 2)}
            </pre>
          ))}
        </div>
      )} */}

      {tokens.length > 0 && (
        <div className="bg-neutral-900 p-4 rounded-md max-h-96 overflow-y-auto text-sm flex flex-wrap">
          {tokens.map((token, idx) => classifierParser(token, idx))}
        </div>
      )}
    </div>
  );
};
