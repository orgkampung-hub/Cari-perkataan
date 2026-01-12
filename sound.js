/**
 * ================= SOUND ENGINE (WEB AUDIO API) v2.3.0 =================
 * Update: Added Dynamic Combo Sound & Combo Level Scaling
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
        if (this.ctx.state === 'suspended') return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    tap() { 
        this.resume();
        this.playNote(600, "sine", 0.1, 0.1); 
    }, 

    success() { 
        this.resume();
        this.playNote(523.25, "square", 0.08, 0.1); 
        setTimeout(() => this.playNote(659.25, "square", 0.08, 0.2), 80); 
    },

    // --- FUNGSI BARU: COMBO SOUND ---
    playCombo(level) {
        this.resume();
        // Base freq 600Hz, naik 100Hz setiap level combo
        const baseFreq = 600 + (level * 100);
        // Kita guna "square" untuk impact, atau "triangle" untuk bunyi lebih lembut
        this.playNote(baseFreq, "square", 0.07, 0.15);
        
        // Tambah nada kedua yang lebih tinggi sikit (harmonik) untuk effect "ding!"
        setTimeout(() => {
            this.playNote(baseFreq * 1.5, "sine", 0.05, 0.1);
        }, 50);
    },

    win() { 
        this.resume();
        const notes = [
            { f: 523.25, t: 0 },    
            { f: 659.25, t: 150 }, 
            { f: 783.99, t: 300 },  
            { f: 1046.50, t: 450 } 
        ];
        notes.forEach(note => {
            setTimeout(() => {
                this.playNote(note.f, "square", 0.1, 0.4);
            }, note.t);
        });
    },

    wrong() { 
        this.resume();
        this.playNote(150, "sawtooth", 0.1, 0.3); 
    } 
};
