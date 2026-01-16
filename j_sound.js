/**
 * j_sound.js - Web Audio API (Sintetik Bunyi)
 * Tanpa fail MP3. Bunyi dijana secara realtime.
 */

const SoundEngine = {
    ctx: null,
    enabled: true,

    init() {
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

    playTap() {
        this.osc(600, 'sine', 0.1, 0.2);
    },

    playSuccess() {
        if (!this.ctx) return;
        this.osc(523.25, 'sine', 0.3, 0.2); // C5
        setTimeout(() => this.osc(659.25, 'sine', 0.3, 0.2), 100); // E5
    },

    // KEMASKINI: Bunyi Combo (Makin tinggi combo, makin tinggi bunyi)
    playCombo() {
        if (!this.ctx) return;
        
        // Ambil multiplier dari ScoreSystem
        const multiplier = (typeof ScoreSystem !== 'undefined') ? ScoreSystem.currentCombo : 2;
        
        // Frekuensi asas (G5) + kenaikan mengikut multiplier
        const baseFreq = 783.99; 
        const comboFreq = baseFreq + (multiplier * 50); 

        // Bunyi "Blip" berkembar yang laju
        this.osc(comboFreq, 'triangle', 0.2, 0.15);
        setTimeout(() => {
            this.osc(comboFreq * 1.2, 'sine', 0.2, 0.1);
        }, 80);
    },

    playHint() {
        this.osc(880, 'triangle', 0.5, 0.15); // A5
    },

    playVictory() {
        if (!this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((f, i) => {
            setTimeout(() => this.osc(f, 'sine', 0.6, 0.2), i * 150);
        });
    },

    playWrong() {
        if (!this.ctx) return;
        this.osc(150, 'sawtooth', 0.2, 0.1);
    }
};

// Start
SoundEngine.init();
