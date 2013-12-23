/**** GLOBALS ****/

var BOARD_COLOUR = "transparent"
var HIDDEN_ROWS = 5;
var EXTENT_Y = DIMENSION_Y + HIDDEN_ROWS;

var BLOCK_SIZE = Math.ceil(Math.min($(document).width() / DIMENSION_X, $(document).height() / DIMENSION_Y) - 1);
var $GAME_ROOT = $("#iTetris");

var BLOCKED = 
{
    LEFT: "left",
    RIGHT: "right"
}

var TEMPLATES = 
{
    NEWGAME: "newgame"
}

var openDialogIds = [];

var isNewGame;
var gameLoopTimer;
var gamePaused;

var scoreTimerStart;
var scoreTimer;

var currSpeed = GAME_SPEED;
var currLevel = 1;
var currScore = 0;
var currRows = 0;

var activeShape;
var lastShape;
var nextShape;
var gameBoard = [];
var nextShapeDisplay = [];
