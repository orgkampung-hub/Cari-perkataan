// ====================== game.js (v2.0.1 Update) ======================

let gridSize = 14;
let grid = [];
let currentWords = [];
let wordsFound = [];
let wordPositions = {};
let score = 0;              
let currentGridNum = 1;
let firstCell = null;
let currentCategory = "";

let hintCountUsed = 0;      
let wordsHinted = [];       

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (typeof wordBank === 'undefined') return;
    currentCategory = urlParams.get('cat') || Object.keys(wordBank)[0];
    startNewRound(currentCategory);
};

function startNewRound(cat) {
    currentCategory = cat;
    const loading = document.getElementById('loading-screen');
    const gameScreen = document.getElementById('game-screen');
    if(loading) loading.classList.remove('hidden');
    if(gameScreen) gameScreen.classList.add('hidden');

    wordsFound = [];
    wordsHinted = [];       
    wordPositions = {};
    firstCell = null;
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));

    const selectedWords = pickWords(cat);
    
    setTimeout(() => {
        const successfullyPlaced = placeWords(selectedWords);
        currentWords = successfullyPlaced;
        fillEmpty();  
        renderUI();
        updateStats();
        if(loading) loading.classList.add('hidden');
        if(gameScreen) gameScreen.classList.remove('hidden');
        document.getElementById('current-cat-display').innerText = `GRID #${currentGridNum} - ${cat.toUpperCase()}`;
    }, 300);
}

function pickWords(cat) {
    const allWords = wordBank[cat] || [];
    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
    const short = allWords.filter(w => w.length <= 5);
    const medium = allWords.filter(w => w.length >= 6 && w.length <= 8);
    const long = allWords.filter(w => w.length >= 9);
    let picked = [...shuffle(short).slice(0, 6), ...shuffle(medium).slice(0, 4), ...shuffle(long).slice(0, 2)].map(w => w.toUpperCase());
    return shuffle(picked);
}

function placeWords(wordsToPlace) {
    const allDirs = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
    let placedList = [];
    const sortedWords = [...wordsToPlace].sort((a, b) => b.length - a.length);
    for (let word of sortedWords) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 500) {
            let d = allDirs[Math.floor(Math.random() * allDirs.length)];
            let r = Math.floor(Math.random() * gridSize);
            let c = Math.floor(Math.random() * gridSize);
            if (canPlace(word, r, c, d)) {
                fillWord(word, r, c, d);
                placedList.push(word);
                placed = true;
            }
            attempts++;
        }
    }
    return placedList;
}

function canPlace(word, r, c, d) {
    for (let i = 0; i < word.length; i++) {
        let nr = r + i * d[0], nc = c + i * d[1];
        if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) return false;
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) return false;
    }
    return true;
}

function fillWord(word, r, c, d) {
    let coords = [];
    for (let i = 0; i < word.length; i++) {
        let nr = r + i * d[0], nc = c + i * d[1];
        grid[nr][nc] = word[i];
        coords.push({ r: nr, c: nc });
    }
    wordPositions[word] = coords;
}

function fillEmpty() {
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === '') grid[r][c] = abc[Math.floor(Math.random() * 26)];
        }
    }
}

function renderUI() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    grid.forEach((row, r) => {
        row.forEach((char, c) => {
            const el = document.createElement('div');
            el.className = 'cell';
            el.innerText = char;
            el.id = `cell-${r}-${c}`;
            el.onmousedown = () => handleTap(el, r, c); 
            container.appendChild(el);
        });
    });
    const list = document.getElementById('word-list');
    list.innerHTML = '';
    currentWords.forEach(w => {
        const li = document.createElement('li');
        li.id = "list-" + w;
        li.innerText = w;
        list.appendChild(li);
    });
}

