// Preview generator for visual theme/skin selection
const PreviewGenerator = {
    // Generate preview for Snake game theme
    generateSnakeThemePreview(themeName, canvas) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const gridSize = 20;
        const gridWidth = Math.floor(size / gridSize);
        const gridHeight = Math.floor(size / gridSize);
        
        const theme = THEMES[themeName] || THEMES.default;
        
        // Draw background
        ctx.fillStyle = theme.bgColor;
        ctx.fillRect(0, 0, size, size);
        
        // Draw grid lines
        ctx.strokeStyle = theme.gridColor;
        ctx.lineWidth = 1;
        for (let i = 0; i <= gridWidth; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, size);
            ctx.stroke();
        }
        for (let i = 0; i <= gridHeight; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(size, i * gridSize);
            ctx.stroke();
        }
        
        // Draw a small snake preview (head + 3 body segments)
        const segmentSize = gridSize - 4;
        const padding = 2;
        
        // Head
        ctx.fillStyle = theme.headColor;
        ctx.fillRect(3 * gridSize + padding, 3 * gridSize + padding, segmentSize, segmentSize);
        
        // Body segments
        ctx.fillStyle = theme.bodyColor;
        ctx.fillRect(2 * gridSize + padding, 3 * gridSize + padding, segmentSize, segmentSize);
        ctx.fillRect(1 * gridSize + padding, 3 * gridSize + padding, segmentSize, segmentSize);
        ctx.fillRect(0 * gridSize + padding, 3 * gridSize + padding, segmentSize, segmentSize);
        
        // Food
        ctx.fillStyle = theme.foodColor;
        ctx.beginPath();
        ctx.arc(5 * gridSize + gridSize/2, 3 * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // Generate preview for Snake game skin
    generateSnakeSkinPreview(skinName, themeName, canvas) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const gridSize = 20;
        const gridWidth = Math.floor(size / gridSize);
        const gridHeight = Math.floor(size / gridSize);
        
        const theme = THEMES[themeName] || THEMES.default;
        
        // Draw background
        ctx.fillStyle = theme.bgColor;
        ctx.fillRect(0, 0, size, size);
        
        // Draw grid lines
        ctx.strokeStyle = theme.gridColor;
        ctx.lineWidth = 1;
        for (let i = 0; i <= gridWidth; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, size);
            ctx.stroke();
        }
        for (let i = 0; i <= gridHeight; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(size, i * gridSize);
            ctx.stroke();
        }
        
        const segmentSize = gridSize - 4;
        const padding = 2;
        
        // Create skin for preview
        const skin = Skins.createSkin(skinName, themeName);
        
        // Draw snake segments
        const segments = [
            { x: 3, y: 3 }, // head
            { x: 2, y: 3 },
            { x: 1, y: 3 },
            { x: 0, y: 3 }
        ];
        
        // Head
        ctx.fillStyle = skin.getHeadColor(0);
        ctx.fillRect(segments[0].x * gridSize + padding, segments[0].y * gridSize + padding, segmentSize, segmentSize);
        
        // Body segments
        for (let i = 1; i < segments.length; i++) {
            ctx.fillStyle = skin.getBodyColor(0, i);
            ctx.fillRect(segments[i].x * gridSize + padding, segments[i].y * gridSize + padding, segmentSize, segmentSize);
        }
        
        // Food
        ctx.fillStyle = theme.foodColor;
        ctx.beginPath();
        ctx.arc(5 * gridSize + gridSize/2, 3 * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // Generate preview for 2048 theme
    generate2048ThemePreview(themeName, canvas) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        
        // Theme colors for 2048
        const themes = {
            default: { bg: '#bbada0', tile: '#cdc1b4', tile2: '#eee4da', tile4: '#ede0c8' },
            dark: { bg: '#1a1a2e', tile: '#16213e', tile2: '#2d3748', tile4: '#4a5568' },
            colorful: { bg: '#ff6b6b', tile: '#fff', tile2: '#ffd93d', tile4: '#ff6b9d' },
            pastel: { bg: '#f8f9fa', tile: '#fff', tile2: '#fff3cd', tile4: '#f8d7da' }
        };
        
        const theme = themes[themeName] || themes.default;
        
        // Draw background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, size, size);
        
        // Draw grid
        const tileSize = size / 4;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 2;
        for (let i = 0; i <= 4; i++) {
            ctx.beginPath();
            ctx.moveTo(i * tileSize, 0);
            ctx.lineTo(i * tileSize, size);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * tileSize);
            ctx.lineTo(size, i * tileSize);
            ctx.stroke();
        }
        
        // Draw sample tiles
        ctx.fillStyle = theme.tile;
        ctx.fillRect(tileSize * 0.1, tileSize * 0.1, tileSize * 0.8, tileSize * 0.8);
        
        ctx.fillStyle = theme.tile2;
        ctx.fillRect(tileSize * 1.1, tileSize * 0.1, tileSize * 0.8, tileSize * 0.8);
        
        ctx.fillStyle = theme.tile4;
        ctx.fillRect(tileSize * 0.1, tileSize * 1.1, tileSize * 0.8, tileSize * 0.8);
    },
    
    // Generate preview for Breakout theme
    generateBreakoutThemePreview(themeName, canvas) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        
        // Theme colors for Breakout
        const themes = {
            default: { bg: '#1a1a2e', paddle: '#4ecdc4', ball: '#ff4757', brick: '#6c5ce7' },
            neon: { bg: '#0a0a1a', paddle: '#00ff88', ball: '#ff0080', brick: '#8000ff' },
            ocean: { bg: '#001f3f', paddle: '#0074d9', ball: '#ff851b', brick: '#39cccc' },
            sunset: { bg: '#2c1810', paddle: '#ff6b35', ball: '#f7931e', brick: '#ffd23f' }
        };
        
        const theme = themes[themeName] || themes.default;
        
        // Draw background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, size, size);
        
        // Draw sample bricks (moved up)
        const brickWidth = size / 4;
        const brickHeight = size / 8;
        ctx.fillStyle = theme.brick;
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(i * brickWidth + 5, 10, brickWidth - 10, brickHeight - 5);
        }
        
        // Draw paddle (moved up to avoid overlap with difficulty)
        ctx.fillStyle = theme.paddle;
        ctx.fillRect(size * 0.3, size * 0.65, size * 0.4, size * 0.05);
        
        // Draw ball (moved up to avoid overlap with difficulty)
        ctx.fillStyle = theme.ball;
        ctx.beginPath();
        ctx.arc(size * 0.5, size * 0.55, size * 0.03, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // Generate preview for Flappy Bird theme
    generateFlappyThemePreview(themeName, canvas) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        
        // Theme colors for Flappy Bird
        const themes = {
            default: { sky: '#4ecdc4', ground: '#45b7b8', bird: '#ff4757', pipe: '#51cf66' },
            day: { sky: '#87ceeb', ground: '#8b7355', bird: '#ff6348', pipe: '#228b22' },
            night: { sky: '#191970', ground: '#2f4f4f', bird: '#ffd700', pipe: '#006400' }
        };
        
        const theme = themes[themeName] || themes.default;
        
        // Draw sky
        ctx.fillStyle = theme.sky;
        ctx.fillRect(0, 0, size, size * 0.7);
        
        // Draw ground
        ctx.fillStyle = theme.ground;
        ctx.fillRect(0, size * 0.7, size, size * 0.3);
        
        // Draw pipe
        ctx.fillStyle = theme.pipe;
        ctx.fillRect(size * 0.6, 0, size * 0.15, size * 0.3);
        ctx.fillRect(size * 0.6, size * 0.7, size * 0.15, size * 0.3);
        
        // Draw bird
        ctx.fillStyle = theme.bird;
        ctx.beginPath();
        ctx.arc(size * 0.3, size * 0.4, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // Generate preview for Breakout difficulty
    generateBreakoutDifficultyPreview(difficultyName, canvas) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        
        const difficulties = {
            easy: { rows: 4, cols: 8, lives: 3, color: '#51cf66', label: 'Easy' },
            medium: { rows: 5, cols: 10, lives: 2, color: '#ffd700', label: 'Medium' },
            hard: { rows: 7, cols: 12, lives: 1, color: '#ff4757', label: 'Hard' }
        };
        
        const diff = difficulties[difficultyName] || difficulties.medium;
        
        // Draw background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, size, size);
        
        // Draw info box
        const boxWidth = size * 0.85;
        const boxHeight = size * 0.5;
        const boxX = (size - boxWidth) / 2;
        const boxY = (size - boxHeight) / 2;
        
        // Box background
        ctx.fillStyle = '#2a2a4a';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        
        // Box border
        ctx.strokeStyle = diff.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // Three sections
        const sectionHeight = boxHeight / 3;
        const sectionY1 = boxY;
        const sectionY2 = boxY + sectionHeight;
        const sectionY3 = boxY + sectionHeight * 2;
        
        // Section dividers
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(boxX, sectionY2);
        ctx.lineTo(boxX + boxWidth, sectionY2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boxX, sectionY3);
        ctx.lineTo(boxX + boxWidth, sectionY3);
        ctx.stroke();
        
        // Text styling
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Section 1: Grid size (AxB)
        ctx.fillText(`${diff.cols}×${diff.rows}`, size / 2, sectionY1 + sectionHeight / 2);
        
        // Section 2: Lives
        ctx.fillText(`${diff.lives} Lives`, size / 2, sectionY2 + sectionHeight / 2);
        
        // Section 3: Difficulty label
        ctx.fillStyle = diff.color;
        ctx.fillText(diff.label, size / 2, sectionY3 + sectionHeight / 2);
    },
    
    // Generate preview for Flappy Bird difficulty
    generateFlappyDifficultyPreview(difficultyName, canvas, currentTheme = 'day') {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        
        const difficulties = {
            easy: { gap: 180, speed: 2, color: '#51cf66' },
            medium: { gap: 160, speed: 2.5, color: '#ffd700' },
            hard: { gap: 140, speed: 3.5, color: '#ff4757' }
        };
        
        const diff = difficulties[difficultyName] || difficulties.medium;
        
        // Theme-based background colors (shades of current theme)
        const themeColors = {
            day: { bg: '#B0E0E6', text: '#1a1a2e' }, // Light sky blue background
            night: { bg: '#2a2a4a', text: '#fff' } // Dark blue background
        };
        
        const themeColor = themeColors[currentTheme] || themeColors.day;
        
        // Draw background with theme color
        ctx.fillStyle = themeColor.bg;
        ctx.fillRect(0, 0, size, size);
        
        // Draw smaller box in center with difficulty text
        const boxWidth = size * 0.6;
        const boxHeight = size * 0.3;
        const boxX = (size - boxWidth) / 2;
        const boxY = (size - boxHeight) / 2;
        
        // Box background (slightly darker shade)
        ctx.fillStyle = currentTheme === 'day' ? '#87CEEB' : '#1a1a3a';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        
        // Box border
        ctx.strokeStyle = diff.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // Difficulty text
        ctx.fillStyle = themeColor.text;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(difficultyName.toUpperCase(), size / 2, size / 2);
    }
};

