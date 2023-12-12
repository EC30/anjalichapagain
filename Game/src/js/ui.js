class Background {
    constructor(game) {
        this.game = game;
        this.images = [
            document.getElementById('layer1'),
            document.getElementById('layer2'),
            document.getElementById('layer3'),
            document.getElementById('layer4')
        ];
        this.layers = this.images.map((image, index) => new Layer(this.game, image, 0.2 * (index + 1)));
    }

    update(level) {
        // Update the background image based on the current level
        this.layers.forEach(layer => layer.update());
        this.layers.forEach(layer => layer.image = levels[level].backgroundImage);
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
        context.drawImage(this.image, this.x + this.width, this.y, canvas.width, canvas.height);
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
        context.fillText('Score: ' + this.game.score,20,40);
        if (this.game.lives > 0) {
            context.fillText('Lives: ' + this.game.lives, 140, 40);
        } else {
            popup.style.display = "flex";
            this.game.gameOver = true;
            return;
        }

        context.fillText('Level: ' + (parseInt(this.game.currentLevel) + 1), 280, 40);
        
        for(let i = 0; i < this.game.ammo; i++) {
            context.fillRect(20 + 5 * i, 50, 3, 20);
        }
        // const formattedTime =(this.game.gameTime*0.001).toFixed(1);
        // context.fillText('Timer: '+formattedTime,20,100);
        context.restore();
    }
}
