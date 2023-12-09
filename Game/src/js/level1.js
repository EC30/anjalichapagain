window.addEventListener('load', function () {
    const canvas = this.document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width=this.window.innerWidth;
    canvas.height=this.window.innerHeight;
    
    console.log(canvas.width);
    console.log(canvas.height);

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
            this.enemiesNumber=10;
            this.explosions=[];
            //this.enemiesProjectiles = [];
            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInternal = 500;
            this.gameOver=false;
            this.score=0;
            this.lives=10;
            this.winingscore=60;
            this.bossAdded=false;
            // this.gameTime=0;
            // this.timeLimit=30000;
            this.speed=1;
            this.debug=false;
            this.currentLevel = 1;
            // this.levelDurations = [60000, 90000, 120000];
            // this.levelTimer = 0;
            this.levelStarted = false;
        }

        update(deltaTime) {
            // Code for Game Over
            if (this.gameOver) {
                return;
            }

            // if (!this.levelStarted) {
            //     this.levelStarted = true;
            //     this.enemyTimer = 0;
            //     this.levelTimer = 0;
            // }
    
            // // Update level timer
            // this.levelTimer += deltaTime;
    
            // // Check if the current level has ended
            // if (this.levelTimer >= this.levelDurations[this.currentLevel - 1]) {
            //     this.levelStarted = false;
            //     this.levelTimer = 0;
    
            //     // Move to the next level
            //     this.currentLevel++;
    
            //     // Check if all levels are completed
            //     if (this.currentLevel > this.levelDurations.length) {
            //         this.gameOver = true; 
            //         return;
            //     }
            // }

            // if (this.enemyTimer > this.enemyInterval && !this.gameOver && this.levelStarted) {
            //     this.addEnemy();
            //     this.enemyTimer = 0;
            // } else {
            //     this.enemyTimer += deltaTime;
            // }


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
                        // console.log(projectile);
                        // console.log(this.player);
                        // console.log(player);
                        // let a = projectile;
                        // let b = this.player;
                        // console.log(a.x <b.x+b.width);
                        // console.log(a.x + a.width > b.x);
                        // console.log(a.y <b.y+b.height);
                        // console.log(a.height +a.y>b.y);

                        this.lives--;
                        console.log(this.lives);
                    }
                });
        
                // Remove projectiles that are marked for deletion
                enemy.enemyProjectiles = enemy.enemyProjectiles.filter(projectile => !projectile.markedForDeletion);

                //
                //
                //
                ///
                //

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
            
            // Only add the boss enemy if it hasn't been added before
            if (!this.bossAdded && this.score > 1) {
                this.enemies.push(new Boss(this));
                this.bossAdded = true; // Set the flag to true once the boss is added
            }
            // If Boss Defeated Level Up
            if (this.bossAdded && this.enemies.length == 0) {
                //Level Up Code
                this.currentLevel++;
                showLevelCompletionPopup(game.currentLevel - 1);
                this.bossAdded = false;
            }


        }
        addExplosion(enemy){
            const random_explosion=Math.random();
            if(random_explosion < 1){
                this.explosions.push(new Smoke(this,enemy.x,enemy.y));
            }
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

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.draw(ctx);
        game.update(deltaTime);
        requestAnimationFrame(animate);
    }

    animate(0);
});
