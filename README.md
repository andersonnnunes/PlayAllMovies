**Name:** Play All Movies

**Type:** user defined command via script.

**Function:** adds all movie files on current view to a playlist and opens it.

**License:** CC0 Public Domain by AndersonNNunes.org.

------

**Purpose**

>I made this script to make it easier to watch videos displayed on a tab but that are scattered over multiple directories.

>My main media player is able to, with a button push, play the previous or the next file that is on the same folder of the currently open file.

>Directory Opus supports "virtual directories" (collections, find result, flat view). After opening a video file from one of these, it wasn't possible to jump to the next one easily from the player.

>This script solves that problem.

**Functionality**

The scripts adds the new command ```PlayAllMovies```.

**Install**

It is distributed as a .js file. Install it by the usual means.

**Usage**

Set the command ```PlayAllMovies``` as an action triggered by whatever event you desire. I choose to have it for the 'dblclk' action (File Type > Movies > Events > Left double-click).

One file needs to be selected for the command to work.

**Requeriments**

Any video player with support for .m3u playlists registered as the default program for the movie files you want to play. The player does not need to be registered as default for .m3u playlists, it only needs to be able to read them.

(Tested with Media Player Classic on Windows 10.)

**Settings**

There should not be the need for you too change anything before executing the script.

You have some options to personalize the script's behavior. Right now you need to edit the script manually.

**Follow**

Follow the development of this script at the [Directory Opus Forum](https://resource.dopus.com/t/play-all-movies-generate-and-open-playlist-for-current-tab/24933) or on [GitHub](https://github.com/andersonnnunes/PlayAllMovies).