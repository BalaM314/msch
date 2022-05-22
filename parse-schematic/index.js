/**
 * WIP
 */
import * as fs from "fs";
import * as path from "path";
import { parseArgs } from "./funcs.js";
import { Schematic } from "./classes/Schematic.js";
function main(argv) {
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
}
catch (err) {
    console.error("Unhandled runtime error!");
    console.error(err);
    process.exit(1);
}
