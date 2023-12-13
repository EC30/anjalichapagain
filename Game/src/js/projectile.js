class Projectile {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 36.25;
        this.height = 20;
        this.frameX=0;
        this.maxFrame=3;
        this.speed = Math.random()*0.2+2.8;
        this.markedForDeletion = false;
        this.image = document.getElementById('fireball');
    }

    update() {
        this.x += this.speed;
        if (this.x > this.game.width * 0.8) {
            this.markedForDeletion = true;
        }
        if(this.frameX < this.maxFrame){
            this.frameX++;
        }else{
            this.frameX=0;
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
    constructor(game, x, y, speed) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 3;
        this.speed = -speed;
        this.markedForDeletion = false;
        this.image = document.getElementById('projectile');
    }

    update() {
        this.x += this.speed;
        if (this.x < 0) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {    
        context.drawImage(this.image, this.x, this.y);
    }
}

// class EnemyProjectile {
//     constructor(game, x, y, speed) {
//         this.game = game;
//         this.x = x,
//         this.y = y,
//         this.width = 100;
//         this.height = 100;
//         this.frameX=0;
//         this.frameY=0;
//         this.speed = -speed;
//         this.markedForDeletion = false;
//         this.maxFrame=7;
//         this.image = document.getElementById('bossprojectile');
//     }

//     update() {
//         this.x += this.speed;
//         if (this.x < 0) {
//             this.markedForDeletion = true;
//         }
//         if(this.frameX < this.maxFrame){
//             this.frameX++;
//         }else{
//             this.frameX=0;
//         }
//     }

//     draw(context) {
//         context.drawImage(
//             this.image,
//             this.frameX * this.width,
//             this.frameY*this.height,
//             this.width,
//             this.height,
//             20,
//             8,
//             this.width,
//             this.height
//         );

//         // context.drawImage(this.image, this.x, this.y);

//     }
// }