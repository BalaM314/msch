import { SmartBuffer } from "../ported/SmartBuffer.js";
import { Tile } from "../classes/Tile.js";
import { TypeIO } from "../ported/TypeIO.js";
import { Point2 } from "../ported/Point2.js";
import * as zlib from "zlib";

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
		console.log(`Version: ${version}`);
		let data = new SmartBuffer({
			buff: zlib.inflateSync(inputData.slice(5))
		});
		console.log(Array.from(data.toBuffer()).map(el => ('00' + el.toString(16).toUpperCase()).slice(-2)).join(" "));
		let [width, height] = [data.readUInt16BE(), data.readUInt16BE()];
		if (width > 128 || height > 128) throw new Error("Schematic is too large.");
		console.log(`Size: ${width}x${height}`);

		let tagcount = data.readUInt8();
		let tags: typeof Schematic.prototype.tags = {};
		console.log(`${tagcount} tags.`);
		for (let i = 0; i < tagcount; i++) {
			tags[data.readUTF8()] = data.readUTF8();
		}
		console.log(`Tags: `, tags);
		let labels: string[] = [];
		try {
			labels = JSON.parse(tags["labels"]);
		} catch (err) {
			console.warn("Failed to parse labels.");
		}

		let numBlocks = data.readUInt8();
		console.log(`${numBlocks} blocks.`);
		let blocks: Map<number, string> = new Map();
		for (let i = 0; i < numBlocks; i++) {
			blocks.set(i, data.readUTF8());
		}
		console.log(`Blocks: [${Object.values(blocks).join(", ")}]`);

		let numTiles = data.readInt32BE();
		let tiles: ReturnType<typeof Schematic.unsortTiles> = [];
		console.log(`${numTiles} tiles.`);
		if (numTiles > width * height) throw new Error("Schematic contains too many tiles.");
		for (let i = 0; i < numTiles; i++) {
			let id = data.readInt8();
			let block = blocks.get(id)!;
			let position = data.readInt32BE();
			let config = TypeIO.readObject(data);
			let rotation = data.readInt8();
			if (block && block != "air") tiles.push(new Tile(block, position, config, rotation));
		}
		return new Schematic(height, width, version, tags, labels, tiles);
	}

	write(): SmartBuffer {
		let output = new SmartBuffer();
		for (let char of Schematic.headerBytes) {
			output.writeUInt8(char);
		}
		output.writeUInt8(this.version);
		let compressableData = new SmartBuffer();
		compressableData.writeUInt16BE(this.width);
		compressableData.writeUInt16BE(this.height);

		//TODO actually write the tags instead of just a null byte
		compressableData.writeUInt8(0);

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
		let sortedTiles = new Array<Tile[]>(width);
		for (let tile of tiles) {
			sortedTiles[tile.x] ??= new Array(height);
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

	displayTiles() {
		console.table(this.tiles.map(col => col.map(tile => tile?.toString()).reverse()));
	}


	getTileAt(x: number, y: number): Tile | null {
		return this.tiles[x][y];
	}
	setTileAt(x: number, y: number, tile: Tile) {
		this.tiles[x][y] = tile;
	}
}