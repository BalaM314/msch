/**Partial port of arc.math.geom.Point2 */
export class Point2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static castToInt(x) {
        return x >= (2 ** 15) ? x - (2 ** 16) : x;
    }
    static x(pos) {
        return this.castToInt(pos >>> 16);
    }
    static y(pos) {
        return this.castToInt(pos & 0xFFFF);
    }
    static pack(x, y) {
        return ((x) << 16) | ((y) & 0xFFFF);
    }
    static unpack(point) {
        return [Point2.x(point), Point2.y(point)];
    }
    static from(point) {
        return new Point2(Point2.x(point), Point2.y(point));
    }
    pack() {
        return Point2.pack(this.x, this.y);
    }
}
