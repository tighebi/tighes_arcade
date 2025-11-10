// localStorage management for high scores and preferences
const Storage = {
    // High scores
    loadHighScores() {
        const saved = localStorage.getItem('snakeHighScores');
        return saved ? JSON.parse(saved).sort((a, b) => b - a) : [];
    },
    
    saveHighScores(scores) {
        localStorage.setItem('snakeHighScores', JSON.stringify(scores));
    },
    
    loadPowerUpHighScores() {
        const saved = localStorage.getItem('snakePowerUpHighScores');
        return saved ? JSON.parse(saved).sort((a, b) => b - a) : [];
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
    
    // Update high scores (adds new score if high enough, keeps top 10)
    updateHighScores(newScore, isPowerUp = false) {
        const key = isPowerUp ? 'snakePowerUpHighScores' : 'snakeHighScores';
        const loadFunc = isPowerUp ? this.loadPowerUpHighScores : this.loadHighScores;
        const saveFunc = isPowerUp ? this.savePowerUpHighScores : this.saveHighScores;
        
        let scores = loadFunc.call(this);
        
        if (scores.length < 10 || newScore > scores[scores.length - 1]) {
            scores.push(newScore);
            scores.sort((a, b) => b - a);
            scores = scores.slice(0, 10);
            saveFunc.call(this, scores);
        }
        
        return scores;
    }
};

