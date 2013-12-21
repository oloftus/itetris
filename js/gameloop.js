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
    var startX = Math.floor((4 - shape.width()) / 2);
    var startY = Math.floor(shape.height() / 2);

    shape.currX = startX;
    shape.currY = startY;

    blocksInOrder(function(x, y, blockDef)
        {
            var block = nextShapeDisplay[shape.currY + y][shape.currX + x]
            block.filled = blockDef;
            block.colour = blockDef ? shape.colour : block.colour;
            block.render();
        }, this, shape);
}

function addShape(shape)
{
    activeShape = shape;
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
    return _.some(cleanBoardView(HIDDEN_ROWS - 1), function(block)
    {
        return block.filled;
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
        addShape(nextShape);
        nextShape = newRandomShape();
        displayNextShape(nextShape);
        completeRows();
    }

    translateActiveShape(0, 1, true);
    gameLoopTimer = setTimeout(gameLoop, currSpeed);
}
