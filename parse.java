/*
Copyright © <BalaM314>, 2024.
This file is part of msch.
msch is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
msch is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with msch. If not, see <https://www.gnu.org/licenses/>.
*/

import java.io.*;
import java.util.*;
import java.util.zip.*;
  
public class Main {
	static byte[] header = {'m', 's', 'c', 'h'};
	public static void main(String[] args) throws IOException {
		DataInputStream input = new DataInputStream(new FileInputStream(new File("../schems/morewalls.msch")));

		for(byte b : header){
			if(input.read() != b){
				throw new IOException("Not a schematic file (missing header).");
			}
		}

		int ver = input.read();
		System.out.println(ver);

		try(DataInputStream stream = new DataInputStream(new InflaterInputStream(input))){
			short width = stream.readShort(), height = stream.readShort();
			System.out.println(String.format("Size: %dx%d", width, height));

			int tags = stream.readUnsignedByte();
			for(int i = 0; i < tags; i++){
				System.out.println(String.format("Tag: (%s | %s)", stream.readUTF(), stream.readUTF()));
			}

			HashMap<Integer, String> blocks = new HashMap<Integer, String>();
			byte numBlocks = stream.readByte();
			for(int i = 0; i < numBlocks; i ++){
				String name = stream.readUTF();
				blocks.put(i, name);
				System.out.println(String.format("Block %d: %s", i, name));
			}

			int numTiles = stream.readInt();
			for(int i = 0; i < numTiles; i ++){
				String block = blocks.get((int)stream.readByte());
				int position = stream.readInt();
				Object config = readObject(stream);
				byte rotation = stream.readByte();
				System.out.println(String.format("%s at %d,%d with config %s rotation %d", block, Point2.x(position), Point2.y(position), config, rotation));
			}


		}
		
	}

	public static class Point2 {
		public static short x(int pos){
			return (short)(pos >>> 16);
    }

    /** @return the y component of a packed position. */
    public static short y(int pos){
			return (short)(pos & 0xFFFF);
    }
	}

	public static Object readObject(DataInputStream read) throws IOException {
		return readObjectBoxed(read, false);
	}

	public static Object readObjectBoxed(DataInputStream read, boolean box) throws IOException {
		byte type = read.readByte();
		return switch(type){
			case 0 -> null;
			case 1 -> read.readInt();
			case 2 -> read.readLong();
			case 3 -> read.readFloat();
			default -> throw new IllegalArgumentException("Unknown object type: " + type);
		};
	}
} 