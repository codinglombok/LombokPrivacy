# SPEC LombokPrivacy v0.1.0

This document is the normative cross-language contract. Every language port MUST produce byte-identical output for all specified inputs. Deviations from this specification are bugs.

Kata MUST, SHOULD, dan MAY dibaca sesuai RFC 2119. Tinjauan terakhir: 2026-10-07.

## 0. Standar acuan

Library ini mendefinisikan kontraknya sendiri; tidak ada standar eksternal normatif kecuali yang disebut pada bagian terkait.

## 1. Vector

| Berkas | Kasus | SHA-256 |
|---|---|---|
| `vectors/lombokprivacy-vectors-v1.json` | 690 | `188c6515d6fa384f4841bf1bc650df85bfa6ce62b0d035708b59faa70c284358` |

## 2. Kontrak

1. Pcg32 mengikuti PCG-XSH-RR 64/32 dengan inisialisasi referensi (state=0, inc=(seq<<1)|1, langkah, state+=seed, langkah). Seed 42, seq 54 menghasilkan a15c02b7 7b47f409 ba1d3330 83d2f293 bfa4784b cbed606e.
2. nextFloat = nextU32 / 2^32. nextBounded(n): threshold = (2^32 - n) mod n; ulangi nextU32 sampai r >= threshold; hasil r mod n.
3. randomizedResponse: jujur bila nextFloat() < p (0.5 <= p <= 1). grr: bila nextFloat() < p kembalikan nilai; selain itu r = nextBounded(k-1), hasil r+1 bila r >= nilai, selain itu r.
4. epsilonBinary = ln(p/(1-p)); epsilonGrr = ln(p(k-1)/(1-p)); Infinity bila p = 1. Fungsi transendental dibandingkan dengan toleransi relatif 1e-12 antar port.
5. estimateBinary = (c - n(1-p)) / (n(2p-1)); estimateGrr dengan q=(1-p)/(k-1): (c - nq) / (n(p-q)); urutan operasi persis seperti tertulis.
6. maskIp: IPv4 desimal tanpa nol di depan, oktet <= 255; IPv6 heksa 1-4 digit dengan paling banyak satu '::', tanpa zona dan tanpa bentuk IPv4 tertanam; keluaran IPv4 titik-desimal, IPv6 8 grup huruf kecil tanpa kompresi; bit di luar prefiks dinolkan; selain itu null.
7. maskDomain: lipat A-Z, buang satu titik akhir, tolak label kosong atau panjang > 253; bila label > keep hasil '*.' + keep label paling kanan. maskEmail: tepat satu '@', dua sisi tidak kosong; hasil karakter pertama (code point) + '***@' + domain terlipat.

## 3. Representasi lintas bahasa

Indeks dan panjang string dihitung per code point; angka floating point memakai IEEE 754 double dengan urutan operasi seperti tertulis; bilangan bulat besar tidak boleh kehilangan presisi.

## 4. Non-goals

Library ini bukan kriptografi: Pcg32 tidak boleh dipakai untuk rahasia. RAPPOR berbasis Bloom filter, mekanisme Laplace/Gauss, dan akuntansi anggaran privasi BELUM ada.

## 5. Riwayat perubahan kontrak

- 0.1.0: kontrak awal.
