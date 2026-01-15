// j_grid.js - Visual & Kawalan Atribut Jawapan

const GridEngine = {
    // Tambah parameter answerPositions
    render(dataGrid, size, answerPositions = new Set()) {
        const container = document.getElementById('grid-container');
        if (!container) return;
        
        container.innerHTML = '';
        // CSS Grid Layout: Pastikan saiz grid dinamik ikut size
        container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                
                // Ambil huruf dari dataGrid (sudah penuh dengan huruf rawak dari Generator)
                const char = dataGrid[r][c];
                cell.innerText = char;
                
                // DISIPLIN: Hanya petak yang ada dalam answerPositions dianggap jawapan
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
        console.log("GridEngine: Visual siap dengan koordinat jawapan yang tepat.");
    }
};
