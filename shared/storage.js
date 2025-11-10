// Unified storage system for all games
const ArcadeStorage = {
    // Game identifiers
    GAMES: {
        SNAKE_CLASSIC: 'snake_classic',
        SNAKE_POWERUP: 'snake_powerup',
        BREAKOUT: 'breakout',
        FLAPPY: 'flappy',
        GAME2048: '2048'
    },
    
    // Save high score for a game
    saveHighScore(gameId, score) {
        const key = `arcade_${gameId}_scores`;
        let scores = this.loadHighScores(gameId);
        
        scores.push(score);
        scores.sort((a, b) => b - a);
        scores = scores.slice(0, 10); // Keep top 10
        
        localStorage.setItem(key, JSON.stringify(scores));
        return scores;
    },
    
    // Load high scores for a game
    loadHighScores(gameId) {
        const key = `arcade_${gameId}_scores`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : [];
    },
    
    // Get best score for a game
    getBestScore(gameId) {
        const scores = this.loadHighScores(gameId);
        return scores.length > 0 ? scores[0] : 0;
    },
    
    // Get all game scores for hall of fame
    getAllScores() {
        return {
            snakeClassic: this.getBestScore(this.GAMES.SNAKE_CLASSIC),
            snakePowerUp: this.getBestScore(this.GAMES.SNAKE_POWERUP),
            breakout: this.getBestScore(this.GAMES.BREAKOUT),
            flappy: this.getBestScore(this.GAMES.FLAPPY),
            game2048: this.getBestScore(this.GAMES.GAME2048)
        };
    },
    
    // Legacy support for old snake game storage
    migrateSnakeScores() {
        // Migrate old snake scores if they exist
        const oldClassic = localStorage.getItem('snakeHighScores');
        const oldPowerUp = localStorage.getItem('snakePowerUpHighScores');
        
        if (oldClassic) {
            const scores = JSON.parse(oldClassic);
            scores.forEach(score => {
                this.saveHighScore(this.GAMES.SNAKE_CLASSIC, score);
            });
        }
        
        if (oldPowerUp) {
            const scores = JSON.parse(oldPowerUp);
            scores.forEach(score => {
                this.saveHighScore(this.GAMES.SNAKE_POWERUP, score);
            });
        }
    }
};

// Migrate old scores on load
ArcadeStorage.migrateSnakeScores();

