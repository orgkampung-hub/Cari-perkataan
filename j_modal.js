// j_modal.js - Versi Global (Bukan Module)

const ModalSystem = {
    init() {
        console.log("Modal System: Sedia (Global Mode).");
    },

    show(data) {
        const modal = document.getElementById('game-modal');
        if (!modal) return;

        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
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

                <div style="margin: 15px 0;">
                    <input type="text" id="player-name" placeholder="MASUKKAN NAMA" 
                        style="width: 100%; padding: 12px; border: 2px solid #e0f7fa; border-radius: 12px; text-align: center; font-family: 'Fredoka One', cursive; outline: none; box-sizing: border-box;">
                </div>
                
                <button id="btn-hantar-skor" 
                    style="width:100%; padding:15px; background:#ff9800; color:white; border:none; border-radius:15px; cursor:pointer; font-family: 'Fredoka One', cursive; box-shadow: 0 4px #e65100; margin-bottom: 10px; text-transform: uppercase;">
                    Hantar Skor & Lihat Ranking
                </button>

                <div style="display:flex; gap:10px; justify-content:center;">
                    <button class="btn-modal-action" onclick="window.location.reload()" 
                        style="flex:1; padding:12px; background:#4caf50; color:white; border:none; border-radius:15px; cursor:pointer; font-family: 'Fredoka One', cursive; box-shadow: 0 4px #2e7d32; font-size: 0.8rem;">
                        RETRY
                    </button>
                    <button class="btn-modal-action" onclick="window.location.href='index.html'" 
                        style="flex:1; padding:12px; background:#ff5252; color:white; border:none; border-radius:15px; cursor:pointer; font-family: 'Fredoka One', cursive; box-shadow: 0 4px #c62828; font-size: 0.8rem;">
                        MENU
                    </button>
                </div>
            `;

            const btnHantar = document.getElementById('btn-hantar-skor');
            btnHantar.onclick = () => this.submitScore(data.score, data.time);
        }

        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-show');
        modal.style.display = 'flex';
    },

    async submitScore(score, time) {
        const nameInput = document.getElementById('player-name');
        const btn = document.getElementById('btn-hantar-skor');
        const name = nameInput.value.trim();

        if (!name) {
            alert("Isi nama dulu bos!");
            return;
        }

        btn.disabled = true;
        btn.innerText = "SEDANG HANTAR...";

        const scriptURL = 'https://script.google.com/macros/s/AKfycbyWEF1_2o7TXhuREdwl4dxr9WMqSNfoEWCdQa2FRvlrkMA-fVAMpghhMuf1wnXuSit4/exec';

        const formData = new FormData();
        formData.append('nama', name);
        formData.append('masa', time);
        formData.append('skor', score);

        try {
            await fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' });
            window.location.href = 'highscore.html';
        } catch (error) {
            console.error("Gagal hantar:", error);
            alert("Masalah teknikal. Cuba lagi!");
            btn.disabled = false;
            btn.innerText = "CUBA HANTAR LAGI";
        }
    },

    hide() {
        const modal = document.getElementById('game-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('modal-show');
        }
    }
};

ModalSystem.init();
