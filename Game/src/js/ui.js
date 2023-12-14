class Background {
    constructor(game,background,backgroundSpeed) {
        this.game = game;

        this.layers = [];
        for (let i = 0; i < background.length; i++) {
            let layer = new Layer(this.game, background[i], backgroundSpeed[i]);
            this.layers.push(layer);
        }
    }

    update() {
        this.layers.forEach(layer => layer.update());
    }

    draw(context) {
        this.layers.forEach(layer => layer.draw(context));
    }
}

class Layer {
    constructor(game, image, speedModifier) {
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = canvas.width;
        this.height = canvas.height;
        this.x = 0;
        this.y = 0;
    }

    update() {
        if (this.x <= -this.width) this.x = 0;
        this.x -= this.game.speed * this.speedModifier;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
        context.drawImage(this.image, this.x+this.width, this.y, canvas.width, canvas.height);
    }
}

class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 25;
        this.fontFamily = 'Helvetica';
        this.color = 'white';
    }

    draw(context) {
        context.save();
        context.fillStyle = this.color;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        let totalScore = parseInt(levelCompleteScore)+parseInt(this.game.score);
        context.fillText('Score: ' + totalScore ,20,40);
        

        context.fillText('Level: ' + (parseInt(runningLevel) + 1), 280, 40);
        
        if (this.game.lives > 0) {
            context.fillText('Lives: ' + this.game.lives, 140, 40);
        } else {
            popupShown = true;
            out_of_life_popup.style.display = "flex";
            stopAnimation();
            return;
        }

        for(let i = 0; i < this.game.ammo; i++) {
            context.fillRect(20 + 5 * i, 50, 3, 20);
        }
        context.restore();
        if(this.game.gameOver){
        }
    }
}
