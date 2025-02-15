let boxes = document.querySelectorAll(".box");
let reset = document.querySelector("#reset");
let newGame = document.querySelector("#new");
let gg = document.querySelector(".gg");
let msg = document.querySelector("#msg");

let O = true;
let cnt = 0;

const win = [[0, 1, 2], [0, 3, 6],[0, 4, 8], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];

const resetGame = () => {
  O = true;
  cnt = 0;
  enableBoxes();
  gg.classList.add("hide");
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (O) {
      box.innerText = "O";
      O = false;
    } else {
      box.innerText = "X";
      O = true;
    }
    box.disabled = true;
    cnt++;

    let isWinner = check();

    if (cnt === 9 && !isWinner) {
      gameDraw();
    }
  });
});

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  gg.classList.remove("hide");
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const show = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  gg.classList.remove("hide");
  disableBoxes();
};

const check = () => {
  for (let pattern of win) {
    let p1 = boxes[pattern[0]].innerText;
    let p2 = boxes[pattern[1]].innerText;
    let p3 = boxes[pattern[2]].innerText;

    if (p1 != "" && p2 != "" && p3 != "") {
      if (p1 === p2 && p2 === p3) {
        show(p1);
        return true;
      }
    }
  }
};

newGame.addEventListener("click", resetGame);
reset.addEventListener("click", resetGame);