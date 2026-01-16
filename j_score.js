/**
 * j_score.js - Versi 1 Mata (Synced & Fixed)
 */
const ScoreSystem = {
    currentCombo: 1,
    comboWindow: 20, 
    isFirstWord: true, 
    
    settings: {
        pointsPerWord: 1 // Dah tukar balik ke 1 mata
    },

    /**
     * Dikira setiap kali perkataan dijumpai
     */
    calculateWordScore(word, secondsTaken, isHintUsed, isDiagonal) {
        try {
            // 1. LOGIK COMBO
            if (!this.isFirstWord && secondsTaken > 0 && secondsTaken <= this.comboWindow) {
                this.currentCombo++;
            } else {
                this.currentCombo = 1;
                this.isFirstWord = false; 
            }

            // 2. TRIGGER VISUAL & SOUND
            if (this.currentCombo > 1) {
                if (typeof BonusUI !== 'undefined' && BonusUI.showCombo) {
                    BonusUI.showCombo(this.currentCombo);
                }
                if (typeof SoundEngine !== 'undefined' && SoundEngine.playCombo) {
                    SoundEngine.playCombo();
                }
            }

            // 3. KIRA SKOR (pointsPerWord * multiplier)
            let total = this.settings.pointsPerWord * this.currentCombo;
            
            // Jika kau taknak bonus diagonal, biarkan 0 atau buang baris ni
            // if (isDiagonal) total += 0; 

            // Jika guna hint, tiada mata diberikan
            if (isHintUsed) {
                total = 0;
                this.currentCombo = 1;
            }

            console.log(`Score: +${total} (Multiplier: x${this.currentCombo})`);
            return total;

        } catch (e) {
            console.error("Score Error:", e);
            return 1; 
        }
    },

    /**
     * Fungsi Bonus Akhir (Wajib ada untuk j_game.js)
     */
    calculateFinalBonus(totalSeconds) {
        return 0; // Kekalkan 0 supaya tak tambah skor pelik-pelik masa menang
    },

    resetScore() {
        this.currentCombo = 1;
        this.isFirstWord = true;
        if (typeof BonusUI !== 'undefined' && BonusUI.hideBar) {
            BonusUI.hideBar();
        }
    }
};
