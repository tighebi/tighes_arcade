# 🎮 Tighe's Arcade - Retro Classics

A collection of classic retro games built with HTML5 Canvas and JavaScript. Play Snake, Breakout, Flappy Bird, and 2048 - all in one unified arcade experience!

## 🌟 Featured Games

### 🐍 Snake
A modern, feature-rich Snake game with multiple modes and customization options.

### 🧱 Breakout
Classic brick-breaking action with multiple difficulty levels and progressive speed.

### 🐦 Flappy Bird
Tap to fly! Navigate through obstacles and see how far you can go. Speed increases as you progress!

### 🔢 2048
Slide tiles to combine numbers. Can you reach 2048? Features fast, smooth straight-line animations and intuitive controls.

## 🎮 Game Hub

The arcade features a unified game hub where you can:
- Browse all available games
- Access games from a single homepage
- View your high scores across all games
- Navigate easily between games

## 🏆 Hall of Fame

A unified high score system that tracks your personal best across all games:
- Snake (Classic Mode)
- Snake (Power-Up Mode)
- Breakout
- Flappy Bird
- 2048

View all your records in one place on the Hall of Fame page! Each score displays with your username for easy identification.

## 🌐 Global Leaderboard

Compete with players worldwide! The arcade features a global leaderboard powered by Supabase:
- **Submit high scores** to compete globally
- **Top 3 scores** displayed for each game mode
- **Real-time updates** when new scores are submitted
- **Username-based tracking** - scores are associated with your username
- **Automatic submission** - high scores are automatically submitted after you set your username

### Setting Up the Global Leaderboard

To enable the global leaderboard feature, you'll need to set up a Supabase account and configure the database. See `LEADERBOARD_SETUP.md` for detailed instructions.

**Note:** The leaderboard is optional. All games work perfectly without it, using local high score storage only.

## 👤 Username System

Personalize your gaming experience with usernames:
- **Username prompt** appears when you achieve a high score (if not already set)
- **Associates scores** with your username in the Hall of Fame
- **Used for global leaderboard** submissions
- **Stored locally** in your browser
- **Full-length names** - no character limits (up to 50 characters)
- **Changeable** - can be updated when achieving new high scores

## 🐍 Snake Game Details

### Game Modes

#### Classic Mode
The traditional Snake game experience:
- Wall collisions end the game
- Self-collision ends the game
- High score tracking
- Score: 10 points per food

#### Zen Mode
A relaxing, stress-free experience:
- **No walls** - Snake wraps around the edges
- **No self-collision** - Grow as big as you want!
- **No high scores** - Just enjoy the game
- Perfect for seeing how large you can grow

#### Power-Up Mode
An enhanced experience with special items:
- All classic gameplay rules apply
- **Special food types** appear randomly:
  - 🍎 **Golden Apple** (5% chance) - Worth 10 points, appears rarely
  - 🔵 **Blue Potion** (10% chance) - Slows the snake down temporarily
  - 🔴 **Red Potion** (10% chance) - Speeds the snake up temporarily (risk/reward!)
  - ✂️ **Scissors** (10% chance) - Removes last 3 segments (escape hatch)
  - 🍎 **Normal Food** (65% chance) - Standard 10 points
- Separate high score tracking from Classic Mode

### Snake Customization

#### Skins
Change the appearance of your snake:
- **Classic** - Solid colors that match your theme
- **Rainbow** - Animated rainbow colors that cycle
- **Robot** - Metallic gray with alternating segments

#### Themes
Change the game's visual style and background:
- **Default** - Purple/blue gradient theme with cyan/teal snake
- **Night Mode** - Dark purple theme for low-light gaming
- **Garden** - Green nature theme
- **Space** - Deep blue space theme
- **Retro LCD** - Classic green terminal theme

#### Food Visibility
- **Theme-matched food colors** - Apple color changes with each theme for maximum visibility
- **High contrast** - Food is always clearly visible against any snake color
- **Enhanced rendering** - Glow effects and white borders for easy spotting
- Works perfectly with all skins including Rainbow mode

## 🧱 Breakout Game Details

