import { SmartBuffer } from "../ported/SmartBuffer.js";
import { Point2 } from "../ported/Point2.js";
import * as zlib from "zlib";
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
    decompressLogicCode() {
        if (!this.isProcessor)
            return null;
        let data = new SmartBuffer({
            buff: zlib.inflateSync(Uint8Array.from(this.config.value))
        });
        let version = data.readInt8();
        if (version != 1)
            throw new Error(`Unsupported logic code of version ${version}`);
        let length = data.readInt32BE();
        return data.readBuffer(length).toString();
    }
}
Tile.logicBlocks = ["micro-processor", "logic-processor", "hyper-processor"];
