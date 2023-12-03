// var canvas = document.getElementById('canvas');
// if (canvas) {
//     canvas.style.backgroundColor = '#f0f0f0';
//     canvas.style.background = 'url("src/images/doodlejumpbg.png")';
//     canvas.style.backgroundSize = 'cover';
// }
// canvas.height = CANVAS_HEIGHT;
// canvas.width = CANVAS_WIDTH;
// var ctx = canvas.getContext('2d');
// let speedX=0;
// let speedY = 0; 
// let initialspeedY = -8; 
// let gravity = 0.4;
// let score = 0, maxScore = 0, gameOver = false, platformCount = 0, scoredPlatform = [];
// let tilesArray=[];

// let doodlerRightImg = new Image();
// let doodlerLeftImg = new Image();
// let tileImg = new Image();
// doodlerRightImg.src = "src/images/doodler-right.png";
// doodlerLeftImg.src = "src/images/doodler-left.png";
// tileImg.src="src/images/platform.png"

// let doodler = new Character(
//     doodlerRightImg, 
//     CANVAS_WIDTH / 2 - DOODLE_WIDTH / 2, 
//     CANVAS_HEIGHT * 7 / 8 - DOODLE_HEIGHT, 
//     DOODLE_WIDTH, 
//     DOODLE_HEIGHT
// );

// doodlerRightImg.onload = function () {
//     doodler.draw(ctx);
// }
// speedY = initialspeedY;
// loadTiles();
// requestAnimationFrame(update);
// document.addEventListener('keydown', animate);