function handleTap(el, r, c) {
    if (typeof SoundFX !== 'undefined') { SoundFX.resume(); SoundFX.tap(); }
    if (!firstCell) {
        firstCell = { el, r, c };
        el.classList.add('selected');
    } else {
        const dr = r - firstCell.r, dc = c - firstCell.c;
        const dist = Math.max(Math.abs(dr), Math.abs(dc));
        let stepR = 0, stepC = 0;
        if (dr === 0) stepC = dc > 0 ? 1 : -1;
        else if (dc === 0) stepR = dr > 0 ? 1 : -1;
        else if (Math.abs(dr) === Math.abs(dc)) { stepR = dr > 0 ? 1 : -1; stepC = dc > 0 ? 1 : -1; }
        else { if (typeof SoundFX !== 'undefined') SoundFX.wrong(); resetSelection(); return; }
        let path = [];
        for (let i = 0; i <= dist; i++) {
            let curR = firstCell.r + (i * stepR), curC = firstCell.c + (i * stepC);
            const cell = document.getElementById(`cell-${curR}-${curC}`);
            path.push({ el: cell, char: cell.innerText });
        }
        checkWord(path);
        resetSelection();
    }
}

function resetSelection() { if (firstCell) firstCell.el.classList.remove('selected'); firstCell = null; }

function checkWord(path) {
    const word = path.map(p => p.char).join('');
    const reversedWord = word.split('').reverse().join('');
    let targetWord = currentWords.includes(word) ? word : (currentWords.includes(reversedWord) ? reversedWord : "");

    if (targetWord && !wordsFound.includes(targetWord)) {
        wordsFound.push(targetWord);
        if (typeof SoundFX !== 'undefined') SoundFX.success();
        path.forEach((p, i) => setTimeout(() => p.el.classList.add('found'), i * 30));
        document.getElementById("list-" + targetWord).className = 'strike';
        score += 1; 
        updateStats();
        if (wordsFound.length === currentWords.length) {
            score += 8; 
            updateStats();
            if (typeof SoundFX !== 'undefined') SoundFX.win();
            setTimeout(showWinModal, 600);
        }
    } else {
        if (typeof SoundFX !== 'undefined') SoundFX.wrong();
    }
}

// ---------------- FUNGSI HINT & TOAST ----------------
function useHint() {
    const potentialWords = currentWords.filter(w => !wordsFound.includes(w) && !wordsHinted.includes(w));
    if (potentialWords.length === 0) {
        if (typeof SoundFX !== 'undefined') SoundFX.wrong();
        return;
    }

    const hintCost = (hintCountUsed === 0) ? 0 : 4;

    if (score < hintCost) {
        if (typeof SoundFX !== 'undefined') SoundFX.wrong();
        showToast(); // Panggil toast, bukan alert!
        return;
    }

    const selectedWord = potentialWords[Math.floor(Math.random() * potentialWords.length)];
    const positions = wordPositions[selectedWord];
    const randomPos = positions[Math.floor(Math.random() * positions.length)];
    const el = document.getElementById(`cell-${randomPos.r}-${randomPos.c}`);

    if (typeof SoundFX !== 'undefined') SoundFX.tap();
    el.classList.add('hinted');
    wordsHinted.push(selectedWord);
    hintCountUsed++;
    score -= hintCost;
    updateStats();
}

function showToast() {
    const toast = document.getElementById('toast-msg');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500); // Hilang selepas 2.5 saat
}

function showWinModal() {
    const modal = document.getElementById('custom-modal');
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('custom-modal');
    if (modal) modal.classList.remove('active');
    currentGridNum++;
    startNewRound(currentCategory);
}

function updateStats() {
    document.getElementById('score-display').innerText = score;
}
// ---------------- AUTO-RESIZE PADA ROTATION ----------------
// Fungsi ini akan refresh UI bila user pusing skrin (Portrait <-> Landscape)
window.addEventListener('orientationchange', () => {
    // Beri masa sikit untuk browser update saiz skrin baru
    setTimeout(() => {
        if (grid.length > 0) {
            renderUI(); 
        }
    }, 200);
});
