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
        foodColor: '#ff4757', // Bright red - contrasts with cyan/teal snake
        headColor: '#4ecdc4',
        bodyColor: '#45b7b8'
    },
    night: {
        bgColor: '#0a0a1a',
        gridColor: '#1a1a3a',
        foodColor: '#ffa502', // Bright orange-yellow - contrasts with purple snake
        headColor: '#6c5ce7',
        bodyColor: '#5f4dee'
    },
    garden: {
        bgColor: '#2d5016',
        gridColor: '#1a3009',
        foodColor: '#ff3838', // Bright red - contrasts with green snake
        headColor: '#51cf66',
        bodyColor: '#40c057'
    },
    space: {
        bgColor: '#000814',
        gridColor: '#001d3d',
        foodColor: '#ff6348', // Bright orange - contrasts with blue snake
        headColor: '#4a90e2',
        bodyColor: '#357abd'
    },
    retro: {
        bgColor: '#1e3a1e',
        gridColor: '#0f1f0f',
        foodColor: '#ff1493', // Bright pink/magenta - contrasts with green snake (was same color!)
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

// Supabase Configuration for Global Leaderboard
// To enable the leaderboard:
// 1. Create a free account at https://supabase.com
// 2. Create a new project
// 3. Go to SQL Editor and run this SQL to create the table:
//    CREATE TABLE snake_leaderboard (
//        id BIGSERIAL PRIMARY KEY,
//        name VARCHAR(3) NOT NULL,
//        score INTEGER NOT NULL,
//        game_mode VARCHAR(20) NOT NULL,
//        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
//    );
// 4. Go to Settings > API and copy your Project URL and anon public key
// 5. Replace the values below with your Supabase credentials
CONFIG.SUPABASE_URL = 'https://uuztspmqpxcwxhkvktfc.supabase.co'; // Your Supabase project URL
CONFIG.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1enRzcG1xcHhjd3hoa3ZrdGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzM4NjAsImV4cCI6MjA3ODQ0OTg2MH0.sZfedkAg1rXRH4KPzDV3yCmIYexA5MohKB4Wkiacdag'; // Your Supabase anon/public key

