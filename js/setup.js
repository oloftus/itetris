/**** SETUP ****/

function clearGameBoard()
{
    $("#scoreCard").remove();
    $("#nextShape").remove();
    $("#gameBoard").remove();
}

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

function setupDialogTemplates()
{
    _.each(TEMPLATES, function(templateName)
    {
        $templates[templateName] = $("#template-" + templateName);
    });
    $("#templates").detach();
}

function setupGame()
{
    currSpeed = GAME_SPEED;
    currLevel = 1;
    currScore = 0;
    currRows = 0;
    gameBoard = [];
    nextShapeDisplay = [];

    clearGameBoard();
    drawGameBoard();
    setupGameTimer();
    setupTouchBindings();
    setupKeyBindings();
    isNewGame = true;
    gameLoop();
}
