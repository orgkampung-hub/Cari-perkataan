// j_game.js - Controller Utama (Versi Update: Tag Gantung, Player Info & Dynamic Avatar)

const GameController = {
    score: 0,
    foundCount: 0,
    totalToFind: 0,
    foundWordsList: [],
    lastFoundTime: 0,

    async init() {
        this.updateCategoryHeader();
        this.updateUserDisplay(); // Paparkan nama & avatar user sebaik game load
        
        try {
            // 1. Bina Grid dulu (Biar nampak kat background)
            const words = await Generator.init();
            this.totalToFind = words.length; 
            
            console.log(`Game Ready: Mencari ${this.totalToFind} perkataan.`);
            this.updateScoreUI();
            
            if (typeof Timer !== 'undefined') {
                Timer.init();
                this.lastFoundTime = 0;
            }

            // 2. SISTEM TUTORIAL
            if (typeof Tutorial !== 'undefined') {
                const isShowingTuto = Tutorial.check();
                if (!isShowingTuto) {
                    if (typeof Timer !== 'undefined') Timer.start();
                }
            } else {
                if (typeof Timer !== 'undefined') Timer.start();
            }

        } catch (e) { 
            console.error("Gagal init:", e); 
        }
    },

    updateCategoryHeader() {
        const selectedCat = localStorage.getItem('selectedCategory');
        const headerTitle = document.getElementById('category-title');
        if (headerTitle) {
            const catName = selectedCat ? selectedCat.toUpperCase() : "RAWAK";
            headerTitle.innerHTML = `<i class="fas fa-folder-open" style="margin-right:5px;"></i> ${catName}`;
        }
    },

    // KEMASKINI: Papar Nama & Avatar Dinamik
    updateUserDisplay() {
        const savedUsername = localStorage.getItem('username') || "PEMAIN";
        const nameElement = document.getElementById('display-username');
        const avatarImg = document.getElementById('user-avatar'); 

        if (nameElement) {
            nameElement.innerText = savedUsername.toUpperCase();
        }

        // Guna DiceBear API untuk generate avatar berdasarkan nama (seed)
        if (avatarImg) {
            const seed = encodeURIComponent(savedUsername.trim());
            // Style 'fun-emoji' sangat sesuai dengan tema game ceria
            avatarImg.src = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;
        }
    },

    markWordFound(word) {
        const upperWord = word.toUpperCase();
        
        if (this.foundWordsList.includes(upperWord)) return;
        
        const wordElement = document.getElementById(`list-${upperWord}`);
        if (wordElement) {
            wordElement.classList.add('done');
            this.foundWordsList.push(upperWord);
            
            let secondsTaken = 0;
            if (typeof Timer !== 'undefined') {
                const currentTime = Timer.getTotalSeconds(); 
                secondsTaken = currentTime - this.lastFoundTime; 
                this.lastFoundTime = currentTime; 
            }

            if (typeof ScoreSystem !== 'undefined') {
                const pointsReceived = ScoreSystem.calculateWordScore(
                    upperWord, 
                    secondsTaken, 
                    false, 
                    false
                );
                this.score += pointsReceived;
            } else {
                this.score += 100; 
            }

            this.foundCount++;
            this.updateScoreUI();

            if (this.foundCount === this.totalToFind && this.totalToFind > 0) {
                // Tambah delay sikit kat sini (dari 500 ke 1200) supaya animasi grid settle
                setTimeout(() => this.victory(), 1200);
            }
        }
    },

    updateScoreUI() {
        const scoreDisplay = document.getElementById('score');
        if (scoreDisplay) scoreDisplay.innerText = this.score;
    },

    victory() {
        console.log("Kemenangan dikesan!");
        
        // Bungkus semua logik victory dlm timeout supaya bertenang sikit
        setTimeout(() => {
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
        }, 300); // Extra safety delay
    }
};

window.addEventListener('load', () => {
    GameController.init();
});
