import { writeFileSync } from "node:fs";
import * as P from "../typescript/src/index.ts";

const seeds: [bigint, bigint][] = [[42n, 54n], [0n, 0n], [1n, 1n], [123456789n, 7n], [(1n << 64n) - 1n, (1n << 64n) - 1n], [2026n, 99n]];
const pcg = seeds.map(([seed, seq]) => {
  const r = new P.Pcg32(seed, seq);
  return {
    seed: seed.toString(), seq: seq.toString(),
    u32: Array.from({ length: 12 }, () => r.nextU32()),
    floats: Array.from({ length: 4 }, () => r.nextFloat()),
    bounded: [1, 2, 3, 7, 10, 1000, 4294967296, 3000000000].map((n) => ({ n, v: r.nextBounded(n) })),
  };
});

const rr = [0.5, 0.75, 0.9, 0.99, 1].map((p) => {
  const r = new P.Pcg32(77n, 3n);
  return { p, seed: "77", seq: "3", in: Array.from({ length: 24 }, (_, i) => i % 3 !== 0), out: [] as boolean[] };
});
for (const c of rr) {
  const r = new P.Pcg32(77n, 3n);
  c.out = c.in.map((b) => P.randomizedResponse(b, c.p, r));
}
const grrCases = [[2, 0.5], [3, 0.6], [5, 0.9], [10, 0.5], [10, 0.1], [4294967296, 0.999]].map(([k, p]) => {
  const r = new P.Pcg32(9n, 9n);
  const ins = Array.from({ length: 24 }, (_, i) => (i * 7) % k);
  return { k, p, seed: "9", seq: "9", in: ins, out: ins.map((v) => P.grr(v, k, p, r)) };
});

const eps = [
  ...[0.5, 0.6, 0.75, 0.9, 0.99, 0.999, 1].map((p) => ({ fn: "binary", p, k: 0, v: P.epsilonBinary(p) })),
  ...[[0.5, 2], [0.5, 10], [0.9, 10], [0.2, 5], [1, 4]].map(([p, k]) => ({ fn: "grr", p, k, v: P.epsilonGrr(p, k) })),
].map((e) => ({ ...e, v: Number.isFinite(e.v) ? e.v : "inf" }));
const est = [
  ...[[540, 1000, 0.9], [100, 100, 0.75], [0, 50, 0.6], [1000, 1000, 1], [5, 10, 0.51]].map(([c, n, p]) => ({ fn: "binary", c, n, p, k: 0, v: P.estimateBinary(c, n, p) })),
  ...[[300, 1000, 0.5, 4], [10, 100, 0.9, 10], [0, 10, 0.4, 3], [7, 7, 1, 5], [30, 100, 0.8, 2]].map(([c, n, p, k]) => ({ fn: "grr", c, n, p, k, v: P.estimateGrr(c, n, p, k) })),
];

const ips = [
  "192.168.1.77", "10.0.0.1", "255.255.255.255", "0.0.0.0", "256.1.1.1", "1.2.3", "1.2.3.4.5", "01.2.3.4", "1.2.3.04", "1.2.3.-4", " 1.2.3.4",
  "2001:db8:abcd:1234:5678:9abc:def0:1234", "2001:DB8::1", "::", "::1", "1::", "1:2:3:4:5:6:7::", "1:2:3:4:5:6:7:8", "1:2:3:4:5:6:7", "1::2::3",
  ":::", "1:::2", "fe80::1%eth0", "::ffff:1.2.3.4", "12345::1", "g::1", "abcd", "", "2001:db8:ffff:ffff:ffff:ffff:ffff:ffff", "1:2:3:4:5:6:7:8:9", "::1:2:3:4:5:6:7", "::2:3:4:5:6:7:8", "1:2:3:4:5:6:7::8", "1:2:3:4::5:6:7:8", "1:2:3:4:5:6::7",
];
const maskIp: Record<string, unknown>[] = [];
for (const ip of ips) for (const [a, b] of [[24, 48], [0, 0], [32, 128], [16, 64], [25, 49], [8, 1]]) maskIp.push({ ip, v4: a, v6: b, out: P.maskIp(ip, a, b) });
const hosts = ["a.b.example.com", "EXAMPLE.com", "www.example.co.uk.", "example", "a.example.com", "", ".", "a..b", ".a.b", "x.y.z.w.v", "Sub.Domain.EXAMPLE.org", "AZ.az.AZ", "A@[.Z"];
const maskDomain: Record<string, unknown>[] = [];
for (const h of hosts) for (const keep of [1, 2, 3]) maskDomain.push({ host: h, keep, out: P.maskDomain(h, keep) });
const maskEmail = ["user@example.com", "U@Example.COM", "a@b", "@example.com", "user@", "a@b@c", "nodomain", "", "\u00e9mile@example.com", "\ud83d\ude00x@example.com", "x@sub.Example.org"].map((a) => ({ addr: a, out: P.maskEmail(a) }));

const caseCount = pcg.reduce((a, s) => a + s.u32.length + s.floats.length + s.bounded.length, 0) + rr.length * 24 + grrCases.length * 24 + eps.length + est.length + maskIp.length + maskDomain.length + maskEmail.length;
writeFileSync(new URL("../vectors/lombokprivacy-vectors-v1.json", import.meta.url), JSON.stringify({ version: 1, caseCount, tolerance: { epsilon: 1e-12 }, pcg, rr, grr: grrCases, epsilon: eps, estimate: est, maskIp, maskDomain, maskEmail }, null, 1) + "\n");
console.log("cases", caseCount);
