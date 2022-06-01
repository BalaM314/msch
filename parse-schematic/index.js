/**
 * WIP
 */
import * as fs from "fs";
import { parseArgs } from "./funcs.js";
import { Schematic } from "./classes/Schematic.js";
import { Tile } from "./classes/Tile.js";
function main(argv) {
    const [parsedArgs, mainArgs] = parseArgs(argv);
    const processorCode = [`print "Made with https://github.com/BalaM314/msch"`, `printflush messageSussy`];
    let wallType = "copper-wall";
    if ("help" in parsedArgs || Object.keys(parsedArgs).length == 0) {
        console.log(`MSCH: The best tool to make 3x3 Mindustry schematics consisting of 6 walls and a processor with a sussy link name.

Usage: msch [--help] [--output <output>] [--wall <wall>] [--name <name>]
	--help		Displays this help message and exits.
	--output	The path to the output file.
	--wall		Specifies the type of wall to use.
	--name		Specifies the name of the schematic.`);
        return 0;
    }
    let schem = new Schematic(0, 0, 1, {}, [], []);
    if (parsedArgs["wall"]) {
        if (["copper", "titanium", "thorium", "plastanium", "phase", "surge"].includes(parsedArgs["wall"])) {
            wallType = parsedArgs["wall"] + "-wall";
        }
        else {
            console.warn(`${parsedArgs["wall"]} is not a valid wall type`);
        }
    }
    if (parsedArgs["read"]) {
        try {
            schem = Schematic.from(fs.readFileSync(parsedArgs["read"]));
        }
        catch (err) {
            console.error("Invalid schematic.", err);
            return 1;
        }
        schem.display();
        schem.tags["description"] = "Made with https://github.com/BalaM314/msch";
    }
    else if ("glitch" in parsedArgs) {
        schem = new Schematic(10, 10, 1, {
            name: parsedArgs["name"] ?? "Cursed Router Reactor",
            description: "Hacked with [REDACTED]"
        }, [], [
            new Tile("surge-wall", 0, 0), new Tile("phase-wall", 9, 9),
            new Tile("thruster", 4, 1, undefined, 3), new Tile("thruster", 1, 4, undefined, 2), new Tile("thruster", 7, 4, undefined, 0), new Tile("thruster", 4, 7, undefined, 1),
            new Tile("impact-reactor", 4, 4),
            new Tile("distributor", 6, 6), new Tile("distributor", 6, 2), new Tile("distributor", 2, 6), new Tile("distributor", 2, 2),
        ]);
        console.log("Created cursed schematic.");
        schem.display();
    }
    else {
        schem = new Schematic(3, 3, 1, {
            name: parsedArgs["name"] ?? "Sussy Schematic",
            description: "Hacked with https://github.com/BalaM314/msch"
        }, [], [
            new Tile(wallType, 0, 2), new Tile(wallType, 1, 2), new Tile(wallType, 2, 2),
            new Tile("micro-processor", 0, 1, processorCode), new Tile("message", 2, 1),
            new Tile(wallType, 0, 0), new Tile(wallType, 1, 0), new Tile(wallType, 2, 0)
        ]);
        schem.getTileAt(0, 1).links.push({
            name: "messageSussy",
            x: 2,
            y: 0
        });
    }
    if ("output" in parsedArgs) {
        let outputPath = parsedArgs["output"]?.endsWith(".msch") ? parsedArgs["output"] : parsedArgs["output"] + ".msch";
        fs.writeFileSync(outputPath, schem.write().toBuffer());
        console.log(`Wrote modified file to ${outputPath}.\nNote that you need to place the message first!`);
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
