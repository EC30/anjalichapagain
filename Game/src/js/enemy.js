/**
 * Represents an enemy in the game.
 * @param {Game} game - The game instance.
 */
class Enemy {
    constructor(game) {
        // Initialize basic properties
        this.game = game;
        this.x = this.game.width;
        this.speedX = Math.random() * -1.5 - 0.5;
        this.markedForDeletion = false;
        this.frameX = 0;
        this.frameY = 0;
        this.enemyProjectiles = [];
        this.type = "";
        this.height = 0;
        this.bossNewPositionX = 0;
        this.bossNewPositionY = 0;
        this.y = 0;
        this.reachedMiddle = false;
    }

    /**
     * Updates the enemy's state based on the elapsed time.
     */
    update() {
        // Move enemy projectiles and handle boss and drone movement
        this.enemyProjectiles.forEach(enemyProjectile => {
            enemyProjectile.update();
        });
        this.enemyProjectiles = this.enemyProjectiles.filter(Projectile => !Projectile.markedForDeletion);

        // For Boss and Drone movement does not come left of screen middle
        if (!this.reachedMiddle) {
            this.x += this.speedX - this.game.speed; //to move more than game speed
        }

        // Check if Boss and Drone Reached Middle
        if ((this.type == "boss" || this.type == "drone") && this.x <= this.game.width / 2) {
            this.reachedMiddle = true;
        }

        // Boss and Drone movement after reaching middle
        if (this.reachedMiddle) {
            this.x = Math.floor(this.x); //to convert to integer
            this.y = Math.floor(this.y);

            // Boss and drone left and right randomly after reaching middle
            //checking whether the current X position of the boss (this.x) is within a specific range around the target X position 
            if ((this.x >= this.bossNewPositionX - this.game.speed + 1 && this.x <= this.bossNewPositionX + this.game.speed - 1) || this.bossNewPositionX == 0) {
                this.bossNewPositionX = getRandomInteger(this.game.width / 2, this.game.width);
            }

            if (this.x < this.bossNewPositionX) {
                this.x += this.game.speed;
            } else {
                this.x -= this.game.speed;
            }

            // Boss and drone move up and down randomly after reaching middle
            if ((this.y >= this.bossNewPositionY - this.game.speed + 1 && this.y <= this.bossNewPositionY + this.game.speed - 1) || this.bossNewPositionY == 0) {
                this.bossNewPositionY = getRandomInteger(1, canvas.height - this.height);
            }

            if (this.y < this.bossNewPositionY) {
                this.y += this.game.speed;
            } else {
                this.y -= this.game.speed;
            }
        }

        // Check if the enemy is out of the screen
        if (this.x + this.width < 0 && this.type != 'lucky') {
            this.game.regularEnemyKills = 0;
        }

        if (this.x + this.width < 0) {
            this.markedForDeletion = true;
        }

        // Update animation frame
        if (this.frameX < this.maxFrame) {
            this.frameX++;
        } else {
            this.frameX = 0;
        }
    }

    /**
     * Throws a projectile based on the enemy's type and random probability.
     */
    throwProjectile() {
        // Check if the enemy should throw a projectile at a certain probability 
        if (Math.random() < 0.019 && this.type == "boss") {
            this.throwProjectile2();
        }

        if (Math.random() < 0.004 && this.type == "drone") {
            this.throwProjectile2();
        }

        if (this.game.projectileEnemies.includes(this.type) && Math.random() < 0.009) {
            this.throwProjectile2();
        }
    }

    /**
     * Throws a specific type of projectile with defined characteristics.
     */
    throwProjectile2() {
        const projectileX = this.x;
        const projectileDirection = ["up", "down", "straight"];
        this.enemyProjectiles.push(new EnemyProjectile(this.game, projectileX, this.y + this.height / 2, this.game.enemyProjectileSpeed, projectileDirection[getRandomInteger(0, 2)], this.type));
    }

