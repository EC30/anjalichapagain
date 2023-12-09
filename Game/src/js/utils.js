function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)  + min);
}

function showLevelCompletionPopup(level) {
    const popup = document.createElement('div');
    popup.className = 'level-completion-popup';
    popup.innerHTML = `
        <div>Congratulations! You completed level ${level}!</div>
        <button id="play-next-level">Play Level ${level + 1}</button>
        <button id="cancel">Cancel</button>
    `;
    popup.style.margin='auto';
    document.body.appendChild(popup);

    // Add event listeners to the buttons
    document.getElementById('play-next-level').addEventListener('click', function () {
        // Handle play next level button click
        game.currentLevel++;
        game.levelStarted = false;
        document.body.removeChild(popup);
    });

    document.getElementById('cancel').addEventListener('click', function () {
        // Handle cancel button click
        document.body.removeChild(popup);
    });
}