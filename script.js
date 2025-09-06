const puzzle = document.getElementById("puzzle");
let tiles = [];
let emptyPos = { row: 2, col: 2 };

function initPuzzle() {
  puzzle.innerHTML = "";
  tiles = [];
  document.getElementById("message").textContent = "";

  let id = 1;
  for (let row = 0; row < 3; row++) {
    tiles[row] = [];
    for (let col = 0; col < 3; col++) {
      const tile = document.createElement("div");

      if (row === 2 && col === 2) {
        tile.className = "w-[100px] h-[100px] rounded-md border border-dashed border-gray-300 dark:border-gray-600 bg-transparent flex items-center justify-center";
        tile.classList.add("empty");
        emptyPos = { row, col };
      } else {
        tile.className = "w-[100px] h-[100px] rounded-md bg-cover cursor-pointer";
        tile.dataset.id = id;        let pos = `-${col * 100}px -${row * 100}px`;
        tile.style.backgroundImage = 'url("puzzle.jpg")';
        tile.style.backgroundPosition = pos;
        tile.style.backgroundSize = "300px 300px";
        id++;
      }

      tile.addEventListener("click", () => moveTile(row, col));

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
    emptyTile.classList.remove("empty");
    emptyTile.classList.add("w-[100px]", "h-[100px]", "rounded-md", "bg-cover", "cursor-pointer");

    clickedTile.style.backgroundImage = "";
    delete clickedTile.dataset.id;
    clickedTile.className = "w-[100px] h-[100px] rounded-md border border-gray-300 dark:border-gray-600 bg-transparent flex items-center justify-center empty";

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

document.getElementById("shuffleBtn").addEventListener("click", shuffle);
document.getElementById("restartBtn").addEventListener("click", initPuzzle);

initPuzzle();
