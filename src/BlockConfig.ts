/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/

import { Point2 } from "./Point2.js";
import { ContentType, UnitCommand } from "./types.js";

export enum BlockConfigType {
	null = 0,
	int = 1,
	long = 2,
	float = 3,
	string = 4,
	content = 5,
	intseq = 6,
	point = 7,
	pointarray = 8,
	//techNode = 9,
	boolean = 10,
	double = 11,
	//In mindustry, `building` represents a resolved Building obtained from the World,
	//or, if `box` is true, only the position.
	//msch doesn't have Buildings so we can just read both as a Point2.
	building = 12,
	/** @deprecated use `BlockConfigType.building` instead, this is wrong */
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	buildingbox = 12,
	//laccess = 13,
	bytearray = 14,
	// unitcommand_INVALID = 15,
	booleanarray = 16,
	/**
	 * @deprecated Warning: this means an actual in-game unit (by its id, which is only valid for one game), not a unit type.
	 * If you want a unit type, see {@link BlockConfigType.content} with content type {@link ContentType.unit}
	 */
	unit = 17,
	// vec2array = 18,
	// vec2 = 19,
	// team = 20,
	intarray = 21,
	// objectarray = 22,
	unitcommand = 23,
};

export type BlockConfigMapping = {
	[BlockConfigType.null]: null;
	[BlockConfigType.int]: number;
	[BlockConfigType.long]: bigint;
	[BlockConfigType.float]: number;
	[BlockConfigType.string]: string | null; //for some reason String can be null, but no other one can
	[BlockConfigType.content]: readonly [type: ContentType, id: number];
	[BlockConfigType.intseq]: number[];
	[BlockConfigType.point]: Point2;
	[BlockConfigType.pointarray]: Point2[];
	[BlockConfigType.boolean]: boolean;
	[BlockConfigType.double]: number;
	[BlockConfigType.building]: Point2;
	[BlockConfigType.bytearray]: number[];
	[BlockConfigType.booleanarray]: boolean[];
	[BlockConfigType.unit]: number;
	[BlockConfigType.intarray]: number[];
	[BlockConfigType.unitcommand]: UnitCommand;
};
export type BlockConfigValue = BlockConfigMapping[BlockConfigType];

/**Wrapper for configs that preserves type. For better inference, use `BlockConfig.DU` */
export class BlockConfig<Type extends BlockConfigType = BlockConfigType> {
	/**No config. */
	static null = new BlockConfig(BlockConfigType.null, null);
	constructor(public type: Type, public value: BlockConfigMapping[Type]) {}
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BlockConfig {
	/** BlockConfig as a discriminated union for better type inference. */
	export type DU = BlockConfigType extends infer T extends BlockConfigType ? T extends unknown ? BlockConfig<T> : never : never;
}
