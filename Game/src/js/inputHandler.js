/**
 * InputHandler class managing keyboard input for the game.
 *
 * @param {Game} game - The game instance to which the input handler is associated.
 */
class InputHandler {
    constructor(game) {
        this.game = game;
        this.sound=new Audio('./src/sound/bullet.mp3');

        // Add event listeners for keydown and keyup events
        window.addEventListener('keydown', this.keydownFunction);
        window.addEventListener('keyup', this.keyupFunction);   
    }
    /**
     * Play the shooting sound effect.
     */
    playShootSound() {
        // Check if the audio is already playing, and reset it to the beginning if true
        if (this.sound.paused) {
            this.sound.currentTime = 0;
        }
        // Play the shoot sound
        this.sound.play();
    }
    /**
     * Remove event listeners to clean up when the input handler is no longer needed.
     */
    destroy(){
        window.removeEventListener('keyup', this.keyupFunction);
        window.removeEventListener('keydown', this.keydownFunction);
    }
    /**
     * Handle the keyup event and update the game keys array accordingly.
     *
     * @param {KeyboardEvent} e - The keyup event object.
     */
    keyupFunction(e){
        this.game = game;
        if(this.game.keys.indexOf(e.key) > -1){
            this.game.keys.splice(this.game.keys.indexOf(e.key),1);
        }
    }
    /**
     * Handle the keydown event and perform various actions based on the pressed key.
     *
     * @param {KeyboardEvent} e - The keydown event object.
     */
    keydownFunction(e){
        if(!isGameRunning){
            return;
        }
        this.game = game;
        if(( (e.key ==='ArrowUp') || (e.key === 'ArrowDown') ) && this.game.keys.indexOf(e.key)=== -1){
            this.game.keys.push(e.key);
        }else if(e.key==='Control'){
            // Shoot when the Control key is pressed
            this.game.player.shootTop();
            this.playShootSound(); 
        } else if(e.key==='d'){
            // Toggle debug mode when the 'd' key is pressed
            this.game.debug =!this.game.debug;
        } else if(e.key==='p' && !popupShown){
            // Pause or resume the game when the 'p' key is pressed
            if(isAnimating){
                pause.style.display = "flex";
                stopAnimation();
            }else{                    
                startAnimation();
                pause.style.display = "none";
            }
        } else if(e.key==='q'){
            // Add score and clear enemies when the 'q' key is pressed for testing purpose
            this.game.score += levels[runningLevel].winingscore+1;
            this.game.enemies = [];
        } else if(e.key==='x'){
            // Set player lives to 0 when the 'x' key is pressed for testing purpose
            this.game.lives = 0;
        } else if(e.key==='s'){
            // Save the game when the 's' key is pressed for testing purpose
            console.log('c');
            popupShown=true;
            stopAnimation();
            saveGamePrompt();
        } else if(e.key==='a'){
            // Delete all saved games when the 'a' key is pressed for testing purpose
            deleteAllSaveGame();
        } 
    }
}
/**
 * Prompt the user to enter a name for the save file.
 */
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