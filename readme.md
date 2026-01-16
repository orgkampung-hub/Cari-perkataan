# 🧩 Word Search Engine v4.2.0

Enjin permainan cari kata yang dioptimumkan untuk kelancaran visual, sistem combo dinamik, dan integrasi Google Sheets.

## 🚀 Ciri-ciri Utama
- **Sistem Skor Mutlak**: 1 Jawapan = 1 Mata (Standard).
- **Visual Combo v4.2**: Animasi "Zoom Pop" gergasi di tengah skrin untuk gameplay yang lebih menyeronokkan.
- **Auto-Submit**: Skor dihantar secara automatik ke database awan (Google Sheets).
- **Fix Victory Stuck**: Menghapuskan ralat 'is not a function' yang menghalang Modal Menang muncul.

## 📁 Struktur Fail & Pemasangan
Pastikan turutan panggilan fail dalam index.html adalah seperti berikut untuk mengelakkan ralat 'undefined':

1. c_bonus.css
2. j_bonus.js
3. j_score.js
4. j_modal.js
5. j_game.js

## 🛠️ Ringkasan Logik Versi 4.2.0
| Fail | Peranan | Status |
| :--- | :--- | :--- |
| j_score.js | Mengira mata (1:1) & menguruskan data combo. | ✅ STABLE |
| j_bonus.js | Mengawal animasi popup "COMBO xN" di skrin. | ✅ STABLE |
| j_modal.js | Paparan kemenangan & fungsi hantar skor ke Google. | ✅ STABLE |
| j_game.js | Controller utama yang menghubungkan semua sistem. | ✅ STABLE |

## ⚠️ Nota Penting
- **Z-Index**: Modal Menang ditetapkan pada 2,000,000 untuk menutup semua elemen lain.
- **Combo Window**: Masa 20 saat diberikan antara setiap perkataan untuk mengekalkan rentak combo.
- **Reset**: Skor dan combo akan di-reset secara automatik setiap kali "Main Lagi" ditekan.

---
**Versi:** 4.2.0 (Final Architecture)
**Update:** 2026-01-16
