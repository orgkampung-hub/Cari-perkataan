/**
 * j_modal.js - Versi Global (Auto-Submit & Synced with Column A-D)
 * Update: Menggunakan URL Script Baru (qbT) & Susunan nama, masa, skor, level.
 */

const ModalSystem = {
    init() {
        console.log("Modal System: Sedia (Auto-Submit Mode).");
    },

    show(data) {
        const modal = document.getElementById('game-modal');
        if (!modal) return;

        // Ambil nama pemain yang tersimpan
        const savedUsername = localStorage.getItem('username') || "PEMAIN_RAWAK";

        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            // Masukkan kandungan secara dinamik
            modalContent.innerHTML = `
                <h2 style="color:#00acc1; margin-top:0; font-family: 'Fredoka One', cursive;">${data.title}</h2>
                <p style="color:#555; margin-bottom:5px;">${data.message}</p>
                
                <div style="background: #f0faff; padding: 12px; border-radius: 15px; margin: 10px 0; display: flex; justify-content: space-around; align-items: center;">
                    <div>
                        <div style="font-size: 0.7rem; color: #888; text-transform: uppercase;">Masa</div>
                        <div style="font-size: 1.2rem; font-weight: bold; color: #333;">${data.time}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.7rem; color: #888; text-transform: uppercase;">Skor</div>
                        <div style="font-size: 1.2rem; font-weight: bold; color: #333;">${data.score}</div>
                    </div>
                </div>

                <div id="status-hantar" style="margin: 10px 0; font-size: 0.8rem; color: #f57f17; font-weight: bold;">
                    <i class="fas fa-spinner fa-spin"></i> MENYIMPAN SKOR KE AWAN...
                </div>
                
                <button onclick="window.location.href='highscore.html'" 
                    style="width:100%; padding:15px; background:#00acc1; color:white; border:none; border-radius:15px; cursor:pointer; font-family: 'Fredoka One', cursive; box-shadow: 0 4px #00838f; margin-bottom: 10px; text-transform: uppercase;">
                    <i class="fas fa-trophy"></i> LIHAT RANKING
                </button>

                <div style="display:flex; gap:10px; justify-content:center;">
                    <button class="btn-modal-action" onclick="ModalSystem.handleRestart()" 
                        style="flex:1; padding:12px; background:#4caf50; color:white; border:none; border-radius:15px; cursor:pointer; font-family: 'Fredoka One', cursive; box-shadow: 0 4px #2e7d32; font-size: 0.8rem;">
                        MAIN LAGI
                    </button>
                    <button class="btn-modal-action" onclick="window.location.href='index.html'" 
                        style="flex:1; padding:12px; background:#ff5252; color:white; border:none; border-radius:15px; cursor:pointer; font-family: 'Fredoka One', cursive; box-shadow: 0 4px #c62828; font-size: 0.8rem;">
                        MENU
                    </button>
                </div>
            `;
            
            // AUTOMATIK HANTAR SKOR KE GOOGLE SHEETS
            this.autoSubmit(savedUsername, data.score, data.time);
        }

        // Paparkan modal dengan animasi
        modal.style.display = 'flex';
        modal.style.zIndex = '2000000'; // Pastikan di atas Combo Popup
        
        setTimeout(() => {
            modal.classList.remove('modal-hidden');
            modal.classList.add('modal-show');
        }, 50);
    },

    handleRestart() {
        if (typeof ScoreSystem !== 'undefined') {
            ScoreSystem.resetScore();
        }
        window.location.reload();
    },

    /**
     * Hantar data ke Google Sheets mengikut susunan:
     * A:nama, B:masa, C:skor, D:level
     */
    async autoSubmit(name, score, time) {
        const statusDiv = document.getElementById('status-hantar');
        
        // URL Web App Google Script yang paling baru kau bagi tadi
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyLri7drzKjrP23M7Uwy35GLTd4pFE15_HKCUtCiEDxMrll2uYI7U4E2vU-vd5vgqbT/exec';

        // Ambil level semasa dari localStorage (auto lowercase)
        const currentLevel = (localStorage.getItem('selectedLevel') || 'medium').toLowerCase();

        const formData = new FormData();
        formData.append('nama', name);   // Masuk Column A
        formData.append('masa', time);   // Masuk Column B
        formData.append('skor', score);  // Masuk Column C
        formData.append('level', currentLevel); // Masuk Column D

        try {
            // Gunakan fetch dengan mode no-cors
            await fetch(scriptURL, { 
                method: 'POST', 
                body: formData, 
                mode: 'no-cors' 
            });
            
            if (statusDiv) {
                statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> SKOR & LEVEL BERJAYA DISIMPAN!`;
                statusDiv.style.color = "#4caf50";
            }
        } catch (error) {
            console.error("Gagal hantar skor:", error);
            if (statusDiv) {
                statusDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> GAGAL SIMPAN KE AWAN`;
                statusDiv.style.color = "#f44336";
            }
        }
    },

    hide() {
        const modal = document.getElementById('game-modal');
        if (modal) {
            modal.classList.remove('modal-show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
};

// Inisialisasi bila file diload
document.addEventListener('DOMContentLoaded', () => ModalSystem.init());
