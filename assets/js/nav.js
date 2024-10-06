document.getElementById('back-button').addEventListener('click', function() {
    window.history.back(); // Go back to the previous page
});

// Home button functionality
document.getElementById('home-button').addEventListener('click', function() {
    window.location.href = '../index.html'; 
});