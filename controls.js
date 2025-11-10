// Input handling and controls
const Controls = {
    // Cache DOM elements
    elements: {
        score: null,
        highScore: null,
        pauseMenu: null,
        gameOver: null
    },
    
    init() {
        // Cache frequently accessed DOM elements
        this.elements.score = document.getElementById('score');
        this.elements.highScore = document.getElementById('high-score');
        this.elements.pauseMenu = document.getElementById('pause-menu');
        this.elements.gameOver = document.getElementById('game-over');
    },
    
    // Handle keyboard input
    handleKeyPress(e, gameState, callbacks) {
        // Handle pause (SPACE key)
        if ((e.key === ' ' || e.key === 'Spacebar') && 
            !document.querySelector('.game-container').classList.contains('hidden')) {
            e.preventDefault();
            if (this.elements.gameOver && !this.elements.gameOver.classList.contains('hidden')) {
                return;
            }
            if (gameState.gameStarted && callbacks.togglePause) {
                callbacks.togglePause();
            }
            return;
        }
        
        // Don't handle arrow keys if a select is focused
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'SELECT' || activeElement.tagName === 'OPTION')) {
            return;
        }
        
        // Don't handle input if pause menu is visible
        if (this.elements.pauseMenu && !this.elements.pauseMenu.classList.contains('hidden')) {
            return;
        }
        
        // Handle arrow keys
        const isArrowKey = e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
                           e.key === 'ArrowLeft' || e.key === 'ArrowRight';
        
        if (isArrowKey) {
            let dir;
            switch(e.key) {
                case 'ArrowUp': dir = 'up'; break;
                case 'ArrowDown': dir = 'down'; break;
                case 'ArrowLeft': dir = 'left'; break;
                case 'ArrowRight': dir = 'right'; break;
            }
            this.handleDirectionInput(dir, gameState, callbacks);
        }
    },
    
    // Handle direction input (immediate response)
    handleDirectionInput(dir, gameState, callbacks) {
        let key;
        switch(dir) {
            case 'up': key = 'ArrowUp'; break;
            case 'down': key = 'ArrowDown'; break;
            case 'left': key = 'ArrowLeft'; break;
            case 'right': key = 'ArrowRight'; break;
            default: return;
        }
        
        // Check if pause menu is visible
        if (this.elements.pauseMenu && !this.elements.pauseMenu.classList.contains('hidden')) {
            if (callbacks.resumeFromPause) {
                callbacks.resumeFromPause(key);
            }
            return;
        }
        
        // Check if game-over overlay is visible
        const isGameOverVisible = this.elements.gameOver && 
            !this.elements.gameOver.classList.contains('hidden');
        
        // If game is not running and not started (initial start)
        if (!gameState.gameRunning && !gameState.gameStarted && !isGameOverVisible) {
            if (key === 'ArrowDown') return; // Prevent down arrow as initial direction
            if (callbacks.startNewGame) {
                callbacks.startNewGame(key);
            }
            return;
        }
        
        // If game is not running or not started, ignore
        if (!gameState.gameRunning || !gameState.gameStarted) return;
        
        // Immediately update next direction (for responsive controls)
        switch(key) {
            case 'ArrowUp':
                if (gameState.direction.y === 0) {
                    gameState.nextDirection = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (gameState.direction.y === 0) {
                    gameState.nextDirection = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (gameState.direction.x === 0) {
                    gameState.nextDirection = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (gameState.direction.x === 0) {
                    gameState.nextDirection = { x: 1, y: 0 };
                }
                break;
        }
    },
    
    // Setup touch controls
    setupTouchControls(callbacks) {
        const controlButtons = document.querySelectorAll('.control-btn');
        controlButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const direction = btn.getAttribute('data-direction');
                if (callbacks.handleDirectionInput) {
                    callbacks.handleDirectionInput(direction);
                }
            });
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                btn.classList.add('active');
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                btn.classList.remove('active');
                const direction = btn.getAttribute('data-direction');
                if (callbacks.handleDirectionInput) {
                    callbacks.handleDirectionInput(direction);
                }
            });
        });
        
        // Swipe gesture detection on canvas
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        
        let touchStartX = 0;
        let touchStartY = 0;
        
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: false });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipeDistance = 30;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0 && callbacks.handleDirectionInput) {
                        callbacks.handleDirectionInput('right');
                    } else if (callbacks.handleDirectionInput) {
                        callbacks.handleDirectionInput('left');
                    }
                }
            } else {
                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (deltaY > 0 && callbacks.handleDirectionInput) {
                        callbacks.handleDirectionInput('down');
                    } else if (callbacks.handleDirectionInput) {
                        callbacks.handleDirectionInput('up');
                    }
                }
            }
        }, { passive: false });
    },
    
    // Update score display (optimized - only update when changed)
    updateScore(score, highScore) {
        if (this.elements.score && this.elements.score.textContent != score) {
            this.elements.score.textContent = score;
        }
        if (this.elements.highScore && highScore !== undefined && 
            this.elements.highScore.textContent != highScore) {
            this.elements.highScore.textContent = highScore;
        }
    }
};

