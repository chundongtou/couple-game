/*! v8-board3d min:1 */
(()=>{var Eu=0,Lc=1,Tu=2;var Fc=1,ya=2,Wn=3,ci=0,We=1,Fe=2,mi=0,hi=1,Xe=2,Uc=3,Nc=4,wu=5,Ai=100,Au=101,Ru=102,Cu=103,Pu=104,Iu=200,Du=201,Lu=202,Fu=203,ko=204,Go=205,Uu=206,Nu=207,Ou=208,Bu=209,zu=210,Hu=211,ku=212,Gu=213,Vu=214,va=0,Ma=1,Sa=2,Xi=3,ba=4,Ea=5,Ta=6,wa=7,Oc=0,Wu=1,Xu=2,gi=0,qu=1,Yu=2,Zu=3,Aa=4,$u=5,Ju=6,Ku=7;var Bc=300,es=301,ns=302,Ra=303,Ca=304,jr=306,ui=1e3,wi=1001,Vo=1002,sn=1003,Qu=1004;var to=1005;var dn=1006,Pa=1007;var Xn=1008;var Fn=1009,zc=1010,Hc=1011,Ws=1012,Ia=1013,Li=1014,Un=1015,Xs=1016,Da=1017,La=1018,qs=1020,kc=35902,Gc=35899,Vc=1021,Wc=1022,bn=1023,Us=1026,Ys=1027,Fa=1028,Ua=1029,Xc=1030,Na=1031;var Oa=1033,eo=33776,no=33777,io=33778,so=33779,Ba=35840,za=35841,Ha=35842,ka=35843,Ga=36196,Va=37492,Wa=37496,Xa=37808,qa=37809,Ya=37810,Za=37811,$a=37812,Ja=37813,Ka=37814,Qa=37815,ja=37816,tl=37817,el=37818,nl=37819,il=37820,sl=37821,rl=36492,ol=36494,al=36495,ll=36283,cl=36284,hl=36285,ul=36286;var br=2300,Wo=2301,Ho=2302,Mc=2400,Sc=2401,bc=2402;var ju=3200,td=3201;var qc=0,ed=1,Nn="",ke="srgb",qi="srgb-linear",Er="linear",pe="srgb";var Wi=7680;var Ec=519,nd=512,id=513,sd=514,Yc=515,rd=516,od=517,ad=518,ld=519,Xo=35044,Zc=35048;var $c="300 es",In=2e3,Tr=2001;var di=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},Ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var ql=Math.PI/180,qo=180/Math.PI;function ai(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ye[s&255]+Ye[s>>8&255]+Ye[s>>16&255]+Ye[s>>24&255]+"-"+Ye[t&255]+Ye[t>>8&255]+"-"+Ye[t>>16&15|64]+Ye[t>>24&255]+"-"+Ye[e&63|128]+Ye[e>>8&255]+"-"+Ye[e>>16&255]+Ye[e>>24&255]+Ye[n&255]+Ye[n>>8&255]+Ye[n>>16&255]+Ye[n>>24&255]).toLowerCase()}function ne(s,t,e){return Math.max(t,Math.min(e,s))}function Hf(s,t){return(s%t+t)%t}function Yl(s,t,e){return(1-e)*s+e*t}function zn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function _e(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var st=class s{constructor(t=0,e=0){s.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ie=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==g){let m=1-a,p=l*d+c*f+h*g+u*_,b=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){let A=Math.sqrt(S),w=Math.atan2(A,p*b);m=Math.sin(m*w)/A,a=Math.sin(a*w)/A}let x=a*b;if(l=l*m+d*x,c=c*m+f*x,h=h*m+g*x,u=u*m+_*x,m===1-a){let A=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=A,c*=A,h*=A,u*=A}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){let a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-a*f,t[e+2]=c*g+h*f+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),d=l(n/2),f=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,i=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R=class s{constructor(t=0,e=0,n=0){s.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Zh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Zh.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Zl.copy(this).projectOnVector(t),this.sub(Zl)}reflect(t){return this.sub(Zl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Zl=new R,Zh=new Ie,Kt=class s{constructor(t,e,n,i,r,o,a,l,c){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=i[0],m=i[3],p=i[6],b=i[1],S=i[4],x=i[7],A=i[2],w=i[5],P=i[8];return r[0]=o*_+a*b+l*A,r[3]=o*m+a*S+l*w,r[6]=o*p+a*x+l*P,r[1]=c*_+h*b+u*A,r[4]=c*m+h*S+u*w,r[7]=c*p+h*x+u*P,r[2]=d*_+f*b+g*A,r[5]=d*m+f*S+g*w,r[8]=d*p+f*x+g*P,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=e*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=u*_,t[1]=(i*c-h*n)*_,t[2]=(a*n-i*o)*_,t[3]=d*_,t[4]=(h*e-i*l)*_,t[5]=(i*r-a*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply($l.makeScale(t,e)),this}rotate(t){return this.premultiply($l.makeRotation(-t)),this}translate(t,e){return this.premultiply($l.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},$l=new Kt;function Jc(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function wr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function cd(){let s=wr("canvas");return s.style.display="block",s}var $h={};function Ns(s){s in $h||($h[s]=!0,console.warn(s))}function hd(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Jh=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Kh=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function kf(){let s={enabled:!0,workingColorSpace:qi,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===pe&&(i.r=li(i.r),i.g=li(i.g),i.b=li(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===pe&&(i.r=Fs(i.r),i.g=Fs(i.g),i.b=Fs(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Nn?Er:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Ns("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Ns("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[qi]:{primaries:t,whitePoint:n,transfer:Er,toXYZ:Jh,fromXYZ:Kh,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ke},outputColorSpaceConfig:{drawingBufferColorSpace:ke}},[ke]:{primaries:t,whitePoint:n,transfer:pe,toXYZ:Jh,fromXYZ:Kh,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ke}}}),s}var ae=kf();function li(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Fs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var _s,Yo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement=="undefined")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{_s===void 0&&(_s=wr("canvas")),_s.width=t.width,_s.height=t.height;let i=_s.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=_s}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement!="undefined"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&t instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&t instanceof ImageBitmap){let e=wr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=li(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(li(e[n]/255)*255):e[n]=li(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Gf=0,Os=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gf++}),this.uuid=ai(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement!="undefined"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Jl(i[o].image)):r.push(Jl(i[o]))}else r=Jl(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function Jl(s){return typeof HTMLImageElement!="undefined"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&s instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&s instanceof ImageBitmap?Yo.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Vf=0,Kl=new R,je=class s extends di{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=wi,i=wi,r=dn,o=Xn,a=bn,l=Fn,c=s.DEFAULT_ANISOTROPY,h=Nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=ai(),this.name="",this.source=new Os(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new st(0,0),this.repeat=new st(1,1),this.center=new st(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Kl).x}get height(){return this.source.getSize(Kl).y}get depth(){return this.source.getSize(Kl).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Bc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ui:t.x=t.x-Math.floor(t.x);break;case wi:t.x=t.x<0?0:1;break;case Vo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ui:t.y=t.y-Math.floor(t.y);break;case wi:t.y=t.y<0?0:1;break;case Vo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};je.DEFAULT_IMAGE=null;je.DEFAULT_MAPPING=Bc;je.DEFAULT_ANISOTROPY=1;var de=class s{constructor(t=0,e=0,n=0,i=1){s.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let S=(c+1)/2,x=(f+1)/2,A=(p+1)/2,w=(h+d)/4,P=(u+_)/4,C=(g+m)/4;return S>x&&S>A?S<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(S),i=w/n,r=P/n):x>A?x<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(x),n=w/i,r=C/i):A<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(A),n=P/r,i=C/r),this.set(n,i,r,e),this}let b=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-_)/b,this.z=(d-h)/b,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Zo=class extends di{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:dn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);let i={width:t,height:e,depth:n.depth},r=new je(i);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:dn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new Os(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},kn=class extends Zo{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Ar=class extends je{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=sn,this.minFilter=sn,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var $o=class extends je{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=sn,this.minFilter=sn,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Gn=class{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Rn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Rn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Rn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Rn):Rn.fromBufferAttribute(r,o),Rn.applyMatrix4(t.matrixWorld),this.expandByPoint(Rn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),fo.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),fo.copy(n.boundingBox)),fo.applyMatrix4(t.matrixWorld),this.union(fo)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Rn),Rn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(hr),po.subVectors(this.max,hr),xs.subVectors(t.a,hr),ys.subVectors(t.b,hr),vs.subVectors(t.c,hr),vi.subVectors(ys,xs),Mi.subVectors(vs,ys),Hi.subVectors(xs,vs);let e=[0,-vi.z,vi.y,0,-Mi.z,Mi.y,0,-Hi.z,Hi.y,vi.z,0,-vi.x,Mi.z,0,-Mi.x,Hi.z,0,-Hi.x,-vi.y,vi.x,0,-Mi.y,Mi.x,0,-Hi.y,Hi.x,0];return!Ql(e,xs,ys,vs,po)||(e=[1,0,0,0,1,0,0,0,1],!Ql(e,xs,ys,vs,po))?!1:(mo.crossVectors(vi,Mi),e=[mo.x,mo.y,mo.z],Ql(e,xs,ys,vs,po))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Rn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Rn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ei),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},ei=[new R,new R,new R,new R,new R,new R,new R,new R],Rn=new R,fo=new Gn,xs=new R,ys=new R,vs=new R,vi=new R,Mi=new R,Hi=new R,hr=new R,po=new R,mo=new R,ki=new R;function Ql(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){ki.fromArray(s,r);let a=i.x*Math.abs(ki.x)+i.y*Math.abs(ki.y)+i.z*Math.abs(ki.z),l=t.dot(ki),c=e.dot(ki),h=n.dot(ki);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Wf=new Gn,ur=new R,jl=new R,fi=class{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Wf.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ur.subVectors(t,this.center);let e=ur.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(ur,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(jl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ur.copy(t.center).add(jl)),this.expandByPoint(ur.copy(t.center).sub(jl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},ni=new R,tc=new R,go=new R,Si=new R,ec=new R,_o=new R,nc=new R,Rr=class{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ni)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=ni.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ni.copy(this.origin).addScaledVector(this.direction,e),ni.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){tc.copy(t).add(e).multiplyScalar(.5),go.copy(e).sub(t).normalize(),Si.copy(this.origin).sub(tc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(go),a=Si.dot(this.direction),l=-Si.dot(go),c=Si.lengthSq(),h=Math.abs(1-o*o),u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(tc).addScaledVector(go,d),f}intersectSphere(t,e){ni.subVectors(t.center,this.origin);let n=ni.dot(this.direction),i=ni.dot(ni)-n*n,r=t.radius*t.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ni)!==null}intersectTriangle(t,e,n,i,r){ec.subVectors(e,t),_o.subVectors(n,t),nc.crossVectors(ec,_o);let o=this.direction.dot(nc),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Si.subVectors(this.origin,t);let l=a*this.direction.dot(_o.crossVectors(Si,_o));if(l<0)return null;let c=a*this.direction.dot(ec.cross(Si));if(c<0||l+c>o)return null;let h=-a*Si.dot(nc);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Gt=class s{constructor(t,e,n,i,r,o,a,l,c,h,u,d,f,g,_,m){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,u,d,f,g,_,m)}set(t,e,n,i,r,o,a,l,c,h,u,d,f,g,_,m){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,i=1/Ms.setFromMatrixColumn(t,0).length(),r=1/Ms.setFromMatrixColumn(t,1).length(),o=1/Ms.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-a*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){let d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d+_*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=_+d*a,e[10]=o*l}else if(t.order==="ZXY"){let d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d-_*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=_-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let d=o*h,f=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){let d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Xf,t,qf)}lookAt(t,e,n){let i=this.elements;return hn.subVectors(t,e),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),bi.crossVectors(n,hn),bi.lengthSq()===0&&(Math.abs(n.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),bi.crossVectors(n,hn)),bi.normalize(),xo.crossVectors(hn,bi),i[0]=bi.x,i[4]=xo.x,i[8]=hn.x,i[1]=bi.y,i[5]=xo.y,i[9]=hn.y,i[2]=bi.z,i[6]=xo.z,i[10]=hn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],b=n[3],S=n[7],x=n[11],A=n[15],w=i[0],P=i[4],C=i[8],M=i[12],v=i[1],I=i[5],L=i[9],U=i[13],G=i[2],B=i[6],W=i[10],Z=i[14],k=i[3],j=i[7],at=i[11],nt=i[15];return r[0]=o*w+a*v+l*G+c*k,r[4]=o*P+a*I+l*B+c*j,r[8]=o*C+a*L+l*W+c*at,r[12]=o*M+a*U+l*Z+c*nt,r[1]=h*w+u*v+d*G+f*k,r[5]=h*P+u*I+d*B+f*j,r[9]=h*C+u*L+d*W+f*at,r[13]=h*M+u*U+d*Z+f*nt,r[2]=g*w+_*v+m*G+p*k,r[6]=g*P+_*I+m*B+p*j,r[10]=g*C+_*L+m*W+p*at,r[14]=g*M+_*U+m*Z+p*nt,r[3]=b*w+S*v+x*G+A*k,r[7]=b*P+S*I+x*B+A*j,r[11]=b*C+S*L+x*W+A*at,r[15]=b*M+S*U+x*Z+A*nt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*l*u-i*c*u-r*a*d+n*c*d+i*a*f-n*l*f)+_*(+e*l*f-e*c*d+r*o*d-i*o*f+i*c*h-r*l*h)+m*(+e*c*u-e*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-i*a*h-e*l*u+e*a*d+i*o*u-n*o*d+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],b=u*m*c-_*d*c+_*l*f-a*m*f-u*l*p+a*d*p,S=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,x=h*_*c-g*u*c+g*a*f-o*_*f-h*a*p+o*u*p,A=g*u*l-h*_*l-g*a*d+o*_*d+h*a*m-o*u*m,w=e*b+n*S+i*x+r*A;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let P=1/w;return t[0]=b*P,t[1]=(_*d*r-u*m*r-_*i*f+n*m*f+u*i*p-n*d*p)*P,t[2]=(a*m*r-_*l*r+_*i*c-n*m*c-a*i*p+n*l*p)*P,t[3]=(u*l*r-a*d*r-u*i*c+n*d*c+a*i*f-n*l*f)*P,t[4]=S*P,t[5]=(h*m*r-g*d*r+g*i*f-e*m*f-h*i*p+e*d*p)*P,t[6]=(g*l*r-o*m*r-g*i*c+e*m*c+o*i*p-e*l*p)*P,t[7]=(o*d*r-h*l*r+h*i*c-e*d*c-o*i*f+e*l*f)*P,t[8]=x*P,t[9]=(g*u*r-h*_*r-g*n*f+e*_*f+h*n*p-e*u*p)*P,t[10]=(o*_*r-g*a*r+g*n*c-e*_*c-o*n*p+e*a*p)*P,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*f-e*a*f)*P,t[12]=A*P,t[13]=(h*_*i-g*u*i+g*n*d-e*_*d-h*n*m+e*u*m)*P,t[14]=(g*a*i-o*_*i-g*n*l+e*_*l+o*n*m-e*a*m)*P,t[15]=(o*u*i-h*a*i+h*n*l-e*u*l-o*n*d+e*a*d)*P,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,_=o*h,m=o*u,p=a*u,b=l*c,S=l*h,x=l*u,A=n.x,w=n.y,P=n.z;return i[0]=(1-(_+p))*A,i[1]=(f+x)*A,i[2]=(g-S)*A,i[3]=0,i[4]=(f-x)*w,i[5]=(1-(d+p))*w,i[6]=(m+b)*w,i[7]=0,i[8]=(g+S)*P,i[9]=(m-b)*P,i[10]=(1-(d+_))*P,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements,r=Ms.set(i[0],i[1],i[2]).length(),o=Ms.set(i[4],i[5],i[6]).length(),a=Ms.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],Cn.copy(this);let c=1/r,h=1/o,u=1/a;return Cn.elements[0]*=c,Cn.elements[1]*=c,Cn.elements[2]*=c,Cn.elements[4]*=h,Cn.elements[5]*=h,Cn.elements[6]*=h,Cn.elements[8]*=u,Cn.elements[9]*=u,Cn.elements[10]*=u,e.setFromRotationMatrix(Cn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=In,l=!1){let c=this.elements,h=2*r/(e-t),u=2*r/(n-i),d=(e+t)/(e-t),f=(n+i)/(n-i),g,_;if(l)g=r/(o-r),_=o*r/(o-r);else if(a===In)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Tr)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=In,l=!1){let c=this.elements,h=2/(e-t),u=2/(n-i),d=-(e+t)/(e-t),f=-(n+i)/(n-i),g,_;if(l)g=1/(o-r),_=o/(o-r);else if(a===In)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===Tr)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Ms=new R,Cn=new Gt,Xf=new R(0,0,0),qf=new R(1,1,1),bi=new R,xo=new R,hn=new R,Qh=new Gt,jh=new Ie,fn=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ne(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ne(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ne(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Qh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Qh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return jh.setFromEuler(this),this.setFromQuaternion(jh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};fn.DEFAULT_ORDER="XYZ";var Cr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Yf=0,tu=new R,Ss=new Ie,ii=new Gt,yo=new R,dr=new R,Zf=new R,$f=new Ie,eu=new R(1,0,0),nu=new R(0,1,0),iu=new R(0,0,1),su={type:"added"},Jf={type:"removed"},bs={type:"childadded",child:null},ic={type:"childremoved",child:null},be=class s extends di{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yf++}),this.uuid=ai(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new R,e=new fn,n=new Ie,i=new R(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Gt},normalMatrix:{value:new Kt}}),this.matrix=new Gt,this.matrixWorld=new Gt,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Cr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ss.setFromAxisAngle(t,e),this.quaternion.multiply(Ss),this}rotateOnWorldAxis(t,e){return Ss.setFromAxisAngle(t,e),this.quaternion.premultiply(Ss),this}rotateX(t){return this.rotateOnAxis(eu,t)}rotateY(t){return this.rotateOnAxis(nu,t)}rotateZ(t){return this.rotateOnAxis(iu,t)}translateOnAxis(t,e){return tu.copy(t).applyQuaternion(this.quaternion),this.position.add(tu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(eu,t)}translateY(t){return this.translateOnAxis(nu,t)}translateZ(t){return this.translateOnAxis(iu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ii.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?yo.copy(t):yo.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),dr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ii.lookAt(dr,yo,this.up):ii.lookAt(yo,dr,this.up),this.quaternion.setFromRotationMatrix(ii),i&&(ii.extractRotation(i.matrixWorld),Ss.setFromRotationMatrix(ii),this.quaternion.premultiply(Ss.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(su),bs.child=t,this.dispatchEvent(bs),bs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Jf),ic.child=t,this.dispatchEvent(ic),ic.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ii.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ii.multiply(t.parent.matrixWorld)),t.applyMatrix4(ii),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(su),bs.child=t,this.dispatchEvent(bs),bs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(dr,t,Zf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(dr,$f,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}};be.DEFAULT_UP=new R(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Pn=new R,si=new R,sc=new R,ri=new R,Es=new R,Ts=new R,ru=new R,rc=new R,oc=new R,ac=new R,lc=new de,cc=new de,hc=new de,oi=class s{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Pn.subVectors(t,e),i.cross(Pn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Pn.subVectors(i,e),si.subVectors(n,e),sc.subVectors(t,e);let o=Pn.dot(Pn),a=Pn.dot(si),l=Pn.dot(sc),c=si.dot(si),h=si.dot(sc),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,ri)===null?!1:ri.x>=0&&ri.y>=0&&ri.x+ri.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,ri)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ri.x),l.addScaledVector(o,ri.y),l.addScaledVector(a,ri.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return lc.setScalar(0),cc.setScalar(0),hc.setScalar(0),lc.fromBufferAttribute(t,e),cc.fromBufferAttribute(t,n),hc.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(lc,r.x),o.addScaledVector(cc,r.y),o.addScaledVector(hc,r.z),o}static isFrontFacing(t,e,n,i){return Pn.subVectors(n,e),si.subVectors(t,e),Pn.cross(si).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Pn.subVectors(this.c,this.b),si.subVectors(this.a,this.b),Pn.cross(si).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,o,a;Es.subVectors(i,n),Ts.subVectors(r,n),rc.subVectors(t,n);let l=Es.dot(rc),c=Ts.dot(rc);if(l<=0&&c<=0)return e.copy(n);oc.subVectors(t,i);let h=Es.dot(oc),u=Ts.dot(oc);if(h>=0&&u<=h)return e.copy(i);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Es,o);ac.subVectors(t,r);let f=Es.dot(ac),g=Ts.dot(ac);if(g>=0&&f<=g)return e.copy(r);let _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Ts,a);let m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return ru.subVectors(r,i),a=(u-h)/(u-h+(f-g)),e.copy(i).addScaledVector(ru,a);let p=1/(m+_+d);return o=_*p,a=d*p,e.copy(n).addScaledVector(Es,o).addScaledVector(Ts,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ud={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ei={h:0,s:0,l:0},vo={h:0,s:0,l:0};function uc(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var Ot=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ke){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ae.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=ae.workingColorSpace){return this.r=t,this.g=e,this.b=n,ae.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=ae.workingColorSpace){if(t=Hf(t,1),e=ne(e,0,1),n=ne(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=uc(o,r,t+1/3),this.g=uc(o,r,t),this.b=uc(o,r,t-1/3)}return ae.colorSpaceToWorking(this,i),this}setStyle(t,e=ke){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ke){let n=ud[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=li(t.r),this.g=li(t.g),this.b=li(t.b),this}copyLinearToSRGB(t){return this.r=Fs(t.r),this.g=Fs(t.g),this.b=Fs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ke){return ae.workingToColorSpace(Ze.copy(this),t),Math.round(ne(Ze.r*255,0,255))*65536+Math.round(ne(Ze.g*255,0,255))*256+Math.round(ne(Ze.b*255,0,255))}getHexString(t=ke){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ae.workingColorSpace){ae.workingToColorSpace(Ze.copy(this),e);let n=Ze.r,i=Ze.g,r=Ze.b,o=Math.max(n,i,r),a=Math.min(n,i,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ae.workingColorSpace){return ae.workingToColorSpace(Ze.copy(this),e),t.r=Ze.r,t.g=Ze.g,t.b=Ze.b,t}getStyle(t=ke){ae.workingToColorSpace(Ze.copy(this),t);let e=Ze.r,n=Ze.g,i=Ze.b;return t!==ke?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Ei),this.setHSL(Ei.h+t,Ei.s+e,Ei.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ei),t.getHSL(vo);let n=Yl(Ei.h,vo.h,e),i=Yl(Ei.s,vo.s,e),r=Yl(Ei.l,vo.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ze=new Ot;Ot.NAMES=ud;var Kf=0,Vn=class extends di{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=ai(),this.name="",this.type="Material",this.blending=hi,this.side=ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ko,this.blendDst=Go,this.blendEquation=Ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ot(0,0,0),this.blendAlpha=0,this.depthFunc=Xi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ec,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Wi,this.stencilZFail=Wi,this.stencilZPass=Wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==hi&&(n.blending=this.blending),this.side!==ci&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ko&&(n.blendSrc=this.blendSrc),this.blendDst!==Go&&(n.blendDst=this.blendDst),this.blendEquation!==Ai&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Xi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ec&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Wi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Wi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Wi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},He=class extends Vn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.combine=Oc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Le=new R,Mo=new st,Qf=0,Ne=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Qf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Xo,this.updateRanges=[],this.gpuType=Un,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Mo.fromBufferAttribute(this,e),Mo.applyMatrix3(t),this.setXY(e,Mo.x,Mo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix3(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyMatrix4(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.applyNormalMatrix(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Le.fromBufferAttribute(this,e),Le.transformDirection(t),this.setXYZ(e,Le.x,Le.y,Le.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=zn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=zn(e,this.array)),e}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=zn(e,this.array)),e}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=zn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=zn(e,this.array)),e}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),i=_e(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),i=_e(i,this.array),r=_e(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Xo&&(t.usage=this.usage),t}};var Pr=class extends Ne{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Ir=class extends Ne{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var qt=class extends Ne{constructor(t,e,n){super(new Float32Array(t),e,n)}},jf=0,Mn=new Gt,dc=new be,ws=new R,un=new Gn,fr=new Gn,ze=new R,ve=class s extends di{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jf++}),this.uuid=ai(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Jc(t)?Ir:Pr)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Kt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Mn.makeRotationFromQuaternion(t),this.applyMatrix4(Mn),this}rotateX(t){return Mn.makeRotationX(t),this.applyMatrix4(Mn),this}rotateY(t){return Mn.makeRotationY(t),this.applyMatrix4(Mn),this}rotateZ(t){return Mn.makeRotationZ(t),this.applyMatrix4(Mn),this}translate(t,e,n){return Mn.makeTranslation(t,e,n),this.applyMatrix4(Mn),this}scale(t,e,n){return Mn.makeScale(t,e,n),this.applyMatrix4(Mn),this}lookAt(t){return dc.lookAt(t),dc.updateMatrix(),this.applyMatrix4(dc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ws).negate(),this.translate(ws.x,ws.y,ws.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,r=t.length;i<r;i++){let o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new qt(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Gn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];un.setFromBufferAttribute(r),this.morphTargetsRelative?(ze.addVectors(this.boundingBox.min,un.min),this.boundingBox.expandByPoint(ze),ze.addVectors(this.boundingBox.max,un.max),this.boundingBox.expandByPoint(ze)):(this.boundingBox.expandByPoint(un.min),this.boundingBox.expandByPoint(un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){let n=this.boundingSphere.center;if(un.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];fr.setFromBufferAttribute(a),this.morphTargetsRelative?(ze.addVectors(un.min,fr.min),un.expandByPoint(ze),ze.addVectors(un.max,fr.max),un.expandByPoint(ze)):(un.expandByPoint(fr.min),un.expandByPoint(fr.max))}un.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)ze.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(ze));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)ze.fromBufferAttribute(a,c),l&&(ws.fromBufferAttribute(t,c),ze.add(ws)),i=Math.max(i,n.distanceToSquared(ze))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ne(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new R,l[C]=new R;let c=new R,h=new R,u=new R,d=new st,f=new st,g=new st,_=new R,m=new R;function p(C,M,v){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,v),d.fromBufferAttribute(r,C),f.fromBufferAttribute(r,M),g.fromBufferAttribute(r,v),h.sub(c),u.sub(c),f.sub(d),g.sub(d);let I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(I),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(I),a[C].add(_),a[M].add(_),a[v].add(_),l[C].add(m),l[M].add(m),l[v].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let C=0,M=b.length;C<M;++C){let v=b[C],I=v.start,L=v.count;for(let U=I,G=I+L;U<G;U+=3)p(t.getX(U+0),t.getX(U+1),t.getX(U+2))}let S=new R,x=new R,A=new R,w=new R;function P(C){A.fromBufferAttribute(i,C),w.copy(A);let M=a[C];S.copy(M),S.sub(A.multiplyScalar(A.dot(M))).normalize(),x.crossVectors(w,M);let I=x.dot(l[C])<0?-1:1;o.setXYZW(C,S.x,S.y,S.z,I)}for(let C=0,M=b.length;C<M;++C){let v=b[C],I=v.start,L=v.count;for(let U=I,G=I+L;U<G;U+=3)P(t.getX(U+0)),P(t.getX(U+1)),P(t.getX(U+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ne(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new R,r=new R,o=new R,a=new R,l=new R,c=new R,h=new R,u=new R;if(t)for(let d=0,f=t.count;d<f;d+=3){let g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ze.fromBufferAttribute(t,e),ze.normalize(),t.setXYZ(e,ze.x,ze.y,ze.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new Ne(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},ou=new Gt,Gi=new Rr,So=new fi,au=new R,bo=new R,Eo=new R,To=new R,fc=new R,wo=new R,lu=new R,Ao=new R,At=class extends be{constructor(t=new ve,e=new He){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(r&&a){wo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(fc.fromBufferAttribute(u,t),o?wo.addScaledVector(fc,h):wo.addScaledVector(fc.sub(e),h))}e.add(wo)}return e}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),So.copy(n.boundingSphere),So.applyMatrix4(r),Gi.copy(t.ray).recast(t.near),!(So.containsPoint(Gi.origin)===!1&&(Gi.intersectSphere(So,au)===null||Gi.origin.distanceToSquared(au)>(t.far-t.near)**2))&&(ou.copy(r).invert(),Gi.copy(t.ray).applyMatrix4(ou),!(n.boundingBox!==null&&Gi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Gi)))}_computeIntersections(t,e,n){let i,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),S=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let x=b,A=S;x<A;x+=3){let w=a.getX(x),P=a.getX(x+1),C=a.getX(x+2);i=Ro(this,p,t,n,c,h,u,w,P,C),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let b=a.getX(m),S=a.getX(m+1),x=a.getX(m+2);i=Ro(this,o,t,n,c,h,u,b,S,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),S=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=b,A=S;x<A;x+=3){let w=x,P=x+1,C=x+2;i=Ro(this,p,t,n,c,h,u,w,P,C),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let b=m,S=m+1,x=m+2;i=Ro(this,o,t,n,c,h,u,b,S,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}};function tp(s,t,e,n,i,r,o,a){let l;if(t.side===We?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===ci,a),l===null)return null;Ao.copy(a),Ao.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(Ao);return c<e.near||c>e.far?null:{distance:c,point:Ao.clone(),object:s}}function Ro(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,bo),s.getVertexPosition(l,Eo),s.getVertexPosition(c,To);let h=tp(s,t,e,n,bo,Eo,To,lu);if(h){let u=new R;oi.getBarycoord(lu,bo,Eo,To,u),i&&(h.uv=oi.getInterpolatedAttribute(i,a,l,c,u,new st)),r&&(h.uv1=oi.getInterpolatedAttribute(r,a,l,c,u,new st)),o&&(h.normal=oi.getInterpolatedAttribute(o,a,l,c,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new R,materialIndex:0};oi.getNormal(bo,Eo,To,d.normal),h.face=d,h.barycoord=u}return h}var Qt=class s extends ve{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new qt(c,3)),this.setAttribute("normal",new qt(h,3)),this.setAttribute("uv",new qt(u,2));function g(_,m,p,b,S,x,A,w,P,C,M){let v=x/P,I=A/C,L=x/2,U=A/2,G=w/2,B=P+1,W=C+1,Z=0,k=0,j=new R;for(let at=0;at<W;at++){let nt=at*I-U;for(let ft=0;ft<B;ft++){let Ut=ft*v-L;j[_]=Ut*b,j[m]=nt*S,j[p]=G,c.push(j.x,j.y,j.z),j[_]=0,j[m]=0,j[p]=w>0?1:-1,h.push(j.x,j.y,j.z),u.push(ft/P),u.push(1-at/C),Z+=1}}for(let at=0;at<C;at++)for(let nt=0;nt<P;nt++){let ft=d+nt+B*at,Ut=d+nt+B*(at+1),Lt=d+(nt+1)+B*(at+1),Ct=d+(nt+1)+B*at;l.push(ft,Ut,Ct),l.push(Ut,Lt,Ct),k+=6}a.addGroup(f,k,M),f+=k,d+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function is(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function $e(s){let t={};for(let e=0;e<s.length;e++){let n=is(s[e]);for(let i in n)t[i]=n[i]}return t}function ep(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Kc(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ae.workingColorSpace}var dd={clone:is,merge:$e},np=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ip=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,pn=class extends Vn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=np,this.fragmentShader=ip,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=is(t.uniforms),this.uniformsGroups=ep(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Dr=class extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Gt,this.projectionMatrix=new Gt,this.projectionMatrixInverse=new Gt,this.coordinateSystem=In,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ti=new R,cu=new st,hu=new st,Ge=class extends Dr{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=qo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ql*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return qo*2*Math.atan(Math.tan(ql*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ti.x,Ti.y).multiplyScalar(-t/Ti.z),Ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ti.x,Ti.y).multiplyScalar(-t/Ti.z)}getViewSize(t,e){return this.getViewBounds(t,cu,hu),e.subVectors(hu,cu)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ql*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},As=-90,Rs=1,Jo=class extends be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Ge(As,Rs,t,e);i.layers=this.layers,this.add(i);let r=new Ge(As,Rs,t,e);r.layers=this.layers,this.add(r);let o=new Ge(As,Rs,t,e);o.layers=this.layers,this.add(o);let a=new Ge(As,Rs,t,e);a.layers=this.layers,this.add(a);let l=new Ge(As,Rs,t,e);l.layers=this.layers,this.add(l);let c=new Ge(As,Rs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===In)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Tr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Lr=class extends je{constructor(t=[],e=es,n,i,r,o,a,l,c,h){super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Ko=class extends kn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Lr(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Qt(5,5,5),r=new pn({name:"CubemapFromEquirect",uniforms:is(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:We,blending:mi});r.uniforms.tEquirect.value=e;let o=new At(i,r),a=e.minFilter;return e.minFilter===Xn&&(e.minFilter=dn),new Jo(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}},fe=class extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}},sp={type:"move"},Bs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new fe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new fe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new fe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(sp)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new fe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Fr=class s{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ot(t),this.density=e}clone(){return new s(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Yi=class extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fn,this.environmentIntensity=1,this.environmentRotation=new fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},Qo=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Xo,this.updateRanges=[],this.version=0,this.uuid=ai()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ai()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ai()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Qe=new R,Ur=class s{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Qe.fromBufferAttribute(this,e),Qe.applyMatrix4(t),this.setXYZ(e,Qe.x,Qe.y,Qe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Qe.fromBufferAttribute(this,e),Qe.applyNormalMatrix(t),this.setXYZ(e,Qe.x,Qe.y,Qe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Qe.fromBufferAttribute(this,e),Qe.transformDirection(t),this.setXYZ(e,Qe.x,Qe.y,Qe.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=zn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=_e(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=zn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=zn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=zn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=zn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),i=_e(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),n=_e(n,this.array),i=_e(i,this.array),r=_e(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Ne(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Sn=class extends Vn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ot(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Cs,pr=new R,Ps=new R,Is=new R,Ds=new st,mr=new st,fd=new Gt,Co=new R,gr=new R,Po=new R,uu=new st,pc=new st,du=new st,Dn=class extends be{constructor(t=new Sn){if(super(),this.isSprite=!0,this.type="Sprite",Cs===void 0){Cs=new ve;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Qo(e,5);Cs.setIndex([0,1,2,0,2,3]),Cs.setAttribute("position",new Ur(n,3,0,!1)),Cs.setAttribute("uv",new Ur(n,2,3,!1))}this.geometry=Cs,this.material=t,this.center=new st(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ps.setFromMatrixScale(this.matrixWorld),fd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Is.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ps.multiplyScalar(-Is.z);let n=this.material.rotation,i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));let o=this.center;Io(Co.set(-.5,-.5,0),Is,o,Ps,i,r),Io(gr.set(.5,-.5,0),Is,o,Ps,i,r),Io(Po.set(.5,.5,0),Is,o,Ps,i,r),uu.set(0,0),pc.set(1,0),du.set(1,1);let a=t.ray.intersectTriangle(Co,gr,Po,!1,pr);if(a===null&&(Io(gr.set(-.5,.5,0),Is,o,Ps,i,r),pc.set(0,1),a=t.ray.intersectTriangle(Co,Po,gr,!1,pr),a===null))return;let l=t.ray.origin.distanceTo(pr);l<t.near||l>t.far||e.push({distance:l,point:pr.clone(),uv:oi.getInterpolation(pr,Co,gr,Po,uu,pc,du,new st),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function Io(s,t,e,n,i,r){Ds.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(mr.x=r*Ds.x-i*Ds.y,mr.y=i*Ds.x+r*Ds.y):mr.copy(Ds),s.copy(t),s.x+=mr.x,s.y+=mr.y,s.applyMatrix4(fd)}var jo=class extends je{constructor(t=null,e=1,n=1,i,r,o,a,l,c=sn,h=sn,u,d){super(null,o,a,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Nr=class extends Ne{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Ls=new Gt,fu=new Gt,Do=[],pu=new Gn,rp=new Gt,_r=new At,xr=new fi,Zi=class extends At{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Nr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,rp)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Gn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ls),pu.copy(t.boundingBox).applyMatrix4(Ls),this.boundingBox.union(pu)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new fi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ls),xr.copy(t.boundingSphere).applyMatrix4(Ls),this.boundingSphere.union(xr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(_r.geometry=this.geometry,_r.material=this.material,_r.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),xr.copy(this.boundingSphere),xr.applyMatrix4(n),t.ray.intersectsSphere(xr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ls),fu.multiplyMatrices(n,Ls),_r.matrixWorld=fu,_r.raycast(t,Do);for(let o=0,a=Do.length;o<a;o++){let l=Do[o];l.instanceId=r,l.object=this,e.push(l)}Do.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Nr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new jo(new Float32Array(i*this.count),i,this.count,Fa,Un));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=i*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},mc=new R,op=new R,ap=new Kt,Bn=class{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=mc.subVectors(n,e).cross(op.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(mc),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||ap.getNormalMatrix(t),i=this.coplanarPoint(mc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Vi=new fi,lp=new st(.5,.5),Lo=new R,zs=class{constructor(t=new Bn,e=new Bn,n=new Bn,i=new Bn,r=new Bn,o=new Bn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=In,n=!1){let i=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],b=r[12],S=r[13],x=r[14],A=r[15];if(i[0].setComponents(c-o,f-h,p-g,A-b).normalize(),i[1].setComponents(c+o,f+h,p+g,A+b).normalize(),i[2].setComponents(c+a,f+u,p+_,A+S).normalize(),i[3].setComponents(c-a,f-u,p-_,A-S).normalize(),n)i[4].setComponents(l,d,m,x).normalize(),i[5].setComponents(c-l,f-d,p-m,A-x).normalize();else if(i[4].setComponents(c-l,f-d,p-m,A-x).normalize(),e===In)i[5].setComponents(c+l,f+d,p+m,A+x).normalize();else if(e===Tr)i[5].setComponents(l,d,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Vi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Vi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Vi)}intersectsSprite(t){Vi.center.set(0,0,0);let e=lp.distanceTo(t.center);return Vi.radius=.7071067811865476+e,Vi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Vi)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(Lo.x=i.normal.x>0?t.max.x:t.min.x,Lo.y=i.normal.y>0?t.max.y:t.min.y,Lo.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Lo)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var $i=class extends Vn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ot(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},mu=new Gt,Tc=new Rr,Fo=new fi,Uo=new R,Hs=class extends be{constructor(t=new ve,e=new $i){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Fo.copy(n.boundingSphere),Fo.applyMatrix4(i),Fo.radius+=r,t.ray.intersectsSphere(Fo)===!1)return;mu.copy(i).invert(),Tc.copy(t.ray).applyMatrix4(mu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=d,_=f;g<_;g++){let m=c.getX(g);Uo.fromBufferAttribute(u,m),gu(Uo,m,l,i,t,e,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let g=d,_=f;g<_;g++)Uo.fromBufferAttribute(u,g),gu(Uo,g,l,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function gu(s,t,e,n,i,r,o){let a=Tc.distanceSqToPoint(s);if(a<e){let l=new R;Tc.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Or=class extends je{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Br=class extends je{constructor(t,e,n=Li,i,r,o,a=sn,l=sn,c,h=Us,u=1){if(h!==Us&&h!==Ys)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:u};super(d,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Os(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},zr=class extends je{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},ks=class s extends ve{constructor(t=1,e=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:i,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,g=n*2+r,_=i+1,m=new R,p=new R;for(let b=0;b<=g;b++){let S=0,x=0,A=0,w=0;if(b<=n){let M=b/n,v=M*Math.PI/2;x=-h-t*Math.cos(v),A=t*Math.sin(v),w=-t*Math.cos(v),S=M*u}else if(b<=n+r){let M=(b-n)/r;x=-h+M*e,A=t,w=0,S=u+M*d}else{let M=(b-n-r)/n,v=M*Math.PI/2;x=h+t*Math.sin(v),A=t*Math.cos(v),w=t*Math.sin(v),S=u+d+M*u}let P=Math.max(0,Math.min(1,S/f)),C=0;b===0?C=.5/i:b===g&&(C=-.5/i);for(let M=0;M<=i;M++){let v=M/i,I=v*Math.PI*2,L=Math.sin(I),U=Math.cos(I);p.x=-A*U,p.y=x,p.z=A*L,a.push(p.x,p.y,p.z),m.set(-A*U,w,A*L),m.normalize(),l.push(m.x,m.y,m.z),c.push(v+C,P)}if(b>0){let M=(b-1)*_;for(let v=0;v<i;v++){let I=M+v,L=M+v+1,U=b*_+v,G=b*_+v+1;o.push(I,L,U),o.push(L,G,U)}}}this.setIndex(o),this.setAttribute("position",new qt(a,3)),this.setAttribute("normal",new qt(l,3)),this.setAttribute("uv",new qt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Hr=class s extends ve{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);let r=[],o=[],a=[],l=[],c=new R,h=new st;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let f=n+u/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new qt(o,3)),this.setAttribute("normal",new qt(a,3)),this.setAttribute("uv",new qt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.segments,t.thetaStart,t.thetaLength)}},te=class s extends ve{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],d=[],f=[],g=0,_=[],m=n/2,p=0;b(),o===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new qt(u,3)),this.setAttribute("normal",new qt(d,3)),this.setAttribute("uv",new qt(f,2));function b(){let x=new R,A=new R,w=0,P=(e-t)/n;for(let C=0;C<=r;C++){let M=[],v=C/r,I=v*(e-t)+t;for(let L=0;L<=i;L++){let U=L/i,G=U*l+a,B=Math.sin(G),W=Math.cos(G);A.x=I*B,A.y=-v*n+m,A.z=I*W,u.push(A.x,A.y,A.z),x.set(B,P,W).normalize(),d.push(x.x,x.y,x.z),f.push(U,1-v),M.push(g++)}_.push(M)}for(let C=0;C<i;C++)for(let M=0;M<r;M++){let v=_[M][C],I=_[M+1][C],L=_[M+1][C+1],U=_[M][C+1];(t>0||M!==0)&&(h.push(v,I,U),w+=3),(e>0||M!==r-1)&&(h.push(I,L,U),w+=3)}c.addGroup(p,w,0),p+=w}function S(x){let A=g,w=new st,P=new R,C=0,M=x===!0?t:e,v=x===!0?1:-1;for(let L=1;L<=i;L++)u.push(0,m*v,0),d.push(0,v,0),f.push(.5,.5),g++;let I=g;for(let L=0;L<=i;L++){let G=L/i*l+a,B=Math.cos(G),W=Math.sin(G);P.x=M*W,P.y=m*v,P.z=M*B,u.push(P.x,P.y,P.z),d.push(0,v,0),w.x=B*.5+.5,w.y=W*.5*v+.5,f.push(w.x,w.y),g++}for(let L=0;L<i;L++){let U=A+L,G=I+L;x===!0?h.push(G,G+1,U):h.push(G+1,G,U),C+=3}c.addGroup(p,C,x===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ji=class s extends te{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var mn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),i=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);let h=n[i],d=n[i+1]-h,f=(o-h)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let o=this.getPoint(i),a=this.getPoint(r),l=e||(o.isVector2?new st:new R);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new R,i=[],r=[],o=[],a=new R,l=new Gt;for(let f=0;f<=t;f++){let g=f/t;i[f]=this.getTangentAt(g,new R)}r[0]=new R,o[0]=new R;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(ne(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(ne(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),o[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Gs=class extends mn{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new st){let n=e,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},ta=class extends Gs{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Qc(){let s=0,t=0,e=0,n=0;function i(r,o,a,l){s=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,i(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return s+t*r+e*o+n*a}}}var No=new R,gc=new Qc,_c=new Qc,xc=new Qc,ea=class extends mn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new R){let n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%r]:(No.subVectors(i[0],i[1]).add(i[0]),c=No);let u=i[a%r],d=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(No.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=No),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),gc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,_,m),_c.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,_,m),xc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(gc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),_c.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),xc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(gc.calc(l),_c.calc(l),xc.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new R().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function _u(s,t,e,n,i){let r=(n-t)*.5,o=(i-e)*.5,a=s*s,l=s*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*s+e}function cp(s,t){let e=1-s;return e*e*t}function hp(s,t){return 2*(1-s)*s*t}function up(s,t){return s*s*t}function Mr(s,t,e,n){return cp(s,t)+hp(s,e)+up(s,n)}function dp(s,t){let e=1-s;return e*e*e*t}function fp(s,t){let e=1-s;return 3*e*e*s*t}function pp(s,t){return 3*(1-s)*s*s*t}function mp(s,t){return s*s*s*t}function Sr(s,t,e,n,i){return dp(s,t)+fp(s,e)+pp(s,n)+mp(s,i)}var kr=class extends mn{constructor(t=new st,e=new st,n=new st,i=new st){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new st){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Sr(t,i.x,r.x,o.x,a.x),Sr(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},na=class extends mn{constructor(t=new R,e=new R,n=new R,i=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new R){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Sr(t,i.x,r.x,o.x,a.x),Sr(t,i.y,r.y,o.y,a.y),Sr(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Gr=class extends mn{constructor(t=new st,e=new st){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new st){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new st){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ia=class extends mn{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Vr=class extends mn{constructor(t=new st,e=new st,n=new st){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new st){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(Mr(t,i.x,r.x,o.x),Mr(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},sa=class extends mn{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(Mr(t,i.x,r.x,o.x),Mr(t,i.y,r.y,o.y),Mr(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Wr=class extends mn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new st){let n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(_u(a,l.x,c.x,h.x,u.x),_u(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new st().fromArray(i))}return this}},wc=Object.freeze({__proto__:null,ArcCurve:ta,CatmullRomCurve3:ea,CubicBezierCurve:kr,CubicBezierCurve3:na,EllipseCurve:Gs,LineCurve:Gr,LineCurve3:ia,QuadraticBezierCurve:Vr,QuadraticBezierCurve3:sa,SplineCurve:Wr}),ra=class extends mn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new wc[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let o=i[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,r=this.curves;i<r.length;i++){let o=r[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new wc[i.type]().fromJSON(i))}return this}},Ri=class extends ra{constructor(t){super(),this.type="Path",this.currentPoint=new st,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Gr(this.currentPoint.clone(),new st(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let r=new Vr(this.currentPoint.clone(),new st(t,e),new st(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,o){let a=new kr(this.currentPoint.clone(),new st(t,e),new st(n,i),new st(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Wr(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,i,r,o),this}absarc(t,e,n,i,r,o){return this.absellipse(t,e,n,n,i,r,o),this}ellipse(t,e,n,i,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,r,o,a,l),this}absellipse(t,e,n,i,r,o,a,l){let c=new Gs(t,e,n,i,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Ln=class extends Ri{constructor(t){super(t),this.uuid=ai(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new Ri().fromJSON(i))}return this}};function gp(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=pd(s,0,i,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=Mp(s,t,r,e)),s.length>80*e){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let d=e;d<i;d+=e){let f=s[d],g=s[d+1];f<a&&(a=f),g<l&&(l=g),f>h&&(h=f),g>u&&(u=g)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return Xr(r,o,e,a,l,c,0),o}function pd(s,t,e,n,i){let r;if(i===Dp(s,t,e,n)>0)for(let o=t;o<e;o+=n)r=xu(o/n|0,s[o],s[o+1],r);else for(let o=e-n;o>=t;o-=n)r=xu(o/n|0,s[o],s[o+1],r);return r&&Vs(r,r.next)&&(Yr(r),r=r.next),r}function Ki(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Vs(e,e.next)||Re(e.prev,e,e.next)===0)){if(Yr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Xr(s,t,e,n,i,r,o){if(!s)return;!o&&r&&wp(s,n,i,r);let a=s;for(;s.prev!==s.next;){let l=s.prev,c=s.next;if(r?xp(s,n,i,r):_p(s)){t.push(l.i,s.i,c.i),Yr(s),s=c.next,a=c.next;continue}if(s=c,s===a){o?o===1?(s=yp(Ki(s),t),Xr(s,t,e,n,i,r,2)):o===2&&vp(s,t,e,n,i,r):Xr(Ki(s),t,e,n,i,r,1);break}}}function _p(s){let t=s.prev,e=s,n=s.next;if(Re(t,e,n)>=0)return!1;let i=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(i,r,o),u=Math.min(a,l,c),d=Math.max(i,r,o),f=Math.max(a,l,c),g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&vr(i,a,r,l,o,c,g.x,g.y)&&Re(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function xp(s,t,e,n){let i=s.prev,r=s,o=s.next;if(Re(i,r,o)>=0)return!1;let a=i.x,l=r.x,c=o.x,h=i.y,u=r.y,d=o.y,f=Math.min(a,l,c),g=Math.min(h,u,d),_=Math.max(a,l,c),m=Math.max(h,u,d),p=Ac(f,g,t,e,n),b=Ac(_,m,t,e,n),S=s.prevZ,x=s.nextZ;for(;S&&S.z>=p&&x&&x.z<=b;){if(S.x>=f&&S.x<=_&&S.y>=g&&S.y<=m&&S!==i&&S!==o&&vr(a,h,l,u,c,d,S.x,S.y)&&Re(S.prev,S,S.next)>=0||(S=S.prevZ,x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==i&&x!==o&&vr(a,h,l,u,c,d,x.x,x.y)&&Re(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;S&&S.z>=p;){if(S.x>=f&&S.x<=_&&S.y>=g&&S.y<=m&&S!==i&&S!==o&&vr(a,h,l,u,c,d,S.x,S.y)&&Re(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;x&&x.z<=b;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==i&&x!==o&&vr(a,h,l,u,c,d,x.x,x.y)&&Re(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function yp(s,t){let e=s;do{let n=e.prev,i=e.next.next;!Vs(n,i)&&gd(n,e,e.next,i)&&qr(n,i)&&qr(i,n)&&(t.push(n.i,e.i,i.i),Yr(e),Yr(e.next),e=s=i),e=e.next}while(e!==s);return Ki(e)}function vp(s,t,e,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Cp(o,a)){let l=_d(o,a);o=Ki(o,o.next),l=Ki(l,l.next),Xr(o,t,e,n,i,r,0),Xr(l,t,e,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function Mp(s,t,e,n){let i=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*n,l=r<o-1?t[r+1]*n:s.length,c=pd(s,a,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Rp(c))}i.sort(Sp);for(let r=0;r<i.length;r++)e=bp(i[r],e);return e}function Sp(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){let n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function bp(s,t){let e=Ep(s,t);if(!e)return t;let n=_d(e,s);return Ki(n,n.next),Ki(e,e.next)}function Ep(s,t){let e=t,n=s.x,i=s.y,r=-1/0,o;if(Vs(s,e))return e;do{if(Vs(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){let u=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&md(i<c?n:r,i,l,c,i<c?r:n,i,e.x,e.y)){let u=Math.abs(i-e.y)/(n-e.x);qr(e,s)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&Tp(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function Tp(s,t){return Re(s.prev,s,t.prev)<0&&Re(t.next,s,s.next)<0}function wp(s,t,e,n){let i=s;do i.z===0&&(i.z=Ac(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,Ap(i)}function Ap(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(i=n,n=n.nextZ,a--):(i=o,o=o.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=o}r.nextZ=null,e*=2}while(t>1);return s}function Ac(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function Rp(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function md(s,t,e,n,i,r,o,a){return(i-o)*(t-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(i-o)*(n-a)}function vr(s,t,e,n,i,r,o,a){return!(s===o&&t===a)&&md(s,t,e,n,i,r,o,a)}function Cp(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!Pp(s,t)&&(qr(s,t)&&qr(t,s)&&Ip(s,t)&&(Re(s.prev,s,t.prev)||Re(s,t.prev,t))||Vs(s,t)&&Re(s.prev,s,s.next)>0&&Re(t.prev,t,t.next)>0)}function Re(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Vs(s,t){return s.x===t.x&&s.y===t.y}function gd(s,t,e,n){let i=Bo(Re(s,t,e)),r=Bo(Re(s,t,n)),o=Bo(Re(e,n,s)),a=Bo(Re(e,n,t));return!!(i!==r&&o!==a||i===0&&Oo(s,e,t)||r===0&&Oo(s,n,t)||o===0&&Oo(e,s,n)||a===0&&Oo(e,t,n))}function Oo(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Bo(s){return s>0?1:s<0?-1:0}function Pp(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&gd(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function qr(s,t){return Re(s.prev,s,s.next)<0?Re(s,t,s.next)>=0&&Re(s,s.prev,t)>=0:Re(s,t,s.prev)<0||Re(s,s.next,t)<0}function Ip(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function _d(s,t){let e=Rc(s.i,s.x,s.y),n=Rc(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function xu(s,t,e,n){let i=Rc(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Yr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Rc(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Dp(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}var Cc=class{static triangulate(t,e,n=2){return gp(t,e,n)}},Hn=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];yu(t),vu(n,t);let o=t.length;e.forEach(yu);for(let l=0;l<e.length;l++)i.push(o),o+=e[l].length,vu(n,e[l]);let a=Cc.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function yu(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function vu(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var Qi=class s extends ve{constructor(t=new Ln([new st(.5,.5),new st(-.5,.5),new st(-.5,-.5),new st(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,i=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new qt(i,3)),this.setAttribute("uv",new qt(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,b=e.UVGenerator!==void 0?e.UVGenerator:Lp,S,x=!1,A,w,P,C;p&&(S=p.getSpacedPoints(h),x=!0,d=!1,A=p.computeFrenetFrames(h,!1),w=new R,P=new R,C=new R),d||(m=0,f=0,g=0,_=0);let M=a.extractPoints(c),v=M.shape,I=M.holes;if(!Hn.isClockWise(v)){v=v.reverse();for(let it=0,tt=I.length;it<tt;it++){let Q=I[it];Hn.isClockWise(Q)&&(I[it]=Q.reverse())}}function U(it){let Q=10000000000000001e-36,K=it[0];for(let pt=1;pt<=it.length;pt++){let rt=pt%it.length,_t=it[rt],Zt=_t.x-K.x,Wt=_t.y-K.y,T=Zt*Zt+Wt*Wt,y=Math.max(Math.abs(_t.x),Math.abs(_t.y),Math.abs(K.x),Math.abs(K.y)),z=Q*y*y;if(T<=z){it.splice(rt,1),pt--;continue}K=_t}}U(v),I.forEach(U);let G=I.length,B=v;for(let it=0;it<G;it++){let tt=I[it];v=v.concat(tt)}function W(it,tt,Q){return tt||console.error("THREE.ExtrudeGeometry: vec does not exist"),it.clone().addScaledVector(tt,Q)}let Z=v.length;function k(it,tt,Q){let K,pt,rt,_t=it.x-tt.x,Zt=it.y-tt.y,Wt=Q.x-it.x,T=Q.y-it.y,y=_t*_t+Zt*Zt,z=_t*T-Zt*Wt;if(Math.abs(z)>Number.EPSILON){let H=Math.sqrt(y),J=Math.sqrt(Wt*Wt+T*T),X=tt.x-Zt/H,ht=tt.y+_t/H,ut=Q.x-T/J,wt=Q.y+Wt/J,Pt=((ut-X)*T-(wt-ht)*Wt)/(_t*T-Zt*Wt);K=X+_t*Pt-it.x,pt=ht+Zt*Pt-it.y;let ot=K*K+pt*pt;if(ot<=2)return new st(K,pt);rt=Math.sqrt(ot/2)}else{let H=!1;_t>Number.EPSILON?Wt>Number.EPSILON&&(H=!0):_t<-Number.EPSILON?Wt<-Number.EPSILON&&(H=!0):Math.sign(Zt)===Math.sign(T)&&(H=!0),H?(K=-Zt,pt=_t,rt=Math.sqrt(y)):(K=_t,pt=Zt,rt=Math.sqrt(y/2))}return new st(K/rt,pt/rt)}let j=[];for(let it=0,tt=B.length,Q=tt-1,K=it+1;it<tt;it++,Q++,K++)Q===tt&&(Q=0),K===tt&&(K=0),j[it]=k(B[it],B[Q],B[K]);let at=[],nt,ft=j.concat();for(let it=0,tt=G;it<tt;it++){let Q=I[it];nt=[];for(let K=0,pt=Q.length,rt=pt-1,_t=K+1;K<pt;K++,rt++,_t++)rt===pt&&(rt=0),_t===pt&&(_t=0),nt[K]=k(Q[K],Q[rt],Q[_t]);at.push(nt),ft=ft.concat(nt)}let Ut;if(m===0)Ut=Hn.triangulateShape(B,I);else{let it=[],tt=[];for(let Q=0;Q<m;Q++){let K=Q/m,pt=f*Math.cos(K*Math.PI/2),rt=g*Math.sin(K*Math.PI/2)+_;for(let _t=0,Zt=B.length;_t<Zt;_t++){let Wt=W(B[_t],j[_t],rt);bt(Wt.x,Wt.y,-pt),K===0&&it.push(Wt)}for(let _t=0,Zt=G;_t<Zt;_t++){let Wt=I[_t];nt=at[_t];let T=[];for(let y=0,z=Wt.length;y<z;y++){let H=W(Wt[y],nt[y],rt);bt(H.x,H.y,-pt),K===0&&T.push(H)}K===0&&tt.push(T)}}Ut=Hn.triangulateShape(it,tt)}let Lt=Ut.length,Ct=g+_;for(let it=0;it<Z;it++){let tt=d?W(v[it],ft[it],Ct):v[it];x?(P.copy(A.normals[0]).multiplyScalar(tt.x),w.copy(A.binormals[0]).multiplyScalar(tt.y),C.copy(S[0]).add(P).add(w),bt(C.x,C.y,C.z)):bt(tt.x,tt.y,0)}for(let it=1;it<=h;it++)for(let tt=0;tt<Z;tt++){let Q=d?W(v[tt],ft[tt],Ct):v[tt];x?(P.copy(A.normals[it]).multiplyScalar(Q.x),w.copy(A.binormals[it]).multiplyScalar(Q.y),C.copy(S[it]).add(P).add(w),bt(C.x,C.y,C.z)):bt(Q.x,Q.y,u/h*it)}for(let it=m-1;it>=0;it--){let tt=it/m,Q=f*Math.cos(tt*Math.PI/2),K=g*Math.sin(tt*Math.PI/2)+_;for(let pt=0,rt=B.length;pt<rt;pt++){let _t=W(B[pt],j[pt],K);bt(_t.x,_t.y,u+Q)}for(let pt=0,rt=I.length;pt<rt;pt++){let _t=I[pt];nt=at[pt];for(let Zt=0,Wt=_t.length;Zt<Wt;Zt++){let T=W(_t[Zt],nt[Zt],K);x?bt(T.x,T.y+S[h-1].y,S[h-1].x+Q):bt(T.x,T.y,u+Q)}}}V(),$();function V(){let it=i.length/3;if(d){let tt=0,Q=Z*tt;for(let K=0;K<Lt;K++){let pt=Ut[K];Tt(pt[2]+Q,pt[1]+Q,pt[0]+Q)}tt=h+m*2,Q=Z*tt;for(let K=0;K<Lt;K++){let pt=Ut[K];Tt(pt[0]+Q,pt[1]+Q,pt[2]+Q)}}else{for(let tt=0;tt<Lt;tt++){let Q=Ut[tt];Tt(Q[2],Q[1],Q[0])}for(let tt=0;tt<Lt;tt++){let Q=Ut[tt];Tt(Q[0]+Z*h,Q[1]+Z*h,Q[2]+Z*h)}}n.addGroup(it,i.length/3-it,0)}function $(){let it=i.length/3,tt=0;vt(B,tt),tt+=B.length;for(let Q=0,K=I.length;Q<K;Q++){let pt=I[Q];vt(pt,tt),tt+=pt.length}n.addGroup(it,i.length/3-it,1)}function vt(it,tt){let Q=it.length;for(;--Q>=0;){let K=Q,pt=Q-1;pt<0&&(pt=it.length-1);for(let rt=0,_t=h+m*2;rt<_t;rt++){let Zt=Z*rt,Wt=Z*(rt+1),T=tt+K+Zt,y=tt+pt+Zt,z=tt+pt+Wt,H=tt+K+Wt;jt(T,y,z,H)}}}function bt(it,tt,Q){l.push(it),l.push(tt),l.push(Q)}function Tt(it,tt,Q){ce(it),ce(tt),ce(Q);let K=i.length/3,pt=b.generateTopUV(n,i,K-3,K-2,K-1);D(pt[0]),D(pt[1]),D(pt[2])}function jt(it,tt,Q,K){ce(it),ce(tt),ce(K),ce(tt),ce(Q),ce(K);let pt=i.length/3,rt=b.generateSideWallUV(n,i,pt-6,pt-3,pt-2,pt-1);D(rt[0]),D(rt[1]),D(rt[3]),D(rt[1]),D(rt[2]),D(rt[3])}function ce(it){i.push(l[it*3+0]),i.push(l[it*3+1]),i.push(l[it*3+2])}function D(it){r.push(it.x),r.push(it.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Fp(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new wc[i.type]().fromJSON(i)),new s(n,t.options)}},Lp={generateTopUV:function(s,t,e,n,i){let r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[i*3],h=t[i*3+1];return[new st(r,o),new st(a,l),new st(c,h)]},generateSideWallUV:function(s,t,e,n,i,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[i*3],f=t[i*3+1],g=t[i*3+2],_=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new st(o,1-l),new st(c,1-u),new st(d,1-g),new st(_,1-p)]:[new st(a,1-l),new st(h,1-u),new st(f,1-g),new st(m,1-p)]}};function Fp(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Me=class s extends ve{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=t/a,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){let b=p*d-o;for(let S=0;S<c;S++){let x=S*u-r;g.push(x,-b,0),_.push(0,0,1),m.push(S/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<a;b++){let S=b+c*p,x=b+c*(p+1),A=b+1+c*(p+1),w=b+1+c*p;f.push(S,x,w),f.push(x,A,w)}this.setIndex(f),this.setAttribute("position",new qt(g,3)),this.setAttribute("normal",new qt(_,3)),this.setAttribute("uv",new qt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}};var pi=class s extends ve{constructor(t=new Ln([new st(0,.5),new st(-.5,-.5),new st(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],i=[],r=[],o=[],a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new qt(i,3)),this.setAttribute("normal",new qt(r,3)),this.setAttribute("uv",new qt(o,2));function c(h){let u=i.length/3,d=h.extractPoints(e),f=d.shape,g=d.holes;Hn.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){let b=g[m];Hn.isClockWise(b)===!0&&(g[m]=b.reverse())}let _=Hn.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){let b=g[m];f=f.concat(b)}for(let m=0,p=f.length;m<p;m++){let b=f[m];i.push(b.x,b.y,0),r.push(0,0,1),o.push(b.x,b.y)}for(let m=0,p=_.length;m<p;m++){let b=_[m],S=b[0]+u,x=b[1]+u,A=b[2]+u;n.push(S,x,A),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return Up(e,t)}static fromJSON(t,e){let n=[];for(let i=0,r=t.shapes.length;i<r;i++){let o=e[t.shapes[i]];n.push(o)}return new s(n,t.curveSegments)}};function Up(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){let i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}var Ce=class s extends ve{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new R,d=new R,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){let b=[],S=p/n,x=0;p===0&&o===0?x=.5/e:p===n&&l===Math.PI&&(x=-.5/e);for(let A=0;A<=e;A++){let w=A/e;u.x=-t*Math.cos(i+w*r)*Math.sin(o+S*a),u.y=t*Math.cos(o+S*a),u.z=t*Math.sin(i+w*r)*Math.sin(o+S*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(w+x,1-S),b.push(c++)}h.push(b)}for(let p=0;p<n;p++)for(let b=0;b<e;b++){let S=h[p][b+1],x=h[p][b],A=h[p+1][b],w=h[p+1][b+1];(p!==0||o>0)&&f.push(S,x,w),(p!==n-1||l<Math.PI)&&f.push(x,A,w)}this.setIndex(f),this.setAttribute("position",new qt(g,3)),this.setAttribute("normal",new qt(_,3)),this.setAttribute("uv",new qt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Ve=class s extends ve{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],l=[],c=[],h=new R,u=new R,d=new R;for(let f=0;f<=n;f++)for(let g=0;g<=i;g++){let _=g/i*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/i),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=i;g++){let _=(i+1)*f+g-1,m=(i+1)*(f-1)+g-1,p=(i+1)*(f-1)+g,b=(i+1)*f+g;o.push(_,m,b),o.push(m,p,b)}this.setIndex(o),this.setAttribute("position",new qt(a,3)),this.setAttribute("normal",new qt(l,3)),this.setAttribute("uv",new qt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Yt=class extends Vn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ot(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ot(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qc,this.normalScale=new st(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Zr=class extends Yt{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new st(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ne(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ot(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ot(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ot(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var oa=class extends Vn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ju,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},aa=class extends Vn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function zo(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function Np(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}var ji=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=e[++n],t<i)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},la=class extends ji{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Mc,endingEnd:Mc}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case Sc:r=t,a=2*e-n;break;case bc:r=i.length-2,a=e+i[r]-i[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Sc:o=t,l=2*n-e;break;case bc:o=1,l=n+i[1]-i[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-e)/(i-e),_=g*g,m=_*g,p=-d*m+2*d*_-d*g,b=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,S=(-1-f)*m+(1.5+f)*_+.5*g,x=f*m-f*_;for(let A=0;A!==a;++A)r[A]=p*o[h+A]+b*o[c+A]+S*o[l+A]+x*o[u+A];return r}},ca=class extends ji{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(i-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},ha=class extends ji{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},gn=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=zo(e,this.TimeBufferType),this.values=zo(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:zo(t.times,Array),values:zo(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ha(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ca(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new la(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case br:e=this.InterpolantFactoryMethodDiscrete;break;case Wo:e=this.InterpolantFactoryMethodLinear;break;case Ho:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return br;case this.InterpolantFactoryMethodLinear:return Wo;case this.InterpolantFactoryMethodSmooth:return Ho}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(i!==void 0&&Np(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Ho,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(i)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){let _=e[u+g];if(_!==e[d+g]||_!==e[f+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}};gn.prototype.ValueTypeName="";gn.prototype.TimeBufferType=Float32Array;gn.prototype.ValueBufferType=Float32Array;gn.prototype.DefaultInterpolation=Wo;var Ci=class extends gn{constructor(t,e,n){super(t,e,n)}};Ci.prototype.ValueTypeName="bool";Ci.prototype.ValueBufferType=Array;Ci.prototype.DefaultInterpolation=br;Ci.prototype.InterpolantFactoryMethodLinear=void 0;Ci.prototype.InterpolantFactoryMethodSmooth=void 0;var ua=class extends gn{constructor(t,e,n,i){super(t,e,n,i)}};ua.prototype.ValueTypeName="color";var da=class extends gn{constructor(t,e,n,i){super(t,e,n,i)}};da.prototype.ValueTypeName="number";var fa=class extends ji{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(i-e),c=t*a;for(let h=c+a;c!==h;c+=4)Ie.slerpFlat(r,0,o,c-a,o,c,l);return r}},$r=class extends gn{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new fa(this.times,this.values,this.getValueSize(),t)}};$r.prototype.ValueTypeName="quaternion";$r.prototype.InterpolantFactoryMethodSmooth=void 0;var Pi=class extends gn{constructor(t,e,n){super(t,e,n)}};Pi.prototype.ValueTypeName="string";Pi.prototype.ValueBufferType=Array;Pi.prototype.DefaultInterpolation=br;Pi.prototype.InterpolantFactoryMethodLinear=void 0;Pi.prototype.InterpolantFactoryMethodSmooth=void 0;var pa=class extends gn{constructor(t,e,n,i){super(t,e,n,i)}};pa.prototype.ValueTypeName="vector";var ma=class{constructor(t,e,n){let i=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},xd=new ma,ga=class{constructor(t){this.manager=t!==void 0?t:xd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};ga.DEFAULT_MATERIAL_NAME="__DEFAULT";var ts=class extends be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ot(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},Jr=class extends ts{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ot(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},yc=new Gt,Mu=new R,Su=new R,_a=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new st(512,512),this.mapType=Fn,this.map=null,this.mapPass=null,this.matrix=new Gt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zs,this._frameExtents=new st(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Mu.setFromMatrixPosition(t.matrixWorld),e.position.copy(Mu),Su.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Su),e.updateMatrixWorld(),yc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yc,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(yc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var bu=new Gt,yr=new R,vc=new R,Pc=class extends _a{constructor(){super(new Ge(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new st(4,2),this._viewportCount=6,this._viewports=[new de(2,1,1,1),new de(0,1,1,1),new de(3,1,1,1),new de(1,1,1,1),new de(3,0,1,1),new de(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),yr.setFromMatrixPosition(t.matrixWorld),n.position.copy(yr),vc.copy(n.position),vc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(vc),n.updateMatrixWorld(),i.makeTranslation(-yr.x,-yr.y,-yr.z),bu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bu,n.coordinateSystem,n.reversedDepth)}},Ii=class extends ts{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Pc}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},Kr=class extends Dr{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ic=class extends _a{constructor(){super(new Kr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Di=class extends ts{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.shadow=new Ic}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},Qr=class extends ts{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var xa=class extends Ge{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var jc="\\[\\]\\.:\\/",Op=new RegExp("["+jc+"]","g"),th="[^"+jc+"]",Bp="[^"+jc.replace("\\.","")+"]",zp=/((?:WC+[\/:])*)/.source.replace("WC",th),Hp=/(WCOD+)?/.source.replace("WCOD",Bp),kp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",th),Gp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",th),Vp=new RegExp("^"+zp+Hp+kp+Gp+"$"),Wp=["material","materials","bones","map"],Dc=class{constructor(t,e,n){let i=n||Te.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Te=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Op,"")}static parseTrackName(t){let e=Vp.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);Wp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[i];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Te.Composite=Dc;Te.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Te.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Te.prototype.GetterByBindingType=[Te.prototype._getValue_direct,Te.prototype._getValue_array,Te.prototype._getValue_arrayElement,Te.prototype._getValue_toArray];Te.prototype.SetterByBindingTypeAndVersioning=[[Te.prototype._setValue_direct,Te.prototype._setValue_direct_setNeedsUpdate,Te.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_array,Te.prototype._setValue_array_setNeedsUpdate,Te.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_arrayElement,Te.prototype._setValue_arrayElement_setNeedsUpdate,Te.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_fromArray,Te.prototype._setValue_fromArray_setNeedsUpdate,Te.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var zx=new Float32Array(1);function eh(s,t,e,n){let i=Xp(n);switch(e){case Vc:return s*t;case Fa:return s*t/i.components*i.byteLength;case Ua:return s*t/i.components*i.byteLength;case Xc:return s*t*2/i.components*i.byteLength;case Na:return s*t*2/i.components*i.byteLength;case Wc:return s*t*3/i.components*i.byteLength;case bn:return s*t*4/i.components*i.byteLength;case Oa:return s*t*4/i.components*i.byteLength;case eo:case no:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case io:case so:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case za:case ka:return Math.max(s,16)*Math.max(t,8)/4;case Ba:case Ha:return Math.max(s,8)*Math.max(t,8)/2;case Ga:case Va:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Wa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Xa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case qa:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Ya:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Za:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case $a:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Ja:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Ka:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case Qa:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case ja:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case tl:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case el:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case nl:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case il:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case sl:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case rl:case ol:case al:return Math.ceil(s/4)*Math.ceil(t/4)*16;case ll:case cl:return Math.ceil(s/4)*Math.ceil(t/4)*8;case hl:case ul:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Xp(s){switch(s){case Fn:case zc:return{byteLength:1,components:1};case Ws:case Hc:case Xs:return{byteLength:2,components:1};case Da:case La:return{byteLength:2,components:4};case Li:case Ia:case Un:return{byteLength:4,components:1};case kc:case Gc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Gd(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function qp(s){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array!="undefined"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(s.bindBuffer(c,a),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){let g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){let _=u[f];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var Yp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,$p=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Jp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Qp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,tm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,em=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,nm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,im=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,om=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,am=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,lm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,cm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,hm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,um=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,fm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,pm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,mm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,gm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,_m=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,xm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,ym=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Mm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Sm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,bm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Em=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,wm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Am=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Rm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Cm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Pm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Im=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Dm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Lm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Fm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Um=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Nm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Om=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Bm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,zm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Hm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,km=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Gm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Wm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Xm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,qm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ym=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Zm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,$m=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Jm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Km=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,jm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,t0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,e0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,n0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,i0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,s0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,r0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,o0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,a0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,l0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,c0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,h0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,u0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,d0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,f0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,p0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,m0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,g0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,x0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,y0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,v0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,M0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,S0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,b0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,E0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,T0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,w0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,A0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,R0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,C0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,P0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,I0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,D0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,L0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,F0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,U0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,N0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,O0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,B0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,z0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,H0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,k0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,G0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,V0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,W0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,X0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,q0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Y0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Z0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,J0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,K0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Q0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,j0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,tg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,eg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ng=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ig=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,og=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ag=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ug=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,fg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,pg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,_g=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Mg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Eg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Tg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ee={alphahash_fragment:Yp,alphahash_pars_fragment:Zp,alphamap_fragment:$p,alphamap_pars_fragment:Jp,alphatest_fragment:Kp,alphatest_pars_fragment:Qp,aomap_fragment:jp,aomap_pars_fragment:tm,batching_pars_vertex:em,batching_vertex:nm,begin_vertex:im,beginnormal_vertex:sm,bsdfs:rm,iridescence_fragment:om,bumpmap_pars_fragment:am,clipping_planes_fragment:lm,clipping_planes_pars_fragment:cm,clipping_planes_pars_vertex:hm,clipping_planes_vertex:um,color_fragment:dm,color_pars_fragment:fm,color_pars_vertex:pm,color_vertex:mm,common:gm,cube_uv_reflection_fragment:_m,defaultnormal_vertex:xm,displacementmap_pars_vertex:ym,displacementmap_vertex:vm,emissivemap_fragment:Mm,emissivemap_pars_fragment:Sm,colorspace_fragment:bm,colorspace_pars_fragment:Em,envmap_fragment:Tm,envmap_common_pars_fragment:wm,envmap_pars_fragment:Am,envmap_pars_vertex:Rm,envmap_physical_pars_fragment:zm,envmap_vertex:Cm,fog_vertex:Pm,fog_pars_vertex:Im,fog_fragment:Dm,fog_pars_fragment:Lm,gradientmap_pars_fragment:Fm,lightmap_pars_fragment:Um,lights_lambert_fragment:Nm,lights_lambert_pars_fragment:Om,lights_pars_begin:Bm,lights_toon_fragment:Hm,lights_toon_pars_fragment:km,lights_phong_fragment:Gm,lights_phong_pars_fragment:Vm,lights_physical_fragment:Wm,lights_physical_pars_fragment:Xm,lights_fragment_begin:qm,lights_fragment_maps:Ym,lights_fragment_end:Zm,logdepthbuf_fragment:$m,logdepthbuf_pars_fragment:Jm,logdepthbuf_pars_vertex:Km,logdepthbuf_vertex:Qm,map_fragment:jm,map_pars_fragment:t0,map_particle_fragment:e0,map_particle_pars_fragment:n0,metalnessmap_fragment:i0,metalnessmap_pars_fragment:s0,morphinstance_vertex:r0,morphcolor_vertex:o0,morphnormal_vertex:a0,morphtarget_pars_vertex:l0,morphtarget_vertex:c0,normal_fragment_begin:h0,normal_fragment_maps:u0,normal_pars_fragment:d0,normal_pars_vertex:f0,normal_vertex:p0,normalmap_pars_fragment:m0,clearcoat_normal_fragment_begin:g0,clearcoat_normal_fragment_maps:_0,clearcoat_pars_fragment:x0,iridescence_pars_fragment:y0,opaque_fragment:v0,packing:M0,premultiplied_alpha_fragment:S0,project_vertex:b0,dithering_fragment:E0,dithering_pars_fragment:T0,roughnessmap_fragment:w0,roughnessmap_pars_fragment:A0,shadowmap_pars_fragment:R0,shadowmap_pars_vertex:C0,shadowmap_vertex:P0,shadowmask_pars_fragment:I0,skinbase_vertex:D0,skinning_pars_vertex:L0,skinning_vertex:F0,skinnormal_vertex:U0,specularmap_fragment:N0,specularmap_pars_fragment:O0,tonemapping_fragment:B0,tonemapping_pars_fragment:z0,transmission_fragment:H0,transmission_pars_fragment:k0,uv_pars_fragment:G0,uv_pars_vertex:V0,uv_vertex:W0,worldpos_vertex:X0,background_vert:q0,background_frag:Y0,backgroundCube_vert:Z0,backgroundCube_frag:$0,cube_vert:J0,cube_frag:K0,depth_vert:Q0,depth_frag:j0,distanceRGBA_vert:tg,distanceRGBA_frag:eg,equirect_vert:ng,equirect_frag:ig,linedashed_vert:sg,linedashed_frag:rg,meshbasic_vert:og,meshbasic_frag:ag,meshlambert_vert:lg,meshlambert_frag:cg,meshmatcap_vert:hg,meshmatcap_frag:ug,meshnormal_vert:dg,meshnormal_frag:fg,meshphong_vert:pg,meshphong_frag:mg,meshphysical_vert:gg,meshphysical_frag:_g,meshtoon_vert:xg,meshtoon_frag:yg,points_vert:vg,points_frag:Mg,shadow_vert:Sg,shadow_frag:bg,sprite_vert:Eg,sprite_frag:Tg},St={common:{diffuse:{value:new Ot(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new st(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ot(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ot(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new Ot(16777215)},opacity:{value:1},center:{value:new st(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},qn={basic:{uniforms:$e([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:ee.meshbasic_vert,fragmentShader:ee.meshbasic_frag},lambert:{uniforms:$e([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Ot(0)}}]),vertexShader:ee.meshlambert_vert,fragmentShader:ee.meshlambert_frag},phong:{uniforms:$e([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Ot(0)},specular:{value:new Ot(1118481)},shininess:{value:30}}]),vertexShader:ee.meshphong_vert,fragmentShader:ee.meshphong_frag},standard:{uniforms:$e([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new Ot(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag},toon:{uniforms:$e([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new Ot(0)}}]),vertexShader:ee.meshtoon_vert,fragmentShader:ee.meshtoon_frag},matcap:{uniforms:$e([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:ee.meshmatcap_vert,fragmentShader:ee.meshmatcap_frag},points:{uniforms:$e([St.points,St.fog]),vertexShader:ee.points_vert,fragmentShader:ee.points_frag},dashed:{uniforms:$e([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ee.linedashed_vert,fragmentShader:ee.linedashed_frag},depth:{uniforms:$e([St.common,St.displacementmap]),vertexShader:ee.depth_vert,fragmentShader:ee.depth_frag},normal:{uniforms:$e([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:ee.meshnormal_vert,fragmentShader:ee.meshnormal_frag},sprite:{uniforms:$e([St.sprite,St.fog]),vertexShader:ee.sprite_vert,fragmentShader:ee.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ee.background_vert,fragmentShader:ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:ee.backgroundCube_vert,fragmentShader:ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ee.cube_vert,fragmentShader:ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ee.equirect_vert,fragmentShader:ee.equirect_frag},distanceRGBA:{uniforms:$e([St.common,St.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ee.distanceRGBA_vert,fragmentShader:ee.distanceRGBA_frag},shadow:{uniforms:$e([St.lights,St.fog,{color:{value:new Ot(0)},opacity:{value:1}}]),vertexShader:ee.shadow_vert,fragmentShader:ee.shadow_frag}};qn.physical={uniforms:$e([qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new st(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new Ot(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new st},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new Ot(0)},specularColor:{value:new Ot(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new st},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag};var dl={r:0,b:0,g:0},ss=new fn,wg=new Gt;function Ag(s,t,e,n,i,r,o){let a=new Ot(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(S){let x=S.isScene===!0?S.background:null;return x&&x.isTexture&&(x=(S.backgroundBlurriness>0?e:t).get(x)),x}function _(S){let x=!1,A=g(S);A===null?p(a,l):A&&A.isColor&&(p(A,1),x=!0);let w=s.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(S,x){let A=g(x);A&&(A.isCubeTexture||A.mapping===jr)?(h===void 0&&(h=new At(new Qt(1,1,1),new pn({name:"BackgroundCubeMaterial",uniforms:is(qn.backgroundCube.uniforms),vertexShader:qn.backgroundCube.vertexShader,fragmentShader:qn.backgroundCube.fragmentShader,side:We,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,P,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),ss.copy(x.backgroundRotation),ss.x*=-1,ss.y*=-1,ss.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(ss.y*=-1,ss.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(wg.makeRotationFromEuler(ss)),h.material.toneMapped=ae.getTransfer(A.colorSpace)!==pe,(u!==A||d!==A.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=A,d=A.version,f=s.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new At(new Me(2,2),new pn({name:"BackgroundMaterial",uniforms:is(qn.background.uniforms),vertexShader:qn.background.vertexShader,fragmentShader:qn.background.fragmentShader,side:ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=ae.getTransfer(A.colorSpace)!==pe,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(u!==A||d!==A.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,u=A,d=A.version,f=s.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function p(S,x){S.getRGB(dl,Kc(s)),n.buffers.color.setClear(dl.r,dl.g,dl.b,x,o)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,x=1){a.set(S),l=x,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,p(a,l)},render:_,addToRenderList:m,dispose:b}}function Rg(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null),r=i,o=!1;function a(v,I,L,U,G){let B=!1,W=u(U,L,I);r!==W&&(r=W,c(r.object)),B=f(v,U,L,G),B&&g(v,U,L,G),G!==null&&t.update(G,s.ELEMENT_ARRAY_BUFFER),(B||o)&&(o=!1,x(v,I,L,U),G!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function l(){return s.createVertexArray()}function c(v){return s.bindVertexArray(v)}function h(v){return s.deleteVertexArray(v)}function u(v,I,L){let U=L.wireframe===!0,G=n[v.id];G===void 0&&(G={},n[v.id]=G);let B=G[I.id];B===void 0&&(B={},G[I.id]=B);let W=B[U];return W===void 0&&(W=d(l()),B[U]=W),W}function d(v){let I=[],L=[],U=[];for(let G=0;G<e;G++)I[G]=0,L[G]=0,U[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:L,attributeDivisors:U,object:v,attributes:{},index:null}}function f(v,I,L,U){let G=r.attributes,B=I.attributes,W=0,Z=L.getAttributes();for(let k in Z)if(Z[k].location>=0){let at=G[k],nt=B[k];if(nt===void 0&&(k==="instanceMatrix"&&v.instanceMatrix&&(nt=v.instanceMatrix),k==="instanceColor"&&v.instanceColor&&(nt=v.instanceColor)),at===void 0||at.attribute!==nt||nt&&at.data!==nt.data)return!0;W++}return r.attributesNum!==W||r.index!==U}function g(v,I,L,U){let G={},B=I.attributes,W=0,Z=L.getAttributes();for(let k in Z)if(Z[k].location>=0){let at=B[k];at===void 0&&(k==="instanceMatrix"&&v.instanceMatrix&&(at=v.instanceMatrix),k==="instanceColor"&&v.instanceColor&&(at=v.instanceColor));let nt={};nt.attribute=at,at&&at.data&&(nt.data=at.data),G[k]=nt,W++}r.attributes=G,r.attributesNum=W,r.index=U}function _(){let v=r.newAttributes;for(let I=0,L=v.length;I<L;I++)v[I]=0}function m(v){p(v,0)}function p(v,I){let L=r.newAttributes,U=r.enabledAttributes,G=r.attributeDivisors;L[v]=1,U[v]===0&&(s.enableVertexAttribArray(v),U[v]=1),G[v]!==I&&(s.vertexAttribDivisor(v,I),G[v]=I)}function b(){let v=r.newAttributes,I=r.enabledAttributes;for(let L=0,U=I.length;L<U;L++)I[L]!==v[L]&&(s.disableVertexAttribArray(L),I[L]=0)}function S(v,I,L,U,G,B,W){W===!0?s.vertexAttribIPointer(v,I,L,G,B):s.vertexAttribPointer(v,I,L,U,G,B)}function x(v,I,L,U){_();let G=U.attributes,B=L.getAttributes(),W=I.defaultAttributeValues;for(let Z in B){let k=B[Z];if(k.location>=0){let j=G[Z];if(j===void 0&&(Z==="instanceMatrix"&&v.instanceMatrix&&(j=v.instanceMatrix),Z==="instanceColor"&&v.instanceColor&&(j=v.instanceColor)),j!==void 0){let at=j.normalized,nt=j.itemSize,ft=t.get(j);if(ft===void 0)continue;let Ut=ft.buffer,Lt=ft.type,Ct=ft.bytesPerElement,V=Lt===s.INT||Lt===s.UNSIGNED_INT||j.gpuType===Ia;if(j.isInterleavedBufferAttribute){let $=j.data,vt=$.stride,bt=j.offset;if($.isInstancedInterleavedBuffer){for(let Tt=0;Tt<k.locationSize;Tt++)p(k.location+Tt,$.meshPerAttribute);v.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let Tt=0;Tt<k.locationSize;Tt++)m(k.location+Tt);s.bindBuffer(s.ARRAY_BUFFER,Ut);for(let Tt=0;Tt<k.locationSize;Tt++)S(k.location+Tt,nt/k.locationSize,Lt,at,vt*Ct,(bt+nt/k.locationSize*Tt)*Ct,V)}else{if(j.isInstancedBufferAttribute){for(let $=0;$<k.locationSize;$++)p(k.location+$,j.meshPerAttribute);v.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let $=0;$<k.locationSize;$++)m(k.location+$);s.bindBuffer(s.ARRAY_BUFFER,Ut);for(let $=0;$<k.locationSize;$++)S(k.location+$,nt/k.locationSize,Lt,at,nt*Ct,nt/k.locationSize*$*Ct,V)}}else if(W!==void 0){let at=W[Z];if(at!==void 0)switch(at.length){case 2:s.vertexAttrib2fv(k.location,at);break;case 3:s.vertexAttrib3fv(k.location,at);break;case 4:s.vertexAttrib4fv(k.location,at);break;default:s.vertexAttrib1fv(k.location,at)}}}}b()}function A(){C();for(let v in n){let I=n[v];for(let L in I){let U=I[L];for(let G in U)h(U[G].object),delete U[G];delete I[L]}delete n[v]}}function w(v){if(n[v.id]===void 0)return;let I=n[v.id];for(let L in I){let U=I[L];for(let G in U)h(U[G].object),delete U[G];delete I[L]}delete n[v.id]}function P(v){for(let I in n){let L=n[I];if(L[v.id]===void 0)continue;let U=L[v.id];for(let G in U)h(U[G].object),delete U[G];delete L[v.id]}}function C(){M(),o=!0,r!==i&&(r=i,c(r.object))}function M(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:C,resetDefaultState:M,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:m,disableUnusedAttributes:b}}function Cg(s,t,e){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function l(c,h,u,d){if(u===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Pg(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let P=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(P){return!(P!==bn&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(P){let C=P===Xs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==Fn&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Un&&!C)}function l(P){if(P==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),b=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),S=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,w=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:S,maxFragmentUniforms:x,vertexTextures:A,maxSamples:w}}function Ig(s){let t=this,e=null,n=0,i=!1,r=!1,o=new Bn,a=new Kt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{let b=r?0:n,S=b*4,x=p.clippingState||null;l.value=x,x=h(g,d,S,f);for(let A=0;A!==S;++A)x[A]=e[A];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let p=f+_*4,b=d.matrixWorldInverse;a.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,x=f;S!==_;++S,x+=4)o.copy(u[S]).applyMatrix4(b,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Dg(s){let t=new WeakMap;function e(o,a){return a===Ra?o.mapping=es:a===Ca&&(o.mapping=ns),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Ra||a===Ca)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Ko(l.height);return c.fromEquirectangularTexture(s,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var $s=4,yd=[.125,.215,.35,.446,.526,.582],as=20,nh=new Kr,vd=new Ot,ih=null,sh=0,rh=0,oh=!1,os=(1+Math.sqrt(5))/2,Zs=1/os,Md=[new R(-os,Zs,0),new R(os,Zs,0),new R(-Zs,0,os),new R(Zs,0,os),new R(0,os,-Zs),new R(0,os,Zs),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],Lg=new R,Ks=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100,r={}){let{size:o=256,position:a=Lg}=r;ih=this._renderer.getRenderTarget(),sh=this._renderer.getActiveCubeFace(),rh=this._renderer.getActiveMipmapLevel(),oh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ed(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ih,sh,rh),this._renderer.xr.enabled=oh,t.scissorTest=!1,fl(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===es||t.mapping===ns?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ih=this._renderer.getRenderTarget(),sh=this._renderer.getActiveCubeFace(),rh=this._renderer.getActiveMipmapLevel(),oh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:dn,minFilter:dn,generateMipmaps:!1,type:Xs,format:bn,colorSpace:qi,depthBuffer:!1},i=Sd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Sd(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Fg(r)),this._blurMaterial=Ug(r,t,e)}return i}_compileMaterial(t){let e=new At(this._lodPlanes[0],t);this._renderer.compile(e,nh)}_sceneToCubeUV(t,e,n,i,r){let l=new Ge(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(vd),u.toneMapping=gi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null));let _=new He({name:"PMREM.Background",side:We,depthWrite:!1,depthTest:!1}),m=new At(new Qt,_),p=!1,b=t.background;b?b.isColor&&(_.color.copy(b),t.background=null,p=!0):(_.color.copy(vd),p=!0);for(let S=0;S<6;S++){let x=S%3;x===0?(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[S],r.y,r.z)):x===1?(l.up.set(0,0,c[S]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[S],r.z)):(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[S]));let A=this._cubeSize;fl(i,x*A,S>2?A:0,A,A),u.setRenderTarget(i),p&&u.render(m,l),u.render(t,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=b}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===es||t.mapping===ns;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ed()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bd());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new At(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;fl(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,nh)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodPlanes.length;for(let r=1;r<i;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Md[(i-r-1)%Md.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new At(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*as-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):as;m>as&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${as}`);let p=[],b=0;for(let P=0;P<as;++P){let C=P/_,M=Math.exp(-C*C/2);p.push(M),P===0?b+=M:P<m&&(b+=2*M)}for(let P=0;P<p.length;P++)p[P]=p[P]/b;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:S}=this;d.dTheta.value=g,d.mipInt.value=S-n;let x=this._sizeLods[i],A=3*x*(i>S-$s?i-S+$s:0),w=4*(this._cubeSize-x);fl(e,A,w,3*x,2*x),l.setRenderTarget(e),l.render(u,nh)}};function Fg(s){let t=[],e=[],n=[],i=s,r=s-$s+1+yd.length;for(let o=0;o<r;o++){let a=Math.pow(2,i);e.push(a);let l=1/a;o>s-$s?l=yd[o-s+$s-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,b=new Float32Array(_*g*f),S=new Float32Array(m*g*f),x=new Float32Array(p*g*f);for(let w=0;w<f;w++){let P=w%3*2/3-1,C=w>2?0:-1,M=[P,C,0,P+2/3,C,0,P+2/3,C+1,0,P,C,0,P+2/3,C+1,0,P,C+1,0];b.set(M,_*g*w),S.set(d,m*g*w);let v=[w,w,w,w,w,w];x.set(v,p*g*w)}let A=new ve;A.setAttribute("position",new Ne(b,_)),A.setAttribute("uv",new Ne(S,m)),A.setAttribute("faceIndex",new Ne(x,p)),t.push(A),i>$s&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Sd(s,t,e){let n=new kn(s,t,e);return n.texture.mapping=jr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function fl(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Ug(s,t,e){let n=new Float32Array(as),i=new R(0,1,0);return new pn({name:"SphericalGaussianBlur",defines:{n:as,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:_h(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function bd(){return new pn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_h(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function Ed(){return new pn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_h(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:mi,depthTest:!1,depthWrite:!1})}function _h(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ng(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Ra||l===Ca,h=l===es||l===ns;if(c||h){let u=t.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Ks(s)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return c&&f&&f.height>0||h&&f&&i(f)?(e===null&&(e=new Ks(s)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Og(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Ns("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Bg(s,t,e,n){let i={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete i[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)t.update(d[f],s.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,g=u.attributes.position,_=0;if(f!==null){let b=f.array;_=f.version;for(let S=0,x=b.length;S<x;S+=3){let A=b[S+0],w=b[S+1],P=b[S+2];d.push(A,w,w,P,P,A)}}else if(g!==void 0){let b=g.array;_=g.version;for(let S=0,x=b.length/3-1;S<x;S+=3){let A=S+0,w=S+1,P=S+2;d.push(A,w,w,P,P,A)}}else return;let m=new(Jc(d)?Ir:Pr)(d,1);m.version=_;let p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function zg(s,t,e){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){s.drawElements(n,f,r,d*o),e.update(f,n,1)}function c(d,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,d*o,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,_){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let p=0;for(let b=0;b<g;b++)p+=f[b]*_[b];e.update(p,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Hg(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function kg(s,t,e){let n=new WeakMap,i=new de;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let M=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],b=a.morphAttributes.color||[],S=0;f===!0&&(S=1),g===!0&&(S=2),_===!0&&(S=3);let x=a.attributes.position.count*S,A=1;x>t.maxTextureSize&&(A=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);let w=new Float32Array(x*A*4*u),P=new Ar(w,x,A,u);P.type=Un,P.needsUpdate=!0;let C=S*4;for(let v=0;v<u;v++){let I=m[v],L=p[v],U=b[v],G=x*A*4*v;for(let B=0;B<I.count;B++){let W=B*C;f===!0&&(i.fromBufferAttribute(I,B),w[G+W+0]=i.x,w[G+W+1]=i.y,w[G+W+2]=i.z,w[G+W+3]=0),g===!0&&(i.fromBufferAttribute(L,B),w[G+W+4]=i.x,w[G+W+5]=i.y,w[G+W+6]=i.z,w[G+W+7]=0),_===!0&&(i.fromBufferAttribute(U,B),w[G+W+8]=i.x,w[G+W+9]=i.y,w[G+W+10]=i.z,w[G+W+11]=U.itemSize===4?i.w:1)}}d={count:u,texture:P,size:new st(x,A)},n.set(a,d),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Gg(s,t,e,n){let i=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=t.get(l,h);if(i.get(u)!==c&&(t.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function o(){i=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var Vd=new je,Td=new Br(1,1),Wd=new Ar,Xd=new $o,qd=new Lr,wd=[],Ad=[],Rd=new Float32Array(16),Cd=new Float32Array(9),Pd=new Float32Array(4);function Qs(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=wd[i];if(r===void 0&&(r=new Float32Array(i),wd[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Oe(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Be(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function gl(s,t){let e=Ad[t];e===void 0&&(e=new Int32Array(t),Ad[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Vg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Wg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;s.uniform2fv(this.addr,t),Be(e,t)}}function Xg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Oe(e,t))return;s.uniform3fv(this.addr,t),Be(e,t)}}function qg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;s.uniform4fv(this.addr,t),Be(e,t)}}function Yg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Oe(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Be(e,t)}else{if(Oe(e,n))return;Pd.set(n),s.uniformMatrix2fv(this.addr,!1,Pd),Be(e,n)}}function Zg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Oe(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Be(e,t)}else{if(Oe(e,n))return;Cd.set(n),s.uniformMatrix3fv(this.addr,!1,Cd),Be(e,n)}}function $g(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Oe(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Be(e,t)}else{if(Oe(e,n))return;Rd.set(n),s.uniformMatrix4fv(this.addr,!1,Rd),Be(e,n)}}function Jg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Kg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;s.uniform2iv(this.addr,t),Be(e,t)}}function Qg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Oe(e,t))return;s.uniform3iv(this.addr,t),Be(e,t)}}function jg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;s.uniform4iv(this.addr,t),Be(e,t)}}function t_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function e_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;s.uniform2uiv(this.addr,t),Be(e,t)}}function n_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Oe(e,t))return;s.uniform3uiv(this.addr,t),Be(e,t)}}function i_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;s.uniform4uiv(this.addr,t),Be(e,t)}}function s_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Td.compareFunction=Yc,r=Td):r=Vd,e.setTexture2D(t||r,i)}function r_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Xd,i)}function o_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||qd,i)}function a_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Wd,i)}function l_(s){switch(s){case 5126:return Vg;case 35664:return Wg;case 35665:return Xg;case 35666:return qg;case 35674:return Yg;case 35675:return Zg;case 35676:return $g;case 5124:case 35670:return Jg;case 35667:case 35671:return Kg;case 35668:case 35672:return Qg;case 35669:case 35673:return jg;case 5125:return t_;case 36294:return e_;case 36295:return n_;case 36296:return i_;case 35678:case 36198:case 36298:case 36306:case 35682:return s_;case 35679:case 36299:case 36307:return r_;case 35680:case 36300:case 36308:case 36293:return o_;case 36289:case 36303:case 36311:case 36292:return a_}}function c_(s,t){s.uniform1fv(this.addr,t)}function h_(s,t){let e=Qs(t,this.size,2);s.uniform2fv(this.addr,e)}function u_(s,t){let e=Qs(t,this.size,3);s.uniform3fv(this.addr,e)}function d_(s,t){let e=Qs(t,this.size,4);s.uniform4fv(this.addr,e)}function f_(s,t){let e=Qs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function p_(s,t){let e=Qs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function m_(s,t){let e=Qs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function g_(s,t){s.uniform1iv(this.addr,t)}function __(s,t){s.uniform2iv(this.addr,t)}function x_(s,t){s.uniform3iv(this.addr,t)}function y_(s,t){s.uniform4iv(this.addr,t)}function v_(s,t){s.uniform1uiv(this.addr,t)}function M_(s,t){s.uniform2uiv(this.addr,t)}function S_(s,t){s.uniform3uiv(this.addr,t)}function b_(s,t){s.uniform4uiv(this.addr,t)}function E_(s,t,e){let n=this.cache,i=t.length,r=gl(e,i);Oe(n,r)||(s.uniform1iv(this.addr,r),Be(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||Vd,r[o])}function T_(s,t,e){let n=this.cache,i=t.length,r=gl(e,i);Oe(n,r)||(s.uniform1iv(this.addr,r),Be(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Xd,r[o])}function w_(s,t,e){let n=this.cache,i=t.length,r=gl(e,i);Oe(n,r)||(s.uniform1iv(this.addr,r),Be(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||qd,r[o])}function A_(s,t,e){let n=this.cache,i=t.length,r=gl(e,i);Oe(n,r)||(s.uniform1iv(this.addr,r),Be(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Wd,r[o])}function R_(s){switch(s){case 5126:return c_;case 35664:return h_;case 35665:return u_;case 35666:return d_;case 35674:return f_;case 35675:return p_;case 35676:return m_;case 5124:case 35670:return g_;case 35667:case 35671:return __;case 35668:case 35672:return x_;case 35669:case 35673:return y_;case 5125:return v_;case 36294:return M_;case 36295:return S_;case 36296:return b_;case 35678:case 36198:case 36298:case 36306:case 35682:return E_;case 35679:case 36299:case 36307:return T_;case 35680:case 36300:case 36308:case 36293:return w_;case 36289:case 36303:case 36311:case 36292:return A_}}var lh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=l_(e.type)}},ch=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=R_(e.type)}},hh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(t,e[a.id],n)}}},ah=/(\w+)(\])?(\[|\.)?/g;function Id(s,t){s.seq.push(t),s.map[t.id]=t}function C_(s,t,e){let n=s.name,i=n.length;for(ah.lastIndex=0;;){let r=ah.exec(n),o=ah.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Id(e,c===void 0?new lh(a,s,t):new ch(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new hh(a),Id(e,u)),e=u}}}var Js=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);C_(r,o,this)}}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function Dd(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var P_=37297,I_=0;function D_(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var Ld=new Kt;function L_(s){ae._getMatrix(Ld,ae.workingColorSpace,s);let t=`mat3( ${Ld.elements.map(e=>e.toFixed(4))} )`;switch(ae.getTransfer(s)){case Er:return[t,"LinearTransferOETF"];case pe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Fd(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+D_(s.getShaderSource(t),a)}else return r}function F_(s,t){let e=L_(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function U_(s,t){let e;switch(t){case qu:e="Linear";break;case Yu:e="Reinhard";break;case Zu:e="Cineon";break;case Aa:e="ACESFilmic";break;case Ju:e="AgX";break;case Ku:e="Neutral";break;case $u:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var pl=new R;function N_(){ae.getLuminanceCoefficients(pl);let s=pl.x.toFixed(4),t=pl.y.toFixed(4),e=pl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function O_(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ro).join(`
`)}function B_(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function z_(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function ro(s){return s!==""}function Ud(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Nd(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var H_=/^[ \t]*#include +<([\w\d./]+)>/gm;function uh(s){return s.replace(H_,G_)}var k_=new Map;function G_(s,t){let e=ee[t];if(e===void 0){let n=k_.get(t);if(n!==void 0)e=ee[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return uh(e)}var V_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Od(s){return s.replace(V_,W_)}function W_(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Bd(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function X_(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Fc?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===ya?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Wn&&(t="SHADOWMAP_TYPE_VSM"),t}function q_(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case es:case ns:t="ENVMAP_TYPE_CUBE";break;case jr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Y_(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case ns:t="ENVMAP_MODE_REFRACTION";break}return t}function Z_(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Oc:t="ENVMAP_BLENDING_MULTIPLY";break;case Wu:t="ENVMAP_BLENDING_MIX";break;case Xu:t="ENVMAP_BLENDING_ADD";break}return t}function $_(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function J_(s,t,e,n){let i=s.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=X_(e),c=q_(e),h=Y_(e),u=Z_(e),d=$_(e),f=O_(e),g=B_(r),_=i.createProgram(),m,p,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ro).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ro).join(`
`),p.length>0&&(p+=`
`)):(m=[Bd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ro).join(`
`),p=[Bd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==gi?"#define TONE_MAPPING":"",e.toneMapping!==gi?ee.tonemapping_pars_fragment:"",e.toneMapping!==gi?U_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ee.colorspace_pars_fragment,F_("linearToOutputTexel",e.outputColorSpace),N_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ro).join(`
`)),o=uh(o),o=Ud(o,e),o=Nd(o,e),a=uh(a),a=Ud(a,e),a=Nd(a,e),o=Od(o),a=Od(a),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===$c?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===$c?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let S=b+m+o,x=b+p+a,A=Dd(i,i.VERTEX_SHADER,S),w=Dd(i,i.FRAGMENT_SHADER,x);i.attachShader(_,A),i.attachShader(_,w),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function P(I){if(s.debug.checkShaderErrors){let L=i.getProgramInfoLog(_)||"",U=i.getShaderInfoLog(A)||"",G=i.getShaderInfoLog(w)||"",B=L.trim(),W=U.trim(),Z=G.trim(),k=!0,j=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(k=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,A,w);else{let at=Fd(i,A,"vertex"),nt=Fd(i,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+B+`
`+at+`
`+nt)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(W===""||Z==="")&&(j=!1);j&&(I.diagnostics={runnable:k,programLog:B,vertexShader:{log:W,prefix:m},fragmentShader:{log:Z,prefix:p}})}i.deleteShader(A),i.deleteShader(w),C=new Js(i,_),M=z_(i,_)}let C;this.getUniforms=function(){return C===void 0&&P(this),C};let M;this.getAttributes=function(){return M===void 0&&P(this),M};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=i.getProgramParameter(_,P_)),v},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=I_++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=w,this}var K_=0,dh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new fh(t),e.set(t,n)),n}},fh=class{constructor(t){this.id=K_++,this.code=t,this.usedTimes=0}};function Q_(s,t,e,n,i,r,o){let a=new Cr,l=new dh,c=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures,f=i.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,v,I,L,U){let G=L.fog,B=U.geometry,W=M.isMeshStandardMaterial?L.environment:null,Z=(M.isMeshStandardMaterial?e:t).get(M.envMap||W),k=Z&&Z.mapping===jr?Z.image.height:null,j=g[M.type];M.precision!==null&&(f=i.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));let at=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,nt=at!==void 0?at.length:0,ft=0;B.morphAttributes.position!==void 0&&(ft=1),B.morphAttributes.normal!==void 0&&(ft=2),B.morphAttributes.color!==void 0&&(ft=3);let Ut,Lt,Ct,V;if(j){let ue=qn[j];Ut=ue.vertexShader,Lt=ue.fragmentShader}else Ut=M.vertexShader,Lt=M.fragmentShader,l.update(M),Ct=l.getVertexShaderID(M),V=l.getFragmentShaderID(M);let $=s.getRenderTarget(),vt=s.state.buffers.depth.getReversed(),bt=U.isInstancedMesh===!0,Tt=U.isBatchedMesh===!0,jt=!!M.map,ce=!!M.matcap,D=!!Z,it=!!M.aoMap,tt=!!M.lightMap,Q=!!M.bumpMap,K=!!M.normalMap,pt=!!M.displacementMap,rt=!!M.emissiveMap,_t=!!M.metalnessMap,Zt=!!M.roughnessMap,Wt=M.anisotropy>0,T=M.clearcoat>0,y=M.dispersion>0,z=M.iridescence>0,H=M.sheen>0,J=M.transmission>0,X=Wt&&!!M.anisotropyMap,ht=T&&!!M.clearcoatMap,ut=T&&!!M.clearcoatNormalMap,wt=T&&!!M.clearcoatRoughnessMap,Pt=z&&!!M.iridescenceMap,ot=z&&!!M.iridescenceThicknessMap,Mt=H&&!!M.sheenColorMap,zt=H&&!!M.sheenRoughnessMap,It=!!M.specularMap,xt=!!M.specularColorMap,$t=!!M.specularIntensityMap,F=J&&!!M.transmissionMap,ct=J&&!!M.thicknessMap,mt=!!M.gradientMap,Rt=!!M.alphaMap,lt=M.alphaTest>0,et=!!M.alphaHash,Ft=!!M.extensions,Jt=gi;M.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Jt=s.toneMapping);let he={shaderID:j,shaderType:M.type,shaderName:M.name,vertexShader:Ut,fragmentShader:Lt,defines:M.defines,customVertexShaderID:Ct,customFragmentShaderID:V,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:Tt,batchingColor:Tt&&U._colorsTexture!==null,instancing:bt,instancingColor:bt&&U.instanceColor!==null,instancingMorph:bt&&U.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:$===null?s.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:qi,alphaToCoverage:!!M.alphaToCoverage,map:jt,matcap:ce,envMap:D,envMapMode:D&&Z.mapping,envMapCubeUVHeight:k,aoMap:it,lightMap:tt,bumpMap:Q,normalMap:K,displacementMap:d&&pt,emissiveMap:rt,normalMapObjectSpace:K&&M.normalMapType===ed,normalMapTangentSpace:K&&M.normalMapType===qc,metalnessMap:_t,roughnessMap:Zt,anisotropy:Wt,anisotropyMap:X,clearcoat:T,clearcoatMap:ht,clearcoatNormalMap:ut,clearcoatRoughnessMap:wt,dispersion:y,iridescence:z,iridescenceMap:Pt,iridescenceThicknessMap:ot,sheen:H,sheenColorMap:Mt,sheenRoughnessMap:zt,specularMap:It,specularColorMap:xt,specularIntensityMap:$t,transmission:J,transmissionMap:F,thicknessMap:ct,gradientMap:mt,opaque:M.transparent===!1&&M.blending===hi&&M.alphaToCoverage===!1,alphaMap:Rt,alphaTest:lt,alphaHash:et,combine:M.combine,mapUv:jt&&_(M.map.channel),aoMapUv:it&&_(M.aoMap.channel),lightMapUv:tt&&_(M.lightMap.channel),bumpMapUv:Q&&_(M.bumpMap.channel),normalMapUv:K&&_(M.normalMap.channel),displacementMapUv:pt&&_(M.displacementMap.channel),emissiveMapUv:rt&&_(M.emissiveMap.channel),metalnessMapUv:_t&&_(M.metalnessMap.channel),roughnessMapUv:Zt&&_(M.roughnessMap.channel),anisotropyMapUv:X&&_(M.anisotropyMap.channel),clearcoatMapUv:ht&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:ut&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:wt&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Pt&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:ot&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:Mt&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:zt&&_(M.sheenRoughnessMap.channel),specularMapUv:It&&_(M.specularMap.channel),specularColorMapUv:xt&&_(M.specularColorMap.channel),specularIntensityMapUv:$t&&_(M.specularIntensityMap.channel),transmissionMapUv:F&&_(M.transmissionMap.channel),thicknessMapUv:ct&&_(M.thicknessMap.channel),alphaMapUv:Rt&&_(M.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(K||Wt),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!B.attributes.uv&&(jt||Rt),fog:!!G,useFog:M.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:vt,skinning:U.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:ft,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:Jt,decodeVideoTexture:jt&&M.map.isVideoTexture===!0&&ae.getTransfer(M.map.colorSpace)===pe,decodeVideoTextureEmissive:rt&&M.emissiveMap.isVideoTexture===!0&&ae.getTransfer(M.emissiveMap.colorSpace)===pe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Fe,flipSided:M.side===We,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Ft&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ft&&M.extensions.multiDraw===!0||Tt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return he.vertexUv1s=c.has(1),he.vertexUv2s=c.has(2),he.vertexUv3s=c.has(3),c.clear(),he}function p(M){let v=[];if(M.shaderID?v.push(M.shaderID):(v.push(M.customVertexShaderID),v.push(M.customFragmentShaderID)),M.defines!==void 0)for(let I in M.defines)v.push(I),v.push(M.defines[I]);return M.isRawShaderMaterial===!1&&(b(v,M),S(v,M),v.push(s.outputColorSpace)),v.push(M.customProgramCacheKey),v.join()}function b(M,v){M.push(v.precision),M.push(v.outputColorSpace),M.push(v.envMapMode),M.push(v.envMapCubeUVHeight),M.push(v.mapUv),M.push(v.alphaMapUv),M.push(v.lightMapUv),M.push(v.aoMapUv),M.push(v.bumpMapUv),M.push(v.normalMapUv),M.push(v.displacementMapUv),M.push(v.emissiveMapUv),M.push(v.metalnessMapUv),M.push(v.roughnessMapUv),M.push(v.anisotropyMapUv),M.push(v.clearcoatMapUv),M.push(v.clearcoatNormalMapUv),M.push(v.clearcoatRoughnessMapUv),M.push(v.iridescenceMapUv),M.push(v.iridescenceThicknessMapUv),M.push(v.sheenColorMapUv),M.push(v.sheenRoughnessMapUv),M.push(v.specularMapUv),M.push(v.specularColorMapUv),M.push(v.specularIntensityMapUv),M.push(v.transmissionMapUv),M.push(v.thicknessMapUv),M.push(v.combine),M.push(v.fogExp2),M.push(v.sizeAttenuation),M.push(v.morphTargetsCount),M.push(v.morphAttributeCount),M.push(v.numDirLights),M.push(v.numPointLights),M.push(v.numSpotLights),M.push(v.numSpotLightMaps),M.push(v.numHemiLights),M.push(v.numRectAreaLights),M.push(v.numDirLightShadows),M.push(v.numPointLightShadows),M.push(v.numSpotLightShadows),M.push(v.numSpotLightShadowsWithMaps),M.push(v.numLightProbes),M.push(v.shadowMapType),M.push(v.toneMapping),M.push(v.numClippingPlanes),M.push(v.numClipIntersection),M.push(v.depthPacking)}function S(M,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),v.gradientMap&&a.enable(22),M.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reversedDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),M.push(a.mask)}function x(M){let v=g[M.type],I;if(v){let L=qn[v];I=dd.clone(L.uniforms)}else I=M.uniforms;return I}function A(M,v){let I;for(let L=0,U=h.length;L<U;L++){let G=h[L];if(G.cacheKey===v){I=G,++I.usedTimes;break}}return I===void 0&&(I=new J_(s,v,M,r),h.push(I)),I}function w(M){if(--M.usedTimes===0){let v=h.indexOf(M);h[v]=h[h.length-1],h.pop(),M.destroy()}}function P(M){l.remove(M)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:A,releaseProgram:w,releaseShaderCache:P,programs:h,dispose:C}}function j_(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function tx(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function zd(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Hd(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u,d,f,g,_,m){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},s[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function a(u,d,f,g,_,m){let p=o(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):e.push(p)}function l(u,d,f,g,_,m){let p=o(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||tx),n.length>1&&n.sort(d||zd),i.length>1&&i.sort(d||zd)}function h(){for(let u=t,d=s.length;u<d;u++){let f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function ex(){let s=new WeakMap;function t(n,i){let r=s.get(n),o;return r===void 0?(o=new Hd,s.set(n,[o])):i>=r.length?(o=new Hd,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function nx(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new Ot};break;case"SpotLight":e={position:new R,direction:new R,color:new Ot,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new Ot,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new Ot,groundColor:new Ot};break;case"RectAreaLight":e={color:new Ot,position:new R,halfWidth:new R,halfHeight:new R};break}return s[t.id]=e,e}}}function ix(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var sx=0;function rx(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function ox(s){let t=new nx,e=ix(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);let i=new R,r=new Gt,o=new Gt;function a(c){let h=0,u=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,b=0,S=0,x=0,A=0,w=0,P=0;c.sort(rx);for(let M=0,v=c.length;M<v;M++){let I=c[M],L=I.color,U=I.intensity,G=I.distance,B=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=L.r*U,u+=L.g*U,d+=L.b*U;else if(I.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(I.sh.coefficients[W],U);P++}else if(I.isDirectionalLight){let W=t.get(I);if(W.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let Z=I.shadow,k=e.get(I);k.shadowIntensity=Z.intensity,k.shadowBias=Z.bias,k.shadowNormalBias=Z.normalBias,k.shadowRadius=Z.radius,k.shadowMapSize=Z.mapSize,n.directionalShadow[f]=k,n.directionalShadowMap[f]=B,n.directionalShadowMatrix[f]=I.shadow.matrix,b++}n.directional[f]=W,f++}else if(I.isSpotLight){let W=t.get(I);W.position.setFromMatrixPosition(I.matrixWorld),W.color.copy(L).multiplyScalar(U),W.distance=G,W.coneCos=Math.cos(I.angle),W.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),W.decay=I.decay,n.spot[_]=W;let Z=I.shadow;if(I.map&&(n.spotLightMap[A]=I.map,A++,Z.updateMatrices(I),I.castShadow&&w++),n.spotLightMatrix[_]=Z.matrix,I.castShadow){let k=e.get(I);k.shadowIntensity=Z.intensity,k.shadowBias=Z.bias,k.shadowNormalBias=Z.normalBias,k.shadowRadius=Z.radius,k.shadowMapSize=Z.mapSize,n.spotShadow[_]=k,n.spotShadowMap[_]=B,x++}_++}else if(I.isRectAreaLight){let W=t.get(I);W.color.copy(L).multiplyScalar(U),W.halfWidth.set(I.width*.5,0,0),W.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=W,m++}else if(I.isPointLight){let W=t.get(I);if(W.color.copy(I.color).multiplyScalar(I.intensity),W.distance=I.distance,W.decay=I.decay,I.castShadow){let Z=I.shadow,k=e.get(I);k.shadowIntensity=Z.intensity,k.shadowBias=Z.bias,k.shadowNormalBias=Z.normalBias,k.shadowRadius=Z.radius,k.shadowMapSize=Z.mapSize,k.shadowCameraNear=Z.camera.near,k.shadowCameraFar=Z.camera.far,n.pointShadow[g]=k,n.pointShadowMap[g]=B,n.pointShadowMatrix[g]=I.shadow.matrix,S++}n.point[g]=W,g++}else if(I.isHemisphereLight){let W=t.get(I);W.skyColor.copy(I.color).multiplyScalar(U),W.groundColor.copy(I.groundColor).multiplyScalar(U),n.hemi[p]=W,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let C=n.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==b||C.numPointShadows!==S||C.numSpotShadows!==x||C.numSpotMaps!==A||C.numLightProbes!==P)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=x+A-w,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=P,C.directionalLength=f,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=b,C.numPointShadows=S,C.numSpotShadows=x,C.numSpotMaps=A,C.numLightProbes=P,n.version=sx++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0,m=h.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){let S=c[p];if(S.isDirectionalLight){let x=n.directional[u];x.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),u++}else if(S.isSpotLight){let x=n.spot[f];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),f++}else if(S.isRectAreaLight){let x=n.rectArea[g];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),o.identity(),r.copy(S.matrixWorld),r.premultiply(m),o.extractRotation(r),x.halfWidth.set(S.width*.5,0,0),x.halfHeight.set(0,S.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(S.isPointLight){let x=n.point[d];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),d++}else if(S.isHemisphereLight){let x=n.hemi[_];x.direction.setFromMatrixPosition(S.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function kd(s){let t=new ox(s),e=[],n=[];function i(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}let c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function ax(s){let t=new WeakMap;function e(i,r=0){let o=t.get(i),a;return o===void 0?(a=new kd(s),t.set(i,[a])):r>=o.length?(a=new kd(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var lx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function hx(s,t,e){let n=new zs,i=new st,r=new st,o=new de,a=new oa({depthPacking:td}),l=new aa,c={},h=e.maxTextureSize,u={[ci]:We,[We]:ci,[Fe]:Fe},d=new pn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new st},radius:{value:4}},vertexShader:lx,fragmentShader:cx}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new ve;g.setAttribute("position",new Ne(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new At(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fc;let p=this.type;this.render=function(w,P,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let M=s.getRenderTarget(),v=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),L=s.state;L.setBlending(mi),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let U=p!==Wn&&this.type===Wn,G=p===Wn&&this.type!==Wn;for(let B=0,W=w.length;B<W;B++){let Z=w[B],k=Z.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;i.copy(k.mapSize);let j=k.getFrameExtents();if(i.multiply(j),r.copy(k.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/j.x),i.x=r.x*j.x,k.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/j.y),i.y=r.y*j.y,k.mapSize.y=r.y)),k.map===null||U===!0||G===!0){let nt=this.type!==Wn?{minFilter:sn,magFilter:sn}:{};k.map!==null&&k.map.dispose(),k.map=new kn(i.x,i.y,nt),k.map.texture.name=Z.name+".shadowMap",k.camera.updateProjectionMatrix()}s.setRenderTarget(k.map),s.clear();let at=k.getViewportCount();for(let nt=0;nt<at;nt++){let ft=k.getViewport(nt);o.set(r.x*ft.x,r.y*ft.y,r.x*ft.z,r.y*ft.w),L.viewport(o),k.updateMatrices(Z,nt),n=k.getFrustum(),x(P,C,k.camera,Z,this.type)}k.isPointLightShadow!==!0&&this.type===Wn&&b(k,C),k.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(M,v,I)};function b(w,P){let C=t.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new kn(i.x,i.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(P,null,C,d,_,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(P,null,C,f,_,null)}function S(w,P,C,M){let v=null,I=C.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(I!==void 0)v=I;else if(v=C.isPointLight===!0?l:a,s.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let L=v.uuid,U=P.uuid,G=c[L];G===void 0&&(G={},c[L]=G);let B=G[U];B===void 0&&(B=v.clone(),G[U]=B,P.addEventListener("dispose",A)),v=B}if(v.visible=P.visible,v.wireframe=P.wireframe,M===Wn?v.side=P.shadowSide!==null?P.shadowSide:P.side:v.side=P.shadowSide!==null?P.shadowSide:u[P.side],v.alphaMap=P.alphaMap,v.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,v.map=P.map,v.clipShadows=P.clipShadows,v.clippingPlanes=P.clippingPlanes,v.clipIntersection=P.clipIntersection,v.displacementMap=P.displacementMap,v.displacementScale=P.displacementScale,v.displacementBias=P.displacementBias,v.wireframeLinewidth=P.wireframeLinewidth,v.linewidth=P.linewidth,C.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let L=s.properties.get(v);L.light=C}return v}function x(w,P,C,M,v){if(w.visible===!1)return;if(w.layers.test(P.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&v===Wn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,w.matrixWorld);let U=t.update(w),G=w.material;if(Array.isArray(G)){let B=U.groups;for(let W=0,Z=B.length;W<Z;W++){let k=B[W],j=G[k.materialIndex];if(j&&j.visible){let at=S(w,j,M,v);w.onBeforeShadow(s,w,P,C,U,at,k),s.renderBufferDirect(C,null,U,at,w,k),w.onAfterShadow(s,w,P,C,U,at,k)}}}else if(G.visible){let B=S(w,G,M,v);w.onBeforeShadow(s,w,P,C,U,B,null),s.renderBufferDirect(C,null,U,B,w,null),w.onAfterShadow(s,w,P,C,U,B,null)}}let L=w.children;for(let U=0,G=L.length;U<G;U++)x(L[U],P,C,M,v)}function A(w){w.target.removeEventListener("dispose",A);for(let C in c){let M=c[C],v=w.target.uuid;v in M&&(M[v].dispose(),delete M[v])}}}var ux={[va]:Ma,[Sa]:Ta,[ba]:wa,[Xi]:Ea,[Ma]:va,[Ta]:Sa,[wa]:ba,[Ea]:Xi};function dx(s,t){function e(){let F=!1,ct=new de,mt=null,Rt=new de(0,0,0,0);return{setMask:function(lt){mt!==lt&&!F&&(s.colorMask(lt,lt,lt,lt),mt=lt)},setLocked:function(lt){F=lt},setClear:function(lt,et,Ft,Jt,he){he===!0&&(lt*=Jt,et*=Jt,Ft*=Jt),ct.set(lt,et,Ft,Jt),Rt.equals(ct)===!1&&(s.clearColor(lt,et,Ft,Jt),Rt.copy(ct))},reset:function(){F=!1,mt=null,Rt.set(-1,0,0,0)}}}function n(){let F=!1,ct=!1,mt=null,Rt=null,lt=null;return{setReversed:function(et){if(ct!==et){let Ft=t.get("EXT_clip_control");et?Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.ZERO_TO_ONE_EXT):Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.NEGATIVE_ONE_TO_ONE_EXT),ct=et;let Jt=lt;lt=null,this.setClear(Jt)}},getReversed:function(){return ct},setTest:function(et){et?$(s.DEPTH_TEST):vt(s.DEPTH_TEST)},setMask:function(et){mt!==et&&!F&&(s.depthMask(et),mt=et)},setFunc:function(et){if(ct&&(et=ux[et]),Rt!==et){switch(et){case va:s.depthFunc(s.NEVER);break;case Ma:s.depthFunc(s.ALWAYS);break;case Sa:s.depthFunc(s.LESS);break;case Xi:s.depthFunc(s.LEQUAL);break;case ba:s.depthFunc(s.EQUAL);break;case Ea:s.depthFunc(s.GEQUAL);break;case Ta:s.depthFunc(s.GREATER);break;case wa:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Rt=et}},setLocked:function(et){F=et},setClear:function(et){lt!==et&&(ct&&(et=1-et),s.clearDepth(et),lt=et)},reset:function(){F=!1,mt=null,Rt=null,lt=null,ct=!1}}}function i(){let F=!1,ct=null,mt=null,Rt=null,lt=null,et=null,Ft=null,Jt=null,he=null;return{setTest:function(ue){F||(ue?$(s.STENCIL_TEST):vt(s.STENCIL_TEST))},setMask:function(ue){ct!==ue&&!F&&(s.stencilMask(ue),ct=ue)},setFunc:function(ue,ti,On){(mt!==ue||Rt!==ti||lt!==On)&&(s.stencilFunc(ue,ti,On),mt=ue,Rt=ti,lt=On)},setOp:function(ue,ti,On){(et!==ue||Ft!==ti||Jt!==On)&&(s.stencilOp(ue,ti,On),et=ue,Ft=ti,Jt=On)},setLocked:function(ue){F=ue},setClear:function(ue){he!==ue&&(s.clearStencil(ue),he=ue)},reset:function(){F=!1,ct=null,mt=null,Rt=null,lt=null,et=null,Ft=null,Jt=null,he=null}}}let r=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,b=null,S=null,x=null,A=null,w=null,P=new Ot(0,0,0),C=0,M=!1,v=null,I=null,L=null,U=null,G=null,B=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),W=!1,Z=0,k=s.getParameter(s.VERSION);k.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(k)[1]),W=Z>=1):k.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),W=Z>=2);let j=null,at={},nt=s.getParameter(s.SCISSOR_BOX),ft=s.getParameter(s.VIEWPORT),Ut=new de().fromArray(nt),Lt=new de().fromArray(ft);function Ct(F,ct,mt,Rt){let lt=new Uint8Array(4),et=s.createTexture();s.bindTexture(F,et),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ft=0;Ft<mt;Ft++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(ct,0,s.RGBA,1,1,Rt,0,s.RGBA,s.UNSIGNED_BYTE,lt):s.texImage2D(ct+Ft,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,lt);return et}let V={};V[s.TEXTURE_2D]=Ct(s.TEXTURE_2D,s.TEXTURE_2D,1),V[s.TEXTURE_CUBE_MAP]=Ct(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),V[s.TEXTURE_2D_ARRAY]=Ct(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),V[s.TEXTURE_3D]=Ct(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),$(s.DEPTH_TEST),o.setFunc(Xi),Q(!1),K(Lc),$(s.CULL_FACE),it(mi);function $(F){h[F]!==!0&&(s.enable(F),h[F]=!0)}function vt(F){h[F]!==!1&&(s.disable(F),h[F]=!1)}function bt(F,ct){return u[F]!==ct?(s.bindFramebuffer(F,ct),u[F]=ct,F===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=ct),F===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=ct),!0):!1}function Tt(F,ct){let mt=f,Rt=!1;if(F){mt=d.get(ct),mt===void 0&&(mt=[],d.set(ct,mt));let lt=F.textures;if(mt.length!==lt.length||mt[0]!==s.COLOR_ATTACHMENT0){for(let et=0,Ft=lt.length;et<Ft;et++)mt[et]=s.COLOR_ATTACHMENT0+et;mt.length=lt.length,Rt=!0}}else mt[0]!==s.BACK&&(mt[0]=s.BACK,Rt=!0);Rt&&s.drawBuffers(mt)}function jt(F){return g!==F?(s.useProgram(F),g=F,!0):!1}let ce={[Ai]:s.FUNC_ADD,[Au]:s.FUNC_SUBTRACT,[Ru]:s.FUNC_REVERSE_SUBTRACT};ce[Cu]=s.MIN,ce[Pu]=s.MAX;let D={[Iu]:s.ZERO,[Du]:s.ONE,[Lu]:s.SRC_COLOR,[ko]:s.SRC_ALPHA,[zu]:s.SRC_ALPHA_SATURATE,[Ou]:s.DST_COLOR,[Uu]:s.DST_ALPHA,[Fu]:s.ONE_MINUS_SRC_COLOR,[Go]:s.ONE_MINUS_SRC_ALPHA,[Bu]:s.ONE_MINUS_DST_COLOR,[Nu]:s.ONE_MINUS_DST_ALPHA,[Hu]:s.CONSTANT_COLOR,[ku]:s.ONE_MINUS_CONSTANT_COLOR,[Gu]:s.CONSTANT_ALPHA,[Vu]:s.ONE_MINUS_CONSTANT_ALPHA};function it(F,ct,mt,Rt,lt,et,Ft,Jt,he,ue){if(F===mi){_===!0&&(vt(s.BLEND),_=!1);return}if(_===!1&&($(s.BLEND),_=!0),F!==wu){if(F!==m||ue!==M){if((p!==Ai||x!==Ai)&&(s.blendEquation(s.FUNC_ADD),p=Ai,x=Ai),ue)switch(F){case hi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Xe:s.blendFunc(s.ONE,s.ONE);break;case Uc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Nc:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case hi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Xe:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Uc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Nc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}b=null,S=null,A=null,w=null,P.set(0,0,0),C=0,m=F,M=ue}return}lt=lt||ct,et=et||mt,Ft=Ft||Rt,(ct!==p||lt!==x)&&(s.blendEquationSeparate(ce[ct],ce[lt]),p=ct,x=lt),(mt!==b||Rt!==S||et!==A||Ft!==w)&&(s.blendFuncSeparate(D[mt],D[Rt],D[et],D[Ft]),b=mt,S=Rt,A=et,w=Ft),(Jt.equals(P)===!1||he!==C)&&(s.blendColor(Jt.r,Jt.g,Jt.b,he),P.copy(Jt),C=he),m=F,M=!1}function tt(F,ct){F.side===Fe?vt(s.CULL_FACE):$(s.CULL_FACE);let mt=F.side===We;ct&&(mt=!mt),Q(mt),F.blending===hi&&F.transparent===!1?it(mi):it(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),r.setMask(F.colorWrite);let Rt=F.stencilWrite;a.setTest(Rt),Rt&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),rt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?$(s.SAMPLE_ALPHA_TO_COVERAGE):vt(s.SAMPLE_ALPHA_TO_COVERAGE)}function Q(F){v!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),v=F)}function K(F){F!==Eu?($(s.CULL_FACE),F!==I&&(F===Lc?s.cullFace(s.BACK):F===Tu?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):vt(s.CULL_FACE),I=F}function pt(F){F!==L&&(W&&s.lineWidth(F),L=F)}function rt(F,ct,mt){F?($(s.POLYGON_OFFSET_FILL),(U!==ct||G!==mt)&&(s.polygonOffset(ct,mt),U=ct,G=mt)):vt(s.POLYGON_OFFSET_FILL)}function _t(F){F?$(s.SCISSOR_TEST):vt(s.SCISSOR_TEST)}function Zt(F){F===void 0&&(F=s.TEXTURE0+B-1),j!==F&&(s.activeTexture(F),j=F)}function Wt(F,ct,mt){mt===void 0&&(j===null?mt=s.TEXTURE0+B-1:mt=j);let Rt=at[mt];Rt===void 0&&(Rt={type:void 0,texture:void 0},at[mt]=Rt),(Rt.type!==F||Rt.texture!==ct)&&(j!==mt&&(s.activeTexture(mt),j=mt),s.bindTexture(F,ct||V[F]),Rt.type=F,Rt.texture=ct)}function T(){let F=at[j];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function y(){try{s.compressedTexImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function z(){try{s.compressedTexImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function H(){try{s.texSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function J(){try{s.texSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function X(){try{s.compressedTexSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ht(){try{s.compressedTexSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ut(){try{s.texStorage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function wt(){try{s.texStorage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Pt(){try{s.texImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ot(){try{s.texImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Mt(F){Ut.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),Ut.copy(F))}function zt(F){Lt.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),Lt.copy(F))}function It(F,ct){let mt=c.get(ct);mt===void 0&&(mt=new WeakMap,c.set(ct,mt));let Rt=mt.get(F);Rt===void 0&&(Rt=s.getUniformBlockIndex(ct,F.name),mt.set(F,Rt))}function xt(F,ct){let Rt=c.get(ct).get(F);l.get(ct)!==Rt&&(s.uniformBlockBinding(ct,Rt,F.__bindingPointIndex),l.set(ct,Rt))}function $t(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},j=null,at={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,b=null,S=null,x=null,A=null,w=null,P=new Ot(0,0,0),C=0,M=!1,v=null,I=null,L=null,U=null,G=null,Ut.set(0,0,s.canvas.width,s.canvas.height),Lt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:$,disable:vt,bindFramebuffer:bt,drawBuffers:Tt,useProgram:jt,setBlending:it,setMaterial:tt,setFlipSided:Q,setCullFace:K,setLineWidth:pt,setPolygonOffset:rt,setScissorTest:_t,activeTexture:Zt,bindTexture:Wt,unbindTexture:T,compressedTexImage2D:y,compressedTexImage3D:z,texImage2D:Pt,texImage3D:ot,updateUBOMapping:It,uniformBlockBinding:xt,texStorage2D:ut,texStorage3D:wt,texSubImage2D:H,texSubImage3D:J,compressedTexSubImage2D:X,compressedTexSubImage3D:ht,scissor:Mt,viewport:zt,reset:$t}}function fx(s,t,e,n,i,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new st,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(T){}function g(T,y){return f?new OffscreenCanvas(T,y):wr("canvas")}function _(T,y,z){let H=1,J=Wt(T);if((J.width>z||J.height>z)&&(H=z/Math.max(J.width,J.height)),H<1)if(typeof HTMLImageElement!="undefined"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&T instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&T instanceof ImageBitmap||typeof VideoFrame!="undefined"&&T instanceof VideoFrame){let X=Math.floor(H*J.width),ht=Math.floor(H*J.height);u===void 0&&(u=g(X,ht));let ut=y?g(X,ht):u;return ut.width=X,ut.height=ht,ut.getContext("2d").drawImage(T,0,0,X,ht),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+X+"x"+ht+")."),ut}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),T;return T}function m(T){return T.generateMipmaps}function p(T){s.generateMipmap(T)}function b(T){return T.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?s.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function S(T,y,z,H,J=!1){if(T!==null){if(s[T]!==void 0)return s[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let X=y;if(y===s.RED&&(z===s.FLOAT&&(X=s.R32F),z===s.HALF_FLOAT&&(X=s.R16F),z===s.UNSIGNED_BYTE&&(X=s.R8)),y===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(X=s.R8UI),z===s.UNSIGNED_SHORT&&(X=s.R16UI),z===s.UNSIGNED_INT&&(X=s.R32UI),z===s.BYTE&&(X=s.R8I),z===s.SHORT&&(X=s.R16I),z===s.INT&&(X=s.R32I)),y===s.RG&&(z===s.FLOAT&&(X=s.RG32F),z===s.HALF_FLOAT&&(X=s.RG16F),z===s.UNSIGNED_BYTE&&(X=s.RG8)),y===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(X=s.RG8UI),z===s.UNSIGNED_SHORT&&(X=s.RG16UI),z===s.UNSIGNED_INT&&(X=s.RG32UI),z===s.BYTE&&(X=s.RG8I),z===s.SHORT&&(X=s.RG16I),z===s.INT&&(X=s.RG32I)),y===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(X=s.RGB8UI),z===s.UNSIGNED_SHORT&&(X=s.RGB16UI),z===s.UNSIGNED_INT&&(X=s.RGB32UI),z===s.BYTE&&(X=s.RGB8I),z===s.SHORT&&(X=s.RGB16I),z===s.INT&&(X=s.RGB32I)),y===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(X=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(X=s.RGBA16UI),z===s.UNSIGNED_INT&&(X=s.RGBA32UI),z===s.BYTE&&(X=s.RGBA8I),z===s.SHORT&&(X=s.RGBA16I),z===s.INT&&(X=s.RGBA32I)),y===s.RGB&&(z===s.UNSIGNED_INT_5_9_9_9_REV&&(X=s.RGB9_E5),z===s.UNSIGNED_INT_10F_11F_11F_REV&&(X=s.R11F_G11F_B10F)),y===s.RGBA){let ht=J?Er:ae.getTransfer(H);z===s.FLOAT&&(X=s.RGBA32F),z===s.HALF_FLOAT&&(X=s.RGBA16F),z===s.UNSIGNED_BYTE&&(X=ht===pe?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT_4_4_4_4&&(X=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(X=s.RGB5_A1)}return(X===s.R16F||X===s.R32F||X===s.RG16F||X===s.RG32F||X===s.RGBA16F||X===s.RGBA32F)&&t.get("EXT_color_buffer_float"),X}function x(T,y){let z;return T?y===null||y===Li||y===qs?z=s.DEPTH24_STENCIL8:y===Un?z=s.DEPTH32F_STENCIL8:y===Ws&&(z=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Li||y===qs?z=s.DEPTH_COMPONENT24:y===Un?z=s.DEPTH_COMPONENT32F:y===Ws&&(z=s.DEPTH_COMPONENT16),z}function A(T,y){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==sn&&T.minFilter!==dn?Math.log2(Math.max(y.width,y.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?y.mipmaps.length:1}function w(T){let y=T.target;y.removeEventListener("dispose",w),C(y),y.isVideoTexture&&h.delete(y)}function P(T){let y=T.target;y.removeEventListener("dispose",P),v(y)}function C(T){let y=n.get(T);if(y.__webglInit===void 0)return;let z=T.source,H=d.get(z);if(H){let J=H[y.__cacheKey];J.usedTimes--,J.usedTimes===0&&M(T),Object.keys(H).length===0&&d.delete(z)}n.remove(T)}function M(T){let y=n.get(T);s.deleteTexture(y.__webglTexture);let z=T.source,H=d.get(z);delete H[y.__cacheKey],o.memory.textures--}function v(T){let y=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(y.__webglFramebuffer[H]))for(let J=0;J<y.__webglFramebuffer[H].length;J++)s.deleteFramebuffer(y.__webglFramebuffer[H][J]);else s.deleteFramebuffer(y.__webglFramebuffer[H]);y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer[H])}else{if(Array.isArray(y.__webglFramebuffer))for(let H=0;H<y.__webglFramebuffer.length;H++)s.deleteFramebuffer(y.__webglFramebuffer[H]);else s.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&s.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let H=0;H<y.__webglColorRenderbuffer.length;H++)y.__webglColorRenderbuffer[H]&&s.deleteRenderbuffer(y.__webglColorRenderbuffer[H]);y.__webglDepthRenderbuffer&&s.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let z=T.textures;for(let H=0,J=z.length;H<J;H++){let X=n.get(z[H]);X.__webglTexture&&(s.deleteTexture(X.__webglTexture),o.memory.textures--),n.remove(z[H])}n.remove(T)}let I=0;function L(){I=0}function U(){let T=I;return T>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+i.maxTextures),I+=1,T}function G(T){let y=[];return y.push(T.wrapS),y.push(T.wrapT),y.push(T.wrapR||0),y.push(T.magFilter),y.push(T.minFilter),y.push(T.anisotropy),y.push(T.internalFormat),y.push(T.format),y.push(T.type),y.push(T.generateMipmaps),y.push(T.premultiplyAlpha),y.push(T.flipY),y.push(T.unpackAlignment),y.push(T.colorSpace),y.join()}function B(T,y){let z=n.get(T);if(T.isVideoTexture&&_t(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&z.__version!==T.version){let H=T.image;if(H===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{V(z,T,y);return}}else T.isExternalTexture&&(z.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+y)}function W(T,y){let z=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){V(z,T,y);return}e.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+y)}function Z(T,y){let z=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){V(z,T,y);return}e.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+y)}function k(T,y){let z=n.get(T);if(T.version>0&&z.__version!==T.version){$(z,T,y);return}e.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+y)}let j={[ui]:s.REPEAT,[wi]:s.CLAMP_TO_EDGE,[Vo]:s.MIRRORED_REPEAT},at={[sn]:s.NEAREST,[Qu]:s.NEAREST_MIPMAP_NEAREST,[to]:s.NEAREST_MIPMAP_LINEAR,[dn]:s.LINEAR,[Pa]:s.LINEAR_MIPMAP_NEAREST,[Xn]:s.LINEAR_MIPMAP_LINEAR},nt={[nd]:s.NEVER,[ld]:s.ALWAYS,[id]:s.LESS,[Yc]:s.LEQUAL,[sd]:s.EQUAL,[ad]:s.GEQUAL,[rd]:s.GREATER,[od]:s.NOTEQUAL};function ft(T,y){if(y.type===Un&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===dn||y.magFilter===Pa||y.magFilter===to||y.magFilter===Xn||y.minFilter===dn||y.minFilter===Pa||y.minFilter===to||y.minFilter===Xn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(T,s.TEXTURE_WRAP_S,j[y.wrapS]),s.texParameteri(T,s.TEXTURE_WRAP_T,j[y.wrapT]),(T===s.TEXTURE_3D||T===s.TEXTURE_2D_ARRAY)&&s.texParameteri(T,s.TEXTURE_WRAP_R,j[y.wrapR]),s.texParameteri(T,s.TEXTURE_MAG_FILTER,at[y.magFilter]),s.texParameteri(T,s.TEXTURE_MIN_FILTER,at[y.minFilter]),y.compareFunction&&(s.texParameteri(T,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(T,s.TEXTURE_COMPARE_FUNC,nt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===sn||y.minFilter!==to&&y.minFilter!==Xn||y.type===Un&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){let z=t.get("EXT_texture_filter_anisotropic");s.texParameterf(T,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Ut(T,y){let z=!1;T.__webglInit===void 0&&(T.__webglInit=!0,y.addEventListener("dispose",w));let H=y.source,J=d.get(H);J===void 0&&(J={},d.set(H,J));let X=G(y);if(X!==T.__cacheKey){J[X]===void 0&&(J[X]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,z=!0),J[X].usedTimes++;let ht=J[T.__cacheKey];ht!==void 0&&(J[T.__cacheKey].usedTimes--,ht.usedTimes===0&&M(y)),T.__cacheKey=X,T.__webglTexture=J[X].texture}return z}function Lt(T,y,z){return Math.floor(Math.floor(T/z)/y)}function Ct(T,y,z,H){let X=T.updateRanges;if(X.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,y.width,y.height,z,H,y.data);else{X.sort((ot,Mt)=>ot.start-Mt.start);let ht=0;for(let ot=1;ot<X.length;ot++){let Mt=X[ht],zt=X[ot],It=Mt.start+Mt.count,xt=Lt(zt.start,y.width,4),$t=Lt(Mt.start,y.width,4);zt.start<=It+1&&xt===$t&&Lt(zt.start+zt.count-1,y.width,4)===xt?Mt.count=Math.max(Mt.count,zt.start+zt.count-Mt.start):(++ht,X[ht]=zt)}X.length=ht+1;let ut=s.getParameter(s.UNPACK_ROW_LENGTH),wt=s.getParameter(s.UNPACK_SKIP_PIXELS),Pt=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,y.width);for(let ot=0,Mt=X.length;ot<Mt;ot++){let zt=X[ot],It=Math.floor(zt.start/4),xt=Math.ceil(zt.count/4),$t=It%y.width,F=Math.floor(It/y.width),ct=xt,mt=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,$t),s.pixelStorei(s.UNPACK_SKIP_ROWS,F),e.texSubImage2D(s.TEXTURE_2D,0,$t,F,ct,mt,z,H,y.data)}T.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,ut),s.pixelStorei(s.UNPACK_SKIP_PIXELS,wt),s.pixelStorei(s.UNPACK_SKIP_ROWS,Pt)}}function V(T,y,z){let H=s.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(H=s.TEXTURE_2D_ARRAY),y.isData3DTexture&&(H=s.TEXTURE_3D);let J=Ut(T,y),X=y.source;e.bindTexture(H,T.__webglTexture,s.TEXTURE0+z);let ht=n.get(X);if(X.version!==ht.__version||J===!0){e.activeTexture(s.TEXTURE0+z);let ut=ae.getPrimaries(ae.workingColorSpace),wt=y.colorSpace===Nn?null:ae.getPrimaries(y.colorSpace),Pt=y.colorSpace===Nn||ut===wt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);let ot=_(y.image,!1,i.maxTextureSize);ot=Zt(y,ot);let Mt=r.convert(y.format,y.colorSpace),zt=r.convert(y.type),It=S(y.internalFormat,Mt,zt,y.colorSpace,y.isVideoTexture);ft(H,y);let xt,$t=y.mipmaps,F=y.isVideoTexture!==!0,ct=ht.__version===void 0||J===!0,mt=X.dataReady,Rt=A(y,ot);if(y.isDepthTexture)It=x(y.format===Ys,y.type),ct&&(F?e.texStorage2D(s.TEXTURE_2D,1,It,ot.width,ot.height):e.texImage2D(s.TEXTURE_2D,0,It,ot.width,ot.height,0,Mt,zt,null));else if(y.isDataTexture)if($t.length>0){F&&ct&&e.texStorage2D(s.TEXTURE_2D,Rt,It,$t[0].width,$t[0].height);for(let lt=0,et=$t.length;lt<et;lt++)xt=$t[lt],F?mt&&e.texSubImage2D(s.TEXTURE_2D,lt,0,0,xt.width,xt.height,Mt,zt,xt.data):e.texImage2D(s.TEXTURE_2D,lt,It,xt.width,xt.height,0,Mt,zt,xt.data);y.generateMipmaps=!1}else F?(ct&&e.texStorage2D(s.TEXTURE_2D,Rt,It,ot.width,ot.height),mt&&Ct(y,ot,Mt,zt)):e.texImage2D(s.TEXTURE_2D,0,It,ot.width,ot.height,0,Mt,zt,ot.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){F&&ct&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Rt,It,$t[0].width,$t[0].height,ot.depth);for(let lt=0,et=$t.length;lt<et;lt++)if(xt=$t[lt],y.format!==bn)if(Mt!==null)if(F){if(mt)if(y.layerUpdates.size>0){let Ft=eh(xt.width,xt.height,y.format,y.type);for(let Jt of y.layerUpdates){let he=xt.data.subarray(Jt*Ft/xt.data.BYTES_PER_ELEMENT,(Jt+1)*Ft/xt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,lt,0,0,Jt,xt.width,xt.height,1,Mt,he)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,lt,0,0,0,xt.width,xt.height,ot.depth,Mt,xt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,lt,It,xt.width,xt.height,ot.depth,0,xt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else F?mt&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,lt,0,0,0,xt.width,xt.height,ot.depth,Mt,zt,xt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,lt,It,xt.width,xt.height,ot.depth,0,Mt,zt,xt.data)}else{F&&ct&&e.texStorage2D(s.TEXTURE_2D,Rt,It,$t[0].width,$t[0].height);for(let lt=0,et=$t.length;lt<et;lt++)xt=$t[lt],y.format!==bn?Mt!==null?F?mt&&e.compressedTexSubImage2D(s.TEXTURE_2D,lt,0,0,xt.width,xt.height,Mt,xt.data):e.compressedTexImage2D(s.TEXTURE_2D,lt,It,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):F?mt&&e.texSubImage2D(s.TEXTURE_2D,lt,0,0,xt.width,xt.height,Mt,zt,xt.data):e.texImage2D(s.TEXTURE_2D,lt,It,xt.width,xt.height,0,Mt,zt,xt.data)}else if(y.isDataArrayTexture)if(F){if(ct&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Rt,It,ot.width,ot.height,ot.depth),mt)if(y.layerUpdates.size>0){let lt=eh(ot.width,ot.height,y.format,y.type);for(let et of y.layerUpdates){let Ft=ot.data.subarray(et*lt/ot.data.BYTES_PER_ELEMENT,(et+1)*lt/ot.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,et,ot.width,ot.height,1,Mt,zt,Ft)}y.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,Mt,zt,ot.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,It,ot.width,ot.height,ot.depth,0,Mt,zt,ot.data);else if(y.isData3DTexture)F?(ct&&e.texStorage3D(s.TEXTURE_3D,Rt,It,ot.width,ot.height,ot.depth),mt&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,Mt,zt,ot.data)):e.texImage3D(s.TEXTURE_3D,0,It,ot.width,ot.height,ot.depth,0,Mt,zt,ot.data);else if(y.isFramebufferTexture){if(ct)if(F)e.texStorage2D(s.TEXTURE_2D,Rt,It,ot.width,ot.height);else{let lt=ot.width,et=ot.height;for(let Ft=0;Ft<Rt;Ft++)e.texImage2D(s.TEXTURE_2D,Ft,It,lt,et,0,Mt,zt,null),lt>>=1,et>>=1}}else if($t.length>0){if(F&&ct){let lt=Wt($t[0]);e.texStorage2D(s.TEXTURE_2D,Rt,It,lt.width,lt.height)}for(let lt=0,et=$t.length;lt<et;lt++)xt=$t[lt],F?mt&&e.texSubImage2D(s.TEXTURE_2D,lt,0,0,Mt,zt,xt):e.texImage2D(s.TEXTURE_2D,lt,It,Mt,zt,xt);y.generateMipmaps=!1}else if(F){if(ct){let lt=Wt(ot);e.texStorage2D(s.TEXTURE_2D,Rt,It,lt.width,lt.height)}mt&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,Mt,zt,ot)}else e.texImage2D(s.TEXTURE_2D,0,It,Mt,zt,ot);m(y)&&p(H),ht.__version=X.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function $(T,y,z){if(y.image.length!==6)return;let H=Ut(T,y),J=y.source;e.bindTexture(s.TEXTURE_CUBE_MAP,T.__webglTexture,s.TEXTURE0+z);let X=n.get(J);if(J.version!==X.__version||H===!0){e.activeTexture(s.TEXTURE0+z);let ht=ae.getPrimaries(ae.workingColorSpace),ut=y.colorSpace===Nn?null:ae.getPrimaries(y.colorSpace),wt=y.colorSpace===Nn||ht===ut?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);let Pt=y.isCompressedTexture||y.image[0].isCompressedTexture,ot=y.image[0]&&y.image[0].isDataTexture,Mt=[];for(let et=0;et<6;et++)!Pt&&!ot?Mt[et]=_(y.image[et],!0,i.maxCubemapSize):Mt[et]=ot?y.image[et].image:y.image[et],Mt[et]=Zt(y,Mt[et]);let zt=Mt[0],It=r.convert(y.format,y.colorSpace),xt=r.convert(y.type),$t=S(y.internalFormat,It,xt,y.colorSpace),F=y.isVideoTexture!==!0,ct=X.__version===void 0||H===!0,mt=J.dataReady,Rt=A(y,zt);ft(s.TEXTURE_CUBE_MAP,y);let lt;if(Pt){F&&ct&&e.texStorage2D(s.TEXTURE_CUBE_MAP,Rt,$t,zt.width,zt.height);for(let et=0;et<6;et++){lt=Mt[et].mipmaps;for(let Ft=0;Ft<lt.length;Ft++){let Jt=lt[Ft];y.format!==bn?It!==null?F?mt&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ft,0,0,Jt.width,Jt.height,It,Jt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ft,$t,Jt.width,Jt.height,0,Jt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?mt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ft,0,0,Jt.width,Jt.height,It,xt,Jt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ft,$t,Jt.width,Jt.height,0,It,xt,Jt.data)}}}else{if(lt=y.mipmaps,F&&ct){lt.length>0&&Rt++;let et=Wt(Mt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,Rt,$t,et.width,et.height)}for(let et=0;et<6;et++)if(ot){F?mt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Mt[et].width,Mt[et].height,It,xt,Mt[et].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,$t,Mt[et].width,Mt[et].height,0,It,xt,Mt[et].data);for(let Ft=0;Ft<lt.length;Ft++){let he=lt[Ft].image[et].image;F?mt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ft+1,0,0,he.width,he.height,It,xt,he.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ft+1,$t,he.width,he.height,0,It,xt,he.data)}}else{F?mt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,It,xt,Mt[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,$t,It,xt,Mt[et]);for(let Ft=0;Ft<lt.length;Ft++){let Jt=lt[Ft];F?mt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ft+1,0,0,It,xt,Jt.image[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ft+1,$t,It,xt,Jt.image[et])}}}m(y)&&p(s.TEXTURE_CUBE_MAP),X.__version=J.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function vt(T,y,z,H,J,X){let ht=r.convert(z.format,z.colorSpace),ut=r.convert(z.type),wt=S(z.internalFormat,ht,ut,z.colorSpace),Pt=n.get(y),ot=n.get(z);if(ot.__renderTarget=y,!Pt.__hasExternalTextures){let Mt=Math.max(1,y.width>>X),zt=Math.max(1,y.height>>X);J===s.TEXTURE_3D||J===s.TEXTURE_2D_ARRAY?e.texImage3D(J,X,wt,Mt,zt,y.depth,0,ht,ut,null):e.texImage2D(J,X,wt,Mt,zt,0,ht,ut,null)}e.bindFramebuffer(s.FRAMEBUFFER,T),rt(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,H,J,ot.__webglTexture,0,pt(y)):(J===s.TEXTURE_2D||J>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,H,J,ot.__webglTexture,X),e.bindFramebuffer(s.FRAMEBUFFER,null)}function bt(T,y,z){if(s.bindRenderbuffer(s.RENDERBUFFER,T),y.depthBuffer){let H=y.depthTexture,J=H&&H.isDepthTexture?H.type:null,X=x(y.stencilBuffer,J),ht=y.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ut=pt(y);rt(y)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ut,X,y.width,y.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,ut,X,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,X,y.width,y.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ht,s.RENDERBUFFER,T)}else{let H=y.textures;for(let J=0;J<H.length;J++){let X=H[J],ht=r.convert(X.format,X.colorSpace),ut=r.convert(X.type),wt=S(X.internalFormat,ht,ut,X.colorSpace),Pt=pt(y);z&&rt(y)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Pt,wt,y.width,y.height):rt(y)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Pt,wt,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,wt,y.width,y.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Tt(T,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,T),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let H=n.get(y.depthTexture);H.__renderTarget=y,(!H.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),B(y.depthTexture,0);let J=H.__webglTexture,X=pt(y);if(y.depthTexture.format===Us)rt(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,J,0,X):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,J,0);else if(y.depthTexture.format===Ys)rt(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,J,0,X):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function jt(T){let y=n.get(T),z=T.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==T.depthTexture){let H=T.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),H){let J=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,H.removeEventListener("dispose",J)};H.addEventListener("dispose",J),y.__depthDisposeCallback=J}y.__boundDepthTexture=H}if(T.depthTexture&&!y.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");let H=T.texture.mipmaps;H&&H.length>0?Tt(y.__webglFramebuffer[0],T):Tt(y.__webglFramebuffer,T)}else if(z){y.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[H]),y.__webglDepthbuffer[H]===void 0)y.__webglDepthbuffer[H]=s.createRenderbuffer(),bt(y.__webglDepthbuffer[H],T,!1);else{let J=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,X=y.__webglDepthbuffer[H];s.bindRenderbuffer(s.RENDERBUFFER,X),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,X)}}else{let H=T.texture.mipmaps;if(H&&H.length>0?e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=s.createRenderbuffer(),bt(y.__webglDepthbuffer,T,!1);else{let J=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,X=y.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,X),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,X)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function ce(T,y,z){let H=n.get(T);y!==void 0&&vt(H.__webglFramebuffer,T,T.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&jt(T)}function D(T){let y=T.texture,z=n.get(T),H=n.get(y);T.addEventListener("dispose",P);let J=T.textures,X=T.isWebGLCubeRenderTarget===!0,ht=J.length>1;if(ht||(H.__webglTexture===void 0&&(H.__webglTexture=s.createTexture()),H.__version=y.version,o.memory.textures++),X){z.__webglFramebuffer=[];for(let ut=0;ut<6;ut++)if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer[ut]=[];for(let wt=0;wt<y.mipmaps.length;wt++)z.__webglFramebuffer[ut][wt]=s.createFramebuffer()}else z.__webglFramebuffer[ut]=s.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer=[];for(let ut=0;ut<y.mipmaps.length;ut++)z.__webglFramebuffer[ut]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(ht)for(let ut=0,wt=J.length;ut<wt;ut++){let Pt=n.get(J[ut]);Pt.__webglTexture===void 0&&(Pt.__webglTexture=s.createTexture(),o.memory.textures++)}if(T.samples>0&&rt(T)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ut=0;ut<J.length;ut++){let wt=J[ut];z.__webglColorRenderbuffer[ut]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[ut]);let Pt=r.convert(wt.format,wt.colorSpace),ot=r.convert(wt.type),Mt=S(wt.internalFormat,Pt,ot,wt.colorSpace,T.isXRRenderTarget===!0),zt=pt(T);s.renderbufferStorageMultisample(s.RENDERBUFFER,zt,Mt,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ut,s.RENDERBUFFER,z.__webglColorRenderbuffer[ut])}s.bindRenderbuffer(s.RENDERBUFFER,null),T.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),bt(z.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(X){e.bindTexture(s.TEXTURE_CUBE_MAP,H.__webglTexture),ft(s.TEXTURE_CUBE_MAP,y);for(let ut=0;ut<6;ut++)if(y.mipmaps&&y.mipmaps.length>0)for(let wt=0;wt<y.mipmaps.length;wt++)vt(z.__webglFramebuffer[ut][wt],T,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,wt);else vt(z.__webglFramebuffer[ut],T,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ut,0);m(y)&&p(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){for(let ut=0,wt=J.length;ut<wt;ut++){let Pt=J[ut],ot=n.get(Pt),Mt=s.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(Mt=T.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Mt,ot.__webglTexture),ft(Mt,Pt),vt(z.__webglFramebuffer,T,Pt,s.COLOR_ATTACHMENT0+ut,Mt,0),m(Pt)&&p(Mt)}e.unbindTexture()}else{let ut=s.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ut=T.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ut,H.__webglTexture),ft(ut,y),y.mipmaps&&y.mipmaps.length>0)for(let wt=0;wt<y.mipmaps.length;wt++)vt(z.__webglFramebuffer[wt],T,y,s.COLOR_ATTACHMENT0,ut,wt);else vt(z.__webglFramebuffer,T,y,s.COLOR_ATTACHMENT0,ut,0);m(y)&&p(ut),e.unbindTexture()}T.depthBuffer&&jt(T)}function it(T){let y=T.textures;for(let z=0,H=y.length;z<H;z++){let J=y[z];if(m(J)){let X=b(T),ht=n.get(J).__webglTexture;e.bindTexture(X,ht),p(X),e.unbindTexture()}}}let tt=[],Q=[];function K(T){if(T.samples>0){if(rt(T)===!1){let y=T.textures,z=T.width,H=T.height,J=s.COLOR_BUFFER_BIT,X=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ht=n.get(T),ut=y.length>1;if(ut)for(let Pt=0;Pt<y.length;Pt++)e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,ht.__webglMultisampledFramebuffer);let wt=T.texture.mipmaps;wt&&wt.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ht.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ht.__webglFramebuffer);for(let Pt=0;Pt<y.length;Pt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(J|=s.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(J|=s.STENCIL_BUFFER_BIT)),ut){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ht.__webglColorRenderbuffer[Pt]);let ot=n.get(y[Pt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ot,0)}s.blitFramebuffer(0,0,z,H,0,0,z,H,J,s.NEAREST),l===!0&&(tt.length=0,Q.length=0,tt.push(s.COLOR_ATTACHMENT0+Pt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(tt.push(X),Q.push(X),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Q)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,tt))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ut)for(let Pt=0;Pt<y.length;Pt++){e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pt,s.RENDERBUFFER,ht.__webglColorRenderbuffer[Pt]);let ot=n.get(y[Pt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,ht.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Pt,s.TEXTURE_2D,ot,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,ht.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){let y=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[y])}}}function pt(T){return Math.min(i.maxSamples,T.samples)}function rt(T){let y=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function _t(T){let y=o.render.frame;h.get(T)!==y&&(h.set(T,y),T.update())}function Zt(T,y){let z=T.colorSpace,H=T.format,J=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||z!==qi&&z!==Nn&&(ae.getTransfer(z)===pe?(H!==bn||J!==Fn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),y}function Wt(T){return typeof HTMLImageElement!="undefined"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame!="undefined"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=L,this.setTexture2D=B,this.setTexture2DArray=W,this.setTexture3D=Z,this.setTextureCube=k,this.rebindTextures=ce,this.setupRenderTarget=D,this.updateRenderTargetMipmap=it,this.updateMultisampleRenderTarget=K,this.setupDepthRenderbuffer=jt,this.setupFrameBufferTexture=vt,this.useMultisampledRTT=rt}function px(s,t){function e(n,i=Nn){let r,o=ae.getTransfer(i);if(n===Fn)return s.UNSIGNED_BYTE;if(n===Da)return s.UNSIGNED_SHORT_4_4_4_4;if(n===La)return s.UNSIGNED_SHORT_5_5_5_1;if(n===kc)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Gc)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===zc)return s.BYTE;if(n===Hc)return s.SHORT;if(n===Ws)return s.UNSIGNED_SHORT;if(n===Ia)return s.INT;if(n===Li)return s.UNSIGNED_INT;if(n===Un)return s.FLOAT;if(n===Xs)return s.HALF_FLOAT;if(n===Vc)return s.ALPHA;if(n===Wc)return s.RGB;if(n===bn)return s.RGBA;if(n===Us)return s.DEPTH_COMPONENT;if(n===Ys)return s.DEPTH_STENCIL;if(n===Fa)return s.RED;if(n===Ua)return s.RED_INTEGER;if(n===Xc)return s.RG;if(n===Na)return s.RG_INTEGER;if(n===Oa)return s.RGBA_INTEGER;if(n===eo||n===no||n===io||n===so)if(o===pe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===eo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===no)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===io)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===so)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===eo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===no)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===io)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===so)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ba||n===za||n===Ha||n===ka)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ba)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===za)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ha)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ka)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ga||n===Va||n===Wa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ga||n===Va)return o===pe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Wa)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Xa||n===qa||n===Ya||n===Za||n===$a||n===Ja||n===Ka||n===Qa||n===ja||n===tl||n===el||n===nl||n===il||n===sl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Xa)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===qa)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ya)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Za)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===$a)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ja)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ka)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Qa)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ja)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===tl)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===el)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===nl)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===il)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===sl)return o===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===rl||n===ol||n===al)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===rl)return o===pe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ol)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===al)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ll||n===cl||n===hl||n===ul)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===ll)return r.COMPRESSED_RED_RGTC1_EXT;if(n===cl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===hl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ul)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===qs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var mx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,ph=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new zr(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new pn({vertexShader:mx,fragmentShader:gx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new At(new Me(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},mh=class extends di{constructor(t,e){super();let n=this,i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null,_=typeof XRWebGLBinding!="undefined",m=new ph,p={},b=e.getContextAttributes(),S=null,x=null,A=[],w=[],P=new st,C=null,M=new Ge;M.viewport=new de;let v=new Ge;v.viewport=new de;let I=[M,v],L=new xa,U=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let $=A[V];return $===void 0&&($=new Bs,A[V]=$),$.getTargetRaySpace()},this.getControllerGrip=function(V){let $=A[V];return $===void 0&&($=new Bs,A[V]=$),$.getGripSpace()},this.getHand=function(V){let $=A[V];return $===void 0&&($=new Bs,A[V]=$),$.getHandSpace()};function B(V){let $=w.indexOf(V.inputSource);if($===-1)return;let vt=A[$];vt!==void 0&&(vt.update(V.inputSource,V.frame,c||o),vt.dispatchEvent({type:V.type,data:V.inputSource}))}function W(){i.removeEventListener("select",B),i.removeEventListener("selectstart",B),i.removeEventListener("selectend",B),i.removeEventListener("squeeze",B),i.removeEventListener("squeezestart",B),i.removeEventListener("squeezeend",B),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",Z);for(let V=0;V<A.length;V++){let $=w[V];$!==null&&(w[V]=null,A[V].disconnect($))}U=null,G=null,m.reset();for(let V in p)delete p[V];t.setRenderTarget(S),f=null,d=null,u=null,i=null,x=null,Ct.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){a=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(i,e)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(V){if(i=V,i!==null){if(S=t.getRenderTarget(),i.addEventListener("select",B),i.addEventListener("selectstart",B),i.addEventListener("selectend",B),i.addEventListener("squeeze",B),i.addEventListener("squeezestart",B),i.addEventListener("squeezeend",B),i.addEventListener("end",W),i.addEventListener("inputsourceschange",Z),b.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(P),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let vt=null,bt=null,Tt=null;b.depth&&(Tt=b.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,vt=b.stencil?Ys:Us,bt=b.stencil?qs:Li);let jt={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(jt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new kn(d.textureWidth,d.textureHeight,{format:bn,type:Fn,depthTexture:new Br(d.textureWidth,d.textureHeight,bt,void 0,void 0,void 0,void 0,void 0,void 0,vt),stencilBuffer:b.stencil,colorSpace:t.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let vt={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,vt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new kn(f.framebufferWidth,f.framebufferHeight,{format:bn,type:Fn,colorSpace:t.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),Ct.setContext(i),Ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Z(V){for(let $=0;$<V.removed.length;$++){let vt=V.removed[$],bt=w.indexOf(vt);bt>=0&&(w[bt]=null,A[bt].disconnect(vt))}for(let $=0;$<V.added.length;$++){let vt=V.added[$],bt=w.indexOf(vt);if(bt===-1){for(let jt=0;jt<A.length;jt++)if(jt>=w.length){w.push(vt),bt=jt;break}else if(w[jt]===null){w[jt]=vt,bt=jt;break}if(bt===-1)break}let Tt=A[bt];Tt&&Tt.connect(vt)}}let k=new R,j=new R;function at(V,$,vt){k.setFromMatrixPosition($.matrixWorld),j.setFromMatrixPosition(vt.matrixWorld);let bt=k.distanceTo(j),Tt=$.projectionMatrix.elements,jt=vt.projectionMatrix.elements,ce=Tt[14]/(Tt[10]-1),D=Tt[14]/(Tt[10]+1),it=(Tt[9]+1)/Tt[5],tt=(Tt[9]-1)/Tt[5],Q=(Tt[8]-1)/Tt[0],K=(jt[8]+1)/jt[0],pt=ce*Q,rt=ce*K,_t=bt/(-Q+K),Zt=_t*-Q;if($.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Zt),V.translateZ(_t),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),Tt[10]===-1)V.projectionMatrix.copy($.projectionMatrix),V.projectionMatrixInverse.copy($.projectionMatrixInverse);else{let Wt=ce+_t,T=D+_t,y=pt-Zt,z=rt+(bt-Zt),H=it*D/T*Wt,J=tt*D/T*Wt;V.projectionMatrix.makePerspective(y,z,H,J,Wt,T),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function nt(V,$){$===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices($.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(i===null)return;let $=V.near,vt=V.far;m.texture!==null&&(m.depthNear>0&&($=m.depthNear),m.depthFar>0&&(vt=m.depthFar)),L.near=v.near=M.near=$,L.far=v.far=M.far=vt,(U!==L.near||G!==L.far)&&(i.updateRenderState({depthNear:L.near,depthFar:L.far}),U=L.near,G=L.far),L.layers.mask=V.layers.mask|6,M.layers.mask=L.layers.mask&3,v.layers.mask=L.layers.mask&5;let bt=V.parent,Tt=L.cameras;nt(L,bt);for(let jt=0;jt<Tt.length;jt++)nt(Tt[jt],bt);Tt.length===2?at(L,M,v):L.projectionMatrix.copy(M.projectionMatrix),ft(V,L,bt)};function ft(V,$,vt){vt===null?V.matrix.copy($.matrixWorld):(V.matrix.copy(vt.matrixWorld),V.matrix.invert(),V.matrix.multiply($.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy($.projectionMatrix),V.projectionMatrixInverse.copy($.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=qo*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(V){l=V,d!==null&&(d.fixedFoveation=V),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=V)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(L)},this.getCameraTexture=function(V){return p[V]};let Ut=null;function Lt(V,$){if(h=$.getViewerPose(c||o),g=$,h!==null){let vt=h.views;f!==null&&(t.setRenderTargetFramebuffer(x,f.framebuffer),t.setRenderTarget(x));let bt=!1;vt.length!==L.cameras.length&&(L.cameras.length=0,bt=!0);for(let D=0;D<vt.length;D++){let it=vt[D],tt=null;if(f!==null)tt=f.getViewport(it);else{let K=u.getViewSubImage(d,it);tt=K.viewport,D===0&&(t.setRenderTargetTextures(x,K.colorTexture,K.depthStencilTexture),t.setRenderTarget(x))}let Q=I[D];Q===void 0&&(Q=new Ge,Q.layers.enable(D),Q.viewport=new de,I[D]=Q),Q.matrix.fromArray(it.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(it.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(tt.x,tt.y,tt.width,tt.height),D===0&&(L.matrix.copy(Q.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),bt===!0&&L.cameras.push(Q)}let Tt=i.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let D=u.getDepthInformation(vt[0]);D&&D.isValid&&D.texture&&m.init(D,i.renderState)}if(Tt&&Tt.includes("camera-access")&&_){t.state.unbindTexture(),u=n.getBinding();for(let D=0;D<vt.length;D++){let it=vt[D].camera;if(it){let tt=p[it];tt||(tt=new zr,p[it]=tt);let Q=u.getCameraImage(it);tt.sourceTexture=Q}}}}for(let vt=0;vt<A.length;vt++){let bt=w[vt],Tt=A[vt];bt!==null&&Tt!==void 0&&Tt.update(bt,$,c||o)}Ut&&Ut(V,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),g=null}let Ct=new Gd;Ct.setAnimationLoop(Lt),this.setAnimationLoop=function(V){Ut=V},this.dispose=function(){}}},rs=new fn,_x=new Gt;function xx(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Kc(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,b,S,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,b,S):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===We&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===We&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let b=t.get(p),S=b.envMap,x=b.envMapRotation;S&&(m.envMap.value=S,rs.copy(x),rs.x*=-1,rs.y*=-1,rs.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(rs.y*=-1,rs.z*=-1),m.envMapRotation.value.setFromMatrix4(_x.makeRotationFromEuler(rs)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=S*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===We&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let b=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function yx(s,t,e,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,S){let x=S.program;n.uniformBlockBinding(b,x)}function c(b,S){let x=i[b.id];x===void 0&&(g(b),x=h(b),i[b.id]=x,b.addEventListener("dispose",m));let A=S.program;n.updateUBOMapping(b,A);let w=t.render.frame;r[b.id]!==w&&(d(b),r[b.id]=w)}function h(b){let S=u();b.__bindingPointIndex=S;let x=s.createBuffer(),A=b.__size,w=b.usage;return s.bindBuffer(s.UNIFORM_BUFFER,x),s.bufferData(s.UNIFORM_BUFFER,A,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,S,x),x}function u(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){let S=i[b.id],x=b.uniforms,A=b.__cache;s.bindBuffer(s.UNIFORM_BUFFER,S);for(let w=0,P=x.length;w<P;w++){let C=Array.isArray(x[w])?x[w]:[x[w]];for(let M=0,v=C.length;M<v;M++){let I=C[M];if(f(I,w,M,A)===!0){let L=I.__offset,U=Array.isArray(I.value)?I.value:[I.value],G=0;for(let B=0;B<U.length;B++){let W=U[B],Z=_(W);typeof W=="number"||typeof W=="boolean"?(I.__data[0]=W,s.bufferSubData(s.UNIFORM_BUFFER,L+G,I.__data)):W.isMatrix3?(I.__data[0]=W.elements[0],I.__data[1]=W.elements[1],I.__data[2]=W.elements[2],I.__data[3]=0,I.__data[4]=W.elements[3],I.__data[5]=W.elements[4],I.__data[6]=W.elements[5],I.__data[7]=0,I.__data[8]=W.elements[6],I.__data[9]=W.elements[7],I.__data[10]=W.elements[8],I.__data[11]=0):(W.toArray(I.__data,G),G+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,L,I.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(b,S,x,A){let w=b.value,P=S+"_"+x;if(A[P]===void 0)return typeof w=="number"||typeof w=="boolean"?A[P]=w:A[P]=w.clone(),!0;{let C=A[P];if(typeof w=="number"||typeof w=="boolean"){if(C!==w)return A[P]=w,!0}else if(C.equals(w)===!1)return C.copy(w),!0}return!1}function g(b){let S=b.uniforms,x=0,A=16;for(let P=0,C=S.length;P<C;P++){let M=Array.isArray(S[P])?S[P]:[S[P]];for(let v=0,I=M.length;v<I;v++){let L=M[v],U=Array.isArray(L.value)?L.value:[L.value];for(let G=0,B=U.length;G<B;G++){let W=U[G],Z=_(W),k=x%A,j=k%Z.boundary,at=k+j;x+=j,at!==0&&A-at<Z.storage&&(x+=A-at),L.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=x,x+=Z.storage}}}let w=x%A;return w>0&&(x+=A-w),b.__size=x,b.__cache={},this}function _(b){let S={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(S.boundary=4,S.storage=4):b.isVector2?(S.boundary=8,S.storage=8):b.isVector3||b.isColor?(S.boundary=16,S.storage=12):b.isVector4?(S.boundary=16,S.storage=16):b.isMatrix3?(S.boundary=48,S.storage=48):b.isMatrix4?(S.boundary=64,S.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),S}function m(b){let S=b.target;S.removeEventListener("dispose",m);let x=o.indexOf(S.__bindingPointIndex);o.splice(x,1),s.deleteBuffer(i[S.id]),delete i[S.id],delete r[S.id]}function p(){for(let b in i)s.deleteBuffer(i[b]);o=[],i={},r={}}return{bind:l,update:c,dispose:p}}var ml=class{constructor(t={}){let{canvas:e=cd(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,p=null,b=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=gi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let x=this,A=!1;this._outputColorSpace=ke;let w=0,P=0,C=null,M=-1,v=null,I=new de,L=new de,U=null,G=new Ot(0),B=0,W=e.width,Z=e.height,k=1,j=null,at=null,nt=new de(0,0,W,Z),ft=new de(0,0,W,Z),Ut=!1,Lt=new zs,Ct=!1,V=!1,$=new Gt,vt=new R,bt=new de,Tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},jt=!1;function ce(){return C===null?k:1}let D=n;function it(E,N){return e.getContext(E,N)}try{let E={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",mt,!1),e.addEventListener("webglcontextrestored",Rt,!1),e.addEventListener("webglcontextcreationerror",lt,!1),D===null){let N="webgl2";if(D=it(N,E),D===null)throw it(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let tt,Q,K,pt,rt,_t,Zt,Wt,T,y,z,H,J,X,ht,ut,wt,Pt,ot,Mt,zt,It,xt,$t;function F(){tt=new Og(D),tt.init(),It=new px(D,tt),Q=new Pg(D,tt,t,It),K=new dx(D,tt),Q.reversedDepthBuffer&&d&&K.buffers.depth.setReversed(!0),pt=new Hg(D),rt=new j_,_t=new fx(D,tt,K,rt,Q,It,pt),Zt=new Dg(x),Wt=new Ng(x),T=new qp(D),xt=new Rg(D,T),y=new Bg(D,T,pt,xt),z=new Gg(D,y,T,pt),ot=new kg(D,Q,_t),ut=new Ig(rt),H=new Q_(x,Zt,Wt,tt,Q,xt,ut),J=new xx(x,rt),X=new ex,ht=new ax(tt),Pt=new Ag(x,Zt,Wt,K,z,f,l),wt=new hx(x,z,Q),$t=new yx(D,pt,Q,K),Mt=new Cg(D,tt,pt),zt=new zg(D,tt,pt),pt.programs=H.programs,x.capabilities=Q,x.extensions=tt,x.properties=rt,x.renderLists=X,x.shadowMap=wt,x.state=K,x.info=pt}F();let ct=new mh(x,D);this.xr=ct,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let E=tt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=tt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(E){E!==void 0&&(k=E,this.setSize(W,Z,!1))},this.getSize=function(E){return E.set(W,Z)},this.setSize=function(E,N,q=!0){if(ct.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=E,Z=N,e.width=Math.floor(E*k),e.height=Math.floor(N*k),q===!0&&(e.style.width=E+"px",e.style.height=N+"px"),this.setViewport(0,0,E,N)},this.getDrawingBufferSize=function(E){return E.set(W*k,Z*k).floor()},this.setDrawingBufferSize=function(E,N,q){W=E,Z=N,k=q,e.width=Math.floor(E*q),e.height=Math.floor(N*q),this.setViewport(0,0,E,N)},this.getCurrentViewport=function(E){return E.copy(I)},this.getViewport=function(E){return E.copy(nt)},this.setViewport=function(E,N,q,Y){E.isVector4?nt.set(E.x,E.y,E.z,E.w):nt.set(E,N,q,Y),K.viewport(I.copy(nt).multiplyScalar(k).round())},this.getScissor=function(E){return E.copy(ft)},this.setScissor=function(E,N,q,Y){E.isVector4?ft.set(E.x,E.y,E.z,E.w):ft.set(E,N,q,Y),K.scissor(L.copy(ft).multiplyScalar(k).round())},this.getScissorTest=function(){return Ut},this.setScissorTest=function(E){K.setScissorTest(Ut=E)},this.setOpaqueSort=function(E){j=E},this.setTransparentSort=function(E){at=E},this.getClearColor=function(E){return E.copy(Pt.getClearColor())},this.setClearColor=function(){Pt.setClearColor(...arguments)},this.getClearAlpha=function(){return Pt.getClearAlpha()},this.setClearAlpha=function(){Pt.setClearAlpha(...arguments)},this.clear=function(E=!0,N=!0,q=!0){let Y=0;if(E){let O=!1;if(C!==null){let dt=C.texture.format;O=dt===Oa||dt===Na||dt===Ua}if(O){let dt=C.texture.type,Et=dt===Fn||dt===Li||dt===Ws||dt===qs||dt===Da||dt===La,Nt=Pt.getClearColor(),Dt=Pt.getClearAlpha(),kt=Nt.r,Xt=Nt.g,Bt=Nt.b;Et?(g[0]=kt,g[1]=Xt,g[2]=Bt,g[3]=Dt,D.clearBufferuiv(D.COLOR,0,g)):(_[0]=kt,_[1]=Xt,_[2]=Bt,_[3]=Dt,D.clearBufferiv(D.COLOR,0,_))}else Y|=D.COLOR_BUFFER_BIT}N&&(Y|=D.DEPTH_BUFFER_BIT),q&&(Y|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",mt,!1),e.removeEventListener("webglcontextrestored",Rt,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),Pt.dispose(),X.dispose(),ht.dispose(),rt.dispose(),Zt.dispose(),Wt.dispose(),z.dispose(),xt.dispose(),$t.dispose(),H.dispose(),ct.dispose(),ct.removeEventListener("sessionstart",On),ct.removeEventListener("sessionend",Gh),Bi.stop()};function mt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function Rt(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;let E=pt.autoReset,N=wt.enabled,q=wt.autoUpdate,Y=wt.needsUpdate,O=wt.type;F(),pt.autoReset=E,wt.enabled=N,wt.autoUpdate=q,wt.needsUpdate=Y,wt.type=O}function lt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function et(E){let N=E.target;N.removeEventListener("dispose",et),Ft(N)}function Ft(E){Jt(E),rt.remove(E)}function Jt(E){let N=rt.get(E).programs;N!==void 0&&(N.forEach(function(q){H.releaseProgram(q)}),E.isShaderMaterial&&H.releaseShaderCache(E))}this.renderBufferDirect=function(E,N,q,Y,O,dt){N===null&&(N=Tt);let Et=O.isMesh&&O.matrixWorld.determinant()<0,Nt=Ff(E,N,q,Y,O);K.setMaterial(Y,Et);let Dt=q.index,kt=1;if(Y.wireframe===!0){if(Dt=y.getWireframeAttribute(q),Dt===void 0)return;kt=2}let Xt=q.drawRange,Bt=q.attributes.position,ie=Xt.start*kt,ge=(Xt.start+Xt.count)*kt;dt!==null&&(ie=Math.max(ie,dt.start*kt),ge=Math.min(ge,(dt.start+dt.count)*kt)),Dt!==null?(ie=Math.max(ie,0),ge=Math.min(ge,Dt.count)):Bt!=null&&(ie=Math.max(ie,0),ge=Math.min(ge,Bt.count));let Pe=ge-ie;if(Pe<0||Pe===1/0)return;xt.setup(O,Y,Nt,q,Dt);let Ee,ye=Mt;if(Dt!==null&&(Ee=T.get(Dt),ye=zt,ye.setIndex(Ee)),O.isMesh)Y.wireframe===!0?(K.setLineWidth(Y.wireframeLinewidth*ce()),ye.setMode(D.LINES)):ye.setMode(D.TRIANGLES);else if(O.isLine){let Ht=Y.linewidth;Ht===void 0&&(Ht=1),K.setLineWidth(Ht*ce()),O.isLineSegments?ye.setMode(D.LINES):O.isLineLoop?ye.setMode(D.LINE_LOOP):ye.setMode(D.LINE_STRIP)}else O.isPoints?ye.setMode(D.POINTS):O.isSprite&&ye.setMode(D.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)Ns("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ye.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(tt.get("WEBGL_multi_draw"))ye.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Ht=O._multiDrawStarts,we=O._multiDrawCounts,le=O._multiDrawCount,ln=Dt?T.get(Dt).bytesPerElement:1,gs=rt.get(Y).currentProgram.getUniforms();for(let cn=0;cn<le;cn++)gs.setValue(D,"_gl_DrawID",cn),ye.render(Ht[cn]/ln,we[cn])}else if(O.isInstancedMesh)ye.renderInstances(ie,Pe,O.count);else if(q.isInstancedBufferGeometry){let Ht=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,we=Math.min(q.instanceCount,Ht);ye.renderInstances(ie,Pe,we)}else ye.render(ie,Pe)};function he(E,N,q){E.transparent===!0&&E.side===Fe&&E.forceSinglePass===!1?(E.side=We,E.needsUpdate=!0,uo(E,N,q),E.side=ci,E.needsUpdate=!0,uo(E,N,q),E.side=Fe):uo(E,N,q)}this.compile=function(E,N,q=null){q===null&&(q=E),p=ht.get(q),p.init(N),S.push(p),q.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),E!==q&&E.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights();let Y=new Set;return E.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let dt=O.material;if(dt)if(Array.isArray(dt))for(let Et=0;Et<dt.length;Et++){let Nt=dt[Et];he(Nt,q,O),Y.add(Nt)}else he(dt,q,O),Y.add(dt)}),p=S.pop(),Y},this.compileAsync=function(E,N,q=null){let Y=this.compile(E,N,q);return new Promise(O=>{function dt(){if(Y.forEach(function(Et){rt.get(Et).currentProgram.isReady()&&Y.delete(Et)}),Y.size===0){O(E);return}setTimeout(dt,10)}tt.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let ue=null;function ti(E){ue&&ue(E)}function On(){Bi.stop()}function Gh(){Bi.start()}let Bi=new Gd;Bi.setAnimationLoop(ti),typeof self!="undefined"&&Bi.setContext(self),this.setAnimationLoop=function(E){ue=E,ct.setAnimationLoop(E),E===null?Bi.stop():Bi.start()},ct.addEventListener("sessionstart",On),ct.addEventListener("sessionend",Gh),this.render=function(E,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),ct.enabled===!0&&ct.isPresenting===!0&&(ct.cameraAutoUpdate===!0&&ct.updateCamera(N),N=ct.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,N,C),p=ht.get(E,S.length),p.init(N),S.push(p),$.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Lt.setFromProjectionMatrix($,In,N.reversedDepth),V=this.localClippingEnabled,Ct=ut.init(this.clippingPlanes,V),m=X.get(E,b.length),m.init(),b.push(m),ct.enabled===!0&&ct.isPresenting===!0){let dt=x.xr.getDepthSensingMesh();dt!==null&&Wl(dt,N,-1/0,x.sortObjects)}Wl(E,N,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(j,at),jt=ct.enabled===!1||ct.isPresenting===!1||ct.hasDepthSensing()===!1,jt&&Pt.addToRenderList(m,E),this.info.render.frame++,Ct===!0&&ut.beginShadows();let q=p.state.shadowsArray;wt.render(q,E,N),Ct===!0&&ut.endShadows(),this.info.autoReset===!0&&this.info.reset();let Y=m.opaque,O=m.transmissive;if(p.setupLights(),N.isArrayCamera){let dt=N.cameras;if(O.length>0)for(let Et=0,Nt=dt.length;Et<Nt;Et++){let Dt=dt[Et];Wh(Y,O,E,Dt)}jt&&Pt.render(E);for(let Et=0,Nt=dt.length;Et<Nt;Et++){let Dt=dt[Et];Vh(m,E,Dt,Dt.viewport)}}else O.length>0&&Wh(Y,O,E,N),jt&&Pt.render(E),Vh(m,E,N);C!==null&&P===0&&(_t.updateMultisampleRenderTarget(C),_t.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(x,E,N),xt.resetDefaultState(),M=-1,v=null,S.pop(),S.length>0?(p=S[S.length-1],Ct===!0&&ut.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function Wl(E,N,q,Y){if(E.visible===!1)return;if(E.layers.test(N.layers)){if(E.isGroup)q=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(N);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Lt.intersectsSprite(E)){Y&&bt.setFromMatrixPosition(E.matrixWorld).applyMatrix4($);let Et=z.update(E),Nt=E.material;Nt.visible&&m.push(E,Et,Nt,q,bt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Lt.intersectsObject(E))){let Et=z.update(E),Nt=E.material;if(Y&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),bt.copy(E.boundingSphere.center)):(Et.boundingSphere===null&&Et.computeBoundingSphere(),bt.copy(Et.boundingSphere.center)),bt.applyMatrix4(E.matrixWorld).applyMatrix4($)),Array.isArray(Nt)){let Dt=Et.groups;for(let kt=0,Xt=Dt.length;kt<Xt;kt++){let Bt=Dt[kt],ie=Nt[Bt.materialIndex];ie&&ie.visible&&m.push(E,Et,ie,q,bt.z,Bt)}}else Nt.visible&&m.push(E,Et,Nt,q,bt.z,null)}}let dt=E.children;for(let Et=0,Nt=dt.length;Et<Nt;Et++)Wl(dt[Et],N,q,Y)}function Vh(E,N,q,Y){let O=E.opaque,dt=E.transmissive,Et=E.transparent;p.setupLightsView(q),Ct===!0&&ut.setGlobalState(x.clippingPlanes,q),Y&&K.viewport(I.copy(Y)),O.length>0&&ho(O,N,q),dt.length>0&&ho(dt,N,q),Et.length>0&&ho(Et,N,q),K.buffers.depth.setTest(!0),K.buffers.depth.setMask(!0),K.buffers.color.setMask(!0),K.setPolygonOffset(!1)}function Wh(E,N,q,Y){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Y.id]===void 0&&(p.state.transmissionRenderTarget[Y.id]=new kn(1,1,{generateMipmaps:!0,type:tt.has("EXT_color_buffer_half_float")||tt.has("EXT_color_buffer_float")?Xs:Fn,minFilter:Xn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ae.workingColorSpace}));let dt=p.state.transmissionRenderTarget[Y.id],Et=Y.viewport||I;dt.setSize(Et.z*x.transmissionResolutionScale,Et.w*x.transmissionResolutionScale);let Nt=x.getRenderTarget(),Dt=x.getActiveCubeFace(),kt=x.getActiveMipmapLevel();x.setRenderTarget(dt),x.getClearColor(G),B=x.getClearAlpha(),B<1&&x.setClearColor(16777215,.5),x.clear(),jt&&Pt.render(q);let Xt=x.toneMapping;x.toneMapping=gi;let Bt=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),p.setupLightsView(Y),Ct===!0&&ut.setGlobalState(x.clippingPlanes,Y),ho(E,q,Y),_t.updateMultisampleRenderTarget(dt),_t.updateRenderTargetMipmap(dt),tt.has("WEBGL_multisampled_render_to_texture")===!1){let ie=!1;for(let ge=0,Pe=N.length;ge<Pe;ge++){let Ee=N[ge],ye=Ee.object,Ht=Ee.geometry,we=Ee.material,le=Ee.group;if(we.side===Fe&&ye.layers.test(Y.layers)){let ln=we.side;we.side=We,we.needsUpdate=!0,Xh(ye,q,Y,Ht,we,le),we.side=ln,we.needsUpdate=!0,ie=!0}}ie===!0&&(_t.updateMultisampleRenderTarget(dt),_t.updateRenderTargetMipmap(dt))}x.setRenderTarget(Nt,Dt,kt),x.setClearColor(G,B),Bt!==void 0&&(Y.viewport=Bt),x.toneMapping=Xt}function ho(E,N,q){let Y=N.isScene===!0?N.overrideMaterial:null;for(let O=0,dt=E.length;O<dt;O++){let Et=E[O],Nt=Et.object,Dt=Et.geometry,kt=Et.group,Xt=Et.material;Xt.allowOverride===!0&&Y!==null&&(Xt=Y),Nt.layers.test(q.layers)&&Xh(Nt,N,q,Dt,Xt,kt)}}function Xh(E,N,q,Y,O,dt){E.onBeforeRender(x,N,q,Y,O,dt),E.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),O.onBeforeRender(x,N,q,Y,E,dt),O.transparent===!0&&O.side===Fe&&O.forceSinglePass===!1?(O.side=We,O.needsUpdate=!0,x.renderBufferDirect(q,N,Y,O,E,dt),O.side=ci,O.needsUpdate=!0,x.renderBufferDirect(q,N,Y,O,E,dt),O.side=Fe):x.renderBufferDirect(q,N,Y,O,E,dt),E.onAfterRender(x,N,q,Y,O,dt)}function uo(E,N,q){N.isScene!==!0&&(N=Tt);let Y=rt.get(E),O=p.state.lights,dt=p.state.shadowsArray,Et=O.state.version,Nt=H.getParameters(E,O.state,dt,N,q),Dt=H.getProgramCacheKey(Nt),kt=Y.programs;Y.environment=E.isMeshStandardMaterial?N.environment:null,Y.fog=N.fog,Y.envMap=(E.isMeshStandardMaterial?Wt:Zt).get(E.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&E.envMap===null?N.environmentRotation:E.envMapRotation,kt===void 0&&(E.addEventListener("dispose",et),kt=new Map,Y.programs=kt);let Xt=kt.get(Dt);if(Xt!==void 0){if(Y.currentProgram===Xt&&Y.lightsStateVersion===Et)return Yh(E,Nt),Xt}else Nt.uniforms=H.getUniforms(E),E.onBeforeCompile(Nt,x),Xt=H.acquireProgram(Nt,Dt),kt.set(Dt,Xt),Y.uniforms=Nt.uniforms;let Bt=Y.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Bt.clippingPlanes=ut.uniform),Yh(E,Nt),Y.needsLights=Nf(E),Y.lightsStateVersion=Et,Y.needsLights&&(Bt.ambientLightColor.value=O.state.ambient,Bt.lightProbe.value=O.state.probe,Bt.directionalLights.value=O.state.directional,Bt.directionalLightShadows.value=O.state.directionalShadow,Bt.spotLights.value=O.state.spot,Bt.spotLightShadows.value=O.state.spotShadow,Bt.rectAreaLights.value=O.state.rectArea,Bt.ltc_1.value=O.state.rectAreaLTC1,Bt.ltc_2.value=O.state.rectAreaLTC2,Bt.pointLights.value=O.state.point,Bt.pointLightShadows.value=O.state.pointShadow,Bt.hemisphereLights.value=O.state.hemi,Bt.directionalShadowMap.value=O.state.directionalShadowMap,Bt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Bt.spotShadowMap.value=O.state.spotShadowMap,Bt.spotLightMatrix.value=O.state.spotLightMatrix,Bt.spotLightMap.value=O.state.spotLightMap,Bt.pointShadowMap.value=O.state.pointShadowMap,Bt.pointShadowMatrix.value=O.state.pointShadowMatrix),Y.currentProgram=Xt,Y.uniformsList=null,Xt}function qh(E){if(E.uniformsList===null){let N=E.currentProgram.getUniforms();E.uniformsList=Js.seqWithValue(N.seq,E.uniforms)}return E.uniformsList}function Yh(E,N){let q=rt.get(E);q.outputColorSpace=N.outputColorSpace,q.batching=N.batching,q.batchingColor=N.batchingColor,q.instancing=N.instancing,q.instancingColor=N.instancingColor,q.instancingMorph=N.instancingMorph,q.skinning=N.skinning,q.morphTargets=N.morphTargets,q.morphNormals=N.morphNormals,q.morphColors=N.morphColors,q.morphTargetsCount=N.morphTargetsCount,q.numClippingPlanes=N.numClippingPlanes,q.numIntersection=N.numClipIntersection,q.vertexAlphas=N.vertexAlphas,q.vertexTangents=N.vertexTangents,q.toneMapping=N.toneMapping}function Ff(E,N,q,Y,O){N.isScene!==!0&&(N=Tt),_t.resetTextureUnits();let dt=N.fog,Et=Y.isMeshStandardMaterial?N.environment:null,Nt=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:qi,Dt=(Y.isMeshStandardMaterial?Wt:Zt).get(Y.envMap||Et),kt=Y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Xt=!!q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Bt=!!q.morphAttributes.position,ie=!!q.morphAttributes.normal,ge=!!q.morphAttributes.color,Pe=gi;Y.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Pe=x.toneMapping);let Ee=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ye=Ee!==void 0?Ee.length:0,Ht=rt.get(Y),we=p.state.lights;if(Ct===!0&&(V===!0||E!==v)){let Ke=E===v&&Y.id===M;ut.setState(Y,E,Ke)}let le=!1;Y.version===Ht.__version?(Ht.needsLights&&Ht.lightsStateVersion!==we.state.version||Ht.outputColorSpace!==Nt||O.isBatchedMesh&&Ht.batching===!1||!O.isBatchedMesh&&Ht.batching===!0||O.isBatchedMesh&&Ht.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ht.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ht.instancing===!1||!O.isInstancedMesh&&Ht.instancing===!0||O.isSkinnedMesh&&Ht.skinning===!1||!O.isSkinnedMesh&&Ht.skinning===!0||O.isInstancedMesh&&Ht.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ht.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ht.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ht.instancingMorph===!1&&O.morphTexture!==null||Ht.envMap!==Dt||Y.fog===!0&&Ht.fog!==dt||Ht.numClippingPlanes!==void 0&&(Ht.numClippingPlanes!==ut.numPlanes||Ht.numIntersection!==ut.numIntersection)||Ht.vertexAlphas!==kt||Ht.vertexTangents!==Xt||Ht.morphTargets!==Bt||Ht.morphNormals!==ie||Ht.morphColors!==ge||Ht.toneMapping!==Pe||Ht.morphTargetsCount!==ye)&&(le=!0):(le=!0,Ht.__version=Y.version);let ln=Ht.currentProgram;le===!0&&(ln=uo(Y,N,O));let gs=!1,cn=!1,cr=!1,Ae=ln.getUniforms(),yn=Ht.uniforms;if(K.useProgram(ln.program)&&(gs=!0,cn=!0,cr=!0),Y.id!==M&&(M=Y.id,cn=!0),gs||v!==E){K.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),Ae.setValue(D,"projectionMatrix",E.projectionMatrix),Ae.setValue(D,"viewMatrix",E.matrixWorldInverse);let nn=Ae.map.cameraPosition;nn!==void 0&&nn.setValue(D,vt.setFromMatrixPosition(E.matrixWorld)),Q.logarithmicDepthBuffer&&Ae.setValue(D,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&Ae.setValue(D,"isOrthographic",E.isOrthographicCamera===!0),v!==E&&(v=E,cn=!0,cr=!0)}if(O.isSkinnedMesh){Ae.setOptional(D,O,"bindMatrix"),Ae.setOptional(D,O,"bindMatrixInverse");let Ke=O.skeleton;Ke&&(Ke.boneTexture===null&&Ke.computeBoneTexture(),Ae.setValue(D,"boneTexture",Ke.boneTexture,_t))}O.isBatchedMesh&&(Ae.setOptional(D,O,"batchingTexture"),Ae.setValue(D,"batchingTexture",O._matricesTexture,_t),Ae.setOptional(D,O,"batchingIdTexture"),Ae.setValue(D,"batchingIdTexture",O._indirectTexture,_t),Ae.setOptional(D,O,"batchingColorTexture"),O._colorsTexture!==null&&Ae.setValue(D,"batchingColorTexture",O._colorsTexture,_t));let vn=q.morphAttributes;if((vn.position!==void 0||vn.normal!==void 0||vn.color!==void 0)&&ot.update(O,q,ln),(cn||Ht.receiveShadow!==O.receiveShadow)&&(Ht.receiveShadow=O.receiveShadow,Ae.setValue(D,"receiveShadow",O.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(yn.envMap.value=Dt,yn.flipEnvMap.value=Dt.isCubeTexture&&Dt.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&N.environment!==null&&(yn.envMapIntensity.value=N.environmentIntensity),cn&&(Ae.setValue(D,"toneMappingExposure",x.toneMappingExposure),Ht.needsLights&&Uf(yn,cr),dt&&Y.fog===!0&&J.refreshFogUniforms(yn,dt),J.refreshMaterialUniforms(yn,Y,k,Z,p.state.transmissionRenderTarget[E.id]),Js.upload(D,qh(Ht),yn,_t)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Js.upload(D,qh(Ht),yn,_t),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&Ae.setValue(D,"center",O.center),Ae.setValue(D,"modelViewMatrix",O.modelViewMatrix),Ae.setValue(D,"normalMatrix",O.normalMatrix),Ae.setValue(D,"modelMatrix",O.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){let Ke=Y.uniformsGroups;for(let nn=0,Xl=Ke.length;nn<Xl;nn++){let zi=Ke[nn];$t.update(zi,ln),$t.bind(zi,ln)}}return ln}function Uf(E,N){E.ambientLightColor.needsUpdate=N,E.lightProbe.needsUpdate=N,E.directionalLights.needsUpdate=N,E.directionalLightShadows.needsUpdate=N,E.pointLights.needsUpdate=N,E.pointLightShadows.needsUpdate=N,E.spotLights.needsUpdate=N,E.spotLightShadows.needsUpdate=N,E.rectAreaLights.needsUpdate=N,E.hemisphereLights.needsUpdate=N}function Nf(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,N,q){let Y=rt.get(E);Y.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),rt.get(E.texture).__webglTexture=N,rt.get(E.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:q,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,N){let q=rt.get(E);q.__webglFramebuffer=N,q.__useDefaultFramebuffer=N===void 0};let Of=D.createFramebuffer();this.setRenderTarget=function(E,N=0,q=0){C=E,w=N,P=q;let Y=!0,O=null,dt=!1,Et=!1;if(E){let Dt=rt.get(E);if(Dt.__useDefaultFramebuffer!==void 0)K.bindFramebuffer(D.FRAMEBUFFER,null),Y=!1;else if(Dt.__webglFramebuffer===void 0)_t.setupRenderTarget(E);else if(Dt.__hasExternalTextures)_t.rebindTextures(E,rt.get(E.texture).__webglTexture,rt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Bt=E.depthTexture;if(Dt.__boundDepthTexture!==Bt){if(Bt!==null&&rt.has(Bt)&&(E.width!==Bt.image.width||E.height!==Bt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");_t.setupDepthRenderbuffer(E)}}let kt=E.texture;(kt.isData3DTexture||kt.isDataArrayTexture||kt.isCompressedArrayTexture)&&(Et=!0);let Xt=rt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Xt[N])?O=Xt[N][q]:O=Xt[N],dt=!0):E.samples>0&&_t.useMultisampledRTT(E)===!1?O=rt.get(E).__webglMultisampledFramebuffer:Array.isArray(Xt)?O=Xt[q]:O=Xt,I.copy(E.viewport),L.copy(E.scissor),U=E.scissorTest}else I.copy(nt).multiplyScalar(k).floor(),L.copy(ft).multiplyScalar(k).floor(),U=Ut;if(q!==0&&(O=Of),K.bindFramebuffer(D.FRAMEBUFFER,O)&&Y&&K.drawBuffers(E,O),K.viewport(I),K.scissor(L),K.setScissorTest(U),dt){let Dt=rt.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+N,Dt.__webglTexture,q)}else if(Et){let Dt=N;for(let kt=0;kt<E.textures.length;kt++){let Xt=rt.get(E.textures[kt]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+kt,Xt.__webglTexture,q,Dt)}}else if(E!==null&&q!==0){let Dt=rt.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Dt.__webglTexture,q)}M=-1},this.readRenderTargetPixels=function(E,N,q,Y,O,dt,Et,Nt=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=rt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Et!==void 0&&(Dt=Dt[Et]),Dt){K.bindFramebuffer(D.FRAMEBUFFER,Dt);try{let kt=E.textures[Nt],Xt=kt.format,Bt=kt.type;if(!Q.textureFormatReadable(Xt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Q.textureTypeReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=E.width-Y&&q>=0&&q<=E.height-O&&(E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Nt),D.readPixels(N,q,Y,O,It.convert(Xt),It.convert(Bt),dt))}finally{let kt=C!==null?rt.get(C).__webglFramebuffer:null;K.bindFramebuffer(D.FRAMEBUFFER,kt)}}},this.readRenderTargetPixelsAsync=async function(E,N,q,Y,O,dt,Et,Nt=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Dt=rt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Et!==void 0&&(Dt=Dt[Et]),Dt)if(N>=0&&N<=E.width-Y&&q>=0&&q<=E.height-O){K.bindFramebuffer(D.FRAMEBUFFER,Dt);let kt=E.textures[Nt],Xt=kt.format,Bt=kt.type;if(!Q.textureFormatReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Q.textureTypeReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ie=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,ie),D.bufferData(D.PIXEL_PACK_BUFFER,dt.byteLength,D.STREAM_READ),E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Nt),D.readPixels(N,q,Y,O,It.convert(Xt),It.convert(Bt),0);let ge=C!==null?rt.get(C).__webglFramebuffer:null;K.bindFramebuffer(D.FRAMEBUFFER,ge);let Pe=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await hd(D,Pe,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,ie),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,dt),D.deleteBuffer(ie),D.deleteSync(Pe),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,N=null,q=0){let Y=Math.pow(2,-q),O=Math.floor(E.image.width*Y),dt=Math.floor(E.image.height*Y),Et=N!==null?N.x:0,Nt=N!==null?N.y:0;_t.setTexture2D(E,0),D.copyTexSubImage2D(D.TEXTURE_2D,q,0,0,Et,Nt,O,dt),K.unbindTexture()};let Bf=D.createFramebuffer(),zf=D.createFramebuffer();this.copyTextureToTexture=function(E,N,q=null,Y=null,O=0,dt=null){dt===null&&(O!==0?(Ns("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),dt=O,O=0):dt=0);let Et,Nt,Dt,kt,Xt,Bt,ie,ge,Pe,Ee=E.isCompressedTexture?E.mipmaps[dt]:E.image;if(q!==null)Et=q.max.x-q.min.x,Nt=q.max.y-q.min.y,Dt=q.isBox3?q.max.z-q.min.z:1,kt=q.min.x,Xt=q.min.y,Bt=q.isBox3?q.min.z:0;else{let vn=Math.pow(2,-O);Et=Math.floor(Ee.width*vn),Nt=Math.floor(Ee.height*vn),E.isDataArrayTexture?Dt=Ee.depth:E.isData3DTexture?Dt=Math.floor(Ee.depth*vn):Dt=1,kt=0,Xt=0,Bt=0}Y!==null?(ie=Y.x,ge=Y.y,Pe=Y.z):(ie=0,ge=0,Pe=0);let ye=It.convert(N.format),Ht=It.convert(N.type),we;N.isData3DTexture?(_t.setTexture3D(N,0),we=D.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(_t.setTexture2DArray(N,0),we=D.TEXTURE_2D_ARRAY):(_t.setTexture2D(N,0),we=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,N.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,N.unpackAlignment);let le=D.getParameter(D.UNPACK_ROW_LENGTH),ln=D.getParameter(D.UNPACK_IMAGE_HEIGHT),gs=D.getParameter(D.UNPACK_SKIP_PIXELS),cn=D.getParameter(D.UNPACK_SKIP_ROWS),cr=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,Ee.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Ee.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,kt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Xt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Bt);let Ae=E.isDataArrayTexture||E.isData3DTexture,yn=N.isDataArrayTexture||N.isData3DTexture;if(E.isDepthTexture){let vn=rt.get(E),Ke=rt.get(N),nn=rt.get(vn.__renderTarget),Xl=rt.get(Ke.__renderTarget);K.bindFramebuffer(D.READ_FRAMEBUFFER,nn.__webglFramebuffer),K.bindFramebuffer(D.DRAW_FRAMEBUFFER,Xl.__webglFramebuffer);for(let zi=0;zi<Dt;zi++)Ae&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,rt.get(E).__webglTexture,O,Bt+zi),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,rt.get(N).__webglTexture,dt,Pe+zi)),D.blitFramebuffer(kt,Xt,Et,Nt,ie,ge,Et,Nt,D.DEPTH_BUFFER_BIT,D.NEAREST);K.bindFramebuffer(D.READ_FRAMEBUFFER,null),K.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(O!==0||E.isRenderTargetTexture||rt.has(E)){let vn=rt.get(E),Ke=rt.get(N);K.bindFramebuffer(D.READ_FRAMEBUFFER,Bf),K.bindFramebuffer(D.DRAW_FRAMEBUFFER,zf);for(let nn=0;nn<Dt;nn++)Ae?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,vn.__webglTexture,O,Bt+nn):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,vn.__webglTexture,O),yn?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ke.__webglTexture,dt,Pe+nn):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Ke.__webglTexture,dt),O!==0?D.blitFramebuffer(kt,Xt,Et,Nt,ie,ge,Et,Nt,D.COLOR_BUFFER_BIT,D.NEAREST):yn?D.copyTexSubImage3D(we,dt,ie,ge,Pe+nn,kt,Xt,Et,Nt):D.copyTexSubImage2D(we,dt,ie,ge,kt,Xt,Et,Nt);K.bindFramebuffer(D.READ_FRAMEBUFFER,null),K.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else yn?E.isDataTexture||E.isData3DTexture?D.texSubImage3D(we,dt,ie,ge,Pe,Et,Nt,Dt,ye,Ht,Ee.data):N.isCompressedArrayTexture?D.compressedTexSubImage3D(we,dt,ie,ge,Pe,Et,Nt,Dt,ye,Ee.data):D.texSubImage3D(we,dt,ie,ge,Pe,Et,Nt,Dt,ye,Ht,Ee):E.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,dt,ie,ge,Et,Nt,ye,Ht,Ee.data):E.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,dt,ie,ge,Ee.width,Ee.height,ye,Ee.data):D.texSubImage2D(D.TEXTURE_2D,dt,ie,ge,Et,Nt,ye,Ht,Ee);D.pixelStorei(D.UNPACK_ROW_LENGTH,le),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ln),D.pixelStorei(D.UNPACK_SKIP_PIXELS,gs),D.pixelStorei(D.UNPACK_SKIP_ROWS,cn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,cr),dt===0&&N.generateMipmaps&&D.generateMipmap(we),K.unbindTexture()},this.initRenderTarget=function(E){rt.get(E).__webglFramebuffer===void 0&&_t.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?_t.setTextureCube(E,0):E.isData3DTexture?_t.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?_t.setTexture2DArray(E,0):_t.setTexture2D(E,0),K.unbindTexture()},this.resetState=function(){w=0,P=0,C=null,K.reset(),xt.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return In}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ae._getDrawingBufferColorSpace(t),e.unpackColorSpace=ae._getUnpackColorSpace()}};var _l="v9-cinematic-1",Ue=Math.PI/180,yt=Math.PI*2,tr=52,er=3.06,xh=.34,cs=.085,rn=.02,Zn=rn+cs;var Yd=5,xl=2.46,yl=.4,yh=.3,$n=1.95,Fi=.095,hs=Zn+Fi,vl=.34,Ml=1.5,Ui=24,vh=.42,us={x:-.072,z:-.1,s:.84},Zd={u:.58,v:.7},$d=1.015,_n={w:11.4,d:12.6,h:.2,r:.55,z:1.8},Je={w:9.6,d:9.4,r:.3,z:.6},gt={wallZ:-4.66,wallW:30,wallH:12,wallBottom:-.34,window:{x:1.02,y:.78,w:2.15,h:1.18,z:-4.6},shade:.34,lamp:{x:-2.1,y:.88,z:-4.3},floorY:-.34},En={r:.44,h:.1,ringR:.6,starR:.2},xn=["red","yellow","blue","green"],Mh={red:0,yellow:13,blue:26,green:39},_i={red:50,yellow:11,blue:24,green:37},nr={red:31,yellow:121,blue:211,green:301},Jd=[5,29],Kd={1:"truth",2:"truth",5:"truth",9:"truth",12:"truth",16:"truth",17:"truth",23:"truth",25:"truth",28:"truth",31:"truth",38:"truth",42:"truth",43:"truth",51:"truth",4:"dare",6:"dare",15:"dare",18:"dare",19:"dare",22:"dare",27:"dare",30:"dare",32:"dare",35:"dare",41:"dare",44:"dare",45:"dare",48:"dare",49:"dare",3:"touch",8:"touch",21:"touch",29:"touch",34:"touch",47:"touch",10:"thermo",36:"thermo",14:"wheel",40:"wheel"};Jd.forEach(s=>{Kd[s]="fate"});var Se={red:13194314,yellow:14131786,blue:6193072,green:6066034};var Qd={takeoff:"起飞",fly:"飞点",forbid:"禁跳",fate:"命运",entry:"进航",truth:"真心话",dare:"敢做",touch:"触碰",thermo:"温度计",wheel:"转盘",ring:"普通"},Sl=s=>(s%tr+tr)%tr,ds=s=>xn[(s%4+4)%4],vx=s=>Mh[ds(s)]===s,Mx=s=>Sl(Mh[ds(s)]+20)===s,Sx=s=>Sl(Mh[ds(s)]+48)===s,bx=s=>xn.some(t=>_i[t]===s);function bl(s){return vx(s)?"takeoff":Mx(s)?"fly":Sx(s)?"forbid":Jd.indexOf(s)>=0?"fate":bx(s)?"entry":Kd[s]||"ring"}var Jn=s=>s*yt/tr,re=(s,t,e)=>s<t?t:s>e?e:s,oe=(s,t,e)=>s+(t-s)*e,fs=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,El=s=>1-Math.pow(1-s,3),ir=(s,t,e)=>{let n=re((e-s)/(t-s),0,1);return n*n*(3-2*n)};function Tl(s,t){return((t-s+Math.PI)%yt+yt)%yt-Math.PI}var Sh=["takeoff","fly","forbid","fate","entry","truth","dare","touch","thermo","wheel","ring"],sr=0,wl=45,Al=49,jd=53,Yn=8,tf=64,Rl=(s,t)=>1+Math.max(0,Sh.indexOf(s))*4+Math.max(0,xn.indexOf(t)),ps=s=>{let t=s%Yn,e=Math.floor(s/Yn);return[t/Yn,1-(e+1)/Yn,(t+1)/Yn,1-e/Yn]},Kn=[3,4,1,6,2,5],rr=.038,Ni={x:.63,y:rr+vl/2,z:.63},Vt={walnut:{roughness:.55,metalness:.05,normalScale:.65,envMapIntensity:.55},brass:{roughness:.32,metalness:.85,envMapIntensity:1.25},felt:{roughness:.95,metalness:0,normalScale:1.15,envMapIntensity:.3},paper:{roughness:.8,metalness:0,normalScale:.45,envMapIntensity:.45},enamel:{roughness:.42,metalness:.06,envMapIntensity:.8},glass:{roughness:.12,metalness:0,envMapIntensity:1.4}},Tn={fov:38,elev:50,overviewElevMin:56,lensK:Math.tan(21*Math.PI/180)/Math.tan(19*Math.PI/180),drift:{x:.055,y:.038,yaw:.0011,fov:.1}},on={high:{dpr:3,shadow:2048,dust:110,glow:!0,grain:!0,env:!0,bloom:!0,props:!0,steam:!0,motes:!0},medium:{dpr:2,shadow:1536,dust:72,glow:!0,grain:!1,env:!0,bloom:!1,props:!0,steam:!0,motes:!1},low:{dpr:1.5,shadow:0,dust:28,glow:!1,grain:!1,env:!1,bloom:!1,props:!0,steam:!1,motes:!1}},bh={cup:{x:-1.72,z:4.28,s:2},cup2:{x:-2.42,z:4.3,s:1.25},newspaper:{x:-2.65,z:4.08,rot:.5},notebook:{x:-.1,z:4.15,rot:.1},glasses:{x:.74,z:4.36,rot:-.5},tickets:{x:-1.05,z:4.42,rot:.22},cards:{x:1.9,z:4.35,rot:-.16},keys:{x:.55,z:4.15,rot:.4},tray:{x:1.62,z:3.62},blanket:{x:1.15,z:4.35,rot:.12},speaker:{x:-2.72,z:2.58,rot:.52},cassette:{x:-2.52,z:3.44,rot:-.26},lamp:{x:-2.55,z:-3.2},candle:{x:-1.3,z:-3.85},plant:{x:2.78,z:-3.18},books:{x:3.02,z:-2.52,rot:.14},photo:{x:-3.18,z:-2.28,rot:.46}},De={bin:{y:1.98,h:.42,d:.46,w:22,inset:.3},strip:{y:1.72,h:.03,d:.07,w:21.4,color:16765600},curtain:{w:.42,h:1.46,off:.15},seat:{x:4.55,z:-2.2,w:.62,h:.94,d:.36},motes:26},ls={cloud:{id:"cloud",label:"云海机舱",exposure:1.28,ink:329741,fog:661024,fogDensity:.0155,light:{hemiSky:7311540,hemiGround:1314828,hemiInt:.58,key:16760960,keyInt:4.1,rim:9418472,rimInt:1.45,fill:11453142,fillInt:.46,lamp:16756838,lampInt:24,lampDist:11,env:.72},tableTint:15391947,feltTint:6193034,boardTint:14864570,brass:11569751,brassRough:.3,felt:{base:"#3E5A64",base2:"#22343C",weave:"#6F8E96"},overlay:{vig:"rgba(2,5,9,.92)",pool:"rgba(255,178,104,.17)",rim:"rgba(232,190,128,.26)"},hub:{top:14725740,side:5913634,star:16179126,glow:16760944},window:{top:"#071422",mid:"#173E58",low:"#6E93A6",cloud:"#C8DCE6",moon:"#F6EAD2",moonX:.68,moonY:.26,moonR:.048,stars:.28,glare:.34},wallTint:3031639,floor:658962,dust:16767400,dustOpacity:.55,heatCool:9418472,heatWarm:16754784,bear:{fur:10255194,furDark:8019010,hat:2833496,band:13805417,scarf:10109506}},star:{id:"star",label:"星轨夜航",exposure:1.16,ink:263435,fog:461334,fogDensity:.0145,light:{hemiSky:7042228,hemiGround:1051924,hemiInt:.52,key:16760458,keyInt:3.8,rim:9677055,rimInt:1.65,fill:10463448,fillInt:.42,lamp:16756339,lampInt:21,lampDist:10,env:.66},tableTint:14866642,feltTint:5791104,boardTint:14470328,brass:11109724,brassRough:.28,felt:{base:"#333A5A",base2:"#1B1E33",weave:"#5D6690"},overlay:{vig:"rgba(1,2,7,.93)",pool:"rgba(255,174,115,.15)",rim:"rgba(214,196,150,.24)"},hub:{top:14267516,side:4863312,star:16049094,glow:16758906},window:{top:"#03030C",mid:"#0E1230",low:"#2A3560",cloud:"#5A6690",moon:"#F0E9FF",moonX:.7,moonY:.24,moonR:.05,stars:1,glare:.22},wallTint:2502216,floor:460556,dust:14472959,dustOpacity:.45,heatCool:9414911,heatWarm:16752832,bear:{fur:9338012,furDark:7233404,hat:3353943,band:13095146,scarf:9200796}},paper:{id:"paper",label:"纸月夜航",exposure:1.26,ink:657414,fog:1445897,fogDensity:.016,light:{hemiSky:13150602,hemiGround:1840140,hemiInt:.62,key:16763796,keyInt:4.3,rim:12101780,rimInt:1.05,fill:14205090,fillInt:.52,lamp:16758904,lampInt:25,lampDist:11,env:.72},tableTint:15785155,feltTint:8283458,boardTint:15125928,brass:12621149,brassRough:.36,felt:{base:"#6A5334",base2:"#3C2C19",weave:"#9A7A4C"},overlay:{vig:"rgba(8,5,2,.92)",pool:"rgba(255,178,104,.22)",rim:"rgba(240,206,150,.30)"},hub:{top:15252082,side:6044190,star:16771520,glow:16760434},window:{top:"#2A1A10",mid:"#6E4326",low:"#D0A070",cloud:"#F0D2A8",moon:"#FFE6BE",moonX:.62,moonY:.3,moonR:.058,stars:.1,glare:.42},wallTint:3812382,floor:722949,dust:16765856,dustOpacity:.5,heatCool:13215876,heatWarm:16751181,bear:{fur:10386520,furDark:8282178,hat:7623738,band:15784110,scarf:10372152}}};function ms(s){return ls[s]||ls.cloud}function me(s,t){let e=document.createElement("canvas");return e.width=s,e.height=t,{c:e,g:e.getContext("2d")}}function xe(s,t={}){let e=new Or(s);return e.colorSpace=t.srgb===!1?Nn:ke,e.anisotropy=t.aniso||4,e.needsUpdate=!0,e.generateMipmaps=!0,e.minFilter=Xn,e.magFilter=dn,t.repeat&&(e.wrapS=e.wrapT=ui,e.repeat.set(t.repeat[0],t.repeat[1])),e}function wn(s,t,e,n,i,r){let o=Math.min(r,n/2,i/2);s.beginPath(),s.moveTo(t+o,e),s.arcTo(t+n,e,t+n,e+i,o),s.arcTo(t+n,e+i,t,e+i,o),s.arcTo(t,e+i,t,e,o),s.arcTo(t,e,t+n,e,o),s.closePath()}function Qn(s){return[s>>16&255,s>>8&255,s&255]}function An(s,t){let[e,n,i]=Qn(s);return t===void 0?`rgb(${e},${n},${i})`:`rgba(${e},${n},${i},${t})`}function an(s,t,e){let n=Qn(s),i=Qn(t);return`rgb(${Math.round(n[0]+(i[0]-n[0])*e)},${Math.round(n[1]+(i[1]-n[1])*e)},${Math.round(n[2]+(i[2]-n[2])*e)})`}function tn(s){let t=s||1;return()=>(t=t*16807%2147483647,t/2147483647)}function oo(s,t=2){let e=s.width,n=s.height,i=s.getContext("2d").getImageData(0,0,e,n).data,{c:r,g:o}=me(e,n),a=o.createImageData(e,n),l=(h,u)=>i[((u%n+n)%n*e+(h%e+e)%e)*4],c=Math.max(.2,t);for(let h=0;h<n;h++)for(let u=0;u<e;u++){let d=(l(u+1,h)-l(u-1,h))/255,f=(l(u,h+1)-l(u,h-1))/255,g=-d*c,_=f*c,m=1,p=Math.hypot(g,_,m)||1,b=(h*e+u)*4;a.data[b]=(g/p*.5+.5)*255,a.data[b+1]=(_/p*.5+.5)*255,a.data[b+2]=(m/p*.5+.5)*255,a.data[b+3]=255}return o.putImageData(a,0,0),r}var Eh=null,Th=null,wh=null;var Ah=null,Cl=null,Pl=null;function nf(s=128){let t=s,{c:e,g:n}=me(t,t);n.fillStyle="#808080",n.fillRect(0,0,t,t);let i=tn(90210);for(let c=0;c<1100;c++){let h=i()*t,u=i()*t,d=.4+i()*1.7;n.globalAlpha=.05+i()*.17,n.fillStyle=i()>.5?"#BEBEBE":"#4E4E4E",n.beginPath(),n.arc(h,u,d,0,yt),n.fill()}for(let c=0;c<16;c++){n.globalAlpha=.12+i()*.16,n.strokeStyle=i()>.5?"#3C3C3C":"#C4C4C4",n.lineWidth=.6+i()*.9,n.beginPath();let h=i()*t,u=i()*t;n.moveTo(h,u);for(let d=0;d<4;d++)h+=(i()-.5)*16,u+=(i()-.5)*16,n.lineTo(h,u);n.stroke()}n.globalAlpha=1;let r=oo(e,1.6),o=me(t,t),a=o.g;a.drawImage(e,0,0);let l=a.getImageData(0,0,t,t);for(let c=0;c<l.data.length;c+=4){let u=150+(1-(l.data[c]+l.data[c+1]+l.data[c+2])/765)*70;l.data[c]=l.data[c+1]=l.data[c+2]=u}return a.putImageData(l,0,0),{normal:xe(r,{srgb:!1,aniso:4}),rough:xe(o.c,{srgb:!1,aniso:4})}}function ef(s,t){if(s.beginPath(),t==="takeoff"||t==="fly")s.moveTo(16,64),s.lineTo(84,20),s.lineTo(60,82),s.lineTo(46,56),s.closePath(),s.moveTo(46,56),s.lineTo(84,20),t==="fly"&&(s.moveTo(8,34),s.lineTo(30,34),s.moveTo(4,44),s.lineTo(24,44),s.moveTo(10,54),s.lineTo(26,54));else if(t==="forbid")s.arc(50,50,32,0,yt),s.moveTo(28,72),s.lineTo(72,28);else if(t==="fate")s.moveTo(50,8),s.quadraticCurveTo(54,44,92,50),s.quadraticCurveTo(54,56,50,92),s.quadraticCurveTo(46,56,8,50),s.quadraticCurveTo(46,44,50,8),s.closePath();else if(t==="entry")s.moveTo(20,18),s.lineTo(20,82),s.moveTo(20,18),s.lineTo(64,18),s.moveTo(20,82),s.lineTo(64,82),s.moveTo(64,18),s.lineTo(64,82),s.moveTo(50,50),s.lineTo(82,50),s.moveTo(70,38),s.lineTo(82,50),s.lineTo(70,62);else if(t==="truth")s.moveTo(18,26),s.lineTo(82,26),s.quadraticCurveTo(90,26,90,34),s.lineTo(90,62),s.quadraticCurveTo(90,70,82,70),s.lineTo(48,70),s.lineTo(30,86),s.lineTo(32,70),s.lineTo(18,70),s.quadraticCurveTo(10,70,10,62),s.lineTo(10,34),s.quadraticCurveTo(10,26,18,26),s.closePath(),s.moveTo(50,60),s.bezierCurveTo(50,56,44,52,40,56),s.bezierCurveTo(36,60,40,66,50,72),s.bezierCurveTo(60,66,64,60,60,56),s.bezierCurveTo(56,52,50,56,50,60),s.closePath();else if(t==="dare")s.moveTo(50,8),s.bezierCurveTo(60,30,74,34,72,54),s.bezierCurveTo(70,76,58,90,50,92),s.bezierCurveTo(42,90,30,78,30,60),s.bezierCurveTo(30,48,38,44,40,54),s.bezierCurveTo(42,62,50,46,50,8),s.closePath();else if(t==="touch")s.arc(38,52,18,0,yt),s.arc(62,52,18,0,yt),s.moveTo(50,22),s.lineTo(50,34),s.moveTo(38,30),s.lineTo(44,39),s.moveTo(62,30),s.lineTo(56,39);else if(t==="thermo")s.moveTo(44,16),s.lineTo(44,66),s.moveTo(56,16),s.lineTo(56,66),s.moveTo(44,16),s.quadraticCurveTo(50,8,56,16),s.arc(50,74,12,0,yt),s.moveTo(60,30),s.lineTo(68,30),s.moveTo(60,44),s.lineTo(68,44),s.moveTo(60,58),s.lineTo(68,58);else if(t==="wheel"){s.arc(50,50,32,0,yt),s.arc(50,50,7,0,yt);for(let e=0;e<8;e++){let n=e/8*yt;s.moveTo(50+Math.cos(n)*9,50+Math.sin(n)*9),s.lineTo(50+Math.cos(n)*30,50+Math.sin(n)*30)}}else s.arc(50,50,26,0,yt),s.arc(50,50,10,0,yt)}function Il(s,t,e,n,i,r,o={}){let a=i/100;s.save(),s.translate(e-i/2,n-i/2),s.scale(a,a),s.lineCap="round",s.lineJoin="round";let l=o.fill!==!1;o.engrave&&(s.save(),s.translate(0,1.6),s.strokeStyle="rgba(4,6,9,.55)",s.fillStyle="rgba(4,6,9,.5)",s.lineWidth=o.lw||5.2,ef(s,t),l?s.fill():s.stroke(),s.restore()),s.strokeStyle=r,s.fillStyle=r,s.lineWidth=o.lw||4.6,ef(s,t),l&&s.fill(),s.stroke(),s.restore()}function sf(s={}){let t=tf,e=t*Yn,n=s.aniso||8,{c:i,g:r}=me(e,e);r.clearRect(0,0,e,e);let o=c=>[c%Yn*t,Math.floor(c/Yn)*t],a=tn(90210);{let[c,h]=o(sr),u=r.createLinearGradient(c,h,c,h+t);u.addColorStop(0,"#2C3138"),u.addColorStop(1,"#12151A"),r.fillStyle=u,r.fillRect(c,h,t,t)}{let[c,h]=o(jd);r.fillStyle="#FFFFFF",r.fillRect(c,h,t,t)}let l=(c,h,u,d)=>{let f=Se[d];r.save(),r.translate(c,h);let g=r.createRadialGradient(t*.42,t*.36,t*.06,t*.5,t*.55,t*.78);g.addColorStop(0,an(2304048,f,.34)),g.addColorStop(.55,an(1580324,f,.24)),g.addColorStop(1,"#101317"),r.fillStyle=g,wn(r,1.5,1.5,t-3,t-3,t*.17),r.fill(),r.lineWidth=1.7,r.strokeStyle=An(f,.92),wn(r,2.6,2.6,t-5.2,t-5.2,t*.15),r.stroke(),r.lineWidth=.8,r.strokeStyle="rgba(226,196,146,.28)",wn(r,5.2,5.2,t-10.4,t-10.4,t*.12),r.stroke(),r.fillStyle="rgba(236,206,158,.34)";for(let[m,p]of[[6.4,6.4],[t-6.4,6.4],[6.4,t-6.4],[t-6.4,t-6.4]])r.beginPath(),r.arc(m,p,.85,0,yt),r.fill();for(let m=0;m<7;m++){r.globalAlpha=.03+a()*.05,r.fillStyle=a()>.5?"#FFFFFF":"#000000";let p=2+a()*7,b=.5+a()*1.2;r.fillRect(6+a()*(t-14),6+a()*(t-14),p,b)}r.globalAlpha=1;let _=r.createLinearGradient(2,2,t*.7,t*.7);_.addColorStop(0,"rgba(255,238,210,.16)"),_.addColorStop(.4,"rgba(255,238,210,.03)"),_.addColorStop(1,"rgba(255,238,210,0)"),r.fillStyle=_,wn(r,3,3,t-6,t-6,t*.15),r.fill(),r.restore()};return Sh.forEach(c=>{xn.forEach(h=>{let[u,d]=o(Rl(c,h));l(u,d,c,h);let f=an(Se[h],15721164,.52),g=c==="takeoff"||c==="fly"||c==="fate"||c==="dare";Il(r,c,u+t/2,d+t*.505,t*.56,f,{engrave:!0,lw:5.4,fill:g})})}),xn.forEach((c,h)=>{let[u,d]=o(wl+h);r.save(),r.translate(u,d);let f=r.createLinearGradient(0,0,0,t);f.addColorStop(0,"#B7A47C"),f.addColorStop(1,"#77613F"),r.fillStyle=f,wn(r,1.5,1.5,t-3,t-3,t*.16),r.fill(),r.lineWidth=1.7,r.strokeStyle=An(Se[c],.85),wn(r,2.6,2.6,t-5.2,t-5.2,t*.15),r.stroke(),r.strokeStyle="rgba(90,64,32,.42)",r.lineWidth=.9,wn(r,5.2,5.2,t-10.4,t-10.4,t*.11),r.stroke(),Il(r,"entry",t/2,t*.5,t*.54,an(13149806,Se[c],.3),{engrave:!0,lw:5.6,fill:!1}),r.restore()}),xn.forEach((c,h)=>{let[u,d]=o(Al+h);r.save(),r.translate(u,d);let f=r.createRadialGradient(t*.45,t*.4,2,t*.5,t*.5,t*.8);f.addColorStop(0,"#242A31"),f.addColorStop(1,"#0D1014"),r.fillStyle=f,wn(r,1.5,1.5,t-3,t-3,t*.2),r.fill(),r.strokeStyle=An(Se[c],.8),r.lineWidth=1.8,r.beginPath(),r.arc(t/2,t/2,t*.3,0,yt),r.stroke(),Il(r,"fly",t/2,t*.5,t*.42,an(Se[c],15721164,.35),{engrave:!0,lw:6,fill:!0}),r.restore()}),{canvas:i,tex:xe(i,{aniso:n})}}function rf(s,t=512){let e=t,n=Math.round(e/4),{c:i,g:r}=me(e,e),o=an(3022098,s,.22);r.fillStyle=o,r.fillRect(0,0,e,e);let a=tn(4711);r.save(),r.translate(e*.18,e*.42);for(let d=0;d<46;d++){let f=20+d*(e/46)*1.15;r.beginPath();for(let g=0;g<=e*1.4;g+=6){let _=Math.sin(g/e*yt*1.5+d*.7)*(2+d*.12),m=-f+_;g===0?r.moveTo(g,m):r.lineTo(g,m)}r.strokeStyle=d%3===0?"rgba(12,7,4,.42)":"rgba(86,58,36,.25)",r.lineWidth=d%5===0?2.4:1.1,r.stroke()}r.restore();for(let d=0;d<260;d++){let f=a()*e,g=a()*e;r.globalAlpha=.05+a()*.12,r.fillStyle=a()>.55?"rgba(10,6,3,.8)":"rgba(150,110,70,.6)",r.fillRect(f,g,1+a()*2.4,.6+a()*1.1)}r.globalAlpha=1;for(let d=0;d<18;d++){let f=d/18*e;r.globalAlpha=.06+a()*.1,r.strokeStyle=a()>.5?"#0B0704":"#7A5536",r.lineWidth=.8+a()*1.4,r.beginPath();for(let g=0;g<=e;g+=8){let _=f+Math.sin(g/e*yt*2+d)*2;g===0?r.moveTo(g,_):r.lineTo(g,_)}r.stroke()}r.globalAlpha=1;let l=me(e,e);l.g.drawImage(i,0,0);let c=oo(l.c,5),h=me(Math.round(e/2),Math.round(e/2));h.g.drawImage(i,0,0,h.c.width,h.c.height);let u=h.g.getImageData(0,0,h.c.width,h.c.height);for(let d=0;d<u.data.length;d+=4){let g=200+(1-(u.data[d]*.3+u.data[d+1]*.6+u.data[d+2]*.1)/255)*55;u.data[d]=u.data[d+1]=u.data[d+2]=g}return h.g.putImageData(u,0,0),{map:xe(i,{aniso:8}),normal:xe(c,{srgb:!1,aniso:8}),rough:xe(h.c,{srgb:!1,aniso:4})}}function Dl(s,t=256){let e=t,{c:n,g:i}=me(e,e),r=tn(1307);i.fillStyle=an(4869714,s,.42),i.fillRect(0,0,e,e);let o=8,a=e/o;for(let u=0;u<a;u++)for(let d=0;d<a;d++)i.globalAlpha=.05+r()*.08,i.fillStyle=r()>.5?"#FFFFFF":"#000000",i.fillRect(d*o,u*o,o,o);i.globalAlpha=1;for(let u=0;u<a;u++)i.globalAlpha=.2,i.strokeStyle="rgba(255,255,255,.35)",i.lineWidth=1,i.beginPath(),i.moveTo(0,u*o+.5),i.lineTo(e,u*o+.5),i.stroke(),i.globalAlpha=.14,i.strokeStyle="rgba(0,0,0,.5)",i.beginPath(),i.moveTo(u*o+.5,0),i.lineTo(u*o+.5,e),i.stroke();i.globalAlpha=1;for(let u=0;u<420;u++){i.globalAlpha=.05+r()*.09,i.strokeStyle=r()>.5?"rgba(255,245,230,.8)":"rgba(0,0,0,.7)",i.lineWidth=.8;let d=r()*e,f=r()*e,g=r()*Math.PI;i.beginPath(),i.moveTo(d,f),i.lineTo(d+Math.cos(g)*2.2,f+Math.sin(g)*2.2),i.stroke()}i.globalAlpha=1;for(let u=0;u<6;u++){let d=r()*e,f=r()*e,g=e*(.15+r()*.25),_=i.createRadialGradient(d,f,0,d,f,g);_.addColorStop(0,u%2?"rgba(255,255,255,.035)":"rgba(0,0,0,.06)"),_.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=_,i.beginPath(),i.arc(d,f,g,0,yt),i.fill()}let l=me(e,e);l.g.drawImage(n,0,0);let c=oo(l.c,2.2),h=me(64,64);h.g.fillStyle="rgb(238,238,238)",h.g.fillRect(0,0,64,64),h.g.globalAlpha=.25;for(let u=0;u<120;u++)h.g.fillStyle=r()>.5?"#FFFFFF":"#D8D8D8",h.g.fillRect(r()*64,r()*64,1.5,1.5);return h.g.globalAlpha=1,{map:xe(n,{aniso:8}),normal:xe(c,{srgb:!1,aniso:8}),rough:xe(h.c,{srgb:!1})}}function or(s=256){let t=s,{c:e,g:n}=me(t,t),i=tn(77003),r=n.createLinearGradient(0,0,0,t);r.addColorStop(0,"#C79B63"),r.addColorStop(.45,"#A87F4D"),r.addColorStop(1,"#7C5A32"),n.fillStyle=r,n.fillRect(0,0,t,t);for(let h=0;h<900;h++){let u=i()*t;n.globalAlpha=.04+i()*.1,n.strokeStyle=i()>.45?"rgba(255,240,210,.9)":"rgba(40,24,10,.9)",n.lineWidth=.6+i()*1.2,n.beginPath(),n.moveTo(0,u),n.lineTo(t,u+(i()-.5)*1.5),n.stroke()}n.globalAlpha=1;for(let h=0;h<7;h++){let u=i()*t,d=i()*t,f=t*(.05+i()*.14),g=n.createRadialGradient(u,d,0,u,d,f);g.addColorStop(0,h%2?"rgba(50,30,12,.20)":"rgba(255,228,180,.10)"),g.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=g,n.beginPath(),n.arc(u,d,f,0,yt),n.fill()}let o=me(t,t);o.g.drawImage(e,0,0);let a=oo(o.c,1.4),l=me(128,128);l.g.drawImage(e,0,0,128,128);let c=l.g.getImageData(0,0,128,128);for(let h=0;h<c.data.length;h+=4){let u=118+c.data[h]/255*40;c.data[h]=c.data[h+1]=c.data[h+2]=u}return l.g.putImageData(c,0,0),{map:xe(e,{aniso:8}),normal:xe(a,{srgb:!1,aniso:8}),rough:xe(l.c,{srgb:!1})}}function Ll(s=256){let t=s,{c:e,g:n}=me(t,t),i=tn(5150),r=n.createLinearGradient(0,0,t,t);r.addColorStop(0,"#F3E6D0"),r.addColorStop(.55,"#EADCC2"),r.addColorStop(1,"#DCCBAB"),n.fillStyle=r,n.fillRect(0,0,t,t);for(let c=0;c<900;c++){n.globalAlpha=.03+i()*.05,n.strokeStyle=i()>.5?"rgba(255,255,255,.9)":"rgba(120,92,58,.8)",n.lineWidth=.6;let h=i()*t,u=i()*t,d=i()*Math.PI;n.beginPath(),n.moveTo(h,u),n.lineTo(h+Math.cos(d)*3.4,u+Math.sin(d)*3.4),n.stroke()}n.globalAlpha=1;let o=n.createLinearGradient(t*.47,0,t*.53,0);o.addColorStop(0,"rgba(130,100,64,0)"),o.addColorStop(.45,"rgba(130,100,64,.24)"),o.addColorStop(.5,"rgba(255,252,244,.55)"),o.addColorStop(.56,"rgba(130,100,64,.22)"),o.addColorStop(1,"rgba(130,100,64,0)"),n.fillStyle=o,n.fillRect(t*.47,0,t*.06,t),n.globalAlpha=.18,n.strokeStyle="rgba(120,92,58,.9)",n.lineWidth=1.2,n.beginPath(),n.moveTo(0,t*.72),n.lineTo(t,t*.72),n.stroke(),n.globalAlpha=1;let a=me(t,t);a.g.drawImage(e,0,0);let l=oo(a.c,1.6);return{map:xe(e,{aniso:8}),normal:xe(l,{srgb:!1,aniso:8})}}function of(s){let{c:e,g:n}=me(1536,1536),i=1536/2,r=tn(20260119);n.fillStyle=an(2759184,s,.16),n.fillRect(0,0,1536,1536),n.save(),n.translate(i,i);for(let l=0;l<70;l++){let c=8+l*(i/70)*1.18;n.beginPath();for(let h=0;h<=yt+.02;h+=.03){let u=Math.sin(h*7+l*.8)*(1.6+l*.08),d=Math.cos(h)*(c+u),f=Math.sin(h)*(c+u);h===0?n.moveTo(d,f):n.lineTo(d,f)}n.strokeStyle=l%3===0?"rgba(10,6,3,.34)":"rgba(96,66,42,.22)",n.lineWidth=l%6===0?2.2:1,n.stroke()}n.restore();for(let l=0;l<2400;l++){let c=r()*yt,h=Math.sqrt(r())*i;n.globalAlpha=.04+r()*.09,n.fillStyle=r()>.5?"rgba(0,0,0,.7)":"rgba(150,110,72,.55)",n.fillRect(i+Math.cos(c)*h,i+Math.sin(c)*h,1+r()*2,.6+r()*1)}n.globalAlpha=1;let o=n.createRadialGradient(i,i,i*.78,i,i,i);o.addColorStop(0,"rgba(0,0,0,0)"),o.addColorStop(1,"rgba(0,0,0,.55)"),n.fillStyle=o,n.beginPath(),n.arc(i,i,i,0,yt),n.fill(),n.strokeStyle="rgba(200,160,102,.62)",n.lineWidth=5,n.beginPath(),n.arc(i,i,i*.955,0,yt),n.stroke(),n.strokeStyle="rgba(30,18,8,.55)",n.lineWidth=2,n.beginPath(),n.arc(i,i,i*.935,0,yt),n.stroke(),n.strokeStyle="rgba(214,176,116,.30)",n.lineWidth=3,n.beginPath(),n.arc(i,i,i*.7,0,yt),n.stroke();for(let l of xn){let c=Jn(_i[l])+Math.PI;n.strokeStyle="rgba(206,168,110,.26)",n.lineWidth=2,n.beginPath(),n.moveTo(i+Math.cos(c)*i*.12,i+Math.sin(c)*i*.12),n.lineTo(i+Math.cos(c)*i*.66,i+Math.sin(c)*i*.66),n.stroke()}let a=n.createRadialGradient(i,i,0,i,i,i*.2);return a.addColorStop(0,"rgba(240,212,160,.85)"),a.addColorStop(.55,"rgba(190,146,86,.55)"),a.addColorStop(1,"rgba(120,82,40,0)"),n.fillStyle=a,n.beginPath(),n.arc(i,i,i*.2,0,yt),n.fill(),n.strokeStyle="rgba(238,206,152,.62)",n.lineWidth=2.4,n.beginPath(),n.arc(i,i,i*.155,0,yt),n.stroke(),xe(e,{aniso:8})}function af(s=128){let t=s,{c:e,g:n}=me(t*3,t*2),i={1:[[.5,.5]],2:[[.28,.28],[.72,.72]],3:[[.26,.26],[.5,.5],[.74,.74]],4:[[.28,.28],[.72,.28],[.28,.72],[.72,.72]],5:[[.28,.28],[.72,.28],[.5,.5],[.28,.72],[.72,.72]],6:[[.28,.24],[.72,.24],[.28,.5],[.72,.5],[.28,.76],[.72,.76]]};for(let r=1;r<=6;r++){let o=(r-1)%3,a=Math.floor((r-1)/3),l=o*t,c=a*t;n.save(),n.translate(l,c);let h=n.createLinearGradient(0,0,t,t);h.addColorStop(0,"#F6ECD8"),h.addColorStop(.5,"#E8D9C0"),h.addColorStop(1,"#D3BEA0"),n.fillStyle=h,n.fillRect(0,0,t,t),n.strokeStyle="rgba(160,120,64,.55)",n.lineWidth=t*.022,n.strokeRect(t*.035,t*.035,t*.93,t*.93),n.strokeStyle="rgba(255,250,238,.5)",n.lineWidth=t*.012,n.strokeRect(t*.065,t*.065,t*.87,t*.87);for(let[u,d]of i[r]){let f=u*t,g=d*t,_=t*.071,m=n.createRadialGradient(f-_*.3,g-_*.3,0,f,g,_);m.addColorStop(0,"#14100C"),m.addColorStop(.7,"#2A2118"),m.addColorStop(1,"#4A3A28"),n.fillStyle=m,n.beginPath(),n.arc(f,g,_,0,yt),n.fill(),n.strokeStyle="rgba(255,246,228,.28)",n.lineWidth=t*.008,n.beginPath(),n.arc(f,g,_*1.05,.4,Math.PI*1.1),n.stroke()}n.restore()}return{tex:xe(e,{aniso:8}),cols:3,rows:2}}function lf(s){let{c:e,g:n}=me(512,512),i=tn(881),r=n.createLinearGradient(0,0,0,512);r.addColorStop(0,s.top),r.addColorStop(.45,s.mid),r.addColorStop(.68,s.low),r.addColorStop(.78,an(14206632,16770752,.3)),r.addColorStop(1,"#0A0F16"),n.fillStyle=r,n.fillRect(0,0,512,512);let o=Math.round(240*(s.stars||0));if(o>0){for(let m=0;m<o;m++){let p=i()*512,b=i()*512*.55,S=.25+i()*.75;n.fillStyle=`rgba(235,236,255,${S})`,n.beginPath(),n.arc(p,b,i()>.92?1.6:.8,0,yt),n.fill()}n.strokeStyle="rgba(190,200,255,.14)",n.lineWidth=1;for(let m=0;m<5;m++)n.beginPath(),n.arc(512*.72,512*1.35,512*(.55+m*.07),-2.1,-1.25),n.stroke()}let a=s.moonX*512,l=s.moonY*512,c=s.moonR*512,h=n.createRadialGradient(a,l,c*.4,a,l,c*6);h.addColorStop(0,An(16772040,.55)),h.addColorStop(.35,An(16768168,.16)),h.addColorStop(1,"rgba(255,220,168,0)"),n.fillStyle=h,n.beginPath(),n.arc(a,l,c*6,0,yt),n.fill(),n.fillStyle=s.moon,n.beginPath(),n.arc(a,l,c,0,yt),n.fill(),n.globalAlpha=.18,n.fillStyle="#B9A98C",n.beginPath(),n.arc(a-c*.3,l+c*.2,c*.22,0,yt),n.fill(),n.beginPath(),n.arc(a+c*.35,l-c*.25,c*.16,0,yt),n.fill(),n.globalAlpha=1;let u=s.cloud;for(let m=0;m<40;m++){let p=512*(.6+i()*.34),b=i()*512*1.2-512*.1,S=512*(.05+i()*.13),x=n.createRadialGradient(b,p,0,b,p,S);x.addColorStop(0,An(u,.42)),x.addColorStop(.6,An(u,.18)),x.addColorStop(1,An(u,0)),n.fillStyle=x,n.beginPath(),n.ellipse(b,p,S*1.9,S*.62,0,0,yt),n.fill()}let d=n.createLinearGradient(a,l,a,512*.9);d.addColorStop(0,"rgba(255,232,196,.22)"),d.addColorStop(1,"rgba(255,232,196,0)"),n.fillStyle=d,n.beginPath(),n.moveTo(a-c*1.2,l),n.lineTo(a+c*1.2,l),n.lineTo(a+c*5,512*.9),n.lineTo(a-c*5,512*.9),n.closePath(),n.fill(),n.save();for(let m=0;m<26;m++){let p=512*(.03+i()*.94),b=512*(.745+i()*.055),S=.18+i()*.5,x=i()>.85?2.4:1.3,A=n.createRadialGradient(p,b,0,p,b,x*3.2);A.addColorStop(0,`rgba(255,216,160,${S})`),A.addColorStop(.4,`rgba(255,190,120,${S*.32})`),A.addColorStop(1,"rgba(255,190,120,0)"),n.fillStyle=A,n.beginPath(),n.arc(p,b,x*3.2,0,yt),n.fill(),n.fillStyle=`rgba(255,238,206,${Math.min(.9,S+.15)})`,n.beginPath(),n.arc(p,b,x*.55,0,yt),n.fill()}n.beginPath(),n.moveTo(512*1.02,512*.86),n.lineTo(512*.3,512*.72),n.lineTo(512*.34,512*.685),n.lineTo(512*1.02,512*.79),n.closePath(),n.fillStyle="rgba(6,9,13,.86)",n.fill(),n.strokeStyle="rgba(150,180,210,.22)",n.lineWidth=1.6,n.beginPath(),n.moveTo(512*.3,512*.72),n.lineTo(512*1,512*.86),n.stroke();let f=n.createRadialGradient(512*.33,512*.706,0,512*.33,512*.706,512*.035);f.addColorStop(0,"rgba(255,120,90,.95)"),f.addColorStop(.35,"rgba(255,80,60,.40)"),f.addColorStop(1,"rgba(255,80,60,0)"),n.fillStyle=f,n.beginPath(),n.arc(512*.33,512*.706,512*.035,0,yt),n.fill(),n.restore();let g=n.createLinearGradient(0,0,512,512);g.addColorStop(0,"rgba(255,255,255,.10)"),g.addColorStop(.32,"rgba(255,255,255,0)"),g.addColorStop(1,"rgba(0,0,0,.30)"),n.fillStyle=g,n.fillRect(0,0,512,512);let _=n.createRadialGradient(512*.5,512*.55,512*.2,512*.5,512*.55,512*.72);return _.addColorStop(0,"rgba(0,0,0,0)"),_.addColorStop(1,"rgba(0,4,8,.55)"),n.fillStyle=_,n.fillRect(0,0,512,512),xe(e,{aniso:4})}function cf(s,t=512){let e=t,{c:n,g:i}=me(e,e),r=tn(31337);i.fillStyle=an(1712682,s,.55),i.fillRect(0,0,e,e);for(let a=0;a<4;a++){let l=a*128;i.fillStyle="rgba(0,0,0,.34)",i.fillRect(l,0,3,e),i.fillStyle="rgba(255,238,208,.075)",i.fillRect(l+3,0,1.5,e);for(let c=0;c<8;c++){let h=18+c*64;for(let u of[l-9,l+12])i.fillStyle="rgba(8,10,12,.42)",i.beginPath(),i.arc(u,h,2.6,0,yt),i.fill(),i.fillStyle="rgba(255,238,210,.20)",i.beginPath(),i.arc(u-.7,h-.8,1.35,0,yt),i.fill()}}for(let a of[96,320]){let l=i.createLinearGradient(0,a,0,a+6);l.addColorStop(0,"rgba(196,156,100,.55)"),l.addColorStop(.5,"rgba(232,196,140,.30)"),l.addColorStop(1,"rgba(20,14,8,.35)"),i.fillStyle=l,i.fillRect(0,a,e,6);for(let c=0;c<16;c++){let h=8+c*32;i.fillStyle="rgba(10,8,6,.30)",i.beginPath(),i.arc(h,a+10,1.9,0,yt),i.fill(),i.fillStyle="rgba(240,214,170,.16)",i.beginPath(),i.arc(h-.5,a+9.4,.9,0,yt),i.fill()}}let o=i.createLinearGradient(0,e-26,0,e);o.addColorStop(0,"rgba(4,6,9,0)"),o.addColorStop(1,"rgba(4,6,9,.55)"),i.fillStyle=o,i.fillRect(0,e-26,e,26);for(let a=0;a<2600;a++)i.globalAlpha=.025+r()*.05,i.fillStyle=r()>.5?"rgba(255,255,255,.8)":"rgba(0,0,0,.9)",i.fillRect(r()*e,r()*e,1+r()*2,1+r());i.globalAlpha=1;for(let a=0;a<6;a++){let l=r()*e,c=r()*e,h=e*(.1+r()*.24),u=i.createRadialGradient(l,c,0,l,c,h);u.addColorStop(0,r()>.5?"rgba(0,0,0,.16)":"rgba(255,220,170,.05)"),u.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=u,i.beginPath(),i.arc(l,c,h,0,yt),i.fill()}return xe(n,{aniso:4,repeat:[3,1]})}function hf(s){let{c:e,g:n}=me(256,256),i=tn(4242);n.fillStyle=an(658447,s,.35),n.fillRect(0,0,256,256),n.lineWidth=1;for(let r=-256;r<256*2;r+=7)n.strokeStyle=r%14===0?"rgba(255,236,208,.030)":"rgba(0,0,0,.10)",n.beginPath(),n.moveTo(r,0),n.lineTo(r+256,256),n.stroke(),n.beginPath(),n.moveTo(r,256),n.lineTo(r+256,0),n.stroke();for(let r=0;r<1400;r++)n.globalAlpha=.03+i()*.06,n.fillStyle=i()>.5?"rgba(255,255,255,.7)":"rgba(0,0,0,.9)",n.fillRect(i()*256,i()*256,1+i()*2,1+i()*2);return n.globalAlpha=1,xe(e,{aniso:4,repeat:[6,4]})}function Fl(s,t){let{c:e,g:n}=me(s,s),i=s/2,r=n.createRadialGradient(i,i,0,i,i,i);return t.forEach(([o,a])=>r.addColorStop(o,a)),n.fillStyle=r,n.fillRect(0,0,s,s),xe(e)}function uf(){return Eh||(Eh=Fl(128,[[0,"rgba(0,0,0,.62)"],[.42,"rgba(0,0,0,.34)"],[.78,"rgba(0,0,0,.10)"],[1,"rgba(0,0,0,0)"]])),Eh}function Oi(){return Th||(Th=Fl(128,[[0,"rgba(255,240,214,.95)"],[.3,"rgba(255,204,136,.48)"],[.65,"rgba(255,186,110,.14)"],[1,"rgba(255,186,110,0)"]])),Th}function df(){return wh||(wh=Fl(64,[[0,"rgba(255,246,232,.9)"],[.38,"rgba(255,226,190,.38)"],[1,"rgba(255,226,190,0)"]])),wh}function ff(){let{c:t,g:e}=me(128,128),n=128/2,i=e.createRadialGradient(n,n,n*.45,n,n,n*.98);return i.addColorStop(0,"rgba(255,214,150,0)"),i.addColorStop(.62,"rgba(255,222,168,.85)"),i.addColorStop(1,"rgba(255,214,150,0)"),e.fillStyle=i,e.beginPath(),e.arc(n,n,n,0,yt),e.fill(),xe(t)}function Rh(){return Ah||(Ah=Fl(32,[[0,"rgba(255,244,220,.95)"],[.4,"rgba(255,220,170,.35)"],[1,"rgba(255,220,170,0)"]])),Ah}function pf(s,t,e=512){let n=e,{c:i,g:r}=me(n,n),o=t.w,a=t.d,l=S=>S/o*n,c=tn(606),h=r.createRadialGradient(0,0,l(o*.3),0,0,l(o*.62));h.addColorStop(0,"rgba(0,0,0,0)"),h.addColorStop(.45,s.vig.replace(/[\d.]+\)$/,"0.18)")),h.addColorStop(1,s.vig.replace(/[\d.]+\)$/,"0.60)")),r.save(),r.translate(n/2,n/2),r.scale(1,o/a),r.fillStyle=h,r.beginPath(),r.arc(0,0,l(o*.78),0,yt),r.fill(),r.restore();let u=r.createRadialGradient(n*.34,n*.42,l(.3),n*.34,n*.42,l(4));u.addColorStop(0,s.pool),u.addColorStop(.5,s.pool.replace(/[\d.]+\)$/,"0.10)")),u.addColorStop(1,"rgba(255,178,104,0)"),r.save(),r.translate(n/2,n/2),r.scale(1,o/a),r.fillStyle=u,r.beginPath(),r.arc(0,0,l(4.4),0,yt),r.fill(),r.restore();let d=r.createRadialGradient(0,0,l(3.2),0,0,l(3.62));d.addColorStop(0,"rgba(0,0,0,0)"),d.addColorStop(.25,"rgba(0,0,0,.34)"),d.addColorStop(.62,"rgba(0,0,0,.20)"),d.addColorStop(1,"rgba(0,0,0,0)"),r.save(),r.translate(n/2,n/2),r.scale(1,o/a),r.fillStyle=d,r.beginPath(),r.arc(0,0,l(3.62),0,yt),r.fill(),r.restore(),r.save(),r.translate(n/2,n/2),r.scale(1,o/a),r.strokeStyle=s.rim,r.lineWidth=2,r.beginPath(),r.arc(0,0,l(3.92),0,yt),r.stroke(),r.restore(),r.save(),r.translate(n/2,n/2),r.scale(1,o/a),r.setLineDash([7,6]),r.strokeStyle="rgba(224,190,140,.20)",r.lineWidth=2.2,r.beginPath(),r.arc(0,0,l(3.56),0,yt),r.stroke(),r.setLineDash([3,7]),r.strokeStyle="rgba(12,16,20,.30)",r.lineWidth=1.4,r.beginPath(),r.arc(0,0,l(3.72),0,yt),r.stroke(),r.setLineDash([]),r.strokeStyle="rgba(232,200,150,.10)",r.lineWidth=1.2,r.beginPath(),r.arc(0,0,l(3.46),0,yt),r.stroke(),r.restore();let f=-.6,g=[[3.36,f-3.28],[-3.36,f-3.28],[3.36,f+3.28],[-3.36,f+3.28]];for(let[S,x]of g){let A=n/2+S/o*n,w=n/2+x/a*n,P=l(.3);r.save(),r.translate(A,w),r.strokeStyle="rgba(230,196,146,.22)",r.lineWidth=1.6,r.beginPath(),r.arc(0,0,P,0,yt),r.stroke(),r.beginPath();for(let C=0;C<4;C++){let M=C/4*yt+.4;r.moveTo(Math.cos(M)*P*.25,Math.sin(M)*P*.25),r.lineTo(Math.cos(M)*P*1.22,Math.sin(M)*P*1.22)}r.stroke(),r.strokeStyle="rgba(16,20,24,.26)",r.lineWidth=1.2,r.beginPath(),r.arc(.8,1.1,P*.86,0,yt),r.stroke(),r.fillStyle="rgba(236,204,156,.26)",r.beginPath(),r.arc(0,0,2.6,0,yt),r.fill(),r.restore()}for(let S=0;S<4;S++){let x=-.7+S*(Math.PI/2),A=Math.cos(x)*3.1,w=f+Math.sin(x)*3.1,P=n/2+A/o*n,C=n/2+w/a*n,M=r.createRadialGradient(P,C,0,P,C,l(1.1));M.addColorStop(0,"rgba(255,236,206,.045)"),M.addColorStop(1,"rgba(255,236,206,0)"),r.fillStyle=M,r.beginPath(),r.arc(P,C,l(1.1),0,yt),r.fill()}let _=r.createLinearGradient(n*.05,0,n*.9,n);_.addColorStop(0,"rgba(255,238,210,.10)"),_.addColorStop(.4,"rgba(255,238,210,.035)"),_.addColorStop(1,"rgba(255,238,210,0)"),r.fillStyle=_,r.fillRect(0,0,n,n);let m=r.createLinearGradient(0,0,0,n*.42);m.addColorStop(0,"rgba(3,6,10,.55)"),m.addColorStop(.6,"rgba(3,6,10,.18)"),m.addColorStop(1,"rgba(3,6,10,0)"),r.fillStyle=m,r.fillRect(0,0,n,n*.42);let p=r.createLinearGradient(0,n,0,n*.7);p.addColorStop(0,"rgba(255,196,132,.12)"),p.addColorStop(1,"rgba(255,196,132,0)"),r.fillStyle=p,r.fillRect(0,n*.7,n,n*.3);for(let S=0;S<9;S++){let x=c()*n,A=c()*n,w=n*(.03+c()*.09),P=r.createRadialGradient(x,A,0,x,A,w);P.addColorStop(0,S%2?"rgba(255,255,255,.020)":"rgba(0,0,0,.045)"),P.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=P,r.beginPath(),r.arc(x,A,w,0,yt),r.fill()}r.globalCompositeOperation="destination-in",r.save(),r.translate(n/2,n/2),r.scale(1,o/a);let b=r.createRadialGradient(0,0,l(o*.34),0,0,l(o*.53));return b.addColorStop(0,"rgba(0,0,0,1)"),b.addColorStop(.82,"rgba(0,0,0,.96)"),b.addColorStop(.94,"rgba(0,0,0,.55)"),b.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=b,r.beginPath(),r.arc(0,0,l(o*.53),0,yt),r.fill(),r.restore(),r.globalCompositeOperation="source-over",xe(i,{aniso:4})}function mf(s,t=256){let e=t,{c:n,g:i}=me(e,e),r=e/2,o=i.createRadialGradient(r*.85,r*.72,r*.05,r,r,r);o.addColorStop(0,"#FFF4DC"),o.addColorStop(.4,An(s.top)),o.addColorStop(1,An(s.side)),i.fillStyle=o,i.beginPath(),i.arc(r,r,r,0,yt),i.fill();let a=tn(99);for(let h=0;h<260;h++){i.globalAlpha=.04+a()*.08,i.strokeStyle=a()>.5?"rgba(255,248,230,.8)":"rgba(60,36,12,.7)",i.lineWidth=.7;let u=a()*e;i.beginPath(),i.moveTo(0,u),i.lineTo(e,u+(a()-.5)*2),i.stroke()}i.globalAlpha=1,i.strokeStyle="rgba(70,42,16,.40)",i.lineWidth=2.4,i.beginPath(),i.arc(r,r,r*.86,0,yt),i.stroke(),i.strokeStyle="rgba(255,250,236,.55)",i.lineWidth=1.8,i.beginPath(),i.arc(r,r,r*.78,0,yt),i.stroke(),i.save(),i.translate(r,r);let l=()=>{i.beginPath();for(let h=0;h<10;h++){let u=h%2===0?r*.52:r*.22,d=-Math.PI/2+h*Math.PI/5,f=Math.cos(d)*u,g=Math.sin(d)*u;h===0?i.moveTo(f,g):i.lineTo(f,g)}i.closePath()};l(),i.fillStyle="rgba(58,34,12,.32)",i.fill(),i.translate(0,-1.6),l();let c=i.createLinearGradient(-r*.5,-r*.5,r*.5,r*.5);return c.addColorStop(0,"#FFFFFF"),c.addColorStop(1,An(s.star)),i.fillStyle=c,i.fill(),i.strokeStyle="rgba(255,250,236,.55)",i.lineWidth=1.4,i.stroke(),i.restore(),xe(n,{aniso:8})}function gf(s,t,e,n,i){let r=n||256,{c:o,g:a}=me(r,r),l=Se[t]||Se.red,c=tn(7788),h=a.createRadialGradient(r*.44,r*.38,r*.04,r*.5,r*.55,r*.78);h.addColorStop(0,an(1777445,l,.34)),h.addColorStop(.55,an(1251100,l,.24)),h.addColorStop(1,"#0A0D11"),a.fillStyle=h,wn(a,3,3,r-6,r-6,r*.14),a.fill(),a.strokeStyle="rgba(214,180,124,.85)",a.lineWidth=r*.018,wn(a,r*.035,r*.035,r*.93,r*.93,r*.125),a.stroke(),a.strokeStyle=An(l,.9),a.lineWidth=r*.01,wn(a,r*.062,r*.062,r*.876,r*.876,r*.105),a.stroke(),a.strokeStyle="rgba(226,196,146,.24)",a.lineWidth=r*.004,wn(a,r*.086,r*.086,r*.828,r*.828,r*.09),a.stroke();for(let _=0;_<22;_++)a.globalAlpha=.03+c()*.05,a.fillStyle=c()>.5?"#FFFFFF":"#000000",a.fillRect(r*(.08+c()*.8),r*(.08+c()*.8),2+c()*7,.8+c());a.globalAlpha=1;let u=a.createRadialGradient(r*.29,r*.26,0,r*.29,r*.26,r*.25);u.addColorStop(0,"rgba(20,12,6,.30)"),u.addColorStop(1,"rgba(20,12,6,0)"),a.fillStyle=u,a.beginPath(),a.arc(r*.29,r*.26,r*.25,0,yt),a.fill();let d=r*(i?i.u:.58),f=r*(i?i.v:.7),g=s==="takeoff"||s==="fly"||s==="fate"||s==="dare";return Il(a,s,d,f-r*.055,r*.3,an(l,15721164,.55),{engrave:!0,lw:5.2,fill:g}),e&&(a.fillStyle="rgba(236,220,190,.86)",a.font=`600 ${Math.round(r*.082)}px "Songti SC","STSong","SimSun","PingFang SC",serif`,a.textAlign="center",a.textBaseline="middle",a.fillText(e,d,f+r*.115),a.strokeStyle="rgba(212,176,120,.34)",a.lineWidth=1.2,a.beginPath(),a.moveTo(d-r*.07,f+r*.165),a.lineTo(d+r*.07,f+r*.165),a.stroke()),xe(o,{aniso:8})}function _f(){let s=new Yi;s.background=new Ot(329482);let t=(e,n,i,r,o,a,l)=>{let c=new At(e,new He({color:n,side:Fe}));return c.position.set(i,r,o),a&&(c.rotation.x=a),l&&(c.rotation.y=l),s.add(c),c};return t(new Qt(24,14,24),1317924,0,0,0).material.side=We,t(new Me(18,18),3811096,0,-4.4,0,-Math.PI/2),t(new Me(3.2,3.2),16766106,-4.6,3.2,-2.2,0,Math.PI/2),t(new Me(1.4,1.4),16773330,-4.4,3,-2.4,0,Math.PI/2),t(new Me(4.2,2.6),9418472,5.2,1.4,-4.6,0,-Math.PI/2.2),t(new Me(5,3.2),4086400,5.4,1.2,-4.4,0,-Math.PI/2.2),t(new Me(10,10),2764856,0,6.6,0,Math.PI/2),s}function xf(s=128){let t=s,e=s*2,{c:n,g:i}=me(t,e),r=tn(9021);i.fillStyle="#6E6257",i.fillRect(0,0,t,e);for(let l=0;l<t;l++){let c=l/t,u=.5+Math.sin(c*Math.PI*9+Math.sin(c*5.1)*.6)*.28,d=Math.round(70+u*90);i.fillStyle=`rgb(${d+14},${d+4},${d-10})`,i.fillRect(l,0,1,e)}let o=i.createLinearGradient(0,0,0,e*.16);o.addColorStop(0,"rgba(10,8,6,.55)"),o.addColorStop(1,"rgba(10,8,6,0)"),i.fillStyle=o,i.fillRect(0,0,t,e*.16);let a=i.createLinearGradient(0,e*.72,0,e);a.addColorStop(0,"rgba(8,6,4,0)"),a.addColorStop(1,"rgba(8,6,4,.45)"),i.fillStyle=a,i.fillRect(0,e*.72,t,e*.28);for(let l=0;l<900;l++)i.globalAlpha=.02+r()*.05,i.fillStyle=r()>.5?"rgba(255,244,224,.9)":"rgba(0,0,0,.8)",i.fillRect(r()*t,r()*e,1,1+r()*2);return i.globalAlpha=1,xe(n,{aniso:4})}function yf(s=128){let t=s,{c:e,g:n}=me(t*4,t*2),i=tn(778899),r=u=>{n.save(),n.translate(u%4*t,Math.floor(u/4)*t)},o=()=>{n.restore()},a=(u,d)=>{for(let f=0;f<u;f++)n.globalAlpha=d*(.3+i()*.7),n.fillStyle=i()>.5?"rgba(255,255,255,.9)":"rgba(0,0,0,.8)",n.fillRect(i()*t,i()*t,1,1+i()*2);n.globalAlpha=1};r(0);let l=n.createLinearGradient(0,0,t,t);l.addColorStop(0,"#232B3A"),l.addColorStop(.55,"#1A1F2A"),l.addColorStop(1,"#3A2A22"),n.fillStyle=l,n.fillRect(0,0,t,t),n.fillStyle="#F0E2C8",n.fillRect(10,12,t-20,5),n.fillStyle="rgba(240,226,200,.72)",n.fillRect(10,21,t-44,2);let c=n.createLinearGradient(14,34,t-14,92);c.addColorStop(0,"#6E93A6"),c.addColorStop(.55,"#C8A46C"),c.addColorStop(1,"#3A2A22"),n.fillStyle=c,n.fillRect(14,34,t-28,58),n.fillStyle="rgba(8,12,18,.55)",n.beginPath(),n.moveTo(14,92),n.lineTo(52,58),n.lineTo(80,92),n.closePath(),n.fill(),n.fillStyle="rgba(250,242,226,.78)",n.fillRect(14,100,t-46,3),n.fillStyle="rgba(232,222,200,.42)",n.fillRect(14,108,t-64,2),n.fillRect(14,114,t-74,2),n.strokeStyle="rgba(214,178,120,.50)",n.lineWidth=1.2,n.strokeRect(6.5,6.5,t-13,t-13),a(160,.05),o(),r(1),n.fillStyle="#E7DCC6",n.fillRect(0,0,t,t),n.fillStyle="rgba(36,30,24,.86)",n.fillRect(8,8,t-16,6),n.fillStyle="rgba(36,30,24,.30)",n.fillRect(8,17,t-16,1.6);for(let u=0;u<3;u++){let d=8+u*((t-16)/3),f=(t-16)/3-5;for(let g=0;g<(u===1?14:20);g++){let _=24+g*4.4;if(_>t-14)break;n.fillStyle="rgba(50,44,36,.36)",n.fillRect(d,_,f*(.55+i()*.45),1.5)}}n.fillStyle="rgba(60,64,66,.80)",n.fillRect(8,t-34,t-16,22),n.fillStyle="rgba(228,214,190,.55)",n.fillRect(10,t-32,t-20,2),a(120,.04),o(),r(2),n.fillStyle="#EBDCC0",n.fillRect(0,0,t,t),n.fillStyle="#7A2E36",n.fillRect(0,0,22,t),n.fillStyle="rgba(30,20,16,.82)",n.fillRect(32,22,t-44,4),n.fillStyle="rgba(46,36,28,.42)",n.fillRect(32,32,t-56,2.4),n.fillRect(32,40,t-66,2.4),n.strokeStyle="rgba(60,46,36,.55)",n.lineWidth=1.4,n.setLineDash([4,4]),n.beginPath(),n.moveTo(t-30,8),n.lineTo(t-30,t-8),n.stroke(),n.setLineDash([]),n.fillStyle="rgba(30,22,18,.86)";for(let u=0;u<12;u++)n.fillRect(t-22+u%6*2.4,18+Math.floor(u/6)*26,1.2,22);n.fillStyle="#7A2E36",n.fillRect(32,t-34,t-74,3),n.fillStyle="rgba(40,30,24,.55)",n.beginPath(),n.arc(t-30,t*.52,4,0,yt),n.fill(),a(90,.04),o(),r(3),l=n.createLinearGradient(0,0,0,t),l.addColorStop(0,"#2B4763"),l.addColorStop(.5,"#B07A4E"),l.addColorStop(.78,"#E8C08A"),l.addColorStop(1,"#7A4A2C"),n.fillStyle=l,n.fillRect(0,0,t,t),n.fillStyle="rgba(255,236,208,.34)";for(let u=0;u<5;u++){let d=t*(.62+u*.06);n.beginPath(),n.ellipse(t*(.2+i()*.6),d,t*(.16+i()*.14),t*.035,0,0,yt),n.fill()}n.fillStyle="rgba(18,22,26,.88)",n.beginPath(),n.moveTo(28,44),n.lineTo(72,56),n.lineTo(40,64),n.lineTo(36,56),n.lineTo(28,44),n.closePath(),n.fill(),n.strokeStyle="rgba(214,180,124,.75)",n.lineWidth=1.4,n.strokeRect(t-42,10,30,34),n.fillStyle="rgba(240,226,198,.85)",n.fillRect(t-39,13,24,28),n.fillStyle="rgba(36,30,24,.55)",n.fillRect(10,t-30,46,2),n.fillRect(10,t-22,38,2),n.fillRect(10,t-14,42,2),n.strokeStyle="rgba(250,244,232,.55)",n.lineWidth=1.2,n.strokeRect(3.5,3.5,t-7,t-7),a(110,.05),o(),r(4),l=n.createRadialGradient(t*.58,t*.44,2,t*.5,t*.5,t*.85),l.addColorStop(0,"#C08A50"),l.addColorStop(.34,"#7A5334"),l.addColorStop(.66,"#3A3040"),l.addColorStop(1,"#161C26"),n.fillStyle=l,n.fillRect(0,0,t,t);let h=n.createLinearGradient(0,t,t,0);h.addColorStop(0,"rgba(255,196,120,.30)"),h.addColorStop(.55,"rgba(255,196,120,.06)"),h.addColorStop(1,"rgba(255,196,120,0)"),n.fillStyle=h,n.fillRect(0,0,t,t);for(let u=0;u<30;u++){let d=i()*t,f=i()*t,g=2+i()*9,_=n.createRadialGradient(d,f,0,d,f,g);_.addColorStop(0,"rgba(255,214,150,.85)"),_.addColorStop(.45,"rgba(255,186,110,.30)"),_.addColorStop(1,"rgba(255,170,90,0)"),n.fillStyle=_,n.beginPath(),n.arc(d,f,g,0,yt),n.fill()}n.fillStyle="rgba(250,242,228,.94)",n.beginPath(),n.moveTo(t*.42,t*.58),n.lineTo(t*.72,t*.44),n.lineTo(t*.56,t*.62),n.lineTo(t*.51,t*.58),n.closePath(),n.fill(),n.strokeStyle="rgba(255,248,232,.34)",n.lineWidth=3,n.strokeRect(4,4,t-8,t-8),a(120,.04),o(),r(5),n.fillStyle="#2A2724",n.fillRect(0,0,t,t),n.fillStyle="#171513",n.fillRect(6,6,t-12,t-12),n.fillStyle="rgba(226,214,190,.92)",n.fillRect(14,30,t-28,50),n.fillStyle="rgba(58,50,42,.8)",n.fillRect(18,34,t-36,4),n.fillStyle="rgba(58,50,42,.55)",n.fillRect(18,43,t-52,2.4),n.fillRect(18,49,t-62,2.4);for(let u of[t*.34,t*.66])n.fillStyle="#0E0D0C",n.beginPath(),n.arc(u,16,10,0,yt),n.fill(),n.fillStyle="#5A5046",n.beginPath(),n.arc(u,16,5,0,yt),n.fill(),n.fillStyle="#C9BDA8",n.beginPath(),n.arc(u,16,2,0,yt),n.fill();n.fillStyle="#8E8476",n.fillRect(14,88,t-28,24),n.fillStyle="rgba(255,246,232,.30)",n.fillRect(14,88,t-28,2);for(let[u,d]of[[10,10],[t-10,10],[10,t-10],[t-10,t-10]])n.fillStyle="#6E665A",n.beginPath(),n.arc(u,d,2.6,0,yt),n.fill();a(80,.05),o(),r(6),l=n.createLinearGradient(0,0,t,t),l.addColorStop(0,"#22262B"),l.addColorStop(1,"#111418"),n.fillStyle=l,n.fillRect(0,0,t,t);for(let u=8;u<t-8;u+=6)for(let d=8+u/6%2*3;d<t-8;d+=6)n.fillStyle="rgba(4,6,8,.75)",n.beginPath(),n.arc(d,u,1.8,0,yt),n.fill(),n.fillStyle="rgba(255,240,214,.10)",n.beginPath(),n.arc(d-.6,u-.7,1,0,yt),n.fill();n.strokeStyle="rgba(206,172,116,.82)",n.lineWidth=3,n.beginPath(),n.arc(t*.5,t*.5,t*.32,0,yt),n.stroke(),n.strokeStyle="rgba(20,16,12,.55)",n.lineWidth=1.4,n.beginPath(),n.arc(t*.5,t*.5,t*.4,0,yt),n.stroke(),a(90,.04),o(),r(7),n.fillStyle="#EFE3CC",n.fillRect(0,0,t,t),n.fillStyle="rgba(90,60,50,.95)",n.fillRect(0,0,t,2);for(let u=20;u<t-8;u+=9)n.fillStyle="rgba(78,112,140,.30)",n.fillRect(12,u,t-22,1);return n.fillStyle="rgba(150,60,60,.38)",n.fillRect(0,10,1.6,t-10),n.fillStyle="rgba(78,72,64,.42)",n.fillRect(t*.55,t-14,12,2),a(100,.03),o(),xe(e,{aniso:8})}function vf(){if(Cl)return Cl;let s=64,{c:t,g:e}=me(s,s),n=s/2,i=e.createRadialGradient(n,n,0,n,n,n);return i.addColorStop(0,"rgba(255,246,232,.55)"),i.addColorStop(.45,"rgba(255,238,216,.20)"),i.addColorStop(1,"rgba(255,238,216,0)"),e.fillStyle=i,e.beginPath(),e.arc(n,n,n,0,yt),e.fill(),Cl=xe(t),Cl}function Mf(){if(Pl)return Pl;let s=32,t=64,{c:e,g:n}=me(s,t),i=n.createLinearGradient(0,t,0,0);return i.addColorStop(0,"rgba(255,150,60,.95)"),i.addColorStop(.45,"rgba(255,206,120,.95)"),i.addColorStop(.8,"rgba(255,246,214,.95)"),i.addColorStop(1,"rgba(255,246,214,0)"),n.fillStyle=i,n.beginPath(),n.moveTo(s*.5,2),n.bezierCurveTo(s*.86,t*.34,s*.82,t*.82,s*.5,t*.96),n.bezierCurveTo(s*.18,t*.82,s*.14,t*.34,s*.5,2),n.closePath(),n.fill(),Pl=xe(e),Pl}function xi(s){let t=[],e=[],n=[],i=new R,r=new Kt;for(let{geo:a,matrix:l}of s){let c=a.index?a.toNonIndexed():a.clone();l&&c.applyMatrix4(l);let h=c.getAttribute("position"),u=c.getAttribute("normal"),d=c.getAttribute("uv");for(let f=0;f<h.count;f++)t.push(h.getX(f),h.getY(f),h.getZ(f)),u&&e.push(u.getX(f),u.getY(f),u.getZ(f)),d?n.push(d.getX(f),d.getY(f)):n.push(0,0);c.dispose()}let o=new ve;return o.setAttribute("position",new qt(t,3)),e.length&&o.setAttribute("normal",new qt(e,3)),o.setAttribute("uv",new qt(n,2)),e.length||o.computeVertexNormals(),o}function Ih(s){let t=[],e=[],n=[],i=[],r=new be;for(let a of s){let l=a.geo.index?a.geo.toNonIndexed():a.geo.clone(),c=a.matrix;c&&l.applyMatrix4(c);let h=l.getAttribute("position"),u=l.getAttribute("normal"),d=l.getAttribute("uv"),f=a.color||[1,1,1];for(let g=0;g<h.count;g++)t.push(h.getX(g),h.getY(g),h.getZ(g)),u?e.push(u.getX(g),u.getY(g),u.getZ(g)):e.push(0,1,0),d?n.push(d.getX(g),d.getY(g)):n.push(.5,.5),i.push(f[0],f[1],f[2]);l.dispose()}let o=new ve;return o.setAttribute("position",new qt(t,3)),o.setAttribute("normal",new qt(e,3)),o.setAttribute("uv",new qt(n,2)),o.setAttribute("color",new qt(i,3)),r.position.set(0,0,0),o}function Ul(s){let t=[],e=[],n=[],i=new R,r=new R,o=new R,a=ps(sr),l=(a[0]+a[2])/2,c=(a[1]+a[3])/2;function h(d,f,g,_,m,p){i.subVectors(f,d),r.subVectors(g,d),o.crossVectors(i,r).normalize();let b=[0,1,2,0,2,3],S=[d,f,g,_];for(let x of b){let A=S[x];t.push(A.x,A.y,A.z);let w=m[x];e.push(w[0],w[1]),n.push(p[0],p[1],p[2])}}for(let d of s){let f=Math.cos(d.rot),g=Math.sin(d.rot),_=d.w/2,m=d.d/2,p=(j,at,nt)=>new R(d.x+j*f+at*g,nt,d.z-j*g+at*f),b=Math.max(.006,Math.min(d.w,d.d)*(d.bevel===void 0?.1:d.bevel)),S=b*.95,x=_-b,A=m-b,w=d.top,P=d.top-S,C=d.uv[0],M=d.uv[1],v=d.uv[2],I=d.uv[3],L=(v-C)*.012,U=(I-M)*.012,G=[1,1,1],B=[.84,.84,.84];h(p(-x,A,w),p(x,A,w),p(x,-A,w),p(-x,-A,w),[[C+L,M+U],[v-L,M+U],[v-L,I-U],[C+L,I-U]],G),h(p(-_,m,P),p(_,m,P),p(x,A,w),p(-x,A,w),[[C,I],[v,I],[v-L,I-U],[C+L,I-U]],B),h(p(-x,-A,w),p(x,-A,w),p(_,-m,P),p(-_,-m,P),[[C+L,M+U],[v-L,M+U],[v,M],[C,M]],B),h(p(x,-A,w),p(x,A,w),p(_,m,P),p(_,-m,P),[[v-L,M+U],[v-L,I-U],[v,I],[v,M]],B),h(p(-_,-m,P),p(-_,m,P),p(-x,A,w),p(-x,-A,w),[[C,M],[C,I],[C+L,I-U],[C+L,M+U]],B);let W=l,Z=c,k=[[W,Z],[W,Z],[W,Z],[W,Z]];h(p(-_,m,w),p(-_,m,d.bottom),p(_,m,d.bottom),p(_,m,w),k,d.side),h(p(_,m,w),p(_,m,d.bottom),p(_,-m,d.bottom),p(_,-m,w),k,d.side),h(p(_,-m,w),p(_,-m,d.bottom),p(-_,-m,d.bottom),p(-_,-m,w),k,d.side),h(p(-_,-m,w),p(-_,-m,d.bottom),p(-_,m,d.bottom),p(-_,m,w),k,d.side)}let u=new ve;return u.setAttribute("position",new qt(t,3)),u.setAttribute("uv",new qt(e,2)),u.setAttribute("color",new qt(n,3)),u.computeVertexNormals(),u}function bf(s){let t=new Qt(s,s,s),e=t.getAttribute("uv");for(let n=0;n<6;n++){let i=Kn[n],r=(i-1)%3,o=Math.floor((i-1)/3);for(let a=0;a<4;a++){let l=n*4+a,c=e.getX(l)===1?1:0,h=e.getY(l)===1?1:0;e.setXY(l,(r+c)/3,(1-o+h)/2)}}return e.needsUpdate=!0,t}var Ch=null,Ph=null;function Tx(){return Ch||(Ch=Ll(256)),Ch}function wx(){return Ph||(Ph=or(128)),Ph}function Ef(s,t){let e=new fe,n=.46,i=.3,r=.075,o=[0,.022,-n/2],a=[0,.05,n/2],l=[-i/2,.002,n/2-.07],c=[i/2,.002,n/2-.07],h=[0,-r,n/2-.02],u=[0,.18,n/2-.005],d=[0,.028,.02],f=(k,j,at,nt,ft)=>{k.push(...at,...nt,...ft);for(let Ut of[at,nt,ft])j.push(Sf(.5+Ut[0]/(i*1.45)),Sf(.5+Ut[2]/(n*1.2)))},g=[],_=[];f(g,_,o,l,d),f(g,_,o,d,c),f(g,_,d,l,a),f(g,_,d,a,c);let m=[],p=[];f(m,p,o,h,d),f(m,p,d,h,a),f(m,p,a,h,u);let b=(k,j)=>{let at=new ve;return at.setAttribute("position",new qt(k,3)),at.setAttribute("uv",new qt(j,2)),at.computeVertexNormals(),at},S=Tx(),x=wx(),A=new Yt({map:S.map,normalMap:S.normal,normalScale:new st(Vt.paper.normalScale,Vt.paper.normalScale),color:s,roughness:Vt.paper.roughness,metalness:Vt.paper.metalness,side:Fe,envMapIntensity:Vt.paper.envMapIntensity}),w=new Yt({map:x.map,normalMap:x.normal,roughnessMap:x.rough,normalScale:new st(.35,.35),color:t,roughness:Vt.brass.roughness,metalness:Vt.brass.metalness,envMapIntensity:Vt.brass.envMapIntensity}),P=b(g,_),C=b(m,p),M=xi([{geo:P},{geo:C}]);P.dispose(),C.dispose();let v=new At(M,A);v.castShadow=!0,v.receiveShadow=!0;let I=new Qt(.016,.012,n*.62),L=new Gt().makeTranslation(0,.033,.03),U=new Ce(.02,10,7),G=new Gt().makeTranslation(0,.005,-n/2+.022),B=xi([{geo:I,matrix:L},{geo:U,matrix:G}]);I.dispose(),U.dispose();let W=new At(B,w);W.castShadow=!0;let Z=new fe;return Z.rotation.set(-.045,0,.16),Z.add(v),Z.add(W),e.add(Z),{group:e,setColor(k,j){A.color.set(k),j!==void 0&&w.color.set(j)},dispose(){M.dispose(),B.dispose(),A.dispose(),w.dispose()}}}function Sf(s){return s<0?0:s>1?1:s}function Tf(){let s=new fe;s.name="hand",s.visible=!1,s.scale.setScalar(.68),s.scale.setScalar(.68);let t=nf(128),e=new Yt({vertexColors:!0,roughness:.62,metalness:.02,normalMap:t.normal,normalScale:new st(.55,.55),roughnessMap:t.rough,envMapIntensity:.78}),n=new Yt({color:5915184,roughness:.8,metalness:.02,normalMap:t.normal,normalScale:new st(.5,.5),roughnessMap:t.rough,envMapIntensity:.78}),i=new Yt({color:2365972,roughness:.86,metalness:.02,normalMap:t.normal,normalScale:new st(.35,.35),envMapIntensity:.38}),r=new Yt({color:11569751,roughness:.3,metalness:.88,envMapIntensity:1.3}),o=new R(0,1,0),a=new Ie,l=new R,c=new R,h=new Gt,u=(H,J,X,ht,ut,wt)=>(a.setFromUnitVectors(o,H),h.compose(l.set(J,X,ht),a,c.set(wt,ut,wt)),h.clone()),d=(H,J,X,ht)=>(h.compose(l.set(H,J,X),a.identity(),c.set(ht,ht,ht)),h.clone()),f=new Ce(1,10,8),g=[.105,.058,.032],_=[.15,.088,.05],m=[.07,.038,.021],p=[.032,.02,.013],b=[.016,.01,.006],S=[],x=(H,J,X,ht,ut,wt,Pt)=>{let ot=new Gt().compose(new R(H,J,X),new Ie,new R(ht,ut,wt));S.push({geo:f,matrix:ot,color:Pt})};x(0,.006,.012,.135,.047,.132,g),x(0,-.002,.108,.118,.042,.062,m),x(.088,-.004,-.036,.062,.038,.075,_),x(0,.026,-.106,.135,.028,.042,m),x(0,.043,-.012,.09,.012,.105,_);let A=new te(.108,.114,.078,16,1),w=new Gt().makeRotationX(Math.PI/2);w.setPosition(0,-.002,.214),S.push({geo:A,matrix:w,color:p});for(let H of[.176,.252]){let J=new te(.114,.114,.01,16,1),X=new Gt().makeRotationX(Math.PI/2);X.setPosition(0,-.002,H),S.push({geo:J,matrix:X,color:b})}let P=new Qt(.0035,.003,.15);for(let H of[-.083,.083])S.push({geo:P,matrix:new Gt().makeTranslation(H,.048,-.012),color:b});let C=Ih(S);S.forEach(H=>{H.geo!==f&&H.geo!==P&&H.geo.dispose()}),P.dispose();let M=new At(C,e);M.castShadow=!0,M.receiveShadow=!0,s.add(M);let v=new te(.4,.5,1,8,1,!0),I=[{x:-.096,l0:.09,l1:.074,w:.058,sp:-.11,ph:0},{x:-.033,l0:.098,l1:.082,w:.06,sp:-.04,ph:.03},{x:.033,l0:.094,l1:.078,w:.058,sp:.04,ph:.06},{x:.098,l0:.08,l1:.066,w:.052,sp:.11,ph:.09}],L=new Zi(v,n,4),U=new Zi(v,n,4),G=new Zi(f,n,12);for(let H of[L,U,G])H.castShadow=!0,H.receiveShadow=!0,H.frustumCulled=!1,H.instanceMatrix.setUsage(Zc),s.add(H);let B=new be,W=new R,Z=new R,k=new R,j=-.128,at=.018;function nt(H){let J=H<0?0:H>1?1:H;for(let X=0;X<4;X++){let ht=I[X],ut=Math.max(0,Math.min(1,J+(ht.ph-.045))),wt=.14+.56*ut,Pt=wt+.38+1.12*ut,ot=ht.x,Mt=at,zt=j,It=Z.set(Math.sin(ht.sp),-Math.sin(wt),-Math.cos(wt)).normalize(),xt=k.set(Math.sin(ht.sp),-Math.sin(Pt),-Math.cos(Pt)).normalize();B.position.set(ot+It.x*ht.l0/2,Mt+It.y*ht.l0/2,zt+It.z*ht.l0/2),B.quaternion.setFromUnitVectors(o,It),B.scale.set(ht.w,ht.l0,ht.w),B.updateMatrix(),L.setMatrixAt(X,B.matrix);let $t=ot+It.x*ht.l0,F=Mt+It.y*ht.l0,ct=zt+It.z*ht.l0;B.position.set($t+xt.x*ht.l1/2,F+xt.y*ht.l1/2,ct+xt.z*ht.l1/2),B.quaternion.setFromUnitVectors(o,xt),B.scale.set(ht.w*.9,ht.l1,ht.w*.9),B.updateMatrix(),U.setMatrixAt(X,B.matrix);let mt=ht.w*.55,Rt=(lt,et,Ft,Jt,he)=>{B.position.set(et,Ft,Jt),B.quaternion.identity(),B.scale.set(he,he,he),B.updateMatrix(),G.setMatrixAt(lt,B.matrix)};Rt(X*3,ot,Mt,zt,mt),Rt(X*3+1,$t,F,ct,mt*.88),Rt(X*3+2,$t+xt.x*ht.l1,F+xt.y*ht.l1,ct+xt.z*ht.l1,mt*.76)}L.instanceMatrix.needsUpdate=!0,U.instanceMatrix.needsUpdate=!0,G.instanceMatrix.needsUpdate=!0}let ft=new fe;ft.position.set(.162,.004,-.04);let Ut=.058,Lt=new R(0,0,-1),Ct=[];Ct.push({geo:v,matrix:u(Lt,0,0,-.052,.104,Ut)}),Ct.push({geo:f,matrix:d(0,0,.004,.031)});let V=xi(Ct),$=new At(V,n);$.castShadow=!0,$.receiveShadow=!0,ft.add($);let vt=new fe;vt.position.set(0,0,-.104);let bt=[];bt.push({geo:v,matrix:u(Lt,0,0,-.044,.088,Ut*.9)}),bt.push({geo:f,matrix:d(0,0,0,.027)}),bt.push({geo:f,matrix:d(0,0,-.088,.023)});let Tt=xi(bt),jt=new At(Tt,n);jt.castShadow=!0,jt.receiveShadow=!0,vt.add(jt),ft.add(vt),s.add(ft);let ce=[],D=new te(.18,.13,1.7,14,1),it=new Gt().makeRotationX(Math.PI/2);it.setPosition(0,-.012,1.14),ce.push({geo:D,matrix:it});let tt=new te(.136,.14,.06,14,1),Q=new Gt().makeRotationX(Math.PI/2);Q.setPosition(0,-.006,.295),ce.push({geo:tt,matrix:Q});let K=xi(ce);D.dispose(),tt.dispose();let pt=new At(K,i);pt.castShadow=!0,pt.receiveShadow=!0,s.add(pt);let rt=[],_t=new te(.022,.024,.014,12);rt.push({geo:_t,matrix:new Gt().makeTranslation(0,.108,.214)});for(let H of[-.062,.062]){let J=new Ce(.011,8,6);rt.push({geo:J,matrix:new Gt().makeTranslation(H,.095,.214)})}let Zt=new Qt(.085,.016,.06);rt.push({geo:Zt,matrix:new Gt().makeTranslation(0,.142,.66)});let Wt=new Qt(.03,.024,.07);rt.push({geo:Wt,matrix:new Gt().makeTranslation(0,.15,.66)});let T=xi(rt);rt.forEach(H=>H.geo.dispose());let y=new At(T,r);y.castShadow=!0,s.add(y);function z(H){let J=H<0?0:H>1?1:H;nt(J),ft.rotation.set(-.24-.42*J,.58+.36*J,.12-.1*J),vt.rotation.x=-.32-.95*J}return z(0),{group:s,setGrip:z,gripLocal:new R(0,-.198,-.075),textures:[t.normal,t.rough],dispose(){C.dispose(),v.dispose(),f.dispose(),V.dispose(),Tt.dispose(),K.dispose(),T.dispose(),e.dispose(),n.dispose(),i.dispose(),r.dispose(),s.clear()}}}function Nl(s,t){let e=new At(new Me(s,s),new He({map:uf(),transparent:!0,opacity:t===void 0?.5:t,depthWrite:!1,color:0}));return e.rotation.x=-Math.PI/2,e.position.y=.006,e}function ar(s,t){let e=new At(new Me(s,s),new He({map:Oi(),transparent:!0,opacity:0,depthWrite:!1,blending:Xe,color:t,fog:!1,toneMapped:!1}));return e.rotation.x=-Math.PI/2,e}function wf(s){let t=new At(new Me(s,s),new He({map:ff(),transparent:!0,opacity:0,depthWrite:!1,blending:Xe,color:16767138,fog:!1,toneMapped:!1}));return t.rotation.x=-Math.PI/2,t.position.y=.01,t}function Af(s){let t=new fe;t.visible=!1;let e=new He({map:s,transparent:!0,opacity:.36,depthWrite:!1,blending:Xe,color:16771272,fog:!1,toneMapped:!1}),n=[];for(let i=0;i<10;i++){let r=new Me(.045,2.4),o=new At(r,e),a=i/10*Math.PI*2+i%3*.3,l=.55+i%4*.24;o.position.set(Math.cos(a)*l,.45+i%5*.22,-2.2+i%3*1.3),o.rotation.z=(i%2?1:-1)*.06,t.add(o),n.push(o)}return{group:t,update(i,r){if(r)for(let o of n)o.position.z+=i*.0065,o.position.z>3.4&&(o.position.z-=6.2)},dispose(){n.forEach(i=>i.geometry.dispose()),e.dispose()}}}var Dh=null,Lh=null;function Ax(){return Dh||(Dh=Dl(13616826,128)),Dh}function Rx(){return Lh||(Lh=or(96)),Lh}function Rf(){let s=new fe,t=Ax(),e=Rx(),n={fur:new Yt({map:t.map,normalMap:t.normal,normalScale:new st(.85,.85),color:9071180,roughness:Vt.felt.roughness,metalness:0,envMapIntensity:.35}),furDark:new Yt({map:t.map,normalMap:t.normal,normalScale:new st(.7,.7),color:7098682,roughness:.96,metalness:0,envMapIntensity:.3}),cream:new Yt({map:t.map,color:15259323,roughness:.9,metalness:0,envMapIntensity:.35}),ink:new Yt({color:1314832,roughness:.22,metalness:.15,envMapIntensity:.9}),hat:new Yt({map:t.map,normalMap:t.normal,color:2438222,roughness:.86,metalness:.02,envMapIntensity:.4}),band:new Yt({map:e.map,normalMap:e.normal,roughnessMap:e.rough,color:13213795,roughness:Vt.brass.roughness,metalness:Vt.brass.metalness,envMapIntensity:Vt.brass.envMapIntensity}),scarf:new Yt({map:t.map,normalMap:t.normal,color:9321275,roughness:.94,metalness:0,envMapIntensity:.3})},i={},r=new be,o=(l,c,h,u,d,f,g)=>{r.position.set(h,u,d),r.rotation.set(f&&f[0]||0,f&&f[1]||0,f&&f[2]||0),r.scale.set(g?g[0]:1,g?g[1]:1,g?g[2]:1),r.updateMatrix(),(i[l]=i[l]||[]).push({geo:c,matrix:r.matrix.clone()})};o("fur",new Ce(.135,14,10),0,.155,0),o("fur",new Ce(.125,14,10),0,.375,0),o("cream",new Ce(.062,12,9),0,.345,-.1),o("ink",new Ce(.019,10,8),0,.368,-.152),o("ink",new Ce(.017,8,6),-.05,.42,-.116),o("ink",new Ce(.017,8,6),.05,.42,-.116),o("furDark",new Ce(.047,12,9),-.082,.462,.004),o("furDark",new Ce(.047,12,9),.082,.462,.004),o("fur",new ks(.028,.085,3,8),-.128,.185,0,[0,0,.55]),o("fur",new ks(.028,.085,3,8),.128,.185,0,[0,0,-.55]),o("furDark",new Ce(.05,10,8),-.062,.042,-.018),o("furDark",new Ce(.05,10,8),.062,.042,-.018),o("scarf",new Ve(.118,.032,7,18),0,.268,0,[Math.PI/2,0,0]),o("scarf",new Qt(.07,.1,.026),.095,.215,.05,[.2,.1,-.2]),o("hat",new te(.098,.106,.058,16,1),0,.468,.012),o("band",new te(.104,.104,.012,18,1),0,.443,.012),o("hat",new Ce(.062,14,9),0,.474,-.062,null,[1.04,.17,.52]),o("band",new Ve(.026,.008,5,14),0,.468,-.092,[-.5,0,0]);let a=[];for(let l of Object.keys(i)){let c=i[l],h=Cx(c),u=new At(h,n[l]);u.castShadow=!0,u.receiveShadow=!0,s.add(u),a.push(h),c.forEach(d=>d.geo.dispose())}return s.position.y=cs,s.rotation.y=Math.PI+Ui*Ue,s.scale.setScalar(.001),s.visible=!1,{group:s,setOutfit(l){l&&(l.fur!==void 0&&n.fur.color.set(l.fur),l.furDark!==void 0&&n.furDark.color.set(l.furDark),l.hat!==void 0&&n.hat.color.set(l.hat),l.band!==void 0&&n.band.color.set(l.band),l.scarf!==void 0&&n.scarf.color.set(l.scarf))},setVisible(l){s.visible=!!l},dispose(){a.forEach(l=>l.dispose()),Object.keys(n).forEach(l=>n[l].dispose())}}}function Cx(s){let t=[],e=[],n=[];for(let{geo:r,matrix:o}of s){let a=r.index?r.toNonIndexed():r.clone();a.applyMatrix4(o);let l=a.getAttribute("position"),c=a.getAttribute("normal"),h=a.getAttribute("uv");for(let u=0;u<l.count;u++)t.push(l.getX(u),l.getY(u),l.getZ(u)),c&&e.push(c.getX(u),c.getY(u),c.getZ(u)),h?n.push(h.getX(u),h.getY(u)):n.push(0,0);a.dispose()}let i=new ve;return i.setAttribute("position",new qt(t,3)),e.length?i.setAttribute("normal",new qt(e,3)):i.computeVertexNormals(),i.setAttribute("uv",new qt(n,2)),i}function Fh(s){let t=Number(s);return isFinite(t)?Math.min(1.5,Math.max(.8,t)):1}function Uh(s){let t=Fh(s),e=t<=1?1/t:1-.6*(t-1);return Math.min(1.4,Math.max(.7,e))}var Ol=class{constructor(t={}){this.min=t.min||.8,this.max=t.max||1.5,this.tau=t.tau||110,this.target=1,this.value=1,this.active=!0,this.instant=!1}set(t){let e=Number(t);return isFinite(e)&&(this.target=Math.min(this.max,Math.max(this.min,e))),this.instant&&(this.value=this.target),this.target}by(t){let e=Number(t);return this.set(this.target*(isFinite(e)&&e>0?e:1))}reset(){return this.set(1)}setActive(t){let e=!!t;return e===this.active?this.active:(this.active=e,this.instant&&(this.value=this.want()),this.active)}setInstant(t){return this.instant=!!t,this.instant&&(this.value=this.want()),this.instant}want(){return this.active?this.target:1}step(t){let e=this.want();if(this.instant||!(t>0))return this.value=e,this.value;let n=1-Math.exp(-t/this.tau),i=this.value+(e-this.value)*n;return this.value=Math.abs(e-i)<8e-4?e:i,this.value}info(){return{value:+this.value.toFixed(3),target:+this.target.toFixed(3),min:this.min,max:this.max,active:this.active,instant:this.instant,radiusFactor:+Uh(this.value).toFixed(3)}}};var Bl=class{constructor(t,e={}){this.camera=t,this.runAnim=e.runAnim||((n,i)=>(i(1),Promise.resolve())),this.aspect=1,this.lockState=null,this.shakeUntil=0,this.shakeAmp=0,this.state={center:new R(0,.05,.24),nx:0,ny:0,radius:12,elev:58,azim:0,fov:42},this._right=new R,this._up=new R,this._proj=new R,this._look=new R,this.zoom=new Ol,this._lastApplyAt=0}setZoom(t){return this.zoom.set(Fh(t))}zoomBy(t){return this.zoom.by(t)}resetZoom(){return this.zoom.reset()}setZoomActive(t){return this.zoom.setActive(t)}setZoomReduced(t){return this.zoom.setInstant(t)}get zoomValue(){return this.zoom.value}zoomInfo(){return this.zoom.info()}setAspect(t){this.aspect=Math.max(.2,t||1),this.camera.aspect=this.aspect,this.camera.updateProjectionMatrix()}camPosFrom(t,e,n,i){let r=n*Ue,o=i*Ue;return new R(t.x+e*Math.cos(r)*Math.sin(o),t.y+e*Math.sin(r),t.z+e*Math.cos(r)*Math.cos(o))}apply(){let t=this.camera,e=typeof performance!="undefined"&&performance.now?performance.now():Date.now(),n=this._lastApplyAt?Math.min(80,Math.max(0,e-this._lastApplyAt)):16;if(this._lastApplyAt=e,this.lockState){t.position.copy(this.lockState.pos),t.quaternion.copy(this.lockState.quat),t.fov!==this.lockState.fov&&(t.fov=this.lockState.fov,t.updateProjectionMatrix()),this._applyShake(),t.updateMatrixWorld(!0);return}let i=this.state,r=Uh(this.zoom.step(n));t.fov!==i.fov&&(t.fov=i.fov,t.updateProjectionMatrix());let o=this._look.copy(i.center);for(let a=0;a<3&&(t.position.copy(this.camPosFrom(o,i.radius*r,i.elev,i.azim)),t.lookAt(o),t.updateMatrixWorld(!0),!(i.nx===0&&i.ny===0));a++){this._proj.copy(i.center).project(t);let c=t.position.distanceTo(i.center)*Math.tan(i.fov*Ue/2),h=c*this.aspect;this._right.setFromMatrixColumn(t.matrixWorld,0),this._up.setFromMatrixColumn(t.matrixWorld,1),o.addScaledVector(this._right,(this._proj.x-i.nx)*h),o.addScaledVector(this._up,(this._proj.y-i.ny)*c)}t.position.copy(this.camPosFrom(o,i.radius*r,i.elev,i.azim)),t.lookAt(o),this._applyShake(),t.updateMatrixWorld(!0)}_applyShake(){if(!this.shakeAmp)return;if(performance.now()>this.shakeUntil){this.shakeAmp=0;return}let t=this.shakeAmp;this.camera.position.x+=(Math.random()-.5)*t,this.camera.position.y+=(Math.random()-.5)*t,this.camera.position.z+=(Math.random()-.5)*t}shake(t,e){this.shakeUntil=performance.now()+Math.max(1,t),this.shakeAmp=e}lock(){this.lockState={pos:this.camera.position.clone(),quat:this.camera.quaternion.clone(),fov:this.camera.fov}}unlock(){this.lockState=null}get locked(){return!!this.lockState}snapshotTarget(){return{center:this.state.center.clone(),nx:this.state.nx,ny:this.state.ny,radius:this.state.radius,elev:this.state.elev,azim:this.state.azim,fov:this.state.fov}}snap(t){let e=this.state;e.center.copy(t.center),e.nx=t.nx,e.ny=t.ny,e.radius=t.radius,e.elev=t.elev,e.azim=t.azim,e.fov=t.fov,this.lockState=null,this.apply()}animate(t,e,n){let i=this.snapshotTarget();return this.lockState=null,this.runAnim(t,r=>{let o=fs(re(r,0,1)),a=this.state;a.center.copy(n?n(o):e.center),a.nx=oe(i.nx,e.nx,o),a.ny=oe(i.ny,e.ny,o),a.radius=oe(i.radius,e.radius,o),a.elev=oe(i.elev,e.elev,o),a.azim=oe(i.azim,e.azim,o),a.fov=oe(i.fov,e.fov,o),this.apply()})}distForCover(t,e,n){let i=n*Ue,r=2*Math.atan(Math.tan(i/2)*this.aspect);return t/Math.tan(r/2)/re(e,.1,1)}ndcOf(t){let e=t.clone().project(this.camera);return{x:+e.x.toFixed(5),y:+e.y.toFixed(5)}}};function Nh(s){let t=/^hangar:(red|yellow|blue|green):(\d+)$/.exec(s||"");if(t)return{type:"hangar",color:t[1],slot:Number(t[2])};let e=/^ring:(\d+)$/.exec(s||"");if(e)return{type:"ring",n:Number(e[1])};let n=/^home:(red|yellow|blue|green):goal$/.exec(s||"");if(n)return{type:"goal",color:n[1]};let i=/^home:(red|yellow|blue|green):(\d+)$/.exec(s||"");return i?{type:"home",color:i[1],step:Number(i[2])}:null}function yi(s){let t=Nh(s)||{type:"ring",n:0};if(t.type==="ring"){let r=Jn(t.n);return{x:er*Math.sin(r),y:hs,z:-er*Math.cos(r),yaw:-Math.PI/2-r,parsed:t}}if(t.type==="home"){let r=Jn(_i[t.color]),o=xl-t.step*yl;return{x:o*Math.sin(r),y:Zn-.006+Fi,z:-o*Math.cos(r),yaw:Math.PI-r,parsed:t}}if(t.type==="goal")return{x:0,y:hs+.045,z:0,yaw:Math.PI,parsed:t};let e=nr[t.color]*Ue,n=t.slot%2===0?-.2:.2,i=t.slot<2?-.2:.2;return{x:$n*Math.sin(e)+(n*Math.cos(e)+i*Math.sin(e)),y:rn+.05+Fi,z:-$n*Math.cos(e)+(-n*Math.sin(e)+i*Math.cos(e)),yaw:-e-Math.PI,parsed:t}}function Px(s,t,e){let n=yi(s),i=Math.max(1,e||1),r=re(t||0,0,i-1);if(i<=1)return n;if(n.parsed.type==="goal"){let l=r/i*yt+.6;return{...n,x:Math.cos(l)*.16,z:Math.sin(l)*.16,yaw:Math.PI+l}}if(n.parsed.type==="hangar")return n;let o=r/i*yt+.7,a=n.parsed.type==="home"?.052:.062;return{...n,x:n.x+Math.cos(o)*a,z:n.z+Math.sin(o)*a}}function Ix(s){let t=Nh(s);if(!t)return{x:0,z:0};if(t.type==="ring"){let e=Jn(t.n);return{x:Math.cos(e),z:Math.sin(e)}}if(t.type==="home"){let e=Jn(_i[t.color]);return{x:-Math.sin(e),z:Math.cos(e)}}if(t.type==="hangar"){let e=nr[t.color]*Ue;return{x:Math.sin(e),z:-Math.cos(e)}}return{x:0,z:0}}function Dx(s,t,e,n){let i=0;Math.abs(e)+Math.abs(n)>1e-6&&(i=Math.atan2(e,-n));let r=Math.cos(i),o=Math.sin(i),a=s*r+t*o,l=-s*o+t*r;return{theta:i,tx:-a,tz:-l}}function ao(s){let t=yi(s),e=Ix(s);return Dx(t.x,t.z,e.x,e.z)}function Oh(s,t,e){return{theta:s.theta+Tl(s.theta,t.theta)*e,tx:s.tx+(t.tx-s.tx)*e,tz:s.tz+(t.tz-s.tz)*e}}var Lx={takeoff:1,move:1,jump:1,fly:1};function Bh(s){return!!(s&&Lx[s.type])}function Cf(s){if(!s)return null;if(s.type==="takeoff")return s.path&&s.path[0]||null;if(s.type==="move"){let t=s.path&&s.path[0],e=Nh(t);return e?e.type==="ring"?"ring:"+Sl(e.n-1):e.type==="home"?e.step>0?"home:"+e.color+":"+(e.step-1):"ring:"+_i[e.color]:e.type==="goal"?"home:"+e.color+":4":null:null}return(s.type==="jump"||s.type==="fly")&&s.from||null}function lo(s){if(!s)return null;if(s.type==="takeoff"){let t=s.path||[];return t[t.length-1]||null}if(s.type==="move"){let t=s.path||[];return t[t.length-1]||null}return s.to||null}function Pf(s){let t={};for(let i of s||[])t[i.squareId]=(t[i.squareId]||0)+1;let e={},n={};for(let i of s||[]){let r=e[i.squareId]||0;e[i.squareId]=r+1,n[i.id]=Px(i.squareId,r,t[i.squareId])}return n}var zh=3.3,jn=new R(Ni.x,Ni.y,Ni.z),zl=new R(1.032,.8,1.032),lr=new R(0,hs,0),en={enterMs:260,descendMs:80,closeMs:110,liftMs:260,throwMs:130,exitMs:330,releaseAt:840,total:2380},qe={step:1/240,g:8.6,rest:[.47,.42,.37],tan:[.74,.7,.66],airDrag:.18,spinDamp:.45,rollFriction:2.7,boundR:2.78,maxActive:1.54,settleMs:320,restPad:.3,minEnd:1.18};function Fx(){let s=typeof navigator!="undefined"?navigator:{},t=s.userAgent||"",e=typeof window!="undefined"&&window.devicePixelRatio||1;if(/Android|iPhone|iPad|iPod|Mobile/i.test(t))return e>=2?"high":"medium";let n=s.deviceMemory||8,i=s.hardwareConcurrency||8;return n<=4||i<=4?"medium":"high"}var kl=class{constructor(t,e,n={}){this.host=t,this.canvas=e,this.reduced=!!n.reduced,this._shadowOpt=n.shadows!==!1,this.adapt=n.adapt!==!1,this.quality=n.quality&&on[n.quality]?n.quality:Fx(),this.shadows=this._shadowOpt&&on[this.quality].shadow>0,this.theme=n.theme&&ls[n.theme]?n.theme:"cloud",this.heat=0,this.turn="a",this.colors={a:"red",b:"yellow"},this.planes=new Map,this.pieces=[],this.anims=[],this.dimK=1,this.dieValue=1,this._dieYaw=.22,this._toss=null,this._hand=null,this.stageRise=0,this.stageId=null,this.viewport={w:0,h:0},this.ready=!1,this.onReady=null,this.onResize=null,this._last=0,this._raf=0,this._paused=!1,this._inFrame=!1,this._v=new R,this._v2=new R,this._right=new R,this._up=new R,this._upY=new R(0,1,0),this._axis=new R,this._q1=new Ie,this._q2=new Ie,this._planesDirty=!0,this._tex=[],this.lockProbeId=null,this.perf={phase:"boot",frames:0,sum:0,max:0,long25:0,long50:0,since:0,updateSum:0,renderSum:0,phases:{}},this.lockStats={samples:0,maxAbsX:0,maxAbsY:0,reset(){this.samples=0,this.maxAbsX=0,this.maxAbsY=0}},this.lastCalls=0,this.lastTris=0,this._elevK=0,this._fxTime=0,this._dustCount=on[this.quality].dust,this._dustBase=null,this._winTex={},this._wallTex={},this._overlayTex={},this._hubTex={},this._buildRenderer(),this._buildScene(),this._buildEnvironment(),this._buildLights(),this._buildCabin(),this._buildTable(),this._buildCabinDetail(),this._buildBoard(),this._buildStage(),this._buildDie(),this._buildHand(),this._buildPlanesLayer(),this._buildAtmosphere(),this._buildProps(),this._buildComfort(),this._buildFx(),this._bindResize(),this._bindVisibility(),this.applyTheme(this.theme,!0),this.applyHeat(0),this.applyTurn("a",this.colors),this._applyQuality(),this.resize(),this.renderNow(),this._startLoop()}_buildRenderer(){let t=window.devicePixelRatio||1,e=this.quality!=="low";this.renderer=new ml({canvas:this.canvas,antialias:e,alpha:!1,powerPreference:"high-performance",stencil:!1,depth:!0}),this.renderer.outputColorSpace=ke,this.renderer.toneMapping=Aa,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=this.shadows,this.renderer.shadowMap.type=ya,this.useAA=e,this._aniso=Math.min(8,this.renderer.capabilities.getMaxAnisotropy()),this._wood=rf(15128258,512),this._felt=Dl(15261906,256),this._brass=or(256);for(let n of[this._wood,this._felt,this._brass])for(let i of["map","normal","rough"]){let r=n[i];r&&(r.wrapS=r.wrapT=ui,r.needsUpdate=!0)}this._tex.push(this._wood.map,this._wood.normal,this._wood.rough,this._felt.map,this._felt.normal,this._felt.rough,this._brass.map,this._brass.normal,this._brass.rough)}_buildScene(){this.scene=new Yi,this.scene.background=new Ot(329741),this.camera=new Ge(42,1,.05,240),this.rig=new Bl(this.camera,{runAnim:(t,e)=>this.runAnim(t,e)})}_buildEnvironment(){try{let t=new Ks(this.renderer),e=_f(),n=t.fromScene(e,.04,.1,100);this.envRT=n,this.envTex=n.texture,this.scene.environment=this.envTex,this.scene.environmentIntensity=.55,e.traverse(i=>{i.geometry&&i.geometry.dispose(),i.material&&i.material.dispose()}),t.dispose()}catch(t){console.warn("[board3d] PMREM failed:",t&&t.message?t.message:t),this.envTex=null}}_buildLights(){let t=ms(this.theme);this.hemi=new Jr(t.light.hemiSky,t.light.hemiGround,t.light.hemiInt),this.scene.add(this.hemi),this.ambient=new Qr(16777215,.055),this.scene.add(this.ambient),this.key=new Di(t.light.key,t.light.keyInt),this.key.position.set(-3.4,5.6,-2.2),this.key.castShadow=this.shadows,this.key.shadow.mapSize.set(on[this.quality].shadow,on[this.quality].shadow),this.key.shadow.camera.left=-6.5,this.key.shadow.camera.right=6.5,this.key.shadow.camera.top=6.5,this.key.shadow.camera.bottom=-6.5,this.key.shadow.camera.near=.5,this.key.shadow.camera.far=26,this.key.shadow.bias=-6e-4,this.key.shadow.normalBias=.015,this.key.shadow.radius=3,this.scene.add(this.key),this.keyTarget=new be,this.scene.add(this.keyTarget),this.key.target=this.keyTarget,this.rim=new Di(t.light.rim,t.light.rimInt),this.rim.position.set(4.6,3.2,-3.4),this.scene.add(this.rim),this.fill=new Di(t.light.fill,t.light.fillInt),this.fill.position.set(.4,2.4,6),this.scene.add(this.fill),this.wallWash=new Di(t.light.rim,t.light.rimInt*.52),this.wallWash.position.set(.8,3.4,3.2),this.wallWash.target.position.set(.4,1,gt.wallZ),this.scene.add(this.wallWash),this.scene.add(this.wallWash.target),this.lamp=new Ii(t.light.lamp,t.light.lampInt,t.light.lampDist,2),this.lamp.position.set(gt.lamp.x,gt.lamp.y-.12,gt.lamp.z+.16),this.scene.add(this.lamp)}_buildCabin(){let t=new fe;this.scene.add(t),this.cabinGroup=t,this.wallMat=new Yt({color:16777215,roughness:.88,metalness:.02,envMapIntensity:.25});let e=new At(new Me(gt.wallW,gt.wallH),this.wallMat);e.position.set(0,gt.wallBottom+gt.wallH/2,gt.wallZ),e.receiveShadow=!1,t.add(e),this.wallMesh=e;let n=new At(new Qt(gt.wallW*.46,.03,.03),this._brassMat());n.position.set(-1.2,gt.window.y+gt.window.h/2+.26,gt.wallZ+.035),t.add(n),this.wallTrim=n,this.windowMat=new He({map:null,fog:!1,color:15003127});let i=Math.min(gt.window.w,gt.window.h)*.3,r=Ux(gt.window.w,gt.window.h,i),o=new At(r,this.windowMat);o.position.set(gt.window.x,gt.window.y,gt.window.z),t.add(o),this.windowMesh=o,this._winGeo=r,this.glassMat=new Zr({color:12571876,roughness:Vt.glass.roughness,metalness:Vt.glass.metalness,transparent:!0,opacity:.16,envMapIntensity:Vt.glass.envMapIntensity,depthWrite:!1,side:Fe,clearcoat:1,clearcoatRoughness:.15});let a=new At(r,this.glassMat);a.position.set(gt.window.x,gt.window.y,gt.window.z+.012),t.add(a),this.glassMesh=a;let l=gt.window.w+.26,c=gt.window.h+.26,h=i+.13,u=new Ln;u.moveTo(-l/2+h,-c/2),u.lineTo(l/2-h,-c/2),u.quadraticCurveTo(l/2,-c/2,l/2,-c/2+h),u.lineTo(l/2,c/2-h),u.quadraticCurveTo(l/2,c/2,l/2-h,c/2),u.lineTo(-l/2+h,c/2),u.quadraticCurveTo(-l/2,c/2,-l/2,c/2-h),u.lineTo(-l/2,-c/2+h),u.quadraticCurveTo(-l/2,-c/2,-l/2+h,-c/2);let d=new Ri,f=gt.window.w,g=gt.window.h,_=i;d.moveTo(-f/2+_,-g/2),d.lineTo(f/2-_,-g/2),d.quadraticCurveTo(f/2,-g/2,f/2,-g/2+_),d.lineTo(f/2,g/2-_),d.quadraticCurveTo(f/2,g/2,f/2-_,g/2),d.lineTo(-f/2+_,g/2),d.quadraticCurveTo(-f/2,g/2,-f/2,g/2-_),d.lineTo(-f/2,-g/2+_),d.quadraticCurveTo(-f/2,-g/2,-f/2+_,-g/2),u.holes.push(d);let m=new Qi(u,{depth:.06,bevelEnabled:!0,bevelThickness:.016,bevelSize:.016,bevelSegments:2,curveSegments:8,steps:1}),p=new At(m,this._brassMat());p.position.set(gt.window.x,gt.window.y,gt.window.z+.03),p.castShadow=!1,t.add(p),this.windowFrame=p;let b=gt.window.h*gt.shade;this.shadeMat=new Yt({map:this._felt.map,normalMap:this._felt.normal,color:2367002,roughness:Vt.felt.roughness,metalness:0,envMapIntensity:.2});let S=new At(new Me(gt.window.w+.2,b),this.shadeMat);S.position.set(gt.window.x,gt.window.y+gt.window.h/2-b/2+.02,gt.window.z+.02),t.add(S),this.shadeMesh=S;let x=new At(new te(.016,.016,gt.window.w+.22,8,1),this._brassMat());x.rotation.z=Math.PI/2,x.position.set(gt.window.x,gt.window.y+gt.window.h/2-b+.02,gt.window.z+.025),t.add(x);let A=this._brassMat(),w=new te(.055,.055,.022,14),P=new Gt().makeRotationX(Math.PI/2);P.setPosition(gt.lamp.x,gt.lamp.y,gt.wallZ+.055);let C=new te(.014,.014,.3,8),M=new Gt().makeRotationX(Math.PI/2);M.setPosition(gt.lamp.x,gt.lamp.y,gt.wallZ+.2);let v=new Ji(.125,.16,18,1,!0),I=new Gt().makeTranslation(gt.lamp.x,gt.lamp.y+.01,gt.lamp.z),L=xi([{geo:w,matrix:P},{geo:C,matrix:M},{geo:v,matrix:I}]);w.dispose(),C.dispose(),v.dispose();let U=new At(L,A);U.castShadow=!1,t.add(U),this.lampMesh=U,this.bulbMat=new He({color:16769972,toneMapped:!1,fog:!1});let G=new At(new Ce(.038,12,9),this.bulbMat);G.position.set(gt.lamp.x,gt.lamp.y-.055,gt.lamp.z),t.add(G),this.bulb=G,this.lampGlow=new Dn(new Sn({map:Oi(),color:16763274,transparent:!0,opacity:.55,blending:Xe,depthWrite:!1,depthTest:!0,fog:!1,toneMapped:!1})),this.lampGlow.scale.set(1.9,1.9,1),this.lampGlow.position.set(gt.lamp.x,gt.lamp.y-.05,gt.lamp.z+.02),t.add(this.lampGlow),this.winGlow=new Dn(new Sn({map:Oi(),color:10471152,transparent:!0,opacity:.22,blending:Xe,depthWrite:!1,fog:!1,toneMapped:!1})),this.winGlow.scale.set(3.6,2.6,1),this.winGlow.position.set(gt.window.x,gt.window.y,gt.window.z+.16),t.add(this.winGlow),this.floorMat=new Yt({color:724240,roughness:.92,metalness:.02,envMapIntensity:.2});let B=new At(new Me(26,16),this.floorMat);B.rotation.x=-Math.PI/2,B.position.set(0,gt.floorY,-2),B.receiveShadow=!0,t.add(B),this.floor=B}_brassMat(){return this._brassMaterial||(this._brassMaterial=new Yt({map:this._brass.map,normalMap:this._brass.normal,roughnessMap:this._brass.rough,color:11569751,roughness:Vt.brass.roughness,metalness:Vt.brass.metalness,envMapIntensity:Vt.brass.envMapIntensity})),this._brassMaterial}_buildTable(){this.world=new fe,this.scene.add(this.world),this.woodMat=new Yt({map:this._wood.map,normalMap:this._wood.normal,roughnessMap:this._wood.rough,normalScale:new st(Vt.walnut.normalScale,Vt.walnut.normalScale),color:15391947,roughness:Vt.walnut.roughness,metalness:Vt.walnut.metalness,envMapIntensity:Vt.walnut.envMapIntensity}),this._wood.map.repeat.set(.16,.16),this._wood.normal.repeat.set(.16,.16),this._wood.rough.repeat.set(.16,.16);let t=_n.w,e=_n.d,n=_n.r,i=new Ln;i.moveTo(-t/2+n,-e/2),i.lineTo(t/2-n,-e/2),i.quadraticCurveTo(t/2,-e/2,t/2,-e/2+n),i.lineTo(t/2,e/2-n),i.quadraticCurveTo(t/2,e/2,t/2-n,e/2),i.lineTo(-t/2+n,e/2),i.quadraticCurveTo(-t/2,e/2,-t/2,e/2-n),i.lineTo(-t/2,-e/2+n),i.quadraticCurveTo(-t/2,-e/2,-t/2+n,-e/2);let r=new Qi(i,{depth:_n.h,bevelEnabled:!0,bevelThickness:.03,bevelSize:.03,bevelSegments:2,curveSegments:8,steps:1});r.rotateX(-Math.PI/2),r.computeBoundingBox();let o=new At(r,this.woodMat);o.position.set(0,-r.boundingBox.max.y,_n.z),o.receiveShadow=!0,this.tableMesh=o,this.world.add(o);let a=Hl(_n.w-.16,_n.d-.16,_n.r-.05);a.holes.push(If(_n.w-.22,_n.d-.22,_n.r-.07));let l=new At(new pi(a,10),this._brassMat());l.rotation.x=-Math.PI/2,l.position.set(0,.0018,_n.z),this.world.add(l),this.tableEdge=l;let c=Hl(Je.w,Je.d,Je.r);this.feltMat=new Yt({map:this._felt.map,normalMap:this._felt.normal,roughnessMap:this._felt.rough,normalScale:new st(Vt.felt.normalScale,Vt.felt.normalScale),color:4612716,roughness:Vt.felt.roughness,metalness:0,envMapIntensity:Vt.felt.envMapIntensity}),this._felt.map.repeat.set(1/1.35,1/1.35),this._felt.normal.repeat.set(1/1.35,1/1.35),this._felt.rough.repeat.set(1/1.35,1/1.35),this.felt=new At(new pi(c,12),this.feltMat),this.felt.rotation.x=-Math.PI/2,this.felt.position.set(0,.0045,Je.z),this.felt.receiveShadow=!0,this.world.add(this.felt),this.matOverMat=new He({map:null,transparent:!0,opacity:1,depthWrite:!1,fog:!1}),this.over=new At(new Me(Je.w,Je.d),this.matOverMat),this.over.rotation.x=-Math.PI/2,this.over.position.set(0,.0075,Je.z),this.world.add(this.over);let h=Hl(Je.w+.26,Je.d+.26,Je.r+.1),u=If(Je.w+.06,Je.d+.06,Je.r+.04);h.holes.push(u);let d=new At(new pi(h,10),this._brassMat());d.rotation.x=-Math.PI/2,d.position.set(0,.0035,Je.z),this.world.add(d),this.inlay=d,this.boardGroup=new fe,this.world.add(this.boardGroup),this._buildCup(this.world)}_buildCup(t){let e=new Yt({color:14997702,roughness:.24,metalness:0,envMapIntensity:1.15}),n=new Yt({color:2363913,roughness:.2,metalness:0,envMapIntensity:.9}),i=this._brassMat(),r=[],o=(_,m,p,b,S)=>{let x=new Gt().makeRotationX(S||0);x.setPosition(m,p,b),r.push({geo:_,matrix:x})};o(new te(.335,.315,.022,32),0,.012,0),o(new te(.148,.112,.215,26,1,!0),0,.132,0);let a=new Ve(.082,.017,7,16,Math.PI*1.25),l=new Gt().makeRotationZ(-.5);l.setPosition(.155,.145,0),r.push({geo:a,matrix:l});let c=xi(r);r.forEach(_=>_.geo.dispose());let h=new At(c,e);h.castShadow=!0,h.receiveShadow=!0;let u=new Hr(.13,24);u.rotateX(-Math.PI/2);let d=new At(u,n);d.position.y=.212;let f=new At(new Ve(.148,.011,6,26),i);f.rotation.x=-Math.PI/2,f.position.y=.24;let g=new fe;g.add(h,d,f),g.position.set(-1.72,.0045,4.28),g.rotation.y=.42,g.scale.setScalar(2),t.add(g),this.cupGroup=g}_buildCabinDetail(){let t=this.cabinGroup;if(!t)return;this.binMat=new Yt({color:1581355,roughness:.84,metalness:.04,envMapIntensity:.22});let e=new At(new Qt(De.bin.w,De.bin.h,De.bin.d),this.binMat);e.position.set(0,De.bin.y,gt.wallZ+De.bin.inset),e.receiveShadow=!1,t.add(e),this.bin=e;let n=new At(new Qt(De.bin.w*.985,.022,.02),this._brassMat());n.position.set(0,De.bin.y-De.bin.h/2+.026,gt.wallZ+De.bin.inset+De.bin.d/2),t.add(n),this.binLatch=n,this.stripMat=new He({color:De.strip.color,transparent:!0,opacity:.42,toneMapped:!1,fog:!1}),this.strip=new At(new Qt(De.strip.w,De.strip.h,De.strip.d),this.stripMat),this.strip.position.set(0,De.strip.y,gt.wallZ+.36),t.add(this.strip),this.binGlow=new Dn(new Sn({map:Oi(),color:16765600,transparent:!0,opacity:.13,blending:Xe,depthWrite:!1,depthTest:!0,fog:!1,toneMapped:!1})),this.binGlow.scale.set(10.5,1.5,1),this.binGlow.position.set(0,De.strip.y-.02,gt.wallZ+.42),t.add(this.binGlow),this.curtainTex=xf(96),this._tex.push(this.curtainTex),this.curtainMat=new Yt({map:this.curtainTex,color:9075304,roughness:.96,metalness:0,envMapIntensity:.25,side:Fe});let i=De.curtain.w,r=De.curtain.h;this.curtains=[];for(let a of[-1,1]){let l=new fe,c=gt.window.x+a*(gt.window.w/2+De.curtain.off),h=gt.window.y+gt.window.h/2+.1;l.position.set(c,h,gt.window.z+.055);let u=new At(new Me(i,r,5,1),this.curtainMat);u.position.y=-r/2,u.castShadow=!1,l.add(u),l.userData.baseY=0,t.add(l),this.curtains.push(l),this._tex.push(this.curtainTex)}let o=new At(new te(.014,.014,gt.window.w+.75,8,1),this._brassMat());o.rotation.z=Math.PI/2,o.position.set(gt.window.x,gt.window.y+gt.window.h/2+.115,gt.window.z+.06),t.add(o),this.curtainRod=o;for(let a of[-1,1]){let l=new At(new Ce(.032,8,6),this._brassMat());l.position.set(gt.window.x+a*(gt.window.w/2+.38),gt.window.y+gt.window.h/2+.115,gt.window.z+.06),t.add(l)}}_buildProps(){let t=bh,e=Ll(256),n=yf(128);this.propPaper=e,this.propAtlas=n,this._tex.push(e.map,e.normal,n);let i=new fe;this.world.add(i),this.propGroup=i,this.propAnchors={},this.propMatteMat=new Yt({map:e.map,normalMap:e.normal,normalScale:new st(.45,.45),vertexColors:!0,roughness:.64,metalness:.03,envMapIntensity:.42}),this.propPaperMat=new Yt({map:e.map,normalMap:e.normal,normalScale:new st(Vt.paper.normalScale,Vt.paper.normalScale),color:16050388,roughness:Vt.paper.roughness,metalness:0,envMapIntensity:Vt.paper.envMapIntensity}),this.propPrintMat=new Yt({map:n,roughness:.78,metalness:.02,envMapIntensity:.38,side:Fe}),this.propClothMat=new Yt({map:this._felt.map,normalMap:this._felt.normal,normalScale:new st(1.1,1.1),color:7548986,roughness:Vt.felt.roughness,metalness:0,envMapIntensity:Vt.felt.envMapIntensity}),this.propLeafMat=new Yt({color:5139298,roughness:.72,metalness:.02,envMapIntensity:.4,side:Fe}),this.propDarkMat=new Yt({map:this._felt.map,color:2760987,roughness:.72,metalness:.05,envMapIntensity:.35}),this.ceramicMat=new Yt({color:14997702,roughness:.24,metalness:0,envMapIntensity:1.15}),this.teaMat=new Yt({color:8010520,roughness:.18,metalness:0,envMapIntensity:.9}),this.lampShadeMat=new Yt({color:14196842,emissive:16751184,emissiveIntensity:.55,roughness:.52,metalness:.35,envMapIntensity:Vt.brass.envMapIntensity,side:Fe});let r=new be,o={matte:[],paper:[],print:[],brass:[],cloth:[],leaf:[],dark:[]},a=(nt,ft,Ut,Lt,Ct,V,$)=>{r.position.set(Ut,Lt,Ct),r.rotation.set(V&&V[0]||0,V&&V[1]||0,V&&V[2]||0),r.scale.set(1,1,1),r.updateMatrix(),o[nt].push({geo:ft,matrix:r.matrix.clone(),color:$})},l=(nt,ft)=>{let Ut=ft%4,Lt=Math.floor(ft/4),Ct=Ut/4,V=(Ut+1)/4,$=1-(Lt+1)/2,vt=1-Lt/2,bt=nt.getAttribute("uv");for(let Tt=0;Tt<bt.count;Tt++)bt.setXY(Tt,Ct+bt.getX(Tt)*(V-Ct),$+bt.getY(Tt)*(vt-$));return bt.needsUpdate=!0,nt},c=(nt,ft,Ut,Lt,Ct,V,$)=>{a("print",l(new Me(nt,ft),Ut),Lt,Ct,V,$)},h=(nt,ft,Ut,Lt,Ct,V,$,vt)=>{let bt=[0,Ut,0];a("matte",new Qt(Lt,.009,Ct),nt,$+.0045,ft,bt,vt),a("paper",new Qt(Lt-.016,V-.018,Ct-.014),nt,$+V/2,ft,bt),a("matte",new Qt(Lt,.009,Ct),nt,$+V-.0045,ft,bt,vt)},u=t.books;h(u.x,u.z,u.rot,.58,.42,.078,.006,[.3,.36,.3]),h(u.x+.01,u.z-.005,u.rot-.1,.53,.38,.062,.084,[.46,.2,.22]),h(u.x-.008,u.z+.004,u.rot+.07,.46,.33,.05,.146,[.21,.25,.34]);let d=.196;a("matte",new Qt(.32,.01,.4),u.x+.02,d+.005,u.z+.01,[0,u.rot-.18,0],[.14,.13,.12]),c(.31,.39,0,u.x+.02,d+.011,u.z+.01,[-Math.PI/2,u.rot-.18,0]),c(.19,.13,3,u.x-.18,.145,u.z+.205,[-1.16,u.rot-.5,0]);let f=t.plant;a("matte",new te(.112,.088,.17,18,1),f.x,.091,f.z,null,[.42,.28,.21]),a("matte",new te(.118,.118,.02,18,1),f.x,.183,f.z,null,[.36,.24,.18]),a("matte",new te(.1,.1,.012,16,1),f.x,.189,f.z,null,[.12,.09,.06]);let g=new Ln;g.moveTo(0,0),g.bezierCurveTo(.062,.05,.07,.2,0,.33),g.bezierCurveTo(-.07,.2,-.062,.05,0,0);let _=new pi(g,4);for(let nt=0;nt<10;nt++){let ft=nt/10*Math.PI*2+.35,Ut=.88+nt%4*.16;r.position.set(f.x+Math.cos(ft)*.04,.2,f.z+Math.sin(ft)*.04),r.rotation.set(-1.16+nt%3*.17,ft+Math.PI/2,0),r.scale.set(Ut,Ut,Ut),r.updateMatrix(),o.leaf.push({geo:_.clone(),matrix:r.matrix.clone()})}a("leaf",_.clone(),f.x,.215,f.z,[-1.45,.4,0]),_.dispose(),this.propAnchors.plant=this._anchor(f.x,.2,f.z);let m=t.lamp;a("brass",new te(.12,.148,.03,22,1),m.x,.021,m.z),a("brass",new te(.017,.023,.4,10,1),m.x,.235,m.z),a("brass",new Ce(.03,10,8),m.x,.445,m.z),a("brass",new te(.013,.015,.3,8,1),m.x+.055,.52,m.z+.115,[.95,0,-.36]),a("brass",new te(.052,.07,.022,14,1),m.x+.135,.575,m.z+.225);let p=new At(new Ji(.152,.205,22,1,!0),this.lampShadeMat);p.position.set(m.x+.132,.472,m.z+.222),p.rotation.z=-.16,p.rotation.x=.1,p.castShadow=!1,i.add(p),this.deskShade=p,this.deskGlow=new Dn(new Sn({map:Oi(),color:16763016,transparent:!0,opacity:.38,blending:Xe,depthWrite:!1,fog:!1,toneMapped:!1})),this.deskGlow.scale.set(.85,.85,1),this.deskGlow.position.set(m.x+.132,.435,m.z+.222),i.add(this.deskGlow);let b=ms(this.theme);this.deskPool=ar(2.2,b.light.lamp),this.deskPool.position.set(m.x+.11,.0078,m.z+.24),this.deskPool.material.opacity=.16,this.deskPool.renderOrder=1,i.add(this.deskPool),this.deskLight=new Ii(16758903,2.8,4.2,2),this.deskLight.position.set(m.x+.12,.43,m.z+.2),this.scene.add(this.deskLight),this.propAnchors.lamp=this._anchor(m.x,.42,m.z);let S=t.candle;a("brass",new te(.086,.1,.02,16,1),S.x,.016,S.z),a("brass",new te(.024,.032,.095,10,1),S.x,.072,S.z),a("brass",new te(.052,.035,.032,14,1),S.x,.132,S.z),a("matte",new te(.04,.042,.22,14,1),S.x,.258,S.z,null,[.93,.86,.72]),a("matte",new te(.022,.026,.013,10,1),S.x,.373,S.z,null,[.86,.78,.64]),a("dark",new te(.0038,.0038,.022,6,1),S.x,.388,S.z),this.flame=new Dn(new Sn({map:Mf(),color:16769712,transparent:!0,opacity:.95,blending:Xe,depthWrite:!1,fog:!1,toneMapped:!1})),this.flame.scale.set(.055,.125,1),this.flame.position.set(S.x,.435,S.z),i.add(this.flame),this.candleGlow=new Dn(new Sn({map:Oi(),color:16754784,transparent:!0,opacity:.3,blending:Xe,depthWrite:!1,fog:!1,toneMapped:!1})),this.candleGlow.scale.set(.7,.7,1),this.candleGlow.position.set(S.x,.41,S.z),i.add(this.candleGlow),this.candleLight=new Ii(16751184,1.35,2.8,2),this.candleLight.position.set(S.x,.46,S.z),this.scene.add(this.candleLight),this.propAnchors.candle=this._anchor(S.x,.36,S.z);let x=t.photo;a("brass",new Qt(.345,.405,.014),x.x,.215,x.z,[-.15,x.rot,0]),a("brass",new Qt(.335,.03,.055),x.x,.02,x.z+.014,[0,x.rot,0]),a("brass",new Qt(.026,.285,.012),x.x,.175,x.z-.045,[.3,x.rot,0]),c(.278,.332,4,x.x+Math.sin(x.rot)*.016,.218,x.z+Math.cos(x.rot)*.016,[-.15,x.rot,0]),this.propAnchors.photo=this._anchor(x.x,.2,x.z);let A=t.speaker;a("dark",new Qt(.255,.072,.175),A.x,.046,A.z,[0,A.rot,0]),a("brass",new te(.017,.017,.016,10,1),A.x,.036,A.z+.1,[Math.PI/2,0,0]),a("brass",new te(.04,.04,.008,12,1),A.x-.085,.008,A.z,[0,A.rot,0]),c(.225,.148,6,A.x,.083,A.z,[-Math.PI/2,A.rot,0]);let w=t.cassette;a("dark",new Qt(.335,.03,.215),w.x,.021,w.z,[0,w.rot,0]),c(.31,.19,5,w.x,.037,w.z,[-Math.PI/2,w.rot,0]),this.propAnchors.speaker=this._anchor(A.x,.1,A.z);let P=t.newspaper;if(a("paper",new Qt(.56,.006,.4),P.x,.009,P.z,[0,P.rot,0]),c(.545,.385,1,P.x,.0125,P.z,[-Math.PI/2,P.rot,0]),this.cupGroup){let nt=this.cupGroup.clone();nt.position.set(t.cup2.x,.0045,t.cup2.z),nt.rotation.set(0,-.85,0),nt.scale.setScalar(t.cup2.s),nt.children[1]&&(nt.children[1].material=this.teaMat),this.world.add(nt),this.cup2=nt}let C=t.notebook;a("dark",new Qt(.84,.018,.56),C.x,.015,C.z,[0,C.rot,0]),a("paper",new Qt(.8,.022,.53),C.x,.033,C.z,[0,C.rot,0]),a("dark",new Qt(.026,.006,.5),C.x,.0455,C.z,[0,C.rot,0]);let M=l(new Me(.355,.487),7);a("print",M,C.x-.195*Math.cos(C.rot),.0465,C.z+.195*Math.sin(C.rot),[-Math.PI/2,C.rot-.03,0]);let v=l(new Me(.355,.487),7);a("print",v,C.x+.195*Math.cos(C.rot),.0465,C.z-.195*Math.sin(C.rot),[-Math.PI/2,C.rot+.02,0]),a("cloth",new Qt(.022,.003,.16),C.x+.01,.0485,C.z+.32,[0,C.rot+.12,0]);let I=C.rot-.62;a("brass",new te(.0085,.0085,.21,8,1),C.x+.17,.056,C.z+.02,[Math.PI/2,I,0]),a("dark",new Ji(.0095,.038,8,1),C.x+.17+Math.sin(I)*.12,.056,C.z+.02+Math.cos(I)*.12,[Math.PI/2,I,0]);let L=t.glasses,U=C.x-.2,G=C.z+.035;for(let nt of[-1,1])a("brass",new Ve(.045,.0042,6,14),U+nt*.05,.056,G,[-Math.PI/2,C.rot,0]),a("brass",new Qt(.095,.005,.006),U+nt*.078,.056,G-.048,[0,C.rot,0]);a("brass",new Qt(.022,.0045,.006),U,.056,G+.004,[0,C.rot,0]),this.propAnchors.glasses=this._anchor(U,.06,G),this.propAnchors.notebook=this._anchor(C.x,.05,C.z);let B=t.tickets;c(.2,.078,2,B.x,.012,B.z,[-Math.PI/2,B.rot,0]),c(.2,.078,2,B.x+.13,.0125,B.z+.075,[-Math.PI/2,B.rot+.42,0]),c(.2,.078,2,B.x-.1,.0128,B.z+.1,[-Math.PI/2,B.rot-.28,0]);let W=t.cards;c(.19,.074,2,W.x,.012,W.z,[-Math.PI/2,W.rot,0]),c(.19,.074,2,W.x-.11,.0126,W.z+.09,[-Math.PI/2,W.rot+.5,0]);let Z=t.keys;a("brass",new Ve(.052,.007,6,18),Z.x,.016,Z.z,[-Math.PI/2,Z.rot,0]);for(let nt of[-1,1]){let ft=Z.rot+(nt>0?.34:-.42),Ut=Z.x+Math.sin(ft)*.075,Lt=Z.z+Math.cos(ft)*.075;a("brass",new Ve(.019,.0045,5,10),Ut,.016,Lt,[-Math.PI/2,ft,0]);let Ct=Z.x+Math.sin(ft)*.125,V=Z.z+Math.cos(ft)*.125;a("brass",new Qt(.01,.007,.085),Ct,.016,V,[0,ft,0]),a("brass",new Qt(.026,.008,.016),Ct+Math.sin(ft)*.048,.016,V+Math.cos(ft)*.048,[0,ft,0]),a("brass",new Qt(.018,.008,.012),Ct+Math.sin(ft)*.03,.016,V+Math.cos(ft)*.03,[0,ft+.4,0])}this.propAnchors.keys=this._anchor(Z.x,.05,Z.z);let k=t.tray;a("matte",new te(.345,.325,.038,30,1),k.x,.025,k.z,null,[.26,.17,.11]),a("matte",new te(.3,.3,.012,26,1),k.x,.046,k.z,null,[.15,.21,.18]),a("brass",new Ve(.318,.02,8,34),k.x,.052,k.z,[-Math.PI/2,0,0]),this.propAnchors.tray=this._anchor(k.x,.05,k.z);let j=t.blanket;a("cloth",new Qt(.84,.085,.6),j.x,.05,j.z,[0,j.rot,0]),a("cloth",new Qt(.76,.07,.53),j.x+.035,.126,j.z+.022,[0,j.rot-.08,0]),a("cloth",new Qt(.66,.055,.46),j.x+.055,.188,j.z+.04,[0,j.rot-.15,0]),a("cloth",new te(.048,.048,.66,10,1),j.x+.04,.23,j.z+.2,[0,j.rot-.1,Math.PI/2]),this.propAnchors.blanket=this._anchor(j.x,.14,j.z);let at=(nt,ft,Ut)=>{let Lt=o[nt];if(!Lt.length)return null;let Ct=Ih(Lt);Lt.forEach($=>$.geo.dispose());let V=new At(Ct,ft);return V.castShadow=!!Ut,V.receiveShadow=!0,i.add(V),V};this.propMatteMesh=at("matte",this.propMatteMat,!0),this.propPaperMesh=at("paper",this.propPaperMat,!1),this.propPrintMesh=at("print",this.propPrintMat,!1),this.propBrassMesh=at("brass",this._brassMat(),!0),this.propClothMesh=at("cloth",this.propClothMat,!0),this.propLeafMesh=at("leaf",this.propLeafMat,!1),this.propDarkMesh=at("dark",this.propDarkMat,!1)}_anchor(t,e,n){let i=new fe;return i.position.set(t,e,n),this.propGroup.add(i),i}_buildComfort(){let t=bh.cup,e=.5;this.steamBase=new R(t.x,e,t.z),this.steam=[];let n=vf();for(let l=0;l<3;l++){let c=new Dn(new Sn({map:n,color:16773854,transparent:!0,opacity:.1,depthWrite:!1,fog:!1,toneMapped:!1}));c.scale.set(.1,.16,1),c.position.copy(this.steamBase),c.material.rotation=(l-1)*.4,this.scene.add(c),this.steam.push(c)}let i=De.motes,r=new Float32Array(i*3),o=[];for(let l=0;l<i;l++)r[l*3]=gt.window.x+(Math.random()-.5)*2.6,r[l*3+1]=.25+Math.random()*1.5,r[l*3+2]=gt.window.z+.25+Math.random()*.5,o.push(Math.random()*6.28,.4+Math.random()*.8);let a=new ve;a.setAttribute("position",new Ne(r,3)),this.moteBase=r.slice(),this.moteSeed=o,this.moteMat=new $i({size:.03,map:Rh(),color:12572918,transparent:!0,opacity:.42,depthWrite:!1,blending:Xe,sizeAttenuation:!0,fog:!0,toneMapped:!1}),this.motes=new Hs(a,this.moteMat),this.motes.frustumCulled=!1,this.scene.add(this.motes),this._applyPropsQuality()}_applyPropsQuality(){let t=on[this.quality],e=!!t.props&&!!t.env;this.propGroup&&(this.propGroup.visible=!!t.props),this.steam&&this.steam.forEach(n=>{n.visible=!!t.steam}),this.motes&&(this.motes.visible=!!t.motes),this.deskLight&&(this.deskLight.intensity=e?2.2:0),this.candleLight&&(this.candleLight.intensity=e?1.2:0),this.deskGlow&&(this.deskGlow.visible=!!t.props),this.candleGlow&&(this.candleGlow.visible=!!t.props),this.flame&&(this.flame.visible=!!t.props)}_updateAmbient(t,e){let n=on[this.quality],i=!!n.props&&!!n.env;if(n.steam&&this.steam){let r=this.steam.length;for(let o=0;o<r;o++){let a=this.steam[o],l=(t*16e-5+o/r)%1,c=l*.62;a.position.set(this.steamBase.x+Math.sin(l*6.2+o*2.1)*(.02+l*.05),this.steamBase.y+c,this.steamBase.z+Math.cos(l*5.1+o*1.7)*(.015+l*.04));let h=.09+l*.3;a.scale.set(h,h*1.6,1),a.material.opacity=Math.sin(l*Math.PI)*.13,a.material.rotation=(o-1)*.4+Math.sin(t*6e-4+o)*.12}}if(n.props&&this.flame){let r=.5+.5*Math.sin(t*.0125),o=.5+.5*Math.sin(t*.021+1.7);this.flame.scale.set(.046+r*.012,.105+o*.028,1),this.flame.material.opacity=.82+r*.16,this.candleGlow&&(this.candleGlow.material.opacity=.24+o*.1,this.candleGlow.scale.set(.58+r*.08,.58+r*.08,1)),this.candleLight&&i&&(this.candleLight.intensity=1.05+r*.35)}if(n.props&&this.deskShade){let r=.5+.5*Math.sin(t*.0013+.6);this.lampShadeMat.emissiveIntensity=.34+r*.14,this.deskGlow&&(this.deskGlow.material.opacity=.32+r*.1),this.deskLight&&i&&(this.deskLight.intensity=2+r*.45)}if(this.lamp&&this._lampBase){let r=.5+.5*Math.sin(t*9e-4),o=Math.sin(t*.031)>.988?.94:1;this.lamp.intensity=this._lampBase*(.965+r*.045)*o}if(this.curtains)for(let r=0;r<this.curtains.length;r++){let o=this.curtains[r],a=r===0?1:-1;o.rotation.z=Math.sin(t*55e-5+r*1.9)*.012*a,o.rotation.x=Math.sin(t*41e-5+r*.7)*.006}if(this.windowMat){let r=.5+.5*Math.sin(t*21e-5);this.windowMat.color.setRGB(.9+r*.06,.93+r*.04,1),this.winGlow&&(this.winGlow.material.opacity=.18+r*.07)}if(n.motes&&this.motes){let r=this.motes.geometry.getAttribute("position"),o=this.moteBase,a=this.moteSeed,l=Math.min(De.motes,r.count);for(let c=0;c<l;c++){let h=a[c*2],u=a[c*2+1];r.setX(c,o[c*3]+Math.sin(t*22e-5*u+h)*.18),r.setY(c,o[c*3+1]+Math.sin(t*35e-5*u+h*1.3)*.1),r.setZ(c,o[c*3+2]+Math.cos(t*26e-5*u+h)*.1)}r.needsUpdate=!0}}_buildBoard(){let t=ms(this.theme),e=sf();this._tex.push(e.tex),this.atlasTex=e.tex,this.atlasPlain=e,this.flyMode=!1,this.boardTopMat=new Yt({map:of(15260875),roughness:Vt.walnut.roughness+.03,metalness:Vt.walnut.metalness,normalMap:this._wood.normal.clone(),normalScale:new st(2.2,2.2),color:16777215,envMapIntensity:.6}),this._tex.push(this.boardTopMat.map,this.boardTopMat.normalMap),this.boardTopMat.normalMap.repeat.set(3,3),this.boardTopMat.normalMap.wrapS=this.boardTopMat.normalMap.wrapT=ui,this.boardTopMat.normalMap.needsUpdate=!0,this.boardSideMat=new Yt({map:this._wood.map,normalMap:this._wood.normal,color:7097139,roughness:.62,metalness:.04,envMapIntensity:.45});let n=new At(new te(zh,zh-.05,.035,96,1),[this.boardSideMat,this.boardTopMat,this.boardSideMat]);n.position.y=.0205,n.receiveShadow=!0,this.boardGroup.add(n),this.disc=n;let i=new At(new Ve(zh-.012,.036,8,96),this._brassMat());i.rotation.x=-Math.PI/2,i.position.y=.03,i.castShadow=!0,this.boardGroup.add(i),this.discRim=i,this.tileMat=new Yt({map:e.tex,vertexColors:!0,roughness:Vt.enamel.roughness,metalness:Vt.enamel.metalness,envMapIntensity:Vt.enamel.envMapIntensity});let r=[],o=[],a=[];for(let f=0;f<tr;f++){let g=Jn(f),_=ds(f),m=bl(f),p=Qn(Se[_]).map(b=>b/255*.46);r.push({x:er*Math.sin(g),z:-er*Math.cos(g),rot:-Math.PI/2-g,w:xh,d:xh,top:Zn,bottom:rn,uv:ps(Rl(m,_)),side:p,n:f,kind:m,color:_})}for(let f of xn){let g=Jn(_i[f]),_=Qn(Se[f]).map(m=>m/255*.38);for(let m=0;m<Yd;m++){let p=xl-m*yl;o.push({x:p*Math.sin(g),z:-p*Math.cos(g),rot:-g-Math.PI,w:yh,d:yh,top:Zn-.004,bottom:rn,uv:ps(wl+xn.indexOf(f)),side:_,color:f,step:m})}}for(let f of xn){let g=nr[f]*Ue,_=Qn(Se[f]).map(p=>p/255*.32);a.push({x:$n*Math.sin(g),z:-$n*Math.cos(g),rot:-g-Math.PI,w:.94,d:.94,top:rn+.03,bottom:rn,uv:ps(sr),side:_.map(p=>p*.8),color:f,plate:!0});let m=Qn(Se[f]).map(p=>p/255*.4);for(let[p,b]of[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]])a.push({x:$n*Math.sin(g)+(p*Math.cos(g)+b*Math.sin(g)),z:-$n*Math.cos(g)+(-p*Math.sin(g)+b*Math.cos(g)),rot:-g-Math.PI,w:.28,d:.28,top:rn+.06,bottom:rn+.03,uv:ps(Al+xn.indexOf(f)),side:m,color:f,pad:!0})}this.ringMesh=new At(Ul(r.concat(o)),this.tileMat),this.ringMesh.receiveShadow=!0,this.ringMesh.castShadow=!0,this.boardGroup.add(this.ringMesh),this.padMesh=new At(Ul(a),this.tileMat),this.padMesh.receiveShadow=!0,this.boardGroup.add(this.padMesh),this.hubGroup=new fe,this.hubSideMat=new Yt({map:this._wood.map,normalMap:this._wood.normal,color:4862496,roughness:.6,metalness:.04,envMapIntensity:.4}),this.hubTopMat=new Yt({map:null,roughness:.34,metalness:Vt.brass.metalness,color:t.hub.top,envMapIntensity:Vt.brass.envMapIntensity}),this.hubStarMat=new Yt({color:t.hub.star,roughness:.28,metalness:Vt.brass.metalness,envMapIntensity:Vt.brass.envMapIntensity}),this.hubRingMat=this._brassMat();let l=new At(new te(En.r,En.r+.07,En.h,48,1),[this.hubSideMat,this.hubTopMat,this.hubSideMat]);l.position.y=En.h/2,l.castShadow=this.shadows,l.receiveShadow=!0,this.hubGroup.add(l);let c=new At(new Ve(En.ringR,.03,8,56),this.hubRingMat);c.rotation.x=-Math.PI/2,c.position.y=.012,this.hubGroup.add(c),this.hubHalo=new At(new Ve(.315,.014,6,44),this.hubRingMat),this.hubHalo.rotation.x=-Math.PI/2,this.hubHalo.position.y=En.h+.1,this.hubGroup.add(this.hubHalo);let h=new Ln;for(let f=0;f<10;f++){let g=f%2===0?En.starR:En.starR*.44,_=-Math.PI/2+f*Math.PI/5,m=Math.cos(_)*g,p=Math.sin(_)*g;f===0?h.moveTo(m,p):h.lineTo(m,p)}h.closePath();let u=new Qi(h,{depth:.03,bevelEnabled:!0,bevelThickness:.006,bevelSize:.006,bevelSegments:1,curveSegments:1});u.rotateX(-Math.PI/2),this.hubStar=new At(u,this.hubStarMat),this.hubStar.position.y=En.h+.014,this.hubStar.castShadow=this.shadows,this.hubGroup.add(this.hubStar),this.hubGlow=ar(.96,t.hub.glow),this.hubGlow.position.y=En.h+.055,this.hubGlow.material.opacity=.22,this.hubGroup.add(this.hubGlow),this.hubGroup.position.y=.038,this.boardGroup.add(this.hubGroup),this.targetGlow=ar(.9,16763274),this.targetGlow.position.y=Zn+.012,this.targetGlow.visible=!1,this.boardGroup.add(this.targetGlow),this.turnBeacon=new fe;let d=new At(new Ve(.46,.026,8,40),new He({color:Se.red,transparent:!0,opacity:.7,blending:Xe,depthWrite:!1,fog:!1,toneMapped:!1}));d.rotation.x=-Math.PI/2,d.position.y=Zn+.02,this.turnBeacon.add(d),this._beaconRing=d,this.boardGroup.add(this.turnBeacon)}_buildStage(){this.stageGroup=new fe,this.stageGroup.position.set(0,rn,0),this.stageGroup.visible=!1,this.scene.add(this.stageGroup),this.stageGlow=ar(.8,16767392),this.stageGlow.position.y=cs+.008,this.stageGlow.material.opacity=.18,this.stageGroup.add(this.stageGlow),this.stageLight=new Ii(16763796,0,6,2),this.stageLight.position.set(.06,2.25,.28),this.scene.add(this.stageLight),this.stageTile=null,this.bear=Rf(),this.bearSeat=new fe,this.bearSeat.position.set(us.x,0,us.z),this.bearSeat.scale.setScalar(us.s),this.bearSeat.add(this.bear.group),this.stageGroup.add(this.bearSeat),this.stageShadow=Nl(1.5,0),this.stageShadow.visible=!1,this.scene.add(this.stageShadow),this.ripple=wf(1.1),this.scene.add(this.ripple),this.streaks=Af(df()),this.scene.add(this.streaks.group)}_buildDie(){let t=af(128);this._tex.push(t.tex),this.dieMat=new Yt({map:t.tex,roughness:.38,metalness:.05,envMapIntensity:.9}),this.die=new At(bf(vl),this.dieMat),this.die.castShadow=this.shadows,this.die.receiveShadow=!0,this.scene.add(this.die),this.dieShadow=Nl(.5,.55),this.dieShadow.position.y=rr+.004,this.scene.add(this.dieShadow),this.placeDie(1)}_buildHand(){this._hand=Tf(),this._hand.textures&&this._tex.push(this._hand.textures[0],this._hand.textures[1]),this.scene.add(this._hand.group)}_buildPlanesLayer(){this.planeLayer=new fe,this.scene.add(this.planeLayer)}_buildAtmosphere(){let t=on.high.dust,e=new Float32Array(t*3),n=[];for(let r=0;r<t;r++){let o=Math.random()*Math.PI*2,a=.6+Math.random()*4.6;e[r*3]=Math.cos(o)*a*.9,e[r*3+1]=.25+Math.random()*3.1,e[r*3+2]=-2.4+Math.sin(o)*a*.7,n.push(Math.random()*1e3,.3+Math.random()*.9,Math.random()*Math.PI*2)}let i=new ve;i.setAttribute("position",new Ne(e,3)),this._dustBase=e.slice(),this.dustMat=new $i({size:.042,map:Rh(),color:16767400,transparent:!0,opacity:.62,depthWrite:!1,blending:Xe,sizeAttenuation:!0,fog:!0,toneMapped:!1}),this.dust=new Hs(i,this.dustMat),this.dust.frustumCulled=!1,this._dustSeed=n,this.scene.add(this.dust),this._applyDustQuality()}_applyDustQuality(){if(!this.dust)return;let t=on[this.quality].dust;this._dustCount=Math.min(t,on.high.dust),this.dust.geometry.setDrawRange(0,this._dustCount),this.dust.visible=this._dustCount>0}_updateDust(t){if(!this.dust.visible||!this._dustBase)return;let e=this.dust.geometry.getAttribute("position"),n=this._dustCount,i=this._dustBase,r=this._dustSeed;for(let o=0;o<n;o++){let a=r[o*3+1],l=r[o*3+2],c=t*8e-5*a;e.setX(o,i[o*3]+Math.sin(c+l)*.055),e.setY(o,i[o*3+1]+Math.sin(c*.8+l)*.045),e.setZ(o,i[o*3+2]+Math.cos(c*.7+l)*.035)}e.needsUpdate=!0}_buildFx(){this.fxMat=new pn({uniforms:{uTime:{value:0},uAspect:{value:1},uVig:{value:.55},uGrain:{value:.055}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:["varying vec2 vUv;","uniform float uTime; uniform float uAspect; uniform float uVig; uniform float uGrain;","float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }","void main(){","  vec2 p = vUv - 0.5; p.x *= uAspect;","  float r = length(p) * 1.5;","  float v = smoothstep(0.40, 1.02, r) * uVig;","  float n = hash(floor(vUv * vec2(1440.0, 2304.0)) + floor(uTime * 24.0));","  float g = max(0.0, n - 0.70) * uGrain;","  vec3 col = vec3(0.92, 0.90, 0.86) * g;","  float a = clamp(v + g * 0.7, 0.0, 0.94);","  gl_FragColor = vec4(col, a);","}"].join(`
`),transparent:!0,depthTest:!1,depthWrite:!1,premultipliedAlpha:!0,blending:hi}),this.fxQuad=new At(new Me(2,2),this.fxMat),this.fxQuad.frustumCulled=!1,this.fxQuad.renderOrder=999,this.scene.add(this.fxQuad)}setQuality(t){return!on[t]||t===this.quality?this.quality:(this.quality=t,this._applyQuality(),this.resize(),this.requestRender(),this.quality)}_applyQuality(){let t=on[this.quality];this.shadows=this._shadowOpt&&t.shadow>0,this.renderer.shadowMap.enabled=this.shadows,this.key&&(this.key.castShadow=this.shadows,this.shadows&&this.key.shadow.mapSize.x!==t.shadow&&(this.key.shadow.mapSize.set(t.shadow,t.shadow),this.key.shadow.map&&(this.key.shadow.map.dispose(),this.key.shadow.map=null))),this._applyDustQuality(),this._applyPropsQuality(),this.fxMat&&(this.fxMat.uniforms.uGrain.value=t.grain?.055:0,this.fxMat.uniforms.uVig.value=t.glow?.58:.42,this.fxQuad.visible=t.grain||t.glow),this.lampGlow&&(this.lampGlow.visible=t.bloom),this.winGlow&&(this.winGlow.visible=t.bloom),this.hubGlow&&(this.hubGlow.visible=t.glow),this.stageGlow&&(this.stageGlow.visible=t.glow),this.scene&&(this.scene.environment=t.env&&this.envTex?this.envTex:null)}_bindResize(){this._onWinResize=()=>this.resize(),window.addEventListener("resize",this._onWinResize,{passive:!0}),window.ResizeObserver&&(this._ro=new ResizeObserver(()=>this.resize()),this._ro.observe(this.host))}_bindVisibility(){this._onVis=()=>{document.hidden?(this._paused=!0,this._raf&&(cancelAnimationFrame(this._raf),this._raf=0)):(this._paused=!1,this._last=0,this.reduced?this.requestRender():this._startLoop())},document.addEventListener("visibilitychange",this._onVis)}resize(){let t=Math.round(this.host.clientWidth||this.canvas.clientWidth||window.innerWidth||0),e=Math.round(this.host.clientHeight||this.canvas.clientHeight||window.innerHeight||0);if(t<2||e<2)return!1;this.viewport={w:t,h:e};let n=on[this.quality],i=Math.min(window.devicePixelRatio||1,n.dpr);if(this.renderer.setPixelRatio(i),this.renderer.setSize(t,e,!1),this.rig.setAspect(t/e),this.fxMat&&(this.fxMat.uniforms.uAspect.value=t/e,this._fxAspectBase=t/e),this.onResize)try{this.onResize(t,e)}catch(r){console.warn("[board3d] onResize",r)}return this.requestRender(),!0}runAnim(t,e){return this.reduced?(e(1),Promise.resolve()):new Promise(n=>{this.anims.push({t:0,ms:Math.max(1,t),fn:e,resolve:n})})}flushAnims(){let t=this.anims.slice();this.anims.length=0;for(let e of t){try{e.fn(1)}catch(n){console.warn("[board3d] anim flush",n)}e.resolve()}this.requestRender()}_tickAnims(t){for(let e=this.anims.length-1;e>=0;e--){let n=this.anims[e];n.t+=t;let i=re(n.t/n.ms,0,1);try{n.fn(i,n.t)}catch(r){console.warn("[board3d] anim",r)}i>=1&&(this.anims.splice(e,1),n.resolve())}}_startLoop(){if(this.reduced||this._paused||this._raf)return;let t=e=>{if(this._raf=0,!(this._paused||this.reduced)){try{this._frame(e)}catch(n){console.warn("[board3d] frame error:",n&&n.message?n.message:n)}!this._paused&&!this.reduced&&(this._raf=requestAnimationFrame(t))}};this._raf=requestAnimationFrame(t)}requestRender(){if(!this._inFrame){if(this.reduced){if(this._raf)return;this._raf=requestAnimationFrame(t=>{this._raf=0,!this._paused&&this._frame(t,!0)});return}this._startLoop()}}renderNow(){this._frame(performance.now(),!0)}setReduced(t){this.reduced=!!t,this.reduced?(this.flushAnims(),this._raf&&(cancelAnimationFrame(this._raf),this._raf=0),this.renderNow()):(this._last=0,this._startLoop())}_frame(t,e){this._inFrame=!0;try{this._frameInner(t,e)}finally{this._inFrame=!1}}_frameInner(t,e){this._last||(this._last=t);let n=Math.max(0,t-this._last);this._last=t;let i=Math.min(120,n),r=performance.now();if(this._tickAnims(i),!this.reduced){if(this._updateDust(t),this._updateAmbient(t,i),this.bear.group.visible&&(this.bear.group.position.y=cs+Math.sin(t*.0032)*.012,this.bear.group.rotation.z=Math.sin(t*.0016)*.03),this._beaconRing){let l=1+Math.sin(t*.0024)*.08;this._beaconRing.scale.setScalar(l),this._beaconRing.material.opacity=.5+Math.sin(t*.0024)*.18}this.hubStar&&(this.hubStar.rotation.y=t*42e-5,this.hubHalo.position.y=En.h+.1+Math.sin(t*.0016)*.018,this.hubHalo.rotation.z=t*6e-4,this.hubGlow.material.opacity=.2+Math.sin(t*.0022)*.06),this.lampGlow&&(this.lampGlow.material.opacity=.5+Math.sin(t*.0011)*.07),this.streaks.update(i,this.streaks.group.visible),this.fxMat&&this.fxQuad.visible&&(this._fxTime+=i,this.fxMat.uniforms.uTime.value=this._fxTime*.001)}this.updatePlaneTransforms(),this.rig.apply(),this._applyCineCamera(t,n),this._updateLockProbe();let o=performance.now();this.renderer.render(this.scene,this.camera);let a=performance.now();this.lastCalls=this.renderer.info.render.calls,this.lastTris=this.renderer.info.render.triangles,this.perf.frames++,this.perf.sum+=n,this.perf.max=Math.max(this.perf.max,n),n>25&&this.perf.long25++,n>50&&this.perf.long50++,this.perf.updateSum+=o-r,this.perf.renderSum+=a-o,!this.reduced&&!e&&this._adaptCheck(n),!this.ready&&this.viewport.w>0&&this.viewport.h>0&&(this.ready=!0,this.onReady&&this.onReady())}_applyCineCamera(t,e){let n=this.rig,i=this.camera,r=n.state;Math.abs(r.fov-42)<.01&&(i.position.sub(r.center).multiplyScalar(Tn.lensK).add(r.center),i.fov=Tn.fov,i.updateProjectionMatrix());let a=!n.locked&&Math.abs(r.azim)<.01&&r.elev>Tn.overviewElevMin?1:0,l=this.reduced?1:re(1-Math.exp(-(e||16)/150),.05,.85);if(this._elevK+=(a-this._elevK)*l,this._elevK>.002){let c=(58-Tn.elev)*Ue*this._elevK;this._right.setFromMatrixColumn(i.matrixWorld,0),this._v2.copy(i.position).sub(r.center).applyAxisAngle(this._right,c),i.position.copy(r.center).add(this._v2),this._q1.setFromAxisAngle(this._right,c),i.quaternion.premultiply(this._q1)}if(!this.reduced&&this._elevK>.02&&(this.perf.phase==="idle"||this.perf.phase==="win"||this.perf.phase==="boot")){let c=Math.sin(t*13e-5)*Tn.drift.x+Math.sin(t*71e-6+1.3)*Tn.drift.x*.45,h=Math.sin(t*19e-5+1.7)*Tn.drift.y;this._right.setFromMatrixColumn(i.matrixWorld,0),this._up.setFromMatrixColumn(i.matrixWorld,1),i.position.addScaledVector(this._right,c).addScaledVector(this._up,h),this._q1.setFromAxisAngle(this._up,Math.sin(t*11e-5)*Tn.drift.yaw),i.quaternion.premultiply(this._q1)}i.updateMatrixWorld(!0)}_adaptCheck(t){if(!this.adapt||this.quality==="low"||(this._adaptTimer=(this._adaptTimer||0)+t,this._adaptTimer<1500))return;let e=this.perf.sum/Math.max(1,this.perf.frames);if(this._adaptTimer=0,this._slowWindows=e>26?(this._slowWindows||0)+1:0,this._slowWindows>=2){this._slowWindows=0;let n=this.quality==="high"?"medium":"low";this.setQuality(n),console.info("[board3d] auto quality → "+n)}}_updateLockProbe(){if(!this.lockProbeId||this.perf.phase!=="fly")return;let t=this.planes.get(this.lockProbeId);if(!t)return;let e=this.rig.ndcOf(t.group.position);this.lockStats.samples++,this.lockStats.maxAbsX=Math.max(this.lockStats.maxAbsX,Math.abs(e.x)),this.lockStats.maxAbsY=Math.max(this.lockStats.maxAbsY,Math.abs(e.y))}_themeAssets(t){return this._winTex[t.id]||(this._winTex[t.id]=lf(t.window),this._wallTex[t.id]=cf(t.wallTint,512),this._overlayTex[t.id]=pf(t.overlay,Je,512),this._hubTex[t.id]=mf(t.hub,256),this._floorTex=this._floorTex||{},this._floorTex[t.id]=hf(t.floor),this._tex.push(this._winTex[t.id],this._wallTex[t.id],this._overlayTex[t.id],this._hubTex[t.id],this._floorTex[t.id])),{win:this._winTex[t.id],wall:this._wallTex[t.id],overlay:this._overlayTex[t.id],hub:this._hubTex[t.id],floor:this._floorTex[t.id]}}applyTheme(t,e){let n=ms(t);this.theme=n.id,this.host.setAttribute("data-3d-theme",n.id);let i=this._themeAssets(n);this.scene.background.set(n.ink),this.scene.fog=new Fr(n.fog,n.fogDensity),this.renderer.toneMappingExposure=n.exposure,this.scene.environment&&(this.scene.environmentIntensity=n.light.env),this.hemi&&(this.hemi.color.set(n.light.hemiSky),this.hemi.groundColor.set(n.light.hemiGround),this.hemi.intensity=n.light.hemiInt),this.key&&(this.key.color.set(n.light.key),this.key.intensity=n.light.keyInt),this.rim&&(this.rim.color.set(n.light.rim),this.rim.intensity=n.light.rimInt),this.fill&&(this.fill.color.set(n.light.fill),this.fill.intensity=n.light.fillInt),this.wallWash&&(this.wallWash.color.set(n.light.rim),this.wallWash.intensity=n.light.rimInt*.52),this.lamp&&(this.lamp.color.set(n.light.lamp),this.lamp.intensity=n.light.lampInt,this.lamp.distance=n.light.lampDist),this.woodMat&&this.woodMat.color.set(n.tableTint),this.feltMat&&this.feltMat.color.set(n.feltTint),this.boardTopMat&&this.boardTopMat.color.set(n.boardTint),this.boardSideMat&&this.boardSideMat.color.set(n.brass).multiplyScalar(.38),this._brassMaterial&&(this._brassMaterial.color.set(n.brass),this._brassMaterial.roughness=n.brassRough),this.hubTopMat&&(this.hubTopMat.map=i.hub,this.hubTopMat.color.set(16777215),this.hubTopMat.needsUpdate=!0),this.hubStarMat&&this.hubStarMat.color.set(n.hub.star),this.hubGlow&&this.hubGlow.material.color.set(n.hub.glow),this.wallMat&&(this.wallMat.map=i.wall,this.wallMat.color.set(16777215),this.wallMat.needsUpdate=!0),this.windowMat&&(this.windowMat.map=i.win,this.windowMat.needsUpdate=!0),this.glassMat&&this.glassMat.color.set(n.light.rim),this.shadeMat&&this.shadeMat.color.set(n.feltTint).multiplyScalar(.42),this.floorMat&&(i.floor?(this.floorMat.map=i.floor,this.floorMat.color.set(16777215),this.floorMat.needsUpdate=!0):this.floorMat.color.set(n.floor)),this.bulbMat&&this.bulbMat.color.set(n.light.lamp),this.binMat&&this.binMat.color.set(n.wallTint).multiplyScalar(.6),this.stripMat&&this.stripMat.color.set(n.light.lamp),this.binGlow&&this.binGlow.material.color.set(n.light.lamp),this.curtainMat&&this.curtainMat.color.set(n.feltTint).multiplyScalar(1.25).lerp(new Ot(14865078),.25),this.binLatch&&this._brassMaterial&&(this.binLatch.material=this._brassMaterial),this.propClothMat&&this.propClothMat.color.set(n.bear.scarf).multiplyScalar(.72),this.deskPool&&this.deskPool.material.color.set(n.light.lamp),this.lampShadeMat&&(this.lampShadeMat.color.set(n.light.lamp).multiplyScalar(.62),this.lampShadeMat.emissive.set(n.light.lamp)),this.deskLight&&this.deskLight.color.set(n.light.lamp),this.deskGlow&&this.deskGlow.material.color.set(n.light.lamp),this.candleLight&&this.candleLight.color.set(n.light.lamp),this.candleGlow&&this.candleGlow.material.color.set(n.light.lamp),this.flame&&this.flame.material.color.set(n.light.lamp).lerp(new Ot(16773848),.55),this.moteMat&&this.moteMat.color.set(n.light.rim),this.propLeafMat&&this.propLeafMat.color.set(n.id==="paper"?6056778:n.id==="star"?4873826:5139298),this.steam&&this.steam.forEach(r=>r.material.color.set(n.light.lamp).lerp(new Ot(16774374),.7)),this.stageLight&&this.stageLight.color.set(n.light.key),this.lampGlow&&this.lampGlow.material.color.set(n.light.lamp),this.winGlow&&this.winGlow.material.color.set(n.light.rim),this.matOverMat&&this.matOverMat.map!==i.overlay&&(this.matOverMat.map=i.overlay,this.matOverMat.needsUpdate=!0),this.dustMat&&(this.dustMat.color.set(n.dust),this.dustMat.opacity=n.dustOpacity),this.bear&&this.bear.setOutfit(n.bear),this.setDim(this.dimK),this.applyHeat(this.heat),this.requestRender()}applyHeat(t){let e=re(Number(t)||0,0,100);if(this.heat=e,!this.lamp)return;let n=ms(this.theme),i=e/100,r=new Ot(n.heatCool).lerp(new Ot(n.heatWarm),i);this.lamp.color.copy(r),this.lamp.intensity=n.light.lampInt*(.85+i*.5),this._lampBase=this.lamp.intensity,this.hubGlow&&this.hubGlow.material.color.copy(new Ot(n.hub.glow).lerp(r,i*.6)),this.stageGlow&&this.stageGlow.material.color.copy(new Ot(n.heatWarm)),this.requestRender()}applyTurn(t,e){this.turn=t==="b"?"b":"a",e&&(this.colors={a:e.a||"red",b:e.b||"yellow"});let n=Se[this.colors[this.turn]]||Se.red;if(this._beaconRing){this._beaconRing.material.color.set(n);let i=nr[this.colors[this.turn]]*Ue;this.turnBeacon.position.set($n*Math.sin(i),0,-$n*Math.cos(i)),this.turnBeacon.visible=!0}this.requestRender()}setDim(t){let e=re(t,.1,1);this.dimK=e;let n=ms(this.theme),i=oe(.26,1,e);this.tileMat&&this.tileMat.color.setRGB(i,i,i),this.boardTopMat&&this.boardTopMat.color.copy(new Ot(n.boardTint).multiplyScalar(oe(.4,1,e))),this.boardSideMat&&this.boardSideMat.color.copy(new Ot(n.boardTint).multiplyScalar(oe(.34,.85,e))),this.woodMat&&this.woodMat.color.copy(new Ot(n.tableTint).multiplyScalar(oe(.52,1,e))),this.feltMat&&this.feltMat.color.copy(new Ot(n.feltTint).multiplyScalar(oe(.58,1,e))),this.matOverMat&&(this.matOverMat.opacity=oe(.62,1,e)),this.requestRender()}_accentFor(t){return t==="red"?15255976:t==="yellow"?15258536:t==="blue"?13161184:13162696}_createPlane(t){let e=t.color||"red",n=Ef(Se[e]||Se.red,this._accentFor(e)),i=Nl(.6,.5),r=ar(.62,Se[e]||Se.red);return r.material.opacity=.1,this.planeLayer.add(n.group),this.planeLayer.add(i),this.planeLayer.add(r),{id:t.id,color:e,playerId:t.playerId||String(t.id).charAt(0),plane:n,group:n.group,shadow:i,glow:r,local:new R,localYaw:0,fixedYaw:0,mode:"board",tileTopY:Zn,piece:t}}ensurePlane(t,e,n){let i=this.planes.get(t);return i||(i=this._createPlane({id:t,color:e||"red",playerId:n||String(t).charAt(0)}),this.planes.set(t,i),i)}_removePlane(t){let e=this.planes.get(t);e&&(this.planeLayer.remove(e.group),this.planeLayer.remove(e.shadow),this.planeLayer.remove(e.glow),e.plane.dispose(),e.shadow.geometry.dispose(),e.shadow.material.dispose(),e.glow.geometry.dispose(),e.glow.material.dispose(),this.planes.delete(t))}setPieces(t,e,n){let i=Array.isArray(t)?t:[];this.pieces=i.map(a=>({id:a.id,color:a.color||"red",playerId:a.playerId||String(a.id).charAt(0),squareId:a.squareId||"hangar:red:0",arrived:!!a.arrived,stackGroupId:a.stackGroupId||null}));let r={};for(let a of this.pieces)r[a.id]=!0;for(let a of Array.from(this.planes.keys()))r[a]||this._removePlane(a);let o=Pf(this.pieces);for(let a of this.pieces){let l=this.planes.get(a.id);l||(l=this._createPlane(a),this.planes.set(a.id,l)),l.color!==a.color&&(l.color=a.color,l.playerId=a.playerId,l.plane.setColor(Se[a.color]||Se.red,this._accentFor(a.color)),l.glow.material.color.set(Se[a.color]||Se.red));let c=o[a.id]||yi(a.squareId);l.local.set(c.x,c.y,c.z),l.localYaw=c.yaw,l.tileTopY=c.y-Fi,l.mode="board",l.piece=a,l.group.visible=!0,l.group.scale.setScalar(1),l.shadow.visible=!0,this._applyPlaneLocal(l)}e&&(this.turn=e==="b"?"b":"a"),n&&(this.colors={a:n.a||"red",b:n.b||"yellow"}),this._planesDirty=!0,this.updatePlaneTransforms(),this.requestRender()}_applyPlaneLocal(t){t.group.position.copy(t.local),t.group.rotation.set(0,t.localYaw,0)}setPlaneToSquare(t,e,n={}){let i=this.planes.get(t);if(!i)return null;let r=yi(e);return i.local.set(r.x,r.y,r.z),i.localYaw=r.yaw,i.tileTopY=r.y-Fi,i.mode="board",n.visible!==!1&&(i.group.visible=!0,i.group.scale.setScalar(1),i.shadow.visible=!0),this._applyPlaneLocal(i),this.updatePlaneTransforms(),this.requestRender(),i}setPlaneLocal(t,e){let n=this.planes.get(t);return n?(n.local.set(e.x,e.y,e.z),n.localYaw=e.yaw,n.mode="board",this._applyPlaneLocal(n),this.updatePlaneTransforms(),this.requestRender(),n):null}fixPlane(t){let e=this.planes.get(t);return e?(e.fixedYaw=this.boardGroup.rotation.y+e.localYaw,e.mode="fixed",e.group.position.copy(lr),e.group.rotation.set(0,e.fixedYaw,0),e.group.visible=!0,e.group.scale.setScalar(1),e.shadow.visible=!0,this.updatePlaneTransforms(),this.requestRender(),e):null}hidePlane(t){let e=this.planes.get(t);e&&(e.mode="hidden",e.group.visible=!1,e.shadow.visible=!1,e.glow.material.opacity=0,this.requestRender())}updatePlaneTransforms(){if(this.planes.size)for(let t of this.planes.values()){if(t.mode==="board")this._v.copy(t.local),this.boardGroup.localToWorld(this._v),t.group.position.copy(this._v),t.group.rotation.set(0,this.boardGroup.rotation.y+t.localYaw,0),t.shadow.position.set(this._v.x,.008,this._v.z),t.shadow.visible=t.group.visible,t.glow.position.set(this._v.x,t.tileTopY+.012,this._v.z);else if(t.mode==="fixed")t.group.position.copy(lr),t.group.rotation.set(0,t.fixedYaw,0),t.shadow.position.set(lr.x,.008,lr.z),t.shadow.visible=!0,t.glow.position.set(lr.x,Zn+.012,lr.z);else{t.group.visible=!1,t.shadow.visible=!1,t.glow.material.opacity=0;continue}let e=t.playerId===this.turn,n=t.mode==="fixed"?.95:e?this.reduced?.5:.55:.07;t.glow.material.opacity+=(n-t.glow.material.opacity)*.16}}boardPose(){return{theta:this.boardGroup.rotation.y,tx:this.boardGroup.position.x,tz:this.boardGroup.position.z}}applyPose(t){this.boardGroup.rotation.y=t.theta,this.boardGroup.position.set(t.tx,0,t.tz),this.boardGroup.updateMatrixWorld(!0),this.updatePlaneTransforms(),this.requestRender()}setTargetGlow(t,e){if(!t){this.targetGlow.visible=!1;return}let n=yi(t);this.targetGlow.position.set(n.x,n.y-Fi+.012,n.z),this.targetGlow.visible=!0,this.targetGlow.material.opacity=e===void 0?.75:e,this.requestRender()}pulseTargetGlow(t){let e=performance.now(),n=i=>{let r=re((i-e)/t,0,1);this.targetGlow.material.opacity=.35+.5*Math.sin(r*Math.PI),r<1?requestAnimationFrame(n):this.targetGlow.material.opacity=.65};requestAnimationFrame(n)}setStreaks(t){this.streaks.group.visible=!!(t&&!this.reduced),this.requestRender()}setFlyMode(t){this.flyMode=!!t,this.requestRender()}playRipple(t){if(this.ripple.position.set(0,.012,0),this.ripple.visible=!0,this.ripple.scale.setScalar(.4),this.ripple.material.opacity=.55,this.reduced||t)return this.ripple.material.opacity=.2,this.requestRender(),Promise.resolve();let e=performance.now();return new Promise(n=>{let i=r=>{let o=re((r-e)/520,0,1),a=El(o);this.ripple.scale.setScalar(.4+a*2.2),this.ripple.material.opacity=.55*(1-o),this.requestRender(),o<1?requestAnimationFrame(i):(this.ripple.visible=!1,n())};requestAnimationFrame(i)})}setStageSquare(t){this.stageTile&&(this.stageGroup.remove(this.stageTile),this.stageTile.geometry.dispose(),this.stageTile=null),this.stageId=t,this.stageTileMat&&(this.stageTex&&(this.stageTex.dispose(),this.stageTex=null),this.stageTileMat.dispose());let e=t?/^home:(red|yellow|blue|green):(?:(\d+)|goal)$/.exec(t):null,n,i,r;if(e)r=e[1],i="entry",n=Qn(Se[r]).map(a=>a/255*.46);else if(t&&/^ring:(\d+)$/.test(t)){let a=Number(/^ring:(\d+)$/.exec(t)[1]);r=ds(a),i=bl(a),n=Qn(Se[r]).map(l=>l/255*.46)}else r="red",i="ring",n=[.14,.12,.16];this.stageTex=gf(i,r,Qd[i]||"",256,Zd),this._tex.push(this.stageTex),this.stageTileMat=new Yt({map:this.stageTex,vertexColors:!0,roughness:Vt.enamel.roughness+.03,metalness:Vt.enamel.metalness,envMapIntensity:.9});let o=Ul([{x:0,z:0,rot:Ui*Ue,w:vh,d:vh,top:cs,bottom:0,uv:[0,0,1,1],side:n}]);this.stageTile=new At(o,this.stageTileMat),this.stageTile.castShadow=this.shadows,this.stageTile.receiveShadow=!0,this.stageGroup.add(this.stageTile),this.bearSeat&&(this.bearSeat.position.set(us.x,0,us.z),this.bearSeat.scale.setScalar(us.s))}setStageVisible(t){this.stageGroup.visible=!!t,this.stageShadow.visible=!!t,this.stageLight&&(this.stageLight.intensity=t?8.5:0),t||this.bear.setVisible(!1),this.requestRender()}setStageRise(t){this.stageRise=t,this.stageGroup.position.y=rn+t,this.stageShadow.position.set(0,.006,0),this.requestRender()}setBearVisible(t){this.bear.setVisible(!!t),this.requestRender()}dieFaceNormal(t){let e=Kn.indexOf(t),n=new R;return e===0?n.set(1,0,0):e===1?n.set(-1,0,0):e===2?n.set(0,1,0):e===3?n.set(0,-1,0):e===4?n.set(0,0,1):n.set(0,0,-1),n}dieSettleQuat(t,e){let n=new Ie().setFromUnitVectors(this.dieFaceNormal(t),this._upY),i=e===void 0?this._dieYaw:e;return new Ie().setFromAxisAngle(this._upY,i).multiply(n)}_dieExtent(t){let e=t.x,n=t.y,i=t.z,r=t.w;return vl*.5*(Math.abs(2*(e*n+r*i))+Math.abs(1-2*(e*e+i*i))+Math.abs(2*(n*i-r*e)))}_dieShadowAt(){let t=this.die.position.y,e=Math.max(0,t-jn.y);this.dieShadow.position.set(this.die.position.x,rr+.004,this.die.position.z),this.dieShadow.scale.setScalar(re(1.02-e*.3,.55,1.08)),this.dieShadow.material.opacity=re(.52-e*.2,.1,.52)}setDieVisible(t){let e=!!t;this.die.visible=e,this.dieShadow.visible=e,this.requestRender()}placeDie(t){let e=re(Number(t)||1,1,6);this.dieValue=e,this.die.visible=!0,this.dieShadow.visible=!0,this.die.position.copy(jn),this.die.quaternion.copy(this.dieSettleQuat(e)),this._dieShadowAt(),!this._toss&&this._hand&&(this._hand.group.visible=!1),this.requestRender()}dieDebug(){let e=new Gt().makeRotationFromQuaternion(this.die.quaternion).elements,n=[[e[1],Kn[0]],[-e[1],Kn[1]],[e[5],Kn[2]],[-e[5],Kn[3]],[e[9],Kn[4]],[-e[9],Kn[5]]],i=n[0];for(let r=1;r<n.length;r++)n[r][0]>i[0]&&(i=n[r]);return{value:this.dieValue,top:i[1],up:+i[0].toFixed(4),pos:[+this.die.position.x.toFixed(4),+this.die.position.y.toFixed(4),+this.die.position.z.toFixed(4)],atHome:+this.die.position.distanceTo(jn).toFixed(4),hand:!!(this._hand&&this._hand.group.visible),tossing:!!this._toss,t:this._toss?Math.round(this._toss.animT||0):null,wall:this._toss?Math.round(performance.now()-this._toss.startedAt):null,phase:this._toss&&this._toss.phase||""}}_handQuat(t,e,n){return new Ie().setFromEuler(new fn(e,t,n,"YXZ"))}_handPoseForDie(t,e,n,i){let r=this._handQuat(e,n,i),o=this._hand.gripLocal.clone().applyQuaternion(r);return{p:t.clone().sub(o),q:r}}_poseLerp(t,e,n,i){return i=i||{p:new R,q:new Ie},i.p.lerpVectors(t.p,e.p,n),i.q.copy(t.q).slerp(e.q,n),i}_handAt(t){let e=this._toss;if(!e)return null;let n=e.poses,i=c=>1-Math.pow(1-re(c,0,1),3),r=c=>{let h=re(c,0,1);return h<.5?4*h*h*h:1-Math.pow(-2*h+2,3)/2},o=c=>Math.pow(re(c,0,1),2.2);if(t<=e.enterMs)return this._poseLerp(n.start,n.hover,i(t/e.enterMs),e.hp);if(t<=e.enterMs+e.descendMs)return this._poseLerp(n.hover,n.grip,r((t-e.enterMs)/e.descendMs),e.hp);let a=e.enterMs+e.descendMs+e.closeMs;if(t<=a)return this._poseLerp(n.grip,n.grip,0,e.hp);if(t<=e.liftEnd)return this._poseLerp(n.grip,n.lift,r((t-a)/e.liftMs),e.hp);if(t<=e.releaseAt)return this._poseLerp(n.lift,n.rel,o((t-e.liftEnd)/e.throwMs),e.hp);let l=e.releaseAt+120;return t<=l?this._poseLerp(n.rel,n.follow,i((t-e.releaseAt)/120),e.hp):t<=e.exitEnd?this._poseLerp(n.follow,n.exit,i((t-l)/Math.max(1,e.exitMs-120)),e.hp):null}_gripAt(t){let e=this._toss,n=e.enterMs+e.descendMs;return t<n?0:t<n+e.closeMs?(t-n)/e.closeMs:t<e.releaseAt?1:1-re((t-e.releaseAt)/150,0,1)}_simulateToss(t){let e=qe.step,n=Math.ceil((qe.maxActive+.02)/e),i=new Float32Array(n*3),r=new Float32Array(n*4),o=[zl.x,zl.y,zl.z],a=-.636,l=-.35,c=-.636,h=12.1,u=5.5,d=-8.1,f={x:t.x,y:t.y,z:t.z,w:t.w},g=this._mulberry(5),_=[],m=0,p=0,b=0,S=new Ie;for(let L=0;L<=n;L++){let U=L*e;i[L*3]=o[0],i[L*3+1]=o[1],i[L*3+2]=o[2],r[L*4]=f.x,r[L*4+1]=f.y,r[L*4+2]=f.z,r[L*4+3]=f.w,b=L+1;let G=1-qe.airDrag*e;a*=G,c*=G,l-=qe.g*e,o[0]+=a*e,o[1]+=l*e,o[2]+=c*e;let B=.5*(-h*f.x-u*f.y-d*f.z)*e,W=.5*(h*f.w+u*f.z-d*f.y)*e,Z=.5*(-h*f.y+u*f.w+d*f.x)*e,k=.5*(h*f.x+u*f.y+d*f.z)*e;f.x+=B,f.y+=W,f.z+=Z,f.w+=k;let j=Math.sqrt(f.x*f.x+f.y*f.y+f.z*f.z+f.w*f.w)||1;f.x/=j,f.y/=j,f.z/=j,f.w/=j;let at=1-qe.spinDamp*e;h*=at,u*=at,d*=at,S.set(f.x,f.y,f.z,f.w);let nt=this._dieExtent(S),ft=rr+nt,Ut=Math.sqrt(o[0]*o[0]+o[2]*o[2]);if(Ut>qe.boundR){let Lt=-o[0]/Ut,Ct=-o[2]/Ut,V=a*Lt+c*Ct;V<0&&(a-=1.7*V*Lt,c-=1.7*V*Ct,o[0]=Lt*-qe.boundR,o[2]=Ct*-qe.boundR,h+=(g()-.5)*4,u+=(g()-.5)*3,d+=(g()-.5)*4)}if(o[1]<=ft){if(o[1]=ft,l<0){let Lt=-l,Ct=Math.min(_.length,2);if(Lt>.55){l=Lt*(qe.rest[Ct]+(g()-.5)*.04);let V=qe.tan[Ct]+(g()-.5)*.05,$=(g()-.5)*9*Ue,vt=Math.cos($),bt=Math.sin($),Tt=a*vt-c*bt,jt=a*bt+c*vt;a=Tt*V,c=jt*V,h=h*.72+(g()-.5)*7,u=u*.6+(g()-.5)*5,d=d*.72+(g()-.5)*7,_.push({t:+U.toFixed(3),speed:+Lt.toFixed(2)})}else l=0,p++}else l=0,p++;if(p>0){let Lt=Math.sqrt(a*a+c*c);if(Lt>1e-4){let V=Math.min(Lt,qe.rollFriction*e);a-=a/Lt*V,c-=c/Lt*V}let Ct=1-2.2*e;h*=Ct,u*=Ct,d*=Ct,!m&&Lt<.05&&Math.abs(h)+Math.abs(u)+Math.abs(d)<1.6&&(m=U)}}if(m&&U>m+.06)break}let x=m?re(m+qe.restPad,qe.minEnd,qe.maxActive):qe.maxActive,A=Math.max(0,x-qe.settleMs/1e3),w=Math.min(b-1,Math.round(A/e)),P=new Ie(r[w*4],r[w*4+1],r[w*4+2],r[w*4+3]),C=new R(i[w*3],i[w*3+1],i[w*3+2]),M=null,v=this._dieYaw,I=1e9;for(let L=0;L<4;L++){let U=.22+L*Math.PI/2,G=this.dieSettleQuat(this.dieValue,U),B=P.angleTo(G);B<I&&(I=B,v=U,M=G)}return this._dieYaw=v,{posArr:i,quatArr:r,n:b,impacts:_,restAt:m,settleStart:A,settleEnd:x,startP:C,startQ:P,targetQ:M,settleAngle:+(I/Ue).toFixed(1)}}_mulberry(t){let e=t>>>0;return function(){e=e+1831565813|0;let n=Math.imul(e^e>>>15,1|e);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}_beginToss(t){let e=this._hand;if(!e)return null;this.die.visible=!0,this.dieShadow.visible=!0,e.group.visible=!0,e.setGrip(0);let n=this.die.quaternion.clone();this.die.position.copy(jn),this.die.quaternion.copy(n);let i=jn.clone().add(new R(.02,.17,.04)),r={hover:this._handPoseForDie(i,1.95,-.18,.82),grip:this._handPoseForDie(jn,1.95,-.12,.92),lift:this._handPoseForDie(new R(1.16,.88,1.16),1.9,-.04,.9),rel:this._handPoseForDie(zl,1.62,.12,.18)};r.start={p:r.hover.p.clone().add(new R(1.95,.02,-.62)),q:r.hover.q.clone()},r.follow={p:r.rel.p.clone().add(new R(-.2,-.1,-.2)),q:this._handQuat(1.44,.28,-.12)},r.exit={p:r.rel.p.clone().add(new R(1.3,.3,.6)),q:this._handQuat(1.2,.4,-.16)};let o=r.grip.q.clone().invert().multiply(n),a=r.rel.q.clone().multiply(o),l={enterMs:en.enterMs,descendMs:en.descendMs,closeMs:en.closeMs,liftMs:en.liftMs,throwMs:en.throwMs,exitMs:en.exitMs,liftEnd:en.enterMs+en.descendMs+en.closeMs+en.liftMs,releaseAt:en.releaseAt,exitEnd:en.releaseAt+en.exitMs,total:en.total,poses:r,dieLocalQ:o,hp:{p:new R,q:new Ie},phase:"enter",sndRelease:!1,impactIdx:0,startedAt:performance.now()};return l.phys=this._simulateToss(a),l.settleStartAbs=l.releaseAt+l.phys.settleStart*1e3,l.settleEndAbs=l.releaseAt+l.phys.settleEnd*1e3,l.total=Math.max(en.total,Math.ceil(l.settleEndAbs)+20),this._toss=l,this._tossFrame(0,null),l}_tossFrame(t,e){let n=this._toss;if(!n)return;let i=this._handAt(t);if(i?(n.hp.p.copy(i.p),n.hp.q.copy(i.q),this._hand.group.position.copy(i.p),this._hand.group.quaternion.copy(i.q),this._hand.setGrip(this._gripAt(t)),this._hand.group.visible=!0):this._hand.group.visible=!1,n.phase=t<n.liftEnd-n.liftMs?"enter":t<n.releaseAt?"carry":"throw",n.animT=t,t<n.releaseAt){let r=n.enterMs+n.descendMs+n.closeMs;t<r?(this.die.position.copy(jn),this.die.quaternion.copy(n.poses.grip.q).multiply(n.dieLocalQ)):(this.die.position.copy(n.hp.p),this._v.copy(this._hand.gripLocal).applyQuaternion(n.hp.q),this.die.position.add(this._v),this.die.quaternion.copy(n.hp.q).multiply(n.dieLocalQ))}else if(this._diePhysAt(t),e&&!n.sndRelease&&(n.sndRelease=!0,e.onRelease&&e.onRelease()),e){let r=n.phys;for(;n.impactIdx<r.impacts.length&&t>=n.releaseAt+r.impacts[n.impactIdx].t*1e3;){let o=r.impacts[n.impactIdx];n.impactIdx++,e.onImpact&&e.onImpact(o.t,o.speed)}}this._dieShadowAt()}_diePhysAt(t){let e=this._toss,n=e.phys,i=Math.max(0,t-e.releaseAt)/1e3,r=qe.step;if(i>=n.settleEnd){this.die.position.copy(jn),this.die.quaternion.copy(n.targetQ);return}if(i>=n.settleStart){let u=re((i-n.settleStart)/(n.settleEnd-n.settleStart),0,1),d=ir(0,1,u),f=ir(.05,1,u);this.die.quaternion.copy(n.startQ).slerp(n.targetQ,f),this.die.position.x=oe(n.startP.x,jn.x,d),this.die.position.z=oe(n.startP.z,jn.z,d),this.die.position.y=rr+this._dieExtent(this.die.quaternion);return}let o=i/r,a=Math.min(n.n-2,Math.max(0,Math.floor(o))),l=re(o-a,0,1),c=n.posArr,h=n.quatArr;this.die.position.set(oe(c[a*3],c[(a+1)*3],l),oe(c[a*3+1],c[(a+1)*3+1],l),oe(c[a*3+2],c[(a+1)*3+2],l)),this._q2.set(h[a*4],h[a*4+1],h[a*4+2],h[a*4+3]),this._q1.set(h[(a+1)*4],h[(a+1)*4+1],h[(a+1)*4+2],h[(a+1)*4+3]),this.die.quaternion.copy(this._q2).slerp(this._q1,l)}_endToss(t){this._toss=null,this._hand&&(this._hand.group.visible=!1,this._hand.setGrip(0)),this.placeDie(t),this.requestRender()}tossDie(t,e,n){let i=re(Number(t)||1,1,6);if(this.dieValue=i,this.reduced||e)return this._endToss(i),Promise.resolve();let r=this._beginToss(i);if(!r)return this._endToss(i),Promise.resolve();let o=n||{};return this.runAnim(r.total,(a,l)=>{let c=!(typeof l=="number"&&isFinite(l)),h=c?r.total:l;this._tossFrame(h,c?null:o),h>=r.settleEndAbs-1&&o.onSettle&&(r.sndSettle||(r.sndSettle=!0,o.onSettle()))}).then(()=>this._endToss(i))}markPhase(t){this.perf.frames>0&&this.perf.phase&&(this.perf.phases[this.perf.phase]={frames:this.perf.frames,avgMs:+(this.perf.sum/this.perf.frames).toFixed(2),maxMs:+this.perf.max.toFixed(2),long25:this.perf.long25,long50:this.perf.long50,ms:+(performance.now()-this.perf.since).toFixed(0),calls:this.lastCalls,tris:this.lastTris,updateMs:+(this.perf.updateSum/this.perf.frames).toFixed(2),renderMs:+(this.perf.renderSum/this.perf.frames).toFixed(2)}),this.perf.phase=t,this.perf.frames=0,this.perf.sum=0,this.perf.max=0,this.perf.long25=0,this.perf.long50=0,this.perf.updateSum=0,this.perf.renderSum=0,this.perf.since=performance.now()}debugSnapshot(){let t=this.perf.frames>0?{frames:this.perf.frames,avgMs:+(this.perf.sum/this.perf.frames).toFixed(2),maxMs:+this.perf.max.toFixed(2),long25:this.perf.long25,long50:this.perf.long50,long25Ratio:+(this.perf.long25/this.perf.frames).toFixed(3),fps:+(this.perf.frames*1e3/Math.max(1,performance.now()-this.perf.since)).toFixed(1),updateMs:+(this.perf.updateSum/this.perf.frames).toFixed(2),renderMs:+(this.perf.renderSum/this.perf.frames).toFixed(2),ms:+(performance.now()-this.perf.since).toFixed(0)}:null,e=this.planes.get("a:0")||this.planes.values().next().value,n={camera:{pos:this.camera.position.toArray().map(r=>+r.toFixed(4)),fov:+this.camera.fov.toFixed(2),rigFov:+this.rig.state.fov.toFixed(2),elev:+this.rig.state.elev.toFixed(2),elevTuned:+this._elevK.toFixed(3),locked:this.rig.locked},board:{theta:+this.boardGroup.rotation.y.toFixed(5),tx:+this.boardGroup.position.x.toFixed(5),tz:+this.boardGroup.position.z.toFixed(5)},lock:{samples:this.lockStats.samples,maxAbsX:+this.lockStats.maxAbsX.toFixed(5),maxAbsY:+this.lockStats.maxAbsY.toFixed(5)},stage:{visible:this.stageGroup.visible,rise:+this.stageRise.toFixed(3),bear:+this.bear.group.scale.x.toFixed(3)},die:this.dieDebug(),streaks:this.streaks.group.visible};if(e){let r=this.rig.ndcOf(e.group.position);n.plane={id:e.id,world:e.group.position.toArray().map(o=>+o.toFixed(4)),ndc:[+r.x.toFixed(5),+r.y.toFixed(5)]}}let i=this.renderer.getPixelRatio();return{phase:this.perf.phase,current:t,phases:this.perf.phases,render:{calls:this.lastCalls,triangles:this.lastTris,cssPx:this.viewport.w*this.viewport.h,pixels:Math.round(this.viewport.w*this.viewport.h*i*i)},quality:this.quality,dpr:i,shadows:this.renderer.shadowMap.enabled,antialias:this.useAA,viewport:this.viewport,cinematic:{toneMapping:this.renderer.toneMapping,exposure:this.renderer.toneMappingExposure,env:this.scene.environment?"pmrem":"off",envIntensity:this.scene.environmentIntensity,dust:this._dustCount,fx:this.fxQuad?{vignette:this.fxMat.uniforms.uVig.value,grain:this.fxMat.uniforms.uGrain.value}:null,lens:{fov:Tn.fov,elev:Tn.elev,lensK:+Tn.lensK.toFixed(4)}},probe:n}}dispose(){this._raf&&(cancelAnimationFrame(this._raf),this._raf=0),this._paused=!0,this._ro&&(this._ro.disconnect(),this._ro=null),this._onWinResize&&window.removeEventListener("resize",this._onWinResize),this._onVis&&document.removeEventListener("visibilitychange",this._onVis);let t=e=>{if(e){if(Array.isArray(e)){e.forEach(t);return}e.dispose()}};if(this.scene.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&t(e.material)}),this._tex.forEach(e=>{try{e.dispose()}catch(n){}}),this.envRT)try{this.envRT.dispose()}catch(e){}try{this.renderer.dispose()}catch(e){}try{let e=this.renderer.getContext&&this.renderer.getContext(),n=e&&e.getExtension("WEBGL_lose_context");n&&n.loseContext()}catch(e){}this.planes.clear(),this.anims.length=0,this._toss=null,this._hand=null}};function Hl(s,t,e){let n=new Ln,i=s/2,r=t/2,o=Math.min(e,i,r);return n.moveTo(-i+o,-r),n.lineTo(i-o,-r),n.quadraticCurveTo(i,-r,i,-r+o),n.lineTo(i,r-o),n.quadraticCurveTo(i,r,i-o,r),n.lineTo(-i+o,r),n.quadraticCurveTo(-i,r,-i,r-o),n.lineTo(-i,-r+o),n.quadraticCurveTo(-i,-r,-i+o,-r),n}function If(s,t,e){let n=new Ri,i=s/2,r=t/2,o=Math.min(e,i,r);return n.moveTo(-i+o,-r),n.lineTo(i-o,-r),n.quadraticCurveTo(i,-r,i,-r+o),n.lineTo(i,r-o),n.quadraticCurveTo(i,r,i-o,r),n.lineTo(-i+o,r),n.quadraticCurveTo(-i,r,-i,r-o),n.lineTo(-i,-r+o),n.quadraticCurveTo(-i,-r,-i+o,-r),n}function Ux(s,t,e){let n=new pi(Hl(s,t,e),12),i=n.getAttribute("position"),r=new Float32Array(i.count*2);for(let o=0;o<i.count;o++)r[o*2]=(i.getX(o)+s/2)/s,r[o*2+1]=(i.getY(o)+t/2)/t;return n.setAttribute("uv",new Ne(r,2)),n}var aS=new R(Ni.x,Ni.y,Ni.z),Hh=class{constructor(){this.on=!1,this.ctx=null,this.master=null}setOn(t){this.on=!!t,this.on&&this._ensure()}_ensure(){if(typeof window=="undefined")return null;let t=window.AudioContext||window.webkitAudioContext;if(!t)return null;try{this.ctx||(this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=.14,this.master.connect(this.ctx.destination)),this.ctx.state==="suspended"&&this.ctx.resume&&this.ctx.resume().catch(()=>{})}catch(e){this.ctx=null}return this.ctx}_tone(t,e,n,i,r,o){let a=this.ctx,l=a.currentTime+(o||0),c=a.createOscillator(),h=a.createGain();c.type=i||"sine",c.frequency.setValueAtTime(t,l),e&&e!==t&&c.frequency.exponentialRampToValueAtTime(Math.max(30,e),l+n),h.gain.setValueAtTime(1e-4,l),h.gain.exponentialRampToValueAtTime(Math.max(2e-4,r),l+.012),h.gain.exponentialRampToValueAtTime(1e-4,l+n),c.connect(h),h.connect(this.master),c.start(l),c.stop(l+n+.02)}_noise(t,e){let n=this.ctx,i=Math.max(1,Math.floor(n.sampleRate*t)),r=n.createBuffer(1,i,n.sampleRate),o=r.getChannelData(0);for(let h=0;h<i;h++)o[h]=(Math.random()*2-1)*(1-h/i);let a=n.createBufferSource();a.buffer=r;let l=n.createGain();l.gain.value=e;let c=n.createBiquadFilter();c.type="bandpass",c.frequency.value=1200,a.connect(c),c.connect(l),l.connect(this.master),a.start()}_can(){return this.on&&this.ctx}dice(){if(this._can())try{this._noise(.18,.16),this._tone(220,90,.14,"triangle",.1)}catch(t){}}diceLand(t){if(this._can())try{let e=re(Number(t)||0,0,1),n=.05+.11*e;this._noise(.05,n),this._tone(190-40*e,90,.085,"triangle",n*.9)}catch(e){}}whoosh(){if(this._can())try{this._noise(.22,.1)}catch(t){}}tick(){if(this._can())try{this._tone(520,420,.05,"sine",.025)}catch(t){}}land(){if(this._can())try{this._tone(150,70,.18,"sine",.16),this._noise(.08,.08)}catch(t){}}bear(){if(this._can())try{this._tone(660,660,.12,"sine",.08),this._tone(990,990,.16,"sine",.06,.1)}catch(t){}}capture(){if(this._can())try{this._noise(.24,.18),this._tone(300,60,.22,"sawtooth",.08)}catch(t){}}win(){if(this._can())try{[523,659,784,1046].forEach((t,e)=>this._tone(t,t,.3,"sine",.07,e*.11))}catch(t){}}},Gl=class{constructor(t,e={}){this.scene=t,this.host=e.host||t.host,this.reduced=!!e.reduced,this.stageAim=e.stageAim||{nx:0,ny:.15},this.phase="boot",this.busy=!1,this.holding=!1,this.cellCtx=null,this.lastState=null,this.lastView=null,this._queue=Promise.resolve(),this._instantNext=!1,this._skipRequested=!1,this._skipUntilIdle=!1,this._fitPending=!1,this._movingPieceId=null,this._lastSquare=null,this.targetSquare=null,this.sfx=new Hh,this.sfx.setOn(!!e.sound),this.scene.lockProbeId=null,this.scene.applyPose({theta:0,tx:0,tz:0}),this.scene.rig.snap(this._overview()),this._setPhase("idle")}setState(t,e){this.lastState=t||this.lastState,this.lastView=e||this.lastView}setSound(t){this.sfx.setOn(t)}setReduced(t){let e=!!t;e!==this.reduced&&(this.reduced=e,this.scene.setReduced(e),e?(this._instantNext=!0,this.scene.flushAnims(),this.scene.setFlyMode(!1),this.busy||(this.holding=!1,this.cellCtx=null,this.scene.setStageVisible(!1),this.scene.setDim(1),this.scene.setTargetGlow(null),this.scene.setStreaks(!1),this.scene.applyPose({theta:0,tx:0,tz:0}),this.scene.rig.snap(this._overview()),this._setPhase("idle"),this._instantNext=!1)):(this._instantNext=!1,this.scene.rig.snap(this.scene.rig.snapshotTarget())))}play(t,e){let n=Array.isArray(t)?t.filter(Boolean):[],i=()=>this._run(n,e||{}).catch(r=>{console.warn("[board3d] play error:",r&&r.message?r.message:r),this.holding=!1,this._setPhase("idle")}).finally(()=>{if(this.busy=!1,this._instantNext=!1,this._skipRequested=!1,this.phase==="idle"&&!this.holding&&(this._skipUntilIdle=!1),!this.holding&&this.phase==="idle")try{this.handleResize()}catch(r){}});return this.busy=!0,this._queue=this._queue.then(i,i),this._queue}skip(){this._skipRequested=!0,this._skipUntilIdle=!0,this.scene.flushAnims(),this._instantNext=!0,this.busy||(this.holding||this.phase!=="idle"?this.returnToOverview().catch(()=>{}):(this._instantNext=!1,this._skipUntilIdle=!1,this._skipRequested=!1))}_setPhase(t){this.phase=t,this.host&&this.host.setAttribute("data-3d-phase",t),this.scene.markPhase(t)}_anim(t,e){if(this._instantNext||this._skipUntilIdle||this.reduced){try{e(1)}catch(n){console.warn("[board3d] anim instant",n)}return this.scene.requestRender(),Promise.resolve()}return this.scene.runAnim(t,e)}_animateCamera(t,e,n){return this._instantNext||this._skipUntilIdle||this.reduced?(this.scene.rig.snap(e),Promise.resolve()):this.scene.rig.animate(t,e,n)}_playerOf(t){return String(t||"").charAt(0)==="b"?"b":"a"}_colorFor(t){let e=this.lastState;if(e&&Array.isArray(e.pieces)){let i=e.pieces.find(r=>r.id===t);if(i&&i.color)return i.color}let n=this._playerOf(t);return e&&e.colors&&e.colors[n]?e.colors[n]:n==="b"?"yellow":"red"}_squareOf(t){let e=this.lastState;if(e&&Array.isArray(e.pieces)){let n=e.pieces.find(i=>i.id===t);if(n)return n.squareId}return null}_overview(){let t=this.scene.rig.distForCover(3.7,$d,42),e={center:new R(0,.05,.24),nx:0,ny:0,radius:t,elev:58,azim:0,fov:42};return e.ny=this._centerBias(e),e}_centerBias(t){let e=this.scene.rig,n=this.scene.camera,i=this.scene.boardGroup,r=n.position.constructor,o=e.snapshotTarget(),a=e.lockState,l=1e9,c=-1e9;try{e.lockState=null,e.snap({center:t.center.clone(),nx:t.nx,ny:0,radius:t.radius,elev:t.elev,azim:t.azim,fov:t.fov});for(let h=0;h<24;h++){let u=h/24*yt,d=i.localToWorld(new r(Math.cos(u)*3.3,.035,Math.sin(u)*3.3)).project(n);d.y<l&&(l=d.y),d.y>c&&(c=d.y)}}catch(h){l=0,c=0}finally{e.snap(o),e.lockState=a}return!isFinite(l)||!isFinite(c)?0:+re(-(l+c)/2,-.12,.12).toFixed(4)}handleResize(){let t={idle:1,win:1,boot:1};if(this.busy||this.holding||!t[this.phase]){this._fitPending=!0;return}this._fitPending=!1,this.scene.applyPose({theta:0,tx:0,tz:0}),this.scene.rig.snap(this._overview())}_focus(){return{center:new R(0,hs,0),nx:0,ny:0,radius:3.05,elev:33,azim:0,fov:42}}_roll(){let t=this.scene.rig.aspect||1,e=re(.657/Math.max(.35,t),1,1.32);return{center:new R(.73,.28,.64),nx:0,ny:0,radius:3.6*e,elev:50,azim:7,fov:42}}_land(){return{center:new R(0,.12,0),nx:0,ny:.02,radius:4.05,elev:46,azim:0,fov:42}}_stage(){return{center:new R(0,rn+Ml+.34,0),nx:this.stageAim.nx,ny:this.stageAim.ny,radius:this.scene.rig.distForCover(.4,.52,42),elev:45,azim:Ui,fov:42}}async _runReduced(t){this.scene.setFlyMode(!1),this.scene.setDieVisible(!0);let e=t.find(i=>i.type==="dice");e&&this.scene.placeDie(e.die);let n=t.filter(Bh);for(let i of n){let r=i.pieceId,o=lo(i);r&&o&&this.scene.setPlaneToSquare(r,o)}if(!n.length){let i=this._squareOf(this._movingPieceId);i&&this.scene.setPlaneToSquare(this._movingPieceId,i)}this._setPhase("idle")}async _run(t,e){if(this.reduced)return this._runReduced(t);this.holding&&await this.returnToOverview();let n=t.find(b=>b.type==="dice"),i=t.filter(Bh),r=t.find(b=>b.type==="prompt"&&b.prompt),o=t.find(b=>b.type==="minigame"),a=t.find(b=>b.type==="capture"),l=t.find(b=>b.type==="stack"),c=t.find(b=>b.type==="win"),h=t.find(b=>b.type==="ledger"),u=t.find(b=>b.type==="safe");if(n&&(await this._phaseRoll(n),!i.length&&!r&&!o&&!c)){await this.returnToOverview();return}if(!i.length){let b=r&&r.prompt;if(c||b&&b.kind==="ending"){await this._phaseWin();return}if(h||u){await this.returnToOverview();return}this._setPhase("idle");return}let d=i[0],f=d.pieceId||a&&a.attackerId;if(!f)return;this.scene.setDieVisible(!1),this._movingPieceId=f,this.scene.ensurePlane(f,this._colorFor(f),this._playerOf(f)),this.targetSquare=lo(i[i.length-1]);let g=this._originFor(d,f);await this._phaseFocus(f,g),this._setPhase("fly"),this.scene.fixPlane(f),this.scene.setFlyMode(!0),this.scene.lockProbeId=f,this.scene.lockStats.reset(),this.scene.setStreaks(!0),this.sfx.whoosh();let _=g;for(let b of i)_=await this._animateMotion(b,_,f);this._lastSquare=_,this.scene.setStreaks(!1),await this._phaseLand(f,_),a&&await this._phaseCapture(a,_),l&&(this.scene.setTargetGlow(_,.8),await this._phaseStack(l));let m=r&&r.prompt;if(!!(m&&m.kind==="ending")||c&&!m){await this._phaseWin();return}if(r||o){await this._phaseCell(f,_),(this._instantNext||this.reduced)&&await this.returnToOverview(f,_);return}await this.returnToOverview(f,_)}_originFor(t,e){let n=Cf(t);if(n)return n;let i=this._squareOf(e);return i||t.path&&t.path[0]||"ring:0"}async _phaseRoll(t){this._setPhase("roll");let e=re(Number(t.die)||1,1,6);if(this.reduced){this.scene.placeDie(e);return}this.scene.setDieVisible(!0),this.sfx.whoosh();let n=this._animateCamera(560,this._roll()),i=this.scene.tossDie(e,this._instantNext||this._skipUntilIdle,{onRelease:()=>this.sfx.dice(),onImpact:(r,o)=>this.sfx.diceLand(o),onSettle:()=>this.sfx.tick()});await Promise.all([n,i])}async _phaseFocus(t,e){this._setPhase("focus");let n=ao(e),i=this._focus();if(this.scene.setPlaneToSquare(t,e),this.scene.setTargetGlow(e,.5),this.scene.reduced){this.scene.applyPose(n),this.scene.rig.snap(i);return}let r=this.scene.boardPose(),o=this.scene.rig.snapshotTarget();await this._animateCamera(950,i,l=>{let c=Oh(r,n,l);this.scene.applyPose(c);let h=this.scene.planes.get(t);if(!h)return i.center.clone();let u=h.local.clone();return this.scene.boardGroup.localToWorld(u),u}),this.scene.applyPose(n);let a=this.scene.planes.get(t);a&&(this.scene.rig.state.center.copy(a.group.position),this.scene.rig.apply())}async _slideTo(t,e){let n=this.scene.boardPose();if(this.scene.reduced){this.scene.applyPose(t);return}await this._anim(e,i=>{let r=fs(re(i,0,1));this.scene.applyPose(Oh(n,t,r))}),this.scene.applyPose(t)}async _animateMotion(t,e,n){if(t.type==="move"){let i=(t.path||[]).slice();for(let r of i){this.scene.setTargetGlow(r,.5);let o=String(r).indexOf("home:")===0?190:165;await this._slideTo(ao(r),o),e=r,this.sfx.tick()}return e}if(t.type==="takeoff"){let i=lo(t)||e,r=this.scene.planes.get(n);return r&&r.group.scale.setScalar(.82),this.scene.setTargetGlow(i,.55),await this._slideTo(ao(i),900),r&&r.group.scale.setScalar(1),this.sfx.whoosh(),i}if(t.type==="jump"||t.type==="fly"){let i=lo(t)||e;return this.scene.setTargetGlow(i,.8),await this._slideTo(ao(i),t.type==="jump"?540:840),this.sfx.whoosh(),i}return e}async _phaseLand(t,e){if(this._setPhase("land"),this.scene.setFlyMode(!1),this.scene.rig.unlock(),this.scene.lockProbeId=null,this.scene.setPlaneToSquare(t,e),this.scene.setTargetGlow(e,.7),this.scene.playRipple(this._instantNext||this._skipUntilIdle),this.sfx.land(),this.scene.reduced){this.scene.rig.snap(this._land());return}await this._animateCamera(460,this._land()),this._instantNext||this.scene.pulseTargetGlow(380)}async _phaseStack(t){this._setPhase("stack"),this._instantNext||this.scene.pulseTargetGlow(520);let e=t&&t.pieceIds||[];for(let n of e){let i=this.scene.planes.get(n);i&&i.group.scale.setScalar(1.14)}if(!this.scene.reduced){await this._anim(320,n=>{let i=1+Math.sin(n*Math.PI)*.14;for(let r of e){let o=this.scene.planes.get(r);o&&o.group.scale.setScalar(i)}});for(let n of e){let i=this.scene.planes.get(n);i&&i.group.scale.setScalar(1)}}}async _phaseCapture(t,e){this._setPhase("capture"),this.scene.rig.shake(320,.06),this.sfx.capture();let n=t&&t.victimIds||[];for(let i of n){let r=this._colorFor(i),o=this.scene.ensurePlane(i,r,this._playerOf(i)),a=yi(e);o.local.set(a.x,a.y,a.z),o.localYaw=a.yaw,o.mode="board",o.group.visible=!0,o.group.scale.setScalar(1),this.scene._applyPlaneLocal(o),this.scene.updatePlaneTransforms();let l=this._squareOf(i)||"hangar:"+r+":0",c=yi(l);if(this.scene.reduced){this.scene.setPlaneToSquare(i,l);continue}await this._anim(700,h=>{let u=fs(re(h,0,1));o.local.set(oe(a.x,c.x,u),oe(a.y,c.y,u)+Math.sin(h*Math.PI)*.55,oe(a.z,c.z,u)),o.localYaw=a.yaw+u*5,o.group.scale.setScalar(1-u*.35),this.scene._applyPlaneLocal(o),this.scene.updatePlaneTransforms()}),this.scene.hidePlane(i)}}async _phaseCell(t,e){if(this.scene.reduced){await this.returnToOverview(t,e);return}this._setPhase("cell45"),this.scene.setDim(.18),this.scene.setStageSquare(e),this.scene.stageShadow.position.set(0,.004,0),this.scene.stageShadow.material.opacity=0,this.scene.stageShadow.scale.setScalar(1),this.scene.setStageRise(0),this.scene.setStageVisible(!0),this.scene.setBearVisible(!1),this.scene.bear.group.scale.setScalar(.001),this.scene.bear.group.rotation.y=Math.PI+Ui*Ue,this.scene.hidePlane(t),this.scene.setTargetGlow(null);let n=this._stage(),i=this.scene.rig.snapshotTarget(),r=this._animateCamera(900,n,l=>new R(0,oe(i.center.y,n.center.y,l),0)),o=this._anim(900,l=>{let c=fs(re(l,0,1));this.scene.setDim(oe(1,.18,ir(0,.75,l))),this.scene.setStageRise(oe(0,Ml,c)),this.scene.stageShadow.material.opacity=oe(0,.5,ir(.2,1,l)),this.scene.stageShadow.scale.setScalar(oe(1,.7,c))});await Promise.all([r,o]),this.scene.setDim(.18),this.scene.setStageRise(Ml),this.scene.rig.snap(n),this.scene.setBearVisible(!0),this._setPhase("bear"),this.sfx.bear();let a=Math.PI+Ui*Ue;await this._anim(560,l=>{let c=l<.6?El(l/.6)*1.14:1.14-(l-.6)/.4*.14;this.scene.bear.group.scale.setScalar(re(c,.001,1.15)),this.scene.bear.group.rotation.y=a+Math.sin(l*Math.PI*2)*.06}),this.scene.bear.group.scale.setScalar(1),this.scene.bear.group.rotation.y=a,this.scene.setBearVisible(!0),this.cellCtx={pieceId:t,square:e},this.holding=!0,this._setPhase("bear")}async _phaseWin(){if(await this.returnToOverview(this._movingPieceId,this._lastSquare),this.reduced){this._setPhase("idle");return}this._setPhase("win"),this.sfx.win(),this.scene.setTargetGlow(null),this.scene.setDim(1),this.scene.requestRender()}async returnToOverview(t,e){let n=this.cellCtx,i=t||n&&n.pieceId||this._movingPieceId,r=e||n&&n.square||this._lastSquare||(i?this._squareOf(i):null);this.cellCtx=null,this.holding=!1,this.scene.lockProbeId=null,this.scene.setStreaks(!1),this.scene.setFlyMode(!1),this.scene.setTargetGlow(null),this.scene.setBearVisible(!1),this.scene.bear.group.scale.setScalar(.001),this.scene.setStageVisible(!1),this.scene.setStageRise(0),this.scene.setDim(1),this._setPhase("return"),this.targetSquare=null;let o=this.scene.boardPose(),a=Tl(o.theta,0),l=this.scene.rig.snapshotTarget(),c=this._overview();if(this.scene.reduced||await this._anim(700,h=>{let u=fs(re(h,0,1));this.scene.applyPose({theta:o.theta+a*u,tx:o.tx*(1-u),tz:o.tz*(1-u)});let d=this.scene.rig.state;d.center.lerpVectors(l.center,c.center,u),d.nx=oe(l.nx,c.nx,u),d.ny=oe(l.ny,c.ny,u),d.radius=oe(l.radius,c.radius,u),d.elev=oe(l.elev,c.elev,u),d.azim=oe(l.azim,c.azim,u),d.fov=oe(l.fov,c.fov,u),this.scene.rig.apply()}),this.scene.applyPose({theta:0,tx:0,tz:0}),i&&r&&this.scene.setPlaneToSquare(i,r),this.scene.setDieVisible(!0),this.scene.rig.snap(this._overview()),this._setPhase("idle"),this._fitPending){this._fitPending=!1;try{this.handleResize()}catch(h){}}}debug(){return{phase:this.phase,busy:this.busy,holding:this.holding,reduced:this.reduced,target:this.targetSquare,lastSquare:this._lastSquare,cell:this.cellCtx?{...this.cellCtx}:null,movingPiece:this._movingPieceId,die:this.scene&&this.scene.dieDebug?this.scene.dieDebug():null}}dispose(){this._queue=Promise.resolve(),this.busy=!1,this.holding=!1,this.cellCtx=null,this.scene=null,this.host=null}};var Nx=["data-3d-phase","data-3d-ready","data-3d-reduced","data-3d-theme","data-3d-mode","data-3d-fallback","data-3d-zoom","data-3d-zoom-value","data-3d-zoom-lock"],se=null;function co(){return typeof window!="undefined"?window:typeof globalThis!="undefined"?globalThis:null}function Df(s){if(s&&ls[s])return s;try{let t=co()&&co().App,e=t&&t.Themes&&t.Themes.get?t.Themes.get():null;if(e&&ls[e])return e}catch(t){}return"cloud"}function Ox(){try{let t=document.createElement("canvas").getContext("webgl2");if(!t)return!1;let e=t.getExtension("WEBGL_lose_context");return e&&e.loseContext(),!0}catch(s){return!1}}var kh=class{constructor(t,e){this.host=t,this.opts=e||{},this.reduced=!!this.opts.reduced,this.theme=Df(this.opts.theme),this.mode=this.opts.mode==="long"?"long":"quick",this.state=null,this.view=null,this.pending=null,this._busy=!1,this._dieValue=1,this.scene=null,this.director=null,this.layer=null,this.canvas=null,this.ready=!1,this._hostPositionSet=!1,this._hostOldPosition="",this._refitTimer=0,this._zoomPumpUntil=0}async init(){let t=this.host,e=document.createElement("div");e.className="board3d-layer",e.setAttribute("data-test","board3d-layer"),e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;";let n=window.getComputedStyle?window.getComputedStyle(t):null;n&&n.position==="static"&&(this._hostOldPosition=t.style.position||"",t.style.position="relative",this._hostPositionSet=!0);let i=document.createElement("canvas");return i.className="board3d-canvas",i.setAttribute("data-test","board3d-canvas"),i.setAttribute("aria-hidden","true"),i.style.cssText="position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none;",e.appendChild(i),t.appendChild(e),t.removeAttribute("data-3d-fallback"),this.layer=e,this.canvas=i,this.scene=new kl(t,i,{reduced:this.reduced,theme:this.theme,quality:this.opts.quality||void 0,shadows:this.opts.shadows!==!1,adapt:this.opts.adapt!==!1}),this.scene.rig&&this.scene.rig.setZoomReduced(this.reduced),this.scene.onReady=()=>this._onReady(),this.scene.ready&&this._onReady(),this.director=new Gl(this.scene,{host:t,reduced:this.reduced,sound:!!this.opts.sound,stageAim:this.opts.stageAim||{nx:0,ny:.15}}),this._hookZoomPhase(),this.scene.onResize=()=>{this.director&&this.director.handleResize(),this._fitNeeded=!0,this._fitTimer&&clearTimeout(this._fitTimer),this._fitTimer=setTimeout(()=>{this._fitTimer=0,this.director&&this.director.handleResize()},450)},this._sizeW=0,this._sizeH=0,this._fitNeeded=!1,this._sizeTimer=setInterval(()=>{if(!this.scene||!this.director)return;let r=t.clientWidth,o=t.clientHeight;if(!r||!o)return;(r!==this._sizeW||o!==this._sizeH)&&(this._sizeW=r,this._sizeH=o,this.scene.resize(),this._fitNeeded=!0),(this._fitNeeded||this.director._fitPending)&&!this.director.busy&&!this.director.holding&&(this._fitNeeded=!1,this.director.handleResize())},350),typeof requestAnimationFrame=="function"&&requestAnimationFrame(()=>{if(this.scene){this.scene.resize();try{this.director.handleResize()}catch(r){}}}),t.setAttribute("data-3d-reduced",this.reduced?"1":"0"),t.setAttribute("data-3d-theme",this.theme),t.setAttribute("data-3d-mode",this.mode),t.setAttribute("data-3d-phase","idle"),this._syncZoomHost(),this.opts.state?this.setState(this.opts.state,this.opts.view):this._applyDefaultPieces(),this}_onReady(){this.ready||(this.ready=!0,this.host.setAttribute("data-3d-ready","1"))}_viewFor(t){if(!t)return null;try{let e=co()&&co().App;if(e&&e.Flight&&e.Flight.view)return e.Flight.view(t,{reduced:this.reduced})}catch(e){}return null}_pieces(t){return(t&&t.pieces||[]).map(e=>({id:e.id,color:e.color||"red",playerId:e.playerId||String(e.id).charAt(0),squareId:e.squareId||"hangar:red:0",arrived:!!e.arrived,stackGroupId:e.stackGroupId||null}))}_dieOf(t){if(!t)return this._dieValue||1;if(t.rollContext&&t.rollContext.die)return t.rollContext.die;let e=t.awaiting;if(e&&e.type==="choose-piece"&&e.die)return e.die;let n=t.log||[];for(let i=n.length-1;i>=0;i--)if(n[i]&&n[i].kind==="roll"&&n[i].die)return n[i].die;return this._dieValue||1}_applyDefaultPieces(){let t=[{id:"a:0",color:"red",playerId:"a",squareId:"hangar:red:0"},{id:"a:1",color:"red",playerId:"a",squareId:"hangar:red:1"},{id:"b:0",color:"yellow",playerId:"b",squareId:"hangar:yellow:0"},{id:"b:1",color:"yellow",playerId:"b",squareId:"hangar:yellow:1"}];this.scene&&(this.scene.setPieces(this.mode==="long"?t.concat([{id:"a:2",color:"red",playerId:"a",squareId:"hangar:red:2"},{id:"a:3",color:"red",playerId:"a",squareId:"hangar:red:3"},{id:"b:2",color:"yellow",playerId:"b",squareId:"hangar:yellow:2"},{id:"b:3",color:"yellow",playerId:"b",squareId:"hangar:yellow:3"}]):t,"a",{a:"red",b:"yellow"}),this.scene.placeDie(1))}setState(t,e){if(!t)return this._applyDefaultPieces(),!1;this.state=t,this.view=e||this._viewFor(t),this.director&&this.director.setState(t,e||this.view);let n=this._pieces(t),i=t.turn==="b"?"b":"a",r=t.colors||{a:"red",b:"yellow"},o=this._dieOf(t);if(this._dieValue=o,!this.scene)return!1;let a=this.view&&this.view.meta?this.view.meta.heat:t.meta?t.meta.heat:0;return this.scene.applyHeat(a),this.scene.applyTurn(i,r),this.scene.placeDie(o),this._busy||this.director&&this.director.holding?this.pending={pieces:n,turn:i,colors:r}:(this.scene.setPieces(n,i,r),this.pending=null),!0}_flushPending(){if(!this.pending||!this.scene||this.director&&this.director.holding)return;let t=this.pending;this.pending=null,this.scene.setPieces(t.pieces,t.turn,t.colors)}play(t,e){if(!this.director)return Promise.resolve();this._busy=!0;let n=()=>{this._busy=!1,(!this.director||!this.director.holding)&&this._flushPending()},i=this.director.play(t,e);return i.then(n,n),i}setTheme(t){return this.theme=Df(t),this.scene&&this.scene.applyTheme(this.theme),this.host.setAttribute("data-3d-theme",this.theme),!0}setReduced(t){if(this.reduced=!!t,this.host.setAttribute("data-3d-reduced",this.reduced?"1":"0"),this.director?this.director.setReduced(this.reduced):this.scene&&this.scene.setReduced(this.reduced),this.scene&&this.scene.rig&&(this.scene.rig.setZoomReduced(this.reduced),this._syncZoomHost(),this.reduced))try{this.scene.renderNow()}catch(e){}return!0}setSound(t){return this.director&&this.director.setSound(!!t),!0}skip(){return this.director&&this.director.skip(),!0}_hookZoomPhase(){let t=this.director;if(!t||t.__zoomHooked)return;t.__zoomHooked=!0;let e=t._setPhase.bind(t);t._setPhase=n=>{e(n),this._onPhase(n)},this._onPhase(t.phase)}_onPhase(t){let e=t==="idle"||t==="boot";this.scene&&this.scene.rig&&this.scene.rig.setZoomActive(e),this.host&&this.host.setAttribute("data-3d-zoom-lock",e?"0":"1"),this._syncZoomHost(),e&&this._zoomPump()}_syncZoomHost(){let t=this.scene&&this.scene.rig;if(!t||!this.host||typeof t.zoomInfo!="function")return;let e=t.zoomInfo();this.host.setAttribute("data-3d-zoom",Number(e.target).toFixed(2)),this.host.setAttribute("data-3d-zoom-value",Number(e.value).toFixed(2))}canZoom(){let t=this.director;return!this.ready||!this.scene||!t||this._busy||t.busy||t.holding?!1:t.phase==="idle"||t.phase==="boot"}zoomInfo(){let t=this.scene&&this.scene.rig;if(!t||typeof t.zoomInfo!="function")return null;let e=t.zoomInfo();return e.can=this.canZoom(),e}setZoom(t){if(!this.canZoom()||!this.scene||!this.scene.rig)return!1;let e=this.scene.rig.setZoom(t);return this._zoomChanged(),e}zoomBy(t){if(!this.canZoom()||!this.scene||!this.scene.rig)return!1;let e=this.scene.rig.zoomBy(t);return this._zoomChanged(),e}resetZoom(){if(!this.canZoom()||!this.scene||!this.scene.rig)return!1;let t=this.scene.rig.resetZoom();return this._zoomChanged(),t}_zoomChanged(){if(this._syncZoomHost(),this.reduced)try{this.scene.renderNow()}catch(t){}this._zoomPump(),this._refitTimer&&clearTimeout(this._refitTimer),this._refitTimer=setTimeout(()=>{if(this._refitTimer=0,this._syncZoomHost(),!!this.canZoom()){try{this.director.handleResize()}catch(t){}if(this._syncZoomHost(),this.reduced)try{this.scene.renderNow()}catch(t){}}},160)}_zoomPump(){if(this.reduced||!this.scene)return;let t=typeof performance!="undefined"&&performance.now?performance.now():Date.now();if(t<this._zoomPumpUntil)return;this._zoomPumpUntil=t+700;let e=()=>{if(!this.scene)return;try{this.scene.requestRender()}catch(i){}(typeof performance!="undefined"&&performance.now?performance.now():Date.now())<this._zoomPumpUntil?requestAnimationFrame(e):this._zoomPumpUntil=0};try{requestAnimationFrame(e)}catch(n){this._zoomPumpUntil=0}}returnToOverview(){if(!this.director)return Promise.resolve(!1);let t=this.director;return t.returnToOverview().then(()=>(t.holding||this._flushPending(),!0),()=>!1)}unmount(){if(this._fitTimer&&(clearTimeout(this._fitTimer),this._fitTimer=0),this._refitTimer&&(clearTimeout(this._refitTimer),this._refitTimer=0),this._sizeTimer&&(clearInterval(this._sizeTimer),this._sizeTimer=0),this.director){try{this.director.dispose()}catch(t){}this.director=null}if(this.scene){try{this.scene.dispose()}catch(t){}this.scene=null}return this.layer&&this.layer.parentNode&&this.layer.parentNode.removeChild(this.layer),this.layer=null,this.canvas=null,this._hostPositionSet&&(this.host.style.position=this._hostOldPosition,this._hostPositionSet=!1),Nx.forEach(t=>this.host.removeAttribute(t)),!0}_debug(){let t=this.director?this.director.debug():{},e=this.scene?this.scene.debugSnapshot():{},n=e.current||null,i=this.scene&&this.scene.rig,r=i&&typeof i.zoomInfo=="function"?i.zoomInfo():{value:1,target:1,min:.8,max:1.5,active:!0,instant:!1,radiusFactor:1};return r.can=this.canZoom(),{version:_l,ready:!!this.ready,mounted:!0,phase:t.phase||e.phase||"boot",zoom:r,pieces:this._pieces(this.state).map(o=>({id:o.id,color:o.color,playerId:o.playerId,squareId:o.squareId,arrived:o.arrived})),target:t.target!=null?t.target:this.director?this.director._lastSquare:null,fps:n?n.fps:0,drawCalls:e.render?e.render.calls:0,triangles:e.render?e.render.triangles:0,dpr:e.dpr||0,quality:e.quality||"high",reduced:this.reduced,theme:this.theme,heat:this.scene?this.scene.heat:0,turn:this.scene?this.scene.turn:null,mode:this.mode,busy:!!t.busy,holding:!!t.holding,cell:t.cell||null,probe:e.probe||null,perf:e,three:"180"}}};async function Bx(s,t){if(!s||typeof document=="undefined")return null;if(se){try{se.unmount()}catch(n){}se=null}if(!Ox()){try{s.setAttribute("data-3d-fallback","no-webgl2")}catch(n){}return null}let e=null;try{return e=new kh(s,t||{}),await e.init(),se=e,e}catch(n){console.warn("[board3d] mount failed:",n&&n.message?n.message:n);try{e&&e.unmount()}catch(i){}try{s.setAttribute("data-3d-fallback","mount-failed")}catch(i){}return null}}var Lf={version:_l,get mounted(){return!!se},get threeRevision(){return"180"},mount:Bx,setState(s,t){return se?se.setState(s,t):!1},play(s,t){return se?se.play(s,t):Promise.resolve()},setTheme(s){return se?se.setTheme(s):!1},setReduced(s){return se?se.setReduced(s):!1},setSound(s){return se?se.setSound(s):!1},skip(){return se?se.skip():!1},canZoom(){return se?se.canZoom():!1},setZoom(s){return se?se.setZoom(s):!1},zoomBy(s){return se?se.zoomBy(s):!1},resetZoom(){return se?se.resetZoom():!1},zoomInfo(){return se?se.zoomInfo():null},returnToOverview(){return se?se.returnToOverview():Promise.resolve(!1)},unmount(){if(!se)return!1;try{se.unmount()}catch(s){}return se=null,!0},_debug(){return se?se._debug():{version:_l,ready:!1,mounted:!1,phase:"boot",pieces:[],target:null,fps:0,drawCalls:0}},_current(){return se}},Vl=co();Vl&&(Vl.App=Vl.App||{},Vl.App.Board3D=Lf);var dS=Lf;})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
