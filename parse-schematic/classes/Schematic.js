import { SmartBuffer } from "../ported/SmartBuffer.js";
import { Tile } from "../classes/Tile.js";
import { TypeIO } from "../ported/TypeIO.js";
import { Point2 } from "../ported/Point2.js";
import * as zlib from "zlib";
export class Schematic {
    constructor(height, width, version, tags, labels, tiles) {
        this.height = height;
        this.width = width;
        this.version = version;
        this.tags = tags;
        this.labels = labels;
        /**Tiles arranged in a grid. */
        this.tiles = [];
        this.tiles = Schematic.sortTiles(tiles, width, height);
        this.loadConfigs();
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
        let data = new SmartBuffer({
            buff: zlib.inflateSync(inputData.slice(5))
        });
        let [width, height] = [data.readUInt16BE(), data.readUInt16BE()];
        if (width > 128 || height > 128)
            throw new Error("Schematic is too large.");
        let tagcount = data.readUInt8();
        let tags = {};
        for (let i = 0; i < tagcount; i++) {
            tags[data.readUTF8()] = data.readUTF8();
        }
        let labels = [];
        try {
            labels = JSON.parse(tags["labels"]);
        }
        catch (err) {
            console.warn("Failed to parse labels.");
        }
        let numBlocks = data.readUInt8();
        let blocks = new Map();
        for (let i = 0; i < numBlocks; i++) {
            blocks.set(i, data.readUTF8());
        }
        let numTiles = data.readInt32BE();
        let tiles = [];
        if (numTiles > width * height)
            throw new Error("Schematic contains too many tiles.");
        for (let i = 0; i < numTiles; i++) {
            let id = data.readInt8();
            let block = blocks.get(id);
            let position = data.readInt32BE();
            let config = TypeIO.readObject(data);
            let rotation = data.readInt8();
            if (block && block != "air")
                tiles.push(new Tile(block, ...Point2.unpack(position), config, rotation));
        }
        return new Schematic(height, width, version, tags, labels, tiles);
    }
    loadConfigs() {
        for (let column of this.tiles) {
            for (let tile of column) {
                if (tile?.isProcessor()) {
                    tile.decompressLogicConfig();
                }
            }
        }
    }
    saveConfigs() {
        for (let column of this.tiles) {
            for (let tile of column) {
                if (tile?.isProcessor()) {
                    tile.compressLogicConfig();
                }
            }
        }
    }
    write() {
        this.saveConfigs();
        let output = new SmartBuffer();
        for (let char of Schematic.headerBytes) {
            output.writeUInt8(char);
        }
        output.writeUInt8(this.version);
        let compressableData = new SmartBuffer();
        compressableData.writeUInt16BE(this.width);
        compressableData.writeUInt16BE(this.height);
        //TODO actually write the tags instead of just a null byte
        compressableData.writeUInt8(Object.entries(this.tags).length);
        for (let [key, value] of Object.entries(this.tags)) {
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
    static getBlockMap(unsortedTiles) {
        let blockMap = new Set();
        unsortedTiles.forEach(tile => blockMap.add(tile.name));
        return blockMap;
    }
    static sortTiles(tiles, width, height) {
        let sortedTiles = new Array(width).fill([]).map(() => new Array(height));
        for (let tile of tiles) {
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
