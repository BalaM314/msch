/**
 * WIP
 */
import * as fs from "fs";
import * as path from "path";
import { SmartBuffer as _SmartBuffer } from "smart-buffer";
import * as zlib from "zlib";


/**Parses command line args. */
function parseArgs(args: string[]): [
	parsedArgs: {[index: string]: string;},
	mainArgs: string[]
]{
	let parsedArgs: {
		[index: string]: string;
	} = {};
	let mainArgs: string[] = [];
	let i = 0;
	while(true){
		i ++;
		if(i > 1000){throw new Error("Too many arguments!");}
		let arg = args.splice(0, 1)[0];
		if(arg == undefined) break;
		if(arg.startsWith("--")){
			if(args[0]?.startsWith("-"))
				parsedArgs[arg] = "null";
			else
				parsedArgs[arg.substring(2)] = args.splice(0,1)[0] ?? "null";
		} else if(arg.startsWith("-")){
			if(args[0]?.startsWith("-"))
				parsedArgs[arg] = "null";
			else
				parsedArgs[arg.substring(1)] = args.splice(0,1)[0] ?? "null";
		} else {
			mainArgs.push(arg);
		}
	}
	return [parsedArgs, mainArgs];
}

class SmartBuffer extends _SmartBuffer {
	readNullByte(){
		let byte = this.readUInt8();
		if(byte != 0) throw new Error(`Expected null byte, got ${byte.toString(16)}`);
	}
	readUTF8(){
		this.readNullByte();
		let size = this.readUInt8();
		return this.readString(size);
	}
	writeUTF8(str:string){
		this.writeUInt8(0);
		this.writeUInt8(str.length);
		this.writeString(str);
	}
}

class Tile {
	x: number;
	y: number;
	constructor(public name:string, position:number, public config:any, public rotation:number){
		this.x = Point2.x(position);
		this.y = Point2.y(position);
	}
	toString(){
		return `${this.name}`;
	}
}

class Point2 {
	static x(pos:number){
		return pos >>> 16;
	}
	static y(pos:number){
		return pos & 0xFFFF;
	}
	static pack(x:number, y:number){
		return ((x) << 16) | ((y) & 0xFFFF);
	}
}

class Schematic {
	static headerBytes:number[] = ['m','s','c','h'].map(char => char.charCodeAt(0));
	/**Tiles arranged in a grid. */
	tiles: (Tile|null)[][] = [];
	constructor(
		public height:number,
		public width:number,
		public version:number,
		public tags: {
			[name:string]: string;
		},
		public labels:string[],
		tiles:Tile[]
	){
		this.tiles = Schematic.sortTiles(tiles, width, height);
	}

