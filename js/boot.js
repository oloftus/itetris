/**** BOOT ****/

function boot()
{
    drawGameBoard();
    setupKeyBindings();
    setupTouchBindings();
    setupDialogBindings();
    showDialog(TEMPLATES.NEWGAME, false);
}
