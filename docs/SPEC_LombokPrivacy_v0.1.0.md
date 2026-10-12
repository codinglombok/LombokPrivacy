# SPEC LombokPrivacy v0.1.0

This document is the normative cross-language contract. Every language port MUST produce byte-identical output for all specified inputs. Deviations from this specification are bugs.

The keywords MUST, SHOULD and MAY are to be read as in RFC 2119. Last reviewed: 2026-10-07.

## 0. Reference standards

This library defines its own contract; there is no normative external standard except those named in the relevant sections.

## 1. Vectors

| File | Cases | SHA-256 |
|---|---|---|
| `vectors/lombokprivacy-vectors-v1.json` | 690 | `188c6515d6fa384f4841bf1bc650df85bfa6ce62b0d035708b59faa70c284358` |

## 2. Contract

1. Pcg32 follows PCG-XSH-RR 64/32 with the reference initialization (state=0, inc=(seq<<1)|1, step, state+=seed, step). Seed 42, seq 54 yields a15c02b7 7b47f409 ba1d3330 83d2f293 bfa4784b cbed606e.
2. nextFloat = nextU32 / 2^32. nextBounded(n): threshold = (2^32 - n) mod n; repeat nextU32 until r >= threshold; the result is r mod n.
3. randomizedResponse: truthful if nextFloat() < p (0.5 <= p <= 1). grr: if nextFloat() < p return the value; otherwise r = nextBounded(k-1) and the result is r+1 if r >= value, else r.
4. epsilonBinary = ln(p/(1-p)); epsilonGrr = ln(p(k-1)/(1-p)); Infinity when p = 1. Transcendental results are compared across ports with a relative tolerance of 1e-12.
5. estimateBinary = (c - n(1-p)) / (n(2p-1)); estimateGrr with q=(1-p)/(k-1): (c - nq) / (n(p-q)); the order of operations is exactly as written.
6. maskIp: IPv4 is decimal without leading zeros, octets <= 255; IPv6 is hexadecimal with 1-4 digits and at most one '::', without zone identifiers and without embedded IPv4 forms; IPv4 output is dotted decimal, IPv6 output is 8 lowercase groups without compression; bits beyond the prefix are zeroed; otherwise null.
7. maskDomain: fold A-Z, remove one trailing dot, reject empty labels or length > 253; if there are more than keep labels the result is '*.' plus the rightmost keep labels. maskEmail: exactly one '@' with non-empty sides; the result is the first character (code point) + '***@' + the folded domain.

## 3. Cross-language representation

String indexes and lengths are counted in code points; floating-point numbers use IEEE 754 doubles with the order of operations as written; large integers MUST NOT lose precision.

## 4. Non-goals

This library is not cryptography: Pcg32 MUST NOT be used for secrets. Bloom-filter RAPPOR, Laplace/Gaussian mechanisms, and privacy-budget accounting do not exist yet.

## 5. Contract change history

- 0.1.0: initial contract.
