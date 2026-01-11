/**
 * game.js - v2.4.19
 * FIXED: High-compatibility for Custom Words (String vs JSON).
 * RETAINED: Full 3K/CRS Engine & Confetti logic.
 */

let wordBank = {}; 
let gridSize = 10; 
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
let debugData = { attempts: 0, crossCount: 0 };

async function loadGameData() {
    try {
        const response = await fetch('words.json');
        if (response.ok) {
            wordBank = await response.json();
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        currentCategory = urlParams.get('cat') || "HAIWAN";

        // --- LOGIK PENYELAMAT CUSTOM ---
        if (currentCategory.toUpperCase() === 'CUSTOM') {
            const rawData = localStorage.getItem('customWords');
            if (rawData) {
                try {
                    // Cuba parse kalau ianya JSON (dari script.js)
                    if (rawData.startsWith('[')) {
                        wordBank["CUSTOM"] = JSON.parse(rawData);
                    } else {
                        // Kalau string mentah (dari index.html), kita split sendiri
                        wordBank["CUSTOM"] = rawData.split(',')
                            .map(w => w.trim().toUpperCase())
                            .filter(w => w.length > 0);
                    }
                } catch (e) {
                    // Fail-safe terakhir
                    wordBank["CUSTOM"] = rawData.split(',').map(w => w.trim().toUpperCase());
                }
            }
        }
        
        startNewRound(currentCategory);
    } catch (error) {
        console.error("Game Data Error:", error);
    }
}

window.onload = () => { loadGameData(); };

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
    hintCountUsed = 0; 

    setTimeout(() => {
        generateHighQualityGrid(cat);
        renderUI();
        updateStats();

        if (typeof window.updateDebugInfo === 'function') {
            window.updateDebugInfo({
                words: currentWords,
                crossCount: debugData.crossCount,
                retry: debugData.attempts
            });
        }

        if(loading) loading.classList.add('hidden');
        if(gameScreen) gameScreen.classList.remove('hidden');
        
        const displayLabel = (cat === "CUSTOM") ? "KATEGORI ANDA" : cat.toUpperCase();
        document.getElementById('current-cat-display').innerText = `GRID #${currentGridNum} - ${displayLabel}`;
    }, 300);
}

function generateHighQualityGrid(cat) {
    debugData.attempts = 0;
    debugData.crossCount = 0;
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    const selectedWords = pickWords(cat);
    currentWords = placeWords(selectedWords);
    fillEmpty();
}

function pickWords(cat) {
    const allWords = wordBank[cat.toUpperCase()] || [];
    
    if (cat.toUpperCase() === "CUSTOM") {
        // Ambil max 12 supaya muat grid
        return allWords.slice(0, 12).map(w => w.toUpperCase()).sort((a,b) => b.length - a.length);
    }

    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
    const s = shuffle(allWords.filter(w => w.length >= 3 && w.length <= 5)).slice(0, 5);
    const m = shuffle(allWords.filter(w => w.length >= 6 && w.length <= 8)).slice(0, 5);
    const l = shuffle(allWords.filter(w => w.length >= 9 && w.length <= 11)).slice(0, 2);
    return [...s, ...m, ...l].map(w => w.toUpperCase()).sort((a,b) => b.length - a.length);
}

