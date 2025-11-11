// Global Leaderboard Service using Supabase
// This handles submitting scores and fetching the global leaderboard

const Leaderboard = {
    // Initialize Supabase client
    init() {
        // Check if Supabase is configured
        if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY || 
            CONFIG.SUPABASE_URL === '' || CONFIG.SUPABASE_ANON_KEY === '') {
            console.warn('Supabase not configured. Leaderboard features will be disabled.');
            console.info('To enable the leaderboard, configure SUPABASE_URL and SUPABASE_ANON_KEY in config.js');
            return false;
        }
        
        // Initialize Supabase client (will be loaded from CDN)
        if (typeof supabase === 'undefined') {
            console.warn('Supabase client not loaded. Make sure to include the Supabase script in your HTML.');
            return false;
        }
        
        try {
            this.client = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
            return true;
        } catch (error) {
            console.error('Error initializing Supabase client:', error);
            return false;
        }
    },
    
    // Submit a score to the global leaderboard
    async submitScore(name, score, gameMode) {
        if (!this.client) {
            if (!this.init()) {
                return { success: false, error: 'Leaderboard not configured' };
            }
        }
        
        try {
            // Validate inputs
            if (!name || name.trim().length === 0) {
                return { success: false, error: 'Name is required' };
            }
            if (name.length > 3) {
                name = name.substring(0, 3).toUpperCase();
            } else {
                name = name.toUpperCase();
            }
            
            if (typeof score !== 'number' || score < 0) {
                return { success: false, error: 'Invalid score' };
            }
            
            // Map game modes to database values
            const mode = gameMode === 'powerup' ? 'powerup' : 'classic';
            
            // Insert into Supabase
            const { data, error } = await this.client
                .from('snake_leaderboard')
                .insert([
                    {
                        name: name.trim(),
                        score: score,
                        game_mode: mode,
                        created_at: new Date().toISOString()
                    }
                ])
                .select();
            
            if (error) {
                console.error('Error submitting score:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Exception submitting score:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Fetch top scores from the global leaderboard
    async getLeaderboard(gameMode = 'classic', limit = 10) {
        if (!this.client) {
            if (!this.init()) {
                return { success: false, error: 'Leaderboard not configured', scores: [] };
            }
        }
        
        try {
            const mode = gameMode === 'powerup' ? 'powerup' : 'classic';
            
            // Fetch top scores from Supabase, ordered by score descending
            const { data, error } = await this.client
                .from('snake_leaderboard')
                .select('name, score, created_at')
                .eq('game_mode', mode)
                .order('score', { ascending: false })
                .limit(limit);
            
            if (error) {
                console.error('Error fetching leaderboard:', error);
                return { success: false, error: error.message, scores: [] };
            }
            
            return { success: true, scores: data || [] };
        } catch (error) {
            console.error('Exception fetching leaderboard:', error);
            return { success: false, error: error.message, scores: [] };
        }
    },
    
    // Check if leaderboard is available
    isAvailable() {
        return !!this.client && !!CONFIG.SUPABASE_URL && !!CONFIG.SUPABASE_ANON_KEY;
    }
};

