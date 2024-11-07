import { Point2 } from "./Point2.js";
import { ContentType } from "./types.js";
export declare enum BlockConfigType {
    null = 0,
    int = 1,
    long = 2,
    float = 3,
    string = 4,
    content = 5,
    intarray = 6,
    point = 7,
    pointarray = 8,
    boolean = 10,
    double = 11,
    building = 12,
    /** @deprecated use `BlockConfigType.building` instead, this is wrong */
    buildingbox = 12,
    bytearray = 14,
    booleanarray = 16,
    /**
     * @deprecated Warning: this means an actual in-game unit (by its id, which is only valid for one game), not a unit type.
     * If you want a unit type, see {@link BlockConfigType.content} with content type {@link ContentType.unit}
     */
    unit = 17
}
export type BlockConfigMapping = {
    [BlockConfigType.null]: null;
    [BlockConfigType.int]: number;
    [BlockConfigType.long]: bigint;
    [BlockConfigType.float]: number;
    [BlockConfigType.string]: string | null;
    [BlockConfigType.content]: readonly [type: ContentType, id: number];
    [BlockConfigType.intarray]: number[];
    [BlockConfigType.point]: Point2;
    [BlockConfigType.pointarray]: Point2[];
    [BlockConfigType.boolean]: boolean;
    [BlockConfigType.double]: number;
    [BlockConfigType.building]: Point2;
    [BlockConfigType.bytearray]: number[];
    [BlockConfigType.booleanarray]: boolean[];
    [BlockConfigType.unit]: number;
};
export type BlockConfigValue = BlockConfigMapping[BlockConfigType];
/**Wrapper for configs that preserves type. For better inference, use `BlockConfig.DU` */
export declare class BlockConfig<Type extends BlockConfigType = BlockConfigType> {
    type: Type;
    value: BlockConfigMapping[Type];
    /**No config. */
    static null: BlockConfig<BlockConfigType.null>;
    constructor(type: Type, value: BlockConfigMapping[Type]);
}
export declare namespace BlockConfig {
    /** BlockConfig as a discriminated union for better type inference. */
    type DU = BlockConfigType extends infer T extends BlockConfigType ? T extends unknown ? BlockConfig<T> : never : never;
}
