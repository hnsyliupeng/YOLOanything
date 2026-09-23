import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  args: ['--no-sandbox','--disable-gpu-sandbox','--no-zygote','--disable-dev-shm-usage',
    '--enable-unsafe-webgpu','--use-gl=angle','--use-angle=swiftshader',
    '--use-vulkan','--enable-features=Vulkan'],
  executablePath: '/tmp/chr/chromium',
  headless: true,
  defaultViewport: { width: 1280, height: 720 },
  env: { ...process.env,
    LD_LIBRARY_PATH: '/tmp/chr:/tmp/chr/lib',
    VK_ICD_FILENAMES: '/tmp/chr/vk_swiftshader_icd.json',
    VK_DRIVER_FILES: '/tmp/chr/vk_swiftshader_icd.json',
  },
});
const page = await browser.newPage();
await page.goto('data:text/html,<h1 id=r>testing…</h1><script>async function t(){try{if(!navigator.gpu){document.getElementById("r").textContent="no-navigator-gpu";return}const a=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!a){document.getElementById("r").textContent="no-adapter";return}const i=a.info||{};const d=await a.requestDevice();document.getElementById("r").textContent=JSON.stringify({vendor:i.vendor,arch:i.architecture,desc:i.description,ok:!!d})}catch(e){document.getElementById("r").textContent="ERR:"+e.message}}t()</script>', {waitUntil:'load'});
await page.waitForFunction('document.getElementById("r").textContent!=="testing…"', {timeout: 20000});
console.log('WebGPU:', await page.$eval('#r', el => el.textContent));
await browser.close();
