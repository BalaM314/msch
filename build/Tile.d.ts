import { BlockConfig, BlockConfigType } from "./BlockConfig.js";
import { Rotation, Link } from "./types.js";
/**
 * Represents a tile in the schematic.
 */
export declare class Tile {
    name: string;
    x: number;
    y: number;
    /**The code if this tile, if it is a processor. */
    code?: string[];
    /**The links of this tile, if it is a processor. */
    links?: Link[];
    /**The config of this tile. */
    config: BlockConfig;
    /**The rotation of this tile. */
    rotation: Rotation;
    /**All block ids that have logic code. */
    static logicBlocks: string[];
    /**Current logic version. */
    static logicVersion: number;
    constructor(name: string, x: number, y: number, code: string[]);
    constructor(name: string, x: number, y: number, config?: BlockConfig, rotation?: Rotation);
    toString(): string;
    isProcessor(): boolean;
    /**Decompresses a processor config into links and code. */
    static decompressLogicConfig(config: BlockConfig<BlockConfigType.bytearray>): {
        code: string[];
        links: {
            name: string;
            x: number;
            y: number;
        }[];
    };
    readConfig(): void;
    /**Compresses links and code for serialization. */
    static compressLogicConfig({ links, code }: {
        links: Link[];
        code: string[];
    }): number[];
    writeConfig(): void;
    /**Used for displaying config. */
    formatConfig(): string | {
        code: string[] | undefined;
        links: Link[] | undefined;
    };
}
