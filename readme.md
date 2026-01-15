# 🧩 Word Search Arena - Web Game

Game mencari perkataan berasaskan web yang dinamik, responsif, dan dilengkapi dengan sistem Leaderboard masa nyata menggunakan Google Sheets API.

## 🚀 Ciri-Ciri Utama
- **Penjanaan Grid Dinamik**: Perkataan dijana secara automatik setiap kali permainan bermula.
- **Sistem Skor Modular**: Pengiraan markah berdasarkan panjang perkataan, bonus kelajuan, dan penalti penggunaan 'hint'.
- **Leaderboard Global**: Skor disimpan dan dipaparkan terus dari Google Sheets.
- **Reka Bentuk Responsif**: Dioptimumkan untuk paparan peranti mudah alih (Mobile-first).
- **Efek Bunyi & Animasi**: Memberi maklum balas visual dan audio (Syabas Modal & Sound Engine).

## 📂 Struktur Fail (Architecture)
Projek ini menggunakan pendekatan **Vanilla JavaScript Modular** (Global Scope) untuk kestabilan dan kemudahan penyelenggaraan.

### 📜 JavaScript
- `j_game.js` : Pengawal utama (Controller) logik permainan dan kemenangan.
- `j_score.js` : Modul kalkulator skor (Centralized Score Tuning).
- `j_timer.js` : Sistem stopwatch (MM:SS) dan pengurus data masa.
- `j_modal.js` : Menguruskan paparan pop-up kemenangan dan penghantaran data ke API.
- `j_generator.js` : Logik penempatan perkataan dalam grid.
- `j_highscore.js` : Mengambil dan menyusun (sorting) data Top 10 dari Google Sheets.

### 🎨 CSS (Styling)
- `c_game.css` : Gaya umum layout permainan.
- `c_grid.css` : Susun atur grid dan sel perkataan.
- `c_modal.css` : Animasi dan gaya kotak kemenangan.
- `c_header.css` : Gaya bahagian atas (Skor & Timer).

## ⚙️ Integrasi Google Sheets (Backend)
Permainan ini menggunakan **Google Apps Script (GAS)** sebagai jambatan antara Game dan Google Sheets.

**Format Data di Google Sheets:**
1. `nama` (Plain Text)
2. `skor` (Number)
3. `masa` (Plain Text - Format `00:00`)

**Logik Ranking:**
Data disusun mengikut **Skor Tertinggi** terlebih dahulu. Sekiranya skor seri, pemain dengan **Masa Terpantas** akan menduduki tangga teratas.

## 🛠️ Cara Penyelenggaraan

### Mengubah Logik Skor
Buka `j_score.js` dan ubah nilai dalam objek `settings`:
```javascript
settings: {
    pointsPerLetter: 10,
    speedBonusLimit: 15,
    hintPenalty: 0.5
}
