const M64 = (1n << 64n) - 1n;
const MULT = 6364136223846793005n;

/** PCG-XSH-RR 64/32. Deterministic; not for cryptography. */
export class Pcg32 {
  private state = 0n;
  private inc: bigint;
  constructor(seed: bigint, seq: bigint = 54n) {
    if (seed < 0n || seed > M64 || seq < 0n || seq > M64) throw new RangeError("seed/seq must be uint64");
    this.inc = ((seq << 1n) | 1n) & M64;
    this.nextU32();
    this.state = (this.state + seed) & M64;
    this.nextU32();
  }
  nextU32(): number {
    const old = this.state;
    this.state = (old * MULT + this.inc) & M64;
    const xs = Number((((old >> 18n) ^ old) >> 27n) & 0xffffffffn);
    const rot = Number(old >> 59n);
    return ((xs >>> rot) | (xs << (-rot & 31))) >>> 0;
  }
  /** Float in [0, 1) with 2^-32 resolution. */
  nextFloat(): number {
    return this.nextU32() / 4294967296;
  }
  /** Uniform integer in [0, n), 1 <= n <= 2^32, unbiased (rejection sampling). */
  nextBounded(n: number): number {
    if (!Number.isInteger(n) || n < 1 || n > 4294967296) throw new RangeError("n");
    const threshold = (4294967296 - n) % n;
    for (;;) {
      const r = this.nextU32();
      if (r >= threshold) return r % n;
    }
  }
}

function checkP(p: number, lo: number): void {
  if (!(p >= lo && p <= 1)) throw new RangeError("p out of range");
}

/** Binary randomized response: answers truthfully with probability p (0.5 <= p <= 1). */
export function randomizedResponse(bit: boolean, p: number, rng: Pcg32): boolean {
  checkP(p, 0.5);
  return rng.nextFloat() < p ? bit : !bit;
}

/** Generalized randomized response for values 0..k-1. */
export function grr(value: number, k: number, p: number, rng: Pcg32): number {
  if (!Number.isInteger(k) || k < 2 || k > 4294967296) throw new RangeError("k");
  if (!Number.isInteger(value) || value < 0 || value >= k) throw new RangeError("value");
  checkP(p, 1 / k);
  if (rng.nextFloat() < p) return value;
  const r = rng.nextBounded(k - 1);
  return r >= value ? r + 1 : r;
}

/** Epsilon of binary randomized response: ln(p / (1 - p)); Infinity when p = 1. */
export function epsilonBinary(p: number): number {
  checkP(p, 0.5);
  return p === 1 ? Infinity : Math.log(p / (1 - p));
}
/** Epsilon of GRR: ln(p (k - 1) / (1 - p)). */
export function epsilonGrr(p: number, k: number): number {
  if (!Number.isInteger(k) || k < 2) throw new RangeError("k");
  checkP(p, 1 / k);
  return p === 1 ? Infinity : Math.log((p * (k - 1)) / (1 - p));
}

/** Unbiased estimate of the true proportion of "yes" from c randomized answers out of n respondents (p > 0.5). */
export function estimateBinary(c: number, n: number, p: number): number {
  if (!(p > 0.5 && p <= 1) || !(n > 0)) throw new RangeError("args");
  return (c - n * (1 - p)) / (n * (2 * p - 1));
}
/** Unbiased estimate of the proportion of one value from GRR answers. */
export function estimateGrr(c: number, n: number, p: number, k: number): number {
  if (!Number.isInteger(k) || k < 2 || !(n > 0)) throw new RangeError("args");
  const q = (1 - p) / (k - 1);
  if (!(p > q && p <= 1)) throw new RangeError("p");
  return (c - n * q) / (n * (p - q));
}

const V4 = /^(0|[1-9][0-9]{0,2})\.(0|[1-9][0-9]{0,2})\.(0|[1-9][0-9]{0,2})\.(0|[1-9][0-9]{0,2})$/;
const HEX = /^[0-9a-fA-F]{1,4}$/;

/** Truncate an IP address to a prefix; IPv4 dotted decimal, IPv6 expanded to 8 groups without compression. Returns null if invalid. */
export function maskIp(ip: string, v4Prefix = 24, v6Prefix = 48): string | null {
  if (!Number.isInteger(v4Prefix) || v4Prefix < 0 || v4Prefix > 32) throw new RangeError("v4Prefix");
  if (!Number.isInteger(v6Prefix) || v6Prefix < 0 || v6Prefix > 128) throw new RangeError("v6Prefix");
  const m4 = V4.exec(ip);
  if (m4) {
    const o = m4.slice(1).map(Number);
    if (o.some((x) => x > 255)) return null;
    return o
      .map((x, i) => {
        const bits = Math.max(0, Math.min(8, v4Prefix - 8 * i));
        return bits === 0 ? 0 : x & ((0xff << (8 - bits)) & 0xff);
      })
      .join(".");
  }
  if (!ip.includes(":")) return null;
  const halves = ip.split("::");
  if (halves.length > 2) return null;
  const parse = (s: string): number[] | null => {
    if (s === "") return [];
    const parts = s.split(":");
    return parts.every((x) => HEX.test(x)) ? parts.map((x) => parseInt(x, 16)) : null;
  };
  const left = parse(halves[0]);
  const right = halves.length === 2 ? parse(halves[1]) : [];
  if (left === null || right === null) return null;
  let groups: number[];
  if (halves.length === 2) {
    if (left.length + right.length > 7) return null;
    groups = [...left, ...new Array<number>(8 - left.length - right.length).fill(0), ...right];
  } else {
    if (left.length !== 8) return null;
    groups = left;
  }
  return groups
    .map((g, i) => {
      const bits = Math.max(0, Math.min(16, v6Prefix - 16 * i));
      return (bits === 0 ? 0 : g & ((0xffff << (16 - bits)) & 0xffff)).toString(16);
    })
    .join(":");
}

const fold = (s: string): string => s.replace(/[A-Z]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 32));

/** Keep the rightmost `keep` labels; the remaining labels are replaced by a single "*". Returns null if malformed. */
export function maskDomain(host: string, keep = 2): string | null {
  if (!Number.isInteger(keep) || keep < 1) throw new RangeError("keep");
  let h = fold(host);
  if (h.endsWith(".")) h = h.slice(0, -1);
  if (h === "" || h.length > 253) return null;
  const labels = h.split(".");
  if (labels.some((l) => l === "")) return null;
  return labels.length > keep ? "*." + labels.slice(-keep).join(".") : h;
}

/** "user@Example.com" -> "u***@example.com". Returns null unless there is exactly one '@' with non-empty sides. */
export function maskEmail(addr: string): string | null {
  const parts = addr.split("@");
  if (parts.length !== 2 || parts[0] === "" || parts[1] === "") return null;
  return Array.from(parts[0])[0] + "***@" + fold(parts[1]);
}
