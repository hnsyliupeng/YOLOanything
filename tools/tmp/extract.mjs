import { brotliDecompressSync } from 'node:zlib';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const pkg = 'node_modules/@sparticuz/chromium/bin';
const out = '/tmp/chr';
fs.mkdirSync(out, { recursive: true });
for (const f of ['al2023', 'fonts', 'swiftshader']) {
  const dst = path.join(out, `${f}.tar`);
  fs.writeFileSync(dst, brotliDecompressSync(fs.readFileSync(path.join(pkg, `${f}.tar.br`))));
  execSync(`tar -xf ${dst} -C ${out}`); fs.unlinkSync(dst);
  console.log('extracted', f);
}
// chromium 主程序（.br 为单文件压缩）
const exe = path.join(out, 'chromium');
fs.writeFileSync(exe, brotliDecompressSync(fs.readFileSync(path.join(pkg, 'chromium.br'))));
fs.chmodSync(exe, 0o755);
console.log('chromium binary ready');
