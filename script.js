document.addEventListener("DOMContentLoaded", function () {
  const gridContainer = document.getElementById("grid-container");
  const restartButton = document.getElementById("RestartButton");
  const newGameButton = document.getElementById("NewGameButton");
  const movesDisplay = document.getElementById("moves");
  const timerDisplay = document.getElementById("timer");
  const targetMovesDisplay = document.getElementById("targetMoves");

  let grid = [];
  let dataJSON;
  let timer = 0;
  let intervalId;
  let movesCount = 0;
  let targetMoves = 0;
  let currentLayout = null;

  let allLayouts = ["data/data.json", "data/data1.json", "data/data2.json"];

function parseJSON(isNewGame = true) {
  if (isNewGame) {
    let possibleLayouts = allLayouts.filter(layout => layout !== currentLayout);

    const index = Math.floor(Math.random() * possibleLayouts.length);
    dataJSON = possibleLayouts[index];
  } else {
    dataJSON = currentLayout;
  }

  $ajaxUtils.sendGetRequest(dataJSON, function(res){
    grid = res.grid;
    targetMoves = res.targetMoves;
    currentLayout = dataJSON;
    initializeGrid();
    updateDisplay();
  }, true);
}

  function initializeGrid() {
    gridContainer.innerHTML = "";
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        if (cell === 1) {
          cellDiv.classList.add("on");
        }
        cellDiv.dataset.row = i;
        cellDiv.dataset.col = j;
        gridContainer.appendChild(cellDiv);
      });
    });
  }

  function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    toggleCell(row, col);
    initializeGrid();
    movesCount++;
    updateDisplay();
    checkWin();
  }

  function startTimer() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      timer++;
      timerDisplay.innerText = `Timer: ${timer}s`;
    }, 1000);
  }

  function updateDisplay() {
    timerDisplay.innerText = `Timer: ${timer}s`;
    movesDisplay.innerText = `Moves: ${movesCount}`;
    targetMovesDisplay.innerText = `Target Moves: ${targetMoves}`;
  }

  function resetGame() {
    clearInterval(intervalId);
    timer = 0;
    movesCount = 0;
    parseJSON(false);
    startTimer();  
  }

  function newGame() {
    clearInterval(intervalId);
    timer = 0;
    movesCount = 0;
    parseJSON(true);
    startTimer();
  }

  function toggleCell(row, col) {
    if (grid && grid[row] && grid[row][col] !== undefined) {
      grid[row][col] = 1 - grid[row][col];
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      directions.forEach((dir) => {
        const newRow = row + dir[0];
        const newCol = col + dir[1];
        if (
          newRow >= 0 &&
          newRow < grid.length &&
          newCol >= 0 &&
          newCol < grid[0].length
        ) {
          grid[newRow][newCol] = 1 - grid[newRow][newCol];
        }
      });
    }
  }

  function checkWin() {
    const allCellsOff = grid.every(row => row.every(cell => cell === 0));
    if (allCellsOff) {
      clearInterval(intervalId);
      alert("Congratulations! You won!");
      newGame();
    }
  }

  gridContainer.addEventListener("click", handleCellClick);
restartButton.addEventListener("click",function (event) {
  resetGame();
  startTimer();
});
newGameButton.addEventListener("click", function (event) {
  newGame();
  startTimer();
});
});
newGame();
});