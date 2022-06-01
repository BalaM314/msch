import { SmartBuffer } from "../ported/SmartBuffer.js";
import { Tile } from "../classes/Tile.js";
import { TypeIO } from "../ported/TypeIO.js";
import { Point2 } from "../ported/Point2.js";
import * as zlib from "zlib";
import { BlockConfigType } from "../types.js";

export class Schematic {
	static headerBytes: number[] = ['m', 's', 'c', 'h'].map(char => char.charCodeAt(0));
	/**Tiles arranged in a grid. */
	tiles: (Tile | null)[][] = [];
	constructor(
		public height: number,
		public width: number,
		public version: number,
		public tags: {
			[name: string]: string;
		},
		public labels: string[],
		tiles: Tile[]
	) {
		this.tiles = Schematic.sortTiles(tiles, width, height);
		this.loadConfigs();
	}

	static from(inputData: Buffer) {
		let rawData = new SmartBuffer({
			buff: inputData
		});
		for (let char of Schematic.headerBytes) {
			if (rawData.readUInt8() != char) {
				throw new Error("Data is not a schematic.");
			}
		}
		let version = rawData.readInt8();
		let data = new SmartBuffer({
			buff: zlib.inflateSync(inputData.slice(5))
		});
		let [width, height] = [data.readUInt16BE(), data.readUInt16BE()];
		if (width > 128 || height > 128) throw new Error("Schematic is too large.");
		
		let tagcount = data.readUInt8();
		let tags: typeof Schematic.prototype.tags = {};
		try {
			for (let i = 0; i < tagcount; i++) {
				tags[data.readUTF8()] = data.readUTF8();
			}
		} catch(err){
			console.error("Debug information:", tags);
			throw err;
		}
		let labels: string[] = [];
		try {
			labels = JSON.parse(tags["labels"]);
		} catch (err) {
			console.warn("Failed to parse labels.");
		}

		let numBlocks = data.readUInt8();
		let blocks: Map<number, string> = new Map();
		for (let i = 0; i < numBlocks; i++) {
			blocks.set(i, data.readUTF8());
		}
		
		let numTiles = data.readInt32BE();
		let tiles: ReturnType<typeof Schematic.unsortTiles> = [];
		if (numTiles > width * height) throw new Error("Schematic contains too many tiles.");
		for (let i = 0; i < numTiles; i++) {
			let id = data.readInt8();
			let block = blocks.get(id)!;
			let position = data.readInt32BE();
			let config = TypeIO.readObject(data);
			let rotation = data.readInt8();
			if (block && block != "air") tiles.push(new Tile(block, ...Point2.unpack(position), config, rotation));
		}
		return new Schematic(height, width, version, tags, labels, tiles);
	}

	loadConfigs(){
		for(let column of this.tiles){
			for(let tile of column){
				if(tile?.isProcessor()){
					tile.decompressLogicConfig();
				}
			}
		}
	}

	saveConfigs(){
		for(let column of this.tiles){
			for(let tile of column){
				if(tile?.isProcessor()){
					tile.compressLogicConfig();
				}
			}
		}
	}
	
	write(): SmartBuffer {
		this.saveConfigs();
		let output = new SmartBuffer();
		for (let char of Schematic.headerBytes) {
			output.writeUInt8(char);
		}
		output.writeUInt8(this.version);
		let compressableData = new SmartBuffer();
		compressableData.writeUInt16BE(this.width);
		compressableData.writeUInt16BE(this.height);

		
		compressableData.writeUInt8(Object.entries(this.tags).length);
		for(let [key, value] of Object.entries(this.tags)){
			compressableData.writeUTF8(key);
			compressableData.writeUTF8(value);
		}

		let unsortedTiles = Schematic.unsortTiles(this.tiles);
		let blocks = Schematic.getBlockMap(unsortedTiles);

		compressableData.writeUInt8(blocks.size);
		for (let name of blocks.values()) {
			compressableData.writeUTF8(name);
		}

		compressableData.writeInt32BE(unsortedTiles.length);
		for (let tile of unsortedTiles) {
			compressableData.writeUInt8(Array.from(blocks.values()).indexOf(tile.name));
			compressableData.writeInt32BE(Point2.pack(tile.x, tile.y));
			TypeIO.writeObject(compressableData, tile.config);
			compressableData.writeUInt8(tile.rotation);
		}

		let compressedData = zlib.deflateSync(compressableData.toBuffer());
		output.writeBuffer(compressedData);

		return output;
	}
	static getBlockMap(unsortedTiles: Tile[]) {
		let blockMap = new Set<string>();
		unsortedTiles.forEach(tile => blockMap.add(tile.name));
		return blockMap;
	}


	static sortTiles(tiles: Tile[], width: number, height: number): (Tile | null)[][] {
		let sortedTiles = new Array<Tile[]>(width).fill([]).map(() => new Array<Tile|null>(height).fill(null));
		for (let tile of tiles) {
			sortedTiles[tile.x][tile.y] = tile;
		}
		return sortedTiles;
	}
	static unsortTiles(tiles: (Tile | null)[][]): Tile[] {
		let unsortedTiles: Tile[] = [];
		for (let column of tiles) {
			for (let tile of column) {
				if (tile != null)
					unsortedTiles.push(tile);
			}
		}
		return unsortedTiles;
	}

	display() {
		let rotatedTiles:string[][] = new Array<string[]>(this.width).fill([]).map(() => new Array<string>(this.height + 1).fill(''));
		this.tiles.forEach((row, y) => {
			row.forEach((tile, x) => {
				rotatedTiles[this.width - 1 - x]["y" as any] = x as any;//haha any go brrrrr i am totally going to regret this
				rotatedTiles[this.width - 1 - x][y] = tile ? tile.toString() : ""
			});
		});
		rotatedTiles = rotatedTiles.filter(row => row["y" as any] != null);
		console.log(`Size: ${this.width}x${this.height}`);
		console.log("Tiles:");
		console.table(rotatedTiles);
		console.log("Tags:");
		console.log(this.tags);
		console.log("Configs:");
		Schematic.unsortTiles(this.tiles).forEach(tile =>
			tile.config.type == BlockConfigType.null ? 0 : console.log(tile.name, tile.x, tile.y, tile.formatConfig())
		);
	}


	getTileAt(x: number, y: number): Tile | null {
		return this.tiles[x][y];
	}
	setTileAt(x: number, y: number, tile: Tile) {
		this.tiles[x][y] = tile;
	}
}