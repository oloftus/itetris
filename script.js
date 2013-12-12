/********************
    CONFIGURATION   */

var DIMENSION_X = 10; //blocks
var DIMENSION_Y = 20; //blocks
var GAME_SPEED = 1000; //millliseconds

/********************/

var BOARD_COLOUR = "transparent"
var HIDDEN_ROWS = 5;
var extentY = DIMENSION_Y + HIDDEN_ROWS;
$(function(){ // Dynamic block size
    blockSize = Math.floor(Math.min($(document).width() / DIMENSION_X, $(document).height() / DIMENSION_Y) - 1);
});

var shapeProto =
{
    width: function() { return this.definition[0].length; },
    height: function() { return this.definition.length; },
    visualise: function()
    {
        var drawing = "";
        _.each(this.definition, function(row)
        {
            _.each(row, function(block)
            {
                drawing += block ? "X" : " ";
            });
            drawing += "\n";
        });
        console.log(drawing);
    },
    draw: function(shape)
    {
        for (var i = 0; i < this.height(); i++)
        {
            for (var j = 0; j < this.width(); j++)
            {
                var block = gameBoard[this.currY + i][this.currX + j]
                block.filled = this.definition[i][j] | block.filled;
                if (this.definition[i][j])
                {
                    block.colour = this.colour;
                    block.render();
                }
            }
        }
    },
    clear: function()
    {
        for (var i = 0; i < this.height(); i++)
        {
            for (var j = 0; j < this.width(); j++)
            {
                var block = gameBoard[this.currY + i][this.currX + j];
                if (this.definition[i][j])
                {
                    block.filled = false;
                    block.colour = BOARD_COLOUR;
                    block.render();
                }
            }
        }
    }
}

var blockProto =
{
    render: function()
    {
        this.$elem.css("background", this.colour);
    }
}

var shapes =
[
    _.extend(
        {
            definition:
                [[1,1],
                 [1,1]],
            colour: "yellow"
        }, shapeProto),
    _.extend(
        {
            definition:
                [[1,1,1,1]],
            colour: "cyan"
        }, shapeProto),
    _.extend(
    {
            definition:
                [[1,1,1],
                 [0,0,1]],
             colour: "blue"
    }, shapeProto),
    _.extend(
        {
            definition:
                [[1,1,1],
                 [1,0,0]],
             colour: "orange"
        }, shapeProto),
    _.extend(
        {
            definition:
                [[0,1,1],
                 [1,1,0]],
            colour: "#80FF00" // Lime
        }, shapeProto),
    _.extend(
        {
            definition:
                [[1,1,0],
                 [0,1,1]],
             colour: "red"
        }, shapeProto),
    _.extend(
        {
            definition:
                [[1,1,1],
                 [0,1,0]],
             colour: "#800080" // Dark magenta
        }, shapeProto)
];

function rotateShape(shape, angle)
{
    shape = _.extend({}, shape);
    if (angle === 0 || angle === 360) return shape;

    var radAngle = 2 * Math.PI * angle / 360; 
    var rotShapeDef = [];
    var rotShapeWidth = angle === 180 ? shape.width() : shape.height();
    var rotShapeHeight = angle === 180 ? shape.height() : shape.width();
    
    for (var i=0; i<rotShapeHeight; i++)
    {
        rotShapeDef[i] = [];
    }

    for (var x = 0; x < shape.width(); x++)
    {
        for (var y = 0; y < shape.height(); y++)
        {
            var coordX = x + 1;
            var coordY = shape.height() - y;
            
            var newCoordX = coordX * Math.round(Math.cos(radAngle)) - coordY * Math.round(Math.sin(radAngle));
            var newCoordY = coordX * Math.round(Math.sin(radAngle)) + coordY * Math.round(Math.cos(radAngle));
            
            var transformedCoordX = angle === 90 || angle === 180 ? newCoordX + rotShapeWidth + 1 : newCoordX;
            var transformedCoordY = angle === 180 || angle === 270 ? newCoordY + rotShapeHeight + 1 : newCoordY;

            var transformedX = transformedCoordX - 1;
            var transformedY = rotShapeHeight - transformedCoordY;

            rotShapeDef[transformedY][transformedX] = shape.definition[y][x];
        }
    }

    shape.definition = rotShapeDef;
    return shape;
}

var activeShape;
var currSpeed = GAME_SPEED;
var gameBoard = [];
var $gameBoard;

function blockHidden()
{
    return activeShape.currY + activeShape.height() - 1 < HIDDEN_ROWS;
}

var BLOCKED_RIGHT = 1;
var BLOCKED_LEFT = -1;

