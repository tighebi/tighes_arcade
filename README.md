# Tighe's Arcade - Retro Classics

A collection of classic games built with HTML5 Canvas and JavaScript. The arcade includes Snake, Breakout, Flappy Bird, and 2048 in one website.

## Featured Games

### Snake

A Snake game with multiple game modes, skins, and themes.

### Breakout

A brick-breaking game with three difficulty levels and increasing ball speed.

### Flappy Bird

A Flappy Bird-style game where the player navigates through pipes while the speed increases over time.

### 2048

A 2048 game where numbered tiles are combined to reach the 2048 tile. The game includes keyboard and touch controls.

## Game Hub

The arcade has a central game hub where players can:

* Browse all available games
* Access each game from one homepage
* View high scores across all games
* Switch between games

## Hall of Fame

The Hall of Fame keeps track of local high scores for:

* Snake (Classic Mode)
* Snake (Power-Up Mode)
* Breakout
* Flappy Bird
* 2048

Scores are displayed with the username associated with each score.

## Global Leaderboard

The arcade can use Supabase for a global leaderboard:

* **High score submission** - Submit scores to the global leaderboard
* **Top 3 scores** - Display the top three scores for each game mode
* **Real-time updates** - Update the leaderboard when new scores are submitted
* **Username tracking** - Associate scores with usernames
* **Automatic submission** - Automatically submit qualifying scores after a username is set

### Setting Up the Global Leaderboard

The global leaderboard requires a Supabase account and database configuration. See `LEADERBOARD_SETUP.md` for setup instructions.

The leaderboard is optional. The games can be played without Supabase using local high score storage.

## Username System

Players can set a username that is used for their scores:

* A username prompt appears when a player gets a high score and does not already have a username
* Scores are associated with the username
* The username is used for global leaderboard submissions
* Usernames are stored locally in the browser
* Usernames can be up to 50 characters
* Usernames can be changed when setting a new high score

## Snake Game Details

### Game Modes

#### Classic Mode

The standard Snake game:

* Hitting a wall ends the game
* Hitting the snake's own body ends the game
* High scores are tracked
* Food is worth 10 points

#### Zen Mode

A version of Snake without the normal collision restrictions:

* The snake wraps around the edges of the screen
* The snake cannot collide with itself
* High scores are not tracked
* The game can continue as the snake grows

#### Power-Up Mode

Classic Snake gameplay with additional items:

* Classic collision rules apply
* Special food types can appear during the game:

  * **Golden Apple** (5% chance) - Worth 10 points
  * **Blue Potion** (10% chance) - Temporarily slows the snake
  * **Red Potion** (10% chance) - Temporarily speeds up the snake
  * **Scissors** (10% chance) - Removes the last three segments
  * **Normal Food** (65% chance) - Worth 10 points
* Power-Up Mode has its own high score tracking

### Snake Customization

#### Skins

The snake can use one of three skins:

* **Classic** - Solid colors based on the selected theme
* **Rainbow** - Animated colors that cycle through the rainbow
* **Robot** - Metallic gray with alternating segments

#### Themes

The game supports several visual themes:

* **Default** - Purple and blue gradient with a cyan/teal snake
* **Night Mode** - Dark purple theme
* **Garden** - Green nature theme
* **Space** - Dark blue space theme
* **Retro LCD** - Green terminal-style theme

#### Food Visibility

Food colors adjust to the selected theme:

* Food colors match the current theme
* Food uses high-contrast colors against the snake
* Glow effects and white borders make food easier to see
* Food visibility works with all skins, including Rainbow

## Breakout Game Details

### Difficulty Levels

* **Easy** - Larger paddle, slower ball, four rows of bricks, and three lives
* **Medium** - Medium paddle and ball speed, five rows of bricks, and two lives. This is the default.
* **Hard** - Smaller paddle, faster ball, seven rows of bricks, and one life

### Themes

Breakout has three visual themes:

* **Default** - Purple and blue theme with colorful bricks
* **Neon** - Dark theme with neon-colored bricks
* **Ocean** - Blue theme with water-colored bricks

### Features

* Ball speed increases as levels are cleared
* Multiple levels with increasing difficulty
* Number of lives depends on the selected difficulty
* Losing a life does not show a popup; the game continues until all lives are lost
* Ball physics include standard bouncing
* Ball is rendered as a circle
* High scores are tracked
* The game starts when the paddle is moved
* The ball stops when the game ends

