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

function clearKeyBindings()
{
    $(document).off("keydown");
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

function clearTouchBindings()
{
    var hammertime = $("#" + elementIds.gameRoot).hammer();
    hammertime.off("dragend");
    hammertime.off("swipedown");
    hammertime.off("tap");
    hammertime.off("drag");
    hammertime.off("dragdown");

    hammertime = $("#" + elementIds.branding).hammer();
    hammertime.off("tap");
}

function setupTouchBindings()
{
    var hammertime = $("#" + elementIds.gameRoot).hammer()

    var directions =
    {
        left: "left",
        right: "Right"
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
    });

    hammertime.on("drag", function(e)
    {
        var deltaX = e.gesture.deltaX;
        var direction = deltaX < initPosX ? directions.left : directions.right;

        if (Math.abs(deltaX - initPosX) <= Math.abs(lastDeltaX - initPosX))
        {
            direction = direction === directions.left ? directions.right : directions.left;
            initPosX = deltaX;
            blocksMovedX = 0;
        }

        var distanceToMoveX = Math.abs(deltaX - initPosX) - blocksMovedX * blockSize;
        if (distanceToMoveX >= blockSize)
        {
            switch (direction)
            {
                case directions.left:
                    moveLeft();
                    break;
                case directions.right:
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
        var distanceToMoveY = Math.abs(deltaY) - blocksMovedY * blockSize;
        
        if (distanceToMoveY >= blockSize)
        {
            moveDown();
            blocksMovedY++;
        }

        e.preventDefault();
    });

    hammertime = $("#" + elementIds.branding).hammer();

    hammertime.on("tap", function(e)
    {
        showDialog(dialogTemplates.gamepaused, true);
        e.preventDefault();
    });
}

function setupControls()
{
    if (!controlsActive && $("#" + elementIds.gameRoot).length > 0)
    {
        setupTouchBindings();
        setupKeyBindings();
        controlsActive = true;
    }
}

function clearControls()
{
    clearTouchBindings();
    clearKeyBindings();
    controlsActive = false;
}

function pauseGame()
{
    pauseScoreTimer();
    clearControls();
    breakGameLoop();
    gamePaused = true;
}

function unpauseGame()
{
    if (gamePaused)
    {
        unpauseScoreTimer();
        setupControls()
        gameLoop();
        gamePaused = false;
    }
}
