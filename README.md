## Running / Installation
To get Cartoons on Windows, go to the Releases tab of our GitHub repository and download the latest version. Once it's finished downloading, extract it and run wrapper-offline.exe. It'll start Cartoons. If you would rather run the source code from the latest commit, you can clone the repository instead and run `npm start` in the root folder.

If you want to import videos and characters from other instances of Cartoons, open its folder and drag the "_SAVED" and "_ASSETS" folder into the Cartoons folder. If you have already made any videos or characters, this will not work. Please only import on a new install with no saved characters or videos, or take the folders in Cartoons out before dragging the old one in. If you want to import character IDs from the original LVM, you can click on CREATE A CHARACTER in the video list, scroll down to "Copy a character", and type in a character ID.

## Building
To build Cartoons, you need to run `npm run build` in the root folder of Offline. Note: the "server" folder won't be included in the build. You need to copy it manually.

## Updates & Support
For support, the first thing you should do is read through the FAQ, it most likely has what you want to know. Alternatively, if you can't find what you need, you can join the [Discord server](https://discord.gg/Kf7BzSw). Joining the server is recommended, as there is a whole community to help you out.

## Dependencies
This program relies on Flash and FFmpeg to work properly. Luckily, they require no download, as they have already been included in Cartoons.

## License
Most of this project is free/libre software under the MIT license. You have the freedom to run, change, and share this as much as you want.
FFmpeg is under the GNU GPLv2 license, which grants similar rights, but has some differences from MIT. Flash Player (extensions folder) and GoAnimate's original assets (server folder) are proprietary and do not grant you these rights, but if they did, this project wouldn't need to exist.

## Credits
These are unaffiliated people that they haven't directly done anything for the project but still deserve credit for their things. Kinda like a shoutout but in a project's readme.