	static from(inputData:Buffer){
		let rawData = new SmartBuffer({
			buff: inputData
		});
		for(let char of Schematic.headerBytes){
			if(rawData.readUInt8() != char){
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
		if(width > 128 || height > 128) throw new Error("Schematic is too large.");
		console.log(`Size: ${width}x${height}`);
		
		let tagcount = data.readUInt8();
		let tags:typeof Schematic.prototype.tags = {};
		console.log(`${tagcount} tags.`);
		for(let i = 0; i < tagcount; i ++){
			tags[data.readUTF8()] = data.readUTF8();
		}
		console.log(`Tags: `, tags);
		let labels:string[] = [];
		try {
			labels = JSON.parse(tags["labels"]);
		} catch(err){
			console.warn("Failed to parse labels.");
		}

		let numBlocks = data.readUInt8();
		console.log(`${numBlocks} blocks.`);
		let blocks:Map<number, string> = new Map();
		for(let i = 0; i < numBlocks; i ++){
			blocks.set(i, data.readUTF8());
		}
		console.log(`Blocks: [${Object.values(blocks).join(", ")}]`);

		let numTiles = data.readInt32BE();
		let tiles: ReturnType<typeof Schematic.unsortTiles> = [];
		console.log(`${numTiles} tiles.`);
		if(width > 128 || height > 128) throw new Error("Schematic contains too many tiles.");
		for(let i = 0; i < numTiles; i ++){
			let id = data.readInt8();
			let block = blocks.get(id)!;
			let position = data.readInt32BE();
			let config = TypeIO.readObject(data);
			let rotation = data.readInt8();
			if(block && block != "air") tiles.push(new Tile(block, position, config, rotation));
		}
		return new Schematic(height, width, version, tags, labels, tiles);
	}

	write():SmartBuffer {
		let output = new SmartBuffer();
		for(let char of Schematic.headerBytes){
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
		for(let name of blocks.values()){
			compressableData.writeUTF8(name);
		}

		compressableData.writeInt32BE(unsortedTiles.length);
		for(let tile of unsortedTiles){
			compressableData.writeUInt8(Array.from(blocks.values()).indexOf(tile.name));
			compressableData.writeInt32BE(Point2.pack(tile.x, tile.y));
			TypeIO.writeObject(compressableData, tile.config);
			compressableData.writeUInt8(tile.rotation);
		}

		let compressedData = zlib.deflateSync(compressableData.toBuffer());
		output.writeBuffer(compressedData);

		return output;
	}
	static getBlockMap(unsortedTiles: Tile[]){
		let blockMap = new Set<string>();
		unsortedTiles.forEach(tile => blockMap.add(tile.name));
		return blockMap;
	}


	static sortTiles(tiles:Tile[], width:number, height:number): (Tile|null)[][] {
		let sortedTiles = new Array<Tile[]>(width);
		for(let tile of tiles){
			sortedTiles[tile.x] ??= new Array(height);
			sortedTiles[tile.x][tile.y] = tile;
		}
		return sortedTiles;
	}
	static unsortTiles(tiles:(Tile|null)[][]): Tile[] {
		let unsortedTiles:Tile[] = [];
		for(let column of tiles){
			for(let tile of column){
				if(tile != null)
					unsortedTiles.push(tile);
			}
		}
		return unsortedTiles;
	}

	displayTiles(){
		console.table(this.tiles.map(col => col.map(tile => tile?.toString()).reverse()));
	}


	getTileAt(x:number, y:number):Tile|null {
		return this.tiles[x][y];
	}
	setTileAt(x:number, y:number, tile:Tile) {
		this.tiles[x][y] = tile;
	}
}

class TypeIO {
	static readObject(buf:SmartBuffer) {
		let type = buf.readInt8();
		switch(type){
			case 0:
				return null;
			case 1:
				return buf.readInt32BE();
			case 2:
				return buf.readBigInt64BE();
			case 3:
				return buf.readFloatBE();
			case 4:
				let exists = buf.readInt8();
        if(exists != 0){
          return buf.readUTF8();
        } else {
          return null;
        }
			default:
				throw new Error("Unknown or not implemented object type for a tile.");
		}
	}
	static writeObject(buf:SmartBuffer, object:any){
		if(object == null){
			buf.writeUInt8(0);
		} else if(typeof object == "number" || object % 1 == object){
			buf.writeUInt8(1);
			buf.writeUInt32BE(object)
		} else if(typeof object == "bigint"){
			buf.writeUInt8(2);
			buf.writeBigInt64BE(object);
		} else if(typeof object == "number" || object % 1 != object){
			buf.writeUInt8(3);
			buf.writeFloatBE(object);
		} else if(typeof object == "string" || object instanceof String){
			buf.writeUInt8(4);
			if(object.length == 0){
				buf.writeUInt8(0);
			} else {
				buf.writeUInt8(1);
				buf.writeString(object.toString());
			}
		} else {
			throw new Error("Unknown or not implemented object type for a tile.");
		}
	}
}



function main(argv:string[]){
	const [parsedArgs, mainArgs] = parseArgs(argv.slice(2));
	if(!mainArgs[0]){
		console.error("Please specify a schematic file to load");
		return 1;
	}
	console.log(`Loading schematic ${mainArgs[0]}`);
	let schem = Schematic.from(fs.readFileSync(mainArgs[0]));
	console.log(`Loaded schematic ${mainArgs[0]}`);
	schem.displayTiles();
	schem.setTileAt(1, 1, new Tile("phase-wall", Point2.pack(1, 1), null, 0));
	console.log(`Modified schematic ${mainArgs[0]}`);
	schem.displayTiles();
	let outputPath = path.join(mainArgs[0], "..", "modified-" + mainArgs[0].split(path.sep).at(-1));
	console.log(`Writing to ${outputPath}`);
	fs.writeFileSync(outputPath, schem.write().toBuffer());
}


try {
	main(process.argv);
} catch(err){
	console.error("Unhandled runtime error!");
	console.error(err);
	process.exit(1);
}
