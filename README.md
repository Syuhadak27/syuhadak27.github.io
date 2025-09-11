
# 📊 Aplikasi Pencarian & Manajemen Stok Barang

Aplikasi web sederhana untuk pencarian data barang, keluar-masuk barang (**in/out**), serta manajemen stok.  
Dibuat agar tetap bisa digunakan secara **offline** setelah data diambil dari Google Sheets sekali klik.

---

## ✨ Fitur Utama
- 🔍 **Pencarian Barang**  
  - Cari data barang berdasarkan nama atau kata kunci.  
  - Mendukung pencarian dengan lebih dari satu kata kunci.  
  - Klik dua kali pada hasil untuk memasukkan ke kolom pencarian.  
  - Efek suara saat pencarian **tidak menemukan hasil**.

- 📥 **In/Out Barang**  
  - Catat barang masuk (**in**) atau keluar (**out**).  

- 📦 **Manajemen Stok**  
  - Lihat ketersediaan barang secara real-time.  

- 📑 **Daftar Barang**  
  - Menampilkan seluruh data barang dalam bentuk tabel.  

- 🖼️ **Export ke Gambar (JPG)**  
  - Hasil pencarian atau daftar stok bisa diexport menjadi gambar.  

- 🛡️ **Login & Logout**  
  - Akses hanya untuk user yang sudah login (tersimpan di `localStorage`).  

- 🔄 **Reset Data**  
  - Reset semua data dengan konfirmasi pop-up keren menggunakan **SweetAlert2**.  
  - Ada peringatan otomatis jika data sudah lebih dari 24 jam belum di-reset.  

- 📡 **Offline Ready**  
  - Data dari Google Sheets hanya diambil sekali, setelah itu bisa digunakan offline.  

- 🎨 **Tampilan Modern**  
  - Dark mode otomatis sesuai preferensi perangkat.  
  - UI ringan dengan HTML, CSS, dan JavaScript murni.  

---

## 🛠️ Teknologi yang Digunakan
- **Frontend**  
  - HTML5  
  - CSS3 (custom styling + auto dark mode)  
  - JavaScript ES6  

- **Library & Tools**  
  - [SweetAlert2](https://sweetalert2.github.io/) → Pop-up modern untuk notifikasi & konfirmasi  
  - [html2canvas](https://html2canvas.hertzen.com/) → Export tampilan ke gambar  
  - [Font Awesome](https://fontawesome.com/) → Icon TikTok, GitHub & Facebook

- **Storage**  
  - `localStorage` → Simpan cache data agar bisa dipakai offline  
  - Google Sheets (via API / sekali fetch) sebagai database utama  

---

## 🚀 Cara Menjalankan
1.  Buka index.html di browser.

2. Login menggunakan akun yang sudah disiapkan.

3. Mulai gunakan fitur pencarian, in/out barang, dan manajemen stok.

---

👨‍💻 Author

Dibuat dengan ❤️ oleh M. Alfi Syuhadak





---

📜 Lisensi

Proyek ini dibuat untuk kebutuhan pribadi/organisasi.
Silakan digunakan dan dikembangkan lebih lanjut sesuai kebutuhan.

---
