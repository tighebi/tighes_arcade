// Main game file - optimized with requestAnimationFrame
// Game state
const gameState = {
    snake: [],
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 },
    food: { x: 0, y: 0 },
    foodType: 'normal',
    score: 0,
    highScore: 0,
    highScores: [],
    powerUpHighScores: [],
    gameMode: 'classic',
    currentSkin: 'classic',
    currentTheme: 'default',
    skin: null,
    gameRunning: false,
    gameStarted: false,
    speedModifier: 1.0,
    speedModifierTimer: 0,
    frameCount: 0
};

// Animation and game loop
let renderAnimationId = null;
let lastUpdateTime = 0;
let gameUpdateInterval = CONFIG.BASE_GAME_SPEED; // milliseconds

// Initialize game
function init() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    // Load preferences first
    gameState.currentSkin = Storage.loadSkin();
    gameState.currentTheme = Storage.loadTheme();
    
    // Initialize renderer with theme
    Renderer.init(canvas, gameState.currentTheme);
    
    // Initialize controls
    Controls.init();
    
    // Initialize menu
    Menu.init();
    
    // Create skin
    gameState.skin = Skins.createSkin(gameState.currentSkin, gameState.currentTheme);
    
    // Apply theme
    applyTheme(gameState.currentTheme);
    
    // Load high scores (from unified storage)
    gameState.highScores = Storage.loadHighScores();
    gameState.powerUpHighScores = Storage.loadPowerUpHighScores();
    gameState.highScore = gameState.highScores.length > 0 ? gameState.highScores[0] : 0;
    
    // Migrate to unified storage if ArcadeStorage is available
    if (typeof ArcadeStorage !== 'undefined') {
        // Ensure scores are synced with ArcadeStorage
        if (gameState.highScores.length > 0) {
            gameState.highScores.forEach(score => {
                ArcadeStorage.saveHighScore(ArcadeStorage.GAMES.SNAKE_CLASSIC, score);
            });
        }
        if (gameState.powerUpHighScores.length > 0) {
            gameState.powerUpHighScores.forEach(score => {
                ArcadeStorage.saveHighScore(ArcadeStorage.GAMES.SNAKE_POWERUP, score);
            });
        }
    }
    
    // Setup canvas responsiveness
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', () => {
        setTimeout(resizeCanvas, 100);
    });
    
    // Show main menu
    Menu.showMainMenu();
    
    // Setup menus
    Menu.setupModeSelection(selectGameMode);
    Menu.setupPauseMenu({
        onResume: resumeGame,
        onBackToMenu: () => Menu.showMainMenu(),
        onTogglePause: togglePause
    });
    Menu.setupGameOverMenu({
        onPlayAgain: () => {
            GameLogic.resetGame(gameState);
            Menu.showPauseMenu(false);
        },
        onBackToMenu: () => Menu.showMainMenu()
    });
    
    // Setup leaderboard submission
    Menu.setupLeaderboardSubmission();
    Menu.setupCustomization({
        onSkinChange: (skin) => {
            gameState.currentSkin = skin;
            gameState.skin = Skins.createSkin(skin, gameState.currentTheme);
        },
        onThemeChange: (theme) => {
            gameState.currentTheme = theme;
            gameState.skin = Skins.createSkin(gameState.currentSkin, theme);
            applyTheme(theme);
            Renderer.updateGridCache(theme);
        },
        isGameRunning: () => gameState.gameRunning
    });
    Menu.setupTabs({
        onRestart: () => {
            if (!gameState.gameRunning) {
                GameLogic.resetGame(gameState);
                Controls.updateScore(0, gameState.highScore);
            }
        },
        onHighScores: () => {
            if (gameState.gameMode === 'powerup') {
                Menu.updatePowerUpHighScoreDisplay(gameState.powerUpHighScores);
            } else {
                Menu.updateHighScoreDisplayList(gameState.highScores);
            }
        },
        onLeaderboardLoad: () => {
            Menu.loadGlobalLeaderboard(gameState.gameMode);
        }
    });
    
    // Setup controls
    document.addEventListener('keydown', (e) => {
        Controls.handleKeyPress(e, gameState, {
            togglePause: togglePause,
            resumeFromPause: (key) => {
                Menu.hidePauseMenu();
                if (!gameState.gameStarted) {
                    startNewGame(key);
                } else {
                    gameState.gameRunning = true;
                }
            },
            startNewGame: startNewGame,
            handleDirectionInput: (dir) => {
                Controls.handleDirectionInput(dir, gameState, {
                    resumeFromPause: (key) => {
                        Menu.hidePauseMenu();
                        if (!gameState.gameStarted) {
                            startNewGame(key);
                        } else {
                            gameState.gameRunning = true;
                        }
                    },
                    startNewGame: startNewGame
                });
            }
        });
    });
    
    Controls.setupTouchControls({
        handleDirectionInput: (dir) => {
            Controls.handleDirectionInput(dir, gameState, {
                resumeFromPause: (key) => {
                    Menu.hidePauseMenu();
                    if (!gameState.gameStarted) {
                        startNewGame(key);
                    } else {
                        gameState.gameRunning = true;
                    }
                },
                startNewGame: startNewGame
            });
        }
    });
    
    // Start game loop
    startGameLoop();
}

