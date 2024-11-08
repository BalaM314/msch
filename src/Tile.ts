/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/

import { SmartBuffer } from "./SmartBuffer.js";
import { BlockConfig, BlockConfigType } from "./BlockConfig.js";
import * as zlib from "zlib";
import { Rotation, Link } from "./types.js";
import { crash, fail } from "./utils.js";

/**
 * Represents a tile in the schematic.
 */
export class Tile {
	/**The code if this tile, if it is a processor. */
	code?: string[];
	/**The links of this tile, if it is a processor. */
	links?: Link[];
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
		if(this.isProcessor()){
			if(config == undefined || config == BlockConfig.null){
				this.config = BlockConfig.null;
				this.code = [];
			} else if(Array.isArray(config)){
				this.code = config;
				this.config = new BlockConfig(BlockConfigType.bytearray, []);
				this.links = [];
				this.writeConfig();
			} else {
				this.config = config;
				this.code = [];
				this.links = [];
			}
		} else {
			if(Array.isArray(config))
				crash(`Invalid arguments to Tile constructor ([${Array.from(arguments).join(", ")}])`);
			this.config = config ?? BlockConfig.null;
		}
		this.rotation = rotation ?? 0;
	}
	toString() {
		return `${this.name}`;
	}
	isProcessor(){
		return Tile.logicBlocks.includes(this.name);
	}
	/**Decompresses a processor config into links and code. */
	static decompressLogicConfig(config:BlockConfig<BlockConfigType.bytearray>){
		if(config.type != BlockConfigType.bytearray) crash(`Cannot decompress logic config, config type is ${config.type}`);
		let data = new SmartBuffer({
			buff: zlib.inflateSync(Uint8Array.from(config.value))
		});
		let version = data.readInt8();
		if(version != 1) fail(`Unsupported logic code of version ${version}`);
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
	readConfig(){
		if(this.isProcessor()){
			if(this.config.type == BlockConfigType.bytearray)
				({ code:this.code, links:this.links } = Tile.decompressLogicConfig(this.config as BlockConfig<typeof this.config.type>));
			else {
				this.code = [];
				this.links = [];
			}
		}
	}
	/**Compresses links and code for serialization. */
	static compressLogicConfig({links, code}: {
		links: Link[];
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
	writeConfig(){
		if(this.isProcessor()){
			if(!this.links || !this.code) crash("data was never decompressed");
			if(this.config.type == BlockConfigType.bytearray)
				this.config.value = Tile.compressLogicConfig({
					links: this.links,
					code: this.code
				});
		}
	}
	/**Used for displaying config. */
	formatConfig() {
		if(this.isProcessor()){
			return {
				code: this.code,
				links: this.links
			}
		} else {
			return `BlockConfig {[type ${BlockConfigType[this.config.type] ?? this.config.type}] ${typeof this.config.value == "string" ? `"${this.config.value}"` : this.config.value}}`;
		}
	}
	

}