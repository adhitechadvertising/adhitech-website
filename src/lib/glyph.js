// Estimates letter sizes from typed words by measuring a bold sans-serif font on a canvas.
// Ported from the original Letter Cost Estimator tool.

  /* Measure a rendered glyph: bounding box, filled area and outline length (holes included),
     all in pixels. The outline length is the total gradient of the anti-aliased alpha channel. */
  function scanAlpha(img,W,H){
    var d=img.data, a=new Float32Array(W*H), x, y, minx=W, maxx=-1, miny=H, maxy=-1, area=0;
    for(y=0;y<H;y++) for(x=0;x<W;x++){
      var v=d[(y*W+x)*4+3]/255; a[y*W+x]=v; area+=v;
      if(v>0.5){ if(x<minx)minx=x; if(x>maxx)maxx=x; if(y<miny)miny=y; if(y>maxy)maxy=y; }
    }
    if(maxx<0) return null;
    var per=0;
    for(y=1;y<H-1;y++) for(x=1;x<W-1;x++){
      var gx=(a[y*W+x+1]-a[y*W+x-1])/2, gy=(a[(y+1)*W+x]-a[(y-1)*W+x])/2;
      per+=Math.sqrt(gx*gx+gy*gy);
    }
    return {w:maxx-minx+1,h:maxy-miny+1,area:area,per:per};
  }
  var GFONT='800 300px Inter, "Arial Black", Arial, Helvetica, sans-serif';
  var glyphCache={}, glyphCv=null;
  function resetGlyphCache(){ glyphCache={}; }
  function glyph(ch){
    if(glyphCache[ch]!==undefined) return glyphCache[ch];
    if(!glyphCv){ glyphCv=document.createElement('canvas'); glyphCv.width=700; glyphCv.height=700; }
    var ctx=glyphCv.getContext('2d',{willReadFrequently:true});
    ctx.clearRect(0,0,700,700); ctx.font=GFONT; ctx.textBaseline='alphabetic'; ctx.fillStyle='#000';
    ctx.fillText(ch,150,450);
    var g=scanAlpha(ctx.getImageData(0,0,700,700),700,700);
    glyphCache[ch]=g; return g;
  }

  export { resetGlyphCache };

  /* Letters for typed words: capital H comes out at the capital height typed (inches). */
  export function typedLetters(text, capIn){
    var H=glyph('H'), letters=[];
    if(H && capIn>0){
      var sc=capIn*25.4/H.h;   /* mm per pixel */
      Array.from(text).forEach(function(ch){
        if(/\s/.test(ch)) return;
        var g=glyph(ch); if(!g) return;
        letters.push({h:g.h*sc,w:g.w*sc,a:g.area*sc*sc,len:g.per*sc,holes:0});
      });
    }
    return letters;
  }
