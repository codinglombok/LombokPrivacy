import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "python" / "src"))
from lombokprivacy import Pcg32, estimate_binary, mask_domain, mask_email, mask_ip, randomized_response

rng = Pcg32(2026)
n = 10000
yes = sum(1 for i in range(n) if randomized_response(i < 3000, 0.9, rng))
print("observed", yes, "estimated rate", f"{estimate_binary(yes, n, 0.9):.3f}")
print(mask_ip("192.168.1.77"), mask_ip("2001:db8:abcd:1234::1"))
print(mask_domain("a.b.example.com"), mask_email("user@Example.com"))
