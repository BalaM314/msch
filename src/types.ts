/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/

export type Truthy<T> = T extends (false | undefined | null) ? never : T;

declare global {
	interface Array<T> {
		filter(predicate:BooleanConstructor):Array<Truthy<T>>;
	}
}

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

/**0 is right, 1 is up, 2 is left, 3 is down. */
export type Rotation = 0 | 1 | 2 | 3;

export interface Link {
	name: string;
	x: number;
	y: number;
}
