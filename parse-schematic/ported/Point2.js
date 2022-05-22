/**Partial port of arc.math.geom.Point2 */
export class Point2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static x(pos) {
        return pos >>> 16;
    }
    static y(pos) {
        return pos & 0xFFFF;
    }
    static pack(x, y) {
        return ((x) << 16) | ((y) & 0xFFFF);
    }
    static unpack(point) {
        return Point2.from(point);
    }
    static from(point) {
        return new Point2(Point2.x(point), Point2.y(point));
    }
    pack() {
        return Point2.pack(this.x, this.y);
    }
}
