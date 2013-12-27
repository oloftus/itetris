/**** GAME LOOP ****/

function newRandomShape()
{
    var shapeId = Math.floor(Math.random() * (shapes.length));
    var shape = _.extend({}, shapes[shapeId]);   
    var angle = Math.floor(Math.random() * 4) * 90;
    var rotShape = rotateShape(shape, angle);
    return rotShape;
}

function setAndDisplayNextShape(shape)
{
    if (lastShape) lastShape.clear();
    nextShape = _.extend({}, shape);
    nextShape.container = nextShapeDisplay;
    var startX = Math.floor((nextShapeDisplayDimension - nextShape.width()) / 2);
    var startY = Math.floor((nextShapeDisplayDimension - nextShape.height()) / 2);
    nextShape.currX = startX;
    nextShape.currY = startY;
    nextShape.draw();
}

function addShapeToBoard(shape)
{
    activeShape = _.extend({}, shape);
    activeShape.container = gameBoard;
    var startX = Math.floor((dimensionX - activeShape.width()) / 2);
    var startY = hiddenRows - activeShape.height() - 1;
    activeShape.currX = startX;
    activeShape.currY = startY;
    activeShape.draw();
}

function completeRows()
{
    var completedRows = [];
    for (var y = extentY - 1 ; y >= 0 ; y--)
    {
        for (var x = 0; x < dimensionX; x++)
        {
            if (!cleanBoardView(y, x))
            {
                completedRows.push(0);
                break;
            }
            if (x === dimensionX - 1) completedRows.push(1);
        }

        if (_.last(completedRows))
        {
            for (var iy = y; iy >= 0; iy--)
            {
                for (var x = 0; x < dimensionX; x++)
                {
                    if (gameBoard[iy][x].filled === cleanBoardView(iy, x))
                    {
                        var block = gameBoard[iy][x];
                        block.filled = iy === 0 ? false : cleanBoardView(iy - 1, x);
                        block.colour = block.filled && iy !== 0 ? gameBoard[iy - 1][x].colour : boardColour;
                        block.render();
                    }
                }
            }
            y++;
        }
    }

    var consecutiveRows = 0;
    _.each(completedRows, function(complete)
    {
        if (complete) consecutiveRows++;
        else
        {
            updateRows(consecutiveRows);
            consecutiveRows = 0;
        }
    });
}

function doGameOver()
{
    pauseScoreTimer();
    clearControls();
    showDialog(dialogTemplates.gameOver, false);
}

function isGameOver()
{
    return _.some(cleanBoardView(hiddenRows - 1), function(block)
    {
        return block;
    });
}

function breakGameLoop()
{
    clearTimeout(gameLoopTimer);
}

function gameLoop()
{
    if (isNewGame) nextShape = newRandomShape();

    if (isNewGame || isActiveShapeSettled())
    {
        if (!isNewGame && isGameOver())
        {
            doGameOver();
            return;
        }
        isNewGame = false;
        addShapeToBoard(nextShape);
        setAndDisplayNextShape(newRandomShape());
        lastShape = nextShape;
        completeRows();
    }

    translateActiveShape(0, 1, true);
    gameLoopTimer = setTimeout(gameLoop, currSpeed);
}
