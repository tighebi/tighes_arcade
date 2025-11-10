// Optimized rendering system
const Renderer = {
    canvas: null,
    ctx: null,
    gridCache: null,
    needsRedraw: true,
    
    init(canvasElement, theme = 'default') {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.createGridCache(theme);
    },
    
    // Cache grid drawing to avoid redrawing every frame
    createGridCache(theme = 'default') {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = CONFIG.CANVAS_WIDTH;
        tempCanvas.height = CONFIG.CANVAS_HEIGHT;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Draw grid once
        tempCtx.strokeStyle = THEMES[theme].gridColor;
        tempCtx.lineWidth = 1;
        
        for (let i = 0; i <= CONFIG.GRID_WIDTH; i++) {
            tempCtx.beginPath();
            tempCtx.moveTo(i * CONFIG.GRID_SIZE, 0);
            tempCtx.lineTo(i * CONFIG.GRID_SIZE, CONFIG.CANVAS_HEIGHT);
            tempCtx.stroke();
        }
        for (let i = 0; i <= CONFIG.GRID_HEIGHT; i++) {
            tempCtx.beginPath();
            tempCtx.moveTo(0, i * CONFIG.GRID_SIZE);
            tempCtx.lineTo(CONFIG.CANVAS_WIDTH, i * CONFIG.GRID_SIZE);
            tempCtx.stroke();
        }
        
        this.gridCache = tempCanvas;
        this.needsRedraw = true;
    },
    
    // Update grid cache when theme changes
    updateGridCache(theme) {
        if (!this.gridCache) {
            this.createGridCache(theme);
            return;
        }
        const tempCtx = this.gridCache.getContext('2d');
        tempCtx.clearRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        tempCtx.strokeStyle = THEMES[theme].gridColor;
        tempCtx.lineWidth = 1;
        
        for (let i = 0; i <= CONFIG.GRID_WIDTH; i++) {
            tempCtx.beginPath();
            tempCtx.moveTo(i * CONFIG.GRID_SIZE, 0);
            tempCtx.lineTo(i * CONFIG.GRID_SIZE, CONFIG.CANVAS_HEIGHT);
            tempCtx.stroke();
        }
        for (let i = 0; i <= CONFIG.GRID_HEIGHT; i++) {
            tempCtx.beginPath();
            tempCtx.moveTo(0, i * CONFIG.GRID_SIZE);
            tempCtx.lineTo(CONFIG.CANVAS_WIDTH, i * CONFIG.GRID_SIZE);
            tempCtx.stroke();
        }
    },
    
    // Render the game
    render(gameState) {
        if (!this.ctx) return;
        
        const theme = THEMES[gameState.currentTheme];
        const skin = gameState.skin;
        
        // Clear canvas
        this.ctx.fillStyle = theme.bgColor;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // Draw cached grid
        this.ctx.drawImage(this.gridCache, 0, 0);
        
        // Draw food
        this.drawFood(gameState.food, gameState.foodType, theme);
        
        // Draw snake body first
        const bodySegments = gameState.snake.slice(1);
        for (let i = 0; i < bodySegments.length; i++) {
            const segment = bodySegments[i];
            this.ctx.fillStyle = skin.getBodyColor(gameState.frameCount, i + 1);
            this.ctx.fillRect(
                segment.x * CONFIG.GRID_SIZE + 2,
                segment.y * CONFIG.GRID_SIZE + 2,
                CONFIG.GRID_SIZE - 4,
                CONFIG.GRID_SIZE - 4
            );
        }
        
        // Draw snake head last (on top)
        if (gameState.snake.length > 0) {
            const head = gameState.snake[0];
            const headX = head.x * CONFIG.GRID_SIZE + 2;
            const headY = head.y * CONFIG.GRID_SIZE + 2;
            const headSize = CONFIG.GRID_SIZE - 4;
            
            // Head fill
            this.ctx.fillStyle = skin.getHeadColor(gameState.frameCount);
            this.ctx.fillRect(headX, headY, headSize, headSize);
            
            // Head border
            this.ctx.strokeStyle = skin.getHeadBorderColor 
                ? skin.getHeadBorderColor(gameState.frameCount) 
                : '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(headX - 1, headY - 1, headSize + 2, headSize + 2);
        }
    },
    
    // Draw food with optimized rendering
    drawFood(food, foodType, theme) {
        const padding = 2;
        const size = CONFIG.GRID_SIZE - 4;
        const centerX = food.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        const centerY = food.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        const radius = size / 2;
        
        switch(foodType) {
            case 'golden':
                // Golden apple with glow
                this.ctx.shadowBlur = 12;
                this.ctx.shadowColor = '#ffd700';
                this.ctx.fillStyle = '#ffd700';
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.fill();
                // Highlight
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = '#ffed4e';
                this.ctx.beginPath();
                this.ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            case 'bluePotion':
                // Blue potion with glow
                this.ctx.shadowBlur = 12;
                this.ctx.shadowColor = '#4a90e2';
                this.ctx.fillStyle = '#4a90e2';
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
                break;
            case 'redPotion':
                // Red potion with glow
                this.ctx.shadowBlur = 12;
                this.ctx.shadowColor = '#e74c3c';
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
                break;
            case 'scissors':
                // Scissors icon
                this.ctx.fillStyle = '#95a5a6';
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#34495e';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(centerX - radius * 0.4, centerY - radius * 0.4);
                this.ctx.lineTo(centerX + radius * 0.4, centerY + radius * 0.4);
                this.ctx.moveTo(centerX + radius * 0.4, centerY - radius * 0.4);
                this.ctx.lineTo(centerX - radius * 0.4, centerY + radius * 0.4);
                this.ctx.stroke();
                break;
            default:
                // Normal food (apple) - enhanced visibility with glow and white border
                const foodColor = theme.foodColor;
                
                // Draw glow effect (shadow creates the glow)
                this.ctx.save();
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = foodColor;
                this.ctx.fillStyle = foodColor;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
                
                // White border for maximum contrast - ensures visibility against any snake color
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // Main fill (draw again to ensure solid color after border)
                this.ctx.fillStyle = foodColor;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
        }
    }
};

