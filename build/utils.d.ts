export declare class MessageError extends Error {
    name: string;
}
export declare function fail(message: string): never;
export declare function crash(message: string): never;
