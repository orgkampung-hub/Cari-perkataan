// j_highscore.js - Versi Sorting Skor > Masa

document.addEventListener('DOMContentLoaded', () => {
    fetchHighscores();

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});

async function fetchHighscores() {
    const listContainer = document.getElementById('highscore-list');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyWEF1_2o7TXhuREdwl4dxr9WMqSNfoEWCdQa2FRvlrkMA-fVAMpghhMuf1wnXuSit4/exec';

    try {
        listContainer.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Menyusun Papan Juara...</p>
            </div>
        `;

        const response = await fetch(scriptURL);
        let data = await response.json();
        
        listContainer.innerHTML = '';

        if (!data || data.length === 0) {
            listContainer.innerHTML = '<p class="loading-state">Rekod kosong.</p>';
            return;
        }

        // --- LOGIK SORTING DUA LAPIS ---
        data.sort((a, b) => {
            const skorA = parseInt(a.skor) || 0;
            const skorB = parseInt(b.skor) || 0;

            // 1. Banding Skor (Paling Tinggi kat atas)
            if (skorB !== skorA) {
                return skorB - skorA;
            }

            // 2. Jika skor sama, banding Masa (Paling Laju/Kecil kat atas)
            return timeToSeconds(a.masa) - timeToSeconds(b.masa);
        });

        // Ambil Top 10 sahaja
        const top10 = data.slice(0, 10);

        top10.forEach((entry, index) => {
            const rank = index + 1;
            let rankClass = '';
            let medalHtml = `<span class="rank">${rank}</span>`;

            if (rank === 1) {
                rankClass = 'gold-rank';
                medalHtml = '<i class="fas fa-crown medal gold"></i>';
            } else if (rank === 2) {
                rankClass = 'silver-rank';
                medalHtml = '<i class="fas fa-medal medal silver"></i>';
            } else if (rank === 3) {
                rankClass = 'bronze-rank';
                medalHtml = '<i class="fas fa-award medal bronze"></i>';
            }

            const scoreCard = `
                <div class="score-card ${rankClass}">
                    <div class="col-rank">${medalHtml}</div>
                    <div class="col-info">
                        <span class="player-name">${entry.nama || 'Anonymous'}</span>
                    </div>
                    <div class="col-stats">
                        <div class="stat-box">
                            <span class="stat-label">SKOR</span>
                            <span class="stat-value">${entry.skor || 0}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label">MASA</span>
                            <span class="stat-value">${entry.masa || '00:00'}</span>
                        </div>
                    </div>
                </div>
            `;
            listContainer.innerHTML += scoreCard;
        });

    } catch (error) {
        console.error("Error:", error);
        listContainer.innerHTML = '<p class="loading-state">Gagal muat data.</p>';
    }
}

// Fungsi convert MM:SS ke saat (Seconds)
function timeToSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) {
        return 999999;
    }
    const parts = timeStr.split(':');
    return (parseInt(parts[0]) * 60) + parseInt(parts[1]);
}
