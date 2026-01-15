// j_interaction.js - Engine Interaksi 2-Tap (Versi Audio API)

const Interaction = {
    firstCell: null,
    selectedCells: [],

    init() {
        const grid = document.getElementById('grid-container');
        if (!grid) return;
        grid.addEventListener('click', (e) => this.handleClick(e));
    },

    handleClick(e) {
        const cell = e.target.closest('.grid-cell');
        if (!cell) return;

        // Sound: Klik petak grid
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
        const dr = r2 - r1, dc = c2 - c1;
        const isHorizontal = dr === 0, isVertical = dc === 0, isDiagonal = Math.abs(dr) === Math.abs(dc);

        if (isHorizontal || isVertical || isDiagonal) {
            this.selectedCells = [];
            const steps = Math.max(Math.abs(dr), Math.abs(dc));
            const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
            const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
            for (let i = 0; i <= steps; i++) {
                const r = r1 + (stepR * i), c = c1 + (stepC * i);
                const targetCell = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
                if (targetCell) {
                    targetCell.classList.add('selecting');
                    this.selectedCells.push(targetCell);
                }
            }
        } else { this.resetSelectingState(); }
    },

    checkAnswer() {
        const word = this.selectedCells.map(c => c.innerText).join('');
        const reversed = word.split('').reverse().join('');
        const foundWord = Generator.selectedWords.find(w => w === word || w === reversed);

        if (foundWord) {
            // Sound: Jumpa perkataan
            if (typeof SoundEngine !== 'undefined') SoundEngine.playSuccess();

            // HIJAUKAN GRID (Tugas Interaction)
            this.selectedCells.forEach(cell => {
                cell.classList.remove('selecting', 'cell-hint');
                cell.classList.add('cell-found');
            });
            // BERITAHU CONTROLLER (Tugas Game)
            GameController.markWordFound(foundWord);
            this.selectedCells = [];
        } else {
            // Sound: Salah pilih (Buzz)
            if (typeof SoundEngine !== 'undefined') SoundEngine.playWrong();
            
            setTimeout(() => this.resetSelectingState(), 300);
        }
    },

    resetSelectingState() {
        document.querySelectorAll('.grid-cell.selecting').forEach(c => c.classList.remove('selecting'));
        this.selectedCells = [];
    }
};
Interaction.init();
