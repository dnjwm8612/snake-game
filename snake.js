const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const grid = 20;
let count = 0;
let snake = [{x: 160, y: 200}];
let dx = grid;
let dy = 0;
let food = randomFood();
let score = 0;

let gameOver = false;
let lastScoreTime = Date.now();
const gameOverDiv = document.getElementById('gameOver');
const finalScoreDiv = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

function randomFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
        y: Math.floor(Math.random() * (canvas.height / grid)) * grid
    };
}

function gameLoop() {
    if (gameOver) return;
    requestAnimationFrame(gameLoop);
    if (++count < 7) return; // 20% 느리게 (6 -> 7)
    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move snake
    let head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = randomFood();
        lastScoreTime = Date.now(); // 점수 획득 시간 갱신
    } else {
        snake.pop();
    }

    // 3초 동안 점수 못 얻으면 게임 종료
    if (Date.now() - lastScoreTime > 3000) {
        endGame();
        return;
    }

    // Wall collision (반대편으로 이동)
    if (head.x < 0) head.x = canvas.width - grid;
    else if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - grid;
    else if (head.y >= canvas.height) head.y = 0;

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
            return;
        }
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, grid-2, grid-2);

    // Draw snake
    ctx.fillStyle = 'lime';
    snake.forEach((segment, i) => {
        ctx.fillRect(segment.x, segment.y, grid-2, grid-2);
    });

    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function endGame() {
    gameOver = true;
    gameOverDiv.style.display = 'flex';
    finalScoreDiv.textContent = `게임 종료! 점수: ${score}`;
}


function resetGame() {
    snake = [{x: 160, y: 200}];
    dx = grid;
    dy = 0;
    score = 0;
    food = randomFood();
    gameOver = false;
    lastScoreTime = Date.now();
    gameOverDiv.style.display = 'none';
    gameLoop();
}

restartBtn.addEventListener('click', resetGame);

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -grid; dy = 0;
    } else if (e.key === 'ArrowUp' && dy === 0) {
        dx = 0; dy = -grid;
    } else if (e.key === 'ArrowRight' && dx === 0) {
        dx = grid; dy = 0;
    } else if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0; dy = grid;
    }
});

gameLoop();