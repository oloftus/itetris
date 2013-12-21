var scriptDir = "js";
var includeScripts =
[
    "config.js",
    "globals.js",
    "util.js",
    "shapesblocks.js",
    "activeshape.js",
    "gameloop.js",
    "controls.js",
    "setup.js",
    "boot.js"
];

$(function()
{
    var scriptsLoadedCount = 0;

    function startIfAllScriptsLoaded()
    {
        scriptsLoadedCount++;
        if (scriptsLoadedCount === includeScripts.length)
        {
            boot();
        }
    }

    _.each(includeScripts, function(includeScript) {
        var scriptPath = scriptDir + "/" + includeScript;
        $.getScript(scriptPath, function() { startIfAllScriptsLoaded(); });
    });
});
