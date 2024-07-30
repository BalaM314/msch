/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/
export var ContentType;
(function (ContentType) {
    ContentType[ContentType["item"] = 0] = "item";
    ContentType[ContentType["block"] = 1] = "block";
    ContentType[ContentType["mech_UNUSED"] = 2] = "mech_UNUSED";
    ContentType[ContentType["bullet"] = 3] = "bullet";
    ContentType[ContentType["liquid"] = 4] = "liquid";
    ContentType[ContentType["status"] = 5] = "status";
    ContentType[ContentType["unit"] = 6] = "unit";
    ContentType[ContentType["weather"] = 7] = "weather";
    ContentType[ContentType["effect_UNUSED"] = 8] = "effect_UNUSED";
    ContentType[ContentType["sector"] = 9] = "sector";
    ContentType[ContentType["loadout_UNUSED"] = 10] = "loadout_UNUSED";
    ContentType[ContentType["typeid_UNUSED"] = 11] = "typeid_UNUSED";
    ContentType[ContentType["error"] = 12] = "error";
    ContentType[ContentType["planet"] = 13] = "planet";
    ContentType[ContentType["ammo_UNUSED"] = 14] = "ammo_UNUSED";
})(ContentType || (ContentType = {}));
export var Item;
(function (Item) {
    Item[Item["copper"] = 0] = "copper";
    Item[Item["lead"] = 1] = "lead";
    Item[Item["metaglass"] = 2] = "metaglass";
    Item[Item["graphite"] = 3] = "graphite";
    Item[Item["sand"] = 4] = "sand";
    Item[Item["coal"] = 5] = "coal";
    Item[Item["titanium"] = 6] = "titanium";
    Item[Item["thorium"] = 7] = "thorium";
    Item[Item["scrap"] = 8] = "scrap";
    Item[Item["silicon"] = 9] = "silicon";
    Item[Item["plastanium"] = 10] = "plastanium";
    Item[Item["phase_fabric"] = 11] = "phase_fabric";
    Item[Item["surge_alloy"] = 12] = "surge_alloy";
    Item[Item["spore_pod"] = 13] = "spore_pod";
    Item[Item["blast_compound"] = 14] = "blast_compound";
    Item[Item["pyratite"] = 15] = "pyratite";
})(Item || (Item = {}));
