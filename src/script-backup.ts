import { Dungeons_of_Dredmor } from './config.js';
import { Async_BunPlatform_File_Write_Text } from './lib/ericchase/BunPlatform_File_Write_Text.js';
import { Async_BunPlatform_Glob_Scan_Generator } from './lib/ericchase/BunPlatform_Glob_Scan_Generator.js';
import { Core_Console_Error } from './lib/ericchase/Core_Console_Error.js';
import { Core_Console_Log } from './lib/ericchase/Core_Console_Log.js';
import { NODE_PATH } from './lib/ericchase/NodePlatform.js';
import { NodePlatform_PathObject_Absolute_Class } from './lib/ericchase/NodePlatform_PathObject_Absolute_Class.js';

const Dungeons_of_Dredmor_path = NodePlatform_PathObject_Absolute_Class(Dungeons_of_Dredmor).join();

const match_paths = [
  ...(await Array.fromAsync(Async_BunPlatform_Glob_Scan_Generator(Dungeons_of_Dredmor_path, '**/sprites/monster/**/*.spr'))),
  ...(await Array.fromAsync(Async_BunPlatform_Glob_Scan_Generator(Dungeons_of_Dredmor_path, '**/sprites/monster/**/*.xml'))),
  //
];

const fileset = new Set();
for (const match_path of match_paths) {
  fileset.add(match_path);
}

Core_Console_Log(fileset.size, 'files found.');

const date_string = new Date().toISOString().replaceAll(':', '.');
const backups_pathobject = NodePlatform_PathObject_Absolute_Class(NODE_PATH.resolve('./backups'), date_string);
const backups_lst_path = backups_pathobject.replaceExt('.lst').join();
const backups_7z_path = backups_pathobject.replaceExt('.7z').join();

// write file list
await Async_BunPlatform_File_Write_Text(backups_lst_path, [...fileset].join('\n'));

// archive files from file list
{
  const cmd = ['7z', 'a', '-tzip', backups_7z_path, `@${backups_lst_path}`];
  Core_Console_Log(`Command: "${cmd.join(' ')}"`);
  const { stderr, stdout } = Bun.spawnSync(cmd, { cwd: Dungeons_of_Dredmor_path, stderr: 'pipe', stdout: 'pipe' });
  Core_Console_Log(stdout.toString());
  if (stderr.length > 0) {
    Core_Console_Log();
    Core_Console_Error(stderr.toString());
  }
}
