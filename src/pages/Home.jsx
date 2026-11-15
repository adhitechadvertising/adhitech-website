import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { services } from '../data/services';
import { galleryCategories } from '../data/gallery';
import MagneticButton from '../components/MagneticButton';
import PageMeta from '../components/PageMeta';

// Step-by-step animation of how a Liquid Acrylic letter is made. It runs inside its own
// small page (an iframe) so its styles and script never touch the rest of the site.
const LIQUID_PROCESS_HTML = String.raw`<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>How a liquid acrylic letter is made</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<style>
/* Layout: a workshop bench. One 3D stage holds the whole word; the caption, transport controls and an eight-step rail sit below it. */
:root{
  --bg:#EDEFF1; --panel:#F8F9FA; --bench:#DDE2E6; --grid:#C9D0D6;
  --ink:#161C22; --muted:#56636D; --line:#C5CCD2;
  --wall:#E4E9ED; --glassBed:#BFE0D8;
  --acry:#1E6EE0; --acp:#D5DADF; --sheet:#9FA8B0; --sil:#8A949D;
  --led:#FFF0BE; --cut:#E5560A;
  --night:#080B10; --glow:#78B4FF;
  --f-display:'Barlow Condensed','Arial Narrow',sans-serif;
  --f-body:'Barlow',system-ui,-apple-system,'Segoe UI',sans-serif;
  --f-mono:'IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --bg:#0F1318; --panel:#161B21; --bench:#1B222A; --grid:#2A343E;
    --ink:#E7ECF0; --muted:#93A0AB; --line:#2D3640;
    --wall:#D9DEE2; --glassBed:#2D5550;
    --acry:#3A86FF; --acp:#6A747E; --sheet:#3F4851; --sil:#A9B4BE;
    --led:#FFE9A0; --cut:#FF7A2F;
    --night:#05070A; --glow:#6FB0FF;
    color-scheme:dark;
  }
}
:root[data-theme="dark"]{
  --bg:#0F1318; --panel:#161B21; --bench:#1B222A; --grid:#2A343E;
  --ink:#E7ECF0; --muted:#93A0AB; --line:#2D3640;
  --wall:#D9DEE2; --glassBed:#2D5550;
  --acry:#3A86FF; --acp:#6A747E; --sheet:#3F4851; --sil:#A9B4BE;
  --led:#FFE9A0; --cut:#FF7A2F;
  --night:#05070A; --glow:#6FB0FF;
  color-scheme:dark;
}
*{box-sizing:border-box}
[hidden]{display:none!important}
html,body{overflow:hidden}
body{
  margin:0; background:#0A0A0A; color:var(--ink); font-family:var(--f-body); font-size:16px; line-height:1.5;
  padding:0;
}
.wrap{max-width:none;margin:0;display:flex;flex-direction:column;gap:18px}
.head{display:flex;flex-direction:column;gap:4px}
h1{font-family:var(--f-display);font-weight:700;font-size:clamp(36px,7vw,60px);line-height:1;letter-spacing:.02em;text-transform:uppercase;margin:0;text-wrap:balance}
.sub{margin:0;color:var(--muted);max-width:66ch}
.stage{position:relative;margin:0;border:1px solid var(--line);border-radius:6px;overflow:hidden;background:var(--bg);aspect-ratio:16/9;min-width:0}
@media (max-width:620px){.stage{aspect-ratio:4/3}}
.stage canvas{display:block;width:100%;height:100%;touch-action:pan-y}
.chip{position:absolute;left:12px;bottom:12px;max-width:calc(100% - 24px);font:500 12px var(--f-mono);letter-spacing:.02em;background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:4px;padding:6px 10px}
.cam{position:absolute;right:12px;top:12px;font:600 12px var(--f-mono);background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:4px;padding:6px 10px;cursor:pointer}
.cam:hover{border-color:var(--muted)}
.hint{position:absolute;left:12px;top:12px;font:500 11px var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);background:var(--panel);border:1px solid var(--line);border-radius:4px;padding:6px 10px}
.msg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;background:var(--panel);color:var(--ink);font:500 14px var(--f-mono)}
.caption{display:flex;flex-wrap:wrap;gap:12px 28px;align-items:flex-start;justify-content:space-between;border-top:2px solid var(--ink);padding-top:14px}
.cap{flex:1 1 380px;min-width:0}
.cap-step{font:500 11px var(--f-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.cap h2{font-family:var(--f-display);font-weight:700;font-size:30px;line-height:1.1;margin:2px 0 6px;text-transform:uppercase;letter-spacing:.03em}
.cap p{margin:0;max-width:64ch;min-height:4.5em}
.spec{font:500 12px var(--f-mono);border:1px solid var(--line);background:var(--panel);padding:6px 10px;border-radius:4px;color:var(--ink);align-self:flex-start}
.controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.btn{font:600 13px var(--f-mono);border:1px solid var(--line);background:var(--panel);color:var(--ink);padding:8px 14px;border-radius:4px;cursor:pointer;min-height:38px}
.btn:hover{border-color:var(--muted)}
.btn.primary{background:var(--ink);color:var(--bg);border-color:var(--ink);min-width:92px}
.btn:focus-visible,.cam:focus-visible,.rail button:focus-visible,select:focus-visible,input[type=range]:focus-visible{outline:2px solid var(--acry);outline-offset:2px}
.scrub{flex:1 1 220px;min-width:0;accent-color:var(--acry);height:24px;margin:0}
.time{font:500 12px var(--f-mono);color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
select{font:500 12px var(--f-mono);background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:4px;padding:8px 8px;min-height:38px}
.rail{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(8,1fr);gap:6px}
.rail li{min-width:0}
.rail button{position:relative;width:100%;height:100%;text-align:left;background:var(--panel);color:var(--muted);border:1px solid var(--line);border-radius:4px;padding:8px 8px 12px;cursor:pointer;display:flex;flex-direction:column;gap:2px;overflow:hidden}
.rail .n{font:500 11px var(--f-mono)}
.rail .t{font:600 13px/1.2 var(--f-body);color:var(--ink)}
.rail button::after{content:"";position:absolute;left:0;bottom:0;height:3px;width:var(--p,0%);background:var(--acry)}
.rail button.is-now{border-color:var(--ink)}
.rail button.is-done{color:var(--ink)}
@media (max-width:820px){.rail{grid-template-columns:repeat(4,1fr)}}
@media (max-width:420px){.rail{grid-template-columns:repeat(2,1fr)}.btn{padding:8px 10px}.hint{display:none}}
@media (pointer:coarse){.hint{display:none}}
</style>
</head>
<body>
<main class="wrap">
  <figure class="stage" id="stage">
    <canvas id="gl" aria-label="3D animation of the ADHITECH letters being made"></canvas>
    <div class="hint">Drag to orbit</div>
    <button class="cam" id="camBtn" type="button">Auto camera</button>
    <div class="chip" id="topLab"></div>
    <div class="msg" id="stageMsg" hidden></div>
  </figure>

  <section class="caption" aria-live="off">
    <div class="cap">
      <div class="cap-step" id="capStep"></div>
      <h2 id="capTitle"></h2>
      <p id="capText"></p>
    </div>
    <div class="spec" id="capSpec"></div>
  </section>

  <div class="controls">
    <button class="btn" id="btnPrev" type="button" aria-label="Previous step">Prev</button>
    <button class="btn primary" id="btnPlay" type="button">Pause</button>
    <button class="btn" id="btnNext" type="button" aria-label="Next step">Next</button>
    <input class="scrub" id="scrub" type="range" min="0" max="1000" step="1" value="0" aria-label="Animation position">
    <span class="time" id="timeT">0.0 / 0 s</span>
    <label class="time" for="speed" style="display:flex;gap:6px;align-items:center">Speed
      <select id="speed"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option></select>
    </label>
  </div>

  <ol class="rail" id="rail"></ol>
</main>

<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
<script>
(function(){
  var $=function(id){return document.getElementById(id);};
  var clamp=function(x,a,b){a=a===undefined?0:a;b=b===undefined?1:b;return Math.min(b,Math.max(a,x));};
  var seg=function(u,a,b){return clamp((u-a)/(b-a));};
  var ease=function(t){return t*t*(3-2*t);};
  var lerp=function(a,b,t){return a+(b-a)*t;};
  var nz=function(v){return Math.abs(v)<.001?(v<0?-.001:.001):v;};

  var STAGES=[
    {name:'Artwork',dur:5,text:'ADHITECH is set as vector outlines, one per letter, at 300 mm letter height. The outlines drive both the channels and the back plates.',spec:'300 mm letters'},
    {name:'Channel',dur:6,text:'An aluminium or 3D-printed channel is made to follow each letter outline. It forms the side walls of the letter.',spec:'Aluminium or 3D printed'},
    {name:'Glass bed',dur:4,text:'The channels are set on a flat, levelled glass bed. The glass gives the finished face its smooth gloss.',spec:'Flat, levelled glass'},
    {name:'Pour',dur:10,text:'Ready-mixed liquid acrylic is poured into each channel. It lands, spreads out to the walls and levels itself into a layer 3–4 mm thick.',spec:'3–4 mm liquid acrylic'},
    {name:'Cure, lift',dur:7,text:'The liquid acrylic cures flat on the glass. Once set, the acrylic and channel lift off the glass together as one piece.',spec:'Cures flat on the glass'},
    {name:'Back plate',dur:9,text:'The back plate is cut from ACP sheet on a CNC router, with rivet holes. The plate is cut mirrored, so it reads correctly once it is flipped onto the channel. An LED strip is fixed to it with the LEDs at an even spacing, so the face lights evenly.',spec:'ACP sheet, CNC cut'},
    {name:'Join',dur:6,text:'The back plate is turned over onto the open side of the channel, so the LED strip faces the cured acrylic.',spec:'LED strip faces the acrylic'},
    {name:'Seal, light',dur:9,text:'Industrial-grade silicone seals the joint between the plate and the channel. Turned face up and powered, the letters light evenly.',spec:'Industrial-grade silicone'}
  ];
  var acc=0;STAGES.forEach(function(s){s.start=acc;acc+=s.dur;});
  var TOTAL=acc;

  var rail=$('rail');
  var railBtns=STAGES.map(function(s,i){
    var li=document.createElement('li');
    var b=document.createElement('button');b.type='button';
    b.innerHTML='<span class="n">'+(i+1)+'</span><span class="t">'+s.name+'</span>';
    b.addEventListener('click',function(){jump(i);});
    li.appendChild(b);rail.appendChild(li);return b;
  });

  var T=0,playing=true,speed=1,lastIdx=-1,labLast='',auto=true,sceneOK=false;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){T=TOTAL;playing=false;}

  function fail(m){var e=$('stageMsg');e.hidden=false;e.textContent=m;}
  if(typeof THREE==='undefined'||!THREE.OrbitControls){
    fail('The 3D library could not load. Check your connection and reload the page.');
  }

  var update=function(){};
  var renderFrame=function(){};

  if(typeof THREE!=='undefined'&&THREE.OrbitControls){
  try{
    var canvas=$('gl'),stage=$('stage');
    var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;

    /* ---------- geometry data ---------- */
    var LET=[
      {w:64,o:'M0,100 L26,0 L38,0 L64,100 L48,100 L43,82 L21,82 L16,100 Z M25,68 L39,68 L32,30 Z',c:['M9,92 L32,12 L55,92','M16,75 H48'],pour:[32,75]},
      {w:56,o:'M0,0 H28 C48,0 56,22 56,50 C56,78 48,100 28,100 H0 Z M16,16 V84 H27 C37,84 40,68 40,50 C40,32 37,16 27,16 Z',c:['M8,8 H28 C42,8 48,26 48,50 C48,74 42,92 28,92 H8 Z'],pour:[8,50]},
      {w:56,o:'M0,0 H16 V42 H40 V0 H56 V100 H40 V58 H16 V100 H0 Z',c:['M8,94 V6','M48,94 V6','M8,50 H48'],pour:[28,50]},
      {w:16,o:'M0,0 H16 V100 H0 Z',c:['M8,94 V6'],pour:[8,50]},
      {w:60,o:'M0,0 H60 V16 H38 V100 H22 V16 H0 Z',c:['M6,8 H54','M30,14 V94'],pour:[30,50]},
      {w:48,o:'M0,0 H48 V16 H16 V42 H42 V58 H16 V84 H48 V100 H0 Z',c:['M44,8 H8 V92 H44','M14,50 H38'],pour:[8,50]},
      {w:56,o:'M56,28 C52,10 42,0 30,0 C12,0 0,20 0,50 C0,80 12,100 30,100 C42,100 52,90 56,72 L40,68 C38,78 34,84 30,84 C22,84 16,72 16,50 C16,28 22,16 30,16 C34,16 38,22 40,32 Z',c:['M48,30 C46,18 40,8 30,8 C18,8 8,24 8,50 C8,76 18,92 30,92 C40,92 46,82 48,70'],pour:[8,50]},
      {w:56,o:'M0,0 H16 V42 H40 V0 H56 V100 H40 V58 H16 V100 H0 Z',c:['M8,94 V6','M48,94 V6','M8,50 H48'],pour:[28,50]}
    ];
    var N=LET.length,GAP=12,ox=[],xx=0;
    LET.forEach(function(L){ox.push(xx);xx+=L.w+GAP;});
    var WCX=(xx-GAP)/2;
    var H_CH=12,T_W=2.4,RES=1.5,PLT=1.65,PLB=1.4,GT=4;

    function parse(d){
      var tok=d.match(/[MLHVCZ]|-?\d*\.?\d+/g),i=0,subs=[],cur=null,cx=0,cy=0,sx=0,sy=0,cmd='';
      var SEGN=14;
      var num=function(){return parseFloat(tok[i++]);};
      while(i<tok.length){
        var t=tok[i];
        if(isNaN(t)){
          cmd=t;i++;
          if(cmd==='Z'){if(cur){cur.closed=true;}cx=sx;cy=sy;}
          continue;
        }
        if(cmd==='M'){cx=num();cy=num();sx=cx;sy=cy;cur={pts:[[cx,cy]],closed:false};subs.push(cur);cmd='L';}
        else if(cmd==='L'){cx=num();cy=num();cur.pts.push([cx,cy]);}
        else if(cmd==='H'){cx=num();cur.pts.push([cx,cy]);}
        else if(cmd==='V'){cy=num();cur.pts.push([cx,cy]);}
        else if(cmd==='C'){
          var x1=num(),y1=num(),x2=num(),y2=num(),x3=num(),y3=num();
          for(var s=1;s<=SEGN;s++){
            var u=s/SEGN,v=1-u;
            cur.pts.push([v*v*v*cx+3*v*v*u*x1+3*v*u*u*x2+u*u*u*x3, v*v*v*cy+3*v*v*u*y1+3*v*u*u*y2+u*u*u*y3]);
          }
          cx=x3;cy=y3;
        } else {i++;}
      }
      return subs;
    }
    function cleanPoly(pts){
      var out=[];
      pts.forEach(function(p){var q=out[out.length-1];if(!q||Math.abs(q.x-p.x)>1e-6||Math.abs(q.y-p.y)>1e-6){out.push(p);}});
      var a=out[0],b=out[out.length-1];
      if(out.length>1&&Math.abs(a.x-b.x)<1e-6&&Math.abs(a.y-b.y)<1e-6){out.pop();}
      return out;
    }
    function area(p){var s=0;for(var i=0;i<p.length;i++){var a=p[i],b=p[(i+1)%p.length];s+=a.x*b.y-b.x*a.y;}return s/2;}
    function offsetPoly(p,d){
      var n=p.length,sgn=area(p)>0?1:-1,out=[];
      for(var i=0;i<n;i++){
        var a=p[(i+n-1)%n],b=p[i],c=p[(i+1)%n];
        var e1=new THREE.Vector2(b.x-a.x,b.y-a.y).normalize();
        var e2=new THREE.Vector2(c.x-b.x,c.y-b.y).normalize();
        var n1=new THREE.Vector2(e1.y*sgn,-e1.x*sgn);
        var n2=new THREE.Vector2(e2.y*sgn,-e2.x*sgn);
        var bis=new THREE.Vector2(n1.x+n2.x,n1.y+n2.y);
        var bl=bis.length();
        if(bl<1e-6){bis.copy(n1);}else{bis.multiplyScalar(1/bl);}
        var m=d/Math.max(.4,bis.dot(n1));
        out.push(new THREE.Vector2(b.x+bis.x*m,b.y+bis.y*m));
      }
      return out;
    }
    function resample(p,step,closed){
      var pts=p.slice();if(closed){pts.push(p[0]);}
      var cum=[0],i;
      for(i=1;i<pts.length;i++){cum.push(cum[i-1]+pts[i].distanceTo(pts[i-1]));}
      var L=cum[cum.length-1],n=Math.max(2,Math.ceil(L/step)),out=[],j=1;
      for(var k=0;k<=n;k++){
        var dd=L*k/n;
        while(j<pts.length-1&&cum[j]<dd){j++;}
        var t=(dd-cum[j-1])/Math.max(1e-9,cum[j]-cum[j-1]);
        out.push(new THREE.Vector2(lerp(pts[j-1].x,pts[j].x,t),lerp(pts[j-1].y,pts[j].y,t)));
      }
      return {pts:out,len:L};
    }
    var v2=function(p){return new THREE.Vector2(p[0],100-p[1]);};

    var D=LET.map(function(L,i){
      var contours=parse(L.o).map(function(s){return cleanPoly(s.pts.map(v2));});
      var cl=L.c.map(function(d){
        var s=parse(d)[0],pts=s.pts.map(v2);
        if(s.closed){pts.push(pts[0].clone());}
        return pts;
      });
      var pd=T_W/2+.5;
      var pc=contours.map(function(c,k){return offsetPoly(c,k===0?pd:-pd);});
      var px=L.pour[0],py=100-L.pour[1],R=0;
      contours[0].forEach(function(p){R=Math.max(R,Math.sqrt((p.x-px)*(p.x-px)+(p.y-py)*(p.y-py)));});
      return {contours:contours,cl:cl,pc:pc,rmax:R*1.1+4};
    });
    function shapeFrom(contours,d){
      var sh=new THREE.Shape(offsetPoly(contours[0],d));
      for(var k=1;k<contours.length;k++){sh.holes.push(new THREE.Path(offsetPoly(contours[k],-d)));}
      return sh;
    }
    function extrudeGeo(shape,depth){
      var g=new THREE.ExtrudeGeometry(shape,{depth:depth,bevelEnabled:false,curveSegments:1,steps:1});
      g.rotateX(-Math.PI/2);
      return g;
    }
    var posOf=function(i){return new THREE.Vector3(ox[i]-WCX,0,50);};

    /* ---------- scene, lights, camera ---------- */
    var scene=new THREE.Scene();
    scene.background=new THREE.Color();
    scene.fog=new THREE.Fog(0xffffff,1100,2600);
    var camera=new THREE.PerspectiveCamera(38,16/9,5,4000);
    camera.position.set(0,330,300);
    var hemi=new THREE.HemisphereLight(0xffffff,0x8896a3,.95);scene.add(hemi);
    var dir=new THREE.DirectionalLight(0xffffff,.9);
    dir.position.set(160,320,220);dir.castShadow=true;
    dir.shadow.mapSize.set(2048,2048);
    dir.shadow.camera.left=-360;dir.shadow.camera.right=360;dir.shadow.camera.top=360;dir.shadow.camera.bottom=-360;
    dir.shadow.camera.near=50;dir.shadow.camera.far=900;dir.shadow.bias=-.0006;
    dir.shadow.camera.updateProjectionMatrix();
    scene.add(dir);

    var controls=new THREE.OrbitControls(camera,canvas);
    controls.enableDamping=true;controls.dampingFactor=.08;
    controls.enableZoom=false;controls.enablePan=false;
    if(window.matchMedia('(pointer: coarse)').matches){controls.enabled=false;}
    controls.minPolarAngle=.2;controls.maxPolarAngle=Math.PI/2-.06;
    canvas.style.touchAction='pan-y';
    controls.addEventListener('start',function(){auto=false;camBtnLabel();});

    /* ---------- materials ---------- */
    var benchMat=new THREE.MeshStandardMaterial({roughness:.95,metalness:0});
    var gridMat=new THREE.LineBasicMaterial({transparent:true,opacity:.55});
    var glassMat=new THREE.MeshStandardMaterial({transparent:true,opacity:.5,roughness:.05,metalness:0});
    var wallMat=new THREE.MeshStandardMaterial({roughness:.38,metalness:.3});
    var acpMat=new THREE.MeshStandardMaterial({roughness:.55,metalness:.15});
    var sheetMat=new THREE.MeshStandardMaterial({roughness:.7,metalness:.1,transparent:true,opacity:0});
    var stripMat=new THREE.MeshStandardMaterial({color:0xf4f6f8,roughness:.5,metalness:0,side:THREE.DoubleSide});
    var ledMat=new THREE.MeshStandardMaterial({roughness:.4,metalness:0,emissiveIntensity:.7});
    var holeMat=new THREE.MeshBasicMaterial({color:0x10151a});
    var silMat=new THREE.MeshStandardMaterial({roughness:.35,metalness:0});
    var cutMat=new THREE.LineBasicMaterial({transparent:true,opacity:1});
    var artMat=new THREE.LineBasicMaterial({transparent:true,opacity:1});
    var dimMat=new THREE.LineBasicMaterial({transparent:true,opacity:0});
    var toolMat=new THREE.MeshStandardMaterial({color:0x3a434b,roughness:.4,metalness:.7});
    var jugMat=new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.26,roughness:.08,metalness:0,side:THREE.DoubleSide,depthWrite:false});
    var streamMat=new THREE.MeshStandardMaterial({roughness:.15,metalness:0,transparent:true,opacity:.92});
    var liqMat=new THREE.MeshStandardMaterial({roughness:.2,metalness:0});
    var haloTex=(function(){
      var c=document.createElement('canvas');c.width=c.height=128;
      var x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);
      g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.5,'rgba(255,255,255,.45)');g.addColorStop(1,'rgba(255,255,255,0)');
      x.fillStyle=g;x.fillRect(0,0,128,128);
      return new THREE.CanvasTexture(c);
    })();
    var labCanvas=document.createElement('canvas');labCanvas.width=256;labCanvas.height=96;
    var labTex=new THREE.CanvasTexture(labCanvas);
    var labMat=new THREE.SpriteMaterial({map:labTex,transparent:true,opacity:0,depthWrite:false});

    var resMats=[],resU=[];
    function resinMaterial(){
      var m=new THREE.MeshPhysicalMaterial({roughness:.1,metalness:0,clearcoat:1,clearcoatRoughness:.04,transparent:true,opacity:.94});
      var u={uC:{value:new THREE.Vector2()},uR:{value:0},uT:{value:0}};
      m.onBeforeCompile=function(sh){
        sh.uniforms.uC=u.uC;sh.uniforms.uR=u.uR;sh.uniforms.uT=u.uT;
        sh.vertexShader=sh.vertexShader
          .replace('#include <common>','#include <common>\nvarying vec3 vWP;')
          .replace('#include <begin_vertex>','#include <begin_vertex>\nvWP=(modelMatrix*vec4(transformed,1.0)).xyz;');
        sh.fragmentShader=sh.fragmentShader
          .replace('#include <common>','#include <common>\nvarying vec3 vWP;\nuniform vec2 uC;\nuniform float uR;\nuniform float uT;')
          .replace('void main() {','void main() {\n vec2 dv=vWP.xz-uC; float an=atan(dv.y,dv.x); float edge=uR*(1.0+0.07*sin(an*5.0+uT*1.7)+0.04*sin(an*9.0-uT*1.3)); if(length(dv)>edge) discard;');
      };
      resMats.push(m);resU.push(u);
      return m;
    }

    /* ---------- bench, grid, glass ---------- */
    var bench=new THREE.Mesh(new THREE.PlaneGeometry(5000,4000).rotateX(-Math.PI/2),benchMat);
    bench.position.y=-.02;bench.receiveShadow=true;scene.add(bench);
    var grid=new THREE.GridHelper(1600,80,0x888888,0x888888);
    grid.material=gridMat;grid.position.y=.01;scene.add(grid);
    var glass=new THREE.Mesh(new THREE.BoxGeometry(540,GT,150),glassMat);
    glass.position.y=GT/2;glass.receiveShadow=true;glass.castShadow=true;scene.add(glass);

    /* ---------- artwork lines ---------- */
    function lineSet(polys,h,mat,closed,step){
      var set={items:[],total:0};
      polys.forEach(function(p){
        var r=resample(p,step,closed);
        var pts3=r.pts.map(function(q){return new THREE.Vector3(q.x,h,-q.y);});
        var geo=new THREE.BufferGeometry().setFromPoints(pts3);
        var line=new THREE.Line(geo,mat);line.frustumCulled=false;
        geo.setDrawRange(0,0);line.visible=false;
        set.items.push({obj:line,geo:geo,count:pts3.length,len:r.len,pts:r.pts});
        set.total+=r.len;
      });
      return set;
    }
    function setProg(set,f){
      var target=clamp(f)*set.total,acc2=0;
      set.items.forEach(function(it){
        var loc=clamp((target-acc2)/it.len);acc2+=it.len;
        var c=Math.round(loc*it.count);
        it.geo.setDrawRange(0,c);it.obj.visible=c>=2;
      });
    }
    function headAt(set,f){
      var target=clamp(f)*set.total,acc2=0;
      for(var k=0;k<set.items.length;k++){
        var it=set.items[k];
        if(target<=acc2+it.len||k===set.items.length-1){
          var loc=clamp((target-acc2)/it.len),idx=loc*(it.count-1);
          var a=Math.floor(idx),b=Math.min(it.count-1,a+1),t=idx-a;
          return new THREE.Vector2(lerp(it.pts[a].x,it.pts[b].x,t),lerp(it.pts[a].y,it.pts[b].y,t));
        }
        acc2+=it.len;
      }
      return new THREE.Vector2();
    }

    var artRoot=new THREE.Group();scene.add(artRoot);
    var art=D.map(function(d,i){
      var g=new THREE.Group();g.position.copy(posOf(i));artRoot.add(g);
      var s=lineSet(d.contours,.35,artMat,true,2);
      s.items.forEach(function(it){g.add(it.obj);});
      return s;
    });
    var dimPts=[new THREE.Vector3(-WCX-16,.35,-50),new THREE.Vector3(-WCX-16,.35,50),
                new THREE.Vector3(-WCX-22,.35,-50),new THREE.Vector3(-WCX-10,.35,-50),
                new THREE.Vector3(-WCX-22,.35,50),new THREE.Vector3(-WCX-10,.35,50)];
    var dimGeo=new THREE.BufferGeometry().setFromPoints(dimPts);
    dimGeo.setIndex([0,1,2,3,4,5]);
    artRoot.add(new THREE.LineSegments(dimGeo,dimMat));
    var labSprite=new THREE.Sprite(labMat);labSprite.scale.set(34,12.75,1);labSprite.position.set(-WCX-36,2,0);artRoot.add(labSprite);

    /* ---------- the unit: channels + liquid acrylic (+ back plate later) ---------- */
    var unit=new THREE.Group();scene.add(unit);
    var chans=[],resMeshes=[],bubbles=[],beads=[],letterGroups=[];
    D.forEach(function(d,i){
      var g=new THREE.Group();g.position.copy(posOf(i));unit.add(g);letterGroups.push(g);
      var ch=new THREE.Group();g.add(ch);chans.push(ch);
      d.contours.forEach(function(c){
        var sh=new THREE.Shape(offsetPoly(c,T_W/2));
        sh.holes.push(new THREE.Path(offsetPoly(c,-T_W/2)));
        var m=new THREE.Mesh(extrudeGeo(sh,H_CH),wallMat);
        m.castShadow=true;m.receiveShadow=true;ch.add(m);
      });
      ch.scale.y=.001;ch.visible=false;
      var rm=new THREE.Mesh(extrudeGeo(shapeFrom(d.contours,-T_W/2),RES),resinMaterial());
      rm.material.side=THREE.FrontSide;
      rm.position.y=.05;rm.castShadow=true;rm.receiveShadow=true;rm.visible=false;g.add(rm);
      resMeshes.push(rm);
      /* bubbles on the first centerline */
      var rs=resample(d.cl[0],4,false);
      [.18,.38,.58,.8].forEach(function(fr,j){
        var q=rs.pts[Math.min(rs.pts.length-1,Math.round(fr*(rs.pts.length-1)))];
        var b=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.6,roughness:.1}));
        b.position.set(q.x+((i*3+j*5)%5)-2,RES,-q.y);b.visible=false;g.add(b);
        bubbles.push({m:b,s:.02+((i*4+j)%8)*.07+j*.03,x:b.position.x,z:b.position.z});
      });
      /* silicone bead set (built now, revealed in the last step) */
      var set={items:[],total:0};
      d.pc.forEach(function(p){
        var r=resample(p,3,true),pts=r.pts.slice(0,-1);
        var p3=pts.map(function(q){return new THREE.Vector3(q.x,0,-q.y);});
        var curve=new THREE.CatmullRomCurve3(p3,true,'centripetal');
        var tg=new THREE.TubeGeometry(curve,Math.max(24,pts.length*2),1,6,true);
        var tm=new THREE.Mesh(tg,silMat);tm.position.y=H_CH;tm.frustumCulled=false;tm.castShadow=true;
        tg.setDrawRange(0,0);tm.visible=false;g.add(tm);
        set.items.push({obj:tm,geo:tg,count:pts.length,idx:tg.index.count,len:r.len,pts:pts});
        set.total+=r.len;
      });
      beads.push(set);
    });
    function setBeadProg(set,f){
      var target=clamp(f)*set.total,acc2=0;
      set.items.forEach(function(it){
        var loc=clamp((target-acc2)/it.len);acc2+=it.len;
        var c=Math.floor(loc*it.idx/3)*3;
        it.geo.setDrawRange(0,c);it.obj.visible=c>0;
      });
    }

    /* ---------- halos for the lit finish ---------- */
    var haloMat=new THREE.MeshBasicMaterial({map:haloTex,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});
    var halos=LET.map(function(L,i){
      var h=new THREE.Mesh(new THREE.PlaneGeometry(L.w+90,190).rotateX(-Math.PI/2),haloMat);
      h.position.set(ox[i]+L.w/2-WCX,.6,0);h.visible=false;scene.add(h);return h;
    });

    /* ---------- back plate (child of the unit) ---------- */
    var plateOuter=new THREE.Group();unit.add(plateOuter);
    plateOuter.position.set(0,0,150);plateOuter.scale.set(-1,1,1);plateOuter.visible=false;
    var plateInner=new THREE.Group();plateOuter.add(plateInner);
    var sheet=new THREE.Mesh(new THREE.BoxGeometry(540,PLB,130),sheetMat);
    sheet.position.set(0,PLB/2,0);sheet.receiveShadow=true;plateInner.add(sheet);
    var plateMeshes=[],cutS=[];
    D.forEach(function(d,i){
      var g=new THREE.Group();g.position.copy(posOf(i));plateInner.add(g);
      var pm=new THREE.Mesh(extrudeGeo(shapeFrom(d.contours,T_W/2+.5),PLT),acpMat);
      pm.castShadow=true;pm.receiveShadow=true;pm.scale.y=.001;pm.visible=false;g.add(pm);plateMeshes.push(pm);
      var s=lineSet(d.pc,PLT+.3,cutMat,true,2);
      s.items.forEach(function(it){g.add(it.obj);});
      cutS.push(s);
    });
    /* LED strip ribbons, LEDs at equal spacing, rivet holes */
    function ribbon(pts,w,h){
      var pos=[],nor=[],n=pts.length,k;
      for(k=0;k<n;k++){
        var a=pts[Math.max(0,k-1)],b=pts[Math.min(n-1,k+1)];
        var tx=b.x-a.x,ty=b.y-a.y,m=Math.sqrt(tx*tx+ty*ty)||1;
        var nx=-ty/m*w/2,ny=tx/m*w/2;
        pos.push(pts[k].x+nx,h,-(pts[k].y+ny),pts[k].x-nx,h,-(pts[k].y-ny));
        nor.push(0,1,0,0,1,0);
      }
      var idx=[];
      for(k=0;k<n-1;k++){var a0=k*2;idx.push(a0,a0+1,a0+2,a0+1,a0+3,a0+2);}
      var g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
      g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
      g.setIndex(idx);
      return g;
    }
    var ribbons=[],ledPos=[],holePos=[];
    D.forEach(function(d,i){
      d.cl.forEach(function(pts){
        var rr=resample(pts,1.6,false);
        var g=ribbon(rr.pts,3.2,PLT+.1);
        var m=new THREE.Mesh(g,stripMat);m.position.copy(posOf(i));m.frustumCulled=false;m.castShadow=false;
        g.setDrawRange(0,0);m.visible=false;plateInner.add(m);
        ribbons.push({geo:g,mesh:m,idx:(rr.pts.length-1)*6});
        var Lp=rr.len,k;
        var nL=Math.max(1,Math.round(Lp/11));
        var r2=resample(pts,Lp/(2*nL)*1.0001,false);
        for(k=1;k<r2.pts.length;k+=2){
          ledPos.push(new THREE.Vector3(r2.pts[k].x+ox[i]-WCX,PLT+.55,50-r2.pts[k].y));
        }
        var nH=Math.max(1,Math.round(Lp/34)),alt=1;
        var r3=resample(pts,Lp/(2*nH)*1.0001,false);
        for(var j=0;j<nH;j++){
          var hi=2*j+1;
          if(hi+1>=r3.pts.length){break;}
          var ha=r3.pts[hi-1],hb=r3.pts[hi+1],hc=r3.pts[hi];
          var tx=hb.x-ha.x,ty=hb.y-ha.y,m2=Math.sqrt(tx*tx+ty*ty)||1;
          holePos.push(new THREE.Vector3(hc.x-ty/m2*5*alt+ox[i]-WCX,PLT+.08,50-(hc.y+tx/m2*5*alt)));alt=-alt;
        }
      });
    });
    var ledInst=new THREE.InstancedMesh(new THREE.CylinderGeometry(1.5,1.5,1,10),ledMat,ledPos.length);
    ledInst.frustumCulled=false;plateInner.add(ledInst);
    var holeInst=new THREE.InstancedMesh(new THREE.CylinderGeometry(1.7,1.7,.3,12),holeMat,holePos.length);
    holeInst.frustumCulled=false;plateInner.add(holeInst);
    var dummy=new THREE.Object3D();
    var router=new THREE.Mesh(new THREE.ConeGeometry(2.2,8,14).rotateX(Math.PI),toolMat);
    router.visible=false;plateInner.add(router);
    var gun=new THREE.Mesh(new THREE.ConeGeometry(1.8,7,12).rotateX(Math.PI),toolMat);
    gun.visible=false;unit.add(gun);

    /* ---------- jug, stream, ripples ---------- */
    var jug=new THREE.Group();jug.visible=false;scene.add(jug);
    var LIPX=-4.4,LIPY=24.5;
    var prof=[[0,-14],[9.5,-14],[10,-12],[10,10],[8,13],[4.6,17],[4.2,24],[5.2,25]].map(function(p){return new THREE.Vector2(p[0],p[1]);});
    var jugBody=new THREE.Mesh(new THREE.LatheGeometry(prof,28),jugMat);jug.add(jugBody);
    var jugHandle=new THREE.Mesh(new THREE.TorusGeometry(6,.9,8,16,Math.PI),toolMat);
    jugHandle.position.set(10,-2,0);jugHandle.rotation.z=-Math.PI/2;jug.add(jugHandle);
    var liquid=new THREE.Mesh(new THREE.CylinderGeometry(8.8,8.8,1,24),liqMat);jug.add(liquid);
    var stream=new THREE.Mesh(new THREE.CylinderGeometry(.95,.7,1,10,1,true),streamMat);
    stream.visible=false;scene.add(stream);
    var ringGeo=new THREE.RingGeometry(1,1.35,32).rotateX(-Math.PI/2);
    var rings=[0,1,2].map(function(){
      var r=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false}));
      r.visible=false;scene.add(r);return r;
    });

    /* ---------- theme ---------- */
    var css=function(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim();};
    var TH={};
    ['bg','bench','grid','glass','wall','acry','acp','sheet','sil','led','cut','glow','night','ink','muted','white'].forEach(function(k){TH[k]=new THREE.Color(0xffffff);});
    var setC=function(c,name,fb){try{c.set(css(name)||fb);}catch(e){c.set(fb);}};
    function drawLabel(){
      var c=labCanvas.getContext('2d');
      c.clearRect(0,0,256,96);
      c.fillStyle=css('--muted')||'#56636D';
      c.font='600 40px "IBM Plex Mono", monospace';c.textAlign='center';c.textBaseline='middle';
      c.fillText('300 mm',128,48);
      labTex.needsUpdate=true;
    }
    function applyTheme(){
      setC(TH.bg,'--bg','#EDEFF1');setC(TH.bench,'--bench','#DDE2E6');setC(TH.grid,'--grid','#C9D0D6');
      setC(TH.glass,'--glassBed','#BFE0D8');setC(TH.wall,'--wall','#E4E9ED');setC(TH.acry,'--acry','#1E6EE0');
      setC(TH.acp,'--acp','#D5DADF');setC(TH.sheet,'--sheet','#9FA8B0');setC(TH.sil,'--sil','#8A949D');
      setC(TH.led,'--led','#FFF0BE');setC(TH.cut,'--cut','#E5560A');setC(TH.glow,'--glow','#78B4FF');
      setC(TH.night,'--night','#080B10');setC(TH.ink,'--ink','#161C22');setC(TH.muted,'--muted','#56636D');
      glassMat.color.copy(TH.glass);wallMat.color.copy(TH.wall);acpMat.color.copy(TH.acp);
      sheetMat.color.copy(TH.sheet);silMat.color.copy(TH.sil);ledMat.color.copy(TH.led);ledMat.emissive.copy(TH.led);
      cutMat.color.copy(TH.cut);artMat.color.copy(TH.ink);dimMat.color.copy(TH.muted);
      haloMat.color.copy(TH.glow);streamMat.color.copy(TH.acry);liqMat.color.copy(TH.acry);
      drawLabel();
    }
    applyTheme();
    if(window.matchMedia){
      var mq=window.matchMedia('(prefers-color-scheme: dark)');
      if(mq.addEventListener){mq.addEventListener('change',applyTheme);}
    }
    if(window.MutationObserver){
      new MutationObserver(applyTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    }

    /* ---------- camera ---------- */
    var goalPos=new THREE.Vector3(0,330,300),goalTgt=new THREE.Vector3(),zoomK=1,firstCam=true;
    function resize(){
      var w=Math.max(10,stage.clientWidth),h=Math.max(10,stage.clientHeight);
      renderer.setSize(w,h,false);
      camera.aspect=w/h;camera.updateProjectionMatrix();
      zoomK=Math.max(1,1.62/camera.aspect);
    }
    if(window.ResizeObserver){new ResizeObserver(resize).observe(stage);}
    window.addEventListener('resize',resize);
    resize();
    function camBtnLabel(){$('camBtn').textContent=auto?'Auto camera: on':'Auto camera: off';}
    $('camBtn').addEventListener('click',function(){auto=!auto;camBtnLabel();});
    camBtnLabel();

    /* ---------- the animation state ---------- */
    var POURS=D.map(function(d,i){return [LET[i].pour[0]+ox[i]-WCX,LET[i].pour[1]-50];});
    function update_(){
      var P=STAGES.map(function(s){return clamp((T-s.start)/s.dur);});
      var p1=P[0],p2=P[1],p3=P[2],p4=P[3],p5=P[4],p6=P[5],p7=P[6],p8=P[7];
      var i,k;
      var night=seg(p8,.62,.78),lit=ease(seg(p8,.72,.95));
      scene.background.copy(TH.bg).lerp(TH.night,.95*night);
      scene.fog.color.copy(scene.background);
      benchMat.color.copy(TH.bench).lerp(TH.night,.9*night);
      gridMat.color.copy(TH.grid).lerp(TH.night,.8*night);
      hemi.intensity=lerp(.95,.2,night);dir.intensity=lerp(.9,.14,night);

      /* 1 artwork */
      var pa=seg(p1,.04,.85)*N;
      for(i=0;i<N;i++){setProg(art[i],clamp(pa-i));}
      var artA=1-seg(p2,.3,.8);
      artMat.opacity=artA;dimMat.opacity=seg(p1,.6,.95)*artA;labMat.opacity=dimMat.opacity;
      artRoot.visible=artA>.01;

      /* 2 channel */
      var pw=seg(p2,.06,.94)*N;
      for(i=0;i<N;i++){var ci=clamp(pw-i);chans[i].scale.y=Math.max(.001,ease(ci));chans[i].visible=ci>0;}

      /* 3 glass bed: unit lifts, glass slides in, unit lowers */
      var e3in=ease(seg(p3,.05,.6));
      var liftUp=ease(seg(p5,.62,.76)),gone=ease(seg(p5,.72,.9)),settle=ease(seg(p5,.88,1));
      var fp=seg(p8,.5,.68);
      var yU;
      if(p8>0){yU=lerp(0,H_CH+PLT,ease(fp))+20*Math.sin(Math.PI*fp);}
      else if(p5>0){yU=GT+30*liftUp*(1-settle)-GT*settle;}
      else if(p3<.55){yU=lerp(0,22,ease(seg(p3,0,.3)));}
      else{yU=lerp(22,GT,ease(seg(p3,.55,1)));}
      unit.position.y=yU;
      var gx=p5>0?gone*700:lerp(-700,0,e3in);
      glass.position.x=gx;glass.visible=Math.abs(gx)<690;

      /* 4 pour */
      var pourAll=ease(seg(p4,.1,.95));
      var u=seg(p4,.08,.96)*N;
      var kk=Math.min(N-1,Math.floor(u)),f=u>=N?1:u-kk;
      var move=ease(seg(f,0,.25)),pf=seg(f,.25,1);
      var prevX=kk===0?POURS[0][0]-50:POURS[kk-1][0],prevZ=kk===0?POURS[0][1]:POURS[kk-1][1];
      var jx=lerp(prevX,POURS[kk][0],move),jz=lerp(prevZ,POURS[kk][1],move);
      var tilt=ease(seg(p4,0,.08))*(1-ease(seg(p4,.96,1)));
      var th=tilt*55*Math.PI/180,cth=Math.cos(th),sth=Math.sin(th),lipY=72;
      var jOff=80*(1-ease(seg(p4,0,.06)))+80*ease(seg(p4,.96,1));
      jug.rotation.z=th;
      jug.position.set(jx-(LIPX*cth-LIPY*sth),lipY-(LIPX*sth+LIPY*cth)+jOff,jz);
      jug.visible=jOff<79;
      var hL=lerp(23,3,pourAll);
      liquid.scale.y=hL;liquid.position.y=-13+hL/2;liquid.visible=hL>.5;
      var streaming=(u>0&&u<N&&f>.25&&p4<.96);
      var surfY=GT+RES+.25,len=lipY-surfY;
      stream.position.set(jx,(lipY+surfY)/2,jz);
      stream.scale.set(1+.1*Math.sin(T*20),len,1+.1*Math.sin(T*17+1));
      stream.visible=streaming;
      for(k=0;k<3;k++){
        var ph=(T*.9+k/3)%1;
        rings[k].position.set(jx,surfY+.05,jz);
        rings[k].scale.set(1+ph*7,1,1+ph*7);
        rings[k].material.opacity=(1-ph)*.7;
        rings[k].visible=streaming&&pf>.05;
      }
      for(i=0;i<N;i++){
        var r=u>=N?1:(i<kk?1:(i===kk?ease(pf):0));
        var rm=resMeshes[i];
        rm.visible=r>0;
        resU[i].uC.value.set(POURS[i][0],POURS[i][1]);
        resU[i].uR.value=r>=1?1000:D[i].rmax*r;
        resU[i].uT.value=T;
        rm.scale.y=lerp(.35,1,Math.min(1,r*1.15));
      }

      /* 5 cure, lift */
      var cure=seg(p5,0,.62);
      bubbles.forEach(function(b){
        var e=b.s+.22,m=b.m;
        if(cure>=b.s&&cure<e){var t=(cure-b.s)/(e-b.s);m.visible=true;m.scale.setScalar(lerp(.5,1.2,t));m.position.y=lerp(.3,RES+.35,ease(t));m.material.opacity=.6;}
        else if(cure>=e&&cure<e+.05){var t2=(cure-e)/.05;m.visible=true;m.scale.setScalar(lerp(1.2,2.8,t2));m.position.y=RES+.35;m.material.opacity=(1-t2)*.6;}
        else{m.visible=false;}
      });

      /* 6 back plate */
      plateOuter.visible=p6>0;
      var pc=seg(p6,.1,.55)*N;
      sheetMat.opacity=seg(p6,0,.08)*(1-seg(p6,.52,.68));sheet.visible=sheetMat.opacity>.01;
      cutMat.opacity=1-seg(p6,.55,.7);
      for(i=0;i<N;i++){
        var c6=clamp(pc-i);
        setProg(cutS[i],c6);
        var ps=ease(seg(c6,.9,1));
        plateMeshes[i].scale.y=Math.max(.001,ps);plateMeshes[i].visible=ps>.001;
      }
      var rk=Math.min(N-1,Math.floor(pc)),hd=headAt(cutS[rk],pc-rk);
      router.position.set(hd.x+ox[rk]-WCX,PLT+4.3,50-hd.y);
      router.rotation.y=T*25;router.visible=pc>0&&pc<N;
      for(k=0;k<holePos.length;k++){
        var hf=k/holePos.length,hs=ease(seg(p6,.56+hf*.07,.6+hf*.07));
        dummy.position.copy(holePos[k]);dummy.scale.setScalar(Math.max(.001,hs));dummy.updateMatrix();holeInst.setMatrixAt(k,dummy.matrix);
      }
      holeInst.instanceMatrix.needsUpdate=true;
      var stripP=seg(p6,.68,.8);
      ribbons.forEach(function(rb){
        var c=Math.floor(stripP*(rb.idx/6))*6;
        rb.geo.setDrawRange(0,c);rb.mesh.visible=c>0;
      });
      for(k=0;k<ledPos.length;k++){
        var lf=k/ledPos.length,ls=ease(seg(p6,.78+lf*.15,.82+lf*.15));
        dummy.position.copy(ledPos[k]);dummy.scale.set(Math.max(.001,ls),Math.max(.001,ls),Math.max(.001,ls));dummy.updateMatrix();ledInst.setMatrixAt(k,dummy.matrix);
      }
      ledInst.instanceMatrix.needsUpdate=true;

      /* 7 join: the plate flips (mirrored becomes correct) and drops onto the channel */
      var s7=ease(seg(p7,.05,.9)),fl=seg(p7,.1,.7),cs=Math.cos(Math.PI*fl);
      plateOuter.position.set(0,lerp(0,H_CH+PLT,s7)+40*Math.sin(Math.PI*s7),lerp(150,0,s7));
      plateOuter.scale.set(nz(-cs),nz(cs),1);

      /* 8 silicone, turn face up, light */
      var pb=seg(p8,.04,.45)*N;
      for(i=0;i<N;i++){setBeadProg(beads[i],clamp(pb-i));}
      var bk=Math.min(N-1,Math.floor(pb)),bh=headAt({items:beads[bk].items.map(function(it){return {pts:it.pts,count:it.count,len:it.len};}),total:beads[bk].total},pb-bk);
      gun.position.set(bh.x+ox[bk]-WCX,H_CH+PLT+5,50-bh.y);
      gun.visible=pb>0&&pb<N;
      unit.scale.y=nz(Math.cos(Math.PI*fp));
      unit.rotation.x=.16*Math.sin(Math.PI*fp);
      for(i=0;i<N;i++){
        resMats[i].emissive.copy(TH.glow);
        resMats[i].emissiveIntensity=lit*.85;
        resMats[i].color.copy(TH.acry).lerp(TH.white,.4*lit);
        halos[i].visible=lit>.01;
      }
      haloMat.opacity=.55*lit;

      /* camera goals */
      var gp=goalPos,gt=goalTgt;
      if(p8>0){
        gt.set(0,0,0);gp.set(0,lerp(310,200,lit),lerp(310,420,lit));
      } else if(p7>0){
        gt.set(0,0,lerp(70,0,s7));gp.set(0,lerp(430,320,s7),lerp(350,310,s7));
      } else if(p6>0){
        gt.set(0,0,70);gp.set(0,430,350);
      } else if(p5>0){
        gt.set(0,0,0);gp.set(0,310,310);
      } else if(p4>0){
        gt.set(jx*.3,0,0);gp.set(jx*.3,320,310);
      } else {
        gt.set(0,0,0);gp.set(0,330,310);
      }
      gp.sub(gt).multiplyScalar(zoomK).add(gt);

      /* in-canvas label */
      var tl;
      if(T<STAGES[1].start){tl='Vector outlines, 300 mm letter height';}
      else if(T<STAGES[2].start){tl='Aluminium or 3D-printed channels';}
      else if(T<STAGES[3].start){tl='Channels set on a levelled glass bed';}
      else if(T<STAGES[4].start){tl='Ready-mixed liquid acrylic, 3–4 mm layer';}
      else if(T<STAGES[5].start){tl=p5<.62?'Curing flat on the glass':'Lifted off with the channel';}
      else if(T<STAGES[6].start){tl=p6<.55?'ACP back plate, CNC cut mirrored':(p6<.68?'Rivet holes':'LED strip, even spacing');}
      else if(T<STAGES[7].start){tl='Plate turned over onto the open side';}
      else{tl=p8<.45?'Industrial-grade silicone seal':(p8<.68?'Turned face up':'Lit');}
      if(tl!==labLast){labLast=tl;$('topLab').textContent=tl;}
    }
    update=update_;
    renderFrame=function(dt){
      if(firstCam){camera.position.copy(goalPos);controls.target.copy(goalTgt);firstCam=false;}
      if(auto){
        var a=1-Math.pow(.0005,dt);
        camera.position.lerp(goalPos,a);controls.target.lerp(goalTgt,a);
      }
      controls.update();
      renderer.render(scene,camera);
    };
    sceneOK=true;
  }catch(err){
    console.error(err);
    fail('The 3D scene could not start: '+(err&&err.message?err.message:err));
  }
  }

  /* ---------- UI ---------- */
  function ui(){
    var P=STAGES.map(function(s){return clamp((T-s.start)/s.dur);});
    var idx=0;for(var mm=0;mm<STAGES.length;mm++){if(T>=STAGES[mm].start){idx=mm;}}
    if(idx!==lastIdx){
      lastIdx=idx;
      $('capStep').textContent='Step '+(idx+1)+' of '+STAGES.length;
      $('capTitle').textContent=STAGES[idx].name;
      $('capText').textContent=STAGES[idx].text;
      $('capSpec').textContent=STAGES[idx].spec;
    }
    railBtns.forEach(function(b,q){
      b.style.setProperty('--p',(P[q]*100)+'%');
      b.classList.toggle('is-now',q===idx);
      b.classList.toggle('is-done',P[q]>=1);
      if(q===idx){b.setAttribute('aria-current','step');}else{b.removeAttribute('aria-current');}
    });
    $('timeT').textContent=T.toFixed(1)+' / '+TOTAL+' s';
    $('scrub').value=String(Math.round(T/TOTAL*1000));
  }
  function updateBtn(){$('btnPlay').textContent=playing?'Pause':(T>=TOTAL?'Replay':'Play');}
  function jump(i){T=STAGES[i].start;playing=true;updateBtn();}
  var last=0,inView=false;
  function frame(ts){
    var dt=last?Math.min(.1,(ts-last)/1000):.016;
    last=ts;
    if(!inView){requestAnimationFrame(frame);return;}
    if(playing){
      T+=dt*speed;
      if(T>=TOTAL){T=TOTAL;playing=false;updateBtn();}
    }
    if(sceneOK){update();renderFrame(dt);}
    ui();
    requestAnimationFrame(frame);
  }
  $('btnPlay').addEventListener('click',function(){
    if(playing){playing=false;}else{if(T>=TOTAL){T=0;}playing=true;}
    updateBtn();
  });
  $('btnNext').addEventListener('click',function(){var idx=Math.max(0,lastIdx);if(idx<STAGES.length-1){jump(idx+1);}});
  $('btnPrev').addEventListener('click',function(){
    var idx=Math.max(0,lastIdx);
    if(T-STAGES[idx].start>1.2||idx===0){jump(idx);}else{jump(idx-1);}
  });
  $('scrub').addEventListener('input',function(e){T=(Number(e.target.value)/1000)*TOTAL;updateBtn();});
  $('speed').addEventListener('change',function(e){speed=Number(e.target.value);});
  window.addEventListener('message',function(e){
    if(e.source!==parent||!e.data||typeof e.data.adhitechLiquidProcessVisible!=='boolean')return;
    inView=e.data.adhitechLiquidProcessVisible;
  });
  var wrapEl=document.querySelector('.wrap');
  function report(){parent.postMessage({adhitechLiquidProcess:Math.ceil(wrapEl.getBoundingClientRect().height)},'*');}
  if('ResizeObserver' in window){new ResizeObserver(report).observe(wrapEl);}
  window.addEventListener('load',report);window.addEventListener('resize',report);
  report();
  updateBtn();ui();
  requestAnimationFrame(frame);
})();
</script>

</body>
</html>
`;

