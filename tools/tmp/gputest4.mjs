import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  args: ['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-webgpu','--use-gl=angle','--use-angle=swiftshader','--use-vulkan'],
  executablePath: '/tmp/chr/chromium', headless: true,
  defaultViewport: { width: 900, height: 600 },
  env: { ...process.env, LD_LIBRARY_PATH:'/tmp/chr:/tmp/chr/lib',
    VK_ICD_FILENAMES:'/tmp/chr/vk_swiftshader_icd.json', VK_DRIVER_FILES:'/tmp/chr/vk_swiftshader_icd.json' },
});
const page = await browser.newPage();
await page.goto('http://127.0.0.1:8901/gpu.html');
await page.waitForFunction('document.getElementById("r").textContent !== "testing"', { timeout: 20000 });
console.log('RESULT:', await page.$eval('#r', el => el.textContent));
await browser.close();
