/**
 * game.js - v3.0.1
 * STATUS: FIXED CRS LOGIC + SMOOTH WAVE ANIMATION (TAP SYSTEM)
 * RETAINED: All original logic & sync with debug.js.
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyWEF1_2o7TXhuREdwl4dxr9WMqSNfoEWCdQa2FRvlrkMA-fVAMpghhMuf1wnXuSit4/exec";
let masaMula, intervalTimer;
let wordBank = {}, gridSize = 10, grid = [], currentWords = [], wordsFound = [], wordPositions = {};
let score = 0, currentGridNum = 1, firstCell = null, currentCategory = "", hintCountUsed = 0;
let lastFoundTime = 0, comboLevel = 0;
let isDebugActive = false; 
let activeHints = []; 
let debugData = { attempts: 0, crossCount: 0 };

async function loadGameData() {
    try {
        const response = await fetch('words.json');
        if (response.ok) wordBank = await response.json();
        const urlParams = new URLSearchParams(window.location.search);  
        currentCategory = urlParams.get('cat') || "HAIWAN";  
        if (urlParams.get('debug') === 'true') toggleDebug(); 
        if (currentCategory.toUpperCase() === 'CUSTOM') {
            const rawData = localStorage.getItem('customWords');  
            if (rawData) wordBank["CUSTOM"] = rawData.split(',').map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
        }  
        startNewRound(currentCategory);  
    } catch (error) { 
        console.error(error);
        document.getElementById('loading-screen')?.classList.add('hidden');
    }
}

window.onload = loadGameData;

function toggleDebug() {
    isDebugActive = !isDebugActive;
    if (isDebugActive) document.body.classList.add('debug-on');
    else document.body.classList.remove('debug-on');
    renderUI(); 
}

function startNewRound(cat) {
    currentCategory = cat;
    wordsFound = []; wordPositions = {}; firstCell = null; hintCountUsed = 0; activeHints = [];
    currentWords = []; debugData = { attempts: 0, crossCount: 0 };
    generateGrid(cat);  
    renderUI();  
    updateStats();   
    startTimer();  
    document.getElementById('loading-screen')?.classList.add('hidden');
    document.getElementById('game-screen')?.classList.remove('hidden');
    const cd = document.getElementById('current-cat-display');
    if(cd) cd.innerText = cat.toUpperCase();
}

function generateGrid(cat) {
    const hasil = PilihWord.janaGridEksperimen(wordBank, cat);
    grid = hasil.grid;
    wordPositions = hasil.wordPositions; 
    currentWords = Object.keys(wordPositions);
    debugData = hasil.stats;
    fillEmpty();
}

function fillEmpty() {
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === '') grid[r][c] = abc[Math.floor(Math.random()*26)];
        }
    }
}

// ==========================================
// BAHAGIAN YANG DIKEMASKINI (LOGIK CRS & WAVE)
// ==========================================
function renderUI() {
    const container = document.getElementById('grid-container');
    if(!container) return;
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const cellUsage = {};
    for (let w in wordPositions) {
        if (wordPositions[w]) {
            wordPositions[w].forEach(p => {
                const key = `${p.r}-${p.c}`;
                cellUsage[key] = (cellUsage[key] || 0) + 1;
            });
        }
    }

    grid.forEach((row, r) => {  
        row.forEach((char, c) => {  
            const el = document.createElement('div'); 
            el.className = 'cell'; el.innerText = char; el.id = `cell-${r}-${c}`;  
            
            const key = `${r}-${c}`;
            const usageCount = cellUsage[key] || 0;

            if (usageCount > 0) {
                el.setAttribute('data-word', 'true');
                if (isDebugActive && usageCount > 1) {
                    el.classList.add('crs-highlight');
                }
            }

            // KEMASKINI: Letak delay 0 untuk perkataan yang sedia ada dijumpai
            for (let w of wordsFound) {
                if (wordPositions[w] && wordPositions[w].some(p => p.r === r && p.c === c)) {
                    el.classList.add('found');
                    el.style.setProperty('--d', 0); 
                }
            }
            if (activeHints.some(h => h.r === r && h.c === c)) el.classList.add('hint-highlight');
            if (firstCell && firstCell.r === r && firstCell.c === c) el.classList.add('selected');
            el.onmousedown = () => handleTap(el, r, c);  
            el.ontouchstart = (e) => { e.preventDefault(); handleTap(el, r, c); };   
            container.appendChild(el);  
        });  
    });  

    if (typeof updateDebugInfo === 'function') {
        updateDebugInfo({
            words: currentWords,
            crossCount: debugData.crossCount,
            attempts: debugData.attempts
        });
    }

    const list = document.getElementById('word-list');  
    if(list) {
        list.innerHTML = '';  
        currentWords.forEach(w => {  
            const li = document.createElement('li'); li.id = "list-"+w; li.innerText = w; 
            if(wordsFound.includes(w)) li.className = 'strike';
            list.appendChild(li);  
        });
    }
}

function handleTap(el, r, c) {
    if (typeof SoundFX !== 'undefined') SoundFX.tap();
    if (!firstCell) { firstCell = { el, r, c }; el.classList.add('selected'); } 
    else {
        const dr = r - firstCell.r, dc = c - firstCell.c, dist = Math.max(Math.abs(dr), Math.abs(dc));
        let stepR = Math.sign(dr), stepC = Math.sign(dc);
        if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) { 
            if (typeof SoundFX !== 'undefined') SoundFX.wrong(); 
            resetSelection(); return; 
        }
        let path = [];  
        for (let i = 0; i <= dist; i++) {  
            let curR = firstCell.r + (i*stepR), curC = firstCell.c + (i*stepC);  
            const cell = document.getElementById(`cell-${curR}-${curC}`);  
            if(cell) path.push({ el: cell, char: cell.innerText });  
        }  
        checkWord(path); resetSelection();  
    }
}

function resetSelection() { if (firstCell) firstCell.el.classList.remove('selected'); firstCell = null; }

function checkWord(path) {
    const word = path.map(p => p.char).join(''), rev = word.split('').reverse().join('');
    let target = currentWords.includes(word) ? word : (currentWords.includes(rev) ? rev : "");
    
    if (target && !wordsFound.includes(target)) {  
        wordsFound.push(target);  
        
        // KEMASKINI: Kesan Wave untuk Tap (Urutan path)
        path.forEach((p, index) => {
            if (p.el) {
                p.el.style.setProperty('--d', index); 
                p.el.classList.add('found');
            }
        });

        const now = Date.now();
        if (now - lastFoundTime < 5000) comboLevel++; else comboLevel = 0;
        lastFoundTime = now;
        
        if (typeof SoundFX !== 'undefined') {
            if (comboLevel > 0) SoundFX.playCombo(comboLevel); else SoundFX.success();
        }

        // Kemaskini Word List tanpa renderUI penuh (elak lag/reset animasi)
        const listItem = document.getElementById("list-" + target);
        if(listItem) listItem.className = 'strike';

        score += 1; updateStats();  
        
        if (wordsFound.length === currentWords.length) { 
            score += 10; stopTimer(); 
            if (typeof SoundFX !== 'undefined') SoundFX.win(); 
            setTimeout(showWinModal, 1200); 
        }  
    } else { 
        if (typeof SoundFX !== 'undefined') SoundFX.wrong(); 
    }
}

function updateStats() {
    const sd = document.getElementById('score-display');
    const hcl = document.getElementById('hint-cost-label');
    if (sd) sd.innerText = score;
    if (hcl) {
        let cost = hintCountUsed * 2;
        hcl.innerText = (cost === 0) ? "FREE" : cost;
    }
}

function startTimer() {
    masaMula = Date.now(); 
    if (intervalTimer) clearInterval(intervalTimer);
    intervalTimer = setInterval(() => { 
        const tl = document.getElementById('timer-label');
        if (tl) tl.innerText = dapatkanMasaFinal(); 
    }, 1000);
}

function stopTimer() { clearInterval(intervalTimer); }

function dapatkanMasaFinal() {
    let beza = Math.floor((Date.now() - masaMula) / 1000);
    return `${Math.floor(beza/60).toString().padStart(2,'0')}:${(beza%60).toString().padStart(2,'0')}`;
}

function showToast() {
    const toast = document.getElementById('toast-msg');
    if (toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2000); }
}

function useHint() {
    let cost = hintCountUsed * 2; 
    if (score < cost) { showToast(); return; }
    let avail = [];
    currentWords.forEach(w => {
        if (!wordsFound.includes(w)) {
            wordPositions[w].forEach(p => {
                if (!activeHints.some(h => h.r === p.r && h.c === p.c)) avail.push(p);
            });
        }
    });
    if (avail.length > 0) {
        const pick = avail[Math.floor(Math.random() * avail.length)];
        score -= cost; hintCountUsed++; activeHints.push(pick); updateStats(); renderUI();
    }
}

function skipLevel() { 
    wordsFound = [...currentWords]; 
    renderUI(); stopTimer(); 
    if (typeof SoundFX !== 'undefined') SoundFX.win();
    setTimeout(showWinModal, 500); 
}

function tunjukSimpanSkor() {
    const ni = document.getElementById('player-name-input');
    const btn = document.querySelector('.btn-menu[onclick="tunjukSimpanSkor()"]');
    if (ni && (ni.style.display === 'none' || ni.style.display === '')) {
        ni.style.display = 'block'; ni.focus();
        if(btn) btn.innerText = "HANTAR SKOR";
    } else {
        const val = ni ? ni.value.trim() : "";
        if (val) {
            if(btn) btn.innerText = "MENYIMPAN...";
            hantarSkorKeSheet(val);
        }
    }
}

async function hantarSkorKeSheet(namaUser) {
    const payload = new URLSearchParams();
    payload.append('nama', namaUser); 
    payload.append('skor', score);
    payload.append('masa', dapatkanMasaFinal()); 
    payload.append('kategori', currentCategory);

    try {
        fetch(SCRIPT_URL, { 
            method: 'POST', 
            mode: 'no-cors', 
            body: payload.toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        
        setTimeout(() => {
            window.location.href = `high.html?action=home&cat=${currentCategory}`;
        }, 1000);
    } catch (e) { 
        window.location.href = `high.html?action=home&cat=${currentCategory}`; 
    }
}

function showWinModal() {
    const msd = document.getElementById('modal-stats-display');
    if (msd) msd.innerHTML = `🏆 SKOR: ${score} | ⏱️ ${dapatkanMasaFinal()}`;
    const btnN = document.querySelector('.btn-next');
    if (btnN) btnN.innerText = `TERUSKAN KE GRID #${currentGridNum + 1}`;
    document.getElementById('custom-modal')?.classList.add('active');   
}

function teruskanGrid() { 
    document.getElementById('custom-modal')?.classList.remove('active'); 
    currentGridNum++; startNewRound(currentCategory); 
}

function goToMenu() { if (confirm("Keluar?")) window.location.href = 'index.html'; }
