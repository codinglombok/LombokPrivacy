import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as P from "../src/index.ts";

const v = JSON.parse(readFileSync(new URL("../../vectors/lombokprivacy-vectors-v1.json", import.meta.url), "utf8"));
const close = (a: number, b: number | "inf") => (b === "inf" ? a === Infinity : Math.abs(a - b) <= v.tolerance.epsilon * Math.max(1, Math.abs(b)));

test("vector count >= 100", () => assert.ok(v.caseCount >= 100));
test("pcg32 reference values (seed 42, seq 54)", () => {
  const r = new P.Pcg32(42n, 54n);
  assert.deepEqual(Array.from({ length: 6 }, () => r.nextU32()), [0xa15c02b7, 0x7b47f409, 0xba1d3330, 0x83d2f293, 0xbfa4784b, 0xcbed606e]);
});
test("pcg32", () => {
  for (const s of v.pcg) {
    const r = new P.Pcg32(BigInt(s.seed), BigInt(s.seq));
    for (const x of s.u32) assert.equal(r.nextU32(), x);
    for (const x of s.floats) assert.equal(r.nextFloat(), x);
    for (const b of s.bounded) assert.equal(r.nextBounded(b.n), b.v);
  }
});
test("randomized response and grr", () => {
  for (const c of v.rr) {
    const r = new P.Pcg32(BigInt(c.seed), BigInt(c.seq));
    assert.deepEqual(c.in.map((b: boolean) => P.randomizedResponse(b, c.p, r)), c.out);
  }
  for (const c of v.grr) {
    const r = new P.Pcg32(BigInt(c.seed), BigInt(c.seq));
    assert.deepEqual(c.in.map((x: number) => P.grr(x, c.k, c.p, r)), c.out);
  }
});
test("epsilon and estimators", () => {
  for (const e of v.epsilon) assert.ok(close(e.fn === "binary" ? P.epsilonBinary(e.p) : P.epsilonGrr(e.p, e.k), e.v), JSON.stringify(e));
  for (const e of v.estimate) assert.equal(e.fn === "binary" ? P.estimateBinary(e.c, e.n, e.p) : P.estimateGrr(e.c, e.n, e.p, e.k), e.v);
});
test("masks", () => {
  for (const c of v.maskIp) assert.equal(P.maskIp(c.ip, c.v4, c.v6), c.out, JSON.stringify(c));
  for (const c of v.maskDomain) assert.equal(P.maskDomain(c.host, c.keep), c.out, JSON.stringify(c));
  for (const c of v.maskEmail) assert.equal(P.maskEmail(c.addr), c.out, JSON.stringify(c));
});
test("statistical sanity: estimator recovers the true rate", () => {
  const r = new P.Pcg32(1n, 1n);
  const n = 200000;
  let c = 0;
  for (let i = 0; i < n; i++) if (P.randomizedResponse(i < n * 0.3, 0.75, r)) c++;
  assert.ok(Math.abs(P.estimateBinary(c, n, 0.75) - 0.3 * n / n) < 0.01);
});
test("invalid input throws", () => {
  assert.throws(() => new P.Pcg32(-1n));
  assert.throws(() => P.randomizedResponse(true, 0.4, new P.Pcg32(1n)));
  assert.throws(() => P.grr(5, 5, 0.9, new P.Pcg32(1n)));
  assert.throws(() => P.maskIp("1.2.3.4", 33));
  assert.throws(() => P.grr(5, 5, 0.9, new P.Pcg32(1n)));
  assert.throws(() => P.estimateBinary(1, 1, 0.5));
  assert.throws(() => P.estimateBinary(1, 0, 0.9));
  assert.throws(() => P.estimateGrr(1, 1, 0.25, 4));
  assert.throws(() => P.estimateGrr(1, 0, 0.9, 4));
});