    /**
     * Draws the enemy on the game canvas.
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    draw(context) {
        // Draw the enemy sprite
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
        if(this.game.debug){
            context.fillStyle='black';
            context.font='20px Helvetica';
            context.fillText(this.type+":"+this.lives, this.x,this.y);
        }
        this.enemyProjectiles.forEach(projectile => {
            projectile.draw(context);
        });

        //health bars
        let individual_length = this.width/this.healthCount;
        let gap_length = individual_length/10;
        let health_length = individual_length-gap_length/2;
        let initial_x = this.x;

        for (let i=0; i< this.lives; i++){
            context.fillStyle='red';
            context.fillRect(initial_x, this.y, health_length, 4);
            initial_x +=health_length+gap_length;
        }
    }
}

/**
 * Represents an instance of the Angler1 enemy in the game.
 * @param {Game} game - The game instance.
 */
class Angler1 extends Enemy {
    constructor(game) {
        super(game);
        this.width = 228;
        this.height = 169;
        this.maxFrame = 35;
        this.lives = game.enemyLife.angler1Life ?? 2;
        this.healthCount = game.enemyLife.angler1Life ?? 2;
        this.score = this.lives;
        this.y = Math.random() * (this.game.height * 0.9 - this.height);
        this.image = document.getElementById('angler1');
        this.frameY = Math.floor(Math.random() * 3);
        this.type = 'angler1';
    }
}

/**
 * Represents an instance of the Angler2 enemy in the game.
 * @param {Game} game - The game instance.
 */
class Angler2 extends Enemy {
    constructor(game) {
        super(game);
        this.width = 213;
        this.height = 165;
        this.maxFrame = 35;
        this.lives = game.enemyLife.angler2Life ?? 3;
        this.healthCount = game.enemyLife.angler2Life ?? 3;
        this.score = this.lives;
        this.y = Math.random() * (this.game.height * 0.9 - this.height);
        this.image = document.getElementById('angler2');
        this.frameY = Math.floor(Math.random() * 2);
        this.type = 'angler2';
    }
}

/**
 * Represents an instance of the Lucky enemy in the game.
 * @param {Game} game - The game instance.
 */
class lucky extends Enemy {
    constructor(game) {
        super(game);
        this.width = 99;
        this.height = 95;
        this.maxFrame = 39;
        this.score = this.lives;
        this.y = Math.random() * (this.game.height * 0.9 - this.height);
        this.image = document.getElementById('lucky');
        this.frameY = Math.floor(Math.random() * 2);
        this.type = 'lucky';
    }
}

/**
 * Represents an instance of the Boss enemy in the game.
 * @param {Game} game - The game instance.
 */
class Boss extends Enemy {
    constructor(game) {
        super(game);
        this.width = 400;
        this.height = 227;
        this.maxFrame = 35;
        this.lives = game.enemyLife.bossLife ?? 10;
        this.healthCount = game.enemyLife.bossLife ?? 10;
        this.score = this.lives;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('boss');
        this.frameY = 0;
        this.speedX = -1 * Math.random() * 1.2 - 0.2;
        this.type = 'boss';
    }
}

/**
 * Represents an instance of the Drone enemy in the game.
 * @param {Game} game - The game instance.
 * @param {number} x - The initial x-coordinate.
 * @param {number} y - The initial y-coordinate.
 */
class Drone extends Enemy {
    constructor(game, x, y) {
        super(game);
        this.width = 115;
        this.height = 95;
        this.lives = game.enemyLife.droneLife ?? 2;
        this.healthCount = game.enemyLife.droneLife ?? 2;
        this.score = this.lives;
        this.x = x;
        this.y = y;
        this.image = document.getElementById('drone');
        this.frameY = Math.floor(Math.random() * 2);
        this.speedX = -1 * Math.random() * 4.2 - 0.5;
        this.type = 'drone';
    }
}
