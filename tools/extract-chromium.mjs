/**
 * 从 @sparticuz/chromium 包解出浏览器 + SwiftShader 到 /tmp/chr
 * （/tmp 在轮次间会被清理，测试前如缺失请运行: node tools/extract-chromium.mjs）
 */
import { brotliDecompressSync } from 'node:zlib';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = path.join(path.dirname(fileURLToPath(import.meta.url)), 'node_modules', '@sparticuz/chromium', 'bin');
const out = '/tmp/chr';
fs.mkdirSync(out, { recursive: true });
for (const f of ['al2023', 'fonts', 'swiftshader']) {
  const dst = path.join(out, `${f}.tar`);
  fs.writeFileSync(dst, brotliDecompressSync(fs.readFileSync(path.join(pkg, `${f}.tar.br`))));
  execSync(`tar -xf ${dst} -C ${out}`); fs.unlinkSync(dst);
  console.log('extracted', f);
}
const exe = path.join(out, 'chromium');
fs.writeFileSync(exe, brotliDecompressSync(fs.readFileSync(path.join(pkg, 'chromium.br'))));
fs.chmodSync(exe, 0o755);
console.log('chromium ready →', exe);
