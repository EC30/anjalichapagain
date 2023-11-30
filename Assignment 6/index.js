document.addEventListener("DOMContentLoaded", function() {
    // Get the carousel container
    const carouselContainer = document.getElementById("carousel");
    // Get the previous button element
    const previousButton = document.getElementById("prevBtn");
    // Get the next button element
    const nextButton = document.getElementById("nextBtn");
    // Get the container for navigation dots
    const dotContainer = document.getElementById("dotContainer");

    // Initializing the current slide index
    let Index = 0;

    // Populating dots for each image in the carousel
    for (let i = 0; i < carouselContainer.children.length; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        dotContainer.appendChild(dot);
        dot.addEventListener("click", () => navigateToSlide(i));
    }

    // Creating an array of dot elements
    const dots = Array.from(dotContainer.children);

    // Constants for slide directions
    const PREVIOUS = -1;
    const NEXT = 1;

    // Function to update the active state of dots based on current slide index
    function updateDots() {
        dots.forEach((dot, index) => {
            // toggle method to add or remove the "active" class depending on whether the index matches the current slide
            dot.classList.toggle("active", index === Index);
        });
    }

    // Function to navigate to a specific slide
    function navigateToSlide(index) {
        Index = index;
        updateDots();
        const transformValue = -index * 100 + "%";
        carouselContainer.style.transform = `translateX(${transformValue})`;
    }

    // Function to change the slide based on the direction
    function changeSlide(direction) {
        Index += direction;
        if (Index < 0) {
            Index = carouselContainer.children.length - 1;
        } else if (Index >= carouselContainer.children.length) {
            Index = 0;
        }
        updateDots();
        const transformValue = -Index * 100 + "%";
        carouselContainer.style.transform = `translateX(${transformValue})`;
    }

    // Setting the initial state of dots
    updateDots();

    // Event listeners for previous and next buttons
    previousButton.addEventListener("click", () => changeSlide(PREVIOUS));
    nextButton.addEventListener("click", () => changeSlide(NEXT));

    // Automatic slideshow with a specified interval
    setInterval(() => {
        changeSlide(NEXT);
    }, 5000);
});
