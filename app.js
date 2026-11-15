(function(){
var $=function(i){return document.getElementById(i)};
var cv=$('cv'),ctx=cv.getContext('2d'),W=1080,H=1350,M=[],bgimg=null;
function FF(){return '"'+$('fuente').value+'",Impact,"Arial Black",sans-serif'}
var PRE={clasico:['#0b6b3a','#04200f','#ffd400','3d'],estadio:['#1e3a8a','#030816','#ffd400','cromo'],fuego:['#b91c1c','#1a0505','#ffb400','fuego'],neon:['#7c3aed','#0b0220','#22e5ff','neon'],tormenta:['#1e40af','#050816','#7dd3fc','hielo'],oro:['#b45309','#0a0804','#fbbf24','oro'],relampago:['#0a2a7a','#020a22','#9dff2e','cromo']};
var d=new Date();d.setDate(d.getDate()+7);
$('fecha').value=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
var seed=7;function R(){seed=(seed*16807)%2147483647;return seed/2147483647}
function setPre(k){var p=PRE[k];if(p){$('c1').value=p[0];$('c2').value=p[1];$('c3').value=p[2];$('efecto').value=p[3];$('efecto2').value='lima'}}
setPre('relampago');

// Texto con efecto estilo Photoshop: contorno, sombra, brillo, degradado y bisel
function T(s,x,y,z,al,eff,it){
  var e=eff||$('efecto').value,c3=$('c3').value,g=ctx.createLinearGradient(0,y-z*.85,0,y+z*.12);
  var st={cromo:[[0,'#fff'],[.45,'#a9b8cc'],[.5,'#2f3a4c'],[.58,'#c4d0e0'],[1,'#fff']],
    oro:[[0,'#fff5b0'],[.4,'#ffd400'],[.6,'#b07d0a'],[1,'#ffe27a']],
    fuego:[[0,'#fff3b0'],[.35,'#ffb400'],[.7,'#ff4d00'],[1,'#a80000']],
    hielo:[[0,'#fff'],[.5,'#a5ecff'],[1,'#2f7bff']],
    neon:[[0,'#fff'],[1,'#fff']],'3d':[[0,'#fff'],[1,c3]],lima:[[0,'#f4ffb0'],[.4,'#9dff2e'],[1,'#2d8a00']]}[e];
  st.forEach(function(p){g.addColorStop(p[0],p[1])});
  var sk={cromo:'#0b1220',oro:'#3d2300',fuego:'#2b0500',hielo:'#05224d',neon:c3,'3d':'#000',lima:'#0b2a00'}[e],gl={fuego:'#ff7a00',hielo:'#5ac8ff',neon:c3,lima:'#7dff00'}[e];
  ctx.save();ctx.font=(it?'italic ':'')+z+'px '+FF();ctx.textAlign=al||'center';ctx.textBaseline='alphabetic';ctx.lineJoin='round';
  if(e==='3d'){ctx.fillStyle='#0d0d0d';for(var i=14;i>0;i--)ctx.fillText(s,x+i*.7,y+i*.9)}
  ctx.shadowColor='rgba(0,0,0,.85)';ctx.shadowBlur=z*.2;ctx.shadowOffsetY=z*.06;ctx.lineWidth=z*.1;ctx.strokeStyle=sk;ctx.strokeText(s,x,y);
  if(gl){ctx.shadowColor=gl;ctx.shadowBlur=z*.5;ctx.shadowOffsetY=0;ctx.fillStyle=gl;ctx.fillText(s,x,y)}
  ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.fillStyle=g;ctx.fillText(s,x,y);
  if(e!=='neon'){ctx.lineWidth=Math.max(1,z*.014);ctx.strokeStyle='rgba(255,255,255,.65)';ctx.strokeText(s,x,y)}
  ctx.restore();
}
function fit(s,z,maxW){ctx.font=z+'px '+FF();var w=ctx.measureText(s).width;return w>maxW?Math.max(12,z*maxW/w):z}
function wrap(t,x,y,maxW,lh,z){
  if(z)ctx.font=z+'px '+FF();
  var ws=String(t).split(/\s+/),line='',L=[];
  ws.forEach(function(w){var s=line?line+' '+w:w;if(ctx.measureText(s).width>maxW&&line){L.push(line);line=w}else line=s});
  if(line)L.push(line);
  L.forEach(function(l,i){z?T(l,x,y+i*lh,z):ctx.fillText(l,x,y+i*lh)});
  return y+L.length*lh;
}
function fmtFecha(v){if(!v)return '';return new Date(v+'T00:00:00').toLocaleDateString('es-PA',{weekday:'long',day:'numeric',month:'long'}).toUpperCase()}
function fmtHora(v){if(!v)return '';var p=v.split(':'),h=+p[0];return (h%12||12)+':'+p[1]+(h>=12?' PM':' AM')}
function glow(x,y,r,col,a){var g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');ctx.save();ctx.globalAlpha=a;ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore()}
function vgrad(a,b){var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
function stripes(al){ctx.save();ctx.translate(W/2,H/2);ctx.rotate(-0.4);ctx.fillStyle='rgba(255,255,255,'+al+')';for(var i=-12;i<12;i+=2)ctx.fillRect(-1200,i*110,2400,110);ctx.restore()}
function pitch(){ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=8;ctx.beginPath();ctx.arc(W/2,660,300,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(0,660);ctx.lineTo(W,660);ctx.stroke()}
function bolt(x,y,c){ctx.save();ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.shadowColor=c;ctx.shadowBlur=35;ctx.beginPath();ctx.moveTo(x,y);
  for(var i=0;i<9;i++){x+=(R()-.5)*160;y+=90;ctx.lineTo(x,y)}ctx.stroke();ctx.restore()}

function bg(){
  var k=$('fondo').value,c1=$('c1').value,c2=$('c2').value,c3=$('c3').value,i;seed=7;
  if(k==='foto'&&bgimg){
    var s=Math.max(W/bgimg.width,H/bgimg.height);ctx.drawImage(bgimg,(W-bgimg.width*s)/2,(H-bgimg.height*s)/2,bgimg.width*s,bgimg.height*s);
    var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(0,0,0,.55)');g.addColorStop(.5,'rgba(0,0,0,.35)');g.addColorStop(1,'rgba(0,0,0,.8)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);return;
  }
  if(k==='relampago'){
    vgrad(c1,c2);
    [[60,60],[1020,70],[40,420],[1040,430],[30,800],[1050,780]].forEach(function(p){glow(p[0],p[1],260,'#bfe0ff',.55);for(i=0;i<16;i++){ctx.fillStyle='rgba(255,255,255,'+(.4+R()*.6)+')';ctx.beginPath();ctx.arc(p[0]+(R()-.5)*260,p[1]+(R()-.5)*200,2+R()*7,0,7);ctx.fill()}});
    glow(W/2,560,600,c1,.6);
    var gg=ctx.createLinearGradient(0,1020,0,H);gg.addColorStop(0,'#1f9d3a');gg.addColorStop(1,'#04240d');ctx.fillStyle=gg;ctx.fillRect(0,1020,W,H-1020);
    ctx.save();ctx.beginPath();ctx.rect(0,1020,W,H-1020);ctx.clip();stripes(.08);ctx.restore();glow(W/2,1020,500,c3,.25);
  }else if(k==='estadio'){
    vgrad(c2,c1);glow(W/2,H,1000,c3,.25);
    [170,910].forEach(function(x){var sg=x<500?1:-1,g=ctx.createLinearGradient(x,0,x,1000);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-30,0);ctx.lineTo(x+30,0);ctx.lineTo(x+sg*450,1000);ctx.lineTo(x+sg*(-210),1000);ctx.closePath();ctx.fill();glow(x,0,260,'#fff',.8)});
    stripes(.05);pitch();
  }else if(k==='fuego'){
    vgrad(c2,'#000');glow(W/2,H,1100,c1,.9);glow(W/2,H,650,c3,.55);
    for(i=0;i<140;i++){var y=H*(1-Math.pow(R(),2)),x=R()*W,r=1.5+R()*6;ctx.fillStyle=c3;ctx.globalAlpha=.25+R()*.7;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
    ctx.globalAlpha=1;
  }else if(k==='neon'){
    ctx.fillStyle=c2;ctx.fillRect(0,0,W,H);glow(W/2,430,700,c1,.8);
    var g2=ctx.createLinearGradient(0,230,0,630);g2.addColorStop(0,c3);g2.addColorStop(1,c1);
    ctx.save();ctx.beginPath();ctx.rect(0,0,W,520);ctx.clip();ctx.fillStyle=g2;ctx.beginPath();ctx.arc(W/2,430,210,0,7);ctx.fill();
    ctx.fillStyle=c2;for(i=0;i<6;i++)ctx.fillRect(W/2-220,400+i*30,440,3+i*2);ctx.restore();
    ctx.save();ctx.strokeStyle=c3;ctx.globalAlpha=.55;ctx.lineWidth=3;ctx.shadowColor=c3;ctx.shadowBlur=14;
    for(i=-12;i<=12;i++){ctx.beginPath();ctx.moveTo(W/2+i*40,520);ctx.lineTo(W/2+i*260,H);ctx.stroke()}
    for(i=1;i<10;i++){var yy=520+Math.pow(i/9,2)*(H-520);ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(W,yy);ctx.stroke()}
    ctx.restore();
  }else if(k==='tormenta'){
    vgrad(c2,c1);for(i=0;i<7;i++)glow(R()*W,R()*350,320,'#000',.55);
    glow(W/2,300,700,c3,.25);bolt(260,0,c3);bolt(800,0,c3);bolt(540,60,c3);
  }else if(k==='oro'){
    ctx.fillStyle=c2;ctx.fillRect(0,0,W,H);glow(W/2,660,900,c1,.85);
    ctx.save();ctx.translate(W/2,660);ctx.fillStyle=c3;ctx.globalAlpha=.13;
    for(i=0;i<40;i++){var a=i*Math.PI/20;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,1500,a,a+Math.PI/40);ctx.closePath();ctx.fill()}
    ctx.restore();
  }else{vgrad(c1,c2);stripes(.07);pitch()}
  var v=ctx.createRadialGradient(W/2,H/2,350,W/2,H/2,950);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.5)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
}
function rr(x,y,w,h,r){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h)}
function P(s,x,y,z,col,al,maxW,fam,it){
  ctx.save();var f=fam||FF(),q=it?'italic ':'';ctx.font=q+z+'px '+f;
  if(maxW){var w=ctx.measureText(s).width;if(w>maxW){z=Math.max(10,z*maxW/w);ctx.font=q+z+'px '+f}}
  ctx.fillStyle=col;ctx.textAlign=al||'center';ctx.textBaseline='alphabetic';ctx.shadowColor='rgba(0,0,0,.85)';ctx.shadowBlur=8;ctx.shadowOffsetY=2;ctx.fillText(s,x,y);ctx.restore()}
function ball(cx,cy,r){
  ctx.save();ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=r*.2;ctx.shadowOffsetY=r*.12;
  var g=ctx.createRadialGradient(cx-r*.35,cy-r*.4,r*.1,cx,cy,r);g.addColorStop(0,'#fff');g.addColorStop(.7,'#d6dbe3');g.addColorStop(1,'#7d8696');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();ctx.shadowColor='transparent';
  ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.clip();ctx.fillStyle='#14171d';ctx.strokeStyle='#14171d';ctx.lineWidth=Math.max(1.5,r*.03);
  function pent(x,y,z,a0){ctx.beginPath();for(var i=0;i<5;i++){var a=a0+i*Math.PI*2/5;ctx[i?'lineTo':'moveTo'](x+z*Math.cos(a),y+z*Math.sin(a))}ctx.closePath();ctx.fill()}
  pent(cx,cy,r*.3,-Math.PI/2);
  for(var i=0;i<5;i++){var a=-Math.PI/2+i*Math.PI*2/5;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r*.3,cy+Math.sin(a)*r*.3);ctx.lineTo(cx+Math.cos(a)*r*.7,cy+Math.sin(a)*r*.7);ctx.stroke();pent(cx+Math.cos(a)*r*.98,cy+Math.sin(a)*r*.98,r*.32,a+Math.PI/2*0+Math.PI/10*0)}
  var h=ctx.createRadialGradient(cx,cy,r*.5,cx,cy,r);h.addColorStop(0,'rgba(0,0,0,0)');h.addColorStop(1,'rgba(0,0,0,.4)');ctx.fillStyle=h;ctx.fillRect(cx-r,cy-r,2*r,2*r);
  ctx.restore()}
