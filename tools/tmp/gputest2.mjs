import puppeteer from 'puppeteer-core';
async function tryLaunch(name, args, env) {
  const browser = await puppeteer.launch({
    args, executablePath: '/tmp/chr/chromium', headless: true,
    defaultViewport: { width: 900, height: 600 }, env: { ...process.env, ...env },
  });
  const page = await browser.newPage();
  await page.goto('data:text/html,<div id=r>t</div><script>navigator.gpu?document.getElementById("r").textContent="gpu-object-present":document.getElementById("r").textContent="missing"</script>');
  const r = await page.$eval('#r', el => el.textContent);
  console.log(name, '=>', r);
  await browser.close();
  return r;
}
const base = ['--no-sandbox','--disable-dev-shm-usage'];
await tryLaunch('A: bare', base, { LD_LIBRARY_PATH:'/tmp/chr:/tmp/chr/lib' });
await tryLaunch('B: webgpu-feature', [...base,'--enable-features=WebGPU,WebGPUService'], { LD_LIBRARY_PATH:'/tmp/chr:/tmp/chr/lib' });
await tryLaunch('C: vulkan+swiftshader', [...base,'--enable-features=Vulkan,WebGPU','--use-vulkan','--use-gl=angle','--use-angle=swiftshader'],
  { LD_LIBRARY_PATH:'/tmp/chr:/tmp/chr/lib', VK_ICD_FILENAMES:'/tmp/chr/vk_swiftshader_icd.json', VK_DRIVER_FILES:'/tmp/chr/vk_swiftshader_icd.json' });
