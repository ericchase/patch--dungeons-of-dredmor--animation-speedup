import { Dungeons_of_Dredmor } from '../config.js';
import { Async_BunPlatform_File_Read_Bytes } from './ericchase/BunPlatform_File_Read_Bytes.js';
import { Async_BunPlatform_File_Write_Bytes } from './ericchase/BunPlatform_File_Write_Bytes.js';
import { Async_BunPlatform_Glob_Scan_Generator } from './ericchase/BunPlatform_Glob_Scan_Generator.js';
import { Core_Console_Error } from './ericchase/Core_Console_Error.js';
import { Core_Console_Log } from './ericchase/Core_Console_Log.js';
import { NodePlatform_PathObject_Absolute_Class } from './ericchase/NodePlatform_PathObject_Absolute_Class.js';

export async function Async_Modify_SPR() {
  Core_Console_Log('Modifying *.spr files.');

  const Dungeons_of_Dredmor_path = NodePlatform_PathObject_Absolute_Class(Dungeons_of_Dredmor).join();

  // {fhero,hero,monster}
  // modifying only the monsters will result in a significant speedup of the
  // game. speeding up the heroes might result in gameplay that's too fast. if
  // you find the game too fast, then replace '{fhero,hero,monster}' below with
  // just 'monster'. also do this in the `modify_xml.ts` file.
  const match_paths = [
    ...(await Array.fromAsync(Async_BunPlatform_Glob_Scan_Generator(Dungeons_of_Dredmor_path, '**/sprites/{fhero,hero,monster}/**/*.spr', { absolute_paths: true }))),
    //
  ];

  const tasks: Promise<void>[] = [];
  for await (const path of match_paths) {
    // skip these files, otherwise dead monsters look sort of alive still
    if (path.toLowerCase().includes('die')) {
      Core_Console_Log(`Skipping "${path}".`);
      continue;
    }
    tasks.push(async_process(path));
  }
  for (const results of await Promise.allSettled(tasks)) {
    if (results.status === 'rejected') {
      Core_Console_Error(results.reason.message);
    }
  }
  Core_Console_Log();
}

async function async_process(path: string) {
  const { error, value: bytes } = await Async_BunPlatform_File_Read_Bytes(path);
  if (bytes !== undefined) {
    // the first 3 bytes of .spr files are the ascii text SPR
    // the 4th byte of .spr files is the frame count
    bytes[3] = 1; // only animate the first frame of original monsters
    await Async_BunPlatform_File_Write_Bytes(path, bytes);
    Core_Console_Log(`Modified "${path}".`);
  } else {
    throw error;
  }
}
