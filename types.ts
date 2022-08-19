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
export enum ContentType {
	item = 0,
	block = 1,
	mech_UNUSED = 2,
	bullet = 3,
	liquid = 4,
	status = 5,
	unit = 6,
	weather = 7,
	effect_UNUSED = 8,
	sector = 9,
	loadout_UNUSED = 10,
	typeid_UNUSED = 11,
	error = 12,
	planet = 13,
	ammo_UNUSED = 14
}
export enum Item {
	copper = 0,
	lead = 1,
	metaglass = 2,
	graphite = 3,
	sand = 4,
	coal = 5,
	titanium = 6,
	thorium = 7,
	scrap = 8,
	silicon = 9,
	plastanium = 10,
	phase_fabric = 11,
	surge_alloy = 12,
	spore_pod = 13,
	blast_compound = 14,
	pyratite = 15,
}
export type BlockConfigValue = null | number | bigint | string | [type: number, id: number] | number[] | Point2 | Point2[] | boolean | boolean[];

/**0 is right, 1 is up, 2 is left, 3 is down. */
export type Rotation = 0 | 1 | 2 | 3;

export interface Link {
	name: string;
	x: number;
	y: number;
}
