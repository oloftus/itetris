/********************
    CONFIGURATION   */

var DIMENSION_X = 10; //blocks
var DIMENSION_Y = 20; //blocks
var GAME_SPEED = 1000; //millliseconds
var BORDER_THICKNESS = 3; //pixels

/********************/

var BOARD_COLOUR = "transparent"
var HIDDEN_ROWS = 5;
var EXTENT_Y = DIMENSION_Y + HIDDEN_ROWS;
$(function(){
    BLOCK_SIZE = Math.floor(Math.min($(document).width() / DIMENSION_X, $(document).height() / DIMENSION_Y) - 1);
});

var BLOCKED = 
{
    LEFT: "left",
    RIGHT: "right"
}

var isNewGame = true;
var activeShape;
var currSpeed = GAME_SPEED;
var gameBoard = [];
var timeout;

var shapeProto =
{
    width: function() { return this.definition[0].length; },
    height: function() { return this.definition.length; },

    __blocksInOrder: function(func)
    {
        var rows = this.definition;
        _.each(rows, _.bind(function(row, y)
        {
            _.each(row, _.bind(function(blockDef, x)
            {
                func = _.bind(func, this);
                func(x, y, blockDef);
            }, this));
        }, this));
    },

    visualise: function()
    {
        var drawing = "";
        var rows = this.definition;
        _.each(rows, function(row)
        {
            _.each(row, function(blockDef)
            {
                drawing += blockDef ? "X" : " ";
            });
            drawing += "\n";
        });
        console.log(drawing);
    },

    draw: function()
    {
        this.__blocksInOrder(function(x, y, blockDef) {
            var gameBlock = gameBoard[this.currY + y][this.currX + x];
            gameBlock.filled = blockDef | gameBlock.filled;
            gameBlock.colour = blockDef ? this.colour : gameBlock.colour;
            gameBlock.render();
        });
    },

    clear: function()
    {
        this.__blocksInOrder(function(x, y, blockDef) {
            var gameBlock = gameBoard[this.currY + y][this.currX + x];
            gameBlock.filled = blockDef ? false : gameBlock.filled;
            gameBlock.colour = blockDef ? BOARD_COLOUR : gameBlock.colour;
            gameBlock.render();
        });
    }
};

var blockProto =
{
    render: function()
    {
        this.$elem.css("background", this.colour);
        this.$elem.css("border-color", this.colour);
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
    
    for (var i = 0; i < rotShapeHeight; i++)
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

function blockHidden()
{
    return activeShape.currY + activeShape.height() - 1 < HIDDEN_ROWS;
}

function isActiveShapeBlocked(side) // REM SIDE
{
    for (var y = activeShape.height() - 1; y >= 0; y--)
    {
        if (side == BLOCKED.LEFT)
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
        proposedY < 0 || proposedY + activeShape.height() - 1 >= EXTENT_Y ||
        (y && isActiveShapeSettled())) return;

    if (x != 0 && isActiveShapeBlocked(x > 0 ? BLOCKED.RIGHT : BLOCKED.LEFT)) return;

    activeShape.clear();
    activeShape.currX += x;
    activeShape.currY += y;
    activeShape.draw();
}

function drop()
{
    var currMin = EXTENT_Y + 1000;

    for (var x = 0; x < activeShape.width(); x++)
    {
        for (var y = activeShape.height() - 1; y >= 0; y--)
        {
            if (activeShape.definition[y][x])
            {
                var colMax;
                for (var boardY = activeShape.currY + y + 1; boardY < EXTENT_Y; boardY++)
                {
                    if (gameBoard[boardY][activeShape.currX + x].filled)
                    {
                        colMax = boardY - (activeShape.currY + y) - 1;
                        break;
                    }
                    colMax = EXTENT_Y - activeShape.currY - activeShape.height();
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
        activeShape.currY + proposedShape.height() > EXTENT_Y) return;

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

function drawGameBoard()
{
    var $gameBoard = $("<div id='gameBoard' />");
    $gameBoard.css("width", DIMENSION_X * BLOCK_SIZE);
    $gameBoard.css("height", DIMENSION_Y * BLOCK_SIZE);
    $("#iTetris").append($gameBoard);

    for (var y = 0; y < EXTENT_Y; y++)
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
            block.$elem.css("width", BLOCK_SIZE - (2 * BORDER_THICKNESS));
            block.$elem.css("height", BLOCK_SIZE - (2 * BORDER_THICKNESS));
            block.$elem.css("border-width", BORDER_THICKNESS);
            block.$elem.css("border-style", "outset");
            if (y < HIDDEN_ROWS) block.$elem.hide();
            $gameBoard.append(block.$elem);
            block.render();
        }
    }
}

function isBlockSettled(x, y)
{
    return (y >= EXTENT_Y - 1 || gameBoard[y + 1][x].filled);
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
    for (var y = EXTENT_Y - 1 ; y >= 0 ; y--)
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
                    block.colour = block.filled && iy !== 0 ? gameBoard[iy - 1][x].colour : BOARD_COLOUR; // Really need to make cleanBoardView return blocks not boolean
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

function gameLoop()
{
    if (isNewGame || isActiveShapeSettled())
    {
        isNewGame = false;
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

function setupKeyBindings()
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
            default:
                return;
        }
        e.preventDefault();
    });
}

function setupTouchBindings()
{
    var hammertime = $("#iTetris").hammer()

    var DIRECTION =
    {
        LEFT: "left",
        RIGHT: "Right"
    }

    var blocksMovedX;
    var blocksMovedY;
    var initPosX;
    var initPosY;
    var lastDeltaX;
    var direction;

    function initDragParams()
    {
        blocksMovedX = 0;
        blocksMovedY = 0;
        initPosX = 0;
        initPosY = 0;
        lastDeltaX = 0;
    }

    hammertime.on("dragend", initDragParams);
    initDragParams();

    hammertime.on("swipedown", function(e) {
        drop();
        e.preventDefault();
    });

    hammertime.on("swipeup", function(e) {
        rotate();
        e.preventDefault();
    });

    hammertime.on("drag", function(e) {
        var deltaX = e.gesture.deltaX;
        direction = deltaX < initPosX ? DIRECTION.LEFT : DIRECTION.RIGHT;

        if (Math.abs(deltaX - initPosX) <= lastDeltaX)
        {
            direction = direction === DIRECTION.LEFT ? DIRECTION.RIGHT : DIRECTION.LEFT;
            initPosX = deltaX;
            blocksMovedX = 0;
        }

        var distanceToMoveX = Math.abs(deltaX - initPosX) - blocksMovedX * BLOCK_SIZE;
        if (distanceToMoveX >= BLOCK_SIZE)
        {
            switch (direction)
            {
                case DIRECTION.LEFT:
                    moveLeft();
                    break;
                case DIRECTION._RIGHT:
                    moveRight();
                    break;
            }
            blocksMovedX++;
        }

        lastDeltaX = Math.abs(deltaX - initPosX);

        e.preventDefault();
    });

    hammertime.on("dragdown", function(e) {
        var deltaY = e.gesture.deltaY;
        var distanceToMoveY = Math.abs(deltaY - initPosY) - blocksMovedY * BLOCK_SIZE;
        
        if (distanceToMoveY >= BLOCK_SIZE)
        {
            moveDown();
            blocksMovedY++;
        }

        e.preventDefault();
    });

    // Stop panning iPhone viewport up and down
    hammertime.on("touchmove", function(e) {
        e.preventDefault();
    });
}

$(function()
{
    drawGameBoard();
    setupKeyBindings();
    setupTouchBindings();
    gameLoop();
});
