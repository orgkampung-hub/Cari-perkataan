/**
 * j_score.js - Versi v4.2.0 (Level x Combo Multiplier)
 */
const ScoreSystem = {
    currentCombo: 1,
    comboWindow: 20000, // 20 saat (dalam milisaat)
    isFirstWord: true,

    /**
     * Ambil mata asas mengikut tahap kesukaran
     * EASY = 1, MEDIUM = 2, HARD = 3
     */
    getDifficultyPoints() {
        const level = localStorage.getItem('selectedLevel') || 'MEDIUM';
        switch(level.toUpperCase()) {
            case 'HARD': return 3;
            case 'MEDIUM': return 2;
            case 'EASY': return 1;
            default: return 1;
        }
    },

    /**
     * Fungsi utama kira skor dipanggil oleh j_game.js
     */
    calculateWordScore(word, secondsTaken, isHintUsed) {
        try {
            const msTaken = secondsTaken * 1000; 

            // 1. LOGIK PENGIRAAN COMBO
            if (!this.isFirstWord && msTaken > 0 && msTaken <= this.comboWindow) {
                this.currentCombo++;
            } else {
                this.currentCombo = 1;
                this.isFirstWord = false;
            }

            // 2. TRIGGER VISUAL (BonusUI) & BUNYI
            if (this.currentCombo > 1 && typeof BonusUI !== 'undefined') {
                BonusUI.showCombo(this.currentCombo);
                if (typeof SoundEngine !== 'undefined' && SoundEngine.playCombo) {
                    SoundEngine.playCombo();
                }
            }

            // 3. KIRA SKOR AKHIR (Level Points x Combo Multiplier)
            let basePoints = this.getDifficultyPoints();
            
            // FORMULA: (Mata Level) x (Nilai Combo)
            let total = basePoints * this.currentCombo;

            // Jika guna hint, skor jadi 0 dan combo reset
            if (isHintUsed) {
                total = 0;
                this.currentCombo = 1;
            }

            console.log(`[Score] Level: ${localStorage.getItem('selectedLevel')} | Base: ${basePoints} | Combo: x${this.currentCombo} | Total: +${total}`);
            
            return total;

        } catch (e) {
            console.error("ScoreSystem Error:", e);
            return 1; 
        }
    },

    /**
     * Bonus kemenangan (kekalkan 0 jika tiada bonus tambahan)
     */
    calculateFinalBonus(totalSeconds) {
        return 0; 
    },

    /**
     * Reset skor bila game bermula semula
     */
    resetScore() {
        this.currentCombo = 1;
        this.isFirstWord = true;
        if (typeof BonusUI !== 'undefined') {
            BonusUI.hideBar();
        }
    }
};
