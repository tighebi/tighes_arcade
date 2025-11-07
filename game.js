// Game configuration
const GRID_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const GRID_WIDTH = CANVAS_WIDTH / GRID_SIZE;
const GRID_HEIGHT = CANVAS_HEIGHT / GRID_SIZE;

// Game state
let canvas, ctx;
let snake = [];
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let highScore = 0;
let highScores = [];
let gameRunning = false;
let gameStarted = false;
let gameLoop = null;

// Initialize game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Make canvas responsive
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', () => {
        setTimeout(resizeCanvas, 100);
    });
    
    // Load high scores from localStorage
    loadHighScores();
    updateHighScoreDisplay();
    
    // Initialize snake
    resetGame();
    
    // Event listeners
    document.addEventListener('keydown', handleKeyPress);
    
    // Mobile touch controls
    setupTouchControls();
    
    // Tab switching
    setupTabs();
    
    // Start game loop
    startGame();
}

// Make canvas responsive
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = Math.min(400, window.innerWidth - 40);
    const maxHeight = Math.min(400, window.innerHeight * 0.5);
    const size = Math.min(maxWidth, maxHeight);
    
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
}

// Swipe gesture variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Setup touch controls
function setupTouchControls() {
    // Button controls
    const controlButtons = document.querySelectorAll('.control-btn');
    controlButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const direction = btn.getAttribute('data-direction');
            handleDirectionInput(direction);
        });
        
        // Touch events for better mobile support
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            btn.classList.add('active');
        });
        
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            btn.classList.remove('active');
            const direction = btn.getAttribute('data-direction');
            handleDirectionInput(direction);
        });
    });
    
    // Swipe gesture detection on canvas
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: false });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: false });
}

// Handle swipe gestures
function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                handleDirectionInput('right');
            } else {
                handleDirectionInput('left');
            }
        }
    } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                handleDirectionInput('down');
            } else {
                handleDirectionInput('up');
            }
        }
    }
}

// Handle direction input (works for both keyboard and touch)
function handleDirectionInput(dir) {
    let key;
    switch(dir) {
        case 'up':
            key = 'ArrowUp';
            break;
        case 'down':
            key = 'ArrowDown';
            break;
        case 'left':
            key = 'ArrowLeft';
            break;
        case 'right':
            key = 'ArrowRight';
            break;
        default:
            return;
    }
    
    // Check if game-over overlay is visible
    const gameOverElement = document.getElementById('game-over');
    const isGameOverVisible = !gameOverElement.classList.contains('hidden');
    
    // If game is not running and not started (initial start), wait for direction input
    if (!gameRunning && !gameStarted && !isGameOverVisible) {
        // Prevent down arrow as initial direction
        if (key === 'ArrowDown') {
            return;
        }
        startNewGame(key);
        return;
    }
    
    // If game is not running or not started, ignore
    if (!gameRunning || !gameStarted) return;
    
    // Prevent reversing into itself
    switch(key) {
        case 'ArrowUp':
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            break;
    }
}

// Setup tab switching
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // If restart button is clicked and game is over, reset and wait for direction
            if (tabName === 'restart' && !gameRunning) {
                resetGame();
                return; // Don't switch tabs, just reset
            }
            
            // Remove active class from all tabs and buttons
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Load high scores from localStorage
function loadHighScores() {
    const saved = localStorage.getItem('snakeHighScores');
    if (saved) {
        highScores = JSON.parse(saved);
        highScores.sort((a, b) => b - a); // Sort descending
    } else {
        highScores = [];
    }
    highScore = highScores.length > 0 ? highScores[0] : 0;
    document.getElementById('high-score').textContent = highScore;
}

// Save high scores to localStorage
function saveHighScores() {
    localStorage.setItem('snakeHighScores', JSON.stringify(highScores));
}

// Update high score display in the tab
function updateHighScoreDisplay() {
    const list = document.getElementById('high-scores-list');
    if (highScores.length === 0) {
        list.innerHTML = '<p style="text-align: center; opacity: 0.7;">No scores yet!</p>';
        return;
    }
    
    // Show top 5 scores only
    list.innerHTML = highScores.slice(0, 5).map((score, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        return `
            <div class="high-score-item">
                <span><span class="rank">${index + 1}.</span> ${medal}</span>
                <span class="score">${score} points</span>
            </div>
        `;
    }).join('');
}

