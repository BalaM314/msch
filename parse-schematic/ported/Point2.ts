/**Partial port of arc.math.geom.Point2 */
export class Point2 {
	constructor(public x:number, public y:number){}
	static x(pos: number) {
		return pos >>> 16;
	}
	static y(pos: number) {
		return pos & 0xFFFF;
	}
	static pack(x: number, y: number) {
		return ((x) << 16) | ((y) & 0xFFFF);
	}
	static unpack(point: number): Point2 {
		return Point2.from(point);
	}
	static from(point: number): Point2 {
		return new Point2(Point2.x(point), Point2.y(point));
	}
	pack(){
		return Point2.pack(this.x, this.y);
	}
}