import { ConfigType } from "../types";
/**Wrapper for configs that preserves type. */
export class Config {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
Config.null = new Config(ConfigType.null, null);
