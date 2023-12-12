class InputHandler {
    constructor(game) {
        this.game = game;
        this.sound=new Audio('http://cd.textfiles.com/mmplatinum/SOUNDS/WAV/MOREWAV2/GUNOCHT.WAV');
        
        window.addEventListener('keydown', e => {

            if(( (e.key ==='ArrowUp') || (e.key === 'ArrowDown') ) && this.game.keys.indexOf(e.key)=== -1){
                this.game.keys.push(e.key);
            }else if(e.key==='Control'){
                this.game.player.shootTop();
                this.playShootSound();
                
            } else if(e.key==='d'){
                this.game.debug =!this.game.debug;
            } else if(e.key==='p'){
                if(isAnimating){
                    pause.style.display = "flex";
                    stopAnimation();
                }else{
                    startAnimation();
                    pause.style.display = "none";
                }
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