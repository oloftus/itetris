/**** GLOBALS ****/

var boardColour = "transparent"
var hiddenRows = 5;
var extentY = dimensionY + hiddenRows;
var nextShapePadding = 10;
var nextShapeBorderWidth = 1;
var nextShapeDisplayDimension = 4;
var blockSize = Math.floor(Math.min($(document).width() / dimensionX, $(document).height() / dimensionY));

var blocked = 
{
    left: "left",
    right: "right"
}

var dialogTemplates = 
{
    newGame: "newgame",
    gameOver: "gameover",
    gamePaused: "gamepaused",
    credLics: "credlics"
}

var elementIds =
{
    gameRoot: "itetris",
    gameBoard: "game-board",
    block: "block",
    branding: "title",
    dialog: "dialog",
    dialogTemplate: "template",
    dialogOverlay: "dialog-overlay",
    scoreRows: "score-rows",
    scoreScore: "score-score",
    scoreLevel: "score-level",
    scoreCard: "score-card",
    nextShape: "next-shape",
    header: "header",
    inner: "inner"
}

var $dialogTemplates = {};
var openDialogIds = [];
var dialogTemplatesFile = "dialog-templates.html"

var controlsActive;
var isNewGame;
var gameLoopTimer;
var gamePaused;

var scoreTimerStart;
var scoreTimer;

var currSpeed;
var currLevel;
var currScore;
var currRows;

var activeShape;
var lastShape;
var nextShape;
var gameBoard;
var nextShapeDisplay;
