import { SmartBuffer } from "../ported/SmartBuffer.js";
import { BlockConfig } from "./BlockConfig.js";
import * as zlib from "zlib";
import { BlockConfigType, Rotation } from "../types.js";

/**
 * Represents a tile in the schematic.
 */
export class Tile {
	/**The code if this tile, if it is a processor. */
	code?: string[];
	/**The links of this tile, if it is a processor. */
	links?: {
		name: string;
		x: number;
		y: number;
	}[];
	/**The config of this tile. */
	config: BlockConfig;
	/**The rotation of this tile. */
	rotation: Rotation;
	/**All block ids that have logic code. */
	static logicBlocks: string[] = ["micro-processor", "logic-processor", "hyper-processor", "world-processor"];
	/**Current logic version. */
	static logicVersion: number = 1;
	constructor(name: string, x: number, y: number, code: string[]);
	constructor(name: string, x: number, y: number, config?: BlockConfig, rotation?: Rotation);

	constructor(public name:string, public x:number, public y:number, config?: BlockConfig|string[], rotation?:Rotation) {
		if(config instanceof BlockConfig || config == undefined){
			this.config = (config as BlockConfig) ?? BlockConfig.null;
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
	/**Decompresses a processor config into links and code. */
	static decompressLogicConfig(config:BlockConfig){
		let data = new SmartBuffer({
			buff: zlib.inflateSync(Uint8Array.from(config.value as number[]))
		});
		let version = data.readInt8();
		if(version != 1) throw new Error(`Unsupported logic code of version ${version}`);
		let length = data.readInt32BE();
		let code = data.readBuffer(length).toString().split(/\r?\n/g);
		
		let numLinks = data.readInt32BE();
		let links = [];
		for(let i = 0; i < numLinks; i ++){
			links.push({
				name: data.readUTF8(),
				x: data.readInt16BE(),
				y: data.readInt16BE()
			});
		}
		return { code, links };
	}
	decompressLogicConfig(){
		if(!this.isProcessor()) throw new Error("not a processor");
		let { code, links } = Tile.decompressLogicConfig(this.config);
		this.code = code;
		this.links = links;
	}
	/**Compresses links and code for serialization. */
	static compressLogicConfig({links, code}: {
		links: {
			name: string;
			x: number;
			y: number;
		}[];
		code: string[];
	}){
		let output = new SmartBuffer();
		output.writeInt8(Tile.logicVersion);

		let outputCode = Buffer.from(code.join("\n"));
		output.writeInt32BE(outputCode.length);
		output.writeBuffer(outputCode);

		output.writeInt32BE(links.length);
		for(let link of links){
			output.writeUTF8(link.name);
			output.writeInt16BE(link.x);
			output.writeInt16BE(link.y);
		}

		let compressedData = zlib.deflateSync(output.toBuffer());
		return Array.from(compressedData);
	}
	compressLogicConfig(){
		if(!this.isProcessor()) throw new Error("not a processor");
		if(!this.links || !this.code) throw new Error("data was never decompressed");
		return Tile.compressLogicConfig({
			links: this.links,
			code: this.code
		});
	}
	/**Used for displaying config. */
	formatConfig() {
		if(this.isProcessor()){
			return {
				code: this.code,
			}
		} else {
			return this.config;
		}
	}
	

}