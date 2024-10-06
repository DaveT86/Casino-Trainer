document.addEventListener('DOMContentLoaded', function() {
    const fullscreenButton = document.getElementById('fullscreen-button');

    // Check localStorage for fullscreen state
    const isFullscreen = localStorage.getItem('fullscreen') === 'true';
    if (isFullscreen && !document.fullscreenElement) {
        // Only enter fullscreen if it's not already in fullscreen mode
        enterFullscreen();
    }

    fullscreenButton.addEventListener('click', function() {
        toggleFullscreen();
    });
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

// Function to enter fullscreen
function enterFullscreen() {
    document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
    });
    localStorage.setItem('fullscreen', 'true'); // Save state to localStorage
}

// Function to exit fullscreen
function exitFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
            console.error(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
        });
    }
    localStorage.setItem('fullscreen', 'false'); // Save state to localStorage
}
