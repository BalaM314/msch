/**
 * WIP
 */
import * as fs from "fs";
import { parseArgs } from "./funcs.js";
import { Schematic } from "./parse-schematic/classes/Schematic.js";
import { Tile } from "./parse-schematic/classes/Tile.js";
import { Point2 } from "./parse-schematic/ported/Point2.js";
import { TypeIO } from "./parse-schematic/ported/TypeIO.js";
import { BlockConfig } from "./parse-schematic/classes/BlockConfig.js";
import { BlockConfigType } from "./parse-schematic/types.js";




function main(argv: string[]) {
	const [parsedArgs, mainArgs] = parseArgs(argv);
	if("help" in parsedArgs || Object.keys(parsedArgs).length == 0){
		console.log(
`MSCH: WIP mindustry schematic parser.

Usage: msch [--help] [--output <output>] [--read <filename>] [--interactive] [--verbose]
	--read			The path to the file to load as a schematic.
	--verbose		Whether to be verbose when displaying the loaded schematic. WARNING: may spam console.
	--help			Displays this help message and exits.
	--output		The path to the output file.
	--interactive	Starts a shell, allowing you to edit the schematic by typing JS code.`
		);
		return 0;
	}
	let schem:Schematic = Schematic.blank;

	if(parsedArgs["read"]){
		try {
			schem = Schematic.from(fs.readFileSync(parsedArgs["read"]));
		} catch(err){
			console.error("Invalid schematic.", err);
			return 1;
		}
		schem.display("verbose" in parsedArgs);
		schem.tags["description"] = "Made with https://github.com/BalaM314/msch";
	}
	if("interactive" in parsedArgs){
		console.log("Interactive JavaScript shell, type .exit or Ctrl+C to exit.");
		console.log("The schematic variable is \`schem\`.");
		let help = "Type .help for help.";
		process.stdout.write("\n> ");
		process.stdin.on("data", (data) => {
			let line = data.toString().split(/\r?\n/g)[0];
			if(line.startsWith(".")){
				if(line == ".exit"){
					process.exit(0);
				} else if(line.startsWith(".output")){
					if(line.split(".output ")[1]){
						let outputPath = line.split(".output")[1]?.endsWith(".msch") ? line.split(".output")[1] : line.split(".output")[1] + ".msch";
						fs.writeFileSync(outputPath, schem.write().toBuffer());
						console.log(`Wrote modified file to ${outputPath}.`);
					} else {
						console.log(`Usage: .output <filename>`)
					}
				} else if(line.startsWith(".name")){
					if(line.split(".name ")[1]){
						schem.tags["name"] = line.split(".name ")[1];
						console.log(`Set name to ${line.split(".name ")[1]}`);
					} else {
						console.log(`Usage: .name <name>`)
					}
				} else if(line.startsWith(".description")){
					if(line.split(".description ")[1]){
						schem.tags["description"] = line.split(".description ")[1];
						console.log(`Set description to ${line.split(".description ")[1]}`);
					} else {
						console.log(`Usage: .description <description>`)
					}
				} else {
					console.log("Invalid command.");
				}
			} else {
				try {
					console.log(eval(line));//OH NO ITS NOT SAFE
				} catch(err){
					console.error(err);
				}
			}
			process.stdout.write("\n> ");
		})
	}
}


try {
	main(process.argv);
} catch (err) {
	console.error("Unhandled runtime error!");
	console.error(err);
	process.exit(1);
}
