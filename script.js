/********************
    CONFIGURATION   */

var DIMENSION_X = 10; //blocks
var DIMENSION_Y = 20; //blocks
var GAME_SPEED = 1000; //millliseconds
var BORDER_WIDTH = 3; //pixels

/********************/


/**** GLOBALS ****/

var BOARD_COLOUR = "transparent"
var HIDDEN_ROWS = 5;
var EXTENT_Y = DIMENSION_Y + HIDDEN_ROWS;
$(function(){
    BLOCK_SIZE = Math.ceil(Math.min($(document).width() / DIMENSION_X, $(document).height() / DIMENSION_Y) - 1);
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
var gameLoopTimer;


/**** UTILITY ****/

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

    blocksInOrder(function(x, y, blockDef)
        {
            var coordX = x + 1;
            var coordY = shape.height() - y;
            
            var newCoordX = coordX * Math.round(Math.cos(radAngle)) - coordY * Math.round(Math.sin(radAngle));
            var newCoordY = coordX * Math.round(Math.sin(radAngle)) + coordY * Math.round(Math.cos(radAngle));
            
            var transformedCoordX = angle === 90 || angle === 180 ? newCoordX + rotShapeWidth + 1 : newCoordX;
            var transformedCoordY = angle === 180 || angle === 270 ? newCoordY + rotShapeHeight + 1 : newCoordY;

            var transformedX = transformedCoordX - 1;
            var transformedY = rotShapeHeight - transformedCoordY;

            rotShapeDef[transformedY][transformedX] = blockDef;
        }, this, shape);

    shape.definition = rotShapeDef;
    return shape;
}

function cleanBoardView(y, x)
{
    if (typeof x === "undefined")
    {
        return _.map(gameBoard[y], function(block, x)
        {
            if (typeof activeShape !== "undefined" &&
                activeShape.currX <= x && x < activeShape.currX + activeShape.width() &&
                activeShape.currY <= y && y < activeShape.currY + activeShape.height())
            {
                var shapeIndexX = x - activeShape.currX;
                var shapeIndexY = y - activeShape.currY;
                return activeShape.definition[shapeIndexY][shapeIndexX] ^ block.filled;
            }
            else return block.filled;
        });
    }

    if ((activeShape.currX <= x) && (x < activeShape.currX + activeShape.width()) &&
        (activeShape.currY <= y) && (y < activeShape.currY + activeShape.height()))
    {
        var shapeIndexX = x - activeShape.currX;
        var shapeIndexY = y - activeShape.currY;
        return activeShape.definition[shapeIndexY][shapeIndexX] ^ gameBoard[y][x].filled;
    }
    else return gameBoard[y][x].filled;
}

function blocksInOrder(func, self, shape)
{
    var rows = shape.definition;
    _.each(rows, _.bind(function(row, y)
    {
        _.each(row, _.bind(function(blockDef, x)
        {
            func = _.bind(func, this);
            func(x, y, blockDef);
        }, self));
    }, self));
}

/**** SHAPES & BLOCKS ****/

var shapeProto =
{
    width: function() { return this.definition[0].length; },
    height: function() { return this.definition.length; },

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
        blocksInOrder(function(x, y, blockDef)
            {
                var gameBlock = gameBoard[this.currY + y][this.currX + x];
                gameBlock.filled = blockDef | gameBlock.filled;
                gameBlock.colour = blockDef ? this.colour : gameBlock.colour;
                gameBlock.render();
            }, this, this);
    },

    clear: function()
    {
        blocksInOrder(function(x, y, blockDef)
            {
                var gameBlock = gameBoard[this.currY + y][this.currX + x];
                gameBlock.filled = blockDef ? false : gameBlock.filled;
                gameBlock.colour = blockDef ? BOARD_COLOUR : gameBlock.colour;
                gameBlock.render();
            }, this, this);
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


/**** ACTIVE SHAPE ****/

function isActiveShapeBlocked(side)
{
    for (var y = activeShape.height() - 1; y >= 0; y--)
    {
        switch (side)
        {
            case BLOCKED.LEFT:
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
                break;

            case BLOCKED.RIGHT:
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
                break;
        }
    }
}

function isActiveShapeSettled()
{
    for (var x = 0; x < activeShape.width(); x++)
    {
        for (var y = activeShape.height() - 1; y >= 0; y--)
        {
            if (activeShape.definition[y][x])
            {
                var boardX = activeShape.currX + x;
                var boardY = activeShape.currY + y;
                if (boardY >= EXTENT_Y - 1 || gameBoard[boardY + 1][boardX].filled)
                    return true
                break;
            }
        }
    }
    return false;
}

function isBlockHidden()
{
    return activeShape.currY + activeShape.height() - 1 < HIDDEN_ROWS;
}

function translateActiveShape(x, y, isGameLoop)
{
    var proposedX = activeShape.currX + x;
    var proposedY = activeShape.currY + y;

    if ((isBlockHidden() && !isGameLoop) ||
        proposedX < 0 || proposedX + activeShape.width() - 1 >= DIMENSION_X  ||
        proposedY < 0 || proposedY + activeShape.height() - 1 >= EXTENT_Y ||
        (y && isActiveShapeSettled()) ||
        (x && isActiveShapeBlocked(x > 0 ? BLOCKED.RIGHT : BLOCKED.LEFT))) return;

    activeShape.clear();
    activeShape.currX += x;
    activeShape.currY += y;
    activeShape.draw();
}

function rotateActiveShape(angle)
{
    var proposedShape = rotateShape(activeShape, angle);

    if (isBlockHidden() ||
        activeShape.currX + proposedShape.width() > DIMENSION_X ||
        activeShape.currY + proposedShape.height() > EXTENT_Y) return;

    for (var y = 0; y < proposedShape.height(); y++)
    {
        for (var x = 0; x < proposedShape.width(); x++)
        {
            if (proposedShape.definition[y][x] &&
                cleanBoardView(activeShape.currY + y, activeShape.currX + x)) return;
        }
    }

    activeShape.clear();
    activeShape = proposedShape;
    activeShape.draw();
}

function dropActiveShape()
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
    clearTimeout(gameLoopTimer);
    gameLoop();
}


/**** GAME LOOP ****/

function newRandomShape()
{
    var shapeId = 1; //Math.floor(Math.random() * (shapes.length - 1));
    var shape = _.extend({}, shapes[shapeId]);   
    var angle = 270;//Math.floor(Math.random() * 4) * 90;
    var rotShape = rotateShape(shape, angle);
    return rotShape;
}

function addRandomShape()
{
    activeShape = newRandomShape();
    var startX = Math.floor((DIMENSION_X - activeShape.width()) / 2);
    var startY = HIDDEN_ROWS - activeShape.height() - 1;

    activeShape.currX = startX;
    activeShape.currY = startY;

    blocksInOrder(function(x, y, blockDef)
        {
            var block = gameBoard[activeShape.currY + y][activeShape.currX + x]
            block.filled = blockDef;
            block.colour = blockDef ? activeShape.colour : block.colour;
            block.render();
        }, this, activeShape);
}

function completeRows()
{
    var completedRows = [];
    for (var y = EXTENT_Y - 1 ; y >= 0 ; y--)
    {
        for (var x = 0; x < DIMENSION_X; x++)
        {
            if (!cleanBoardView(y, x))
            {
                completedRows.push(0);
                break;
            }
            if (x === DIMENSION_X - 1) completedRows.push(1);
        }

        if (_.last(completedRows) === 1)
        {
            for (var iy = y; iy >= 0 ; iy--)
            {
                for (var x = 0; x < DIMENSION_X; x++)
                {
                    var block = gameBoard[iy][x];
                    block.filled = iy === 0 ? false : cleanBoardView(iy - 1, x);
                    block.colour = block.filled && iy !== 0 ? gameBoard[iy - 1][x].colour : BOARD_COLOUR;
                    block.render();
                }
            }
            y++;
        }
    }
}

function doGameOver()
{
    gameIsOver = true;
}

function isGameOver()
{
    console.log("checking game over");
    return _.some(cleanBoardView(HIDDEN_ROWS - 1), function(block)
    {
        return block.filled;
    });
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
        completeRows();
    }

    translateActiveShape(0, 1, true);
    gameLoopTimer = setTimeout(gameLoop, currSpeed);
}


