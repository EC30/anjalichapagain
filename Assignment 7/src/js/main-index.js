// Get the viewport element using its ID
const ViewPort = document.querySelector('#viewport');

// Array to store Ball objects
const ballsArray = [];

// Loop to create and initialize BALL_COUNT number of Ball objects
for (let i = 0; i < BALL_COUNT; i++) {
    // Get a random radius within the specified range
    const r = getRandom(RADIUS_MIN, RADIUS_MAX);

    // Getting random coordinates for the ball within the viewport using getRandom function
    const x = getRandom(0, VIEWPORT_WIDTH - r * 2);
    const y = getRandom(0, VIEWPORT_HEIGHT - r * 2);

    // Creating a new Ball object with the random parameters
    const ball = new Ball(x, y, r);

    // Adding the ball to the ballsArray
    ballsArray.push(ball);
}

// Appending each Ball element to the viewport
ballsArray.forEach(ball => {
    ViewPort.appendChild(ball.getElement());
});

// Function to render the animation
function render() {
    // Loop through each ball in the array
    ballsArray.forEach(ball => {
        // Draw and move the ball
        ball.draw();
        ball.move();

        // Check for wall collision within the viewport boundaries
        ball.checkWallCollision(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

        // Loop through each other ball to check for collisions
        ballsArray.forEach(otherBall => {

            if (ball === otherBall) return;
            // Check for collision between the current ball and other ball
            ball.checkBallCollision(otherBall);
        });
    });

    // Request the next animation frame for continuous rendering
    requestAnimationFrame(render);
}

// Starting the rendering loop
render();
