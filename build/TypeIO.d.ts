import { SmartBuffer } from "./SmartBuffer.js";
import { BlockConfig } from "./BlockConfig.js";
/**
 * Instead of Object, uses BlockConfig, a typed wrapper of values.
 **/
export declare class TypeIO {
    static readObject(buf: SmartBuffer): BlockConfig;
    static writeObject(buf: SmartBuffer, _object: BlockConfig): void;
}
