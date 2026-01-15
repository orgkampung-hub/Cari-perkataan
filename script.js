// script.js - Pengurus Menu Utama & Sistem Profil (Final v4.1.0)

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
                    LOGOUT / TUKAR NAMA
                </button>
            </div>
        `;
    } else {
        panel.innerHTML = `
            <button onclick="login()" class="btn-login-utama">
                🔑 LOGIN PEMAIN
            </button>
        `;
    }
}

function login() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        const warning = document.getElementById('login-warning');
        if(warning) warning.style.display = 'none';
        
        modal.style.display = 'flex';
        document.getElementById('loginInput').focus();
        document.getElementById('loginInput').value = ""; // Clear input bila buka
    }
}

function closeLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
}

function saveLogin() {
    const nameInput = document.getElementById('loginInput');
    // 1. Trim space & Buang simbol pelik (Hanya benarkan Huruf, Nombor & Space)
    let name = nameInput.value.replace(/[^a-zA-Z0-9 ]/g, "").trim();

    const warning = document.getElementById('login-warning');

    // 2. Validasi: Jangan bagi kosong atau kurang 2 huruf
    if (!name || name.length < 2) {
        if(warning) {
            warning.innerText = "Nama kena ada sekurang-kurangnya 2 huruf!";
            warning.style.display = 'block';
            shakeElement(nameInput);
        }
        return;
    }

    // 3. Validasi: Hadkan panjang nama (Maks 12 huruf supaya Leaderboard kemas)
    if (name.length > 12) {
        if(warning) {
            warning.innerText = "Nama terlalu panjang (Maks 12 huruf)!";
            warning.style.display = 'block';
            shakeElement(nameInput);
        }
        return;
    }

    // 4. Jika lulus semua, simpan
    localStorage.setItem('username', name);
    closeLogin();
    renderUserPanel();
}

// Efek visual sikit kalau salah input
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

// --- FUNGSI BARU: NOTIFIKASI CUSTOM (Ganti Alert) ---
function showWarning(mesej) {
    login();
    const warning = document.getElementById('login-warning');
    if(warning) {
        warning.innerText = mesej;
        warning.style.display = 'block';
    }
}

// --- LOGIK PEMILIHAN KATEGORI ---
function pickCategoryCross(kategori) {
    if (!localStorage.getItem('username')) {
        showWarning("Sila set nama dulu sebelum main!");
        return;
    }
    localStorage.setItem('selectedCategory', kategori.toUpperCase());
    window.location.href = 'game.html';
}

function pickRandomCross() {
    if (!localStorage.getItem('username')) {
        showWarning("Sila set nama dulu sebelum main!");
        return;
    }
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

    localStorage.setItem('selectedCategory', 'CUSTOM');
    localStorage.setItem('customWords', JSON.stringify(words));
    window.location.href = 'game.html';
}

function goToHighscore() {
    window.location.href = "highscore.html";
}

document.addEventListener('DOMContentLoaded', renderUserPanel);
