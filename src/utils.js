export class MessageError extends Error {
    constructor() {
        super(...arguments);
        this.name = "Message";
    }
}
export function fail(message) {
    throw new MessageError(message);
}
export function crash(message) {
    throw new Error(message);
}
