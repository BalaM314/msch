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
import { crash, fail } from "./utils.js";
/**
 * Represents a tile in the schematic.
 */
export class Tile {
    constructor(name, x, y, config, rotation) {
        this.name = name;
        this.x = x;
        this.y = y;
        if (this.isProcessor()) {
            if (config == undefined || config == BlockConfig.null) {
                this.config = BlockConfig.null;
                this.code = [];
            }
            else if (Array.isArray(config)) {
                this.code = config;
                this.config = new BlockConfig(BlockConfigType.bytearray, []);
                this.links = [];
                this.writeConfig();
            }
            else {
                this.config = config;
                this.code = [];
                this.links = [];
            }
        }
        else {
            if (Array.isArray(config))
                // eslint-disable-next-line prefer-rest-params
                crash(`Invalid arguments to Tile constructor ([${Array.from(arguments).join(", ")}])`);
            this.config = config ?? BlockConfig.null;
        }
        this.rotation = rotation ?? 0;
    }
    toString() {
        return `${this.name}`;
    }
    isProcessor() {
        return Tile.logicBlocks.includes(this.name);
    }
    /**Decompresses a processor config into links and code. */
    static decompressLogicConfig(config) {
        if (config.type != BlockConfigType.bytearray)
            crash(`Cannot decompress logic config, config type is ${String(config.type)}`);
        const data = new SmartBuffer({
            buff: zlib.inflateSync(Uint8Array.from(config.value))
        });
        const version = data.readInt8();
        if (version != 1)
            fail(`Unsupported logic code of version ${version}`);
        const length = data.readInt32BE();
        const code = data.readBuffer(length).toString().split(/\r?\n/g);
        const numLinks = data.readInt32BE();
        const links = [];
        for (let i = 0; i < numLinks; i++) {
            links.push({
                name: data.readUTF8(),
                x: data.readInt16BE(),
                y: data.readInt16BE()
            });
        }
        return { code, links };
    }
    readConfig() {
        if (this.isProcessor()) {
            if (this.config.type == BlockConfigType.bytearray)
                ({ code: this.code, links: this.links } = Tile.decompressLogicConfig(this.config));
            else {
                this.code = [];
                this.links = [];
            }
        }
    }
    /**Compresses links and code for serialization. */
    static compressLogicConfig({ links, code }) {
        const output = new SmartBuffer();
        output.writeInt8(Tile.logicVersion);
        const outputCode = Buffer.from(code.join("\n"));
        output.writeInt32BE(outputCode.length);
        output.writeBuffer(outputCode);
        output.writeInt32BE(links.length);
        for (const link of links) {
            output.writeUTF8(link.name);
            output.writeInt16BE(link.x);
            output.writeInt16BE(link.y);
        }
        const compressedData = zlib.deflateSync(output.toBuffer());
        return Array.from(compressedData);
    }
    writeConfig() {
        if (this.isProcessor()) {
            if (!this.links || !this.code)
                crash("data was never decompressed");
            if (this.config.type == BlockConfigType.bytearray)
                this.config.value = Tile.compressLogicConfig({
                    links: this.links,
                    code: this.code
                });
        }
    }
    /**Used for displaying config. */
    formatConfig() {
        if (this.isProcessor()) {
            return {
                code: this.code,
                links: this.links
            };
        }
        else {
            return `BlockConfig {[type ${BlockConfigType[this.config.type] ?? this.config.type}] ${typeof this.config.value == "string" ? `"${this.config.value}"` : String(this.config.value)}}`;
        }
    }
}
/**All block ids that have logic code. */
Tile.logicBlocks = ["micro-processor", "logic-processor", "hyper-processor", "world-processor"];
/**Current logic version. */
Tile.logicVersion = 1;
