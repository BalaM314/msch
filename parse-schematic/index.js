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
    let tile = schem.getTileAt(0, 0);
    if (tile?.isProcessor()) {
        let code = tile.code;
        console.log("Code of proc at 0, 0: ", code);
        console.log(`Replacing "hello world" with "hi mom"`);
        tile.code = code.map(line => line.replaceAll("hello world", "hi mom"));
        console.log(`Adding link to messageSussy (two tiles right)`);
        tile.links[0] = {
            name: "messageSussy",
            x: 2,
            y: 0
        };
        let outputPath = path.join(mainArgs[0], "..", "modified-" + mainArgs[0].split(path.sep).at(-1));
        schem.tags["description"] = "Modified";
        schem.tags["name"] = schem.tags["name"] + "-modified";
        fs.writeFileSync(outputPath, schem.write().toBuffer());
        console.log(`Wrote modified file to ${outputPath}`);
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
