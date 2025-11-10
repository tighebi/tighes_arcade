// Shared navigation component
const Navigation = {
    getBasePath() {
        // Determine base path based on current location
        const path = window.location.pathname;
        if (path.includes('/games/')) {
            return '../';
        }
        return './';
    },
    
    init() {
        this.createNavigation();
    },
    
    createNavigation() {
        const basePath = this.getBasePath();
        const nav = document.createElement('nav');
        nav.className = 'main-nav';
        nav.innerHTML = `
            <div class="nav-container">
                <a href="${basePath}index.html" class="nav-logo">🎮 Tighe's Arcade</a>
                <div class="nav-links">
                    <a href="${basePath}index.html" class="nav-link" data-page="home">Home</a>
                    <a href="${basePath}games/snake.html" class="nav-link" data-page="snake">Snake</a>
                    <a href="${basePath}games/breakout.html" class="nav-link" data-page="breakout">Breakout</a>
                    <a href="${basePath}games/flappy.html" class="nav-link" data-page="flappy">Flappy Bird</a>
                    <a href="${basePath}games/2048.html" class="nav-link" data-page="2048">2048</a>
                    <a href="${basePath}hall-of-fame.html" class="nav-link" data-page="hall">Hall of Fame</a>
                </div>
            </div>
        `;
        
        // Insert at the beginning of body
        document.body.insertBefore(nav, document.body.firstChild);
        
        // Highlight current page
        this.highlightCurrentPage();
    },
    
    highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const page = link.getAttribute('data-page');
            const href = link.getAttribute('href');
            const fileName = currentPath.split('/').pop() || 'index.html';
            
            // Check if this link matches current page
            if ((fileName === 'index.html' && page === 'home') ||
                (fileName.includes('snake') && page === 'snake') ||
                (fileName.includes('breakout') && page === 'breakout') ||
                (fileName.includes('flappy') && page === 'flappy') ||
                (fileName.includes('2048') && page === '2048') ||
                (fileName.includes('hall-of-fame') && page === 'hall')) {
                link.classList.add('active');
            }
        });
    }
};

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Navigation.init());
} else {
    Navigation.init();
}

