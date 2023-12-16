class Character {
    constructor(game) {
        this.game = game;
        this.x = 20;
        this.y = 100;
        this.width = 120;
        this.height = 190;
        this.frameX=0;
        this.frameY=0;
        this.maxFrame=37;
        this.speedY = 0;
        this.speedX=0;
        this.maxSpeed = 3;
        this.Projectiles = [];
        this.image=document.getElementById('player');
        this.powerUp=false;
        this.powerUpTimer=0;
        this.powerUpLimit=10000;
        this.fireballPowerUpTimer=0;
        this.fireballPowerUpLimit=12000;

    }

    update(deltaTime) {
        if(this.game.keys.includes('ArrowUp')){
            this.speedY = -this.maxSpeed;   
        } else if(this.game.keys.includes('ArrowDown')){
            this.speedY = this.maxSpeed;
        } else {
            this.speedY = 0;
        }
        this.y += this.speedY;
        
        if(this.y > this.game.height-this.height) {
            this.y =this.game.height-this.height;
        }
        else if(this.y <0){
            this.y=0;
        }
        this.Projectiles.forEach(Projectile => {
            Projectile.update();
        });
        this.Projectiles = this.Projectiles.filter(Projectile => !Projectile.markedForDeletion);
        if(this.frameX < this.maxFrame){
            this.frameX++;
        }else{
            this.frameX=0;
        }
        if(this.powerUp){
            if(this.powerUpTimer>this.powerUpLimit){
                this.powerUpTimer=0;
                this.powerUp=false;
                playPowerDownSound();
            }else{
                this.powerUpTimer +=deltaTime;
                this.frameY=1;
                this.game.ammo +=0.1;
            }
        }
        if(this.game.isPowerUp){
            if(this.fireballPowerUpTimer>this.fireballPowerUpLimit){
                this.fireballPowerUpTimer=0;
                this.game.isPowerUp=false;
                this.game.regularEnemyKills = 0;
                playPowerDownSound();
            }else{
                this.fireballPowerUpTimer +=deltaTime;
                this.frameY=1;
                // this.game.ammo +=0.1;
            }
        }
    }

    draw(context) {
        if(this.game.debug){
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
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

    shootTop() {
        if(this.game.ammo > 0) {
            this.Projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
            this.game.ammo--;
        }
        if(this.powerUp){
            this.shootButtom();
        }

        if(this.game.isPowerUp){
            this.shootSlide();
        }
    }
    shootButtom() {
        if(this.game.ammo > 0 && !this.game.isPowerUp) {
            this.Projectiles.push(new Projectile(this.game, this.x + 80, this.y + 175));
            this.game.ammo--;
        }
    }

    shootSlide(){
        this.Projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30, "up"));
        this.Projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30, "down"));
    }

    enterPowerUp(){
        this.powerUpTimer=0;
        this.powerUp=true;
        if(this.game.ammo < this.game.maxAmmo)
        this.game.ammo=this.game.maxAmmo;
        playPowerSound();
        
    }
    fireballPowerUp(){
        this.powerUpTimer=0;
        
        playPowerSound();
    }
}