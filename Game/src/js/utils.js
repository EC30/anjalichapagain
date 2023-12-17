const canvas = this.document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let game;
let levelCompleteScore = 0;
let startLevel = 0;
let runningLevel = startLevel;
let popupShown = false;
let maxSaves = 10;
let bonusLevelNumber = 0;
let playingBonusLevel=false;

let isGameRunning = false;


var levels = [
    { 
        level:1,
        enemiesNumber: 10,
        enemyInterval: 1000,
        maxEnemyPerScreen: 5,
        ammo : 20,
        maxAmmo : 50,
        ammoInterval : 500,
        lives : 15,
        winingscore : 10,
        speed : 1,
        droneCount : 4,
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
        lives : 20,
        winingscore : 20,
        speed : 2,
        droneCount : 6,
        playerProjectileSpeed : 3,
        enemyProjectileSpeed : 6,
        background : [
            layer1,
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
        lives : 30,
        winingscore : 70,
        speed : 3,
        droneCount : 8,
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
        timeframe: 30000,
        lives : 30,
        winingscore : 2,
        speed : 1,
        droneCount : 4,
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
const out_of_life_popup=document.getElementById('popup');
const pause=document.getElementById('pause');
const bonusPopup=document.getElementById('bonusPopup');
const bonusLoserPopup=document.getElementById('bonusLoserPopup');

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
    playingBonusLevel=true;
    completionPopup.style.display = "none";
    game.updateVariableValuesForLevelChange();
    startAnimation();
});

document.getElementById("continue_next").addEventListener("click", function () {
    completionPopup.style.display="none";
    moveToNextLevel();
});


document.getElementById("bonus_btn").addEventListener("click", function () {
    bonusPopup.style.display='none';
    popupShown = false;
    //runningLevel =3;
    playingBonusLevel=true;
    game.updateVariableValuesForLevelChange();
    startAnimation();
});

document.getElementById("bonus_loser_btn").addEventListener("click", function () {
    bonusLoserPopup.style.display='none';
    popupShown = false;
    //runningLevel =3;
    playingBonusLevel=true;
    game.updateVariableValuesForLevelChange();
    startAnimation();

});
document.getElementById("bonus_continue").addEventListener("click", function () {
    bonusPopup.style.display='none';
    levelCompleteScore+=game.score;
    playingBonusLevel=false;
    moveToNextLevel();

});

document.getElementById("bonus_loser_continue").addEventListener("click", function () {
    bonusLoserPopup.style.display='none';
    levelCompleteScore+=game.score;
    playingBonusLevel=false;
    moveToNextLevel();

});

// Play bonus level button click event
document.getElementById("playBonusLevel").addEventListener("click", function () {
    playingBonusLevel = true;
    startNewGame();
    popupShown = false;
    main_menu_container.style.display = "none";
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
    popupShown = false;
    //remove projectiles
    game.player.Projectiles = [];
    
    if(runningLevel >= levels.length){
        //Code for game Over 
        //alert("Game Over");
        runningLevel = 0;
        // overlay.querySelector('h3').innerHTML = "aaaa";
        overlay.querySelector('h3').innerHTML = "You Have Completed Level";
        overlay.querySelector('button').textContent = "Play Next Level";

        game.gameOver=true;
    }

    //Update Values Specific to Each level
    game.updateVariableValuesForLevelChange();
    console.log("Next Level");
    
    //start Animation
    startAnimation();
}


function saveGame(fileName){
    let savedGameData = [];
    let saveCount = 1;
    //Check if Saved Games Exist
    if(localStorage.getItem('savedGameData')){
        savedGameData = JSON.parse(localStorage.getItem('savedGameData'));

        if(savedGameData.length >= maxSaves){
            alert ("Maximum Saves Reached. Delete Saved Game First.");
            startAnimation();
            return;
        }
        saveCount = parseInt(savedGameData[savedGameData.length-1].replace('save',''))+1;
    }

    let userData = {
        saveName : fileName,
        saveLives : game.lives,
        saveLevel : runningLevel,
        saveCompleteScore : levelCompleteScore
    };

    let saveVariable = "save"+saveCount;
    // let saveVariable = userData.saveName;
    localStorage.setItem(saveVariable, JSON.stringify(userData));

    savedGameData.push(saveVariable);
    localStorage.setItem('savedGameData', JSON.stringify(savedGameData));

    // savedGameData = JSON.parse(localStorage.getItem('save1'));
    savedGameData = JSON.parse(localStorage.getItem('savedGameData'));
    alert("Game Saved Successfully");
    popupShown=false;
    startAnimation();

    // console.log(savedGameData);
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

    if(savedGameData.length <=0){
        deleteAllSaveGame();
    }
}

// function startNewGame(level){
//     isGameRunning = true;
//     runningLevel = level;
//     game = new Game(canvas.width, canvas.height);
//     startAnimation();
// }

const backButtonGame = document.getElementById('backButtonGame');

document.getElementById("backButtonGame").addEventListener("click", function () {
    stopAnimation();
    // main_menu_container.style.display = 'flex';
    game.inputHandler.destroy();
    goToMainMenu();
    game = null;
    backButtonGame.style.display = 'none';  
});

function startNewGame(level, savedGameData) {
    isGameRunning = true;
    runningLevel = level;
    
    if (savedGameData) {
        game = new Game(canvas.width, canvas.height, savedGameData.saveLevel);
        game.lives = savedGameData.saveLives;
        levelCompleteScore = savedGameData.saveCompleteScore;
    } else {
        // Start a new game
        game = new Game(canvas.width, canvas.height);
    }
    
    startAnimation();
}

function initializeGame(savedGameData) {
    stopAnimation(); // Stop the current animation if running
    startNewGame(savedGameData.saveLevel, savedGameData);
}


const backgroundImage = this.document.getElementById('background_image');
const main_menu_container = this.document.getElementById('container');
const canvas_container = this.document.getElementById('canvas-container');
canvas_container.style.height = canvas.height;
canvas_container.style.width = canvas.width;
// const savedGameList=this.document.getElementById('savedGameList');

function goToMainMenu(){
    isGameRunning = false;
    popupShown = false;
    // game.inputHandler.destroy();
    overlay.style.display = 'none';
    completionPopup.style.display = 'none';
    out_of_life_popup.style.display = 'none';
    pause.style.display = 'none';
    bonusPopup.style.display = 'none';
    bonusLoserPopup.style.display = 'none';

    levelCompleteScore = 0;

    main_menu_container.style.height = canvas.height;
    main_menu_container.style.display = 'flex';
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas_container.style.height = canvas.height;
    canvas_container.style.width = canvas.width;
    // Redraw background image when resizing
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
}


window.addEventListener('resize', resizeCanvas);


//   backgroundImage.onload = function() {
//     resizeCanvas();
//   };

document.getElementById("startNewGame").addEventListener("click", function () {
    main_menu_container.style.display = 'none';
    game = null;
    startNewGame(startLevel);    
});

let savedGameList;

document.getElementById('viewSaveGame').addEventListener('click', function () {
    main_menu_container.style.display = 'none';
    // savedGameList.style.display = 'flex';

    // savedListShown = true;
    
    savedGameList = document.createElement('div');
        savedGameList.id = 'savedGameList';
        savedGameList.style.display = 'flex';

    let backButton = document.createElement('button');
        backButton.id = 'backButton';
        backButton.className = 'backButton';
        backButton.textContent = '<- Go To Main Menu';

        backButton.onclick = function(){
            savedGameList.remove();
            main_menu_container.style.display = 'flex';
        };

    let heading = document.createElement('h3');
        heading.className = 'threeD';
        heading.textContent ='Saved Game List';

    savedGameList.appendChild(backButton);

    let savedGameListData = document.createElement('div');
        savedGameListData.id = 'savedGameListData';
        savedGameListData.style.display = 'flex';
        savedGameListData.style.height = String(canvas.height*0.8)+"px";
        savedGameListData.style.width = String(canvas.width*0.6)+"px";
        
    savedGameListData.appendChild(heading);
    
    // console.log(canvas.width);
    // console.log(canvas.height);
    // savedGameList.style.height = String(canvas.height*0.9)+"px";
    // savedGameList.style.width = String(canvas.width)+"px";
    // console.log(savedGameList.style.height);

    

    const savedGameData = JSON.parse(localStorage.getItem('savedGameData'));

    if (savedGameData && savedGameData.length > 0) {
        // Generate the saved game list
        let gameList = document.createElement('div');
        gameList.className = 'gameList-div';

        savedGameData.forEach((saveVariable) => {
            // console.log(saveVariable);
            let savedData = JSON.parse(localStorage.getItem(saveVariable));

            const nameList = document.createElement('div');
            nameList.className = 'nameList-div';
            
            const fileNameDiv = document.createElement('div');
            fileNameDiv.textContent = savedData.saveName;
            fileNameDiv.className="fileNameDiv";

            const playButton = document.createElement('button');
            playButton.textContent = 'Play Save';
            playButton.className='savePLayButton';
            playButton.addEventListener('click', () => {
                const savedGameData = JSON.parse(localStorage.getItem(saveVariable));
                initializeGame(savedGameData);
                savedGameList.style.display = 'none';
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete Save';
            deleteButton.className='savePLayButton';
            deleteButton.addEventListener('click', () => {
                console.log(saveVariable+" deleted");
                deleteSaveGame(saveVariable);
                alert("Saved Game "+savedData.saveName+" Deleted")
                savedGameList.remove();
                document.getElementById('viewSaveGame').click();
            });

            nameList.appendChild(fileNameDiv);
            nameList.appendChild(playButton);
            nameList.appendChild(deleteButton);
            gameList.appendChild(nameList);
        });

        savedGameListData.appendChild(gameList);
    } else {
        savedGameListData.innerHTML += '<p style="color: white;font-size:5rem;text-align:center;">No saved games found.</p>';
    }

    savedGameList.appendChild(savedGameListData);

    canvas_container.appendChild(savedGameList);
});