var currentIndex = 0;
var carouselWrapper = document.getElementById('carousel');
carouselWrapper.style.left = 0;
var numberOfImages = carouselWrapper.childElementCount;
var speed = 5;

console.log(numberOfImages)

function nextSlide(){
    currentIndex+=1;
    if(currentIndex>=numberOfImages){
        currentIndex=0;
    }

}

function moveSlide(){
    let targetLeft = (-currentIndex * 600)+'px';
    let currentLeft =  parseFloat(carouselWrapper.style.left);

    if(targetLeft<currentLeft){
        carouselWrapper.style.left = (currentLeft - speed) + 'px';
        if(parseFloat(carouselWrapper.style.left)===targetLeft){
            stopMoveInterval();
        }
    }else{
        carouselWrapper.style.left = (currentLeft + speed) + 'px';
        if(parseFloat(carouselWrapper.style.left)===targetLeft){
            stopMoveInterval();
        }
    }
}