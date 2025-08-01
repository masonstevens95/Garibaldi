type Token =
  | { type: "OPEN_BRACE" }
  | { type: "CLOSE_BRACE" }
  | { type: "EQUAL" }
  | { type: "IDENTIFIER"; value: string | number | boolean }
  | { type: "END_OF_FILE" };

class BinaryLexer {
  private view: DataView;
  private offset: number = 0;
  private length: number;

  constructor(arrayBuffer: ArrayBuffer) {
    this.view = new DataView(arrayBuffer);
    this.length = arrayBuffer.byteLength;
  }

  private readUint16(): number {
    const val = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return val;
  }

  private readInt32(): number {
    const val = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return val;
  }

  private readInt64(): bigint {
    const val = this.view.getBigInt64(this.offset, true);
    this.offset += 8;
    return val;
  }

  private readBool(): boolean {
    const val = this.view.getUint8(this.offset);
    this.offset += 1;
    return Boolean(val);
  }

  private readString(): string {
    const length = this.readUint16();
    const bytes = new Uint8Array(this.view.buffer, this.offset, length);
    this.offset += length;
    let str = new TextDecoder().decode(bytes);
    return str.endsWith("\n") ? str.slice(0, -1) : str;
  }

  getNextToken(): Token {
    if (this.offset >= this.length) {
      return { type: "END_OF_FILE" };
    }

    const code = this.readUint16();

    switch (code) {
      case 3:
        return { type: "OPEN_BRACE" };
      case 4:
        return { type: "CLOSE_BRACE" };
      case 1:
        return { type: "EQUAL" };
      case 12:
      case 20: {
        const val = this.readInt32();
        return { type: "IDENTIFIER", value: val };
      }
      case 13: {
        const val = this.readInt32() / 1000;
        return { type: "IDENTIFIER", value: val };
      }
      case 14: {
        const val = this.readBool();
        return { type: "IDENTIFIER", value: val };
      }
      case 15:
      case 23: {
        const val = this.readString();
        return { type: "IDENTIFIER", value: val };
      }
      case 359:
      case 668: {
        const val = this.readInt64();
        return {
          type: "IDENTIFIER",
          value: Number(val) / 100000.0,
        };
      }
      default:
        return { type: "IDENTIFIER", value: code };
    }
  }
}