### Controls

* **Mouse** - Move the paddle. The game starts when the paddle is moved.
* **Arrow Keys / WASD** - Move the paddle. The game starts when the paddle is moved.
* **Touch** - Drag the paddle on mobile. The game starts when the paddle is moved.
* **SPACE** - Launch the ball when it is stopped
* **P** - Pause or resume the game

## Flappy Bird Game Details

### Difficulty Levels

The difficulty setting changes the bird's initial speed:

* **Easy** - Slower starting speed
* **Medium** - Default starting speed
* **Hard** - Faster starting speed

### Features

* Easier starting difficulty
* Speed increases as the game progresses
* Bird physics with jumping and gravity
* Pipe obstacles
* Score tracking
* High score tracking
* Bird starts in the center of the screen
* Bird position resets correctly when starting a new game
* Game over screen with Overview, High Scores, and Global Leaderboard tabs
* Bird stops moving when the game ends

### Gameplay

* **Click / Tap / SPACE** - Make the bird flap
* Navigate through the gaps between pipes
* Score increases after passing pipes
* Speed increases as the game progresses
* The game starts at a lower difficulty and becomes harder over time
* **P** - Pause or resume the game

### Visuals

* Retro-style graphics
* Animated gameplay
* Sky gradient background
* Green pipe obstacles

## 2048 Game Details

### Themes

The game includes four themes:

* **Default** - Classic 2048 color scheme
* **Dark** - Darker tile colors
* **Colorful** - Bright, varied tile colors
* **Pastel** - Pastel-colored tiles

### Features

* Tile sliding animations
* Constant animation speed
* Arrow key and WASD controls
* Swipe controls on mobile
* Reaching 2048 triggers the win condition, but the game can continue
* Score tracking
* High score tracking
* Centered start menu
* Full-screen background
* Game over screen with Overview, High Scores, and Global Leaderboard tabs
* **P** - Pause or resume the game

### Gameplay

* Move tiles in four directions
* Tiles with the same number merge when they touch
* A new 2 or 4 tile appears after each move
* The game ends when no moves are available
* Reaching 2048 completes the win condition, but the player can continue

### Animations

* Tiles move at a constant speed of 1200 px/s
* Tiles move horizontally or vertically
* Animation speed does not change based on distance or merges
* New tiles use a pop animation
* Moves include visual feedback

## Arcade Features

### Navigation System

* Fixed navigation bar on all pages
* Links between the different games
* Current page is highlighted
* Navigation works on mobile devices

### Unified Storage

All games use the same high score system:

* Scores persist between browser sessions
* Existing scores can be migrated from older formats
* The top three scores for each game mode are stored locally
* Scores are associated with a username
* Scores are stored with the username, score, and date

### Game Over Screens

Each game uses the same general game over layout:

* **Overview Tab** - Shows the final score and options to play again or return to the menu
* **High Scores Tab** - Shows the player's top three local scores
* **Global Leaderboard Tab** - Shows the top three global scores when Supabase is configured
* **Submit Score Button** - Appears when a player gets a high score and the global leaderboard is available

### Unified Game Flow

The games use the same basic menu and game flow:

* **Main Menu** - Choose settings such as theme or difficulty
* **Start Game** - Begin the game
* **Pause Menu** - Pause the game with P or the pause button
* **Game Over** - View the final score and available options
* **Play Again** - Restart the current game
* **Back to Menu** - Return to the main menu and change settings

### Responsive Design

* Supports desktop and mobile devices
* Touch controls are available for all games
* Layouts adjust to different screen sizes
* Interfaces are optimized for mobile
* **Snake** - Canvas size adjusts on mobile so the game and controls fit on screen
* **Breakout** - Touch and mouse controls account for screen scaling
* **2048** - Start menu and background adjust to the screen size

### Consistent Theming

* Games use a shared visual style
* UI elements adjust to the selected theme
* Dropdowns and controls use theme colors
* Background animations are used across the arcade
* Page transitions use animations
* Breakout and 2048 support multiple themes

## Controls

### Snake

* **Arrow Keys** - Control the snake
* **SPACE** - Pause or resume
* **Touch / Swipe** - Mobile controls

### Breakout

