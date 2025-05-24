let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
const statusDisplay = document.getElementById("status");
const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.dataset.index = index;
    cellElement.textContent = cell;
    cellElement.addEventListener("click", handleClick);
    gameBoard.appendChild(cellElement);
  });
  statusDisplay.textContent = "دور اللاعب X";
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !gameActive || currentPlayer !== "X") return;

  board[index] = "X";
  updateBoard();

  if (checkWinner("X")) {
    statusDisplay.textContent = "اللاعب X فاز!";
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusDisplay.textContent = "تعادل!";
    gameActive = false;
    return;
  }

  currentPlayer = "O";
  statusDisplay.textContent = "دور الكمبيوتر...";
  setTimeout(computerMove, 500);
}

function computerMove() {
  if (!gameActive) return;

  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  board[move] = "O";
  updateBoard();

  if (checkWinner("O")) {
    statusDisplay.textContent = "الكمبيوتر فاز!";
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusDisplay.textContent = "تعادل!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  statusDisplay.textContent = "دور اللاعب X";
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWinner("O", newBoard)) return 10 - depth;
  if (checkWinner("X", newBoard)) return depth - 10;
  if (!newBoard.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(player, state = board) {
  return winConditions.some(comb => 
    comb.every(index => state[index] === player)
  );
}

function isDraw() {
  return !board.includes("");
}

function updateBoard() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = board[i];
  });
}

document.getElementById("restart").addEventListener("click", () => {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  createBoard();
});

createBoard();
