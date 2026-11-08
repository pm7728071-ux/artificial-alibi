const fs=require('fs');const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(__dirname + '/../index.html','utf8');
const vc=new VirtualConsole();
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/',virtualConsole:vc,
 beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>({createImageData:(x,y)=>({data:new Uint8ClampedArray(x*y*4)}),putImageData(){},fillRect(){},fillStyle:''});w.fetch=()=>Promise.reject(new Error('off'));}});
const w=dom.window,$=s=>w.document.querySelector(s);const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{await wait(1200);$('#dbgRun').click();await wait(400);
 console.log($('#dbgOut').textContent.split(/(?=PASS|FAIL)/).map(s=>s.replace(/\s+/g,' ').trim()).filter(Boolean).join('\n'));
 w.close();process.exit(0);})();
