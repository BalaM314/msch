import { ConfigType } from "../types.js";
/**Wrapper for configs that preserves type. */
export class Config {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
Config.null = new Config(ConfigType.null, null);
