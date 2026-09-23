import { TestServer, launchBrowser } from '/home/user/YOLOanything/tests/lib.mjs';
import fs from 'node:fs';
const server = new TestServer(); await server.start();
fs.writeFileSync('/tmp/maptest.html', `<!DOCTYPE html><html><body><canvas id=c width=320 height=180></canvas><pre id=out>running</pre><script>
(async () => {
  const out = document.getElementById('out');
  try {
    const a = await navigator.gpu.requestAdapter();
    const d = await a.requestDevice();
    const ctx = document.getElementById('c').getContext('webgpu');
    ctx.configure({ device: d, format: navigator.gpu.getPreferredCanvasFormat(), alphaMode: 'opaque' });
    const enc = d.createCommandEncoder();
    const tex = ctx.getCurrentTexture();
    const bpr = Math.ceil(320 * 4 / 256) * 256;
    const buf = d.createBuffer({ size: bpr * 180, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
    enc.copyTextureToBuffer({ texture: tex }, { buffer: buf, bytesPerRow: bpr, rowsPerImage: 180 }, { width: 320, height: 180 });
    d.queue.submit([enc.finish()]);
    await buf.mapAsync(GPUMapMode.READ);
    const arr = new Uint8Array(buf.getMappedRange());
    let sum = 0; for (let i = 0; i < 4000; i++) sum += arr[i];
    out.textContent = 'mapOK sum=' + sum + ' fmt=' + navigator.gpu.getPreferredCanvasFormat();
  } catch (e) { out.textContent = 'ERR ' + e.name + ': ' + e.message; }
})();
</script></body></html>`);
const browser = await launchBrowser();
const page = await browser.newPage();
await page.goto('http://127.0.0.1:' + server.port + '/__nonexistent__').catch(()=>{});
// 直接注入 HTML 文件不可达 —— 用 data: 不行(非安全上下文)，改为临时挂到 server root
fs.copyFileSync('/tmp/maptest.html', server.root + '/maptest.html');
await page.goto(`http://127.0.0.1:${server.port}/maptest.html`);
await page.waitForFunction('document.getElementById("out").textContent !== "running"', { timeout: 15000 });
console.log(await page.$eval('#out', el => el.textContent));
fs.unlinkSync(server.root + '/maptest.html');
await browser.close(); server.stop();
