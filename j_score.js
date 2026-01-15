/**
 * j_score.js - Pusat Kawalan Skor
 * Senang nak tukar-tukar kalau rasa tak ngam.
 */

const ScoreSystem = {
    // --- KONFIGURASI (Ubah kat sini je esok-esok) ---
    settings: {
        pointsPerLetter: 10,     // Satu huruf dapat berapa mata
        speedBonusLimit: 15,    // Bawah berapa saat dikira "laju"
        speedBonusPoints: 50,   // Berapa mata bonus laju
        hintPenalty: 0.5,       // Potong berapa? (0.5 = 50%, 0.2 = 20%)
        diagonalBonus: 1.5      // Bonus kalau perkataan menyerong
    },

    /**
     * Fungsi utama kira markah setiap kali jumpa perkataan
     */
    calculateWordScore(word, secondsTaken, isHintUsed, isDiagonal = false) {
        // 1. Mata asas ikut panjang huruf
        let total = word.length * this.settings.pointsPerLetter;

        // 2. Bonus kalau jumpa cepat (Cun-cun cina punya timing)
        if (secondsTaken <= this.settings.speedBonusLimit) {
            total += this.settings.speedBonusPoints;
            console.log("🚀 Bonus Laju!");
        }

        // 3. Bonus kalau perkataan tu menyerong (Diagonal)
        if (isDiagonal) {
            total = Math.floor(total * this.settings.diagonalBonus);
        }

        // 4. Potongan kalau guna hint (Kesian tapi kena adil)
        if (isHintUsed) {
            total = Math.floor(total * (1 - this.settings.hintPenalty));
            console.log("💡 Penalti Hint dikenakan.");
        }

        return total;
    },

    /**
     * Bonus akhir selepas habis semua perkataan
     */
    calculateFinalBonus(remainingTimeInSeconds) {
        // Contoh: Baki 1 saat = 5 mata bonus
        return remainingTimeInSeconds * 5;
    }
};

console.log("Score System: Sedia untuk 'tuning'.");
