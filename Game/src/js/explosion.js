/**
 * Represents a generic explosion in the game.
 * @param {Game} game - The game instance.
 * @param {number} x - The x-coordinate of the explosion.
 * @param {number} y - The y-coordinate of the explosion.
 */
class Explosion {
    constructor(game, x, y) {
        // Initialize basic properties
        this.game = game;
        this.x = x;
        this.y = y;
        this.frameX = 0;
        this.spriteheight = 200;
        this.spritewidth = 200;
        this.timer = 0;
        this.interval = 1000 / 15;
        this.width = this.spritewidth;
        this.height = this.spriteheight;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.markedForDeletion = false;
        this.maxFrame = 8;
    }

    /**
     * Updates the explosion's state based on the elapsed time.
     * @param {number} deltaTime - The time passed since the last update.
     */
    update(deltaTime) {
        // Advance the animation frame
        this.frameX++;

        // Mark the explosion for deletion when the animation is complete
        if (this.frameX > this.maxFrame) {
            this.markedForDeletion = true;
        }
    }

    /**
     * Draws the explosion on the game canvas.
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    draw(context) {
        // Draw the explosion sprite
        context.drawImage(
            this.image,
            this.frameX * this.spritewidth,
            0,
            this.spritewidth,
            this.spriteheight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}

/**
 * Represents a smoke explosion in the game, extending the generic Explosion class.
 * @param {Game} game - The game instance.
 * @param {number} x - The x-coordinate of the smoke explosion.
 * @param {number} y - The y-coordinate of the smoke explosion.
 */
class Smoke extends Explosion {
    constructor(game, x, y) {
        // Call the constructor of the parent class
        super(game, x, y);

        // Additional properties for smoke explosion
        this.spritewidth = 200;
        this.width = this.spritewidth;
        this.height = this.spriteheight;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.image = document.getElementById('smoke');
    }
}

/**
 * Represents a fire explosion in the game, extending the generic Explosion class.
 * @param {Game} game - The game instance.
 * @param {number} x - The x-coordinate of the fire explosion.
 * @param {number} y - The y-coordinate of the fire explosion.
 */
class Fire extends Explosion {
    constructor(game, x, y) {
        // Call the constructor of the parent class
        super(game, x, y);

        // image property for fire explosion
        this.image = document.getElementById('fire');
    }
}
