import "jasmine";
import path from "path";
import * as fs from "node:fs/promises";
import { Schematic } from "../src/Schematic.js";

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

