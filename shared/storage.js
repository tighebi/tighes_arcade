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
    
    // Get current username (fallback to 'Player' if UsernameManager not available)
    getCurrentUsername() {
        if (typeof UsernameManager !== 'undefined') {
            return UsernameManager.getUsername();
        }
        return 'Player';
    },
    
    // Normalize score entry (handles both old numeric format and new object format)
    // This is for display purposes only - doesn't modify stored data
    normalizeScoreEntry(entry) {
        if (typeof entry === 'number') {
            // Old format: just a number, use default username for display
            return {
                username: 'Player',
                score: entry,
                date: null
            };
        }
        // New format: object with username, score, date
        // Ensure it has all required fields
        return {
            username: entry.username || 'Player',
            score: entry.score || entry,
            date: entry.date || null
        };
    },
    
    // Save high score for a game (now stores username with score)
    saveHighScore(gameId, score) {
        const key = `arcade_${gameId}_scores`;
        let scores = this.loadHighScores(gameId);
        
        // Create score entry with username
        const scoreEntry = {
            username: this.getCurrentUsername(),
            score: score,
            date: new Date().toISOString()
        };
        
        scores.push(scoreEntry);
        
        // Sort by score descending
        scores.sort((a, b) => {
            const scoreA = typeof a === 'number' ? a : a.score;
            const scoreB = typeof b === 'number' ? b : b.score;
            return scoreB - scoreA;
        });
        
        scores = scores.slice(0, 10); // Keep top 10
        
        localStorage.setItem(key, JSON.stringify(scores));
        return scores;
    },
    
    // Load high scores for a game (returns normalized entries)
    loadHighScores(gameId) {
        const key = `arcade_${gameId}_scores`;
        const saved = localStorage.getItem(key);
        if (!saved) return [];
        
        const scores = JSON.parse(saved);
        // Normalize all entries (migrate old numeric scores)
        return scores.map(entry => this.normalizeScoreEntry(entry));
    },
    
    // Get best score for a game (returns numeric score for backward compatibility)
    getBestScore(gameId) {
        const scores = this.loadHighScores(gameId);
        if (scores.length === 0) return 0;
        const best = scores[0];
        return typeof best === 'number' ? best : best.score;
    },
    
    // Get best score entry (returns full entry with username)
    getBestScoreEntry(gameId) {
        const scores = this.loadHighScores(gameId);
        if (scores.length === 0) return null;
        return scores[0];
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
    
    // Get all score entries for hall of fame (with usernames)
    getAllScoreEntries() {
        return {
            snakeClassic: this.getBestScoreEntry(this.GAMES.SNAKE_CLASSIC),
            snakePowerUp: this.getBestScoreEntry(this.GAMES.SNAKE_POWERUP),
            breakout: this.getBestScoreEntry(this.GAMES.BREAKOUT),
            flappy: this.getBestScoreEntry(this.GAMES.FLAPPY),
            game2048: this.getBestScoreEntry(this.GAMES.GAME2048)
        };
    },
    
    // Get all scores for a game (for display in hall of fame)
    getAllScoresForGame(gameId) {
        return this.loadHighScores(gameId);
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

