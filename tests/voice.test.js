const fs=require('fs');const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(e.message));
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/',virtualConsole:vc,
 beforeParse(w){
  w.HTMLCanvasElement.prototype.getContext=()=>null;
  w.speechSynthesis={getVoices:()=>[{lang:'en-GB',name:'Test'}],speak(u){w.__spoken.push(u);if(u.onstart)u.onstart();},cancel(){}};
  w.__spoken=[];w.SpeechSynthesisUtterance=function(t){this.text=t;this.pitch=1;this.rate=1;this.volume=1;};
  w.SpeechRecognition=function(){const s=this;s.start=function(){if(s.onstart)s.onstart();w.__rec=s;};s.stop=function(){if(s.onend)s.onend();};};
  w.fetch=()=>Promise.reject(new Error('off'));
 }});
const w=dom.window,$=s=>w.document.querySelector(s);const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await wait(500);
 w.__AA.setCase('c01'); await wait(120);
 $('#say').value='Where were you at two in the morning?'; $('#ask').click();
 await wait(1900);
 const sp=w.__spoken, u=sp[sp.length-1];
 console.log('case01 voice -> pitch', u.pitch, 'rate', u.rate, '| speaks:', !!u.text);
 console.log('lip-sync active during speech:', w.__AA.SPEECH.speaking === true);
 w.__AA.setCase('c02'); await wait(120);
 w.__spoken.length=0; $('#say').value='Did you release the pathogen?'; $('#ask').click(); await wait(1900);
 const u2=w.__spoken[w.__spoken.length-1];
 console.log('case02 voice -> pitch', u2.pitch, 'rate', u2.rate);
 w.__spoken.length=0; $('#navSfx').click(); await wait(60);
 $('#say').value='Doctor, answer me.'; $('#ask').click(); await wait(1900);
 console.log('SFX off -> utterances:', w.__spoken.length);
 w.__spoken.length=0; $('#navSfx').click(); await wait(60);
 $('#mic').click(); await wait(60);
 console.log('mic listening:', $('#mic').classList.contains('listening'));
 const interim=[[{transcript:'Why did you'}]];
 w.__rec.onresult({results:interim}); await wait(80);
 console.log('interim transcript -> input:', JSON.stringify($('#say').value), '| speaking flag:', w.__AA.SPEECH.speaking);
 const fin=[[{transcript:'Why did you do it?'}]]; fin[0].isFinal=true;
 w.__rec.onresult({results:fin}); await wait(260);
 console.log('final transcript submits -> questions:', w.__AA.S.qs, '| input cleared:', $('#say').value === '');
 console.log('errors:', errs.length, errs.slice(0,2));
 process.exit(0);
})();
