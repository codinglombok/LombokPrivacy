import { Pcg32, estimateBinary, maskDomain, maskEmail, maskIp, randomizedResponse } from "../typescript/src/index.ts";

const rng = new Pcg32(2026n);
const n = 10000;
let yes = 0;
for (let i = 0; i < n; i++) if (randomizedResponse(i < 3000, 0.9, rng)) yes++;
console.log("observed", yes, "estimated rate", estimateBinary(yes, n, 0.9).toFixed(3));
console.log(maskIp("192.168.1.77"), maskIp("2001:db8:abcd:1234::1"));
console.log(maskDomain("a.b.example.com"), maskEmail("user@Example.com"));
