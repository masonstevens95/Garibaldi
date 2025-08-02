import { vic3Dict } from "../dict/vic3Dict";
import type { Token } from "./BinaryLexer";

export const classifierParser = (token: Token, idx: number) => {
  switch (token.type) {
    case "IDENTIFIER": {
      let display = token.value;

      if (typeof token.value === "number") {
        const label = vic3Dict.get(token.value);
        display = label ?? `UNKNOWN (${token.value})`;
      }

      return (
        <span key={idx} className="text-neutral-200">
          {display + " "}
        </span>
      );
    }

    case "OPEN_BRACE":
      return (
        <span key={idx} className="text-green-400">
          {"{ "}
        </span>
      );

    case "CLOSE_BRACE":
      return (
        <span key={idx} className="text-red-400">
          {"} "}
        </span>
      );

    case "EQUAL":
      return (
        <span key={idx} className="text-yellow-300">
          {"= "}
        </span>
      );

    default:
      return null;
  }
};
