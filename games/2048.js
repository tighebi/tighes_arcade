// 2048 Game
const Game2048 = {
    grid: [],
    score: 0,
    highScore: 0,
    gameOver: false,
    won: false,
    gridElement: null,
    SIZE: 4,
    
    init() {
        this.gridElement = document.getElementById('grid');
        
        // Load high score
        if (typeof ArcadeStorage !== 'undefined') {
            this.highScore = ArcadeStorage.getBestScore(ArcadeStorage.GAMES.GAME2048);
            document.getElementById('high-score').textContent = this.highScore;
        }
        
        // Setup controls
        this.setupControls();
        this.setupMenu();
        
        // Initialize game
        this.resetGame();
    },
    
    resetGame() {
        this.grid = Array(this.SIZE).fill().map(() => Array(this.SIZE).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        
        // Add two random tiles
        this.addRandomTile();
        this.addRandomTile();
        
        // Update UI
        this.updateDisplay();
        document.getElementById('score').textContent = this.score;
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('win-message').classList.add('hidden');
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
            
            let moved = false;
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    moved = this.move('up');
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    moved = this.move('down');
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    moved = this.move('left');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    moved = this.move('right');
                    break;
            }
            
            if (moved) {
                e.preventDefault();
                this.addRandomTile();
                this.updateDisplay();
                this.checkGameState();
            }
        });
        
        // Touch controls (swipe)
        this.gridElement.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        this.gridElement.addEventListener('touchend', (e) => {
            if (this.gameOver && !this.won) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipe = 30;
            
            let moved = false;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipe) {
                    moved = this.move(deltaX > 0 ? 'right' : 'left');
                }
            } else {
                if (Math.abs(deltaY) > minSwipe) {
                    moved = this.move(deltaY > 0 ? 'down' : 'up');
                }
            }
            
            if (moved) {
                this.addRandomTile();
                this.updateDisplay();
                this.checkGameState();
            }
        }, { passive: true });
    },
    
    setupMenu() {
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.won = false;
            document.getElementById('win-message').classList.add('hidden');
        });
        
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.resetGame();
        });
    },
    
    move(direction) {
        const previousGrid = this.grid.map(row => [...row]);
        let moved = false;
        
        if (direction === 'left') {
            for (let r = 0; r < this.SIZE; r++) {
                const row = this.grid[r].filter(val => val !== 0);
                const merged = this.merge(row);
                while (merged.length < this.SIZE) merged.push(0);
                this.grid[r] = merged;
            }
        } else if (direction === 'right') {
            for (let r = 0; r < this.SIZE; r++) {
                const row = this.grid[r].filter(val => val !== 0);
                const merged = this.merge(row.reverse()).reverse();
                while (merged.length < this.SIZE) merged.unshift(0);
                this.grid[r] = merged;
            }
        } else if (direction === 'up') {
            for (let c = 0; c < this.SIZE; c++) {
                const column = [];
                for (let r = 0; r < this.SIZE; r++) {
                    if (this.grid[r][c] !== 0) column.push(this.grid[r][c]);
                }
                const merged = this.merge(column);
                while (merged.length < this.SIZE) merged.push(0);
                for (let r = 0; r < this.SIZE; r++) {
                    this.grid[r][c] = merged[r];
                }
            }
        } else if (direction === 'down') {
            for (let c = 0; c < this.SIZE; c++) {
                const column = [];
                for (let r = 0; r < this.SIZE; r++) {
                    if (this.grid[r][c] !== 0) column.push(this.grid[r][c]);
                }
                const merged = this.merge(column.reverse()).reverse();
                while (merged.length < this.SIZE) merged.unshift(0);
                for (let r = 0; r < this.SIZE; r++) {
                    this.grid[r][c] = merged[r];
                }
            }
        }
        
        // Check if grid changed
        for (let r = 0; r < this.SIZE; r++) {
            for (let c = 0; c < this.SIZE; c++) {
                if (this.grid[r][c] !== previousGrid[r][c]) {
                    moved = true;
                    break;
                }
            }
            if (moved) break;
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
            document.getElementById('final-score').textContent = this.score;
            
            // Save high score
            if (typeof ArcadeStorage !== 'undefined') {
                ArcadeStorage.saveHighScore(ArcadeStorage.GAMES.GAME2048, this.score);
                this.highScore = ArcadeStorage.getBestScore(ArcadeStorage.GAMES.GAME2048);
                document.getElementById('high-score').textContent = this.highScore;
            }
            
            document.getElementById('game-over').classList.remove('hidden');
        }
        
        // Update score display
        document.getElementById('score').textContent = this.score;
        if (this.score > this.highScore) {
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

