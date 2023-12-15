class Projectile {
    constructor(game, x, y, direction="straight") {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 36.25;
        this.height = 20;
        this.frameX=0;
        this.maxFrame=3;
        this.speed = this.game.playerProjectileSpeed;
        this.markedForDeletion = false;
        this.image = document.getElementById('fireball');
        this.direction = direction;
    }

    update() {
        // if(!this.game.isPowerUp){
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) {
                this.markedForDeletion = true;
            }
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }else{
                this.frameX=0;
            }
        // }

        if(this.direction == "up"){
            this.y -= this.speed;
            if(this.y < 0){
                this.markedForDeletion = true;
            }
        }

        if(this.direction == "down"){
            this.y += this.speed;
            if(this.y > this.game.height){
                this.markedForDeletion = true;
            }
        }
    }

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

class EnemyProjectile {
    constructor(game, x, y, speed, direction="straight") {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 3;
        this.speed = -speed;
        this.markedForDeletion = false;
        this.image = document.getElementById('projectile');
        this.direction = direction;
    }

    update() {
        this.x += this.speed;
        if (this.x < 0) {
            this.markedForDeletion = true;
        }

        if(this.direction == "up"){
            this.y -= 1;
            if(this.y < 0){
                this.markedForDeletion = true;
            }
        }

        if(this.direction == "down"){
            this.y += 1;
            if(this.y > this.game.height){
                this.markedForDeletion = true;
            }
        }
    }

    draw(context) {    
        context.drawImage(this.image, this.x, this.y);
    }
}
