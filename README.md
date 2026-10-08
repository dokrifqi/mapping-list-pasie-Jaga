# Mapping Operan Jaga (PWA)

Satu halaman HTML tanpa build. Data pasien hanya disimpan di browser perangkat (localStorage) dan tidak dikirim ke server mana pun.

## Isi
- index.html : aplikasi
- manifest.webmanifest : nama, warna, ikon
- sw.js : service worker (bisa dibuka tanpa internet)
- icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png : ikon (semua di folder yang sama dengan index.html)
- vercel.json : header untuk sw.js dan manifest (diabaikan host lain)

## Pasang di hosting (HTTPS wajib)
- Vercel: buat proyek baru dari folder ini, framework "Other", tanpa build command.
- GitHub Pages: unggah semua isi folder ke repo, aktifkan Pages dari branch utama.

## Pasang di HP
- iPhone: buka di Safari, Bagikan, Tambah ke Layar Utama.
- Android: menu Chrome, Instal aplikasi (atau tombol Pasang di tab Data).

## Pemakaian pertama
Bed sudah terisi tanpa nama. Buka tab Data, ketik nama di tiap bed, atau pakai "Tempel daftar baru" untuk menempel daftar operan sekaligus.

## Memperbarui versi
Service worker membuka dari cache dulu, jadi versi baru tampil saat aplikasi dibuka untuk kedua kalinya setelah deploy. Kalau ingin memaksa, naikkan VERSION di sw.js.

## Input data dari foto

Aplikasi tidak membaca foto sendiri. Alurnya: kirim foto lembar operan ke Claude di chat, minta diubah menjadi daftar pasien, lalu salin hasilnya ke tab Data, bagian "Tempel daftar baru", dan tekan "Baca daftar pasien".

Format per baris: `901 A Nama / DPJP`. DPJP boleh singkatan seperti `Nefro`, `HO-Riza`, `HO-Spt`, `Neuro-Fad`, `GH-Evi`, `Cardio-Lily`, `dr. Hanum`. Kalau singkatan belum menunjuk satu dokter (misalnya `AI` atau `Neuro` saja), DPJP dibiarkan kosong dan muncul di daftar "pilih manual".

## Memperbarui aplikasi

Cukup ganti index.html dengan versi terbaru, lalu upload ulang (Vercel: drag and drop lagi, atau git push). Tidak perlu mengubah file lain.
Di HP, aplikasi mengambil index.html terbaru setiap dibuka dan memuat ulang sendiri kalau ada perubahan. Data pasien tetap aman karena tersimpan di HP.
