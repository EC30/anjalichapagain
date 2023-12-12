const canvas = this.document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let game;
let levelCompleteScore = 0;
let startLevel = 0;
let runningLevel = startLevel;

var levels = [
    { 
        enemiesNumber: 1,
        enemyInterval: 1000,
        ammo : 20,
        maxAmmo : 50,
        ammoInterval : 500,
        lives : 10,
        winingscore : 60,
        speed : 1,
        backgroundImage: document.getElementById('layer1'),
            
    },
    { 
        enemiesNumber: 2, 
        enemyInterval: 500,
        ammo : 20,
        maxAmmo : 50,
        ammoInterval : 500,
        lives : 20,
        winingscore : 160,
        speed : 2,
        backgroundImage: document.getElementById('layer2'),
    },
    { 
        enemiesNumber: 3, 
        enemyInterval: 200,
        ammo : 20,
        maxAmmo : 50,
        ammoInterval : 500,
        lives : 30,
        winingscore : 260,
        speed : 3,
        backgroundImage: document.getElementById('layer3'),
    },
    { 
        enemiesNumber: 4, 
        enemyInterval: 200,
        ammo : 20,
        maxAmmo : 50,
        ammoInterval : 500,
        lives : 20,
        winingscore : 260,
        timer:120000,
        speed : 3,
        backgroundImage: document.getElementById('layer3'),
    },
];

const overlay = document.getElementById("overlay")

canvas.width=this.window.innerWidth;
canvas.height=this.window.innerHeight;

console.log(`Dimensions: Width = ${canvas.width}, Height = ${canvas.height}`);
let lastTime = 0;
var animation;
var isAnimating = true;

document.getElementById("next-level").addEventListener("click", function () {
    runningLevel++;
    overlay.style.display = "none";
    // game.bossAdded = false; 
    // game.levelStarted = true;
    //game.startLevel(); 
    if(runningLevel >= levels.length){
        //Code for game Over 
        alert("Game Over");
        runningLevel = startLevel;
    }

    startNewGame(runningLevel);
    
    //remove projectiles
    game.player.Projectiles = [];
    
    //start Animation
    startAnimation();
});

document.getElementById("play").addEventListener("click", function () {
    game.resetGame();
    startAnimation();
    popup.style.display = "none";
});

document.getElementById("continue").addEventListener("click", function () {
    pause.style.display = "none";
    startAnimation();
    
});

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    game.draw(ctx);
    game.update(deltaTime);
    if(isAnimating){
        animation = requestAnimationFrame(animate);
    }
}


function startAnimation(){
    //start Animation
    isAnimating = true;
    animation = requestAnimationFrame(animate);
}

function stopAnimation(){
    //stop animation
    isAnimating = false;
    cancelAnimationFrame(animation);
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)  + min);
}

function moveToNextLevel() {
    console.log("MOVE TO NEXT LEVEL")
}

function startNewGame(level){
    game = new Game(canvas.width, canvas.height, level);

}