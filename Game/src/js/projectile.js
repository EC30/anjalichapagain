class Projectile {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 3;
        this.speed = 3;
        this.markedForDeletion = false;
        this.image = document.getElementById('projectile'); 
    }

    update() {
        this.x += this.speed;
        if (this.x > this.game.width * 0.8) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        const imageWidth = 30; 
        const imageHeight = 20; 
    
        context.drawImage(this.image, this.x, this.y, imageWidth, imageHeight);
    }
}

class EnemyProjectile {
    constructor(game, x, y, speed) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 3;
        this.speed = -speed;
        this.markedForDeletion = false;
        this.image = document.getElementById('bullet');
    }

    update() {
        this.x += this.speed;
        if (this.x < 0) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        const imageWidth = 60; 
        const imageHeight = 60; 
    
        context.drawImage(this.image, this.x, this.y, imageWidth, imageHeight);
    }
}