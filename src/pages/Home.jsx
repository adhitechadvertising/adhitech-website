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
/* Layout: a workshop bench. The word view (all eight letters, two rows: finished channel above, back plate below) sits beside a single-stroke section view, over the step caption, transport controls and an eight-step rail. */
:root{
  --bg:#EDEFF1; --panel:#F8F9FA; --bench:#E2E6E9; --grid:#D0D6DB;
  --ink:#161C22; --muted:#56636D; --line:#C5CCD2;
  --acrylicEdge:#6F9FB0; --wall:#FBFCFD; --wallEdge:#7E8D98;
  --glassBed:#BFE0D8; --glassEdge:#5E9A90;
  --acry:#1E6EE0; --acp:#D5DADF; --acpEdge:#7A858F; --sheet:#B9C0C7; --sil:#8A949D;
  --led:#FFF0BE; --cut:#E5560A;
  --night:#080B10; --glow:#78B4FF; --onNight:#CBD5DE; --glass:rgba(255,255,255,.5);
  --f-display:'Barlow Condensed','Arial Narrow',sans-serif;
  --f-body:'Barlow',system-ui,-apple-system,'Segoe UI',sans-serif;
  --f-mono:'IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --bg:#0F1318; --panel:#161B21; --bench:#1B222A; --grid:#26303A;
    --ink:#E7ECF0; --muted:#93A0AB; --line:#2D3640;
    --acrylicEdge:#5C8EA0; --wall:#D9DEE2; --wallEdge:#6E7C87;
    --glassBed:#264542; --glassEdge:#4B8A80;
    --acry:#3A86FF; --acp:#59636D; --acpEdge:#9AA6B1; --sheet:#38414A; --sil:#A9B4BE;
    --led:#FFE9A0; --cut:#FF7A2F;
    --night:#05070A; --glow:#6FB0FF; --onNight:#CBD5DE; --glass:rgba(255,255,255,.08);
    color-scheme:dark;
  }
}
:root[data-theme="dark"]{
  --bg:#0F1318; --panel:#161B21; --bench:#1B222A; --grid:#26303A;
  --ink:#E7ECF0; --muted:#93A0AB; --line:#2D3640;
  --acrylicEdge:#5C8EA0; --wall:#D9DEE2; --wallEdge:#6E7C87;
  --glassBed:#264542; --glassEdge:#4B8A80;
  --acry:#3A86FF; --acp:#59636D; --acpEdge:#9AA6B1; --sheet:#38414A; --sil:#A9B4BE;
  --led:#FFE9A0; --cut:#FF7A2F;
  --night:#05070A; --glow:#6FB0FF; --onNight:#CBD5DE; --glass:rgba(255,255,255,.08);
  color-scheme:dark;
}
*{box-sizing:border-box}
body{
  margin:0; background:#0A0A0A; color:var(--ink); font-family:var(--f-body); font-size:16px; line-height:1.5;
  padding:0;
}
.wrap{max-width:none;margin:0;display:flex;flex-direction:column;gap:18px}
.head{display:flex;flex-direction:column;gap:4px}
h1{font-family:var(--f-display);font-weight:700;font-size:clamp(36px,7vw,60px);line-height:1;letter-spacing:.02em;text-transform:uppercase;margin:0;text-wrap:balance}
.sub{margin:0;color:var(--muted);max-width:66ch}
.views{display:grid;grid-template-columns:1.6fr 1fr;gap:14px}
.view{margin:0;border:1px solid var(--line);border-radius:6px;overflow:hidden;background:var(--panel);min-width:0}
.vh{display:flex;justify-content:space-between;gap:12px;padding:8px 12px;font:500 11px var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--line)}
.view svg{display:block;width:100%;height:auto}
.txt{font:500 10px var(--f-mono);fill:var(--muted);letter-spacing:.02em}
.txt-n{fill:var(--onNight)}
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
.btn:focus-visible,.rail button:focus-visible,select:focus-visible,input[type=range]:focus-visible{outline:2px solid var(--acry);outline-offset:2px}
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
@media (max-width:760px){.views{grid-template-columns:1fr}}
@media (max-width:420px){.rail{grid-template-columns:repeat(2,1fr)}.btn{padding:8px 10px}}
</style>
</head>
<body>
<main class="wrap">

  <section class="views" aria-label="Animation">
    <figure class="view">
      <figcaption class="vh"><span>Top view</span><span>ADHITECH · 300 mm letters</span></figcaption>
      <svg id="svgTop" viewBox="0 0 580 350" role="img" aria-label="Top view of the word ADHITECH: channels set on glass, filled with liquid acrylic, lifted off, joined to an ACP back plate with an LED strip, sealed with silicone and lit">
        <defs id="defsTop">
          <pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" style="stroke:var(--grid)" stroke-width=".6"/></pattern>
          <clipPath id="jugClip"><rect x="-14" y="-26" width="28" height="52" rx="4"/></clipPath>
          <filter id="blur8" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7"/></filter>
          <filter id="blur3" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.5"/></filter>
        </defs>
        <rect width="580" height="350" style="fill:var(--bench)"/>
        <rect width="580" height="350" fill="url(#grid)"/>
        <rect id="nightTop" width="580" height="350" style="fill:var(--night)" opacity="0"/>

        <g id="W" transform="translate(36 60)">
          <g id="glowG"></g>
          <g id="sheetG" opacity="0">
            <rect x="-16" y="-18" width="528" height="136" rx="3" style="fill:var(--glassBed);stroke:var(--glassEdge);fill-opacity:.75" stroke-width="1"/>
            <path d="M20,118 L100,-18 M150,118 L230,-18 M290,118 L370,-18 M420,118 L500,-18" fill="none" style="stroke:var(--wall)" stroke-width="6" stroke-opacity=".28"/>
          </g>
          <g id="artG"></g>
          <g id="dims" opacity="0">
            <path d="M-12,0 V100 M-17,0 H-7 M-17,100 H-7" fill="none" style="stroke:var(--muted)" stroke-width=".7"/>
            <text x="-20" y="50" transform="rotate(-90 -20 50)" text-anchor="middle" class="txt" style="font-size:8px">300 mm</text>
          </g>
          <g id="shadG"></g>
          <g id="flipG"><g id="unitG">
            <g id="spreadG"></g>
            <g id="wallG"></g>
            <circle id="head" r="2.6" style="fill:var(--cut)" opacity="0"/>
            <g id="plateG">
              <rect id="acpSheet" x="-20" y="-14" width="536" height="128" rx="2" style="fill:var(--sheet);stroke:var(--acpEdge)" stroke-width=".8" opacity="0"/>
              <text id="acpTag" x="-10" y="109" text-anchor="start" class="txt" style="font-size:8px" opacity="0">ACP sheet</text>
              <g id="plateLetters"></g>
              <g id="router" opacity="0">
                <g id="ringR"><circle r="5" style="fill:none;stroke:var(--cut)" stroke-width=".8" stroke-dasharray="3 2.5"/></g>
                <circle r="1.8" style="fill:var(--cut)"/>
                <path d="M-8,0H-3M3,0H8M0,-8V-3M0,3V8" style="stroke:var(--cut)" stroke-width=".7"/>
              </g>
            </g>
            <g id="beadG"></g>
            <g id="gun" opacity="0"><path d="M0,0 L-3.5,-8 H3.5 Z" style="fill:var(--ink)"/><circle cy="-10" r="2.6" style="fill:var(--sil);stroke:var(--ink)" stroke-width=".6"/></g>
            <g id="litG"></g>
          </g></g>
        </g>

        <g id="jug" opacity="0">
          <g clip-path="url(#jugClip)">
            <g id="liqRot"><rect id="liq" x="-60" y="-20" width="120" height="120" style="fill:var(--acry)"/></g>
          </g>
          <rect x="-14" y="-26" width="28" height="52" rx="4" style="fill:var(--glass);stroke:var(--ink)" stroke-width="1.4"/>
          <path d="M-14,-26 L-8,-34 H8 L14,-26" style="fill:var(--glass);stroke:var(--ink)" stroke-width="1.4" stroke-linejoin="round"/>
          <path d="M14,-14 C27,-14 27,10 14,10" fill="none" style="stroke:var(--ink)" stroke-width="1.4"/>
        </g>
        <path id="stream" d="" fill="none" style="stroke:var(--acry)" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="6 3" opacity="0"/>
        <text id="topLab" x="290" y="344" text-anchor="middle" class="txt" style="font-size:11px;fill:var(--ink)"></text>
      </svg>
    </figure>

    <figure class="view">
      <figcaption class="vh"><span>Section A–A</span><span>One stroke, not to scale</span></figcaption>
      <svg id="svgSec" viewBox="0 0 360 350" role="img" aria-label="Cross-section through one stroke of a letter: channel walls on glass, poured liquid acrylic layer, ACP back plate with LED strip, silicone seal">
        <defs>
          <filter id="blur10" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="9"/></filter>
          <linearGradient id="beamG" gradientUnits="userSpaceOnUse" x1="0" y1="166" x2="0" y2="222"><stop offset="0" style="stop-color:var(--led)" stop-opacity=".95"/><stop offset="1" style="stop-color:var(--led)" stop-opacity="0"/></linearGradient>
        </defs>
        <rect width="360" height="350" style="fill:var(--bench)"/>
        <rect id="nightSec" width="360" height="350" style="fill:var(--night)" opacity="0"/>
        <path d="M0,262.5 H360" fill="none" style="stroke:var(--line)" stroke-width="1"/>
        <g id="ghostSec" fill="none" style="stroke:var(--acrylicEdge)" stroke-width="1" stroke-dasharray="4 3" opacity=".8">
          <rect x="52" y="158" width="8" height="80"/>
          <rect x="300" y="158" width="8" height="80"/>
        </g>

        <g id="glassS" opacity="0">
          <rect x="20" y="238" width="320" height="24" style="fill:var(--glassBed);stroke:var(--glassEdge)" stroke-width="1"/>
          <path d="M26,243 H334" fill="none" style="stroke:var(--wall)" stroke-width="1.4" stroke-opacity=".6"/>
        </g>

        <g id="unitS">
          <path id="halo" d="" style="fill:var(--glow)" filter="url(#blur10)" opacity="0"/>
          <path id="resin" d="" style="fill:var(--acry)" opacity="0"/>
          <path id="resinLit" d="" style="fill:var(--led)" opacity="0"/>
          <path id="resinHi" d="" fill="none" style="stroke:var(--wall)" stroke-width="1.2" stroke-linecap="round" opacity="0"/>
          <path id="resinFace" d="M60,237.2 H300" fill="none" style="stroke:var(--wall)" stroke-width="1.6" stroke-linecap="round" opacity="0"/>
          <g id="beams" opacity="0"></g>
          <g id="secBub" fill="none"></g>
          <rect id="wL" x="52" y="238" width="8" height="0" style="fill:var(--wall);stroke:var(--wallEdge)" stroke-width="1"/>
          <rect id="wR" x="300" y="238" width="8" height="0" style="fill:var(--wall);stroke:var(--wallEdge)" stroke-width="1"/>
          <g id="plateS" opacity="0">
            <path d="M44,146 H74 V158 H44 Z M82,146 H278 V158 H82 Z M286,146 H316 V158 H286 Z" style="fill:var(--acp);stroke:var(--acpEdge)" stroke-width="1"/>
            <path d="M44,148.5 H74 M82,148.5 H278 M286,148.5 H316 M44,155.5 H74 M82,155.5 H278 M286,155.5 H316" fill="none" style="stroke:var(--acpEdge)" stroke-width=".7"/>
            <g id="stripS" opacity="0"><rect x="66" y="158" width="228" height="4" style="fill:var(--wall);stroke:var(--wallEdge)" stroke-width=".8"/></g>
            <g id="ledsS"></g>
            <path d="M316,152 H338 V112" fill="none" style="stroke:var(--ink)" stroke-width="1.8" stroke-linejoin="round"/>
          </g>
          <g id="fillets" opacity="0" style="fill:var(--sil)">
            <path d="M52,158 V169 Q52,160 43,158 Z"/><path d="M60,158 V169 Q60,160 69,158 Z"/>
            <path d="M308,158 V169 Q308,160 317,158 Z"/><path d="M300,158 V169 Q300,160 291,158 Z"/>
          </g>
        </g>

        <path id="streamS" d="M180,14 V232" fill="none" style="stroke:var(--acry)" stroke-width="5" stroke-linecap="round" stroke-dasharray="9 4" opacity="0"/>
        <path id="calloutL" d="M180,206 V220" fill="none" style="stroke:var(--muted)" stroke-width=".8" opacity="0"/>
        <text id="callout" x="180" y="200" text-anchor="middle" class="txt" opacity="0">3–4 mm</text>

        <text id="lab1" x="180" y="40" text-anchor="middle" class="txt" opacity="1">Section across one stroke of a letter</text>
        <text id="lab2" x="180" y="40" text-anchor="middle" class="txt" opacity="0">Aluminium or 3D-printed channel</text>
        <text id="lab3" x="180" y="286" text-anchor="middle" class="txt" opacity="0">Channel set on a levelled glass bed</text>
        <text id="lab4" x="180" y="40" text-anchor="middle" class="txt" opacity="0">Liquid acrylic poured into the channel</text>
        <text id="lab5" x="180" y="40" text-anchor="middle" class="txt" opacity="0">Cures flat, lifts off with the channel</text>
        <text id="lab6a" x="180" y="40" text-anchor="middle" class="txt" opacity="0">ACP back plate with rivet holes</text>
        <text id="lab6b" x="180" y="124" text-anchor="middle" class="txt" opacity="0">LED strip, even spacing</text>
        <text id="lab7" x="180" y="40" text-anchor="middle" class="txt" opacity="0">Plate joins the open side of the channel</text>
        <text id="lab8a" x="180" y="40" text-anchor="middle" class="txt" opacity="0">Silicone seals the joint</text>
        <text id="lab8b" x="180" y="286" text-anchor="middle" class="txt txt-n" opacity="0">Face up, LEDs on</text>
      </svg>
    </figure>
  </section>

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

