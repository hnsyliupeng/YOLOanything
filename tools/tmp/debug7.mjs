import { TestServer, launchBrowser } from '/home/user/YOLOanything/tests/lib.mjs';
import fs from 'node:fs';
import path from 'node:path';
const server = new TestServer(); await server.start();
const wgsl = fs.readFileSync(path.join('/home/user/YOLOanything/app/js/core/renderer.js'), 'utf8')
  .match(/const WGSL = \/\* wgsl \*\/ `([\s\S]*?)`;/)[1];
const html = `<!DOCTYPE html><html><body><canvas id=c width=640 height=360></canvas><pre id=out>running</pre><script>
const WGSL = ${JSON.stringify(wgsl)};
(async () => {
  const out = document.getElementById('out');
  const losses = [];
  const a = await navigator.gpu.requestAdapter();
  const d = await a.requestDevice({ label: 'test' });
  d.lost.then(info => losses.push(info.reason + '@' + (performance.now()|0)));
  d.addEventListener('uncapturederror', e => losses.push('UNCAPTURED:' + (e.error?.message||'?')));
  const ctx = document.getElementById('c').getContext('webgpu');
  ctx.configure({ device: d, format: navigator.gpu.getPreferredCanvasFormat(), alphaMode: 'opaque' });
  const mod = d.createShaderModule({ code: WGSL });
  const pipe = d.createRenderPipeline({ layout: 'auto', vertex: { module: mod, entryPoint: 'vs' }, fragment: { module: mod, entryPoint: 'fs', targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }] }, primitive: { topology: 'triangle-list' } });
  const uni = d.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  const bg = d.createBindGroup({ layout: pipe.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer: uni } }] });
  let frames = 0;
  const t0 = performance.now();
  function loop(t) {
    d.queue.writeBuffer(uni, 0, new Float32Array([(t - t0) / 1000, 640, 360, 0]));
    const enc = d.createCommandEncoder();
    const tex = ctx.getCurrentTexture();
    const pass = enc.beginRenderPass({ colorAttachments: [{ view: tex.createView(), clearValue: {r:0,g:0,b:0,a:1}, loadOp: 'clear', storeOp: 'store' }] });
    pass.setPipeline(pipe); pass.setBindGroup(0, bg); pass.draw(3); pass.end();
    d.queue.submit([enc.finish()]);
    frames++;
    if (t - t0 < 3000) requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  setTimeout(() => { out.textContent = JSON.stringify({ frames, losses }); }, 3400);
})();
</script></body></html>`;
fs.writeFileSync(server.root + '/looptest.html', html);
const browser = await launchBrowser();
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${server.port}/looptest.html`);
await new Promise(r => setTimeout(r, 4200));
console.log(await page.$eval('#out', el => el.textContent));
fs.unlinkSync(server.root + '/looptest.html');
await browser.close(); server.stop();
