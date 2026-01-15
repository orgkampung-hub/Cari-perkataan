# 🧩 Word Search Arena - Web Game (v4.1.0)

Game mencari perkataan berasaskan web yang dinamik, responsif, dan dioptimumkan untuk pengalaman "Premium Mobile Gaming".

## 🚀 Ciri-Ciri Utama (Update v4.1.0)
- **Dynamic Avatar (DiceBear)**: Menjana avatar unik secara automatik berdasarkan nama pemain menggunakan API DiceBear.
- **Player Bar & Profile**: Paparan identiti pemain (Nama & Avatar) secara real-time dlm permainan.
- **Tag Kategori "Gantung"**: UI kategori yang menonjol tanpa mengganggu ruang grid utama.
- **Sistem Tutorial Terintegrasi**: Panduan interaktif 2-langkah untuk pemain baru dengan sistem memori (Local Storage).
- **Modular Scoring & Leaderboard**: Pengiraan markah kompleks dengan integrasi Google Sheets API.

## 📂 Struktur Fail (Architecture)

### 📜 JavaScript (Logik & Data)
- **j_game.js** : **Controller Utama**. Menguruskan aliran permainan, paparan profil pemain, dan integrasi antara modul.
- **j_generator.js** : **Engine Grid**. Logik penempatan perkataan secara rawak/kategori dlm grid.
- **j_interaction.js** : Menguruskan input sentuhan (touch/drag) pemain pada grid.
- **j_score.js** : **Kalkulator Skor**. Menguruskan poin, bonus kelajuan, dan penalti.
- **j_timer.js** : Sistem masa (Stopwatch) dan pemformatan `MM:SS`.
- **j_modal.js** : Menguruskan UI kemenangan dan penghantaran skor ke Leaderboard.
- **j_tuto.js** : Logik sistem tutorial interaktif (Show/Hide/Memory).
- **j_hint.js** : Sistem bantuan (Lightbulb) untuk mendedahkan huruf.
- **j_sound.js** : Pengurus kesan bunyi (SFX) untuk setiap aksi.

### 🎨 CSS (Rupa Paras & Animasi)
- **c_game.css** : **Layout Global**. Menggunakan *Flexbox* untuk memastikan grid sentiasa maksima mengikut saiz skrin.
- **c_header.css** : Gaya bahagian skor, masa, dan butang navigasi atas.
- **c_grid.css** : Rekabentuk sel grid dan kesan visual semasa pemilihan huruf.
- **c_modal.css** : Animasi `popIn` untuk kotak kemenangan dan profil.
- **c_hint.css** : Kesan visual khas untuk huruf yang dibantu oleh sistem hint.

## ⚙️ Integrasi Backend (Google Sheets)
Sistem ini menggunakan **Google Apps Script (GAS)** sebagai pengurus pangkalan data tanpa pelayan (Serverless).

- **Endpoint**: Google Apps Script Web App URL.
- **Metod**: `POST` (Simpan Skor) & `GET` (Ambil Top 10).
- **Ranking Priority**: 
  1. Skor Tertinggi (Primary)
  2. Masa Terpantas (Secondary - jika skor seri)

## 🛠️ Nota Penyelenggaraan (Developer Tips)

### Update Versi & Branding
Untuk menukar label versi atau nama pembangun, cari bahagian `<footer>` dalam `index.html`.

### Menambah Kategori Baru
1. Tambah data perkataan dalam `j_generator.js`.
2. Tambah butang kategori dlm `index.html` dengan fungsi `pickCategoryCross('nama_kategori')`.

### Melaras Kesukaran
Buka `j_score.js` untuk melaras `pointsPerLetter` atau `j_hint.js` untuk mengehadkan jumlah bantuan.

---
**Status Projek:** `STABLE RELEASE (v4.1.0)`  
**Developer:** `AKULAS`
