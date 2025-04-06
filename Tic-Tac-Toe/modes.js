document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll(".box");
    const resetButton = document.querySelector("#reset");
    const easyBtn = document.querySelector("#easy");
    const medBtn = document.querySelector("#med");
    const impBtn = document.querySelector("#imp");

    let playerTurn = true;
    let gameMode = "easy";
    let gg = document.querySelector(".gg");

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]            
    ];

    function resetGame() {
        for (let box of boxes) {
            box.disabled = false;
            box.innerText = "";
        }
        gg.classList.add("hide");
        playerTurn = true;
        console.log(`Game reset. Current mode: ${gameMode.toUpperCase()}`);
    }

    function check() {
        for (let pattern of winPatterns) {
            let [a, b, c] = pattern;
            if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[b].innerText === boxes[c].innerText) {
                setTimeout(() => alert(`Winner is ${boxes[a].innerText}!`), 100);
                boxes.forEach(box => box.disabled = true);
                return true;
            }
        }

        if ([...boxes].every(box => box.innerText !== "")) {
            setTimeout(() => alert("It's a Draw!"), 100);
            return true;
        }
        return false;
    }

    function aiMove() {
        let emptyBoxes = [...boxes].filter(box => box.innerText === "");
        if (emptyBoxes.length === 0) return;

        let aiChoice;

        if (gameMode === "easy") {
            console.log("AI Move (Easy Mode): Playing Randomly");
            aiChoice = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        } else if (gameMode === "medium") {
            console.log("AI Move (Medium Mode): Trying to Win or Block");
            aiChoice = getBestMove("X") || getBestMove("O") || emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        } else if (gameMode === "impossible") {
            console.log("AI Move (Impossible Mode): Using Minimax Algorithm");
            let bestMove = minimax([...boxes].map(box => box.innerText), "X");
            aiChoice = boxes[bestMove.index];
        }

        aiChoice.innerText = "X";
        aiChoice.disabled = true;
        check();
        playerTurn = true;
    }

    function getBestMove(symbol) {
        for (let pattern of winPatterns) {
            let [a, b, c] = pattern;
            let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];

            if (values.filter(v => v === symbol).length === 2 && values.includes("")) {
                return boxes[[a, b, c][values.indexOf("")]];
            }
        }
        return null;
    }

    function minimax(board, player) {
        let emptySpots = board.map((val, index) => val === "" ? index : null).filter(val => val !== null);

        if (checkWin(board, "X")) return { score: 1 };
        if (checkWin(board, "O")) return { score: -1 };
        if (emptySpots.length === 0) return { score: 0 };

        let moves = [];

        for (let i of emptySpots) {
            let move = { index: i };
            board[i] = player;

            if (player === "X") {
                move.score = minimax(board, "O").score;
            } else {
                move.score = minimax(board, "X").score;
            }

            board[i] = "";
            moves.push(move);
        }

        let bestMove = moves.reduce((best, move) => 
            (player === "X" ? move.score > best.score : move.score < best.score) ? move : best
        );

        return bestMove;
    }

    function checkWin(board, symbol) {
        return winPatterns.some(pattern => pattern.every(index => board[index] === symbol));
    }

    boxes.forEach(box => {
        box.addEventListener("click", () => {
            if (!playerTurn || box.innerText !== "") return;

            box.innerText = "O";
            box.disabled = true;
            playerTurn = false;

            if (!check()) {
                setTimeout(aiMove, 500);
            }
        });
    });

    resetButton.addEventListener("click", resetGame);

    easyBtn.addEventListener("click", () => { 
        resetGame(); 
        gameMode = "easy"; 
        console.log("Switched to EASY mode."); 
    });

    medBtn.addEventListener("click", () => { 
        resetGame(); 
        gameMode = "medium"; 
        console.log("Switched to MEDIUM mode."); 
    });

    impBtn.addEventListener("click", () => { 
        resetGame(); 
        gameMode = "impossible"; 
        console.log("Switched to IMPOSSIBLE mode."); 
    });
});
