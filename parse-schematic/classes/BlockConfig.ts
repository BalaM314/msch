import { BlockConfigType, BlockConfigValue } from "../types.js";

/**Wrapper for configs that preserves type. */
export class BlockConfig {
	/**No config. */
	static null = new BlockConfig(BlockConfigType.null, null);
	constructor(public type: BlockConfigType, public value: BlockConfigValue) { }
}