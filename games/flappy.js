// Flappy Bird Game
const FlappyGame = {
    canvas: null,
    ctx: null,
    bird: { x: 100, y: 250, width: 30, height: 30, velocity: 0, gravity: 0.5, jumpStrength: -11 }, // Faster jump
    pipes: [],
    score: 0,
    highScore: 0,
    gameRunning: false,
    gameStarted: false,
    animationId: null,
    pipeWidth: 45, // Thinner pipes (was 60)
    pipeGap: 180, // Bigger gap (was 150)
    pipeSpeed: 2.5, // Start slower for easier beginning
    basePipeSpeed: 2.5,
    pipeSpawnRate: 120,
    frameCount: 0,
    speedIncreaseRate: 0.003, // Speed increases faster over time to compensate for easier start
    
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
        this.pipeSpeed = this.basePipeSpeed; // Reset speed
        
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
        
        // Gradually increase speed
        this.pipeSpeed = this.basePipeSpeed + (this.frameCount * this.speedIncreaseRate);
        
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
        
        // Spawn pipes (slightly faster spawn rate as speed increases)
        const currentSpawnRate = Math.max(80, this.pipeSpawnRate - Math.floor(this.pipeSpeed * 2));
        if (this.frameCount % currentSpawnRate === 0) {
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
        // Clear canvas with sky gradient (more vibrant)
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#4A90E2');
        gradient.addColorStop(0.5, '#87CEEB');
        gradient.addColorStop(1, '#B0E0E6');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw clouds (simple)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = 0; i < 3; i++) {
            const cloudX = (this.frameCount * 0.2 + i * 200) % (this.canvas.width + 100) - 50;
            const cloudY = 50 + i * 80;
            this.ctx.beginPath();
            this.ctx.arc(cloudX, cloudY, 20, 0, Math.PI * 2);
            this.ctx.arc(cloudX + 25, cloudY, 25, 0, Math.PI * 2);
            this.ctx.arc(cloudX + 50, cloudY, 20, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw pipes with better visuals
        this.pipes.forEach(pipe => {
            // Pipe gradient
            const pipeGradient = this.ctx.createLinearGradient(pipe.x, 0, pipe.x + this.pipeWidth, 0);
            pipeGradient.addColorStop(0, '#228B22');
            pipeGradient.addColorStop(0.5, '#32CD32');
            pipeGradient.addColorStop(1, '#228B22');
            
            // Top pipe
            this.ctx.fillStyle = pipeGradient;
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            this.ctx.strokeStyle = '#1a5f1a';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            
            // Top pipe cap
            this.ctx.fillStyle = '#32CD32';
            this.ctx.fillRect(pipe.x - 5, pipe.topHeight - 25, this.pipeWidth + 10, 25);
            this.ctx.strokeStyle = '#1a5f1a';
            this.ctx.strokeRect(pipe.x - 5, pipe.topHeight - 25, this.pipeWidth + 10, 25);
            
            // Bottom pipe
            this.ctx.fillStyle = pipeGradient;
            this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY);
            this.ctx.strokeStyle = '#1a5f1a';
            this.ctx.strokeRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY);
            
            // Bottom pipe cap
            this.ctx.fillStyle = '#32CD32';
            this.ctx.fillRect(pipe.x - 5, pipe.bottomY, this.pipeWidth + 10, 25);
            this.ctx.strokeStyle = '#1a5f1a';
            this.ctx.strokeRect(pipe.x - 5, pipe.bottomY, this.pipeWidth + 10, 25);
        });
        
        // Draw ground with texture
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.canvas.height - 25, this.canvas.width, 25);
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, this.canvas.height - 25, this.canvas.width, 8);
        // Grass texture
        this.ctx.strokeStyle = '#7CB342';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 5) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, this.canvas.height - 25);
            this.ctx.lineTo(i + 2, this.canvas.height - 30);
            this.ctx.stroke();
        }
        
        // Draw bird with better visuals
        const birdX = this.bird.x + this.bird.width / 2;
        const birdY = this.bird.y + this.bird.height / 2;
        const rotation = Math.min(Math.max(this.bird.velocity * 0.15, -0.5), 0.5);
        
        this.ctx.save();
        this.ctx.translate(birdX, birdY);
        this.ctx.rotate(rotation);
        
        // Bird body gradient
        const birdGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.bird.width / 2);
        birdGradient.addColorStop(0, '#FFD700');
        birdGradient.addColorStop(0.7, '#FFA500');
        birdGradient.addColorStop(1, '#FF8C00');
        
        // Bird body
        this.ctx.fillStyle = birdGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, this.bird.width / 2, this.bird.height / 2, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Bird outline
        this.ctx.strokeStyle = '#FF8C00';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Bird wing
        this.ctx.fillStyle = '#FFA500';
        this.ctx.beginPath();
        this.ctx.ellipse(-5, 0, 8, 12, -0.3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
        
        // Bird eye (after rotation)
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(birdX + 5, birdY - 8, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#FFF';
        this.ctx.beginPath();
        this.ctx.arc(birdX + 6, birdY - 9, 1, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Bird beak
        this.ctx.fillStyle = '#FF8C00';
        this.ctx.beginPath();
        this.ctx.moveTo(birdX + this.bird.width / 2 - 3, birdY);
        this.ctx.lineTo(birdX + this.bird.width / 2 + 5, birdY - 2);
        this.ctx.lineTo(birdX + this.bird.width / 2 + 5, birdY + 2);
        this.ctx.closePath();
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

