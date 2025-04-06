let puzzle = [];
    let original = [];
    let board = document.getElementById('board');
    let message = document.getElementById('message');
    let timerElem = document.getElementById('timer');
    let moves = [];
    let startTime, timerInterval;
    let fastestTime = localStorage.getItem('fastestTime') || null;

    function formatTime(ms) {
      const totalSec = Math.floor(ms / 1000);
      const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
      const sec = String(totalSec % 60).padStart(2, '0');
      return `${min}:${sec}`;
    }

    function startTimer() {
      startTime = Date.now();
      timerInterval = setInterval(() => {
        timerElem.textContent = 'Time: ' + formatTime(Date.now() - startTime);
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timerInterval);
    }

    function generateBoard(puz) {
      board.innerHTML = '';
      message.textContent = '';
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          if (original[r][c] !== 0) {
            cell.textContent = original[r][c];
            cell.classList.add('prefilled');
          } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.value = puz[r][c] !== 0 ? puz[r][c] : '';
            input.addEventListener('input', (e) => {
              const val = e.target.value;
              if (/^[1-9]$/.test(val)) {
                puzzle[r][c] = parseInt(val);
                moves.push([r, c]);
                checkComplete();
              } else {
                e.target.value = '';
              }
            });
            cell.appendChild(input);
          }
          board.appendChild(cell);
        }
      }
    }

    function checkComplete() {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (puzzle[r][c] === 0) return;
        }
      }
      stopTimer();
      const timeTaken = Date.now() - startTime;
      let msg = `🎉 Sudoku Completed in ${formatTime(timeTaken)}`;
      if (!fastestTime || timeTaken < fastestTime) {
        localStorage.setItem('fastestTime', timeTaken);
        msg += ' 🏆 New Best Time!';
        fastestTime = timeTaken;
      } else {
        msg += ` | Best: ${formatTime(fastestTime)}`;
      }
      message.textContent = msg;
    }

    function newGame() {
      fetch('https://sudoku-api.vercel.app/api/dosuku')
        .then(res => res.json())
        .then(data => {
          if (!data.newboard || !data.newboard.grids || !data.newboard.grids[0]?.value) {
            message.textContent = "❌ Failed to load puzzle. Try again.";
            return;
          }
          const grid = data.newboard.grids[0].value;
          puzzle = grid.map(row => row.slice());
          original = grid.map(row => row.slice());
          moves = [];
          generateBoard(puzzle);
          stopTimer();
          startTimer();
        })
        .catch(err => {
          console.error(err);
          message.textContent = "❌ Error fetching puzzle. Please check your connection.";
        });
    }

    function resetGame() {
      puzzle = original.map(row => row.slice());
      moves = [];
      generateBoard(puzzle);
      stopTimer();
      startTimer();
    }

    function undoMove() {
      if (moves.length === 0) return;
      const [r, c] = moves.pop();
      puzzle[r][c] = 0;
      generateBoard(puzzle);
    }

    document.getElementById('newGame').addEventListener('click', newGame);
    document.getElementById('resetGame').addEventListener('click', resetGame);
    document.getElementById('undoMove').addEventListener('click', undoMove);