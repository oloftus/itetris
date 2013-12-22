/**** SETUP ****/

function drawGameBoard()
{
    var NEXT_SHAPE_BLOCK_SIZE = Math.floor(BLOCK_SIZE / 3);
    var NEXT_SHAPE_BORDER_WIDTH = Math.floor(BORDER_WIDTH / 3);
    var NEXT_SHAPE_BLOCK_WIDTH =  NEXT_SHAPE_BLOCK_SIZE - (2 * NEXT_SHAPE_BORDER_WIDTH);
    var NEXT_SHAPE_DISPLAY_WIDTH = NEXT_SHAPE_DISPLAY_DIMENSION * NEXT_SHAPE_BLOCK_SIZE;

    var ADJUSTED_BLOCK_SIZE = (BLOCK_SIZE - Math.floor((NEXT_SHAPE_DISPLAY_WIDTH + NEXT_SHAPE_PADDING + IPHONE_BAR_HEIGHT) / DIMENSION_Y));
    var BOARD_WIDTH = DIMENSION_X * ADJUSTED_BLOCK_SIZE;
    var BOARD_HEIGHT = DIMENSION_Y * ADJUSTED_BLOCK_SIZE;
    var BLOCK_WIDTH = (ADJUSTED_BLOCK_SIZE - (2 * BORDER_WIDTH));
    
    $GAME_ROOT.width(BOARD_WIDTH);

    var $scoreCard = $(
        "<div id='scoreCard'>" +
            "<p>R: <span id='scoreRows' /></p>" +
            "<p>S: <span id='scoreScore' /></p>" +
            "<p>L: <span id='scoreLevel' /></p>" +
        "</div>");
    $GAME_ROOT.append($scoreCard);
    updateScores();

    var $nextShapeDisplay = $("<div id='nextShape' />")
    $nextShapeDisplay.css("width", NEXT_SHAPE_DISPLAY_WIDTH);
    $nextShapeDisplay.css("height", NEXT_SHAPE_DISPLAY_WIDTH);
    $GAME_ROOT.append($nextShapeDisplay);
    for (var y = 0; y < NEXT_SHAPE_DISPLAY_DIMENSION; y++)
    {
        nextShapeDisplay[y] = [];
        for (var x = 0; x < NEXT_SHAPE_DISPLAY_DIMENSION; x++)
        {
            var block = _.extend(
                {
                    filled: false,
                    colour: BOARD_COLOUR,
                    $elem: $("<div class='block' />"),
                }, blockProto);
            block.$elem.css("width", NEXT_SHAPE_BLOCK_WIDTH);
            block.$elem.css("height", NEXT_SHAPE_BLOCK_WIDTH);
            block.$elem.css("border-width", NEXT_SHAPE_BORDER_WIDTH);
            block.$elem.css("border-style", "outset");
            $nextShapeDisplay.append(block.$elem);
            nextShapeDisplay[y][x] = block;
            block.render();
        }
    }

    var $gameBoard = $("<div id='gameBoard' />");
    $gameBoard.width(BOARD_WIDTH);
    $gameBoard.height(BOARD_HEIGHT);
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
            block.$elem.width(BLOCK_WIDTH);
            block.$elem.height(BLOCK_WIDTH);
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

function setupGameTimer()
{
    scoreTimerStart = new Date().getTime();
    scoreTimer = setInterval(function()
        {
            var currTime = new Date().getTime();
            var timeDelta = currTime - scoreTimerStart;
            if (timeDelta > LEVEL_ROLLOVER)
            {
                currLevel += 1;
                currSpeed = 0.8 * currSpeed;
                scoreTimerStart = currTime;
                updateScores();
            }
        }, 100);
}

function setupGame()
{
    setupGameTimer();
    gameLoop();
}
