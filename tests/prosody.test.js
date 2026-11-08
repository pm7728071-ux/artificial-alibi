const fs=require('fs');const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errs.push(e.message));
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/',virtualConsole:vc,
 beforeParse(w){
  w.HTMLCanvasElement.prototype.getContext=()=>null;
  w.__spoken=[];
  const ac=function(){return{currentTime:0,destination:{},sampleRate:44100,
    createBuffer:(c,l)=>({getChannelData:()=>new Float32Array(l)}),
    createBufferSource:()=>({buffer:null,loop:false,connect(){},start(){}}),
    createBiquadFilter:()=>({type:'',frequency:{value:0},connect(){}}),
    createGain:()=>({gain:{value:0,cancelScheduledValues(){},setTargetAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}),
    createOscillator:()=>({frequency:{value:0,exponentialRampToValueAtTime(){}},connect(){},start(){},stop(){}})};};
  w.AudioContext=ac;w.webkitAudioContext=ac;
  w.speechSynthesis={getVoices:()=>[{lang:'en-GB',name:'Daniel',localService:true},{lang:'en-US',name:'Google US English',localService:false}],cancel(){},
    speak(u){w.__spoken.push(u);if(u.onstart)u.onstart();setTimeout(()=>{if(u.onend)u.onend();},4);}};
  w.SpeechSynthesisUtterance=function(t){this.text=t;this.pitch=1;this.rate=1;this.volume=1;};
  w.fetch=()=>Promise.reject(new Error('off'));
 }});
const w=dom.window;const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await wait(400);
 const plan=w.__AA.planPhrases("Blood? It is grease and rust. You put a wrench in a housing full of hot metal, detective, and tell me what colour your hands come out.");
 console.log('phrases:', plan.length, '->', plan.map(p=>p.text.slice(0,18)).join(' | '));
 const first=plan[0].pitchMul, last=plan[plan.length-1].pitchMul;
 console.log('declination:', first.toFixed(3), '->', last.toFixed(3), '| falls:', first>last);
 const q=plan.find(p=>p.q); console.log('question lift present:', !!q && q.pitchMul>0.9);
 console.log('pause variety:', Array.from(new Set(plan.map(p=>p.pauseAfter))).sort((a,b)=>a-b).join(','));
 w.__AA.setCase('c01'); await wait(100); w.__spoken.length=0;
 w.__AA.speakLine("I was in Sector B. The coolant pipe had a hairline fracture, detective. That is my whole night.");
 await wait(400);
 const ps=w.__spoken.map(u=>u.pitch), rs=w.__spoken.map(u=>u.rate);
 console.log('utterances:', w.__spoken.length, '| pitches:', ps.map(p=>p.toFixed(2)).join(','));
 console.log('rates in natural band:', rs.every(r=>r>=0.85 && r<=1.36), '| voice:', w.__spoken[0] && w.__spoken[0].voice && w.__spoken[0].voice.name);
 console.log('errors:', errs.length, errs.slice(0,2));
 process.exit(0);
})();
