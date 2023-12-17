// Getting references to audio elements from the HTML document.
const explosionSoundElement = document.getElementById("explosionSound");
const powerSoundElement = document.getElementById("powerSound");
const collisionSoundElement = document.getElementById("collisionSound");
const powerDownSoundElement = document.getElementById("powerDownSound");
const clicksoundElement = document.getElementById('clickSound');
const backgroundsoundElement = document.getElementById('backgroundSound');

// Function to play the background sound.
function playBackgroundSound() {
    backgroundsoundElement.play();
}

// Function to play the shoot (collision) sound.
function playShootSound() {
    collisionSoundElement.play();
}

// Function to play the click sound.
function playClickSound() {
    clicksoundElement.play();
}

// Function to play the explosion sound.
function playExplosionSound() {
    explosionSoundElement.play();
}

// Function to play the power-up sound.
function playPowerSound() {
    powerSoundElement.play();
}

// Function to play the collision sound.
function playCollisionSound() {
    collisionSoundElement.play();
}

// Function to play the power-down sound.
function playPowerDownSound() {
    powerDownSoundElement.play();
}
