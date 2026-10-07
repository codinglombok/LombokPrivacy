from __future__ import annotations

import math
import re
from typing import Optional

_M64 = (1 << 64) - 1
_MULT = 6364136223846793005


class Pcg32:
    def __init__(self, seed: int, seq: int = 54) -> None:
        if not (0 <= seed <= _M64 and 0 <= seq <= _M64):
            raise ValueError("seed/seq must be uint64")
        self._state = 0
        self._inc = ((seq << 1) | 1) & _M64
        self.next_u32()
        self._state = (self._state + seed) & _M64
        self.next_u32()

    def next_u32(self) -> int:
        old = self._state
        self._state = (old * _MULT + self._inc) & _M64
        xs = (((old >> 18) ^ old) >> 27) & 0xFFFFFFFF
        rot = old >> 59
        return ((xs >> rot) | (xs << ((-rot) & 31))) & 0xFFFFFFFF

    def next_float(self) -> float:
        return self.next_u32() / 4294967296

    def next_bounded(self, n: int) -> int:
        if not (1 <= n <= 4294967296):
            raise ValueError("n")
        threshold = (4294967296 - n) % n
        while True:
            r = self.next_u32()
            if r >= threshold:
                return r % n


def _check_p(p: float, lo: float) -> None:
    if not (lo <= p <= 1):
        raise ValueError("p out of range")


def randomized_response(bit: bool, p: float, rng: Pcg32) -> bool:
    _check_p(p, 0.5)
    return bit if rng.next_float() < p else (not bit)


def grr(value: int, k: int, p: float, rng: Pcg32) -> int:
    if not (2 <= k <= 4294967296):
        raise ValueError("k")
    if not (0 <= value < k):
        raise ValueError("value")
    _check_p(p, 1 / k)
    if rng.next_float() < p:
        return value
    r = rng.next_bounded(k - 1)
    return r + 1 if r >= value else r


def epsilon_binary(p: float) -> float:
    _check_p(p, 0.5)
    return math.inf if p == 1 else math.log(p / (1 - p))


def epsilon_grr(p: float, k: int) -> float:
    if k < 2:
        raise ValueError("k")
    _check_p(p, 1 / k)
    return math.inf if p == 1 else math.log((p * (k - 1)) / (1 - p))


def estimate_binary(c: float, n: float, p: float) -> float:
    if not (0.5 < p <= 1) or not (n > 0):
        raise ValueError("args")
    return (c - n * (1 - p)) / (n * (2 * p - 1))


def estimate_grr(c: float, n: float, p: float, k: int) -> float:
    if k < 2 or not (n > 0):
        raise ValueError("args")
    q = (1 - p) / (k - 1)
    if not (q < p <= 1):
        raise ValueError("p")
    return (c - n * q) / (n * (p - q))


_V4 = re.compile(r"(0|[1-9][0-9]{0,2})\.(0|[1-9][0-9]{0,2})\.(0|[1-9][0-9]{0,2})\.(0|[1-9][0-9]{0,2})")
_HEX = re.compile(r"[0-9a-fA-F]{1,4}")


def mask_ip(ip: str, v4_prefix: int = 24, v6_prefix: int = 48) -> Optional[str]:
    if not (0 <= v4_prefix <= 32):
        raise ValueError("v4_prefix")
    if not (0 <= v6_prefix <= 128):
        raise ValueError("v6_prefix")
    m = _V4.fullmatch(ip)
    if m:
        o = [int(x) for x in m.groups()]
        if any(x > 255 for x in o):
            return None
        out = []
        for i, x in enumerate(o):
            bits = max(0, min(8, v4_prefix - 8 * i))
            out.append(str(0 if bits == 0 else x & ((0xFF << (8 - bits)) & 0xFF)))
        return ".".join(out)
    if ":" not in ip:
        return None
    halves = ip.split("::")
    if len(halves) > 2:
        return None

    def parse(s: str) -> Optional[list[int]]:
        if s == "":
            return []
        parts = s.split(":")
        if all(_HEX.fullmatch(x) for x in parts):
            return [int(x, 16) for x in parts]
        return None

    left = parse(halves[0])
    right = parse(halves[1]) if len(halves) == 2 else []
    if left is None or right is None:
        return None
    if len(halves) == 2:
        if len(left) + len(right) > 7:
            return None
        groups = left + [0] * (8 - len(left) - len(right)) + right
    else:
        if len(left) != 8:
            return None
        groups = left
    out = []
    for i, g in enumerate(groups):
        bits = max(0, min(16, v6_prefix - 16 * i))
        out.append(format(0 if bits == 0 else g & ((0xFFFF << (16 - bits)) & 0xFFFF), "x"))
    return ":".join(out)


def _fold(s: str) -> str:
    return "".join(chr(ord(c) + 32) if "A" <= c <= "Z" else c for c in s)


def mask_domain(host: str, keep: int = 2) -> Optional[str]:
    if keep < 1:
        raise ValueError("keep")
    h = _fold(host)
    if h.endswith("."):
        h = h[:-1]
    if h == "" or len(h) > 253:
        return None
    labels = h.split(".")
    if any(l == "" for l in labels):
        return None
    return "*." + ".".join(labels[-keep:]) if len(labels) > keep else h


def mask_email(addr: str) -> Optional[str]:
    parts = addr.split("@")
    if len(parts) != 2 or parts[0] == "" or parts[1] == "":
        return None
    return parts[0][0] + "***@" + _fold(parts[1])
