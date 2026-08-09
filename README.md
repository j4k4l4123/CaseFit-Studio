# 📱 CaseFit Studio - Simulator Visualisasi Casing HP & Custom Gambar

**CaseFit Studio** adalah aplikasi web interaktif yang berfungsi sebagai simulator visualisasi kustomisasi casing smartphone. Website ini dirancang untuk membantu pengguna menguji apakah suatu **gambar, foto, motif, atau warna casing tertentu cocok** saat dipadukan dengan smartphone impian mereka sebelum memutuskan untuk membeli atau mencetaknya.

Edisi ini dirancang secara khusus dengan akurasi presisi tinggi untuk **POCO X7 Hijau Mint** (berdasarkan acuan desain resmi), serta mendukung berbagai smartphone populer lainnya.

---

## 🎯 Tujuan Utama Website

1. **Prabayar & Simulasi Visual**: Menghilangkan keraguan pengguna saat membeli casing custom secara online dengan memberikan gambaran visual *real-time* yang mendekati fisik aslinya.
2. **Uji Kecocokan Warna & Style**: Menilai keharmonisan warna antara body asli HP (seperti warna *Sage Mint Green* pada POCO X7) dengan desain casing yang diinput.
3. **Kustomisasi Fleksibel**: Memberikan kebebasan mengatur tata letak gambar, menambah teks/nama, memilih material casing, hingga mendownload mockup siap cetak.

---

## ✨ Fitur-Fitur Unggulan

### 1. 📲 2 Pilihan Kontrol Utama (Mandatory Control Panel)
* **Section 1: Pilih Smartphone**:
  * **POCO X7 - Hijau Mint (Akurat)**: Render presisi dengan modul kamera *Squaricle 4-Lens*, lis metallic mint, serta logo vertikal debossed khas POCO X7.
  * **Model HP Lainnya**: POCO X7 Hitam Obsidian, POCO F6 Kuning Racing, iPhone 16 Pro Max Natural Titanium, Samsung Galaxy S25 Ultra, dan Xiaomi 14 Jade Green.
  * **Ubah Warna Body Underneath**: Opsi mengubah warna dasar body HP di bawah casing transparan.

* **Section 2: Input Gambar & Casing HP**:
  * **Upload Gambar Custom**: Fitur *Drag & Drop* untuk mengunggah gambar/foto milik sendiri (PNG, JPG, WEBP).
  * **Interactive Canvas Control**: Geser (*drag*) posisi gambar langsung di atas layar canvas, atur ukuran (*zoom*), rotasi, transparansi (*opacity*), dan mode *blend* (Normal, Multiply, Overlay, Screen).
  * **Galeri Preset Motif**: Opsi cepat memilih motif eksklusif seperti *Cyberpunk Neon*, *Great Wave Art*, *Carbon Fiber 3D*, *Gold Marble*, dan *Aura Mesh*.
  * **Warna Polos & Color Picker**: Pilihan palet warna solid serta Hex Color Picker jika pengguna ingin menguji casing warna polos.

### 2. 🛡️ Simulasi Material & Finish Casing
* **Clear TPU (Transparan)**: Menampilkan keindahan warna asli body HP di sekitar cetakan gambar.
* **Matte Hardcase**: Tekstur halus tanpa pantulan cahaya.
* **Tempered Glass (Glossy)**: Efek kilau kaca premium dilengkapi pantulan cahaya 3D (*3D Glass Reflection*) yang dapat diaktifkan/dimatikan.

### 3. ✍️ Custom Teks / Nama di Casing
* Tambahkan teks nama, quote, atau nomor telepon pada casing dengan pilihan font modern (*Outfit*, *Plus Jakarta Sans*, *Impact*, *Code*) dan warna custom.

### 4. 📊 Kalkulator Kecocokan Warna (Score Match Engine)
* Sistem menganalisis keharmonisan kombinasi warna secara otomatis dan menampilkan persentase kecocokan (misal: *96% Sangat Cocok & Harmonis*) serta palet warna yang terdeteksi.

### 5. 📥 Export & Download Mockup High-Res
* Pengguna dapat menyimpan dan mendownload hasil kustomisasi casing dalam bentuk gambar **PNG High-Resolution** beserta lembar spesifikasinya.

---

## 🛠️ Teknologi yang Digunakan

* **Frontend Layout**: HTML5 Semantik.
* **Styling**: Vanilla CSS3 (Sistem UI *Dark Mode Glassmorphic*, Glow Accents, CSS Variables, Responsive Grid).
* **Render Engine**: JavaScript Native (HTML5 Canvas 2D Vector Rendering Engine).
* **Ikon & Tipografi**: Lucide Icons, Google Fonts (*Outfit* & *Plus Jakarta Sans*).

---

## 📁 Struktur Berkas Proyek

```
Casing HP/
├── index.html              # Antarmuka utama aplikasi web
├── styles.css              # Theme CSS dark mode & glassmorphism
├── app.js                  # Engine canvas rendering & logika interaktif
├── README.md               # Dokumentasi proyek
├── Poco x7 hijau.webp      # Gambar acuan resmi POCO X7 Hijau
└── assets/                 # Aset pendukung
    ├── poco_x7_real_back.png
    ├── poco_x7_real_front.png
    ├── poco_x7_camera_module.png
    ├── cyber_pattern.jpg
    └── wave_pattern.jpg
```

---

## 🚀 Cara Menjalankan Aplikasi (Local Development)

1. Buka terminal atau command prompt pada direktori proyek.
2. Jalankan server HTTP lokal sederhana, contohnya dengan Python:
   ```bash
   python -m http.server 3000
   ```
3. Buka browser favoritmu dan akses:
   ```text
   http://localhost:3000
   ```

---

*Dikembangkan untuk memberikan pengalaman kustomisasi casing smartphone yang realistis, indah, dan presisi.*
