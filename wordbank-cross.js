// ================== BALANCED CROSS PICKER + RANDOM SUPER PRO ==================
function pickCategoryCross(cat) {
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');

    setTimeout(() => {
        const words = pickBalancedWordsRandomSuper(cat);
        setupGame(cat, words); // tetap guna setupGame dari script.js
    }, 600);
}

function startCustomGameCross() {
    const input = document.getElementById('custom-words-input').value;
    let words = input.split(/[,]+/).map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
    if (words.length < 2) { alert("Masukkan sekurang-kurangnya 2 perkataan!"); return; }
    const tooLong = words.find(w => w.length > gridSize);
    if (tooLong) { alert(`Perkataan "${tooLong}" terlalu panjang!`); return; }

    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');

    setTimeout(() => {
        setupGame("MOD CUSTOM", words.slice(0, 15));
    }, 600);
}

// =================== BALANCED PICKER RANDOM SUPER PRO =====================
function pickBalancedWordsRandomSuper(cat) {
    const words = wordBank[cat];
    const short = words.filter(w => w.length <= 5);
    const medium = words.filter(w => w.length >= 6 && w.length <= 8);
    const long = words.filter(w => w.length >= 9);

    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

    // pick max 12 perkataan, quota: 4 short, 4 medium, 4 long
    const picked = [
        ...shuffle(short).slice(0,4),
        ...shuffle(medium).slice(0,4),
        ...shuffle(long).slice(0,4)
    ].slice(0,12);

    // shuffle total untuk randomness
    return shuffle(picked);
}

// ================== CROSS PLACEMENT SUPER PRO =====================
const originalPlaceWords = placeWords; // simpan original

function placeWords() {
    const directions = [
        [0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]
    ];

    const sortedWords = [...currentWords].sort((a,b) => b.length - a.length);
    let crosses = 0;
    let directionUsed = new Set();

    sortedWords.forEach(word => {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 300) {
            let d = directions[Math.floor(Math.random() * directions.length)];
            let r = Math.floor(Math.random() * gridSize);
            let c = Math.floor(Math.random() * gridSize);

            if (canPlaceWithCross(word, r, c, d)) {
                let coords = [];
                let newCross = 0;
                for (let i = 0; i < word.length; i++) {
                    let nr = r + i*d[0], nc = c + i*d[1];
                    if (grid[nr][nc] !== '' && grid[nr][nc] === word[i]) newCross++;
                    grid[nr][nc] = word[i];
                    coords.push({r: nr, c: nc});
                }
                wordPositions[word] = coords;
                placed = true;
                crosses += newCross;
                directionUsed.add(`${d[0]},${d[1]}`);
            }
            attempts++;
        }

        if (!placed) console.warn("Gagal letak perkataan:", word);
    });

    // pastikan minimum 2 cross
    if (crosses < 2 || directionUsed.size < 4) {
        console.warn("Cross kurang dari 2 atau arah kurang lengkap, retry...");
        grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
        wordPositions = {};
        placeWords();
    }
}

// allow cross → huruf sama boleh overlap
function canPlaceWithCross(word, r, c, d) {
    for (let i = 0; i < word.length; i++) {
        let nr = r + i*d[0], nc = c + i*d[1];
        if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) return false;
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) return false;
    }
    return true;
}