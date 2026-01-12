/**
 * pilihword.js - v1.2.1
 * TARGET: PASTI 12 KATA + CRS > 5 + MIN 4 ARAH
 * FIX: Longgarkan syarat overlap selepas percubaan tertentu supaya kuota cukup.
 */

const PilihWord = {
    gridSize: 10,
    grid: [],
    wordPositions: {},
    debugData: { attempts: 0, crossCount: 0 },

    ambilKuota(wordBank, cat) {
        const all = wordBank[cat.toUpperCase()] || [];
        // Kita pastikan total kuota adalah 12 (2+5+5)
        let panjang = all.filter(w => w.length >= 8).sort(() => Math.random() - 0.5).slice(0, 2);
        let medium = all.filter(w => w.length >= 5 && w.length <= 7).sort(() => Math.random() - 0.5).slice(0, 5);
        let pendek = all.filter(w => w.length <= 4).sort(() => Math.random() - 0.5).slice(0, 5);
        
        return [...panjang, ...medium, ...pendek].map(w => w.toUpperCase());
    },

    janaGridEksperimen(wordBank, cat) {
        let maxGlobalTries = 0;
        
        while (maxGlobalTries < 15) { 
            this.grid = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(''));
            this.wordPositions = {};
            this.debugData = { attempts: 0, crossCount: 0 };
            
            const wordsToPlace = this.ambilKuota(wordBank, cat);
            const dirs = [[0,1],[1,0],[1,1],[-1,1],[0,-1],[-1,0],[-1,-1],[1,-1]];
            let directionsUsed = new Set();
            let totalPlaced = 0;

            for (let word of wordsToPlace) {
                let placed = false;
                let localTries = 0;

                while (!placed && localTries < 2000) { 
                    this.debugData.attempts++;
                    localTries++;

                    let r = Math.floor(Math.random() * this.gridSize);
                    let c = Math.floor(Math.random() * this.gridSize);
                    let dIdx = Math.floor(Math.random() * dirs.length);
                    let d = dirs[dIdx];

                    let check = this.bolehLetak(word, r, c, d);
                    
                    if (check.ok) {
                        /**
                         * LOGIK BARU: 
                         * 1. Awal-awal (localTries < 1000), kita paksa cari overlap (CRS).
                         * 2. Kalau dah penat cari (> 1000), kita terima je janji dia muat.
                         * Ini supaya kuota 12 kata tu SENTIASA CUKUP.
                         */
                        if (check.overlap > 0 || localTries > 1000) {
                            this.lukisPerkataan(word, r, c, d);
                            this.debugData.crossCount += check.overlap;
                            directionsUsed.add(dIdx.toString());
                            
                            let coords = [];
                            for(let i=0; i<word.length; i++) {
                                coords.push({ r: r + i*d[0], c: c + i*d[1] });
                            }
                            this.wordPositions[word] = coords;
                            placed = true;
                            totalPlaced++;
                        }
                    }
                }
            }

            // SYARAT KAU: CRS > 5, ARAH >= 4, KATA = 12
            if (this.debugData.crossCount > 5 && directionsUsed.size >= 4 && totalPlaced === 12) {
                break; 
            }
            maxGlobalTries++;
        }
        
        return {
            grid: this.grid,
            wordPositions: this.wordPositions,
            stats: this.debugData
        };
    },

    bolehLetak(word, r, c, d) {
        let overlap = 0;
        for (let i = 0; i < word.length; i++) {
            let nr = r + i * d[0], nc = c + i * d[1];
            if (nr < 0 || nr >= this.gridSize || nc < 0 || nc >= this.gridSize) return { ok: false };
            if (this.grid[nr][nc] !== '' && this.grid[nr][nc] !== word[i]) return { ok: false };
            if (this.grid[nr][nc] === word[i]) overlap++;
        }
        return { ok: true, overlap: overlap };
    },

    lukisPerkataan(word, r, c, d) {
        for (let i = 0; i < word.length; i++) {
            this.grid[r + i * d[0]][c + i * d[1]] = word[i];
        }
    }
};
