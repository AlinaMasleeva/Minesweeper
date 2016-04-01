'use strict';

var minesweeper = function () {
    var module = {
        init: function (parent) {
            var table = createTable();
            parent.innerHTML = "";
            parent.appendChild(table);
            var mines = createMines();
            addMinesToTable(table, mines);
            addNumbersToTable(table);
        },
        gameStarted: false,
        gameFinished: false,
        seconds: 0
    };

    //utilities
    function createTable() {
        var table = document.createElement('table');
        table.setAttribute('width', '400');
        table.setAttribute('height', '400');
        table.setAttribute('border', '1');
        for (var i = 0; i < 10; i++) {
            var tr = document.createElement('tr');
            tr.id = 'tr' + i;
            table.appendChild(tr);

            for (var j = 0; j < 10; j++) {
                var td = document.createElement('td');
                td.setAttribute("data-x", j);
                td.setAttribute("data-y", i);
                tr.appendChild(td);

                td.onclick = function(e) {
                    openCell(this, table);
                };

                td.oncontextmenu = function(e) {
                    markBomb(this);
                    return false;
                }
            }
        }
        return table;
    }

    function openCell(td, table) {
        if (module.gameFinished) {
            return;
        }
        if (td.getAttribute("data-opened") == "true") {
            return;
        }

        if (!module.gameStarted) {
            module.gameStarted = true;
            clock();
        }

        var n = getCoordinates(td);
        var secret = td.getAttribute("secret");
        td.innerText = secret;
        td.setAttribute("data-opened", "true");

        td.className += "open-cell";
        if (secret == "0") {
            td.innerText = "";
            var roundCells = getCellsRoundCoords(table, n.x, n.y);

            for(var i=0;i<roundCells.length; i++) {
                var tdRound = roundCells[i];

                if (tdRound.getAttribute("data-opened") !== "true") {
                    openCell(tdRound, table);
                }
            }
        } else if (secret == "-1") {
            td.innerText = "";
            td.innerHTML = '<img src="img/bomb.png" class="bomb"/>';
            //td.className += "mine";
            gameOver();
        } else {
            td.innerText = secret;
        }
    }

    function gameOver() {
        module.gameStarted = false;
        module.gameFinished = true;
        alert("Game Over!");
    }

    function markBomb (td) {
        if (td.getAttribute("data-opened")== "true") {
            return;
        }
        if (td.getAttribute("data-mark")== "true") {
            td.innerHTML = "";
            td.setAttribute("data-mark", "");
        }
        else {
            td.innerHTML = '<img src="img/flag.png" class="flag"/>';
            td.setAttribute("data-mark", "true");
        }
    }

    function createMines() {
        var mines = [];
        var minesCount = 10;
        for (var i = 0; i < minesCount; i++) {
            var m = randomMine();
            while (isMineExist(m, mines)) {
                m = randomMine();
            }
            mines[i] = m;
        }
        return mines;
    }

    function randomMine() {
        return {
            x: Math.floor((Math.random() * 10)),
            y: Math.floor((Math.random() * 10))
        };
    }

    function isMineExist(mine, existingMines) {
        for (var i = 0; i < existingMines.length; i++) {
            if (mine.x == existingMines[i].x && mine.y == existingMines[i].y) {
                return true;
            }
        }
        return false;
    }

    function addMinesToTable (table, mines) {
        var cells = table.getElementsByTagName("td");
        for(var i=0;i<cells.length; i++){
            var td = cells[i];
            var m = getCoordinates (td);
            if(isMineExist(m, mines)){
                td.setAttribute("secret", "-1");
            }
        }
    }

    function addNumbersToTable (table) {
        var cells = table.getElementsByTagName("td");
        for(var i=0;i<cells.length; i++) {
            var td = cells[i];
            if (td.getAttribute("secret") !== "-1") {
                var m = getCoordinates (td);
                var count = getMinesCount(table, m.x, m.y);
                td.setAttribute("secret", count);
            }
        }
    }

    function getMinesCount (table, x, y) {
        var count = 0;
        var cells = getCellsRoundCoords (table, x, y);
        for (var i=0; i<cells.length; i++) {
            var td = cells[i];
            if (td.getAttribute("secret") == "-1"){
                count++;
            }
        }
        return count;
    }

    function getCellsRoundCoords (table, strX, strY) {
        var x = parseInt(strX);
        var y = parseInt(strY);
        var roundCells = [];
        var roundCoords = [{x:x-1, y:y-1},{x:x, y:y-1},{x:x+1, y:y-1},
                            {x:x-1, y:y}, {x:x+1, y:y},
                            {x:x-1, y:y+1}, {x:x, y:y+1}, {x:x+1, y:y+1}];
        for (var i=0; i<roundCoords.length; i++) {
            var elem = roundCoords[i];
            var cell = getCellByCoords(table, elem.x, elem.y);
            if (cell != undefined) {
                roundCells.push(cell);
            }
        }
        return roundCells;
    }

    function getCellByCoords(table, x, y){
        var cells = table.getElementsByTagName("td");
        for(var i=0;i<cells.length; i++) {
            var td = cells[i];
            var c = getCoordinates(td);
            if (c.x == x && c.y == y) {
                return td;
            }
        }
        return undefined;
    }

    function getCoordinates (td) {
        var m = {
            x: td.getAttribute("data-x"),
            y: td.getAttribute("data-y")
        };
        return m;
    }

    function clock (){
        if(module.gameStarted) {
            document.getElementById("timer").innerText = module.seconds;
            module.seconds++;
            setTimeout(clock, 1000);
        }
    }

    return module;
};
