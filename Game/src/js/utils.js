const canvas = this.document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let game;
let levelCompleteScore = 0;
let startLevel = 1;
let runningLevel = startLevel;
let popupShown = false;
let maxSaves = 10;
let bonusLevelNumber = 0;
let playingBonusLevel=false;

var levels = [
    { 
        level:1,
        enemiesNumber: 10,
        enemyInterval: 1000,
        maxEnemyPerScreen: 5,
        ammo : 20,
        maxAmmo : 50,
        ammoInterval : 500,
        lives : 30,
        winingscore : 3,
        speed : 1,
        droneCount : 1,
        playerProjectileSpeed : 3,
        enemyProjectileSpeed : 3,
        background : [
            layer2,
            layerBelow,
        ],
        backgroundSpeed : [
            0.2,
            1.5,
        ],
        enemyLife: {
            angler1Life: 2,
            angler2Life: 3,
            droneLife: 2,
            bossLife: 10,
        },
        // projectileEnemies : [
        //      "angler1",
        //     // "angler2"
        // ],
        
    },
    { 
        level:2,
        enemiesNumber: 20, 
        enemyInterval: 500,
        maxEnemyPerScreen: 5,
        ammo : 20,
        maxAmmo : 50,
        ammoInterval : 500,
        lives : 200,
        winingscore : 5,
        speed : 2,
        droneCount : 3,
        playerProjectileSpeed : 3,
        enemyProjectileSpeed : 6,
        background : [
            layer2,
            layerBelow,
        ],
        backgroundSpeed : [
            0.4,
            1.5,
        ],
        enemyLife: {
            angler1Life: 2,
            angler2Life: 3,
            droneLife: 2,
            bossLife: 20,
        },
        projectileEnemies : [
            "angler1",
            // "angler2"
        ],
        playBonusLevel: true,
    },
    { 
        level:3,
        enemiesNumber: 30, 
        enemyInterval: 200,
        maxEnemyPerScreen: 5,
        ammo : 20,
        maxAmmo : 50,
        ammoInterval : 500,
        lives : 300,
        winingscore : 7,
        speed : 3,
        droneCount : 5,
        playerProjectileSpeed : 3,
        enemyProjectileSpeed : 9,
        background : [
            layer3a,
            layer3b,
            layerBelow,
        ],
        backgroundSpeed : [
            0.4,
            0.4,
            1.5,
        ],
        enemyLife: {
            angler1Life: 2,
            angler2Life: 3,
            droneLife: 2,
            bossLife: 30,
        },
        projectileEnemies : [
            "angler1",
            "angler2"
        ],
    },
];

var bonusLevels = [
    { 
        enemiesNumber: 100,
        enemyInterval: 1000,
        maxEnemyPerScreen: 5,
        ammo : 20,
        maxAmmo : 50,
        ammoInterval : 500,
        timeframe: 60000,
        lives : 30,
        winingscore : 3,
        speed : 1,
        droneCount : 1,
        playerProjectileSpeed : 3,
        enemyProjectileSpeed : 3,
        background : [
            bonusLayer,
            layerBelow,
        ],
        backgroundSpeed : [
            0.2,
            1.5,
        ],
        enemyLife: {
            angler1Life: 2,
            angler2Life: 3,
            droneLife: 2,
            bossLife: 10,
        },
        projectileEnemies : [
             "angler1",
        ],
        
    },
];

const overlay = document.getElementById("overlay");
const completionPopup=document.getElementById('completionPopup');

canvas.width=this.window.innerWidth;
canvas.height=this.window.innerHeight;

let lastTime = 0;
var animation;
var isAnimating = false;

document.getElementById("next-level").addEventListener("click", function () {
    overlay.style.display = "none";
    moveToNextLevel();
});

document.getElementById("play_again").addEventListener("click", function () {
    popupShown = false;
    out_of_life_popup.style.display = "none";
    resetAndRestartGame(startLevel);
});

document.getElementById("continue").addEventListener("click", function () {
    pause.style.display = "none";
    startAnimation();
    
});

document.getElementById("completion_btn").addEventListener("click", function () {
    popupShown = false;
    //runningLevel =3;

    completionPopup.style.display = "none";
    game.updateVariableValuesForLevelChange();
    startAnimation();
});
document.getElementById("continue_next").addEventListener("click", function () {
    completionPopup.style.display="none";
    moveToNextLevel();
});


document.getElementById("bonus_btn").addEventListener("click", function () {

});

document.getElementById("bonus_loser_btn").addEventListener("click", function () {

});

function resetAndRestartGame(resetLevel){
    levelCompleteScore = 0;
    runningLevel = resetLevel;

    game.updateVariableValuesForLevelChange();
    game.enemies = [];
    game.bossAdded = false;  
    startAnimation();
}

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
    if(!isAnimating){
        //start Animation
        isAnimating = true;
        animation = requestAnimationFrame(animate);
    }
}

function stopAnimation(){
    if(isAnimating){
        //stop animation
        isAnimating = false;
        cancelAnimationFrame(animation);
    }
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)  + min);
}

function moveToNextLevel() {
    //console.log("MOVE TO NEXT LEVEL")
    popupShown = false;
    //remove projectiles
    game.player.Projectiles = [];
    
    if(runningLevel >= levels.length){
        //Code for game Over 
        alert("Game Over");
        runningLevel = 0;
    }

    //Update Values Specific to Each level
    game.updateVariableValuesForLevelChange();

    

    console.log("Next Level");
    
    //start Animation
    startAnimation();
}

// function startNewGame(level){
//     game = null;
//     // console.log(level);
    
//     game = new Game(canvas.width, canvas.height, level);
//     startAnimation();
//     // startAnimation();
// }

function saveGame(){
    let savedGameData = [];
    let saveCount = 1;
    //Check if Saved Games Exist
    if(localStorage.getItem('savedGameData')){
        savedGameData = JSON.parse(localStorage.getItem('savedGameData'));

        if(savedGameData.length >= maxSaves){
            return;
        }

        saveCount = parseInt(savedGameData[savedGameData.length-1].replace('save',''))+1;
        // saveCount = savedGameData.length+1;
        // console.log(savedGameData);
        // console.log(saveCount);
    }

    let userData = {
        saveLives : game.lives,
        saveLevel : runningLevel,
        saveCompleteScore : levelCompleteScore
    };

    let saveVariable = "save"+saveCount;
    localStorage.setItem(saveVariable, JSON.stringify(userData));

    savedGameData.push(saveVariable);
    localStorage.setItem('savedGameData', JSON.stringify(savedGameData));

    // savedGameData = JSON.parse(localStorage.getItem('save1'));
    savedGameData = JSON.parse(localStorage.getItem('savedGameData'));
    console.log(savedGameData);
    // localStorage.clear();   
    // localStorage.removeItem('itemname');
}

function deleteAllSaveGame(){    
    localStorage.clear();   
}

function deleteSaveGame(saveVariable){
    //remove index of saved variable for saved game data array
    let savedGameData = JSON.parse(localStorage.getItem('savedGameData'));
    const index = savedGameData.indexOf(saveVariable);
    if (index > -1) { // only splice array when item is found
        savedGameData.splice(index, 1); // 2nd parameter means remove one item only
    }
    localStorage.setItem('savedGameData', JSON.stringify(savedGameData));
    
    //remove saved Data of Variable
    localStorage.removeItem(saveVariable);
}