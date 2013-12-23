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
    var hammertime = $("#iTetris").hammer();
    hammertime.off("dragend");
    hammertime.off("swipedown");
    hammertime.off("tap");
    hammertime.off("drag");
    hammertime.off("dragdown");
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

function setupControls()
{
    if (!controlsActive)
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
    pauseGameTimer();
    clearControls();
    gamePaused = true;
    clearTimeout(gameLoopTimer);
}

function unpauseGame()
{
    if (gamePaused)
    {
        unpauseGameTimer();
        setupTouchBindings();
        setupKeyBindings();
        gamePaused = false;
        gameLoop();
    }
}
