/**** UTILITY ****/

function rotateShape(shape, angle)
{
    shape = _.extend({}, shape);
    if (angle === 0 || angle === 360) return shape;

    var radAngle = 2 * Math.PI * angle / 360; 
    var rotShapeDef = [];
    var rotShapeWidth = angle === 180 ? shape.width() : shape.height();
    var rotShapeHeight = angle === 180 ? shape.height() : shape.width();
    
    for (var i = 0; i < rotShapeHeight; i++)
    {
        rotShapeDef[i] = [];
    }

    blocksInOrder(function(x, y, blockDef)
        {
            var coordX = x + 1;
            var coordY = shape.height() - y;
            
            var newCoordX = coordX * Math.round(Math.cos(radAngle)) - coordY * Math.round(Math.sin(radAngle));
            var newCoordY = coordX * Math.round(Math.sin(radAngle)) + coordY * Math.round(Math.cos(radAngle));
            
            var transformedCoordX = angle === 90 || angle === 180 ? newCoordX + rotShapeWidth + 1 : newCoordX;
            var transformedCoordY = angle === 180 || angle === 270 ? newCoordY + rotShapeHeight + 1 : newCoordY;

            var transformedX = transformedCoordX - 1;
            var transformedY = rotShapeHeight - transformedCoordY;

            rotShapeDef[transformedY][transformedX] = blockDef;
        }, this, shape);

    shape.definition = rotShapeDef;
    return shape;
}

function cleanBoardView(y, x)
{
    if (_.isUndefined(x))
    {
        return _.map(gameBoard[y], function(block, x)
        {
            if (!_.isUndefined(activeShape) &&
                activeShape.currX <= x && x < activeShape.currX + activeShape.width() &&
                activeShape.currY <= y && y < activeShape.currY + activeShape.height())
            {
                var shapeIndexX = x - activeShape.currX;
                var shapeIndexY = y - activeShape.currY;
                return activeShape.definition[shapeIndexY][shapeIndexX] ^ block.filled;
            }
            else return block.filled;
        });
    }

    if ((activeShape.currX <= x) && (x < activeShape.currX + activeShape.width()) &&
        (activeShape.currY <= y) && (y < activeShape.currY + activeShape.height()))
    {
        var shapeIndexX = x - activeShape.currX;
        var shapeIndexY = y - activeShape.currY;
        return activeShape.definition[shapeIndexY][shapeIndexX] ^ gameBoard[y][x].filled;
    }
    else return gameBoard[y][x].filled;
}

function blocksInOrder(func, self, shape)
{
    var rows = shape.definition;
    _.each(rows, _.bind(function(row, y)
    {
        _.each(row, _.bind(function(blockDef, x)
        {
            func = _.bind(func, this);
            func(x, y, blockDef);
        }, self));
    }, self));
}
