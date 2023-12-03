// Get the canvas element and set its background properties
var canvas = document.getElementById('canvas');
if (canvas) {
    canvas.style.backgroundColor = '#f0f0f0';
    canvas.style.background = 'url("src/images/doodlejumpbg.png")';
    canvas.style.backgroundSize = 'cover';
}
// Set the height and width of the canvas
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;

// Get the 2D rendering context for the canvas
var ctx = canvas.getContext('2d');

// Add a variable to track touch start position
let touchStartX = 0;

// Initial horizontal speed of the player
let speedX = 0;

// Initial vertical speed of the player
let speedY = 0;

// Initial vertical speed when jumping
let initialspeedY = -8;

// Acceleration due to gravity
let gravity = 0.4;

// Player's score, maximum score, game over flag, platform count, and list of scored platforms
let score = 0, maxScore = 0, gameOver = false, platformCount = 0, scoredPlatform = [];

// Array to store platform objects
let tilesArray = [];

// Load images for the game
let doodlerRightImg = new Image();
let doodlerLeftImg = new Image();
let tileImg = new Image();
doodlerRightImg.src = "src/images/doodler-right.png";
doodlerLeftImg.src = "src/images/doodler-left.png";
tileImg.src = "src/images/platform.png";

// Create a Character object for the player
let doodler = new Character(
    doodlerRightImg,
    CANVAS_WIDTH / 2 - DOODLE_WIDTH / 2,
    CANVAS_HEIGHT * 7 / 8 - DOODLE_HEIGHT,
    DOODLE_WIDTH,
    DOODLE_HEIGHT
);

// Draw the initial doodler image
doodlerRightImg.onload = function () {
    doodler.draw(ctx);
}
// Set initial speed in the Y direction
speedY = initialspeedY;

// Load the initial set of tiles
loadTiles();

// Start the game loop
requestAnimationFrame(update);

// Listen for keyboard input
document.addEventListener('keydown', animate);

// Listen for touch start event
canvas.addEventListener('touchstart', handleTouchStart, false);

// Listen for touch move event
canvas.addEventListener('touchmove', handleTouchMove, false);

// Listen for touch end event
canvas.addEventListener('touchend', handleTouchEnd, false);

// Listen for touch tap event
canvas.addEventListener('touchstart', handleTouchTap, false);

/**
 * Function to handle touch tap event
 * @param {TouchEvent} event - The touch event object.
 */
function handleTouchTap(event) {
    // If the game is over, restart the game on tap
    if (gameOver) {
        restartGame();
    }
}

/**
 * Function to restart the game
 */
function restartGame() {
    // Reset the game state and restart the game
    doodler = new Character(
        doodlerRightImg,
        CANVAS_WIDTH / 2 - DOODLE_WIDTH / 2,
        CANVAS_HEIGHT * 7 / 8 - DOODLE_HEIGHT,
        DOODLE_WIDTH,
        DOODLE_HEIGHT
    );

    speedX = 0; // Reset horizontal speed
    speedY = initialspeedY; // Reset vertical speed
    score = 0; // Reset the score
    maxScore = 0; // Reset the maximum score
    gameOver = false; // Reset the game over flag
    platformCount = 0; // Reset the platform count
    scoredPlatform = []; // Clear the list of scored platforms
    loadTiles(); // Load the initial set of platforms
}

/**
 * Function to handle touch start event
 * @param {TouchEvent} event - The touch event object.
 */
function handleTouchStart(event) {
    // Prevent default behavior to avoid scrolling
    event.preventDefault();
    // Get the initial touch position
    touchStartX = event.touches[0].clientX;
}

let doodlerDirection = 'right';
/**
 * Function to handle touch move event
 * @param {TouchEvent} event - The touch event object.
 */
function handleTouchMove(event) {
    // Prevent default behavior to avoid scrolling
    event.preventDefault();

    // Calculate the horizontal distance moved
    const deltaX = event.touches[0].clientX - touchStartX;

    // Adjust the character's horizontal speed based on the distance moved
    speedX = deltaX / 10; // You may need to adjust the division factor based on your game's responsiveness

    // Update the doodler's direction based on the horizontal movement
    doodlerDirection = speedX > 0 ? 'right' : 'left';
}

/**
 * Function to handle touch end event
 * @param {TouchEvent} event - The touch event object.
 */
function handleTouchEnd(event) {
    // Reset the character's horizontal speed when the touch ends
    speedX = 0;
}

/**
 * Update the game state and render the next frame.
 * This function is called recursively using requestAnimationFrame to create an animation loop.
 */
