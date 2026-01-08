/**
 * DEBUG TOOL: Cari Kata Pro (v2.1.0)
 * Full Script - Angka Sahaja & Skip Level
 */

(function() {
    let debugTimer;
    
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
        
        // Pusing semua word dalam game
        currentWords.forEach(word => {
            if (!wordsFound.includes(word)) {
                wordsFound.push(word);
                
                // 1. Coretkan pada senarai perkataan di sisi
                const li = document.getElementById("list-" + word);
                if (li) li.className = 'strike';
                
                // 2. Highlight semua cell perkataan tersebut di grid
                if (typeof wordPositions !== 'undefined' && wordPositions[word]) {
                    wordPositions[word].forEach(pos => {
                        const cell = document.getElementById(`cell-${pos.r}-${pos.c}`);
                        if (cell) cell.classList.add('found');
                    });
                }
            }
        });

        // Tambah markah penuh terus (Contoh: 1 markah setiap word + 8 bonus)
        // score += (currentWords.length + 8); 
        // updateStats();

        // 3. Trigger bunyi menang dan keluar modal
        if (typeof SoundFX !== 'undefined') SoundFX.win();
        if (typeof showWinModal === 'function') showWinModal();
        
        console.log("Debug Info: Level Skipped Successfully.");
    };

    // Fungsi Update Info (Dipanggil oleh game.js)
    window.updateDebugInfo = function(data) {
        const dbgWords = document.getElementById('dbgWords');
        const dbgCross = document.getElementById('dbgCross');
        const dbgRetry = document.getElementById('dbgRetry');

        if (dbgWords) dbgWords.innerText = "WDS: " + (data.words ? data.words.length : 0);
        if (dbgCross) dbgCross.innerText = "CRS: " + (data.crossCount || 0);
        if (dbgRetry) dbgRetry.innerText = "TRY: " + (data.retry || 0);
    };
})();
