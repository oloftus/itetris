/**** DIALOGS ****/

function showDialog(template, pause)
{
    pause = _.isUndefined(pause) ? false : pause;

    if (pause) pauseGame();

    var dialogId;
    while (true)
    {
        dialogId = Math.floor(Math.random() * 1000);
        if (!_.contains(openDialogIds, dialogId)) break;
    }

    openDialogIds.push(dialogId);
    var $dialog = $("<div class='dialog' id='dialog-" + dialogId + "' />");
    var $dialogInner = $("<div class='inner' />");
    $dialog.append($dialogInner);
    $dialogInner.append($("#template-" + template));
    $("body").append($dialog);

    var $dialogOverlay = $("<div class='dialog-overlay' id='dialog-overlay-" + dialogId + "' />");
    $("body").append($dialogOverlay);

    return dialogId;
}

function closeDialog(dialogId)
{
    if (typeof dialogId !== "number")
        dialogId = parseInt(_.last($(dialogId).parents(".dialog").attr("id").split("-")), 10);

    openDialogIds = _.without(openDialogIds, dialogId);
    $("#dialog-" + dialogId).remove();
    $("#dialog-overlay-" + dialogId).remove();
    unpauseGame();
}
