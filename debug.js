/**
 * DEBUG TOOL: Cari Kata Pro (v2.3.0)
 * Full Script - Angka Sahaja, Skip Level & History Repeat Check
 */

(function() {
    let debugTimer;
    // Simpan semua perkataan yang pernah muncul sejak game dibuka
    let historyWords = new Set();
    
    // Inisialisasi Gestur
    window.addEventListener('load', () => {
        const scoreElement = document.getElementById('score-display');
        if (!scoreElement) return;

        scoreElement.addEventListener('touchstart', () => {
            debugTimer = setTimeout(() => {
                document.body.classList.toggle('debug-on');
                if (navigator.vibrate) navigator.vibrate(50);
            }, 2000);
        });

        scoreElement.addEventListener('touchend', () => clearTimeout(debugTimer));
    });

    // FUNGSI SKIP: Selesaikan semua word secara automatik
    window.skipLevel = function() {
        if (typeof currentWords === 'undefined' || typeof wordsFound === 'undefined') return;
        
        currentWords.forEach(word => {
            if (!wordsFound.includes(word)) {
                wordsFound.push(word);
                
                const li = document.getElementById("list-" + word);
                if (li) li.className = 'strike';
                
                if (typeof wordPositions !== 'undefined' && wordPositions[word]) {
                    wordPositions[word].forEach(pos => {
                        const cell = document.getElementById(`cell-${pos.r}-${pos.c}`);
                        if (cell) cell.classList.add('found');
                    });
                }
            }
        });

        if (typeof SoundFX !== 'undefined') SoundFX.win();
        if (typeof showWinModal === 'function') showWinModal();
        
        console.log("Debug Info: Level Skipped Successfully.");
    };

    // Fungsi Update Info (Dengan Pengesan History Repeat)
    window.updateDebugInfo = function(data) {
        const dbgWords = document.getElementById('dbgWords');
        const dbgCross = document.getElementById('dbgCross');
        const dbgRetry = document.getElementById('dbgRetry');
        const dbgDup = document.getElementById('dbgDup'); 

        // 1. Update WDS, CRS, TRY
        if (dbgWords) dbgWords.innerText = "WDS: " + (data.words ? data.words.length : 0);
        if (dbgCross) dbgCross.innerText = "CRS: " + (data.crossCount || 0);
        if (dbgRetry) dbgRetry.innerText = "TRY: " + (data.retry || 0);

        // 2. Logik Kesan Perkataan Berulang dari Grid Lepas
        if (dbgDup && data.words) {
            let repeatCount = 0;
            let repeatedWords = [];

            data.words.forEach(w => {
                // Jika perkataan sudah ada dalam sejarah grid sebelum ni
                if (historyWords.has(w)) {
                    repeatCount++;
                    repeatedWords.push(w);
                }
            });

            // Paparkan jumlah REP (Repeated dari history)
            dbgDup.innerText = "REP: " + repeatCount;
            
            // Masukkan perkataan grid sekarang ke dalam sejarah untuk grid akan datang
            data.words.forEach(w => historyWords.add(w));

            // Tukar warna jadi oren kalau ada perkataan yang asyik ulang benda sama
            if (repeatCount > 0) {
                dbgDup.style.color = "#ff9800"; 
                console.log("Debug: Perkataan dari level lepas muncul kembali:", repeatedWords);
            } else {
                dbgDup.style.color = "inherit"; 
            }
        }
    };
})();
