/**** ACTIVE SHAPE ****/

function isActiveShapeBlocked(side)
{
    for (var y = activeShape.height() - 1; y >= 0; y--)
    {
        switch (side)
        {
            case blocked.left:
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

            case blocked.right:
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
                if (boardY >= extentY - 1 || gameBoard[boardY + 1][boardX].filled)
                    return true
                break;
            }
        }
    }
    return false;
}

function isBlockHidden()
{
    return activeShape.currY + activeShape.height() - 1 < hiddenRows;
}

function translateActiveShape(x, y, isGameLoop)
{
    var proposedX = activeShape.currX + x;
    var proposedY = activeShape.currY + y;

    if ((isBlockHidden() && !isGameLoop) ||
        proposedX < 0 || proposedX + activeShape.width() > dimensionX  ||
        proposedY < 0 || proposedY + activeShape.height() > extentY ||
        (y && isActiveShapeSettled()) ||
        (x && isActiveShapeBlocked(x > 0 ? blocked.right : blocked.left))) return;

    activeShape.clear();
    activeShape.currX += x;
    activeShape.currY += y;
    activeShape.draw();
}

function rotateActiveShape(angle)
{
    var proposedShape = rotateShape(activeShape, angle);

    if (isBlockHidden() ||
        activeShape.currX + proposedShape.width() > dimensionX ||
        activeShape.currY + proposedShape.height() > extentY) return;

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
    if (activeShape.currY + activeShape.height() > extentY) return;

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
    breakGameLoop();
    gameLoop();
}