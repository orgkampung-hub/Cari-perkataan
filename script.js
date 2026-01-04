let gridSize = 12;
let grid = [];
let currentWords = [];
let selectedCells = [];
let lockedDir = null;
let wordsFound = [];
let score = 5;
let wordPositions = {};

function pickCategory(cat) {
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');
    setTimeout(() => {
        let words = [...wordBank[cat]].sort(() => 0.5 - Math.random()).slice(0, 12);
        setupGame(cat, words);
    }, 600);
}

function startCustomGame() {
    const input = document.getElementById('custom-words-input').value;
    let words = input.split(/[,]+/).map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
    if (words.length < 2) { alert("Masukkan sekurang-kurangnya 2 perkataan!"); return; }
    const tooLong = words.find(w => w.length > gridSize);
    if (tooLong) { alert(`Perkataan "${tooLong}" terlalu panjang!`); return; }

    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');
    setTimeout(() => { setupGame("MOD CUSTOM", words.slice(0, 15)); }, 600);
}

function setupGame(title, words) {
    document.getElementById('current-cat-display').innerText = title;
    currentWords = words;
    wordsFound = [];
    selectedCells = [];
    lockedDir = null;
    wordPositions = {};
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    placeWords();
    fillEmpty();
    renderUI();
    updateStats();
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
}

function placeWords() {
    const directions = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
    currentWords.forEach(word => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 150) {
            let d = directions[Math.floor(Math.random() * directions.length)];
            let r = Math.floor(Math.random() * gridSize), c = Math.floor(Math.random() * gridSize);
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
            el.className = 'cell'; el.innerText = char; el.id = `cell-${r}-${c}`;
            el.onclick = () => handleTap(el, r, c);
            container.appendChild(el);
        });
    });
    const list = document.getElementById('word-list');
    list.innerHTML = '';
    currentWords.forEach(w => {
        const li = document.createElement('li'); li.innerText = w; li.id = "list-" + w;
        list.appendChild(li);
    });
}

function handleTap(el, r, c) {
    if (navigator.vibrate) navigator.vibrate(20);
    if (selectedCells.length === 0) { select(el, r, c); } 
    else {
        const last = selectedCells[selectedCells.length - 1];
        if (el === last.el) { deselect(); return; }
        let dr = r - last.r, dc = c - last.c;
        if (Math.abs(dr) > 1 || Math.abs(dc) > 1) return;
        if (selectedCells.length === 1) { lockedDir = { dr, dc }; select(el, r, c); }
        else if (dr === lockedDir.dr && dc === lockedDir.dc) { select(el, r, c); }
    }
    checkWord();
}

function select(el, r, c) {
    if (el.classList.contains('found')) { el.classList.remove('found'); el.dataset.wasFound = "true"; }
    el.classList.add('selected');
    selectedCells.push({ el, r, c, char: el.innerText });
}

function deselect() {
    const last = selectedCells.pop();
    last.el.classList.remove('selected');
    if (last.el.dataset.wasFound === "true") { last.el.classList.add('found'); delete last.el.dataset.wasFound; }
    if (selectedCells.length < 2) lockedDir = null;
}

function checkWord() {
    let word = selectedCells.map(s => s.char).join('');
    if (currentWords.includes(word) && !wordsFound.includes(word)) {
        wordsFound.push(word);
        score += 1;
        selectedCells.forEach((s, i) => {
            setTimeout(() => {
                s.el.classList.remove('selected'); s.el.classList.add('found');
                delete s.el.dataset.wasFound;
                if (navigator.vibrate) navigator.vibrate(15);
            }, i * 60);
        });
        document.getElementById("list-" + word).className = 'strike';
        selectedCells = []; lockedDir = null; updateStats();
        if (wordsFound.length === currentWords.length) {
            setTimeout(() => { createConfetti(); alert("TAHNIAH! Skor Akhir: " + score); showMenu(); }, 800);
        }
    }
}

function useHint() {
    if (score <= 0) { alert("Skor 0!"); return; }
    const remaining = currentWords.filter(w => !wordsFound.includes(w));
    if (remaining.length > 0) {
        let possible = [];
        remaining.forEach(w => {
            wordPositions[w].forEach(p => {
                let el = document.getElementById(`cell-${p.r}-${p.c}`);
                if (!el.classList.contains('found') && !el.classList.contains('hinted')) possible.push(el);
            });
        });
        if (possible.length > 0) {
            possible[Math.floor(Math.random() * possible.length)].classList.add('hinted');
            score -= 1; updateStats();
        }
    }
}

function updateStats() { document.getElementById('score-display').innerText = "SKOR: " + score; }

function showMenu() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');
}

function createConfetti() {
    const colors = ['#f72585', '#4cc9f0', '#4caf50', '#ffca28'];
    for (let i = 0; i < 80; i++) {
        const div = document.createElement('div');
        div.className = 'confetti';
        div.style.left = Math.random() * 100 + 'vw';
        div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        div.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    }
}
