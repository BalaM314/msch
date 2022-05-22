import { SmartBuffer } from "../ported/SmartBuffer.js";
import { Point2 } from "../ported/Point2.js";
import { Config } from "./Config.js";
import * as zlib from "zlib";

export class Tile {
	x: number;
	y: number;
	static logicBlocks: string[] = ["micro-processor", "logic-processor", "hyper-processor"];
	constructor(public name: string, position: number, public config: Config, public rotation: number) {
		this.x = Point2.x(position);
		this.y = Point2.y(position);
	}
	toString() {
		return `${this.name}`;
	}
	isProcessor(){
		return Tile.logicBlocks.includes(this.name);
	}
	decompressLogicCode(){
		if(!this.isProcessor) return null;
		let data = new SmartBuffer({
			buff: zlib.inflateSync(Uint8Array.from(this.config.value as number[]))
		});
		let version = data.readInt8();
		if(version != 1) throw new Error(`Unsupported logic code of version ${version}`);
		let length = data.readInt32BE();
		return data.readBuffer(length).toString();
		

	}
}