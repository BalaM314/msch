# msch

A library for TypeScript code to interact with Mindustry schematic binaries.

Can serialize and deserialize schematics, decoding config values (extracts processor byteconfig to code and links). Uses NodeJS buffers.

```ts
import { Schematic, BlockConfig, BlockConfigType, ContentType, Unit } from "msch";
import fs from "node:fs/promises";

const code = [`print "Hello 😀"`, `printflush message1`];
const schem = new Schematic(10, 12, 1, {}, [], [
	new Tile("micro-processor", 0, 0, code),
	new Tile("bridge-conveyor", 0, 9, new BlockConfig(BlockConfigType.point, new Point2(-2, 0))),
	new Tile("message", 11, 9, new BlockConfig(BlockConfigType.string, "hello 😀 world")),
	new Tile("air-factory", 7, 1, new BlockConfig(BlockConfigType.content, [ContentType.unit, Unit.flare])),
]);
const buf = schem.write().toBuffer();
await fs.writeFile("out.msch", buf);
const schem2 = Schematic.read(buf);
```

If you are looking for a user interface, see [msch-generate](https://github.com/BalaM314/msch-generate)
