/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/

import "jasmine";
import path from "node:path";
import fs from "node:fs/promises";
import { Schematic } from "../../build/Schematic.js";
import { Tile } from "../../build/Tile.js";
import { fail } from "../../build/utils.js";
import { BlockConfig, BlockConfigType } from "../../build/BlockConfig.js";
import { Point2 } from "../../build/Point2.js";
import { ContentType } from "../../build/types.js";

const schemsDir = path.resolve("./spec/binaries");
const files = await Promise.all((await fs.readdir(schemsDir)).filter(n => n.endsWith(".msch")).map(async file =>
	[file, await fs.readFile(path.join("./spec/binaries", file), null)] as const
));
describe("Schematic parsing", () => {
	for(const [file, data] of files) {
		it(`should parse the binary file ${file}`, () => {
			const result = Schematic.read(data);
			if(typeof result == "string") fail(result);
		});
	}
});
describe("Schematic creation", () => {
	it("should create a simple schematic, serialize it, and deserialize it", () => {
		const schem = new Schematic(10, 12, 1, {}, [], [
			new Tile("copper-wall", 0, 0),
			new Tile("plastanium-wall", 0, 9),
			new Tile("thorium-wall", 11, 9),
			new Tile("phase-wall", 11, 0),
			new Tile("conveyor", 5, 5, BlockConfig.null, 2)
		]);
		const buf = schem.write().toBuffer();
		const schem2 = Schematic.read(buf);
		if(typeof schem2 == "string") fail(schem2);
		expect(schem.height).toEqual(schem2.height);
		expect(schem.width).toEqual(schem2.width);
		expect(schem2.getTileAt(0, 0)?.name).toEqual("copper-wall");
		expect(schem2.getTileAt(0, 9)?.name).toEqual("plastanium-wall");
		expect(schem2.getTileAt(11, 9)?.name).toEqual("thorium-wall");
		expect(schem2.getTileAt(11, 0)?.name).toEqual("phase-wall");
		expect(schem2.getTileAt(5, 5)?.rotation).toEqual(2);
	});
	it("should create a complex schematic, serialize it, and deserialize it", () => {
		const message = "hello 😀 world";
		const code = [`print "Hello 😀"`, `printflush message1`];
		const bridgeConfig = new Point2(-2, 0);
		const configFlare = [ContentType.unit, 15] as const;
		const schem = new Schematic(10, 12, 1, {}, [], [
			new Tile("micro-processor", 0, 0, code),
			new Tile("bridge-conveyor", 0, 9, new BlockConfig(BlockConfigType.point, bridgeConfig)),
			new Tile("message", 11, 9, new BlockConfig(BlockConfigType.string, message)),
			new Tile("air-factory", 7, 1, new BlockConfig(BlockConfigType.content, configFlare)),
		]);
		const buf = schem.write().toBuffer();
		const schem2 = Schematic.read(buf);
		if(typeof schem2 == "string") fail(schem2);
		expect(schem.height).toEqual(schem2.height);
		expect(schem.width).toEqual(schem2.width);
		expect(schem.getTileAt(0, 0)?.code).toEqual(code);
		expect(schem.getTileAt(0, 9)?.config.value).toEqual(bridgeConfig);
		expect(schem.getTileAt(11, 9)?.config.value).toEqual(message);
		expect(schem.getTileAt(7, 1)?.config.value).toEqual(configFlare);
	});
	it("should throw an error if tiles are outside the schematic size", () => {
		expect(() => new Schematic(10, 12, 1, {}, [], [
			new Tile("copper-wall", 0, 0),
			new Tile("plastanium-wall", 0, 9),
			new Tile("thorium-wall", 12, 9),
			new Tile("phase-wall", 11, 0),
		])).toThrow();
	});
});

