class Game {
    constructor(width, height, level) {
        this.currentLevel = level;
        this.width = width;
        this.height = height;
        this.background=new Background(this);
        this.player = new Character(this); 
        this.inputHandler = new InputHandler(this);
        this.UI = new UI(this);
        this.keys = [];
        this.enemies=[];
        this.enemyTimer=0;
        this.explosions=[];
        this.gameOver=false;
        this.ammoTimer = 0;
        this.bossAdded=false;
        this.debug=false;
        this.levelStarted = false;
        
        this.score=0;
        
        //variable values            
        this.enemyInterval = levels[level].enemyInterval;
        this.enemiesNumber = levels[level].enemiesNumber;
        this.ammo = levels[level].ammo;
        this.ammoInterval = levels[level].ammoInterval;
        this.maxAmmo = levels[level].maxAmmo;
        this.lives = levels[level].lives;
        this.winingscore = levels[level].winingscore;
        this.speed = levels[level].speed;
    }

    update(deltaTime) {
        // Code for Game Over
        if (this.gameOver) {
            return;
        }

        // if (!this.levelStarted) {
        //     this.startLevel();
        //     this.levelStarted = true;
        // }

        if(!this.gameOver) this.gameTime +=deltaTime;
        //if(this.gameTime > this.timeLimit) this.gameOver=true;
        this.background.update();
        this.background.layer4.update();
        this.player.update(deltaTime);
        if(this.ammoTimer > this.ammoInterval) {
            if(this.ammo < this.maxAmmo) this.ammo++;
            this.ammoTimer = 0;
        } else {
            this.ammoTimer += deltaTime;
        }

        this.explosions.forEach(explosion=>explosion.update());
        this.explosions=this.explosions.filter(explosion=>!explosion.markedForDeletion);

        this.enemies.forEach(enemy=>{
            enemy.update();

            //Boss and Drone throw projectile
            if(enemy.type === 'boss' || enemy.type === 'drone'){
                enemy.throwProjectile();
            }
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

            enemy.enemyProjectiles.forEach(projectile => {
                //projectile.update();
                if (this.checkCollision(projectile, this.player, "player")) {
                    projectile.markedForDeletion = true;
                    this.lives--;
                }
            });
            enemy.enemyProjectiles = enemy.enemyProjectiles.filter(projectile => !projectile.markedForDeletion);

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
                                    getRandomInteger(this.width/2,this.width),
                                    getRandomInteger(0,canvas.height-200)));                                        
                                    // enemy.x+Math.random()*enemy.width,
                                    // enemy.y+Math.random()*enemy.height*0.5));
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

    // startLevel() {
    //     console.log("Start Level:", this.currentLevel);

    //     if (this.levels && this.levels.length > this.currentLevel) {
    //         const levelProperties = this.levels[this.currentLevel];
    //         console.log("Level Properties:", levelProperties);

    //         this.enemiesNumber = levelProperties.enemiesNumber;

    //         if (this.currentLevel === 0) {
    //             console.log(this.enemiesNumber);
    //             this.bossAdded =false;
    //         }
    //     } else {
    //         console.error("Invalid level or levels array is not defined.");
    //     }
    // }
  
    resetGame() {
        // Reset all game variables to their initial state
        this.enemies = [];
        this.explosions = [];
        this.ammo = 20;
        this.score = 0;
        this.lives = 10;
        this.gameOver = false;
        this.levelStarted = false;
        this.currentLevel = 1;
        this.bossAdded = false;
        animate(0);
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
        if(this.enemies.length < 5 && !this.bossAdded){
            const random_enemy=Math.random();
            if(random_enemy < 0.45){
                this.enemies.push(new Angler1(this));
            }else if(random_enemy <0.9){
                this.enemies.push(new Angler2(this));
            }else{
                this.enemies.push(new lucky(this));
            }
        }
        // // Only add the boss enemy if it hasn't been added before
        if (!this.bossAdded && this.score > 1) {
            this.enemies.push(new Boss(this));
            this.bossAdded = true; 
        }
        // If Boss Defeated Level Up

        if (this.bossAdded && this.enemies.length == 0) {
            //Level Up Code
            // this.currentLevel++;
            this.bossAdded = false;
            //stop animation
            stopAnimation();
            //Update Level Complete Score
            levelCompleteScore += this.score;
            
            //display Level Completed
            overlay.style.display = "flex";
            
        }
    }
    addExplosion(enemy){
        const random_explosion=Math.random();
        const explosionSound = document.getElementById("enemyDeathSound");
        if(random_explosion < 0.5){
            this.explosions.push(new Smoke(this,enemy.x,enemy.y));
        } else{
            this.explosions.push(new Fire(this,enemy.x,enemy.y)); 
        }
        explosionSound.play();
    }
    checkCollision(a,b,c="other"){
        // a is projectile for most case excepy player enemy collision in which a is player
        // console.log(c);
        if(b.type === "lucky" && c=="projectile"){
            return false;
        }

        // if(c=="player"){
            
        //     return true;    
        // }
        
        return (a.x <b.x+b.width &&
        a.x + a.width > b.x &&
        a.y <b.y+b.height &&
        a.height +a.y>b.y)
        
    }
}
