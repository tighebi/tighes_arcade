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

View all your records in one place on the Hall of Fame page!

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
- **Easy** - Larger paddle, slower ball, smaller grid (5 rows)
- **Medium** - Balanced gameplay, medium speed, standard grid (5 rows) - **Default**
- **Hard** - Smaller paddle, faster ball, larger grid (7 rows)

### Features
- Progressive speed increase as you clear levels
- Multiple levels with increasing difficulty
- Lives system (3 lives)
- Smooth ball physics with proper bouncing
- Visual circle ball rendering
- Score tracking with high scores

### Controls
- **Mouse** - Move paddle with mouse (properly aligned on all screen sizes)
- **Arrow Keys / WASD** - Move paddle left/right
- **Touch** - Touch and drag on mobile (paddle aligns precisely with finger position)
- **SPACE** - Launch ball (when stopped)

## 🐦 Flappy Bird Game Details

### Features
- **Easier starting difficulty** - Faster jumping, thinner pipes, bigger gaps
- Progressive speed increase as you play longer
- Smooth bird physics
- Pipe obstacles with gaps
- Score tracking
- High score system

### Gameplay
- **Click/Tap/SPACE** - Make the bird flap (faster jump for easier control)
- Navigate through pipes (thinner pipes with bigger gaps for easier navigation)
- Score increases as you pass pipes
- Speed gradually increases for added challenge as the game progresses
- Game starts easier but gets progressively more difficult

### Visuals
- Clean, retro-style graphics
- Smooth animations
- Sky gradient background
- Green pipe obstacles

## 🔢 2048 Game Details

### Features
- Fast, smooth slide animations with straight-line movement
- Constant-speed animations (no slowdown for merges)
- Arrow keys or WASD controls
- Swipe gestures on mobile
- Win condition at 2048 (can continue playing)
- Score tracking
- High score system

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
- Top 10 scores per game mode

### Responsive Design
- Works on desktop and mobile devices
- Touch controls for all games
- Adaptive layouts
- Mobile-optimized interfaces
- **Snake game** - Optimized canvas sizing on mobile to ensure all UI elements fit on screen
- **Breakout game** - Precise touch/mouse alignment with paddle on all devices

### Consistent Theming
- Unified visual style across all games
- **Theme-aware UI elements** - Dropdowns and controls match selected theme
- **Theme-matched colors** - All UI elements adapt to theme colors
- Animated background effects (optimized performance)
- Smooth transitions
- Retro arcade aesthetic

## 🕹️ Controls

### Snake
- **Arrow Keys** - Control snake direction
- **SPACE** - Pause/Resume
- **Touch/Swipe** - Mobile controls

### Breakout
- **Mouse/Arrow Keys/WASD** - Move paddle
- **SPACE** - Launch ball
- **Touch/Drag** - Mobile controls

### Flappy Bird
- **Click/Tap/SPACE** - Flap
- **Touch** - Mobile controls

### 2048
- **Arrow Keys/WASD** - Move tiles
- **Swipe** - Mobile controls

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

4. **Snake Customization** (Snake game only)
   - Select a Skin (Classic, Rainbow, Robot)
   - Select a Theme (Default, Night, Garden, Space, Retro)
   - Settings are saved automatically

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
│   └── styles.css          # Shared styles
├── config.js               # Game configuration
├── storage.js              # Snake storage (legacy)
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
- **localStorage API** - Data persistence
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

- High scores saved in browser `localStorage`
- Unified storage system for all games
- Theme and skin preferences saved automatically
- Data persists between browser sessions
- No server or database required
- Automatic migration from legacy formats

## 🌟 Tips & Strategies

### Snake
- **Classic Mode**: Plan your path, use walls strategically
- **Zen Mode**: Relax and experiment with patterns
- **Power-Up Mode**: Save Blue Potions for tight spots, use Red Potions when you have space

### Breakout
- **Easy**: Great for beginners, larger target area
- **Medium**: Balanced challenge
- **Hard**: Fast-paced action, requires quick reflexes
- Aim for corners to maximize bounces
- Watch ball speed increase as levels progress

### Flappy Bird
- **Easier start** - Game begins with easier difficulty (bigger gaps, thinner pipes, faster jump)
- Time your taps carefully - faster jump strength makes control easier
- Focus on the gap, not the pipes - bigger gaps give you more room
- Speed increases gradually as you progress - stay focused as difficulty ramps up
- Take advantage of the easier beginning to build up your score

### 2048
- Keep your highest tile in a corner
- Build in one direction (typically up/left)
- Don't rush - plan your moves
- Watch for new tile spawns

## 📝 Changelog

### Version 3.2 (Current) - Mobile & Gameplay Improvements
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
