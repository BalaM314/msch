import { SmartBuffer as _SmartBuffer } from "smart-buffer";

/**Extension of SmartBuffer with extra methods. */
export class SmartBuffer extends _SmartBuffer {
	readNullByte() {
		let byte = this.readUInt8();
		if (byte != 0) throw new Error(`Expected null byte, got ${byte.toString(16)}`);
	}
	readUTF8() {
		let size = this.readUInt16BE();
		return this.readString(size);
	}
	writeUTF8(str: string) {
		this.writeUInt16BE(str.length);
		this.writeString(str);
	}
}