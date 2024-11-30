import { Path } from './lib/Node/Path.js';

async function archive(filelist: Path, outfile: Path) {
  const { stdout, stderr } = Bun.spawnSync(['7z', 'a', '-tzip', `./${outfile.path}`, `-i@./${filelist.path}`]); // ./ are needed here
  console.log(stdout.toString());
  if (stderr.length > 0) {
    console.log();
    console.log(stderr.toString());
  }
}

console.log();
console.log('backing up files...');

const filelist: string[] = [];
// backup spr files
for await (const filepath of new Bun.Glob('**/sprites/monster/**/*.spr').scan({})) {
  filelist.push(filepath);
}
// backup xml files
for await (const filepath of new Bun.Glob('**/sprites/monster/**/*.xml').scan({})) {
  filelist.push(filepath);
}
console.log(filelist.length, 'files found');

const backup_prefix = new Path(`__animation__modder/backups/${new Date().toISOString().replaceAll(':', '.')}`);
const path_filelist = backup_prefix.newExt('.lst');
Bun.write(path_filelist.path, filelist.join('\n'));

await archive(path_filelist, backup_prefix.newExt('.7z'));

console.log();
