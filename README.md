# LombokPrivacy

Local differential privacy and data-minimization helpers: seeded PCG32, randomized response, generalized randomized response, estimators, and IP, domain and email masking. Part of the Lombok Ecosystem.

## Why this library?

Collecting statistics without storing the true answers, and keeping logs without full personal data, needs simple and auditable tools. This library provides reproducible randomized response and masking functions whose results are identical in every language.

## Features

- Deterministic PCG-XSH-RR 64/32 (matches the PCG reference values)
- Binary randomized response and GRR for k values
- Epsilon and unbiased estimators
- maskIp (IPv4/IPv6 to a prefix), maskDomain, maskEmail

## Use cases

- Application telemetry that collects yes/no answers without storing the true answer
- Access or query logs that must be truncated before storage
- Surveys with respondent protection
- Embedded devices reporting metrics with local privacy

## Installation

Not yet published to any registry (0.1.0 has not been released). After release:

```
npm install lombokprivacy
pip install lombokprivacy
```

## API overview

- `new Pcg32(seed, seq=54): nextU32(); nextFloat(); nextBounded(n)`
- `randomizedResponse(bit, p, rng); grr(value, k, p, rng)`
- `epsilonBinary(p); epsilonGrr(p, k); estimateBinary(c, n, p); estimateGrr(c, n, p, k)`
- `maskIp(ip, v4Prefix=24, v6Prefix=48); maskDomain(host, keep=2); maskEmail(addr)`

Details: `docs/API_LombokPrivacy_v0.1.0.md`.

## Port status

| Port | Status |
|---|---|
| TypeScript (reference) | YES, passes all 690 vector cases |
| Python | YES, passes all 690 vector cases |
| Rust, Go, PHP | NOT YET |

## Standards implemented

The normative contract is in `docs/SPEC_LombokPrivacy_v0.1.0.md`; the vectors are in `vectors/lombokprivacy-vectors-v1.json`.

## Known limitations

- Pcg32 is not a CSPRNG; for real privacy the randomness source must be unpredictable. This library is deliberately deterministic for reproducibility.
- Only randomized response is implemented; there are no Laplace/Gaussian mechanisms or epsilon budget counters.
- The privacy guarantee depends on correct use (one answer per respondent per question).
- Rust, Go and PHP ports: NOT YET.

## Development

```
node --test typescript/test/vectors.test.ts   # TypeScript (Node 22+)
python -m pytest python/tests                 # Python 3.10+
node scripts/gen_vectors.ts                   # regenerate vectors from the TypeScript reference
```

## Lombok Ecosystem

Part of the [Lombok Ecosystem](https://github.com/codinglombok).

## License

Apache-2.0 OR MIT (see `LICENSE-APACHE` and `LICENSE-MIT`).
