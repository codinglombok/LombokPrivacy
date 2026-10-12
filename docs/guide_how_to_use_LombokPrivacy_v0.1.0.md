# Usage Guide LombokPrivacy

## 1. Installation

After release: `npm install lombokprivacy` or `pip install lombokprivacy`. Before release, copy the `typescript/src` folder or `python/src/lombokprivacy` (no dependencies).

## 2. Basic concepts

Pcg32 produces deterministic random numbers from a seed. randomizedResponse and grr randomize an answer before it is stored; estimateBinary and estimateGrr recover the true proportion from many randomized answers. maskIp, maskDomain, and maskEmail truncate personal data before it is stored.

## 3. Examples

`examples/example.ts` and `examples/example.py` produce the following output (TypeScript; Python is identical except for print formatting):

```
observed 3373 estimated rate 0.297
192.168.1.0 2001:db8:abcd:0:0:0:0:0
*.example.com u***@example.com
```

TypeScript code:

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

- Yes/no telemetry: apply randomizedResponse on the client, collect the count, estimate with estimateBinary.
- Access logs: store maskIp(ip) instead of the full address.
- Epsilon reporting: state epsilonBinary(p) in the privacy policy.

## 5. Common pitfalls

- Pcg32 is not a CSPRNG; for real privacy the randomness source must be unpredictable. This library is deliberately deterministic for reproducibility.
- Only randomized response is implemented; there are no Laplace/Gaussian mechanisms or epsilon budget counters.
- The privacy guarantee depends on correct use (one answer per respondent per question).
- Rust, Go and PHP ports: NOT YET.

## 6. See also

`SPEC_LombokPrivacy_v0.1.0.md`, `API_LombokPrivacy_v0.1.0.md`, `full_summary_project_LombokPrivacy_v0.1.0.md`.
