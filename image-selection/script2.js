(function(){const a=a=>document.querySelector(a),b=(a,b,c)=>a.addEventListener(b,c),c=a(".modal-image"),d=a(".img-selected-area"),e=(a=>document.querySelectorAll(a))("a"),f=a(".x-coord span"),g=a(".y-coord span"),h=a(".original-coords span"),i=a(".selected-coords span"),j=a(".corner-coords-left"),k=a(".corner-coords-right"),l=a(".modal"),m=a(".modal-close"),n="z";let o,p,q,r,s,t=!1,u=!1;const v=a=>({imgSource:a.href,linkType:a.getAttribute("type"),x1:+a.getAttribute("x"),y1:+a.getAttribute("y"),x2:+a.getAttribute("x1"),y2:+a.getAttribute("y1")}),w=(a,b)=>{const{height:d,width:e}=c;return{x:Math.round((s.x2-s.x1)*(a/e)+s.x1),y:Math.round((s.y2-s.y1)*(b/d)+s.y1)}},z=()=>({width:Math.abs(q-o),height:Math.abs(r-p),x:o<q?o:q,y:p<r?p:r}),A=()=>{const{x:a,y:b,width:c,height:d}=z(),{x:e,y:f}=w(a,b),{x:g,y:h}=w(a+c,b+d);i.innerHTML=`${e}, ${f}, ${g}, ${h}`},B=()=>{i.innerHTML=``},C=(a,b,c,d)=>{h.innerHTML=`${a}, ${b}, ${c}, ${d}`},D=()=>{const a=z();d.style.top=`${a.y}px`,d.style.left=`${a.x}px`,d.style.height=`${a.height}px`,d.style.width=`${a.width}px`,d.style.display="block"},E=()=>{d.style.display="none"},F=a=>{"keydown"===a.type&&a.key===n&&(t=!0),"keyup"===a.type&&a.key===n&&(t=!1)},G=a=>{"mousedown"==a.type&&1===a.which?u=!0:"mouseup"===a.type&&1===a.which&&(u=!1)},H=a=>{"mousedown"===a.type&&1===a.which&&t&&(o=q=a.offsetX,p=r=a.offsetY)},I=a=>{u&&t&&(q=a.offsetX,r=a.offsetY,A(),D())},J=()=>{l.style.display="block"},K=()=>{j.innerHTML=`(${s.x1}, ${s.y1})`,k.innerHTML=`(${s.x2}, ${s.y2})`},L=()=>{c.src=s.imgSource,C(s.x1,s.y1,s.x2,s.y2),K()},M=a=>{s=v(a.target);"screenShot"!==s.linkType||(a.preventDefault(),L(),J())};b(c,"mousedown",G),b(c,"mousedown",H),b(c,"mouseup",G),b(c,"mouseup",a=>{"mouseup"===a.type&&1===a.which&&E()}),b(c,"mouseup",a=>{"mouseup"===a.type&&1===a.which&&B()}),b(c,"mousemove",a=>{const b=0<a.offsetX?a.offsetX:0,c=0<a.offsetY?a.offsetY:0,{x:d,y:e}=w(b,c);f.innerHTML=`${d}`,g.innerHTML=`${e}`}),b(c,"mousemove",I),b(window,"keydown",F),b(window,"keyup",F),b(m,"click",()=>{l.style.display="none",E(),t=!1,u=!1}),e.forEach(a=>b(a,"click",M))})();