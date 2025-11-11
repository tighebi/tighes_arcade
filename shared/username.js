// Username management system
const UsernameManager = {
    STORAGE_KEY: 'arcade_username',
    DEFAULT_USERNAME: 'Player',
    
    // Get current username
    getUsername() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored || this.DEFAULT_USERNAME;
    },
    
    // Set username
    setUsername(username) {
        if (username && username.trim().length > 0) {
            // Limit username length to 50 characters (matches database limit)
            const cleanUsername = username.trim().substring(0, 50);
            localStorage.setItem(this.STORAGE_KEY, cleanUsername);
            return cleanUsername;
        }
        return this.DEFAULT_USERNAME;
    },
    
    // Check if username is set (not default)
    hasCustomUsername() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored && stored !== this.DEFAULT_USERNAME;
    },
    
    // Check if username has been set at all (including default)
    hasUsernameSet() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    },
    
    // Show username prompt modal
    showUsernameModal(callback) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('username-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'username-modal';
            modal.className = 'username-modal';
            modal.innerHTML = `
                <div class="username-modal-content">
                    <h2>🎉 High Score!</h2>
                    <p>Enter your username to submit your score to the global leaderboard:</p>
                    <input type="text" id="username-input" placeholder="Enter username" maxlength="50" class="username-input">
                    <div class="username-modal-buttons">
                        <button id="username-submit-btn" class="username-btn username-btn-primary">Submit Score</button>
                    </div>
                    <p class="username-note">Your username will be used for all leaderboard entries</p>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Setup event listeners
            const input = document.getElementById('username-input');
            const submitBtn = document.getElementById('username-submit-btn');
            
            // Focus input
            setTimeout(() => input.focus(), 100);
            
            // Submit on button click
            submitBtn.addEventListener('click', () => {
                this.handleUsernameSubmit(callback);
            });
            
            // Submit on Enter key
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleUsernameSubmit(callback);
                }
            });
            
            // Prevent closing on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    // Optional: prevent closing
                }
            });
        }
        
        // Show modal and update text if needed
        modal.classList.add('active');
        const title = modal.querySelector('h2');
        const description = modal.querySelector('p');
        const submitBtn = document.getElementById('username-submit-btn');
        const note = modal.querySelector('.username-note');
        
        // Update modal content for high score context
        if (title) title.textContent = '🎉 High Score!';
        if (description) description.textContent = 'Enter your username to submit your score to the global leaderboard:';
        if (submitBtn) submitBtn.textContent = 'Submit Score';
        if (note) note.textContent = 'Your username will be used for all leaderboard entries';
        
        const input = document.getElementById('username-input');
        if (input) {
            input.value = this.getUsername() !== this.DEFAULT_USERNAME ? this.getUsername() : '';
            setTimeout(() => input.focus(), 100);
        }
    },
    
    // Handle username submission
    handleUsernameSubmit(callback) {
        const input = document.getElementById('username-input');
        if (!input) return;
        
        const username = input.value.trim();
        if (username.length === 0) {
            // Use default if empty
            this.setUsername(this.DEFAULT_USERNAME);
        } else {
            this.setUsername(username);
        }
        
        // Hide modal
        const modal = document.getElementById('username-modal');
        if (modal) {
            modal.classList.remove('active');
        }
        
        // Call callback if provided
        if (callback) {
            callback(this.getUsername());
        }
    },
    
    // Hide username modal
    hideUsernameModal() {
        const modal = document.getElementById('username-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    // Initialize username check on page load
    init() {
        // Check if username should be prompted (first visit or no custom username)
        // This will be called from index.html or other entry points
        const hasUsername = this.hasUsernameSet();
        return hasUsername;
    }
};

