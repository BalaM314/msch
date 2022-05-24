/**
 * WIP
 */
import * as fs from "fs";
import { parseArgs } from "./funcs.js";
import { Schematic } from "./classes/Schematic.js";
import { Tile } from "./classes/Tile.js";
function main(argv) {
    const [parsedArgs, mainArgs] = parseArgs(argv);
    const mark = `print "Made with https://github.com/BalaM314/msch"`;
    let schem = new Schematic(3, 3, 1, {
        name: "Sussy Schematic",
        description: "Hacked with https://github.com/BalaM314/msch"
    }, [], [
        new Tile("copper-wall", 0, 2), new Tile("copper-wall", 1, 2), new Tile("copper-wall", 2, 2),
        new Tile("micro-processor", 0, 1, [mark]), new Tile("message", 2, 1),
        new Tile("copper-wall", 0, 0), new Tile("copper-wall", 1, 0), new Tile("copper-wall", 2, 0)
    ]);
    schem.getTileAt(0, 1).links.push({
        name: "messageSussy",
        x: 0,
        y: 2
    });
    if ("output" in parsedArgs) {
        let outputPath = parsedArgs["output"].endsWith(".msch") ? parsedArgs["output"] : parsedArgs["output"] + ".msch";
        fs.writeFileSync(outputPath, schem.write().toBuffer());
        console.log(`Wrote modified file to ${outputPath}.`);
    }
    else {
        console.log(`Use the --output flag to specify the location to output the schematic.`);
    }
}
try {
    main(process.argv);
}
catch (err) {
    console.error("Unhandled runtime error!");
    console.error(err);
    process.exit(1);
}
