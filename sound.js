// ================= SOUND ENGINE (WEB AUDIO API) =================
const SoundFX = {
    ctx: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    // Fungsi kritikal: Browser perlukan resume() selepas klik pengguna
    async resume() {
        this.init();
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    },

    playNote(freq, type, vol, duration) {
        this.init();
        // Jangan main jika context masih suspended
        if (this.ctx.state === 'suspended') return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    tap() { 
        this.resume(); // Pastikan aktif setiap kali ada tap
        this.playNote(440, "sine", 0.05, 0.1); 
    }, 

    success() { 
        this.resume();
        this.playNote(523.25, "square", 0.1, 0.2);
        setTimeout(() => this.playNote(659.25, "square", 0.1, 0.3), 100);
    },

    win() { 
        this.resume();
        [523.25, 659.25, 783.99, 1046.50].forEach((note, i) => {
            setTimeout(() => this.playNote(note, "triangle", 0.15, 0.4), i * 150);
        });
    },

    wrong() { 
        this.resume();
        this.playNote(150, "sawtooth", 0.2, 0.3); 
    } 
};
