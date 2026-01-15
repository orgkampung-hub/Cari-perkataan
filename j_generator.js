// j_generator.js - Versi "Arkitek" (High-Try, High-Overlap & Balanced Distribution)

const Generator = {
    gridSize: 12,
    grid: [],
    selectedWords: [],
    wordsActuallyPlaced: [], 
    usageMask: [], 
    answerPositions: new Set(), 
    stats: { try: 0, crs: 0 },

    async init() {
        console.log("Generator: Mengaktifkan Enjin Arkitek...");
        try {
            const response = await fetch('words.json');
            const data = await response.json();
            const category = localStorage.getItem('selectedCategory') || Object.keys(data)[0];
            
            this.selectedWords = [...data[category]]
                .sort(() => 0.5 - Math.random())
                .slice(0, 12)
                .map(w => w.trim().toUpperCase());
            
            this.buildLayout();
            return this.wordsActuallyPlaced;
        } catch (e) {
            console.error("Generator Error:", e);
            return [];
        }
    },

    buildLayout() {
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(''));
        this.usageMask = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(0));
        this.answerPositions.clear(); 
        this.wordsActuallyPlaced = [];
        this.stats = { try: 0, crs: 0 };

        const allDirs = [
            { r: 0, c: 1 }, { r: 0, c: -1 }, 
            { r: 1, c: 0 }, { r: -1, c: 0 },
            { r: 1, c: 1 }, { r: -1, c: -1 },
            { r: 1, c: -1 }, { r: -1, c: 1 }
        ];

        // KONFIGURASI GANAS
        const CUBAAN_PER_KATA = 400; // 12 kata x 400 = 4,800 try konsisten

        this.selectedWords.forEach(word => {
            let bestPos = null;
            let maxScore = -1;

            for (let i = 0; i < CUBAAN_PER_KATA; i++) {
                this.stats.try++;

                const dir = allDirs[Math.floor(Math.random() * allDirs.length)];
                const r = Math.floor(Math.random() * this.gridSize);
                const c = Math.floor(Math.random() * this.gridSize);

                const overlap = this.getOverlapScore(word, r, c, dir);
                
                if (overlap >= 0) {
                    // PENGIRAAN SKOR BIJAK:
                    // 1. Overlap diberi pemberat sangat tinggi (x50)
                    let currentScore = overlap * 50; 

                    // 2. Bonus Rawak (Distribution)
                    // Supaya kalau tak ada overlap, dia pilih tempat secara adil di seluruh grid
                    currentScore += Math.random() * 20;

                    if (currentScore > maxScore) {
                        maxScore = currentScore;
                        bestPos = { r, c, dir };
                    }
                }
            }

            if (bestPos) {
                this.placeWord(word, bestPos.r, bestPos.c, bestPos.dir);
                this.wordsActuallyPlaced.push(word);
            }
        });

        this.injectDecoys();
        this.fillEmptyCells();
        this.calculateCRS();

        if (typeof GridEngine !== 'undefined') {
            GridEngine.render(this.grid, this.gridSize, this.answerPositions);
        }
        
        this.displayWordList();

        if (window.Debugger && typeof Debugger.refreshUI === 'function') {
            Debugger.refreshUI(); 
        }
    },

    getOverlapScore(word, row, col, dir) {
        const lastR = row + dir.r * (word.length - 1);
        const lastC = col + dir.c * (word.length - 1);

        if (lastR < 0 || lastR >= this.gridSize || lastC < 0 || lastC >= this.gridSize) return -1;

        let overlaps = 0;
        for (let i = 0; i < word.length; i++) {
            const r = row + dir.r * i;
            const c = col + dir.c * i;
            const targetChar = this.grid[r][c];
            
            if (targetChar !== '' && targetChar !== word[i]) return -1;
            if (targetChar === word[i]) overlaps++;
        }
        return overlaps;
    },

    placeWord(word, row, col, dir) {
        for (let i = 0; i < word.length; i++) {
            const r = row + dir.r * i;
            const c = col + dir.c * i;
            this.grid[r][c] = word[i];
            this.usageMask[r][c]++; 
            this.answerPositions.add(`${r},${c}`);
        }
    },

    injectDecoys() {
        this.wordsActuallyPlaced.forEach(word => {
            if (word.length < 4) return;
            const decoy = word.substring(0, Math.floor(word.length / 2 + 1));
            const r = Math.floor(Math.random() * this.gridSize);
            const c = Math.floor(Math.random() * this.gridSize);
            const dir = { r: 1, c: 1 }; 

            if (this.getOverlapScore(decoy, r, c, dir) === 0) {
                for (let i = 0; i < decoy.length; i++) {
                    const dr = r + dir.r * i;
                    const dc = c + dir.c * i;
                    this.grid[dr][dc] = decoy[i];
                }
            }
        });
    },

    fillEmptyCells() {
        const lettersInGame = this.selectedWords.join('') || "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                if (this.grid[r][c] === '') {
                    this.grid[r][c] = lettersInGame[Math.floor(Math.random() * lettersInGame.length)];
                }
            }
        }
    },

    calculateCRS() {
        let crsCount = 0;
        this.usageMask.forEach(row => row.forEach(val => { if (val > 1) crsCount++; }));
        this.stats.crs = crsCount;
    },

    displayWordList() {
        const container = document.getElementById('word-list');
        if (!container) return;
        container.innerHTML = '';
        this.wordsActuallyPlaced.forEach(word => {
            const div = document.createElement('div');
            div.className = 'word-item';
            div.id = `list-${word.toUpperCase()}`;
            div.innerText = word.toUpperCase();
            container.appendChild(div);
        });
    }
};
