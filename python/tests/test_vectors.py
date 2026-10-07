import json
import math
import pathlib
import sys

import pytest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "src"))
import lombokprivacy as P  # noqa: E402

V = json.loads((pathlib.Path(__file__).resolve().parents[2] / "vectors" / "lombokprivacy-vectors-v1.json").read_text("utf-8"))


def close(a, b):
    if b == "inf":
        return a == math.inf
    return abs(a - b) <= V["tolerance"]["epsilon"] * max(1.0, abs(b))


def test_count():
    assert V["caseCount"] >= 100


def test_pcg_reference():
    r = P.Pcg32(42, 54)
    assert [r.next_u32() for _ in range(6)] == [0xA15C02B7, 0x7B47F409, 0xBA1D3330, 0x83D2F293, 0xBFA4784B, 0xCBED606E]


def test_pcg():
    for s in V["pcg"]:
        r = P.Pcg32(int(s["seed"]), int(s["seq"]))
        assert [r.next_u32() for _ in s["u32"]] == s["u32"]
        assert [r.next_float() for _ in s["floats"]] == s["floats"]
        for b in s["bounded"]:
            assert r.next_bounded(b["n"]) == b["v"]


def test_rr_grr():
    for c in V["rr"]:
        r = P.Pcg32(int(c["seed"]), int(c["seq"]))
        assert [P.randomized_response(b, c["p"], r) for b in c["in"]] == c["out"]
    for c in V["grr"]:
        r = P.Pcg32(int(c["seed"]), int(c["seq"]))
        assert [P.grr(x, c["k"], c["p"], r) for x in c["in"]] == c["out"]


def test_epsilon_estimate():
    for e in V["epsilon"]:
        got = P.epsilon_binary(e["p"]) if e["fn"] == "binary" else P.epsilon_grr(e["p"], e["k"])
        assert close(got, e["v"]), e
    for e in V["estimate"]:
        got = P.estimate_binary(e["c"], e["n"], e["p"]) if e["fn"] == "binary" else P.estimate_grr(e["c"], e["n"], e["p"], e["k"])
        assert got == e["v"], e


def test_masks():
    for c in V["maskIp"]:
        assert P.mask_ip(c["ip"], c["v4"], c["v6"]) == c["out"], c
    for c in V["maskDomain"]:
        assert P.mask_domain(c["host"], c["keep"]) == c["out"], c
    for c in V["maskEmail"]:
        assert P.mask_email(c["addr"]) == c["out"], c


def test_invalid():
    with pytest.raises(ValueError):
        P.Pcg32(-1)
    with pytest.raises(ValueError):
        P.randomized_response(True, 0.4, P.Pcg32(1))
    with pytest.raises(ValueError):
        P.mask_ip("1.2.3.4", 33)


def test_invalid_more():
    with pytest.raises(ValueError):
        P.grr(5, 5, 0.9, P.Pcg32(1))
    with pytest.raises(ValueError):
        P.estimate_binary(1, 1, 0.5)
    with pytest.raises(ValueError):
        P.estimate_binary(1, 0, 0.9)
    with pytest.raises(ValueError):
        P.estimate_grr(1, 1, 0.25, 4)
    with pytest.raises(ValueError):
        P.estimate_grr(1, 0, 0.9, 4)
