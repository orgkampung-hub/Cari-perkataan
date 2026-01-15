// j_timer.js - Pengira Masa Menaik (Stopwatch)

const Timer = {
    seconds: 0,
    intervalId: null,
    displayElement: null,

    init() {
        this.displayElement = document.getElementById('timer');
        this.seconds = 0;
        this.updateUI(); // Reset paparan ke 00:00
        this.start();
    },

    start() {
        // Bersihkan interval lama jika ada
        if (this.intervalId) clearInterval(this.intervalId);

        this.intervalId = setInterval(() => {
            this.seconds++;
            this.updateUI();
        }, 1000);
    },

    stop() {
        clearInterval(this.intervalId);
    },

    // --- FUNGSI BARU UNTUK HUBUNG KE SCORE & GAME ---
    getTotalSeconds() {
        return this.seconds;
    },

    updateUI() {
        if (!this.displayElement) return;

        const mins = Math.floor(this.seconds / 60);
        const secs = this.seconds % 60;
        
        // Format jadi 00:00
        const formatted = 
            (mins < 10 ? "0" + mins : mins) + ":" + 
            (secs < 10 ? "0" + secs : secs);
            
        this.displayElement.innerText = formatted;
    },

    // Dipulangkan dalam format 00:00 untuk database/modal
    getTimeFormatted() {
        const mins = Math.floor(this.seconds / 60);
        const secs = this.seconds % 60;
        const fMins = mins < 10 ? "0" + mins : mins;
        const fSecs = secs < 10 ? "0" + secs : secs;
        return `${fMins}:${fSecs}`;
    }
};
