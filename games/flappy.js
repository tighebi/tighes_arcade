// Flappy Bird Game
const FlappyGame = {
    canvas: null,
    ctx: null,
    bird: { x: 100, y: 250, width: 30, height: 30, velocity: 0, gravity: 0.5, jumpStrength: -8 },
    pipes: [],
    score: 0,
    highScore: 0,
    gameRunning: false,
    gameStarted: false,
    animationId: null,
    pipeWidth: 60,
    pipeGap: 150,
    pipeSpeed: 2,
    pipeSpawnRate: 120,
    frameCount: 0,
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Load high score
        if (typeof ArcadeStorage !== 'undefined') {
            this.highScore = ArcadeStorage.getBestScore(ArcadeStorage.GAMES.FLAPPY);
            document.getElementById('high-score').textContent = this.highScore;
        }
        
        // Setup event listeners
        this.setupControls();
        this.setupMenu();
        
        // Initialize game
        this.resetGame();
        
        // Start game loop
        this.gameLoop();
    },
    
    resetGame() {
        this.score = 0;
        this.gameRunning = false;
        this.gameStarted = false;
        this.frameCount = 0;
        this.pipes = [];
        
        // Reset bird
        this.bird.y = this.canvas.height / 2;
        this.bird.velocity = 0;
        
        // Update UI
        document.getElementById('score').textContent = this.score;
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('start-prompt').classList.remove('hidden');
    },
    
    setupControls() {
        const flap = () => {
            if (!this.gameStarted) {
                this.startGame();
            } else if (this.gameRunning) {
                this.bird.velocity = this.bird.jumpStrength;
            }
        };
        
        // Click/tap
        this.canvas.addEventListener('click', flap);
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                flap();
            }
        });
        
        // Touch
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            flap();
        });
    },
    
    setupMenu() {
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    },
    
    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.gameRunning = true;
        document.getElementById('start-prompt').classList.add('hidden');
        this.bird.velocity = this.bird.jumpStrength;
    },
    
    update() {
        if (!this.gameRunning || !this.gameStarted) return;
        
        this.frameCount++;
        
        // Update bird
        this.bird.velocity += this.bird.gravity;
        this.bird.y += this.bird.velocity;
        
        // Bird boundaries
        if (this.bird.y < 0) {
            this.bird.y = 0;
            this.bird.velocity = 0;
        }
        if (this.bird.y + this.bird.height > this.canvas.height) {
            this.gameOver();
            return;
        }
        
        // Spawn pipes
        if (this.frameCount % this.pipeSpawnRate === 0) {
            this.spawnPipe();
        }
        
        // Update pipes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= this.pipeSpeed;
            
            // Remove off-screen pipes
            if (pipe.x + this.pipeWidth < 0) {
                this.pipes.splice(i, 1);
                continue;
            }
            
            // Check collision
            if (this.checkCollision(pipe)) {
                this.gameOver();
                return;
            }
            
            // Score point when bird passes pipe
            if (!pipe.passed && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.passed = true;
                this.score++;
                document.getElementById('score').textContent = this.score;
                
                // Update high score
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    document.getElementById('high-score').textContent = this.highScore;
                }
            }
        }
    },
    
    spawnPipe() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - this.pipeGap - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        this.pipes.push({
            x: this.canvas.width,
            topHeight: topHeight,
            bottomY: topHeight + this.pipeGap,
            passed: false
        });
    },
    
    checkCollision(pipe) {
        const birdLeft = this.bird.x;
        const birdRight = this.bird.x + this.bird.width;
        const birdTop = this.bird.y;
        const birdBottom = this.bird.y + this.bird.height;
        
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + this.pipeWidth;
        
        // Check if bird is within pipe's x range
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
            // Check if bird hits top or bottom pipe
            if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
                return true;
            }
        }
        
        return false;
    },
    
    gameOver() {
        this.gameRunning = false;
        this.gameStarted = false;
        
        // Save high score
        if (typeof ArcadeStorage !== 'undefined') {
            ArcadeStorage.saveHighScore(ArcadeStorage.GAMES.FLAPPY, this.score);
        }
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').classList.remove('hidden');
    },
    
    render() {
        // Clear canvas with sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 5);
        
        // Draw pipes
        this.ctx.fillStyle = '#228B22';
        this.pipes.forEach(pipe => {
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            this.ctx.strokeRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            
            // Bottom pipe
            this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY);
            this.ctx.strokeRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY);
            
            // Pipe caps
            this.ctx.fillStyle = '#32CD32';
            this.ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, this.pipeWidth + 10, 20);
            this.ctx.fillRect(pipe.x - 5, pipe.bottomY, this.pipeWidth + 10, 20);
            this.ctx.fillStyle = '#228B22';
        });
        
        // Draw bird
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.ellipse(
            this.bird.x + this.bird.width / 2,
            this.bird.y + this.bird.height / 2,
            this.bird.width / 2,
            this.bird.height / 2,
            this.bird.velocity * 0.1, // Slight rotation based on velocity
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.strokeStyle = '#FFA500';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Bird eye
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x + this.bird.width * 0.7, this.bird.y + this.bird.height * 0.3, 3, 0, Math.PI * 2);
        this.ctx.fill();
    },
    
    gameLoop() {
        this.update();
        this.render();
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
};

// Initialize when page loads
window.addEventListener('load', () => FlappyGame.init());

