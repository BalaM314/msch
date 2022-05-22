


/**Parses command line args. */
export function parseArgs(args: string[]): [
	parsedArgs: { [index: string]: string; },
	mainArgs: string[]
] {
	let parsedArgs: {
		[index: string]: string;
	} = {};
	let mainArgs: string[] = [];
	let i = 0;
	while (true) {
		i++;
		if (i > 1000) { throw new Error("Too many arguments!"); }
		let arg = args.splice(0, 1)[0];
		if (arg == undefined) break;
		if (arg.startsWith("--")) {
			if (args[0]?.startsWith("-"))
				parsedArgs[arg] = "null";
			else
				parsedArgs[arg.substring(2)] = args.splice(0, 1)[0] ?? "null";
		} else if (arg.startsWith("-")) {
			if (args[0]?.startsWith("-"))
				parsedArgs[arg] = "null";
			else
				parsedArgs[arg.substring(1)] = args.splice(0, 1)[0] ?? "null";
		} else {
			mainArgs.push(arg);
		}
	}
	return [parsedArgs, mainArgs];
}