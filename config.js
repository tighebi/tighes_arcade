// Game configuration constants
const CONFIG = {
    GRID_SIZE: 20,
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 400,
    get GRID_WIDTH() { return this.CANVAS_WIDTH / this.GRID_SIZE; },
    get GRID_HEIGHT() { return this.CANVAS_HEIGHT / this.GRID_SIZE; },
    BASE_GAME_SPEED: 150, // milliseconds
    MIN_GAME_SPEED: 50,
    MAX_GAME_SPEED: 300
};

// Theme configurations
const THEMES = {
    default: {
        bgColor: '#1a1a2e',
        gridColor: '#16213e',
        foodColor: '#ff6b6b',
        headColor: '#4ecdc4',
        bodyColor: '#45b7b8'
    },
    night: {
        bgColor: '#0a0a1a',
        gridColor: '#1a1a3a',
        foodColor: '#ff6b6b',
        headColor: '#6c5ce7',
        bodyColor: '#5f4dee'
    },
    garden: {
        bgColor: '#2d5016',
        gridColor: '#1a3009',
        foodColor: '#ff6b6b',
        headColor: '#51cf66',
        bodyColor: '#40c057'
    },
    space: {
        bgColor: '#000814',
        gridColor: '#001d3d',
        foodColor: '#ff6b6b',
        headColor: '#4a90e2',
        bodyColor: '#357abd'
    },
    retro: {
        bgColor: '#1e3a1e',
        gridColor: '#0f1f0f',
        foodColor: '#00ff41',
        headColor: '#00ff41',
        bodyColor: '#00cc33'
    }
};

// Head border colors per theme
const HEAD_BORDER_COLORS = {
    retro: '#00ff88',
    space: '#6bb3ff',
    garden: '#69db7c',
    night: '#a29bfe',
    default: '#6ef0f0'
};

// Food type probabilities (for power-up mode)
const FOOD_PROBABILITIES = {
    golden: 0.05,
    bluePotion: 0.15,
    redPotion: 0.25,
    scissors: 0.35,
    normal: 1.0
};

// Potion effects
const POTION_EFFECTS = {
    bluePotion: {
        speedModifier: 0.6,
        duration: 150
    },
    redPotion: {
        speedModifier: 1.5,
        duration: 100
    }
};

