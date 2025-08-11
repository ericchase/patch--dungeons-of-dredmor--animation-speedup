import { HTML_UTIL } from '../../tools/core-web/bundle/htmlutil.js';
import { Dungeons_of_Dredmor } from '../config.js';
import { Async_BunPlatform_File_Read_Text } from './ericchase/BunPlatform_File_Read_Text.js';
import { Async_BunPlatform_File_Write_Text } from './ericchase/BunPlatform_File_Write_Text.js';
import { Async_BunPlatform_Glob_Scan_Generator } from './ericchase/BunPlatform_Glob_Scan_Generator.js';
import { Core_Console_Error } from './ericchase/Core_Console_Error.js';
import { Core_Console_Log } from './ericchase/Core_Console_Log.js';
import { NodePlatform_PathObject_Absolute_Class } from './ericchase/NodePlatform_PathObject_Absolute_Class.js';

export async function Async_Modify_XML() {
  Core_Console_Log('Modifying *.xml files.');

  const Dungeons_of_Dredmor_path = NodePlatform_PathObject_Absolute_Class(Dungeons_of_Dredmor).join();

  const match_paths = [
    ...(await Array.fromAsync(Async_BunPlatform_Glob_Scan_Generator(Dungeons_of_Dredmor_path, '**/sprites/{fhero,hero,monster}/**/*.xml', { absolute_paths: true }))),
    //
  ];

  const tasks: Promise<void>[] = [];
  for await (const path of match_paths) {
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
  const { error, value: text } = await Async_BunPlatform_File_Read_Text(path);
  if (text !== undefined) {
    // this is a custom bundle of some html parser and query engine libraries
    const source_html = text.trim();
    const source_node = HTML_UTIL.ParseDocument(source_html, { xml_mode: true }); // must be in xml mode for frame
    for (const frame of HTML_UTIL.QuerySelectorAll(source_node, 'frame')) {
      // change all animation frame delays to 5 milliseconds for ultra fast animations
      HTML_UTIL.SetAttribute(frame, 'delay', '5');
    }
    await Async_BunPlatform_File_Write_Text(path, HTML_UTIL.GetHTML(source_node, { xml_mode: true })); // must be in xml mode for frame
    Core_Console_Log(`Modified "${path}".`);
  } else {
    throw error;
  }
}