### Difficulty Levels
- **Easy** - Larger paddle, slower ball, smaller grid (4 rows), **3 lives**
- **Medium** - Balanced gameplay, medium speed, standard grid (5 rows), **2 lives** - **Default**
- **Hard** - Smaller paddle, faster ball, larger grid (7 rows), **1 life**

### Themes
Customize the visual style of your game:
- **Default** - Purple/blue theme with colorful bricks
- **Neon** - Dark theme with neon-colored bricks
- **Ocean** - Blue ocean theme with water-colored bricks

### Features
- Progressive speed increase as you clear levels
- Multiple levels with increasing difficulty
- **Lives system** - Difficulty-based lives (Easy=3, Medium=2, Hard=1)
- **No popup on life loss** - Game continues silently when you lose a life (only shows game over when all lives are lost)
- Smooth ball physics with proper bouncing
- Visual circle ball rendering
- Score tracking with high scores
- **Game starts when you move the paddle** - No need to press start, just move!
- **Ball stops when game over** - No bouncing after game ends

### Controls
- **Mouse** - Move paddle with mouse (properly aligned on all screen sizes) - **Game starts automatically**
- **Arrow Keys / WASD** - Move paddle left/right - **Game starts automatically**
- **Touch** - Touch and drag on mobile (paddle aligns precisely with finger position) - **Game starts automatically**
- **SPACE** - Launch ball (when stopped)
- **P** - Pause/Resume game

## 🐦 Flappy Bird Game Details

### Difficulty Levels
Adjust the game's initial difficulty based on bird speed:
- **Easy** - Slower initial speed, easier to control
- **Medium** - Balanced speed - **Default**
- **Hard** - Faster initial speed, more challenging

### Features
- **Easier starting difficulty** - Faster jumping, thinner pipes, bigger gaps
- Progressive speed increase as you play longer
- Smooth bird physics
- Pipe obstacles with gaps
- Score tracking
- High score system
- **Bird starts in center** - Always begins from the middle of the screen
- **Bird resets properly** - No bugs with bird position on start
- **Game over screen** - Full game over menu with tabs (Overview, High Scores, Global Leaderboard)
- **Bird stops when game over** - No movement after losing

### Gameplay
- **Click/Tap/SPACE** - Make the bird flap (faster jump for easier control)
- Navigate through pipes (thinner pipes with bigger gaps for easier navigation)
- Score increases as you pass pipes
- Speed gradually increases for added challenge as the game progresses
- Game starts easier but gets progressively more difficult
- **P** - Pause/Resume game

### Visuals
- Clean, retro-style graphics
- Smooth animations
- Sky gradient background
- Green pipe obstacles

## 🔢 2048 Game Details

### Themes
Customize the visual style of your game:
- **Default** - Classic 2048 theme with warm colors
- **Dark** - Dark mode theme with darker tiles
- **Colorful** - Vibrant, colorful theme
- **Pastel** - Soft, pastel-colored theme

### Features
- Fast, smooth slide animations with straight-line movement
- Constant-speed animations (no slowdown for merges)
- Arrow keys or WASD controls
- Swipe gestures on mobile
- Win condition at 2048 (can continue playing)
- Score tracking
- High score system
- **Centered menu** - Start menu is vertically centered
- **Full-screen background** - Background covers the entire screen, stays fixed when playing
- **Game over screen** - Full game over menu with tabs (Overview, High Scores, Global Leaderboard)
- **P** - Pause/Resume game

### Gameplay
- Slide tiles in four directions
- Tiles with the same number merge when they touch
- New tiles (2 or 4) appear after each move
- Game ends when no moves are possible
- Reach 2048 to win (optional continuation)

### Animations
- Fast, smooth tile sliding animations (1200 px/s constant speed)
- Straight-line movement (horizontal or vertical only)
- Consistent animation speed regardless of distance or merges
- New tile pop animations
- Visual feedback for all moves

## 🎯 Arcade Features

### Navigation System
- Fixed navigation bar on all pages
- Easy switching between games
- Active page highlighting
- Mobile-responsive navigation

### Unified Storage
- All games use the same high score system
- Scores persist across browser sessions
- Automatic migration from old scores
- Top 3 scores per game mode (stored locally)
- **Username association** - All scores are associated with your username
- **Score objects** - Scores stored as objects with username, score, and date

