let currentPokemon = null;
let pokemonData = null;
let wrongAttempts = 0;
const maxAttempts = 5; // Define maximum allowed attempts

function loadPokemon() {
  const id = Math.floor(Math.random() * 151) + 1;
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {
      currentPokemon = data.name;
      pokemonData = data;
      wrongAttempts = 0;
      const img = document.getElementById("pokemonImage");
      img.src = data.sprites.front_default;
      img.style.filter = "brightness(0)";
      img.classList.remove("revealed");
      document.getElementById("guessInput").value = "";
      document.getElementById("result").textContent = "";
      document.getElementById("hint").textContent = "";
      document.getElementById("hint").classList.remove("active");
      loader.style.display = "none";
    });
}

function checkGuess() {
  const guess = document.getElementById("guessInput").value.toLowerCase().trim();
  const img = document.getElementById("pokemonImage");
  const result = document.getElementById("result");
  const hintBox = document.getElementById("hint");

  if (guess === currentPokemon) {
    result.textContent = `✅ Correct! It's ${currentPokemon.toUpperCase()}!`;
    img.style.filter = "brightness(1)";
    img.classList.add("revealed");
    hintBox.textContent = "";
    hintBox.classList.remove("active");
  } else {
    wrongAttempts++;
    const remainingMoves = maxAttempts - wrongAttempts; // Calculate remaining moves
    result.textContent = `❌ Nope! Try again. ${remainingMoves} move(s) left!`;
    giveHint();

    if (wrongAttempts >= maxAttempts) {
      result.textContent = `❗ Revealed! It's ${currentPokemon.toUpperCase()}!`;
      revealPokemonWithAnimation();
    }
  }
}

function giveHint() {
  let hint = "";
  const types = pokemonData.types.map(t => t.type.name).join(" / ");
  const firstLetter = currentPokemon.charAt(0).toUpperCase();

  if (wrongAttempts === 1) {
    hint = `Hint: It's a ${types}-type Pokémon.`;
  } else if (wrongAttempts === 2) {
    hint = `Hint: The name starts with "${firstLetter}".`;
  } else if (wrongAttempts === 3) {
    hint = `Hint: It has ${currentPokemon.length} letters.`;
  } else {
    hint = `Hint: You got this! Just type carefully.`;
  }

  const hintBox = document.getElementById("hint");
  hintBox.textContent = hint;
  hintBox.classList.add("active");
}

function revealPokemonWithAnimation() {
  const img = document.getElementById("pokemonImage");
  img.classList.add("reveal-animation");
  img.style.filter = "brightness(1)";
  img.classList.add("revealed");
  const hintBox = document.getElementById("hint");
  hintBox.textContent = "";
  hintBox.classList.remove("active");
}

loadPokemon();
