import { SmartBuffer } from "../ported/SmartBuffer.js";
import { Point2 } from "../ported/Point2.js";
import { BlockConfig } from "./BlockConfig.js";
import * as zlib from "zlib";
import { toHexCodes } from "../funcs.js";

export class Tile {
	x: number;
	y: number;
	static logicBlocks: string[] = ["micro-processor", "logic-processor", "hyper-processor"];
	static logicVersion: number = 1;
	code?: string[];
	links?: {
		name: string;
		x: number;
		y: number;
	}[];
	constructor(public name: string, position: number, public config: BlockConfig, public rotation: number) {
		this.x = Point2.x(position);
		this.y = Point2.y(position);
	}
	toString() {
		return `${this.name}`;
	}
	isProcessor(){
		return Tile.logicBlocks.includes(this.name);
	}
	decompressLogicConfig(){
		if(!this.isProcessor()) throw new Error("not a processor");
		console.debug("Decompressing code: ", toHexCodes(Buffer.from(this.config.value as number[])).join(" "));
		let data = new SmartBuffer({
			buff: zlib.inflateSync(Uint8Array.from(this.config.value as number[]))
		});
		console.debug("Decompressed code: ", toHexCodes(data.toBuffer()).join(" "));
		let version = data.readInt8();
		if(version != 1) throw new Error(`Unsupported logic code of version ${version}`);
		let length = data.readInt32BE();
		this.code = data.readBuffer(length).toString().split(/\r?\n/g);
		
		let numLinks = data.readInt32BE();
		this.links ??= [];
		for(let i = 0; i < numLinks; i ++){
			this.links.push({
				name: data.readUTF8(),
				x: data.readInt16BE(),
				y: data.readInt16BE()
			});
		}
	}
	compressLogicConfig(){
		if(!this.isProcessor()) throw new Error("not a processor");
		if(!this.links || !this.code) throw new Error("Data not decompressed");
		let output = new SmartBuffer();
		output.writeInt8(Tile.logicVersion);

		let outputCode = Buffer.from(this.code.join("\n"));
		output.writeInt32BE(outputCode.length);
		output.writeBuffer(outputCode);

		output.writeInt32BE(this.links.length);
		for(let link of this.links){
			output.writeUTF8(link.name);
			output.writeInt16BE(link.x);
			output.writeInt16BE(link.y);
		}

		console.debug("Precompressed code: ", toHexCodes(output.toBuffer()).join(" "));
		let compressedData = zlib.deflateSync(output.toBuffer());
		console.debug("Compressed code: ", toHexCodes(compressedData).join(" "));
		this.config.value = Array.from(compressedData);
	}
	

}