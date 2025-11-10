// Breakout Game
const BreakoutGame = {
    canvas: null,
    ctx: null,
    paddle: { x: 0, y: 0, width: 100, height: 10, speed: 5 },
    ball: { x: 0, y: 0, radius: 10, dx: 0, dy: 0, baseSpeed: 4, speed: 4 },
    bricks: [],
    score: 0,
    highScore: 0,
    lives: 3,
    gameRunning: false,
    gameStarted: false,
    animationId: null,
    difficulty: 'medium',
    rows: 5,
    cols: 10,
    brickWidth: 55,
    brickHeight: 20,
    brickPadding: 5,
    brickOffsetTop: 60,
    brickOffsetLeft: 35,
    level: 1,
    speedIncreaseRate: 0.0005, // Speed increases over time
    framesSinceStart: 0,
    
    difficulties: {
        easy: {
            paddleWidth: 120,
            ballSpeed: 3,
            rows: 4,
            cols: 8,
            brickWidth: 65,
            brickHeight: 25
        },
        medium: {
            paddleWidth: 100,
            ballSpeed: 4,
            rows: 5,
            cols: 10,
            brickWidth: 55,
            brickHeight: 20
        },
        hard: {
            paddleWidth: 80,
            ballSpeed: 5,
            rows: 7,
            cols: 12,
            brickWidth: 45,
            brickHeight: 18
        }
    },
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Load high score
        if (typeof ArcadeStorage !== 'undefined') {
            this.highScore = ArcadeStorage.getBestScore(ArcadeStorage.GAMES.BREAKOUT);
            document.getElementById('high-score').textContent = this.highScore;
        }
        
        // Setup difficulty selector
        this.setupDifficulty();
        
        // Setup event listeners
        this.setupControls();
        this.setupMenu();
        
        // Initialize game
        this.resetGame();
        
        // Start game loop
        this.gameLoop();
    },
    
    setupDifficulty() {
        const selector = document.getElementById('difficulty-selector');
        if (!selector) return;
        
        selector.addEventListener('change', (e) => {
            if (!this.gameStarted) {
                this.difficulty = e.target.value;
                this.applyDifficulty();
                this.resetGame();
            }
        });
        
        this.applyDifficulty();
    },
    
    applyDifficulty() {
        const diff = this.difficulties[this.difficulty];
        this.paddle.width = diff.paddleWidth;
        this.ball.baseSpeed = diff.ballSpeed;
        this.ball.speed = diff.ballSpeed;
        this.rows = diff.rows;
        this.cols = diff.cols;
        this.brickWidth = diff.brickWidth;
        this.brickHeight = diff.brickHeight;
        
        // Recalculate brick layout
        const totalBrickWidth = this.cols * this.brickWidth + (this.cols - 1) * this.brickPadding;
        this.brickOffsetLeft = (this.canvas.width - totalBrickWidth) / 2;
    },
    
    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.gameRunning = false;
        this.gameStarted = false;
        this.level = 1;
        this.framesSinceStart = 0;
        
        // Apply difficulty settings
        this.applyDifficulty();
        
        // Reset paddle
        this.paddle.x = (this.canvas.width - this.paddle.width) / 2;
        this.paddle.y = this.canvas.height - this.paddle.height - 10;
        
        // Reset ball
        this.ball.x = this.paddle.x + this.paddle.width / 2;
        this.ball.y = this.paddle.y - this.ball.radius - 5;
        this.ball.dx = 0;
        this.ball.dy = 0;
        this.ball.speed = this.ball.baseSpeed;
        
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
        
        // Mouse controls - account for canvas scaling
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            // Calculate actual canvas coordinates accounting for scaling
            const scaleX = this.canvas.width / rect.width;
            mouseX = (e.clientX - rect.left) * scaleX;
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
        
        // Touch controls - properly account for canvas scaling on mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            
            // Calculate actual canvas coordinates accounting for scaling
            const scaleX = this.canvas.width / rect.width;
            
            // Get touch position relative to canvas
            const touchX = (touch.clientX - rect.left) * scaleX;
            
            if (this.gameRunning) {
                // Center paddle on touch position
                this.paddle.x = touchX - this.paddle.width / 2;
                this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.paddle.x));
            }
        });
        
        // Also handle touchstart for immediate response
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            
            const scaleX = this.canvas.width / rect.width;
            const touchX = (touch.clientX - rect.left) * scaleX;
            
            if (this.gameRunning) {
                this.paddle.x = touchX - this.paddle.width / 2;
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
        
        // Launch ball (upward angle, 60-120 degrees)
        const angle = (Math.random() * Math.PI / 3) + Math.PI / 3;
        this.ball.dx = Math.cos(angle) * this.ball.speed;
        this.ball.dy = -Math.abs(Math.sin(angle)) * this.ball.speed; // Always upward
    },
    
    update() {
        if (!this.gameRunning || !this.gameStarted) return;
        
        this.framesSinceStart++;
        
        // Gradually increase ball speed
        const currentSpeed = Math.sqrt(this.ball.dx * this.ball.dx + this.ball.dy * this.ball.dy);
        this.ball.speed = this.ball.baseSpeed + (this.framesSinceStart * this.speedIncreaseRate);
        
        // Normalize ball velocity to maintain speed
        if (currentSpeed > 0) {
            const ratio = this.ball.speed / currentSpeed;
            this.ball.dx *= ratio;
            this.ball.dy *= ratio;
        }
        
        // Update ball position
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball-wall collision (proper bouncing)
        if (this.ball.x - this.ball.radius <= 0) {
            this.ball.dx = Math.abs(this.ball.dx);
            this.ball.x = this.ball.radius;
        } else if (this.ball.x + this.ball.radius >= this.canvas.width) {
            this.ball.dx = -Math.abs(this.ball.dx);
            this.ball.x = this.canvas.width - this.ball.radius;
        }
        
        if (this.ball.y - this.ball.radius <= 0) {
            this.ball.dy = Math.abs(this.ball.dy);
            this.ball.y = this.ball.radius;
        }
        
        // Ball-paddle collision (improved physics)
        const ballBottom = this.ball.y + this.ball.radius;
        const ballTop = this.ball.y - this.ball.radius;
        const paddleTop = this.paddle.y;
        const paddleBottom = this.paddle.y + this.paddle.height;
        const paddleLeft = this.paddle.x;
        const paddleRight = this.paddle.x + this.paddle.width;
        
        if (ballBottom >= paddleTop && ballTop <= paddleBottom &&
            this.ball.x + this.ball.radius >= paddleLeft &&
            this.ball.x - this.ball.radius <= paddleRight) {
            
            // Only bounce if ball is moving downward
            if (this.ball.dy > 0) {
                // Calculate hit position on paddle (-1 to 1)
                const hitPos = (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
                const maxAngle = Math.PI / 3; // 60 degrees max
                const angle = hitPos * maxAngle;
                
                // Set new velocity based on angle
                this.ball.dx = Math.sin(angle) * this.ball.speed;
                this.ball.dy = -Math.abs(Math.cos(angle)) * this.ball.speed;
                
                // Position ball above paddle
                this.ball.y = this.paddle.y - this.ball.radius - 1;
            }
        }
        
        // Ball-brick collision (improved)
        for (let brick of this.bricks) {
            if (!brick.visible) continue;
            
            const ballLeft = this.ball.x - this.ball.radius;
            const ballRight = this.ball.x + this.ball.radius;
            const ballTop = this.ball.y - this.ball.radius;
            const ballBottom = this.ball.y + this.ball.radius;
            
            const brickLeft = brick.x;
            const brickRight = brick.x + brick.width;
            const brickTop = brick.y;
            const brickBottom = brick.y + brick.height;
            
            if (ballRight > brickLeft && ballLeft < brickRight &&
                ballBottom > brickTop && ballTop < brickBottom) {
                
                brick.visible = false;
                this.score += 10;
                document.getElementById('score').textContent = this.score;
                
                // Determine collision side more accurately
                const ballCenterX = this.ball.x;
                const ballCenterY = this.ball.y;
                const brickCenterX = brick.x + brick.width / 2;
                const brickCenterY = brick.y + brick.height / 2;
                
                const dx = ballCenterX - brickCenterX;
                const dy = ballCenterY - brickCenterY;
                
                // Check which side was hit (with tolerance)
                const overlapX = Math.min(ballRight - brickLeft, brickRight - ballLeft);
                const overlapY = Math.min(ballBottom - brickTop, brickBottom - ballTop);
                
                if (overlapX < overlapY) {
                    // Horizontal collision
                    this.ball.dx = -this.ball.dx;
                    // Correct position
                    if (dx > 0) {
                        this.ball.x = brickRight + this.ball.radius;
                    } else {
                        this.ball.x = brickLeft - this.ball.radius;
                    }
                } else {
                    // Vertical collision
                    this.ball.dy = -this.ball.dy;
                    // Correct position
                    if (dy > 0) {
                        this.ball.y = brickBottom + this.ball.radius;
                    } else {
                        this.ball.y = brickTop - this.ball.radius;
                    }
                }
                
                // Check if all bricks are destroyed
                if (this.bricks.every(b => !b.visible)) {
                    this.nextLevel();
                    return;
                }
                
                // Only break one brick per frame
                break;
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
                this.ball.speed = this.ball.baseSpeed;
                this.framesSinceStart = 0;
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
        this.level++;
        this.framesSinceStart = 0; // Reset speed increase counter
        
        // Increase base speed slightly for next level
        this.ball.baseSpeed += 0.3;
        this.ball.speed = this.ball.baseSpeed;
        
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
        document.getElementById('start-prompt').textContent = `Level ${this.level} Complete! Click or press SPACE to continue`;
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
        
        // Draw bricks with better visuals
        this.bricks.forEach(brick => {
            if (brick.visible) {
                // Brick gradient
                const brickGradient = this.ctx.createLinearGradient(
                    brick.x, brick.y,
                    brick.x + brick.width, brick.y + brick.height
                );
                brickGradient.addColorStop(0, brick.color);
                brickGradient.addColorStop(1, this.darkenColor(brick.color, 0.3));
                
                this.ctx.fillStyle = brickGradient;
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                
                // Brick highlight
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.fillRect(brick.x, brick.y, brick.width, 3);
                
                // Brick border
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
        
        // Draw paddle with gradient
        const paddleGradient = this.ctx.createLinearGradient(
            this.paddle.x, this.paddle.y,
            this.paddle.x, this.paddle.y + this.paddle.height
        );
        paddleGradient.addColorStop(0, '#4ecdc4');
        paddleGradient.addColorStop(1, '#2a9d8f');
        
        this.ctx.fillStyle = paddleGradient;
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        this.ctx.strokeStyle = '#1a5f57';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        
        // Draw ball as actual circle with gradient and shine
        const ballGradient = this.ctx.createRadialGradient(
            this.ball.x - 3, this.ball.y - 3, 0,
            this.ball.x, this.ball.y, this.ball.radius
        );
        ballGradient.addColorStop(0, '#ffffff');
        ballGradient.addColorStop(0.7, '#f0f0f0');
        ballGradient.addColorStop(1, '#cccccc');
        
        this.ctx.fillStyle = ballGradient;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ball outline
        this.ctx.strokeStyle = '#999999';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Ball shine highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x - 3, this.ball.y - 3, this.ball.radius * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
    },
    
    darkenColor(color, amount) {
        // Simple color darkening (for brick gradients)
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - (amount * 255));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - (amount * 255));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - (amount * 255));
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    },
    
    gameLoop() {
        this.update();
        this.render();
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
};

// Initialize when page loads
window.addEventListener('load', () => BreakoutGame.init());

