let gridSize = 12;
let grid = [];
let currentWords = [];
let wordsFound = [];
let score = 5;
let wordPositions = {};

// ================= BALANCED PICKER =================
function pickBalancedWords(cat) {
    const words = wordBank[cat];
    const short = words.filter(w => w.length <= 5);
    const medium = words.filter(w => w.length >= 6 && w.length <= 8);
    const long = words.filter(w => w.length >= 9);

    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

    return [
        ...shuffle(short).slice(0, 4),
        ...shuffle(medium).slice(0, 5),
        ...shuffle(long).slice(0, 3)
    ];
}

// ================= PICK CATEGORY =================
function pickCategory(cat) {
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.remove('hidden');
    setTimeout(() => {
        let words = pickBalancedWords(cat);
        setupGame(cat, words);
    }, 600);
}

// ================= CUSTOM GAME =================
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

// ================= SETUP GAME =================
function setupGame(title, words) {
    document.getElementById('current-cat-display').innerText = title;
    currentWords = words;
    wordsFound = [];
    wordPositions = {};
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    placeWords();
    fillEmpty();
    renderUI();
    updateStats();
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
}

// ================= PLACE WORDS (CROSS ALLOWED) =================
function placeWords() {
    const directions = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
    const sortedWords = [...currentWords].sort((a,b) => b.length - a.length);

    sortedWords.forEach(word => {
        let placed = false, attempts = 0;
        while (!placed && attempts < 200) {
            let d = directions[Math.floor(Math.random() * directions.length)];
            let r = Math.floor(Math.random() * gridSize);
            let c = Math.floor(Math.random() * gridSize);

            if (canPlaceWithCross(word, r, c, d)) {
                let coords = [];
                for (let i=0; i<word.length; i++) {
                    let nr = r + i*d[0], nc = c + i*d[1];
                    grid[nr][nc] = word[i];
                    coords.push({r: nr, c: nc});
                }
                wordPositions[word] = coords;
                placed = true;
            }
            attempts++;
        }
        if (!placed) console.warn("Gagal letak perkataan:", word);
    });
}

function canPlaceWithCross(word, r, c, d) {
    for (let i=0; i<word.length; i++) {
        let nr = r + i*d[0], nc = c + i*d[1];
        if (nr<0 || nr>=gridSize || nc<0 || nc>=gridSize) return false;
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) return false;
    }
    return true;
}

// ================= FILL EMPTY CELLS =================
function fillEmpty() {
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let r=0; r<gridSize; r++)
        for(let c=0; c<gridSize; c++)
            if(grid[r][c] === '') grid[r][c] = abc[Math.floor(Math.random()*26)];
}

// ================= RENDER UI =================
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

// ================= HANDLE CLICK FIRST-LAST =================
let firstCell = null;

function handleTap(el, r, c) {
    if (navigator.vibrate) navigator.vibrate(20);

    if (!firstCell) {
        firstCell = { el, r, c };
        el.classList.add('selected');
    } else {
        const lastCell = { el, r, c };

        const dr = lastCell.r - firstCell.r;
        const dc = lastCell.c - firstCell.c;

        let stepR = 0, stepC = 0;
        if (dr === 0 && dc !== 0) stepC = dc > 0 ? 1 : -1;
        else if (dc === 0 && dr !== 0) stepR = dr > 0 ? 1 : -1;
        else if (Math.abs(dr) === Math.abs(dc)) { stepR = dr > 0 ? 1 : -1; stepC = dc > 0 ? 1 : -1; }
        else { firstCell.el.classList.remove('selected'); firstCell = null; return; }

        let path = [], curR = firstCell.r, curC = firstCell.c;
        while(true){
            const cellEl = document.getElementById(`cell-${curR}-${curC}`);
            path.push({ el: cellEl, r: curR, c: curC, char: cellEl.innerText });
            if(curR === lastCell.r && curC === lastCell.c) break;
            curR += stepR;
            curC += stepC;
        }

        checkWordPath(path);
        path.forEach(p => p.el.classList.remove('selected'));
        firstCell = null;
    }
}

function checkWordPath(path) {
    const word = path.map(p => p.char).join('');
    if (currentWords.includes(word) && !wordsFound.includes(word)) {
        wordsFound.push(word);
        score += 1;
        path.forEach((p,i)=>{
            setTimeout(()=>{ p.el.classList.add('found'); if(navigator.vibrate) navigator.vibrate(15); }, i*60);
        });
        document.getElementById("list-" + word).className = 'strike';
        updateStats();

        if (wordsFound.length === currentWords.length) {
            setTimeout(()=>{ createConfetti(); alert("TAHNIAH! Skor Akhir: " + score); showMenu(); },800);
        }
    }
}

// ================= HINT =================
function useHint() {
    if(score <=0){ alert("Skor 0!"); return; }
    const remaining = currentWords.filter(w=>!wordsFound.includes(w));
    if(remaining.length > 0){
        let possible = [];
        remaining.forEach(w=>{
            wordPositions[w].forEach(p=>{
                const el = document.getElementById(`cell-${p.r}-${p.c}`);
                if(!el.classList.contains('found') && !el.classList.contains('hinted')) possible.push(el);
            });
        });
        if(possible.length >0){
            possible[Math.floor(Math.random()*possible.length)].classList.add('hinted');
            score -=1; updateStats();
        }
    }
}

// ================= STATS =================
function updateStats() { document.getElementById('score-display').innerText = "SKOR: " + score; }

// ================= SHOW MENU =================
function showMenu() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');
}

// ================= CONFETTI =================
function createConfetti() {
    const colors = ['#f72585','#4cc9f0','#4caf50','#ffca28'];
    for(let i=0;i<80;i++){
        const div = document.createElement('div');
        div.className = 'confetti';
        div.style.left = Math.random()*100+'vw';
        div.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
        div.style.animationDuration = (Math.random()*2+2)+'s';
        document.body.appendChild(div);
        setTimeout(()=>div.remove(),4000);
    }
}