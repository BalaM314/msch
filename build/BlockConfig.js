/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/
export var BlockConfigType;
(function (BlockConfigType) {
    BlockConfigType[BlockConfigType["null"] = 0] = "null";
    BlockConfigType[BlockConfigType["int"] = 1] = "int";
    BlockConfigType[BlockConfigType["long"] = 2] = "long";
    BlockConfigType[BlockConfigType["float"] = 3] = "float";
    BlockConfigType[BlockConfigType["string"] = 4] = "string";
    BlockConfigType[BlockConfigType["content"] = 5] = "content";
    BlockConfigType[BlockConfigType["intseq"] = 6] = "intseq";
    BlockConfigType[BlockConfigType["point"] = 7] = "point";
    BlockConfigType[BlockConfigType["pointarray"] = 8] = "pointarray";
    //techNode = 9,
    BlockConfigType[BlockConfigType["boolean"] = 10] = "boolean";
    BlockConfigType[BlockConfigType["double"] = 11] = "double";
    //In mindustry, `building` represents a resolved Building obtained from the World,
    //or, if `box` is true, only the position.
    //msch doesn't have Buildings so we can just read both as a Point2.
    BlockConfigType[BlockConfigType["building"] = 12] = "building";
    /** @deprecated use `BlockConfigType.building` instead, this is wrong */
    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    BlockConfigType[BlockConfigType["buildingbox"] = 12] = "buildingbox";
    //laccess = 13,
    BlockConfigType[BlockConfigType["bytearray"] = 14] = "bytearray";
    // unitcommand_INVALID = 15,
    BlockConfigType[BlockConfigType["booleanarray"] = 16] = "booleanarray";
    /**
     * @deprecated Warning: this means an actual in-game unit (by its id, which is only valid for one game), not a unit type.
     * If you want a unit type, see {@link BlockConfigType.content} with content type {@link ContentType.unit}
     */
    BlockConfigType[BlockConfigType["unit"] = 17] = "unit";
    // vec2array = 18,
    // vec2 = 19,
    // team = 20,
    BlockConfigType[BlockConfigType["intarray"] = 21] = "intarray";
    // objectarray = 22,
    BlockConfigType[BlockConfigType["unitcommand"] = 23] = "unitcommand";
})(BlockConfigType || (BlockConfigType = {}));
;
/**Wrapper for configs that preserves type. For better inference, use `BlockConfig.DU` */
export class BlockConfig {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
/**No config. */
BlockConfig.null = new BlockConfig(BlockConfigType.null, null);
