let gridSize = 12;
let grid = [];
let currentWords = [];
let selectedCells = [];
let lockedDir = null;
let wordsFound = [];
let score = 5; // Kita beri 5 mata permulaan supaya boleh guna hint awal
let wordPositions = {};

function pickCategory(cat) {
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');
    setTimeout(() => {
        setupGame(cat);
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
    }, 1200);
}

function setupGame(cat) {
    document.getElementById('current-cat-display').innerText = "KATEGORI: " + cat;
    currentWords = [...wordBank[cat]].sort(() => 0.5 - Math.random()).slice(0, 10);
    wordsFound = [];
    selectedCells = [];
    lockedDir = null;
    wordPositions = {};
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    placeWords();
    fillEmpty();
    renderUI();
    updateStats();
}

function placeWords() {
    const directions = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
    currentWords.forEach(word => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 200) {
            let d = directions[Math.floor(Math.random() * directions.length)];
            let r = Math.floor(Math.random() * gridSize);
            let c = Math.floor(Math.random() * gridSize);
            if (canPlace(word, r, c, d)) {
                let coords = [];
                for(let i=0; i<word.length; i++) {
                    let nr = r + i*d[0], nc = c + i*d[1];
                    grid[nr][nc] = word[i];
                    coords.push({r: nr, c: nc});
                }
                wordPositions[word] = coords;
                placed = true;
            }
            attempts++;
        }
    });
}

function canPlace(word, r, c, d) {
    for (let i=0; i<word.length; i++) {
        let nr = r + i*d[0], nc = c + i*d[1];
        if (nr<0 || nr>=gridSize || nc<0 || nc>=gridSize || (grid[nr][nc] !== '' && grid[nr][nc] !== word[i])) return false;
    }
    return true;
}

function fillEmpty() {
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let r=0; r<gridSize; r++) 
        for(let c=0; c<gridSize; c++) 
            if(grid[r][c] === '') grid[r][c] = abc[Math.floor(Math.random()*26)];
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
            el.onclick = () => handleTap(el, r, c);
            container.appendChild(el);
        });
    });
    const list = document.getElementById('word-list');
    list.innerHTML = '';
    currentWords.forEach(w => {
        const li = document.createElement('li');
        li.innerText = w; li.id = "list-" + w;
        list.appendChild(li);
    });
}

function handleTap(el, r, c) {
    if (navigator.vibrate) navigator.vibrate(25);
    if (selectedCells.length === 0) {
        select(el, r, c);
    } else {
        const last = selectedCells[selectedCells.length - 1];
        if (el === last.el) { deselect(); return; }
        let dr = r - last.r, dc = c - last.c;
        if (Math.abs(dr) > 1 || Math.abs(dc) > 1) return;
        if (selectedCells.length === 1) {
            lockedDir = { dr, dc };
            select(el, r, c);
        } else if (dr === lockedDir.dr && dc === lockedDir.dc) {
            select(el, r, c);
        }
    }
    checkWord();
}

function select(el, r, c) {
    // Jika asalnya hijau (found), simpan status dan tukar ke biru
    if (el.classList.contains('found')) {
        el.classList.remove('found');
        el.dataset.wasFound = "true";
    }
    el.classList.add('selected');
    selectedCells.push({ el, r, c, char: el.innerText });
}

function deselect() {
    const last = selectedCells.pop();
    last.el.classList.remove('selected');
    // Jika asalnya hijau, kembalikan warna hijau
    if (last.el.dataset.wasFound === "true") {
        last.el.classList.add('found');
        delete last.el.dataset.wasFound;
    }
    if (selectedCells.length < 2) lockedDir = null;
}

function checkWord() {
    let word = selectedCells.map(s => s.char).join('');
    if (currentWords.includes(word) && !wordsFound.includes(word)) {
        wordsFound.push(word);
        score += 1;
        selectedCells.forEach(s => {
            s.el.classList.remove('selected');
            s.el.classList.add('found');
            delete s.el.dataset.wasFound; // Selesai, buang tanda sementara
        });
        document.getElementById("list-" + word).className = 'strike';
        selectedCells = []; lockedDir = null;
        updateStats();
        if (wordsFound.length === currentWords.length) {
            setTimeout(() => { alert("TAHNIAH! Skor: " + score); showMenu(); }, 300);
        }
    }
}

// FUNGSI HINT: HIGHLIGHT 1 HURUF RANDOM DARIPADA PERKATAAN RANDOM
function useHint() {
    if (score <= 0) {
        alert("Skor 0! Kumpulkan skor dulu."); return;
    }
    const remaining = currentWords.filter(w => !wordsFound.includes(w));
    if (remaining.length > 0) {
        // Pilih perkataan random, pilih huruf random
        const randomWord = remaining[Math.floor(Math.random() * remaining.length)];
        const coords = wordPositions[randomWord];
        const randomCoord = coords[Math.floor(Math.random() * coords.length)];
        const cell = document.getElementById(`cell-${randomCoord.r}-${randomCoord.c}`);
        
        cell.classList.add('hinted');
        score -= 1;
        updateStats();
        setTimeout(() => cell.classList.remove('hinted'), 3000);
    }
}

function updateStats() {
    document.getElementById('score-display').innerText = "SKOR: " + score;
}

function showMenu() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');
}
