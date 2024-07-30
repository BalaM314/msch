
export class MessageError extends Error {
	name = "Message";
}

export function fail(message:string):never {
	throw new MessageError(message);
}
export function crash(message:string):never {
	throw new Error(message);
}
