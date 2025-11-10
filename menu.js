// Menu system management
const Menu = {
    elements: {
        mainMenu: null,
        gameContainer: null,
        pauseMenu: null,
        pauseTitle: null,
        pauseInstructions: null,
        resumeBtn: null,
        backToMenuBtn: null,
        gameOver: null,
        playAgainBtn: null,
        menuFromGameOverBtn: null,
        highScoreContainer: null,
        highscoresBtn: null,
        finalScore: null
    },
    
    init() {
        // Cache all menu elements
        this.elements.mainMenu = document.getElementById('main-menu');
        this.elements.gameContainer = document.querySelector('.game-container');
        this.elements.pauseMenu = document.getElementById('pause-menu');
        this.elements.pauseTitle = document.getElementById('pause-title');
        this.elements.pauseInstructions = document.getElementById('pause-instructions');
        this.elements.resumeBtn = document.getElementById('resume-btn');
        this.elements.backToMenuBtn = document.getElementById('back-to-menu-btn');
        this.elements.gameOver = document.getElementById('game-over');
        this.elements.playAgainBtn = document.getElementById('play-again-btn');
        this.elements.menuFromGameOverBtn = document.getElementById('menu-from-gameover-btn');
        this.elements.highScoreContainer = document.getElementById('high-score-container');
        this.elements.highscoresBtn = document.getElementById('highscores-tab-btn');
        this.elements.finalScore = document.getElementById('final-score');
    },
    
    showMainMenu() {
        if (this.elements.mainMenu) this.elements.mainMenu.classList.remove('hidden');
        if (this.elements.gameContainer) this.elements.gameContainer.classList.add('hidden');
        this.hidePauseMenu();
        if (this.elements.gameOver) this.elements.gameOver.classList.add('hidden');
    },
    
    showGame() {
        if (this.elements.mainMenu) this.elements.mainMenu.classList.add('hidden');
        if (this.elements.gameContainer) this.elements.gameContainer.classList.remove('hidden');
        this.hidePauseMenu();
        if (this.elements.gameOver) this.elements.gameOver.classList.add('hidden');
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
    },
    
    showPauseMenu(gameStarted) {
        if (!this.elements.pauseMenu) return;
        this.elements.pauseMenu.classList.remove('hidden');
        
        if (this.elements.resumeBtn) {
            this.elements.resumeBtn.textContent = gameStarted ? 'Resume' : 'Play';
        }
        if (this.elements.pauseTitle) {
            this.elements.pauseTitle.textContent = gameStarted ? 'Paused' : 'Ready to Play';
        }
        if (this.elements.pauseInstructions) {
            this.elements.pauseInstructions.textContent = gameStarted 
                ? 'Press SPACE to resume or click Resume' 
                : 'Press an arrow key or click Play to start';
        }
        
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
    },
    
    hidePauseMenu() {
        if (this.elements.pauseMenu) {
            this.elements.pauseMenu.classList.add('hidden');
        }
    },
    
    setupModeSelection(callback) {
        const modeButtons = document.querySelectorAll('.menu-btn[data-mode]');
        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mode = button.getAttribute('data-mode');
                if (callback) callback(mode);
            });
        });
    },
    
    setupPauseMenu(callbacks) {
        if (this.elements.resumeBtn) {
            this.elements.resumeBtn.addEventListener('click', () => {
                this.hidePauseMenu();
                if (callbacks.onResume) callbacks.onResume();
            });
        }
        
        if (this.elements.backToMenuBtn) {
            this.elements.backToMenuBtn.addEventListener('click', () => {
                // Check if we're in a game subdirectory (arcade mode)
                if (window.location.pathname.includes('/games/')) {
                    window.location.href = '../index.html';
                } else if (callbacks.onBackToMenu) {
                    callbacks.onBackToMenu();
                }
            });
        }
        
        const mobilePauseBtn = document.getElementById('mobile-pause-btn');
        if (mobilePauseBtn) {
            mobilePauseBtn.addEventListener('click', () => {
                if (callbacks.onTogglePause) callbacks.onTogglePause();
            });
        }
    },
    
    setupGameOverMenu(callbacks) {
        if (this.elements.playAgainBtn) {
            this.elements.playAgainBtn.addEventListener('click', () => {
                if (callbacks.onPlayAgain) callbacks.onPlayAgain();
            });
        }
        
        if (this.elements.menuFromGameOverBtn) {
            this.elements.menuFromGameOverBtn.addEventListener('click', () => {
                // Check if we're in a game subdirectory (arcade mode)
                if (window.location.pathname.includes('/games/')) {
                    window.location.href = '../index.html';
                } else if (callbacks.onBackToMenu) {
                    callbacks.onBackToMenu();
                }
            });
        }
    },
    
    setupCustomization(callbacks) {
        const skinSelector = document.getElementById('skin-selector');
        const themeSelector = document.getElementById('theme-selector');
        
        if (!skinSelector || !themeSelector) return;
        
        // Load saved preferences
        const savedSkin = Storage.loadSkin();
        const savedTheme = Storage.loadTheme();
        
        skinSelector.value = savedSkin;
        themeSelector.value = savedTheme;
        
        if (callbacks.onSkinChange) callbacks.onSkinChange(savedSkin);
        if (callbacks.onThemeChange) callbacks.onThemeChange(savedTheme);
        
        skinSelector.addEventListener('change', (e) => {
            const skin = e.target.value;
            Storage.saveSkin(skin);
            if (callbacks.onSkinChange) callbacks.onSkinChange(skin);
            e.target.blur();
        });
        
        themeSelector.addEventListener('change', (e) => {
            const theme = e.target.value;
            Storage.saveTheme(theme);
            if (callbacks.onThemeChange) callbacks.onThemeChange(theme);
            e.target.blur();
        });
        
        // Prevent arrow keys from changing select when game is running
        [skinSelector, themeSelector].forEach(select => {
            select.addEventListener('keydown', (e) => {
                if (callbacks.isGameRunning && callbacks.isGameRunning() && 
                    (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
                     e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                    e.preventDefault();
                    e.stopPropagation();
                    select.blur();
                }
            });
        });
    },
    
    updateHighScoreDisplay(mode, highScores, powerUpHighScores) {
        if (mode === 'zen') {
            if (this.elements.highScoreContainer) {
                this.elements.highScoreContainer.style.display = 'none';
            }
        } else {
            if (this.elements.highScoreContainer) {
                this.elements.highScoreContainer.style.display = 'block';
            }
            if (mode === 'powerup') {
                if (this.elements.highscoresBtn) {
                    this.elements.highscoresBtn.textContent = 'Power-Up Scores';
                }
                this.updatePowerUpHighScoreDisplay(powerUpHighScores);
            } else {
                if (this.elements.highscoresBtn) {
                    this.elements.highscoresBtn.textContent = 'High Scores';
                }
                this.updateHighScoreDisplayList(highScores);
            }
        }
    },
    
    updateHighScoreDisplayList(scores) {
        const list = document.getElementById('high-scores-list');
        if (!list) return;
        
        if (scores.length === 0) {
            list.innerHTML = '<p style="text-align: center; opacity: 0.7;">No scores yet!</p>';
            return;
        }
        
        list.innerHTML = scores.slice(0, 5).map((score, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            return `
                <div class="high-score-item">
                    <span><span class="rank">${index + 1}.</span> ${medal}</span>
                    <span class="score">${score} points</span>
                </div>
            `;
        }).join('');
    },
    
    updatePowerUpHighScoreDisplay(scores) {
        const list = document.getElementById('powerup-high-scores-list');
        if (!list) return;
        
        if (scores.length === 0) {
            list.innerHTML = '<p style="text-align: center; opacity: 0.7;">No scores yet!</p>';
            return;
        }
        
        list.innerHTML = scores.slice(0, 5).map((score, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            return `
                <div class="high-score-item">
                    <span><span class="rank">${index + 1}.</span> ${medal}</span>
                    <span class="score">${score} points</span>
                </div>
            `;
        }).join('');
    },
    
    showGameOver(finalScore) {
        if (this.elements.finalScore) {
            this.elements.finalScore.textContent = finalScore;
        }
        if (this.elements.gameOver) {
            this.elements.gameOver.classList.remove('hidden');
        }
        this.hidePauseMenu();
    },
    
    setupTabs(callbacks) {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                
                if (tabName === 'restart' && callbacks.onRestart) {
                    callbacks.onRestart();
                    return;
                }
                
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                
                if (tabName === 'highscores' && callbacks.onHighScores) {
                    callbacks.onHighScores();
                } else {
                    const targetTab = document.getElementById(`${tabName}-tab`);
                    if (targetTab) {
                        targetTab.classList.add('active');
                    }
                }
            });
        });
    }
};