### Game Over Screens
All games feature unified game over screens with tabs:
- **Overview Tab** - Shows final score, "Play Again" button, and "Back to Menu" button
- **High Scores Tab** - Displays your top 3 local high scores with usernames
- **Global Leaderboard Tab** - Shows top 3 global scores (if Supabase is configured)
- **Submit Score Button** - Appears when you achieve a high score (if leaderboard is available)

### Unified Game Flow
All games follow the same start/pause/resume flow:
- **Main Menu** - Customize settings (theme, difficulty) before starting
- **Start Game** - Begin gameplay from the main menu
- **Pause Menu** - Press P or click pause to pause the game
- **Game Over** - Full game over screen with tabs and options
- **Play Again** - Quickly restart the game
- **Back to Menu** - Return to the main menu to change settings

### Responsive Design
- Works on desktop and mobile devices
- Touch controls for all games
- Adaptive layouts
- Mobile-optimized interfaces
- **Snake game** - Optimized canvas sizing on mobile to ensure all UI elements fit on screen
- **Breakout game** - Precise touch/mouse alignment with paddle on all devices
- **2048 game** - Centered menu and full-screen background on all devices

### Consistent Theming
- Unified visual style across all games
- **Theme-aware UI elements** - Dropdowns and controls match selected theme
- **Theme-matched colors** - All UI elements adapt to theme colors
- Animated background effects (optimized performance)
- Smooth transitions
- Retro arcade aesthetic
- **Theme customization** - Breakout and 2048 support multiple themes

## 🕹️ Controls

### Snake
- **Arrow Keys** - Control snake direction
- **SPACE** - Pause/Resume
- **Touch/Swipe** - Mobile controls

### Breakout
- **Mouse/Arrow Keys/WASD** - Move paddle (game starts automatically)
- **SPACE** - Launch ball (when stopped)
- **Touch/Drag** - Mobile controls (game starts automatically)
- **P** - Pause/Resume

### Flappy Bird
- **Click/Tap/SPACE** - Flap
- **Touch** - Mobile controls
- **P** - Pause/Resume

### 2048
- **Arrow Keys/WASD** - Move tiles
- **Swipe** - Mobile controls
- **P** - Pause/Resume

## 🚀 Getting Started

### Installation
1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required!

### How to Play
1. **Start the Arcade**
   - Open `index.html` in your browser
   - Game hub will appear automatically

2. **Select a Game**
   - Click on any game card
   - Game will load with instructions

3. **Play and Compete**
   - Play any game to set high scores
   - View all scores in the Hall of Fame
   - Switch between games easily
   - **Set up Global Leaderboard** (optional) - See `LEADERBOARD_SETUP.md` for instructions

4. **Customize Your Games**
   - **Snake**: Select a Skin (Classic, Rainbow, Robot) and Theme (Default, Night, Garden, Space, Retro)
   - **Breakout**: Choose Difficulty (Easy, Medium, Hard) and Theme (Default, Neon, Ocean)
   - **Flappy Bird**: Select Difficulty (Easy, Medium, Hard) based on initial speed
   - **2048**: Choose Theme (Default, Dark, Colorful, Pastel)
   - Settings are saved automatically

5. **Username System**
   - Username prompt appears when you achieve a high score (if not already set)
   - Usernames are associated with all your scores
   - Used for global leaderboard submissions

## 📁 File Structure

```
snake_game/
├── index.html              # Game hub homepage
├── hall-of-fame.html       # Unified high scores
├── games/
│   ├── snake.html          # Snake game
│   ├── breakout.html       # Breakout game
│   ├── breakout.js         # Breakout logic
│   ├── flappy.html         # Flappy Bird game
│   ├── flappy.js           # Flappy Bird logic
│   ├── 2048.html           # 2048 game
│   └── 2048.js             # 2048 logic
├── shared/
│   ├── nav.js              # Navigation system
│   ├── storage.js          # Unified storage
│   ├── username.js         # Username management
│   └── styles.css          # Shared styles
├── config.js               # Game configuration (includes Supabase config)
├── leaderboard.js          # Global leaderboard integration
├── storage.js              # Snake storage (legacy)
├── LEADERBOARD_SETUP.md    # Leaderboard setup instructions
├── skins.js                # Snake skins
├── renderer.js             # Snake rendering
├── game-logic.js           # Snake game logic
├── controls.js             # Snake controls
├── menu.js                 # Snake menu system
├── game.js                 # Snake main game
├── style.css               # Main styling
├── background.js           # Background animation
└── README.md               # This file
```

