# Project Summary LombokPrivacy

## What it is

Local differential privacy and data-minimization helpers: seeded PCG32, randomized response, generalized randomized response, estimators, and IP, domain and email masking. Part of the Lombok Ecosystem.

## Why it exists

Collecting statistics without storing the true answers, and keeping logs without full personal data, needs simple and auditable tools. This library provides reproducible randomized response and masking functions whose results are identical in every language.

## Main features

- Deterministic PCG-XSH-RR 64/32 (matches the PCG reference values)
- Binary randomized response and GRR for k values
- Epsilon and unbiased estimators
- maskIp (IPv4/IPv6 to a prefix), maskDomain, maskEmail

## Current status

Version 0.1.0, not yet released. TypeScript and Python pass 690 vector cases. No other ports exist.

## Example use cases

- Application telemetry that collects yes/no answers without storing the true answer
- Access or query logs that must be truncated before storage
- Surveys with respondent protection
- Embedded devices reporting metrics with local privacy

## Known Limitations

- Pcg32 is not a CSPRNG; for real privacy the randomness source must be unpredictable. This library is deliberately deterministic for reproducibility.
- Only randomized response is implemented; there are no Laplace/Gaussian mechanisms or epsilon budget counters.
- The privacy guarantee depends on correct use (one answer per respondent per question).
- Rust, Go and PHP ports: NOT YET.

## Further information

SPEC: `SPEC_LombokPrivacy_v0.1.0.md`; API: `API_LombokPrivacy_v0.1.0.md`; guide: `guide_how_to_use_LombokPrivacy_v0.1.0.md`.

## Gap versus comparable libraries

Comparable: OpenDP, Google differential-privacy, diffprivlib. Honest gap: a much narrower scope; strengths: small size, no dependencies, identical results across languages.
