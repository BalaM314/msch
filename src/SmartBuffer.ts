/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/

import { SmartBuffer as _SmartBuffer } from "smart-buffer";
import { fail } from "./utils.js";

/**Extension of SmartBuffer with extra methods. */
export class SmartBuffer extends _SmartBuffer {
	readNullByte() {
		const byte = this.readUInt8();
		if (byte != 0) fail(`Expected null byte, got ${byte.toString(16)}`);
	}
	readUTF8() {
		const size = this.readUInt16BE();
		return this.readString(size);
	}
	writeUTF8(str: string) {
		this.writeUInt16BE(Buffer.byteLength(str, "utf-8"));
		this.writeString(str);
	}
}