## 🛠️ Technical Details

### Technologies
- **HTML5 Canvas** - Game rendering
- **Vanilla JavaScript** - Game logic (no frameworks)
- **CSS3** - Styling and animations
- **localStorage API** - Local data persistence
- **Supabase** - Global leaderboard (optional, cloud-based)
- **Fetch API** - HTTP requests for leaderboard
- **requestAnimationFrame** - Smooth animations

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern mobile browsers

### Performance
- Smooth 60 FPS rendering
- Optimized game loops with requestAnimationFrame
- Efficient collision detection
- Lightweight codebase
- Cached rendering (grids, backgrounds)
- **Batched rendering** - Snake segments drawn in batches for optimal performance with long snakes
- **Background animation throttling** - Reduced to 30 FPS when page is visible, paused when hidden
- **Optimized for long games** - Snake game remains smooth even with 100+ segments

## 💾 Data Storage

### Local Storage
- High scores saved in browser `localStorage`
- Unified storage system for all games
- Theme and skin preferences saved automatically
- Username stored locally
- Data persists between browser sessions
- No server or database required for local play
- Automatic migration from legacy formats
- Top 3 scores per game mode stored locally

### Global Leaderboard (Optional)
- **Supabase integration** - Cloud-based leaderboard storage
- **Real-time updates** - See latest scores from all players
- **Top 3 scores** - Displayed per game mode
- **Username-based** - Scores associated with usernames
- **Secure** - Row Level Security (RLS) policies protect data
- **Free tier** - Supabase free tier is sufficient for most use cases
- See `LEADERBOARD_SETUP.md` for setup instructions

## 🌟 Tips & Strategies

### Snake
- **Classic Mode**: Plan your path, use walls strategically
- **Zen Mode**: Relax and experiment with patterns
- **Power-Up Mode**: Save Blue Potions for tight spots, use Red Potions when you have space

### Breakout
- **Easy**: Great for beginners, larger target area, 3 lives for more chances
- **Medium**: Balanced challenge, 2 lives
- **Hard**: Fast-paced action, requires quick reflexes, only 1 life
- Aim for corners to maximize bounces
- Watch ball speed increase as levels progress
- Game starts when you move the paddle - no need to press start
- You won't see a popup when losing a life - only when all lives are lost

### Flappy Bird
- **Easier start** - Game begins with easier difficulty (bigger gaps, thinner pipes, faster jump)
- **Difficulty levels** - Adjust initial speed based on your skill level
- Time your taps carefully - faster jump strength makes control easier
- Focus on the gap, not the pipes - bigger gaps give you more room
- Speed increases gradually as you progress - stay focused as difficulty ramps up
- Take advantage of the easier beginning to build up your score
- Bird always starts in the center - no position bugs

### 2048
- Keep your highest tile in a corner
- Build in one direction (typically up/left)
- Don't rush - plan your moves
- Watch for new tile spawns

## 📝 Changelog

### Version 4.0 (Current) - Global Leaderboard & Enhanced Features
- **Global Leaderboard System**:
  - Supabase integration for cloud-based leaderboards
  - Top 3 scores displayed per game mode
  - Real-time score updates
  - Username-based score tracking
  - Automatic score submission for high scores
  - Optional feature - games work without it
- **Username System**:
  - Username prompt when achieving high scores
  - Full-length usernames (up to 50 characters)
  - Usernames associated with all scores
  - Stored locally in browser
- **Enhanced Game Over Screens**:
  - Unified game over menu across all games
  - Tabbed interface (Overview, High Scores, Global Leaderboard)
  - Overview tab with "Play Again" and "Back to Menu" options
  - Submit score button for high scores
  - Username modal for high score submissions
- **Breakout Improvements**:
  - Difficulty-based lives (Easy=3, Medium=2, Hard=1)
  - Theme customization (Default, Neon, Ocean)
  - Game starts when paddle moves (no start button needed)
  - No popup when losing a life (only when all lives are lost)
  - Ball stops immediately when game over
  - Improved game state management
