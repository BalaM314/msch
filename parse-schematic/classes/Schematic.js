import { SmartBuffer } from "../ported/SmartBuffer.js";
import { Tile } from "../classes/Tile.js";
import { TypeIO } from "../ported/TypeIO.js";
import { Point2 } from "../ported/Point2.js";
import * as zlib from "zlib";
import { BlockConfigType } from "../types.js";
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
    /**
     * Creates a new Schematic from serialized data.
     * @param { Buffer } inputData A buffer containing the data.
     * @returns { Schematic } the loaded schematic.
     */
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
    /**Loads decompressable configs from compressed data. */
    loadConfigs() {
        for (let column of this.tiles) {
            for (let tile of column) {
                if (tile?.isProcessor()) {
                    tile.decompressLogicConfig();
                }
            }
        }
    }
    /**Compresses configs to be saved. */
    saveConfigs() {
        for (let column of this.tiles) {
            for (let tile of column) {
                if (tile?.isProcessor()) {
                    tile.compressLogicConfig();
                }
            }
        }
    }
    /**Serializes this schematic.
     * @returns { SmartBuffer } The output data.
     */
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
    /**
     * Generates the block map needed to save tiles.
     * @param { Tile[] } unsortedTiles List of Tiles.
     * @returns { Set<string> }
     */
    static getBlockMap(unsortedTiles) {
        let blockMap = new Set();
        unsortedTiles.forEach(tile => blockMap.add(tile.name));
        return blockMap;
    }
    /**
     * Sorts a list of tiles into a grid.
     * @param { Tile[] } tiles List of tiles to sort
     * @param { number } width Width that the resulting 2D array should be
     * @param { number } height Height that the resulting 2D array should have
     * @returns { (Tile|null)[][] } Tiles sorted into a grid.
     */
    static sortTiles(tiles, width, height) {
        let sortedTiles = new Array(width).fill([]).map(() => new Array(height).fill(null));
        for (let tile of tiles) {
            sortedTiles[tile.x][tile.y] = tile;
        }
        return sortedTiles;
    }
    /**
     *
     * @param { (Tile|null)[][] } tiles A grid of tiles to unsort.
     * @returns { Tile[] } List of unsorted tiles.
     */
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
    /**
     * Display a schematic to console.
     * @param verbose Whether to also print block configs. Warning, may spam console.
     */
    display(verbose) {
        let rotatedTiles = new Array(this.width).fill([]).map(() => new Array(this.height + 1).fill(''));
        this.tiles.forEach((row, y) => {
            row.forEach((tile, x) => {
                rotatedTiles[this.width - 1 - x]["y"] = x; //haha any go brrrrr... i am totally going to regret this
                rotatedTiles[this.width - 1 - x][y] = tile ? tile.toString() : "";
            });
        });
        rotatedTiles = rotatedTiles.filter(row => row["y"] != null);
        console.log(`Size: ${this.width}x${this.height}`);
        console.log("Tiles:");
        console.table(rotatedTiles);
        console.log("Tags:");
        console.log(this.tags);
        if (verbose) {
            console.log("Configs:");
            Schematic.unsortTiles(this.tiles).forEach(tile => tile.config.type == BlockConfigType.null ? 0 : console.log(tile.name, tile.x, tile.y, tile.formatConfig()));
        }
    }
    /**
     * Gets a tile.
     * @param { number } x
     * @param { number } y
     * @returns { Tile | null } The tile found, or null.
     */
    getTileAt(x, y) {
        return this.tiles[x][y];
    }
    /**
     * Sets a tile.
     * @param { number } x
     * @param { number } y
     * @param { Tile } tile The tile to set.
     */
    setTileAt(x, y, tile) {
        tile.x = x;
        tile.y = y;
        this.tiles[x][y] = tile;
    }
}
/**Magic header bytes that must be present at the start of a schematic file. */
Schematic.headerBytes = ['m', 's', 'c', 'h'].map(char => char.charCodeAt(0));
/**Blank schematic. */
Schematic.blank = new Schematic(0, 0, 1, {}, [], []);
