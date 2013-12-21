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

var isNewGame = true;
var currSpeed = GAME_SPEED;
var gameLoopTimer;

var activeShape;
var nextShape;
var gameBoard = [];
var nextShapeDisplay = [];