function icon(k,x,y,c){ctx.save();ctx.translate(x,y);ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=6;ctx.lineJoin='round';ctx.lineCap='round';ctx.shadowColor=c;ctx.shadowBlur=10;
  if(k==='f'){ctx.strokeRect(4,12,56,48);ctx.fillRect(4,12,56,14);ctx.beginPath();ctx.moveTo(18,4);ctx.lineTo(18,18);ctx.moveTo(46,4);ctx.lineTo(46,18);ctx.stroke();for(var i=0;i<3;i++)for(var j=0;j<2;j++)ctx.fillRect(14+i*16,34+j*14,8,7)}
  else if(k==='h'){ctx.beginPath();ctx.arc(32,32,28,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(32,14);ctx.lineTo(32,32);ctx.lineTo(46,40);ctx.stroke()}
  else{ctx.beginPath();ctx.moveTo(32,62);ctx.bezierCurveTo(6,34,10,4,32,4);ctx.bezierCurveTo(54,4,58,34,32,62);ctx.stroke();ctx.beginPath();ctx.arc(32,26,9,0,7);ctx.fill()}
  ctx.restore()}
function streaks(cx,cy,c){
  ctx.save();ctx.shadowColor=c;ctx.shadowBlur=25;ctx.fillStyle=c;seed=11;
  for(var i=0;i<24;i++){var a=R()*Math.PI*2,r0=110+R()*80,r1=r0+120+R()*200,w=.05+R()*.08;
    ctx.globalAlpha=.5+R()*.45;ctx.beginPath();ctx.moveTo(cx+Math.cos(a-w)*r0,cy+Math.sin(a-w)*r0*.8);ctx.lineTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1*.8);ctx.lineTo(cx+Math.cos(a+w)*r0,cy+Math.sin(a+w)*r0*.8);ctx.closePath();ctx.fill()}
  ctx.restore()}
