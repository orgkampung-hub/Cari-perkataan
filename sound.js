/**
 * ================= SOUND ENGINE (WEB AUDIO API) v2.2.1 =================
 * Update: Optimized Win Fanfare & Oscillator Management
 */
const SoundFX = {
    ctx: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    async resume() {
        this.init();
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
    },

    playNote(freq, type, vol, duration) {
        this.init();
        // Jangan main kalau ctx masih suspended (safety check)
        if (this.ctx.state === 'suspended') return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        // Elakkan bunyi "pop" di permulaan
        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.01);
        
        // Turunkan volume secara smooth ke 0.0001
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    // Bunyi bila user sentuh huruf
    tap() { 
        this.resume();
        this.playNote(600, "sine", 0.1, 0.1); 
    }, 

    // Bunyi bila satu perkataan dijumpai
    success() { 
        this.resume();
        // Nada berkembar untuk kesan "reward"
        this.playNote(523.25, "square", 0.08, 0.1); // C5
        setTimeout(() => this.playNote(659.25, "square", 0.08, 0.2), 80); // E5
    },

    // Bunyi bila menang satu level (Tadaa!) - Fanfare Menurun ke Menaik
    win() { 
        this.resume();
        // C5, E5, G5, C6 (High) - Melodi kemenangan klasik
        const notes = [
            { f: 523.25, t: 0 },    
            { f: 659.25, t: 150 }, 
            { f: 783.99, t: 300 },  
            { f: 1046.50, t: 450 } 
        ];

        notes.forEach(note => {
            setTimeout(() => {
                // Guna "square" supaya bunyi lebih ceria/retro
                this.playNote(note.f, "square", 0.1, 0.4);
            }, note.t);
        });
    },

    // Bunyi bila salah tarik perkataan
    wrong() { 
        this.resume();
        this.playNote(150, "sawtooth", 0.1, 0.3); 
    } 
};
