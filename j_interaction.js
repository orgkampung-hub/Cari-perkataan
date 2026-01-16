// j_interaction.js - Engine Interaksi 2-Tap (v4.3.5 - Selaras Penuh)

const Interaction = {
    firstCell: null,
    selectedCells: [],

    init() {
        const grid = document.getElementById('grid-container');
        if (!grid) return;
        grid.addEventListener('click', (e) => this.handleClick(e));
        console.log("Interaction: Engine 2-Tap Aktif.");
    },

    handleClick(e) {
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;

        if (typeof SoundEngine !== 'undefined') SoundEngine.playTap();

        if (!this.firstCell) {
            this.firstCell = cell;
            this.resetSelectingState();
            cell.classList.add('selecting');
        } else {
            const secondCell = cell;
            if (this.firstCell === secondCell) {
                this.resetSelectingState();
                this.firstCell = null;
                return;
            }
            this.calculatePath(this.firstCell, secondCell);
            this.checkAnswer();
            this.firstCell = null;
        }
    },

    calculatePath(start, end) {
        const r1 = parseInt(start.dataset.row), c1 = parseInt(start.dataset.col);
        const r2 = parseInt(end.dataset.row), c2 = parseInt(end.dataset.col);
        
        const dr = r2 - r1;
        const dc = c2 - c1;
        
        const isHorizontal = dr === 0;
        const isVertical = dc === 0;
        const isDiagonal = Math.abs(dr) === Math.abs(dc);

        if (isHorizontal || isVertical || isDiagonal) {
            this.selectedCells = [];
            const steps = Math.max(Math.abs(dr), Math.abs(dc));
            
            const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
            const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

            for (let i = 0; i <= steps; i++) {
                const r = r1 + (stepR * i);
                const c = c1 + (stepC * i);
                
                const targetCell = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
                if (targetCell) {
                    targetCell.classList.add('selecting');
                    this.selectedCells.push(targetCell);
                }
            }
        } else { 
            this.resetSelectingState(); 
        }
    },

    checkAnswer() {
        if (this.selectedCells.length === 0) return;

        const word = this.selectedCells.map(c => c.innerText).join('');
        const reversed = word.split('').reverse().join('');
        
        // Rujukan kepada Generator Arkitek kau
        const foundWord = Generator.wordsActuallyPlaced.find(w => w === word || w === reversed);

        if (foundWord) {
            // Berjaya! Main bunyi
            if (typeof SoundEngine !== 'undefined') SoundEngine.playSuccess();

            const cellsToAnimate = [...this.selectedCells];
            
            // Animasi hijau (Visual feedback)
            cellsToAnimate.forEach((cell, index) => {
                cell.classList.remove('selecting', 'cell-hint');
                setTimeout(() => {
                    cell.classList.add('cell-found');
                }, index * 100); 
            });

            // PANGGILAN SELARAS: Ikut fungsi asal j_game.js (Hanya 1 parameter)
            if (typeof GameController !== 'undefined') {
                GameController.markWordFound(foundWord);
            }
            
            this.selectedCells = [];
        } else {
            // Salah! Main bunyi salah
            if (typeof SoundEngine !== 'undefined') SoundEngine.playWrong();
            
            const cellsToReset = [...this.selectedCells];
            setTimeout(() => {
                cellsToReset.forEach(c => c.classList.remove('selecting'));
            }, 300);
            this.selectedCells = [];
        }
    },

    resetSelectingState() {
        document.querySelectorAll('.grid-cell.selecting').forEach(c => c.classList.remove('selecting'));
        this.selectedCells = [];
    }
};

// Mula interaksi
Interaction.init();
