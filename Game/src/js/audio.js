const explosionSoundElement = document.getElementById("explosionSound");
const powerSoundElement = document.getElementById("powerSound");
const collisionSoundElement = document.getElementById("collisionSound");
const powerDownSoundElement = document.getElementById("powerDownSound");
const clicksoundElement=document.getElementById('clickSound');
const backgroundsoundElement=document.getElementById('backgroundSound');

function playBackgroundSound(){
    backgroundsoundElement.play();
}
function playClickSound(){
    clicksoundElement.play();
}

function playExplosionSound() {
    explosionSoundElement.play();
}

function playPowerSound() {
    powerSoundElement.play();
}

function playCollisionSound() {
    collisionSoundElement.play();
}

function playPowerDownSound() {
    powerDownSoundElement.play();
}