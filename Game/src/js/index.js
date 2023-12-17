/**
 * Adds an event listener for the 'load' event on the window to execute the provided function.
 */
window.addEventListener('load', function () {
    /**
     * Adds an event listener for the 'mousemove' event on the window.
     * Triggers the playBackgroundSound function when the mouse is moved.
     */
    window.addEventListener('mousemove', function () {
        playBackgroundSound();
    });

    // Calls the goToMainMenu function after the window has loaded.
    goToMainMenu();
});