// script.js

// Fungsi untuk hantar kategori ke page game.html
function pickCategoryCross(category) {
    // Kita terus hantar ke game.html dengan parameter kategori di URL
    window.location.href = `game.html?cat=${category}`;
}

// Fungsi untuk mod custom
function startCustomGameCross() {
    const input = document.getElementById('custom-words-input').value;
    let words = input.split(/[,]+/).map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
    
    if (words.length < 2) { 
        alert("Masukkan sekurang-kurangnya 2 perkataan!"); 
        return; 
    }
    
    // Grid size tetap 12 ikut setting asal
    const gridSize = 12; 
    const tooLong = words.find(w => w.length > gridSize);
    
    if (tooLong) { 
        alert(`Perkataan "${tooLong}" terlalu panjang (Maksimum 12 huruf)!`); 
        return; 
    }

    // Simpan senarai kata dalam localStorage supaya game.js boleh baca nanti
    localStorage.setItem('customWords', JSON.stringify(words.slice(0, 15)));
    window.location.href = `game.html?cat=CUSTOM`;
}