// Apply theme to body
function applyTheme(theme) {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    if (theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }
}

// Resize canvas - optimized for mobile to ensure everything fits on screen
function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reduced size on mobile to ensure all UI elements fit on screen
        // Account for header, score, controls, and mobile controls
        const availableHeight = window.innerHeight - 400; // More conservative estimate
        const availableWidth = window.innerWidth - 40; // Account for padding
        const maxSize = Math.min(availableWidth, availableHeight, 350); // Max 350px on mobile
        const size = Math.max(280, maxSize); // Minimum 280px, but prefer smaller
        
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';
    } else {
        const maxWidth = Math.min(400, window.innerWidth - 40);
        const maxHeight = Math.min(400, window.innerHeight * 0.5);
        const size = Math.min(maxWidth, maxHeight);
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';
    }
}

// Select game mode
function selectGameMode(mode) {
    gameState.gameMode = mode;
    GameLogic.resetGame(gameState);
    Menu.updateHighScoreDisplay(mode, gameState.highScores, gameState.powerUpHighScores);
    Menu.showGame();
    Menu.showPauseMenu(false);
    updateHighScoreDisplay();
}

// Start new game
function startNewGame(initialKey) {
    if (initialKey === 'ArrowDown') return;
    
    gameState.gameStarted = true;
    gameState.gameRunning = true;
    Menu.hidePauseMenu();
    
    switch(initialKey) {
        case 'ArrowUp':
            gameState.direction = { x: 0, y: -1 };
            gameState.nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowLeft':
            gameState.direction = { x: -1, y: 0 };
            gameState.nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            gameState.direction = { x: 1, y: 0 };
            gameState.nextDirection = { x: 1, y: 0 };
            break;
    }
}

// Resume game
function resumeGame() {
    Menu.hidePauseMenu();
    if (gameState.gameStarted) {
        gameState.gameRunning = true;
    }
}

// Toggle pause
function togglePause() {
    if (!gameState.gameStarted) return;
    
    if (gameState.gameRunning) {
        gameState.gameRunning = false;
        Menu.showPauseMenu(true);
    } else {
        resumeGame();
    }
}

