// DXF reader for the B2B letter estimator.
// Measures every closed letter outline (height, width, area, outline length) from a DXF file.
// Ported unchanged from the original Letter Cost Estimator tool.
export const UNIT_MM = { mm: 1, cm: 10, in: 25.4, ft: 304.8, m: 1000 };
export const UNIT_NAME = { mm: 'millimetres', cm: 'centimetres', in: 'inches', ft: 'feet', m: 'metres' };
const INSUNITS = { 1: 'in', 2: 'ft', 4: 'mm', 5: 'cm', 6: 'm' };

  function parseDXFText(text){
    var lines=text.split(/\r?\n/), pairs=[], i;
    for(i=0;i+1<lines.length;i+=2){
      var c=parseInt(lines[i],10);
      if(isNaN(c)) continue;
      pairs.push([c,lines[i+1].trim()]);
    }
    var ins=0;
    for(i=0;i<pairs.length-1;i++){
      if(pairs[i][0]===9 && pairs[i][1]==='$INSUNITS'){ ins=parseInt(pairs[i+1][1],10)||0; break; }
    }
    var ents=[], inEnt=false, cur=null;
    for(i=0;i<pairs.length;i++){
      var code=pairs[i][0], val=pairs[i][1];
      if(!inEnt){
        if(code===2 && val==='ENTITIES' && i>0 && pairs[i-1][0]===0 && pairs[i-1][1]==='SECTION') inEnt=true;
        continue;
      }
      if(code===0){
        if(val==='ENDSEC') break;
        cur={t:val,d:[]}; ents.push(cur); continue;
      }
      if(cur) cur.d.push([code,val]);
    }
    return {ents:ents, ins:ins};
  }

  function deBoor(deg,kn,P,W,t){
    var n=P.length-1, k, j, r, i;
    if(t>=kn[n+1]) k=n; else { k=deg; while(k<n && t>=kn[k+1]) k++; }
    var d=[];
    for(j=0;j<=deg;j++){ i=j+k-deg; var w=W?W[i]:1; d.push([P[i][0]*w,P[i][1]*w,w]); }
    for(r=1;r<=deg;r++){
      for(j=deg;j>=r;j--){
        i=j+k-deg;
        var den=kn[i+deg-r+1]-kn[i];
        var a=den===0?0:(t-kn[i])/den;
        d[j]=[(1-a)*d[j-1][0]+a*d[j][0],(1-a)*d[j-1][1]+a*d[j][1],(1-a)*d[j-1][2]+a*d[j][2]];
      }
    }
    var q=d[deg];
    return [q[0]/q[2],q[1]/q[2]];
  }

  function splinePts(e){
    var deg=3, kn=[], W=[], P=[], x=0;
    e.d.forEach(function(p){
      var c=p[0], v=p[1];
      if(c===71) deg=parseInt(v,10);
      else if(c===40) kn.push(parseFloat(v));
      else if(c===41) W.push(parseFloat(v));
      else if(c===10) x=parseFloat(v);
      else if(c===20) P.push([x,parseFloat(v)]);
    });
    if(P.length<deg+1 || kn.length!==P.length+deg+1) return null;
    var Wuse=(W.length===P.length)?W:null, N=1500, pts=[], t0=kn[deg], t1=kn[P.length];
    for(var i=0;i<=N;i++) pts.push(deBoor(deg,kn,P,Wuse,t0+(t1-t0)*i/N));
    return pts;
  }

  function addBulge(out,p,q,b){
    if(!b){ out.push(q); return; }
    var dx=q[0]-p[0], dy=q[1]-p[1], c=Math.hypot(dx,dy);
    if(c===0){ out.push(q); return; }
    var th=4*Math.atan(b), off=c*(1-b*b)/(4*b);
    var cx=(p[0]+q[0])/2-dy/c*off, cy=(p[1]+q[1])/2+dx/c*off;
    var a0=Math.atan2(p[1]-cy,p[0]-cx), r=Math.hypot(p[0]-cx,p[1]-cy);
    var m=Math.max(4,Math.ceil(Math.abs(th)/0.05));
    for(var i=1;i<m;i++){ var a=a0+th*i/m; out.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]); }
    out.push(q);
  }

  function vertsToPts(V,closed){
    var out=[[V[0].x,V[0].y]], n=V.length, i;
    for(i=1;i<n;i++) addBulge(out,[V[i-1].x,V[i-1].y],[V[i].x,V[i].y],V[i-1].b);
    if(closed && n>2) addBulge(out,[V[n-1].x,V[n-1].y],[V[0].x,V[0].y],V[n-1].b);
    return out;
  }

  function dist(a,b){ return Math.hypot(a[0]-b[0],a[1]-b[1]); }

  function chain(pieces,tol){
    var closed=[], open=[], rest=pieces.slice();
    while(rest.length){
      var cur=rest.shift().slice(), grew=true;
      while(grew){
        grew=false;
        if(cur.length>2 && dist(cur[0],cur[cur.length-1])<=tol) break;
        for(var i=0;i<rest.length;i++){
          var p=rest[i], e=cur[cur.length-1];
          if(dist(e,p[0])<=tol) cur=cur.concat(p.slice(1));
          else if(dist(e,p[p.length-1])<=tol) cur=cur.concat(p.slice(0,-1).reverse());
          else if(dist(cur[0],p[p.length-1])<=tol) cur=p.slice(0,-1).concat(cur);
          else if(dist(cur[0],p[0])<=tol) cur=p.slice(1).reverse().concat(cur);
          else continue;
          rest.splice(i,1); grew=true; break;
        }
      }
      if(cur.length>2 && dist(cur[0],cur[cur.length-1])<=tol) closed.push(cur); else open.push(cur);
    }
    return {closed:closed, open:open};
  }

  function polyArea(p){
    var s=0;
    for(var i=0;i<p.length-1;i++) s+=p[i][0]*p[i+1][1]-p[i+1][0]*p[i][1];
    return Math.abs(s)/2;
  }
  function polyLen(p){
    var s=0;
    for(var i=0;i<p.length-1;i++) s+=dist(p[i],p[i+1]);
    return s;
  }
  function pointIn(pt,poly){
    var x=pt[0], y=pt[1], c=false;
    for(var i=0,j=poly.length-1;i<poly.length;j=i++){
      var yi=poly[i][1], yj=poly[j][1];
      if((yi>y)!==(yj>y) && x<(poly[j][0]-poly[i][0])*(y-yi)/(yj-yi)+poly[i][0]) c=!c;
    }
    return c;
  }

  export function parseDXF(text){
    var P=parseDXFText(text), ents=P.ents, items=[], unsup={}, i, k;
    function bump(t){ unsup[t]=(unsup[t]||0)+1; }
    for(i=0;i<ents.length;i++){
      var e=ents[i], t=e.t;
      if(t==='SPLINE'){
        var sp=splinePts(e); if(sp) items.push({pts:sp,closed:null}); else bump(t);
      }else if(t==='LWPOLYLINE'){
        var V=[], flag=0, x=0;
        e.d.forEach(function(p){
          if(p[0]===70) flag=parseInt(p[1],10);
          else if(p[0]===10) x=parseFloat(p[1]);
          else if(p[0]===20) V.push({x:x,y:parseFloat(p[1]),b:0});
          else if(p[0]===42 && V.length) V[V.length-1].b=parseFloat(p[1]);
        });
        if(V.length>1) items.push({pts:vertsToPts(V,(flag&1)===1),closed:(flag&1)===1?true:false});
      }else if(t==='POLYLINE'){
        var pf=0; e.d.forEach(function(p){ if(p[0]===70) pf=parseInt(p[1],10); });
        var PV=[];
        for(k=i+1;k<ents.length && ents[k].t==='VERTEX';k++){
          var vx=0, vy=0, vb=0;
          ents[k].d.forEach(function(p){
            if(p[0]===10) vx=parseFloat(p[1]); else if(p[0]===20) vy=parseFloat(p[1]); else if(p[0]===42) vb=parseFloat(p[1]);
          });
          PV.push({x:vx,y:vy,b:vb});
        }
        i=k-1;
        if(PV.length>1) items.push({pts:vertsToPts(PV,(pf&1)===1),closed:(pf&1)===1?true:false});
      }else if(t==='CIRCLE'){
        var cx=0,cy=0,r=0;
        e.d.forEach(function(p){ if(p[0]===10) cx=parseFloat(p[1]); else if(p[0]===20) cy=parseFloat(p[1]); else if(p[0]===40) r=parseFloat(p[1]); });
        var cp=[]; for(k=0;k<=360;k++) cp.push([cx+r*Math.cos(k*Math.PI/180),cy+r*Math.sin(k*Math.PI/180)]);
        items.push({pts:cp,closed:true});
      }else if(t==='ARC'){
        var ax=0,ay=0,ar=0,a0=0,a1=0;
        e.d.forEach(function(p){
          if(p[0]===10) ax=parseFloat(p[1]); else if(p[0]===20) ay=parseFloat(p[1]); else if(p[0]===40) ar=parseFloat(p[1]);
          else if(p[0]===50) a0=parseFloat(p[1]); else if(p[0]===51) a1=parseFloat(p[1]);
        });
        var sw=a1-a0; while(sw<=0) sw+=360;
        var m=Math.max(8,Math.ceil(sw/2)), ap=[];
        for(k=0;k<=m;k++){ var aa=(a0+sw*k/m)*Math.PI/180; ap.push([ax+ar*Math.cos(aa),ay+ar*Math.sin(aa)]); }
        items.push({pts:ap,closed:false});
      }else if(t==='LINE'){
        var l=[0,0,0,0];
        e.d.forEach(function(p){ if(p[0]===10) l[0]=parseFloat(p[1]); else if(p[0]===20) l[1]=parseFloat(p[1]); else if(p[0]===11) l[2]=parseFloat(p[1]); else if(p[0]===21) l[3]=parseFloat(p[1]); });
        items.push({pts:[[l[0],l[1]],[l[2],l[3]]],closed:false});
      }else if(t==='VERTEX' || t==='SEQEND'){
        /* handled with POLYLINE */
      }else{
        bump(t);
      }
    }
    if(!items.length) throw new Error('no drawable outlines found');

    var x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
    items.forEach(function(it){ it.pts.forEach(function(p){ if(p[0]<x0)x0=p[0]; if(p[0]>x1)x1=p[0]; if(p[1]<y0)y0=p[1]; if(p[1]>y1)y1=p[1]; }); });
    var tol=Math.hypot(x1-x0,y1-y0)*1e-5;

    var closedList=[], pieces=[];
    items.forEach(function(it){
      var p=it.pts, gap=dist(p[0],p[p.length-1]);
      if(it.closed===true || (it.closed===null && gap<=tol)){
        if(gap>0) p=p.concat([p[0]]);
        closedList.push(p);
      }else pieces.push(p);
    });
    var ch=chain(pieces,tol*10);
    closedList=closedList.concat(ch.closed);

    /* measure, drop exact duplicates, then nest */
    var cs=[], seen={}, dups=0;
    closedList.forEach(function(p){
      var a=polyArea(p); if(a<=0) return;
      var bx0=Infinity,by0=Infinity,bx1=-Infinity,by1=-Infinity;
      p.forEach(function(q){ if(q[0]<bx0)bx0=q[0]; if(q[0]>bx1)bx1=q[0]; if(q[1]<by0)by0=q[1]; if(q[1]>by1)by1=q[1]; });
      var key=[a.toPrecision(7),bx0.toFixed(2),by0.toFixed(2),bx1.toFixed(2),by1.toFixed(2)].join('|');
      if(seen[key]){ dups++; return; }
      seen[key]=1;
      cs.push({p:p,a:a,len:polyLen(p),x0:bx0,y0:by0,x1:bx1,y1:by1,par:-1});
    });
    var n=cs.length, j;
    for(i=0;i<n;i++){
      var best=-1, probe=cs[i].p[Math.floor(cs[i].p.length/3)];
      for(j=0;j<n;j++){
        if(j===i || cs[j].a<=cs[i].a) continue;
        if(pointIn(probe,cs[j].p) && (best<0 || cs[j].a<cs[best].a)) best=j;
      }
      cs[i].par=best;
    }
    function depth(q){ var d=0; while(cs[q].par>=0){ q=cs[q].par; d++; } return d; }
    var letters=[];
    for(i=0;i<n;i++){
      if(depth(i)%2!==0) continue;
      var a=cs[i].a, len=cs[i].len, holes=0;
      for(j=0;j<n;j++) if(cs[j].par===i){ a-=cs[j].a; len+=cs[j].len; holes++; }
      letters.push({x0:cs[i].x0,h:cs[i].y1-cs[i].y0,w:cs[i].x1-cs[i].x0,a:a,len:len,holes:holes});
    }
    letters.sort(function(p,q){return p.x0-q.x0});

    var autoUnit=INSUNITS[P.ins]||'mm';
    return {letters:letters, open:ch.open.length, dups:dups, unsupported:unsup, autoUnit:autoUnit,
      unitNote:INSUNITS[P.ins]?('Units: '+UNIT_NAME[autoUnit]+', set in the file.'):'The file does not say its units, so millimetres are assumed. Change File units if the sizes look wrong.'};
  }
  
