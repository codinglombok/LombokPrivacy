# API LombokPrivacy v0.1.0

Bahasa referensi: TypeScript. Port Python memakai penamaan snake_case dan mengembalikan tuple atau dataclass dengan isi yang sama. Stabilitas: 0.x, perubahan dapat terjadi dengan catatan di CHANGELOG. Sejak versi: 0.1.0.

- `new Pcg32(seed, seq=54): nextU32(); nextFloat(); nextBounded(n)`
- `randomizedResponse(bit, p, rng); grr(value, k, p, rng)`
- `epsilonBinary(p); epsilonGrr(p, k); estimateBinary(c, n, p); estimateGrr(c, n, p, k)`
- `maskIp(ip, v4Prefix=24, v6Prefix=48); maskDomain(host, keep=2); maskEmail(addr)`

Kesalahan masukan di luar rentang SPEC memicu `RangeError` (TypeScript) atau `ValueError` (Python); fungsi yang didefinisikan total mengembalikan nilai khusus (null, invalid) sesuai SPEC.

Kompatibilitas lintas bahasa: lihat SPEC bagian 3 dan vector.
