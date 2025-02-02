document.addEventListener('DOMContentLoaded', function() {
    const gameCanvas = document.getElementById('gameCanvas');
    const restartButton = document.getElementById('restart-button');
    const openSettingsButton = document.getElementById('open-settings-button');
    const closeSettingsButton = document.getElementById('close-settings-button');
    const settingsModal = document.getElementById('settings-modal');
    const saveSettingsButton = document.getElementById('save-settings-button');
    const ctx = gameCanvas.getContext('2d');
    const backgroundMusic = document.getElementById('background-music');
    const jumpSound = document.getElementById('jump-sound');
    const hitSound = document.getElementById('hit-sound');


    let surfer;
    let obstacles = [];
    let gameSpeed = 2;
    let score = 0;
    let gameRunning = false;
    let obstacleFrequency = 0.03;
    let surferGravity = 1;
    let surferJumpSpeed = 12;
    let canvasWidth = 800;
    let canvasHeight = 400;
    if (window.innerWidth <= 768) {
        canvasWidth = 350;
        canvasHeight = 200;
        gameCanvas.width = canvasWidth;
        gameCanvas.height = canvasHeight;
    }


    backgroundMusic.play(); // 游戏开始时播放背景音乐

    openSettingsButton.addEventListener('click', function() {
        settingsModal.style.display = 'flex';
        backgroundMusic.pause();
    });
    closeSettingsButton.addEventListener('click', function() {
        settingsModal.style.display = 'none';
        backgroundMusic.play();
    });
    saveSettingsButton.addEventListener('click', function(){
        gameSpeed = parseFloat(document.getElementById('game-speed-input').value);
        obstacleFrequency = parseFloat(document.getElementById('obstacle-frequency-input').value);
        surferGravity = parseFloat(document.getElementById('surfer-gravity-input').value);
        surferJumpSpeed = parseInt(document.getElementById('surfer-jump-input').value);
        settingsModal.style.display = 'none';
        backgroundMusic.play();
    });

    function initializeGame() {
        surfer = new Surfer();
        obstacles = [];
        score = 0;
        gameRunning = true;
        restartButton.classList.add('hidden');
        backgroundMusic.play();
        gameLoop();
    }
    function gameLoop() {
        if (!gameRunning) return;
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        surfer.update();
        surfer.draw();
        if (Math.random() < obstacleFrequency) {
            obstacles.push(new Obstacle());
        }
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].draw();
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score++;
            }else if (surfer.collidesWith(obstacles[i])){
                hitSound.play();
                gameRunning = false;
                restartButton.classList.remove('hidden');
                backgroundMusic.pause();
            }
        }
        ctx.fillStyle = 'black';
        ctx.font = '16px sans-serif';
        ctx.fillText('Score: ' + score, 10, 20);
        requestAnimationFrame(gameLoop);

    }

    class Surfer {
        constructor() {
           this.width = 20;
            this.height = 35;
            if (window.innerWidth <= 768) {
                this.x = 25;
                this.y = canvasHeight - this.height;
            }else{
                this.x = 50;
                this.y = canvasHeight - 50;
            }
            this.velocityY = 0;
            this.gravity = surferGravity;
            this.jumpSpeed = surferJumpSpeed;
        }
        jump() {
            if(this.y === gameCanvas.height - this.height){
                this.velocityY = -this.jumpSpeed;
                jumpSound.play();
            }
        }
        update() {
            this.velocityY += this.gravity;
            this.y += this.velocityY;
            if (this.y > gameCanvas.height - this.height) {
                this.y = gameCanvas.height - this.height;
                this.velocityY = 0;
            }
        }
        draw() {
            ctx.fillStyle = 'skyblue';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        collidesWith(obstacle) {
            return this.x < obstacle.x + obstacle.width &&
                this.x + this.width > obstacle.x &&
                this.y < obstacle.y + obstacle.height &&
                this.y + this.height > obstacle.y;
        }
    }

    class Obstacle {
        constructor() {
            this.width = 15;
             this.height = 20 + Math.random() * 20;
            this.x = canvasWidth;
            this.y = gameCanvas.height - this.height;
            this.speed = gameSpeed;
        }
        update() {
            this.x -= this.speed;
        }
        draw() {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    //事件监听器
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && gameRunning ) {
            surfer.jump();
        }
    });
    gameCanvas.addEventListener('touchstart', function(event) {
         if(gameRunning) {
             surfer.jump();
         }
        event.preventDefault();
    });

    restartButton.addEventListener('click', initializeGame);
    initializeGame();  // 启动游戏
});

