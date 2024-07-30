/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/
import { SmartBuffer } from "./SmartBuffer.js";
import { Tile } from "./Tile.js";
import { TypeIO } from "./TypeIO.js";
import { Point2 } from "./Point2.js";
import * as zlib from "zlib";
import { BlockConfigType } from "./BlockConfig.js";
import { fail } from "./utils.js";
export class Schematic {
    constructor(height, width, 
    /** Currently, the only version is 1 */
    version, tags, labels, tiles) {
        this.height = height;
        this.width = width;
        this.version = version;
        this.tags = tags;
        this.labels = labels;
        /**Tiles arranged in a grid. */
        this.tiles = [];
        this.tiles = Schematic.sortTiles(tiles, width, height);
        this.readConfigs();
    }
    /**
     * Creates a new Schematic from serialized data.
     * @param { Buffer } inputData A buffer containing the data.
     * @param maxSize Defaults to 128. Schematics larger than this size cannot be read by Mindustry without mods.
     * @returns { Schematic } the loaded schematic.
     */
    static read(inputData, maxSize = 128) {
        let rawData = new SmartBuffer({
            buff: inputData
        });
        for (let char of Schematic.headerBytes) {
            if (rawData.readUInt8() != char)
                return `Not a schematic file (header bytes did not match)`;
        }
        let version = rawData.readInt8();
        if (version != 1)
            return `Unknown schematic version ${version}`;
        let data = new SmartBuffer({
            buff: zlib.inflateSync(inputData.subarray(5))
        });
        let width = data.readUInt16BE();
        let height = data.readUInt16BE();
        if (width > maxSize || height > maxSize)
            return "Schematic is too large, maximum size is 128x128."; //TODO conf
        let tagcount = data.readUInt8();
        let tags = {};
        for (let i = 0; i < tagcount; i++) {
            tags[data.readUTF8()] = data.readUTF8();
        }
        let labels;
        try {
            labels = JSON.parse(tags["labels"]);
        }
        catch {
            labels = [];
        }
        const blocks = new Array(data.readUInt8());
        for (let i = 0; i < blocks.length; i++) {
            blocks[i] = data.readUTF8();
        }
        let numTiles = data.readInt32BE();
        let tiles = new Array(numTiles);
        if (numTiles > width * height)
            return `Schematic contains too many tiles: maximum possible is width * height (${width * height}), but there were ${numTiles} tiles.`;
        for (let i = 0; i < numTiles; i++) {
            let id = data.readInt8();
            let block = blocks[id];
            let [x, y] = Point2.unpack(data.readInt32BE());
            let config = TypeIO.readObject(data);
            let rotation = data.readInt8();
            if (![0, 1, 2, 3].includes(rotation))
                return `Invalid rotation ${rotation}, valid values are 0, 1, 2, 3`;
            if (!(x < width && y < height))
                return `Invalid position (${x},${y}): out of bounds for schematic of size ${width}x${height}`;
            if (!block || block == "air")
                continue;
            tiles[i] = new Tile(block, x, y, config, rotation);
        }
        return new Schematic(height, width, version, tags, labels, tiles);
    }
    /**Loads decompressable configs from compressed data. */
    readConfigs() {
        for (let column of this.tiles) {
            for (let tile of column) {
                tile?.readConfig();
            }
        }
    }
    /**Compresses configs to be saved. */
    writeConfigs() {
        for (let column of this.tiles) {
            for (let tile of column) {
                tile?.writeConfig();
            }
        }
    }
    /**
     * Serializes this schematic.
     * @returns { SmartBuffer } The output data.
     */
    write() {
        this.writeConfigs();
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
        const unsortedTiles = Schematic.unsortTiles(this.tiles);
        const [allNames, mapping] = Schematic.getBlockMap(unsortedTiles);
        compressableData.writeUInt8(allNames.length);
        for (const name of allNames) {
            compressableData.writeUTF8(name);
        }
        compressableData.writeInt32BE(mapping.length);
        for (const [tile, i] of mapping) {
            compressableData.writeUInt8(i);
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
     */
    static getBlockMap(unsortedTiles) {
        const mapping = new Map();
        const otherMapping = unsortedTiles.map(t => [t, mapping.get(t.name) ?? (() => {
                const i = mapping.size;
                mapping.set(t.name, i);
                return i;
            })()]);
        return [Array.from(mapping.keys()), otherMapping];
    }
    /**
     * Sorts a list of tiles into a grid.
     * @param { Tile[] } tiles List of tiles to sort
     * @param { number } width Width that the resulting 2D array should be
     * @param { number } height Height that the resulting 2D array should have
     * @returns { (Tile|null)[][] } Tiles sorted into a grid.
     */
    static sortTiles(tiles, width, height) {
        const sortedTiles = Array.from({ length: height }, () => new Array(width).fill(null));
        for (const tile of tiles) {
            if (!(0 <= tile.x && tile.x < width && 0 <= tile.y && tile.y < height))
                fail(`Invalid position (${tile.x},${tile.y}): out of bounds for schematic of size ${width}x${height}`);
            sortedTiles[tile.y][tile.x] = tile;
        }
        return sortedTiles;
    }
    /**
     *
     * @param { (Tile|null)[][] } tiles A grid of tiles to unsort.
     * @returns { Tile[] } List of unsorted tiles.
     */
    static unsortTiles(tiles) {
        return tiles.flat().filter(Boolean);
    }
    /**
     * Display a schematic to console.
     * @param verbose Whether to also print block configs. Warning, may spam console.
     */
    display(verbose) {
        console.log(`Size: ${this.width}x${this.height}`);
        console.log("Tiles:");
        console.table(this.tiles.map(row => row.map(tile => tile?.toString() ?? "")).reverse());
        console.log("Tags:");
        console.log(this.tags);
        if (verbose) {
            console.log("Configs:");
            let printed = false;
            Schematic.unsortTiles(this.tiles).forEach(tile => {
                if (tile.config.type != BlockConfigType.null) {
                    console.log(tile.name, tile.x, tile.y, tile.formatConfig());
                    printed = true;
                }
            });
            if (!printed)
                console.log(`No configs.`);
        }
    }
    /**
     * Gets a tile.
     * @param { number } x
     * @param { number } y
     * @returns { Tile | null } The tile found, or null.
     */
    getTileAt(x, y) {
        return this.tiles[y][x];
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
        this.tiles[y][x] = tile;
    }
}
/**Magic header bytes that must be present at the start of a schematic file. */
Schematic.headerBytes = ['m', 's', 'c', 'h'].map(char => char.charCodeAt(0));
/**Blank schematic. */
Schematic.blank = new Schematic(0, 0, 1, {}, [], []);
