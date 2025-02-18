Please read `__animation__modder/README.md`.

## Demo Videos

https://ericchase.github.io/patch--dungeons-of-dredmor--animation-speedup/

## Usage

To use these scripts, you will need to copy the files from this repository into your `Dungeons of Dredmor` folder, wherever that may be.

- for Steam players, it could be here:
  - `C:\Program Files (x86)\Steam\steamapps\common\Dungeons of Dredmor`

Once copied, you will need an installation of the Bun runtime:

- https://bun.sh/

Then, simply run these commands inside your `Dungeons of Dredmor` folder, where `package.json` should now be located. Use one of your operating system terminals to run the commands.

1. The command to install only the packages needed for running the scripts: namely, the "node-html-parser" for modifying xml files.

```
bun install --production
```

2. The command to make a backup of the original game files in case you want to. You can also run the file verification process through Steam if you want to undo the changes. This script also needs an installation of 7z (https://www.7-zip.org/), because I already had the code for backing up files with 7z. **You may skip this step, as you can always restore game files via Steam Library > Right Click Game > Properties... > Installed Files > Verify integrity of game files**

```
bun run backup
```

3. The command to actually modify the .spr and .xml files; details outlined in the other readme file.

```
bun run modify
```

### What's a Terminal?

- Windows Console (https://en.wikipedia.org/wiki/Windows_Console)
- What is Windows Terminal? (https://learn.microsoft.com/en-us/windows/terminal/)
- What is Terminal on Mac? (https://support.apple.com/guide/terminal/what-is-terminal-trmld4c92d55/mac)
- A guide to the Linux terminal for beginners (https://opensource.com/article/21/8/linux-terminal)

### I need help!

If you need any help, feel free to message me. You can find my contact info on my profile, or you can submit a GitHub issue.
