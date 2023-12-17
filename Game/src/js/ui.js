class Background {
    /**
     * Constructor for the Background class.
     * @param {Game} game - The game instance.
     * @param {Array} background - Array of background images.
     * @param {Array} backgroundSpeed - Array of speed modifiers for each background layer.
     */
    constructor(game, background, backgroundSpeed) {
        this.game = game;

        // Creatinglayers based on the provided background images and speed modifiers.
        this.layers = [];
        for (let i = 0; i < background.length; i++) {
            let layer = new Layer(this.game, background[i], backgroundSpeed[i]);
            this.layers.push(layer);
        }
    }

    /**
     * Update method for the Background class.
     * Updates all background layers.
     */
    update() {
        this.layers.forEach(layer => layer.update());
    }

    /**
     * Draw method for the Background class.
     * Draws all background layers on the canvas.
     * @param {CanvasRenderingContext2D} context - The 2D rendering context of the canvas.
     */
    draw(context) {
        this.layers.forEach(layer => layer.draw(context));
    }
}

class Layer {
    /**
     * Constructor for the Layer class.
     * @param {Game} game - The game instance.
     * @param {Image} image - The background image for the layer.
     * @param {number} speedModifier - Speed modifier for the layer.
     */
    constructor(game, image, speedModifier) {
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = canvas.width;
        this.height = canvas.height;
        this.x = 0;
        this.y = 0;
    }

    /**
     * Update method for the Layer class.
     * Updates the position of the layer based on game speed and speed modifier.
     */
    update() {
        // Reset the position when the layer goes beyond the canvas width.
        if (this.x <= -this.width) this.x = 0;
        // Update the x position based on the game speed and speed modifier.
        this.x -= this.game.speed * this.speedModifier;
    }

    /**
     * Draw method for the Layer class.
     * Draws the layer on the canvas with a parallax effect.
     * @param {CanvasRenderingContext2D} context - The 2D rendering context of the canvas.
     */
    draw(context) {
        // Draw the background image twice for a seamless looping effect.
        context.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
        context.drawImage(this.image, this.x + this.width, this.y, canvas.width, canvas.height);
    }
}

class UI {
    /**
     * Constructor for the UI class.
     * @param {Game} game - The game instance.
     */
    constructor(game) {
        this.game = game;
        this.fontSize = 20;
        this.fontFamily = 'Fredoka One';
        this.color = 'white';
    }

    /**
     * Draw method for the UI class.
     * Draws UI elements on the canvas, including score, level, lives, and ammo.
     * @param {CanvasRenderingContext2D} context - The 2D rendering context of the canvas.
     */
    draw(context) {
        // Save the current canvas state.
        context.save();
        // Set the fill style, font, and display the back button.
        context.fillStyle = this.color;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        backButtonGame.style.display = 'flex';

        if (playingBonusLevel) {
            // Display score and bonus level information during bonus levels.
            context.fillText('Score: ' + this.game.score, 20, 40);
            context.fillText('Level: Bonus Level' + (parseInt(bonusLevelNumber) + 1), 280, 40);
        } else {
            // Display total score, level, and lives during regular levels.
            let totalScore = parseInt(levelCompleteScore) + parseInt(this.game.score);
            context.fillText('Score: ' + totalScore, 20, 40);
            context.fillText('Level: ' + (parseInt(runningLevel) + 1), 280, 40);
        }

        if (this.game.lives > 0) {
            // Display player lives
            context.fillText('Lives: ' + this.game.lives, 140, 40);
        } else {
            // Display out-of-lives popup and stop the animation if the player is out of lives.
            popupShown = true;
            out_of_life_popup.style.display = "flex";
            stopAnimation();
            return;
        }

        // Display ammo count using rectangles.
        for (let i = 0; i < this.game.ammo; i++) {
            context.fillRect(20 + 5 * i, 50, 3, 20);
        }
        // Restore the canvas state.
        context.restore();
    }
}
