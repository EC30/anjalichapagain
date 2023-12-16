class InputHandler {
    constructor(game) {
        this.game = game;
        this.sound=new Audio('./src/sound/bullet.mp3');
        
        window.addEventListener('keydown', this.keydownFunction);
        
        window.addEventListener('keyup', this.keyupFunction); 
        console.log(this.game.keys);   
    }

    playShootSound() {
        // Check if the audio is already playing, and reset it to the beginning if true
        if (this.sound.paused) {
            this.sound.currentTime = 0;
        }
        // Play the shoot sound
        this.sound.play();
    }

    destroy(){
        window.removeEventListener('keyup', this.keyupFunction);
        window.removeEventListener('keydown', this.keydownFunction);
    }

    keyupFunction(e){
        this.game = game;
        if(this.game.keys.indexOf(e.key) > -1){
            this.game.keys.splice(this.game.keys.indexOf(e.key),1);
        }
    }

    keydownFunction(e){
        if(!isGameRunning){
            return;
        }
        this.game = game;
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
        } else if(e.key==='p' && !popupShown){
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
            console.log('c');
            popupShown=true;
            stopAnimation();
            saveGamePrompt();
        } else if(e.key==='a'){
            deleteAllSaveGame();
        } 
    }
}

function saveGamePrompt() {
    let fileName = prompt("Name your save file");
    if(fileName === null) {
        popupShown = false;
        startAnimation();
        return;
    }
    if (fileName === '' ) {
      saveGamePrompt();
      console.log('a');
    }else{
       saveGame(fileName); 
       console.log('b');
    }
    
  }