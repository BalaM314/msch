import { ConfigType, ConfigValue } from "../types.js";

/**Wrapper for configs that preserves type. */
export class Config {
	static null = new Config(ConfigType.null, null);
	constructor(public type: ConfigType, public value: ConfigValue) { }
}