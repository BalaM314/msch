/**Partial port of arc.math.geom.Point2 */
export class Point2 {
	constructor(public x:number, public y:number){}
	static castToInt(x:number){
		return x >= (2 ** 15) ? x - (2 ** 16) : x;
	}
	static x(pos: number) {
		return this.castToInt(pos >>> 16);
	}
	static y(pos: number) {
		return this.castToInt(pos & 0xFFFF);
	}
	static pack(x: number, y: number) {
		return ((x) << 16) | ((y) & 0xFFFF);
	}
	static unpack(point: number): [x:number, y:number] {
		return [Point2.x(point), Point2.y(point)];
	}
	static from(point: number): Point2 {
		return new Point2(Point2.x(point), Point2.y(point));
	}
	pack(){
		return Point2.pack(this.x, this.y);
	}
}