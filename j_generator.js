// j_generator.js - Versi "Arkitek" (Kebal & Stabil)

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
            
            // Ambil kategori dari storage
            const category = localStorage.getItem('selectedCategory') || "HAIWAN";
            let pool = [];

            // Logik Gado-Gado / Custom / Spesifik
            if (category === 'RAWAK') {
                Object.values(data).forEach(cat => pool = pool.concat(cat));
            } else if (category === 'CUSTOM') {
                const raw = localStorage.getItem('customWords');
                pool = raw ? JSON.parse(raw) : [];
            } else {
                pool = data[category] || data["HAIWAN"];
            }
            
            // Pilih 12 patah perkataan secara rawak
            this.selectedWords = [...pool]
                .sort(() => 0.5 - Math.random())
                .slice(0, 12)
                .map(w => w.trim().toUpperCase());
            
            // Bina layout dan pulangkan hasil
            return this.buildLayout();
        } catch (e) {
            console.error("Generator Error:", e);
            return [];
        }
    },

    buildLayout() {
        // Reset Grid
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

        this.selectedWords.forEach(word => {
            let bestPos = null;
            let maxScore = -1;

            // 400 cubaan untuk cari tempat paling banyak overlap
            for (let i = 0; i < 400; i++) {
                this.stats.try++;
                const dir = allDirs[Math.floor(Math.random() * allDirs.length)];
                const r = Math.floor(Math.random() * this.gridSize);
                const c = Math.floor(Math.random() * this.gridSize);

                const overlap = this.getOverlapScore(word, r, c, dir);
                
                if (overlap >= 0) {
                    let currentScore = (overlap * 50) + (Math.random() * 20);
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

        // SAFETY: Jika grid terlalu kosong (nasib malang), ulang bina
        if (this.wordsActuallyPlaced.length < 5 && this.selectedWords.length > 5) {
            return this.buildLayout();
        }

        this.injectDecoys();
        this.fillEmptyCells();
        this.calculateCRS();

        // Render ke skrin
        if (typeof GridEngine !== 'undefined') {
            GridEngine.render(this.grid, this.gridSize, this.answerPositions);
        }
        
        this.displayWordList();
        return this.wordsActuallyPlaced;
    },

    getOverlapScore(word, row, col, dir) {
        const lastR = row + dir.r * (word.length - 1);
        const lastC = col + dir.c * (word.length - 1);

        if (lastR < 0 || lastR >= this.gridSize || lastC < 0 || lastC >= this.gridSize) return -1;

        let overlaps = 0;
        for (let i = 0; i < word.length; i++) {
            const r = row + dir.r * i;
            const c = col + dir.c * i;
            const char = this.grid[r][c];
            if (char !== '' && char !== word[i]) return -1;
            if (char === word[i]) overlaps++;
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
            const dir = { r: 1, c: 0 }; 

            if (this.getOverlapScore(decoy, r, c, dir) === 0) {
                for (let i = 0; i < decoy.length; i++) {
                    const dr = r + dir.r * i;
                    const dc = c + dir.c * i;
                    if (this.grid[dr][dc] === '') this.grid[dr][dc] = decoy[i];
                }
            }
        });
    },

    fillEmptyCells() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                if (this.grid[r][c] === '') {
                    this.grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
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
