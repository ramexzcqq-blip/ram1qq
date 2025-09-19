document.addEventListener('DOMContentLoaded', function() {
    const gameArea = document.getElementById('game-area');
    const scoreElement = document.getElementById('score');
    const timeElement = document.getElementById('time');
    const startButton = document.getElementById('start-game');
    const resetButton = document.getElementById('reset-game');
    
    let gameInterval;
    let spawnInterval;
    let score = 0;
    let timeLeft = 60;
    let gameActive = false;
    
    const resources = [
        { name: 'алмаз', color: '#58a6ff', points: 10 },
        { name: 'золото', color: '#ffd700', points: 5 },
        { name: 'железо', color: '#d4d4d4', points: 3 },
        { name: 'уголь', color: '#333333', points: 1 },
        { name: 'изумруд', color: '#00ff00', points: 15 }
    ];
    
    function startGame() {
        if (gameActive) return;
        
        gameActive = true;
        score = 0;
        timeLeft = 60;
        
        scoreElement.textContent = score;
        timeElement.textContent = timeLeft;
        
        gameArea.innerHTML = '';
        startButton.style.display = 'none';
        
        // Запуск таймера
        gameInterval = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
        
        // Создание ресурсов
        spawnInterval = setInterval(createResource, 1000);
    }
    
    function createResource() {
        if (!gameActive) return;
        
        const resourceType = resources[Math.floor(Math.random() * resources.length)];
        const resource = document.createElement('div');
        resource.className = 'resource';
        resource.style.background = `radial-gradient(circle, ${resourceType.color}, #000)`;
        resource.style.border = `2px solid ${resourceType.color}`;
        resource.style.borderRadius = '50%';
        resource.style.boxShadow = `0 0 10px ${resourceType.color}`;
        
        const size = Math.random() * 30 + 30;
        resource.style.width = `${size}px`;
        resource.style.height = `${size}px`;
        
        const x = Math.random() * (gameArea.offsetWidth - size);
        const y = Math.random() * (gameArea.offsetHeight - size);
        
        resource.style.left = `${x}px`;
        resource.style.top = `${y}px`;
        
        resource.addEventListener('click', () => collectResource(resource, resourceType));
        
        gameArea.appendChild(resource);
        
        // Удаление ресурса через 3 секунды
        setTimeout(() => {
            if (resource.parentNode) {
                resource.style.opacity = '0';
                resource.style.transition = 'opacity 0.5s';
                setTimeout(() => {
                    if (resource.parentNode) {
                        gameArea.removeChild(resource);
                    }
                }, 500);
            }
        }, 3000);
    }
    
    function collectResource(resource, resourceType) {
        if (!gameActive) return;
        
        resource.classList.add('collect-animation');
        score += resourceType.points;
        scoreElement.textContent = score;
        
        setTimeout(() => {
            if (resource.parentNode) {
                gameArea.removeChild(resource);
            }
        }, 300);
    }
    
    function endGame() {
        gameActive = false;
        clearInterval(gameInterval);
        clearInterval(spawnInterval);
        
        const gameOver = document.createElement('div');
        gameOver.className = 'game-instructions';
        gameOver.innerHTML = `
            <h2>Игра окончена!</h2>
            <p>Ваш счёт: ${score}</p>
            <button class="action-btn" id="play-again">Играть снова</button>
        `;
        
        gameArea.innerHTML = '';
        gameArea.appendChild(gameOver);
        
        document.getElementById('play-again').addEventListener('click', startGame);
    }
    
    function resetGame() {
        if (gameActive) {
            clearInterval(gameInterval);
            clearInterval(spawnInterval);
            gameActive = false;
        }
        
        gameArea.innerHTML = `
            <div class="game-instructions">
                <p>Кликай на ресурсы, чтобы собирать их!</p>
                <button class="action-btn" id="start-game">Начать игру</button>
            </div>
        `;
        
        score = 0;
        timeLeft = 60;
        scoreElement.textContent = score;
        timeElement.textContent = timeLeft;
        
        document.getElementById('start-game').addEventListener('click', startGame);
    }
    
    // Инициализация игры
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
});
