class Ball{
    constructor(x,y,r){
        /**
         * Creates a new instance of the Ball class.
         * 
         * @param {number} x - The initial x-coordinate of the ball.
         * @param {number} y - The initial y-coordinate of the ball.
         * @param {number} r - The radius of the ball.
         */
        this.x=x;
        this.y=y;
        this.r = r;
         // Setting random speed within the range of -1 to 1
        this.dx=getRandom(-1,1);
        this.dy=getRandom(-1,1);
        // Generating random color for the ball
        this.color = getRandomColor(); 
         // Creating an HTML element representing the ball
        this.element=document.createElement('div');
        this.element.style.width = this.r * 2 + 'px';
        this.element.style.height = this.r * 2 + 'px';
        this.element.classList.add('ball');
        this.element.style.backgroundColor = this.color;
        this.element.style.borderRadius = '50%';
    }
    /**
     * Gets the HTML element associated with the ball.
     * 
     * @returns {HTMLDivElement} The HTML element representing the ball.
     */
    getElement() {
        return this.element;
    }

    /**
     * Gets the current x-coordinate of the ball.
     * 
     * @returns {number} The x-coordinate of the ball.
     */
    getX = () => this.x;

    /**
     * Gets the current y-coordinate of the ball.
     * 
     * @returns {number} The y-coordinate of the ball.
     */
    getY = () => this.y;

    /**
     * Sets the x-coordinate of the ball.
     * 
     * @param {number} x - The new x-coordinate.
     */
    setX = (x) => {
        this.x = x;
    }

    /**
     * Sets the y-coordinate of the ball.
     * 
     * @param {number} y - The new y-coordinate.
     */
    setY = (y) => {
        this.y = y;
    }

    /**
     * Draws the ball by updating its position in the DOM.
     */
    draw = () => {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    /**
     * Moves the ball based on its current speed.
     */
    move = () => {
        this.x += this.dx * SPEED;
        this.y += this.dy * SPEED;
    }

    /**
     * Checks for collisions with the walls of a specified boundary.
     * If a collision is detected, updates the ball's direction and position accordingly.
     * 
     * @param {number} - The left boundary of the collision area.
     * @param {number} - The top boundary of the collision area.
     * @param {number} - The width of the collision area.
     * @param {number} - The height of the collision area.
     */
    checkWallCollision = (boundaryLeft, boundaryTop, boundaryWidth, boundaryHeight) => {
        // Check collision with the left or right wall
        if (this.x < boundaryLeft || this.x + this.r * 2 > boundaryWidth) {
            // Reverse the horizontal direction of the ball
            this.dx = -this.dx;

            // Adjust the ball's x-coordinate to prevent it from going outside the boundaries
            this.x = this.x <= boundaryLeft ? boundaryLeft : boundaryWidth - this.r * 2;
        }
        // Check collision with the top or bottom wall
        if (this.y < boundaryTop || this.y + this.r * 2 > boundaryHeight) {
            // Reverse the vertical direction of the ball
            this.dy = -this.dy;

            // Adjust the ball's y-coordinate to prevent it from going outside the boundaries
            this.y = this.y <= boundaryTop ? boundaryTop : boundaryHeight - this.r * 2;
        }
    };
    /**
     * Checks for collision with another ball and updates positions and velocities accordingly.
     * 
     * @param {Ball} - The other ball to check for collision with.
     * @returns {void} This method does not return a value.
     */
    checkBallCollision = (ball) => {
        const dist = distance(this.x, this.y, ball.x, ball.y);
        const sumOfRadii = this.r + ball.r;
    
        if (dist <= sumOfRadii) {
            //Calculating the overlap distance
            const overlap = sumOfRadii - dist;
            //console.log(this.x,this.y,ball.x,ball.y);
    
            // Normalizing the collision vector
            const dxNormalized = (ball.x - this.x) / dist;
            const dyNormalized = (ball.y - this.y) / dist;
            //console.log(dxNormalized,dyNormalized,overlap);
    
            // Moving the balls away from each other to avoid overlap
            this.x -= overlap * dxNormalized;
            this.y -= overlap * dyNormalized;
    
            ball.x += overlap * dxNormalized;
            ball.y += overlap * dyNormalized;
            //console.log(this.x,this.y,ball.x,ball.y);
    
    
            // Reflect speed
            this.dx = -this.dx;
            this.dy = -this.dy;
            ball.dx = -ball.dx;
            ball.dy = -ball.dy;
        }
    };
    
}

