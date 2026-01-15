// j_hint.js - Logik Sistem Hint (Versi Audio API)

const HintSystem = {
    maxHints: 3,
    usedHints: 0,

    init() {
        console.log("Hint System: Sedia.");
        this.updateHintButton();
    },

    useHint() {
        if (this.usedHints >= this.maxHints) return;

        // 1. Cari semua petak grid yang merupakan JAWAPAN
        const possibleCells = Array.from(document.querySelectorAll('.grid-cell')).filter(cell => {
            const isAnswer = cell.dataset.isAnswer === "true"; 
            const isFound = cell.classList.contains('cell-found');
            const isHinted = cell.classList.contains('cell-hint');
            
            return isAnswer && !isFound && !isHinted;
        });

        if (possibleCells.length > 0) {
            // Sound: Bunyi Hint (Magic/Shimmer)
            if (typeof SoundEngine !== 'undefined') {
                SoundEngine.playHint();
            }

            // 2. Pilih satu petak secara rawak
            const randomCell = possibleCells[Math.floor(Math.random() * possibleCells.length)];
            
            // 3. Tambah class visual hint
            randomCell.classList.add('cell-hint');
            
            this.usedHints++;
            this.updateHintButton();
            console.log("Hint diberikan pada huruf: " + randomCell.innerText);
        } else {
            console.log("Tiada lagi huruf jawapan untuk diberikan hint.");
        }
    },

    updateHintButton() {
        // Cari span nombor baki hint
        const hintCountSpan = document.getElementById('hint-count');
        // Cari butang hint di header
        const btn = document.querySelector('.btn-hint-top');

        if (hintCountSpan) {
            // Kemaskini nombor baki (3, 2, 1, 0)
            hintCountSpan.innerText = this.maxHints - this.usedHints;
        }

        if (btn && this.usedHints >= this.maxHints) {
            // Jika hint habis, matikan butang
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
            // Tukar warna bayangan (optional)
            btn.style.boxShadow = "none";
        }
    }
};

// Aktifkan sistem
HintSystem.init();