* **Mouse / Arrow Keys / WASD** - Move the paddle
* **SPACE** - Launch the ball when stopped
* **Touch / Drag** - Mobile controls
* **P** - Pause or resume

### Flappy Bird

* **Click / Tap / SPACE** - Make the bird flap
* **Touch** - Mobile controls
* **P** - Pause or resume

### 2048

* **Arrow Keys / WASD** - Move the tiles
* **Swipe** - Mobile controls
* **P** - Pause or resume

## Getting Started

### Installation

1. Clone or download the repository.
2. Open `index.html` in a modern web browser.
3. No build process or external dependencies are required.

### How to Play

1. **Start the Arcade**

   * Open `index.html` in a browser.
   * The game hub will open automatically.

2. **Select a Game**

   * Select a game card from the homepage.
   * The selected game will open with its instructions.

3. **Play and Compete**

   * Play any game and set a high score.
   * View scores from the Hall of Fame.
   * Switch between games using the navigation bar.
   * To enable the global leaderboard, follow the instructions in `LEADERBOARD_SETUP.md`.

4. **Customize Your Games**

   * **Snake** - Choose a skin and theme.
   * **Breakout** - Choose a difficulty and theme.
   * **Flappy Bird** - Choose a difficulty based on the starting speed.
   * **2048** - Choose a theme.
   * Settings are saved automatically.

5. **Username System**

   * A username prompt appears when a player gets a high score without an existing username.
   * Usernames are attached to scores.
   * Usernames are also used for global leaderboard submissions.

## File Structure

```text
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
├── config.js               # Game configuration and Supabase settings
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
├── background.js            # Background animation
└── README.md               # Project documentation
```

## Technical Details

### Technologies

* **HTML5 Canvas** - Game rendering
* **Vanilla JavaScript** - Game logic
* **CSS3** - Styling and animations
* **localStorage API** - Local data storage
* **Supabase** - Optional global leaderboard
* **Fetch API** - HTTP requests for the leaderboard
* **requestAnimationFrame** - Game and animation updates

### Browser Compatibility

The arcade is designed to work with:

* Chrome / Edge
* Firefox
* Safari
* Modern mobile browsers

### Performance

* 60 FPS game rendering
* Game loops use `requestAnimationFrame`
* Collision detection is optimized
* Lightweight codebase
* Cached rendering for grids and backgrounds
* Snake segments are rendered in batches
* Background animation is reduced to 30 FPS when the page is visible and paused when the page is hidden
* Snake remains playable with 100+ segments

## Data Storage

### Local Storage

* High scores are stored in browser `localStorage`
* All games use the same storage system
* Theme and skin preferences are saved automatically
* Username is stored locally
* Data persists between browser sessions
* Local play does not require a server or database
* Older storage formats are migrated automatically
* The top three scores for each game mode are stored locally

### Global Leaderboard (Optional)

* Uses Supabase for cloud-based score storage
* Leaderboard updates when new scores are submitted
* Top three scores are displayed for each game mode
* Scores are associated with usernames
* Row Level Security (RLS) policies are used to protect the database
* Supabase's free tier is sufficient for most use cases
* See `LEADERBOARD_SETUP.md` for setup instructions

## Tips & Strategies

### Snake

* **Classic Mode** - Plan your path and use the walls to your advantage
* **Zen Mode** - Experiment with different movement patterns
* **Power-Up Mode** - Save Blue Potions for difficult situations and use Red Potions when there is enough space

### Breakout

* **Easy** - Useful for learning the game, with a larger paddle and three lives
* **Medium** - Balanced difficulty with two lives
* **Hard** - Faster gameplay with one life
* Aim toward the corners to create more bounces
* Pay attention to the increasing ball speed
* The game starts when you move the paddle
* Losing a life does not produce a popup; the popup appears only when all lives are lost

### Flappy Bird

* The game starts with larger gaps and thinner pipes
* Difficulty changes the bird's initial speed
* Time your taps based on the bird's movement
* Focus on the gap between the pipes
* The speed increases as the game progresses
* Use the easier beginning of the game to build a score
* The bird starts in the center of the screen

### 2048

* Keep the highest tile in a corner
* Try to build tiles in one direction
* Plan moves before making them
* Pay attention to where new tiles appear

## Changelog

### Version 4.0 (Current) - Global Leaderboard and Game Updates

