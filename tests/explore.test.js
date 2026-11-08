const fs=require('fs');const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(e.message));
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/',virtualConsole:vc,
 beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>null;w.fetch=()=>Promise.reject(new Error('off'));
  w.speechSynthesis={getVoices:()=>[],speak(){},cancel(){}};w.SpeechSynthesisUtterance=function(){};
  w.THREE={WebGLRenderer:function(){throw new Error('no webgl in jsdom');}};}});
const w=dom.window,$=s=>w.document.querySelector(s);const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await wait(400);
 $('#btnRoom').click(); await wait(300);
 console.log('explore requested, closed after failure:', !$('#explore').classList.contains('on'));
 console.log('fallback room shown:', $('#theRoom').classList.contains('on'));
 console.log('log mentions fallback:', /3D ROOM UNAVAILABLE/.test($('#log').textContent));
 w.__AA.openObservationRoom(); await wait(150);
 const sits=w.document.querySelectorAll('.sit');
 console.log('parallax room open:', $('#theRoom').classList.contains('on'), '| subjects:', sits.length);
 w.dispatchEvent(new w.KeyboardEvent('keydown',{key:'d'}));
 await wait(400);
 const moved = Array.from(sits).map(s=>s.style.transform).filter(Boolean).length;
 console.log('subjects shifted when walking:', moved, 'of', sits.length);
 console.log('transform sample:', sits[0].style.transform);
 w.__AA.exitExplore(); await wait(50);
 console.log('exit is safe when inactive:', w.__AA.EX.active === false);
 console.log('errors:', errs.length, errs.slice(0,2));
 process.exit(0);
})();
