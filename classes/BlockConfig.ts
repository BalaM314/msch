import { Point2 } from "../ported/Point2.js";
import { BlockConfigType, BlockConfigValue } from "../types.js";

/**Wrapper for configs that preserves type. */
export class BlockConfig {
	/**No config. */
	static null = new BlockConfig(BlockConfigType.null, null);
	constructor(type:BlockConfigType.null, value:null | null);
	constructor(type:BlockConfigType.int, value:number | null);
	constructor(type:BlockConfigType.long, value:bigint | null);
	constructor(type:BlockConfigType.float, value:number | null);
	constructor(type:BlockConfigType.string, value:string | null);
	constructor(type:BlockConfigType.content, value:[type: number, id: number] | null);
	constructor(type:BlockConfigType.intarray, value:number[] | null);
	constructor(type:BlockConfigType.point, value:Point2 | null);
	constructor(type:BlockConfigType.pointarray, value:Point2[] | null);
	constructor(type:BlockConfigType.boolean, value:boolean | null);
	constructor(type:BlockConfigType.double, value:number | null);
	constructor(type:BlockConfigType.building, value:[type: number, id: number] | null);
	constructor(type:BlockConfigType.buildingbox, value:Point2);
	constructor(type:BlockConfigType.bytearray, value:number[] | null);
	constructor(type:BlockConfigType.booleanarray, value:boolean[] | null);
	constructor(type:BlockConfigType.unit, value:number | null);
	constructor(public type: BlockConfigType, public value: BlockConfigValue) {}
}