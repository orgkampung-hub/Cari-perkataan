// j_game.js - Controller Utama (Versi Update: Integrated ScoreSystem)

const GameController = {
    score: 0,
    foundCount: 0,
    totalToFind: 0,
    foundWordsList: [],
    lastFoundTime: 0, // Tambah ni untuk simpan rekod masa sebelum ni

    async init() {
        this.updateCategoryHeader();
        try {
            const words = await Generator.init();
            this.totalToFind = words.length; 
            
            console.log(`Game Ready: Mencari ${this.totalToFind} perkataan.`);
            this.updateScoreUI();
            
            if (typeof Timer !== 'undefined') {
                Timer.init();
                this.lastFoundTime = 0; // Reset masa rujukan
            }
        } catch (e) { 
            console.error("Gagal init:", e); 
        }
    },

    updateCategoryHeader() {
        const selectedCat = localStorage.getItem('selectedCategory');
        const headerTitle = document.getElementById('category-title');
        if (headerTitle) {
            headerTitle.innerText = selectedCat ? selectedCat.toUpperCase() : "CARI PERKATAAN";
        }
    },

    markWordFound(word) {
        const upperWord = word.toUpperCase();
        
        if (this.foundWordsList.includes(upperWord)) return;
        
        const wordElement = document.getElementById(`list-${upperWord}`);
        if (wordElement) {
            wordElement.classList.add('done');
            this.foundWordsList.push(upperWord);
            
            // --- LOGIK BARU: PANGGIL SCORE SYSTEM ---
            let secondsTaken = 0;
            if (typeof Timer !== 'undefined') {
                const currentTime = Timer.getTotalSeconds(); // Pastikan Timer ada fungsi ni
                secondsTaken = currentTime - this.lastFoundTime; 
                this.lastFoundTime = currentTime; // Simpan untuk perkataan seterusnya
            }

            // Tanya ScoreSystem berapa markah patut dapat
            // Kita hantar: (Perkataan, Masa diambil, Guna Hint?, Menyerong?)
            // Buat masa ni kita set Hint & Diagonal sebagai false/auto
            if (typeof ScoreSystem !== 'undefined') {
                const pointsReceived = ScoreSystem.calculateWordScore(
                    upperWord, 
                    secondsTaken, 
                    false, // Nanti boleh ganti dengan HintSystem.checkUsed()
                    false
                );
                this.score += pointsReceived;
            } else {
                this.score += 100; // Fallback kalau ScoreSystem tak load
            }
            // ------------------------------------------

            this.foundCount++;
            this.updateScoreUI();

            if (this.foundCount === this.totalToFind && this.totalToFind > 0) {
                setTimeout(() => this.victory(), 500);
            }
        }
    },

    updateScoreUI() {
        const scoreDisplay = document.getElementById('score');
        if (scoreDisplay) scoreDisplay.innerText = this.score;
    },

    victory() {
        console.log("Kemenangan dikesan!");
        
        if (typeof SoundEngine !== 'undefined') {
            SoundEngine.playVictory();
        }
        
        let timeString = "00:00";
        let totalSeconds = 0;
        if (typeof Timer !== 'undefined') {
            Timer.stop();
            timeString = Timer.getTimeFormatted();
            totalSeconds = Timer.getTotalSeconds();
        }

        // --- TAMBAHAN: BONUS MASA AKHIR ---
        if (typeof ScoreSystem !== 'undefined') {
            const finalBonus = ScoreSystem.calculateFinalBonus(totalSeconds);
            this.score += finalBonus;
            this.updateScoreUI();
        }

        if (typeof ModalSystem !== 'undefined') {
            ModalSystem.show({
                title: "TAHNIAH!",
                message: `Anda menjumpai semua ${this.totalToFind} perkataan!`,
                time: timeString,
                score: this.score
            });
        }
    }
};

window.addEventListener('load', () => {
    GameController.init();
});
