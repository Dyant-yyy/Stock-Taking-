# 🏢 PT. Indonesia Toray Synthetics — IT Device Stock Taking & Inventory System

Sistem Manajemen Inventaris & Stock Opname Perangkat IT berbasis web yang dirancang khusus untuk memonitor, mendata, dan mengaudit aset komputer, laptop, server, serta perangkat pendukung di seluruh departemen dan unit produksi **PT. Indonesia Toray Synthetics (Tangerang Plant)**.

---

## 📌 Fitur Utama

### 1. 📊 Dashboard Eksekutif & Ringkasan Status Unit
- Ringkasan total aset terdaftar secara real-time.
- Status operasional perangkat terstandarisasi: **Online**, **In (Standby)**, **Out (Sedang Dipinjam/Dipakai)**, **Not Used**, **Broken**, dan **Disposal**.
- Visualisasi rasio kesiapan unit (*readiness rate*) dan aktivitas log audit terkini.

### 2. 🖥️ Tabel Master Inventaris Komputer
- Katalog lengkap perangkat IT dengan pencarian cepat (*instant search*), penyaringan departemen (IS, RSN, NFY, PFY, SIS, HRGA, FIN, dsb.), dan filter status.
- Manajemen data perangkat (Tambah, Edit, Detail Spesifikasi, dan Hapus).
- Fitur **Export CSV** untuk pelaporan dan integrasi data spreadsheet.

### 3. 📷 Scanner Barcode & QR Code Kamera
- Pemindaian stiker aset fisik secara langsung menggunakan kamera smartphone maupun webcam laptop.
- Pengenalan otomatis nama komputer, serial number, atau IP address perangkat.
- Navigasi deep-link instan ke status dan riwayat perangkat yang dipindai.

### 4. 🖨️ Cetak Stiker Label Tag Asset Resmi Toray
- Template cetak stiker barcode & QR Code terstandarisasi pabrik dengan identitas resmi PT. ITS Tangerang Plant.
- Siap cetak langsung ke thermal printer maupun kertas stiker label standar (A4 / stiker label barcode).

### 5. 📅 Pemeriksaan & Pendataan Bulanan (Monthly Audit)
- Pencatatan checklist audit fisik rutin bulanan (kondisi fisik, status operasional, nama auditor, catatan temuan).
- **Matriks Status 12 Bulan (Januari – Desember)** untuk memantau konsistensi pemeriksaan setiap unit sepanjang tahun operasional.
- Quick verify untuk pembaruan status audit dengan satu klik.

### 6. 📈 Statistik & Analisis Departemen
- Distribusi kepemilikan perangkat per departemen.
- Rasio kesehatan hardware dan persentase kelaikan operasional.

### 7. 📱 Desain Responsif & Mobile-Optimized
- Tampilan optimal pada layar monitor desktop pabrik maupun smartphone auditor lapangan saat berkeliling area operasional plant.

---

## 🛠️ Tech Stack

- **Frontend**: React (JavaScript ES6+)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Styling**: Tailored Modern CSS Design System (Toray Corporate Blue Palette)
- **Deployment Ready**: Terkonfigurasi untuk Vercel / Static Web Server

---

## 🚀 Panduan Memulai (Local Setup)

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas)
- npm atau yarn

### Instalasi & Menjalankan Aplikasi

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/Dyant-yyy/Stock-Taking-.git
   cd Stock-Taking-
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```

4. **Buka di browser:**
   Akses `http://localhost:5173` di browser Anda.

5. **Build untuk production:**
   ```bash
   npm run build
   ```

---

## 🔒 Lisensi & Hak Cipta
Dikembangkan untuk kebutuhan internal sistem inventaris perangkat IT **PT. Indonesia Toray Synthetics**.