function isActiveShapeBlocked(side) // REM SIDE
{
    for (var y = activeShape.height() - 1; y >= 0; y--)
    {
        if (side == BLOCKED_LEFT)
        {
            for (var x = 0; x < activeShape.width(); x++)
            {
                if (activeShape.definition[y][x])
                {
                    if (gameBoard[activeShape.currY + y][activeShape.currX + x - 1].filled)
                        return true
                    break;
                }
                else continue;
            }
        }
        else
        {
            for (var x = activeShape.width() - 1; x >= 0 ; x--)
            {
                if (activeShape.definition[y][x])
                {
                    if (gameBoard[activeShape.currY + y][activeShape.currX + x + 1].filled)
                        return true
                    break;
                }
                else continue;
            }
        }
    }
}

function translateActiveShape(x, y, isGameLoop)
{
    if (blockHidden() && !isGameLoop) return;

    var proposedX = activeShape.currX + x;
    var proposedY = activeShape.currY + y;

    if (proposedX < 0 || proposedX + activeShape.width() - 1 >= DIMENSION_X  ||
        proposedY < 0 || proposedY + activeShape.height() - 1 >= extentY ||
        (y && isActiveShapeSettled())) return;

    if (x != 0 && isActiveShapeBlocked(x > 0 ? BLOCKED_RIGHT : BLOCKED_LEFT)) return;

    activeShape.clear();
    activeShape.currX += x;
    activeShape.currY += y;
    activeShape.draw();
}

var timeout;

function drop()
{
    var currMin = extentY + 1000;

    for (var x = 0; x < activeShape.width(); x++)
    {
        for (var y = activeShape.height() - 1; y >= 0; y--)
        {
            if (activeShape.definition[y][x])
            {
                var colMax;
                for (var boardY = activeShape.currY + y + 1; boardY < extentY; boardY++)
                {
                    if (gameBoard[boardY][activeShape.currX + x].filled)
                    {
                        colMax = boardY - (activeShape.currY + y) - 1;
                        break;
                    }
                    colMax = extentY - activeShape.currY - activeShape.height();
                }
                currMin = Math.min(currMin, colMax);
                break;
            }
        }
    }
    translateActiveShape(0, currMin);
    clearTimeout(timeout);
    gameLoop();
}

// The gameboard as if the active block was not there (0s)
function cleanBoardView(x, y)
{
    if ((activeShape.currX <= x) && (x < activeShape.currX + activeShape.width()) &&
        (activeShape.currY <= y) && (y < activeShape.currY + activeShape.height()))
    {
        var shapeIndexX = x - activeShape.currX;
        var shapeIndexY = y - activeShape.currY;
        return activeShape.definition[shapeIndexY][shapeIndexX] ^ gameBoard[y][x].filled;
    }
    else return gameBoard[y][x].filled;
}

function rotateActiveShape(angle)
{
    if (blockHidden()) return;

    var proposedShape = rotateShape(activeShape, angle);
    if (activeShape.currX + proposedShape.width() > DIMENSION_X ||
        activeShape.currY + proposedShape.height() > extentY) return;

    for (var y = 0; y < proposedShape.height(); y++)
    {
        for (var x = 0; x < proposedShape.width(); x++)
        {
            if (cleanBoardView(activeShape.currX + x, activeShape.currY + y) &&
                proposedShape.definition[y][x]) return;
        }
    }

    activeShape.clear();
    activeShape = proposedShape;
    activeShape.draw();
}

function drawBoard()
{
    $gameBoard = $("<div id='gameBoard' />");
    $gameBoard.css("width", DIMENSION_X * blockSize);
    $gameBoard.css("height", (DIMENSION_Y) * blockSize);
    $("#iTetris").append($gameBoard);

    for (var y = 0; y < extentY; y++)
    {
        gameBoard[y] = [];
        for (var x = 0; x < DIMENSION_X; x++)
        {
            var block = gameBoard[y][x] = _.extend(
                {
                    filled: false,
                    colour: BOARD_COLOUR,
                    $elem: $("<div class='block' />"),
                }, blockProto);
            block.$elem.css("width", blockSize);
            block.$elem.css("height", blockSize);
            if (y < HIDDEN_ROWS) block.$elem.hide();
            $gameBoard.append(block.$elem);
            block.render();
        }
    }
}

function isBlockSettled(x, y)
{
    return (y >= extentY - 1 || gameBoard[y + 1][x].filled);
}

