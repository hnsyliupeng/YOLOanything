import fs from 'node:fs'; import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { TestServer, resultsDir } from './lib.mjs';
const REPO=path.resolve(import.meta.dirname,'..');
const OUT=resultsDir('multimodal');
const IMG=path.join(REPO,'data/datasets/water_trash/images/val/vid_000438_frame0000032.jpg');
const server=new TestServer(); await server.start();
const browser=await puppeteer.launch({args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu-sandbox','--no-zygote','--disable-accelerated-2d-canvas','--enable-unsafe-webgpu','--use-gl=angle','--use-angle=swiftshader','--use-vulkan','--hide-scrollbars','--mute-audio'],executablePath:'/tmp/chr/chromium',headless:true,protocolTimeout:300000,defaultViewport:{width:1600,height:900},env:{...process.env,LD_LIBRARY_PATH:'/tmp/chr:/tmp/chr/lib',VK_ICD_FILENAMES:'/tmp/chr/vk_swiftshader_icd.json',VK_DRIVER_FILES:'/tmp/chr/vk_swiftshader_icd.json'}});
try{
  const page=await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.port}/index.html`,{waitUntil:'networkidle0',timeout:30000});
  await page.waitForFunction('window.__AQUASCAN__ && window.__AQUASCAN__.ready === true',{timeout:20000});
  await page.evaluate(()=>{const H=window.__AQUASCAN__;H.state.models.detect='yolo26n-water-fused-320';H.state.models.depth='dav2-lite-256';H.state.thresholds.conf=0.12;});
  await page.click('#btn-load-models');
  await page.waitForFunction(()=>!!window.__AQUASCAN__?.state?.models?.loaded?.detect,{timeout:90000,polling:500});
  await page.waitForFunction(()=>!!window.__AQUASCAN__?.depthSession,{timeout:120000,polling:1000});
  await (await page.$('#file-input')).uploadFile(IMG);
  await page.waitForFunction(()=>!!window.__AQUASCAN__?.media?.bitmap,{timeout:15000,polling:300});
  await page.click('#btn-run');
  await page.waitForFunction(()=>!!window.__AQUASCAN__?.lastResult,{timeout:60000,polling:400});
  await new Promise(r=>setTimeout(r,1200));
  const d=await page.evaluate(()=>{
    const H=window.__AQUASCAN__;
    const ov=document.getElementById('overlay-canvas');
    const boxes=H.lastResult.dets.map(x=>({cls:x.cls,score:+x.score.toFixed(2),box:x.box.map(v=>Math.round(v)),depth:x.depth==null?null:+x.depth.toFixed(3)}));
    // 叠加层放大2.5x 合成到媒体上 → 可视放大证据
    const mc=document.getElementById('media-canvas');
    const Z=2.5;
    const ex=document.createElement('canvas'); ex.width=mc.width*Z; ex.height=mc.height*Z;
    const g=ex.getContext('2d'); g.imageSmoothingEnabled=false;
    g.drawImage(mc,0,0,ex.width,ex.height);
    g.drawImage(ov,0,0,ex.width,ex.height);
    return {boxes,ovSize:[ov.width,ov.height],png:ex.toDataURL('image/png')};
  });
  fs.writeFileSync(path.join(OUT,'r8_fused检测放大2.5x.png'),Buffer.from(d.png.replace(/^data:image\/png;base64,/,''),'base64'));
  console.log('dets:',JSON.stringify(d.boxes,null,1),'overlay:',d.ovSize);
  console.log('📸 r8_fused检测放大2.5x.png');
}finally{await browser.close().catch(()=>{});server.stop();}
