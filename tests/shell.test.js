const fs=require('fs');const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(e.message));
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.test/',virtualConsole:vc,
 beforeParse(w){w.HTMLCanvasElement.prototype.getContext=()=>null;w.fetch=()=>Promise.reject(new Error('off'));
  w.__spoken=[];w.speechSynthesis={getVoices:()=>[{lang:'en-US',name:'Google US English',localService:false},{lang:'en-GB',name:'Daniel'}],speak(u){w.__spoken.push(u);if(u.onstart)u.onstart();setTimeout(()=>u.onend&&u.onend(),5);},cancel(){}};
  w.SpeechSynthesisUtterance=function(t){this.text=t;this.pitch=1;this.rate=1;this.volume=1;};}});
const w=dom.window,$=s=>w.document.querySelector(s);const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await wait(500);
 console.log('continue hidden with no save:', $('#btnCont').style.display === 'none');
 $('#btnRoom').click(); await wait(120);
 w.__AA.openObservationRoom(); await wait(120); w.document.querySelectorAll('.sit')[0].click(); await wait(250);
 console.log('save recorded:', w.localStorage.getItem('alibi.save') !== null, '| case:', w.__AA.S.caseId);
 $('#say').value='Where were you that night?'; $('#ask').click(); await wait(2100);
 const sp=w.__spoken;
 console.log('utterances for one reply:', sp.length, '| pitches:', sp.map(u=>u.pitch.toFixed(2)).join(','));
 console.log('natural pitch range:', sp.every(u=>u.pitch>0.6&&u.pitch<1.35));
 $('#btnSettings').click(); await wait(80);
 console.log('settings open:', $('#settings').classList.contains('on'), '| voice options:', $('#setVoiceName').options.length);
 $('#setVoice').checked=false; $('#setVoice').dispatchEvent(new w.Event('change')); $('#setClose').click(); await wait(60);
 console.log('voice off persisted:', JSON.parse(w.localStorage.getItem('alibi.settings')).voiceOn === false);
 w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'})); await wait(60);
 console.log('ESC pauses:', $('#pause').classList.contains('on'));
 $('#pResume').click(); await wait(60);
 console.log('resume works:', !$('#pause').classList.contains('on'));
 console.log('errors:', errs.length, errs.slice(0,2));
 process.exit(0);
})();