function isActiveShapeSettled()
{
    for (var x = 0; x < activeShape.width(); x++)
    {
        for (var y = activeShape.height() - 1; y >= 0; y--)
        {
            if (activeShape.definition[y][x])
            {
                if (isBlockSettled(activeShape.currX + x, activeShape.currY + y))
                    return true
                break;
            }
        }
    }
    return false;
}

function newRandomShape()
{
    var shapeId = Math.floor(Math.random() * (shapes.length - 1));
    var shape = _.extend({}, shapes[shapeId]);   
    var angle = Math.floor(Math.random() * 4) * 90;
    return rotateShape(shape, angle);
}

function addRandomShape()
{
    activeShape = newRandomShape();
    var startX = Math.floor((DIMENSION_X - activeShape.width()) / 2);
    var startY = HIDDEN_ROWS - activeShape.height() - 1;

    activeShape.currX = startX;
    activeShape.currY = startY;

    for (var y = 0; y < activeShape.height(); y++)
    {
        for (var x = 0; x < activeShape.width(); x++)
        {
            var block = gameBoard[activeShape.currY + y][activeShape.currX + x]
            block.filled = activeShape.definition[y][x];
            if (block.filled)
            {
                block.colour = activeShape.colour;
                block.render();
            }
        }
    }
}

function completeRows()
{
    var completedRows = [];
    for (var y = extentY - 1 ; y >= 0 ; y--)
    {
        for (var x = 0; x < DIMENSION_X; x++)
        {
            if (!cleanBoardView(x, y))
            {
                completedRows[y] = 0;
                break;
            }
            if (x == DIMENSION_X - 1) completedRows[y] = 1;
        }

        if (completedRows[y])
        {
            for (var iy = y; iy >= 0 ; iy--)
            {
                for (var x = 0; x < DIMENSION_X; x++)
                {
                    var block = gameBoard[iy][x];
                    block.filled = iy === 0 ? false : cleanBoardView(x, iy - 1);
                    block.colour = block.filled && iy !== 0 ? gameBoard[iy - 1][x].colour : "transparent"; // Really need to make cleanBoardView return blocks not boolean
                    block.render();
                }
            }
        }
    }
}

function doGameOver()
{
    //alert("GAME OVER SUCKER!");
}

function isGameOver()
{
    var gameOver = false;
    _.each(gameBoard[HIDDEN_ROWS - 1], function(block)
    {
        if (block.filled) gameOver = true;
    });
    return gameOver;
}

var newGame = true;
var loopPosition = 0;

function gameLoop()
{
    if (newGame || isActiveShapeSettled())
    {
        newGame = false;
        if (isGameOver())
        {
            doGameOver();
            return;
        }
        addRandomShape();
    }

    translateActiveShape(0, 1, true);
    completeRows();

    timeout = setTimeout(gameLoop, currSpeed);
}

function moveLeft()
{
    translateActiveShape(-1, 0);
}

function moveRight()
{
    translateActiveShape(1, 0);
}

function rotate()
{
    rotateActiveShape(270);
}

function moveDown()
{
    translateActiveShape(0, 1);
}

function setupBindings()
{
    $(document).keydown(function(e)
    {
        switch(e.which)
        {
            case 37: // Left arrow key
                moveLeft();
                break;
            case 38: // Up arrow key
                rotate();
                break;
            case 39: // Right arrow key
                moveRight();
                break;
            case 40: // Down arrow key
                moveDown();
                break;
            case 32: // Space bar
                drop();
                break;
            case 32: // Space bar
                drop();
                break;
            default:
                return;
        }
        e.preventDefault();
    });

    // var initX = e.pageX;
    // var initY = e.pageY;
    // $(document).mousemove(function(e)
    // {
    //     var xDelta = initX - e.pageX;
    //     if (Math.abs(xDelta) > blockSize) xDelta > 0 ? moveLeft() : moveRight();
    //     e.preventDefault();
    // });
    // e.preventDefault();


    var hammertime = $("#iTetris").hammer()

    hammertime.on("swipedown", function(e) {
        drop();
        e.preventDefault();
    });

    hammertime.on("swipeup", function(e) {
        rotate();
        e.preventDefault();
    });

    hammertime.on("dragleft", function(e) {
        moveLeft();
        e.preventDefault();
    });

    hammertime.on("dragright", function(e) {
        moveRight();
        e.preventDefault();
    });

    hammertime.on("dragdown", function(e) {
        moveDown();
        e.preventDefault();
    });

    hammertime.on("tap doubletap", function(e) {
        moveDown();
        e.preventDefault();
    });

    hammertime.on("touchmove", function(e) {
        e.preventDefault();
    });
}

$(function()
{
    drawBoard();
    setupBindings();
    gameLoop();
});
