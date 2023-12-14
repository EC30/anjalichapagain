class InputHandler {
    constructor(game) {
        this.game = game;
        this.sound=new Audio('./src/sound/bullet.mp3');
        
        window.addEventListener('keydown', e => {

            if(( (e.key ==='ArrowUp') || (e.key === 'ArrowDown') ) && this.game.keys.indexOf(e.key)=== -1){
                this.game.keys.push(e.key);
            }else if(e.key==='Control'){
                // console.log("shooting");
                this.game.player.shootTop();
                this.playShootSound(); 
                // this.sound.currentTime = 0;
                // this.sound.play();
            } else if(e.key==='d'){
                this.game.debug =!this.game.debug;
            } else if(e.key==='p'&& !popupShown){
                // console.log("P pressed");
                if(isAnimating){
                    // console.log("Animating");
                    // popupShown = true;
                    pause.style.display = "flex";
                    stopAnimation();
                }else{                    
                    // console.log("Not Animating");
                    // popupShown = false;
                    startAnimation();
                    pause.style.display = "none";
                }
            } else if(e.key==='q'){
                this.game.score += levels[runningLevel].winingscore+1;
                this.game.enemies = [];
            } else if(e.key==='x'){
                this.game.lives = 0;
            } else if(e.key==='s'){
                saveGame();
            } else if(e.key==='a'){
                deleteAllSaveGame();
            } 
        });
        
        window.addEventListener('keyup', e => {
            if(this.game.keys.indexOf(e.key) > -1){
                this.game.keys.splice(this.game.keys.indexOf(e.key),1);
            }
        });    
    }

    playShootSound() {
        // Check if the audio is already playing, and reset it to the beginning if true
        if (this.sound.paused) {
            this.sound.currentTime = 0;
        }
        // Play the shoot sound
        this.sound.play();
    }
}