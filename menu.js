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
        finalScore: null,
        leaderboardSubmitSection: null,
        playerInitialsInput: null,
        submitScoreBtn: null,
        submitStatus: null,
        globalLeaderboardList: null,
        leaderboardTabBtn: null
    },
    
    // Current game state for leaderboard
    currentGameScore: 0,
    currentGameMode: 'classic',
    
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
        this.elements.leaderboardSubmitSection = document.getElementById('leaderboard-submit-section');
        this.elements.playerInitialsInput = document.getElementById('player-initials');
        this.elements.submitScoreBtn = document.getElementById('submit-score-btn');
        this.elements.submitStatus = document.getElementById('submit-status');
        this.elements.globalLeaderboardList = document.getElementById('global-leaderboard-list');
        this.elements.leaderboardTabBtn = document.getElementById('leaderboard-tab-btn');
        
        // Initialize leaderboard if available
        if (typeof Leaderboard !== 'undefined') {
            Leaderboard.init();
        }
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
    
    showGameOver(finalScore, gameMode = 'classic') {
        if (this.elements.finalScore) {
            this.elements.finalScore.textContent = finalScore;
        }
        if (this.elements.gameOver) {
            this.elements.gameOver.classList.remove('hidden');
        }
        this.hidePauseMenu();
        
        // Store current game state for leaderboard
        this.currentGameScore = finalScore;
        this.currentGameMode = gameMode;
        
        // Show leaderboard submit section if leaderboard is available and not in zen mode
        if (typeof Leaderboard !== 'undefined' && Leaderboard.isAvailable() && gameMode !== 'zen') {
            if (this.elements.leaderboardSubmitSection) {
                this.elements.leaderboardSubmitSection.classList.remove('hidden');
            }
            if (this.elements.playerInitialsInput) {
                this.elements.playerInitialsInput.value = '';
                this.elements.playerInitialsInput.focus();
            }
            if (this.elements.submitStatus) {
                this.elements.submitStatus.textContent = '';
            }
        } else {
            if (this.elements.leaderboardSubmitSection) {
                this.elements.leaderboardSubmitSection.classList.add('hidden');
            }
        }
        
        // Hide leaderboard tab if not available
        if (this.elements.leaderboardTabBtn) {
            if (typeof Leaderboard === 'undefined' || !Leaderboard.isAvailable()) {
                this.elements.leaderboardTabBtn.style.display = 'none';
            } else {
                this.elements.leaderboardTabBtn.style.display = '';
            }
        }
    },
    
    // Setup leaderboard submission
    setupLeaderboardSubmission() {
        if (!this.elements.submitScoreBtn || !this.elements.playerInitialsInput) return;
        
        // Submit on button click
        this.elements.submitScoreBtn.addEventListener('click', () => {
            this.submitScoreToLeaderboard();
        });
        
        // Submit on Enter key
        this.elements.playerInitialsInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitScoreToLeaderboard();
            }
        });
        
        // Only allow letters
        this.elements.playerInitialsInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
        });
    },
    
    // Submit score to global leaderboard
    async submitScoreToLeaderboard() {
        if (!this.elements.playerInitialsInput || !this.elements.submitStatus) return;
        
        const initials = this.elements.playerInitialsInput.value.trim();
        
        if (initials.length === 0) {
            this.elements.submitStatus.textContent = 'Please enter your initials';
            this.elements.submitStatus.style.color = '#ff4757';
            return;
        }
        
        if (typeof Leaderboard === 'undefined' || !Leaderboard.isAvailable()) {
            this.elements.submitStatus.textContent = 'Leaderboard not available';
            this.elements.submitStatus.style.color = '#ff4757';
            return;
        }
        
        // Disable input and button while submitting
        this.elements.playerInitialsInput.disabled = true;
        this.elements.submitScoreBtn.disabled = true;
        this.elements.submitStatus.textContent = 'Submitting...';
        this.elements.submitStatus.style.color = '#fff';
        
        try {
            const result = await Leaderboard.submitScore(
                initials,
                this.currentGameScore,
                this.currentGameMode
            );
            
            if (result.success) {
                this.elements.submitStatus.textContent = 'Score submitted successfully! 🎉';
                this.elements.submitStatus.style.color = '#51cf66';
                // Refresh leaderboard if it's currently displayed
                if (document.getElementById('leaderboard-tab') && 
                    document.getElementById('leaderboard-tab').classList.contains('active')) {
                    this.loadGlobalLeaderboard(this.currentGameMode);
                }
            } else {
                this.elements.submitStatus.textContent = `Error: ${result.error || 'Failed to submit score'}`;
                this.elements.submitStatus.style.color = '#ff4757';
                // Re-enable input and button on error
                this.elements.playerInitialsInput.disabled = false;
                this.elements.submitScoreBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            this.elements.submitStatus.textContent = 'Error submitting score. Please try again.';
            this.elements.submitStatus.style.color = '#ff4757';
            // Re-enable input and button on error
            this.elements.playerInitialsInput.disabled = false;
            this.elements.submitScoreBtn.disabled = false;
        }
    },
    
    // Load and display global leaderboard
    async loadGlobalLeaderboard(gameMode = 'classic') {
        if (!this.elements.globalLeaderboardList) return;
        
        // Update leaderboard title based on game mode
        const leaderboardTitle = document.getElementById('leaderboard-title');
        if (leaderboardTitle) {
            if (gameMode === 'powerup') {
                leaderboardTitle.textContent = 'Global Leaderboard - Power-Up Mode';
            } else {
                leaderboardTitle.textContent = 'Global Leaderboard - Classic Mode';
            }
        }
        
        if (typeof Leaderboard === 'undefined' || !Leaderboard.isAvailable()) {
            this.elements.globalLeaderboardList.innerHTML = 
                '<p style="text-align: center; opacity: 0.7;">Leaderboard not available. Please configure Supabase.</p>';
            return;
        }
        
        this.elements.globalLeaderboardList.innerHTML = 
            '<p style="text-align: center; opacity: 0.7;">Loading leaderboard...</p>';
        
        try {
            const result = await Leaderboard.getLeaderboard(gameMode, 10);
            
            if (result.success && result.scores && result.scores.length > 0) {
                this.elements.globalLeaderboardList.innerHTML = result.scores.map((entry, index) => {
                    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                    const date = new Date(entry.created_at);
                    const dateStr = date.toLocaleDateString();
                    return `
                        <div class="high-score-item global-leaderboard-item">
                            <span><span class="rank">${index + 1}.</span> ${medal} <strong>${entry.name}</strong></span>
                            <span class="score">${entry.score} pts</span>
                            <span class="leaderboard-date">${dateStr}</span>
                        </div>
                    `;
                }).join('');
            } else {
                this.elements.globalLeaderboardList.innerHTML = 
                    '<p style="text-align: center; opacity: 0.7;">No scores yet. Be the first to submit!</p>';
            }
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            this.elements.globalLeaderboardList.innerHTML = 
                '<p style="text-align: center; opacity: 0.7; color: #ff4757;">Error loading leaderboard. Please try again.</p>';
        }
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
                } else if (tabName === 'leaderboard') {
                    const targetTab = document.getElementById(`${tabName}-tab`);
                    if (targetTab) {
                        targetTab.classList.add('active');
                    }
                    // Load leaderboard when tab is clicked
                    if (callbacks.onLeaderboardLoad) {
                        callbacks.onLeaderboardLoad();
                    }
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

