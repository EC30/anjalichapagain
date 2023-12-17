/**
 * Represents the game character.
 * @param {Game} game - The game object.
 */
class Character {
    /**
     * Initializes a new instance of the Character class.
     * @param {Game} game - The game object.
     */
    constructor(game) {
        // Initialize properties
        this.game = game;
        this.x = 20;
        this.y = 100;
        this.width = 120;
        this.height = 190;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 37;
        this.speedY = 0;
        this.speedX = 0;
        this.maxSpeed = 3;
        this.Projectiles = [];
        this.image = document.getElementById('player');
        this.powerUp = false;
        this.powerUpTimer = 0;
        this.powerUpLimit = 10000;
        this.fireballPowerUpTimer = 0;
        this.fireballPowerUpLimit = 12000;
    }

    /**
     * Updates the character's state based on the elapsed time.
     * @param {number} deltaTime - The time elapsed since the last update.
     */
    update(deltaTime) {
        // Handle vertical movement
        if (this.game.keys.includes('ArrowUp')) {
            this.speedY = -this.maxSpeed;
        } else if (this.game.keys.includes('ArrowDown')) {
            this.speedY = this.maxSpeed;
        } else {
            this.speedY = 0;
        }
        this.y += this.speedY;

        // Keep character within vertical bounds
        if (this.y > this.game.height - this.height) {
            this.y = this.game.height - this.height;
        } else if (this.y < 0) {
            this.y = 0;
        }

        // Update projectiles
        this.Projectiles.forEach(Projectile => {
            Projectile.update();
        });
        this.Projectiles = this.Projectiles.filter(Projectile => !Projectile.markedForDeletion);

        // Update animation frame
        if (this.frameX < this.maxFrame) {
            this.frameX++;
        } else {
            this.frameX = 0;
        }

        // Handle power-up effects
        if (this.powerUp) {
            if (this.powerUpTimer > this.powerUpLimit) {
                 // Power-up duration expired
                this.powerUpTimer = 0;
                this.powerUp = false;
                playPowerDownSound();
            } else {
                // Increment power-up timer and frame for animation
                this.powerUpTimer += deltaTime;
                this.frameY = 1;
                // Increase ammo during power-up
                this.game.ammo += 0.1;
            }
        }

        // Handle fireball power-up effects
        if (this.game.isPowerUp) {
            if (this.fireballPowerUpTimer > this.fireballPowerUpLimit) {
                // Fireball power-up duration expired
                this.fireballPowerUpTimer = 0;
                this.game.isPowerUp = false;
                this.game.regularEnemyKills = 0;
                playPowerDownSound();
            } else {
                // Increment fireball power-up timer and frame for animation
                this.fireballPowerUpTimer += deltaTime;
                this.frameY = 1;
            }
        }
    }

    /**
     * Draws the character on the canvas.
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    draw(context) {
        // Draw character bounding box if in debug mode
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }

        // Draw character image and projectiles
        context.drawImage(
            this.image,
            this.frameX * this.width,
            this.frameY * this.height,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
        this.Projectiles.forEach(Projectile => {
            Projectile.draw(context);
        });
    }

    /**
     * Fires projectiles towards the top.
     */
    shootTop() {
        if (this.game.ammo > 0) {
            this.Projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
            this.game.ammo--;
        }
        if (this.powerUp) {
            this.shootButtom();
        }

        if (this.game.isPowerUp) {
            this.shootSlide();
        }
    }

    /**
     * Fires projectiles towards the bottom.
     */
    shootButtom() {
        if (this.game.ammo > 0 && !this.game.isPowerUp) {
            this.Projectiles.push(new Projectile(this.game, this.x + 80, this.y + 175));
            this.game.ammo--;
        }
    }

    /**
     * Fires sliding projectiles.
     */
    shootSlide() {
        this.Projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30, "up"));
        this.Projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30, "down"));
    }

    /**
     * Activates the character's power-up state.
     */
    enterPowerUp() {
        this.powerUpTimer = 0;
        this.powerUp = true;
        if (this.game.ammo < this.game.maxAmmo) this.game.ammo = this.game.maxAmmo;
        playPowerSound();
    }

    /**
     * Activates the character's fireball power-up state.
     */
    fireballPowerUp() {
        this.powerUpTimer = 0;
        playPowerSound();
    }
}