function ribbon(txt,cx,cy,c3){
  if(!txt)return;var z=40,sk=22,h=62;ctx.save();ctx.font='italic '+z+'px '+FF();
  var w=Math.min(400,ctx.measureText(txt).width+110);
  ctx.shadowColor=c3;ctx.shadowBlur=24;ctx.fillStyle='rgba(0,0,0,.72)';
  ctx.beginPath();ctx.moveTo(cx-w/2+sk,cy-h/2);ctx.lineTo(cx+w/2+sk,cy-h/2);ctx.lineTo(cx+w/2-sk,cy+h/2);ctx.lineTo(cx-w/2-sk,cy+h/2);ctx.closePath();ctx.fill();
  ctx.shadowBlur=0;ctx.strokeStyle=c3;ctx.lineWidth=4;ctx.stroke();ctx.restore();
  ball(cx-w/2+34,cy,21);P(txt,cx+24,cy+z*.34,z,c3,'center',w-120,null,true)}
function box(cx,cy,s,name,img,c3,sn){
  var f=$('forma').value,x=cx-s/2,y=cy-s/2,sh=$('oNames').checked||!img;
  function path(p){ctx.beginPath();if(f==='circulo')ctx.arc(cx,cy,s/2-p,0,7);else if(f==='libre')ctx.rect(x+p,y+p,s-2*p,s-2*p);else rr(x+p,y+p,s-2*p,s-2*p,s*.08)}
  ctx.save();
  if(f!=='libre'){path(0);ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=18;ctx.fillStyle='rgba(6,10,20,.85)';ctx.fill();ctx.shadowBlur=0;ctx.lineWidth=5;ctx.strokeStyle=c3;ctx.stroke()}
  path(f==='libre'?0:4);ctx.clip();
  if(img){var k=(f==='libre'?Math.min:Math.max)(s/img.width,s/img.height);ctx.drawImage(img,cx-img.width*k/2,cy-img.height*k/2,img.width*k,img.height*k)}
  else T((name||'?').trim().charAt(0).toUpperCase(),cx,cy+s*.12,s*.5);
  if(sh&&name){ctx.fillStyle='rgba(0,0,0,.68)';ctx.fillRect(x,y+s*.76,s,s*.24);P(name.toUpperCase(),cx,y+s*.76+s*.17,s*.15*sn,'#fff','center',s-16)}
  ctx.restore()}
