/**
 * j_highscore.js - Versi v4.2.4 (Paparan Avatar DiceBear)
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
            <div class="loading-state" style="text-align:center; padding:20px;">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Menyusun Papan Juara...</p>
            </div>
        `;

        const response = await fetch(scriptURL);
        const data = await response.json(); 
        
        listContainer.innerHTML = '';

        if (!data || data.length === 0) {
            listContainer.innerHTML = '<p class="loading-state" style="text-align:center;">Rekod kosong.</p>';
            return;
        }

        /**
         * Mapping Data:
         * row[0]=Nama, row[1]=Masa, row[2]=Skor, row[3]=Level, row[4]=Avatar
         */
        data.sort((a, b) => {
            const skorA = parseInt(a[2]) || 0;
            const skorB = parseInt(b[2]) || 0;
            if (skorB !== skorA) return skorB - skorA;
            return timeToSeconds(a[1]) - timeToSeconds(b[1]);
        });

        const top10 = data.slice(0, 10);

        top10.forEach((row, index) => {
            const rank = index + 1;
            let rankClass = '';
            let medalHtml = `<span class="rank">${rank}</span>`;

            const nama = row[0] || 'Anonymous';
            const masa = row[1] || '00:00';
            const skor = row[2] || 0;
            const levelName = (row[3] || 'MEDIUM').toUpperCase();
            // Ambil URL avatar dari Column E (row[4])
            const avatarUrl = row[4] || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${nama}`;

            let levelColor = '#00acc1'; 
            if (levelName === 'EASY') levelColor = '#4caf50';
            if (levelName === 'HARD') levelColor = '#ff5252';

            if (rank === 1) { rankClass = 'gold-rank'; medalHtml = '<i class="fas fa-crown" style="color:#FFD700;"></i>'; }
            else if (rank === 2) { rankClass = 'silver-rank'; medalHtml = '<i class="fas fa-medal" style="color:#C0C0C0;"></i>'; }
            else if (rank === 3) { rankClass = 'bronze-rank'; medalHtml = '<i class="fas fa-award" style="color:#CD7F32;"></i>'; }

            const scoreCard = `
                <div class="score-card ${rankClass}" style="display: flex; align-items: center; padding: 10px; margin-bottom: 12px; border-radius: 15px; background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
                    
                    <div class="col-rank" style="width: 35px; text-align: center; font-size: 1.1rem; z-index: 2;">${medalHtml}</div>
                    
                    <div class="col-avatar" style="width: 50px; height: 50px; margin-right: 10px; flex-shrink: 0;">
                        <img src="${avatarUrl}" alt="avatar" style="width: 100%; height: 100%; border-radius: 50%; background: #f0f0f0; border: 2px solid #eee;">
                    </div>
                    
                    <div class="col-info" style="flex: 1; display: flex; flex-direction: column; align-items: flex-start; justify-content: center;">
                        <span class="player-name" style="font-weight: 800; font-size: 0.9rem; color: #333; text-transform: uppercase; font-family: 'Poppins', sans-serif;">
                            ${nama}
                        </span>
                        <div class="level-badge" style="font-size: 0.5rem; background: ${levelColor}; color: white; padding: 1px 8px; border-radius: 5px; font-weight: 800; margin-top: 2px; text-transform: uppercase;">
                            ${levelName}
                        </div>
                    </div>
                    
                    <div class="col-stats" style="display: flex; gap: 8px; text-align: right; min-width: 70px;">
                        <div class="stat-box">
                            <span class="stat-label" style="display: block; font-size: 0.5rem; color: #aaa; text-transform: uppercase; font-weight:600;">Skor</span>
                            <span class="stat-value" style="font-weight: 800; color: #333; font-size: 0.85rem;">${skor}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-label" style="display: block; font-size: 0.5rem; color: #aaa; text-transform: uppercase; font-weight:600;">Masa</span>
                            <span class="stat-value" style="font-weight: 800; color: #333; font-size: 0.85rem;">${masa}</span>
                        </div>
                    </div>

                </div>
            `;
            listContainer.innerHTML += scoreCard;
        });

    } catch (error) {
        console.error("Error:", error);
        listContainer.innerHTML = '<p class="loading-state" style="text-align:center; color:red;">Gagal muat data.</p>';
    }
}

function timeToSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) return 999999;
    const parts = timeStr.split(':');
    return (parseInt(parts[0]) * 60) + parseInt(parts[1]);
}
