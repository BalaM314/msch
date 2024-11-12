import { SmartBuffer } from "./SmartBuffer.js";
import { Tile } from "./Tile.js";
export type TileGrid = (Tile | null)[][];
export declare class Schematic {
    height: number;
    width: number;
    /** Currently, the only version is 1 */
    version: number;
    tags: Record<string, string>;
    labels: string[];
    /**Magic header bytes that must be present at the start of a schematic file. */
    static headerBytes: number[];
    /**Blank schematic. */
    static blank: Schematic;
    /**Tiles arranged in a grid. */
    tiles: TileGrid;
    constructor(height: number, width: number, 
    /** Currently, the only version is 1 */
    version: number, tags: Record<string, string>, labels: string[], tiles: Tile[]);
    /**
     * Creates a new Schematic from serialized data.
     * @param { Buffer } inputData A buffer containing the data.
     * @param maxSize Defaults to 128. Schematics larger than this size cannot be read by Mindustry without mods.
     * @returns { Schematic } the loaded schematic.
     */
    static read(inputData: Buffer, maxSize?: number): Schematic | string;
    /**Loads decompressable configs from compressed data. */
    readConfigs(): void;
    /**Compresses configs to be saved. */
    writeConfigs(): void;
    /**
     * Serializes this schematic.
     * @returns { SmartBuffer } The output data.
     */
    write(): SmartBuffer;
    /**
     * Generates the block map needed to save tiles.
     */
    static getBlockMap(unsortedTiles: Tile[]): [allNames: string[], mapping: Array<readonly [Tile, number]>];
    /**
     * Sorts a list of tiles into a grid.
     * @param { Tile[] } tiles List of tiles to sort
     * @param { number } width Width that the resulting 2D array should be
     * @param { number } height Height that the resulting 2D array should have
     * @returns { (Tile|null)[][] } Tiles sorted into a grid.
     */
    static sortTiles(tiles: Tile[], width: number, height: number): TileGrid;
    /**
     *
     * @param { (Tile|null)[][] } tiles A grid of tiles to unsort.
     * @returns { Tile[] } List of unsorted tiles.
     */
    static unsortTiles(tiles: TileGrid): Tile[];
    /**
     * Display a schematic to console.
     * @param verbose Whether to also print block configs. Warning, may spam console.
     */
    display(verbose: boolean): void;
    /**
     * Gets a tile.
     * @param { number } x
     * @param { number } y
     * @returns { Tile | null } The tile found, or null.
     */
    getTileAt(x: number, y: number): Tile | null;
    /**
     * Sets a tile.
     * @param { number } x
     * @param { number } y
     * @param { Tile } tile The tile to set.
     */
    setTileAt(x: number, y: number, tile: Tile): void;
}
