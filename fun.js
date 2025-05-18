// Quiz logic
function scoreQuiz() {
  const answers = {
    q1: "cafe",
    q2: "night",
    q3: "goa"
  };
  let score = 0;
  for (const q in answers) {
    const checked = document.querySelector(`input[name="${q}"]:checked`);
    if (checked && checked.value === answers[q]) score++;
  }
  let result = `Your score: ${score} / 3`;
  if (score === 3) result += " 💖 Perfect!";
  else if (score === 2) result += " 😊 Great job!";
  else result += " 😘 Let's make more memories!";
  document.getElementById('quiz-result').innerText = result;
}

// Puzzle logic (simple 3x3 sliding puzzle using img1.jpg)
const PUZZLE_SIZE = 3;
let puzzle = [];
let canvas, ctx, tileSize, emptyPos = {x: 2, y: 2};
let img = new Image();
img.src = 'img1.jpg';

img.onload = function() {
  setupPuzzle();
  drawPuzzle();
};

function setupPuzzle() {
  canvas = document.getElementById('puzzle-canvas');
  ctx = canvas.getContext('2d');
  tileSize = canvas.width / PUZZLE_SIZE;
  puzzle = [];
  let n = 0;
  for (let y = 0; y < PUZZLE_SIZE; y++) {
    for (let x = 0; x < PUZZLE_SIZE; x++) {
      puzzle.push({x, y, n: n++});
    }
  }
  emptyPos = {x: 2, y: 2};
  puzzle[puzzle.length-1].n = -1; // empty
  canvas.addEventListener('click', clickPuzzle);
}

function drawPuzzle() {
  for (let i = 0; i < puzzle.length; i++) {
    let px = puzzle[i].x, py = puzzle[i].y, n = puzzle[i].n;
    if (n === -1) {
      ctx.clearRect(px*tileSize, py*tileSize, tileSize, tileSize);
      continue;
    }
    let sx = (n % PUZZLE_SIZE) * tileSize;
    let sy = Math.floor(n / PUZZLE_SIZE) * tileSize;
    ctx.drawImage(img, sx, sy, tileSize, tileSize, px*tileSize, py*tileSize, tileSize, tileSize);
    ctx.strokeRect(px*tileSize, py*tileSize, tileSize, tileSize);
  }
}

function clickPuzzle(e) {
  const rect = canvas.getBoundingClientRect();
  const mx = Math.floor((e.clientX - rect.left) / tileSize);
  const my = Math.floor((e.clientY - rect.top) / tileSize);
  const dx = Math.abs(mx - emptyPos.x);
  const dy = Math.abs(my - emptyPos.y);
  if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
    // swap
    let emptyIdx = puzzle.findIndex(p => p.x === emptyPos.x && p.y === emptyPos.y);
    let clickedIdx = puzzle.findIndex(p => p.x === mx && p.y === my);
    [puzzle[emptyIdx].n, puzzle[clickedIdx].n] = [puzzle[clickedIdx].n, puzzle[emptyIdx].n];
    emptyPos = {x: mx, y: my};
    drawPuzzle();
  }
}

function shufflePuzzle() {
  for (let i = 0; i < 100; i++) {
    let moves = [];
    let {x, y} = emptyPos;
    if (x > 0) moves.push({x: x-1, y});
    if (x < PUZZLE_SIZE-1) moves.push({x: x+1, y});
    if (y > 0) moves.push({x, y: y-1});
    if (y < PUZZLE_SIZE-1) moves.push({x, y: y+1});
    let move = moves[Math.floor(Math.random() * moves.length)];
    let emptyIdx = puzzle.findIndex(p => p.x === emptyPos.x && p.y === emptyPos.y);
    let moveIdx = puzzle.findIndex(p => p.x === move.x && p.y === move.y);
    [puzzle[emptyIdx].n, puzzle[moveIdx].n] = [puzzle[moveIdx].n, puzzle[emptyIdx].n];
    emptyPos = {x: move.x, y: move.y};
  }
  drawPuzzle();
}

// Confetti effect and message
function showConfetti() {
  let msg = document.getElementById('love-message');
  msg.classList.remove('hidden');
  // Simple confetti
  for (let i = 0; i < 70; i++) {
    let conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.left = Math.random()*100 + '%';
    conf.style.background = `hsl(${Math.random()*360},70%,80%)`;
    conf.style.animationDuration = (2+Math.random()*2) + 's';
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 3500);
  }
}