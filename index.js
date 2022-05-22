/**
 * WIP
 */
import * as fs from "fs";
import * as path from "path";
import { SmartBuffer as _SmartBuffer } from "smart-buffer";
import * as zlib from "zlib";
import { ConfigType } from "./types.js";
/**Parses command line args. */
function parseArgs(args) {
    let parsedArgs = {};
    let mainArgs = [];
    let i = 0;
    while (true) {
        i++;
        if (i > 1000) {
            throw new Error("Too many arguments!");
        }
        let arg = args.splice(0, 1)[0];
        if (arg == undefined)
            break;
        if (arg.startsWith("--")) {
            if (args[0]?.startsWith("-"))
                parsedArgs[arg] = "null";
            else
                parsedArgs[arg.substring(2)] = args.splice(0, 1)[0] ?? "null";
        }
        else if (arg.startsWith("-")) {
            if (args[0]?.startsWith("-"))
                parsedArgs[arg] = "null";
            else
                parsedArgs[arg.substring(1)] = args.splice(0, 1)[0] ?? "null";
        }
        else {
            mainArgs.push(arg);
        }
    }
    return [parsedArgs, mainArgs];
}
/**Extension of SmartBuffer with extra methods. */
class SmartBuffer extends _SmartBuffer {
    readNullByte() {
        let byte = this.readUInt8();
        if (byte != 0)
            throw new Error(`Expected null byte, got ${byte.toString(16)}`);
    }
    readUTF8() {
        this.readNullByte();
        let size = this.readUInt8();
        return this.readString(size);
    }
    writeUTF8(str) {
        this.writeUInt8(0);
        this.writeUInt8(str.length);
        this.writeString(str);
    }
}
class Tile {
    constructor(name, position, config, rotation) {
        this.name = name;
        this.config = config;
        this.rotation = rotation;
        this.x = Point2.x(position);
        this.y = Point2.y(position);
    }
    toString() {
        return `${this.name}`;
    }
    isProcessor() {
        return Tile.logicBlocks.includes(this.name);
    }
    decompressLogicCode() {
        if (!this.isProcessor)
            return null;
        let data = new SmartBuffer({
            buff: zlib.inflateSync(Uint8Array.from(this.config.value))
        });
        let version = data.readInt8();
        if (version != 1)
            throw new Error(`Unsupported logic code of version ${1}`);
        let length = data.readInt32BE();
        return data.readBuffer(length).toString();
    }
}
Tile.logicBlocks = ["micro-processor", "logic-processor", "hyper-processor"];
/**Partial port of arc.math.geom.Point2 */
export class Point2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static x(pos) {
        return pos >>> 16;
    }
    static y(pos) {
        return pos & 0xFFFF;
    }
    static pack(x, y) {
        return ((x) << 16) | ((y) & 0xFFFF);
    }
    static from(point) {
        return new Point2(Point2.x(point), Point2.y(point));
    }
    pack() {
        return Point2.pack(this.x, this.y);
    }
}
class Schematic {
    constructor(height, width, version, tags, labels, tiles) {
        this.height = height;
        this.width = width;
        this.version = version;
        this.tags = tags;
        this.labels = labels;
        /**Tiles arranged in a grid. */
        this.tiles = [];
        this.tiles = Schematic.sortTiles(tiles, width, height);
    }
    static from(inputData) {
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
        if (width > 128 || height > 128)
            throw new Error("Schematic is too large.");
        console.log(`Size: ${width}x${height}`);
        let tagcount = data.readUInt8();
        let tags = {};
        console.log(`${tagcount} tags.`);
        for (let i = 0; i < tagcount; i++) {
            tags[data.readUTF8()] = data.readUTF8();
        }
        console.log(`Tags: `, tags);
        let labels = [];
        try {
            labels = JSON.parse(tags["labels"]);
        }
        catch (err) {
            console.warn("Failed to parse labels.");
        }
        let numBlocks = data.readUInt8();
        console.log(`${numBlocks} blocks.`);
        let blocks = new Map();
        for (let i = 0; i < numBlocks; i++) {
            blocks.set(i, data.readUTF8());
        }
        console.log(`Blocks: [${Object.values(blocks).join(", ")}]`);
        let numTiles = data.readInt32BE();
        let tiles = [];
        console.log(`${numTiles} tiles.`);
        if (numTiles > width * height)
            throw new Error("Schematic contains too many tiles.");
        for (let i = 0; i < numTiles; i++) {
            let id = data.readInt8();
            let block = blocks.get(id);
            let position = data.readInt32BE();
            let config = TypeIO.readObject(data);
            let rotation = data.readInt8();
            if (block && block != "air")
                tiles.push(new Tile(block, position, config, rotation));
        }
        return new Schematic(height, width, version, tags, labels, tiles);
    }
    write() {
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
    static getBlockMap(unsortedTiles) {
        let blockMap = new Set();
        unsortedTiles.forEach(tile => blockMap.add(tile.name));
        return blockMap;
    }
    static sortTiles(tiles, width, height) {
        let sortedTiles = new Array(width);
        for (let tile of tiles) {
            sortedTiles[tile.x] ??= new Array(height);
            sortedTiles[tile.x][tile.y] = tile;
        }
        return sortedTiles;
    }
    static unsortTiles(tiles) {
        let unsortedTiles = [];
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
    getTileAt(x, y) {
        return this.tiles[x][y];
    }
    setTileAt(x, y, tile) {
        this.tiles[x][y] = tile;
    }
}
Schematic.headerBytes = ['m', 's', 'c', 'h'].map(char => char.charCodeAt(0));
class TypeIO {
    static readObject(buf) {
        let type = buf.readInt8();
        switch (type) {
            case 0:
                return new Config(ConfigType.null, null);
            case 1:
                return new Config(ConfigType.int, buf.readInt32BE());
            case 2:
                return new Config(ConfigType.long, buf.readBigInt64BE());
            case 3:
                return new Config(ConfigType.float, buf.readFloatBE());
            case 4:
                let exists = buf.readInt8();
                if (exists != 0) {
                    return new Config(ConfigType.string, buf.readUTF8());
                }
                else {
                    return new Config(ConfigType.string, null);
                }
            case 5:
                //TODO return this in a correct format;
                return new Config(ConfigType.content, [buf.readInt8(), buf.readInt16BE()]);
            case 6:
                let numbers = [];
                for (let i = 0; i < buf.readInt16BE(); i++) {
                    numbers.push(buf.readInt32BE());
                }
                return new Config(ConfigType.content, numbers);
            case 7:
                return new Config(ConfigType.point, new Point2(buf.readInt32BE(), buf.readInt32BE()));
            case 8:
                let points = [];
                for (let i = 0; i < buf.readInt8(); i++) {
                    points.push(Point2.from(buf.readInt32BE()));
                }
                return new Config(ConfigType.pointarray, points);
            case 10:
                return new Config(ConfigType.boolean, !!buf.readUInt8());
            case 11:
                return new Config(ConfigType.double, !!buf.readDoubleBE());
            case 12:
                //Should technically be a BuildingBox, but thats equivalent to a Point2 for this program.
                return new Config(ConfigType.buildingbox, Point2.from(buf.readInt32BE()));
            case 14:
                let numBytes = buf.readInt32BE();
                console.log(`Object has ${numBytes} bytes`);
                let bytes = [];
                for (let i = 0; i < numBytes; i++) {
                    bytes.push(buf.readUInt8());
                }
                return new Config(ConfigType.bytearray, bytes);
            default:
                throw new Error(`Unknown or not implemented object type (${type}) for a tile.`);
        }
    }
    static writeObject(buf, object) {
        buf.writeUInt8(object.type);
        switch (object.type) {
            case ConfigType.null:
                break;
            case ConfigType.int:
                buf.writeUInt32BE(object.value);
                break;
            case ConfigType.long:
                buf.writeBigInt64BE(object.value);
                break;
            case ConfigType.float:
                buf.writeFloatBE(object.value);
                break;
            case ConfigType.string:
                if (object.value) {
                    buf.writeUInt8(1);
                    buf.writeUTF8(object.value);
                }
                else {
                    buf.writeUInt8(0);
                }
                break;
            case ConfigType.content:
                buf.writeUInt8(object.value[0]);
                buf.writeInt16BE(object.value[1]);
                break;
            case ConfigType.intarray:
                buf.writeInt16BE(object.value.length);
                for (let number of object.value) {
                    buf.writeInt32BE(number);
                }
                break;
            case ConfigType.point:
                buf.writeInt32BE(object.value.x);
                buf.writeInt32BE(object.value.y);
                break;
            case ConfigType.pointarray:
                buf.writeInt16BE(object.value.length);
                for (let point of object.value) {
                    buf.writeInt32BE(point.pack());
                }
                break;
            case ConfigType.bytearray:
                buf.writeInt32BE(object.value.length);
                for (let byte of object.value) {
                    buf.writeUInt8(byte);
                }
                break;
            //TODO implement the rest of them.
            default:
                throw new Error(`Unknown or not implemented object type (${object.type}) for a tile.`);
        }
    }
}
/**Wrapper for configs that preserves type. */
class Config {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
Config.null = new Config(ConfigType.null, null);
function main(argv) {
    const [parsedArgs, mainArgs] = parseArgs(argv.slice(2));
    if (!mainArgs[0]) {
        console.error("Please specify a schematic file to load");
        return 1;
    }
    console.log(`Loading schematic ${mainArgs[0]}`);
    let schem = Schematic.from(fs.readFileSync(mainArgs[0]));
    console.log(`Loaded schematic ${mainArgs[0]}`);
    schem.displayTiles();
    console.log("Config of tile at 0, 0:", schem.getTileAt(0, 0)?.decompressLogicCode());
    let outputPath = path.join(mainArgs[0], "..", "modified-" + mainArgs[0].split(path.sep).at(-1));
}
try {
    main(process.argv);
}
catch (err) {
    console.error("Unhandled runtime error!");
    console.error(err);
    process.exit(1);
}
