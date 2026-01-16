/**
 * j_debug.js - Versi Visual Compact & Professional
 * - Trigger: Ketuk 5 kali pada area SKOR di player-bar
 */

const Debugger = {
    isEnabled: false,
    tapCount: 0,

    init() {
        const checkReady = setInterval(() => {
            const scoreArea = document.getElementById('score');
            if (scoreArea) {
                scoreArea.parentElement.addEventListener('click', () => this.handleTap());
                this.injectUI();
                this.injectStyles();
                clearInterval(checkReady);
                console.log("Debugger: Ready. Tap 5x on Score to activate.");
            }
        }, 500);
    },

    injectStyles() {
        if (document.getElementById('debug-styles')) return;
        const style = document.createElement('style');
        style.id = 'debug-styles';
        style.innerHTML = `
            #debug-main-ui {
                position: fixed; top: 130px; left: 50%; transform: translateX(-50%);
                z-index: 10000; width: auto; pointer-events: none;
            }
            .debug-container {
                background: rgba(20, 20, 20, 0.95);
                border: 1px solid #444; border-radius: 12px;
                padding: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                pointer-events: auto; display: flex; flex-direction: column; gap: 6px;
                min-width: 180px;
            }
            .debug-stats {
                font-family: 'monospace'; color: #0f0; font-size: 10px;
                text-align: center; border-bottom: 1px solid #333; padding-bottom: 4px;
            }
            .debug-row { display: flex; gap: 4px; }
            .btn-db {
                flex: 1; padding: 10px 4px; border: none; border-radius: 6px;
                font-size: 10px; font-weight: bold; cursor: pointer; color: white;
                text-transform: uppercase; transition: opacity 0.2s;
            }
            .btn-db:active { opacity: 0.7; }
            .btn-show { background: #444; }
            .btn-crs { background: #444; }
            .btn-win { background: #1b5e20; border: 1px solid #2e7d32; }
            
            .debug-highlight-ans { background: rgba(0, 255, 0, 0.3) !important; outline: 2px solid #0f0 !important; z-index: 5; }
            .debug-highlight-crs { background: rgba(255, 0, 0, 0.4) !important; outline: 1px solid #f00 !important; }
        `;
        document.head.appendChild(style);
    },

    injectUI() {
        if (document.getElementById('debug-main-ui')) return;
        const div = document.createElement('div');
        div.id = 'debug-main-ui';
        div.style.display = 'none';
        div.innerHTML = `
            <div class="debug-container">
                <div class="debug-stats">
                    WDS:<span id="db-wds">0</span> | CRS:<span id="db-crs">0</span> | TRY:<span id="db-try">0</span>
                </div>
                <div class="debug-row">
                    <button class="btn-db btn-show" onclick="Debugger.toggleShow()">Show</button>
                    <button class="btn-db btn-crs" onclick="Debugger.toggleCRS()">Crs</button>
                    <button class="btn-db btn-win" onclick="Debugger.forceWin()">Win</button>
                </div>
            </div>
        `;
        document.body.appendChild(div);
    },

    handleTap() {
        this.tapCount++;
        if (this.tapCount >= 5) {
            this.isEnabled = !this.isEnabled;
            document.getElementById('debug-main-ui').style.display = this.isEnabled ? 'block' : 'none';
            if (this.isEnabled) this.refreshData();
            else this.clearEffects();
            this.tapCount = 0;
        }
    },

    refreshData() {
        if (typeof Generator !== 'undefined') {
            document.getElementById('db-wds').innerText = Generator.wordsActuallyPlaced ? Generator.wordsActuallyPlaced.length : 0;
            document.getElementById('db-crs').innerText = Generator.stats ? Generator.stats.crs : 0;
            document.getElementById('db-try').innerText = Generator.stats ? Generator.stats.try : 0;
        }
    },

    toggleShow() {
        document.querySelectorAll('.grid-cell[data-is-answer="true"]').forEach(cell => {
            cell.classList.toggle('debug-highlight-ans');
        });
    },

    toggleCRS() {
        const isShowing = document.querySelectorAll('.debug-highlight-crs').length > 0;
        this.clearEffects();
        if (!isShowing && typeof Generator !== 'undefined') {
            Generator.usageMask.forEach((row, r) => {
                row.forEach((val, c) => {
                    if (val > 1) {
                        const cell = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
                        if (cell) cell.classList.add('debug-highlight-crs');
                    }
                });
            });
        }
    },

    forceWin() {
        if (!this.isEnabled) return;
        
        // 1. Mark visual grid
        document.querySelectorAll('.grid-cell[data-is-answer="true"]').forEach(c => c.classList.add('cell-found'));
        
        // 2. Tandakan semua perkataan dalam list secara visual sahaja (Found)
        document.querySelectorAll('.word-item').forEach(el => el.classList.add('found'));

        if (typeof GameController !== 'undefined') {
            // 3. Paksa jumlah jumpa sama dengan jumlah patut cari
            GameController.foundCount = GameController.totalToFind;

            // 4. Trigger Victory sekali sahaja dengan delay kecil
            // Delay ni penting supaya animation grid sempat jalan sikit
            setTimeout(() => {
                // Pastikan ModalSystem reset submit flag untuk sesi baru ni
                if (typeof ModalSystem !== 'undefined') {
                    ModalSystem.isSubmitting = false;
                }
                GameController.victory();
            }, 300);
        }
    },

    clearEffects() {
        document.querySelectorAll('.grid-cell').forEach(c => {
            c.classList.remove('debug-highlight-ans', 'debug-highlight-crs');
        });
    }
};

Debugger.init();
