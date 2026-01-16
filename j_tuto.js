// j_tuto.js - Tutorial Versi 2-Tap + Bonus Info (v2.4)

const Tutorial = {
    check() {
        if (!localStorage.getItem('seenTutorial')) {
            setTimeout(() => this.show(), 500);
            return true; 
        }
        return false;
    },

    show() {
        const modal = document.getElementById('game-modal');
        if (!modal) return;

        modal.innerHTML = `
            <div class="modal-content">
                <h2 style="color: #00acc1; margin-top: 0;">CARA MAIN</h2>
                
                <div style="text-align: left; margin: 20px 0;">
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                        <i class="fas fa-fingerprint" style="color:#ff9800; font-size: 1.4rem; width: 30px; margin-right: 15px;"></i>
                        <span><b>TAP HURUF MULA</b> untuk mula pilih.</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                        <i class="fas fa-mouse-pointer" style="color:#4caf50; font-size: 1.4rem; width: 30px; margin-right: 15px;"></i>
                        <span><b>TAP HURUF AKHIR</b> untuk tamatkan.</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 12px; padding: 10px; background: #fff8e1; border-radius: 12px; border: 1px dashed #ffb74d;">
                        <i class="fas fa-bolt" style="color:#f57f17; font-size: 1.4rem; width: 30px; margin-right: 15px;"></i>
                        <span style="font-size: 0.85rem;"><b>BONUS COMBO:</b> Cari dengan pantas untuk gandaan skor!</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <i class="fas fa-trophy" style="color:#00acc1; font-size: 1.4rem; width: 30px; margin-right: 15px;"></i>
                        <span>Cari semua untuk menang!</span>
                    </div>
                </div>

                <button onclick="Tutorial.close()" class="btn-modal-action" style="width: 100%; background: #4caf50; color: white; border: none; padding: 15px; box-shadow: 0 5px 0 #2e7d32;">
                    DAH FAHAM!
                </button>
            </div>
        `;

        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);
    },

    close() {
        const modal = document.getElementById('game-modal');
        if (modal) {
            modal.classList.remove('modal-show');
            setTimeout(() => {
                modal.style.display = 'none';
                modal.innerHTML = '';
                if (!localStorage.getItem('seenTutorial')) {
                    localStorage.setItem('seenTutorial', 'true');
                    if (typeof Timer !== 'undefined') Timer.start();
                }
            }, 300);
        }
    }
};
