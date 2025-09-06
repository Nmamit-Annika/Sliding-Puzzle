const puzzle = document.getElementById("puzzle");
const shuffleBtn = document.getElementById("shuffleBtn");
const restartBtn = document.getElementById("restartBtn");
const darkToggle = document.getElementById("darkToggle");

let tiles = [];
let emptyPos = { row: 2, col: 2 };

const FILLED_CLASSES = "w-[100px] h-[100px] rounded-md bg-cover cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300";
const EMPTY_CLASSES  = "w-[100px] h-[100px] rounded-md border border-dashed border-gray-300 dark:border-gray-600 bg-transparent flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300";

function initPuzzle() {
  puzzle.innerHTML = "";
  tiles = [];
  document.getElementById("message").textContent = "";

  let id = 1;
  for (let row = 0; row < 3; row++) {
    tiles[row] = [];
    for (let col = 0; col < 3; col++) {
      const tile = document.createElement("div");

      tile.tabIndex = 0;

      if (row === 2 && col === 2) {
        tile.className = EMPTY_CLASSES;
        tile.classList.add("empty");
        emptyPos = { row, col };
      } else {
        tile.className = FILLED_CLASSES;
        tile.dataset.id = id;
        let pos = `-${col * 100}px -${row * 100}px`;
        tile.style.backgroundImage = 'url("puzzle.jpg")';
        tile.style.backgroundPosition = pos;
        tile.style.backgroundSize = "300px 300px";
        id++;
      }

      tile.addEventListener("click", () => moveTile(row, col));
      tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          moveTile(row, col);
        }
      });

      puzzle.appendChild(tile);
      tiles[row][col] = tile;
    }
  }
}

function moveTile(row, col) {
  const rowDiff = Math.abs(row - emptyPos.row);
  const colDiff = Math.abs(col - emptyPos.col);

  if ((rowDiff + colDiff) === 1) {
    const clickedTile = tiles[row][col];
    const emptyTile = tiles[emptyPos.row][emptyPos.col];

    emptyTile.style.backgroundImage = clickedTile.style.backgroundImage || "";
    emptyTile.style.backgroundPosition = clickedTile.style.backgroundPosition || "";
    emptyTile.style.backgroundSize = clickedTile.style.backgroundSize || "";
    emptyTile.dataset.id = clickedTile.dataset.id;

    emptyTile.className = FILLED_CLASSES;
    emptyTile.classList.remove("empty");

    clickedTile.style.backgroundImage = "";
    delete clickedTile.dataset.id;
    clickedTile.className = EMPTY_CLASSES;
    clickedTile.classList.add("empty");

    tiles[emptyPos.row][emptyPos.col] = emptyTile;
    tiles[row][col] = clickedTile;
    emptyPos = { row, col };

    if (isSolved()) {
      document.getElementById("message").textContent = "🎉 You completed the image!";
    }
  }
}

function shuffle() {
  for (let i = 0; i < 100; i++) {
    const moves = [
      { row: emptyPos.row - 1, col: emptyPos.col },
      { row: emptyPos.row + 1, col: emptyPos.col },
      { row: emptyPos.row, col: emptyPos.col - 1 },
      { row: emptyPos.row, col: emptyPos.col + 1 }
    ];
    const validMoves = moves.filter(m => m.row >= 0 && m.row < 3 && m.col >= 0 && m.col < 3);
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    moveTile(randomMove.row, randomMove.col);
  }
  document.getElementById("message").textContent = "";
}

function isSolved() {
  let id = 1;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (row === 2 && col === 2) continue;
      if (tiles[row][col].dataset.id != id) {
        return false;
      }
      id++;
    }
  }
  return true;
}

shuffleBtn.addEventListener("click", shuffle);
restartBtn.addEventListener("click", initPuzzle);

if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    if (document.documentElement.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.removeItem("theme");
    }
  });

  window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  });
}

initPuzzle();