// Reset game to initial state
function resetGame() {
    // Position snake in center, facing up (so all 4 directions are safe)
    // Snake: head at (10, 10), body at (10, 11), tail at (10, 12)
    snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    direction = { x: 0, y: 0 };
    nextDirection = { x: 0, y: 0 };
    score = 0;
    gameRunning = false;
    gameStarted = false;
    document.getElementById('score').textContent = score;
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('start-prompt').classList.remove('hidden');
    
    // Reset to restart tab
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelector('[data-tab="restart"]').classList.add('active');
    document.getElementById('restart-tab').classList.add('active');
    
    generateFood();
}

// Generate food at random position
function generateFood() {
    do {
        food.x = Math.floor(Math.random() * GRID_WIDTH);
        food.y = Math.floor(Math.random() * GRID_HEIGHT);
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// Handle keyboard input
function handleKeyPress(e) {
    // Check if it's an arrow key
    const isArrowKey = e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
                       e.key === 'ArrowLeft' || e.key === 'ArrowRight';
    
    if (isArrowKey) {
        let dir;
        switch(e.key) {
            case 'ArrowUp':
                dir = 'up';
                break;
            case 'ArrowDown':
                dir = 'down';
                break;
            case 'ArrowLeft':
                dir = 'left';
                break;
            case 'ArrowRight':
                dir = 'right';
                break;
        }
        handleDirectionInput(dir);
    }
}

// Start new game with initial direction
function startNewGame(initialKey) {
    // Prevent down arrow as initial direction (would cause immediate collision with tail)
    if (initialKey === 'ArrowDown') {
        return; // Don't start if down arrow is pressed
    }
    
    gameStarted = true;
    gameRunning = true;
    document.getElementById('start-prompt').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');
    
    // Set initial direction based on key pressed
    switch(initialKey) {
        case 'ArrowUp':
            direction = { x: 0, y: -1 };
            nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowLeft':
            direction = { x: -1, y: 0 };
            nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            direction = { x: 1, y: 0 };
            nextDirection = { x: 1, y: 0 };
            break;
        // ArrowDown is not allowed as initial direction
    }
}

// Update game state
function update() {
    if (!gameRunning || !gameStarted) return;
    
    // Update direction
    direction = { ...nextDirection };
    
    // Calculate new head position
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };
    
    // Check wall collision
    if (head.x < 0 || head.x >= GRID_WIDTH || 
        head.y < 0 || head.y >= GRID_HEIGHT) {
        gameOver();
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        
        // Update high score display (not the list, just the current high)
        if (score > highScore) {
            highScore = score;
            document.getElementById('high-score').textContent = highScore;
        }
        
        generateFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
}

// Update high scores list
function updateHighScores(newScore) {
    // Add new score if it's high enough
    if (highScores.length < 10 || newScore > highScores[highScores.length - 1]) {
        highScores.push(newScore);
        highScores.sort((a, b) => b - a); // Sort descending
        highScores = highScores.slice(0, 10); // Keep top 10
        saveHighScores();
        
        // Update display
        highScore = highScores[0];
        document.getElementById('high-score').textContent = highScore;
        updateHighScoreDisplay();
    }
}

// Render game
function render() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Ensure canvas maintains proper aspect ratio
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    if (canvas.width !== CANVAS_WIDTH || canvas.height !== CANVAS_HEIGHT) {
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
    }
    
    // Draw grid (optional, for visual aid)
    ctx.strokeStyle = '#16213e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_WIDTH; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, CANVAS_HEIGHT);
        ctx.stroke();
    }
    for (let i = 0; i <= GRID_HEIGHT; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(CANVAS_WIDTH, i * GRID_SIZE);
        ctx.stroke();
    }
    
    // Draw food
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(
        food.x * GRID_SIZE + 2,
        food.y * GRID_SIZE + 2,
        GRID_SIZE - 4,
        GRID_SIZE - 4
    );
    
    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head
            ctx.fillStyle = '#4ecdc4';
        } else {
            // Body
            ctx.fillStyle = '#45b7b8';
        }
        ctx.fillRect(
            segment.x * GRID_SIZE + 2,
            segment.y * GRID_SIZE + 2,
            GRID_SIZE - 4,
            GRID_SIZE - 4
        );
    });
}

// Game over
function gameOver() {
    gameRunning = false;
    gameStarted = false;
    
    // Add score to high scores if applicable
    updateHighScores(score);
    
    // Reset to restart tab
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelector('[data-tab="restart"]').classList.add('active');
    document.getElementById('restart-tab').classList.add('active');
    
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('start-prompt').classList.remove('hidden');
}

