/**
 * Represents a platform tile in the game.
 * @class
 */
class Tile {
    /**
     * Creates a new Tile object.
     * @constructor
     * @param {HTMLImageElement} img - The image representing the tile.
     * @param {number} x - The x-coordinate of the top-left corner of the tile.
     * @param {number} y - The y-coordinate of the top-left corner of the tile.
     * @param {number} width - The width of the tile.
     * @param {number} height - The height of the tile.
     * @param {number} count - The unique identifier for the tile.
     */
    constructor(img, x, y, width, height, count) {
        this.img = img; // Image representing the tile
        this.x = x; // X-coordinate of the top-left corner of the tile
        this.y = y; // Y-coordinate of the top-left corner of the tile
        this.width = width; // Width of the tile
        this.height = height; // Height of the tile
        this.count = count; // Unique identifier for the tile
    }

    /**
     * Draws the tile on the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}
