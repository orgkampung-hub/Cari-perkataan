/**
 * debug.js - v2.4.0
 * TUGAS: Menguruskan paparan panel debug & fungsi Skip.
 */

(function() {
    let historyWords = new Set();
    let clickCount = 0;
    let lastClickTime = 0;

    window.addEventListener('load', () => {
        const scoreElement = document.getElementById('score-display');
        if (scoreElement) {
            scoreElement.addEventListener('click', () => {
                const currentTime = Date.now();
                if (currentTime - lastClickTime > 500) clickCount = 0;
                clickCount++;
                lastClickTime = currentTime;
                if (clickCount === 5) {
                    if (typeof toggleDebug === 'function') toggleDebug();
                    clickCount = 0;
                }
            });
            scoreElement.style.userSelect = "none";
        }
    });

    // FUNGSI UTAMA PAPARAN DEBUG (Dipanggil oleh game.js)
    window.updateDebugInfo = function(data) {
        const dbgWords = document.getElementById('dbgWords');
        const dbgCross = document.getElementById('dbgCross');
        const dbgRetry = document.getElementById('dbgRetry');
        const dbgDup = document.getElementById('dbgDup'); 

        if (dbgWords) dbgWords.innerText = "WDS: " + (data.words ? data.words.length : 0);
        if (dbgCross) dbgCross.innerText = "CRS: " + (data.crossCount || 0);
        if (dbgRetry) dbgRetry.innerText = "TRY: " + (data.attempts || 0);

        if (dbgDup && data.words) {
            let repeatCount = 0;
            data.words.forEach(w => {
                if (historyWords.has(w)) repeatCount++;
                historyWords.add(w);
            });
            dbgDup.innerText = "REP: " + repeatCount;
            dbgDup.style.color = repeatCount > 0 ? "#ff9800" : "inherit";
        }
    };

    window.forceSkip = function() {
        if (typeof skipLevel === 'function') skipLevel();
    };
})();
