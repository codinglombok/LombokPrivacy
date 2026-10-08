# Pengembangan LombokPrivacy

## 1. Roadmap

- 0.1.1: CI, coverage, fuzz, publish
- 0.2.0: port Rust (no_std), Go, PHP; RAPPOR berbasis Bloom filter
- 0.3.0: mekanisme Laplace/Gauss dan penghitung anggaran epsilon

## 2. Deferred scope

Library ini bukan kriptografi: Pcg32 tidak boleh dipakai untuk rahasia. RAPPOR berbasis Bloom filter, mekanisme Laplace/Gauss, dan akuntansi anggaran privasi BELUM ada.

## 3. Prinsip desain untuk kontributor

- Kontrak dulu: ubah SPEC dan vector sebelum kode; perbedaan antar-port adalah bug.
- Tanpa dependensi runtime; tanpa jam, tanpa jaringan, tanpa acak tersembunyi.
- Setiap fitur README memiliki kasus vector atau test.
- Tidak ada nama klien atau aplikasi pemilik di berkas publik.
- Tanpa emoji di `*.md`.

## 4. Cara berkontribusi

Fork, cabang `feat/...`, jalankan kedua runner vector, perbarui `API_` dan `SPEC_` bila perilaku berubah, buka PR. Bangkitkan ulang vector dengan `node scripts/gen_vectors.ts` hanya bila kontrak berubah, dan tinjau diff vector.

## 5. Pertanyaan terbuka

- Apakah penerima sumber acak (CSPRNG) perlu antarmuka resmi menggantikan Pcg32?
- Format kanonik IPv6 terkompresi sebagai opsi keluaran?
