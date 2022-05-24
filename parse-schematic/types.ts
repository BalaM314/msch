import { Point2 } from "./ported/Point2.js";


export enum BlockConfigType {
	null = 0,
	int = 1,
	long = 2,
	float = 3,
	string = 4,
	content = 5,
	intarray = 6,
	point = 7,
	pointarray = 8,
	//techNode = 9,
	boolean = 10,
	double = 11,
	building = 12,
	buildingbox = 12,
	//laccess = 13,
	bytearray = 14,
	booleanarray = 16,
	unit = 17,
};
export type BlockConfigValue = null | number | bigint | string | [type: number, id: number] | number[] | Point2 | Point2[] | boolean;
export interface SchematicData {
	info: {
		name: string;
		description?: string;
		authors: string[];
	}
	tiles: {
		grid: string[][];
		configs: {
			[name: string]: SchematicConfig;
		};
		programs: {
			[name: string]: string[] | string;//if string then interpret it as a path
		}
	}
	consts: {
		[name: string]: string;
	}
};
export interface SchematicConfig {
	id: string;
	links?: string[];
	config?: string | boolean;//this may or may not work
}
