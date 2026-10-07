# LombokPrivacy

Local differential privacy and data-minimization helpers: seeded PCG32, randomized response, generalized randomized response, estimators, and IP, domain and email masking. Part of the Lombok Ecosystem.

## Mengapa library ini?

Mengumpulkan statistik tanpa menyimpan jawaban asli, dan menyimpan log tanpa data pribadi lengkap, membutuhkan alat yang sederhana dan dapat diaudit. Library ini menyediakan randomized response yang dapat direproduksi dan fungsi penyamaran yang hasilnya identik di setiap bahasa.

## Fitur

- PCG-XSH-RR 64/32 deterministik (cocok dengan nilai referensi PCG)
- Randomized response biner dan GRR untuk k nilai
- Epsilon dan penaksir tak bias
- maskIp (IPv4/IPv6 ke prefix), maskDomain, maskEmail

## Skenario pemakaian

- Telemetri aplikasi yang mengumpulkan jawaban ya/tidak tanpa menyimpan jawaban asli
- Log akses atau log kueri yang perlu dipotong sebelum disimpan
- Survei dengan perlindungan responden
- Perangkat tertanam yang melaporkan metrik dengan privasi lokal

## Instalasi

Belum terbit di registry (0.1.0 belum dirilis). Setelah rilis:

```
npm install lombokprivacy
pip install lombokprivacy
```

## API ringkas

- `new Pcg32(seed, seq=54): nextU32(); nextFloat(); nextBounded(n)`
- `randomizedResponse(bit, p, rng); grr(value, k, p, rng)`
- `epsilonBinary(p); epsilonGrr(p, k); estimateBinary(c, n, p); estimateGrr(c, n, p, k)`
- `maskIp(ip, v4Prefix=24, v6Prefix=48); maskDomain(host, keep=2); maskEmail(addr)`

Rincian: `docs/API_LombokPrivacy_v0.1.0.md`.

## Status port

| Port | Status |
|---|---|
| TypeScript (referensi) | YA, lulus seluruh 690 kasus vector |
| Python | YA, lulus seluruh 690 kasus vector |
| Rust, Go, PHP | BELUM |

## Standar yang diimplementasikan

Kontrak normatif ada di `docs/SPEC_LombokPrivacy_v0.1.0.md`; vector di `vectors/lombokprivacy-vectors-v1.json`.

## Batasan yang diketahui

- Pcg32 bukan CSPRNG; untuk privasi nyata sumber acak harus tidak dapat diprediksi, library ini sengaja deterministik untuk reproduksibilitas.
- Hanya randomized response; tidak ada mekanisme Laplace/Gauss maupun penghitung anggaran epsilon.
- Jaminan privasi bergantung pada pemakaian benar (satu jawaban per responden per pertanyaan).
- Port Rust, Go, PHP BELUM.

## Pengembangan

```
node --test typescript/test/          # TypeScript (Node 22+)
python -m pytest python/tests         # Python 3.10+
node scripts/gen_vectors.ts           # membangkitkan ulang vector dari referensi TypeScript
```

## Ekosistem Lombok

Part of the [Lombok Ecosystem](https://github.com/codinglombok).

## Lisensi

Apache-2.0 OR MIT (lihat `LICENSE-APACHE` dan `LICENSE-MIT`).
