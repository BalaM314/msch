import { SmartBuffer } from "../ported/SmartBuffer.js";
import { Point2 } from "../ported/Point2.js";
import * as zlib from "zlib";
import { toHexCodes } from "../funcs.js";
export class Tile {
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
    decompressLogicConfig() {
        if (!this.isProcessor())
            throw new Error("not a processor");
        console.debug("Decompressing code: ", toHexCodes(Buffer.from(this.config.value)).join(" "));
        let data = new SmartBuffer({
            buff: zlib.inflateSync(Uint8Array.from(this.config.value))
        });
        console.debug("Decompressed code: ", toHexCodes(data.toBuffer()).join(" "));
        let version = data.readInt8();
        if (version != 1)
            throw new Error(`Unsupported logic code of version ${version}`);
        let length = data.readInt32BE();
        this.code = data.readBuffer(length).toString().split(/\r?\n/g);
        let numLinks = data.readInt32BE();
        this.links ??= [];
        for (let i = 0; i < numLinks; i++) {
            this.links.push({
                name: data.readUTF8(),
                x: data.readInt16BE(),
                y: data.readInt16BE()
            });
        }
    }
    compressLogicConfig() {
        if (!this.code || !this.isProcessor())
            throw new Error("not a processor");
        let output = new SmartBuffer();
        output.writeInt8(Tile.logicVersion);
        let outputCode = Buffer.from(this.code.join("\n"));
        output.writeInt32BE(outputCode.length);
        output.writeBuffer(outputCode);
        //TODO links
        output.writeInt32BE(0);
        console.debug("Precompressed code: ", toHexCodes(output.toBuffer()).join(" "));
        let compressedData = zlib.deflateSync(output.toBuffer());
        console.debug("Compressed code: ", toHexCodes(compressedData).join(" "));
        return Array.from(compressedData);
    }
}
Tile.logicBlocks = ["micro-processor", "logic-processor", "hyper-processor"];
Tile.logicVersion = 1;