// Main game loop
function gameStep() {
    update();
    render();
}

// Start game
function startGame() {
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    gameLoop = setInterval(gameStep, 150); // 150ms = ~6.67 FPS
}

// Initialize when page loads
window.addEventListener('load', init);

// Mouse interaction for background
function initMouseInteraction() {
    const mouseFollower = document.getElementById('mouseFollower');
    const pattern1 = document.getElementById('pattern1');
    const pattern2 = document.getElementById('pattern2');
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    
    // Get center of viewport for distortion calculations
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });
    
    // Smooth animation loop
    function animate() {
        // Smooth interpolation for mouse follower
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        
        // Update mouse follower position
        mouseFollower.style.left = currentX + 'px';
        mouseFollower.style.top = currentY + 'px';
        
        // Calculate effective position (just mouse position)
        const effectiveX = currentX;
        const effectiveY = currentY;
        
        // Clamp transform origin to stay within viewport bounds
        const mouseXPercent = Math.max(10, Math.min(90, (effectiveX / window.innerWidth) * 100));
        const mouseYPercent = Math.max(10, Math.min(90, (effectiveY / window.innerHeight) * 100));
        
        pattern1.style.transformOrigin = `${mouseXPercent}% ${mouseYPercent}%`;
        pattern2.style.transformOrigin = `${mouseXPercent}% ${mouseYPercent}%`;
        
        // Calculate position relative to viewport center for distortion direction
        const mouseRelX = effectiveX - centerX;
        const mouseRelY = effectiveY - centerY;
        const mouseDistance = Math.sqrt(mouseRelX * mouseRelX + mouseRelY * mouseRelY);
        
        // Maximum effective distortion radius (200px around mouse - greater area)
        const distortionRadius = 200;
        const maxDistortionDistance = distortionRadius;
        
        // Calculate distortion strength - strongest at mouse, fades with distance
        let distortionStrength = 0;
        if (mouseDistance < maxDistortionDistance) {
            const normalizedDist = mouseDistance / maxDistortionDistance;
            distortionStrength = (1 - normalizedDist) * (1 - normalizedDist) * 2.5; // Increased from 2.0
        } else {
            distortionStrength = (maxDistortionDistance / mouseDistance) * 0.05;
        }
        
        // Calculate angle for directional distortion
        const angle = Math.atan2(mouseRelY, mouseRelX);
        
        // Create repulsion effect - MUCH stronger (increased from 60 to 90)
        const repulsionStrength = distortionStrength * 90;
        
        // For pattern 1 (diagonal lines) - create strong bending/repulsion effect
        const skewX1 = Math.sin(angle + Math.PI / 4) * repulsionStrength;
        const skewY1 = Math.cos(angle + Math.PI / 4) * repulsionStrength;
        
        // 3D perspective for depth and bending
        const perspective1 = 600;
        const rotateX1 = (mouseRelY / window.innerHeight) * distortionStrength * 25;
        const rotateY1 = -(mouseRelX / window.innerWidth) * distortionStrength * 25;
        
        // Scale creates expansion effect around mouse (clamped to prevent disappearing)
        const scale1 = Math.min(1 + distortionStrength * 0.5, 2.0);
        
        // For pattern 2 (dot grid) - stronger distortion
        const skewX2 = Math.cos(angle) * repulsionStrength;
        const skewY2 = -Math.sin(angle) * repulsionStrength;
        const rotateX2 = (mouseRelX / window.innerWidth) * distortionStrength * 22;
        const rotateY2 = (mouseRelY / window.innerHeight) * distortionStrength * 22;
        const scale2 = Math.min(1 + distortionStrength * 0.6, 2.2);
        
        // Apply transforms - the transform-origin makes this appear localized
        pattern1.style.transform = `
            perspective(${perspective1}px) 
            rotateX(${rotateX1}deg) 
            rotateY(${rotateY1}deg) 
            skew(${skewX1}deg, ${skewY1}deg) 
            scale(${scale1})
        `;
        pattern2.style.transform = `
            perspective(${perspective1}px) 
            rotateX(${rotateX2}deg) 
            rotateY(${rotateY2}deg) 
            skew(${skewX2}deg, ${skewY2}deg) 
            scale(${scale2})
        `;
        
        requestAnimationFrame(animate);
    }
    
    // Initialize position
    mouseFollower.style.left = currentX + 'px';
    mouseFollower.style.top = currentY + 'px';
    
    animate();
}

// Initialize mouse interaction when page loads
window.addEventListener('load', initMouseInteraction);