* **Global Leaderboard**

  * Added Supabase integration
  * Added top three scores for each game mode
  * Added real-time score updates
  * Added username-based score tracking
  * Added automatic score submission
  * Made the leaderboard optional

* **Username System**

  * Added username prompt for high scores
  * Added support for usernames up to 50 characters
  * Associated usernames with scores
  * Stored usernames locally

* **Game Over Screens**

  * Added a shared game over menu
  * Added Overview, High Scores, and Global Leaderboard tabs
  * Added Play Again and Back to Menu options
  * Added score submission for qualifying scores
  * Added username prompt for score submissions

* **Breakout**

  * Added difficulty-based lives
  * Added Default, Neon, and Ocean themes
  * Changed the game to start when the paddle moves
  * Removed the popup that appears after losing an individual life
  * Made the ball stop immediately when the game ends
  * Updated game state management

* **Flappy Bird**

  * Added Easy, Medium, and Hard difficulty levels
  * Changed the bird to start in the center of the screen
  * Fixed bird position issues when starting a game
  * Made the bird stop when the game ends
  * Added the shared game over screen
  * Updated game state management

* **2048**

  * Added Default, Dark, Colorful, and Pastel themes
  * Centered the start menu vertically
  * Added full-screen background coverage
  * Kept the background fixed during gameplay
  * Added the shared game over screen

* **Unified Game Flow**

  * Added a consistent start, pause, resume, and game over flow
  * Added a main menu for game settings
  * Added a pause menu
  * Added Play Again and Back to Menu options
  * Back to Menu now returns to the main menu where settings can be changed

### Version 3.2 - Mobile and Gameplay Improvements

* **Flappy Bird**

  * Increased jump strength from -8 to -11
  * Reduced pipe width from 60px to 45px
  * Increased pipe gaps from 150px to 180px
  * Reduced initial speed from 3.5 to 2.5
  * Increased the rate at which speed progresses

* **Breakout Mobile Fixes**

  * Fixed paddle alignment with touch input
  * Added canvas coordinate scaling
  * Updated mouse controls to account for canvas scaling
  * Added a `touchstart` handler for immediate paddle movement

* **Snake Mobile Optimizations**

  * Reduced the mobile canvas size to a maximum of 350px and minimum of 280px
  * Adjusted height calculations to prevent UI overflow
  * Improved space allocation for the header, score, controls, and mobile controls

### Version 3.1 - Performance and UI Updates

* **Performance**

  * Added batched rendering for Snake
  * Reduced background animation to 30 FPS and paused it when the page is hidden
  * Optimized Robot skin rendering
  * Updated Classic skin rendering to use a single batch

* **2048**

  * Increased tile movement speed to 1200 px/s
  * Restricted tile movement to horizontal or vertical directions
  * Kept animation speed consistent regardless of distance or merges
  * Changed animations to use linear timing

* **UI**

  * Added theme-aware dropdowns
  * Updated dropdown borders and colors
  * Updated dropdown options to match the selected theme

* **Snake**

  * Updated food colors to match the selected theme
  * Added glow effects and white borders to food
  * Increased food contrast
  * Fixed the Retro theme food color

### Version 3.0 - Arcade Edition

* Added Breakout with multiple difficulty levels
* Added Flappy Bird with progressive speed
* Added 2048 with tile animations
* Created the unified Game Hub
* Added navigation between games
* Created the Hall of Fame
* Added a shared storage system
* Updated Breakout physics and difficulty levels
* Added progressive speed and updated visuals to Flappy Bird
* Added tile animations and updated gameplay to 2048

### Version 2.0

* Added Zen Mode
* Added Power-Up Mode
* Added the menu system
* Added pause functionality
* Added five themes
* Added three skins
* Improved Snake head visibility
* Improved mobile controls
* Updated background animations
* Added separate high score tracking
* Updated performance with `requestAnimationFrame`
* Reorganized the code into separate modules

### Version 1.0

* Added Classic Snake gameplay
* Added basic high score tracking
* Added mobile support

## Author

**Tighe Billings**

* Email: [tigheb@bu.edu](mailto:tigheb@bu.edu)

## License

© 2025 All rights reserved

## Acknowledgments

* Classic arcade games
* Modern web technologies
* Retro gaming community

For questions or concerns, contact: [tigheb@bu.edu](mailto:tigheb@bu.edu)
