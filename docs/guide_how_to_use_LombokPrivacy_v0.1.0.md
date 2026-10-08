# Panduan Pemakaian LombokPrivacy

## 1. Instalasi

Setelah rilis: `npm install lombokprivacy` atau `pip install lombokprivacy`. Sebelum rilis, salin folder `typescript/src` atau `python/src/lombokprivacy` (tanpa dependensi).

## 2. Konsep dasar

Pcg32 menghasilkan angka acak deterministik dari seed. randomizedResponse dan grr mengacak jawaban sebelum disimpan; estimateBinary dan estimateGrr memulihkan proporsi sebenarnya dari banyak jawaban teracak. maskIp, maskDomain, maskEmail memotong data pribadi sebelum disimpan.

## 3. Contoh

Berkas `examples/example.ts` dan `examples/example.py` menghasilkan keluaran berikut (TypeScript; Python sama kecuali format cetak):

```
observed 3373 estimated rate 0.297
192.168.1.0 2001:db8:abcd:0:0:0:0:0
*.example.com u***@example.com
```

Kode TypeScript:

```ts
import { Pcg32, estimateBinary, maskDomain, maskEmail, maskIp, randomizedResponse } from "lombokprivacy";

const rng = new Pcg32(2026n);
const n = 10000;
let yes = 0;
for (let i = 0; i < n; i++) if (randomizedResponse(i < 3000, 0.9, rng)) yes++;
console.log("observed", yes, "estimated rate", estimateBinary(yes, n, 0.9).toFixed(3));
console.log(maskIp("192.168.1.77"), maskIp("2001:db8:abcd:1234::1"));
console.log(maskDomain("a.b.example.com"), maskEmail("user@Example.com"));
```

## 4. Recipes

- Telemetri ya/tidak: terapkan randomizedResponse di sisi klien, kumpulkan jumlah, taksir dengan estimateBinary.
- Log akses: simpan maskIp(ip) alih-alih alamat penuh.
- Pelaporan epsilon: tulis epsilonBinary(p) di kebijakan privasi.

## 5. Common pitfalls

- Pcg32 bukan CSPRNG; untuk privasi nyata sumber acak harus tidak dapat diprediksi, library ini sengaja deterministik untuk reproduksibilitas.
- Hanya randomized response; tidak ada mekanisme Laplace/Gauss maupun penghitung anggaran epsilon.
- Jaminan privasi bergantung pada pemakaian benar (satu jawaban per responden per pertanyaan).
- Port Rust, Go, PHP BELUM.

## 6. Lihat juga

`SPEC_LombokPrivacy_v0.1.0.md`, `API_LombokPrivacy_v0.1.0.md`, `full_summary_project_LombokPrivacy_v0.1.0.md`.
