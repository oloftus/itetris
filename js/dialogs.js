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
        "<div class='dialog' id='dialog-" + dialogId + "'>" +
            "<div class='inner' />" +
        "</div>");
    $dialog.children(".inner").append($template);
    
    var $dialogOverlay = $("<div class='dialog-overlay' id='dialog-overlay-" + dialogId + "' />");
    
    $("body").append($dialog);
    $("body").append($dialogOverlay);

    return dialogId;
}

function closeDialog(dialogId)
{
    if (typeof dialogId !== "number")
        dialogId = parseInt(_.last($(dialogId).parents(".dialog").attr("id").split("-")), 10);

    $("#dialog-" + dialogId).remove();
    $("#dialog-overlay-" + dialogId).remove();
    openDialogIds = _.without(openDialogIds, dialogId);
    setupControls();
    unpauseGame();
}

/**** Event handlers *****/

function handleNewGame(self)
{
    closeDialog(self);
    setupGame();
}
