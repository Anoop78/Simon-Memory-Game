/* simon.js - cleaned, no duplicates, restart/quit working */

// state
let gameSeq = [];
let userSeq = [];
const btns = ["red", "green", "yellow", "purple"];

let started = false;
let level = 0;
let bestScore = Number(localStorage.getItem("simonBest")) || 0;

// DOM refs
const statusText = document.getElementById("status-text");
const levelSpan = document.getElementById("level");
const bestSpan = document.getElementById("best-score");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const quitBtn = document.getElementById("quit-btn");
const allBtns = Array.from(document.querySelectorAll(".btn"));

bestSpan.innerText = bestScore;

// audio helper (optional)
function playSound(color) {
  try {
    const audio = new Audio(`sounds/${color}.mp3`);
    audio.play().catch(() => {});
  } catch (e) {}
}

// visual flash
function btnFlash(btn, color) {
  btn.classList.add("flash");
  playSound(color);
  setTimeout(() => btn.classList.remove("flash"), 300);
}
function userFlash(btn, color) {
  btn.classList.add("userflash");
  playSound(color);
  setTimeout(() => btn.classList.remove("userflash"), 200);
}

// enable/disable
function enableColorButtons() {
  allBtns.forEach(b => { b.style.pointerEvents = "auto"; b.classList.remove("disabled"); });
}
function disableColorButtons() {
  allBtns.forEach(b => { b.style.pointerEvents = "none"; b.classList.add("disabled"); });
}

// core game
function levelUp() {
  userSeq = [];
  level++;
  levelSpan.innerText = level;
  statusText.innerText = "Watch the pattern…";

  const randIdx = Math.floor(Math.random() * 4);
  const randColor = btns[randIdx];
  const randBtn = document.getElementById(randColor);
  gameSeq.push(randColor);

  setTimeout(() => btnFlash(randBtn, randColor), 500);
}

function checkAns() {
  const idx = userSeq.length - 1;
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      statusText.innerText = "Nice! Get ready for the next level…";
      setTimeout(levelUp, 900);
    }
  } else {
    gameOver();
  }
}

function gameOver() {
  playSound("wrong");
  document.body.classList.add("game-over-bg");

  statusText.innerHTML = `Game Over! Your score was <b>${level}</b>`;

  if (level > bestScore) {
    bestScore = level;
    localStorage.setItem("simonBest", bestScore);
    bestSpan.innerText = bestScore;
    statusText.innerHTML += `<br>🎉 New High Score!`;
  } else {
    statusText.innerHTML += `<br>Try again to beat your best!`;
  }

  startBtn.innerText = "Play Again";
  started = false;
  disableColorButtons();

  setTimeout(() => document.body.classList.remove("game-over-bg"), 250);
}

// input handlers
function btnPress() {
  if (!started) return;
  const btn = this;
  const userColor = btn.id;
  userFlash(btn, userColor);
  userSeq.push(userColor);
  statusText.innerText = "Your turn…";
  checkAns();
}

function startGame() {
  if (started) return;
  started = true;
  level = 0;
  gameSeq = [];
  userSeq = [];
  levelSpan.innerText = level;
  statusText.innerText = "Game starting…";
  startBtn.innerText = "Playing…";
  enableColorButtons();
  setTimeout(levelUp, 600);
}

function reset() {
  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
  levelSpan.innerText = level;
  // do not change bestScore here
}

function restartGame() {
  reset();
  enableColorButtons();
  startGame();
}

function quitGame() {
  reset();
  disableColorButtons();
  statusText.innerText = "You quit the game.";
  startBtn.innerText = "Start Game";
}

// attach listeners
startBtn.addEventListener("click", () => {
  if (!started) {
    enableColorButtons();
    startGame();
  }
});
restartBtn.addEventListener("click", restartGame);
quitBtn.addEventListener("click", quitGame);

// color buttons: disabled until start
allBtns.forEach(btn => {
  btn.style.pointerEvents = "none";
  btn.addEventListener("click", btnPress);
});

// optional: Enter key to start
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") startGame();
});
// Feedback submission
document.getElementById("fb-submit").addEventListener("click", () => {
  const name = document.getElementById("fb-name").value.trim();
  const msg = document.getElementById("fb-message").value.trim();
  const status = document.getElementById("fb-status");

  if (name === "" || msg === "") {
    status.style.color = "#f87171"; // red
    status.innerText = "Please fill out both fields.";
    return;
  }

  // SUCCESS MESSAGE
  status.style.color = "#34d399"; // green
  status.innerText = "Your message has been delivered to Anoop Team 😊";

  // Clear inputs
  document.getElementById("fb-name").value = "";
  document.getElementById("fb-message").value = "";
   setTimeout(() => {
    status.innerText = "";
  }, 2000);
});