function LiquidProcess() {
  const holderRef = useRef(null);
  const frameRef = useRef(null);
  const [show, setShow] = useState(() => !('IntersectionObserver' in window));
  const [height, setHeight] = useState(760);
  const visibleRef = useRef(false);

  // Load the animation near the viewport, then keep its playback synced to
  // the section's actual visibility in the parent page.
  useEffect(() => {
    const el = holderRef.current;
    if (!el) return undefined;

    if (!('IntersectionObserver' in window)) {
      visibleRef.current = true;
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        visibleRef.current = visible;

        if (visible) setShow(true);

        const frame = frameRef.current;
        if (frame?.contentWindow) {
          frame.contentWindow.postMessage(
            { adhitechLiquidProcessVisible: visible },
            '*'
          );
        }
      },
      { threshold: 0.08, rootMargin: '0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  const syncFrameVisibility = () => {
    frameRef.current?.contentWindow?.postMessage(
      { adhitechLiquidProcessVisible: visibleRef.current },
      '*'
    );
  };

  // The animation reports its own height, so it never needs an inner scrollbar.
  useEffect(() => {
    const onMessage = (e) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      const h = e.data && e.data.adhitechLiquidProcess;
      if (typeof h === 'number' && h > 200) setHeight(h);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 7rem) 0', position: 'relative', zIndex: 2 }}>
      <div className="container">
        <div style={{ maxWidth: '760px', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', lineHeight: '1.12' }}>
            Watch a Liquid Acrylic letter being made
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            Aluminium or 3D-printed channels on glass, a poured liquid acrylic face, and a CNC-cut ACP back plate
            with an LED strip, joined and sealed with silicone. Press play, or jump to any step.
          </p>
        </div>
        <div ref={holderRef} style={{ minHeight: height }}>
          {show && (
            <iframe
              ref={frameRef}
              title="Step-by-step animation of how an Adhitech Liquid Acrylic letter is made"
              srcDoc={LIQUID_PROCESS_HTML}
              onLoad={syncFrameVisibility}
              style={{ display: 'block', width: '100%', height, border: 0, background: '#0A0A0A' }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const subheadlineRef = useRef(null);
  const ctaRef = useRef(null);

  // Only offer the heavier video backdrop on larger viewports so mobile
  // visitors get a fast, static hero instead of a big autoplaying download.
  const [useHeroVideo] = useState(
    () =>
      window.matchMedia('(min-width: 900px)').matches &&
      window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  );

  useEffect(() => {
    // Hero Animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo(headlineRef.current, 
      { y: 60, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, delay: 0.3 }
    )
    .fromTo(subheadlineRef.current, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 0.8, duration: 1 }, 
      '-=0.8'
    )
    .fromTo(ctaRef.current, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1 }, 
      '-=0.8'
    );

    return () => tl.kill();
  }, []);

  const handleContactScroll = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // The three project categories shown on the Home page
  const featuredCategories = galleryCategories;

  // Flagship product -- pulled straight from the services data, not hardcoded
  const liquidAcrylic = services.find((s) => s.id === 'liquid-acrylic-led');

  // Capability list uses the real service titles already defined in data/services.js
  const tickerItems = services.map((s) => s.title);

  // Setup Gallery Images
  const setups = [
    { title: "CNC Fiber Laser", desc: "High-precision metal cutting & heavy steel profiling", img: "/assets/factory_fiber_laser.jpg" },
    { title: "CNC Router 2x (Stone & Wood)", desc: "Dual-spindle heavy-duty routing & 3D engraving", img: "/assets/cnc_router_real.jpg" },
    { title: "CO2 Laser Cutting & CNC Bending", desc: "Acrylic profiling and MDF detailing, plus computer-controlled press brake forming", img: "/assets/factory_co2_laser.jpg" },
    { title: "3D Printing (800x800mm Bed)", desc: "Precision additive manufacturing for large letter returns & components", img: "/assets/industrial_3d_printing.png" },
    { title: "Liquid Acrylic Signage Setup", desc: "Full in-house production with channel bending & UV casting", img: "/assets/factory_acrylic_fabrication.jpg" },
    { title: "Laser Welding + Fabrication", desc: "High-strength precision seam welding & assembly line", img: "/assets/factory_welding_fabrication.jpg" }
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <PageMeta title="Adhitech | Liquid Acrylic LED Signage & Channel Letter Manufacturer" description="Adhitech is a Jaipur-based signage manufacturer producing Liquid Acrylic LED letters, channel letters, corporate signage and CNC-fabricated components for brands and trade customers." />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@600;700&display=swap');

        .hero-ticker {
          overflow: hidden !important;
          white-space: nowrap;
          padding: 1.15rem 0 !important;
        }

        .hero-ticker-track {
          display: flex;
          align-items: center;
          gap: 2rem;
          width: max-content;
          padding-left: max(2rem, calc((100vw - 1500px) / 2));
          animation: adhitech-ticker-scroll 42s linear infinite;
          will-change: transform;
        }

        .hero-ticker-track span {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          gap: .65rem;
          white-space: nowrap;
          font-size: .82rem;
          line-height: 1.4;
          letter-spacing: .12em;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .hero-ticker-track span::before {
          content: '';
          display: inline-block;
          width: 5px;
          height: 5px;
          flex: 0 0 5px;
          border-radius: 50%;
          background: var(--accent);
        }

        @keyframes adhitech-ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .hero-ticker:hover .hero-ticker-track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-ticker-track {
            animation: none;
            width: 100%;
            overflow-x: auto;
          }
        }

        body .hero-headline.hero-headline.hero-headline {
          display: block;
          width: 100%;
          max-width: 1100px !important;
          margin: 0 auto 1.8rem !important;
          text-align: center !important;
          font-family: 'Barlow Condensed', 'Archivo', sans-serif !important;
          font-size: clamp(1.7rem, 3.4vw, 3.1rem) !important;
          font-weight: 600 !important;
          line-height: 1.2 !important;
          letter-spacing: .04em !important;
          text-transform: uppercase;
          text-wrap: balance;
        }

        body .hero-headline.hero-headline span {
          display: block;
          width: 100%;
        }

        body .hero-headline.hero-headline span:nth-child(2) {
          margin-top: .25em;
        }

        @media (max-width: 760px) {
          body .hero-headline.hero-headline.hero-headline {
            font-size: clamp(1.5rem, 7vw, 2.2rem) !important;
            letter-spacing: .04em !important;
            line-height: 1.25 !important;
          }
        }
      `}</style>
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="dark-zone"
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 'clamp(80px, 18vh, 200px)',
          paddingBottom: '110px'
        }}
      >
        {/* Backdrop Visual (Faux Video/High End Render) */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            backgroundColor: '#050505'
          }}
        >
          {/* Overlay to dim backdrop */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.95) 100%)',
              zIndex: 1
            }}
          />
          {useHeroVideo ? (
            <video
              src="/assets/router_cutting.mp4"
              poster="/assets/hero_background.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.4,
                filter: 'grayscale(30%)'
              }}
            />
          ) : (
            <img 
              src="/assets/hero_background.jpg" 
              alt="Adhitech Premium LED Signage Background"
              fetchPriority="high"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.4,
                filter: 'grayscale(30%)'
              }}
            />
          )}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 3, paddingBottom: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '1150px', margin: '0 auto', textAlign: 'center' }}>
            <p className="section-tag" style={{ marginBottom: '1.5rem' }}>Signage manufacturer in Jaipur, Rajasthan</p>
            <h1
              ref={headlineRef}
              className="hero-headline"
              style={{
                fontSize: 'clamp(1rem, 1.95vw, 1.8rem)',
                lineHeight: '1.15',
                marginBottom: '1.75rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 800
              }}
            >
              <span style={{ display: 'block', color: '#fff' }}>From Idea to Finished Product.</span>
              <span style={{ display: 'block', color: 'var(--accent-hover)' }}>Engineered &amp; Manufactured In-House.</span>
            </h1>
            <p 
              ref={subheadlineRef}
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                marginBottom: '2.25rem',
                maxWidth: '650px',
                width: '100%',
                margin: '0 auto 2.25rem',
                textAlign: 'center'
              }}
            >
              Liquid Acrylic LED letters, signboards and CNC work, built in our own factory. Whether you run a shop, a brand or a sign-making business, send us a drawing or an idea and get a finished sign.
            </p>
            <div 
              ref={ctaRef}
              style={{
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <MagneticButton onClick={handleContactScroll} className="solid">
                Get a Quote
              </MagneticButton>
              <MagneticButton onClick={() => navigate('/b2b')}>
                For Sign Makers &amp; Trade
              </MagneticButton>
            </div>
          </div>
        </div>

        <div
          className="hero-ticker"
          style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 2, height: '58px', display: 'flex', alignItems: 'center', padding: '0', borderTop: '1px solid var(--border-color)', background: 'rgba(8, 9, 10, 0.96)' }}
        >
          <div className="hero-ticker-track">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Company Introduction Section */}
      <section 
        style={{
          padding: '8rem 0',
          position: 'relative',
          zIndex: 2,
          borderTop: '1px solid var(--border-color)'
        }}
      >
        <div className="container">
          <div 
            className="intro-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1fr',
              gap: '6rem',
              alignItems: 'center'
            }}
          >
            {/* Left: Image */}
            <div 
              className="intro-image"
              style={{
                position: 'relative',
                borderRadius: '6px',
                overflow: 'hidden'
              }}
            >
              <img 
                src="/assets/factory_real.jpg" 
                alt="Adhitech Manufacturing Plant"
                style={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Right: Text */}
            <div 
              className="intro-text"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: '1.1' }}>
                Built for the Details. Equipped for the Scale.
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                Adhitech is a signage and fabrication manufacturer based in Jaipur, Rajasthan. We produce Liquid Acrylic LED letters, channel letters, corporate signage and custom-fabricated components, supported by in-house CNC, laser cutting, bending and 3D printing capabilities.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                From a single custom letter to a multi-location rollout, we combine specialist signage production with the machinery and people to manufacture consistently.
              </p>
              <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
                {[
                  'Fiber laser and CNC machining in-house',
                  'Material and lighting options selected for the project',
                  'In-house Liquid Acrylic processing and UV curing'
                ].map((item) => (
                  <li key={item} style={{ padding: '0.9rem 0', borderTop: '1px solid var(--border-color)' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Two customer paths: corporate projects and trade manufacturing */}
      <section className="home-audience-section">
        <div className="container">
          <div className="home-audience-heading">
            <span className="section-tag">Who we work with</span>
            <h2>One manufacturing facility. Two ways to work with us.</h2>
            <p>Whether you need a finished signage project or a production partner behind your own business, start with the right team.</p>
          </div>
          <div className="home-audience-grid">
            <article className="home-audience-card">
              <img src="/assets/project_liquid_acrylic_hotel.jpg" alt="Completed Liquid Acrylic LED signage project" loading="lazy" />
              <div className="home-audience-copy">
                <span>For brands & businesses</span>
                <h3>Corporate Signage Projects</h3>
                <p>LED letters, complete sign boards, ACP signage and custom branding projects—from manufacturing to installation coordination.</p>
                <Link to="/projects">Explore our projects <ArrowRight size={16} /></Link>
              </div>
            </article>
            <article className="home-audience-card">
              <img src="/assets/factory_acrylic_fabrication.jpg" alt="In-house Liquid Acrylic signage manufacturing" loading="lazy" />
              <div className="home-audience-copy">
                <span>For sign makers & fabricators</span>
                <h3>B2B Manufacturing Partner</h3>
                <p>Outsource Liquid Acrylic and channel-letter production, share drawings for quotations, and discuss repeat or batch requirements.</p>
                <Link to="/b2b">Explore B2B manufacturing <ArrowRight size={16} /></Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Liquid Acrylic Technology Feature Section */}
      {liquidAcrylic && (
        <section
          style={{
            padding: '8rem 0',
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'var(--bg-primary)',
            borderTop: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
            overflow: 'hidden'
          }}
        >
          <div className="container">
            <div
              className="liquid-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.1fr',
                gap: '5rem',
                alignItems: 'center'
              }}
            >
              {/* Text Side */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: '1.1' }}>
                  {liquidAcrylic.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                  {liquidAcrylic.description}
                </p>

                <div
                  className="liquid-specs"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginTop: '1rem'
                  }}
                >
                  {liquidAcrylic.specs.map((spec, i) => (
                    <div
                      key={i}
                      style={{ padding: '0.9rem 0', borderTop: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                    >
                      {spec}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <MagneticButton onClick={() => navigate('/services')} className="solid">
                    Explore The Process
                  </MagneticButton>
                </div>
              </div>

              {/* Media Side */}
              <div
                style={{ borderRadius: '6px', overflow: 'hidden' }}
              >
                {liquidAcrylic.video ? (
                  <video
                    src={liquidAcrylic.video}
                    poster={liquidAcrylic.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    style={{ width: '100%', height: '520px', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <img
                    src={liquidAcrylic.image}
                    alt={liquidAcrylic.title}
                    loading="lazy"
                    style={{ width: '100%', height: '520px', objectFit: 'cover', display: 'block' }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <LiquidProcess />

      {/* Featured Projects Section */}
      <section 
        style={{
          padding: '8rem 0',
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div className="container">
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '4rem'
            }}
            className="section-header"
          >
            <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.6rem)' }}>Projects</h2>
            <Link 
              to="/projects"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-title)',
                fontSize: '0.95rem',
                fontWeight: 600
              }}
              className="hover-trigger"
            >
              View All <ArrowRight size={16} style={{ transition: 'transform 0.3s' }} className="arrow-icon" />
            </Link>
          </div>

          {/* Featured Project Cards */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2.5rem'
            }}
            className="featured-grid"
          >
            {featuredCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/projects#${cat.id}`}
                className="card-premium"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                <div style={{ height: '300px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={cat.cover} 
                    alt={cat.title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem' }}>{cat.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {cat.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: 'auto' }}>
                    View photos &amp; videos <ChevronRight size={14} style={{ color: 'var(--accent)' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Setup Section */}
      <section 
        style={{
          padding: '8rem 0',
          backgroundColor: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)' }}>Our Manufacturing Setup</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', lineHeight: '1.7' }}>
              The machines behind our work: fiber and CO2 laser cutting, CNC routing and bending, 3D printing, laser welding and liquid acrylic casting.
            </p>
          </div>

          <div className="setup-grid">
            {setups.map((setup) => (
              <figure key={setup.title} className="setup-card">
                <img src={setup.img} alt={setup.title} loading="lazy" />
                <figcaption>
                  <h3>{setup.title}</h3>
                  <p>{setup.desc}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section 
        style={{
          padding: '8rem 0',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-color)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div className="container">
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '4rem'
            }}
            className="section-header"
          >
            <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.6rem)' }}>Fabrication Capabilities</h2>
            <Link 
              to="/services"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-title)',
                fontSize: '0.95rem',
                fontWeight: 600
              }}
              className="hover-trigger"
            >
              All Services <ArrowRight size={16} style={{ transition: 'transform 0.3s' }} className="arrow-icon" />
            </Link>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem'
            }}
            className="services-preview-grid"
          >
            {services.slice(0, 3).map((service) => (
              <div 
                key={service.id}
                onClick={() => navigate('/services')}
                className="card-premium"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem'
                }}
              >
                <h3 style={{ fontSize: '1.3rem' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                  {service.shortDescription}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: 'auto', paddingTop: '1rem' }}>
                  Learn More <ChevronRight size={14} style={{ color: 'var(--accent)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section 
        style={{
          padding: '8rem 0',
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        <div className="container">
          <div 
            style={{
              position: 'relative',
              borderRadius: '6px',
              padding: '5rem 4rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)'
            }}
            className="cta-banner"
          >
            <div style={{ maxWidth: '650px', position: 'relative', zIndex: 1 }} className="cta-left">
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', lineHeight: '1.2', marginBottom: '1.2rem' }}>
                Have a signage project or production requirement?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                Share your drawings, specifications or project brief. Our team will help you review the requirement and prepare a quotation.
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }} className="cta-right">
              <MagneticButton 
                onClick={handleContactScroll}
                className="solid"
              >
                Inquire Now
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .featured-grid .card-premium,
        .services-preview-grid .card-premium { background: var(--bg-primary); }

        .hover-trigger:hover .arrow-icon {
          transform: translateX(8px);
        }
        
        .setup-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4rem 3rem;
          align-items: start;
        }
        .setup-card:nth-child(even) { margin-top: 5rem; }
        .setup-card img {
          display: block;
          width: 100%;
          aspect-ratio: 3 / 2;
          object-fit: cover;
          border-radius: 6px;
        }
        .setup-card figcaption { padding-top: 1rem; }
        .setup-card h3 { font-size: 1.2rem; }
        .setup-card p { color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; margin-top: 0.35rem; max-width: 48ch; }

        @media (max-width: 991px) {
          .intro-grid {
            grid-template-columns: 1fr !important;
            gap: 3.5rem !important;
          }
          .intro-image img {
            height: 380px !important;
          }
          .liquid-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .liquid-grid > div:last-child img,
          .liquid-grid > div:last-child video {
            height: 340px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 3rem !important;
          }
          .featured-grid, .services-preview-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
          .cta-banner {
            flex-direction: column;
            gap: 2.5rem;
            text-align: center;
            padding: 4rem 2rem !important;
          }
          .cta-left {
            max-width: 100% !important;
          }
        }
        
        @media (max-width: 600px) {
          .featured-grid, .services-preview-grid, .setup-grid {
            grid-template-columns: 1fr !important;
          }
          .setup-card:nth-child(even) {
            margin-top: 0;
          }
          .liquid-specs {
            grid-template-columns: 1fr !important;
          }
          .hero-ticker {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
