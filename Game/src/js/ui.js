class Background {
    constructor(game) {
        this.game = game;
        this.image1 = document.getElementById('layer1');
        this.image2 = document.getElementById('layer2');
        this.image3 = document.getElementById('layer3');
        this.image4 = document.getElementById('layer4');
        
        this.layer1 = new Layer(this.game, this.image1, 0.2);
        this.layer2 = new Layer(this.game, this.image2, 0.4);
        this.layer3 = new Layer(this.game, this.image3, 1);
        this.layer4 = new Layer(this.game, this.image4, 1.5);
        this.layers = [this.layer1,this.layer2,this.layer3];
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
        // context.drawImage(this.image, this.x, this.y);
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
        if(this.game.gameOver){
            // context.textAlign='center';
            // let message1;
            // let message2;
            // if(this.game.score>this.game.winingscore){
            //     message1='You Win!';
            //     message2='Well done';
            // }else{
            //     message1='You lose!';
            //     message2='Try again next time!';
            // }
            // context.font ='50px' +this.fontFamily;
            // context.fillText(message1,this.game.width*0.5,this.game.height*0.5-40);
            // context.font ='25px' +this.fontFamily;
            // context.fillText(message2,this.game.width*0.5,this.game.height*0.5+40);
        }
    }
}
