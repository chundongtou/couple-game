const fs=await import('node:fs');
let s=fs.readFileSync('sim2.mjs','utf8');
s=s.replace(/for \(const relR of \[[^\]]*\]\) for \(const relPhi of \[[^\]]*\]\) for \(const relY of \[[^\]]*\]\)/, 'for (const relR of [1.10,1.22,1.34,1.46]) for (const relPhi of [128,135,142,150]) for (const relY of [0.80,0.90,1.00])');
s=s.replace(/for \(const sp of \[[^\]]*\]\) for \(const inw of \[[^\]]*\]\) for \(const vy of \[[^\]]*\]\) for \(const seed of \[[^\]]*\]\)/, 'for (const sp of [0.45,0.60,0.75,0.90,1.05]) for (const inw of [-1]) for (const vy of [-0.35,-0.65,-0.95]) for (const seed of [3,5,7,11,13,17])');
fs.writeFileSync('sim3.mjs',s);
