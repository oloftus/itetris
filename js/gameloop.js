/**** GAME LOOP ****/

function newRandomShape()
{
    var shapeId = Math.floor(Math.random() * (shapes.length - 1));
    var shape = _.extend({}, shapes[shapeId]);   
    var angle = Math.floor(Math.random() * 4) * 90;
    var rotShape = rotateShape(shape, angle);
    return rotShape;
}

function displayNextShape(shape)
{
    if (oldNextShape) oldNextShape.clear();
    nextShape = _.extend({}, shape);
    nextShape.container = nextShapeDisplay;
    var startX = Math.floor((NEXT_SHAPE_DISPLAY_DIMENSION - nextShape.width()) / 2);
    var startY = Math.floor((NEXT_SHAPE_DISPLAY_DIMENSION - nextShape.height()) / 2);
    nextShape.currX = startX;
    nextShape.currY = startY;
    nextShape.draw();
}

function addShapeToBoard(shape)
{
    activeShape = _.extend({}, shape);
    activeShape.container = gameBoard;
    var startX = Math.floor((DIMENSION_X - activeShape.width()) / 2);
    var startY = HIDDEN_ROWS - activeShape.height() - 1;
    activeShape.currX = startX;
    activeShape.currY = startY;
    activeShape.draw();
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
            for (var iy = y; iy >= 0; iy--)
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
    alert("GAME OVER");
}

function isGameOver()
{
    return _.some(cleanBoardView(HIDDEN_ROWS - 1), function(block)
    {
        return block;
    });
}

function gameLoop()
{
    if (isNewGame) nextShape = newRandomShape();

    if (isNewGame || isActiveShapeSettled())
    {
        isNewGame = false;
        if (isGameOver())
        {
            doGameOver();
            return;
        }
        addShapeToBoard(nextShape);
        displayNextShape(newRandomShape());
        oldNextShape = nextShape;
        completeRows();
    }

    translateActiveShape(0, 1, true);
    gameLoopTimer = setTimeout(gameLoop, currSpeed);
}
