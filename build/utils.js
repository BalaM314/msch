/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/
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
