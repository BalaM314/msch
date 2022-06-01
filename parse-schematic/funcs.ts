/**Parses command line args. */
export function parseArgs(
	args: string[]
): [parsedArgs: { [index: string]: string|undefined }, mainArgs: string[]] {
	let parsedArgs: {
		[index: string]: string;
	} = {};
	let mainArgs: string[] = [];
	let i = 0;
	while (true) {
		i++;
		if (i > 1000) {
			throw new Error("Too many arguments!");
		}
		let arg = args.splice(0, 1)[0];
		if (arg == undefined) break;
		if (arg.startsWith("--")) {
			if (args[0]?.startsWith("-")) parsedArgs[arg.substring(2)] = "null";
			else parsedArgs[arg.substring(2)] = args.splice(0, 1)[0] ?? "null";
		} else if (arg.startsWith("-")) {
			if (args[0]?.startsWith("-")) parsedArgs[arg.substring(1)] = "null";
			else parsedArgs[arg.substring(1)] = args.splice(0, 1)[0] ?? "null";
		} else {
			mainArgs.push(arg);
		}
	}
	return [parsedArgs, mainArgs];
}

export function toHexCodes(buf: Buffer) {
	return Array.from(buf).map(el =>
		("00" + el.toString(16).toUpperCase()).slice(-2)
	);
}

export function fromHexCodes(str: string): Buffer {
	return Buffer.from(str.split(" ").map(el => parseInt(el, 16)));
}
