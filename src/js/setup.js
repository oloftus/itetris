/**** SETUP ****/

function clearGameBoard()
{
    $("#" + elementIds.scoreCard).remove();
    $("#" + elementIds.nextShape).remove();
    $("#" + elementIds.gameBoard).remove();
}

function drawGameBoard()
{
    function calcHeaderHeight()
    {
        var boardHeight = dimensionY * blockSize;
        return Math.max(Math.floor($(document).height() - (boardHeight + headerPadding)), minHeaderHeight)
    }

    var headerHeight = calcHeaderHeight();
    var nextShapeBlockSize = Math.floor(headerHeight / nextShapeDisplayDimension);
    var nextShapeBlockWidth = nextShapeBlockSize - (2 * nextShapeBorderWidth);
    blockSize = Math.floor(($(document).height() - (headerHeight + headerPadding)) / dimensionY)
    var boardWidth = dimensionX * blockSize;
    var boardHeight = dimensionY * blockSize;
    var blockWidth = (blockSize - (2 * borderWidth));
    headerHeight = calcHeaderHeight();

    $gameRoot = $("#" + elementIds.gameRoot);
    $gameRoot.width(boardWidth);

    $header = $("#" + elementIds.header);
    $header.height(headerHeight);

    var $scoreCard = $(
        "<table id='score-card'>" +
            "<tr><td>Rows<td><td><span id='" + elementIds.scoreRows + "' /></td></tr>" +
            "<tr><td>Score<td><td><span id='" + elementIds.scoreScore + "' /></td></tr>" +
            "<tr><td>Level<td><td><span id='" + elementIds.scoreLevel + "' /></td></tr>" +
        "</table>");
    $header.append($scoreCard);
    updateScores();

    var $nextShapeDisplay = $("<div id='" + elementIds.nextShape + "' />")
    $nextShapeDisplay.width(headerHeight);
    $nextShapeDisplay.height(headerHeight);
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
                    $elem: $("<div class='" + elementIds.block + "' />"),
                }, blockProto);
            block.$elem.width(nextShapeBlockWidth);
            block.$elem.height(nextShapeBlockWidth);
            block.$elem.css("border-width", nextShapeBorderWidth);
            block.$elem.css("border-style", "outset");
            $nextShapeDisplay.append(block.$elem);
            nextShapeDisplay[y][x] = block;
            block.render();
        }
    }

    var $gameBoard = $("<div id='" + elementIds.gameBoard + "' />");
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
                    $elem: $("<div class='" + elementIds.block + "' />"),
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
