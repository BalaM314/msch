import { SmartBuffer } from "../ported/SmartBuffer.js";
import { Point2 } from "../ported/Point2.js";
import { BlockConfig } from "./BlockConfig.js";
import * as zlib from "zlib";
import { BlockConfigType } from "../types.js";

export class Tile {
	code?: string[];
	links?: {
		name: string;
		x: number;
		y: number;
	}[];
	config: BlockConfig;
	rotation: number;
	static logicBlocks: string[] = ["micro-processor", "logic-processor", "hyper-processor", "world-processor"];
	static logicVersion: number = 1;
	constructor(name: string, x: number, y: number, code: string[]);
	constructor(name: string, x: number, y: number, config?: BlockConfig, rotation?: number);

	constructor(public name:string, public x:number, public y:number, config?: BlockConfig|string[], rotation?:number) {
		if(config instanceof BlockConfig || config == undefined){
			this.config = config ?? BlockConfig.null;
			this.rotation = rotation ?? 0;
		} else if(config instanceof Array && (typeof config[0] == "undefined" || typeof config[0] == "string")){
			if(!this.isProcessor()) throw new Error("not a processor");
			this.code = config;
			this.config = new BlockConfig(BlockConfigType.bytearray, []);
			this.links = [];
			this.rotation = 0;
			this.compressLogicConfig();
		} else {
			throw new TypeError(`Invalid arguments to Tile constructor ([${Array.from(arguments).join(", ")}])`)
		}
	}
	toString() {
		return `${this.name}`;
	}
	isProcessor(){
		return Tile.logicBlocks.includes(this.name);
	}
	decompressLogicConfig(){
		if(!this.isProcessor()) throw new Error("not a processor");
		let data = new SmartBuffer({
			buff: zlib.inflateSync(Uint8Array.from(this.config.value as number[]))
		});
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

		let compressedData = zlib.deflateSync(output.toBuffer());
		this.config.value = Array.from(compressedData);
	}
	formatConfig(): any {
		if(this.isProcessor()){
			return {
				code: this.code,
			}
		} else {
			return this.config;
		}
	}
	

}