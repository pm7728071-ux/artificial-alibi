const fs=require('fs');const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(e.message));
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/',virtualConsole:vc,
 beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>null;w.fetch=()=>Promise.reject(new Error('off'));
  w.speechSynthesis={getVoices:()=>[],speak(){},cancel(){}};w.SpeechSynthesisUtterance=function(){};}});
const w=dom.window,$=s=>w.document.querySelector(s);const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await wait(500);
 w.__AA.openObservationRoom(); await wait(150);
 const sits=w.document.querySelectorAll('.sit');
 console.log('room open:', $('#theRoom').classList.contains('on'), '| subjects seated:', sits.length);
 console.log('photos:', Array.from(sits).map(s=>s.querySelector('img').getAttribute('src')).join(' | '));
 console.log('plates:', Array.from(sits).map(s=>s.querySelector('.plate b').textContent.trim()).join(' | '));
 sits[1].click(); await wait(200);
 console.log('clicked 2nd -> case:', w.__AA.S.caseId, '| cam:', $('#camNo').textContent, '| badge:', $('#bioPhoto').getAttribute('src'));
 console.log('room closed on entry:', !$('#theRoom').classList.contains('on'));
 console.log('dossier thumbs:', w.document.querySelectorAll('#dossierGrid .thumb').length);
 console.log('errors:', errs.length, errs.slice(0,2));
 process.exit(0);
})();
