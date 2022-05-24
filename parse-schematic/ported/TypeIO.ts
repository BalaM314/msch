import { SmartBuffer } from "./SmartBuffer.js";
import { BlockConfigType } from "../types.js";
import { BlockConfig } from "../classes/BlockConfig.js";
import { Point2 } from "./Point2.js";

/**This class is cursed. Not my fault, blame Anuke. */
export class TypeIO {
	/**Removed one layer of abstraction
	 * Only works with BlockConfigs instead of Objects.
	 * This was nescessary because in Java you can see if null was meant to be a string, but not in JS.*/
	static readObject(buf: SmartBuffer):BlockConfig {
		let type = buf.readInt8();
		switch (type) {
			case 0:
				return new BlockConfig(BlockConfigType.null, null);
			case 1:
				return new BlockConfig(BlockConfigType.int, buf.readInt32BE());
			case 2:
				return new BlockConfig(BlockConfigType.long, buf.readBigInt64BE());
			case 3:
				return new BlockConfig(BlockConfigType.float, buf.readFloatBE());
			case 4:
				let exists = buf.readInt8();
				if (exists != 0) {
					return new BlockConfig(BlockConfigType.string, buf.readUTF8());
				} else {
					return new BlockConfig(BlockConfigType.string, null);
				}
			case 5:
				//TODO return this in a correct format;
				return new BlockConfig(BlockConfigType.content, [buf.readInt8(), buf.readInt16BE()]);
			case 6:
				let numbers:number[] = [];
				for(let i = 0; i < buf.readInt16BE(); i ++){
					numbers.push(buf.readInt32BE());
				}
				return new BlockConfig(BlockConfigType.content, numbers);
			case 7:
				return new BlockConfig(BlockConfigType.point, new Point2(buf.readInt32BE(), buf.readInt32BE()));
			case 8:
				let points:Point2[] = [];
				for(let i = 0; i < buf.readInt8(); i ++){
					points.push(Point2.from(buf.readInt32BE()));
				}
				return new BlockConfig(BlockConfigType.pointarray, points);
			case 10:
				return new BlockConfig(BlockConfigType.boolean, !! buf.readUInt8());
			case 11:
				return new BlockConfig(BlockConfigType.double, !! buf.readDoubleBE());
			case 12:
				//Should technically be a BuildingBox, but thats equivalent to a Point2 for this program.
				return new BlockConfig(BlockConfigType.buildingbox, Point2.from(buf.readInt32BE()));
			case 14:
				let numBytes = buf.readInt32BE();
				let bytes:number[] = [];
				for(let i = 0; i < numBytes; i ++){
					bytes.push(buf.readUInt8());
				}
				return new BlockConfig(BlockConfigType.bytearray, bytes);
			default:
				throw new Error(`Unknown or not implemented object type (${type}) for a tile.`);
		}
	}

	static writeObject(buf: SmartBuffer, object: BlockConfig) {
		buf.writeUInt8(object.type);
		switch (object.type) {
			case BlockConfigType.null:
				break;
			case BlockConfigType.int:
				buf.writeUInt32BE(object.value as number);
				break;
			case BlockConfigType.long:
				buf.writeBigInt64BE(object.value as bigint);
				break;
			case BlockConfigType.float:
				buf.writeFloatBE(object.value as number);
				break;
			case BlockConfigType.string:
				if (object.value) {
					buf.writeUInt8(1);
					buf.writeUTF8(object.value as string);
				} else {
					buf.writeUInt8(0);
				}
				break;
			case BlockConfigType.content:
				buf.writeUInt8((object.value as [type: number, id: number])[0]);
				buf.writeInt16BE((object.value as [type: number, id: number])[1]);
				break;
			case BlockConfigType.intarray:
				buf.writeInt16BE((object.value as number[]).length);
				for (let number of (object.value as number[])) {
					buf.writeInt32BE(number);
				}
				break;
			case BlockConfigType.point:
				buf.writeInt32BE((object.value as Point2).x);
				buf.writeInt32BE((object.value as Point2).y);
				break;
			case BlockConfigType.pointarray:
				buf.writeInt16BE((object.value as Point2[]).length);
				for (let point of (object.value as Point2[])) {
					buf.writeInt32BE(point.pack());
				}
				break;
			case BlockConfigType.bytearray:
				buf.writeInt32BE((object.value as number[]).length);
				for (let byte of (object.value as number[])) {
					buf.writeUInt8(byte);
				}
				break;
			//TODO implement the rest of them.
			default:
				throw new Error(`Unknown or not implemented object type (${object.type}) for a tile.`);
		}
	}
}