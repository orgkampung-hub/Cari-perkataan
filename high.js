/**
 * high.js - v2.1.0
 * RETAINED: Your Sorting Logic (Score High + Time Fast).
 * UPDATED: Top 10 Display & Smart Navigation (Next Game / Menu).
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyWEF1_2o7TXhuREdwl4dxr9WMqSNfoEWCdQa2FRvlrkMA-fVAMpghhMuf1wnXuSit4/exec";

// --- LOGIK AMBIL PARAMETER URL ---
const urlParams = new URLSearchParams(window.location.search);
const action = urlParams.get('action'); // 'next' atau 'home'
const cat = urlParams.get('cat') || 'HAIWAN';

window.onload = () => {
    muatTurunRanking();
    urusButangNavigasi();
};

// --- FUNGSI NAVIGASI PINTAR ---
function urusButangNavigasi() {
    const btn = document.getElementById('btn-balik-dinamik');
    if (!btn) return;

    if (action === 'next') {
        btn.innerText = "GRID SETERUSNYA ➡️";
        btn.style.background = "#00e676"; // Hijau terang
        btn.style.color = "#000";
        btn.onclick = () => { window.location.href = `game.html?cat=${cat}`; };
    } else if (action === 'home') {
        btn.innerText = "KEMBALI KE MENU 🏠";
        btn.onclick = () => { window.location.href = 'index.html'; };
    } else {
        // Jika user masuk secara manual dari index.html
        btn.innerText = "MAIN SEKARANG 🎮";
        btn.onclick = () => { window.location.href = 'index.html'; };
    }
}

async function muatTurunRanking() {
    const tableBody = document.getElementById('ranking-body');
    const loader = document.getElementById('loading-ranks');
    
    if (loader) loader.style.display = 'block';
    if (tableBody) tableBody.innerHTML = '';

    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        
        if (loader) loader.style.display = 'none';

        if (!data || data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="padding:20px; color:#aaa;">Belum ada rekod. Jadi yang pertama!</td></tr>`;
            return;
        }

        // --- LOGIK SORTING KAU (Kekal) ---
        data.sort((a, b) => {
            if (parseInt(b.skor) !== parseInt(a.skor)) {
                return parseInt(b.skor) - parseInt(a.skor);
            }
            return String(a.masa).localeCompare(String(b.masa));
        });

        // --- PAPAR TOP 10 SAHAJA (Updated dari 20 ke 10) ---
        data.slice(0, 10).forEach((row, index) => {
            const tr = document.createElement('tr');
            let rank = index + 1;
            if (rank === 1) rank = '🥇';
            else if (rank === 2) rank = '🥈';
            else if (rank === 3) rank = '🥉';

            tr.innerHTML = `
                <td>${rank}</td>
                <td style="text-align: left; padding-left: 15px; font-weight:bold;">${row.nama}</td>
                <td style="color: #00f2ff;">${row.masa}</td>
                <td style="color: #ffeb3b;">${row.skor}</td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Gagal muat turun:", error);
        if (loader) loader.innerHTML = `<p style="color:red;">Talian sibuk. Sila refresh.</p>`;
    }
}
