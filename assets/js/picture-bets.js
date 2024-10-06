const grid = document.getElementById('rouletteGrid');

// Function to create the roulette grid layout
function createGrid() {
    grid.innerHTML = ''; // Clear previous grid

    // Define cells and their color classes for roulette layout
    const cells = [
        { className: 'cell-0' }, // Position 0
        { className: 'cell-1' },
        { className: 'cell-2' },
        { className: 'cell-3' },
        { className: 'cell-4' },
        { className: 'cell-5' },
        { className: 'cell-6' },
        { className: 'cell-7' },
        { className: 'cell-8' },
        { className: 'cell-9' },
    ];

    // Populate the grid with colored cells
    cells.forEach((cell) => {
        const div = document.createElement('div');
        div.className = `cell ${cell.className}`; // Apply cell class
        grid.appendChild(div);
    });
}

// Initialize the grid on page load
window.onload = createGrid;
