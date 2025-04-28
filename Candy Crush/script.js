var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple", "Pink", "Brown", "Black"];
var board = [];
var r = 9, c = 9;
var score = 0;
var curr, other;

let lvls = [];
for (let i = 1; i <= 50; i++) {
    lvls.push({
        lvl: i,
        nxtlvl: 100 + i * 20,
        maxmMoves: Math.max(10, 50 - i),
        cType: candies.slice(0, Math.min(candies.length, 4 + Math.floor(i / 10)))
    });
}
let currLvl = 0;
let movesL = lvls[currLvl].maxmMoves;

window.onload = function () {
    let storedLvl = localStorage.getItem("highestLevel");
    currlvl = 1;

    start();
    updateStatus();
    window.setInterval(function () {
        crush();
        slide();
        generate();
    }, 100);
}

function random() {
    let avail = lvls[currLvl].cType;
    return avail[Math.floor(Math.random() * avail.length)];
}

function start() {
    for (let i = 0; i < r; i++) {
        let row = [];
        for (let j = 0; j < c; j++) {
            let tile = document.createElement("img");
            tile.id = i.toString() + "-" + j.toString();
            tile.src = "./images/" + random() + ".png";
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function dragStart() {
    curr = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    other = this;
}

function dragEnd() {
    if (curr.src.includes("blank") || other.src.includes("blank")) return;

    let currPosn = curr.id.split("-");
    let r1 = parseInt(currPosn[0]);
    let c1 = parseInt(currPosn[1]);

    let otherPosn = other.id.split("-");
    let r2 = parseInt(otherPosn[0]);
    let c2 = parseInt(otherPosn[1]);

    let Adj = (r1 == r2 && Math.abs(c1 - c2) == 1) || (c1 == c2 && Math.abs(r1 - r2) == 1);

    if (Adj) {
        let currImg = curr.src;
        let otherImg = other.src;

        curr.src = otherImg;
        other.src = currImg;

        movesL--;
        updateStatus();
        checkLevelStatus();
    }
}

function crush() {
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree() {
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c - 2; j++) {
            let A = board[i][j];
            let B = board[i][j + 1];
            let C = board[i][j + 2];
            if (A.src == B.src && B.src == C.src && !A.src.includes("blank")) {
                A.src = "./images/blank.png";
                B.src = "./images/blank.png";
                C.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    for (let j = 0; j < c; j++) {
        for (let i = 0; i < r - 2; i++) {
            let A = board[i][j];
            let B = board[i + 1][j];
            let C = board[i + 2][j];
            if (A.src == B.src && B.src == C.src && !A.src.includes("blank")) {
                A.src = "./images/blank.png";
                B.src = "./images/blank.png";
                C.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

function slide() {
    for (let j = 0; j < c; j++) {
        let ind = r - 1;
        for (let i = r - 1; i >= 0; i--) {
            if (!board[i][j].src.includes("blank")) {
                board[ind][j].src = board[i][j].src;
                ind--;
            }
        }
        for (let i = ind; i >= 0; i--) {
            board[i][j].src = "./images/blank.png";
        }
    }
}

function generate() {
    for (let j = 0; j < c; j++) {
        if (board[0][j].src.includes("blank")) {
            board[0][j].src = "./images/" + random() + ".png";
        }
    }
}

function updateStatus() {
    const lvlElem = document.getElementById("lvl");
    const scoreElem = document.getElementById("score");
    const movesElem = document.getElementById("moves");
    const highestElem = document.getElementById("highest");

    if (lvlElem) lvlElem.innerText = "Level: " + lvls[currLvl].lvl;
    if (scoreElem) scoreElem.innerText = "Score: " + score + " / " + lvls[currLvl].nxtlvl;
    if (movesElem) movesElem.innerText = "Moves Left: " + movesL;
    if (highestElem) {
        let highest = localStorage.getItem("highestLevel") || 1;
        highestElem.innerText = "Highest Level: " + highest;
    }
}


function nextLevel() {
    if (currLvl < lvls.length - 1) {
        currLvl++;

        let storedLvl = localStorage.getItem("highestLevel") || 1;
        if (currLvl + 1 > parseInt(storedLvl)) {
            localStorage.setItem("highestLevel", currLvl + 1);
        }

        score = 0;
        board = [];
        document.getElementById("board").innerHTML = "";
        start();
        updateStatus();
    } else {
        showMessage("You completed all 50 lvls!");
    }
}

function checkLevelStatus() {
    if (score >= lvls[currLvl].nxtlvl) {
        showMessage("Level " + lvls[currLvl].lvl + " cleared!");
        nextLevel();
    } 
    else if (movesL <= 0) {
        showMessage("Game Over! You failed Level " + lvls[currLvl].lvl);
        let highest = localStorage.getItem("highestLevel") || 1;
    }
}

function showMessage(text, callback) {
    const msg = document.getElementById("message");
    msg.innerText = text;
    msg.style.display = "block";
    setTimeout(() => {
        msg.style.display = "none";
        if (callback) callback();
    }, 2000);
}

document.getElementById("highest").innerText = "Highest Score: " + highestScore;