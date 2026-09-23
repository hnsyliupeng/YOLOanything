import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  args: ['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-webgpu'],
  executablePath: '/tmp/chr/chromium', headless: true,
  defaultViewport: { width: 900, height: 600 },
  env: { ...process.env, LD_LIBRARY_PATH:'/tmp/chr:/tmp/chr/lib' },
});
const page = await browser.newPage();
await page.goto('chrome://version');
const info = await page.evaluate(() => document.body.innerText.slice(0, 1200));
console.log(info);
await browser.close();
