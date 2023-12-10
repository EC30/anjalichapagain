const canvas = this.document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let game;

const overlay = document.getElementById("overlay")

canvas.width=this.window.innerWidth;
canvas.height=this.window.innerHeight;

console.log(`Dimensions: Width = ${canvas.width}, Height = ${canvas.height}`);
let lastTime = 0;
var animation;
var isAnimating = true;

document.getElementById("next-level").addEventListener("click", function () {
    game.currentLevel++; 
    // game.bossAdded = false; 
    // game.levelStarted = true;
    // game.startLevel(); 
    overlay.style.display = "none";
    
    //remove projectiles
    game.player.Projectiles = [];
    
    //start Animation
    startAnimation();
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