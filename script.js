// script.js - Pengurus Menu Utama

function pickCategoryCross(kategori) {
    // Simpan dalam localStorage (WordManager dalam game.html akan baca ni)
    // Kita tukar jadi HURUF BESAR supaya match dengan JSON
    localStorage.setItem('selectedCategory', kategori.toUpperCase());
    
    // Pergi ke skrin game
    window.location.href = 'game.html';
}

function startCustomGameCross() {
    const input = document.getElementById('customInput').value;
    if (!input.trim()) {
        alert("Sila masukkan perkataan!");
        return;
    }

    // Tukar string jadi array, buang space, dan tukar jadi huruf besar
    const words = input.split(',').map(w => w.trim().toUpperCase()).filter(w => w !== "");
    
    if (words.length < 3) {
        alert("Masukkan sekurang-kurangnya 3 perkataan!");
        return;
    }

    localStorage.setItem('selectedCategory', 'CUSTOM');
    localStorage.setItem('customWords', JSON.stringify(words));
    
    window.location.href = 'game.html';
}

// script.js
function goToHighscore() {
    // Redirect ke page highscore
    window.location.href = "highscore.html"; // pastikan nama file betul
}

