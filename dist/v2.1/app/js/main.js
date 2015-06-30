$.ajaxSetup(
    {
        cache: true
    });

var scriptDir = "js";
var includeScripts =
[
    "config.js",
    "globals.js",
    "util.js",
    "dialogs.js",
    "shapesblocks.js",
    "activeshape.js",
    "gameloop.js",
    "controls.js",
    "scoring.js",
    "setup.js"
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

    function getScript(scriptPath, callback)
    {
        var $script = $("<script src='" + scriptPath + "'type='text/javascript' />");
        $("head").append($script);
        callback();
    }

    _.each(includeScripts, function(includeScript) {
        var scriptPath = scriptDir + "/" + includeScript;
        $.getScript(scriptPath, function() { startIfAllScriptsLoaded(); });
        //getScript(scriptPath, function() { startIfAllScriptsLoaded(); });
    });
});
