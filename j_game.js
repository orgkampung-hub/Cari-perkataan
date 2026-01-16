// j_game.js - Controller Utama (v4.4.4 - Clean Version)

const GameController = {
    score: 0,
    foundCount: 0,
    totalToFind: 0,
    foundWordsList: [],
    lastFoundTime: 0,

    async init() {
        this.updateCategoryHeader();
        this.updateUserDisplay(); 
        
        try {
            const words = await Generator.init();
            this.totalToFind = words.length; 
            this.updateScoreUI();
            
            if (typeof Timer !== 'undefined') {
                Timer.init();
                this.lastFoundTime = 0;
            }

            if (typeof Tutorial !== 'undefined') {
                const isShowingTuto = Tutorial.check();
                if (!isShowingTuto) {
                    if (typeof Timer !== 'undefined') Timer.start();
                }
            } else {
                if (typeof Timer !== 'undefined') Timer.start();
            }

        } catch (e) { 
            console.error("Gagal init game:", e); 
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

    updateUserDisplay() {
        const savedUsername = localStorage.getItem('username') || "PEMAIN";
        const nameElement = document.getElementById('display-username');
        const avatarImg = document.getElementById('user-avatar'); 

        if (nameElement) {
            nameElement.innerText = savedUsername.toUpperCase();
        }

        if (avatarImg) {
            const seed = encodeURIComponent(savedUsername.trim());
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
                const pointsReceived = ScoreSystem.calculateWordScore(upperWord, secondsTaken, false, false);
                this.score += pointsReceived;
            } else {
                this.score += 100; 
            }

            this.updateScoreUI();
            this.foundCount++;

            if (this.foundCount === this.totalToFind && this.totalToFind > 0) {
                setTimeout(() => this.victory(), 1200);
            }
        }
    },

    updateScoreUI() {
        const scoreDisplay = document.getElementById('score');
        if (scoreDisplay) scoreDisplay.innerText = this.score;
    },

    // FUNGSI hantarKeGoogle DIBUANG UNTUK ELAK PERCANGGAHAN DENGAN MODAL

    victory() {
        console.log("Kemenangan dikesan!");
        
        if (typeof Timer !== 'undefined') Timer.stop();
        
        const timeString = typeof Timer !== 'undefined' ? Timer.getTimeFormatted() : "00:00";
        const totalSeconds = typeof Timer !== 'undefined' ? Timer.getTotalSeconds() : 0;

        if (typeof ScoreSystem !== 'undefined') {
            const finalBonus = ScoreSystem.calculateFinalBonus(totalSeconds);
            this.score += finalBonus;
            this.updateScoreUI();
        }

        if (typeof SoundEngine !== 'undefined') SoundEngine.playVictory();

        // SERAH TUGAS HANTAR DATA PADA MODAL SAHAJA
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
