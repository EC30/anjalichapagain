document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const closeIcon = document.getElementById('close-icon');
    menuToggle.addEventListener("click", function () {
        navMenu.style.display = navMenu.style.display === "none" ? "flex" : "none";
        navMenu.style.flexDirection="column";
    });

    closeIcon.addEventListener('click', function () {
        navMenu.style.display="none";
    });
});

document.addEventListener('DOMContentLoaded', function () {
        const slider = document.querySelector('.profile-slider');
        const slides = document.querySelectorAll('.profile-slide');
        const arrowLeft = document.querySelector('.left-arrow');
        const arrowRight = document.querySelector('.right-arrow');

        let counter = 1;

        function transitionSlide() {
            slider.style.transition = 'transform 0.5s ease-in-out';
            slider.style.transform = 'translateX(' + (-counter * 100) + '%)';
        }

        function resetTransition() {
            if (counter === slides.length - 1) {
                counter = 1;
                slider.style.transition = 'none';
                slider.style.transform = 'translateX(' + (-counter * 100) + '%)';
            } else if (counter === 0) {
                counter = slides.length - 2;
                slider.style.transition = 'none';
                slider.style.transform = 'translateX(' + (-counter * 100) + '%)';
            }
        }

        function nextSlide() {
            counter++;
            transitionSlide();
        }

        function prevSlide() {
            counter--;
            transitionSlide();
        }

        slider.addEventListener('transitionend', resetTransition);

        // Set initial position
        slider.style.transform = 'translateX(' + (-counter * 100) + '%)';

        // Arrow controls
        arrowLeft.addEventListener('click', prevSlide);
        arrowRight.addEventListener('click', nextSlide);
    });
const slides = document.querySelectorAll('.slide-slide');
const prevBtn = document.getElementById('slide-left-arrow');
const nextBtn = document.getElementById('slide-right-arrow');
const dots = document.querySelectorAll('.dot')

let index = 0;

// Adding opacity to the first dot on the first time
dots[0].style.opacity = '1';

// Positioning the slides
slides.forEach((slide, index) => {
  slide.style.left = `${index * 100}%`;
});

// Move slide function
const moveSlide = (direction) => {
  if (direction === 'prev') {
    index = (index === 0) ? slides.length - 1 : index - 1;
  } else {
    index = (index === slides.length - 1) ? 0 : index + 1;
  }

  slides.forEach((slide) => {
    slide.style.transform = `translateX(-${index * 100}%)`;
  });
}

// Remove dots opacity 1 from all dots
const removeDotsOpacity = () => {
  dots.forEach((dot) => {
    dot.style.opacity = '.2';
  });
}

dots.forEach((dot, i) => {
  dot.addEventListener("click", (e) => {
    const clickedIndex = Array.from(dots).indexOf(e.target);
    const direction = (clickedIndex < index) ? 'prev' : 'next';
    
    index = clickedIndex;
    removeDotsOpacity();
    e.target.style.opacity = '1';
    moveSlide(direction);
  })
});

// Show the previous slide
prevBtn.addEventListener('click', () => {
  removeDotsOpacity();
  dots[index].style.opacity = '1';
  moveSlide('prev');
});

// Show the next slide
nextBtn.addEventListener('click', () => {
  removeDotsOpacity();
  dots[index].style.opacity = '1';
  moveSlide('next');
});
    document.addEventListener("DOMContentLoaded", function() {
      const elementsToAnimate = document.querySelectorAll('.info_left, .info_middle, .info_right');
  
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      };
  
      const callback = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInBottom 1s ease-out forwards';
            observer.unobserve(entry.target);
          }
        });
      };
  
      const observer = new IntersectionObserver(callback, options);
  
      elementsToAnimate.forEach(element => {
        observer.observe(element);
      });
    });