export async function modify_spr() {
  console.log('modifying spr files');

  // only modify monster sprites, as they use up the most animation time
  const glob = new Bun.Glob('**/sprites/monster/**/*.spr');

  const tasks: Promise<void>[] = [];
  for await (const filename of glob.scan({})) {
    const filename_lc = filename.toLowerCase();

    // skip these files, otherwise dead monsters look sort of alive still
    if (filename_lc.includes('die')) {
      console.log('skipping:', filename);
      continue;
    }

    tasks.push(
      (async () => {
        const bytes = await Bun.file(filename).bytes();

        // the first 3 bytes of .spr files are the ascii text SPR
        // the 4th byte of .spr files is the frame count
        bytes[3] = 1; // only animate the first frame of original monsters

        await Bun.write(filename, bytes);
        console.log('modified:', filename);
      })(),
    );
  }
  await Promise.allSettled(tasks);
  console.log();
}
