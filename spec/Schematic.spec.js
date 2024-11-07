import "jasmine";
import path from "path";
import * as fs from "node:fs/promises";
import { Schematic } from "../src/Schematic.js";
import { Tile } from "../src/Tile.js";
import { fail } from "../src/utils.js";
import { BlockConfig, BlockConfigType } from "../src/BlockConfig.js";
import { Point2 } from "../src/Point2.js";
import { ContentType } from "../src/types.js";
const schemsDir = path.resolve("./spec/binaries");
const files = await Promise.all((await fs.readdir(schemsDir)).filter(n => n.endsWith(".msch")).map(async (file) => [file, await fs.readFile(path.join("./spec/binaries", file), null)]));
describe("Schematic parsing", () => {
    for (const [file, data] of files) {
        it(`should parse the binary file ${file}`, () => {
            const result = Schematic.read(data);
            if (typeof result == "string")
                fail(result);
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
        if (typeof schem2 == "string")
            fail(schem2);
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
        const configFlare = [ContentType.unit, 15];
        const schem = new Schematic(10, 12, 1, {}, [], [
            new Tile("micro-processor", 0, 0, code),
            new Tile("bridge-conveyor", 0, 9, new BlockConfig(BlockConfigType.point, bridgeConfig)),
            new Tile("message", 11, 9, new BlockConfig(BlockConfigType.string, message)),
            new Tile("air-factory", 7, 1, new BlockConfig(BlockConfigType.content, configFlare)),
        ]);
        const buf = schem.write().toBuffer();
        const schem2 = Schematic.read(buf);
        if (typeof schem2 == "string")
            fail(schem2);
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
