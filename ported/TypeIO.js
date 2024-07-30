/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/
import { BlockConfigType } from "../types.js";
import { BlockConfig } from "../classes/BlockConfig.js";
import { Point2 } from "./Point2.js";
/**This class is cursed. Not my fault, blame Anuke. */
export class TypeIO {
    /**Removed one layer of abstraction
     * Only works with BlockConfigs instead of Objects.
     * This was nescessary because in Java you can see if null was meant to be a string, but not in JS.*/
    static readObject(buf) {
        let type = buf.readUInt8();
        switch (type) {
            case BlockConfigType.null:
                return new BlockConfig(type, null);
            case BlockConfigType.int:
                return new BlockConfig(type, buf.readInt32BE());
            case BlockConfigType.long:
                return new BlockConfig(type, buf.readBigInt64BE());
            case BlockConfigType.float:
                return new BlockConfig(type, buf.readFloatBE());
            case BlockConfigType.string:
                let exists = buf.readInt8();
                if (exists != 0) {
                    return new BlockConfig(type, buf.readUTF8());
                }
                else {
                    return new BlockConfig(type, null);
                }
            case BlockConfigType.content:
                return new BlockConfig(type, [buf.readInt8(), buf.readInt16BE()]);
            case BlockConfigType.intarray:
                let numbers = [];
                let numInts = buf.readInt16BE();
                for (let i = 0; i < numInts; i++) {
                    numbers.push(buf.readInt32BE());
                }
                return new BlockConfig(type, numbers);
            case BlockConfigType.point:
                return new BlockConfig(type, new Point2(buf.readInt32BE(), buf.readInt32BE()));
            case BlockConfigType.pointarray:
                let points = [];
                let numPoints = buf.readInt8();
                for (let i = 0; i < numPoints; i++) {
                    points.push(Point2.from(buf.readInt32BE()));
                }
                return new BlockConfig(type, points);
            case BlockConfigType.boolean:
                return new BlockConfig(type, !!buf.readUInt8());
            case BlockConfigType.double:
                return new BlockConfig(type, buf.readDoubleBE());
            case BlockConfigType.building:
            case BlockConfigType.buildingbox:
                //Should technically be a BuildingBox, but thats equivalent to a Point2 for this program.
                return new BlockConfig(type, Point2.from(buf.readInt32BE()));
            case BlockConfigType.bytearray:
                let numBytes = buf.readInt32BE();
                let bytes = [];
                for (let i = 0; i < numBytes; i++) {
                    bytes.push(buf.readUInt8());
                }
                return new BlockConfig(type, bytes);
            default:
                throw new Error(`Unknown or not implemented object type (${type}) for a tile.`);
        }
    }
    static writeObject(buf, object) {
        buf.writeUInt8(object.type);
        switch (object.type) {
            case BlockConfigType.null:
                break;
            case BlockConfigType.int:
                buf.writeUInt32BE(object.value);
                break;
            case BlockConfigType.long:
                buf.writeBigInt64BE(object.value);
                break;
            case BlockConfigType.float:
                buf.writeFloatBE(object.value);
                break;
            case BlockConfigType.string:
                if (object.value) {
                    buf.writeUInt8(1);
                    buf.writeUTF8(object.value);
                }
                else {
                    buf.writeUInt8(0);
                }
                break;
            case BlockConfigType.content:
                buf.writeUInt8(object.value[0]);
                buf.writeInt16BE(object.value[1]);
                break;
            case BlockConfigType.intarray:
                buf.writeInt16BE(object.value.length);
                for (let number of object.value) {
                    buf.writeInt32BE(number);
                }
                break;
            case BlockConfigType.point:
                buf.writeInt32BE(object.value.x);
                buf.writeInt32BE(object.value.y);
                break;
            case BlockConfigType.pointarray:
                buf.writeInt16BE(object.value.length);
                for (let point of object.value) {
                    buf.writeInt32BE(point.pack());
                }
                break;
            case BlockConfigType.boolean:
                buf.writeUInt8(object.value);
                break;
            case BlockConfigType.bytearray:
                buf.writeInt32BE(object.value.length);
                for (let byte of object.value) {
                    buf.writeUInt8(byte);
                }
                break;
            //TODO implement the rest of them.
            default:
                throw new Error(`Unknown or not implemented object type (${object.type}) for a tile.`);
        }
    }
}
