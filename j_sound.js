/**
 * j_sound.js - Web Audio API (Sintetik Bunyi)
 * Tanpa fail MP3. Bunyi dijana secara realtime.
 */

const SoundEngine = {
    ctx: null,
    enabled: true,

    init() {
        // AudioContext hanya boleh bermula selepas user click (security browser)
        const setup = () => {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                console.log("SoundEngine: Web Audio API Aktif.");
                window.removeEventListener('mousedown', setup);
                window.removeEventListener('touchstart', setup);
            }
        };
        window.addEventListener('mousedown', setup);
        window.addEventListener('touchstart', setup);
    },

    /**
     * Helper untuk buat bunyi oscillator
     * @param {number} freq - Frekuensi (Hz)
     * @param {string} type - 'sine', 'square', 'sawtooth', 'triangle'
     * @param {number} duration - Tempoh bunyi (saat)
     * @param {number} volume - Kekuatan (0.0 ke 1.0)
     */
    osc(freq, type, duration, volume = 0.1) {
        if (!this.ctx || !this.enabled) return;

        const oscillator = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        oscillator.start();
        oscillator.stop(this.ctx.currentTime + duration);
    },

    // 1. Klik Petak Grid (Bunyi pendek & "pop")
    playTap() {
        this.osc(600, 'sine', 0.1, 0.2);
    },

    // 2. Jumpa Perkataan (Bunyi naik ke atas / "Ding")
    playSuccess() {
        const now = this.ctx.currentTime;
        this.osc(523.25, 'sine', 0.3, 0.2); // C5
        setTimeout(() => this.osc(659.25, 'sine', 0.3, 0.2), 100); // E5
    },

    // 3. Hint (Bunyi "magic" / bergetar)
    playHint() {
        this.osc(880, 'triangle', 0.5, 0.15); // A5
    },

    // 4. Menang (Fanfare ringkas)
    playVictory() {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((f, i) => {
            setTimeout(() => this.osc(f, 'sine', 0.6, 0.2), i * 150);
        });
    },

    // 5. Salah Pilih (Bunyi "Buzz" rendah)
    playWrong() {
        this.osc(150, 'sawtooth', 0.2, 0.1);
    }
};

// Start
SoundEngine.init();
