// Flappy Bird Game
const FlappyGame = {
    canvas: null,
    ctx: null,
    bird: { x: 100, y: 250, width: 30, height: 30, velocity: 0, gravity: 0.5, jumpStrength: -11 },
    pipes: [],
    score: 0,
    highScore: 0,
    highScores: [],
    gameRunning: false,
    gameStarted: false,
    gamePaused: false,
    animationId: null,
    pipeWidth: 45,
    pipeGap: 180,
    pipeSpeed: 2.5,
    basePipeSpeed: 2.5,
    pipeSpawnRate: 120,
    frameCount: 0,
    speedIncreaseRate: 0.003,
    difficulty: 'medium',
    difficulties: {
        easy: {
            baseSpeed: 2.0,
            speedIncrease: 0.002,
            pipeGap: 200,
            jumpStrength: -10
        },
        medium: {
            baseSpeed: 2.5,
            speedIncrease: 0.003,
            pipeGap: 180,
            jumpStrength: -11
        },
        hard: {
            baseSpeed: 3.5,
            speedIncrease: 0.004,
            pipeGap: 160,
            jumpStrength: -12
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
            this.highScores = ArcadeStorage.getAllScoresForGame(ArcadeStorage.GAMES.FLAPPY);
            this.highScore = this.highScores.length > 0 ? 
                (typeof this.highScores[0] === 'number' ? this.highScores[0] : this.highScores[0].score) : 0;
            document.getElementById('high-score').textContent = this.highScore;
        }
        
        // Setup difficulty selector
        this.setupDifficulty();
        
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
        this.basePipeSpeed = diff.baseSpeed;
        this.pipeSpeed = diff.baseSpeed;
        this.speedIncreaseRate = diff.speedIncrease;
        this.pipeGap = diff.pipeGap;
        this.bird.jumpStrength = diff.jumpStrength;
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
                'flappy'
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
            leaderboardTitle.textContent = 'Global Leaderboard - Flappy Bird';
        }
        
        if (!leaderboardList) return;
        
        if (typeof Leaderboard === 'undefined' || !Leaderboard.isAvailable()) {
            leaderboardList.innerHTML = 
                '<p style="text-align: center; opacity: 0.7;">Leaderboard not available. Please configure Supabase.</p>';
            return;
        }
        
        leaderboardList.innerHTML = '<p style="text-align: center; opacity: 0.7;">Loading leaderboard...</p>';
        
        try {
            const result = await Leaderboard.getLeaderboard('flappy', 3);
            
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
        
        const scores = ArcadeStorage.getAllScoresForGame(ArcadeStorage.GAMES.FLAPPY);
        
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
        this.gameRunning = false;
        this.gameStarted = false;
        this.gamePaused = false;
        this.frameCount = 0;
        this.pipes = [];
        this.applyDifficulty();
        
        // Reset bird
        this.bird.y = this.canvas.height / 2;
        this.bird.velocity = 0;
        
        // Update UI
        document.getElementById('score').textContent = this.score;
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('pause-menu').classList.remove('hidden');
        document.getElementById('pause-title').textContent = 'Ready to Play';
        document.getElementById('pause-instructions').textContent = 'Click or press SPACE to start';
    },
    
    setupControls() {
        const flap = () => {
            // Don't allow control after game over or when paused
            if (this.gamePaused) {
                this.resumeGame();
                return;
            }
            if (!this.gameRunning && this.gameStarted) {
                return;
            }
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
        this.bird.velocity = this.bird.jumpStrength;
    },
    
    update() {
        if (!this.gameRunning || !this.gameStarted || this.gamePaused) return;
        
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
        
        // Spawn pipes
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
        this.gamePaused = false;
        
        // Check if this is a high score
        let isHighScore = false;
        const oldBestScore = this.highScores.length > 0 ? 
            (typeof this.highScores[0] === 'number' ? this.highScores[0] : this.highScores[0].score) : 0;
        
        // Save high score
        if (typeof ArcadeStorage !== 'undefined') {
            ArcadeStorage.saveHighScore(ArcadeStorage.GAMES.FLAPPY, this.score);
            this.highScores = ArcadeStorage.getAllScoresForGame(ArcadeStorage.GAMES.FLAPPY);
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
        // Clear canvas with sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#4A90E2');
        gradient.addColorStop(0.5, '#87CEEB');
        gradient.addColorStop(1, '#B0E0E6');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw clouds
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
        
        // Draw pipes
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
        
        // Draw ground
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
        
        // Draw bird
        const birdX = this.bird.x;
        const birdY = this.bird.y;
        const rotation = Math.min(Math.max(this.bird.velocity * 0.12, -0.4), 0.4);
        
        this.ctx.save();
        this.ctx.translate(birdX + this.bird.width / 2, birdY + this.bird.height / 2);
        this.ctx.rotate(rotation);
        this.ctx.imageSmoothingEnabled = false;
        
        // Wing animation
        const wingSpeed = this.bird.velocity < 0 ? 0.5 : 0.2;
        const wingOffset = Math.sin(this.frameCount * wingSpeed) * 4;
        
        // Bird body
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Body outline
        this.ctx.strokeStyle = '#D4AF37';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Wing
        this.ctx.fillStyle = '#FFA500';
        this.ctx.beginPath();
        this.ctx.ellipse(-8, 0 + wingOffset, 6, 10, -0.2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Wing highlight
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.ellipse(-6, -2 + wingOffset, 3, 5, -0.2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eye
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(4, -6, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eye pupil
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(5, -6, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eye shine
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(6, -7, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Beak
        this.ctx.fillStyle = '#FF8C00';
        this.ctx.beginPath();
        this.ctx.moveTo(12, 0);
        this.ctx.lineTo(18, -3);
        this.ctx.lineTo(18, 3);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Beak outline
        this.ctx.strokeStyle = '#D2691E';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        
        // Chest highlight
        this.ctx.fillStyle = '#FFFACD';
        this.ctx.beginPath();
        this.ctx.arc(-2, 2, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
        this.ctx.imageSmoothingEnabled = true;
    },
    
    gameLoop() {
        this.update();
        this.render();
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
};

// Initialize when page loads
window.addEventListener('load', () => FlappyGame.init());
