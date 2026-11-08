const fs=require('fs');const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const errs=[];let ops=0;
const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(e.message));
function ctx(){const g={addColorStop(){}};
 const c={beginPath(){ops++},moveTo(){ops++},lineTo(){ops++},quadraticCurveTo(){ops++},
  closePath(){},fill(){ops++},stroke(){ops++},ellipse(){ops++},arc(){ops++},fillRect(){ops++},
  createLinearGradient:()=>g,createRadialGradient:()=>g,putImageData(){},
  set fillStyle(v){},set strokeStyle(v){},set lineWidth(v){}};
 return c;}
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/',virtualConsole:vc,
 beforeParse(w){
  w.HTMLCanvasElement.prototype.getContext=()=>ctx();
  w.AudioContext=function(){return{currentTime:0,destination:{},
    createOscillator:()=>({frequency:{value:0,exponentialRampToValueAtTime(){}},connect(){},start(){},stop(){}}),
    createGain:()=>({gain:{value:0,exponentialRampToValueAtTime(){}},connect(){}})};};
  w.fetch=()=>Promise.reject(new Error('off'));
 }});
const w=dom.window,$=s=>w.document.querySelector(s);const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await wait(700);
 console.log('draw calls:',ops,'| monitorLive:',!!(w.__AA&&w.__AA.monitorLive));
 const gl=$('#glitch');
 w.__AA.S.stress=100; w.__AA.S.jolt=Date.now(); await wait(300);
 console.log('contradiction/high stress -> hot:',gl.classList.contains('hot'));
 w.__AA.S.stress=10; w.__AA.S.jolt=0; await wait(2100);
 console.log('calmed down -> hot:',gl.classList.contains('hot'));
 w.__AA.setCase('c03'); await wait(200);
 console.log('case03 cam:',$('#camNo').textContent,'|',$('#camSubj').textContent);
 console.log('errors:',errs.length,errs.slice(0,2));
 process.exit(0);
})();
