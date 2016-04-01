'use strict';

window.onload = function(){
    var buttonStart = document.getElementById('start');
    buttonStart.onclick = function(){
        var game = minesweeper();
        var content = document.getElementById("content");
        game.init(content);
    };
};