// The OnInit function is called by Directory Opus to initialize the script add-in.
function OnInit(initData) {
	// Basic information about the script.
	initData.name = "Play All Movies";
	initData.desc = "Adds all movie files on current view to a playlist and opens it.";
	initData.copyright = "CC0 Public Domain by AndersonNNunes.org";
	var version = "0.2";
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

	// Determine settings for the script.
	
	// Helper Function
	// Easy way to determine settings.
	// Thanks goes to "tbone". 
	// https://resource.dopus.com/t/helper-confighelper-easier-config-item-handling/19129
	function ConfigHelper(data){
		var t=this; t.d=data; t.c=data.config; t.cd=DOpus.Create.Map();
		t.add=function(name, val, des){ t.l={n:name,ln:name.
			toLowerCase()}; return t.val(val).des(des);}
		t.des=function(des){ if (!des) return t; if (t.cd.empty)
			t.d.config_desc=t.cd; t.cd(t.l.n)=des; return t;}
		t.val=function(val){ var l=t.l; if (l.v!==l.x&&typeof l.v=="object")
			l.v.push_back(val);else l.v=t.c[l.n]=val;return t;}
		t.trn=function(){return t.des(t("script.config."+t.l.ln));}
	}
	
	// Helper object.
	var cfg = new ConfigHelper(initData);
	
	// Configuration.
	cfg.add("useSpecificPlayer", false, "Force use of specific player?");
	cfg.add("playerOpenCommand", "", "Set the command to open specific player.\r\nExpected format: \"C:\\Player\\Player.exe\" \"%1\" Argument2 Argument3");
	cfg.add("localizedMovieGroupTypeName", "Movies", "If you defined a personalized file type group for your movies, type its name here.");
	cfg.add("verbose", false, "Enable output of informative log? If set to false, only errors will print messages.");
	cfg.add("clearOutput", false, "Clear output on run?");
}

// Implement the OnPlayAllMovies command (this entry point is an OnScriptCommand event).
function OnPlayAllMovies(scriptCmdData) {
	// ------------------------------- Main
	if (Script.config.clearOutput) {
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
				if (availableFile.groups(i).display_name == Script.config.localizedMovieGroupTypeName)
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
		
		// Prepare helper object(s).
		var wsh = new ActiveXObject("WScript.Shell");
		
		// -------------------- Prepare playlist.
		
		// Path to temporary playlist (it will be overwritten).
		var playlistPath = wsh.ExpandEnvironmentStrings("%TEMP%") + "\\" + "PlayAllMovies.m3u";
		
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
		if (Script.config.useSpecificPlayer == false || Script.config.playerOpenCommand == "") {
			// Query registry to get the path to the default video player.
			var defaultPlayer = wsh.RegRead("HKEY_CLASSES_ROOT\\" + movieExtension + "\\");
			playerOpenCommand = wsh.RegRead("HKEY_CLASSES_ROOT\\" + defaultPlayer + "\\shell\\open\\command\\");
		} else {
			playerOpenCommand = Script.config.playerOpenCommand;
		}
		
		// Define command line to execute.
		var openPlaylistCommand = playerOpenCommand.replace("%1", playlistPath);
		
		// Execute command line.
		var runReturnCode = wsh.Run(openPlaylistCommand, 1);
	}
	
	// Helper Function
	// Print only if requested.
	function print(text) {
		if (Script.config.verbose) {
			DOpus.Output(text);
		}
	}
	
	// Helper Function
	// Display error message.
	function error(text) {
		DOpus.Output(text, true);
	}
}