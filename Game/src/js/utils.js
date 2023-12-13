const canvas = this.document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let game;
let levelCompleteScore = 0;
let startLevel = 2;
let runningLevel = startLevel;

var levels = [
    { 
        level:1,
        enemiesNumber: 1,
        enemyInterval: 1000,
        ammo : 20,
        maxAmmo : 50,
        ammoInterval : 500,
        lives : 10,
        winingscore : 3,
        speed : 1,
        backgroundImage: document.getElementById('layer1'),
            
    },
    { 
        level:2,
        enemiesNumber: 1, 
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
        level:3,
        enemiesNumber: 1, 
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
        level:4,
        enemiesNumber: 10,
        enemyInterval: 1000,
        ammo: 20,
        maxAmmo: 50,
        ammoInterval: 500,
        lives: 10,
        winingscore: 10,
        speed: 4,
        backgroundImage: document.getElementById('layer5'), 
    },
];

const overlay = document.getElementById("overlay")
const completionPopup=document.getElementById('completionPopup');

canvas.width=this.window.innerWidth;
canvas.height=this.window.innerHeight;

console.log(`Dimensions: Width = ${canvas.width}, Height = ${canvas.height}`);
let lastTime = 0;
var animation;
var isAnimating = true;



document.getElementById("next-level").addEventListener("click", function () {
    runningLevel++;
    overlay.style.display = "none";
    if (runningLevel >= levels.length) {
        // Code for game over 
        alert("Game Over");
        runningLevel = startLevel;
    }
    startNewGame(runningLevel);
    // Remove projectiles
    game.player.Projectiles = [];
    
    // Start Animation
    startAnimation();
});

// ... (rest of the code remains unchanged)



document.getElementById("play").addEventListener("click", function () {
    game.resetGame();
    startAnimation();
    popup.style.display = "none";
});

document.getElementById("continue").addEventListener("click", function () {
    pause.style.display = "none";
    startAnimation();
    
});
document.getElementById("completion_btn").addEventListener("click", function () {
    runningLevel =3;
    completionPopup.style.display = "none";
    startNewGame(runningLevel);
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