function drawNow(){
  var c3=$('c3').value,sl=$('sLogo').value/100,sn=$('sName').value/100,st=$('sTit').value/100,n=M.length;bg();
  var t1=$('t1').value.toUpperCase(),t2=$('t2').value.toUpperCase();
  var z1=fit(t1,150*st,960),y1=40+z1*.82;T(t1,W/2,y1,z1);
  var z2=fit(t2,115*st,820),y2=y1+z2*.92;T(t2,W/2,y2,z2,'center',$('efecto2').value,true);
  P($('t3').value,W/2,y2+54,42,'#fff','center',900);
  ribbon($('cinta').value.toUpperCase(),W/2,y2+112,c3);
  if($('oStreak').checked)streaks(W/2,640,c3);
  T('VS',W/2,720,280);
  if($('oBall').checked)ball(W/2,905,135);
  var top=340,rh=740/n,s=Math.min(Math.min(rh-8,260)*sl,rh*1.02,300);
  M.forEach(function(m,i){var cy=top+i*rh+rh/2;box(190,cy,s,m.a.value,m.la,c3,sn);box(890,cy,s,m.b.value,m.lb,c3,sn)});
  var fv=$('fecha').value,dt=fv?new Date(fv+'T00:00:00'):null,hv=$('hora').value,hh=hv?hv.split(':'):null;
  var dia=dt?dt.toLocaleDateString('es-PA',{weekday:'long'}).toUpperCase():'';
  var dm=dt?dt.getDate()+' DE '+dt.toLocaleDateString('es-PA',{month:'long'}).toUpperCase()+' DE '+dt.getFullYear():'';
  var hora=hh?((+hh[0])%12||12)+':'+hh[1]+(+hh[0]>=12?' p.m.':' a.m.'):'';
  ctx.save();rr(40,1095,1000,120,18);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='rgba(255,255,255,.12)';ctx.stroke();
  ctx.strokeStyle=c3;ctx.lineWidth=4;ctx.shadowColor=c3;ctx.shadowBlur=12;[340,690].forEach(function(x){ctx.beginPath();ctx.moveTo(x,1115);ctx.lineTo(x,1195);ctx.stroke()});ctx.restore();
  icon('f',62,1123,c3);icon('h',360,1123,c3);icon('l',708,1123,c3);
  P('FECHA',146,1130,24,'#fff','left',190);P(dia,146,1176,50,'#fff','left',190);P(dm,146,1201,20,'#fff','left',190);
  P($('pref').value,438,1138,30,'#fff','left',240);P(hora,438,1190,54,'#fff','left',240);
  P($('etq').value,790,1132,28,'#fff','left',240);P($('lugar').value,790,1174,46,'#fff','left',240);P($('lugar2').value,790,1202,28,'#fff','left',240);
  var lg=ctx.createLinearGradient(140,0,940,0);lg.addColorStop(0,'rgba(0,0,0,0)');lg.addColorStop(.5,c3);lg.addColorStop(1,'rgba(0,0,0,0)');
  P($('lema').value,W/2,1282,46,c3,'center',960,$('fuenteLema').value,true);
  ctx.save();ctx.fillStyle=lg;ctx.shadowColor=c3;ctx.shadowBlur=10;ctx.fillRect(140,1298,800,5);ctx.restore();
  if($('spons').value)P($('spons').value,W/2,1336,22,'rgba(255,255,255,.92)','center',1000,'Arial,sans-serif');
}
var pend=0;function draw(){if(pend)return;pend=1;requestAnimationFrame(function(){pend=0;drawNow()})}
function readImg(file,cb){if(!file)return;var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){cb(im)};im.src=r.result};r.readAsDataURL(file)}
function refresh(){M.forEach(function(m){m.rm.style.display=M.length>1?'block':'none'});$('add').style.display=M.length>=4?'none':'block'}
function addMatch(a,b){
  var el=document.createElement('div');el.className='match';
  el.innerHTML='<div class="row"><input type="text" class="ia" placeholder="Equipo izquierda"><input type="text" class="ib" placeholder="Equipo derecha"></div><div class="row"><input type="file" class="fa" accept="image/*" title="Escudo izquierda"><input type="file" class="fb" accept="image/*" title="Escudo derecha"></div><button type="button" class="sec rm" style="margin-top:8px">Quitar</button>';
  var m={a:el.querySelector('.ia'),b:el.querySelector('.ib'),rm:el.querySelector('.rm'),la:null,lb:null};
  m.a.value=a;m.b.value=b;
  [m.a,m.b].forEach(function(x){x.addEventListener('input',draw)});
  el.querySelector('.fa').addEventListener('change',function(){readImg(this.files[0],function(im){m.la=im;draw()})});
  el.querySelector('.fb').addEventListener('change',function(){readImg(this.files[0],function(im){m.lb=im;draw()})});
  m.rm.addEventListener('click',function(){M.splice(M.indexOf(m),1);el.remove();refresh();draw()});
  M.push(m);$('matches').appendChild(el);refresh();draw();
}
function loadFont(){try{Promise.all(['Anton','Bebas Neue','Black Ops One','Bangers','Russo One','Metal Mania','Racing Sans One','Kaushan Script','Permanent Marker'].map(function(f){return document.fonts.load('40px "'+f+'"','ABCÑÁÉÍÓÚ 0123')})).then(draw)}catch(e){}}
$('add').addEventListener('click',function(){addMatch('','')});
$('fondo').addEventListener('change',function(){setPre(this.value);draw()});
$('foto').addEventListener('change',function(){readImg(this.files[0],function(im){bgimg=im;$('fondo').value='foto';draw()})});
['t1','t2','t3','cinta','fecha','hora','pref','etq','lugar','lugar2','lema','fuenteLema','fuente','spons','c1','c2','c3','efecto','efecto2','forma','oNames','oBall','oStreak','sLogo','sName','sTit'].forEach(function(i){$(i).addEventListener('input',draw);$(i).addEventListener('change',draw)});
$('fuente').addEventListener('change',loadFont);
function guardar(){drawNow();var u=cv.toDataURL('image/png');$('out').src=u;$('dl').href=u;$('modal').style.display='flex'}
$('gen').addEventListener('click',guardar);$('gen2').addEventListener('click',guardar);
$('cl').addEventListener('click',function(){$('modal').style.display='none'});
$('modal').addEventListener('click',function(e){if(e.target===this)this.style.display='none'});
$('fijar').addEventListener('change',function(){$('prev').classList.toggle('nofix',!this.checked)});
$('pv').addEventListener('input',function(){document.documentElement.style.setProperty('--pv',this.value)});
addMatch('Oro del Mar','Lesly');addMatch('El Naranjal','Chimbi');addMatch('Kraken','Deliany');addMatch('Diana','Vuelve a Cristo');
window.addEventListener('load',loadFont);
})();
