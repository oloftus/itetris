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

function pauseGame()
{
    clearTimeout(gameLoopTimer);
    gamePaused = true;
}

function unpauseGame()
{
    if (gamePaused)
    {
        gamePaused = false;
        gameLoop();
    }
}