- **Flappy Bird Improvements**:
  - Difficulty levels (Easy, Medium, Hard) based on initial speed
  - Bird always starts in center of screen
  - Fixed bird position bugs on start
  - Bird stops when game over
  - Full game over screen with tabs
  - Improved game state management
- **2048 Improvements**:
  - Theme customization (Default, Dark, Colorful, Pastel)
  - Centered start menu (vertically centered)
  - Full-screen background coverage
  - Background stays fixed when playing
  - Full game over screen with tabs
- **Unified Game Flow**:
  - Consistent start/pause/resume flow across all games
  - Main menu for customization before starting
  - Pause menu with resume option
  - Game over screen with play again and back to menu
  - "Back to Menu" returns to main menu to change settings

### Version 3.2 - Mobile & Gameplay Improvements
- **Flappy Bird Improvements**:
  - Easier starting difficulty - faster jump strength (-11 vs -8)
  - Thinner pipes (45px vs 60px) for easier navigation
  - Bigger pipe gaps (180px vs 150px) for more room
  - Slower initial speed (2.5 vs 3.5) for easier beginning
  - Increased speed progression rate to maintain challenge as game progresses
- **Breakout Mobile Fixes**:
  - Fixed paddle alignment with finger/touch position on mobile
  - Proper canvas coordinate scaling for accurate touch tracking
  - Mouse controls also account for canvas scaling on all devices
  - Added touchstart handler for immediate paddle response
- **Snake Mobile Optimizations**:
  - Reduced canvas size on mobile (max 350px, min 280px) to ensure all UI elements fit
  - More conservative height calculations to prevent UI overflow
  - Better space allocation for header, score, controls, and mobile controls

### Version 3.1 - Performance & Polish Update
- **Performance Optimizations**:
  - Batched rendering for Snake game - handles long snakes (100+ segments) smoothly
  - Background animation throttled to 30 FPS and paused when page hidden
  - Optimized robot skin rendering (2 batches instead of N draws)
  - Classic skin uses single-batch rendering for maximum performance
- **2048 Animation Improvements**:
  - Faster sliding animations (1200 px/s constant speed)
  - Straight-line movement enforcement (horizontal or vertical only)
  - Consistent animation speed regardless of distance or merges
  - Linear timing for constant velocity
- **UI Enhancements**:
  - Theme-aware dropdowns - all select elements match theme colors
  - Clean dropdown design with theme-colored borders
  - Themed dropdown options for visual consistency
- **Snake Game Enhancements**:
  - Theme-matched food colors for maximum visibility
  - Enhanced food rendering with glow effects and white borders
  - Food colors optimized for each theme (high contrast)
  - Fixed retro theme food color (was same as snake head)

### Version 3.0 - Arcade Edition
- **Added Breakout game** with difficulty levels
- **Added Flappy Bird game** with progressive speed
- **Added 2048 game** with smooth animations
- **Created Game Hub** - unified homepage
- **Added Navigation System** - easy game switching
- **Created Hall of Fame** - unified high scores
- **Unified Storage System** - all games use same storage
- **Improved Breakout** - better physics, difficulty levels, visual improvements
- **Improved Flappy Bird** - progressive speed, better visuals
- **Improved 2048** - slide animations, smooth gameplay

### Version 2.0
- Added Zen Mode (no walls, no self-collision)
- Added Power-Up Mode with special items
- Added menu system
- Added pause functionality
- Added theme system (5 themes)
- Added skin system (3 skins)
- Enhanced snake head visibility
- Improved mobile controls
- Stable background animations
- Separate high score tracking
- Optimized performance with requestAnimationFrame
- Modular code structure

### Version 1.0
- Classic Snake gameplay
- Basic high score tracking
- Mobile support

## 👤 Author

**Tighe Billings**
- Email: tigheb@bu.edu

## 📄 License

© 2025 All rights reserved

## 🙏 Acknowledgments

- Classic arcade game inspiration
- Modern web technologies
- Retro gaming community

---

**Enjoy playing!** 🎮🎮🎮

For questions or concerns, contact: tigheb@bu.edu
