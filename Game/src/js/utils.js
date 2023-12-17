// Get canvas and 2D rendering context
const canvas = this.document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//game variables
let game;
let levelCompleteScore = 0;
let startLevel = 0;
let runningLevel = startLevel;
let popupShown = false;
let maxSaves = 10;
let bonusLevelNumber = 0;
let playingBonusLevel=false;

let isGameRunning = false;

// Define levels with their configurations
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
        winingscore : 30,
        speed : 1,
        droneCount : 4,
        playerProjectileSpeed : 3,
        enemyProjectileSpeed : 3,
        // Background layers and their speeds
        background : [
            layer2,
            layerBelow,
        ],
        backgroundSpeed : [
            0.2,
            1.5,
        ],
        // Enemy life values
        enemyLife: {
            angler1Life: 2,
            angler2Life: 3,
            droneLife: 2,
            bossLife: 10,
        },
        
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
        winingscore : 50,
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
        // Types of projectile enemies
        projectileEnemies : [
            "angler1",
            // "angler2"
        ],
        // Bonus level indicator
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
// Defining bonus levels with their configurations
var bonusLevels = [
    { 
        enemiesNumber: 100,
        enemyInterval: 1000,
        maxEnemyPerScreen: 5,
        ammo : 20,
        maxAmmo : 50,
        ammoInterval : 500,
        timeframe: 120000, // Time limit for the bonus level
        lives : 30,
        winingscore : 40,
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

// Get DOM elements
const overlay = document.getElementById("overlay"); // Overlay element for UI
const completionPopup = document.getElementById('completionPopup'); // Completion popup element
const out_of_life_popup = document.getElementById('popup'); // Game over popup element
const pause = document.getElementById('pause'); // Pause button element
const bonusPopup = document.getElementById('bonusPopup'); // Bonus level success popup element
const bonusLoserPopup = document.getElementById('bonusLoserPopup'); // Bonus level failure popup element

// Set canvas dimensions to match window size
canvas.width = this.window.innerWidth;
canvas.height = this.window.innerHeight;

// Animation related variables
let lastTime = 0;
var animation; // Variable to store animation frame
var isAnimating = false; // Flag to track animation state

// Event listeners for various UI buttons

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
    console.log(runningLevel);
    startNewGame(runningLevel);
    popupShown = false;
    main_menu_container.style.display = "none";
});

// Reset and restart the game at a specified level
function resetAndRestartGame(resetLevel){
    levelCompleteScore = 0;
    runningLevel = resetLevel;
    // Update game variables for level change
    game.updateVariableValuesForLevelChange();
    // Clear enemies and reset boss flag
    game.enemies = [];
    game.bossAdded = false; 
    //start animation loop 
    startAnimation();
}
// Animation loop function
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

// Start the animation loop
function startAnimation(){
    if(!isAnimating){
        //start Animation
        isAnimating = true;
        animation = requestAnimationFrame(animate);
    }
}
// Stop the animation loop
function stopAnimation(){
    if(isAnimating){
        //stop animation
        isAnimating = false;
        cancelAnimationFrame(animation);
    }
}
// Generate a random integer within a specified range
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)  + min);
}

