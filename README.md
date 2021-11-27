<p align="center">
  <a href="https://idolize.github.io/xcloud-keyboard-mouse/"><img src="public/icon-128.png" alt="Logo" .></a>
</p>

<h1 align="center">Keyboard & Mouse for xCloud</h1>

<!-- <p align="center">
  <b>Download:</b>
  <a href="https://chrome.google.com/webstore/detail/id">Chrome/Chromium</a> |
  <a href="https://addons.mozilla.org/addon/xloud-keyboard-mouse/?src=external-github">Firefox</a> |
  <a href="https://github.com/ajayyy/Xloud-keyboard-mouse/wiki/Edge">Edge</a> |
  <a href="https://github.com/ajayyy/Xloud-keyboard-mouse/wiki/Safari">Safari for MacOS</a> |
  <a href="https://idolize.github.io/xcloud-keyboard-mouse/">Website</a>
</p> -->

<p align="center">
    <a href="https://github.com/idolize/xcloud-keyboard-mouse/actions/workflows/build.yml"><img src="https://github.com/idolize/xcloud-keyboard-mouse/actions/workflows/build.yml/badge.svg?event=push&branch=master" alt="CI Status" /></a>
    <a href="https://github.com/idolize/xcloud-keyboard-mouse/blob/master/LICENSE.txt"><img src="https://img.shields.io/badge/License-GPLv3-blue.svg" alt="License GPLv3" /></a>
</p>

<p align="center">
  <sub><b>NOTE</b> This is a fan project - it is not affiliated with Microsoft or Xbox in any way.
  All Microsoft, Xbox logos/icons/trademarks are copyright of their respective owners.</sub>
</p>

***🎮 No controller? No problem!***

A browser extension to control any game on [Xbox Cloud Gaming (Project xCloud)](https://xbox.com/play)  with a keyboard and mouse.

## The issue with xCloud

Microsoft's cloud gaming service [Xbox Cloud Gaming (aka Project xCloud)](https://xbox.com/play) lets you play your favorite Xbox games in the cloud, but it runs on phsyical Xbox **consoles** (not PCs) behind the scenes.

Since very few games on Xbox consoles support mouse and keyboard as first-class input devices, Microsoft chose to limit xCloud users to only using gamepad controllers to play (although [maybe they will add PC servers eventually](https://twitter.com/XboxP3/status/1384154390630592521), but I wouldn't hold my breath).

So, if you don't have a controller or just prefer to use a mouse and keyboard you are out of luck!

Or at least you *were*...

## Features

<img src = "docs/assets/extension_screenshot1.png" width="400" alt="Screenshot" /> <img src="docs/assets/extension_screenshot2.png" width="400" alt="Screenshot of editing" />

### ✅ Works for every game

- Every game on xCloud is supported - regardless of whether or not it natively supports mouse and keyboard

### ✅ Multiple presets

- Manage multiple preset and custom configurations (e.g. create separate presets for "fighting games", "shooter", etc.)
- Bind multiple keyboard keys or mouse buttons to any controller button

### ✅ Quick enable/disable

- Easily disable the mouse/keyboard override and switch back to your controller whenever you feel like it with one click of the toggle

### ✅ Configurable sensitivity

- Control how sensitive you want mouse movement to be on a per-profile basis
- (Note you may also need to tweak the control sensitivity in the game options as well for optimial use)

## How it works

This extension works by acting as a **"virtual" controller**. It listens for keyboard presses and (optionally) mouse movement and translates these into what appear as *controller* button presses and analog stick movements.

There is no added input delay introduced by this extension - all keyboard/mouse input is instantly translated into virtual controller input immediately by the extension without any extra software or steps.


## Show your support

Like this extension? Why not [buy me a coffee](https://www.buymeacoffee.com/idolize)? I really appreciate it!

## Development and contributing

See [the contribution doc](CONTRIBUTING.md) for more information

## License

[GPLv3](https://github.com/idolize/xcloud-keyboard-mouse/blob/master/LICENSE.txt)
