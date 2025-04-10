let board;
let context;
let boardWidth;
let boardHeight;

const aspectRatio = 360 / 576;

let doodlerWidth = 46;
let doodlerHeight = 46;
let doodler;
let doodlerRightImg = new Image();
let doodlerLeftImg = new Image();

let vX = 0;
let vY = 0;
let uY = -10;
let g = 0.5;
let sY;

let platformArr = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg = new Image();

let score = 0;
let gameOver = false;

window.onload = () => {
    board = document.getElementById("board");
    context = board.getContext("2d");

    doodlerRightImg.src = "./doodler-right.png";
    doodlerLeftImg.src = "./doodler-left.png";
    platformImg.src = "./platform.png";

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    doodler = {
        img: doodlerRightImg,
        x: boardWidth / 2 - doodlerWidth / 2,
        y: boardHeight * 7 / 8 - doodlerHeight,
        width: doodlerWidth,
        height: doodlerHeight
    };

    vY = uY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
    document.addEventListener("keyup", () => vX = 0);
    setupTouchControls();
};

function resizeCanvas() {
    const container = document.querySelector(".game-container") || document.body;

    boardWidth = container.clientWidth;
    boardHeight = container.clientWidth / aspectRatio;
    board.width = boardWidth;
    board.height = boardHeight;

    if (doodler) {
        doodler.x = boardWidth / 2 - doodlerWidth / 2;
        doodler.y = boardHeight * 7 / 8 - doodlerHeight;
    }
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        const currentHigh = parseInt(localStorage.getItem("highscore")) || 0;
        if (score > currentHigh) {
            localStorage.setItem("highscore", score);
        }
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    doodler.x += vX;
    if (doodler.x > boardWidth) doodler.x = 0;
    else if (doodler.x + doodler.width < 0) doodler.x = boardWidth;

    vY += g;
    doodler.y += vY;
    if (doodler.y > boardHeight) gameOver = true;

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    for (let i = 0; i < platformArr.length; i++) {
        let platform = platformArr[i];

        if (vY < 0 && doodler.y < boardHeight * 3 / 4) platform.y -= uY;
        if (detectCollision(doodler, platform) && vY >= 0) vY = uY;
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    while (platformArr.length > 0 && platformArr[0].y >= boardHeight) {
        platformArr.shift();
        newPlatform();
    }

    updateScore();

    context.fillStyle = "#333";
    context.font = `${Math.floor(boardWidth / 25)}px sans-serif`;
    context.fillText(`Score: ${score}`, 10, 30);

    const highscore = parseInt(localStorage.getItem("highscore")) || 0;
    context.fillText(`High: ${highscore}`, 10, 60);

    if (gameOver) context.fillText("Game Over! Tap or press SPACE", boardWidth / 6, boardHeight * 7 / 8);
}

function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        vX = 4;
        doodler.img = doodlerRightImg;
    } 
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        vX = -4;
        doodler.img = doodlerLeftImg;
    } 
    else if (e.code == "Space" && gameOver) {
        restartGame();
    }
}

function setupTouchControls() {
    document.addEventListener("touchstart", (e) => {
        const x = e.touches[0].clientX;
        if (x < window.innerWidth / 2) {
            vX = -4;
            doodler.img = doodlerLeftImg;
        } 
        else {
            vX = 4;
            doodler.img = doodlerRightImg;
        }

        if (gameOver) {
            restartGame();
        }
    });
}

function restartGame() {
    doodler = {
        img: doodlerRightImg,
        x: boardWidth / 2 - doodlerWidth / 2,
        y: boardHeight * 7 / 8 - doodlerHeight,
        width: doodlerWidth,
        height: doodlerHeight
    };

    vX = 0;
    vY = uY;
    score = 0;
    gameOver = false;
    sY = doodler.y;

    placePlatforms();
}

function placePlatforms() {
    platformArr = [];

    platformArr.push({
        img: platformImg,
        x: boardWidth / 2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight
    });

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth * 3 / 4);
        platformArr.push({
            img: platformImg,
            x: randomX,
            y: boardHeight - 75 * i - 150,
            width: platformWidth,
            height: platformHeight
        });
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth * 3 / 4);
    platformArr.push({
        img: platformImg,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight
    });
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function updateScore() {
    if (doodler.y < sY) {
        score += Math.floor(sY - doodler.y);
        sY = doodler.y;
    }
}
