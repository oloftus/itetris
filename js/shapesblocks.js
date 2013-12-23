/**** SHAPES & BLOCKS ****/

var shapeProto =
{
    width: function() { return this.definition[0].length; },
    height: function() { return this.definition.length; },

    visualise: function()
    {
        var drawing = "";
        var rows = this.definition;
        _.each(rows, function(row)
        {
            _.each(row, function(blockDef)
            {
                drawing += blockDef ? "X" : " ";
            });
            drawing += "\n";
        });
        console.log(drawing);
    },

    draw: function()
    {
        blocksInOrder(function(x, y, blockDef)
            {
                var gameBlock = this.container[this.currY + y][this.currX + x];
                gameBlock.filled = blockDef | gameBlock.filled;
                gameBlock.colour = blockDef ? this.colour : gameBlock.colour;
                gameBlock.render();
            }, this, this);
    },

    clear: function()
    {
        blocksInOrder(function(x, y, blockDef)
            {
                var gameBlock = this.container[this.currY + y][this.currX + x];
                gameBlock.filled = blockDef ? false : gameBlock.filled;
                gameBlock.colour = blockDef ? boardColour : gameBlock.colour;
                gameBlock.render();
            }, this, this);
    }
};

var blockProto =
{
    render: function()
    {
        this.$elem.css("background", this.colour);
        this.$elem.css("border-color", this.colour);
    }
};

var shapes =
[
    _.extend(
        {
            definition:
                [[1,1],
                 [1,1]],
            colour: "yellow"
        }, shapeProto),
    _.extend(
        {
            definition:
                [[1,1,1,1]],
            colour: "cyan"
        }, shapeProto),
    _.extend(
        {
                definition:
                    [[1,1,1],
                     [0,0,1]],
                 colour: "blue"
        }, shapeProto),
    _.extend(
        {
            definition:
                [[1,1,1],
                 [1,0,0]],
             colour: "orange"
        }, shapeProto),
    _.extend(
        {
            definition:
                [[0,1,1],
                 [1,1,0]],
            colour: "#80FF00" // Lime
        }, shapeProto),
    _.extend(
        {
            definition:
                [[1,1,0],
                 [0,1,1]],
             colour: "red"
        }, shapeProto),
    _.extend(
        {
            definition:
                [[1,1,1],
                 [0,1,0]],
             colour: "#800080" // Dark magenta
        }, shapeProto)
];
