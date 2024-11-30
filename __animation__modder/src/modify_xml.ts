import { ParseHTML } from './lib/ParseHTML.js';

export async function modify_xml() {
  console.log('modifying xml files');

  // only modify monster xml files
  const glob = new Bun.Glob('**/sprites/monster/**/*.xml');

  const tasks: Promise<void>[] = [];
  for await (const filename of glob.scan({})) {
    // skip specific files if needed
    //
    // // const filename_lc = filename.toLowerCase();
    // // if (filename_lc.includes('die')) {
    // //   // skip these, otherwise dead monsters look sort of alive still
    // //   console.log('skipping:', filename);
    // //   continue;
    // // }

    tasks.push(
      (async () => {
        const contents = await Bun.file(filename).text();
        const document = ParseHTML(contents);
        for (const frame of document.querySelectorAll('frame')) {
          // change all animation frame delays to 5 milliseconds for ultra fast animations
          frame?.setAttribute('delay', '5');
        }
        await Bun.write(filename, document.toString());
        console.log('modified:', filename);
      })(),
    );
  }
  await Promise.allSettled(tasks);
  console.log();
}
