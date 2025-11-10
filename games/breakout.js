// Breakout Game
const BreakoutGame = {
    canvas: null,
    ctx: null,
    paddle: { x: 0, y: 0, width: 100, height: 10, speed: 5 },
    ball: { x: 0, y: 0, radius: 8, dx: 0, dy: 0, speed: 4 },
    bricks: [],
    score: 0,
    highScore: 0,
    lives: 3,
    gameRunning: false,
    gameStarted: false,
    animationId: null,
    rows: 5,
    cols: 10,
    brickWidth: 55,
    brickHeight: 20,
    brickPadding: 5,
    brickOffsetTop: 60,
    brickOffsetLeft: 35,
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Load high score
        if (typeof ArcadeStorage !== 'undefined') {
            this.highScore = ArcadeStorage.getBestScore(ArcadeStorage.GAMES.BREAKOUT);
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
        this.lives = 3;
        this.gameRunning = false;
        this.gameStarted = false;
        
        // Reset paddle
        this.paddle.x = (this.canvas.width - this.paddle.width) / 2;
        this.paddle.y = this.canvas.height - this.paddle.height - 10;
        
        // Reset ball
        this.ball.x = this.paddle.x + this.paddle.width / 2;
        this.ball.y = this.paddle.y - this.ball.radius - 5;
        this.ball.dx = 0;
        this.ball.dy = 0;
        
        // Create bricks
        this.createBricks();
        
        // Update UI
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('start-prompt').classList.remove('hidden');
    },
    
    createBricks() {
        this.bricks = [];
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7b8', '#ffe66d', '#95e1d3'];
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.bricks.push({
                    x: c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft,
                    y: r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop,
                    width: this.brickWidth,
                    height: this.brickHeight,
                    color: colors[r % colors.length],
                    visible: true
                });
            }
        }
    },
    
    setupControls() {
        let mouseX = 0;
        let keys = { left: false, right: false };
        
        // Mouse controls
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            if (this.gameRunning) {
                this.paddle.x = mouseX - this.paddle.width / 2;
                this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.paddle.x));
            }
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
            if (e.key === ' ' && !this.gameStarted) {
                this.startGame();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
        });
        
        // Touch controls
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            mouseX = touch.clientX - rect.left;
            if (this.gameRunning) {
                this.paddle.x = mouseX - this.paddle.width / 2;
                this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.paddle.x));
            }
        });
        
        this.canvas.addEventListener('click', () => {
            if (!this.gameStarted) {
                this.startGame();
            }
        });
        
        // Update paddle position based on keys
        setInterval(() => {
            if (this.gameRunning) {
                if (keys.left) {
                    this.paddle.x = Math.max(0, this.paddle.x - this.paddle.speed);
                }
                if (keys.right) {
                    this.paddle.x = Math.min(this.canvas.width - this.paddle.width, this.paddle.x + this.paddle.speed);
                }
            }
        }, 16);
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
        
        // Launch ball
        const angle = (Math.random() * Math.PI / 3) + Math.PI / 3; // 60-120 degrees
        this.ball.dx = Math.cos(angle) * this.ball.speed;
        this.ball.dy = -Math.sin(angle) * this.ball.speed;
    },
    
    update() {
        if (!this.gameRunning || !this.gameStarted) return;
        
        // Update ball position
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball-wall collision
        if (this.ball.x - this.ball.radius < 0 || this.ball.x + this.ball.radius > this.canvas.width) {
            this.ball.dx = -this.ball.dx;
            this.ball.x = Math.max(this.ball.radius, Math.min(this.canvas.width - this.ball.radius, this.ball.x));
        }
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.dy = -this.ball.dy;
            this.ball.y = this.ball.radius;
        }
        
        // Ball-paddle collision
        if (this.ball.y + this.ball.radius > this.paddle.y &&
            this.ball.y - this.ball.radius < this.paddle.y + this.paddle.height &&
            this.ball.x + this.ball.radius > this.paddle.x &&
            this.ball.x - this.ball.radius < this.paddle.x + this.paddle.width) {
            
            // Calculate hit position on paddle (-1 to 1)
            const hitPos = (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
            const angle = hitPos * Math.PI / 3; // Max 60 degrees
            const speed = Math.sqrt(this.ball.dx * this.ball.dx + this.ball.dy * this.ball.dy);
            this.ball.dx = Math.sin(angle) * speed;
            this.ball.dy = -Math.cos(angle) * speed;
            this.ball.y = this.paddle.y - this.ball.radius;
        }
        
        // Ball-brick collision
        for (let brick of this.bricks) {
            if (!brick.visible) continue;
            
            if (this.ball.x + this.ball.radius > brick.x &&
                this.ball.x - this.ball.radius < brick.x + brick.width &&
                this.ball.y + this.ball.radius > brick.y &&
                this.ball.y - this.ball.radius < brick.y + brick.height) {
                
                brick.visible = false;
                this.score += 10;
                document.getElementById('score').textContent = this.score;
                
                // Determine which side was hit
                const ballCenterX = this.ball.x;
                const ballCenterY = this.ball.y;
                const brickCenterX = brick.x + brick.width / 2;
                const brickCenterY = brick.y + brick.height / 2;
                
                const dx = ballCenterX - brickCenterX;
                const dy = ballCenterY - brickCenterY;
                
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.ball.dx = -this.ball.dx;
                } else {
                    this.ball.dy = -this.ball.dy;
                }
                
                // Check if all bricks are destroyed
                if (this.bricks.every(b => !b.visible)) {
                    this.nextLevel();
                }
            }
        }
        
        // Ball out of bounds (bottom)
        if (this.ball.y > this.canvas.height) {
            this.lives--;
            document.getElementById('lives').textContent = this.lives;
            
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                // Reset ball
                this.ball.x = this.paddle.x + this.paddle.width / 2;
                this.ball.y = this.paddle.y - this.ball.radius - 5;
                this.ball.dx = 0;
                this.ball.dy = 0;
                this.gameRunning = false;
                this.gameStarted = false;
                document.getElementById('start-prompt').classList.remove('hidden');
                document.getElementById('start-prompt').textContent = 'Click or press SPACE to continue';
            }
        }
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            document.getElementById('high-score').textContent = this.highScore;
        }
    },
    
    nextLevel() {
        // Increase ball speed
        this.ball.speed += 0.5;
        const currentSpeed = Math.sqrt(this.ball.dx * this.ball.dx + this.ball.dy * this.ball.dy);
        const ratio = this.ball.speed / currentSpeed;
        this.ball.dx *= ratio;
        this.ball.dy *= ratio;
        
        // Add extra life
        this.lives++;
        document.getElementById('lives').textContent = this.lives;
        
        // Create new bricks
        this.createBricks();
        
        // Reset ball
        this.ball.x = this.paddle.x + this.paddle.width / 2;
        this.ball.y = this.paddle.y - this.ball.radius - 5;
        this.ball.dx = 0;
        this.ball.dy = 0;
        this.gameRunning = false;
        this.gameStarted = false;
        document.getElementById('start-prompt').classList.remove('hidden');
        document.getElementById('start-prompt').textContent = 'Level Complete! Click or press SPACE to continue';
    },
    
    gameOver() {
        this.gameRunning = false;
        this.gameStarted = false;
        
        // Save high score
        if (typeof ArcadeStorage !== 'undefined') {
            ArcadeStorage.saveHighScore(ArcadeStorage.GAMES.BREAKOUT, this.score);
        }
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').classList.remove('hidden');
    },
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw bricks
        this.bricks.forEach(brick => {
            if (brick.visible) {
                this.ctx.fillStyle = brick.color;
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
        
        // Draw paddle
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        
        // Draw ball
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
    },
    
    gameLoop() {
        this.update();
        this.render();
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
};

// Initialize when page loads
window.addEventListener('load', () => BreakoutGame.init());

