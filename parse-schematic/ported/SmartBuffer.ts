import { SmartBuffer as _SmartBuffer } from "smart-buffer";

/**Extension of SmartBuffer with extra methods. */
export class SmartBuffer extends _SmartBuffer {
	readNullByte() {
		let byte = this.readUInt8();
		if (byte != 0) throw new Error(`Expected null byte, got ${byte.toString(16)}`);
	}
	readUTF8() {
		this.readNullByte();
		let size = this.readUInt8();
		return this.readString(size);
	}
	writeUTF8(str: string) {
		this.writeUInt8(0);
		this.writeUInt8(str.length);
		this.writeString(str);
	}
}