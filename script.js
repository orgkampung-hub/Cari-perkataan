// script.js - Pengurus Menu Utama & Sistem Profil (v4.2.1)

// --- SISTEM PROFIL (LOGIN/LOGOUT) ---
function renderUserPanel() {
    const panel = document.getElementById('user-panel');
    if (!panel) return;

    const username = localStorage.getItem('username');

    if (username) {
        panel.innerHTML = `
            <div class="user-panel-container">
                <div class="user-label">Pemain Aktif</div>
                <div class="user-name">${username.toUpperCase()}</div>
                <button onclick="logout()" class="btn-logout">
                    <i class="fas fa-sign-out-alt"></i> LOGOUT / TUKAR NAMA
                </button>
            </div>
        `;
    } else {
        // Class .btn-login-utama sekarang akan ditangkap oleh CSS baru kita
        panel.innerHTML = `
            <button onclick="login()" class="btn-login-utama">
                <i class="fas fa-key"></i> LOGIN PEMAIN
            </button>
        `;
    }
}

function login() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        const warning = document.getElementById('login-warning');
        if(warning) warning.style.display = 'none';
        
        // Pastikan modal muncul dengan flex supaya center
        modal.style.display = 'flex';
        
        // Fokuskan pada input nama secara automatik
        setTimeout(() => {
            const input = document.getElementById('loginInput');
            if(input) {
                input.focus();
                input.value = "";
            }
        }, 100);
    }
}

function closeLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
}

function saveLogin() {
    const nameInput = document.getElementById('loginInput');
    let name = nameInput.value.replace(/[^a-zA-Z0-9 ]/g, "").trim();
    const warning = document.getElementById('login-warning');

    if (!name || name.length < 2) {
        if(warning) {
            warning.innerText = "Nama kena ada sekurang-kurangnya 2 huruf!";
            warning.style.display = 'block';
            shakeElement(nameInput);
        }
        return;
    }

    if (name.length > 12) {
        if(warning) {
            warning.innerText = "Nama terlalu panjang (Maks 12 huruf)!";
            warning.style.display = 'block';
            shakeElement(nameInput);
        }
        return;
    }

    localStorage.setItem('username', name);
    closeLogin();
    renderUserPanel();
}

function shakeElement(el) {
    el.style.borderColor = "#ff5252";
    el.animate([
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' }
    ], { duration: 300 });
}

function logout() {
    localStorage.removeItem('username');
    renderUserPanel();
}

function showWarning(mesej) {
    login();
    const warning = document.getElementById('login-warning');
    if(warning) {
        warning.innerText = mesej;
        warning.style.display = 'block';
    }
}

// --- FUNGSI AMBIL LEVEL YANG DIPILIH ---
function getSelectedLevel() {
    const levels = document.getElementsByName('level');
    for (let l of levels) {
        if (l.checked) return l.value;
    }
    return 'MEDIUM'; 
}

// --- LOGIK PEMILIHAN KATEGORI ---
function pickCategoryCross(kategori) {
    if (!localStorage.getItem('username')) {
        showWarning("Sila set nama dulu sebelum main!");
        return;
    }
    localStorage.setItem('selectedLevel', getSelectedLevel());
    localStorage.setItem('selectedCategory', kategori.toUpperCase());
    window.location.href = 'game.html';
}

function pickRandomCross() {
    if (!localStorage.getItem('username')) {
        showWarning("Sila set nama dulu sebelum main!");
        return;
    }
    localStorage.setItem('selectedLevel', getSelectedLevel());
    localStorage.setItem('selectedCategory', 'RAWAK');
    window.location.href = 'game.html';
}

function startCustomGameCross() {
    if (!localStorage.getItem('username')) {
        showWarning("Sila set nama dulu sebelum main!");
        return;
    }

    const input = document.getElementById('customInput').value;
    const customInputEl = document.getElementById('customInput');

    if (!input.trim()) {
        customInputEl.style.borderColor = "#ff5252";
        shakeElement(customInputEl);
        return;
    }

    const words = input.split(',').map(w => w.trim().toUpperCase()).filter(w => w !== "");
    
    if (words.length < 3) {
        showWarning("Masukkan sekurang-kurangnya 3 perkataan!");
        return;
    }

    localStorage.setItem('selectedLevel', getSelectedLevel());
    localStorage.setItem('selectedCategory', 'CUSTOM');
    localStorage.setItem('customWords', JSON.stringify(words));
    window.location.href = 'game.html';
}

function goToHighscore() {
    window.location.href = "highscore.html";
}

// Jalankan fungsi render bila page dah load
document.addEventListener('DOMContentLoaded', renderUserPanel);
