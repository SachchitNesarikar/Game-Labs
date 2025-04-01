const numbers = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
        numbers.sort(() => Math.random() - 0.5);
        
        const gameBoard = document.getElementById("gameBoard");
        let firstCard = null;
        let secondCard = null;
        
        numbers.forEach((num, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.value = num;
            card.addEventListener("click", () => flipCard(card));
            gameBoard.appendChild(card);
        });
        
        function flipCard(card) {
            if (card.classList.contains("flipped") || secondCard) return;
            
            card.classList.add("flipped");
            card.innerText = card.dataset.value;
            
            if (!firstCard) {
                firstCard = card;
            } else {
                secondCard = card;
                setTimeout(checkMatch, 500);
            }
        }
        
        function checkMatch() {
            if (firstCard.dataset.value === secondCard.dataset.value) {
                firstCard.classList.add("hidden");
                secondCard.classList.add("hidden");
            } else {
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                firstCard.innerText = "";
                secondCard.innerText = "";
            }
            firstCard = null;
            secondCard = null;
        }