function placeWords(wordsToPlace) {
    const allDirs = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
    let placedList = [];
    for (let word of wordsToPlace) {
        let bestPositions = [];
        let maxOverlapFound = -1;
        
        // Loop eksperimen kau
        for (let i = 0; i < 350; i++) { 
            debugData.attempts++;
            let r = Math.floor(Math.random() * gridSize);
            let c = Math.floor(Math.random() * gridSize);
            let d = allDirs[Math.floor(Math.random() * allDirs.length)];
            let overlap = checkPotentialOverlap(word, r, c, d);
            if (overlap > maxOverlapFound) {
                maxOverlapFound = overlap;
                bestPositions = [{r, c, d, overlap}];
            } else if (overlap === maxOverlapFound && overlap !== -1) {
                bestPositions.push({r, c, d, overlap});
            }
        }
        
        if (bestPositions.length > 0) {
            const pick = bestPositions[Math.floor(Math.random() * bestPositions.length)];
            fillWord(word, pick.r, pick.c, pick.d);
            debugData.crossCount += pick.overlap;
            placedList.push(word);
        } else {
            // Backup supaya tak hang
            let foundAnywhere = false;
            for (let r = 0; r < gridSize && !foundAnywhere; r++) {
                for (let c = 0; c < gridSize && !foundAnywhere; c++) {
                    for (let d of allDirs) {
                        if (checkPotentialOverlap(word, r, c, d) >= 0) {
                            fillWord(word, r, c, d);
                            placedList.push(word);
                            foundAnywhere = true;
                            break;
                        }
                    }
                }
            }
        }
    }
    return placedList;
}

function checkPotentialOverlap(word, r, c, d) {
    let overlap = 0;
    for (let i = 0; i < word.length; i++) {
        let nr = r + i * d[0], nc = c + i * d[1];
        if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) return -1;
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) return -1;
        if (grid[nr][nc] === word[i]) overlap++;
    }
    return overlap;
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
    if(!container) return;
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    grid.forEach((row, r) => {
        row.forEach((char, c) => {
            const el = document.createElement('div');
            el.className = 'cell';
            el.innerText = char;
            el.id = `cell-${r}-${c}`;
            
            let count = 0;
            for (let w in wordPositions) {
                if (wordPositions[w].some(p => p.r === r && p.c === c)) {
                    el.setAttribute('data-word', 'true');
                    count++;
                }
            }
            if (count > 1) el.classList.add('crs-highlight');

            el.onmousedown = () => handleTap(el, r, c);
            el.ontouchstart = (e) => { e.preventDefault(); handleTap(el, r, c); }; 
            container.appendChild(el);
        });
    });

    const list = document.getElementById('word-list');
    if(list) {
        list.innerHTML = '';
        currentWords.forEach(w => {
            const li = document.createElement('li');
            li.id = "list-" + w;
            li.innerText = w;
            list.appendChild(li);
        });
    }
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
            if(cell) path.push({ el: cell, char: cell.innerText });
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
        path.forEach((p, i) => { setTimeout(() => { p.el.classList.add('found'); }, i * 30); });
        const li = document.getElementById("list-" + targetWord);
        if(li) li.className = 'strike';
        score += 1; 
        updateStats();
        if (wordsFound.length === currentWords.length) {
            score += 8; updateStats();
            if (typeof SoundFX !== 'undefined') SoundFX.win();
            launchConfetti(); 
            setTimeout(showWinModal, 1000);
        }
    } else {
        if (typeof SoundFX !== 'undefined') SoundFX.wrong();
    }
}

function launchConfetti() {
    const colors = ['#4caf50', '#8bc34a', '#ffffff', '#ffd700', '#ff9800', '#d81b60'];
    for (let i = 0; i < 60; i++) {
        const div = document.createElement('div');
        div.className = 'confetti';
        div.style.left = Math.random() * 100 + 'vw';
        div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        div.style.width = Math.random() * 10 + 5 + 'px';
        div.style.height = div.style.width;
        div.style.position = 'fixed';
        div.style.top = '-10px';
        div.style.zIndex = '9999';
        div.style.pointerEvents = 'none';
        div.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 5000);
    }
}

function updateStats() { const sd = document.getElementById('score-display'); if(sd) sd.innerText = score; }
function showWinModal() { const modal = document.getElementById('custom-modal'); if (modal) modal.classList.add('active'); }
function closeModal() { const modal = document.getElementById('custom-modal'); if (modal) modal.classList.remove('active'); currentGridNum++; startNewRound(currentCategory); }
function goToMenu() { window.location.href = 'index.html'; }
function showToast() { const toast = document.getElementById('toast-msg'); if(toast) { toast.classList.add('show'); setTimeout(() => { toast.classList.remove('show'); }, 2500); } }
