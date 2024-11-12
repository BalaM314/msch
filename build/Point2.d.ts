/**Partial port of arc.math.geom.Point2 */
export declare class Point2 {
    x: number;
    y: number;
    constructor(x: number, y: number);
    /**Truncates a value to the bounds of a 16-bit signed integer. */
    static castToInt(x: number): number;
    /**Returns the x coordinate of a point represented by a single integer. */
    static x(pos: number): number;
    /**Returns the y coordinate of a point represented by a single integer. */
    static y(pos: number): number;
    /**Packs x and y into a single integer representing a point. */
    static pack(x: number, y: number): number;
    /**Unpacks x and y coordinates from a single integer representing a point. */
    static unpack(point: number): [x: number, y: number];
    /**Creates a Point2 from a number representing a point. */
    static from(point: number): Point2;
    /**Returns a single integer representation of this point. */
    pack(): number;
    toString(): string;
}
