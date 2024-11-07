import { SmartBuffer as _SmartBuffer } from "smart-buffer";
/**Extension of SmartBuffer with extra methods. */
export declare class SmartBuffer extends _SmartBuffer {
    readNullByte(): void;
    readUTF8(): string;
    writeUTF8(str: string): void;
}