function update() {
    // Request the next animation frame, creating a loop
    requestAnimationFrame(update);

    // If the game is over, stop updating
    if (gameOver) {
        return;
    }

    // Update the horizontal position of the doodler based on the current speed
    doodler.x += speedX;

    // Wrap the doodler around the screen if it goes off the edges
    if (doodler.x > CANVAS_WIDTH) {
        doodler.x = 0;
    } else if (doodler.x + doodler.width < 0) {
        doodler.x = CANVAS_WIDTH;
    }

    // Clear the entire canvas for the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the doodler on the updated position
    doodler.draw(ctx);

    // Update and draw each platform in the tilesArray
    for (let i = 0; i < tilesArray.length; i++) {
        let tiles = tilesArray[i];

        // Slide platform down if doodler is moving up and below a certain height
        if (speedY < 0 && doodler.y < CANVAS_HEIGHT * 3 / 4) {
            tiles.y -= initialspeedY; // Slide platform down
        }

        // Check for collision between doodler and platform
        if (detectCollision(doodler, tiles) && speedY >= 0) {
            speedY = initialspeedY; // Make doodler jump
            // If the platform has not been scored yet, update the score
            if (!scoredPlatform.includes(tiles.count)) {
                updateScore();
            }
            scoredPlatform.push(tiles.count); // Mark the platform as scored
        }

        // Draw the platform on the canvas
        tiles.draw(ctx);
    }

    // Remove off-screen platforms and add new ones
    while (tilesArray.length > 0 && tilesArray[0].y >= CANVAS_HEIGHT) {
        tilesArray.shift(); // Remove the top platform
        newTiles(); // Add a new platform at the bottom
    }

    // Apply gravity to increase the falling speed of the doodler
    speedY += gravity;

    // Update the vertical position of the doodler based on the current speed
    doodler.y += speedY;

    // Check if the doodler has fallen below the screen, indicating game over
    if (doodler.y > CANVAS_HEIGHT) {
        gameOver = true;
    }

    // Display the current score on the canvas
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(score, 5, 20);

    // Display game over messages and final score if the game is over
    if (gameOver) {
        ctx.fillText("Game Over: Tap to Restart.", CANVAS_WIDTH / 7, CANVAS_HEIGHT * 7 / 8);
        ctx.fillText("Your score is " + score, CANVAS_HEIGHT / 7, CANVAS_HEIGHT * 7 / 8 + 50);
    }
}
/**
 * Function to handle keyboard input and control player movement
 * Handles animation based on user input.
 * @param {KeyboardEvent} e - The keyboard event object.
 */
function animate(e) {
    // Check if the right arrow key or 'D' key is pressed
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        speedX = 4; // Set horizontal speed to move right
        doodlerDirection = 'right'; // Set the doodler's direction to face right
    }
    // Check if the left arrow key or 'A' key is pressed
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        speedX = -4; // Set horizontal speed to move left
        doodlerDirection = 'left'; // Set the doodler's direction to face left
    }
    // Check if the 'Enter' key is pressed and the game is over
    else if (e.code == "Enter" && gameOver) {
        // Reset the game state and restart the game
        restartGame();
    }

    // Set the doodler's image based on the direction
    doodler.img = doodlerDirection === 'right' ? doodlerRightImg : doodlerLeftImg;
}

/**
 * Function to load initial platform tiles into the tilesArray
 */
function loadTiles() {
    tilesArray = []; // Clear the existing array of platform tiles

    // Create a central platform at the top of the canvas
    let centralTile = new Tile(
        tileImg,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT,
        TILES_WIDTH,
        TILES_HEiGHT,
        platformCount++
    );

    // Add the central platform to the tilesArray
    tilesArray.push(centralTile);

    // Create additional random platforms below the central platform
    for (let i = 0; i < 8; i++) {
        // Generate a random x-coordinate within the canvas width for each platform
        let randomX = getRandom(0, CANVAS_WIDTH - TILES_WIDTH);

        // Create a new Tile object with random coordinates and add it to the array
        let newTile = new Tile(
            tileImg,
            randomX,
            CANVAS_HEIGHT - 75 * i - 150,
            TILES_WIDTH,
            TILES_HEiGHT,
            platformCount++
        );

        tilesArray.push(newTile);
    }
}

/**
 * Function to create a new platform tile and add it to the tilesArray
 */
function newTiles() {
    // Generate a random x-coordinate within the canvas width for the new platform
    let randomX = getRandom(0, CANVAS_WIDTH - TILES_WIDTH);

    // Create a new Tile object with random coordinates above the canvas
    let newTile = new Tile(
        tileImg,
        randomX,
        -TILES_HEiGHT,
        TILES_WIDTH,
        TILES_HEiGHT,
        platformCount++
    );

    // Add the new platform to the tilesArray
    tilesArray.push(newTile);
}

/**
 * Detects collision between two objects, typically representing game entities.
 *
 * @param {Object} a - The first object with properties x, y, width, and height.
 * @param {Object} b - The second object with properties x, y, width, and height.
 * @returns {boolean} - True if collision is detected, false otherwise.
 */
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

/**
 * Function to update the player's score based on vertical speed (speedY)
 */
function updateScore() {
    let points = 10; // Points awarded for each upward movement (jump)

    // Check if the player is moving upward (jumping)
    if (speedY < 0) {
        maxScore += points; // Increment the maximum score by points
        // Update the current score to the maximum score if it's higher
        if (score < maxScore) {
            score = maxScore;
        }
    } else if (speedY >= 0) {
        maxScore -= points; // Decrement the maximum score for downward movement (falling)
    }
}