<script>
(function(){
  var NS='http://www.w3.org/2000/svg';
  var $=function(id){return document.getElementById(id);};
  var clamp=function(x,a,b){a=a===undefined?0:a;b=b===undefined?1:b;return Math.min(b,Math.max(a,x));};
  var seg=function(u,a,b){return clamp((u-a)/(b-a));};
  var ease=function(t){return t*t*(3-2*t);};
  var lerp=function(a,b,t){return a+(b-a)*t;};
  var mk=function(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs){e.setAttribute(k,attrs[k]);}if(parent){parent.appendChild(e);}return e;};
  var setO=function(el,v){el.setAttribute('opacity',v);};
  var dash=function(el,p){el.style.strokeDasharray='1 1';el.style.strokeDashoffset=String(1-p);};
  var nz=function(v){return Math.abs(v)<.001?(v<0?-.001:.001):v;};

  var STAGES=[
    {name:'Artwork',dur:5,text:'ADHITECH is set as vector outlines, one per letter, at 300 mm letter height. The outlines drive both the channels and the back plates.',spec:'300 mm letters'},
    {name:'Channel',dur:6,text:'An aluminium or 3D-printed channel is made to follow each letter outline. It forms the side walls of the letter.',spec:'Aluminium or 3D printed'},
    {name:'Glass bed',dur:3,text:'The channels are set on a flat, levelled glass bed. The glass gives the finished face its smooth gloss.',spec:'Flat, levelled glass'},
    {name:'Pour',dur:8,text:'Ready-mixed liquid acrylic is poured into each channel and spreads out to the walls, making a layer 3–4 mm thick.',spec:'3–4 mm liquid acrylic'},
    {name:'Cure, lift',dur:7,text:'The liquid acrylic cures flat on the glass. Once set, the acrylic and channel lift off the glass together as one piece.',spec:'Cures flat on the glass'},
    {name:'Back plate',dur:8,text:'The back plate is cut from ACP sheet on a CNC router, with rivet holes. The plate is cut mirrored, so it reads correctly once it is flipped onto the channel. An LED strip is fixed to it with the LEDs at an even spacing, so the face lights evenly.',spec:'ACP sheet, CNC cut'},
    {name:'Join',dur:5,text:'The back plate is turned over onto the open side of the channel, so the LED strip faces the cured acrylic.',spec:'LED strip faces the acrylic'},
    {name:'Seal, light',dur:8,text:'Industrial-grade silicone seals the joint between the plate and the channel. Turned face up and powered, the letters light evenly.',spec:'Industrial-grade silicone'}
  ];
  var acc=0;STAGES.forEach(function(s){s.start=acc;acc+=s.dur;});
  var TOTAL=acc;

  var LET=[
    {w:64,o:'M0,100 L26,0 L38,0 L64,100 L48,100 L43,82 L21,82 L16,100 Z M25,68 L39,68 L32,30 Z',c:['M9,92 L32,12 L55,92','M16,75 H48']},
    {w:56,o:'M0,0 H28 C48,0 56,22 56,50 C56,78 48,100 28,100 H0 Z M16,16 V84 H27 C37,84 40,68 40,50 C40,32 37,16 27,16 Z',c:['M8,8 H28 C42,8 48,26 48,50 C48,74 42,92 28,92 H8 Z']},
    {w:56,o:'M0,0 H16 V42 H40 V0 H56 V100 H40 V58 H16 V100 H0 Z',c:['M8,94 V6','M48,94 V6','M8,50 H48']},
    {w:16,o:'M0,0 H16 V100 H0 Z',c:['M8,94 V6']},
    {w:60,o:'M0,0 H60 V16 H38 V100 H22 V16 H0 Z',c:['M6,8 H54','M30,14 V94']},
    {w:48,o:'M0,0 H48 V16 H16 V42 H42 V58 H16 V84 H48 V100 H0 Z',c:['M44,8 H8 V92 H44','M14,50 H38']},
    {w:56,o:'M56,28 C52,10 42,0 30,0 C12,0 0,20 0,50 C0,80 12,100 30,100 C42,100 52,90 56,72 L40,68 C38,78 34,84 30,84 C22,84 16,72 16,50 C16,28 22,16 30,16 C34,16 38,22 40,32 Z',c:['M48,30 C46,18 40,8 30,8 C18,8 8,24 8,50 C8,76 18,92 30,92 C40,92 46,82 48,70']},
    {w:56,o:'M0,0 H16 V42 H40 V0 H56 V100 H40 V58 H16 V100 H0 Z',c:['M8,94 V6','M48,94 V6','M8,50 H48']}
  ];
  var N=LET.length,GAP=12,WX=36;
  var ox=[],xx=0;LET.forEach(function(L){ox.push(xx);xx+=L.w+GAP;});
  var WCX=(xx-GAP)/2;
  var cxL=function(i){return WX+ox[i]+LET[i].w/2;};

  var defs=$('defsTop');
  LET.forEach(function(L,i){
    mk('path',{id:'lp'+i,d:L.o,'fill-rule':'evenodd','clip-rule':'evenodd'},defs);
    var cp=mk('clipPath',{id:'lc'+i},defs);mk('use',{href:'#lp'+i},cp);
  });
  function layer(parent,fn){
    return LET.map(function(L,i){
      var g=mk('g',{transform:'translate('+ox[i]+' 0)'},parent);
      return fn(g,L,i)||g;
    });
  }

  var glowEls=layer($('glowG'),function(g,L,i){return mk('use',{href:'#lp'+i,style:'fill:var(--glow)',filter:'url(#blur8)',opacity:0},g);});
  var artEls=[];
  layer($('artG'),function(g,L,i){
    mk('path',{d:L.o,'fill-rule':'evenodd',fill:'none',style:'stroke:var(--acrylicEdge)','stroke-width':1,'stroke-dasharray':'3 3'},g);
    artEls[i]=mk('path',{d:L.o,'fill-rule':'evenodd',pathLength:1,fill:'none',style:'stroke:var(--ink)','stroke-width':1.3,'stroke-linejoin':'miter'},g);
  });
  var shadGs=layer($('shadG'),function(g,L,i){mk('use',{href:'#lp'+i,style:'fill:var(--night)',filter:'url(#blur3)',opacity:0},g);});

  var spreadEls=[],shineEls=[],bubs=[];
  layer($('spreadG'),function(g,L,i){
    var cg=mk('g',{'clip-path':'url(#lc'+i+')'},g);
    spreadEls[i]=mk('circle',{cx:L.w/2,cy:50,r:0,style:'fill:var(--acry)'},cg);
    var tmp=mk('path',{d:L.c[0],fill:'none',stroke:'none'},g);
    var len=tmp.getTotalLength();
    [.18,.38,.58,.8].forEach(function(f,j){
      var pt=tmp.getPointAtLength(len*f);
      var bx=pt.x+((i*3+j*5)%5)-2,by=pt.y+((i*7+j*3)%5)-2;
      var b=mk('circle',{cx:bx,cy:by,r:0,fill:'none',style:'stroke:var(--wall)','stroke-width':.7,opacity:0},cg);
      var r=mk('circle',{cx:bx,cy:by,r:0,fill:'none',style:'stroke:var(--wall)','stroke-width':.6,opacity:0},cg);
      bubs.push({b:b,r:r,s:.02+((i*4+j)%8)*.07+j*.03});
    });
    g.removeChild(tmp);
    shineEls[i]=mk('rect',{x:0,y:-20,width:12,height:150,fill:'#fff',opacity:0},cg);
  });

  var wallE=[],wallO=[];
  layer($('wallG'),function(g,L,i){
    wallE[i]=mk('path',{d:L.o,'fill-rule':'evenodd',pathLength:1,fill:'none',style:'stroke:var(--wallEdge)','stroke-width':4.2,'stroke-linejoin':'miter'},g);
    wallO[i]=mk('path',{d:L.o,'fill-rule':'evenodd',pathLength:1,fill:'none',style:'stroke:var(--wall)','stroke-width':2.4,'stroke-linejoin':'miter'},g);
  });
  var lens=wallO.map(function(p){return p.getTotalLength();});

  var plateFill=[],cutEls=[],holeEls=[],stripB=[],stripT=[],stripGs=[],ledList=[],holeList=[];
  layer($('plateLetters'),function(g,L,i){
    plateFill[i]=mk('use',{href:'#lp'+i,style:'fill:var(--acp);stroke:var(--acpEdge)','stroke-width':.8,opacity:0},g);
    var sg=mk('g',{},g);stripGs[i]=sg;
    stripB[i]=[];stripT[i]=[];
    L.c.forEach(function(d){
      var pb=mk('path',{d:d,pathLength:1,fill:'none',style:'stroke:var(--wallEdge)','stroke-width':4.4,'stroke-linejoin':'round'},sg);
      var pt=mk('path',{d:d,pathLength:1,fill:'none',style:'stroke:var(--wall)','stroke-width':3,'stroke-linejoin':'round'},sg);
      stripB[i].push(pb);stripT[i].push(pt);
      var tl=pt.getTotalLength();
      for(var dd=6;dd<tl-3;dd+=11){
        var q=pt.getPointAtLength(dd);
        var el=mk('circle',{cx:q.x,cy:q.y,r:1.5,style:'fill:var(--led);stroke:var(--wallEdge)','stroke-width':.4,opacity:0},sg);
        ledList.push({el:el});
      }
      var alt=1;
      for(var hd=16;hd<tl-6;hd+=34){
        var a=pt.getPointAtLength(hd),b=pt.getPointAtLength(Math.min(tl,hd+1));
        var tx=b.x-a.x,ty=b.y-a.y,m=Math.sqrt(tx*tx+ty*ty)||1;
        var h=mk('circle',{cx:a.x-ty/m*5*alt,cy:a.y+tx/m*5*alt,r:1.6,style:'fill:var(--ink)',opacity:0},g);
        holeList.push({el:h});alt=-alt;
      }
    });
    cutEls[i]=mk('path',{d:L.o,'fill-rule':'evenodd',pathLength:1,fill:'none',style:'stroke:var(--cut)','stroke-width':1.3},g);
  });
  ledList.forEach(function(l,k){l.f=k/ledList.length;});
  holeList.forEach(function(h,k){h.f=k/holeList.length;});

  var beadEls=layer($('beadG'),function(g,L,i){
    return mk('path',{d:L.o,'fill-rule':'evenodd',pathLength:1,fill:'none',style:'stroke:var(--sil)','stroke-width':3,'stroke-linejoin':'round'},g);
  });
  var litEls=layer($('litG'),function(g,L,i){return mk('use',{href:'#lp'+i,style:'fill:var(--led)',opacity:0},g);});

  var LEDX=[100,140,180,220,260];
  LEDX.forEach(function(x){
    mk('path',{d:'M'+(x-6)+',162 a6,6 0 0 0 12,0 Z',style:'fill:var(--led);stroke:var(--wallEdge);stroke-width:.8',opacity:0},$('ledsS'));
    mk('polygon',{points:(x-5)+',166 '+(x+5)+',166 '+(x+46)+',222 '+(x-46)+',222',fill:'url(#beamG)'},$('beams'));
  });
  var ledSEls=$('ledsS').children;
  var bubS=[];
  for(var j=0;j<10;j++){
    var sx=72+j*24+(((j*7)%5)-2)*3;
    var d1=mk('circle',{cx:sx,cy:234,r:0,style:'stroke:var(--wall)','stroke-width':1,opacity:0},$('secBub'));
    var d2=mk('circle',{cx:sx,cy:234,r:0,style:'stroke:var(--wall)','stroke-width':.9,opacity:0},$('secBub'));
    bubS.push({b:d1,r:d2,x:sx,s:.02+j*.06});
  }

  var rail=$('rail');
  var railBtns=STAGES.map(function(s,i){
    var li=document.createElement('li');
    var b=document.createElement('button');b.type='button';
    b.innerHTML='<span class="n">'+(i+1)+'</span><span class="t">'+s.name+'</span>';
    b.addEventListener('click',function(){jump(i);});
    li.appendChild(b);rail.appendChild(li);return b;
  });

  var T=0,playing=true,speed=1,last=0,lastIdx=-1,labLast='';
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){T=TOTAL;playing=false;}

  var rot=function(x,y,a){return [x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)];};
  var lab=function(el,pi,pn){setO(el,seg(pi,0,.12)*(1-seg(pn,0,.1)));};
  var setLab=function(t){if(t!==labLast){labLast=t;$('topLab').textContent=t;}};
  var headPt=function(i,f){var p=wallO[i].getPointAtLength(lens[i]*clamp(f));return [ox[i]+p.x,p.y];};

  function render(){
    var P=STAGES.map(function(s){return clamp((T-s.start)/s.dur);});
    var p1=P[0],p2=P[1],p3=P[2],p4=P[3],p5=P[4],p6=P[5],p7=P[6],p8=P[7];
    var pourAll=ease(seg(p4,.1,.95));
    var liftUp=ease(seg(p5,.62,.76)),gone=ease(seg(p5,.72,.9)),settle=ease(seg(p5,.88,1));
    var lift=liftUp*(1-settle);
    var join=ease(seg(p7,.05,.9));
    var sp=nz(Math.cos(Math.PI*seg(p7,.05,.5)));
    var sxv=nz(Math.cos(Math.PI*seg(p8,.5,.68)));
    var lit=ease(seg(p8,.72,.95));
    var i,k;

    setO($('nightTop'),.9*seg(p8,.62,.78));
    setO($('nightSec'),.9*seg(p8,.62,.78));

    /* 1 artwork */
    var pa=seg(p1,.04,.85)*LET.length;
    for(i=0;i<N;i++){dash(artEls[i],clamp(pa-i));}
    setO($('artG'),1-seg(p2,.3,.8));
    setO($('dims'),seg(p1,.6,.95)*(1-seg(p2,.3,.8)));

    /* 2 channel */
    var pw=seg(p2,.06,.94)*N;
    for(i=0;i<N;i++){var ci=clamp(pw-i);dash(wallE[i],ci);dash(wallO[i],ci);}
    var hk=Math.min(N-1,Math.floor(pw)),hp=headPt(hk,pw-hk);
    $('head').setAttribute('transform','translate('+hp[0]+' '+hp[1]+')');
    setO($('head'),(pw>0&&pw<N)?1:0);

    /* 3 glass */
    var e3=ease(seg(p3,0,.7));
    $('sheetG').setAttribute('transform','translate('+(gone*180)+' '+((1-e3)*14)+')');
    setO($('sheetG'),e3*(1-gone));

    /* 4 pour: jug moves letter to letter */
    var u=seg(p4,.08,.96)*N;
    var kk=Math.min(N-1,Math.floor(u)),f=u>=N?1:u-kk;
    var move=ease(seg(f,0,.25)),pf=seg(f,.25,1);
    var prevX=kk===0?cxL(0)-40:cxL(kk-1);
    var jx=lerp(prevX,cxL(kk),move);
    var tilt=ease(seg(p4,0,.08))*(1-ease(seg(p4,.96,1)));
    var aRad=-50*Math.PI/180*tilt,aDeg=-50*tilt;
    var sv=rot(-8,-34,aRad);
    $('jug').setAttribute('transform','translate('+(jx-sv[0])+' '+(40-sv[1])+') rotate('+aDeg+')');
    setO($('jug'),seg(p4,0,.06)*(1-seg(p4,.96,1)));
    $('liqRot').setAttribute('transform','rotate('+(-aDeg)+')');
    $('liq').setAttribute('y',lerp(-20,18,pourAll));
    var streaming=(u>0&&u<N&&f>.25&&p4<.96);
    $('stream').setAttribute('d','M'+jx+' 40 V108');
    $('stream').style.strokeDashoffset=String(-T*30);
    setO($('stream'),streaming?1:0);
    for(i=0;i<N;i++){
      var r=u>=N?1:(i<kk?1:(i===kk?ease(pf):0));
      spreadEls[i].setAttribute('r',80*r);
      spreadEls[i].style.opacity=.9+.1*seg(p5,0,.5);
    }

    /* 5 cure, lift */
    var cure=seg(p5,0,.62);
    bubs.forEach(function(b){
      var e=b.s+.22;
      if(cure>=b.s&&cure<e){var t=(cure-b.s)/(e-b.s);b.b.setAttribute('r',lerp(.8,2.4,t));setO(b.b,.9);}else{setO(b.b,0);}
      if(cure>=e&&cure<e+.05){var t2=(cure-e)/.05;b.r.setAttribute('r',lerp(2.4,6,t2));setO(b.r,1-t2);}else{setO(b.r,0);}
    });
    var shp=seg(p5,.3,.62);
    for(i=0;i<N;i++){
      shineEls[i].setAttribute('transform','translate('+lerp(-20,LET[i].w+10,shp)+' 0) rotate(18 0 50)');
      setO(shineEls[i],.3*Math.sin(Math.PI*shp));
    }
    var kS=1+.06*lift;
    $('unitG').setAttribute('transform','translate('+WCX+' 50) scale('+kS+') translate('+(-WCX)+' -50)');
    for(i=0;i<N;i++){
      shadGs[i].setAttribute('transform','translate('+(ox[i]+4*lift)+' '+(6*lift)+')');
      setO(shadGs[i],.35*lift);
    }
    $('flipG').setAttribute('transform','translate('+WCX+' 0) scale('+Math.abs(sxv)+' 1) translate('+(-WCX)+' 0)');

    /* 6 back plate */
    var pc=seg(p6,.1,.55)*N;
    setO($('acpSheet'),seg(p6,0,.08)*(1-seg(p6,.52,.68)));
    
    for(i=0;i<N;i++){
      var c6=clamp(pc-i);
      dash(cutEls[i],c6);
      cutEls[i].style.opacity=1-seg(p6,.55,.7);
      setO(plateFill[i],seg(c6,.9,1));
    }
    var rk=Math.min(N-1,Math.floor(pc)),rp=headPt(rk,pc-rk);
    $('router').setAttribute('transform','translate('+rp[0]+' '+rp[1]+')');
    setO($('router'),(pc>0&&pc<N)?1:0);
    $('ringR').setAttribute('transform','rotate('+(T*240)+')');
    holeList.forEach(function(h){setO(h.el,seg(p6,.56+h.f*.07,.6+h.f*.07));});
    var stripP=seg(p6,.68,.8);
    for(i=0;i<N;i++){
      stripB[i].forEach(function(p){dash(p,stripP);});
      stripT[i].forEach(function(p){dash(p,stripP);});
      setO(stripGs[i],sp>0?1:0);
    }
    ledList.forEach(function(l){setO(l.el,seg(p6,.78+l.f*.15,.82+l.f*.15));});

    /* 7 join: plate flips and slides onto the channel */
    var dy=158*(1-join);
    $('plateG').setAttribute('transform','translate(0 '+dy+') translate('+WCX+' 50) scale('+(-sp)+' 1) translate('+(-WCX)+' -50)');
    setO($('plateG'),sxv>0?1:0);

    /* 8 silicone, flip, light */
    var pb=seg(p8,.04,.45)*N;
    for(i=0;i<N;i++){dash(beadEls[i],clamp(pb-i));}
    setO($('beadG'),sxv>0?1:0);
    var bk=Math.min(N-1,Math.floor(pb)),bp=headPt(bk,pb-bk);
    $('gun').setAttribute('transform','translate('+bp[0]+' '+bp[1]+')');
    setO($('gun'),(pb>0&&pb<N)?1:0);
    for(i=0;i<N;i++){setO(litEls[i],.45*lit);setO(glowEls[i],.95*lit);}

    /* in-canvas label */
    var tl='';
    if(T<STAGES[1].start){tl='Vector outlines, 300 mm letter height';}
    else if(T<STAGES[2].start){tl='Aluminium or 3D-printed channels';}
    else if(T<STAGES[3].start){tl='Channels set on a levelled glass bed';}
    else if(T<STAGES[4].start){tl='Ready-mixed liquid acrylic, 3–4 mm layer';}
    else if(T<STAGES[5].start){tl=p5<.62?'Curing flat on the glass':'Lifted off with the channel';}
    else if(T<STAGES[6].start){tl=p6<.55?'ACP back plate, CNC cut mirrored':(p6<.68?'Rivet holes':'LED strip, even spacing');}
    else if(T<STAGES[7].start){tl='Plate turned over onto the open side';}
    else{tl=p8<.45?'Industrial-grade silicone seal':(p8<.68?'Turned face up':'Lit');}
    setLab(tl);

    /* section view */
    setO($('ghostSec'),.8*(1-seg(p2,.85,1)));
    var hh=80*ease(seg(p2,.1,.8));
    ['wL','wR'].forEach(function(id){$(id).setAttribute('y',238-hh);$(id).setAttribute('height',hh);});
    $('glassS').setAttribute('transform','translate(0 '+((1-e3)*30+gone*40)+')');
    setO($('glassS'),e3*(1-gone));

    var uy=-40*liftUp*(1-settle)+24*settle;
    $('unitS').setAttribute('transform','translate(0 '+uy+') translate(0 192) scale(1 '+sxv+') translate(0 -192)');

    var yE=238-16*pourAll;
    var dome=1.6*seg(p4,.85,1);
    var rd='M60,238 L60,'+yE+' Q180,'+(yE-2*dome)+' 300,'+yE+' L300,238 Z';
    $('resin').setAttribute('d',rd);$('resinLit').setAttribute('d',rd);$('halo').setAttribute('d',rd);
    setO($('resin'),pourAll>0.001?(.8+.2*seg(p5,0,.5)):0);
    $('resinHi').setAttribute('d','M60,'+yE+' Q180,'+(yE-2*dome)+' 300,'+yE);
    setO($('resinHi'),.55*seg(p4,.9,1));
    setO($('resinFace'),.8*seg(p5,.3,.6));
    setO($('resinLit'),.3*lit);
    setO($('halo'),.85*lit);
    setO($('beams'),.9*lit);

    var plOff=-78*(1-join);
    $('plateS').setAttribute('transform','translate(0 '+plOff+')');
    setO($('plateS'),seg(p6,.05,.4));
    setO($('stripS'),seg(p6,.68,.8));
    for(i=0;i<ledSEls.length;i++){setO(ledSEls[i],seg(p6,.78+i*.04,.84+i*.04));}
    setO($('fillets'),seg(p8,0,.35));

    bubS.forEach(function(b){
      var e=b.s+.3;
      var tt=(b.x-60)/240;var ys=yE-4*tt*(1-tt)*dome;
      if(cure>=b.s&&cure<e){var t=(cure-b.s)/(e-b.s);b.b.setAttribute('cy',lerp(235,ys+2.4,ease(t)));b.b.setAttribute('r',lerp(1,2.4,t));setO(b.b,.9);}else{setO(b.b,0);}
      if(cure>=e&&cure<e+.05){var t2=(cure-e)/.05;b.r.setAttribute('cy',ys+1.5);b.r.setAttribute('r',lerp(2.4,7,t2));setO(b.r,1-t2);}else{setO(b.r,0);}
    });
    $('streamS').setAttribute('d','M180,14 V'+(yE+1));
    $('streamS').style.strokeDashoffset=String(-T*40);
    setO($('streamS'),seg(p4,.12,.18)*(1-seg(p4,.93,.98)));
    setO($('callout'),seg(p4,.85,1)*(1-seg(p5,.5,.7)));
    setO($('calloutL'),seg(p4,.85,1)*(1-seg(p5,.5,.7)));

    setO($('lab1'),1-seg(p2,0,.1));
    lab($('lab2'),p2,p3);lab($('lab3'),p3,p4);lab($('lab4'),p4,p5);lab($('lab5'),p5,p6);
    setO($('lab6a'),seg(p6,0,.12)*(1-seg(p7,0,.1)));
    setO($('lab6b'),seg(p6,.7,.82)*(1-seg(p7,0,.1)));
    lab($('lab7'),p7,p8);
    setO($('lab8a'),seg(p8,.04,.14)*(1-seg(p8,.5,.58)));
    setO($('lab8b'),seg(p8,.7,.85));

    /* ui */
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
  function jump(i){T=STAGES[i].start;playing=true;updateBtn();render();}
  function frame(ts){
    if(last&&playing&&inView){
      var dt=Math.min(.1,(ts-last)/1000);
      T+=dt*speed;
      if(T>=TOTAL){T=TOTAL;playing=false;updateBtn();}
      render();
    }
    last=ts;
    requestAnimationFrame(frame);
  }

  $('btnPlay').addEventListener('click',function(){
    if(playing){playing=false;}else{if(T>=TOTAL){T=0;}playing=true;}
    updateBtn();render();
  });
  $('btnNext').addEventListener('click',function(){
    var idx=Math.max(0,lastIdx);if(idx<STAGES.length-1){jump(idx+1);}
  });
  $('btnPrev').addEventListener('click',function(){
    var idx=Math.max(0,lastIdx);
    if(T-STAGES[idx].start>1.2||idx===0){jump(idx);}else{jump(idx-1);}
  });
  $('scrub').addEventListener('input',function(e){
    T=(Number(e.target.value)/1000)*TOTAL;updateBtn();render();
  });
  $('speed').addEventListener('change',function(e){speed=Number(e.target.value);});

  // The iframe cannot reliably detect whether its parent-page section is visible.
  // The React page sends visibility updates when the manufacturing section enters/leaves view.
  var inView=false,wrapEl=document.querySelector('.wrap');
  window.addEventListener('message',function(e){
    if(e.source!==parent||!e.data||typeof e.data.adhitechLiquidProcessVisible!=='boolean')return;
    inView=e.data.adhitechLiquidProcessVisible;
  });
  function report(){parent.postMessage({adhitechLiquidProcess:Math.ceil(wrapEl.getBoundingClientRect().height)},'*');}
  if('ResizeObserver' in window){new ResizeObserver(report).observe(wrapEl);}
  window.addEventListener('load',report);window.addEventListener('resize',report);
  report();
  updateBtn();render();
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
