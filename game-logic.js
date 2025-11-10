// Game logic and mechanics
const GameLogic = {
    // Generate food at random position
    generateFood(snake, gameMode) {
        let food = { x: 0, y: 0 };
        let foodType = 'normal';
        
        do {
            food.x = Math.floor(Math.random() * CONFIG.GRID_WIDTH);
            food.y = Math.floor(Math.random() * CONFIG.GRID_HEIGHT);
        } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
        
        // Determine food type based on game mode
        if (gameMode === 'powerup') {
            const rand = Math.random();
            if (rand < FOOD_PROBABILITIES.golden) {
                foodType = 'golden';
            } else if (rand < FOOD_PROBABILITIES.bluePotion) {
                foodType = 'bluePotion';
            } else if (rand < FOOD_PROBABILITIES.redPotion) {
                foodType = 'redPotion';
            } else if (rand < FOOD_PROBABILITIES.scissors) {
                foodType = 'scissors';
            } else {
                foodType = 'normal';
            }
        }
        
        return { food, foodType };
    },
    
    // Update game state
    update(gameState) {
        if (!gameState.gameRunning || !gameState.gameStarted) return false;
        
        // Update frame count for animations (only when running)
        gameState.frameCount++;
        
        // Update speed modifier timer
        if (gameState.speedModifierTimer > 0) {
            gameState.speedModifierTimer--;
            if (gameState.speedModifierTimer === 0) {
                gameState.speedModifier = 1.0;
                return 'speedReset';
            }
        }
        
        // Update direction
        gameState.direction = { ...gameState.nextDirection };
        
        // Calculate new head position
        const head = {
            x: gameState.snake[0].x + gameState.direction.x,
            y: gameState.snake[0].y + gameState.direction.y
        };
        
        // Handle wall collision based on game mode
        if (gameState.gameMode !== 'zen') {
            if (head.x < 0 || head.x >= CONFIG.GRID_WIDTH || 
                head.y < 0 || head.y >= CONFIG.GRID_HEIGHT) {
                return 'gameOver';
            }
        } else {
            // Zen mode: wrap around
            if (head.x < 0) head.x = CONFIG.GRID_WIDTH - 1;
            if (head.x >= CONFIG.GRID_WIDTH) head.x = 0;
            if (head.y < 0) head.y = CONFIG.GRID_HEIGHT - 1;
            if (head.y >= CONFIG.GRID_HEIGHT) head.y = 0;
        }
        
        // Check self collision (optimized - only check head against body)
        if (gameState.gameMode !== 'zen') {
            // Skip first element (head), check rest
            for (let i = 1; i < gameState.snake.length; i++) {
                if (gameState.snake[i].x === head.x && gameState.snake[i].y === head.y) {
                    return 'gameOver';
                }
            }
        }
        
        // Add new head
        gameState.snake.unshift(head);
        
        // Check food collision
        if (head.x === gameState.food.x && head.y === gameState.food.y) {
            return 'foodEaten';
        } else {
            // Remove tail if no food eaten
            gameState.snake.pop();
            return 'continue';
        }
    },
    
    // Handle food being eaten
    handleFoodEaten(gameState) {
        if (gameState.gameMode === 'powerup') {
            switch(gameState.foodType) {
                case 'golden':
                    gameState.score += 10;
                    break;
                case 'bluePotion':
                    gameState.speedModifier = POTION_EFFECTS.bluePotion.speedModifier;
                    gameState.speedModifierTimer = POTION_EFFECTS.bluePotion.duration;
                    gameState.score += 10;
                    return 'speedChanged';
                case 'redPotion':
                    gameState.speedModifier = POTION_EFFECTS.redPotion.speedModifier;
                    gameState.speedModifierTimer = POTION_EFFECTS.redPotion.duration;
                    gameState.score += 10;
                    return 'speedChanged';
                case 'scissors':
                    const segmentsToRemove = Math.min(3, gameState.snake.length - 1);
                    for (let i = 0; i < segmentsToRemove; i++) {
                        if (gameState.snake.length > 1) {
                            gameState.snake.pop();
                        }
                    }
                    gameState.score += 10;
                    break;
                default:
                    gameState.score += 10;
                    break;
            }
        } else {
            gameState.score += 10;
        }
        
        return 'normal';
    },
    
    // Reset game state
    resetGame(gameState) {
        gameState.snake = [
            { x: 10, y: 10 },
            { x: 10, y: 11 },
            { x: 10, y: 12 }
        ];
        gameState.direction = { x: 0, y: 0 };
        gameState.nextDirection = { x: 0, y: 0 };
        gameState.score = 0;
        gameState.gameRunning = false;
        gameState.gameStarted = false;
        gameState.speedModifier = 1.0;
        gameState.speedModifierTimer = 0;
        gameState.frameCount = 0;
        
        const foodData = this.generateFood(gameState.snake, gameState.gameMode);
        gameState.food = foodData.food;
        gameState.foodType = foodData.foodType;
    }
};

