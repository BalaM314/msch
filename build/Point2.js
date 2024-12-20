/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/
/**Partial port of arc.math.geom.Point2 */
export class Point2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**Truncates a value to the bounds of a 16-bit signed integer. */
    static castToInt(x) {
        return x >= (2 ** 15) ? x - (2 ** 16) : x;
    }
    /**Returns the x coordinate of a point represented by a single integer. */
    static x(pos) {
        return this.castToInt(pos >>> 16);
    }
    /**Returns the y coordinate of a point represented by a single integer. */
    static y(pos) {
        return this.castToInt(pos & 0xFFFF);
    }
    /**Packs x and y into a single integer representing a point. */
    static pack(x, y) {
        return ((x) << 16) | ((y) & 0xFFFF);
    }
    /**Unpacks x and y coordinates from a single integer representing a point. */
    static unpack(point) {
        return [Point2.x(point), Point2.y(point)];
    }
    /**Creates a Point2 from a number representing a point. */
    static from(point) {
        return new Point2(Point2.x(point), Point2.y(point));
    }
    /**Returns a single integer representation of this point. */
    pack() {
        return Point2.pack(this.x, this.y);
    }
    toString() {
        return `Point2(${this.x}, ${this.y})`;
    }
}
