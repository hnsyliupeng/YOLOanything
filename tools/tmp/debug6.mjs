import { TestServer, launchBrowser } from '/home/user/YOLOanything/tests/lib.mjs';
import fs from 'node:fs';
const server = new TestServer(); await server.start();
const html = `<!DOCTYPE html><html><body><pre id=out>running</pre><script>
(async () => {
  const out = document.getElementById('out');
  const a = await navigator.gpu.requestAdapter();
  const d = await a.requestDevice();
  let losses = 0;
  d.lost.then(info => { losses++; document.getElementById('out').textContent += '\\nLOST#' + losses + ' reason=' + info.reason + ' t=' + (performance.now()|0); });
  // 保持引用，渲染一点东西
  const ctx = document.getElementById('c').getContext('webgpu');
  ctx.configure({ device: d, format: navigator.gpu.getPreferredCanvasFormat() });
  const t0 = performance.now();
  setTimeout(() => {
    out.textContent = (losses === 0 ? 'DEVICE_ALIVE_3S no-loss' : 'LOSSES=' + losses) + ' (start t=' + (t0|0) + ')';
  }, 3000);
})();
</script><canvas id=c width=64 height=64></canvas></body></html>`;
fs.writeFileSync(server.root + '/devicetest.html', html);
const browser = await launchBrowser();
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${server.port}/devicetest.html`);
await new Promise(r => setTimeout(r, 4000));
console.log(await page.$eval('#out', el => el.textContent));
fs.unlinkSync(server.root + '/devicetest.html');
await browser.close(); server.stop();
