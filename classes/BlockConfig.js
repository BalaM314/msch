/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/
import { BlockConfigType } from "../types.js";
/**Wrapper for configs that preserves type. */
export class BlockConfig {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
/**No config. */
BlockConfig.null = new BlockConfig(BlockConfigType.null, null);