/**** CONTROLS ****/
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

function drop()
{
    dropActiveShape();
}


/**** SETUP ****/

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
            var block = _.extend(
                {
                    filled: false,
                    colour: BOARD_COLOUR,
                    $elem: $("<div class='block' />"),
                }, blockProto);
            block.$elem.css("width", BLOCK_SIZE - (2 * BORDER_WIDTH));
            block.$elem.css("height", BLOCK_SIZE - (2 * BORDER_WIDTH));
            block.$elem.css("border-width", BORDER_WIDTH);
            block.$elem.css("border-style", "outset");
            $gameBoard.append(block.$elem);
            gameBoard[y][x] = block;

            if (y < HIDDEN_ROWS) block.$elem.hide();
            block.render();
        }
    }
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
    var lastDeltaX;

    function initParams()
    {
        blocksMovedX = 0;
        blocksMovedY = 0;
        initPosX = 0;
        lastDeltaX = 0;
    }

    // Stop panning iPhone viewport up and down
    hammertime.on("touchmove", function(e)
    {
        e.preventDefault();
    });

    hammertime.on("dragend", initParams);
    initParams();

    hammertime.on("swipedown", function(e)
    {
        drop();
        e.preventDefault();
    });

    hammertime.on("tap", function(e)
    {
        rotate();
        e.preventDefault();
    });

    hammertime.on("drag", function(e)
    {
        var deltaX = e.gesture.deltaX;
        var direction = deltaX < initPosX ? DIRECTION.LEFT : DIRECTION.RIGHT;

        if (Math.abs(deltaX - initPosX) <= Math.abs(lastDeltaX - initPosX))
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
                case DIRECTION.RIGHT:
                    moveRight();
                    break;
            }
            blocksMovedX++;
        }

        lastDeltaX = deltaX;

        e.preventDefault();
    });

    hammertime.on("dragdown", function(e)
    {
        var deltaY = e.gesture.deltaY;
        var distanceToMoveY = Math.abs(deltaY) - blocksMovedY * BLOCK_SIZE;
        
        if (distanceToMoveY >= BLOCK_SIZE)
        {
            moveDown();
            blocksMovedY++;
        }

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
