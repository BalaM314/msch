import { BlockConfigType } from "../types.js";
/**Wrapper for configs that preserves type. */
export class BlockConfig {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
BlockConfig.null = new BlockConfig(BlockConfigType.null, null);
