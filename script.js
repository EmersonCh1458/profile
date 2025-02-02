document.addEventListener('DOMContentLoaded', function() {
    const gameWrapper = document.getElementById('game-wrapper');
    const gameContainer = document.querySelector('.game-container'); // 游戏内容
    const gameCanvas = document.getElementById('gameCanvas');
     const restartButton = document.getElementById('restart-button');
     const toggleGameButton = document.getElementById('toggle-game-button');
    const openSettingsButton = document.getElementById('open-settings-button');
    const closeSettingsButton = document.getElementById('close-settings-button');
     const settingsModal = document.getElementById('settings-modal');
      const saveSettingsButton = document.getElementById('save-settings-button');
    const ctx = gameCanvas.getContext('2d');

    let surfer;
    let obstacles = [];
    let gameSpeed = 2;
    let score = 0;
    let gameRunning = false;
    let obstacleFrequency = 0.03;
    let surferGravity = 1;
    let surferJumpSpeed = 12;


    toggleGameButton.addEventListener('click', function(e) {
       e.preventDefault();
        gameWrapper.classList.remove('hidden'); // 显示游戏容器
        initializeGame();
    });

    function initializeGame() {
        surfer = new Surfer();
        obstacles = [];
        score = 0;
        gameRunning =
