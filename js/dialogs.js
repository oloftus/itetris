/**** DIALOGS ****/

function showDialog(templateName, pause)
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


/**** Event handlers *****/

function handleNewGame(self)
{
    closeDialog(self);
    teardownGame();
    setupGame();
}
