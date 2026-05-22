/* ===== 1. \u771f\u5fc3\u8bdd\u5927\u5192\u9669\uff08\u5408\u5e76\u8f6c\u76d8\uff09===== */
function renderTD(c){
  var t=shuffle(GAMEDATA.truths.slice()).slice(0,4);
  var d=shuffle(GAMEDATA.dares.slice()).slice(0,4);
  var items=[];
  for(var i=0;i<4;i++){items.push({text:t[i],type:'truth'});items.push({text:d[i],type:'dare'});}
  var colors=items.map(function(x){return x.type==='truth'?'#6c2bd9':'#ff6b6b'});
  c.innerHTML='<div class="wheel-wrap">'
    +'<canvas id="tCanvas" width="620" height="620"></canvas>'
    +'<div class="wheel-pointer"></div>'
    +'<button class="wheel-go-btn" onclick="spinTDWheel()">GO</button>'
    +'</div>'
    +'<div class="wheel-result" id="tdResult"><div class="text">\u70b9\u51fbGO\u65cb\u8f6c\u8f6c\u76d8</div><div class="star">\ud83d\udc9c\u771f\u5fc3\u8bdd + \ud83d\udd25\u5927\u5192\u9669</div></div>'
    +'<div class="wheel-btns">'
    +'<button class="wheel-btn back" onclick="startGame(\'td\')">\u21a9 \u8fd4\u56de</button>'
    +'</div>';
  window._tdItems=items;window._tdAngle=0;window._tdSpinning=false;
  setTimeout(function(){var cv=document.getElementById('tCanvas');if(cv)drawWheel(cv,items.map(function(x){return x.text}),colors)},50);
}
function spinTDWheel(){
  if(window._tdSpinning)return;
  window._tdSpinning=true;
  var angle=1080+Math.random()*720;
  window._tdAngle+=angle;
  var cv=document.getElementById('tCanvas');
  cv.style.transition='transform 4.5s cubic-bezier(0.17,0.67,0.12,0.99)';
  cv.style.transform='rotate('+window._tdAngle+'deg)';
  setTimeout(function(){
    window._tdSpinning=false;
    var items=window._tdItems;
    var n=items.length,seg=360/n;
    var finalAngle=window._tdAngle%360;
    var idx=Math.floor(((360-finalAngle+seg/2)%360)/seg)%n;
    var p=getRandPlayer();
    var item=items[idx];
    var icon=item.type==='truth'?'\ud83d\udc9c \u771f\u5fc3\u8bdd':'\ud83d\udd25 \u5927\u5192\u9669';
    var action=item.type==='truth'?'\u5fc5\u987b\u56de\u7b54\uff01':'\u5fc5\u987b\u6267\u884c\uff01';
    document.getElementById('tdResult').innerHTML=
      '<div class="text">'+item.text+'</div><div class="star">'+icon+'</div><div class="player-tag">\ud83c\udfaf '+p.name+' '+action+'</div>';
  },4600);
}

