/**** SETUP ****/

function clearGameBoard()
{
    $("#scoreCard").remove();
    $("#nextShape").remove();
    $("#gameBoard").remove();
}

function drawGameBoard()
{
    var nextShapeBlockSize = Math.floor(blockSize / 3);
    var nextShapeBorderWidth = Math.floor(borderWidth / 3);
    var nextShapeBlockWidth =  nextShapeBlockSize - (2 * nextShapeBorderWidth);
    var nextShapeDisplayWidth = nextShapeDisplayDimension * nextShapeBlockSize;

    var adjustedBlockSize = (blockSize - Math.floor((nextShapeDisplayWidth + nextShapePadding + iphoneBarHeight + 10) / dimensionY));
    var boardWidth = dimensionX * adjustedBlockSize;
    var boardHeight = dimensionY * adjustedBlockSize;
    var blockWidth = (adjustedBlockSize - (2 * borderWidth));
    
    $gameRoot.width(boardWidth);

    var $scoreCard = $(
        "<div id='scoreCard'>" +
            "<p>R: <span id='scoreRows' /></p>" +
            "<p>S: <span id='scoreScore' /></p>" +
            "<p>L: <span id='scoreLevel' /></p>" +
        "</div>");
    $gameRoot.append($scoreCard);
    updateScores();

    var $nextShapeDisplay = $("<div id='nextShape' />")
    $nextShapeDisplay.css("width", nextShapeDisplayWidth);
    $nextShapeDisplay.css("height", nextShapeDisplayWidth);
    $gameRoot.append($nextShapeDisplay);
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

    var $gameBoard = $("<div id='gameBoard' />");
    $gameBoard.width(boardWidth);
    $gameBoard.height(boardHeight);
    $("#iTetris").append($gameBoard);

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

function pauseGameTimer()
{
    clearInterval(scoreTimer);
}

function unpauseGameTimer()
{
    scoreTimer = setInterval(_gameTimerCallback, 100);
}

function setupGameTimer()
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
    _.each(templates, function(templateName)
    {
        $templates[templateName] = $("#template-" + templateName);
    });
    $("#templates").detach();
}

function setupGame()
{
    currSpeed = gameSpeed;
    currLevel = 1;
    currScore = 0;
    currRows = 0;
    gameBoard = [];
    nextShapeDisplay = [];
    isNewGame = true;
    
    clearGameBoard();
    drawGameBoard();
    setupGameTimer();
    setupControls();
    gameLoop();
}

function preventIphonePanning()
{
    var hammertime = $("#iTetris").hammer()

    hammertime.on("touchmove", function(e)
    {
        e.preventDefault();
    });
}

function boot()
{
    preventIphonePanning();
    drawGameBoard();
    setupDialogTemplates();
    showDialog(templates.newGame, false);
}
