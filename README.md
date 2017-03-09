**Name:** Play All Movies

**Type:** Script for Directory Opus to define the new command ```PlayAllMovies```.

**License:** CC0 Public Domain by AndersonNNunes.org.

------

**Purpose**

>I made this script to make it easier to watch videos displayed on a tab but that are scattered over multiple directories.

>My main media player is able to, with a button push, play the previous or the next file that is on the same folder of the currently open file.

>Directory Opus supports "virtual directories" (collections, find result, flat view). After opening a video file from one of these, it wasn't possible to jump to the next one easily from the player.

>This script solves that problem.

**Functionality**

The scripts adds the new command ```PlayAllMovies```.

**Requirements**

Directory Opus version >= ???.

Any video player with support for .m3u playlists registered as the default program for the movie files you want to play. The player does not need to be registered as default for .m3u playlists, it only needs to be able to read them.

(Tested with Media Player Classic on Windows 10.)

**Install**

It is distributed as a .js file. Install it by the usual means.

**Settings**

There should not be the need for you too change anything before executing the script.

You have the option to set a specific player to be used with this command, in case you are using Opus as a portable program and/or if there is not a default player on the system.

Use the configuration window to change the script's behavior.

**Usage**

Set the command ```PlayAllMovies``` as an action triggered by whatever event you desire. I choose to have it for the 'dblclk' action (File Type > Movies > Events > Left double-click).

One file needs to be selected for the command to work.

**Follow**

Follow the development of this script at the [Directory Opus Forum](https://resource.dopus.com/t/play-all-movies-generate-and-open-playlist-for-current-tab/24933) or on [GitHub](https://github.com/andersonnnunes/PlayAllMovies).