const BonusUI = {
    barTimer: null,
    duration: 20000,

    init() {
        if (!document.getElementById('combo-popup')) {
            const popup = document.createElement('div');
            popup.id = 'combo-popup';
            document.body.appendChild(popup);
        }
    },

    showCombo(multiplier) {
        const popup = document.getElementById('combo-popup');
        if (!popup) return;

        // Gaya Bebas: Teks Berasingan
        popup.innerHTML = `
            <div class="combo-text-top">WOW! COMBO</div>
            <div class="combo-text-bottom">x${multiplier}</div>
        `;

        // Reset & Main Animasi
        popup.classList.remove('animate-zoom-pop');
        void popup.offsetWidth; 
        popup.classList.add('animate-zoom-pop');

        this.startBar();
    },

    startBar() {
        const barContainer = document.querySelector('.combo-bar-container');
        const barFill = document.querySelector('.combo-bar-fill');
        if (!barContainer || !barFill) return;

        barContainer.style.display = 'block';
        barFill.style.transition = 'none';
        barFill.style.width = '100%';
        void barFill.offsetWidth;

        barFill.style.transition = `width ${this.duration}ms linear`;
        barFill.style.width = '0%';

        if (this.barTimer) clearTimeout(this.barTimer);
        this.barTimer = setTimeout(() => this.hideBar(), this.duration);
    },

    hideBar() {
        const barContainer = document.querySelector('.combo-bar-container');
        if (barContainer) barContainer.style.display = 'none';
    }
};
document.addEventListener('DOMContentLoaded', () => BonusUI.init());
