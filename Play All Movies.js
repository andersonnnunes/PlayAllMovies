// The OnInit function is called by Directory Opus to initialize the script add-in.
function OnInit(initData) {
	// Basic information about the script.
	initData.name = "Play All Movies";
	initData.desc = "Adds all movie files on current view to a playlist and opens it.";
	initData.copyright = "CC0 Public Domain by AndersonNNunes.org";
	var version = "0.1";
	initData.version = version;
	initData.url = "https://github.com/andersonnnunes/PlayAllMovies";
	initData.default_enable = true;

	// Create a new ScriptCommand object and initialize it to add the command to Opus.
	var cmd = initData.AddCommand();
	cmd.name = "PlayAllMovies";
	cmd.method = "OnPlayAllMovies";
	cmd.desc = initData.desc;
	cmd.label = "Play All Movies";
	cmd.template = "";

	// Settings for the script.
	// Currently unused. Needs to be plugged to the OnPlayAllMovies function.
	// Currently I have no idea on how to do that.
	initData.config.useSpecifiedPlayer;
	initData.config.playerOpenCommand;
	initData.config.playlistPath;
	initData.config.localizedMovieGroupTypeName;
	initData.config.verbose;
	initData.config.clearOutput;
}

// Implement the OnPlayAllMovies command (this entry point is an OnScriptCommand event).
function OnPlayAllMovies(scriptCmdData) {
	// Prepare objects.
	var wsh = new ActiveXObject("WScript.Shell");
	// ------------------------------- Preferences
	// Path to temporary playlist (will be overwritten).
	var playlistPath = wsh.ExpandEnvironmentStrings("%TEMP%") + "\\" + "PlayAllMovies.m3u";
	// --------------------
	// Use specified player?
	var useSpecifiedPlayer = false;
	// --------------------
	// Command to open specified player.
	var playerOpenCommand = ""
	// --------------------
	// Name of file type group for movies.
	// If you defined a personalized file type group for your movies, type it here.
	var localizedMovieGroupTypeName = "Movies";
	// --------------------
	// Determine verbosity level.
	// 1 - Print informative log.
	// 0 - Print nothing.
	var verbose = 0;
	// --------------------
	// Clear output on run?
	var clearOutput = false;
	// --------------------
	
	// ------------------------------- Main
	if (clearOutput) {
		DOpus.ClearOutput();
	}
	
	// Check that there is an appropriate number of files selected.
	var selFilesCount = scriptCmdData.func.sourcetab.selected_files.count;
	if (selFilesCount == 0) {
		error("No files are selected.");
	} else if (selFilesCount > 1) {
		error("Too many files are selected.");
	} else {
		// -------------------- Prepare temporary variables.
		
		// Arrays to store items.
		var firstHalf = [];
		var lastHalf = [];
		
		// Flag used to define the position of the files on the playlist.
		var addToFirstHalf = false;
		
		// -------------------- Filter files to consider only movie files.
		
		for (var eSel = new Enumerator(scriptCmdData.func.sourcetab.files); !eSel.atEnd(); eSel.moveNext())
		{
			var availableFile = eSel.item();
			for(var i=0; i<availableFile.groups.length; i++){
				if (availableFile.groups(i).display_name == localizedMovieGroupTypeName)
				{
					// Define the position of the file on the playlist.
					if (addToFirstHalf == false && availableFile.selected == true) {
						addToFirstHalf = true;
						// Save extension of the first selected file, it may be needed later.
						var movieExtension = availableFile.ext;
					}
					
					// Add file.
					if (addToFirstHalf) {
						firstHalf.push(availableFile);
					} else {
						lastHalf.push(availableFile);
					}
				}
			}
		}
		
		// -------------------- Prepare playlist.
		
		// Begin playlist.
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var playlist = fso.CreateTextFile(playlistPath, true, true);
		playlist.WriteLine("#EXTM3U");
		
		// Add files to playlist.
		for (var iSel = new Enumerator(firstHalf.concat(lastHalf)); !iSel.atEnd(); iSel.moveNext())
		{
			var moviePath = String(iSel.item());
			playlist.WriteLine(moviePath);
		}
		
		// End playlist.
		playlist.Close();
		
		// -------------------- Execute playlist.
		
		// Define player to use.
		if (useSpecifiedPlayer == false || playerOpenCommand == "") {
			// Query registry to get the path to the default video player.
			var defaultPlayer = wsh.RegRead("HKEY_CLASSES_ROOT\\" + movieExtension + "\\");
			playerOpenCommand = wsh.RegRead("HKEY_CLASSES_ROOT\\" + defaultPlayer + "\\shell\\open\\command\\");
		}
		
		// Define command line to execute.
		var openPlaylistCommand = playerOpenCommand.replace("%1", playlistPath);
		
		// Execute command line.
		var runReturnCode = wsh.Run(openPlaylistCommand, 1);
	}
	
	// Print only if requested.
	function print(text) {
		if (verbose) {
			DOpus.Output(text);
		}
	}
	
	// Display error message.
	function error(text) {
		DOpus.Output(text, true);
	}
}