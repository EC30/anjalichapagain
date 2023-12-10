class Explosion{
    constructor(game, x, y) {
        this.game=game;
        this.x = x;
        this.y = y;
        this.frameX = 0;
        this.spriteheight = 200;
        this.spritewidth = 200;
        this.timer = 0; 
        this.interval=1000/15;
        this.width=this.spritewidth;
        this.height=this.spriteheight;
        this.x = x-this.width*0.5;
        this.y = y-this.height*0.5;
        this.markedForDeletion=false;
        this.maxFrame=8;
    }
    update(deltaTime){
        this.frameX++;
        if(this.frameX >this.maxFrame){
            this.markedForDeletion=true;
        }
    }
    draw(context){
        //context.drawImage(this.image, this.x, this.y);
        context.drawImage(
            this.image,
            this.frameX * this.spritewidth,
            0,
            this.spritewidth,
            this.spriteheight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}

class Smoke extends Explosion{
    constructor(game, x, y) {
        super(game,x,y);
        this.game=game;
        this.spritewidth = 200;
        this.width=this.spritewidth;
        this.height=this.spriteheight;
        this.x = x-this.width*0.5;
        this.y = y-this.height*0.5;
        this.image=document.getElementById('smoke');
        
    }
}

class Fire extends Explosion{
    constructor(game, x, y) {
        super(game,x,y);
        this.game=game;
        this.image=document.getElementById('fire');
    }
}