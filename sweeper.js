(function () {
    var _ = require('underscore');

    function sweeper(width, height, numMines) {
        var me = this;

        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        me.width = width;
        me.height = height;
        me.numMines = numMines;
        me.grid = [];

        me.init = function () {
            for (var i = 0; i < me.height; i++) {
                var row = [];
                for (var j = 0; j < me.width; j++) {
                    row.push('-');
                }
                me.grid.push(row);
            }
        };

        me.plantMine = function () {
            var minedCells = {};
            while (_.keys(minedCells).length < me.numMines) {
                var randomCell = getRandomNumber(0, me.width * me.height);
                if (!minedCells[randomCell]) {
                    minedCells[randomCell] = true;
                }
            }

            _.each(_.keys(minedCells), function (index) {
                var row = Math.floor(index / me.width);
                var col = index % me.width;

                me.grid[row][col] = '*';
            });
        };

        me.findMines = function () {
            function findAdjacent(row, col) {
                var cells = [];
                var hasLeft = col > 0;
                var hasRight = col < (me.width - 1);
                var hasTop = row > 0;
                var hasBottom = row < (me.height - 1);

                for (var r = -1; r < 2; r++) {
                    if ((r !== -1 || hasTop) && (r !== 1 || hasBottom)) {
                        for (var c = -1; c < 2; c++) {
                            if ((c !== -1 || hasLeft) && (c !== 1 || hasRight) && !(r === 0 && c === 0)) {
                                cells.push({
                                    row: row + r,
                                    col: col + c
                                });
                            }
                        }
                    }
                }

                return cells;
            }

            me.grid = _.map(me.grid, function (row, rowNum) {
                return _.map(row, function (cell, colNum) {
                    if (cell === '*') {
                        return cell;
                    }

                    var adjacentCells = findAdjacent(rowNum, colNum);
                    var mineCount = _.filter(adjacentCells, function (coord) {
                        return me.grid[coord.row][coord.col] === '*';
                    }).length;

                    return mineCount;
                });
            });
        };

        me.print = function () {
            _.each(me.grid, function (row, rowNum) {
                console.log(rowNum + ': ' + row.join(','));
            });
        };

        me.init();
        me.plantMine();
        me.findMines();

        return me;
    }

    module.exports = sweeper;
})();