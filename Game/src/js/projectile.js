/**
 * Represents a projectile fired by the player.
 */
class Projectile {
    constructor(game, x, y, direction = "straight") {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 36.25;
        this.height = 20;
        this.frameX = 0;
        this.maxFrame = 3;
        this.speed = this.game.playerProjectileSpeed;
        this.markedForDeletion = false;
        this.image = document.getElementById('fireball');
        this.direction = direction;
    }

    /**
     * Updates the projectile's position and marks it for deletion if necessary.
     */
    update() {
        this.x += this.speed;

        // Check if the projectile is out of bounds on the right side.
        if (this.x > this.game.width * 0.8) {
            this.markedForDeletion = true;
        }

        // Update animation frame.
        if (this.frameX < this.maxFrame) {
            this.frameX++;
        } else {
            this.frameX = 0;
        }

        // Update vertical position based on direction.
        if (this.direction == "up") {
            this.y -= this.speed;
            if (this.y < 0) {
                this.markedForDeletion = true;
            }
        }

        if (this.direction == "down") {
            this.y += this.speed;
            if (this.y > this.game.height) {
                this.markedForDeletion = true;
            }
        }
    }

    /**
     * Draws the projectile on the canvas.
     */
    draw(context) {
        context.drawImage(
            this.image,
            this.frameX * this.width,
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}

/**
 * Represents a projectile fired by an enemy.
 */
class EnemyProjectile {
    constructor(game, x, y, speed, direction = "straight", type) {
        this.game = game;
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 36.25;
        this.height = 20;
        this.frameX = 0;
        this.maxFrame = 3;
        this.speed = -speed;
        this.markedForDeletion = false;
        this.image = document.getElementById('enemyBullet');

        // Adjust image and dimensions for boss projectiles.
        if (this.type == 'boss') {
            this.image = document.getElementById('bossBullet');
            this.width = 72.5;
            this.height = 40;
        }

        this.direction = direction;
    }

    /**
     * Updates the enemy projectile's position and marks it for deletion if necessary.
     */
    update() {
        this.x += this.speed;

        // Check if the projectile is out of bounds on the left side.
        if (this.x < 0) {
            this.markedForDeletion = true;
        }

        // Update animation frame.
        if (this.frameX < this.maxFrame) {
            this.frameX++;
        } else {
            this.frameX = 0;
        }

        // Update vertical position based on direction.
        if (this.direction == "up") {
            this.y -= 1;
            if (this.y < 0) {
                this.markedForDeletion = true;
            }
        }

        if (this.direction == "down") {
            this.y += 1;
            if (this.y > this.game.height) {
                this.markedForDeletion = true;
            }
        }
    }

    /**
     * Draws the enemy projectile on the canvas.
     */
    draw(context) {
        context.drawImage(
            this.image,
            this.frameX * this.width,
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}
