const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const laneCount = 3;
const laneWidth = canvas.width / laneCount;
const playerWidth = 40;
const playerHeight = 60;
const obstacleWidth = 40;
const obstacleHeight = 40;
const bonusSize = 20;

let gameSpeed = 4;
let frame = 0;
let score = 0;

let currentLane = 1;
const player = {
  x: laneWidth * currentLane + laneWidth / 2 - playerWidth / 2,
  y: canvas.height - playerHeight - 20,
  width: playerWidth,
  height: playerHeight,
  image: new Image()
};
player.image.src = 'running_character.png';

const obstacles = [];
const bonuses = [];
const obstacleImage = new Image();
obstacleImage.src = 'rock_obstacle.png';
const bonusImage = new Image();
bonusImage.src = 'bonus_coin.png';

function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawObstacle(o) {
  ctx.drawImage(obstacleImage, o.x, o.y, o.width, o.height);
}

function drawBonus(b) {
  ctx.drawImage(bonusImage, b.x, b.y, b.size, b.size);
}

function generateObstacle() {
  const lane = Math.floor(Math.random() * laneCount);
  obstacles.push({
    x: lane * laneWidth + laneWidth / 2 - obstacleWidth / 2,
    y: -obstacleHeight,
    width: obstacleWidth,
    height: obstacleHeight
  });
}

function generateBonus() {
  const lane = Math.floor(Math.random() * laneCount);
  bonuses.push({
    x: lane * laneWidth + laneWidth / 2 - bonusSize / 2,
    y: -bonusSize,
    size: bonusSize
  });
}

function updateObjects() {
  for (let o of obstacles) o.y += gameSpeed;
  for (let b of bonuses) b.y += gameSpeed;

  while (obstacles.length > 0 && obstacles[0].y > canvas.height) obstacles.shift();
  while (bonuses.length > 0 && bonuses[0].y > canvas.height) bonuses.shift();
}

function checkCollisions() {
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      alert("A dínó utolért! 🦖");
      document.location.reload();
    }
  }

  for (let i = 0; i < bonuses.length; i++) {
    const b = bonuses[i];
    if (
      player.x < b.x + b.size &&
      player.x + player.width > b.x &&
      player.y < b.y + b.size &&
      player.y + player.height > b.y
    ) {
      bonuses.splice(i, 1);
      score += 10;
    }
  }
}

function drawLanes() {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  for (let i = 1; i < laneCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * laneWidth, 0);
    ctx.lineTo(i * laneWidth, canvas.height);
    ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLanes();
  drawPlayer();
  for (let o of obstacles) drawObstacle(o);
  for (let b of bonuses) drawBonus(b);
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Pont: ${score}`, 10, 30);
}

function gameLoop() {
  frame++;
  if (frame % 60 === 0) generateObstacle();
  if (frame % 150 === 0) generateBonus();

  updateObjects();
  checkCollisions();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && currentLane > 0) {
    currentLane--;
  } else if (e.key === "ArrowRight" && currentLane < laneCount - 1) {
    currentLane++;
  }
  player.x = laneWidth * currentLane + laneWidth / 2 - playerWidth / 2;
});

gameLoop();

