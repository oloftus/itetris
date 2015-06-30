/**** DIALOGS ****/

function showDialog(templateName, pause, params)
{
    pause = _.isUndefined(pause) ? false : pause;

    if (pause) pauseGame();
    clearControls();

    var dialogId;
    while (true)
    {
        dialogId = Math.floor(Math.random() * 1000);
        if (!_.contains(openDialogIds, dialogId)) break;
    }
    openDialogIds.push(dialogId);

    var $template = $dialogTemplates[templateName].clone();
    var $placeholders = $template.find(".param");
    _.each($placeholders, function(placeholder)
    {
        var paramName = $(placeholder).attr("class").split(" ")[1];
        var paramValue = params[paramName];
        $template.find(".param." + paramName).html(paramValue);
    });
    var $dialog = $(
        "<div class='" + elementIds.dialog + "' id='" + elementIds.dialog + "-" + dialogId + "'>" +
            "<div class='" + elementIds.inner + "' />" +
        "</div>");
    $dialog.children("." + elementIds.inner).append($template);
    
    var $dialogOverlay = $("<div class='" + elementIds.dialogOverlay + "' id='" + elementIds.dialogOverlay + "-" + dialogId + "' />");
    
    $("body").append($dialog);
    $("body").append($dialogOverlay);

    return dialogId;
}

function closeDialog(dialogId)
{
    if (typeof dialogId !== "number")
        dialogId = parseInt(_.last($(dialogId).parents("." + elementIds.dialog).attr("id").split("-")), 10);

    $("#" + elementIds.dialog + "-" + dialogId).remove();
    $("#" + elementIds.dialogOverlay + "-" + dialogId).remove();
    openDialogIds = _.without(openDialogIds, dialogId);
    unpauseGame();
}
    
function setupDialogTemplates()
{
    var theTemplates = null;
    var basePath = window.location.pathname.split("/");
    var templatesPath = [_.first(basePath, basePath.length - 1).join("/"), dialogTemplatesFile].join("/");
    $.ajax(
        {
            async: false,
            type: 'GET',
            url: templatesPath,
            success: function(data)
            {
                theTemplates = data;
            }
        });

    _.each(dialogTemplates, function(templateName)
    {
        $dialogTemplates[templateName] = $(theTemplates).find("#" + elementIds.dialogTemplate + "-" + templateName);
    });
}


/**** Event handlers *****/

function handleNewGame(self)
{
    closeDialog(self);
    teardownGame();
    setupGame();
}
