// j_grid.js - Visual & Kawalan Atribut Jawapan (v4.2.0)

const GridEngine = {
    render(dataGrid, size, answerPositions = new Set()) {
        const container = document.getElementById('grid-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Dinamik: Mengikut size (8, 10, atau 12)
        container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                
                const char = dataGrid[r][c];
                cell.innerText = char;
                
                // Set atribut untuk dikesan oleh Interaction JS
                if (answerPositions.has(`${r},${c}`)) {
                    cell.dataset.isAnswer = "true";
                } else {
                    cell.dataset.isAnswer = "false";
                }
                
                cell.dataset.row = r;
                cell.dataset.col = c;
                container.appendChild(cell);
            }
        }
        console.log(`GridEngine: Render ${size}x${size} siap.`);
    }
};
