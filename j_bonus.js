/**
 * j_bonus.js - Versi v4.2.0
 * Menguruskan visual combo dan bar masa di bawah timer
 */
const BonusUI = {
    barTimer: null,
    duration: 20000, // 20 saat

    init() {
        // Bina popup combo jika belum wujud
        if (!document.getElementById('combo-popup')) {
            const popup = document.createElement('div');
            popup.id = 'combo-popup';
            document.body.appendChild(popup);
        }
    },

    /**
     * Paparkan animasi Combo di tengah skrin
     */
    showCombo(multiplier) {
        const popup = document.getElementById('combo-popup');
        if (!popup) return;

        // Gaya Bebas: Teks Berasingan (Zoom Pop)
        popup.innerHTML = `
            <div class="combo-text-top">WOW! COMBO</div>
            <div class="combo-text-bottom">x${multiplier}</div>
        `;

        // Reset & Main Animasi
        popup.classList.remove('animate-zoom-pop');
        void popup.offsetWidth; 
        popup.classList.add('animate-zoom-pop');

        // Jalankan bar masa combo
        this.startBar();
    },

    /**
     * Mengawal bar masa di bawah timer tengah
     */
    startBar() {
        const barContainer = document.querySelector('.combo-bar-container');
        const barFill = document.querySelector('.combo-bar-fill');
        
        if (!barContainer || !barFill) return;

        // Tunjukkan bar dan reset animasi
        barContainer.style.display = 'block';
        barFill.style.transition = 'none';
        barFill.style.width = '100%';
        void barFill.offsetWidth; // Force reflow

        // Jalankan susut masa (20s)
        barFill.style.transition = `width ${this.duration}ms linear`;
        barFill.style.width = '0%';

        // Clear timer lama jika ada
        if (this.barTimer) clearTimeout(this.barTimer);
        
        // Sembunyikan bar bila masa tamat
        this.barTimer = setTimeout(() => this.hideBar(), this.duration);
    },

    hideBar() {
        const barContainer = document.querySelector('.combo-bar-container');
        if (barContainer) {
            barContainer.style.display = 'none';
        }
    },

    /**
     * Reset semua visual untuk game baru
     */
    reset() {
        if (this.barTimer) clearTimeout(this.barTimer);
        this.hideBar();
        const popup = document.getElementById('combo-popup');
        if (popup) popup.classList.remove('animate-zoom-pop');
    }
};

// Auto-init bila file diload
document.addEventListener('DOMContentLoaded', () => BonusUI.init());
