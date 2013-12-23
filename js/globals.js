/**** GLOBALS ****/

var boardColour = "transparent"
var hiddenRows = 5;
var extentY = dimensionY + hiddenRows;

var blockSize = Math.ceil(Math.min($(document).width() / dimensionX, $(document).height() / dimensionY) - 1);
var $gameRoot = $("#iTetris");

var blocked = 
{
    left: "left",
    right: "right"
}

var templates = 
{
    newGame: "newgame",
    gameOver: "gameover"
}

var controlsActive;

var $templates = {};
var openDialogIds = [];

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
var gameBoard = [];
var nextShapeDisplay = [];
