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
    static decompressLogicCode(rawData) {
        console.log("Decompressing code: ", toHexCodes(Buffer.from(rawData)).join(" "));
        let data = new SmartBuffer({
            buff: zlib.inflateSync(Uint8Array.from(rawData))
        });
        console.log("Decompressed code: ", toHexCodes(data.toBuffer()).join(" "));
        let version = data.readInt8();
        if (version != 1)
            throw new Error(`Unsupported logic code of version ${version}`);
        let length = data.readInt32BE();
        return data.readBuffer(length).toString().split(/\r?\n/g);
        //TODO parse links
    }
    static compressLogicCode(code) {
        let output = new SmartBuffer();
        output.writeInt8(Tile.logicVersion);
        let outputCode = Buffer.from(code.join("\n"));
        output.writeInt32BE(outputCode.length);
        output.writeBuffer(outputCode);
        //TODO links
        output.writeInt32BE(0);
        console.log("Precompressed code: ", toHexCodes(output.toBuffer()).join(" "));
        let compressedData = zlib.deflateSync(output.toBuffer());
        console.log("Compressed code: ", toHexCodes(compressedData).join(" "));
        return Array.from(compressedData);
    }
}
Tile.logicBlocks = ["micro-processor", "logic-processor", "hyper-processor"];
Tile.logicVersion = 1;
