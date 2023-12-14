class Game {
    constructor(width, height) {
        this.currentLevel = runningLevel;
        this.width = width;
        this.height = height;
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
        this.gameTime=0;
        
        this.updateVariableValuesForLevelChange();

    }

    updateVariableValuesForLevelChange(){
        let levelArray=levels;
        //levelArray=bonusLevels;
        let levelNumber=runningLevel;
        if(playingBonusLevel){
            levelArray=bonusLevels;
            levelNumber=bonusLevelNumber
        }
        console.log(levelArray[levelNumber].enemyInterval);
        // this.background=new Background(this,levels[runningLevel].background,levels[runningLevel].backgroundSpeed);
        
        // this.player = new Character(this); 
        
        // this.score=0;
        // this.gameTime=0;
        // this.enemyInterval = levels[runningLevel].enemyInterval;
        // this.enemiesNumber = levels[runningLevel].enemiesNumber;
        // this.playerProjectileSpeed = levels[runningLevel].playerProjectileSpeed;
        // this.enemyProjectileSpeed = levels[runningLevel].enemyProjectileSpeed;
        // this.maxEnemyPerScreen = levels[runningLevel].maxEnemyPerScreen;
        // this.ammo = levels[runningLevel].ammo;
        // this.ammoInterval = levels[runningLevel].ammoInterval;
        // this.maxAmmo = levels[runningLevel].maxAmmo;
        // this.lives = levels[runningLevel].lives;
        // this.winingscore = levels[runningLevel].winingscore;
        // this.speed = levels[runningLevel].speed;
        // this.droneCount = levels[runningLevel].droneCount;
        // this.enemyLife = levels[runningLevel].enemyLife;
        // this.projectileEnemies = levels[runningLevel].projectileEnemies ?? [];
        // this.playBonusLevel = levels[runningLevel].playBonusLevel ?? false;

        this.background=new Background(this,levelArray[levelNumber].background,levelArray[levelNumber].backgroundSpeed);
        
        this.player = new Character(this); 
        
        this.score=0;
        this.gameTime=0;
        this.enemyInterval = levelArray[levelNumber].enemyInterval;
        this.enemiesNumber = levelArray[levelNumber].enemiesNumber;
        this.playerProjectileSpeed = levelArray[levelNumber].playerProjectileSpeed;
        this.enemyProjectileSpeed = levelArray[levelNumber].enemyProjectileSpeed;
        this.maxEnemyPerScreen = levelArray[levelNumber].maxEnemyPerScreen;
        this.ammo = levelArray[levelNumber].ammo;
        this.ammoInterval = levelArray[levelNumber].ammoInterval;
        this.maxAmmo = levelArray[levelNumber].maxAmmo;
        this.lives = levelArray[levelNumber].lives;
        this.winingscore = levelArray[levelNumber].winingscore;
        this.speed = levelArray[levelNumber].speed;
        this.droneCount = levelArray[levelNumber].droneCount;
        this.enemyLife = levelArray[levelNumber].enemyLife;
        this.projectileEnemies = levelArray[levelNumber].projectileEnemies ?? [];
        this.playBonusLevel = levelArray[levelNumber].playBonusLevel ?? false;

        
    }

    update(deltaTime) {
        
        //  if(runningLevel===3){
        //     const bonusPopup = document.getElementById("bonusPopup")
        //     const bonusLoserPopup = document.getElementById("bonusLoserPopup")
        //     const timeLimit = 20000;
        //     this.gameTime += deltaTime;
        //     //console.log(this.gameTime);
        //     if (this.gameTime > timeLimit && this.score >= this.winingscore) {
        //         bonusPopup.style.display="flex";
        //         stopAnimation();

                   
        //     }else if(this.gameTime > timeLimit && this.score < winingscore){
        //        bonusLoserPopup.style.display="flex";
        //        stopAnimation();
        //     }
        // }
        

        if (this.gameOver) {
            return;
        }

        if(!this.gameOver) this.gameTime +=deltaTime;
        //if(this.gameTime > this.timeLimit) this.gameOver=true;
        this.background.update();
        // this.background.layer4.update();
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
            //if(enemy.type === 'boss' || enemy.type === 'drone'){
                enemy.throwProjectile();
            //}
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
                            for(let i=0;i<this.droneCount;i++){
                                this.enemies.push(new Drone(this,
                                    getRandomInteger(this.width/2,this.width),
                                    getRandomInteger(0,canvas.height-200)));                                        
                                    // enemy.x+Math.random()*enemy.width,
                                    // enemy.y+Math.random()*enemy.height*0.5));
                            }
                        }
                        if(!this.gameOver) this.score +=enemy.score;
                        // if(this.score >this.winingscore) this.gameOver=true;
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
        // this.background.layer4.draw(context);
    }
    addEnemy(){
        
        if(this.enemies.length < this.maxEnemyPerScreen  && !this.bossAdded){
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
        if (!this.bossAdded && this.score > this.winingscore) {
            this.enemies.push(new Boss(this));
            this.bossAdded = true; 
        }
        // If Boss Defeated Level Up

        if (this.bossAdded && this.enemies.length == 0) {
            this.bossAdded = false;
            stopAnimation();
            if(this.playBonusLevel){
                playingBonusLevel=true;
                completionPopup.style.display='flex';
            }else{
                overlay.style.display = "flex";
            }
            //Level Up Code
            runningLevel++;

            //Update Level Complete Score
            levelCompleteScore += this.score;
            popupShown = true;
            
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
        //explosionSound.play();
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
