/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/

export enum ContentType {
	item = 0,
	block = 1,
	mech_UNUSED = 2,
	bullet = 3,
	liquid = 4,
	status = 5,
	unit = 6,
	weather = 7,
	effect_UNUSED = 8,
	sector = 9,
	loadout_UNUSED = 10,
	typeid_UNUSED = 11,
	error = 12,
	planet = 13,
	ammo_UNUSED = 14
}
export enum Item {
	copper = 0,
	lead = 1,
	metaglass = 2,
	graphite = 3,
	sand = 4,
	coal = 5,
	titanium = 6,
	thorium = 7,
	scrap = 8,
	silicon = 9,
	plastanium = 10,
	phase_fabric = 11,
	surge_alloy = 12,
	spore_pod = 13,
	blast_compound = 14,
	pyratite = 15,
	beryllium = 16,
	tungsten = 17,
	oxide = 18,
	carbide = 19,
	fissile_matter = 20,
	dormant_cyst = 21,
}
export enum Liquid {
	water = 0,
	slag = 1,
	oil = 2,
	cryofluid = 3,
	neoplasm = 4,
	arkycite = 5,
	gallium = 6,
	ozone = 7,
	hydrogen = 8,
	nitrogen = 9,
	cyanogen = 10,
}
export enum Unit {
	dagger = 0,
	mace = 1,
	fortress = 2,
	scepter = 3,
	reign = 4,
	nova = 5,
	pulsar = 6,
	quasar = 7,
	vela = 8,
	corvus = 9,
	crawler = 10,
	atrax = 11,
	spiroct = 12,
	arkyid = 13,
	toxopid = 14,
	flare = 15,
	horizon = 16,
	zenith = 17,
	antumbra = 18,
	eclipse = 19,
	mono = 20,
	poly = 21,
	mega = 22,
	quad = 23,
	oct = 24,
	risso = 25,
	minke = 26,
	bryde = 27,
	sei = 28,
	omura = 29,
	retusa = 30,
	oxynoe = 31,
	cyerce = 32,
	aegires = 33,
	navanax = 34,
	alpha = 35,
	beta = 36,
	gamma = 37,
	stell = 38,
	locus = 39,
	precept = 40,
	vanquish = 41,
	conquer = 42,
	merui = 43,
	cleroi = 44,
	anthicus = 45,
	anthicus_missile = 46,
	tecta = 47,
	collaris = 48,
	elude = 49,
	avert = 50,
	obviate = 51,
	quell = 52,
	quell_missile = 53,
	disrupt = 54,
	disrupt_missile = 55,
	renale = 56,
	latum = 57,
	evoke = 58,
	incite = 59,
	emanate = 60,
	block = 61,
	manifold = 62,
	assembly_drone = 63,
	scathe_missile = 64,
	turret_unit_build_tower = 65,
}
export enum Block {
	air = 0, spawn = 1, remove_wall = 2, remove_ore = 3, cliff = 4, build1 = 5, build2 = 6, build3 = 7, build4 = 8, build5 = 9, build6 = 10, build7 = 11, build8 = 12, build9 = 13, build10 = 14, build11 = 15, build12 = 16, build13 = 17, build14 = 18, build15 = 19, build16 = 20, deep_water = 21, shallow_water = 22, tainted_water = 23, deep_tainted_water = 24, darksand_tainted_water = 25, sand_water = 26, darksand_water = 27, tar = 28, pooled_cryofluid = 29, molten_slag = 30, space = 31, empty = 32, stone = 33, crater_stone = 34, char = 35, basalt = 36, hotrock = 37, magmarock = 38, sand_floor = 39, darksand = 40, dirt = 41, mud = 42, dacite = 43, rhyolite = 44, rhyolite_crater = 45, rough_rhyolite = 46, regolith = 47, yellow_stone = 48, carbon_stone = 49, ferric_stone = 50, ferric_craters = 51, beryllic_stone = 52, crystalline_stone = 53, crystal_floor = 54, yellow_stone_plates = 55, red_stone = 56, dense_red_stone = 57, red_ice = 58, arkycite_floor = 59, arkyic_stone = 60, rhyolite_vent = 61, carbon_vent = 62, arkyic_vent = 63, yellow_stone_vent = 64, red_stone_vent = 65, crystalline_vent = 66, redmat = 67, bluemat = 68, grass = 69, salt = 70, snow = 71, ice = 72, ice_snow = 73, shale = 74, moss = 75, core_zone = 76, spore_moss = 77, stone_wall = 78, spore_wall = 79, dirt_wall = 80, dacite_wall = 81, ice_wall = 82, snow_wall = 83, dune_wall = 84, regolith_wall = 85, yellow_stone_wall = 86, rhyolite_wall = 87, carbon_wall = 88, ferric_stone_wall = 89, beryllic_stone_wall = 90, arkyic_wall = 91, crystalline_stone_wall = 92, red_ice_wall = 93, red_stone_wall = 94, red_diamond_wall = 95, sand_wall = 96, salt_wall = 97, shrubs = 98, shale_wall = 99, spore_pine = 100, snow_pine = 101, pine = 102, white_tree_dead = 103, white_tree = 104, spore_cluster = 105, redweed = 106, pur_bush = 107, yellowcoral = 108, boulder = 109, snow_boulder = 110, shale_boulder = 111, sand_boulder = 112, dacite_boulder = 113, basalt_boulder = 114, carbon_boulder = 115, ferric_boulder = 116, beryllic_boulder = 117, yellow_stone_boulder = 118, arkyic_boulder = 119, crystal_cluster = 120, vibrant_crystal_cluster = 121, crystal_blocks = 122, crystal_orbs = 123, crystalline_boulder = 124, red_ice_boulder = 125, rhyolite_boulder = 126, red_stone_boulder = 127, metal_floor = 128, metal_floor_damaged = 129, metal_floor_2 = 130, metal_floor_3 = 131, metal_floor_4 = 132, metal_floor_5 = 133, dark_panel_1 = 134, dark_panel_2 = 135, dark_panel_3 = 136, dark_panel_4 = 137, dark_panel_5 = 138, dark_panel_6 = 139, dark_metal = 140, pebbles = 141, tendrils = 142, ore_copper = 143, ore_lead = 144, ore_scrap = 145, ore_coal = 146, ore_titanium = 147, ore_thorium = 148, ore_beryllium = 149, ore_tungsten = 150, ore_crystal_thorium = 151, ore_wall_thorium = 152, ore_wall_beryllium = 153, graphitic_wall = 154, ore_wall_tungsten = 155, graphite_press = 156, multi_press = 157, silicon_smelter = 158, silicon_crucible = 159, kiln = 160, plastanium_compressor = 161, phase_weaver = 162, surge_smelter = 163, cryofluid_mixer = 164, pyratite_mixer = 165, blast_mixer = 166, melter = 167, separator = 168, disassembler = 169, spore_press = 170, pulverizer = 171, coal_centrifuge = 172, incinerator = 173, silicon_arc_furnace = 174, electrolyzer = 175, atmospheric_concentrator = 176, oxidation_chamber = 177, electric_heater = 178, slag_heater = 179, phase_heater = 180, heat_redirector = 181, heat_router = 182, slag_incinerator = 183, carbide_crucible = 184, slag_centrifuge = 185, surge_crucible = 186, cyanogen_synthesizer = 187, phase_synthesizer = 188, heat_reactor = 189, copper_wall = 190, copper_wall_large = 191, titanium_wall = 192, titanium_wall_large = 193, plastanium_wall = 194, plastanium_wall_large = 195, thorium_wall = 196, thorium_wall_large = 197, phase_wall = 198, phase_wall_large = 199, surge_wall = 200, surge_wall_large = 201, door = 202, door_large = 203, scrap_wall = 204, scrap_wall_large = 205, scrap_wall_huge = 206, scrap_wall_gigantic = 207, thruster = 208, beryllium_wall = 209, beryllium_wall_large = 210, tungsten_wall = 211, tungsten_wall_large = 212, blast_door = 213, reinforced_surge_wall = 214, reinforced_surge_wall_large = 215, carbide_wall = 216, carbide_wall_large = 217, shielded_wall = 218, mender = 219, mend_projector = 220, overdrive_projector = 221, overdrive_dome = 222, force_projector = 223, shock_mine = 224, radar = 225, build_tower = 226, regen_projector = 227, shockwave_tower = 228, shield_projector = 229, large_shield_projector = 230, conveyor = 231, titanium_conveyor = 232, plastanium_conveyor = 233, armored_conveyor = 234, junction = 235, bridge_conveyor = 236, phase_conveyor = 237, sorter = 238, inverted_sorter = 239, router = 240, distributor = 241, overflow_gate = 242, underflow_gate = 243, mass_driver = 244, duct = 245, armored_duct = 246, duct_router = 247, overflow_duct = 248, underflow_duct = 249, duct_bridge = 250, duct_unloader = 251, surge_conveyor = 252, surge_router = 253, unit_cargo_loader = 254, unit_cargo_unload_point = 255, mechanical_pump = 256, rotary_pump = 257, impulse_pump = 258, conduit = 259, pulse_conduit = 260, plated_conduit = 261, liquid_router = 262, liquid_container = 263, liquid_tank = 264, liquid_junction = 265, bridge_conduit = 266, phase_conduit = 267, reinforced_pump = 268, reinforced_conduit = 269, reinforced_liquid_junction = 270, reinforced_bridge_conduit = 271, reinforced_liquid_router = 272, reinforced_liquid_container = 273, reinforced_liquid_tank = 274, power_node = 275, power_node_large = 276, surge_tower = 277, diode = 278, battery = 279, battery_large = 280, combustion_generator = 281, thermal_generator = 282, steam_generator = 283, differential_generator = 284, rtg_generator = 285, solar_panel = 286, solar_panel_large = 287, thorium_reactor = 288, impact_reactor = 289, beam_node = 290, beam_tower = 291, beam_link = 292, turbine_condenser = 293, chemical_combustion_chamber = 294, pyrolysis_generator = 295, flux_reactor = 296, neoplasia_reactor = 297, mechanical_drill = 298, pneumatic_drill = 299, laser_drill = 300, blast_drill = 301, water_extractor = 302, cultivator = 303, oil_extractor = 304, vent_condenser = 305, cliff_crusher = 306, plasma_bore = 307, large_plasma_bore = 308, impact_drill = 309, eruption_drill = 310, core_shard = 311, core_foundation = 312, core_nucleus = 313, core_bastion = 314, core_citadel = 315, core_acropolis = 316, container = 317, vault = 318, unloader = 319, reinforced_container = 320, reinforced_vault = 321, duo = 322, scatter = 323, scorch = 324, hail = 325, wave = 326, lancer = 327, arc = 328, parallax = 329, swarmer = 330, salvo = 331, segment = 332, tsunami = 333, fuse = 334, ripple = 335, cyclone = 336, foreshadow = 337, spectre = 338, meltdown = 339, breach = 340, diffuse = 341, sublimate = 342, titan = 343, disperse = 344, afflict = 345, lustre = 346, scathe = 347, smite = 348, malign = 349, ground_factory = 350, air_factory = 351, naval_factory = 352, additive_reconstructor = 353, multiplicative_reconstructor = 354, exponential_reconstructor = 355, tetrative_reconstructor = 356, repair_point = 357, repair_turret = 358, tank_fabricator = 359, ship_fabricator = 360, mech_fabricator = 361, tank_refabricator = 362, ship_refabricator = 363, mech_refabricator = 364, prime_refabricator = 365, tank_assembler = 366, ship_assembler = 367, mech_assembler = 368, basic_assembler_module = 369, unit_repair_tower = 370, payload_conveyor = 371, payload_router = 372, reinforced_payload_conveyor = 373, reinforced_payload_router = 374, payload_mass_driver = 375, large_payload_mass_driver = 376, small_deconstructor = 377, deconstructor = 378, constructor = 379, large_constructor = 380, payload_loader = 381, payload_unloader = 382, power_source = 383, power_void = 384, item_source = 385, item_void = 386, liquid_source = 387, liquid_void = 388, payload_source = 389, payload_void = 390, heat_source = 391, illuminator = 392, legacy_mech_pad = 393, legacy_unit_factory = 394, legacy_unit_factory_air = 395, legacy_unit_factory_ground = 396, command_center = 397, launch_pad = 398, interplanetary_accelerator = 399, message = 400, switch = 401, micro_processor = 402, logic_processor = 403, hyper_processor = 404, memory_cell = 405, memory_bank = 406, logic_display = 407, large_logic_display = 408, canvas = 409, reinforced_message = 410, world_processor = 411, world_cell = 412, world_message = 413, world_switch = 414,
}
export enum UnitCommand {
	move = 0,
	repair = 1,
	rebuild = 2,
	assist = 3,
	mine = 4,
	boost = 5,
}

[Block, ContentType, Item, Liquid, Unit, UnitCommand].forEach(o => Object.setPrototypeOf(o, null));

/**0 is right, 1 is up, 2 is left, 3 is down. */
export type Rotation = 0 | 1 | 2 | 3;

export type Link = {
	name: string;
	x: number;
	y: number;
}
