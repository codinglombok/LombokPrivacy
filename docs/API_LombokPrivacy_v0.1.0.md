# API LombokPrivacy v0.1.0

Reference language: TypeScript. The Python port uses snake_case names and returns tuples, dicts, or dataclasses with the same content. Stability: 0.x; changes may occur and are noted in the CHANGELOG. Since version: 0.1.0.

- `new Pcg32(seed, seq=54): nextU32(); nextFloat(); nextBounded(n)`
- `randomizedResponse(bit, p, rng); grr(value, k, p, rng)`
- `epsilonBinary(p); epsilonGrr(p, k); estimateBinary(c, n, p); estimateGrr(c, n, p, k)`
- `maskIp(ip, v4Prefix=24, v6Prefix=48); maskDomain(host, keep=2); maskEmail(addr)`

Input outside the ranges in the SPEC raises `RangeError` (TypeScript) or `ValueError` (Python); functions defined as total return a special value (null, invalid) as the SPEC states.

Cross-language compatibility: see SPEC section 3 and the vectors.
