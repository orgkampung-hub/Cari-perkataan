/**
 * j_highscore.js - Versi v4.2.2 (Center Alignment: Nama & Level)
 */

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
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyLri7drzKjrP23M7Uwy35GLTd4pFE15_HKCUtCiEDxMrll2uYI7U4E2vU-vd5vgqbT/exec';

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

        // --- LOGIK SORTING ---
        data.sort((a, b) => {
            const skorA = parseInt(a.skor) || 0;
            const skorB = parseInt(b.skor) || 0;
            if (skorB !== skorA) return skorB - skorA;
            return timeToSeconds(a.masa) - timeToSeconds(b.masa);
        });

        const top10 = data.slice(0, 10);

        top10.forEach((entry, index) => {
            const rank = index + 1;
            let rankClass = '';
            let medalHtml = `<span class="rank">${rank}</span>`;

            // Penentuan Warna Level
            const levelName = (entry.level || 'medium').toUpperCase();
            let levelColor = '#00acc1'; 
            if (levelName === 'EASY') levelColor = '#4caf50';
            if (levelName === 'HARD') levelColor = '#ff5252';

            if (rank === 1) { rankClass = 'gold-rank'; medalHtml = '<i class="fas fa-crown medal gold"></i>'; }
            else if (rank === 2) { rankClass = 'silver-rank'; medalHtml = '<i class="fas fa-medal medal silver"></i>'; }
            else if (rank === 3) { rankClass = 'bronze-rank'; medalHtml = '<i class="fas fa-award medal bronze"></i>'; }

            const scoreCard = `
                <div class="score-card ${rankClass}" style="display: flex; align-items: center; padding: 10px; margin-bottom: 12px; border-radius: 15px; background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    
                    <div class="col-rank" style="width: 50px; text-align: center;">${medalHtml}</div>
                    
                    <div class="col-info" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                        <span class="player-name" style="font-weight: bold; font-size: 1rem; color: #333; display: block;">
                            ${entry.nama || 'Anonymous'}
                        </span>
                        <div class="level-badge" style="font-size: 0.55rem; background: ${levelColor}; color: white; padding: 2px 10px; border-radius: 8px; font-weight: bold; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${levelName}
                        </div>
                    </div>
                    
                    <div class="col-stats" style="display: flex; gap: 10px; text-align: right;">
                        <div class="stat-box">
                            <span class="stat-label" style="display: block; font-size: 0.6rem; color: #888;">SKOR</span>
                            <span class="stat-value" style="font-weight: bold; color: #333;">${entry.skor || 0}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label" style="display: block; font-size: 0.6rem; color: #888;">MASA</span>
                            <span class="stat-value" style="font-weight: bold; color: #333;">${entry.masa || '00:00'}</span>
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

function timeToSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) return 999999;
    const parts = timeStr.split(':');
    return (parseInt(parts[0]) * 60) + parseInt(parts[1]);
}
