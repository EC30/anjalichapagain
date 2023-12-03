/**
 * Represents the main character in the game.
 * @class
 */
class Character {
    /**
     * Creates a new Character object.
     * @constructor
     * @param {HTMLImageElement} img - The image representing the character.
     * @param {number} x - The x-coordinate of the top-left corner of the character.
     * @param {number} y - The y-coordinate of the top-left corner of the character.
     * @param {number} width - The width of the character.
     * @param {number} height - The height of the character.
     */
    constructor(img, x, y, width, height) {
        this.img = img; // Image representing the character
        this.x = x; // X-coordinate of the top-left corner of the character
        this.y = y; // Y-coordinate of the top-left corner of the character
        this.width = width; // Width of the character
        this.height = height; // Height of the character
    }

    /**
     * Draws the character on the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

