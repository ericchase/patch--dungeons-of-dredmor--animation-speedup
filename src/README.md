# \*.xml files

felt the urge to play some dredmor and ran into this everlasting issue yet again. looked around online and it seems like no one has a real solution to the problem. so i dug into the game files. most of the game today is written in XML files that are easy to read and change. the animation seems completely dependent on a `delay` attribute of `frame` tags.

for example, if you open the "gnome_atk_d.xml" file under "Dungeons of Dredmor\expansion\sprites\monster\gnome", you can see the following code:

```xml
<sprite>
  <frame delay="100">gnome_atk_d_00.png</frame>
  ...
</sprite>
```

as mentioned elsewhere, the 100 is extremely likely to be milliseconds. and since it's a delay, then perhaps that's how long the particularl frame will take up during animations. i don't know exactly how the animation process works, but simply changing the `100` to, say, `5`, will greatly speed up the attack (in this case) animations of the gnome monster. you can do this with every monster file to drastically change the animation times.

there are probably 100 or more xml files that control these animations. it would be quite a chore for everyone to manually change them by hand. so i wrote a script to do it. i found out that you probably don't want to change the `die` animations, otherwise monsters look like they are still alive sort of.

furthermore, changing all of them to `5` might not be the best choice, but i don't want to spend hours tweaking them manually and testing how it looks in game. that would be better for a community project.

next i'll write about the `*.spr` files

# \*.spr files

for the original monsters, xml wasn't used yet afaik. instead, the animations are compiled into `*.spr` files. the `*.spr` extension is not standardized. a ton of game devs and studios used that extension for their custom sprite file types. however, we are lucky, because the `*.spr` files of dredmor are extremely simple. the specification is

the first 3 bytes are a signature: "SPR". this seems common for custom sprite files. the next 1 byte (or 2 bytes, depending on if the file is big or little endian) refers to the frame count; more on that in a second. the next 2 bytes refer to the width or height of each frame, and then obviously, the next 2 bytes refers to the other dimension of height or width of each frame. following that is some binary text that i have no idea what means, but it is repeated for each frame, making it easy to confirm that the 4th byte in the file is indeed the number of frames stored in the file. very simple spec.

so what to do here? unfortunately, i assume the frame rate or frame delay for `*.spr` files is hard-coded into the game. what i decided to do was set the 4th btye (frame count) of every `*.spr` file to 1, so that only the 1st frame is shown for that specific animation.

note: this is where you i found out that you probably don't want to modify any `*.spr` files with the word `die` in it, otherwise dead monsters look like they are still sort of alive.

once again, there are dozens of these files, so you might want a script to go through and change these. with the xml files, you could attempt to do a regex search in vscode or something and replace the numbers, but i don't think that's possible for binary files.
