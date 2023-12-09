window.addEventListener('load', function () {
    const canvas = this.document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width=this.window.innerWidth;
    canvas.height=this.window.innerHeight;
    
    console.log(canvas.width);
    console.log(canvas.height);


    class InputHandler {
        constructor(game) {
            this.game = game;
            
            window.addEventListener('keydown', e => {

                // console.log(e.key);
                console.log(this.game.keys);

                if(( (e.key ==='ArrowUp') || (e.key === 'ArrowDown') ) && this.game.keys.indexOf(e.key)=== -1){
                    this.game.keys.push(e.key);
                }else if(e.key==='Control'){
                    this.game.player.shootTop();
                } else if(e.key==='d'){
                    this.game.debug =!this.game.debug;
                } 
            });
            
            window.addEventListener('keyup', e => {
                if(this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key),1);
                }
            });
            
        }
    }

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
            context.drawImage(this.image, this.x, this.y);
        }
    }
    class EnemyProjectile {
        constructor(game, x, y, speed) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = -speed; // Set the initial speed to a negative value for right-to-left movement
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
    

    class Explosion{
        constructor(game, x, y) {
            this.game=game;
            this.x = x;
            this.y = y;
            this.frameX = 0;
            this.spriteheight = 200;
            this.timer = 0; 
            this.interval=1000/15;
            this.markedForDeletion=false;
            this.maxFrame=8;
        }
        update(deltaTime){
            this.frameX++;
            if(this.frameX >this.maxFrame){
                this.markedForDeletion=true;
            }
        }
        draw(context){
            //context.drawImage(this.image, this.x, this.y);
            context.drawImage(
                this.image,
                this.frameX * this.spritewidth,
                0,
                this.spritewidth,
                this.spriteheight,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }

    class Smoke extends Explosion{
        constructor(game, x, y) {
            super(game,x,y);
            this.game=game;
            this.spritewidth = 200;
            this.width=this.spritewidth;
            this.height=this.spriteheight;
            this.x = x-this.width*0.5;
            this.y = y-this.height*0.5;
            this.image=document.getElementById('smoke');
            
        }
    }

    class Fire extends Explosion{
        constructor(game, x, y) {
            super(game,x,y);
            this.game=game;
            this.spritewidth = 200;
            this.width=this.spritewidth;
            this.height=this.spriteheight;
            this.x = x-this.width*0.5;
            this.y = y-this.height*0.5;
            this.image=document.getElementById('fire');
        }
    }

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
            this.maxSpeed = 3;
            this.Projectiles = [];
            this.image=document.getElementById('player');
            this.powerUp=false;
            this.powerUpTimer=0;
            this.powerUpLimit=10000;

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
                }else{
                    this.powerUpTimer +=deltaTime;
                    this.frameY=1;
                    this.game.ammo +=0.1;
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
        }
        shootButtom() {
            if(this.game.ammo > 0) {
                this.Projectiles.push(new Projectile(this.game, this.x + 80, this.y + 175));
                // this.Projectiles.push(new Projectile(this.game, this.x + 80, this.y + 175, 'player'));
                this.game.ammo--;
            }
        }

        enterPowerUp(){
            this.powerUpTimer=0;
            this.powerUp=true;
            if(this.game.ammo < this.game.maxAmmo)
            this.game.ammo=this.game.maxAmmo;
        }
    }

    class Enemy{
        constructor(game){
            this.game=game;
            this.x=this.game.width;
            this.speedX=Math.random()*-1.5-0.5;
            this.markedForDeletion=false;
            this.frameX=0;
            this.frameY=0;
            this.maxFrame=37;
            this.enemyProjectiles = [];
        }
        update(){
            this.x +=this.speedX-this.game.speed;
            if(this.x+this.width<0)this.markedForDeletion=true;
            if(this.frameX <this.maxFrame){
                this.frameX++;
            }else{
                this.frameX=0;
            }
        }
        throwProjectile() {
            if (Math.random() < 0.02) {
                const projectileX = this.x + this.width; 
                this.enemyProjectiles.push(new EnemyProjectile(this.game, projectileX, this.y + this.height / 2, -3));
                console.log(this.enemyProjectiles);
            }
        }
        draw(context){
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
            if(this.game.debug){
                context.fillStyle='black';
                context.font='20px Helvetica';
                context.fillText(this.lives, this.x,this.y);
            }
            this.enemyProjectiles.forEach(projectile => {
                projectile.draw(context);
            });
        }
    }

    class Angler1 extends Enemy {
         constructor(game){
            super(game);
            this.width=228;
            this.height=169;
            this.lives=2;
            this.score=this.lives;
            this.y=Math.random()*(this.game.height*0.9-this.height);
            this.image=document.getElementById('angler1');
            this.frameY=Math.floor(Math.random()*3);
         }
    }
    class Angler2 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 228;
            this.height = 169;
            this.lives = 3;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random() * 3);
        }
    }
    class lucky extends Enemy {
        constructor(game) {
            super(game);
            this.width = 99;
            this.height = 95;
            this.lives = 5;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height * 0.9 - this.height);
            this.image = document.getElementById('lucky');
            this.frameY = Math.floor(Math.random() * 2);
            this.type='lucky';
        }
    }
    class Boss extends Enemy {
        constructor(game) {
            super(game);
            this.width = 400;
            this.height = 227;
            this.lives = 3;
            this.score = this.lives;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('boss');
            this.frameY=0;
            this.speedX = Math.random()*1.2-0.2;
            this.type='boss';
        }
    }
    class Drone extends Enemy {
        constructor(game,x,y) {
            super(game);
            this.width = 115;
            this.height = 95;
            this.lives = 2;
            this.score = this.lives;
            this.x=x;
            this.y=y;
            this.image = document.getElementById('drone');
            this.frameY=0;
            this.speedX = Math.random() * 4.2 - 0.5;
            this.type='drone';
        }
    }

    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');
            
            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.4);
            this.layer3 = new Layer(this.game, this.image3, 1);
            this.layer4 = new Layer(this.game, this.image4, 1.5);
            this.layers = [this.layer1,this.layer2,this.layer3];
        }
    
        update() {
            this.layers.forEach(layer => layer.update());
        }
    
        draw(context) {
            this.layers.forEach(layer => layer.draw(context));
        }
    }
    
    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = canvas.width;
            this.height = canvas.height;
            this.x = 0;
            this.y = 0;
        }
    
        update() {
            if (this.x <= -this.width) this.x = 0;
            this.x -= this.game.speed * this.speedModifier;
        }
    
        draw(context) {
            // context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
            context.drawImage(this.image, this.x+this.width, this.y, canvas.width, canvas.height);
        }
    }
    
    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Helvetica';
            this.color = 'white';
        }

        draw(context) {
            context.save();
            context.fillStyle = this.color;
            context.font=this.fontSize +'px'+this.fontFamily;
            context.fillText('Score:' +this.game.score,20,40);
            if (this.game.lives > 0) {
                context.fillText('Lives: ' + this.game.lives, 100, 40);
            } else {
                context.fillText('Out of Lives',this.game.width*0.5,this.game.height*0.5-40);
                this.game.gameOver = true;
                return;
            }
           
            for(let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
            const formattedTime =(this.game.gameTime*0.001).toFixed(1);
            context.fillText('Timer: '+formattedTime,20,100);
            context.restore();
            if(this.game.gameOver){
                context.textAlign='center';
                let message1;
                let message2;
                if(this.game.score>this.game.winingscore){
                    message1='You Win!';
                    message2='Well done';
                }else{
                    message1='You lose!';
                    message2='Try again next time!';
                }
                context.font ='50px' +this.fontFamily;
                context.fillText(message1,this.game.width*0.5,this.game.height*0.5-40);
                context.font ='25px' +this.fontFamily;
                context.fillText(message2,this.game.width*0.5,this.game.height*0.5+40);
            }
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background=new Background(this);
            this.player = new Character(this); 
            this.inputHandler = new InputHandler(this);
            this.UI = new UI(this);
            this.enemyTimer=0;
            this.enemyInterval=1000;
            this.keys = [];
            this.enemies=[];
            this.explosions=[];
            this.enemiesProjectiles = [];
            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInternal = 500;
            this.gameOver=false;
            this.score=0;
            this.lives=10;
            this.winingscore=60;
            // this.gameTime=0;
            // this.timeLimit=30000;
            this.speed=1;
            this.debug=false;
            this.currentLevel = 1;
            this.levelDurations = [60000, 90000, 120000];
            this.levelTimer = 0;
            this.levelStarted = false;
        }

        update(deltaTime) {
            // Code for Game Over
            if (this.gameOver) {
                return;
            }

            if (!this.levelStarted) {
                this.levelStarted = true;
                this.enemyTimer = 0;
                this.levelTimer = 0;
            }
    
            // Update level timer
            this.levelTimer += deltaTime;
    
            // Check if the current level has ended
            if (this.levelTimer >= this.levelDurations[this.currentLevel - 1]) {
                this.levelStarted = false;
                this.levelTimer = 0;
    
                // Move to the next level
                this.currentLevel++;
    
                // Check if all levels are completed
                if (this.currentLevel > this.levelDurations.length) {
                    this.gameOver = true; 
                    return;
                }
            }

            if (this.enemyTimer > this.enemyInterval && !this.gameOver && this.levelStarted) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }


            if(!this.gameOver) this.gameTime +=deltaTime;
            if(this.gameTime > this.timeLimit) this.gameOver=true;
            this.background.update();
            this.background.layer4.update();
            this.player.update(deltaTime);
            if(this.ammoTimer > this.ammoInternal) {
                if(this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }

            this.explosions.forEach(explosion=>explosion.update());
            this.explosions=this.explosions.filter(explosion=>!explosion.markedForDeletion);

            this.enemies.forEach(enemy=>{
                enemy.update();
                //enemy.throwProjectile();
                if(this.checkCollision(this.player,enemy)){
                    enemy.markedForDeletion=true;
                    this.addExplosion(enemy);
                    // this.lives--;
                    if(enemy.type ==='lucky'){
                        this.player.enterPowerUp();
                    }else{
                        this.lives--;
                    }
                }

                this.enemiesProjectiles.forEach(projectile => {
                    projectile.update();
                    if (this.checkCollision(this.player, projectile)) {
                        projectile.markedForDeletion = true;
                        this.lives--;
                    }
                });
        
                // Remove projectiles that are marked for deletion
                this.enemiesProjectiles = this.enemiesProjectiles.filter(projectile => !projectile.markedForDeletion);

                this.player.Projectiles.forEach(Projectile=>{
                    if(this.checkCollision(Projectile,enemy,"projectile")){
                        enemy.lives--;
                        Projectile.markedForDeletion=true;
                        this.addExplosion(enemy);
                        if(enemy.lives <=0){
                            enemy.markedForDeletion=true;
                            if(enemy.type === 'boss'){
                                for(let i=0;i<5;i++){
                                    this.enemies.push(new Drone(this,
                                        enemy.x+Math.random()*enemy.width,
                                        enemy.y+Math.random()*enemy.height*0.5));
                                }
                            }
                            if(!this.gameOver) this.score +=enemy.score;
                            if(this.score >this.winingscore) this.gameOver=true;
                        }
                    }
                })
            });
            this.enemies=this.enemies.filter(enemy=>!enemy.markedForDeletion);
            if(this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer= 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            //console.log(this.enemies);
        }

        draw(context) {
            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.background.draw(context);
            this.player.draw(context);
            this.UI.draw(context);

            this.enemies.forEach(enemy=>{
                enemy.draw(context);
            });

            this.explosions.forEach(explosion=>{
                explosion.draw(context);
            });
            this.background.layer4.draw(context);
        }
        addEnemy(){
            const random_enemy=Math.random();
            if(random_enemy <0.3){
                this.enemies.push(new Angler1(this));
            }else if(random_enemy <0.6){
                this.enemies.push(new Angler2(this));
            }else if(random_enemy <0.8){
                this.enemies.push(new Boss(this));
            }else{
                this.enemies.push(new lucky(this));
            }
        }
        addExplosion(enemy){
            const random_explosion=Math.random();
            if(random_explosion < 1){
                this.explosions.push(new Smoke(this,enemy.x,enemy.y));
            }
        }
        checkCollision(a,b,c="other"){
            // console.log(c);
            if(b.type === "lucky" && c=="projectile"){
                return false;
            }
            return (a.x <b.x+b.width &&
            a.x + a.width > b.x &&
            a.y <b.y+b.height &&
            a.height +a.y>b.y)
            
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate(0);
});