// Move to the next level in the game
function moveToNextLevel() {
    popupShown = false;
    //remove projectiles
    game.player.Projectiles = [];
    
    if(runningLevel >= levels.length){
        //Code for game Over 
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


/**
 * Save the current game state with a specified file name.
 * 
 * @param {*} fileName - The name to be associated with the saved game.
 * @returns {undefined} - This function does not have a specific return value.
 */

function saveGame(fileName) {
    // Initialize variables for saved game data and save count
    let savedGameData = [];
    let saveCount = 1;

    // Check if saved games exist
    if (localStorage.getItem('savedGameData')) {
        savedGameData = JSON.parse(localStorage.getItem('savedGameData'));

        // Check if maximum save count is reached
        if (savedGameData.length >= maxSaves) {
            alert("Maximum Saves Reached. Delete Saved Game First.");
            startAnimation();
            return;
        }

        // Determine the save count based on existing saved games
        saveCount = parseInt(savedGameData[savedGameData.length - 1].replace('save', '')) + 1;
    }

    // Prepare user data for saving
    let userData = {
        saveName: fileName,                 // User-defined save name
        saveLives: game.lives,              // Current player lives
        saveLevel: runningLevel,            // Current game level
        saveCompleteScore: levelCompleteScore, // Accumulated score
        saveScore: game.score
    };

    // Generate a save variable name
    let saveVariable = "save" + saveCount;
    localStorage.setItem(saveVariable, JSON.stringify(userData));

    // Update saved game data array
    savedGameData.push(saveVariable);
    localStorage.setItem('savedGameData', JSON.stringify(savedGameData));

    // Display success message and start animation
    alert("Game Saved Successfully");
    popupShown = false;
    startAnimation();
}

/**
 * Delete all saved games from the local storage.
 */
function deleteAllSaveGame(){    
    localStorage.clear();   
}
/**
 * Delete a specific saved game based on the save variable.
 * 
 * @param {string} saveVariable - The save variable associated with the saved game.
 */
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


// Get the back button element from the DOM
const backButtonGame = document.getElementById('backButtonGame');

// Add a click event listener to the back button
document.getElementById("backButtonGame").addEventListener("click", function () {
    // Stop the game animation
    stopAnimation();

    // Destroy the input handler associated with the game
    game.inputHandler.destroy();

    // Navigate to the main menu
    goToMainMenu();

    // Set the game object to null
    game = null;

    // Hide the back button
    backButtonGame.style.display = 'none';
});

/**
 * Start a new game, either from a specific level or from saved game data.
 * 
 * @param {number} level - The level to start the new game from.
 * @param {Object} savedGameData - The saved game data to restore a game state (optional).
 */
function startNewGame(level, savedGameData) {
    // Set the flag indicating that a game is currently running
    isGameRunning = true;
    runningLevel = level;

    // Create a new game instance
    if (savedGameData) {
        // If saved game data is provided, restore the game state
        game = new Game(canvas.width, canvas.height, savedGameData.saveLevel);
        game.lives = savedGameData.saveLives;
        levelCompleteScore = savedGameData.saveCompleteScore;
        game.score=savedGameData.saveScore;
    } else {
        // If no saved game data, start a new game from the specified level
        game = new Game(canvas.width, canvas.height);
    }

    // Start the animation loop
    startAnimation();
}

/**
 * Initialize the game with saved game data.
 * 
 * @param {Object} savedGameData - The saved game data to restore the game state.
 */
function initializeGame(savedGameData) {
    // Stop the current animation if running
    stopAnimation();

    // Start a new game using the saved game data
    startNewGame(savedGameData.saveLevel, savedGameData);
}

// Get DOM elements
const backgroundImage = this.document.getElementById('background_image');
const main_menu_container = this.document.getElementById('container');

// Set initial canvas container dimensions to match canvas size
const canvas_container = this.document.getElementById('canvas-container');
canvas_container.style.height = canvas.height;
canvas_container.style.width = canvas.width;

/**
 * Navigate to the main menu, hiding game-related elements and resetting scores.
 */
function goToMainMenu() {
    isGameRunning = false;
    popupShown = false;

    // Hide various UI elements related to gameplay
    overlay.style.display = 'none';
    completionPopup.style.display = 'none';
    out_of_life_popup.style.display = 'none';
    pause.style.display = 'none';
    bonusPopup.style.display = 'none';
    bonusLoserPopup.style.display = 'none';

    // Reset levelCompleteScore
    levelCompleteScore = 0;

     // Reset the level to the initial level
     runningLevel = startLevel;

     // Reset other relevant variables if needed
     playingBonusLevel = false;

    // Adjust main menu container dimensions and display
    main_menu_container.style.height = canvas.height;
    main_menu_container.style.display = 'flex';

    // Clear canvas and draw the background image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}
/**
 * Resize the canvas and adjust canvas container dimensions when the window is resized.
 */
function resizeCanvas() {
    // Update canvas dimensions to match window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Update canvas container dimensions
    canvas_container.style.height = canvas.height;
    canvas_container.style.width = canvas.width;
    // Redraw background image when resizing if it is loaded
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
}

// Add event listener for window resize to trigger canvas resizing
window.addEventListener('resize', resizeCanvas);


// Add event listener for starting a new game
document.getElementById("startNewGame").addEventListener("click", function () {
    // Hide the main menu and start a new game
    main_menu_container.style.display = 'none';
    game = null;
    startNewGame(startLevel);
});

// Initialize variable for saved game list
let savedGameList;

// Add event listener for viewing the saved game list
document.getElementById('viewSaveGame').addEventListener('click', function () {
    // Hide the main menu
    main_menu_container.style.display = 'none';

    // Create a new element to display the saved game list
    savedGameList = document.createElement('div');
    savedGameList.id = 'savedGameList';
    savedGameList.style.display = 'flex';

    // Create a "Go To Main Menu" button
    let backButton = document.createElement('button');
    backButton.id = 'backButton';
    backButton.className = 'backButton';
    backButton.textContent = '<- Go To Main Menu';

    // Add event listener to the "Go To Main Menu" button
    backButton.onclick = function () {
        savedGameList.remove();
        main_menu_container.style.display = 'flex';
    };

    // Create a heading for the saved game list
    let heading = document.createElement('h3');
    heading.className = 'threeD';
    heading.textContent = 'Saved Game List';

    savedGameList.appendChild(backButton);

    // Create a container for saved game list data
    let savedGameListData = document.createElement('div');
    savedGameListData.id = 'savedGameListData';
    savedGameListData.style.display = 'flex';
    savedGameListData.style.height = String(canvas.height * 0.8) + "px";
    savedGameListData.style.width = String(canvas.width * 0.6) + "px";

    savedGameListData.appendChild(heading);

    // Retrieve saved game data from local storage
    const savedGameData = JSON.parse(localStorage.getItem('savedGameData'));

    if (savedGameData && savedGameData.length > 0) {
        // Generate the saved game list
        let gameList = document.createElement('div');
        gameList.className = 'gameList-div';

        savedGameData.forEach((saveVariable) => {
            let savedData = JSON.parse(localStorage.getItem(saveVariable));

            // Create elements for each saved game entry
            const nameList = document.createElement('div');
            nameList.className = 'nameList-div';

            const fileNameDiv = document.createElement('div');
            fileNameDiv.textContent = savedData.saveName;
            fileNameDiv.className = "fileNameDiv";

            const playButton = document.createElement('button');
            playButton.textContent = 'Play Save';
            playButton.className = 'savePLayButton';
            
            // Add event listener to the "Play Save" button
            playButton.addEventListener('click', () => {
                const savedGameData = JSON.parse(localStorage.getItem(saveVariable));
                initializeGame(savedGameData);
                savedGameList.style.display = 'none';
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete Save';
            deleteButton.className = 'savePLayButton';

            // Add event listener to the "Delete Save" button
            deleteButton.addEventListener('click', () => {
                console.log(saveVariable + " deleted");
                deleteSaveGame(saveVariable);
                alert("Saved Game " + savedData.saveName + " Deleted");
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
        // Display a message when no saved games are found
        savedGameListData.innerHTML += '<p style="color: white;font-size:5rem;text-align:center;">No saved games found.</p>';
    }

    savedGameList.appendChild(savedGameListData);

    // Append the saved game list to the canvas container
    canvas_container.appendChild(savedGameList);
});
