/**
 * script.js - v2.6.1
 * Navigasi Menu Utama & Highscore
 */

// Fungsi untuk hantar kategori ke page game.html
function pickCategoryCross(category) {
    window.location.href = `game.html?cat=${category}`;
}

// Fungsi untuk navigasi ke halaman Highscore
function goToHighscore() {
    window.location.href = 'high.html?action=home';
}

// Fungsi untuk mod custom
function startCustomGameCross() {
    const inputEl = document.getElementById('custom-words-input');
    if (!inputEl) return;
    
    const input = inputEl.value;
    let words = input.split(/[,]+/).map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
    
    if (words.length < 2) { 
        alert("Masukkan sekurang-kurangnya 2 perkataan!"); 
        return; 
    }
    
    const gridSize = 12; 
    const tooLong = words.find(w => w.length > gridSize);
    
    if (tooLong) { 
        alert(`Perkataan "${tooLong}" terlalu panjang (Maksimum 12 huruf)!`); 
        return; 
    }

    // Simpan senarai kata dalam localStorage
    localStorage.setItem('customWords', JSON.stringify(words.slice(0, 15)));
    window.location.href = `game.html?cat=CUSTOM`;
}
