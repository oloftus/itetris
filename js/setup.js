/**** SETUP ****/

function clearGameBoard()
{
    $("#score-card").remove();
    $("#next-shape").remove();
    $("#game-board").remove();
}

function drawGameBoard()
{
    var nextShapeBlockSize = Math.floor(blockSize / 3);
    var nextShapeBorderWidth = Math.floor(borderWidth / 3);
    var nextShapeBlockWidth =  nextShapeBlockSize - (2 * nextShapeBorderWidth);
    var nextShapeDisplayWidth = nextShapeDisplayDimension * nextShapeBlockSize;
    var headerHeight = nextShapeDisplayWidth + nextShapePadding;

    var adjustedBlockSize = (blockSize - Math.floor((headerHeight) / dimensionY));
    var boardWidth = dimensionX * adjustedBlockSize;
    var boardHeight = dimensionY * adjustedBlockSize;
    var blockWidth = (adjustedBlockSize - (2 * borderWidth));
    
    $gameRoot.width(boardWidth);

    $header = $("#header");
    $header.height(nextShapeDisplayWidth + nextShapePadding);

    var $scoreCard = $(
        "<table id='score-card'>" +
            "<tr><td>R<td><td><span id='score-rows' /></td></tr>" +
            "<tr><td>S<td><td><span id='score-score' /></td></tr>" +
            "<tr><td>L<td><td><span id='score-level' /></td></tr>" +
        "</table>");
    $header.append($scoreCard);
    updateScores();

    var $nextShapeDisplay = $("<div id='next-shape' />")
    $nextShapeDisplay.css("width", nextShapeDisplayWidth);
    $nextShapeDisplay.css("height", nextShapeDisplayWidth);
    $header.append($nextShapeDisplay);

    for (var y = 0; y < nextShapeDisplayDimension; y++)
    {
        nextShapeDisplay[y] = [];
        for (var x = 0; x < nextShapeDisplayDimension; x++)
        {
            var block = _.extend(
                {
                    filled: false,
                    colour: boardColour,
                    $elem: $("<div class='block' />"),
                }, blockProto);
            block.$elem.css("width", nextShapeBlockWidth);
            block.$elem.css("height", nextShapeBlockWidth);
            block.$elem.css("border-width", nextShapeBorderWidth);
            block.$elem.css("border-style", "outset");
            $nextShapeDisplay.append(block.$elem);
            nextShapeDisplay[y][x] = block;
            block.render();
        }
    }

    var $gameBoard = $("<div id='game-board' />");
    $gameBoard.width(boardWidth);
    $gameBoard.height(boardHeight);
    $gameRoot.append($gameBoard);

    for (var y = 0; y < extentY; y++)
    {
        gameBoard[y] = [];
        for (var x = 0; x < dimensionX; x++)
        {
            var block = _.extend(
                {
                    filled: false,
                    colour: boardColour,
                    $elem: $("<div class='block' />"),
                }, blockProto);
            block.$elem.width(blockWidth);
            block.$elem.height(blockWidth);
            block.$elem.css("border-width", borderWidth);
            block.$elem.css("border-style", "outset");
            $gameBoard.append(block.$elem);
            gameBoard[y][x] = block;
            if (y < hiddenRows) block.$elem.hide();
            block.render();
        }
    }
}

function _gameTimerCallback()
{
    var currTime = new Date().getTime();
    var timeDelta = currTime - scoreTimerStart;
    if (timeDelta > levelRollover)
    {
        currLevel += 1;
        currSpeed = 0.8 * currSpeed;
        scoreTimerStart = currTime;
        updateScores();
    }
}

function pauseScoreTimer()
{
    clearInterval(scoreTimer);
}

function unpauseScoreTimer()
{
    scoreTimer = setInterval(_gameTimerCallback, 100);
}

function setupScoreTimer()
{
    scoreTimerStart = new Date().getTime();
    scoreTimer = setInterval(_gameTimerCallback, 100);
}

function breakGameLoop()
{
    clearTimeout(gameLoopTimer);
}

function setupDialogTemplates()
{
    _.each(dialogTemplates, function(templateName)
    {
        $dialogTemplates[templateName] = $("#template-" + templateName);
    });
    $("#dialogTemplates").detach();
}

function teardownGame()
{
    clearGameBoard();
    pauseScoreTimer();
    clearControls();
    breakGameLoop();
}

function setupGame()
{
    initGlobals();
    drawGameBoard();
    setupScoreTimer();
    setupControls();
    gameLoop();
}

function preventIphonePanning()
{
    var hammertime = $(document).hammer()

    hammertime.on("touchmove", function(e)
    {
        e.preventDefault();
    });
}

function initGlobals()
{
    controlsActive = false;

    isNewGame = true;
    gameLoopTimer = null;
    gamePaused = false;

    scoreTimerStart = null;
    scoreTimer = null;

    currSpeed = gameSpeed;
    currLevel = 1;
    currScore = 0;
    currRows = 0;

    activeShape = null;
    lastShape = null;
    nextShape = null;
    gameBoard = [];
    nextShapeDisplay = [];
}

function boot()
{
    initGlobals();
    preventIphonePanning();
    setupDialogTemplates();
    drawGameBoard();
    showDialog(dialogTemplates.newGame, false);
}
