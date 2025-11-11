# Global Leaderboard Setup Guide

This guide will help you set up the global leaderboard feature for all arcade games using Supabase.

## Prerequisites

1. A free Supabase account (sign up at https://supabase.com)
2. Basic knowledge of SQL (for creating the database table)

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in (or create an account)
2. Click "New Project"
3. Fill in your project details:
   - Name: Choose a name (e.g., "snake-game-leaderboard")
   - Database Password: Create a strong password (save this!)
   - Region: Choose the region closest to your users
4. Click "Create new project"
5. Wait for the project to be created (this may take a few minutes)

## Step 2: Create the Database Table

1. In your Supabase project, go to the "SQL Editor" in the left sidebar
2. Click "New Query"
3. Paste the following SQL code: 

```sql
CREATE TABLE arcade_leaderboard (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    game_mode VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster queries
CREATE INDEX idx_arcade_leaderboard_mode_score ON arcade_leaderboard(game_mode, score DESC);

-- Enable Row Level Security (RLS) for public read access
ALTER TABLE arcade_leaderboard ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the leaderboard
CREATE POLICY "Allow public read access" ON arcade_leaderboard
    FOR SELECT
    USING (true);

-- Create a policy that allows anyone to insert scores
CREATE POLICY "Allow public insert" ON arcade_leaderboard
    FOR INSERT
    WITH CHECK (true);
```

**Note:** The `game_mode` field supports the following values:
- `classic` - Snake (Classic Mode)
- `powerup` - Snake (Power-Up Mode)
- `breakout` - Breakout game
- `flappy` - Flappy Bird game
- `2048` - 2048 game

**Important:** If you already have an `arcade_leaderboard` table with `VARCHAR(3)` for the name field, you'll need to alter it to support longer usernames:

```sql
ALTER TABLE arcade_leaderboard ALTER COLUMN name TYPE VARCHAR(50);
```

4. Click "Run" to execute the SQL
5. You should see a success message

## Step 3: Get Your Supabase Credentials

1. In your Supabase project, go to "Settings" (gear icon in the left sidebar)
2. Click on "API" in the settings menu
3. You'll find two important values:
   - **Project URL**: This is your `SUPABASE_URL`
   - **anon public key**: This is your `SUPABASE_ANON_KEY`

## Step 4: Configure the Game

1. Open `config.js` in your project
2. Find the Supabase configuration section (near the end of the file)
3. Replace the empty strings with your credentials:

```javascript
CONFIG.SUPABASE_URL = 'https://your-project-id.supabase.co'; // Your Project URL
CONFIG.SUPABASE_ANON_KEY = 'your-anon-key-here'; // Your anon/public key
```

4. Save the file

## Step 5: Test the Leaderboard

1. Open your game in a web browser
2. Play a game (Snake, Breakout, Flappy Bird, or 2048) and get a score
3. When you achieve a high score, you'll be prompted to enter your username
4. Enter your username (up to 50 characters) and click "Submit Score"
5. Your score will be automatically submitted to the global leaderboard
6. Click on the "Global Leaderboard" tab to see your score (top 3 scores per game)
7. The leaderboard shows the top 3 scores for each game mode with full usernames

## Troubleshooting

### Leaderboard not showing up

- Check the browser console (F12) for any error messages
- Verify that your Supabase URL and anon key are correct in `config.js`
- Make sure the Supabase script is loaded in your HTML (check `games/snake.html`)

### Cannot submit scores

- Check that the database table was created successfully
- Verify that the Row Level Security (RLS) policies are set up correctly
- Check the browser console for specific error messages
- Make sure your Supabase project is active (not paused)

### Scores not appearing in leaderboard

- Refresh the leaderboard tab
- Check that scores are being inserted into the database (go to Supabase > Table Editor > arcade_leaderboard)
- Verify that the game_mode matches when fetching (classic, powerup, breakout, flappy, or 2048)
- The leaderboard only displays the top 3 scores per game mode

## Security Notes

- The anon key is safe to use in client-side code (it's designed for this)
- Row Level Security (RLS) policies control who can read/write to the database
- The current setup allows anyone to read and insert scores (which is fine for a public leaderboard)
- For production, you might want to add rate limiting or validation on the Supabase side

## Additional Features (Optional)

### Add Indexes for Better Performance

If you expect many scores, you can add additional indexes:

```sql
CREATE INDEX idx_arcade_leaderboard_created_at ON arcade_leaderboard(created_at DESC);
```

### Clean Up Old Scores

To keep only the top 3 scores per game mode (matching the display limit), you can create a function:

```sql
CREATE OR REPLACE FUNCTION cleanup_old_scores()
RETURNS void AS $$
BEGIN
    -- Keep only top 3 scores per game_mode
    DELETE FROM arcade_leaderboard
    WHERE id NOT IN (
        SELECT id FROM (
            SELECT id, ROW_NUMBER() OVER (PARTITION BY game_mode ORDER BY score DESC) as rn
            FROM arcade_leaderboard
        ) ranked
        WHERE rn <= 3
    );
END;
$$ LANGUAGE plpgsql;
```

**Note:** The leaderboard is configured to show only the top 3 scores per game mode to keep it competitive and focused on the best players.

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check the Supabase dashboard for any errors
3. Verify your database table structure matches the SQL above
4. Make sure your Supabase project is not paused

## Supported Games

The leaderboard currently supports the following games:
- **Snake (Classic)** - Classic snake game mode
- **Snake (Power-Up)** - Snake game with power-ups
- **Breakout** - Break all the bricks!
- **Flappy Bird** - Navigate through obstacles
- **2048** - Slide tiles to combine numbers

Each game mode maintains its own top 3 leaderboard.

Happy gaming! 🎮🏆

