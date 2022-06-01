/**Partial port of arc.math.geom.Point2 */
export class Point2 {
	constructor(public x:number, public y:number){}
	/**Truncates a value to the bounds of a 16-bit signed integer. */
	static castToInt(x:number){
		return x >= (2 ** 15) ? x - (2 ** 16) : x;
	}
	/**Returns the x coordinate of a point represented by a single integer. */
	static x(pos: number) {
		return this.castToInt(pos >>> 16);
	}
	/**Returns the y coordinate of a point represented by a single integer. */
	static y(pos: number) {
		return this.castToInt(pos & 0xFFFF);
	}
	/**Packs x and y into a single integer representing a point. */
	static pack(x: number, y: number) {
		return ((x) << 16) | ((y) & 0xFFFF);
	}
	/**Unpacks x and y coordinates from a single integer representing a point. */
	static unpack(point: number): [x:number, y:number] {
		return [Point2.x(point), Point2.y(point)];
	}
	/**Creates a Point2 from a number representing a point. */
	static from(point: number): Point2 {
		return new Point2(Point2.x(point), Point2.y(point));
	}
	/**Returns a single integer representation of this point. */
	pack(){
		return Point2.pack(this.x, this.y);
	}
}