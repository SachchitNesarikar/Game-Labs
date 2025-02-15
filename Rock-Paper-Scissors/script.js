const player = document.querySelectorAll('.choice');
const message = document.getElementById('msg');
const playerScore = document.getElementById('user-score');
const computerScore = document.getElementById('comp-score');

let playerPoints = 0;
let computerPoints = 0;

player.forEach(choice => {
    choice.addEventListener('click', () => {
        const playerSelection = choice.id;
        const computerSelection = getComputerChoice();
        const result = play(playerSelection, computerSelection);
        update(result);
        displayMessage(result, playerSelection, computerSelection);
    });
});

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const random = Math.floor(Math.random() * 3);
    return choices[random];
}

function play(playerSelection, computerSelection) {
    if (playerSelection === computerSelection) {
        return 'tie';
    }
    if ((playerSelection === 'rock' && computerSelection === 'scissors') || (playerSelection === 'paper' && computerSelection === 'rock') || (playerSelection === 'scissors' && computerSelection === 'paper')){
        return 'player';
    }
    return 'computer';
}

function update(winner) {
    if (winner === 'player') {
        playerPoints++;
        playerScore.textContent = playerPoints;
    } else if (winner === 'computer') {
        computerPoints++;
        computerScore.textContent = computerPoints;
    }
}

function displayMessage(winner, playerSelection, computerSelection) {
    if (winner === 'tie') {
        message.textContent = `It's a tie! You both chose ${playerSelection}.`;
    } else if (winner === 'player') {
        message.textContent = `You win! ${capitalize(playerSelection)} beats ${computerSelection}.`;
    } else {
        message.textContent = `You lose! ${capitalize(computerSelection)} beats ${playerSelection}.`;
    }
}

const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
    playerPoints = 0;
    computerPoints = 0;
    playerScore.textContent = playerPoints;
    computerScore.textContent = computerPoints;
    message.textContent = 'Play your move';
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const gameContainer = document.getElementById("game-container");
const choices = ["✊", "🤚", "✌️"];

function generateRandomElements() {
    const numElements = Math.floor(Math.random() * 11) + 5;
  
    for (let i = 0; i < numElements; i++) {
      const element = document.createElement("div");
  
      element.classList.add("moving-element");
      element.textContent = choices[Math.floor(Math.random() * choices.length)];
  
      element.style.top = `${Math.random() * 100}%`;
      element.style.left = `${Math.random() * 100}%`;
  
      gameContainer.appendChild(element);
    };
};
   
  
  