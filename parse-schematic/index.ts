/**
 * WIP
 */
import * as fs from "fs";
import * as path from "path";
import { SmartBuffer } from "./ported/SmartBuffer.js";
import * as zlib from "zlib";
import { parseArgs } from "./funcs.js";
import { Config } from "./classes/Config.js";
import { Schematic } from "./classes/Schematic.js";
import { Point2 } from "./ported/Point2.js";




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
	console.log("Config of tile at 0, 0:", schem.getTileAt(0, 0)?.decompressLogicCode());
	let outputPath = path.join(mainArgs[0], "..", "modified-" + mainArgs[0].split(path.sep).at(-1));
}


try {
	main(process.argv);
} catch (err) {
	console.error("Unhandled runtime error!");
	console.error(err);
	process.exit(1);
}
