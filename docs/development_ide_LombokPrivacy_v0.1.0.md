# Development LombokPrivacy

## 1. Roadmap

- 0.1.1: CI, coverage, fuzz, publish
- 0.2.0: Rust (no_std), Go, PHP ports; Bloom-filter RAPPOR
- 0.3.0: Laplace/Gaussian mechanisms and an epsilon budget counter

## 2. Deferred scope

This library is not cryptography: Pcg32 MUST NOT be used for secrets. Bloom-filter RAPPOR, Laplace/Gaussian mechanisms, and privacy-budget accounting do not exist yet.

## 3. Design principles for contributors

- Contract first: change the SPEC and vectors before the code; differences between ports are bugs.
- No runtime dependencies; no clock, no network, no hidden randomness.
- Every README feature has a vector case or a test.
- No client or owning-application names in public files.
- No emoji in `*.md`.
- Documentation, comments, error messages and examples are written in English (the default language of all Lombok Ecosystem repositories).

## 4. How to contribute

Fork, create a `feat/...` branch, run both vector runners, update `API_` and `SPEC_` if behavior changes, and open a PR. Regenerate vectors with `node scripts/gen_vectors.ts` only when the contract changes, and review the vector diff.

## 5. Open questions

- Should a source of secure randomness (CSPRNG) get an official interface instead of Pcg32?
- A canonical compressed IPv6 form as an output option?
