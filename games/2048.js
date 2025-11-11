// 2048 Game with Slide Animations
const Game2048 = {
    grid: [],
    score: 0,
    highScore: 0,
    highScores: [],
    gameOver: false,
    won: false,
    gamePaused: false,
    gameStarted: false,
    gridElement: null,
    SIZE: 4,
    animating: false,
    oldGridState: null,
    lastMoveDirection: null,
    tileMovements: [], // Track tile movements for animation
    theme: 'default',
    
    init() {
        this.gridElement = document.getElementById('grid');
        
        // Initialize leaderboard
        if (typeof Leaderboard !== 'undefined') {
            Leaderboard.init();
        }
        
        // Load high scores
        if (typeof ArcadeStorage !== 'undefined') {
            this.highScores = ArcadeStorage.getAllScoresForGame(ArcadeStorage.GAMES.GAME2048);
            if (this.highScores.length > 0) {
                const bestEntry = this.highScores[0];
                this.highScore = typeof bestEntry === 'number' ? bestEntry : (bestEntry.score || 0);
            } else {
                this.highScore = 0;
            }
            document.getElementById('high-score').textContent = this.highScore;
        }
        
        // Setup theme selector
        this.setupTheme();
        
        // Setup main menu
        this.setupMainMenu();
        
        // Setup controls
        this.setupControls();
        this.setupMenu();
        this.setupPauseMenu();
        this.setupGameOverTabs();
        this.setupLeaderboardSubmission();
        
        // Initialize game (but don't show it yet)
        this.resetGame();
    },
    
    setupTheme() {
        const selector = document.getElementById('theme-selector');
        if (!selector) return;
        
        // Apply initial theme
        this.applyTheme(this.theme);
        
        selector.addEventListener('change', (e) => {
            this.theme = e.target.value;
            this.applyTheme(this.theme);
        });
    },
    
    setupMainMenu() {
        const startBtn = document.getElementById('start-game-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                // Hide main menu
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu) {
                    mainMenu.classList.add('hidden');
                }
                // Show game container
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    gameContainer.classList.remove('hidden');
                }
                // Show pause menu as "Ready to Play"
                const pauseMenu = document.getElementById('pause-menu');
                if (pauseMenu) {
                    pauseMenu.classList.remove('hidden');
                    document.getElementById('pause-title').textContent = 'Ready to Play';
                    document.getElementById('pause-instructions').textContent = 'Use arrow keys or WASD to start';
                }
            });
        }
    },
    
    applyTheme(theme) {
        const gameContainer = document.getElementById('game2048');
        if (!gameContainer) return;
        
        // Remove all theme classes
        gameContainer.classList.remove('theme-default', 'theme-dark', 'theme-colorful', 'theme-pastel');
        // Add new theme class
        gameContainer.classList.add(`theme-${theme}`);
    },
    
    setupPauseMenu() {
        const pauseMenu = document.getElementById('pause-menu');
        const resumeBtn = document.getElementById('resume-btn');
        const backToMenuBtn = document.getElementById('back-to-menu-btn');
        
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => {
                if (!this.gameStarted) {
                    this.startGame();
                } else if (this.gamePaused) {
                    this.resumeGame();
                }
            });
        }
        
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => {
                // Hide game container
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    gameContainer.classList.add('hidden');
                }
                // Show main menu
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu) {
                    mainMenu.classList.remove('hidden');
                }
                // Reset game
                this.resetGame();
            });
        }
        
        // Pause on P key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                if (this.gameStarted && !this.gameOver && !this.animating && !this.gamePaused) {
                    this.pauseGame();
                } else if (this.gamePaused) {
                    this.resumeGame();
                }
            }
        });
    },
    
    setupGameOverTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-tab');
                
                // Update active button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update active content
                tabContents.forEach(content => content.classList.remove('active'));
                
                if (tab === 'overview') {
                    document.getElementById('overview-tab').classList.add('active');
                } else if (tab === 'highscores') {
                    document.getElementById('highscores-tab').classList.add('active');
                    this.loadHighScores();
                } else if (tab === 'leaderboard') {
                    document.getElementById('leaderboard-tab').classList.add('active');
                    this.loadGlobalLeaderboard();
                }
            });
        });
    },
    
    setupLeaderboardSubmission() {
        const submitBtn = document.getElementById('submit-score-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitScoreToLeaderboard();
            });
        }
    },
    
    async submitScoreToLeaderboard() {
        const submitBtn = document.getElementById('submit-score-btn');
        const submitStatus = document.getElementById('submit-status');
        
        if (!submitBtn || !submitStatus) return;
        
        if (typeof Leaderboard === 'undefined' || !Leaderboard.isAvailable()) {
            submitStatus.textContent = 'Leaderboard not available. Please configure Supabase.';
            submitStatus.style.color = '#ffa502';
            return;
        }
        
        if (typeof UsernameManager === 'undefined' || !UsernameManager.hasUsernameSet()) {
            submitStatus.textContent = 'Please set a username first.';
            submitStatus.style.color = '#ffa502';
            return;
        }
        
        submitBtn.disabled = true;
        submitStatus.textContent = 'Submitting score...';
        submitStatus.style.color = '#fff';
        
        try {
            const username = UsernameManager.getUsername();
            const nameString = String(username).trim().substring(0, 3).toUpperCase();
            const scoreNumber = Number(this.score);
            
            const result = await Leaderboard.submitScore(
                nameString,
                scoreNumber,
                '2048'
            );
            
            if (result.success) {
                submitStatus.textContent = 'Score submitted successfully! 🎉';
                submitStatus.style.color = '#51cf66';
                // Refresh leaderboard if it's currently displayed
                if (document.getElementById('leaderboard-tab') && 
                    document.getElementById('leaderboard-tab').classList.contains('active')) {
                    this.loadGlobalLeaderboard();
                }
            } else {
                submitStatus.textContent = `Error: ${result.error || 'Failed to submit score'}`;
                submitStatus.style.color = '#ff4757';
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            submitStatus.textContent = 'Error submitting score. Please try again.';
            submitStatus.style.color = '#ff4757';
            submitBtn.disabled = false;
        }
    },
    
    async loadGlobalLeaderboard() {
        const leaderboardList = document.getElementById('global-leaderboard-list');
        const leaderboardTitle = document.getElementById('leaderboard-title');
        
        if (leaderboardTitle) {
            leaderboardTitle.textContent = 'Global Leaderboard - 2048';
        }
        
        if (!leaderboardList) return;
        
        if (typeof Leaderboard === 'undefined' || !Leaderboard.isAvailable()) {
            leaderboardList.innerHTML = 
                '<p style="text-align: center; opacity: 0.7;">Leaderboard not available. Please configure Supabase.</p>';
            return;
        }
        
        leaderboardList.innerHTML = '<p style="text-align: center; opacity: 0.7;">Loading leaderboard...</p>';
        
        try {
            const result = await Leaderboard.getLeaderboard('2048', 3);
            
            if (result.success && result.scores && result.scores.length > 0) {
                leaderboardList.innerHTML = result.scores.map((entry, index) => {
                    const rank = index + 1;
                    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
                    return `
                        <div class="leaderboard-entry">
                            <span class="leaderboard-rank">${medal}</span>
                            <span class="leaderboard-name">${entry.name || 'Player'}</span>
                            <span class="leaderboard-score">${entry.score || 0}</span>
                        </div>
                    `;
                }).join('');
            } else {
                leaderboardList.innerHTML = '<p style="text-align: center; opacity: 0.7;">No scores yet. Be the first!</p>';
            }
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            leaderboardList.innerHTML = '<p style="text-align: center; opacity: 0.7;">Error loading leaderboard.</p>';
        }
    },
    
    loadHighScores() {
        const highScoresList = document.getElementById('high-scores-list');
        if (!highScoresList) return;
        
        if (typeof ArcadeStorage === 'undefined') {
            highScoresList.innerHTML = '<p style="text-align: center; opacity: 0.7;">High scores not available.</p>';
            return;
        }
        
        const scores = ArcadeStorage.getAllScoresForGame(ArcadeStorage.GAMES.GAME2048);
        
        if (scores.length === 0) {
            highScoresList.innerHTML = '<p style="text-align: center; opacity: 0.7;">No scores yet. Play to set your first record!</p>';
            return;
        }
        
        highScoresList.innerHTML = scores.slice(0, 3).map((scoreEntry, index) => {
            // Handle both old numeric format and new object format
            let score, username;
            if (typeof scoreEntry === 'number') {
                score = scoreEntry;
                username = 'Player';
            } else if (typeof scoreEntry === 'object' && scoreEntry !== null) {
                score = scoreEntry.score || 0;
                username = scoreEntry.username || 'Player';
            } else {
                score = 0;
                username = 'Player';
            }
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
            return `
                <div class="high-score-entry">
                    <span class="high-score-rank">${medal}</span>
                    <span class="high-score-name">${username}</span>
                    <span class="high-score-value">${score}</span>
                </div>
            `;
        }).join('');
    },
    
    pauseGame() {
        if (this.gamePaused || this.gameOver || this.animating) return;
        this.gamePaused = true;
        document.getElementById('pause-menu').classList.remove('hidden');
        document.getElementById('pause-title').textContent = 'Paused';
        document.getElementById('pause-instructions').textContent = 'Press P or click Play to resume';
    },
    
    resumeGame() {
        if (!this.gamePaused) return;
        this.gamePaused = false;
        document.getElementById('pause-menu').classList.add('hidden');
    },
    
    startGame() {
        if (this.gameStarted) return;
        this.gameStarted = true;
        this.gamePaused = false;
        document.getElementById('pause-menu').classList.add('hidden');
    },
    
    resetGame() {
        this.grid = Array(this.SIZE).fill().map(() => Array(this.SIZE).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.gamePaused = false;
        this.gameStarted = false;
        this.oldGridState = null;
        
        // Add two random tiles
        this.addRandomTile();
        this.addRandomTile();
        
        // Update UI
        this.updateDisplay();
        document.getElementById('score').textContent = this.score;
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('win-message').classList.add('hidden');
        document.getElementById('pause-menu').classList.remove('hidden');
        document.getElementById('pause-title').textContent = 'Ready to Play';
        document.getElementById('pause-instructions').textContent = 'Use arrow keys or WASD to start';
    },
    
    addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < this.SIZE; r++) {
            for (let c = 0; c < this.SIZE; c++) {
                if (this.grid[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        
        if (emptyCells.length === 0) return;
        
        const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.grid[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
    },
    
    setupControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameOver && !this.won) return;
            if (this.animating) return;
            if (this.gamePaused && e.key !== 'p' && e.key !== 'P') return;
            
            // Start game on first move
            if (!this.gameStarted) {
                this.startGame();
            }
            
            let moved = false;
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    moved = this.performMove('up');
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    moved = this.performMove('down');
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    moved = this.performMove('left');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    moved = this.performMove('right');
                    break;
            }
            
            if (moved) {
                e.preventDefault();
            }
        });
        
        // Touch controls (swipe) - prevent page scrolling
        this.gridElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: false });
        
        this.gridElement.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling while swiping
        }, { passive: false });
        
        this.gridElement.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.gameOver && !this.won) return;
            if (this.animating) return;
            if (this.gamePaused) return;
            
            // Start game on first move
            if (!this.gameStarted) {
                this.startGame();
            }
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipe = 30;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipe) {
                    this.performMove(deltaX > 0 ? 'right' : 'left');
                }
            } else {
                if (Math.abs(deltaY) > minSwipe) {
                    this.performMove(deltaY > 0 ? 'down' : 'up');
                }
            }
        }, { passive: false });
    },
    
    setupMenu() {
        const playAgainBtn = document.getElementById('play-again-btn');
        const menuFromGameOverBtn = document.getElementById('menu-from-gameover-btn');
        const continueBtn = document.getElementById('continue-btn');
        const newGameBtn = document.getElementById('new-game-btn');
        
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.resetGame();
            });
        }
        
        if (menuFromGameOverBtn) {
            menuFromGameOverBtn.addEventListener('click', () => {
                // Hide game container
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    gameContainer.classList.add('hidden');
                }
                // Show main menu
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu) {
                    mainMenu.classList.remove('hidden');
                }
                // Reset game
                this.resetGame();
            });
        }
        
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.won = false;
                document.getElementById('win-message').classList.add('hidden');
            });
        }
        
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                this.resetGame();
            });
        }
    },
    
    performMove(direction) {
        if (this.animating) return false;
        
        // Save old state and direction
        this.oldGridState = this.grid.map(row => [...row]);
        this.lastMoveDirection = direction;
        this.tileMovements = [];
        
        // Perform move (this will populate tileMovements)
        const moved = this.move(direction);
        
        if (!moved) {
            this.oldGridState = null;
            this.lastMoveDirection = null;
            this.tileMovements = [];
            return false;
        }
        
        this.animating = true;
        
        // Animate and then add new tile
        this.animateMove(() => {
            this.addRandomTile();
            this.updateDisplay();
            this.checkGameState();
            this.animating = false;
            this.oldGridState = null;
            this.lastMoveDirection = null;
            this.tileMovements = [];
        });
        
        return true;
    },
    
    move(direction) {
        const oldGrid = this.grid.map(row => [...row]);
        let moved = false;
        this.tileMovements = [];
        
        // Enhanced merge function that tracks movements
        const mergeWithTracking = (line, isReverse = false) => {
            const merged = [];
            const movements = [];
            let mergeIndex = 0;
            
            // Filter out zeros and track original indices
            const nonZeros = [];
            for (let i = 0; i < line.length; i++) {
                if (line[i] !== 0) {
                    nonZeros.push({ value: line[i], originalIndex: i });
                }
            }
            
            // Process merges
            for (let i = 0; i < nonZeros.length; i++) {
                if (i < nonZeros.length - 1 && nonZeros[i].value === nonZeros[i + 1].value) {
                    // Merge - use the further source tile for animation (looks more natural)
                    const mergedValue = nonZeros[i].value * 2;
                    merged.push(mergedValue);
                    this.score += mergedValue; // Update score
                    
                    // For merges, animate from the further source position for better visual
                    // Use the tile that's further from the destination
                    const fromIndex = isReverse 
                        ? nonZeros[i].originalIndex  // In reverse, first in array is further from destination
                        : nonZeros[i + 1].originalIndex; // In normal, second is further from destination
                    
                    movements.push({
                        fromIndex: fromIndex,
                        toIndex: mergeIndex,
                        merged: true
                    });
                    
                    i++; // Skip next (merged) tile
                } else {
                    // No merge - simple movement
                    merged.push(nonZeros[i].value);
                    movements.push({
                        fromIndex: nonZeros[i].originalIndex,
                        toIndex: mergeIndex,
                        merged: false
                    });
                }
                mergeIndex++;
            }
            
            // Pad with zeros
            while (merged.length < line.length) {
                merged.push(0);
            }
            
            return { merged, movements };
        };
        
        if (direction === 'left') {
            for (let r = 0; r < this.SIZE; r++) {
                const result = mergeWithTracking(oldGrid[r], false);
                this.grid[r] = result.merged;
                result.movements.forEach(mov => {
                    if (mov.fromIndex !== mov.toIndex) {
                        this.tileMovements.push({
                            fromR: r,
                            fromC: mov.fromIndex,
                            toR: r,
                            toC: mov.toIndex,
                            merged: mov.merged
                        });
                    }
                });
            }
        } else if (direction === 'right') {
            for (let r = 0; r < this.SIZE; r++) {
                const reversed = [...oldGrid[r]].reverse();
                const result = mergeWithTracking(reversed, true);
                this.grid[r] = result.merged.reverse();
                result.movements.forEach(mov => {
                    const fromC = this.SIZE - 1 - mov.fromIndex;
                    const toC = this.SIZE - 1 - mov.toIndex;
                    if (fromC !== toC) {
                        this.tileMovements.push({
                            fromR: r,
                            fromC: fromC,
                            toR: r,
                            toC: toC,
                            merged: mov.merged
                        });
                    }
                });
            }
        } else if (direction === 'up') {
            for (let c = 0; c < this.SIZE; c++) {
                const column = [];
                for (let r = 0; r < this.SIZE; r++) {
                    column.push(oldGrid[r][c]);
                }
                const result = mergeWithTracking(column, false);
                for (let r = 0; r < this.SIZE; r++) {
                    this.grid[r][c] = result.merged[r];
                }
                result.movements.forEach(mov => {
                    if (mov.fromIndex !== mov.toIndex) {
                        this.tileMovements.push({
                            fromR: mov.fromIndex,
                            fromC: c,
                            toR: mov.toIndex,
                            toC: c,
                            merged: mov.merged
                        });
                    }
                });
            }
        } else if (direction === 'down') {
            for (let c = 0; c < this.SIZE; c++) {
                const column = [];
                for (let r = 0; r < this.SIZE; r++) {
                    column.push(oldGrid[r][c]);
                }
                const reversed = [...column].reverse();
                const result = mergeWithTracking(reversed, true);
                const finalColumn = result.merged.reverse();
                for (let r = 0; r < this.SIZE; r++) {
                    this.grid[r][c] = finalColumn[r];
                }
                result.movements.forEach(mov => {
                    const fromR = this.SIZE - 1 - mov.fromIndex;
                    const toR = this.SIZE - 1 - mov.toIndex;
                    if (fromR !== toR) {
                        this.tileMovements.push({
                            fromR: fromR,
                            fromC: c,
                            toR: toR,
                            toC: c,
                            merged: mov.merged
                        });
                    }
                });
            }
        }
        
        // Check if moved
        for (let r = 0; r < this.SIZE; r++) {
            for (let c = 0; c < this.SIZE; c++) {
                if (this.grid[r][c] !== oldGrid[r][c]) {
                    moved = true;
                    break;
                }
            }
            if (moved) break;
        }
        
        if (!moved) {
            this.grid = oldGrid;
            this.tileMovements = [];
        }
        
        return moved;
    },
    
    merge(row) {
        const merged = [];
        for (let i = 0; i < row.length; i++) {
            if (i < row.length - 1 && row[i] === row[i + 1]) {
                const value = row[i] * 2;
                merged.push(value);
                this.score += value;
                i++; // Skip next element
            } else {
                merged.push(row[i]);
            }
        }
        return merged;
    },
    
    animateMove(callback) {
        if (!this.oldGridState || this.tileMovements.length === 0) {
            this.updateDisplay();
            if (callback) callback();
            return;
        }
        
        // Update display first - create tiles at final positions
        this.updateDisplay();
        
        // Animate after DOM update
        requestAnimationFrame(() => {
            const tiles = this.gridElement.querySelectorAll('.tile');
            const tileSize = 110; // Size including padding
            const gap = 10; // Gap between tiles
            const cellSize = tileSize + gap;
            const speed = 1200; // pixels per second - constant speed for all tiles (faster animation)
            
            // Create a map of final positions to tiles
            const tileMap = new Map();
            tiles.forEach((tile, index) => {
                const r = Math.floor(index / this.SIZE);
                const c = index % this.SIZE;
                tileMap.set(`${r}-${c}`, tile);
            });
            
            let hasAnimations = false;
            let maxDuration = 0;
            const animations = [];
            
            // First pass: calculate all movements and find max duration
            this.tileMovements.forEach(move => {
                const tileKey = `${move.toR}-${move.toC}`;
                const tile = tileMap.get(tileKey);
                
                if (!tile) return;
                
                // Calculate delta based on direction - ensure straight line (horizontal OR vertical only)
                let deltaX = 0;
                let deltaY = 0;
                let distance = 0;
                
                if (this.lastMoveDirection === 'left' || this.lastMoveDirection === 'right') {
                    // Horizontal movement only - no vertical component
                    deltaX = (move.fromC - move.toC) * cellSize;
                    deltaY = 0;
                    distance = Math.abs(deltaX);
                } else if (this.lastMoveDirection === 'up' || this.lastMoveDirection === 'down') {
                    // Vertical movement only - no horizontal component
                    deltaX = 0;
                    deltaY = (move.fromR - move.toR) * cellSize;
                    distance = Math.abs(deltaY);
                }
                
                if (distance > 0) {
                    hasAnimations = true;
                    // Calculate duration based on distance for constant speed
                    const duration = distance / speed;
                    maxDuration = Math.max(maxDuration, duration);
                    
                    animations.push({
                        tile,
                        deltaX,
                        deltaY,
                        duration,
                        merged: move.merged
                    });
                }
            });
            
            // Second pass: apply animations - each tile uses its calculated duration for constant speed
            animations.forEach(anim => {
                // Set initial position (tile starts offset by the movement distance)
                anim.tile.style.transform = `translate(${anim.deltaX}px, ${anim.deltaY}px)`;
                anim.tile.style.transition = 'none';
                anim.tile.classList.add('sliding');
                
                // Force reflow
                anim.tile.offsetHeight;
                
                // Animate to final position - use calculated duration for constant speed
                // Linear timing ensures constant speed (no acceleration/deceleration)
                // Duration is distance-based, so all tiles move at the same pixels/second
                requestAnimationFrame(() => {
                    anim.tile.style.transition = `transform ${anim.duration}s linear`;
                    anim.tile.style.transform = 'translate(0, 0)';
                });
            });
            
            // Mark new tiles (that appeared without moving)
            const newTilePositions = new Set();
            this.tileMovements.forEach(move => {
                newTilePositions.add(`${move.toR}-${move.toC}`);
            });
            
            // Find tiles that are new (not in movements and not in old grid)
            for (let r = 0; r < this.SIZE; r++) {
                for (let c = 0; c < this.SIZE; c++) {
                    if (this.grid[r][c] !== 0 && this.oldGridState[r][c] === 0) {
                        const tileKey = `${r}-${c}`;
                        if (!newTilePositions.has(tileKey)) {
                            const tile = tileMap.get(tileKey);
                            if (tile) {
                                tile.classList.add('tile-new');
                            }
                        }
                    }
                }
            }
            
            // Cleanup after animation - use max duration
            const delay = hasAnimations ? (maxDuration * 1000) + 50 : 100;
            setTimeout(() => {
                tiles.forEach(tile => {
                    tile.style.transform = '';
                    tile.style.transition = '';
                    tile.classList.remove('sliding', 'tile-new');
                });
                if (callback) callback();
            }, delay);
        });
    },
    
    
    checkGameState() {
        // Check for win (2048 tile)
        if (!this.won) {
            for (let r = 0; r < this.SIZE; r++) {
                for (let c = 0; c < this.SIZE; c++) {
                    if (this.grid[r][c] === 2048) {
                        this.won = true;
                        document.getElementById('win-message').classList.remove('hidden');
                    }
                }
            }
        }
        
        // Check for game over (no moves available)
        if (!this.canMove()) {
            this.gameOver = true;
            this.gameStarted = false;
            document.getElementById('final-score').textContent = this.score;
            
            // Check if this is a high score
            let isHighScore = false;
            const oldBestScore = this.highScores.length > 0 ? 
                (typeof this.highScores[0] === 'number' ? this.highScores[0] : (this.highScores[0].score || 0)) : 0;
            
            // Save high score
            if (typeof ArcadeStorage !== 'undefined') {
                ArcadeStorage.saveHighScore(ArcadeStorage.GAMES.GAME2048, this.score);
                this.highScores = ArcadeStorage.getAllScoresForGame(ArcadeStorage.GAMES.GAME2048);
                const newBestScore = this.highScores.length > 0 ? 
                    (typeof this.highScores[0] === 'number' ? this.highScores[0] : (this.highScores[0].score || 0)) : 0;
                this.highScore = newBestScore;
                // Ensure high score is displayed as a number, not object
                const highScoreDisplay = typeof this.highScore === 'object' ? (this.highScore.score || 0) : this.highScore;
                document.getElementById('high-score').textContent = highScoreDisplay;
                
                // Check if this is a new high score
                if (this.score > oldBestScore) {
                    isHighScore = true;
                }
            }
            
            // Hide pause menu and show game over
            const pauseMenu = document.getElementById('pause-menu');
            const gameOverEl = document.getElementById('game-over');
            if (pauseMenu) {
                pauseMenu.classList.add('hidden');
            }
            if (gameOverEl) {
                gameOverEl.classList.remove('hidden');
            }
            
            // Show leaderboard submit section if high score and leaderboard available
            const submitSection = document.getElementById('leaderboard-submit-section');
            const submitStatus = document.getElementById('submit-status');
            
            if (isHighScore && typeof Leaderboard !== 'undefined' && Leaderboard.isAvailable()) {
                if (typeof UsernameManager !== 'undefined' && !UsernameManager.hasUsernameSet()) {
                    // Show username prompt modal
                    UsernameManager.showUsernameModal((username) => {
                        // After username is set, automatically submit score
                        this.submitScoreToLeaderboard();
                    });
                } else {
                    // Username is set, show submit section
                    if (submitSection) {
                        submitSection.classList.remove('hidden');
                    }
                    if (submitStatus) {
                        submitStatus.textContent = 'Click to submit your score to the global leaderboard!';
                        submitStatus.style.color = '#4ecdc4';
                    }
                }
            } else {
                // Not a high score or leaderboard not available, hide submit section
                if (submitSection) {
                    submitSection.classList.add('hidden');
                }
            }
        }
        
        // Update score display
        document.getElementById('score').textContent = this.score;
        const currentHighScore = typeof this.highScore === 'object' ? (this.highScore.score || 0) : this.highScore;
        if (this.score > currentHighScore) {
            this.highScore = this.score;
            document.getElementById('high-score').textContent = this.highScore;
        }
    },
    
    canMove() {
        // Check for empty cells
        for (let r = 0; r < this.SIZE; r++) {
            for (let c = 0; c < this.SIZE; c++) {
                if (this.grid[r][c] === 0) return true;
            }
        }
        
        // Check for possible merges
        for (let r = 0; r < this.SIZE; r++) {
            for (let c = 0; c < this.SIZE; c++) {
                const current = this.grid[r][c];
                if ((r < this.SIZE - 1 && this.grid[r + 1][c] === current) ||
                    (c < this.SIZE - 1 && this.grid[r][c + 1] === current)) {
                    return true;
                }
            }
        }
        
        return false;
    },
    
    updateDisplay() {
        this.gridElement.innerHTML = '';
        
        for (let r = 0; r < this.SIZE; r++) {
            for (let c = 0; c < this.SIZE; c++) {
                const tile = document.createElement('div');
                const value = this.grid[r][c];
                tile.className = `tile ${value ? `tile-${value}` : ''}`;
                tile.textContent = value || '';
                this.gridElement.appendChild(tile);
            }
        }
    }
};

// Initialize when page loads
window.addEventListener('load', () => Game2048.init());
