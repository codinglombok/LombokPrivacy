# Ringkasan Proyek LombokPrivacy

## Apa ini

Local differential privacy and data-minimization helpers: seeded PCG32, randomized response, generalized randomized response, estimators, and IP, domain and email masking. Part of the Lombok Ecosystem.

## Mengapa dibuat

Mengumpulkan statistik tanpa menyimpan jawaban asli, dan menyimpan log tanpa data pribadi lengkap, membutuhkan alat yang sederhana dan dapat diaudit. Library ini menyediakan randomized response yang dapat direproduksi dan fungsi penyamaran yang hasilnya identik di setiap bahasa.

## Fitur utama

- PCG-XSH-RR 64/32 deterministik (cocok dengan nilai referensi PCG)
- Randomized response biner dan GRR untuk k nilai
- Epsilon dan penaksir tak bias
- maskIp (IPv4/IPv6 ke prefix), maskDomain, maskEmail

## Status saat ini

Versi 0.1.0, belum dirilis. TypeScript dan Python lulus 690 kasus vector. Port lain belum ada.

## Contoh pemakai

- Telemetri aplikasi yang mengumpulkan jawaban ya/tidak tanpa menyimpan jawaban asli
- Log akses atau log kueri yang perlu dipotong sebelum disimpan
- Survei dengan perlindungan responden
- Perangkat tertanam yang melaporkan metrik dengan privasi lokal

## Batasan yang Diketahui

- Pcg32 bukan CSPRNG; untuk privasi nyata sumber acak harus tidak dapat diprediksi, library ini sengaja deterministik untuk reproduksibilitas.
- Hanya randomized response; tidak ada mekanisme Laplace/Gauss maupun penghitung anggaran epsilon.
- Jaminan privasi bergantung pada pemakaian benar (satu jawaban per responden per pertanyaan).
- Port Rust, Go, PHP BELUM.

## Info lanjut

SPEC: `SPEC_LombokPrivacy_v0.1.0.md`; API: `API_LombokPrivacy_v0.1.0.md`; panduan: `guide_how_to_use_LombokPrivacy_v0.1.0.md`.

## Gap vs pembanding

Pembanding: OpenDP, Google differential-privacy, diffprivlib. Gap jujur: cakupan jauh lebih sempit; keunggulan: ukuran kecil, tanpa dependensi, hasil identik lintas bahasa.
