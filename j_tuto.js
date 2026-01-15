// j_tuto.js - Tutorial Versi 2-Tap (Boleh Diulang Baca)

const Tutorial = {
    isManualCall: false,

    check() {
        const hasSeen = localStorage.getItem('seenTutorial');
        if (!hasSeen) {
            this.isManualCall = false;
            this.show();
            return true; 
        }
        return false;
    },

    show() {
        // Cek kalau overlay dah ada, jangan buat dua kali
        if (document.getElementById('tuto-overlay')) return;

        // Jika dipanggil guna butang ?, kita set manual true
        if (localStorage.getItem('seenTutorial')) {
            this.isManualCall = true;
        }

        const overlay = document.createElement('div');
        overlay.id = 'tuto-overlay';
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 100001;
            display: flex; justify-content: center; align-items: center;
            font-family: 'Fredoka One', cursive; padding: 20px;
            backdrop-filter: blur(5px);
        `;

        overlay.innerHTML = `
            <div class="modal-content" style="max-width: 300px; border: 5px solid #00acc1; background: white;">
                <h2 style="color: #00acc1; margin-top: 0; font-size: 1.6rem;">CARA MAIN</h2>
                
                <div style="text-align: left; font-size: 1rem; color: #111; margin: 25px 0; line-height: 1.5;">
                    <div style="margin-bottom:15px; display:flex; align-items:flex-start;">
                        <i class="fas fa-fingerprint" style="color:#ff9800; font-size: 1.4rem; margin-right:15px; margin-top:3px;"></i>
                        <span><b>TAP HURUF PERTAMA</b> untuk mula pilih.</span>
                    </div>
                    <div style="margin-bottom:15px; display:flex; align-items:flex-start;">
                        <i class="fas fa-mouse-pointer" style="color:#4caf50; font-size: 1.4rem; margin-right:15px; margin-top:3px;"></i>
                        <span><b>TAP HURUF TERAKHIR</b> untuk tamatkan pilihan.</span>
                    </div>
                    <div style="display:flex; align-items:flex-start;">
                        <i class="fas fa-trophy" style="color:#00acc1; font-size: 1.4rem; margin-right:15px; margin-top:3px;"></i>
                        <span>Cari semua perkataan untuk menang!</span>
                    </div>
                </div>

                <button onclick="Tutorial.close()" class="btn-play-custom" style="width:100%; background:#4caf50; color:white; border:none; padding:15px; border-radius:15px; cursor:pointer; font-family:'Fredoka One'; box-shadow: 0 5px 0 #2e7d32; font-size: 1.1rem;">
                    DAH FAHAM!
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
    },

    close() {
        const overlay = document.getElementById('tuto-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transition = '0.3s';
            setTimeout(() => {
                overlay.remove();
                
                // Kalau ni kali pertama dia tengok (Auto), baru start timer
                if (!localStorage.getItem('seenTutorial')) {
                    localStorage.setItem('seenTutorial', 'true');
                    if (typeof Timer !== 'undefined') Timer.start();
                }
                // Kalau dia tekan butang ?, kita tak payah buat apa-apa (Timer memang tgh jalan)
            }, 300);
        }
    }
};
