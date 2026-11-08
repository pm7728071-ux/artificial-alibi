const fs=require('fs');const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const mk=()=>{const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(e.message));
 const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/',virtualConsole:vc,
  beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>({createImageData:(x,y)=>({data:new Uint8ClampedArray(x*y*4)}),putImageData(){},fillRect(){},fillStyle:''});
   try{w.AudioContext=function(){return{currentTime:0,createOscillator:()=>({type:'',frequency:{value:0,exponentialRampToValueAtTime(){}},connect(){},start(){},stop(){}}),createGain:()=>({gain:{value:0,exponentialRampToValueAtTime(){}},connect(){}}),destination:{}}};}catch(e){}
   w.fetch=()=>Promise.reject(new Error('off'));}});
 return {w:dom.window,errs,d:dom.window.document};};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const {w,errs,d}=mk(); const $=s=>d.querySelector(s);
 await wait(600);
 console.log('title visible:', $('#titleScreen').classList.contains('on'), '| dossier cards:', d.querySelectorAll('.case').length);
 $('#btnCases').click(); await wait(100);
 console.log('dossier open:', $('#dossier').classList.contains('on'));
 d.querySelectorAll('.case')[1].click(); await wait(700);
 console.log('case02 loaded -> subject:', $('#subjNo').textContent, '| cam:', $('#camTitle').textContent);
 console.log('locker exhibits:', [...d.querySelectorAll('.ev .t')].map(x=>x.textContent).join(' | '));
 for(const k of ['seal','vial','radio']){ d.querySelector('.ev[data-ev="'+k+'"]').click(); await wait(2200); }
 console.log('after 3 exhibits -> contra:', w.__AA.S.contra, '| evidence:', Object.values(w.__AA.S.evidence).filter(Boolean).length);
 $('#lock').click(); await wait(200);
 console.log('verdict:', $('#verdictTitle').textContent, '|', $('#verdictTag').textContent);
 console.log('report suspect row:', $('#rSuspect').textContent);
 // randomized mode: innocent should win on release
 $('#replay')&&null; $('#modal').classList.remove('on');
 w.__AA.setCase('c03',{randomized:true,guilty:false});
 await wait(500);
 for(const k of ['core','autopsy','airlock']){ d.querySelector('.ev[data-ev="'+k+'"]').click(); await wait(2200); }
 $('#release').click(); await wait(200);
 console.log('randomized innocent + release ->', $('#verdictTitle').textContent, '|', $('#verdictTag').textContent);
 console.log('errors:', errs.length, errs.slice(0,2));
 w.close(); process.exit(0);
})();
