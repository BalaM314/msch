export var BlockConfigType;
(function (BlockConfigType) {
    BlockConfigType[BlockConfigType["null"] = 0] = "null";
    BlockConfigType[BlockConfigType["int"] = 1] = "int";
    BlockConfigType[BlockConfigType["long"] = 2] = "long";
    BlockConfigType[BlockConfigType["float"] = 3] = "float";
    BlockConfigType[BlockConfigType["string"] = 4] = "string";
    BlockConfigType[BlockConfigType["content"] = 5] = "content";
    BlockConfigType[BlockConfigType["intarray"] = 6] = "intarray";
    BlockConfigType[BlockConfigType["point"] = 7] = "point";
    BlockConfigType[BlockConfigType["pointarray"] = 8] = "pointarray";
    //techNode = 9,
    BlockConfigType[BlockConfigType["boolean"] = 10] = "boolean";
    BlockConfigType[BlockConfigType["double"] = 11] = "double";
    BlockConfigType[BlockConfigType["building"] = 12] = "building";
    BlockConfigType[BlockConfigType["buildingbox"] = 12] = "buildingbox";
    //laccess = 13,
    BlockConfigType[BlockConfigType["bytearray"] = 14] = "bytearray";
    BlockConfigType[BlockConfigType["booleanarray"] = 16] = "booleanarray";
    BlockConfigType[BlockConfigType["unit"] = 17] = "unit";
})(BlockConfigType || (BlockConfigType = {}));
;
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
