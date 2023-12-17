/**
 * Game class representing the game state.
 * Manages game-related variables, UI, input, enemies, explosions, and other game elements.
 * Initializes values and calls a function to update variable values based on the current level.
 *
 * @param {number} width - The width of the game canvas.
 * @param {number} height - The height of the game canvas.
 */
class Game {
    constructor(width, height) {
        this.currentLevel = runningLevel;
        this.width = width;
        this.height = height;
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
        
        // Call function to update variable values based on the current level
        this.updateVariableValuesForLevelChange();

    }
    /**
     * Updates the game variable values based on the current level or bonus level.
     * Adjusts background, input handler, player, and other game parameters accordingly.
     */
    updateVariableValuesForLevelChange(){
        let levelArray=levels;
        let levelNumber=runningLevel;
        if(playingBonusLevel){
            levelArray=bonusLevels;
            levelNumber=bonusLevelNumber;
            this.timeFrame=levelArray[levelNumber].timeframe;
        }
         // Destroy the existing input handler if it exists
        if (this.inputHandler) {
            this.inputHandler.destroy();
        }
        // Initialize new background, input handler, and player objects
        this.background=new Background(this,levelArray[levelNumber].background,levelArray[levelNumber].backgroundSpeed);
        this.inputHandler = new InputHandler(this);
        this.player = new Character(this); 

        // Reset various game parameters
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

        // Reset kill counters and power-up status
        this.regularEnemyKills = 0;
        this.isPowerUp = false;

        // Clear the enemies array
        this.enemies = [];
    }
    /**
     * Updates the game state based on the elapsed time (deltaTime).
     * Handles various game events such as player and enemy updates, collisions, power-ups, and level completion.
     * 
     * @param {number} deltaTime - The time elapsed since the last update in milliseconds.
     */
    update(deltaTime) {
        // Check if the game is over, and return to the main menu if needed
        if (this.gameOver) {
            //return to main menu
            stopAnimation();
            game = null;
            console.log(game);
            goToMainMenu();
            return;
        }

        // Check for power-up activation based on regular enemy kills
        if(this.regularEnemyKills >=10){
            this.isPowerUp = true;
            this.regularEnemyKills = 0;
            this.player.fireballPowerUp();
        }
        // Check and update bonus level conditions if playing a bonus level
         if(playingBonusLevel){
            const bonusPopup = document.getElementById("bonusPopup")
            const bonusLoserPopup = document.getElementById("bonusLoserPopup")
            
            const timeLimit=this.timeFrame;
            console.log(timeLimit);
            this.gameTime += deltaTime;
            
            // Check for bonus level completion or failure based on time limit and score
            if (this.gameTime > timeLimit && this.score >= this.winingscore) {
                bonusPopup.style.display="flex";
                popupShown=true;
                stopAnimation();                   
            }else if(this.gameTime > timeLimit && this.score < this.winingscore){
               bonusLoserPopup.style.display="flex";
               popupShown=true;
               stopAnimation();
            }
        }
         // Update game time if the game is not over
        if(!this.gameOver) this.gameTime +=deltaTime;
         // Update background, player, and ammo-related variables
        this.background.update();
        this.player.update(deltaTime);
        // Update ammo count at regular intervals
        if(this.ammoTimer > this.ammoInterval) {
            if(this.ammo < this.maxAmmo) this.ammo++;
            this.ammoTimer = 0;
        } else {
            this.ammoTimer += deltaTime;
        }
        // Update and filter explosions array
        this.explosions.forEach(explosion=>explosion.update());
        this.explosions=this.explosions.filter(explosion=>!explosion.markedForDeletion);

         // Update enemies and check collisions
        this.enemies.forEach(enemy=>{
            enemy.update();
                enemy.throwProjectile();

            // Check collision with the player
            if(this.checkCollision(this.player,enemy)){
                enemy.markedForDeletion=true;
                this.addExplosion(enemy);
                if(enemy.type ==='lucky'){
                    this.player.enterPowerUp();
                }else{
                    this.lives--;
                    this.regularEnemyKills = 0;
                }
            }
              // Check collision with enemy projectiles
            enemy.enemyProjectiles.forEach(projectile => {
                //projectile.update();
                if (this.checkCollision(projectile, this.player, "player")) {
                    projectile.markedForDeletion = true;
                    this.lives--;
                    if(enemy.type === 'boss'){
                        this.lives --;
                    }
                }
            });
            enemy.enemyProjectiles = enemy.enemyProjectiles.filter(projectile => !projectile.markedForDeletion);

            // Check collision with player projectiles and update score
            this.player.Projectiles.forEach(Projectile=>{
                if(this.checkCollision(Projectile,enemy,"projectile")){
                    enemy.lives--;
                    Projectile.markedForDeletion=true;
                    this.addExplosion(enemy);
                    if(enemy.lives <=0){
                        playExplosionSound();
                        enemy.markedForDeletion=true;
                        // Spawn drones if a boss is defeated
                        if(enemy.type === 'boss'){
                            for(let i=0;i<this.droneCount;i++){
                                this.enemies.push(new Drone(this,
                                    getRandomInteger(this.width/2,this.width),
                                    getRandomInteger(0,canvas.height-200)));                                        
                            }
                        }
                        // Update regular enemy kills and score
                        if(!this.isPowerUp){
                            this.regularEnemyKills++;
                        }
                        if(!this.gameOver) this.score +=enemy.score;
                    }
                }
            })
        });
        
        // Filter out enemies marked for deletion
        this.enemies=this.enemies.filter(enemy=>!enemy.markedForDeletion);
         // Add new enemies at regular intervals
        if(this.enemyTimer > this.enemyInterval && !this.gameOver) {
            this.addEnemy();
            this.enemyTimer= 0;
        } else {
            this.enemyTimer += deltaTime;
        }
    }
    /**
     * Draws all game elements on the canvas, including the background, player, UI, enemies, and explosions.
     * 
     * @param {CanvasRenderingContext2D} context - The 2D rendering context of the canvas.
     */
    draw(context) {
        this.background.draw(context);
        this.player.draw(context);
        this.UI.draw(context);

        this.enemies.forEach(enemy=>{
            enemy.draw(context);
        });

        this.explosions.forEach(explosion=>{
            explosion.draw(context);
        });
    }
    /**
     * Adds a new enemy to the game based on random selection, considering the maximum number of enemies on the screen.
     * If playing a bonus level, there is a chance to add a Boss enemy.
     */
    addEnemy(){
        // Check if the maximum number of enemies on the screen is reached and the Boss is not added
        if(this.enemies.length < this.maxEnemyPerScreen  && !this.bossAdded){
            const random_enemy=Math.random();
            if(random_enemy < 0.20 && playingBonusLevel){
                // 20% chance for Boss during bonus level
                this.enemies.push(new Boss(this));
            }else if(random_enemy < 0.45){
                // 25% chance for Angler1
                this.enemies.push(new Angler1(this));
            }else if(random_enemy <0.9){
                 // 45% chance for Angler1
                this.enemies.push(new Angler2(this));
            }else{
                 // 10% chance for Angler1
                this.enemies.push(new lucky(this));
            }
        }
        //If the boss is not added and the player's score surpasses the winingscore and not playing bonus level, a Boss enemy is added.
        if (!this.bossAdded && this.score > this.winingscore && !playingBonusLevel) {
            this.enemies.push(new Boss(this));
            this.bossAdded = true; 
        }
        // If Boss Defeated Level Up
        // If the Boss is defeated and no other enemies remain, level up and display completion pop-up.
        if (this.bossAdded && this.enemies.length == 0 && !playingBonusLevel) {
            this.bossAdded = false;
            stopAnimation();
            // Check if it's time to display the completion pop-up or move to the next level
            if(this.playBonusLevel){
                completionPopup.style.display='flex';
            } else {
                overlay.style.display = "flex";
                if(runningLevel >= levels.length-1){
                    overlay.querySelector('h3').innerHTML = "You Have Completed All Levels";
                    overlay.querySelector('button').textContent = "Go To Main Menu";
                }
            }
            //Level Up Code
            runningLevel++;

            //Update Level Complete Score
            levelCompleteScore += this.score;
            popupShown = true;
            
        }
    }
    /**
     * Adds an explosion effect to the game based on a random choice between Smoke and Fire.
     * 
     * @param {Enemy} enemy - The enemy object for which the explosion effect is generated.
     */
    addExplosion(enemy){
        // Generate a random value for choosing between Smoke and Fire
        const random_explosion=Math.random();
         // Create an explosion based on the random value
        if(random_explosion < 0.5){
            this.explosions.push(new Smoke(this,enemy.x,enemy.y));
        } else{
            this.explosions.push(new Fire(this,enemy.x,enemy.y)); 
        }
    }
    /**
     * Checks for collision between two game entities.
     * 
     * @param {Entity} a - The first game entity, often representing a projectile or player.
     * @param {Entity} b - The second game entity with which collision is being checked.
     * @param {string} c - An optional parameter to specify the type of collision check (default: "other").
     * @returns {boolean} - Returns true if a collision is detected, otherwise false.
     */
    checkCollision(a,b,c="other"){
        // If b is of type "lucky" and c is "projectile", no collision check is needed
        if(b.type === "lucky" && c=="projectile"){
            return false;
        }
         // Check for collision based on the positions and dimensions of the entities
        return (a.x <b.x+b.width &&
        a.x + a.width > b.x &&
        a.y <b.y+b.height &&
        a.height +a.y>b.y)
        
    }
}
