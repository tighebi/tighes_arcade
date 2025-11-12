// localStorage management for high scores and preferences
// Integrates with ArcadeStorage for unified high score system
const Storage = {
    // High scores (legacy support + ArcadeStorage integration)
    loadHighScores() {
        // Try ArcadeStorage first, then fallback to legacy
        if (typeof ArcadeStorage !== 'undefined') {
            return ArcadeStorage.getAllScoresForGame(ArcadeStorage.GAMES.SNAKE_CLASSIC);
        }
        const saved = localStorage.getItem('snakeHighScores');
        if (!saved) return [];
        try {
            const scores = JSON.parse(saved);
            // Handle both numeric arrays and object arrays
            return Array.isArray(scores) ? scores.sort((a, b) => {
                const scoreA = typeof a === 'number' ? a : (a.score || 0);
                const scoreB = typeof b === 'number' ? b : (b.score || 0);
                return scoreB - scoreA;
            }) : [];
        } catch (e) {
            return [];
        }
    },
    
    saveHighScores(scores) {
        localStorage.setItem('snakeHighScores', JSON.stringify(scores));
    },
    
    loadPowerUpHighScores() {
        // Try ArcadeStorage first, then fallback to legacy
        if (typeof ArcadeStorage !== 'undefined') {
            return ArcadeStorage.getAllScoresForGame(ArcadeStorage.GAMES.SNAKE_POWERUP);
        }
        const saved = localStorage.getItem('snakePowerUpHighScores');
        if (!saved) return [];
        try {
            const scores = JSON.parse(saved);
            // Handle both numeric arrays and object arrays
            return Array.isArray(scores) ? scores.sort((a, b) => {
                const scoreA = typeof a === 'number' ? a : (a.score || 0);
                const scoreB = typeof b === 'number' ? b : (b.score || 0);
                return scoreB - scoreA;
            }) : [];
        } catch (e) {
            return [];
        }
    },
    
    savePowerUpHighScores(scores) {
        localStorage.setItem('snakePowerUpHighScores', JSON.stringify(scores));
    },
    
    // Preferences
    loadSkin() {
        return localStorage.getItem('snakeSkin') || 'classic';
    },
    
    saveSkin(skin) {
        localStorage.setItem('snakeSkin', skin);
    },
    
    loadTheme() {
        return localStorage.getItem('snakeTheme') || 'default';
    },
    
    saveTheme(theme) {
        localStorage.setItem('snakeTheme', theme);
    },
    
    // Game-specific theme storage
    loadGameTheme(gameName) {
        const key = `${gameName}Theme`;
        const defaultThemes = {
            'snake': 'default',
            'breakout': 'default',
            'flappy': 'day',
            '2048': 'default'
        };
        return localStorage.getItem(key) || defaultThemes[gameName] || 'default';
    },
    
    saveGameTheme(gameName, theme) {
        const key = `${gameName}Theme`;
        localStorage.setItem(key, theme);
    },
    
    // Update high scores (adds new score if high enough, keeps top 10)
    // Also saves to ArcadeStorage if available
    updateHighScores(newScore, isPowerUp = false) {
        // Always use ArcadeStorage if available (has usernames)
        if (typeof ArcadeStorage !== 'undefined') {
            const gameId = isPowerUp 
                ? ArcadeStorage.GAMES.SNAKE_POWERUP 
                : ArcadeStorage.GAMES.SNAKE_CLASSIC;
            
            // Save to ArcadeStorage (this handles sorting and limiting)
            ArcadeStorage.saveHighScore(gameId, newScore);
            
            // Return normalized scores from ArcadeStorage
            return ArcadeStorage.getAllScoresForGame(gameId);
        }
        
        // Fallback to old Storage system
        const key = isPowerUp ? 'snakePowerUpHighScores' : 'snakeHighScores';
        const loadFunc = isPowerUp ? this.loadPowerUpHighScores : this.loadHighScores;
        const saveFunc = isPowerUp ? this.savePowerUpHighScores : this.saveHighScores;
        
        let scores = loadFunc.call(this);
        
        // Extract numeric scores for comparison
        const numericScores = scores.map(s => typeof s === 'number' ? s : (s.score || 0));
        const minScore = numericScores.length > 0 ? Math.min(...numericScores) : 0;
        
        if (scores.length < 10 || newScore > minScore) {
            // Add new score as number (for old storage system)
            scores.push(newScore);
            // Sort by numeric value
            scores.sort((a, b) => {
                const scoreA = typeof a === 'number' ? a : (a.score || 0);
                const scoreB = typeof b === 'number' ? b : (b.score || 0);
                return scoreB - scoreA;
            });
            scores = scores.slice(0, 10);
            saveFunc.call(this, scores);
        }
        
        return scores;
    }
};