// Game over
function gameOver() {
    gameState.gameRunning = false;
    gameState.gameStarted = false;
    
    let isHighScore = false;
    if (gameState.gameMode !== 'zen') {
        const isPowerUp = gameState.gameMode === 'powerup';
        
        // Get old scores before updating
        const oldScores = isPowerUp ? gameState.powerUpHighScores : gameState.highScores;
        const oldBestScore = oldScores.length > 0 ? (typeof oldScores[0] === 'number' ? oldScores[0] : oldScores[0].score) : 0;
        
        // Update scores
        const updatedScores = Storage.updateHighScores(gameState.score, isPowerUp);
        
        // Check if this is a new high score (score is better than previous best)
        if (updatedScores.length > 0) {
            const newBestScore = typeof updatedScores[0] === 'number' ? updatedScores[0] : updatedScores[0].score;
            // It's a high score if the new score is greater than the old best
            if (gameState.score > oldBestScore) {
                isHighScore = true;
            }
        }
        
        if (isPowerUp) {
            gameState.powerUpHighScores = updatedScores;
        } else {
            gameState.highScores = updatedScores;
            const bestScore = updatedScores.length > 0 ? (typeof updatedScores[0] === 'number' ? updatedScores[0] : updatedScores[0].score) : 0;
            gameState.highScore = bestScore;
        }
        
        // Update high score displays
        Menu.updateHighScoreDisplay(gameState.gameMode, gameState.highScores, gameState.powerUpHighScores);
        updateHighScoreDisplay();
    }
    
    Menu.showGameOver(gameState.score, gameState.gameMode, isHighScore);
}

// Optimized game loop using requestAnimationFrame
function startGameLoop() {
    lastUpdateTime = performance.now();
    
    function gameLoop(currentTime) {
        // Calculate delta time
        let deltaTime = currentTime - lastUpdateTime;
        
        // Cap delta time to prevent large jumps when tab was inactive
        // Max 500ms (about 3-4 game steps)
        const maxDeltaTime = 500;
        if (deltaTime > maxDeltaTime) {
            deltaTime = maxDeltaTime;
            lastUpdateTime = currentTime - maxDeltaTime;
        }
        
        // Update game logic at fixed intervals (only when running)
        if (gameState.gameRunning && gameState.gameStarted) {
            // Calculate actual game speed based on modifier
            const actualInterval = Math.max(
                CONFIG.MIN_GAME_SPEED, 
                Math.min(CONFIG.MAX_GAME_SPEED, CONFIG.BASE_GAME_SPEED / gameState.speedModifier)
            );
            
            if (deltaTime >= actualInterval) {
                // Update lastUpdateTime, accounting for frame timing
                lastUpdateTime = currentTime - (deltaTime % actualInterval);
                
                // Update game logic
                const result = GameLogic.update(gameState);
                
                if (result === 'gameOver') {
                    gameOver();
                } else if (result === 'foodEaten') {
                    const foodResult = GameLogic.handleFoodEaten(gameState);
                    const foodData = GameLogic.generateFood(gameState.snake, gameState.gameMode);
                    gameState.food = foodData.food;
                    gameState.foodType = foodData.foodType;
                    
                    // Update score display
                    updateHighScoreDisplay();
                } else if (result === 'speedReset') {
                    // Speed modifier expired, already reset in GameLogic.update
                }
            }
        } else {
            // Not running, just update time for smooth rendering
            lastUpdateTime = currentTime;
        }
        
        // Always render (smooth 60fps)
        Renderer.render(gameState);
        
        // Increment frame count for animations (only when game is visible)
        if (Menu.elements.gameContainer && 
            !Menu.elements.gameContainer.classList.contains('hidden')) {
            gameState.frameCount++;
        }
        
        renderAnimationId = requestAnimationFrame(gameLoop);
    }
    
    renderAnimationId = requestAnimationFrame(gameLoop);
}

// Update high score display when scores change
function updateHighScoreDisplay() {
    if (gameState.gameMode === 'zen') return;
    
    const currentHigh = gameState.gameMode === 'powerup' 
        ? (gameState.powerUpHighScores.length > 0 ? gameState.powerUpHighScores[0] : 0)
        : gameState.highScore;
    
    Controls.updateScore(gameState.score, currentHigh);
}

// Initialize when page loads
window.addEventListener('load', init);
