/**
 * WIP
 */
import * as fs from "fs";
import * as path from "path";
import { parseArgs } from "./funcs.js";
import { Schematic } from "./classes/Schematic.js";
import { Tile } from "./classes/Tile.js";




function main(argv: string[]) {
	const [parsedArgs, mainArgs] = parseArgs(argv.slice(2));
	if (!mainArgs[0]) {
		console.error("Please specify a schematic file to load");
		return 1;
	}
	console.log(`Loading schematic ${mainArgs[0]}`);
	let schem = Schematic.from(fs.readFileSync(mainArgs[0]));
	console.log(`Loaded schematic ${mainArgs[0]}`);
	schem.displayTiles();
	let code = Tile.decompressLogicCode(schem.getTileAt(0, 0)!.config.value as number[])
	console.log("Code of proc at 0, 0: ", code);
	console.log(`Replacing "hello world" with "hi mom"`);
	schem.getTileAt(0, 0)!.config.value = Tile.compressLogicCode(code.map(line => line.replaceAll("hello world", "hi mom")));
	let outputPath = path.join(mainArgs[0], "..", "modified-" + mainArgs[0].split(path.sep).at(-1));
	schem.tags["description"] = "Modified";
	fs.writeFileSync(outputPath, schem.write().toBuffer());
	console.log(`Wrote modified file to ${outputPath}`);
}


try {
	main(process.argv);
} catch (err) {
	console.error("Unhandled runtime error!");
	console.error(err);
	process.exit(1);
}
