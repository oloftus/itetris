/**** SCORING ****/

function updateScores()
{
    var $scoreRows = $("#scoreRows");
    var $scoreScore = $("#scoreScore");
    var $scoreLevel = $("#scoreLevel");
    $scoreRows.text(currRows);
    $scoreScore.text(currScore);
    $scoreLevel.text(currLevel);
}

function updateRows(consecutiveRows)
{
    switch (consecutiveRows)
    {
        default:
            currRows += consecutiveRows;
            currScore += consecutiveRows * 1;
            break;
    }
    updateScores();
}
