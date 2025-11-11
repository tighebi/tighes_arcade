// Breakout Game
const BreakoutGame = {
    canvas: null,
    ctx: null,
    paddle: { x: 0, y: 0, width: 100, height: 10, speed: 5 },
    ball: { x: 0, y: 0, radius: 10, dx: 0, dy: 0, baseSpeed: 4, speed: 4 },
    bricks: [],
    score: 0,
    highScore: 0,
    highScores: [],
    lives: 3,
    gameRunning: false,
    gameStarted: false,
    gamePaused: false,
    animationId: null,
    difficulty: 'medium',
    theme: 'default',
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
    
    themes: {
        default: {
            bgColor: '#1a1a2e',
            brickColors: ['#ff6b6b', '#4ecdc4', '#45b7b8', '#ffe66d', '#95e1d3'],
            paddleColor: '#4ecdc4',
            paddleColorDark: '#2a9d8f',
            paddleBorder: '#1a5f57',
            ballColor: '#ffffff',
            ballColorDark: '#cccccc'
        },
        neon: {
            bgColor: '#0a0a1a',
            brickColors: ['#ff00ff', '#00ffff', '#ffff00', '#ff0080', '#8000ff'],
            paddleColor: '#00ffff',
            paddleColorDark: '#0080ff',
            paddleBorder: '#004080',
            ballColor: '#ffffff',
            ballColorDark: '#cccccc'
        },
        ocean: {
            bgColor: '#001f3f',
            brickColors: ['#0074d9', '#39cccc', '#7fdbff', '#00a8cc', '#0097e6'],
            paddleColor: '#39cccc',
            paddleColorDark: '#00a8cc',
            paddleBorder: '#006994',
            ballColor: '#ffffff',
            ballColorDark: '#cccccc'
        },
        sunset: {
            bgColor: '#2d1b1b',
            brickColors: ['#ff6b35', '#f7931e', '#ffd23f', '#ff8c42', '#ffa07a'],
            paddleColor: '#ff6b35',
            paddleColorDark: '#d4542a',
            paddleBorder: '#8b3a1f',
            ballColor: '#ffffff',
            ballColorDark: '#cccccc'
        }
    },
    
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Initialize leaderboard
        if (typeof Leaderboard !== 'undefined') {
            Leaderboard.init();
        }
        
        // Load high scores
        if (typeof ArcadeStorage !== 'undefined') {
            this.highScores = ArcadeStorage.getAllScoresForGame(ArcadeStorage.GAMES.BREAKOUT);
            this.highScore = this.highScores.length > 0 ? 
                (typeof this.highScores[0] === 'number' ? this.highScores[0] : this.highScores[0].score) : 0;
            document.getElementById('high-score').textContent = this.highScore;
        }
        
        // Setup difficulty and theme selectors
        this.setupDifficulty();
        this.setupTheme();
        
        // Setup event listeners
        this.setupControls();
        this.setupMenu();
        this.setupPauseMenu();
        this.setupGameOverTabs();
        this.setupLeaderboardSubmission();
        
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
    
    setupTheme() {
        const selector = document.getElementById('theme-selector');
        if (!selector) return;
        
        selector.addEventListener('change', (e) => {
            if (!this.gameStarted) {
                this.theme = e.target.value;
                this.createBricks();
                this.resetGame();
            }
        });
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
                window.location.href = '../index.html';
            });
        }
        
        // Pause on P key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                if (this.gameStarted && this.gameRunning && !this.gamePaused) {
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
                
                if (tab === 'restart') {
                    document.getElementById('restart-tab').classList.add('active');
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
                'breakout'
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
            leaderboardTitle.textContent = 'Global Leaderboard - Breakout';
        }
        
        if (!leaderboardList) return;
        
        if (typeof Leaderboard === 'undefined' || !Leaderboard.isAvailable()) {
            leaderboardList.innerHTML = 
                '<p style="text-align: center; opacity: 0.7;">Leaderboard not available. Please configure Supabase.</p>';
            return;
        }
        
        leaderboardList.innerHTML = '<p style="text-align: center; opacity: 0.7;">Loading leaderboard...</p>';
        
        try {
            const result = await Leaderboard.getLeaderboard('breakout', 3);
            
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
        
        const scores = ArcadeStorage.getAllScoresForGame(ArcadeStorage.GAMES.BREAKOUT);
        
        if (scores.length === 0) {
            highScoresList.innerHTML = '<p style="text-align: center; opacity: 0.7;">No scores yet. Play to set your first record!</p>';
            return;
        }
        
        highScoresList.innerHTML = scores.slice(0, 3).map((scoreEntry, index) => {
            const score = typeof scoreEntry === 'number' ? scoreEntry : scoreEntry.score;
            const username = typeof scoreEntry === 'number' ? 'Player' : (scoreEntry.username || 'Player');
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
        if (!this.gameRunning || this.gamePaused) return;
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
    
    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.gameRunning = false;
        this.gameStarted = false;
        this.gamePaused = false;
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
        document.getElementById('pause-menu').classList.remove('hidden');
        document.getElementById('pause-title').textContent = 'Ready to Play';
        document.getElementById('pause-instructions').textContent = 'Click or press SPACE to start';
    },
    
    createBricks() {
        this.bricks = [];
        const themeColors = this.themes[this.theme].brickColors;
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.bricks.push({
                    x: c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft,
                    y: r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop,
                    width: this.brickWidth,
                    height: this.brickHeight,
                    color: themeColors[r % themeColors.length],
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
        // Start game on any tap/click anywhere in game area
        const startGameOnTap = (e) => {
            if (!this.gameStarted) {
                e.preventDefault();
                this.startGame();
                return;
            }
        };
        
        // Listen for taps/clicks on canvas
        this.canvas.addEventListener('touchstart', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            
            // Start game on first touch if not started
            if (!this.gameStarted) {
                e.preventDefault();
                this.startGame();
                return;
            }
            
            e.preventDefault();
            const scaleX = this.canvas.width / rect.width;
            const touchX = (touch.clientX - rect.left) * scaleX;
            
            if (this.gameRunning) {
                this.paddle.x = touchX - this.paddle.width / 2;
                this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.paddle.x));
            }
        });
        
        this.canvas.addEventListener('click', startGameOnTap);
        
        // Listen for taps/clicks on game container (entire game area)
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.addEventListener('touchstart', (e) => {
                if (!this.gameStarted) {
                    e.preventDefault();
                    this.startGame();
                }
            });
            gameContainer.addEventListener('click', startGameOnTap);
        }
        
        // Also listen on start prompt specifically
        const startPrompt = document.getElementById('start-prompt');
        if (startPrompt) {
            startPrompt.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (!this.gameStarted) {
                    this.startGame();
                }
            });
            startPrompt.addEventListener('click', startGameOnTap);
        }
        
        // Listen on game controls area too
        const gameControls = document.querySelector('.game-controls');
        if (gameControls) {
            gameControls.addEventListener('touchstart', (e) => {
                if (!this.gameStarted) {
                    e.preventDefault();
                    this.startGame();
                }
            });
            gameControls.addEventListener('click', startGameOnTap);
        }
        
        // Update paddle position based on keys
        setInterval(() => {
            if (this.gameRunning && !this.gamePaused) {
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
        const playAgainBtn = document.getElementById('play-again-btn');
        const menuFromGameOverBtn = document.getElementById('menu-from-gameover-btn');
        
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.resetGame();
            });
        }
        
        if (menuFromGameOverBtn) {
            menuFromGameOverBtn.addEventListener('click', () => {
                window.location.href = '../index.html';
            });
        }
    },
    
    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.gameRunning = true;
        this.gamePaused = false;
        document.getElementById('pause-menu').classList.add('hidden');
        
        // Launch ball (upward angle, 60-120 degrees)
        const angle = (Math.random() * Math.PI / 3) + Math.PI / 3;
        this.ball.dx = Math.cos(angle) * this.ball.speed;
        this.ball.dy = -Math.abs(Math.sin(angle)) * this.ball.speed; // Always upward
    },
    
    update() {
        if (!this.gameRunning || !this.gameStarted || this.gamePaused) return;
        
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
                this.gamePaused = false;
                document.getElementById('pause-menu').classList.remove('hidden');
                document.getElementById('pause-title').textContent = 'Continue';
                document.getElementById('pause-instructions').textContent = 'Click or press SPACE to continue';
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
        this.gamePaused = false;
        document.getElementById('pause-menu').classList.remove('hidden');
        document.getElementById('pause-title').textContent = `Level ${this.level} Complete!`;
        document.getElementById('pause-instructions').textContent = 'Click or press SPACE to continue';
    },
    
    gameOver() {
        this.gameRunning = false;
        this.gameStarted = false;
        this.gamePaused = false;
        
        // Check if this is a high score
        let isHighScore = false;
        const oldBestScore = this.highScores.length > 0 ? 
            (typeof this.highScores[0] === 'number' ? this.highScores[0] : this.highScores[0].score) : 0;
        
        // Save high score
        if (typeof ArcadeStorage !== 'undefined') {
            ArcadeStorage.saveHighScore(ArcadeStorage.GAMES.BREAKOUT, this.score);
            this.highScores = ArcadeStorage.getAllScoresForGame(ArcadeStorage.GAMES.BREAKOUT);
            const newBestScore = this.highScores.length > 0 ? 
                (typeof this.highScores[0] === 'number' ? this.highScores[0] : this.highScores[0].score) : 0;
            this.highScore = newBestScore;
            
            // Check if this is a new high score
            if (this.score > oldBestScore) {
                isHighScore = true;
            }
        }
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('high-score').textContent = this.highScore;
        document.getElementById('game-over').classList.remove('hidden');
        
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
    },
    
    render() {
        // Clear canvas with theme background
        const theme = this.themes[this.theme];
        this.ctx.fillStyle = theme.bgColor;
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
        
        // Draw paddle with theme gradient
        const paddleGradient = this.ctx.createLinearGradient(
            this.paddle.x, this.paddle.y,
            this.paddle.x, this.paddle.y + this.paddle.height
        );
        paddleGradient.addColorStop(0, theme.paddleColor);
        paddleGradient.addColorStop(1, theme.paddleColorDark);
        
        this.ctx.fillStyle = paddleGradient;
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        this.ctx.strokeStyle = theme.paddleBorder;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        
        // Draw ball as actual circle with theme gradient and shine
        const ballGradient = this.ctx.createRadialGradient(
            this.ball.x - 3, this.ball.y - 3, 0,
            this.ball.x, this.ball.y, this.ball.radius
        );
        ballGradient.addColorStop(0, theme.ballColor);
        ballGradient.addColorStop(0.7, '#f0f0f0');
        ballGradient.addColorStop(1, theme.ballColorDark);
        
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

