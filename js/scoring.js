/**** SCORING ****/

function updateScores()
{
    var $scoreRows = $("#" + elementIds.scoreRows);
    var $scoreScore = $("#" + elementIds.scoreScore);
    var $scoreLevel = $("#" + elementIds.scoreLevel);
    $scoreRows.text(currRows);
    $scoreScore.text(currScore);
    $scoreLevel.text(currLevel);
}

function updateRows(consecutiveRows)
{
    // Scoring guidelines: http://www.tetrisfriends.com/help/tips_appendix.php#scoringchart
    switch (consecutiveRows)
    {
        case 1:
            currScore += currLevel * 100;
            break;
        case 2:
            currScore += currLevel * 300;
            break;
        case 3:
            currScore += currLevel * 500;
            break;
        case 4:
            currScore += currLevel * 800;
            break;
    }
    currRows += consecutiveRows;
    updateScores();
}
