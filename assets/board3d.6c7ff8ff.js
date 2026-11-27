/*! v8-board3d min:1 */
(()=>{var Iu=0,qc=1,Du=2;var Yc=1,Ra=2,qn=3,ui=0,qe=1,Ue=2,xi=0,di=1,Ye=2,Zc=3,$c=4,Lu=5,Pi=100,Fu=101,Uu=102,Nu=103,Ou=104,Bu=200,zu=201,Hu=202,ku=203,Jo=204,Ko=205,Gu=206,Vu=207,Wu=208,Xu=209,qu=210,Yu=211,Zu=212,$u=213,Ju=214,Ca=0,Pa=1,Ia=2,Ki=3,Da=4,La=5,Fa=6,Ua=7,Jc=0,Ku=1,Qu=2,yi=0,ju=1,td=2,ed=3,Na=4,nd=5,id=6,sd=7;var Kc=300,os=301,as=302,Oa=303,Ba=304,co=306,fi=1e3,Ci=1001,Qo=1002,on=1003,rd=1004;var ho=1005;var mn=1006,za=1007;var Yn=1008;var On=1009,Qc=1010,jc=1011,Qs=1012,Ha=1013,Ni=1014,Bn=1015,js=1016,ka=1017,Ga=1018,tr=1020,th=35902,eh=35899,nh=1021,ih=1022,wn=1023,Vs=1026,er=1027,Va=1028,Wa=1029,sh=1030,Xa=1031;var qa=1033,uo=33776,fo=33777,po=33778,mo=33779,Ya=35840,Za=35841,$a=35842,Ja=35843,Ka=36196,Qa=37492,ja=37496,tl=37808,el=37809,nl=37810,il=37811,sl=37812,rl=37813,ol=37814,al=37815,ll=37816,cl=37817,hl=37818,ul=37819,dl=37820,fl=37821,pl=36492,ml=36494,gl=36495,_l=36283,xl=36284,yl=36285,vl=36286;var Lr=2300,jo=2301,$o=2302,Fc=2400,Uc=2401,Nc=2402;var od=3200,ad=3201;var rh=0,ld=1,zn="",Ve="srgb",Qi="srgb-linear",Fr="linear",ge="srgb";var Ji=7680;var Oc=519,cd=512,hd=513,ud=514,oh=515,dd=516,fd=517,pd=518,md=519,ta=35044,Ml=35048;var ah="300 es",Fn=2e3,Ur=2001;var pi=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},Je=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var rc=Math.PI/180,ea=180/Math.PI;function ci(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Je[s&255]+Je[s>>8&255]+Je[s>>16&255]+Je[s>>24&255]+"-"+Je[t&255]+Je[t>>8&255]+"-"+Je[t>>16&15|64]+Je[t>>24&255]+"-"+Je[e&63|128]+Je[e>>8&255]+"-"+Je[e>>16&255]+Je[e>>24&255]+Je[n&255]+Je[n>>8&255]+Je[n>>16&255]+Je[n>>24&255]).toLowerCase()}function ie(s,t,e){return Math.max(t,Math.min(e,s))}function kf(s,t){return(s%t+t)%t}function oc(s,t,e){return(1-e)*s+e*t}function kn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function xe(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var ot=class s{constructor(t=0,e=0){s.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ie(this.x,t.x,e.x),this.y=ie(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ie(this.x,t,e),this.y=ie(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ie(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ie=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==g){let m=1-a,p=l*d+c*f+h*g+u*_,M=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){let T=Math.sqrt(S),A=Math.atan2(T,p*M);m=Math.sin(m*A)/T,a=Math.sin(a*A)/T}let x=a*M;if(l=l*m+d*x,c=c*m+f*x,h=h*m+g*x,u=u*m+_*x,m===1-a){let T=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=T,c*=T,h*=T,u*=T}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){let a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-a*f,t[e+2]=c*g+h*f+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),d=l(n/2),f=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ie(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,i=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R=class s{constructor(t=0,e=0,n=0){s.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(eu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(eu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ie(this.x,t.x,e.x),this.y=ie(this.y,t.y,e.y),this.z=ie(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ie(this.x,t,e),this.y=ie(this.y,t,e),this.z=ie(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ie(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ac.copy(this).projectOnVector(t),this.sub(ac)}reflect(t){return this.sub(ac.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ac=new R,eu=new Ie,Qt=class s{constructor(t,e,n,i,r,o,a,l,c){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=i[0],m=i[3],p=i[6],M=i[1],S=i[4],x=i[7],T=i[2],A=i[5],P=i[8];return r[0]=o*_+a*M+l*T,r[3]=o*m+a*S+l*A,r[6]=o*p+a*x+l*P,r[1]=c*_+h*M+u*T,r[4]=c*m+h*S+u*A,r[7]=c*p+h*x+u*P,r[2]=d*_+f*M+g*T,r[5]=d*m+f*S+g*A,r[8]=d*p+f*x+g*P,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=e*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=u*_,t[1]=(i*c-h*n)*_,t[2]=(a*n-i*o)*_,t[3]=d*_,t[4]=(h*e-i*l)*_,t[5]=(i*r-a*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(lc.makeScale(t,e)),this}rotate(t){return this.premultiply(lc.makeRotation(-t)),this}translate(t,e){return this.premultiply(lc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},lc=new Qt;function lh(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Nr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function gd(){let s=Nr("canvas");return s.style.display="block",s}var nu={};function Ws(s){s in nu||(nu[s]=!0,console.warn(s))}function _d(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var iu=new Qt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),su=new Qt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Gf(){let s={enabled:!0,workingColorSpace:Qi,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ge&&(i.r=hi(i.r),i.g=hi(i.g),i.b=hi(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ge&&(i.r=Gs(i.r),i.g=Gs(i.g),i.b=Gs(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===zn?Fr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Ws("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Ws("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Qi]:{primaries:t,whitePoint:n,transfer:Fr,toXYZ:iu,fromXYZ:su,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ve},outputColorSpaceConfig:{drawingBufferColorSpace:Ve}},[Ve]:{primaries:t,whitePoint:n,transfer:ge,toXYZ:iu,fromXYZ:su,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ve}}}),s}var le=Gf();function hi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Gs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var Ts,na=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement=="undefined")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ts===void 0&&(Ts=Nr("canvas")),Ts.width=t.width,Ts.height=t.height;let i=Ts.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=Ts}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement!="undefined"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&t instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&t instanceof ImageBitmap){let e=Nr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=hi(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(hi(e[n]/255)*255):e[n]=hi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Vf=0,Xs=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=ci(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement!="undefined"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(cc(i[o].image)):r.push(cc(i[o]))}else r=cc(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function cc(s){return typeof HTMLImageElement!="undefined"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&s instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&s instanceof ImageBitmap?na.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Wf=0,hc=new R,nn=class s extends pi{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=Ci,i=Ci,r=mn,o=Yn,a=wn,l=On,c=s.DEFAULT_ANISOTROPY,h=zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=ci(),this.name="",this.source=new Xs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(hc).x}get height(){return this.source.getSize(hc).y}get depth(){return this.source.getSize(hc).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Kc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case fi:t.x=t.x-Math.floor(t.x);break;case Ci:t.x=t.x<0?0:1;break;case Qo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case fi:t.y=t.y-Math.floor(t.y);break;case Ci:t.y=t.y<0?0:1;break;case Qo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};nn.DEFAULT_IMAGE=null;nn.DEFAULT_MAPPING=Kc;nn.DEFAULT_ANISOTROPY=1;var pe=class s{constructor(t=0,e=0,n=0,i=1){s.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let S=(c+1)/2,x=(f+1)/2,T=(p+1)/2,A=(h+d)/4,P=(u+_)/4,C=(g+m)/4;return S>x&&S>T?S<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(S),i=A/n,r=P/n):x>T?x<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(x),n=A/i,r=C/i):T<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=P/r,i=C/r),this.set(n,i,r,e),this}let M=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-_)/M,this.z=(d-h)/M,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ie(this.x,t.x,e.x),this.y=ie(this.y,t.y,e.y),this.z=ie(this.z,t.z,e.z),this.w=ie(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ie(this.x,t,e),this.y=ie(this.y,t,e),this.z=ie(this.z,t,e),this.w=ie(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ie(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ia=class extends pi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:mn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new pe(0,0,t,e),this.scissorTest=!1,this.viewport=new pe(0,0,t,e);let i={width:t,height:e,depth:n.depth},r=new nn(i);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:mn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new Xs(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Vn=class extends ia{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Or=class extends nn{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=on,this.minFilter=on,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var sa=class extends nn{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=on,this.minFilter=on,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Wn=class{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(In.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(In.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=In.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,In):In.fromBufferAttribute(r,o),In.applyMatrix4(t.matrixWorld),this.expandByPoint(In);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),So.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),So.copy(n.boundingBox)),So.applyMatrix4(t.matrixWorld),this.union(So)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,In),In.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(vr),bo.subVectors(this.max,vr),ws.subVectors(t.a,vr),As.subVectors(t.b,vr),Rs.subVectors(t.c,vr),bi.subVectors(As,ws),Ei.subVectors(Rs,As),qi.subVectors(ws,Rs);let e=[0,-bi.z,bi.y,0,-Ei.z,Ei.y,0,-qi.z,qi.y,bi.z,0,-bi.x,Ei.z,0,-Ei.x,qi.z,0,-qi.x,-bi.y,bi.x,0,-Ei.y,Ei.x,0,-qi.y,qi.x,0];return!uc(e,ws,As,Rs,bo)||(e=[1,0,0,0,1,0,0,0,1],!uc(e,ws,As,Rs,bo))?!1:(Eo.crossVectors(bi,Ei),e=[Eo.x,Eo.y,Eo.z],uc(e,ws,As,Rs,bo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,In).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(In).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ii),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},ii=[new R,new R,new R,new R,new R,new R,new R,new R],In=new R,So=new Wn,ws=new R,As=new R,Rs=new R,bi=new R,Ei=new R,qi=new R,vr=new R,bo=new R,Eo=new R,Yi=new R;function uc(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Yi.fromArray(s,r);let a=i.x*Math.abs(Yi.x)+i.y*Math.abs(Yi.y)+i.z*Math.abs(Yi.z),l=t.dot(Yi),c=e.dot(Yi),h=n.dot(Yi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Xf=new Wn,Mr=new R,dc=new R,mi=class{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Xf.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Mr.subVectors(t,this.center);let e=Mr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Mr,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(dc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Mr.copy(t.center).add(dc)),this.expandByPoint(Mr.copy(t.center).sub(dc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},si=new R,fc=new R,To=new R,Ti=new R,pc=new R,wo=new R,mc=new R,Br=class{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,si)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=si.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(si.copy(this.origin).addScaledVector(this.direction,e),si.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){fc.copy(t).add(e).multiplyScalar(.5),To.copy(e).sub(t).normalize(),Ti.copy(this.origin).sub(fc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(To),a=Ti.dot(this.direction),l=-Ti.dot(To),c=Ti.lengthSq(),h=Math.abs(1-o*o),u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(fc).addScaledVector(To,d),f}intersectSphere(t,e){si.subVectors(t.center,this.origin);let n=si.dot(this.direction),i=si.dot(si)-n*n,r=t.radius*t.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,si)!==null}intersectTriangle(t,e,n,i,r){pc.subVectors(e,t),wo.subVectors(n,t),mc.crossVectors(pc,wo);let o=this.direction.dot(mc),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ti.subVectors(this.origin,t);let l=a*this.direction.dot(wo.crossVectors(Ti,wo));if(l<0)return null;let c=a*this.direction.dot(pc.cross(Ti));if(c<0||l+c>o)return null;let h=-a*Ti.dot(mc);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Vt=class s{constructor(t,e,n,i,r,o,a,l,c,h,u,d,f,g,_,m){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,u,d,f,g,_,m)}set(t,e,n,i,r,o,a,l,c,h,u,d,f,g,_,m){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,i=1/Cs.setFromMatrixColumn(t,0).length(),r=1/Cs.setFromMatrixColumn(t,1).length(),o=1/Cs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-a*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){let d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d+_*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=_+d*a,e[10]=o*l}else if(t.order==="ZXY"){let d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d-_*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=_-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let d=o*h,f=o*u,g=a*h,_=a*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){let d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(qf,t,Yf)}lookAt(t,e,n){let i=this.elements;return fn.subVectors(t,e),fn.lengthSq()===0&&(fn.z=1),fn.normalize(),wi.crossVectors(n,fn),wi.lengthSq()===0&&(Math.abs(n.z)===1?fn.x+=1e-4:fn.z+=1e-4,fn.normalize(),wi.crossVectors(n,fn)),wi.normalize(),Ao.crossVectors(fn,wi),i[0]=wi.x,i[4]=Ao.x,i[8]=fn.x,i[1]=wi.y,i[5]=Ao.y,i[9]=fn.y,i[2]=wi.z,i[6]=Ao.z,i[10]=fn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],M=n[3],S=n[7],x=n[11],T=n[15],A=i[0],P=i[4],C=i[8],b=i[12],v=i[1],I=i[5],F=i[9],N=i[13],G=i[2],H=i[6],V=i[10],$=i[14],U=i[3],tt=i[7],lt=i[11],st=i[15];return r[0]=o*A+a*v+l*G+c*U,r[4]=o*P+a*I+l*H+c*tt,r[8]=o*C+a*F+l*V+c*lt,r[12]=o*b+a*N+l*$+c*st,r[1]=h*A+u*v+d*G+f*U,r[5]=h*P+u*I+d*H+f*tt,r[9]=h*C+u*F+d*V+f*lt,r[13]=h*b+u*N+d*$+f*st,r[2]=g*A+_*v+m*G+p*U,r[6]=g*P+_*I+m*H+p*tt,r[10]=g*C+_*F+m*V+p*lt,r[14]=g*b+_*N+m*$+p*st,r[3]=M*A+S*v+x*G+T*U,r[7]=M*P+S*I+x*H+T*tt,r[11]=M*C+S*F+x*V+T*lt,r[15]=M*b+S*N+x*$+T*st,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*l*u-i*c*u-r*a*d+n*c*d+i*a*f-n*l*f)+_*(+e*l*f-e*c*d+r*o*d-i*o*f+i*c*h-r*l*h)+m*(+e*c*u-e*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-i*a*h-e*l*u+e*a*d+i*o*u-n*o*d+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],M=u*m*c-_*d*c+_*l*f-a*m*f-u*l*p+a*d*p,S=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,x=h*_*c-g*u*c+g*a*f-o*_*f-h*a*p+o*u*p,T=g*u*l-h*_*l-g*a*d+o*_*d+h*a*m-o*u*m,A=e*M+n*S+i*x+r*T;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let P=1/A;return t[0]=M*P,t[1]=(_*d*r-u*m*r-_*i*f+n*m*f+u*i*p-n*d*p)*P,t[2]=(a*m*r-_*l*r+_*i*c-n*m*c-a*i*p+n*l*p)*P,t[3]=(u*l*r-a*d*r-u*i*c+n*d*c+a*i*f-n*l*f)*P,t[4]=S*P,t[5]=(h*m*r-g*d*r+g*i*f-e*m*f-h*i*p+e*d*p)*P,t[6]=(g*l*r-o*m*r-g*i*c+e*m*c+o*i*p-e*l*p)*P,t[7]=(o*d*r-h*l*r+h*i*c-e*d*c-o*i*f+e*l*f)*P,t[8]=x*P,t[9]=(g*u*r-h*_*r-g*n*f+e*_*f+h*n*p-e*u*p)*P,t[10]=(o*_*r-g*a*r+g*n*c-e*_*c-o*n*p+e*a*p)*P,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*f-e*a*f)*P,t[12]=T*P,t[13]=(h*_*i-g*u*i+g*n*d-e*_*d-h*n*m+e*u*m)*P,t[14]=(g*a*i-o*_*i-g*n*l+e*_*l+o*n*m-e*a*m)*P,t[15]=(o*u*i-h*a*i+h*n*l-e*u*l-o*n*d+e*a*d)*P,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,_=o*h,m=o*u,p=a*u,M=l*c,S=l*h,x=l*u,T=n.x,A=n.y,P=n.z;return i[0]=(1-(_+p))*T,i[1]=(f+x)*T,i[2]=(g-S)*T,i[3]=0,i[4]=(f-x)*A,i[5]=(1-(d+p))*A,i[6]=(m+M)*A,i[7]=0,i[8]=(g+S)*P,i[9]=(m-M)*P,i[10]=(1-(d+_))*P,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements,r=Cs.set(i[0],i[1],i[2]).length(),o=Cs.set(i[4],i[5],i[6]).length(),a=Cs.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],Dn.copy(this);let c=1/r,h=1/o,u=1/a;return Dn.elements[0]*=c,Dn.elements[1]*=c,Dn.elements[2]*=c,Dn.elements[4]*=h,Dn.elements[5]*=h,Dn.elements[6]*=h,Dn.elements[8]*=u,Dn.elements[9]*=u,Dn.elements[10]*=u,e.setFromRotationMatrix(Dn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=Fn,l=!1){let c=this.elements,h=2*r/(e-t),u=2*r/(n-i),d=(e+t)/(e-t),f=(n+i)/(n-i),g,_;if(l)g=r/(o-r),_=o*r/(o-r);else if(a===Fn)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Ur)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Fn,l=!1){let c=this.elements,h=2/(e-t),u=2/(n-i),d=-(e+t)/(e-t),f=-(n+i)/(n-i),g,_;if(l)g=1/(o-r),_=o/(o-r);else if(a===Fn)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===Ur)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Cs=new R,Dn=new Vt,qf=new R(0,0,0),Yf=new R(1,1,1),wi=new R,Ao=new R,fn=new R,ru=new Vt,ou=new Ie,gn=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(ie(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ie(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ie(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ie(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ie(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ie(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ru.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ru,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ou.setFromEuler(this),this.setFromQuaternion(ou,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};gn.DEFAULT_ORDER="XYZ";var zr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Zf=0,au=new R,Ps=new Ie,ri=new Vt,Ro=new R,Sr=new R,$f=new R,Jf=new Ie,lu=new R(1,0,0),cu=new R(0,1,0),hu=new R(0,0,1),uu={type:"added"},Kf={type:"removed"},Is={type:"childadded",child:null},gc={type:"childremoved",child:null},be=class s extends pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new R,e=new gn,n=new Ie,i=new R(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Vt},normalMatrix:{value:new Qt}}),this.matrix=new Vt,this.matrixWorld=new Vt,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ps.setFromAxisAngle(t,e),this.quaternion.multiply(Ps),this}rotateOnWorldAxis(t,e){return Ps.setFromAxisAngle(t,e),this.quaternion.premultiply(Ps),this}rotateX(t){return this.rotateOnAxis(lu,t)}rotateY(t){return this.rotateOnAxis(cu,t)}rotateZ(t){return this.rotateOnAxis(hu,t)}translateOnAxis(t,e){return au.copy(t).applyQuaternion(this.quaternion),this.position.add(au.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(lu,t)}translateY(t){return this.translateOnAxis(cu,t)}translateZ(t){return this.translateOnAxis(hu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ri.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ro.copy(t):Ro.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Sr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ri.lookAt(Sr,Ro,this.up):ri.lookAt(Ro,Sr,this.up),this.quaternion.setFromRotationMatrix(ri),i&&(ri.extractRotation(i.matrixWorld),Ps.setFromRotationMatrix(ri),this.quaternion.premultiply(Ps.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(uu),Is.child=t,this.dispatchEvent(Is),Is.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Kf),gc.child=t,this.dispatchEvent(gc),gc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ri.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ri.multiply(t.parent.matrixWorld)),t.applyMatrix4(ri),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(uu),Is.child=t,this.dispatchEvent(Is),Is.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Sr,t,$f),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Sr,Jf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}};be.DEFAULT_UP=new R(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ln=new R,oi=new R,_c=new R,ai=new R,Ds=new R,Ls=new R,du=new R,xc=new R,yc=new R,vc=new R,Mc=new pe,Sc=new pe,bc=new pe,li=class s{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Ln.subVectors(t,e),i.cross(Ln);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Ln.subVectors(i,e),oi.subVectors(n,e),_c.subVectors(t,e);let o=Ln.dot(Ln),a=Ln.dot(oi),l=Ln.dot(_c),c=oi.dot(oi),h=oi.dot(_c),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,ai)===null?!1:ai.x>=0&&ai.y>=0&&ai.x+ai.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,ai)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ai.x),l.addScaledVector(o,ai.y),l.addScaledVector(a,ai.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return Mc.setScalar(0),Sc.setScalar(0),bc.setScalar(0),Mc.fromBufferAttribute(t,e),Sc.fromBufferAttribute(t,n),bc.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(Mc,r.x),o.addScaledVector(Sc,r.y),o.addScaledVector(bc,r.z),o}static isFrontFacing(t,e,n,i){return Ln.subVectors(n,e),oi.subVectors(t,e),Ln.cross(oi).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ln.subVectors(this.c,this.b),oi.subVectors(this.a,this.b),Ln.cross(oi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,o,a;Ds.subVectors(i,n),Ls.subVectors(r,n),xc.subVectors(t,n);let l=Ds.dot(xc),c=Ls.dot(xc);if(l<=0&&c<=0)return e.copy(n);yc.subVectors(t,i);let h=Ds.dot(yc),u=Ls.dot(yc);if(h>=0&&u<=h)return e.copy(i);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Ds,o);vc.subVectors(t,r);let f=Ds.dot(vc),g=Ls.dot(vc);if(g>=0&&f<=g)return e.copy(r);let _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Ls,a);let m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return du.subVectors(r,i),a=(u-h)/(u-h+(f-g)),e.copy(i).addScaledVector(du,a);let p=1/(m+_+d);return o=_*p,a=d*p,e.copy(n).addScaledVector(Ds,o).addScaledVector(Ls,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},xd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ai={h:0,s:0,l:0},Co={h:0,s:0,l:0};function Ec(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var Bt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ve){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,le.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=le.workingColorSpace){return this.r=t,this.g=e,this.b=n,le.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=le.workingColorSpace){if(t=kf(t,1),e=ie(e,0,1),n=ie(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Ec(o,r,t+1/3),this.g=Ec(o,r,t),this.b=Ec(o,r,t-1/3)}return le.colorSpaceToWorking(this,i),this}setStyle(t,e=Ve){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ve){let n=xd[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=hi(t.r),this.g=hi(t.g),this.b=hi(t.b),this}copyLinearToSRGB(t){return this.r=Gs(t.r),this.g=Gs(t.g),this.b=Gs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ve){return le.workingToColorSpace(Ke.copy(this),t),Math.round(ie(Ke.r*255,0,255))*65536+Math.round(ie(Ke.g*255,0,255))*256+Math.round(ie(Ke.b*255,0,255))}getHexString(t=Ve){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=le.workingColorSpace){le.workingToColorSpace(Ke.copy(this),e);let n=Ke.r,i=Ke.g,r=Ke.b,o=Math.max(n,i,r),a=Math.min(n,i,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=le.workingColorSpace){return le.workingToColorSpace(Ke.copy(this),e),t.r=Ke.r,t.g=Ke.g,t.b=Ke.b,t}getStyle(t=Ve){le.workingToColorSpace(Ke.copy(this),t);let e=Ke.r,n=Ke.g,i=Ke.b;return t!==Ve?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Ai),this.setHSL(Ai.h+t,Ai.s+e,Ai.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ai),t.getHSL(Co);let n=oc(Ai.h,Co.h,e),i=oc(Ai.s,Co.s,e),r=oc(Ai.l,Co.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ke=new Bt;Bt.NAMES=xd;var Qf=0,Xn=class extends pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qf++}),this.uuid=ci(),this.name="",this.type="Material",this.blending=di,this.side=ui,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Jo,this.blendDst=Ko,this.blendEquation=Pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Bt(0,0,0),this.blendAlpha=0,this.depthFunc=Ki,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Oc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ji,this.stencilZFail=Ji,this.stencilZPass=Ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==di&&(n.blending=this.blending),this.side!==ui&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Jo&&(n.blendSrc=this.blendSrc),this.blendDst!==Ko&&(n.blendDst=this.blendDst),this.blendEquation!==Pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ki&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Oc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ji&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ji&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ji&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},ke=class extends Xn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.combine=Jc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Fe=new R,Po=new ot,jf=0,Oe=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ta,this.updateRanges=[],this.gpuType=Bn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Po.fromBufferAttribute(this,e),Po.applyMatrix3(t),this.setXY(e,Po.x,Po.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix3(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix4(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyNormalMatrix(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.transformDirection(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=kn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=xe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=kn(e,this.array)),e}setX(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=kn(e,this.array)),e}setY(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=kn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=kn(e,this.array)),e}setW(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),i=xe(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),i=xe(i,this.array),r=xe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ta&&(t.usage=this.usage),t}};var Hr=class extends Oe{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var kr=class extends Oe{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var $t=class extends Oe{constructor(t,e,n){super(new Float32Array(t),e,n)}},tp=0,En=new Vt,Tc=new be,Fs=new R,pn=new Wn,br=new Wn,He=new R,ve=class s extends pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tp++}),this.uuid=ci(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(lh(t)?kr:Hr)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Qt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return En.makeRotationFromQuaternion(t),this.applyMatrix4(En),this}rotateX(t){return En.makeRotationX(t),this.applyMatrix4(En),this}rotateY(t){return En.makeRotationY(t),this.applyMatrix4(En),this}rotateZ(t){return En.makeRotationZ(t),this.applyMatrix4(En),this}translate(t,e,n){return En.makeTranslation(t,e,n),this.applyMatrix4(En),this}scale(t,e,n){return En.makeScale(t,e,n),this.applyMatrix4(En),this}lookAt(t){return Tc.lookAt(t),Tc.updateMatrix(),this.applyMatrix4(Tc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fs).negate(),this.translate(Fs.x,Fs.y,Fs.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,r=t.length;i<r;i++){let o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new $t(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];pn.setFromBufferAttribute(r),this.morphTargetsRelative?(He.addVectors(this.boundingBox.min,pn.min),this.boundingBox.expandByPoint(He),He.addVectors(this.boundingBox.max,pn.max),this.boundingBox.expandByPoint(He)):(this.boundingBox.expandByPoint(pn.min),this.boundingBox.expandByPoint(pn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){let n=this.boundingSphere.center;if(pn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];br.setFromBufferAttribute(a),this.morphTargetsRelative?(He.addVectors(pn.min,br.min),pn.expandByPoint(He),He.addVectors(pn.max,br.max),pn.expandByPoint(He)):(pn.expandByPoint(br.min),pn.expandByPoint(br.max))}pn.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)He.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(He));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)He.fromBufferAttribute(a,c),l&&(Fs.fromBufferAttribute(t,c),He.add(Fs)),i=Math.max(i,n.distanceToSquared(He))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Oe(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new R,l[C]=new R;let c=new R,h=new R,u=new R,d=new ot,f=new ot,g=new ot,_=new R,m=new R;function p(C,b,v){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,v),d.fromBufferAttribute(r,C),f.fromBufferAttribute(r,b),g.fromBufferAttribute(r,v),h.sub(c),u.sub(c),f.sub(d),g.sub(d);let I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(I),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(I),a[C].add(_),a[b].add(_),a[v].add(_),l[C].add(m),l[b].add(m),l[v].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let C=0,b=M.length;C<b;++C){let v=M[C],I=v.start,F=v.count;for(let N=I,G=I+F;N<G;N+=3)p(t.getX(N+0),t.getX(N+1),t.getX(N+2))}let S=new R,x=new R,T=new R,A=new R;function P(C){T.fromBufferAttribute(i,C),A.copy(T);let b=a[C];S.copy(b),S.sub(T.multiplyScalar(T.dot(b))).normalize(),x.crossVectors(A,b);let I=x.dot(l[C])<0?-1:1;o.setXYZW(C,S.x,S.y,S.z,I)}for(let C=0,b=M.length;C<b;++C){let v=M[C],I=v.start,F=v.count;for(let N=I,G=I+F;N<G;N+=3)P(t.getX(N+0)),P(t.getX(N+1)),P(t.getX(N+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Oe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new R,r=new R,o=new R,a=new R,l=new R,c=new R,h=new R,u=new R;if(t)for(let d=0,f=t.count;d<f;d+=3){let g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)He.fromBufferAttribute(t,e),He.normalize(),t.setXYZ(e,He.x,He.y,He.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new Oe(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},fu=new Vt,Zi=new Br,Io=new mi,pu=new R,Do=new R,Lo=new R,Fo=new R,wc=new R,Uo=new R,mu=new R,No=new R,wt=class extends be{constructor(t=new ve,e=new ke){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(r&&a){Uo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(wc.fromBufferAttribute(u,t),o?Uo.addScaledVector(wc,h):Uo.addScaledVector(wc.sub(e),h))}e.add(Uo)}return e}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Io.copy(n.boundingSphere),Io.applyMatrix4(r),Zi.copy(t.ray).recast(t.near),!(Io.containsPoint(Zi.origin)===!1&&(Zi.intersectSphere(Io,pu)===null||Zi.origin.distanceToSquared(pu)>(t.far-t.near)**2))&&(fu.copy(r).invert(),Zi.copy(t.ray).applyMatrix4(fu),!(n.boundingBox!==null&&Zi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Zi)))}_computeIntersections(t,e,n){let i,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),S=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let x=M,T=S;x<T;x+=3){let A=a.getX(x),P=a.getX(x+1),C=a.getX(x+2);i=Oo(this,p,t,n,c,h,u,A,P,C),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let M=a.getX(m),S=a.getX(m+1),x=a.getX(m+2);i=Oo(this,o,t,n,c,h,u,M,S,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),S=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=M,T=S;x<T;x+=3){let A=x,P=x+1,C=x+2;i=Oo(this,p,t,n,c,h,u,A,P,C),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let M=m,S=m+1,x=m+2;i=Oo(this,o,t,n,c,h,u,M,S,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}};function ep(s,t,e,n,i,r,o,a){let l;if(t.side===qe?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===ui,a),l===null)return null;No.copy(a),No.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(No);return c<e.near||c>e.far?null:{distance:c,point:No.clone(),object:s}}function Oo(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,Do),s.getVertexPosition(l,Lo),s.getVertexPosition(c,Fo);let h=ep(s,t,e,n,Do,Lo,Fo,mu);if(h){let u=new R;li.getBarycoord(mu,Do,Lo,Fo,u),i&&(h.uv=li.getInterpolatedAttribute(i,a,l,c,u,new ot)),r&&(h.uv1=li.getInterpolatedAttribute(r,a,l,c,u,new ot)),o&&(h.normal=li.getInterpolatedAttribute(o,a,l,c,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new R,materialIndex:0};li.getNormal(Do,Lo,Fo,d.normal),h.face=d,h.barycoord=u}return h}var jt=class s extends ve{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new $t(c,3)),this.setAttribute("normal",new $t(h,3)),this.setAttribute("uv",new $t(u,2));function g(_,m,p,M,S,x,T,A,P,C,b){let v=x/P,I=T/C,F=x/2,N=T/2,G=A/2,H=P+1,V=C+1,$=0,U=0,tt=new R;for(let lt=0;lt<V;lt++){let st=lt*I-N;for(let xt=0;xt<H;xt++){let Nt=xt*v-F;tt[_]=Nt*M,tt[m]=st*S,tt[p]=G,c.push(tt.x,tt.y,tt.z),tt[_]=0,tt[m]=0,tt[p]=A>0?1:-1,h.push(tt.x,tt.y,tt.z),u.push(xt/P),u.push(1-lt/C),$+=1}}for(let lt=0;lt<C;lt++)for(let st=0;st<P;st++){let xt=d+st+H*lt,Nt=d+st+H*(lt+1),It=d+(st+1)+H*(lt+1),At=d+(st+1)+H*lt;l.push(xt,Nt,At),l.push(Nt,It,At),U+=6}a.addGroup(f,U,b),f+=U,d+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function ls(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Qe(s){let t={};for(let e=0;e<s.length;e++){let n=ls(s[e]);for(let i in n)t[i]=n[i]}return t}function np(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function ch(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:le.workingColorSpace}var yd={clone:ls,merge:Qe},ip=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,_n=class extends Xn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ip,this.fragmentShader=sp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ls(t.uniforms),this.uniformsGroups=np(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Gr=class extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Vt,this.projectionMatrix=new Vt,this.projectionMatrixInverse=new Vt,this.coordinateSystem=Fn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ri=new R,gu=new ot,_u=new ot,We=class extends Gr{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=ea*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(rc*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ea*2*Math.atan(Math.tan(rc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ri.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ri.x,Ri.y).multiplyScalar(-t/Ri.z),Ri.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ri.x,Ri.y).multiplyScalar(-t/Ri.z)}getViewSize(t,e){return this.getViewBounds(t,gu,_u),e.subVectors(_u,gu)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(rc*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Us=-90,Ns=1,ra=class extends be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new We(Us,Ns,t,e);i.layers=this.layers,this.add(i);let r=new We(Us,Ns,t,e);r.layers=this.layers,this.add(r);let o=new We(Us,Ns,t,e);o.layers=this.layers,this.add(o);let a=new We(Us,Ns,t,e);a.layers=this.layers,this.add(a);let l=new We(Us,Ns,t,e);l.layers=this.layers,this.add(l);let c=new We(Us,Ns,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Fn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ur)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Vr=class extends nn{constructor(t=[],e=os,n,i,r,o,a,l,c,h){super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},oa=class extends Vn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Vr(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new jt(5,5,5),r=new _n({name:"CubemapFromEquirect",uniforms:ls(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qe,blending:xi});r.uniforms.tEquirect.value=e;let o=new wt(i,r),a=e.minFilter;return e.minFilter===Yn&&(e.minFilter=mn),new ra(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}},me=class extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}},rp={type:"move"},qs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new me,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new me,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new me,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(rp)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new me;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Wr=class s{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Bt(t),this.density=e}clone(){return new s(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var ji=class extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gn,this.environmentIntensity=1,this.environmentRotation=new gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},aa=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ta,this.updateRanges=[],this.version=0,this.uuid=ci()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ci()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ci()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},en=new R,Xr=class s{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)en.fromBufferAttribute(this,e),en.applyMatrix4(t),this.setXYZ(e,en.x,en.y,en.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)en.fromBufferAttribute(this,e),en.applyNormalMatrix(t),this.setXYZ(e,en.x,en.y,en.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)en.fromBufferAttribute(this,e),en.transformDirection(t),this.setXYZ(e,en.x,en.y,en.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=kn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=xe(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=xe(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=xe(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=xe(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=xe(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=kn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=kn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=kn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=kn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),i=xe(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),i=xe(i,this.array),r=xe(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Oe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Tn=class extends Xn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Os,Er=new R,Bs=new R,zs=new R,Hs=new ot,Tr=new ot,vd=new Vt,Bo=new R,wr=new R,zo=new R,xu=new ot,Ac=new ot,yu=new ot,Un=class extends be{constructor(t=new Tn){if(super(),this.isSprite=!0,this.type="Sprite",Os===void 0){Os=new ve;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new aa(e,5);Os.setIndex([0,1,2,0,2,3]),Os.setAttribute("position",new Xr(n,3,0,!1)),Os.setAttribute("uv",new Xr(n,2,3,!1))}this.geometry=Os,this.material=t,this.center=new ot(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Bs.setFromMatrixScale(this.matrixWorld),vd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),zs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Bs.multiplyScalar(-zs.z);let n=this.material.rotation,i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));let o=this.center;Ho(Bo.set(-.5,-.5,0),zs,o,Bs,i,r),Ho(wr.set(.5,-.5,0),zs,o,Bs,i,r),Ho(zo.set(.5,.5,0),zs,o,Bs,i,r),xu.set(0,0),Ac.set(1,0),yu.set(1,1);let a=t.ray.intersectTriangle(Bo,wr,zo,!1,Er);if(a===null&&(Ho(wr.set(-.5,.5,0),zs,o,Bs,i,r),Ac.set(0,1),a=t.ray.intersectTriangle(Bo,zo,wr,!1,Er),a===null))return;let l=t.ray.origin.distanceTo(Er);l<t.near||l>t.far||e.push({distance:l,point:Er.clone(),uv:li.getInterpolation(Er,Bo,wr,zo,xu,Ac,yu,new ot),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function Ho(s,t,e,n,i,r){Hs.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(Tr.x=r*Hs.x-i*Hs.y,Tr.y=i*Hs.x+r*Hs.y):Tr.copy(Hs),s.copy(t),s.x+=Tr.x,s.y+=Tr.y,s.applyMatrix4(vd)}var la=class extends nn{constructor(t=null,e=1,n=1,i,r,o,a,l,c=on,h=on,u,d){super(null,o,a,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var qr=class extends Oe{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},ks=new Vt,vu=new Vt,ko=[],Mu=new Wn,op=new Vt,Ar=new wt,Rr=new mi,gi=class extends wt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new qr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,op)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Wn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ks),Mu.copy(t.boundingBox).applyMatrix4(ks),this.boundingBox.union(Mu)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new mi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ks),Rr.copy(t.boundingSphere).applyMatrix4(ks),this.boundingSphere.union(Rr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(Ar.geometry=this.geometry,Ar.material=this.material,Ar.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Rr.copy(this.boundingSphere),Rr.applyMatrix4(n),t.ray.intersectsSphere(Rr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,ks),vu.multiplyMatrices(n,ks),Ar.matrixWorld=vu,Ar.raycast(t,ko);for(let o=0,a=ko.length;o<a;o++){let l=ko[o];l.instanceId=r,l.object=this,e.push(l)}ko.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new qr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new la(new Float32Array(i*this.count),i,this.count,Va,Bn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=i*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Rc=new R,ap=new R,lp=new Qt,Hn=class{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=Rc.subVectors(n,e).cross(ap.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Rc),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||lp.getNormalMatrix(t),i=this.coplanarPoint(Rc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},$i=new mi,cp=new ot(.5,.5),Go=new R,Ys=class{constructor(t=new Hn,e=new Hn,n=new Hn,i=new Hn,r=new Hn,o=new Hn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Fn,n=!1){let i=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],M=r[12],S=r[13],x=r[14],T=r[15];if(i[0].setComponents(c-o,f-h,p-g,T-M).normalize(),i[1].setComponents(c+o,f+h,p+g,T+M).normalize(),i[2].setComponents(c+a,f+u,p+_,T+S).normalize(),i[3].setComponents(c-a,f-u,p-_,T-S).normalize(),n)i[4].setComponents(l,d,m,x).normalize(),i[5].setComponents(c-l,f-d,p-m,T-x).normalize();else if(i[4].setComponents(c-l,f-d,p-m,T-x).normalize(),e===Fn)i[5].setComponents(c+l,f+d,p+m,T+x).normalize();else if(e===Ur)i[5].setComponents(l,d,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),$i.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),$i.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere($i)}intersectsSprite(t){$i.center.set(0,0,0);let e=cp.distanceTo(t.center);return $i.radius=.7071067811865476+e,$i.applyMatrix4(t.matrixWorld),this.intersectsSphere($i)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(Go.x=i.normal.x>0?t.max.x:t.min.x,Go.y=i.normal.y>0?t.max.y:t.min.y,Go.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Go)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ts=class extends Xn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Bt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Su=new Vt,Bc=new Br,Vo=new mi,Wo=new R,Zs=class extends be{constructor(t=new ve,e=new ts){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vo.copy(n.boundingSphere),Vo.applyMatrix4(i),Vo.radius+=r,t.ray.intersectsSphere(Vo)===!1)return;Su.copy(i).invert(),Bc.copy(t.ray).applyMatrix4(Su);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=d,_=f;g<_;g++){let m=c.getX(g);Wo.fromBufferAttribute(u,m),bu(Wo,m,l,i,t,e,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let g=d,_=f;g<_;g++)Wo.fromBufferAttribute(u,g),bu(Wo,g,l,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function bu(s,t,e,n,i,r,o){let a=Bc.distanceSqToPoint(s);if(a<e){let l=new R;Bc.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Yr=class extends nn{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Zr=class extends nn{constructor(t,e,n=Ni,i,r,o,a=on,l=on,c,h=Vs,u=1){if(h!==Vs&&h!==er)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:u};super(d,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Xs(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},$r=class extends nn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},$s=class s extends ve{constructor(t=1,e=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:i,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,g=n*2+r,_=i+1,m=new R,p=new R;for(let M=0;M<=g;M++){let S=0,x=0,T=0,A=0;if(M<=n){let b=M/n,v=b*Math.PI/2;x=-h-t*Math.cos(v),T=t*Math.sin(v),A=-t*Math.cos(v),S=b*u}else if(M<=n+r){let b=(M-n)/r;x=-h+b*e,T=t,A=0,S=u+b*d}else{let b=(M-n-r)/n,v=b*Math.PI/2;x=h+t*Math.sin(v),T=t*Math.cos(v),A=t*Math.sin(v),S=u+d+b*u}let P=Math.max(0,Math.min(1,S/f)),C=0;M===0?C=.5/i:M===g&&(C=-.5/i);for(let b=0;b<=i;b++){let v=b/i,I=v*Math.PI*2,F=Math.sin(I),N=Math.cos(I);p.x=-T*N,p.y=x,p.z=T*F,a.push(p.x,p.y,p.z),m.set(-T*N,A,T*F),m.normalize(),l.push(m.x,m.y,m.z),c.push(v+C,P)}if(M>0){let b=(M-1)*_;for(let v=0;v<i;v++){let I=b+v,F=b+v+1,N=M*_+v,G=M*_+v+1;o.push(I,F,N),o.push(F,G,N)}}}this.setIndex(o),this.setAttribute("position",new $t(a,3)),this.setAttribute("normal",new $t(l,3)),this.setAttribute("uv",new $t(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Jr=class s extends ve{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);let r=[],o=[],a=[],l=[],c=new R,h=new ot;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let f=n+u/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new $t(o,3)),this.setAttribute("normal",new $t(a,3)),this.setAttribute("uv",new $t(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.segments,t.thetaStart,t.thetaLength)}},te=class s extends ve{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],d=[],f=[],g=0,_=[],m=n/2,p=0;M(),o===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new $t(u,3)),this.setAttribute("normal",new $t(d,3)),this.setAttribute("uv",new $t(f,2));function M(){let x=new R,T=new R,A=0,P=(e-t)/n;for(let C=0;C<=r;C++){let b=[],v=C/r,I=v*(e-t)+t;for(let F=0;F<=i;F++){let N=F/i,G=N*l+a,H=Math.sin(G),V=Math.cos(G);T.x=I*H,T.y=-v*n+m,T.z=I*V,u.push(T.x,T.y,T.z),x.set(H,P,V).normalize(),d.push(x.x,x.y,x.z),f.push(N,1-v),b.push(g++)}_.push(b)}for(let C=0;C<i;C++)for(let b=0;b<r;b++){let v=_[b][C],I=_[b+1][C],F=_[b+1][C+1],N=_[b][C+1];(t>0||b!==0)&&(h.push(v,I,N),A+=3),(e>0||b!==r-1)&&(h.push(I,F,N),A+=3)}c.addGroup(p,A,0),p+=A}function S(x){let T=g,A=new ot,P=new R,C=0,b=x===!0?t:e,v=x===!0?1:-1;for(let F=1;F<=i;F++)u.push(0,m*v,0),d.push(0,v,0),f.push(.5,.5),g++;let I=g;for(let F=0;F<=i;F++){let G=F/i*l+a,H=Math.cos(G),V=Math.sin(G);P.x=b*V,P.y=m*v,P.z=b*H,u.push(P.x,P.y,P.z),d.push(0,v,0),A.x=H*.5+.5,A.y=V*.5*v+.5,f.push(A.x,A.y),g++}for(let F=0;F<i;F++){let N=T+F,G=I+F;x===!0?h.push(G,G+1,N):h.push(G+1,G,N),C+=3}c.addGroup(p,C,x===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},es=class s extends te{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var xn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),i=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);let h=n[i],d=n[i+1]-h,f=(o-h)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let o=this.getPoint(i),a=this.getPoint(r),l=e||(o.isVector2?new ot:new R);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new R,i=[],r=[],o=[],a=new R,l=new Vt;for(let f=0;f<=t;f++){let g=f/t;i[f]=this.getTangentAt(g,new R)}r[0]=new R,o[0]=new R;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(ie(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(ie(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),o[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Js=class extends xn{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ot){let n=e,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},ca=class extends Js{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function hh(){let s=0,t=0,e=0,n=0;function i(r,o,a,l){s=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,i(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return s+t*r+e*o+n*a}}}var Xo=new R,Cc=new hh,Pc=new hh,Ic=new hh,ha=class extends xn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new R){let n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%r]:(Xo.subVectors(i[0],i[1]).add(i[0]),c=Xo);let u=i[a%r],d=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(Xo.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Xo),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Cc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,_,m),Pc.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,_,m),Ic.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(Cc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Pc.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Ic.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Cc.calc(l),Pc.calc(l),Ic.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new R().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Eu(s,t,e,n,i){let r=(n-t)*.5,o=(i-e)*.5,a=s*s,l=s*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*s+e}function hp(s,t){let e=1-s;return e*e*t}function up(s,t){return 2*(1-s)*s*t}function dp(s,t){return s*s*t}function Ir(s,t,e,n){return hp(s,t)+up(s,e)+dp(s,n)}function fp(s,t){let e=1-s;return e*e*e*t}function pp(s,t){let e=1-s;return 3*e*e*s*t}function mp(s,t){return 3*(1-s)*s*s*t}function gp(s,t){return s*s*s*t}function Dr(s,t,e,n,i){return fp(s,t)+pp(s,e)+mp(s,n)+gp(s,i)}var Kr=class extends xn{constructor(t=new ot,e=new ot,n=new ot,i=new ot){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new ot){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Dr(t,i.x,r.x,o.x,a.x),Dr(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},ua=class extends xn{constructor(t=new R,e=new R,n=new R,i=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new R){let n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Dr(t,i.x,r.x,o.x,a.x),Dr(t,i.y,r.y,o.y,a.y),Dr(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Qr=class extends xn{constructor(t=new ot,e=new ot){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ot){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},da=class extends xn{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},jr=class extends xn{constructor(t=new ot,e=new ot,n=new ot){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ot){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(Ir(t,i.x,r.x,o.x),Ir(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},fa=class extends xn{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){let n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(Ir(t,i.x,r.x,o.x),Ir(t,i.y,r.y,o.y),Ir(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},to=class extends xn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ot){let n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(Eu(a,l.x,c.x,h.x,u.x),Eu(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new ot().fromArray(i))}return this}},zc=Object.freeze({__proto__:null,ArcCurve:ca,CatmullRomCurve3:ha,CubicBezierCurve:Kr,CubicBezierCurve3:ua,EllipseCurve:Js,LineCurve:Qr,LineCurve3:da,QuadraticBezierCurve:jr,QuadraticBezierCurve3:fa,SplineCurve:to}),pa=class extends xn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new zc[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let o=i[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,r=this.curves;i<r.length;i++){let o=r[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new zc[i.type]().fromJSON(i))}return this}},Ii=class extends pa{constructor(t){super(),this.type="Path",this.currentPoint=new ot,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Qr(this.currentPoint.clone(),new ot(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let r=new jr(this.currentPoint.clone(),new ot(t,e),new ot(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,o){let a=new Kr(this.currentPoint.clone(),new ot(t,e),new ot(n,i),new ot(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new to(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,i,r,o),this}absarc(t,e,n,i,r,o){return this.absellipse(t,e,n,n,i,r,o),this}ellipse(t,e,n,i,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,r,o,a,l),this}absellipse(t,e,n,i,r,o,a,l){let c=new Js(t,e,n,i,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Nn=class extends Ii{constructor(t){super(t),this.uuid=ci(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new Ii().fromJSON(i))}return this}};function _p(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=Md(s,0,i,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=Sp(s,t,r,e)),s.length>80*e){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let d=e;d<i;d+=e){let f=s[d],g=s[d+1];f<a&&(a=f),g<l&&(l=g),f>h&&(h=f),g>u&&(u=g)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return eo(r,o,e,a,l,c,0),o}function Md(s,t,e,n,i){let r;if(i===Lp(s,t,e,n)>0)for(let o=t;o<e;o+=n)r=Tu(o/n|0,s[o],s[o+1],r);else for(let o=e-n;o>=t;o-=n)r=Tu(o/n|0,s[o],s[o+1],r);return r&&Ks(r,r.next)&&(io(r),r=r.next),r}function ns(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Ks(e,e.next)||Ce(e.prev,e,e.next)===0)){if(io(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function eo(s,t,e,n,i,r,o){if(!s)return;!o&&r&&Ap(s,n,i,r);let a=s;for(;s.prev!==s.next;){let l=s.prev,c=s.next;if(r?yp(s,n,i,r):xp(s)){t.push(l.i,s.i,c.i),io(s),s=c.next,a=c.next;continue}if(s=c,s===a){o?o===1?(s=vp(ns(s),t),eo(s,t,e,n,i,r,2)):o===2&&Mp(s,t,e,n,i,r):eo(ns(s),t,e,n,i,r,1);break}}}function xp(s){let t=s.prev,e=s,n=s.next;if(Ce(t,e,n)>=0)return!1;let i=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(i,r,o),u=Math.min(a,l,c),d=Math.max(i,r,o),f=Math.max(a,l,c),g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Pr(i,a,r,l,o,c,g.x,g.y)&&Ce(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function yp(s,t,e,n){let i=s.prev,r=s,o=s.next;if(Ce(i,r,o)>=0)return!1;let a=i.x,l=r.x,c=o.x,h=i.y,u=r.y,d=o.y,f=Math.min(a,l,c),g=Math.min(h,u,d),_=Math.max(a,l,c),m=Math.max(h,u,d),p=Hc(f,g,t,e,n),M=Hc(_,m,t,e,n),S=s.prevZ,x=s.nextZ;for(;S&&S.z>=p&&x&&x.z<=M;){if(S.x>=f&&S.x<=_&&S.y>=g&&S.y<=m&&S!==i&&S!==o&&Pr(a,h,l,u,c,d,S.x,S.y)&&Ce(S.prev,S,S.next)>=0||(S=S.prevZ,x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==i&&x!==o&&Pr(a,h,l,u,c,d,x.x,x.y)&&Ce(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;S&&S.z>=p;){if(S.x>=f&&S.x<=_&&S.y>=g&&S.y<=m&&S!==i&&S!==o&&Pr(a,h,l,u,c,d,S.x,S.y)&&Ce(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;x&&x.z<=M;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==i&&x!==o&&Pr(a,h,l,u,c,d,x.x,x.y)&&Ce(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function vp(s,t){let e=s;do{let n=e.prev,i=e.next.next;!Ks(n,i)&&bd(n,e,e.next,i)&&no(n,i)&&no(i,n)&&(t.push(n.i,e.i,i.i),io(e),io(e.next),e=s=i),e=e.next}while(e!==s);return ns(e)}function Mp(s,t,e,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Pp(o,a)){let l=Ed(o,a);o=ns(o,o.next),l=ns(l,l.next),eo(o,t,e,n,i,r,0),eo(l,t,e,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function Sp(s,t,e,n){let i=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*n,l=r<o-1?t[r+1]*n:s.length,c=Md(s,a,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Cp(c))}i.sort(bp);for(let r=0;r<i.length;r++)e=Ep(i[r],e);return e}function bp(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){let n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function Ep(s,t){let e=Tp(s,t);if(!e)return t;let n=Ed(e,s);return ns(n,n.next),ns(e,e.next)}function Tp(s,t){let e=t,n=s.x,i=s.y,r=-1/0,o;if(Ks(s,e))return e;do{if(Ks(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){let u=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Sd(i<c?n:r,i,l,c,i<c?r:n,i,e.x,e.y)){let u=Math.abs(i-e.y)/(n-e.x);no(e,s)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&wp(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function wp(s,t){return Ce(s.prev,s,t.prev)<0&&Ce(t.next,s,s.next)<0}function Ap(s,t,e,n){let i=s;do i.z===0&&(i.z=Hc(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,Rp(i)}function Rp(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(i=n,n=n.nextZ,a--):(i=o,o=o.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=o}r.nextZ=null,e*=2}while(t>1);return s}function Hc(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function Cp(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function Sd(s,t,e,n,i,r,o,a){return(i-o)*(t-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(i-o)*(n-a)}function Pr(s,t,e,n,i,r,o,a){return!(s===o&&t===a)&&Sd(s,t,e,n,i,r,o,a)}function Pp(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!Ip(s,t)&&(no(s,t)&&no(t,s)&&Dp(s,t)&&(Ce(s.prev,s,t.prev)||Ce(s,t.prev,t))||Ks(s,t)&&Ce(s.prev,s,s.next)>0&&Ce(t.prev,t,t.next)>0)}function Ce(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Ks(s,t){return s.x===t.x&&s.y===t.y}function bd(s,t,e,n){let i=Yo(Ce(s,t,e)),r=Yo(Ce(s,t,n)),o=Yo(Ce(e,n,s)),a=Yo(Ce(e,n,t));return!!(i!==r&&o!==a||i===0&&qo(s,e,t)||r===0&&qo(s,n,t)||o===0&&qo(e,s,n)||a===0&&qo(e,t,n))}function qo(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Yo(s){return s>0?1:s<0?-1:0}function Ip(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&bd(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function no(s,t){return Ce(s.prev,s,s.next)<0?Ce(s,t,s.next)>=0&&Ce(s,s.prev,t)>=0:Ce(s,t,s.prev)<0||Ce(s,s.next,t)<0}function Dp(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function Ed(s,t){let e=kc(s.i,s.x,s.y),n=kc(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Tu(s,t,e,n){let i=kc(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function io(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function kc(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Lp(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}var Gc=class{static triangulate(t,e,n=2){return _p(t,e,n)}},Gn=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];wu(t),Au(n,t);let o=t.length;e.forEach(wu);for(let l=0;l<e.length;l++)i.push(o),o+=e[l].length,Au(n,e[l]);let a=Gc.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function wu(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Au(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var is=class s extends ve{constructor(t=new Nn([new ot(.5,.5),new ot(-.5,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,i=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new $t(i,3)),this.setAttribute("uv",new $t(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:Fp,S,x=!1,T,A,P,C;p&&(S=p.getSpacedPoints(h),x=!0,d=!1,T=p.computeFrenetFrames(h,!1),A=new R,P=new R,C=new R),d||(m=0,f=0,g=0,_=0);let b=a.extractPoints(c),v=b.shape,I=b.holes;if(!Gn.isClockWise(v)){v=v.reverse();for(let rt=0,et=I.length;rt<et;rt++){let Q=I[rt];Gn.isClockWise(Q)&&(I[rt]=Q.reverse())}}function N(rt){let Q=10000000000000001e-36,K=rt[0];for(let mt=1;mt<=rt.length;mt++){let ct=mt%rt.length,gt=rt[ct],Jt=gt.x-K.x,Xt=gt.y-K.y,w=Jt*Jt+Xt*Xt,y=Math.max(Math.abs(gt.x),Math.abs(gt.y),Math.abs(K.x),Math.abs(K.y)),B=Q*y*y;if(w<=B){rt.splice(ct,1),mt--;continue}K=gt}}N(v),I.forEach(N);let G=I.length,H=v;for(let rt=0;rt<G;rt++){let et=I[rt];v=v.concat(et)}function V(rt,et,Q){return et||console.error("THREE.ExtrudeGeometry: vec does not exist"),rt.clone().addScaledVector(et,Q)}let $=v.length;function U(rt,et,Q){let K,mt,ct,gt=rt.x-et.x,Jt=rt.y-et.y,Xt=Q.x-rt.x,w=Q.y-rt.y,y=gt*gt+Jt*Jt,B=gt*w-Jt*Xt;if(Math.abs(B)>Number.EPSILON){let Y=Math.sqrt(y),nt=Math.sqrt(Xt*Xt+w*w),Z=et.x-Jt/Y,Dt=et.y+gt/Y,pt=Q.x-w/nt,Pt=Q.y+Xt/nt,Lt=((pt-Z)*w-(Pt-Dt)*Xt)/(gt*w-Jt*Xt);K=Z+gt*Lt-rt.x,mt=Dt+Jt*Lt-rt.y;let ht=K*K+mt*mt;if(ht<=2)return new ot(K,mt);ct=Math.sqrt(ht/2)}else{let Y=!1;gt>Number.EPSILON?Xt>Number.EPSILON&&(Y=!0):gt<-Number.EPSILON?Xt<-Number.EPSILON&&(Y=!0):Math.sign(Jt)===Math.sign(w)&&(Y=!0),Y?(K=-Jt,mt=gt,ct=Math.sqrt(y)):(K=gt,mt=Jt,ct=Math.sqrt(y/2))}return new ot(K/ct,mt/ct)}let tt=[];for(let rt=0,et=H.length,Q=et-1,K=rt+1;rt<et;rt++,Q++,K++)Q===et&&(Q=0),K===et&&(K=0),tt[rt]=U(H[rt],H[Q],H[K]);let lt=[],st,xt=tt.concat();for(let rt=0,et=G;rt<et;rt++){let Q=I[rt];st=[];for(let K=0,mt=Q.length,ct=mt-1,gt=K+1;K<mt;K++,ct++,gt++)ct===mt&&(ct=0),gt===mt&&(gt=0),st[K]=U(Q[K],Q[ct],Q[gt]);lt.push(st),xt=xt.concat(st)}let Nt;if(m===0)Nt=Gn.triangulateShape(H,I);else{let rt=[],et=[];for(let Q=0;Q<m;Q++){let K=Q/m,mt=f*Math.cos(K*Math.PI/2),ct=g*Math.sin(K*Math.PI/2)+_;for(let gt=0,Jt=H.length;gt<Jt;gt++){let Xt=V(H[gt],tt[gt],ct);Tt(Xt.x,Xt.y,-mt),K===0&&rt.push(Xt)}for(let gt=0,Jt=G;gt<Jt;gt++){let Xt=I[gt];st=lt[gt];let w=[];for(let y=0,B=Xt.length;y<B;y++){let Y=V(Xt[y],st[y],ct);Tt(Y.x,Y.y,-mt),K===0&&w.push(Y)}K===0&&et.push(w)}}Nt=Gn.triangulateShape(rt,et)}let It=Nt.length,At=g+_;for(let rt=0;rt<$;rt++){let et=d?V(v[rt],xt[rt],At):v[rt];x?(P.copy(T.normals[0]).multiplyScalar(et.x),A.copy(T.binormals[0]).multiplyScalar(et.y),C.copy(S[0]).add(P).add(A),Tt(C.x,C.y,C.z)):Tt(et.x,et.y,0)}for(let rt=1;rt<=h;rt++)for(let et=0;et<$;et++){let Q=d?V(v[et],xt[et],At):v[et];x?(P.copy(T.normals[rt]).multiplyScalar(Q.x),A.copy(T.binormals[rt]).multiplyScalar(Q.y),C.copy(S[rt]).add(P).add(A),Tt(C.x,C.y,C.z)):Tt(Q.x,Q.y,u/h*rt)}for(let rt=m-1;rt>=0;rt--){let et=rt/m,Q=f*Math.cos(et*Math.PI/2),K=g*Math.sin(et*Math.PI/2)+_;for(let mt=0,ct=H.length;mt<ct;mt++){let gt=V(H[mt],tt[mt],K);Tt(gt.x,gt.y,u+Q)}for(let mt=0,ct=I.length;mt<ct;mt++){let gt=I[mt];st=lt[mt];for(let Jt=0,Xt=gt.length;Jt<Xt;Jt++){let w=V(gt[Jt],st[Jt],K);x?Tt(w.x,w.y+S[h-1].y,S[h-1].x+Q):Tt(w.x,w.y,u+Q)}}}k(),J();function k(){let rt=i.length/3;if(d){let et=0,Q=$*et;for(let K=0;K<It;K++){let mt=Nt[K];St(mt[2]+Q,mt[1]+Q,mt[0]+Q)}et=h+m*2,Q=$*et;for(let K=0;K<It;K++){let mt=Nt[K];St(mt[0]+Q,mt[1]+Q,mt[2]+Q)}}else{for(let et=0;et<It;et++){let Q=Nt[et];St(Q[2],Q[1],Q[0])}for(let et=0;et<It;et++){let Q=Nt[et];St(Q[0]+$*h,Q[1]+$*h,Q[2]+$*h)}}n.addGroup(rt,i.length/3-rt,0)}function J(){let rt=i.length/3,et=0;yt(H,et),et+=H.length;for(let Q=0,K=I.length;Q<K;Q++){let mt=I[Q];yt(mt,et),et+=mt.length}n.addGroup(rt,i.length/3-rt,1)}function yt(rt,et){let Q=rt.length;for(;--Q>=0;){let K=Q,mt=Q-1;mt<0&&(mt=rt.length-1);for(let ct=0,gt=h+m*2;ct<gt;ct++){let Jt=$*ct,Xt=$*(ct+1),w=et+K+Jt,y=et+mt+Jt,B=et+mt+Xt,Y=et+K+Xt;Kt(w,y,B,Y)}}}function Tt(rt,et,Q){l.push(rt),l.push(et),l.push(Q)}function St(rt,et,Q){ue(rt),ue(et),ue(Q);let K=i.length/3,mt=M.generateTopUV(n,i,K-3,K-2,K-1);D(mt[0]),D(mt[1]),D(mt[2])}function Kt(rt,et,Q,K){ue(rt),ue(et),ue(K),ue(et),ue(Q),ue(K);let mt=i.length/3,ct=M.generateSideWallUV(n,i,mt-6,mt-3,mt-2,mt-1);D(ct[0]),D(ct[1]),D(ct[3]),D(ct[1]),D(ct[2]),D(ct[3])}function ue(rt){i.push(l[rt*3+0]),i.push(l[rt*3+1]),i.push(l[rt*3+2])}function D(rt){r.push(rt.x),r.push(rt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Up(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new zc[i.type]().fromJSON(i)),new s(n,t.options)}},Fp={generateTopUV:function(s,t,e,n,i){let r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[i*3],h=t[i*3+1];return[new ot(r,o),new ot(a,l),new ot(c,h)]},generateSideWallUV:function(s,t,e,n,i,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[i*3],f=t[i*3+1],g=t[i*3+2],_=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ot(o,1-l),new ot(c,1-u),new ot(d,1-g),new ot(_,1-p)]:[new ot(a,1-l),new ot(h,1-u),new ot(f,1-g),new ot(m,1-p)]}};function Up(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Me=class s extends ve{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=t/a,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){let M=p*d-o;for(let S=0;S<c;S++){let x=S*u-r;g.push(x,-M,0),_.push(0,0,1),m.push(S/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<a;M++){let S=M+c*p,x=M+c*(p+1),T=M+1+c*(p+1),A=M+1+c*p;f.push(S,x,A),f.push(x,T,A)}this.setIndex(f),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(_,3)),this.setAttribute("uv",new $t(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}};var _i=class s extends ve{constructor(t=new Nn([new ot(0,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],i=[],r=[],o=[],a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new $t(i,3)),this.setAttribute("normal",new $t(r,3)),this.setAttribute("uv",new $t(o,2));function c(h){let u=i.length/3,d=h.extractPoints(e),f=d.shape,g=d.holes;Gn.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){let M=g[m];Gn.isClockWise(M)===!0&&(g[m]=M.reverse())}let _=Gn.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){let M=g[m];f=f.concat(M)}for(let m=0,p=f.length;m<p;m++){let M=f[m];i.push(M.x,M.y,0),r.push(0,0,1),o.push(M.x,M.y)}for(let m=0,p=_.length;m<p;m++){let M=_[m],S=M[0]+u,x=M[1]+u,T=M[2]+u;n.push(S,x,T),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return Np(e,t)}static fromJSON(t,e){let n=[];for(let i=0,r=t.shapes.length;i<r;i++){let o=e[t.shapes[i]];n.push(o)}return new s(n,t.curveSegments)}};function Np(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){let i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}var we=class s extends ve{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new R,d=new R,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){let M=[],S=p/n,x=0;p===0&&o===0?x=.5/e:p===n&&l===Math.PI&&(x=-.5/e);for(let T=0;T<=e;T++){let A=T/e;u.x=-t*Math.cos(i+A*r)*Math.sin(o+S*a),u.y=t*Math.cos(o+S*a),u.z=t*Math.sin(i+A*r)*Math.sin(o+S*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(A+x,1-S),M.push(c++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<e;M++){let S=h[p][M+1],x=h[p][M],T=h[p+1][M],A=h[p+1][M+1];(p!==0||o>0)&&f.push(S,x,A),(p!==n-1||l<Math.PI)&&f.push(x,T,A)}this.setIndex(f),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(_,3)),this.setAttribute("uv",new $t(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Xe=class s extends ve{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],l=[],c=[],h=new R,u=new R,d=new R;for(let f=0;f<=n;f++)for(let g=0;g<=i;g++){let _=g/i*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/i),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=i;g++){let _=(i+1)*f+g-1,m=(i+1)*(f-1)+g-1,p=(i+1)*(f-1)+g,M=(i+1)*f+g;o.push(_,m,M),o.push(m,p,M)}this.setIndex(o),this.setAttribute("position",new $t(a,3)),this.setAttribute("normal",new $t(l,3)),this.setAttribute("uv",new $t(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var qt=class extends Xn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rh,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},so=class extends qt{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ot(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ie(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Bt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Bt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Bt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var ma=class extends Xn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=od,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},ga=class extends Xn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Zo(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function Op(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}var ss=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=e[++n],t<i)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},_a=class extends ss{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Fc,endingEnd:Fc}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case Uc:r=t,a=2*e-n;break;case Nc:r=i.length-2,a=e+i[r]-i[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Uc:o=t,l=2*n-e;break;case Nc:o=1,l=n+i[1]-i[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-e)/(i-e),_=g*g,m=_*g,p=-d*m+2*d*_-d*g,M=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,S=(-1-f)*m+(1.5+f)*_+.5*g,x=f*m-f*_;for(let T=0;T!==a;++T)r[T]=p*o[h+T]+M*o[c+T]+S*o[l+T]+x*o[u+T];return r}},xa=class extends ss{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(i-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},ya=class extends ss{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},yn=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Zo(e,this.TimeBufferType),this.values=Zo(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Zo(t.times,Array),values:Zo(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ya(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new xa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new _a(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Lr:e=this.InterpolantFactoryMethodDiscrete;break;case jo:e=this.InterpolantFactoryMethodLinear;break;case $o:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Lr;case this.InterpolantFactoryMethodLinear:return jo;case this.InterpolantFactoryMethodSmooth:return $o}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(i!==void 0&&Op(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===$o,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(i)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){let _=e[u+g];if(_!==e[d+g]||_!==e[f+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}};yn.prototype.ValueTypeName="";yn.prototype.TimeBufferType=Float32Array;yn.prototype.ValueBufferType=Float32Array;yn.prototype.DefaultInterpolation=jo;var Di=class extends yn{constructor(t,e,n){super(t,e,n)}};Di.prototype.ValueTypeName="bool";Di.prototype.ValueBufferType=Array;Di.prototype.DefaultInterpolation=Lr;Di.prototype.InterpolantFactoryMethodLinear=void 0;Di.prototype.InterpolantFactoryMethodSmooth=void 0;var va=class extends yn{constructor(t,e,n,i){super(t,e,n,i)}};va.prototype.ValueTypeName="color";var Ma=class extends yn{constructor(t,e,n,i){super(t,e,n,i)}};Ma.prototype.ValueTypeName="number";var Sa=class extends ss{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(i-e),c=t*a;for(let h=c+a;c!==h;c+=4)Ie.slerpFlat(r,0,o,c-a,o,c,l);return r}},ro=class extends yn{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new Sa(this.times,this.values,this.getValueSize(),t)}};ro.prototype.ValueTypeName="quaternion";ro.prototype.InterpolantFactoryMethodSmooth=void 0;var Li=class extends yn{constructor(t,e,n){super(t,e,n)}};Li.prototype.ValueTypeName="string";Li.prototype.ValueBufferType=Array;Li.prototype.DefaultInterpolation=Lr;Li.prototype.InterpolantFactoryMethodLinear=void 0;Li.prototype.InterpolantFactoryMethodSmooth=void 0;var ba=class extends yn{constructor(t,e,n,i){super(t,e,n,i)}};ba.prototype.ValueTypeName="vector";var Ea=class{constructor(t,e,n){let i=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Td=new Ea,Ta=class{constructor(t){this.manager=t!==void 0?t:Td,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Ta.DEFAULT_MATERIAL_NAME="__DEFAULT";var rs=class extends be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Bt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},oo=class extends rs{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Dc=new Vt,Ru=new R,Cu=new R,wa=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.mapType=On,this.map=null,this.mapPass=null,this.matrix=new Vt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ys,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new pe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Ru.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ru),Cu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Cu),e.updateMatrixWorld(),Dc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Dc,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Dc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Pu=new Vt,Cr=new R,Lc=new R,Vc=class extends wa{constructor(){super(new We(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ot(4,2),this._viewportCount=6,this._viewports=[new pe(2,1,1,1),new pe(0,1,1,1),new pe(3,1,1,1),new pe(1,1,1,1),new pe(3,0,1,1),new pe(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Cr.setFromMatrixPosition(t.matrixWorld),n.position.copy(Cr),Lc.copy(n.position),Lc.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Lc),n.updateMatrixWorld(),i.makeTranslation(-Cr.x,-Cr.y,-Cr.z),Pu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Pu,n.coordinateSystem,n.reversedDepth)}},Fi=class extends rs{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Vc}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},ao=class extends Gr{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Wc=class extends wa{constructor(){super(new ao(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ui=class extends rs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.shadow=new Wc}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},lo=class extends rs{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var Aa=class extends We{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var uh="\\[\\]\\.:\\/",Bp=new RegExp("["+uh+"]","g"),dh="[^"+uh+"]",zp="[^"+uh.replace("\\.","")+"]",Hp=/((?:WC+[\/:])*)/.source.replace("WC",dh),kp=/(WCOD+)?/.source.replace("WCOD",zp),Gp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",dh),Vp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",dh),Wp=new RegExp("^"+Hp+kp+Gp+Vp+"$"),Xp=["material","materials","bones","map"],Xc=class{constructor(t,e,n){let i=n||Te.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Te=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Bp,"")}static parseTrackName(t){let e=Wp.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);Xp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[i];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Te.Composite=Xc;Te.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Te.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Te.prototype.GetterByBindingType=[Te.prototype._getValue_direct,Te.prototype._getValue_array,Te.prototype._getValue_arrayElement,Te.prototype._getValue_toArray];Te.prototype.SetterByBindingTypeAndVersioning=[[Te.prototype._setValue_direct,Te.prototype._setValue_direct_setNeedsUpdate,Te.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_array,Te.prototype._setValue_array_setNeedsUpdate,Te.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_arrayElement,Te.prototype._setValue_arrayElement_setNeedsUpdate,Te.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Te.prototype._setValue_fromArray,Te.prototype._setValue_fromArray_setNeedsUpdate,Te.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var kx=new Float32Array(1);function fh(s,t,e,n){let i=qp(n);switch(e){case nh:return s*t;case Va:return s*t/i.components*i.byteLength;case Wa:return s*t/i.components*i.byteLength;case sh:return s*t*2/i.components*i.byteLength;case Xa:return s*t*2/i.components*i.byteLength;case ih:return s*t*3/i.components*i.byteLength;case wn:return s*t*4/i.components*i.byteLength;case qa:return s*t*4/i.components*i.byteLength;case uo:case fo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case po:case mo:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Za:case Ja:return Math.max(s,16)*Math.max(t,8)/4;case Ya:case $a:return Math.max(s,8)*Math.max(t,8)/2;case Ka:case Qa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case ja:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case tl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case el:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case nl:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case il:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case sl:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case rl:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case ol:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case al:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case ll:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case cl:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case hl:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case ul:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case dl:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case fl:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case pl:case ml:case gl:return Math.ceil(s/4)*Math.ceil(t/4)*16;case _l:case xl:return Math.ceil(s/4)*Math.ceil(t/4)*8;case yl:case vl:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function qp(s){switch(s){case On:case Qc:return{byteLength:1,components:1};case Qs:case jc:case js:return{byteLength:2,components:1};case ka:case Ga:return{byteLength:2,components:4};case Ni:case Ha:case Bn:return{byteLength:4,components:1};case th:case eh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function $d(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Yp(s){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array!="undefined"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(s.bindBuffer(c,a),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){let g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){let _=u[f];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var Zp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$p=`#ifdef USE_ALPHAHASH
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
#endif`,Jp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Kp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,jp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,tm=`#ifdef USE_AOMAP
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
#endif`,em=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,nm=`#ifdef USE_BATCHING
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
#endif`,im=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,sm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,rm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,om=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,am=`#ifdef USE_IRIDESCENCE
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
#endif`,lm=`#ifdef USE_BUMPMAP
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
#endif`,cm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,hm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,um=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,dm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,fm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,pm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,mm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,gm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,_m=`#define PI 3.141592653589793
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
} // validated`,xm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ym=`vec3 transformedNormal = objectNormal;
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
#endif`,vm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Mm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Sm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Em="gl_FragColor = linearToOutputTexel( gl_FragColor );",Tm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,wm=`#ifdef USE_ENVMAP
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
#endif`,Am=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Rm=`#ifdef USE_ENVMAP
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
#endif`,Cm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Pm=`#ifdef USE_ENVMAP
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
#endif`,Im=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Dm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Lm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Fm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Um=`#ifdef USE_GRADIENTMAP
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
}`,Nm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Om=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,zm=`uniform bool receiveShadow;
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
#endif`,Hm=`#ifdef USE_ENVMAP
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
#endif`,km=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Gm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Vm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Wm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Xm=`PhysicalMaterial material;
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
#endif`,qm=`struct PhysicalMaterial {
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
}`,Ym=`
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
#endif`,Zm=`#if defined( RE_IndirectDiffuse )
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
#endif`,$m=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Jm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Km=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,t0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,e0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,n0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,i0=`#if defined( USE_POINTS_UV )
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
#endif`,s0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,r0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,o0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,a0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,l0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,c0=`#ifdef USE_MORPHTARGETS
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
#endif`,h0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,u0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,d0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,f0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,p0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,m0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,g0=`#ifdef USE_NORMALMAP
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
#endif`,_0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,x0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,y0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,v0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,M0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,S0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,b0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,E0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,T0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,w0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,A0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,R0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,C0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,P0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,I0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,D0=`float getShadowMask() {
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
}`,L0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,F0=`#ifdef USE_SKINNING
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
#endif`,U0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,N0=`#ifdef USE_SKINNING
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
#endif`,O0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,B0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,z0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,H0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,k0=`#ifdef USE_TRANSMISSION
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
#endif`,G0=`#ifdef USE_TRANSMISSION
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
#endif`,V0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,W0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,X0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,q0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Y0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Z0=`uniform sampler2D t2D;
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
}`,$0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,J0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,K0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Q0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,j0=`#include <common>
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
}`,tg=`#if DEPTH_PACKING == 3200
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
}`,eg=`#define DISTANCE
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
}`,ng=`#define DISTANCE
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
}`,ig=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,sg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rg=`uniform float scale;
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
}`,og=`uniform vec3 diffuse;
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
}`,ag=`#include <common>
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
}`,lg=`uniform vec3 diffuse;
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
}`,cg=`#define LAMBERT
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
}`,hg=`#define LAMBERT
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
}`,ug=`#define MATCAP
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
}`,dg=`#define MATCAP
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
}`,fg=`#define NORMAL
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
}`,pg=`#define NORMAL
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
}`,mg=`#define PHONG
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
}`,gg=`#define PHONG
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
}`,_g=`#define STANDARD
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
}`,xg=`#define STANDARD
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
}`,yg=`#define TOON
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
}`,vg=`#define TOON
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
}`,Mg=`uniform float size;
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
}`,Sg=`uniform vec3 diffuse;
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
}`,bg=`#include <common>
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
}`,Eg=`uniform vec3 color;
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
}`,Tg=`uniform float rotation;
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
}`,wg=`uniform vec3 diffuse;
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
}`,ee={alphahash_fragment:Zp,alphahash_pars_fragment:$p,alphamap_fragment:Jp,alphamap_pars_fragment:Kp,alphatest_fragment:Qp,alphatest_pars_fragment:jp,aomap_fragment:tm,aomap_pars_fragment:em,batching_pars_vertex:nm,batching_vertex:im,begin_vertex:sm,beginnormal_vertex:rm,bsdfs:om,iridescence_fragment:am,bumpmap_pars_fragment:lm,clipping_planes_fragment:cm,clipping_planes_pars_fragment:hm,clipping_planes_pars_vertex:um,clipping_planes_vertex:dm,color_fragment:fm,color_pars_fragment:pm,color_pars_vertex:mm,color_vertex:gm,common:_m,cube_uv_reflection_fragment:xm,defaultnormal_vertex:ym,displacementmap_pars_vertex:vm,displacementmap_vertex:Mm,emissivemap_fragment:Sm,emissivemap_pars_fragment:bm,colorspace_fragment:Em,colorspace_pars_fragment:Tm,envmap_fragment:wm,envmap_common_pars_fragment:Am,envmap_pars_fragment:Rm,envmap_pars_vertex:Cm,envmap_physical_pars_fragment:Hm,envmap_vertex:Pm,fog_vertex:Im,fog_pars_vertex:Dm,fog_fragment:Lm,fog_pars_fragment:Fm,gradientmap_pars_fragment:Um,lightmap_pars_fragment:Nm,lights_lambert_fragment:Om,lights_lambert_pars_fragment:Bm,lights_pars_begin:zm,lights_toon_fragment:km,lights_toon_pars_fragment:Gm,lights_phong_fragment:Vm,lights_phong_pars_fragment:Wm,lights_physical_fragment:Xm,lights_physical_pars_fragment:qm,lights_fragment_begin:Ym,lights_fragment_maps:Zm,lights_fragment_end:$m,logdepthbuf_fragment:Jm,logdepthbuf_pars_fragment:Km,logdepthbuf_pars_vertex:Qm,logdepthbuf_vertex:jm,map_fragment:t0,map_pars_fragment:e0,map_particle_fragment:n0,map_particle_pars_fragment:i0,metalnessmap_fragment:s0,metalnessmap_pars_fragment:r0,morphinstance_vertex:o0,morphcolor_vertex:a0,morphnormal_vertex:l0,morphtarget_pars_vertex:c0,morphtarget_vertex:h0,normal_fragment_begin:u0,normal_fragment_maps:d0,normal_pars_fragment:f0,normal_pars_vertex:p0,normal_vertex:m0,normalmap_pars_fragment:g0,clearcoat_normal_fragment_begin:_0,clearcoat_normal_fragment_maps:x0,clearcoat_pars_fragment:y0,iridescence_pars_fragment:v0,opaque_fragment:M0,packing:S0,premultiplied_alpha_fragment:b0,project_vertex:E0,dithering_fragment:T0,dithering_pars_fragment:w0,roughnessmap_fragment:A0,roughnessmap_pars_fragment:R0,shadowmap_pars_fragment:C0,shadowmap_pars_vertex:P0,shadowmap_vertex:I0,shadowmask_pars_fragment:D0,skinbase_vertex:L0,skinning_pars_vertex:F0,skinning_vertex:U0,skinnormal_vertex:N0,specularmap_fragment:O0,specularmap_pars_fragment:B0,tonemapping_fragment:z0,tonemapping_pars_fragment:H0,transmission_fragment:k0,transmission_pars_fragment:G0,uv_pars_fragment:V0,uv_pars_vertex:W0,uv_vertex:X0,worldpos_vertex:q0,background_vert:Y0,background_frag:Z0,backgroundCube_vert:$0,backgroundCube_frag:J0,cube_vert:K0,cube_frag:Q0,depth_vert:j0,depth_frag:tg,distanceRGBA_vert:eg,distanceRGBA_frag:ng,equirect_vert:ig,equirect_frag:sg,linedashed_vert:rg,linedashed_frag:og,meshbasic_vert:ag,meshbasic_frag:lg,meshlambert_vert:cg,meshlambert_frag:hg,meshmatcap_vert:ug,meshmatcap_frag:dg,meshnormal_vert:fg,meshnormal_frag:pg,meshphong_vert:mg,meshphong_frag:gg,meshphysical_vert:_g,meshphysical_frag:xg,meshtoon_vert:yg,meshtoon_frag:vg,points_vert:Mg,points_frag:Sg,shadow_vert:bg,shadow_frag:Eg,sprite_vert:Tg,sprite_frag:wg},vt={common:{diffuse:{value:new Bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qt}},envmap:{envMap:{value:null},envMapRotation:{value:new Qt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qt},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0},uvTransform:{value:new Qt}},sprite:{diffuse:{value:new Bt(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}}},Zn={basic:{uniforms:Qe([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.fog]),vertexShader:ee.meshbasic_vert,fragmentShader:ee.meshbasic_frag},lambert:{uniforms:Qe([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Bt(0)}}]),vertexShader:ee.meshlambert_vert,fragmentShader:ee.meshlambert_frag},phong:{uniforms:Qe([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Bt(0)},specular:{value:new Bt(1118481)},shininess:{value:30}}]),vertexShader:ee.meshphong_vert,fragmentShader:ee.meshphong_frag},standard:{uniforms:Qe([vt.common,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.roughnessmap,vt.metalnessmap,vt.fog,vt.lights,{emissive:{value:new Bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag},toon:{uniforms:Qe([vt.common,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.gradientmap,vt.fog,vt.lights,{emissive:{value:new Bt(0)}}]),vertexShader:ee.meshtoon_vert,fragmentShader:ee.meshtoon_frag},matcap:{uniforms:Qe([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,{matcap:{value:null}}]),vertexShader:ee.meshmatcap_vert,fragmentShader:ee.meshmatcap_frag},points:{uniforms:Qe([vt.points,vt.fog]),vertexShader:ee.points_vert,fragmentShader:ee.points_frag},dashed:{uniforms:Qe([vt.common,vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ee.linedashed_vert,fragmentShader:ee.linedashed_frag},depth:{uniforms:Qe([vt.common,vt.displacementmap]),vertexShader:ee.depth_vert,fragmentShader:ee.depth_frag},normal:{uniforms:Qe([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,{opacity:{value:1}}]),vertexShader:ee.meshnormal_vert,fragmentShader:ee.meshnormal_frag},sprite:{uniforms:Qe([vt.sprite,vt.fog]),vertexShader:ee.sprite_vert,fragmentShader:ee.sprite_frag},background:{uniforms:{uvTransform:{value:new Qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ee.background_vert,fragmentShader:ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Qt}},vertexShader:ee.backgroundCube_vert,fragmentShader:ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ee.cube_vert,fragmentShader:ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ee.equirect_vert,fragmentShader:ee.equirect_frag},distanceRGBA:{uniforms:Qe([vt.common,vt.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ee.distanceRGBA_vert,fragmentShader:ee.distanceRGBA_frag},shadow:{uniforms:Qe([vt.lights,vt.fog,{color:{value:new Bt(0)},opacity:{value:1}}]),vertexShader:ee.shadow_vert,fragmentShader:ee.shadow_frag}};Zn.physical={uniforms:Qe([Zn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qt},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qt},sheen:{value:0},sheenColor:{value:new Bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qt},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qt},attenuationDistance:{value:0},attenuationColor:{value:new Bt(0)},specularColor:{value:new Bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qt},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qt}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag};var Sl={r:0,b:0,g:0},cs=new gn,Ag=new Vt;function Rg(s,t,e,n,i,r,o){let a=new Bt(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(S){let x=S.isScene===!0?S.background:null;return x&&x.isTexture&&(x=(S.backgroundBlurriness>0?e:t).get(x)),x}function _(S){let x=!1,T=g(S);T===null?p(a,l):T&&T.isColor&&(p(T,1),x=!0);let A=s.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(S,x){let T=g(x);T&&(T.isCubeTexture||T.mapping===co)?(h===void 0&&(h=new wt(new jt(1,1,1),new _n({name:"BackgroundCubeMaterial",uniforms:ls(Zn.backgroundCube.uniforms),vertexShader:Zn.backgroundCube.vertexShader,fragmentShader:Zn.backgroundCube.fragmentShader,side:qe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,P,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),cs.copy(x.backgroundRotation),cs.x*=-1,cs.y*=-1,cs.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(cs.y*=-1,cs.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Ag.makeRotationFromEuler(cs)),h.material.toneMapped=le.getTransfer(T.colorSpace)!==ge,(u!==T||d!==T.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=T,d=T.version,f=s.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new wt(new Me(2,2),new _n({name:"BackgroundMaterial",uniforms:ls(Zn.background.uniforms),vertexShader:Zn.background.vertexShader,fragmentShader:Zn.background.fragmentShader,side:ui,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=le.getTransfer(T.colorSpace)!==ge,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||d!==T.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,u=T,d=T.version,f=s.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function p(S,x){S.getRGB(Sl,ch(s)),n.buffers.color.setClear(Sl.r,Sl.g,Sl.b,x,o)}function M(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,x=1){a.set(S),l=x,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,p(a,l)},render:_,addToRenderList:m,dispose:M}}function Cg(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null),r=i,o=!1;function a(v,I,F,N,G){let H=!1,V=u(N,F,I);r!==V&&(r=V,c(r.object)),H=f(v,N,F,G),H&&g(v,N,F,G),G!==null&&t.update(G,s.ELEMENT_ARRAY_BUFFER),(H||o)&&(o=!1,x(v,I,F,N),G!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function l(){return s.createVertexArray()}function c(v){return s.bindVertexArray(v)}function h(v){return s.deleteVertexArray(v)}function u(v,I,F){let N=F.wireframe===!0,G=n[v.id];G===void 0&&(G={},n[v.id]=G);let H=G[I.id];H===void 0&&(H={},G[I.id]=H);let V=H[N];return V===void 0&&(V=d(l()),H[N]=V),V}function d(v){let I=[],F=[],N=[];for(let G=0;G<e;G++)I[G]=0,F[G]=0,N[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:F,attributeDivisors:N,object:v,attributes:{},index:null}}function f(v,I,F,N){let G=r.attributes,H=I.attributes,V=0,$=F.getAttributes();for(let U in $)if($[U].location>=0){let lt=G[U],st=H[U];if(st===void 0&&(U==="instanceMatrix"&&v.instanceMatrix&&(st=v.instanceMatrix),U==="instanceColor"&&v.instanceColor&&(st=v.instanceColor)),lt===void 0||lt.attribute!==st||st&&lt.data!==st.data)return!0;V++}return r.attributesNum!==V||r.index!==N}function g(v,I,F,N){let G={},H=I.attributes,V=0,$=F.getAttributes();for(let U in $)if($[U].location>=0){let lt=H[U];lt===void 0&&(U==="instanceMatrix"&&v.instanceMatrix&&(lt=v.instanceMatrix),U==="instanceColor"&&v.instanceColor&&(lt=v.instanceColor));let st={};st.attribute=lt,lt&&lt.data&&(st.data=lt.data),G[U]=st,V++}r.attributes=G,r.attributesNum=V,r.index=N}function _(){let v=r.newAttributes;for(let I=0,F=v.length;I<F;I++)v[I]=0}function m(v){p(v,0)}function p(v,I){let F=r.newAttributes,N=r.enabledAttributes,G=r.attributeDivisors;F[v]=1,N[v]===0&&(s.enableVertexAttribArray(v),N[v]=1),G[v]!==I&&(s.vertexAttribDivisor(v,I),G[v]=I)}function M(){let v=r.newAttributes,I=r.enabledAttributes;for(let F=0,N=I.length;F<N;F++)I[F]!==v[F]&&(s.disableVertexAttribArray(F),I[F]=0)}function S(v,I,F,N,G,H,V){V===!0?s.vertexAttribIPointer(v,I,F,G,H):s.vertexAttribPointer(v,I,F,N,G,H)}function x(v,I,F,N){_();let G=N.attributes,H=F.getAttributes(),V=I.defaultAttributeValues;for(let $ in H){let U=H[$];if(U.location>=0){let tt=G[$];if(tt===void 0&&($==="instanceMatrix"&&v.instanceMatrix&&(tt=v.instanceMatrix),$==="instanceColor"&&v.instanceColor&&(tt=v.instanceColor)),tt!==void 0){let lt=tt.normalized,st=tt.itemSize,xt=t.get(tt);if(xt===void 0)continue;let Nt=xt.buffer,It=xt.type,At=xt.bytesPerElement,k=It===s.INT||It===s.UNSIGNED_INT||tt.gpuType===Ha;if(tt.isInterleavedBufferAttribute){let J=tt.data,yt=J.stride,Tt=tt.offset;if(J.isInstancedInterleavedBuffer){for(let St=0;St<U.locationSize;St++)p(U.location+St,J.meshPerAttribute);v.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let St=0;St<U.locationSize;St++)m(U.location+St);s.bindBuffer(s.ARRAY_BUFFER,Nt);for(let St=0;St<U.locationSize;St++)S(U.location+St,st/U.locationSize,It,lt,yt*At,(Tt+st/U.locationSize*St)*At,k)}else{if(tt.isInstancedBufferAttribute){for(let J=0;J<U.locationSize;J++)p(U.location+J,tt.meshPerAttribute);v.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let J=0;J<U.locationSize;J++)m(U.location+J);s.bindBuffer(s.ARRAY_BUFFER,Nt);for(let J=0;J<U.locationSize;J++)S(U.location+J,st/U.locationSize,It,lt,st*At,st/U.locationSize*J*At,k)}}else if(V!==void 0){let lt=V[$];if(lt!==void 0)switch(lt.length){case 2:s.vertexAttrib2fv(U.location,lt);break;case 3:s.vertexAttrib3fv(U.location,lt);break;case 4:s.vertexAttrib4fv(U.location,lt);break;default:s.vertexAttrib1fv(U.location,lt)}}}}M()}function T(){C();for(let v in n){let I=n[v];for(let F in I){let N=I[F];for(let G in N)h(N[G].object),delete N[G];delete I[F]}delete n[v]}}function A(v){if(n[v.id]===void 0)return;let I=n[v.id];for(let F in I){let N=I[F];for(let G in N)h(N[G].object),delete N[G];delete I[F]}delete n[v.id]}function P(v){for(let I in n){let F=n[I];if(F[v.id]===void 0)continue;let N=F[v.id];for(let G in N)h(N[G].object),delete N[G];delete F[v.id]}}function C(){b(),o=!0,r!==i&&(r=i,c(r.object))}function b(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:C,resetDefaultState:b,dispose:T,releaseStatesOfGeometry:A,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:m,disableUnusedAttributes:M}}function Pg(s,t,e){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function l(c,h,u,d){if(u===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Ig(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let P=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(P){return!(P!==wn&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(P){let C=P===js&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==On&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Bn&&!C)}function l(P){if(P==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),S=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,A=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:S,maxFragmentUniforms:x,vertexTextures:T,maxSamples:A}}function Dg(s){let t=this,e=null,n=0,i=!1,r=!1,o=new Hn,a=new Qt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{let M=r?0:n,S=M*4,x=p.clippingState||null;l.value=x,x=h(g,d,S,f);for(let T=0;T!==S;++T)x[T]=e[T];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let p=f+_*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,x=f;S!==_;++S,x+=4)o.copy(u[S]).applyMatrix4(M,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Lg(s){let t=new WeakMap;function e(o,a){return a===Oa?o.mapping=os:a===Ba&&(o.mapping=as),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Oa||a===Ba)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new oa(l.height);return c.fromEquirectangularTexture(s,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var ir=4,wd=[.125,.215,.35,.446,.526,.582],ds=20,ph=new ao,Ad=new Bt,mh=null,gh=0,_h=0,xh=!1,us=(1+Math.sqrt(5))/2,nr=1/us,Rd=[new R(-us,nr,0),new R(us,nr,0),new R(-nr,0,us),new R(nr,0,us),new R(0,us,-nr),new R(0,us,nr),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],Fg=new R,rr=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100,r={}){let{size:o=256,position:a=Fg}=r;mh=this._renderer.getRenderTarget(),gh=this._renderer.getActiveCubeFace(),_h=this._renderer.getActiveMipmapLevel(),xh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Id(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Pd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(mh,gh,_h),this._renderer.xr.enabled=xh,t.scissorTest=!1,bl(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===os||t.mapping===as?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),mh=this._renderer.getRenderTarget(),gh=this._renderer.getActiveCubeFace(),_h=this._renderer.getActiveMipmapLevel(),xh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:mn,minFilter:mn,generateMipmaps:!1,type:js,format:wn,colorSpace:Qi,depthBuffer:!1},i=Cd(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Cd(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ug(r)),this._blurMaterial=Ng(r,t,e)}return i}_compileMaterial(t){let e=new wt(this._lodPlanes[0],t);this._renderer.compile(e,ph)}_sceneToCubeUV(t,e,n,i,r){let l=new We(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Ad),u.toneMapping=yi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null));let _=new ke({name:"PMREM.Background",side:qe,depthWrite:!1,depthTest:!1}),m=new wt(new jt,_),p=!1,M=t.background;M?M.isColor&&(_.color.copy(M),t.background=null,p=!0):(_.color.copy(Ad),p=!0);for(let S=0;S<6;S++){let x=S%3;x===0?(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[S],r.y,r.z)):x===1?(l.up.set(0,0,c[S]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[S],r.z)):(l.up.set(0,c[S],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[S]));let T=this._cubeSize;bl(i,x*T,S>2?T:0,T,T),u.setRenderTarget(i),p&&u.render(m,l),u.render(t,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=M}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===os||t.mapping===as;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Id()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Pd());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new wt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;bl(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,ph)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodPlanes.length;for(let r=1;r<i;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Rd[(i-r-1)%Rd.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new wt(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ds-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):ds;m>ds&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ds}`);let p=[],M=0;for(let P=0;P<ds;++P){let C=P/_,b=Math.exp(-C*C/2);p.push(b),P===0?M+=b:P<m&&(M+=2*b)}for(let P=0;P<p.length;P++)p[P]=p[P]/M;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:S}=this;d.dTheta.value=g,d.mipInt.value=S-n;let x=this._sizeLods[i],T=3*x*(i>S-ir?i-S+ir:0),A=4*(this._cubeSize-x);bl(e,T,A,3*x,2*x),l.setRenderTarget(e),l.render(u,ph)}};function Ug(s){let t=[],e=[],n=[],i=s,r=s-ir+1+wd.length;for(let o=0;o<r;o++){let a=Math.pow(2,i);e.push(a);let l=1/a;o>s-ir?l=wd[o-s+ir-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,M=new Float32Array(_*g*f),S=new Float32Array(m*g*f),x=new Float32Array(p*g*f);for(let A=0;A<f;A++){let P=A%3*2/3-1,C=A>2?0:-1,b=[P,C,0,P+2/3,C,0,P+2/3,C+1,0,P,C,0,P+2/3,C+1,0,P,C+1,0];M.set(b,_*g*A),S.set(d,m*g*A);let v=[A,A,A,A,A,A];x.set(v,p*g*A)}let T=new ve;T.setAttribute("position",new Oe(M,_)),T.setAttribute("uv",new Oe(S,m)),T.setAttribute("faceIndex",new Oe(x,p)),t.push(T),i>ir&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Cd(s,t,e){let n=new Vn(s,t,e);return n.texture.mapping=co,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function bl(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Ng(s,t,e){let n=new Float32Array(ds),i=new R(0,1,0);return new _n({name:"SphericalGaussianBlur",defines:{n:ds,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ch(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function Pd(){return new _n({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ch(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function Id(){return new _n({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ch(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:xi,depthTest:!1,depthWrite:!1})}function Ch(){return`

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
	`}function Og(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Oa||l===Ba,h=l===os||l===as;if(c||h){let u=t.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new rr(s)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return c&&f&&f.height>0||h&&f&&i(f)?(e===null&&(e=new rr(s)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Bg(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Ws("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function zg(s,t,e,n){let i={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete i[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)t.update(d[f],s.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,g=u.attributes.position,_=0;if(f!==null){let M=f.array;_=f.version;for(let S=0,x=M.length;S<x;S+=3){let T=M[S+0],A=M[S+1],P=M[S+2];d.push(T,A,A,P,P,T)}}else if(g!==void 0){let M=g.array;_=g.version;for(let S=0,x=M.length/3-1;S<x;S+=3){let T=S+0,A=S+1,P=S+2;d.push(T,A,A,P,P,T)}}else return;let m=new(lh(d)?kr:Hr)(d,1);m.version=_;let p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Hg(s,t,e){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){s.drawElements(n,f,r,d*o),e.update(f,n,1)}function c(d,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,d*o,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,_){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let p=0;for(let M=0;M<g;M++)p+=f[M]*_[M];e.update(p,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function kg(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Gg(s,t,e){let n=new WeakMap,i=new pe;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let b=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",b)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],S=0;f===!0&&(S=1),g===!0&&(S=2),_===!0&&(S=3);let x=a.attributes.position.count*S,T=1;x>t.maxTextureSize&&(T=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);let A=new Float32Array(x*T*4*u),P=new Or(A,x,T,u);P.type=Bn,P.needsUpdate=!0;let C=S*4;for(let v=0;v<u;v++){let I=m[v],F=p[v],N=M[v],G=x*T*4*v;for(let H=0;H<I.count;H++){let V=H*C;f===!0&&(i.fromBufferAttribute(I,H),A[G+V+0]=i.x,A[G+V+1]=i.y,A[G+V+2]=i.z,A[G+V+3]=0),g===!0&&(i.fromBufferAttribute(F,H),A[G+V+4]=i.x,A[G+V+5]=i.y,A[G+V+6]=i.z,A[G+V+7]=0),_===!0&&(i.fromBufferAttribute(N,H),A[G+V+8]=i.x,A[G+V+9]=i.y,A[G+V+10]=i.z,A[G+V+11]=N.itemSize===4?i.w:1)}}d={count:u,texture:P,size:new ot(x,T)},n.set(a,d),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Vg(s,t,e,n){let i=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=t.get(l,h);if(i.get(u)!==c&&(t.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function o(){i=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var Jd=new nn,Dd=new Zr(1,1),Kd=new Or,Qd=new sa,jd=new Vr,Ld=[],Fd=[],Ud=new Float32Array(16),Nd=new Float32Array(9),Od=new Float32Array(4);function or(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=Ld[i];if(r===void 0&&(r=new Float32Array(i),Ld[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Be(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function ze(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function wl(s,t){let e=Fd[t];e===void 0&&(e=new Int32Array(t),Fd[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Wg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Xg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Be(e,t))return;s.uniform2fv(this.addr,t),ze(e,t)}}function qg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Be(e,t))return;s.uniform3fv(this.addr,t),ze(e,t)}}function Yg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Be(e,t))return;s.uniform4fv(this.addr,t),ze(e,t)}}function Zg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Be(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),ze(e,t)}else{if(Be(e,n))return;Od.set(n),s.uniformMatrix2fv(this.addr,!1,Od),ze(e,n)}}function $g(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Be(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),ze(e,t)}else{if(Be(e,n))return;Nd.set(n),s.uniformMatrix3fv(this.addr,!1,Nd),ze(e,n)}}function Jg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Be(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),ze(e,t)}else{if(Be(e,n))return;Ud.set(n),s.uniformMatrix4fv(this.addr,!1,Ud),ze(e,n)}}function Kg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Qg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Be(e,t))return;s.uniform2iv(this.addr,t),ze(e,t)}}function jg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Be(e,t))return;s.uniform3iv(this.addr,t),ze(e,t)}}function t_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Be(e,t))return;s.uniform4iv(this.addr,t),ze(e,t)}}function e_(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function n_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Be(e,t))return;s.uniform2uiv(this.addr,t),ze(e,t)}}function i_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Be(e,t))return;s.uniform3uiv(this.addr,t),ze(e,t)}}function s_(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Be(e,t))return;s.uniform4uiv(this.addr,t),ze(e,t)}}function r_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Dd.compareFunction=oh,r=Dd):r=Jd,e.setTexture2D(t||r,i)}function o_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Qd,i)}function a_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||jd,i)}function l_(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Kd,i)}function c_(s){switch(s){case 5126:return Wg;case 35664:return Xg;case 35665:return qg;case 35666:return Yg;case 35674:return Zg;case 35675:return $g;case 35676:return Jg;case 5124:case 35670:return Kg;case 35667:case 35671:return Qg;case 35668:case 35672:return jg;case 35669:case 35673:return t_;case 5125:return e_;case 36294:return n_;case 36295:return i_;case 36296:return s_;case 35678:case 36198:case 36298:case 36306:case 35682:return r_;case 35679:case 36299:case 36307:return o_;case 35680:case 36300:case 36308:case 36293:return a_;case 36289:case 36303:case 36311:case 36292:return l_}}function h_(s,t){s.uniform1fv(this.addr,t)}function u_(s,t){let e=or(t,this.size,2);s.uniform2fv(this.addr,e)}function d_(s,t){let e=or(t,this.size,3);s.uniform3fv(this.addr,e)}function f_(s,t){let e=or(t,this.size,4);s.uniform4fv(this.addr,e)}function p_(s,t){let e=or(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function m_(s,t){let e=or(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function g_(s,t){let e=or(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function __(s,t){s.uniform1iv(this.addr,t)}function x_(s,t){s.uniform2iv(this.addr,t)}function y_(s,t){s.uniform3iv(this.addr,t)}function v_(s,t){s.uniform4iv(this.addr,t)}function M_(s,t){s.uniform1uiv(this.addr,t)}function S_(s,t){s.uniform2uiv(this.addr,t)}function b_(s,t){s.uniform3uiv(this.addr,t)}function E_(s,t){s.uniform4uiv(this.addr,t)}function T_(s,t,e){let n=this.cache,i=t.length,r=wl(e,i);Be(n,r)||(s.uniform1iv(this.addr,r),ze(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||Jd,r[o])}function w_(s,t,e){let n=this.cache,i=t.length,r=wl(e,i);Be(n,r)||(s.uniform1iv(this.addr,r),ze(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Qd,r[o])}function A_(s,t,e){let n=this.cache,i=t.length,r=wl(e,i);Be(n,r)||(s.uniform1iv(this.addr,r),ze(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||jd,r[o])}function R_(s,t,e){let n=this.cache,i=t.length,r=wl(e,i);Be(n,r)||(s.uniform1iv(this.addr,r),ze(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Kd,r[o])}function C_(s){switch(s){case 5126:return h_;case 35664:return u_;case 35665:return d_;case 35666:return f_;case 35674:return p_;case 35675:return m_;case 35676:return g_;case 5124:case 35670:return __;case 35667:case 35671:return x_;case 35668:case 35672:return y_;case 35669:case 35673:return v_;case 5125:return M_;case 36294:return S_;case 36295:return b_;case 36296:return E_;case 35678:case 36198:case 36298:case 36306:case 35682:return T_;case 35679:case 36299:case 36307:return w_;case 35680:case 36300:case 36308:case 36293:return A_;case 36289:case 36303:case 36311:case 36292:return R_}}var vh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=c_(e.type)}},Mh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=C_(e.type)}},Sh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(t,e[a.id],n)}}},yh=/(\w+)(\])?(\[|\.)?/g;function Bd(s,t){s.seq.push(t),s.map[t.id]=t}function P_(s,t,e){let n=s.name,i=n.length;for(yh.lastIndex=0;;){let r=yh.exec(n),o=yh.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Bd(e,c===void 0?new vh(a,s,t):new Mh(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new Sh(a),Bd(e,u)),e=u}}}var sr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);P_(r,o,this)}}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function zd(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var I_=37297,D_=0;function L_(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var Hd=new Qt;function F_(s){le._getMatrix(Hd,le.workingColorSpace,s);let t=`mat3( ${Hd.elements.map(e=>e.toFixed(4))} )`;switch(le.getTransfer(s)){case Fr:return[t,"LinearTransferOETF"];case ge:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function kd(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+L_(s.getShaderSource(t),a)}else return r}function U_(s,t){let e=F_(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function N_(s,t){let e;switch(t){case ju:e="Linear";break;case td:e="Reinhard";break;case ed:e="Cineon";break;case Na:e="ACESFilmic";break;case id:e="AgX";break;case sd:e="Neutral";break;case nd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var El=new R;function O_(){le.getLuminanceCoefficients(El);let s=El.x.toFixed(4),t=El.y.toFixed(4),e=El.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function B_(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(go).join(`
`)}function z_(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function H_(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function go(s){return s!==""}function Gd(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Vd(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var k_=/^[ \t]*#include +<([\w\d./]+)>/gm;function bh(s){return s.replace(k_,V_)}var G_=new Map;function V_(s,t){let e=ee[t];if(e===void 0){let n=G_.get(t);if(n!==void 0)e=ee[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return bh(e)}var W_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wd(s){return s.replace(W_,X_)}function X_(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Xd(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}function q_(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Yc?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Ra?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===qn&&(t="SHADOWMAP_TYPE_VSM"),t}function Y_(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case os:case as:t="ENVMAP_TYPE_CUBE";break;case co:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Z_(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case as:t="ENVMAP_MODE_REFRACTION";break}return t}function $_(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Jc:t="ENVMAP_BLENDING_MULTIPLY";break;case Ku:t="ENVMAP_BLENDING_MIX";break;case Qu:t="ENVMAP_BLENDING_ADD";break}return t}function J_(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function K_(s,t,e,n){let i=s.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=q_(e),c=Y_(e),h=Z_(e),u=$_(e),d=J_(e),f=B_(e),g=z_(r),_=i.createProgram(),m,p,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(go).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(go).join(`
`),p.length>0&&(p+=`
`)):(m=[Xd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(go).join(`
`),p=[Xd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==yi?"#define TONE_MAPPING":"",e.toneMapping!==yi?ee.tonemapping_pars_fragment:"",e.toneMapping!==yi?N_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ee.colorspace_pars_fragment,U_("linearToOutputTexel",e.outputColorSpace),O_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(go).join(`
`)),o=bh(o),o=Gd(o,e),o=Vd(o,e),a=bh(a),a=Gd(a,e),a=Vd(a,e),o=Wd(o),a=Wd(a),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===ah?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ah?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let S=M+m+o,x=M+p+a,T=zd(i,i.VERTEX_SHADER,S),A=zd(i,i.FRAGMENT_SHADER,x);i.attachShader(_,T),i.attachShader(_,A),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function P(I){if(s.debug.checkShaderErrors){let F=i.getProgramInfoLog(_)||"",N=i.getShaderInfoLog(T)||"",G=i.getShaderInfoLog(A)||"",H=F.trim(),V=N.trim(),$=G.trim(),U=!0,tt=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(U=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,T,A);else{let lt=kd(i,T,"vertex"),st=kd(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+H+`
`+lt+`
`+st)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(V===""||$==="")&&(tt=!1);tt&&(I.diagnostics={runnable:U,programLog:H,vertexShader:{log:V,prefix:m},fragmentShader:{log:$,prefix:p}})}i.deleteShader(T),i.deleteShader(A),C=new sr(i,_),b=H_(i,_)}let C;this.getUniforms=function(){return C===void 0&&P(this),C};let b;this.getAttributes=function(){return b===void 0&&P(this),b};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=i.getProgramParameter(_,I_)),v},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=D_++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=A,this}var Q_=0,Eh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Th(t),e.set(t,n)),n}},Th=class{constructor(t){this.id=Q_++,this.code=t,this.usedTimes=0}};function j_(s,t,e,n,i,r,o){let a=new zr,l=new Eh,c=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures,f=i.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,v,I,F,N){let G=F.fog,H=N.geometry,V=b.isMeshStandardMaterial?F.environment:null,$=(b.isMeshStandardMaterial?e:t).get(b.envMap||V),U=$&&$.mapping===co?$.image.height:null,tt=g[b.type];b.precision!==null&&(f=i.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));let lt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,st=lt!==void 0?lt.length:0,xt=0;H.morphAttributes.position!==void 0&&(xt=1),H.morphAttributes.normal!==void 0&&(xt=2),H.morphAttributes.color!==void 0&&(xt=3);let Nt,It,At,k;if(tt){let ne=Zn[tt];Nt=ne.vertexShader,It=ne.fragmentShader}else Nt=b.vertexShader,It=b.fragmentShader,l.update(b),At=l.getVertexShaderID(b),k=l.getFragmentShaderID(b);let J=s.getRenderTarget(),yt=s.state.buffers.depth.getReversed(),Tt=N.isInstancedMesh===!0,St=N.isBatchedMesh===!0,Kt=!!b.map,ue=!!b.matcap,D=!!$,rt=!!b.aoMap,et=!!b.lightMap,Q=!!b.bumpMap,K=!!b.normalMap,mt=!!b.displacementMap,ct=!!b.emissiveMap,gt=!!b.metalnessMap,Jt=!!b.roughnessMap,Xt=b.anisotropy>0,w=b.clearcoat>0,y=b.dispersion>0,B=b.iridescence>0,Y=b.sheen>0,nt=b.transmission>0,Z=Xt&&!!b.anisotropyMap,Dt=w&&!!b.clearcoatMap,pt=w&&!!b.clearcoatNormalMap,Pt=w&&!!b.clearcoatRoughnessMap,Lt=B&&!!b.iridescenceMap,ht=B&&!!b.iridescenceThicknessMap,Mt=Y&&!!b.sheenColorMap,Ht=Y&&!!b.sheenRoughnessMap,Ot=!!b.specularMap,it=!!b.specularColorMap,Ft=!!b.specularIntensityMap,L=nt&&!!b.transmissionMap,W=nt&&!!b.thicknessMap,dt=!!b.gradientMap,bt=!!b.alphaMap,at=b.alphaTest>0,j=!!b.alphaHash,Ct=!!b.extensions,Yt=yi;b.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Yt=s.toneMapping);let fe={shaderID:tt,shaderType:b.type,shaderName:b.name,vertexShader:Nt,fragmentShader:It,defines:b.defines,customVertexShaderID:At,customFragmentShaderID:k,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:St,batchingColor:St&&N._colorsTexture!==null,instancing:Tt,instancingColor:Tt&&N.instanceColor!==null,instancingMorph:Tt&&N.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:J===null?s.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Qi,alphaToCoverage:!!b.alphaToCoverage,map:Kt,matcap:ue,envMap:D,envMapMode:D&&$.mapping,envMapCubeUVHeight:U,aoMap:rt,lightMap:et,bumpMap:Q,normalMap:K,displacementMap:d&&mt,emissiveMap:ct,normalMapObjectSpace:K&&b.normalMapType===ld,normalMapTangentSpace:K&&b.normalMapType===rh,metalnessMap:gt,roughnessMap:Jt,anisotropy:Xt,anisotropyMap:Z,clearcoat:w,clearcoatMap:Dt,clearcoatNormalMap:pt,clearcoatRoughnessMap:Pt,dispersion:y,iridescence:B,iridescenceMap:Lt,iridescenceThicknessMap:ht,sheen:Y,sheenColorMap:Mt,sheenRoughnessMap:Ht,specularMap:Ot,specularColorMap:it,specularIntensityMap:Ft,transmission:nt,transmissionMap:L,thicknessMap:W,gradientMap:dt,opaque:b.transparent===!1&&b.blending===di&&b.alphaToCoverage===!1,alphaMap:bt,alphaTest:at,alphaHash:j,combine:b.combine,mapUv:Kt&&_(b.map.channel),aoMapUv:rt&&_(b.aoMap.channel),lightMapUv:et&&_(b.lightMap.channel),bumpMapUv:Q&&_(b.bumpMap.channel),normalMapUv:K&&_(b.normalMap.channel),displacementMapUv:mt&&_(b.displacementMap.channel),emissiveMapUv:ct&&_(b.emissiveMap.channel),metalnessMapUv:gt&&_(b.metalnessMap.channel),roughnessMapUv:Jt&&_(b.roughnessMap.channel),anisotropyMapUv:Z&&_(b.anisotropyMap.channel),clearcoatMapUv:Dt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:pt&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pt&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Lt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:ht&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Mt&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Ht&&_(b.sheenRoughnessMap.channel),specularMapUv:Ot&&_(b.specularMap.channel),specularColorMapUv:it&&_(b.specularColorMap.channel),specularIntensityMapUv:Ft&&_(b.specularIntensityMap.channel),transmissionMapUv:L&&_(b.transmissionMap.channel),thicknessMapUv:W&&_(b.thicknessMap.channel),alphaMapUv:bt&&_(b.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(K||Xt),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!H.attributes.uv&&(Kt||bt),fog:!!G,useFog:b.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:yt,skinning:N.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:st,morphTextureStride:xt,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:Yt,decodeVideoTexture:Kt&&b.map.isVideoTexture===!0&&le.getTransfer(b.map.colorSpace)===ge,decodeVideoTextureEmissive:ct&&b.emissiveMap.isVideoTexture===!0&&le.getTransfer(b.emissiveMap.colorSpace)===ge,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Ue,flipSided:b.side===qe,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ct&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ct&&b.extensions.multiDraw===!0||St)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return fe.vertexUv1s=c.has(1),fe.vertexUv2s=c.has(2),fe.vertexUv3s=c.has(3),c.clear(),fe}function p(b){let v=[];if(b.shaderID?v.push(b.shaderID):(v.push(b.customVertexShaderID),v.push(b.customFragmentShaderID)),b.defines!==void 0)for(let I in b.defines)v.push(I),v.push(b.defines[I]);return b.isRawShaderMaterial===!1&&(M(v,b),S(v,b),v.push(s.outputColorSpace)),v.push(b.customProgramCacheKey),v.join()}function M(b,v){b.push(v.precision),b.push(v.outputColorSpace),b.push(v.envMapMode),b.push(v.envMapCubeUVHeight),b.push(v.mapUv),b.push(v.alphaMapUv),b.push(v.lightMapUv),b.push(v.aoMapUv),b.push(v.bumpMapUv),b.push(v.normalMapUv),b.push(v.displacementMapUv),b.push(v.emissiveMapUv),b.push(v.metalnessMapUv),b.push(v.roughnessMapUv),b.push(v.anisotropyMapUv),b.push(v.clearcoatMapUv),b.push(v.clearcoatNormalMapUv),b.push(v.clearcoatRoughnessMapUv),b.push(v.iridescenceMapUv),b.push(v.iridescenceThicknessMapUv),b.push(v.sheenColorMapUv),b.push(v.sheenRoughnessMapUv),b.push(v.specularMapUv),b.push(v.specularColorMapUv),b.push(v.specularIntensityMapUv),b.push(v.transmissionMapUv),b.push(v.thicknessMapUv),b.push(v.combine),b.push(v.fogExp2),b.push(v.sizeAttenuation),b.push(v.morphTargetsCount),b.push(v.morphAttributeCount),b.push(v.numDirLights),b.push(v.numPointLights),b.push(v.numSpotLights),b.push(v.numSpotLightMaps),b.push(v.numHemiLights),b.push(v.numRectAreaLights),b.push(v.numDirLightShadows),b.push(v.numPointLightShadows),b.push(v.numSpotLightShadows),b.push(v.numSpotLightShadowsWithMaps),b.push(v.numLightProbes),b.push(v.shadowMapType),b.push(v.toneMapping),b.push(v.numClippingPlanes),b.push(v.numClipIntersection),b.push(v.depthPacking)}function S(b,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),v.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reversedDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),b.push(a.mask)}function x(b){let v=g[b.type],I;if(v){let F=Zn[v];I=yd.clone(F.uniforms)}else I=b.uniforms;return I}function T(b,v){let I;for(let F=0,N=h.length;F<N;F++){let G=h[F];if(G.cacheKey===v){I=G,++I.usedTimes;break}}return I===void 0&&(I=new K_(s,v,b,r),h.push(I)),I}function A(b){if(--b.usedTimes===0){let v=h.indexOf(b);h[v]=h[h.length-1],h.pop(),b.destroy()}}function P(b){l.remove(b)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:T,releaseProgram:A,releaseShaderCache:P,programs:h,dispose:C}}function tx(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function ex(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function qd(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Yd(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u,d,f,g,_,m){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},s[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function a(u,d,f,g,_,m){let p=o(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):e.push(p)}function l(u,d,f,g,_,m){let p=o(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||ex),n.length>1&&n.sort(d||qd),i.length>1&&i.sort(d||qd)}function h(){for(let u=t,d=s.length;u<d;u++){let f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function nx(){let s=new WeakMap;function t(n,i){let r=s.get(n),o;return r===void 0?(o=new Yd,s.set(n,[o])):i>=r.length?(o=new Yd,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function ix(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new Bt};break;case"SpotLight":e={position:new R,direction:new R,color:new Bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new Bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new Bt,groundColor:new Bt};break;case"RectAreaLight":e={color:new Bt,position:new R,halfWidth:new R,halfHeight:new R};break}return s[t.id]=e,e}}}function sx(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var rx=0;function ox(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function ax(s){let t=new ix,e=sx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);let i=new R,r=new Vt,o=new Vt;function a(c){let h=0,u=0,d=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,M=0,S=0,x=0,T=0,A=0,P=0;c.sort(ox);for(let b=0,v=c.length;b<v;b++){let I=c[b],F=I.color,N=I.intensity,G=I.distance,H=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=F.r*N,u+=F.g*N,d+=F.b*N;else if(I.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(I.sh.coefficients[V],N);P++}else if(I.isDirectionalLight){let V=t.get(I);if(V.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let $=I.shadow,U=e.get(I);U.shadowIntensity=$.intensity,U.shadowBias=$.bias,U.shadowNormalBias=$.normalBias,U.shadowRadius=$.radius,U.shadowMapSize=$.mapSize,n.directionalShadow[f]=U,n.directionalShadowMap[f]=H,n.directionalShadowMatrix[f]=I.shadow.matrix,M++}n.directional[f]=V,f++}else if(I.isSpotLight){let V=t.get(I);V.position.setFromMatrixPosition(I.matrixWorld),V.color.copy(F).multiplyScalar(N),V.distance=G,V.coneCos=Math.cos(I.angle),V.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),V.decay=I.decay,n.spot[_]=V;let $=I.shadow;if(I.map&&(n.spotLightMap[T]=I.map,T++,$.updateMatrices(I),I.castShadow&&A++),n.spotLightMatrix[_]=$.matrix,I.castShadow){let U=e.get(I);U.shadowIntensity=$.intensity,U.shadowBias=$.bias,U.shadowNormalBias=$.normalBias,U.shadowRadius=$.radius,U.shadowMapSize=$.mapSize,n.spotShadow[_]=U,n.spotShadowMap[_]=H,x++}_++}else if(I.isRectAreaLight){let V=t.get(I);V.color.copy(F).multiplyScalar(N),V.halfWidth.set(I.width*.5,0,0),V.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=V,m++}else if(I.isPointLight){let V=t.get(I);if(V.color.copy(I.color).multiplyScalar(I.intensity),V.distance=I.distance,V.decay=I.decay,I.castShadow){let $=I.shadow,U=e.get(I);U.shadowIntensity=$.intensity,U.shadowBias=$.bias,U.shadowNormalBias=$.normalBias,U.shadowRadius=$.radius,U.shadowMapSize=$.mapSize,U.shadowCameraNear=$.camera.near,U.shadowCameraFar=$.camera.far,n.pointShadow[g]=U,n.pointShadowMap[g]=H,n.pointShadowMatrix[g]=I.shadow.matrix,S++}n.point[g]=V,g++}else if(I.isHemisphereLight){let V=t.get(I);V.skyColor.copy(I.color).multiplyScalar(N),V.groundColor.copy(I.groundColor).multiplyScalar(N),n.hemi[p]=V,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=vt.LTC_FLOAT_1,n.rectAreaLTC2=vt.LTC_FLOAT_2):(n.rectAreaLTC1=vt.LTC_HALF_1,n.rectAreaLTC2=vt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let C=n.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==M||C.numPointShadows!==S||C.numSpotShadows!==x||C.numSpotMaps!==T||C.numLightProbes!==P)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=x+T-A,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=P,C.directionalLength=f,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=M,C.numPointShadows=S,C.numSpotShadows=x,C.numSpotMaps=T,C.numLightProbes=P,n.version=rx++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0,m=h.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){let S=c[p];if(S.isDirectionalLight){let x=n.directional[u];x.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),u++}else if(S.isSpotLight){let x=n.spot[f];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),f++}else if(S.isRectAreaLight){let x=n.rectArea[g];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),o.identity(),r.copy(S.matrixWorld),r.premultiply(m),o.extractRotation(r),x.halfWidth.set(S.width*.5,0,0),x.halfHeight.set(0,S.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(S.isPointLight){let x=n.point[d];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),d++}else if(S.isHemisphereLight){let x=n.hemi[_];x.direction.setFromMatrixPosition(S.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function Zd(s){let t=new ax(s),e=[],n=[];function i(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}let c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function lx(s){let t=new WeakMap;function e(i,r=0){let o=t.get(i),a;return o===void 0?(a=new Zd(s),t.set(i,[a])):r>=o.length?(a=new Zd(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var cx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hx=`uniform sampler2D shadow_pass;
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
}`;function ux(s,t,e){let n=new Ys,i=new ot,r=new ot,o=new pe,a=new ma({depthPacking:ad}),l=new ga,c={},h=e.maxTextureSize,u={[ui]:qe,[qe]:ui,[Ue]:Ue},d=new _n({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:cx,fragmentShader:hx}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new ve;g.setAttribute("position",new Oe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new wt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Yc;let p=this.type;this.render=function(A,P,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let b=s.getRenderTarget(),v=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),F=s.state;F.setBlending(xi),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let N=p!==qn&&this.type===qn,G=p===qn&&this.type!==qn;for(let H=0,V=A.length;H<V;H++){let $=A[H],U=$.shadow;if(U===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;i.copy(U.mapSize);let tt=U.getFrameExtents();if(i.multiply(tt),r.copy(U.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/tt.x),i.x=r.x*tt.x,U.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/tt.y),i.y=r.y*tt.y,U.mapSize.y=r.y)),U.map===null||N===!0||G===!0){let st=this.type!==qn?{minFilter:on,magFilter:on}:{};U.map!==null&&U.map.dispose(),U.map=new Vn(i.x,i.y,st),U.map.texture.name=$.name+".shadowMap",U.camera.updateProjectionMatrix()}s.setRenderTarget(U.map),s.clear();let lt=U.getViewportCount();for(let st=0;st<lt;st++){let xt=U.getViewport(st);o.set(r.x*xt.x,r.y*xt.y,r.x*xt.z,r.y*xt.w),F.viewport(o),U.updateMatrices($,st),n=U.getFrustum(),x(P,C,U.camera,$,this.type)}U.isPointLightShadow!==!0&&this.type===qn&&M(U,C),U.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(b,v,I)};function M(A,P){let C=t.update(_);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Vn(i.x,i.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,s.setRenderTarget(A.mapPass),s.clear(),s.renderBufferDirect(P,null,C,d,_,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,s.setRenderTarget(A.map),s.clear(),s.renderBufferDirect(P,null,C,f,_,null)}function S(A,P,C,b){let v=null,I=C.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(I!==void 0)v=I;else if(v=C.isPointLight===!0?l:a,s.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let F=v.uuid,N=P.uuid,G=c[F];G===void 0&&(G={},c[F]=G);let H=G[N];H===void 0&&(H=v.clone(),G[N]=H,P.addEventListener("dispose",T)),v=H}if(v.visible=P.visible,v.wireframe=P.wireframe,b===qn?v.side=P.shadowSide!==null?P.shadowSide:P.side:v.side=P.shadowSide!==null?P.shadowSide:u[P.side],v.alphaMap=P.alphaMap,v.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,v.map=P.map,v.clipShadows=P.clipShadows,v.clippingPlanes=P.clippingPlanes,v.clipIntersection=P.clipIntersection,v.displacementMap=P.displacementMap,v.displacementScale=P.displacementScale,v.displacementBias=P.displacementBias,v.wireframeLinewidth=P.wireframeLinewidth,v.linewidth=P.linewidth,C.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let F=s.properties.get(v);F.light=C}return v}function x(A,P,C,b,v){if(A.visible===!1)return;if(A.layers.test(P.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&v===qn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,A.matrixWorld);let N=t.update(A),G=A.material;if(Array.isArray(G)){let H=N.groups;for(let V=0,$=H.length;V<$;V++){let U=H[V],tt=G[U.materialIndex];if(tt&&tt.visible){let lt=S(A,tt,b,v);A.onBeforeShadow(s,A,P,C,N,lt,U),s.renderBufferDirect(C,null,N,lt,A,U),A.onAfterShadow(s,A,P,C,N,lt,U)}}}else if(G.visible){let H=S(A,G,b,v);A.onBeforeShadow(s,A,P,C,N,H,null),s.renderBufferDirect(C,null,N,H,A,null),A.onAfterShadow(s,A,P,C,N,H,null)}}let F=A.children;for(let N=0,G=F.length;N<G;N++)x(F[N],P,C,b,v)}function T(A){A.target.removeEventListener("dispose",T);for(let C in c){let b=c[C],v=A.target.uuid;v in b&&(b[v].dispose(),delete b[v])}}}var dx={[Ca]:Pa,[Ia]:Fa,[Da]:Ua,[Ki]:La,[Pa]:Ca,[Fa]:Ia,[Ua]:Da,[La]:Ki};function fx(s,t){function e(){let L=!1,W=new pe,dt=null,bt=new pe(0,0,0,0);return{setMask:function(at){dt!==at&&!L&&(s.colorMask(at,at,at,at),dt=at)},setLocked:function(at){L=at},setClear:function(at,j,Ct,Yt,fe){fe===!0&&(at*=Yt,j*=Yt,Ct*=Yt),W.set(at,j,Ct,Yt),bt.equals(W)===!1&&(s.clearColor(at,j,Ct,Yt),bt.copy(W))},reset:function(){L=!1,dt=null,bt.set(-1,0,0,0)}}}function n(){let L=!1,W=!1,dt=null,bt=null,at=null;return{setReversed:function(j){if(W!==j){let Ct=t.get("EXT_clip_control");j?Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.ZERO_TO_ONE_EXT):Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.NEGATIVE_ONE_TO_ONE_EXT),W=j;let Yt=at;at=null,this.setClear(Yt)}},getReversed:function(){return W},setTest:function(j){j?J(s.DEPTH_TEST):yt(s.DEPTH_TEST)},setMask:function(j){dt!==j&&!L&&(s.depthMask(j),dt=j)},setFunc:function(j){if(W&&(j=dx[j]),bt!==j){switch(j){case Ca:s.depthFunc(s.NEVER);break;case Pa:s.depthFunc(s.ALWAYS);break;case Ia:s.depthFunc(s.LESS);break;case Ki:s.depthFunc(s.LEQUAL);break;case Da:s.depthFunc(s.EQUAL);break;case La:s.depthFunc(s.GEQUAL);break;case Fa:s.depthFunc(s.GREATER);break;case Ua:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}bt=j}},setLocked:function(j){L=j},setClear:function(j){at!==j&&(W&&(j=1-j),s.clearDepth(j),at=j)},reset:function(){L=!1,dt=null,bt=null,at=null,W=!1}}}function i(){let L=!1,W=null,dt=null,bt=null,at=null,j=null,Ct=null,Yt=null,fe=null;return{setTest:function(ne){L||(ne?J(s.STENCIL_TEST):yt(s.STENCIL_TEST))},setMask:function(ne){W!==ne&&!L&&(s.stencilMask(ne),W=ne)},setFunc:function(ne,Ge,Le){(dt!==ne||bt!==Ge||at!==Le)&&(s.stencilFunc(ne,Ge,Le),dt=ne,bt=Ge,at=Le)},setOp:function(ne,Ge,Le){(j!==ne||Ct!==Ge||Yt!==Le)&&(s.stencilOp(ne,Ge,Le),j=ne,Ct=Ge,Yt=Le)},setLocked:function(ne){L=ne},setClear:function(ne){fe!==ne&&(s.clearStencil(ne),fe=ne)},reset:function(){L=!1,W=null,dt=null,bt=null,at=null,j=null,Ct=null,Yt=null,fe=null}}}let r=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,M=null,S=null,x=null,T=null,A=null,P=new Bt(0,0,0),C=0,b=!1,v=null,I=null,F=null,N=null,G=null,H=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,$=0,U=s.getParameter(s.VERSION);U.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(U)[1]),V=$>=1):U.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(U)[1]),V=$>=2);let tt=null,lt={},st=s.getParameter(s.SCISSOR_BOX),xt=s.getParameter(s.VIEWPORT),Nt=new pe().fromArray(st),It=new pe().fromArray(xt);function At(L,W,dt,bt){let at=new Uint8Array(4),j=s.createTexture();s.bindTexture(L,j),s.texParameteri(L,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(L,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ct=0;Ct<dt;Ct++)L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY?s.texImage3D(W,0,s.RGBA,1,1,bt,0,s.RGBA,s.UNSIGNED_BYTE,at):s.texImage2D(W+Ct,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,at);return j}let k={};k[s.TEXTURE_2D]=At(s.TEXTURE_2D,s.TEXTURE_2D,1),k[s.TEXTURE_CUBE_MAP]=At(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),k[s.TEXTURE_2D_ARRAY]=At(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),k[s.TEXTURE_3D]=At(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),J(s.DEPTH_TEST),o.setFunc(Ki),Q(!1),K(qc),J(s.CULL_FACE),rt(xi);function J(L){h[L]!==!0&&(s.enable(L),h[L]=!0)}function yt(L){h[L]!==!1&&(s.disable(L),h[L]=!1)}function Tt(L,W){return u[L]!==W?(s.bindFramebuffer(L,W),u[L]=W,L===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=W),L===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=W),!0):!1}function St(L,W){let dt=f,bt=!1;if(L){dt=d.get(W),dt===void 0&&(dt=[],d.set(W,dt));let at=L.textures;if(dt.length!==at.length||dt[0]!==s.COLOR_ATTACHMENT0){for(let j=0,Ct=at.length;j<Ct;j++)dt[j]=s.COLOR_ATTACHMENT0+j;dt.length=at.length,bt=!0}}else dt[0]!==s.BACK&&(dt[0]=s.BACK,bt=!0);bt&&s.drawBuffers(dt)}function Kt(L){return g!==L?(s.useProgram(L),g=L,!0):!1}let ue={[Pi]:s.FUNC_ADD,[Fu]:s.FUNC_SUBTRACT,[Uu]:s.FUNC_REVERSE_SUBTRACT};ue[Nu]=s.MIN,ue[Ou]=s.MAX;let D={[Bu]:s.ZERO,[zu]:s.ONE,[Hu]:s.SRC_COLOR,[Jo]:s.SRC_ALPHA,[qu]:s.SRC_ALPHA_SATURATE,[Wu]:s.DST_COLOR,[Gu]:s.DST_ALPHA,[ku]:s.ONE_MINUS_SRC_COLOR,[Ko]:s.ONE_MINUS_SRC_ALPHA,[Xu]:s.ONE_MINUS_DST_COLOR,[Vu]:s.ONE_MINUS_DST_ALPHA,[Yu]:s.CONSTANT_COLOR,[Zu]:s.ONE_MINUS_CONSTANT_COLOR,[$u]:s.CONSTANT_ALPHA,[Ju]:s.ONE_MINUS_CONSTANT_ALPHA};function rt(L,W,dt,bt,at,j,Ct,Yt,fe,ne){if(L===xi){_===!0&&(yt(s.BLEND),_=!1);return}if(_===!1&&(J(s.BLEND),_=!0),L!==Lu){if(L!==m||ne!==b){if((p!==Pi||x!==Pi)&&(s.blendEquation(s.FUNC_ADD),p=Pi,x=Pi),ne)switch(L){case di:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ye:s.blendFunc(s.ONE,s.ONE);break;case Zc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case $c:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case di:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ye:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Zc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case $c:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}M=null,S=null,T=null,A=null,P.set(0,0,0),C=0,m=L,b=ne}return}at=at||W,j=j||dt,Ct=Ct||bt,(W!==p||at!==x)&&(s.blendEquationSeparate(ue[W],ue[at]),p=W,x=at),(dt!==M||bt!==S||j!==T||Ct!==A)&&(s.blendFuncSeparate(D[dt],D[bt],D[j],D[Ct]),M=dt,S=bt,T=j,A=Ct),(Yt.equals(P)===!1||fe!==C)&&(s.blendColor(Yt.r,Yt.g,Yt.b,fe),P.copy(Yt),C=fe),m=L,b=!1}function et(L,W){L.side===Ue?yt(s.CULL_FACE):J(s.CULL_FACE);let dt=L.side===qe;W&&(dt=!dt),Q(dt),L.blending===di&&L.transparent===!1?rt(xi):rt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),o.setFunc(L.depthFunc),o.setTest(L.depthTest),o.setMask(L.depthWrite),r.setMask(L.colorWrite);let bt=L.stencilWrite;a.setTest(bt),bt&&(a.setMask(L.stencilWriteMask),a.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),a.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),ct(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?J(s.SAMPLE_ALPHA_TO_COVERAGE):yt(s.SAMPLE_ALPHA_TO_COVERAGE)}function Q(L){v!==L&&(L?s.frontFace(s.CW):s.frontFace(s.CCW),v=L)}function K(L){L!==Iu?(J(s.CULL_FACE),L!==I&&(L===qc?s.cullFace(s.BACK):L===Du?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):yt(s.CULL_FACE),I=L}function mt(L){L!==F&&(V&&s.lineWidth(L),F=L)}function ct(L,W,dt){L?(J(s.POLYGON_OFFSET_FILL),(N!==W||G!==dt)&&(s.polygonOffset(W,dt),N=W,G=dt)):yt(s.POLYGON_OFFSET_FILL)}function gt(L){L?J(s.SCISSOR_TEST):yt(s.SCISSOR_TEST)}function Jt(L){L===void 0&&(L=s.TEXTURE0+H-1),tt!==L&&(s.activeTexture(L),tt=L)}function Xt(L,W,dt){dt===void 0&&(tt===null?dt=s.TEXTURE0+H-1:dt=tt);let bt=lt[dt];bt===void 0&&(bt={type:void 0,texture:void 0},lt[dt]=bt),(bt.type!==L||bt.texture!==W)&&(tt!==dt&&(s.activeTexture(dt),tt=dt),s.bindTexture(L,W||k[L]),bt.type=L,bt.texture=W)}function w(){let L=lt[tt];L!==void 0&&L.type!==void 0&&(s.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function y(){try{s.compressedTexImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function B(){try{s.compressedTexImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Y(){try{s.texSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function nt(){try{s.texSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Z(){try{s.compressedTexSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Dt(){try{s.compressedTexSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function pt(){try{s.texStorage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Pt(){try{s.texStorage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Lt(){try{s.texImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ht(){try{s.texImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Mt(L){Nt.equals(L)===!1&&(s.scissor(L.x,L.y,L.z,L.w),Nt.copy(L))}function Ht(L){It.equals(L)===!1&&(s.viewport(L.x,L.y,L.z,L.w),It.copy(L))}function Ot(L,W){let dt=c.get(W);dt===void 0&&(dt=new WeakMap,c.set(W,dt));let bt=dt.get(L);bt===void 0&&(bt=s.getUniformBlockIndex(W,L.name),dt.set(L,bt))}function it(L,W){let bt=c.get(W).get(L);l.get(W)!==bt&&(s.uniformBlockBinding(W,bt,L.__bindingPointIndex),l.set(W,bt))}function Ft(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},tt=null,lt={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,M=null,S=null,x=null,T=null,A=null,P=new Bt(0,0,0),C=0,b=!1,v=null,I=null,F=null,N=null,G=null,Nt.set(0,0,s.canvas.width,s.canvas.height),It.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:J,disable:yt,bindFramebuffer:Tt,drawBuffers:St,useProgram:Kt,setBlending:rt,setMaterial:et,setFlipSided:Q,setCullFace:K,setLineWidth:mt,setPolygonOffset:ct,setScissorTest:gt,activeTexture:Jt,bindTexture:Xt,unbindTexture:w,compressedTexImage2D:y,compressedTexImage3D:B,texImage2D:Lt,texImage3D:ht,updateUBOMapping:Ot,uniformBlockBinding:it,texStorage2D:pt,texStorage3D:Pt,texSubImage2D:Y,texSubImage3D:nt,compressedTexSubImage2D:Z,compressedTexSubImage3D:Dt,scissor:Mt,viewport:Ht,reset:Ft}}function px(s,t,e,n,i,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ot,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(w){}function g(w,y){return f?new OffscreenCanvas(w,y):Nr("canvas")}function _(w,y,B){let Y=1,nt=Xt(w);if((nt.width>B||nt.height>B)&&(Y=B/Math.max(nt.width,nt.height)),Y<1)if(typeof HTMLImageElement!="undefined"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&w instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&w instanceof ImageBitmap||typeof VideoFrame!="undefined"&&w instanceof VideoFrame){let Z=Math.floor(Y*nt.width),Dt=Math.floor(Y*nt.height);u===void 0&&(u=g(Z,Dt));let pt=y?g(Z,Dt):u;return pt.width=Z,pt.height=Dt,pt.getContext("2d").drawImage(w,0,0,Z,Dt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+Z+"x"+Dt+")."),pt}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),w;return w}function m(w){return w.generateMipmaps}function p(w){s.generateMipmap(w)}function M(w){return w.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?s.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function S(w,y,B,Y,nt=!1){if(w!==null){if(s[w]!==void 0)return s[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Z=y;if(y===s.RED&&(B===s.FLOAT&&(Z=s.R32F),B===s.HALF_FLOAT&&(Z=s.R16F),B===s.UNSIGNED_BYTE&&(Z=s.R8)),y===s.RED_INTEGER&&(B===s.UNSIGNED_BYTE&&(Z=s.R8UI),B===s.UNSIGNED_SHORT&&(Z=s.R16UI),B===s.UNSIGNED_INT&&(Z=s.R32UI),B===s.BYTE&&(Z=s.R8I),B===s.SHORT&&(Z=s.R16I),B===s.INT&&(Z=s.R32I)),y===s.RG&&(B===s.FLOAT&&(Z=s.RG32F),B===s.HALF_FLOAT&&(Z=s.RG16F),B===s.UNSIGNED_BYTE&&(Z=s.RG8)),y===s.RG_INTEGER&&(B===s.UNSIGNED_BYTE&&(Z=s.RG8UI),B===s.UNSIGNED_SHORT&&(Z=s.RG16UI),B===s.UNSIGNED_INT&&(Z=s.RG32UI),B===s.BYTE&&(Z=s.RG8I),B===s.SHORT&&(Z=s.RG16I),B===s.INT&&(Z=s.RG32I)),y===s.RGB_INTEGER&&(B===s.UNSIGNED_BYTE&&(Z=s.RGB8UI),B===s.UNSIGNED_SHORT&&(Z=s.RGB16UI),B===s.UNSIGNED_INT&&(Z=s.RGB32UI),B===s.BYTE&&(Z=s.RGB8I),B===s.SHORT&&(Z=s.RGB16I),B===s.INT&&(Z=s.RGB32I)),y===s.RGBA_INTEGER&&(B===s.UNSIGNED_BYTE&&(Z=s.RGBA8UI),B===s.UNSIGNED_SHORT&&(Z=s.RGBA16UI),B===s.UNSIGNED_INT&&(Z=s.RGBA32UI),B===s.BYTE&&(Z=s.RGBA8I),B===s.SHORT&&(Z=s.RGBA16I),B===s.INT&&(Z=s.RGBA32I)),y===s.RGB&&(B===s.UNSIGNED_INT_5_9_9_9_REV&&(Z=s.RGB9_E5),B===s.UNSIGNED_INT_10F_11F_11F_REV&&(Z=s.R11F_G11F_B10F)),y===s.RGBA){let Dt=nt?Fr:le.getTransfer(Y);B===s.FLOAT&&(Z=s.RGBA32F),B===s.HALF_FLOAT&&(Z=s.RGBA16F),B===s.UNSIGNED_BYTE&&(Z=Dt===ge?s.SRGB8_ALPHA8:s.RGBA8),B===s.UNSIGNED_SHORT_4_4_4_4&&(Z=s.RGBA4),B===s.UNSIGNED_SHORT_5_5_5_1&&(Z=s.RGB5_A1)}return(Z===s.R16F||Z===s.R32F||Z===s.RG16F||Z===s.RG32F||Z===s.RGBA16F||Z===s.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function x(w,y){let B;return w?y===null||y===Ni||y===tr?B=s.DEPTH24_STENCIL8:y===Bn?B=s.DEPTH32F_STENCIL8:y===Qs&&(B=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Ni||y===tr?B=s.DEPTH_COMPONENT24:y===Bn?B=s.DEPTH_COMPONENT32F:y===Qs&&(B=s.DEPTH_COMPONENT16),B}function T(w,y){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==on&&w.minFilter!==mn?Math.log2(Math.max(y.width,y.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?y.mipmaps.length:1}function A(w){let y=w.target;y.removeEventListener("dispose",A),C(y),y.isVideoTexture&&h.delete(y)}function P(w){let y=w.target;y.removeEventListener("dispose",P),v(y)}function C(w){let y=n.get(w);if(y.__webglInit===void 0)return;let B=w.source,Y=d.get(B);if(Y){let nt=Y[y.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&b(w),Object.keys(Y).length===0&&d.delete(B)}n.remove(w)}function b(w){let y=n.get(w);s.deleteTexture(y.__webglTexture);let B=w.source,Y=d.get(B);delete Y[y.__cacheKey],o.memory.textures--}function v(w){let y=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(y.__webglFramebuffer[Y]))for(let nt=0;nt<y.__webglFramebuffer[Y].length;nt++)s.deleteFramebuffer(y.__webglFramebuffer[Y][nt]);else s.deleteFramebuffer(y.__webglFramebuffer[Y]);y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer[Y])}else{if(Array.isArray(y.__webglFramebuffer))for(let Y=0;Y<y.__webglFramebuffer.length;Y++)s.deleteFramebuffer(y.__webglFramebuffer[Y]);else s.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&s.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let Y=0;Y<y.__webglColorRenderbuffer.length;Y++)y.__webglColorRenderbuffer[Y]&&s.deleteRenderbuffer(y.__webglColorRenderbuffer[Y]);y.__webglDepthRenderbuffer&&s.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let B=w.textures;for(let Y=0,nt=B.length;Y<nt;Y++){let Z=n.get(B[Y]);Z.__webglTexture&&(s.deleteTexture(Z.__webglTexture),o.memory.textures--),n.remove(B[Y])}n.remove(w)}let I=0;function F(){I=0}function N(){let w=I;return w>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+i.maxTextures),I+=1,w}function G(w){let y=[];return y.push(w.wrapS),y.push(w.wrapT),y.push(w.wrapR||0),y.push(w.magFilter),y.push(w.minFilter),y.push(w.anisotropy),y.push(w.internalFormat),y.push(w.format),y.push(w.type),y.push(w.generateMipmaps),y.push(w.premultiplyAlpha),y.push(w.flipY),y.push(w.unpackAlignment),y.push(w.colorSpace),y.join()}function H(w,y){let B=n.get(w);if(w.isVideoTexture&&gt(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&B.__version!==w.version){let Y=w.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{k(B,w,y);return}}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,B.__webglTexture,s.TEXTURE0+y)}function V(w,y){let B=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){k(B,w,y);return}e.bindTexture(s.TEXTURE_2D_ARRAY,B.__webglTexture,s.TEXTURE0+y)}function $(w,y){let B=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){k(B,w,y);return}e.bindTexture(s.TEXTURE_3D,B.__webglTexture,s.TEXTURE0+y)}function U(w,y){let B=n.get(w);if(w.version>0&&B.__version!==w.version){J(B,w,y);return}e.bindTexture(s.TEXTURE_CUBE_MAP,B.__webglTexture,s.TEXTURE0+y)}let tt={[fi]:s.REPEAT,[Ci]:s.CLAMP_TO_EDGE,[Qo]:s.MIRRORED_REPEAT},lt={[on]:s.NEAREST,[rd]:s.NEAREST_MIPMAP_NEAREST,[ho]:s.NEAREST_MIPMAP_LINEAR,[mn]:s.LINEAR,[za]:s.LINEAR_MIPMAP_NEAREST,[Yn]:s.LINEAR_MIPMAP_LINEAR},st={[cd]:s.NEVER,[md]:s.ALWAYS,[hd]:s.LESS,[oh]:s.LEQUAL,[ud]:s.EQUAL,[pd]:s.GEQUAL,[dd]:s.GREATER,[fd]:s.NOTEQUAL};function xt(w,y){if(y.type===Bn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===mn||y.magFilter===za||y.magFilter===ho||y.magFilter===Yn||y.minFilter===mn||y.minFilter===za||y.minFilter===ho||y.minFilter===Yn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(w,s.TEXTURE_WRAP_S,tt[y.wrapS]),s.texParameteri(w,s.TEXTURE_WRAP_T,tt[y.wrapT]),(w===s.TEXTURE_3D||w===s.TEXTURE_2D_ARRAY)&&s.texParameteri(w,s.TEXTURE_WRAP_R,tt[y.wrapR]),s.texParameteri(w,s.TEXTURE_MAG_FILTER,lt[y.magFilter]),s.texParameteri(w,s.TEXTURE_MIN_FILTER,lt[y.minFilter]),y.compareFunction&&(s.texParameteri(w,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(w,s.TEXTURE_COMPARE_FUNC,st[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===on||y.minFilter!==ho&&y.minFilter!==Yn||y.type===Bn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){let B=t.get("EXT_texture_filter_anisotropic");s.texParameterf(w,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Nt(w,y){let B=!1;w.__webglInit===void 0&&(w.__webglInit=!0,y.addEventListener("dispose",A));let Y=y.source,nt=d.get(Y);nt===void 0&&(nt={},d.set(Y,nt));let Z=G(y);if(Z!==w.__cacheKey){nt[Z]===void 0&&(nt[Z]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,B=!0),nt[Z].usedTimes++;let Dt=nt[w.__cacheKey];Dt!==void 0&&(nt[w.__cacheKey].usedTimes--,Dt.usedTimes===0&&b(y)),w.__cacheKey=Z,w.__webglTexture=nt[Z].texture}return B}function It(w,y,B){return Math.floor(Math.floor(w/B)/y)}function At(w,y,B,Y){let Z=w.updateRanges;if(Z.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,y.width,y.height,B,Y,y.data);else{Z.sort((ht,Mt)=>ht.start-Mt.start);let Dt=0;for(let ht=1;ht<Z.length;ht++){let Mt=Z[Dt],Ht=Z[ht],Ot=Mt.start+Mt.count,it=It(Ht.start,y.width,4),Ft=It(Mt.start,y.width,4);Ht.start<=Ot+1&&it===Ft&&It(Ht.start+Ht.count-1,y.width,4)===it?Mt.count=Math.max(Mt.count,Ht.start+Ht.count-Mt.start):(++Dt,Z[Dt]=Ht)}Z.length=Dt+1;let pt=s.getParameter(s.UNPACK_ROW_LENGTH),Pt=s.getParameter(s.UNPACK_SKIP_PIXELS),Lt=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,y.width);for(let ht=0,Mt=Z.length;ht<Mt;ht++){let Ht=Z[ht],Ot=Math.floor(Ht.start/4),it=Math.ceil(Ht.count/4),Ft=Ot%y.width,L=Math.floor(Ot/y.width),W=it,dt=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,Ft),s.pixelStorei(s.UNPACK_SKIP_ROWS,L),e.texSubImage2D(s.TEXTURE_2D,0,Ft,L,W,dt,B,Y,y.data)}w.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,pt),s.pixelStorei(s.UNPACK_SKIP_PIXELS,Pt),s.pixelStorei(s.UNPACK_SKIP_ROWS,Lt)}}function k(w,y,B){let Y=s.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(Y=s.TEXTURE_2D_ARRAY),y.isData3DTexture&&(Y=s.TEXTURE_3D);let nt=Nt(w,y),Z=y.source;e.bindTexture(Y,w.__webglTexture,s.TEXTURE0+B);let Dt=n.get(Z);if(Z.version!==Dt.__version||nt===!0){e.activeTexture(s.TEXTURE0+B);let pt=le.getPrimaries(le.workingColorSpace),Pt=y.colorSpace===zn?null:le.getPrimaries(y.colorSpace),Lt=y.colorSpace===zn||pt===Pt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Lt);let ht=_(y.image,!1,i.maxTextureSize);ht=Jt(y,ht);let Mt=r.convert(y.format,y.colorSpace),Ht=r.convert(y.type),Ot=S(y.internalFormat,Mt,Ht,y.colorSpace,y.isVideoTexture);xt(Y,y);let it,Ft=y.mipmaps,L=y.isVideoTexture!==!0,W=Dt.__version===void 0||nt===!0,dt=Z.dataReady,bt=T(y,ht);if(y.isDepthTexture)Ot=x(y.format===er,y.type),W&&(L?e.texStorage2D(s.TEXTURE_2D,1,Ot,ht.width,ht.height):e.texImage2D(s.TEXTURE_2D,0,Ot,ht.width,ht.height,0,Mt,Ht,null));else if(y.isDataTexture)if(Ft.length>0){L&&W&&e.texStorage2D(s.TEXTURE_2D,bt,Ot,Ft[0].width,Ft[0].height);for(let at=0,j=Ft.length;at<j;at++)it=Ft[at],L?dt&&e.texSubImage2D(s.TEXTURE_2D,at,0,0,it.width,it.height,Mt,Ht,it.data):e.texImage2D(s.TEXTURE_2D,at,Ot,it.width,it.height,0,Mt,Ht,it.data);y.generateMipmaps=!1}else L?(W&&e.texStorage2D(s.TEXTURE_2D,bt,Ot,ht.width,ht.height),dt&&At(y,ht,Mt,Ht)):e.texImage2D(s.TEXTURE_2D,0,Ot,ht.width,ht.height,0,Mt,Ht,ht.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){L&&W&&e.texStorage3D(s.TEXTURE_2D_ARRAY,bt,Ot,Ft[0].width,Ft[0].height,ht.depth);for(let at=0,j=Ft.length;at<j;at++)if(it=Ft[at],y.format!==wn)if(Mt!==null)if(L){if(dt)if(y.layerUpdates.size>0){let Ct=fh(it.width,it.height,y.format,y.type);for(let Yt of y.layerUpdates){let fe=it.data.subarray(Yt*Ct/it.data.BYTES_PER_ELEMENT,(Yt+1)*Ct/it.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,at,0,0,Yt,it.width,it.height,1,Mt,fe)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,at,0,0,0,it.width,it.height,ht.depth,Mt,it.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,at,Ot,it.width,it.height,ht.depth,0,it.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?dt&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,at,0,0,0,it.width,it.height,ht.depth,Mt,Ht,it.data):e.texImage3D(s.TEXTURE_2D_ARRAY,at,Ot,it.width,it.height,ht.depth,0,Mt,Ht,it.data)}else{L&&W&&e.texStorage2D(s.TEXTURE_2D,bt,Ot,Ft[0].width,Ft[0].height);for(let at=0,j=Ft.length;at<j;at++)it=Ft[at],y.format!==wn?Mt!==null?L?dt&&e.compressedTexSubImage2D(s.TEXTURE_2D,at,0,0,it.width,it.height,Mt,it.data):e.compressedTexImage2D(s.TEXTURE_2D,at,Ot,it.width,it.height,0,it.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?dt&&e.texSubImage2D(s.TEXTURE_2D,at,0,0,it.width,it.height,Mt,Ht,it.data):e.texImage2D(s.TEXTURE_2D,at,Ot,it.width,it.height,0,Mt,Ht,it.data)}else if(y.isDataArrayTexture)if(L){if(W&&e.texStorage3D(s.TEXTURE_2D_ARRAY,bt,Ot,ht.width,ht.height,ht.depth),dt)if(y.layerUpdates.size>0){let at=fh(ht.width,ht.height,y.format,y.type);for(let j of y.layerUpdates){let Ct=ht.data.subarray(j*at/ht.data.BYTES_PER_ELEMENT,(j+1)*at/ht.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,j,ht.width,ht.height,1,Mt,Ht,Ct)}y.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ht.width,ht.height,ht.depth,Mt,Ht,ht.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Ot,ht.width,ht.height,ht.depth,0,Mt,Ht,ht.data);else if(y.isData3DTexture)L?(W&&e.texStorage3D(s.TEXTURE_3D,bt,Ot,ht.width,ht.height,ht.depth),dt&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ht.width,ht.height,ht.depth,Mt,Ht,ht.data)):e.texImage3D(s.TEXTURE_3D,0,Ot,ht.width,ht.height,ht.depth,0,Mt,Ht,ht.data);else if(y.isFramebufferTexture){if(W)if(L)e.texStorage2D(s.TEXTURE_2D,bt,Ot,ht.width,ht.height);else{let at=ht.width,j=ht.height;for(let Ct=0;Ct<bt;Ct++)e.texImage2D(s.TEXTURE_2D,Ct,Ot,at,j,0,Mt,Ht,null),at>>=1,j>>=1}}else if(Ft.length>0){if(L&&W){let at=Xt(Ft[0]);e.texStorage2D(s.TEXTURE_2D,bt,Ot,at.width,at.height)}for(let at=0,j=Ft.length;at<j;at++)it=Ft[at],L?dt&&e.texSubImage2D(s.TEXTURE_2D,at,0,0,Mt,Ht,it):e.texImage2D(s.TEXTURE_2D,at,Ot,Mt,Ht,it);y.generateMipmaps=!1}else if(L){if(W){let at=Xt(ht);e.texStorage2D(s.TEXTURE_2D,bt,Ot,at.width,at.height)}dt&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,Mt,Ht,ht)}else e.texImage2D(s.TEXTURE_2D,0,Ot,Mt,Ht,ht);m(y)&&p(Y),Dt.__version=Z.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function J(w,y,B){if(y.image.length!==6)return;let Y=Nt(w,y),nt=y.source;e.bindTexture(s.TEXTURE_CUBE_MAP,w.__webglTexture,s.TEXTURE0+B);let Z=n.get(nt);if(nt.version!==Z.__version||Y===!0){e.activeTexture(s.TEXTURE0+B);let Dt=le.getPrimaries(le.workingColorSpace),pt=y.colorSpace===zn?null:le.getPrimaries(y.colorSpace),Pt=y.colorSpace===zn||Dt===pt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);let Lt=y.isCompressedTexture||y.image[0].isCompressedTexture,ht=y.image[0]&&y.image[0].isDataTexture,Mt=[];for(let j=0;j<6;j++)!Lt&&!ht?Mt[j]=_(y.image[j],!0,i.maxCubemapSize):Mt[j]=ht?y.image[j].image:y.image[j],Mt[j]=Jt(y,Mt[j]);let Ht=Mt[0],Ot=r.convert(y.format,y.colorSpace),it=r.convert(y.type),Ft=S(y.internalFormat,Ot,it,y.colorSpace),L=y.isVideoTexture!==!0,W=Z.__version===void 0||Y===!0,dt=nt.dataReady,bt=T(y,Ht);xt(s.TEXTURE_CUBE_MAP,y);let at;if(Lt){L&&W&&e.texStorage2D(s.TEXTURE_CUBE_MAP,bt,Ft,Ht.width,Ht.height);for(let j=0;j<6;j++){at=Mt[j].mipmaps;for(let Ct=0;Ct<at.length;Ct++){let Yt=at[Ct];y.format!==wn?Ot!==null?L?dt&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ct,0,0,Yt.width,Yt.height,Ot,Yt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ct,Ft,Yt.width,Yt.height,0,Yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?dt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ct,0,0,Yt.width,Yt.height,Ot,it,Yt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ct,Ft,Yt.width,Yt.height,0,Ot,it,Yt.data)}}}else{if(at=y.mipmaps,L&&W){at.length>0&&bt++;let j=Xt(Mt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,bt,Ft,j.width,j.height)}for(let j=0;j<6;j++)if(ht){L?dt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Mt[j].width,Mt[j].height,Ot,it,Mt[j].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ft,Mt[j].width,Mt[j].height,0,Ot,it,Mt[j].data);for(let Ct=0;Ct<at.length;Ct++){let fe=at[Ct].image[j].image;L?dt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ct+1,0,0,fe.width,fe.height,Ot,it,fe.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ct+1,Ft,fe.width,fe.height,0,Ot,it,fe.data)}}else{L?dt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Ot,it,Mt[j]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ft,Ot,it,Mt[j]);for(let Ct=0;Ct<at.length;Ct++){let Yt=at[Ct];L?dt&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ct+1,0,0,Ot,it,Yt.image[j]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ct+1,Ft,Ot,it,Yt.image[j])}}}m(y)&&p(s.TEXTURE_CUBE_MAP),Z.__version=nt.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function yt(w,y,B,Y,nt,Z){let Dt=r.convert(B.format,B.colorSpace),pt=r.convert(B.type),Pt=S(B.internalFormat,Dt,pt,B.colorSpace),Lt=n.get(y),ht=n.get(B);if(ht.__renderTarget=y,!Lt.__hasExternalTextures){let Mt=Math.max(1,y.width>>Z),Ht=Math.max(1,y.height>>Z);nt===s.TEXTURE_3D||nt===s.TEXTURE_2D_ARRAY?e.texImage3D(nt,Z,Pt,Mt,Ht,y.depth,0,Dt,pt,null):e.texImage2D(nt,Z,Pt,Mt,Ht,0,Dt,pt,null)}e.bindFramebuffer(s.FRAMEBUFFER,w),ct(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Y,nt,ht.__webglTexture,0,mt(y)):(nt===s.TEXTURE_2D||nt>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Y,nt,ht.__webglTexture,Z),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Tt(w,y,B){if(s.bindRenderbuffer(s.RENDERBUFFER,w),y.depthBuffer){let Y=y.depthTexture,nt=Y&&Y.isDepthTexture?Y.type:null,Z=x(y.stencilBuffer,nt),Dt=y.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,pt=mt(y);ct(y)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,pt,Z,y.width,y.height):B?s.renderbufferStorageMultisample(s.RENDERBUFFER,pt,Z,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,Z,y.width,y.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Dt,s.RENDERBUFFER,w)}else{let Y=y.textures;for(let nt=0;nt<Y.length;nt++){let Z=Y[nt],Dt=r.convert(Z.format,Z.colorSpace),pt=r.convert(Z.type),Pt=S(Z.internalFormat,Dt,pt,Z.colorSpace),Lt=mt(y);B&&ct(y)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Lt,Pt,y.width,y.height):ct(y)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Lt,Pt,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,Pt,y.width,y.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function St(w,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,w),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Y=n.get(y.depthTexture);Y.__renderTarget=y,(!Y.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),H(y.depthTexture,0);let nt=Y.__webglTexture,Z=mt(y);if(y.depthTexture.format===Vs)ct(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,nt,0,Z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,nt,0);else if(y.depthTexture.format===er)ct(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,nt,0,Z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,nt,0);else throw new Error("Unknown depthTexture format")}function Kt(w){let y=n.get(w),B=w.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==w.depthTexture){let Y=w.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),Y){let nt=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,Y.removeEventListener("dispose",nt)};Y.addEventListener("dispose",nt),y.__depthDisposeCallback=nt}y.__boundDepthTexture=Y}if(w.depthTexture&&!y.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");let Y=w.texture.mipmaps;Y&&Y.length>0?St(y.__webglFramebuffer[0],w):St(y.__webglFramebuffer,w)}else if(B){y.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[Y]),y.__webglDepthbuffer[Y]===void 0)y.__webglDepthbuffer[Y]=s.createRenderbuffer(),Tt(y.__webglDepthbuffer[Y],w,!1);else{let nt=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Z=y.__webglDepthbuffer[Y];s.bindRenderbuffer(s.RENDERBUFFER,Z),s.framebufferRenderbuffer(s.FRAMEBUFFER,nt,s.RENDERBUFFER,Z)}}else{let Y=w.texture.mipmaps;if(Y&&Y.length>0?e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=s.createRenderbuffer(),Tt(y.__webglDepthbuffer,w,!1);else{let nt=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Z=y.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,Z),s.framebufferRenderbuffer(s.FRAMEBUFFER,nt,s.RENDERBUFFER,Z)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function ue(w,y,B){let Y=n.get(w);y!==void 0&&yt(Y.__webglFramebuffer,w,w.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),B!==void 0&&Kt(w)}function D(w){let y=w.texture,B=n.get(w),Y=n.get(y);w.addEventListener("dispose",P);let nt=w.textures,Z=w.isWebGLCubeRenderTarget===!0,Dt=nt.length>1;if(Dt||(Y.__webglTexture===void 0&&(Y.__webglTexture=s.createTexture()),Y.__version=y.version,o.memory.textures++),Z){B.__webglFramebuffer=[];for(let pt=0;pt<6;pt++)if(y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer[pt]=[];for(let Pt=0;Pt<y.mipmaps.length;Pt++)B.__webglFramebuffer[pt][Pt]=s.createFramebuffer()}else B.__webglFramebuffer[pt]=s.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer=[];for(let pt=0;pt<y.mipmaps.length;pt++)B.__webglFramebuffer[pt]=s.createFramebuffer()}else B.__webglFramebuffer=s.createFramebuffer();if(Dt)for(let pt=0,Pt=nt.length;pt<Pt;pt++){let Lt=n.get(nt[pt]);Lt.__webglTexture===void 0&&(Lt.__webglTexture=s.createTexture(),o.memory.textures++)}if(w.samples>0&&ct(w)===!1){B.__webglMultisampledFramebuffer=s.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let pt=0;pt<nt.length;pt++){let Pt=nt[pt];B.__webglColorRenderbuffer[pt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,B.__webglColorRenderbuffer[pt]);let Lt=r.convert(Pt.format,Pt.colorSpace),ht=r.convert(Pt.type),Mt=S(Pt.internalFormat,Lt,ht,Pt.colorSpace,w.isXRRenderTarget===!0),Ht=mt(w);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ht,Mt,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pt,s.RENDERBUFFER,B.__webglColorRenderbuffer[pt])}s.bindRenderbuffer(s.RENDERBUFFER,null),w.depthBuffer&&(B.__webglDepthRenderbuffer=s.createRenderbuffer(),Tt(B.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Z){e.bindTexture(s.TEXTURE_CUBE_MAP,Y.__webglTexture),xt(s.TEXTURE_CUBE_MAP,y);for(let pt=0;pt<6;pt++)if(y.mipmaps&&y.mipmaps.length>0)for(let Pt=0;Pt<y.mipmaps.length;Pt++)yt(B.__webglFramebuffer[pt][Pt],w,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Pt);else yt(B.__webglFramebuffer[pt],w,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0);m(y)&&p(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Dt){for(let pt=0,Pt=nt.length;pt<Pt;pt++){let Lt=nt[pt],ht=n.get(Lt),Mt=s.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Mt=w.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Mt,ht.__webglTexture),xt(Mt,Lt),yt(B.__webglFramebuffer,w,Lt,s.COLOR_ATTACHMENT0+pt,Mt,0),m(Lt)&&p(Mt)}e.unbindTexture()}else{let pt=s.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(pt=w.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(pt,Y.__webglTexture),xt(pt,y),y.mipmaps&&y.mipmaps.length>0)for(let Pt=0;Pt<y.mipmaps.length;Pt++)yt(B.__webglFramebuffer[Pt],w,y,s.COLOR_ATTACHMENT0,pt,Pt);else yt(B.__webglFramebuffer,w,y,s.COLOR_ATTACHMENT0,pt,0);m(y)&&p(pt),e.unbindTexture()}w.depthBuffer&&Kt(w)}function rt(w){let y=w.textures;for(let B=0,Y=y.length;B<Y;B++){let nt=y[B];if(m(nt)){let Z=M(w),Dt=n.get(nt).__webglTexture;e.bindTexture(Z,Dt),p(Z),e.unbindTexture()}}}let et=[],Q=[];function K(w){if(w.samples>0){if(ct(w)===!1){let y=w.textures,B=w.width,Y=w.height,nt=s.COLOR_BUFFER_BIT,Z=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Dt=n.get(w),pt=y.length>1;if(pt)for(let Lt=0;Lt<y.length;Lt++)e.bindFramebuffer(s.FRAMEBUFFER,Dt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Lt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,Dt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Lt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,Dt.__webglMultisampledFramebuffer);let Pt=w.texture.mipmaps;Pt&&Pt.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Dt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Dt.__webglFramebuffer);for(let Lt=0;Lt<y.length;Lt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(nt|=s.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(nt|=s.STENCIL_BUFFER_BIT)),pt){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Dt.__webglColorRenderbuffer[Lt]);let ht=n.get(y[Lt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ht,0)}s.blitFramebuffer(0,0,B,Y,0,0,B,Y,nt,s.NEAREST),l===!0&&(et.length=0,Q.length=0,et.push(s.COLOR_ATTACHMENT0+Lt),w.depthBuffer&&w.resolveDepthBuffer===!1&&(et.push(Z),Q.push(Z),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Q)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,et))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),pt)for(let Lt=0;Lt<y.length;Lt++){e.bindFramebuffer(s.FRAMEBUFFER,Dt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Lt,s.RENDERBUFFER,Dt.__webglColorRenderbuffer[Lt]);let ht=n.get(y[Lt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,Dt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Lt,s.TEXTURE_2D,ht,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Dt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){let y=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[y])}}}function mt(w){return Math.min(i.maxSamples,w.samples)}function ct(w){let y=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function gt(w){let y=o.render.frame;h.get(w)!==y&&(h.set(w,y),w.update())}function Jt(w,y){let B=w.colorSpace,Y=w.format,nt=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||B!==Qi&&B!==zn&&(le.getTransfer(B)===ge?(Y!==wn||nt!==On)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),y}function Xt(w){return typeof HTMLImageElement!="undefined"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame!="undefined"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=F,this.setTexture2D=H,this.setTexture2DArray=V,this.setTexture3D=$,this.setTextureCube=U,this.rebindTextures=ue,this.setupRenderTarget=D,this.updateRenderTargetMipmap=rt,this.updateMultisampleRenderTarget=K,this.setupDepthRenderbuffer=Kt,this.setupFrameBufferTexture=yt,this.useMultisampledRTT=ct}function mx(s,t){function e(n,i=zn){let r,o=le.getTransfer(i);if(n===On)return s.UNSIGNED_BYTE;if(n===ka)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Ga)return s.UNSIGNED_SHORT_5_5_5_1;if(n===th)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===eh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Qc)return s.BYTE;if(n===jc)return s.SHORT;if(n===Qs)return s.UNSIGNED_SHORT;if(n===Ha)return s.INT;if(n===Ni)return s.UNSIGNED_INT;if(n===Bn)return s.FLOAT;if(n===js)return s.HALF_FLOAT;if(n===nh)return s.ALPHA;if(n===ih)return s.RGB;if(n===wn)return s.RGBA;if(n===Vs)return s.DEPTH_COMPONENT;if(n===er)return s.DEPTH_STENCIL;if(n===Va)return s.RED;if(n===Wa)return s.RED_INTEGER;if(n===sh)return s.RG;if(n===Xa)return s.RG_INTEGER;if(n===qa)return s.RGBA_INTEGER;if(n===uo||n===fo||n===po||n===mo)if(o===ge)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===uo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===fo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===po)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===mo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===uo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===fo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===po)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===mo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ya||n===Za||n===$a||n===Ja)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ya)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Za)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===$a)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ja)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ka||n===Qa||n===ja)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ka||n===Qa)return o===ge?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ja)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===tl||n===el||n===nl||n===il||n===sl||n===rl||n===ol||n===al||n===ll||n===cl||n===hl||n===ul||n===dl||n===fl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===tl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===el)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===nl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===il)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===sl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===rl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ol)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===al)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ll)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===cl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===hl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ul)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===dl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===fl)return o===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===pl||n===ml||n===gl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===pl)return o===ge?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ml)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===gl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===_l||n===xl||n===yl||n===vl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===_l)return r.COMPRESSED_RED_RGTC1_EXT;if(n===xl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===yl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===vl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===tr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var gx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_x=`
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

}`,wh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new $r(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new _n({vertexShader:gx,fragmentShader:_x,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new wt(new Me(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ah=class extends pi{constructor(t,e){super();let n=this,i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null,_=typeof XRWebGLBinding!="undefined",m=new wh,p={},M=e.getContextAttributes(),S=null,x=null,T=[],A=[],P=new ot,C=null,b=new We;b.viewport=new pe;let v=new We;v.viewport=new pe;let I=[b,v],F=new Aa,N=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let J=T[k];return J===void 0&&(J=new qs,T[k]=J),J.getTargetRaySpace()},this.getControllerGrip=function(k){let J=T[k];return J===void 0&&(J=new qs,T[k]=J),J.getGripSpace()},this.getHand=function(k){let J=T[k];return J===void 0&&(J=new qs,T[k]=J),J.getHandSpace()};function H(k){let J=A.indexOf(k.inputSource);if(J===-1)return;let yt=T[J];yt!==void 0&&(yt.update(k.inputSource,k.frame,c||o),yt.dispatchEvent({type:k.type,data:k.inputSource}))}function V(){i.removeEventListener("select",H),i.removeEventListener("selectstart",H),i.removeEventListener("selectend",H),i.removeEventListener("squeeze",H),i.removeEventListener("squeezestart",H),i.removeEventListener("squeezeend",H),i.removeEventListener("end",V),i.removeEventListener("inputsourceschange",$);for(let k=0;k<T.length;k++){let J=A[k];J!==null&&(A[k]=null,T[k].disconnect(J))}N=null,G=null,m.reset();for(let k in p)delete p[k];t.setRenderTarget(S),f=null,d=null,u=null,i=null,x=null,At.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){r=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){a=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(k){c=k},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(i,e)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(k){if(i=k,i!==null){if(S=t.getRenderTarget(),i.addEventListener("select",H),i.addEventListener("selectstart",H),i.addEventListener("selectend",H),i.addEventListener("squeeze",H),i.addEventListener("squeezestart",H),i.addEventListener("squeezeend",H),i.addEventListener("end",V),i.addEventListener("inputsourceschange",$),M.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(P),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let yt=null,Tt=null,St=null;M.depth&&(St=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,yt=M.stencil?er:Vs,Tt=M.stencil?tr:Ni);let Kt={colorFormat:e.RGBA8,depthFormat:St,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Kt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new Vn(d.textureWidth,d.textureHeight,{format:wn,type:On,depthTexture:new Zr(d.textureWidth,d.textureHeight,Tt,void 0,void 0,void 0,void 0,void 0,void 0,yt),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let yt={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,yt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Vn(f.framebufferWidth,f.framebufferHeight,{format:wn,type:On,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),At.setContext(i),At.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function $(k){for(let J=0;J<k.removed.length;J++){let yt=k.removed[J],Tt=A.indexOf(yt);Tt>=0&&(A[Tt]=null,T[Tt].disconnect(yt))}for(let J=0;J<k.added.length;J++){let yt=k.added[J],Tt=A.indexOf(yt);if(Tt===-1){for(let Kt=0;Kt<T.length;Kt++)if(Kt>=A.length){A.push(yt),Tt=Kt;break}else if(A[Kt]===null){A[Kt]=yt,Tt=Kt;break}if(Tt===-1)break}let St=T[Tt];St&&St.connect(yt)}}let U=new R,tt=new R;function lt(k,J,yt){U.setFromMatrixPosition(J.matrixWorld),tt.setFromMatrixPosition(yt.matrixWorld);let Tt=U.distanceTo(tt),St=J.projectionMatrix.elements,Kt=yt.projectionMatrix.elements,ue=St[14]/(St[10]-1),D=St[14]/(St[10]+1),rt=(St[9]+1)/St[5],et=(St[9]-1)/St[5],Q=(St[8]-1)/St[0],K=(Kt[8]+1)/Kt[0],mt=ue*Q,ct=ue*K,gt=Tt/(-Q+K),Jt=gt*-Q;if(J.matrixWorld.decompose(k.position,k.quaternion,k.scale),k.translateX(Jt),k.translateZ(gt),k.matrixWorld.compose(k.position,k.quaternion,k.scale),k.matrixWorldInverse.copy(k.matrixWorld).invert(),St[10]===-1)k.projectionMatrix.copy(J.projectionMatrix),k.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{let Xt=ue+gt,w=D+gt,y=mt-Jt,B=ct+(Tt-Jt),Y=rt*D/w*Xt,nt=et*D/w*Xt;k.projectionMatrix.makePerspective(y,B,Y,nt,Xt,w),k.projectionMatrixInverse.copy(k.projectionMatrix).invert()}}function st(k,J){J===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(J.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(i===null)return;let J=k.near,yt=k.far;m.texture!==null&&(m.depthNear>0&&(J=m.depthNear),m.depthFar>0&&(yt=m.depthFar)),F.near=v.near=b.near=J,F.far=v.far=b.far=yt,(N!==F.near||G!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),N=F.near,G=F.far),F.layers.mask=k.layers.mask|6,b.layers.mask=F.layers.mask&3,v.layers.mask=F.layers.mask&5;let Tt=k.parent,St=F.cameras;st(F,Tt);for(let Kt=0;Kt<St.length;Kt++)st(St[Kt],Tt);St.length===2?lt(F,b,v):F.projectionMatrix.copy(b.projectionMatrix),xt(k,F,Tt)};function xt(k,J,yt){yt===null?k.matrix.copy(J.matrixWorld):(k.matrix.copy(yt.matrixWorld),k.matrix.invert(),k.matrix.multiply(J.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(J.projectionMatrix),k.projectionMatrixInverse.copy(J.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=ea*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(k){l=k,d!==null&&(d.fixedFoveation=k),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=k)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(k){return p[k]};let Nt=null;function It(k,J){if(h=J.getViewerPose(c||o),g=J,h!==null){let yt=h.views;f!==null&&(t.setRenderTargetFramebuffer(x,f.framebuffer),t.setRenderTarget(x));let Tt=!1;yt.length!==F.cameras.length&&(F.cameras.length=0,Tt=!0);for(let D=0;D<yt.length;D++){let rt=yt[D],et=null;if(f!==null)et=f.getViewport(rt);else{let K=u.getViewSubImage(d,rt);et=K.viewport,D===0&&(t.setRenderTargetTextures(x,K.colorTexture,K.depthStencilTexture),t.setRenderTarget(x))}let Q=I[D];Q===void 0&&(Q=new We,Q.layers.enable(D),Q.viewport=new pe,I[D]=Q),Q.matrix.fromArray(rt.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(rt.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(et.x,et.y,et.width,et.height),D===0&&(F.matrix.copy(Q.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Tt===!0&&F.cameras.push(Q)}let St=i.enabledFeatures;if(St&&St.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let D=u.getDepthInformation(yt[0]);D&&D.isValid&&D.texture&&m.init(D,i.renderState)}if(St&&St.includes("camera-access")&&_){t.state.unbindTexture(),u=n.getBinding();for(let D=0;D<yt.length;D++){let rt=yt[D].camera;if(rt){let et=p[rt];et||(et=new $r,p[rt]=et);let Q=u.getCameraImage(rt);et.sourceTexture=Q}}}}for(let yt=0;yt<T.length;yt++){let Tt=A[yt],St=T[yt];Tt!==null&&St!==void 0&&St.update(Tt,J,c||o)}Nt&&Nt(k,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}let At=new $d;At.setAnimationLoop(It),this.setAnimationLoop=function(k){Nt=k},this.dispose=function(){}}},hs=new gn,xx=new Vt;function yx(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,ch(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,M,S,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,M,S):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===qe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===qe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let M=t.get(p),S=M.envMap,x=M.envMapRotation;S&&(m.envMap.value=S,hs.copy(x),hs.x*=-1,hs.y*=-1,hs.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(hs.y*=-1,hs.z*=-1),m.envMapRotation.value.setFromMatrix4(xx.makeRotationFromEuler(hs)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=S*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===qe&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let M=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function vx(s,t,e,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,S){let x=S.program;n.uniformBlockBinding(M,x)}function c(M,S){let x=i[M.id];x===void 0&&(g(M),x=h(M),i[M.id]=x,M.addEventListener("dispose",m));let T=S.program;n.updateUBOMapping(M,T);let A=t.render.frame;r[M.id]!==A&&(d(M),r[M.id]=A)}function h(M){let S=u();M.__bindingPointIndex=S;let x=s.createBuffer(),T=M.__size,A=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,x),s.bufferData(s.UNIFORM_BUFFER,T,A),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,S,x),x}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){let S=i[M.id],x=M.uniforms,T=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,S);for(let A=0,P=x.length;A<P;A++){let C=Array.isArray(x[A])?x[A]:[x[A]];for(let b=0,v=C.length;b<v;b++){let I=C[b];if(f(I,A,b,T)===!0){let F=I.__offset,N=Array.isArray(I.value)?I.value:[I.value],G=0;for(let H=0;H<N.length;H++){let V=N[H],$=_(V);typeof V=="number"||typeof V=="boolean"?(I.__data[0]=V,s.bufferSubData(s.UNIFORM_BUFFER,F+G,I.__data)):V.isMatrix3?(I.__data[0]=V.elements[0],I.__data[1]=V.elements[1],I.__data[2]=V.elements[2],I.__data[3]=0,I.__data[4]=V.elements[3],I.__data[5]=V.elements[4],I.__data[6]=V.elements[5],I.__data[7]=0,I.__data[8]=V.elements[6],I.__data[9]=V.elements[7],I.__data[10]=V.elements[8],I.__data[11]=0):(V.toArray(I.__data,G),G+=$.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,F,I.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,S,x,T){let A=M.value,P=S+"_"+x;if(T[P]===void 0)return typeof A=="number"||typeof A=="boolean"?T[P]=A:T[P]=A.clone(),!0;{let C=T[P];if(typeof A=="number"||typeof A=="boolean"){if(C!==A)return T[P]=A,!0}else if(C.equals(A)===!1)return C.copy(A),!0}return!1}function g(M){let S=M.uniforms,x=0,T=16;for(let P=0,C=S.length;P<C;P++){let b=Array.isArray(S[P])?S[P]:[S[P]];for(let v=0,I=b.length;v<I;v++){let F=b[v],N=Array.isArray(F.value)?F.value:[F.value];for(let G=0,H=N.length;G<H;G++){let V=N[G],$=_(V),U=x%T,tt=U%$.boundary,lt=U+tt;x+=tt,lt!==0&&T-lt<$.storage&&(x+=T-lt),F.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=x,x+=$.storage}}}let A=x%T;return A>0&&(x+=T-A),M.__size=x,M.__cache={},this}function _(M){let S={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(S.boundary=4,S.storage=4):M.isVector2?(S.boundary=8,S.storage=8):M.isVector3||M.isColor?(S.boundary=16,S.storage=12):M.isVector4?(S.boundary=16,S.storage=16):M.isMatrix3?(S.boundary=48,S.storage=48):M.isMatrix4?(S.boundary=64,S.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),S}function m(M){let S=M.target;S.removeEventListener("dispose",m);let x=o.indexOf(S.__bindingPointIndex);o.splice(x,1),s.deleteBuffer(i[S.id]),delete i[S.id],delete r[S.id]}function p(){for(let M in i)s.deleteBuffer(i[M]);o=[],i={},r={}}return{bind:l,update:c,dispose:p}}var Tl=class{constructor(t={}){let{canvas:e=gd(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,p=null,M=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=yi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let x=this,T=!1;this._outputColorSpace=Ve;let A=0,P=0,C=null,b=-1,v=null,I=new pe,F=new pe,N=null,G=new Bt(0),H=0,V=e.width,$=e.height,U=1,tt=null,lt=null,st=new pe(0,0,V,$),xt=new pe(0,0,V,$),Nt=!1,It=new Ys,At=!1,k=!1,J=new Vt,yt=new R,Tt=new pe,St={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Kt=!1;function ue(){return C===null?U:1}let D=n;function rt(E,O){return e.getContext(E,O)}try{let E={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",dt,!1),e.addEventListener("webglcontextrestored",bt,!1),e.addEventListener("webglcontextcreationerror",at,!1),D===null){let O="webgl2";if(D=rt(O,E),D===null)throw rt(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let et,Q,K,mt,ct,gt,Jt,Xt,w,y,B,Y,nt,Z,Dt,pt,Pt,Lt,ht,Mt,Ht,Ot,it,Ft;function L(){et=new Bg(D),et.init(),Ot=new mx(D,et),Q=new Ig(D,et,t,Ot),K=new fx(D,et),Q.reversedDepthBuffer&&d&&K.buffers.depth.setReversed(!0),mt=new kg(D),ct=new tx,gt=new px(D,et,K,ct,Q,Ot,mt),Jt=new Lg(x),Xt=new Og(x),w=new Yp(D),it=new Cg(D,w),y=new zg(D,w,mt,it),B=new Vg(D,y,w,mt),ht=new Gg(D,Q,gt),pt=new Dg(ct),Y=new j_(x,Jt,Xt,et,Q,it,pt),nt=new yx(x,ct),Z=new nx,Dt=new lx(et),Lt=new Rg(x,Jt,Xt,K,B,f,l),Pt=new ux(x,B,Q),Ft=new vx(D,mt,Q,K),Mt=new Pg(D,et,mt),Ht=new Hg(D,et,mt),mt.programs=Y.programs,x.capabilities=Q,x.extensions=et,x.properties=ct,x.renderLists=Z,x.shadowMap=Pt,x.state=K,x.info=mt}L();let W=new Ah(x,D);this.xr=W,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let E=et.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=et.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return U},this.setPixelRatio=function(E){E!==void 0&&(U=E,this.setSize(V,$,!1))},this.getSize=function(E){return E.set(V,$)},this.setSize=function(E,O,X=!0){if(W.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=E,$=O,e.width=Math.floor(E*U),e.height=Math.floor(O*U),X===!0&&(e.style.width=E+"px",e.style.height=O+"px"),this.setViewport(0,0,E,O)},this.getDrawingBufferSize=function(E){return E.set(V*U,$*U).floor()},this.setDrawingBufferSize=function(E,O,X){V=E,$=O,U=X,e.width=Math.floor(E*X),e.height=Math.floor(O*X),this.setViewport(0,0,E,O)},this.getCurrentViewport=function(E){return E.copy(I)},this.getViewport=function(E){return E.copy(st)},this.setViewport=function(E,O,X,q){E.isVector4?st.set(E.x,E.y,E.z,E.w):st.set(E,O,X,q),K.viewport(I.copy(st).multiplyScalar(U).round())},this.getScissor=function(E){return E.copy(xt)},this.setScissor=function(E,O,X,q){E.isVector4?xt.set(E.x,E.y,E.z,E.w):xt.set(E,O,X,q),K.scissor(F.copy(xt).multiplyScalar(U).round())},this.getScissorTest=function(){return Nt},this.setScissorTest=function(E){K.setScissorTest(Nt=E)},this.setOpaqueSort=function(E){tt=E},this.setTransparentSort=function(E){lt=E},this.getClearColor=function(E){return E.copy(Lt.getClearColor())},this.setClearColor=function(){Lt.setClearColor(...arguments)},this.getClearAlpha=function(){return Lt.getClearAlpha()},this.setClearAlpha=function(){Lt.setClearAlpha(...arguments)},this.clear=function(E=!0,O=!0,X=!0){let q=0;if(E){let z=!1;if(C!==null){let ut=C.texture.format;z=ut===qa||ut===Xa||ut===Wa}if(z){let ut=C.texture.type,Et=ut===On||ut===Ni||ut===Qs||ut===tr||ut===ka||ut===Ga,Ut=Lt.getClearColor(),Rt=Lt.getClearAlpha(),Gt=Ut.r,Zt=Ut.g,zt=Ut.b;Et?(g[0]=Gt,g[1]=Zt,g[2]=zt,g[3]=Rt,D.clearBufferuiv(D.COLOR,0,g)):(_[0]=Gt,_[1]=Zt,_[2]=zt,_[3]=Rt,D.clearBufferiv(D.COLOR,0,_))}else q|=D.COLOR_BUFFER_BIT}O&&(q|=D.DEPTH_BUFFER_BIT),X&&(q|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",dt,!1),e.removeEventListener("webglcontextrestored",bt,!1),e.removeEventListener("webglcontextcreationerror",at,!1),Lt.dispose(),Z.dispose(),Dt.dispose(),ct.dispose(),Jt.dispose(),Xt.dispose(),B.dispose(),it.dispose(),Ft.dispose(),Y.dispose(),W.dispose(),W.removeEventListener("sessionstart",Le),W.removeEventListener("sessionend",Ms),Pn.stop()};function dt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function bt(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let E=mt.autoReset,O=Pt.enabled,X=Pt.autoUpdate,q=Pt.needsUpdate,z=Pt.type;L(),mt.autoReset=E,Pt.enabled=O,Pt.autoUpdate=X,Pt.needsUpdate=q,Pt.type=z}function at(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function j(E){let O=E.target;O.removeEventListener("dispose",j),Ct(O)}function Ct(E){Yt(E),ct.remove(E)}function Yt(E){let O=ct.get(E).programs;O!==void 0&&(O.forEach(function(X){Y.releaseProgram(X)}),E.isShaderMaterial&&Y.releaseShaderCache(E))}this.renderBufferDirect=function(E,O,X,q,z,ut){O===null&&(O=St);let Et=z.isMesh&&z.matrixWorld.determinant()<0,Ut=bs(E,O,X,q,z);K.setMaterial(q,Et);let Rt=X.index,Gt=1;if(q.wireframe===!0){if(Rt=y.getWireframeAttribute(X),Rt===void 0)return;Gt=2}let Zt=X.drawRange,zt=X.attributes.position,se=Zt.start*Gt,_e=(Zt.start+Zt.count)*Gt;ut!==null&&(se=Math.max(se,ut.start*Gt),_e=Math.min(_e,(ut.start+ut.count)*Gt)),Rt!==null?(se=Math.max(se,0),_e=Math.min(_e,Rt.count)):zt!=null&&(se=Math.max(se,0),_e=Math.min(_e,zt.count));let Pe=_e-se;if(Pe<0||Pe===1/0)return;it.setup(z,q,Ut,X,Rt);let Ee,ye=Mt;if(Rt!==null&&(Ee=w.get(Rt),ye=Ht,ye.setIndex(Ee)),z.isMesh)q.wireframe===!0?(K.setLineWidth(q.wireframeLinewidth*ue()),ye.setMode(D.LINES)):ye.setMode(D.TRIANGLES);else if(z.isLine){let kt=q.linewidth;kt===void 0&&(kt=1),K.setLineWidth(kt*ue()),z.isLineSegments?ye.setMode(D.LINES):z.isLineLoop?ye.setMode(D.LINE_LOOP):ye.setMode(D.LINE_STRIP)}else z.isPoints?ye.setMode(D.POINTS):z.isSprite&&ye.setMode(D.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)Ws("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ye.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(et.get("WEBGL_multi_draw"))ye.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let kt=z._multiDrawStarts,Ae=z._multiDrawCounts,ce=z._multiDrawCount,un=Rt?w.get(Rt).bytesPerElement:1,Es=ct.get(q).currentProgram.getUniforms();for(let dn=0;dn<ce;dn++)Es.setValue(D,"_gl_DrawID",dn),ye.render(kt[dn]/un,Ae[dn])}else if(z.isInstancedMesh)ye.renderInstances(se,Pe,z.count);else if(X.isInstancedBufferGeometry){let kt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Ae=Math.min(X.instanceCount,kt);ye.renderInstances(se,Pe,Ae)}else ye.render(se,Pe)};function fe(E,O,X){E.transparent===!0&&E.side===Ue&&E.forceSinglePass===!1?(E.side=qe,E.needsUpdate=!0,Ss(E,O,X),E.side=ui,E.needsUpdate=!0,Ss(E,O,X),E.side=Ue):Ss(E,O,X)}this.compile=function(E,O,X=null){X===null&&(X=E),p=Dt.get(X),p.init(O),S.push(p),X.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),E!==X&&E.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();let q=new Set;return E.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let ut=z.material;if(ut)if(Array.isArray(ut))for(let Et=0;Et<ut.length;Et++){let Ut=ut[Et];fe(Ut,X,z),q.add(Ut)}else fe(ut,X,z),q.add(ut)}),p=S.pop(),q},this.compileAsync=function(E,O,X=null){let q=this.compile(E,O,X);return new Promise(z=>{function ut(){if(q.forEach(function(Et){ct.get(Et).currentProgram.isReady()&&q.delete(Et)}),q.size===0){z(E);return}setTimeout(ut,10)}et.get("KHR_parallel_shader_compile")!==null?ut():setTimeout(ut,10)})};let ne=null;function Ge(E){ne&&ne(E)}function Le(){Pn.stop()}function Ms(){Pn.start()}let Pn=new $d;Pn.setAnimationLoop(Ge),typeof self!="undefined"&&Pn.setContext(self),this.setAnimationLoop=function(E){ne=E,W.setAnimationLoop(E),E===null?Pn.stop():Pn.start()},W.addEventListener("sessionstart",Le),W.addEventListener("sessionend",Ms),this.render=function(E,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),W.enabled===!0&&W.isPresenting===!0&&(W.cameraAutoUpdate===!0&&W.updateCamera(O),O=W.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,O,C),p=Dt.get(E,S.length),p.init(O),S.push(p),J.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),It.setFromProjectionMatrix(J,Fn,O.reversedDepth),k=this.localClippingEnabled,At=pt.init(this.clippingPlanes,k),m=Z.get(E,M.length),m.init(),M.push(m),W.enabled===!0&&W.isPresenting===!0){let ut=x.xr.getDepthSensingMesh();ut!==null&&ki(ut,O,-1/0,x.sortObjects)}ki(E,O,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(tt,lt),Kt=W.enabled===!1||W.isPresenting===!1||W.hasDepthSensing()===!1,Kt&&Lt.addToRenderList(m,E),this.info.render.frame++,At===!0&&pt.beginShadows();let X=p.state.shadowsArray;Pt.render(X,E,O),At===!0&&pt.endShadows(),this.info.autoReset===!0&&this.info.reset();let q=m.opaque,z=m.transmissive;if(p.setupLights(),O.isArrayCamera){let ut=O.cameras;if(z.length>0)for(let Et=0,Ut=ut.length;Et<Ut;Et++){let Rt=ut[Et];Vi(q,z,E,Rt)}Kt&&Lt.render(E);for(let Et=0,Ut=ut.length;Et<Ut;Et++){let Rt=ut[Et];Gi(m,E,Rt,Rt.viewport)}}else z.length>0&&Vi(q,z,E,O),Kt&&Lt.render(E),Gi(m,E,O);C!==null&&P===0&&(gt.updateMultisampleRenderTarget(C),gt.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(x,E,O),it.resetDefaultState(),b=-1,v=null,S.pop(),S.length>0?(p=S[S.length-1],At===!0&&pt.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function ki(E,O,X,q){if(E.visible===!1)return;if(E.layers.test(O.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(O);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||It.intersectsSprite(E)){q&&Tt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(J);let Et=B.update(E),Ut=E.material;Ut.visible&&m.push(E,Et,Ut,X,Tt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||It.intersectsObject(E))){let Et=B.update(E),Ut=E.material;if(q&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Tt.copy(E.boundingSphere.center)):(Et.boundingSphere===null&&Et.computeBoundingSphere(),Tt.copy(Et.boundingSphere.center)),Tt.applyMatrix4(E.matrixWorld).applyMatrix4(J)),Array.isArray(Ut)){let Rt=Et.groups;for(let Gt=0,Zt=Rt.length;Gt<Zt;Gt++){let zt=Rt[Gt],se=Ut[zt.materialIndex];se&&se.visible&&m.push(E,Et,se,X,Tt.z,zt)}}else Ut.visible&&m.push(E,Et,Ut,X,Tt.z,null)}}let ut=E.children;for(let Et=0,Ut=ut.length;Et<Ut;Et++)ki(ut[Et],O,X,q)}function Gi(E,O,X,q){let z=E.opaque,ut=E.transmissive,Et=E.transparent;p.setupLightsView(X),At===!0&&pt.setGlobalState(x.clippingPlanes,X),q&&K.viewport(I.copy(q)),z.length>0&&ni(z,O,X),ut.length>0&&ni(ut,O,X),Et.length>0&&ni(Et,O,X),K.buffers.depth.setTest(!0),K.buffers.depth.setMask(!0),K.buffers.color.setMask(!0),K.setPolygonOffset(!1)}function Vi(E,O,X,q){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[q.id]===void 0&&(p.state.transmissionRenderTarget[q.id]=new Vn(1,1,{generateMipmaps:!0,type:et.has("EXT_color_buffer_half_float")||et.has("EXT_color_buffer_float")?js:On,minFilter:Yn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:le.workingColorSpace}));let ut=p.state.transmissionRenderTarget[q.id],Et=q.viewport||I;ut.setSize(Et.z*x.transmissionResolutionScale,Et.w*x.transmissionResolutionScale);let Ut=x.getRenderTarget(),Rt=x.getActiveCubeFace(),Gt=x.getActiveMipmapLevel();x.setRenderTarget(ut),x.getClearColor(G),H=x.getClearAlpha(),H<1&&x.setClearColor(16777215,.5),x.clear(),Kt&&Lt.render(X);let Zt=x.toneMapping;x.toneMapping=yi;let zt=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),p.setupLightsView(q),At===!0&&pt.setGlobalState(x.clippingPlanes,q),ni(E,X,q),gt.updateMultisampleRenderTarget(ut),gt.updateRenderTargetMipmap(ut),et.has("WEBGL_multisampled_render_to_texture")===!1){let se=!1;for(let _e=0,Pe=O.length;_e<Pe;_e++){let Ee=O[_e],ye=Ee.object,kt=Ee.geometry,Ae=Ee.material,ce=Ee.group;if(Ae.side===Ue&&ye.layers.test(q.layers)){let un=Ae.side;Ae.side=qe,Ae.needsUpdate=!0,vo(ye,X,q,kt,Ae,ce),Ae.side=un,Ae.needsUpdate=!0,se=!0}}se===!0&&(gt.updateMultisampleRenderTarget(ut),gt.updateRenderTargetMipmap(ut))}x.setRenderTarget(Ut,Rt,Gt),x.setClearColor(G,H),zt!==void 0&&(q.viewport=zt),x.toneMapping=Zt}function ni(E,O,X){let q=O.isScene===!0?O.overrideMaterial:null;for(let z=0,ut=E.length;z<ut;z++){let Et=E[z],Ut=Et.object,Rt=Et.geometry,Gt=Et.group,Zt=Et.material;Zt.allowOverride===!0&&q!==null&&(Zt=q),Ut.layers.test(X.layers)&&vo(Ut,O,X,Rt,Zt,Gt)}}function vo(E,O,X,q,z,ut){E.onBeforeRender(x,O,X,q,z,ut),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),z.onBeforeRender(x,O,X,q,E,ut),z.transparent===!0&&z.side===Ue&&z.forceSinglePass===!1?(z.side=qe,z.needsUpdate=!0,x.renderBufferDirect(X,O,q,z,E,ut),z.side=ui,z.needsUpdate=!0,x.renderBufferDirect(X,O,q,z,E,ut),z.side=Ue):x.renderBufferDirect(X,O,q,z,E,ut),E.onAfterRender(x,O,X,q,z,ut)}function Ss(E,O,X){O.isScene!==!0&&(O=St);let q=ct.get(E),z=p.state.lights,ut=p.state.shadowsArray,Et=z.state.version,Ut=Y.getParameters(E,z.state,ut,O,X),Rt=Y.getProgramCacheKey(Ut),Gt=q.programs;q.environment=E.isMeshStandardMaterial?O.environment:null,q.fog=O.fog,q.envMap=(E.isMeshStandardMaterial?Xt:Jt).get(E.envMap||q.environment),q.envMapRotation=q.environment!==null&&E.envMap===null?O.environmentRotation:E.envMapRotation,Gt===void 0&&(E.addEventListener("dispose",j),Gt=new Map,q.programs=Gt);let Zt=Gt.get(Rt);if(Zt!==void 0){if(q.currentProgram===Zt&&q.lightsStateVersion===Et)return Wi(E,Ut),Zt}else Ut.uniforms=Y.getUniforms(E),E.onBeforeCompile(Ut,x),Zt=Y.acquireProgram(Ut,Rt),Gt.set(Rt,Zt),q.uniforms=Ut.uniforms;let zt=q.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(zt.clippingPlanes=pt.uniform),Wi(E,Ut),q.needsLights=ec(E),q.lightsStateVersion=Et,q.needsLights&&(zt.ambientLightColor.value=z.state.ambient,zt.lightProbe.value=z.state.probe,zt.directionalLights.value=z.state.directional,zt.directionalLightShadows.value=z.state.directionalShadow,zt.spotLights.value=z.state.spot,zt.spotLightShadows.value=z.state.spotShadow,zt.rectAreaLights.value=z.state.rectArea,zt.ltc_1.value=z.state.rectAreaLTC1,zt.ltc_2.value=z.state.rectAreaLTC2,zt.pointLights.value=z.state.point,zt.pointLightShadows.value=z.state.pointShadow,zt.hemisphereLights.value=z.state.hemi,zt.directionalShadowMap.value=z.state.directionalShadowMap,zt.directionalShadowMatrix.value=z.state.directionalShadowMatrix,zt.spotShadowMap.value=z.state.spotShadowMap,zt.spotLightMatrix.value=z.state.spotLightMatrix,zt.spotLightMap.value=z.state.spotLightMap,zt.pointShadowMap.value=z.state.pointShadowMap,zt.pointShadowMatrix.value=z.state.pointShadowMatrix),q.currentProgram=Zt,q.uniformsList=null,Zt}function Mo(E){if(E.uniformsList===null){let O=E.currentProgram.getUniforms();E.uniformsList=sr.seqWithValue(O.seq,E.uniforms)}return E.uniformsList}function Wi(E,O){let X=ct.get(E);X.outputColorSpace=O.outputColorSpace,X.batching=O.batching,X.batchingColor=O.batchingColor,X.instancing=O.instancing,X.instancingColor=O.instancingColor,X.instancingMorph=O.instancingMorph,X.skinning=O.skinning,X.morphTargets=O.morphTargets,X.morphNormals=O.morphNormals,X.morphColors=O.morphColors,X.morphTargetsCount=O.morphTargetsCount,X.numClippingPlanes=O.numClippingPlanes,X.numIntersection=O.numClipIntersection,X.vertexAlphas=O.vertexAlphas,X.vertexTangents=O.vertexTangents,X.toneMapping=O.toneMapping}function bs(E,O,X,q,z){O.isScene!==!0&&(O=St),gt.resetTextureUnits();let ut=O.fog,Et=q.isMeshStandardMaterial?O.environment:null,Ut=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Qi,Rt=(q.isMeshStandardMaterial?Xt:Jt).get(q.envMap||Et),Gt=q.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Zt=!!X.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),zt=!!X.morphAttributes.position,se=!!X.morphAttributes.normal,_e=!!X.morphAttributes.color,Pe=yi;q.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Pe=x.toneMapping);let Ee=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ye=Ee!==void 0?Ee.length:0,kt=ct.get(q),Ae=p.state.lights;if(At===!0&&(k===!0||E!==v)){let tn=E===v&&q.id===b;pt.setState(q,E,tn)}let ce=!1;q.version===kt.__version?(kt.needsLights&&kt.lightsStateVersion!==Ae.state.version||kt.outputColorSpace!==Ut||z.isBatchedMesh&&kt.batching===!1||!z.isBatchedMesh&&kt.batching===!0||z.isBatchedMesh&&kt.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&kt.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&kt.instancing===!1||!z.isInstancedMesh&&kt.instancing===!0||z.isSkinnedMesh&&kt.skinning===!1||!z.isSkinnedMesh&&kt.skinning===!0||z.isInstancedMesh&&kt.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&kt.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&kt.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&kt.instancingMorph===!1&&z.morphTexture!==null||kt.envMap!==Rt||q.fog===!0&&kt.fog!==ut||kt.numClippingPlanes!==void 0&&(kt.numClippingPlanes!==pt.numPlanes||kt.numIntersection!==pt.numIntersection)||kt.vertexAlphas!==Gt||kt.vertexTangents!==Zt||kt.morphTargets!==zt||kt.morphNormals!==se||kt.morphColors!==_e||kt.toneMapping!==Pe||kt.morphTargetsCount!==ye)&&(ce=!0):(ce=!0,kt.__version=q.version);let un=kt.currentProgram;ce===!0&&(un=Ss(q,O,z));let Es=!1,dn=!1,yr=!1,Re=un.getUniforms(),Sn=kt.uniforms;if(K.useProgram(un.program)&&(Es=!0,dn=!0,yr=!0),q.id!==b&&(b=q.id,dn=!0),Es||v!==E){K.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),Re.setValue(D,"projectionMatrix",E.projectionMatrix),Re.setValue(D,"viewMatrix",E.matrixWorldInverse);let rn=Re.map.cameraPosition;rn!==void 0&&rn.setValue(D,yt.setFromMatrixPosition(E.matrixWorld)),Q.logarithmicDepthBuffer&&Re.setValue(D,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&Re.setValue(D,"isOrthographic",E.isOrthographicCamera===!0),v!==E&&(v=E,dn=!0,yr=!0)}if(z.isSkinnedMesh){Re.setOptional(D,z,"bindMatrix"),Re.setOptional(D,z,"bindMatrixInverse");let tn=z.skeleton;tn&&(tn.boneTexture===null&&tn.computeBoneTexture(),Re.setValue(D,"boneTexture",tn.boneTexture,gt))}z.isBatchedMesh&&(Re.setOptional(D,z,"batchingTexture"),Re.setValue(D,"batchingTexture",z._matricesTexture,gt),Re.setOptional(D,z,"batchingIdTexture"),Re.setValue(D,"batchingIdTexture",z._indirectTexture,gt),Re.setOptional(D,z,"batchingColorTexture"),z._colorsTexture!==null&&Re.setValue(D,"batchingColorTexture",z._colorsTexture,gt));let bn=X.morphAttributes;if((bn.position!==void 0||bn.normal!==void 0||bn.color!==void 0)&&ht.update(z,X,un),(dn||kt.receiveShadow!==z.receiveShadow)&&(kt.receiveShadow=z.receiveShadow,Re.setValue(D,"receiveShadow",z.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(Sn.envMap.value=Rt,Sn.flipEnvMap.value=Rt.isCubeTexture&&Rt.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&O.environment!==null&&(Sn.envMapIntensity.value=O.environmentIntensity),dn&&(Re.setValue(D,"toneMappingExposure",x.toneMappingExposure),kt.needsLights&&tc(Sn,yr),ut&&q.fog===!0&&nt.refreshFogUniforms(Sn,ut),nt.refreshMaterialUniforms(Sn,q,U,$,p.state.transmissionRenderTarget[E.id]),sr.upload(D,Mo(kt),Sn,gt)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(sr.upload(D,Mo(kt),Sn,gt),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&Re.setValue(D,"center",z.center),Re.setValue(D,"modelViewMatrix",z.modelViewMatrix),Re.setValue(D,"normalMatrix",z.normalMatrix),Re.setValue(D,"modelMatrix",z.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let tn=q.uniformsGroups;for(let rn=0,sc=tn.length;rn<sc;rn++){let Xi=tn[rn];Ft.update(Xi,un),Ft.bind(Xi,un)}}return un}function tc(E,O){E.ambientLightColor.needsUpdate=O,E.lightProbe.needsUpdate=O,E.directionalLights.needsUpdate=O,E.directionalLightShadows.needsUpdate=O,E.pointLights.needsUpdate=O,E.pointLightShadows.needsUpdate=O,E.spotLights.needsUpdate=O,E.spotLightShadows.needsUpdate=O,E.rectAreaLights.needsUpdate=O,E.hemisphereLights.needsUpdate=O}function ec(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,O,X){let q=ct.get(E);q.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),ct.get(E.texture).__webglTexture=O,ct.get(E.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:X,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,O){let X=ct.get(E);X.__webglFramebuffer=O,X.__useDefaultFramebuffer=O===void 0};let nc=D.createFramebuffer();this.setRenderTarget=function(E,O=0,X=0){C=E,A=O,P=X;let q=!0,z=null,ut=!1,Et=!1;if(E){let Rt=ct.get(E);if(Rt.__useDefaultFramebuffer!==void 0)K.bindFramebuffer(D.FRAMEBUFFER,null),q=!1;else if(Rt.__webglFramebuffer===void 0)gt.setupRenderTarget(E);else if(Rt.__hasExternalTextures)gt.rebindTextures(E,ct.get(E.texture).__webglTexture,ct.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let zt=E.depthTexture;if(Rt.__boundDepthTexture!==zt){if(zt!==null&&ct.has(zt)&&(E.width!==zt.image.width||E.height!==zt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");gt.setupDepthRenderbuffer(E)}}let Gt=E.texture;(Gt.isData3DTexture||Gt.isDataArrayTexture||Gt.isCompressedArrayTexture)&&(Et=!0);let Zt=ct.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Zt[O])?z=Zt[O][X]:z=Zt[O],ut=!0):E.samples>0&&gt.useMultisampledRTT(E)===!1?z=ct.get(E).__webglMultisampledFramebuffer:Array.isArray(Zt)?z=Zt[X]:z=Zt,I.copy(E.viewport),F.copy(E.scissor),N=E.scissorTest}else I.copy(st).multiplyScalar(U).floor(),F.copy(xt).multiplyScalar(U).floor(),N=Nt;if(X!==0&&(z=nc),K.bindFramebuffer(D.FRAMEBUFFER,z)&&q&&K.drawBuffers(E,z),K.viewport(I),K.scissor(F),K.setScissorTest(N),ut){let Rt=ct.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+O,Rt.__webglTexture,X)}else if(Et){let Rt=O;for(let Gt=0;Gt<E.textures.length;Gt++){let Zt=ct.get(E.textures[Gt]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Gt,Zt.__webglTexture,X,Rt)}}else if(E!==null&&X!==0){let Rt=ct.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Rt.__webglTexture,X)}b=-1},this.readRenderTargetPixels=function(E,O,X,q,z,ut,Et,Ut=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Rt=ct.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Et!==void 0&&(Rt=Rt[Et]),Rt){K.bindFramebuffer(D.FRAMEBUFFER,Rt);try{let Gt=E.textures[Ut],Zt=Gt.format,zt=Gt.type;if(!Q.textureFormatReadable(Zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Q.textureTypeReadable(zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=E.width-q&&X>=0&&X<=E.height-z&&(E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Ut),D.readPixels(O,X,q,z,Ot.convert(Zt),Ot.convert(zt),ut))}finally{let Gt=C!==null?ct.get(C).__webglFramebuffer:null;K.bindFramebuffer(D.FRAMEBUFFER,Gt)}}},this.readRenderTargetPixelsAsync=async function(E,O,X,q,z,ut,Et,Ut=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Rt=ct.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Et!==void 0&&(Rt=Rt[Et]),Rt)if(O>=0&&O<=E.width-q&&X>=0&&X<=E.height-z){K.bindFramebuffer(D.FRAMEBUFFER,Rt);let Gt=E.textures[Ut],Zt=Gt.format,zt=Gt.type;if(!Q.textureFormatReadable(Zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Q.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let se=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,se),D.bufferData(D.PIXEL_PACK_BUFFER,ut.byteLength,D.STREAM_READ),E.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Ut),D.readPixels(O,X,q,z,Ot.convert(Zt),Ot.convert(zt),0);let _e=C!==null?ct.get(C).__webglFramebuffer:null;K.bindFramebuffer(D.FRAMEBUFFER,_e);let Pe=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await _d(D,Pe,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,se),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,ut),D.deleteBuffer(se),D.deleteSync(Pe),ut}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,O=null,X=0){let q=Math.pow(2,-X),z=Math.floor(E.image.width*q),ut=Math.floor(E.image.height*q),Et=O!==null?O.x:0,Ut=O!==null?O.y:0;gt.setTexture2D(E,0),D.copyTexSubImage2D(D.TEXTURE_2D,X,0,0,Et,Ut,z,ut),K.unbindTexture()};let ic=D.createFramebuffer(),xr=D.createFramebuffer();this.copyTextureToTexture=function(E,O,X=null,q=null,z=0,ut=null){ut===null&&(z!==0?(Ws("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ut=z,z=0):ut=0);let Et,Ut,Rt,Gt,Zt,zt,se,_e,Pe,Ee=E.isCompressedTexture?E.mipmaps[ut]:E.image;if(X!==null)Et=X.max.x-X.min.x,Ut=X.max.y-X.min.y,Rt=X.isBox3?X.max.z-X.min.z:1,Gt=X.min.x,Zt=X.min.y,zt=X.isBox3?X.min.z:0;else{let bn=Math.pow(2,-z);Et=Math.floor(Ee.width*bn),Ut=Math.floor(Ee.height*bn),E.isDataArrayTexture?Rt=Ee.depth:E.isData3DTexture?Rt=Math.floor(Ee.depth*bn):Rt=1,Gt=0,Zt=0,zt=0}q!==null?(se=q.x,_e=q.y,Pe=q.z):(se=0,_e=0,Pe=0);let ye=Ot.convert(O.format),kt=Ot.convert(O.type),Ae;O.isData3DTexture?(gt.setTexture3D(O,0),Ae=D.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(gt.setTexture2DArray(O,0),Ae=D.TEXTURE_2D_ARRAY):(gt.setTexture2D(O,0),Ae=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,O.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,O.unpackAlignment);let ce=D.getParameter(D.UNPACK_ROW_LENGTH),un=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Es=D.getParameter(D.UNPACK_SKIP_PIXELS),dn=D.getParameter(D.UNPACK_SKIP_ROWS),yr=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,Ee.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Ee.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Gt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Zt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,zt);let Re=E.isDataArrayTexture||E.isData3DTexture,Sn=O.isDataArrayTexture||O.isData3DTexture;if(E.isDepthTexture){let bn=ct.get(E),tn=ct.get(O),rn=ct.get(bn.__renderTarget),sc=ct.get(tn.__renderTarget);K.bindFramebuffer(D.READ_FRAMEBUFFER,rn.__webglFramebuffer),K.bindFramebuffer(D.DRAW_FRAMEBUFFER,sc.__webglFramebuffer);for(let Xi=0;Xi<Rt;Xi++)Re&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,ct.get(E).__webglTexture,z,zt+Xi),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,ct.get(O).__webglTexture,ut,Pe+Xi)),D.blitFramebuffer(Gt,Zt,Et,Ut,se,_e,Et,Ut,D.DEPTH_BUFFER_BIT,D.NEAREST);K.bindFramebuffer(D.READ_FRAMEBUFFER,null),K.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(z!==0||E.isRenderTargetTexture||ct.has(E)){let bn=ct.get(E),tn=ct.get(O);K.bindFramebuffer(D.READ_FRAMEBUFFER,ic),K.bindFramebuffer(D.DRAW_FRAMEBUFFER,xr);for(let rn=0;rn<Rt;rn++)Re?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,bn.__webglTexture,z,zt+rn):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,bn.__webglTexture,z),Sn?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,tn.__webglTexture,ut,Pe+rn):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,tn.__webglTexture,ut),z!==0?D.blitFramebuffer(Gt,Zt,Et,Ut,se,_e,Et,Ut,D.COLOR_BUFFER_BIT,D.NEAREST):Sn?D.copyTexSubImage3D(Ae,ut,se,_e,Pe+rn,Gt,Zt,Et,Ut):D.copyTexSubImage2D(Ae,ut,se,_e,Gt,Zt,Et,Ut);K.bindFramebuffer(D.READ_FRAMEBUFFER,null),K.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Sn?E.isDataTexture||E.isData3DTexture?D.texSubImage3D(Ae,ut,se,_e,Pe,Et,Ut,Rt,ye,kt,Ee.data):O.isCompressedArrayTexture?D.compressedTexSubImage3D(Ae,ut,se,_e,Pe,Et,Ut,Rt,ye,Ee.data):D.texSubImage3D(Ae,ut,se,_e,Pe,Et,Ut,Rt,ye,kt,Ee):E.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,ut,se,_e,Et,Ut,ye,kt,Ee.data):E.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,ut,se,_e,Ee.width,Ee.height,ye,Ee.data):D.texSubImage2D(D.TEXTURE_2D,ut,se,_e,Et,Ut,ye,kt,Ee);D.pixelStorei(D.UNPACK_ROW_LENGTH,ce),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,un),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Es),D.pixelStorei(D.UNPACK_SKIP_ROWS,dn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,yr),ut===0&&O.generateMipmaps&&D.generateMipmap(Ae),K.unbindTexture()},this.initRenderTarget=function(E){ct.get(E).__webglFramebuffer===void 0&&gt.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?gt.setTextureCube(E,0):E.isData3DTexture?gt.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?gt.setTexture2DArray(E,0):gt.setTexture2D(E,0),K.unbindTexture()},this.resetState=function(){A=0,P=0,C=null,K.reset(),it.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=le._getDrawingBufferColorSpace(t),e.unpackColorSpace=le._getUnpackColorSpace()}};var Al="v9-cinematic-1",Ne=Math.PI/180,ft=Math.PI*2,lr=52,cr=3.06,Ph=.34,ps=.085,an=.02,Jn=an+ps;var tf=5,Rl=2.46,Cl=.4,Ih=.3,Kn=1.95,Oi=.095,ms=Jn+Oi,Pl=.34,Il=1.5,Bi=24,Dh=.42,gs={x:-.072,z:-.1,s:.84},ef={u:.58,v:.7},nf=1.015,vn={w:11.4,d:12.6,h:.2,r:.55,z:1.8},je={w:9.6,d:9.4,r:.3,z:.6},_t={wallZ:-4.66,wallW:30,wallH:12,wallBottom:-.34,window:{x:1.02,y:.78,w:2.15,h:1.18,z:-4.6},shade:.34,lamp:{x:-2.1,y:.88,z:-4.3},floorY:-.34},An={r:.44,h:.1,ringR:.6,starR:.2},Mn=["red","yellow","blue","green"],Lh={red:0,yellow:13,blue:26,green:39},vi={red:50,yellow:11,blue:24,green:37},hr={red:31,yellow:121,blue:211,green:301},sf=[5,29],rf={1:"truth",2:"truth",5:"truth",9:"truth",12:"truth",16:"truth",17:"truth",23:"truth",25:"truth",28:"truth",31:"truth",38:"truth",42:"truth",43:"truth",51:"truth",4:"dare",6:"dare",15:"dare",18:"dare",19:"dare",22:"dare",27:"dare",30:"dare",32:"dare",35:"dare",41:"dare",44:"dare",45:"dare",48:"dare",49:"dare",3:"touch",8:"touch",21:"touch",29:"touch",34:"touch",47:"touch",10:"thermo",36:"thermo",14:"wheel",40:"wheel"};sf.forEach(s=>{rf[s]="fate"});var Se={red:13194314,yellow:14131786,blue:6193072,green:6066034};var of={takeoff:"起飞",fly:"飞点",forbid:"禁跳",fate:"命运",entry:"进航",truth:"真心话",dare:"敢做",touch:"触碰",thermo:"温度计",wheel:"转盘",ring:"普通"},Dl=s=>(s%lr+lr)%lr,_s=s=>Mn[(s%4+4)%4],Mx=s=>Lh[_s(s)]===s,Sx=s=>Dl(Lh[_s(s)]+20)===s,bx=s=>Dl(Lh[_s(s)]+48)===s,Ex=s=>Mn.some(t=>vi[t]===s);function Ll(s){return Mx(s)?"takeoff":Sx(s)?"fly":bx(s)?"forbid":sf.indexOf(s)>=0?"fate":Ex(s)?"entry":rf[s]||"ring"}var Qn=s=>s*ft/lr,re=(s,t,e)=>s<t?t:s>e?e:s,ae=(s,t,e)=>s+(t-s)*e,xs=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,Fl=s=>1-Math.pow(1-s,3),ur=(s,t,e)=>{let n=re((e-s)/(t-s),0,1);return n*n*(3-2*n)};function Ul(s,t){return((t-s+Math.PI)%ft+ft)%ft-Math.PI}var Fh=["takeoff","fly","forbid","fate","entry","truth","dare","touch","thermo","wheel","ring"],dr=0,Nl=45,Ol=49,af=53,$n=8,lf=64,Bl=(s,t)=>1+Math.max(0,Fh.indexOf(s))*4+Math.max(0,Mn.indexOf(t)),ys=s=>{let t=s%$n,e=Math.floor(s/$n);return[t/$n,1-(e+1)/$n,(t+1)/$n,1-e/$n]},jn=[3,4,1,6,2,5],fr=.038,zi={x:.63,y:fr+Pl/2,z:.63},Wt={walnut:{roughness:.55,metalness:.05,normalScale:.65,envMapIntensity:.55},brass:{roughness:.32,metalness:.85,envMapIntensity:1.25},felt:{roughness:.95,metalness:0,normalScale:1.15,envMapIntensity:.3},paper:{roughness:.8,metalness:0,normalScale:.45,envMapIntensity:.45},enamel:{roughness:.42,metalness:.06,envMapIntensity:.8},glass:{roughness:.12,metalness:0,envMapIntensity:1.4}},Rn={fov:38,elev:50,overviewElevMin:56,lensK:Math.tan(21*Math.PI/180)/Math.tan(19*Math.PI/180),drift:{x:.055,y:.038,yaw:.0011,fov:.1}},ln={high:{dpr:3,shadow:2048,dust:110,glow:!0,grain:!0,env:!0,bloom:!0,props:!0,steam:!0,motes:!0},medium:{dpr:2,shadow:1536,dust:72,glow:!0,grain:!1,env:!0,bloom:!1,props:!0,steam:!0,motes:!1},low:{dpr:1.5,shadow:0,dust:28,glow:!1,grain:!1,env:!1,bloom:!1,props:!0,steam:!1,motes:!1}},Uh={cup:{x:-1.72,z:4.28,s:2},cup2:{x:-2.42,z:4.3,s:1.25},newspaper:{x:-2.65,z:4.08,rot:.5},notebook:{x:-.1,z:4.15,rot:.1},glasses:{x:.74,z:4.36,rot:-.5},tickets:{x:-1.05,z:4.42,rot:.22},cards:{x:1.9,z:4.35,rot:-.16},keys:{x:.55,z:4.15,rot:.4},tray:{x:1.62,z:3.62},blanket:{x:1.15,z:4.35,rot:.12},speaker:{x:-2.72,z:2.58,rot:.52},cassette:{x:-2.52,z:3.44,rot:-.26},lamp:{x:-2.55,z:-3.2},candle:{x:-1.3,z:-3.85},plant:{x:2.78,z:-3.18},books:{x:3.02,z:-2.52,rot:.14},photo:{x:-3.18,z:-2.28,rot:.46}},De={bin:{y:1.98,h:.42,d:.46,w:22,inset:.3},strip:{y:1.72,h:.03,d:.07,w:21.4,color:16765600},curtain:{w:.42,h:1.46,off:.15},seat:{x:4.55,z:-2.2,w:.62,h:.94,d:.36},motes:26},fs={cloud:{id:"cloud",label:"云海机舱",exposure:1.28,ink:329741,fog:661024,fogDensity:.0155,light:{hemiSky:7311540,hemiGround:1314828,hemiInt:.58,key:16760960,keyInt:4.1,rim:9418472,rimInt:1.45,fill:11453142,fillInt:.46,lamp:16756838,lampInt:18,lampDist:11,env:.72},tableTint:14471878,feltTint:5139320,boardTint:13878965,brass:11569751,brassRough:.3,felt:{base:"#3E5A64",base2:"#22343C",weave:"#6F8E96"},overlay:{vig:"rgba(2,5,9,.92)",pool:"rgba(255,178,104,.17)",rim:"rgba(232,190,128,.26)"},hub:{top:14725740,side:5913634,star:16179126,glow:16760944},window:{top:"#071422",mid:"#173E58",low:"#6E93A6",cloud:"#C8DCE6",moon:"#F6EAD2",moonX:.68,moonY:.26,moonR:.048,stars:.28,glare:.34},wallTint:3031639,floor:658962,dust:16767400,dustOpacity:.55,heatCool:9418472,heatWarm:16754784,bear:{fur:10255194,furDark:8019010,hat:2833496,band:13805417,scarf:10109506}},star:{id:"star",label:"星轨夜航",exposure:1.16,ink:263435,fog:461334,fogDensity:.0145,light:{hemiSky:7042228,hemiGround:1051924,hemiInt:.52,key:16760458,keyInt:3.8,rim:9677055,rimInt:1.65,fill:10463448,fillInt:.42,lamp:16756339,lampInt:16,lampDist:10,env:.66},tableTint:13813982,feltTint:4145256,boardTint:12890827,brass:10391464,brassRough:.26,felt:{base:"#333A5A",base2:"#1B1E33",weave:"#5D6690"},overlay:{vig:"rgba(1,2,7,.93)",pool:"rgba(255,174,115,.15)",rim:"rgba(214,196,150,.24)"},hub:{top:14267516,side:4863312,star:16049094,glow:16758906},window:{top:"#03030C",mid:"#0E1230",low:"#2A3560",cloud:"#5A6690",moon:"#F0E9FF",moonX:.7,moonY:.24,moonR:.05,stars:1,glare:.22},wallTint:2502216,floor:460556,dust:14472959,dustOpacity:.45,heatCool:9414911,heatWarm:16752832,bear:{fur:9338012,furDark:7233404,hat:3353943,band:13095146,scarf:9200796}},paper:{id:"paper",label:"纸月夜航",exposure:1.26,ink:657414,fog:1445897,fogDensity:.016,light:{hemiSky:13150602,hemiGround:1840140,hemiInt:.62,key:16763796,keyInt:4.3,rim:12101780,rimInt:1.05,fill:14205090,fillInt:.52,lamp:16758904,lampInt:19,lampDist:11,env:.72},tableTint:15982269,feltTint:8018484,boardTint:15782562,brass:13081699,brassRough:.38,felt:{base:"#6A5334",base2:"#3C2C19",weave:"#9A7A4C"},overlay:{vig:"rgba(8,5,2,.92)",pool:"rgba(255,178,104,.22)",rim:"rgba(240,206,150,.30)"},hub:{top:15252082,side:6044190,star:16771520,glow:16760434},window:{top:"#2A1A10",mid:"#6E4326",low:"#D0A070",cloud:"#F0D2A8",moon:"#FFE6BE",moonX:.62,moonY:.3,moonR:.058,stars:.1,glare:.42},wallTint:3812382,floor:722949,dust:16765856,dustOpacity:.5,heatCool:13215876,heatWarm:16751181,bear:{fur:10386520,furDark:8282178,hat:7623738,band:15784110,scarf:10372152}}};function vs(s){return fs[s]||fs.cloud}function he(s,t){let e=document.createElement("canvas");return e.width=s,e.height=t,{c:e,g:e.getContext("2d")}}function de(s,t={}){let e=new Yr(s);return e.colorSpace=t.srgb===!1?zn:Ve,e.anisotropy=t.aniso||4,e.needsUpdate=!0,e.generateMipmaps=!0,e.minFilter=Yn,e.magFilter=mn,t.repeat&&(e.wrapS=e.wrapT=fi,e.repeat.set(t.repeat[0],t.repeat[1])),e}function cn(s,t,e,n,i,r){let o=Math.min(r,n/2,i/2);s.beginPath(),s.moveTo(t+o,e),s.arcTo(t+n,e,t+n,e+i,o),s.arcTo(t+n,e+i,t,e+i,o),s.arcTo(t,e+i,t,e,o),s.arcTo(t,e,t+n,e,o),s.closePath()}function ti(s){return[s>>16&255,s>>8&255,s&255]}function Cn(s,t){let[e,n,i]=ti(s);return t===void 0?`rgb(${e},${n},${i})`:`rgba(${e},${n},${i},${t})`}function hn(s,t,e){let n=ti(s),i=ti(t);return`rgb(${Math.round(n[0]+(i[0]-n[0])*e)},${Math.round(n[1]+(i[1]-n[1])*e)},${Math.round(n[2]+(i[2]-n[2])*e)})`}function Ze(s){let t=s||1;return()=>(t=t*16807%2147483647,t/2147483647)}function pr(s,t=2){let e=s.width,n=s.height,i=s.getContext("2d").getImageData(0,0,e,n).data,{c:r,g:o}=he(e,n),a=o.createImageData(e,n),l=(h,u)=>i[((u%n+n)%n*e+(h%e+e)%e)*4],c=Math.max(.2,t);for(let h=0;h<n;h++)for(let u=0;u<e;u++){let d=(l(u+1,h)-l(u-1,h))/255,f=(l(u,h+1)-l(u,h-1))/255,g=-d*c,_=f*c,m=1,p=Math.hypot(g,_,m)||1,M=(h*e+u)*4;a.data[M]=(g/p*.5+.5)*255,a.data[M+1]=(_/p*.5+.5)*255,a.data[M+2]=(m/p*.5+.5)*255,a.data[M+3]=255}return o.putImageData(a,0,0),r}var Nh=null,Oh=null,Bh=null;var zh=null,zl=null,Hl=null;function hf(s=128){let t=s,{c:e,g:n}=he(t,t);n.fillStyle="#808080",n.fillRect(0,0,t,t);let i=Ze(90210);for(let c=0;c<1100;c++){let h=i()*t,u=i()*t,d=.4+i()*1.7;n.globalAlpha=.05+i()*.17,n.fillStyle=i()>.5?"#BEBEBE":"#4E4E4E",n.beginPath(),n.arc(h,u,d,0,ft),n.fill()}for(let c=0;c<16;c++){n.globalAlpha=.12+i()*.16,n.strokeStyle=i()>.5?"#3C3C3C":"#C4C4C4",n.lineWidth=.6+i()*.9,n.beginPath();let h=i()*t,u=i()*t;n.moveTo(h,u);for(let d=0;d<4;d++)h+=(i()-.5)*16,u+=(i()-.5)*16,n.lineTo(h,u);n.stroke()}n.globalAlpha=1;let r=pr(e,1.6),o=he(t,t),a=o.g;a.drawImage(e,0,0);let l=a.getImageData(0,0,t,t);for(let c=0;c<l.data.length;c+=4){let u=150+(1-(l.data[c]+l.data[c+1]+l.data[c+2])/765)*70;l.data[c]=l.data[c+1]=l.data[c+2]=u}return a.putImageData(l,0,0),{normal:de(r,{srgb:!1,aniso:4}),rough:de(o.c,{srgb:!1,aniso:4})}}function uf(s=256){let t=s,e=n=>{let i=he(t,t),r=i.g,o=Ze(n?2718:3141),a=r.createLinearGradient(0,0,t,t);a.addColorStop(0,"#D8B49E"),a.addColorStop(.45,"#C9A48D"),a.addColorStop(1,"#B98F79"),r.fillStyle=a,r.fillRect(0,0,t,t);for(let g=0;g<130;g++){let _=o()*t,m=o()*t,p=8+o()*30,M=r.createRadialGradient(_,m,0,_,m,p),S=.006+o()*.018;M.addColorStop(0,`rgba(190,120,100,${S})`),M.addColorStop(1,"rgba(186,104,84,0)"),r.fillStyle=M,r.beginPath(),r.arc(_,m,p,0,ft),r.fill()}for(let g=0;g<2200;g++){let _=o()*t,m=o()*t;r.globalAlpha=.035+o()*.07,r.fillStyle=o()>.5?"#B87A60":"#EDC3A4",r.fillRect(_,m,1+o()*1.3,1+o()*1.3)}r.globalAlpha=1;let l=n?[.06,.12,.88,.94]:[.3,.52,.74];for(let g of l)for(let _=0;_<2;_++){r.strokeStyle=`rgba(168,112,92,${.08+o()*.07})`,r.lineWidth=1.1+o()*1.2,r.beginPath();let m=t*g+_*2.2;for(let p=0;p<=t;p+=6){let M=m+Math.sin(p/t*ft*2+g*9+_)*1.6;p===0?r.moveTo(p,M):r.lineTo(p,M)}r.stroke()}if(!n)for(let[g,_]of[[.36,6],[.52,5],[.68,7]]){r.strokeStyle="rgba(140,84,66,0.16)",r.lineWidth=1.6,r.beginPath();for(let m=0;m<=t;m+=6){let p=t*g+Math.sin(m/t*ft*1.5+g*10)*_;m===0?r.moveTo(m,p):r.lineTo(m,p)}r.stroke()}let c=he(t,t),h=c.g;h.fillStyle="#808080",h.fillRect(0,0,t,t);for(let g=0;g<2600;g++){let _=o()*t,m=o()*t,p=.5+o()*1.6;h.globalAlpha=.06+o()*.14,h.fillStyle=o()>.5?"#666666":"#999999",h.beginPath(),h.arc(_,m,p,0,ft),h.fill()}h.globalAlpha=1;for(let g of l)for(let _=0;_<2;_++){h.strokeStyle="rgba(40,40,40,0.55)",h.lineWidth=1.4+o()*1.2,h.beginPath();let m=t*g+_*2.2;for(let p=0;p<=t;p+=6){let M=m+Math.sin(p/t*ft*2+g*9+_)*1.6;p===0?h.moveTo(p,M):h.lineTo(p,M)}h.stroke()}let u=pr(c.c,1.8),d=he(Math.round(t/2),Math.round(t/2));d.g.drawImage(i.c,0,0,d.c.width,d.c.height);let f=d.g.getImageData(0,0,d.c.width,d.c.height);for(let g=0;g<f.data.length;g+=4){let m=140+(1-(f.data[g]*.3+f.data[g+1]*.59+f.data[g+2]*.11)/255)*60;f.data[g]=f.data[g+1]=f.data[g+2]=m}return d.g.putImageData(f,0,0),{map:de(i.c,{aniso:4}),normal:de(u,{srgb:!1,aniso:4}),rough:de(d.c,{srgb:!1,aniso:4})}};return{palm:e(!1),finger:e(!0)}}function cf(s,t){if(s.beginPath(),t==="takeoff"||t==="fly")s.moveTo(16,64),s.lineTo(84,20),s.lineTo(60,82),s.lineTo(46,56),s.closePath(),s.moveTo(46,56),s.lineTo(84,20),t==="fly"&&(s.moveTo(8,34),s.lineTo(30,34),s.moveTo(4,44),s.lineTo(24,44),s.moveTo(10,54),s.lineTo(26,54));else if(t==="forbid")s.arc(50,50,32,0,ft),s.moveTo(28,72),s.lineTo(72,28);else if(t==="fate")s.moveTo(50,8),s.quadraticCurveTo(54,44,92,50),s.quadraticCurveTo(54,56,50,92),s.quadraticCurveTo(46,56,8,50),s.quadraticCurveTo(46,44,50,8),s.closePath();else if(t==="entry")s.moveTo(20,18),s.lineTo(20,82),s.moveTo(20,18),s.lineTo(64,18),s.moveTo(20,82),s.lineTo(64,82),s.moveTo(64,18),s.lineTo(64,82),s.moveTo(50,50),s.lineTo(82,50),s.moveTo(70,38),s.lineTo(82,50),s.lineTo(70,62);else if(t==="truth")s.moveTo(18,26),s.lineTo(82,26),s.quadraticCurveTo(90,26,90,34),s.lineTo(90,62),s.quadraticCurveTo(90,70,82,70),s.lineTo(48,70),s.lineTo(30,86),s.lineTo(32,70),s.lineTo(18,70),s.quadraticCurveTo(10,70,10,62),s.lineTo(10,34),s.quadraticCurveTo(10,26,18,26),s.closePath(),s.moveTo(50,60),s.bezierCurveTo(50,56,44,52,40,56),s.bezierCurveTo(36,60,40,66,50,72),s.bezierCurveTo(60,66,64,60,60,56),s.bezierCurveTo(56,52,50,56,50,60),s.closePath();else if(t==="dare")s.moveTo(50,8),s.bezierCurveTo(60,30,74,34,72,54),s.bezierCurveTo(70,76,58,90,50,92),s.bezierCurveTo(42,90,30,78,30,60),s.bezierCurveTo(30,48,38,44,40,54),s.bezierCurveTo(42,62,50,46,50,8),s.closePath();else if(t==="touch")s.arc(38,52,18,0,ft),s.arc(62,52,18,0,ft),s.moveTo(50,22),s.lineTo(50,34),s.moveTo(38,30),s.lineTo(44,39),s.moveTo(62,30),s.lineTo(56,39);else if(t==="thermo")s.moveTo(44,16),s.lineTo(44,66),s.moveTo(56,16),s.lineTo(56,66),s.moveTo(44,16),s.quadraticCurveTo(50,8,56,16),s.arc(50,74,12,0,ft),s.moveTo(60,30),s.lineTo(68,30),s.moveTo(60,44),s.lineTo(68,44),s.moveTo(60,58),s.lineTo(68,58);else if(t==="wheel"){s.arc(50,50,32,0,ft),s.arc(50,50,7,0,ft);for(let e=0;e<8;e++){let n=e/8*ft;s.moveTo(50+Math.cos(n)*9,50+Math.sin(n)*9),s.lineTo(50+Math.cos(n)*30,50+Math.sin(n)*30)}}else s.arc(50,50,26,0,ft),s.arc(50,50,10,0,ft)}function kl(s,t,e,n,i,r,o={}){let a=i/100;s.save(),s.translate(e-i/2,n-i/2),s.scale(a,a),s.lineCap="round",s.lineJoin="round";let l=o.fill!==!1;o.engrave&&(s.save(),s.translate(0,1.6),s.strokeStyle="rgba(4,6,9,.55)",s.fillStyle="rgba(4,6,9,.5)",s.lineWidth=o.lw||5.2,cf(s,t),l?s.fill():s.stroke(),s.restore()),s.strokeStyle=r,s.fillStyle=r,s.lineWidth=o.lw||4.6,cf(s,t),l&&s.fill(),s.stroke(),s.restore()}function df(s={}){let t=lf,e=t*$n,n=s.aniso||8,{c:i,g:r}=he(e,e);r.clearRect(0,0,e,e);let o=c=>[c%$n*t,Math.floor(c/$n)*t],a=Ze(90210);{let[c,h]=o(dr),u=r.createLinearGradient(c,h,c,h+t);u.addColorStop(0,"#2C3138"),u.addColorStop(1,"#12151A"),r.fillStyle=u,r.fillRect(c,h,t,t)}{let[c,h]=o(af);r.fillStyle="#FFFFFF",r.fillRect(c,h,t,t)}let l=(c,h,u,d)=>{let f=Se[d];r.save(),r.translate(c,h);let g=r.createRadialGradient(t*.42,t*.36,t*.06,t*.5,t*.55,t*.78);g.addColorStop(0,hn(2304048,f,.34)),g.addColorStop(.55,hn(1580324,f,.24)),g.addColorStop(1,"#101317"),r.fillStyle=g,cn(r,1.5,1.5,t-3,t-3,t*.17),r.fill(),r.lineWidth=1.7,r.strokeStyle=Cn(f,.92),cn(r,2.6,2.6,t-5.2,t-5.2,t*.15),r.stroke(),r.lineWidth=.8,r.strokeStyle="rgba(226,196,146,.28)",cn(r,5.2,5.2,t-10.4,t-10.4,t*.12),r.stroke(),r.fillStyle="rgba(236,206,158,.34)";for(let[m,p]of[[6.4,6.4],[t-6.4,6.4],[6.4,t-6.4],[t-6.4,t-6.4]])r.beginPath(),r.arc(m,p,.85,0,ft),r.fill();for(let m=0;m<7;m++){r.globalAlpha=.03+a()*.05,r.fillStyle=a()>.5?"#FFFFFF":"#000000";let p=2+a()*7,M=.5+a()*1.2;r.fillRect(6+a()*(t-14),6+a()*(t-14),p,M)}r.globalAlpha=1;let _=r.createLinearGradient(2,2,t*.7,t*.7);_.addColorStop(0,"rgba(255,238,210,.16)"),_.addColorStop(.4,"rgba(255,238,210,.03)"),_.addColorStop(1,"rgba(255,238,210,0)"),r.fillStyle=_,cn(r,3,3,t-6,t-6,t*.15),r.fill(),r.restore()};return Fh.forEach(c=>{Mn.forEach(h=>{let[u,d]=o(Bl(c,h));l(u,d,c,h);let f=c==="takeoff"||c==="fly"||c==="forbid"||c==="entry";if(f){r.save(),r.translate(u,d);let m=r.createRadialGradient(t*.5,t*.45,1.5,t*.5,t*.5,t*.62);m.addColorStop(0,"rgba(238,198,132,.26)"),m.addColorStop(1,"rgba(238,198,132,0)"),r.fillStyle=m,cn(r,2,2,t-4,t-4,t*.16),r.fill(),r.lineWidth=2.3,r.strokeStyle="rgba(238,198,132,.58)",cn(r,3.4,3.4,t-6.8,t-6.8,t*.14),r.stroke(),r.restore()}let g=hn(Se[h],15721164,f?.68:.52),_=f||c==="fate"||c==="dare";kl(r,c,u+t/2,d+t*.505,t*(f?.62:.6),g,{engrave:!0,lw:5.4,fill:_})})}),Mn.forEach((c,h)=>{let[u,d]=o(Nl+h);r.save(),r.translate(u,d);let f=r.createLinearGradient(0,0,0,t);f.addColorStop(0,"#B7A47C"),f.addColorStop(1,"#77613F"),r.fillStyle=f,cn(r,1.5,1.5,t-3,t-3,t*.16),r.fill(),r.lineWidth=1.7,r.strokeStyle=Cn(Se[c],.85),cn(r,2.6,2.6,t-5.2,t-5.2,t*.15),r.stroke(),r.strokeStyle="rgba(90,64,32,.42)",r.lineWidth=.9,cn(r,5.2,5.2,t-10.4,t-10.4,t*.11),r.stroke(),kl(r,"entry",t/2,t*.5,t*.54,hn(13149806,Se[c],.3),{engrave:!0,lw:5.6,fill:!1}),r.restore()}),Mn.forEach((c,h)=>{let[u,d]=o(Ol+h);r.save(),r.translate(u,d);let f=r.createRadialGradient(t*.45,t*.4,2,t*.5,t*.5,t*.8);f.addColorStop(0,"#242A31"),f.addColorStop(1,"#0D1014"),r.fillStyle=f,cn(r,1.5,1.5,t-3,t-3,t*.2),r.fill(),r.strokeStyle=Cn(Se[c],.8),r.lineWidth=1.8,r.beginPath(),r.arc(t/2,t/2,t*.3,0,ft),r.stroke(),kl(r,"fly",t/2,t*.5,t*.42,hn(Se[c],15721164,.35),{engrave:!0,lw:6,fill:!0}),r.restore()}),{canvas:i,tex:de(i,{aniso:n})}}function ff(s,t=512){let e=t,n=Math.round(e/4),{c:i,g:r}=he(e,e),o=hn(3022098,s,.22);r.fillStyle=o,r.fillRect(0,0,e,e);let a=Ze(4711);r.save(),r.translate(e*.18,e*.42);for(let d=0;d<46;d++){let f=20+d*(e/46)*1.15;r.beginPath();for(let g=0;g<=e*1.4;g+=6){let _=Math.sin(g/e*ft*1.5+d*.7)*(2+d*.12),m=-f+_;g===0?r.moveTo(g,m):r.lineTo(g,m)}r.strokeStyle=d%3===0?"rgba(12,7,4,.42)":"rgba(86,58,36,.25)",r.lineWidth=d%5===0?2.4:1.1,r.stroke()}r.restore();for(let d=0;d<260;d++){let f=a()*e,g=a()*e;r.globalAlpha=.05+a()*.12,r.fillStyle=a()>.55?"rgba(10,6,3,.8)":"rgba(150,110,70,.6)",r.fillRect(f,g,1+a()*2.4,.6+a()*1.1)}r.globalAlpha=1;for(let d=0;d<18;d++){let f=d/18*e;r.globalAlpha=.06+a()*.1,r.strokeStyle=a()>.5?"#0B0704":"#7A5536",r.lineWidth=.8+a()*1.4,r.beginPath();for(let g=0;g<=e;g+=8){let _=f+Math.sin(g/e*ft*2+d)*2;g===0?r.moveTo(g,_):r.lineTo(g,_)}r.stroke()}r.globalAlpha=1;let l=he(e,e);l.g.drawImage(i,0,0);let c=pr(l.c,5),h=he(Math.round(e/2),Math.round(e/2));h.g.drawImage(i,0,0,h.c.width,h.c.height);let u=h.g.getImageData(0,0,h.c.width,h.c.height);for(let d=0;d<u.data.length;d+=4){let g=200+(1-(u.data[d]*.3+u.data[d+1]*.6+u.data[d+2]*.1)/255)*55;u.data[d]=u.data[d+1]=u.data[d+2]=g}return h.g.putImageData(u,0,0),{map:de(i,{aniso:8}),normal:de(c,{srgb:!1,aniso:8}),rough:de(h.c,{srgb:!1,aniso:4})}}function Gl(s,t=256){let e=t,{c:n,g:i}=he(e,e),r=Ze(1307);i.fillStyle=hn(4869714,s,.42),i.fillRect(0,0,e,e);let o=8,a=e/o;for(let u=0;u<a;u++)for(let d=0;d<a;d++)i.globalAlpha=.05+r()*.08,i.fillStyle=r()>.5?"#FFFFFF":"#000000",i.fillRect(d*o,u*o,o,o);i.globalAlpha=1;for(let u=0;u<a;u++)i.globalAlpha=.2,i.strokeStyle="rgba(255,255,255,.35)",i.lineWidth=1,i.beginPath(),i.moveTo(0,u*o+.5),i.lineTo(e,u*o+.5),i.stroke(),i.globalAlpha=.14,i.strokeStyle="rgba(0,0,0,.5)",i.beginPath(),i.moveTo(u*o+.5,0),i.lineTo(u*o+.5,e),i.stroke();i.globalAlpha=1;for(let u=0;u<420;u++){i.globalAlpha=.05+r()*.09,i.strokeStyle=r()>.5?"rgba(255,245,230,.8)":"rgba(0,0,0,.7)",i.lineWidth=.8;let d=r()*e,f=r()*e,g=r()*Math.PI;i.beginPath(),i.moveTo(d,f),i.lineTo(d+Math.cos(g)*2.2,f+Math.sin(g)*2.2),i.stroke()}i.globalAlpha=1;for(let u=0;u<6;u++){let d=r()*e,f=r()*e,g=e*(.15+r()*.25),_=i.createRadialGradient(d,f,0,d,f,g);_.addColorStop(0,u%2?"rgba(255,255,255,.035)":"rgba(0,0,0,.06)"),_.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=_,i.beginPath(),i.arc(d,f,g,0,ft),i.fill()}let l=he(e,e);l.g.drawImage(n,0,0);let c=pr(l.c,2.2),h=he(64,64);h.g.fillStyle="rgb(238,238,238)",h.g.fillRect(0,0,64,64),h.g.globalAlpha=.25;for(let u=0;u<120;u++)h.g.fillStyle=r()>.5?"#FFFFFF":"#D8D8D8",h.g.fillRect(r()*64,r()*64,1.5,1.5);return h.g.globalAlpha=1,{map:de(n,{aniso:8}),normal:de(c,{srgb:!1,aniso:8}),rough:de(h.c,{srgb:!1})}}function mr(s=256){let t=s,{c:e,g:n}=he(t,t),i=Ze(77003),r=n.createLinearGradient(0,0,0,t);r.addColorStop(0,"#C79B63"),r.addColorStop(.45,"#A87F4D"),r.addColorStop(1,"#7C5A32"),n.fillStyle=r,n.fillRect(0,0,t,t);for(let h=0;h<900;h++){let u=i()*t;n.globalAlpha=.04+i()*.1,n.strokeStyle=i()>.45?"rgba(255,240,210,.9)":"rgba(40,24,10,.9)",n.lineWidth=.6+i()*1.2,n.beginPath(),n.moveTo(0,u),n.lineTo(t,u+(i()-.5)*1.5),n.stroke()}n.globalAlpha=1;for(let h=0;h<7;h++){let u=i()*t,d=i()*t,f=t*(.05+i()*.14),g=n.createRadialGradient(u,d,0,u,d,f);g.addColorStop(0,h%2?"rgba(50,30,12,.20)":"rgba(255,228,180,.10)"),g.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=g,n.beginPath(),n.arc(u,d,f,0,ft),n.fill()}let o=he(t,t);o.g.drawImage(e,0,0);let a=pr(o.c,1.4),l=he(128,128);l.g.drawImage(e,0,0,128,128);let c=l.g.getImageData(0,0,128,128);for(let h=0;h<c.data.length;h+=4){let u=118+c.data[h]/255*40;c.data[h]=c.data[h+1]=c.data[h+2]=u}return l.g.putImageData(c,0,0),{map:de(e,{aniso:8}),normal:de(a,{srgb:!1,aniso:8}),rough:de(l.c,{srgb:!1})}}function Vl(s=256){let t=s,{c:e,g:n}=he(t,t),i=Ze(5150),r=n.createLinearGradient(0,0,t,t);r.addColorStop(0,"#F3E6D0"),r.addColorStop(.55,"#EADCC2"),r.addColorStop(1,"#DCCBAB"),n.fillStyle=r,n.fillRect(0,0,t,t);for(let c=0;c<900;c++){n.globalAlpha=.03+i()*.05,n.strokeStyle=i()>.5?"rgba(255,255,255,.9)":"rgba(120,92,58,.8)",n.lineWidth=.6;let h=i()*t,u=i()*t,d=i()*Math.PI;n.beginPath(),n.moveTo(h,u),n.lineTo(h+Math.cos(d)*3.4,u+Math.sin(d)*3.4),n.stroke()}n.globalAlpha=1;let o=n.createLinearGradient(t*.47,0,t*.53,0);o.addColorStop(0,"rgba(130,100,64,0)"),o.addColorStop(.45,"rgba(130,100,64,.24)"),o.addColorStop(.5,"rgba(255,252,244,.55)"),o.addColorStop(.56,"rgba(130,100,64,.22)"),o.addColorStop(1,"rgba(130,100,64,0)"),n.fillStyle=o,n.fillRect(t*.47,0,t*.06,t),n.globalAlpha=.18,n.strokeStyle="rgba(120,92,58,.9)",n.lineWidth=1.2,n.beginPath(),n.moveTo(0,t*.72),n.lineTo(t,t*.72),n.stroke(),n.globalAlpha=1;let a=he(t,t);a.g.drawImage(e,0,0);let l=pr(a.c,1.6);return{map:de(e,{aniso:8}),normal:de(l,{srgb:!1,aniso:8})}}function pf(s){let{c:e,g:n}=he(1536,1536),i=1536/2,r=Ze(20260119);n.fillStyle=hn(2759184,s,.16),n.fillRect(0,0,1536,1536),n.save(),n.translate(i,i);for(let l=0;l<70;l++){let c=8+l*(i/70)*1.18;n.beginPath();for(let h=0;h<=ft+.02;h+=.03){let u=Math.sin(h*7+l*.8)*(1.6+l*.08),d=Math.cos(h)*(c+u),f=Math.sin(h)*(c+u);h===0?n.moveTo(d,f):n.lineTo(d,f)}n.strokeStyle=l%3===0?"rgba(10,6,3,.34)":"rgba(96,66,42,.22)",n.lineWidth=l%6===0?2.2:1,n.stroke()}n.restore();for(let l=0;l<2400;l++){let c=r()*ft,h=Math.sqrt(r())*i;n.globalAlpha=.04+r()*.09,n.fillStyle=r()>.5?"rgba(0,0,0,.7)":"rgba(150,110,72,.55)",n.fillRect(i+Math.cos(c)*h,i+Math.sin(c)*h,1+r()*2,.6+r()*1)}n.globalAlpha=1;let o=n.createRadialGradient(i,i,i*.78,i,i,i);o.addColorStop(0,"rgba(0,0,0,0)"),o.addColorStop(1,"rgba(0,0,0,.55)"),n.fillStyle=o,n.beginPath(),n.arc(i,i,i,0,ft),n.fill(),n.strokeStyle="rgba(200,160,102,.62)",n.lineWidth=5,n.beginPath(),n.arc(i,i,i*.955,0,ft),n.stroke(),n.strokeStyle="rgba(30,18,8,.55)",n.lineWidth=2,n.beginPath(),n.arc(i,i,i*.935,0,ft),n.stroke(),n.strokeStyle="rgba(214,176,116,.30)",n.lineWidth=3,n.beginPath(),n.arc(i,i,i*.7,0,ft),n.stroke();for(let l of Mn){let c=Qn(vi[l])+Math.PI;n.strokeStyle="rgba(206,168,110,.26)",n.lineWidth=2,n.beginPath(),n.moveTo(i+Math.cos(c)*i*.12,i+Math.sin(c)*i*.12),n.lineTo(i+Math.cos(c)*i*.66,i+Math.sin(c)*i*.66),n.stroke()}let a=n.createRadialGradient(i,i,0,i,i,i*.2);return a.addColorStop(0,"rgba(240,212,160,.85)"),a.addColorStop(.55,"rgba(190,146,86,.55)"),a.addColorStop(1,"rgba(120,82,40,0)"),n.fillStyle=a,n.beginPath(),n.arc(i,i,i*.2,0,ft),n.fill(),n.strokeStyle="rgba(238,206,152,.62)",n.lineWidth=2.4,n.beginPath(),n.arc(i,i,i*.155,0,ft),n.stroke(),de(e,{aniso:8})}function mf(s=128){let t=s,{c:e,g:n}=he(t*3,t*2),i={1:[[.5,.5]],2:[[.28,.28],[.72,.72]],3:[[.26,.26],[.5,.5],[.74,.74]],4:[[.28,.28],[.72,.28],[.28,.72],[.72,.72]],5:[[.28,.28],[.72,.28],[.5,.5],[.28,.72],[.72,.72]],6:[[.28,.24],[.72,.24],[.28,.5],[.72,.5],[.28,.76],[.72,.76]]},r=["#4A7BE8","#1F4FBF"],o=["#D95043","#A62F26"],a=Ze(5150);for(let l=1;l<=6;l++){let c=(l-1)%3,h=Math.floor((l-1)/3),u=c*t,d=h*t;n.save(),n.translate(u,d);let f=n.createLinearGradient(0,0,t,t);f.addColorStop(0,"#FFFDF9"),f.addColorStop(.55,"#F7F3EC"),f.addColorStop(1,"#EDE7DD"),n.fillStyle=f,n.fillRect(0,0,t,t);for(let m=0;m<90;m++){let p=a()*t,M=a()*t;n.globalAlpha=.03+a()*.05,n.fillStyle=a()>.5?"#FFFFFF":"#C9C2B6",n.fillRect(p,M,1+a()*1.6,1+a()*1.6)}n.globalAlpha=1,n.strokeStyle="rgba(120,115,105,.18)",n.lineWidth=t*.03,n.strokeRect(t*.02,t*.02,t*.96,t*.96),n.strokeStyle="rgba(255,255,255,.55)",n.lineWidth=t*.012,n.strokeRect(t*.055,t*.055,t*.89,t*.89);let _=l===1||l===4?o:r;for(let[m,p]of i[l]){let M=m*t,S=p*t,x=t*.082,T=n.createRadialGradient(M-x*.35,S-x*.35,x*.1,M,S,x);T.addColorStop(0,_[0]),T.addColorStop(1,_[1]),n.fillStyle=T,n.beginPath(),n.arc(M,S,x,0,ft),n.fill(),n.strokeStyle="rgba(0,0,0,.10)",n.lineWidth=t*.01,n.beginPath(),n.arc(M,S,x,0,ft),n.stroke(),n.fillStyle="rgba(255,255,255,.38)",n.beginPath(),n.arc(M-x*.3,S-x*.3,x*.26,0,ft),n.fill()}n.restore()}return{tex:de(e,{aniso:8}),cols:3,rows:2}}function gf(s){let{c:e,g:n}=he(512,512),i=Ze(881),r=n.createLinearGradient(0,0,0,512);r.addColorStop(0,s.top),r.addColorStop(.45,s.mid),r.addColorStop(.68,s.low),r.addColorStop(.78,hn(14206632,16770752,.3)),r.addColorStop(1,"#0A0F16"),n.fillStyle=r,n.fillRect(0,0,512,512);let o=Math.round(240*(s.stars||0));if(o>0){for(let m=0;m<o;m++){let p=i()*512,M=i()*512*.55,S=.25+i()*.75;n.fillStyle=`rgba(235,236,255,${S})`,n.beginPath(),n.arc(p,M,i()>.92?1.6:.8,0,ft),n.fill()}n.strokeStyle="rgba(190,200,255,.14)",n.lineWidth=1;for(let m=0;m<5;m++)n.beginPath(),n.arc(512*.72,512*1.35,512*(.55+m*.07),-2.1,-1.25),n.stroke()}let a=s.moonX*512,l=s.moonY*512,c=s.moonR*512,h=n.createRadialGradient(a,l,c*.4,a,l,c*6);h.addColorStop(0,Cn(16772040,.55)),h.addColorStop(.35,Cn(16768168,.16)),h.addColorStop(1,"rgba(255,220,168,0)"),n.fillStyle=h,n.beginPath(),n.arc(a,l,c*6,0,ft),n.fill(),n.fillStyle=s.moon,n.beginPath(),n.arc(a,l,c,0,ft),n.fill(),n.globalAlpha=.18,n.fillStyle="#B9A98C",n.beginPath(),n.arc(a-c*.3,l+c*.2,c*.22,0,ft),n.fill(),n.beginPath(),n.arc(a+c*.35,l-c*.25,c*.16,0,ft),n.fill(),n.globalAlpha=1;let u=s.cloud;for(let m=0;m<40;m++){let p=512*(.6+i()*.34),M=i()*512*1.2-512*.1,S=512*(.05+i()*.13),x=n.createRadialGradient(M,p,0,M,p,S);x.addColorStop(0,Cn(u,.42)),x.addColorStop(.6,Cn(u,.18)),x.addColorStop(1,Cn(u,0)),n.fillStyle=x,n.beginPath(),n.ellipse(M,p,S*1.9,S*.62,0,0,ft),n.fill()}let d=n.createLinearGradient(a,l,a,512*.9);d.addColorStop(0,"rgba(255,232,196,.22)"),d.addColorStop(1,"rgba(255,232,196,0)"),n.fillStyle=d,n.beginPath(),n.moveTo(a-c*1.2,l),n.lineTo(a+c*1.2,l),n.lineTo(a+c*5,512*.9),n.lineTo(a-c*5,512*.9),n.closePath(),n.fill(),n.save();for(let m=0;m<26;m++){let p=512*(.03+i()*.94),M=512*(.745+i()*.055),S=.18+i()*.5,x=i()>.85?2.4:1.3,T=n.createRadialGradient(p,M,0,p,M,x*3.2);T.addColorStop(0,`rgba(255,216,160,${S})`),T.addColorStop(.4,`rgba(255,190,120,${S*.32})`),T.addColorStop(1,"rgba(255,190,120,0)"),n.fillStyle=T,n.beginPath(),n.arc(p,M,x*3.2,0,ft),n.fill(),n.fillStyle=`rgba(255,238,206,${Math.min(.9,S+.15)})`,n.beginPath(),n.arc(p,M,x*.55,0,ft),n.fill()}n.beginPath(),n.moveTo(512*1.02,512*.86),n.lineTo(512*.3,512*.72),n.lineTo(512*.34,512*.685),n.lineTo(512*1.02,512*.79),n.closePath(),n.fillStyle="rgba(6,9,13,.86)",n.fill(),n.strokeStyle="rgba(150,180,210,.22)",n.lineWidth=1.6,n.beginPath(),n.moveTo(512*.3,512*.72),n.lineTo(512*1,512*.86),n.stroke();let f=n.createRadialGradient(512*.33,512*.706,0,512*.33,512*.706,512*.035);f.addColorStop(0,"rgba(255,120,90,.95)"),f.addColorStop(.35,"rgba(255,80,60,.40)"),f.addColorStop(1,"rgba(255,80,60,0)"),n.fillStyle=f,n.beginPath(),n.arc(512*.33,512*.706,512*.035,0,ft),n.fill(),n.restore();let g=n.createLinearGradient(0,0,512,512);g.addColorStop(0,"rgba(255,255,255,.10)"),g.addColorStop(.32,"rgba(255,255,255,0)"),g.addColorStop(1,"rgba(0,0,0,.30)"),n.fillStyle=g,n.fillRect(0,0,512,512);let _=n.createRadialGradient(512*.5,512*.55,512*.2,512*.5,512*.55,512*.72);return _.addColorStop(0,"rgba(0,0,0,0)"),_.addColorStop(1,"rgba(0,4,8,.55)"),n.fillStyle=_,n.fillRect(0,0,512,512),de(e,{aniso:4})}function _f(s,t=512){let e=t,{c:n,g:i}=he(e,e),r=Ze(31337);i.fillStyle=hn(1712682,s,.55),i.fillRect(0,0,e,e);for(let a=0;a<4;a++){let l=a*128;i.fillStyle="rgba(0,0,0,.34)",i.fillRect(l,0,3,e),i.fillStyle="rgba(255,238,208,.075)",i.fillRect(l+3,0,1.5,e);for(let c=0;c<8;c++){let h=18+c*64;for(let u of[l-9,l+12])i.fillStyle="rgba(8,10,12,.42)",i.beginPath(),i.arc(u,h,2.6,0,ft),i.fill(),i.fillStyle="rgba(255,238,210,.20)",i.beginPath(),i.arc(u-.7,h-.8,1.35,0,ft),i.fill()}}for(let a of[96,320]){let l=i.createLinearGradient(0,a,0,a+6);l.addColorStop(0,"rgba(196,156,100,.55)"),l.addColorStop(.5,"rgba(232,196,140,.30)"),l.addColorStop(1,"rgba(20,14,8,.35)"),i.fillStyle=l,i.fillRect(0,a,e,6);for(let c=0;c<16;c++){let h=8+c*32;i.fillStyle="rgba(10,8,6,.30)",i.beginPath(),i.arc(h,a+10,1.9,0,ft),i.fill(),i.fillStyle="rgba(240,214,170,.16)",i.beginPath(),i.arc(h-.5,a+9.4,.9,0,ft),i.fill()}}let o=i.createLinearGradient(0,e-26,0,e);o.addColorStop(0,"rgba(4,6,9,0)"),o.addColorStop(1,"rgba(4,6,9,.55)"),i.fillStyle=o,i.fillRect(0,e-26,e,26);for(let a=0;a<2600;a++)i.globalAlpha=.025+r()*.05,i.fillStyle=r()>.5?"rgba(255,255,255,.8)":"rgba(0,0,0,.9)",i.fillRect(r()*e,r()*e,1+r()*2,1+r());i.globalAlpha=1;for(let a=0;a<6;a++){let l=r()*e,c=r()*e,h=e*(.1+r()*.24),u=i.createRadialGradient(l,c,0,l,c,h);u.addColorStop(0,r()>.5?"rgba(0,0,0,.16)":"rgba(255,220,170,.05)"),u.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=u,i.beginPath(),i.arc(l,c,h,0,ft),i.fill()}return de(n,{aniso:4,repeat:[3,1]})}function xf(s){let{c:e,g:n}=he(256,256),i=Ze(4242);n.fillStyle=hn(658447,s,.35),n.fillRect(0,0,256,256),n.lineWidth=1;for(let r=-256;r<256*2;r+=7)n.strokeStyle=r%14===0?"rgba(255,236,208,.030)":"rgba(0,0,0,.10)",n.beginPath(),n.moveTo(r,0),n.lineTo(r+256,256),n.stroke(),n.beginPath(),n.moveTo(r,256),n.lineTo(r+256,0),n.stroke();for(let r=0;r<1400;r++)n.globalAlpha=.03+i()*.06,n.fillStyle=i()>.5?"rgba(255,255,255,.7)":"rgba(0,0,0,.9)",n.fillRect(i()*256,i()*256,1+i()*2,1+i()*2);return n.globalAlpha=1,de(e,{aniso:4,repeat:[6,4]})}function Wl(s,t){let{c:e,g:n}=he(s,s),i=s/2,r=n.createRadialGradient(i,i,0,i,i,i);return t.forEach(([o,a])=>r.addColorStop(o,a)),n.fillStyle=r,n.fillRect(0,0,s,s),de(e)}function yf(){return Nh||(Nh=Wl(128,[[0,"rgba(0,0,0,.62)"],[.42,"rgba(0,0,0,.34)"],[.78,"rgba(0,0,0,.10)"],[1,"rgba(0,0,0,0)"]])),Nh}function Hi(){return Oh||(Oh=Wl(128,[[0,"rgba(255,240,214,.95)"],[.3,"rgba(255,204,136,.48)"],[.65,"rgba(255,186,110,.14)"],[1,"rgba(255,186,110,0)"]])),Oh}function vf(){return Bh||(Bh=Wl(64,[[0,"rgba(255,246,232,.9)"],[.38,"rgba(255,226,190,.38)"],[1,"rgba(255,226,190,0)"]])),Bh}function Mf(){let{c:t,g:e}=he(128,128),n=128/2,i=e.createRadialGradient(n,n,n*.45,n,n,n*.98);return i.addColorStop(0,"rgba(255,214,150,0)"),i.addColorStop(.62,"rgba(255,222,168,.85)"),i.addColorStop(1,"rgba(255,214,150,0)"),e.fillStyle=i,e.beginPath(),e.arc(n,n,n,0,ft),e.fill(),de(t)}function Hh(){return zh||(zh=Wl(32,[[0,"rgba(255,244,220,.95)"],[.4,"rgba(255,220,170,.35)"],[1,"rgba(255,220,170,0)"]])),zh}function Sf(s,t,e=512){let n=e,{c:i,g:r}=he(n,n),o=t.w,a=t.d,l=S=>S/o*n,c=Ze(606),h=r.createRadialGradient(0,0,l(o*.3),0,0,l(o*.62));h.addColorStop(0,"rgba(0,0,0,0)"),h.addColorStop(.45,s.vig.replace(/[\d.]+\)$/,"0.18)")),h.addColorStop(1,s.vig.replace(/[\d.]+\)$/,"0.60)")),r.save(),r.translate(n/2,n/2),r.scale(1,o/a),r.fillStyle=h,r.beginPath(),r.arc(0,0,l(o*.78),0,ft),r.fill(),r.restore();let u=r.createRadialGradient(n*.34,n*.42,l(.3),n*.34,n*.42,l(4));u.addColorStop(0,s.pool),u.addColorStop(.5,s.pool.replace(/[\d.]+\)$/,"0.10)")),u.addColorStop(1,"rgba(255,178,104,0)"),r.save(),r.translate(n/2,n/2),r.scale(1,o/a),r.fillStyle=u,r.beginPath(),r.arc(0,0,l(4.4),0,ft),r.fill(),r.restore();let d=r.createRadialGradient(0,0,l(3.2),0,0,l(3.62));d.addColorStop(0,"rgba(0,0,0,0)"),d.addColorStop(.25,"rgba(0,0,0,.34)"),d.addColorStop(.62,"rgba(0,0,0,.20)"),d.addColorStop(1,"rgba(0,0,0,0)"),r.save(),r.translate(n/2,n/2),r.scale(1,o/a),r.fillStyle=d,r.beginPath(),r.arc(0,0,l(3.62),0,ft),r.fill(),r.restore(),r.save(),r.translate(n/2,n/2),r.scale(1,o/a),r.strokeStyle=s.rim,r.lineWidth=2,r.beginPath(),r.arc(0,0,l(3.92),0,ft),r.stroke(),r.restore(),r.save(),r.translate(n/2,n/2),r.scale(1,o/a),r.setLineDash([7,6]),r.strokeStyle="rgba(224,190,140,.20)",r.lineWidth=2.2,r.beginPath(),r.arc(0,0,l(3.56),0,ft),r.stroke(),r.setLineDash([3,7]),r.strokeStyle="rgba(12,16,20,.30)",r.lineWidth=1.4,r.beginPath(),r.arc(0,0,l(3.72),0,ft),r.stroke(),r.setLineDash([]),r.strokeStyle="rgba(232,200,150,.10)",r.lineWidth=1.2,r.beginPath(),r.arc(0,0,l(3.46),0,ft),r.stroke(),r.restore();let f=-.6,g=[[3.36,f-3.28],[-3.36,f-3.28],[3.36,f+3.28],[-3.36,f+3.28]];for(let[S,x]of g){let T=n/2+S/o*n,A=n/2+x/a*n,P=l(.3);r.save(),r.translate(T,A),r.strokeStyle="rgba(230,196,146,.22)",r.lineWidth=1.6,r.beginPath(),r.arc(0,0,P,0,ft),r.stroke(),r.beginPath();for(let C=0;C<4;C++){let b=C/4*ft+.4;r.moveTo(Math.cos(b)*P*.25,Math.sin(b)*P*.25),r.lineTo(Math.cos(b)*P*1.22,Math.sin(b)*P*1.22)}r.stroke(),r.strokeStyle="rgba(16,20,24,.26)",r.lineWidth=1.2,r.beginPath(),r.arc(.8,1.1,P*.86,0,ft),r.stroke(),r.fillStyle="rgba(236,204,156,.26)",r.beginPath(),r.arc(0,0,2.6,0,ft),r.fill(),r.restore()}for(let S=0;S<4;S++){let x=-.7+S*(Math.PI/2),T=Math.cos(x)*3.1,A=f+Math.sin(x)*3.1,P=n/2+T/o*n,C=n/2+A/a*n,b=r.createRadialGradient(P,C,0,P,C,l(1.1));b.addColorStop(0,"rgba(255,236,206,.045)"),b.addColorStop(1,"rgba(255,236,206,0)"),r.fillStyle=b,r.beginPath(),r.arc(P,C,l(1.1),0,ft),r.fill()}let _=r.createLinearGradient(n*.05,0,n*.9,n);_.addColorStop(0,"rgba(255,238,210,.10)"),_.addColorStop(.4,"rgba(255,238,210,.035)"),_.addColorStop(1,"rgba(255,238,210,0)"),r.fillStyle=_,r.fillRect(0,0,n,n);let m=r.createLinearGradient(0,0,0,n*.42);m.addColorStop(0,"rgba(3,6,10,.55)"),m.addColorStop(.6,"rgba(3,6,10,.18)"),m.addColorStop(1,"rgba(3,6,10,0)"),r.fillStyle=m,r.fillRect(0,0,n,n*.42);let p=r.createLinearGradient(0,n,0,n*.7);p.addColorStop(0,"rgba(255,196,132,.12)"),p.addColorStop(1,"rgba(255,196,132,0)"),r.fillStyle=p,r.fillRect(0,n*.7,n,n*.3);for(let S=0;S<9;S++){let x=c()*n,T=c()*n,A=n*(.03+c()*.09),P=r.createRadialGradient(x,T,0,x,T,A);P.addColorStop(0,S%2?"rgba(255,255,255,.020)":"rgba(0,0,0,.045)"),P.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=P,r.beginPath(),r.arc(x,T,A,0,ft),r.fill()}r.globalCompositeOperation="destination-in",r.save(),r.translate(n/2,n/2),r.scale(1,o/a);let M=r.createRadialGradient(0,0,l(o*.34),0,0,l(o*.53));return M.addColorStop(0,"rgba(0,0,0,1)"),M.addColorStop(.82,"rgba(0,0,0,.96)"),M.addColorStop(.94,"rgba(0,0,0,.55)"),M.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=M,r.beginPath(),r.arc(0,0,l(o*.53),0,ft),r.fill(),r.restore(),r.globalCompositeOperation="source-over",de(i,{aniso:4})}function bf(s,t=256){let e=t,{c:n,g:i}=he(e,e),r=e/2,o=i.createRadialGradient(r*.85,r*.72,r*.05,r,r,r);o.addColorStop(0,"#FFF4DC"),o.addColorStop(.4,Cn(s.top)),o.addColorStop(1,Cn(s.side)),i.fillStyle=o,i.beginPath(),i.arc(r,r,r,0,ft),i.fill();let a=Ze(99);for(let h=0;h<260;h++){i.globalAlpha=.04+a()*.08,i.strokeStyle=a()>.5?"rgba(255,248,230,.8)":"rgba(60,36,12,.7)",i.lineWidth=.7;let u=a()*e;i.beginPath(),i.moveTo(0,u),i.lineTo(e,u+(a()-.5)*2),i.stroke()}i.globalAlpha=1,i.strokeStyle="rgba(70,42,16,.40)",i.lineWidth=2.4,i.beginPath(),i.arc(r,r,r*.86,0,ft),i.stroke(),i.strokeStyle="rgba(255,250,236,.55)",i.lineWidth=1.8,i.beginPath(),i.arc(r,r,r*.78,0,ft),i.stroke(),i.save(),i.translate(r,r);let l=()=>{i.beginPath();for(let h=0;h<10;h++){let u=h%2===0?r*.52:r*.22,d=-Math.PI/2+h*Math.PI/5,f=Math.cos(d)*u,g=Math.sin(d)*u;h===0?i.moveTo(f,g):i.lineTo(f,g)}i.closePath()};l(),i.fillStyle="rgba(58,34,12,.32)",i.fill(),i.translate(0,-1.6),l();let c=i.createLinearGradient(-r*.5,-r*.5,r*.5,r*.5);return c.addColorStop(0,"#FFFFFF"),c.addColorStop(1,Cn(s.star)),i.fillStyle=c,i.fill(),i.strokeStyle="rgba(255,250,236,.55)",i.lineWidth=1.4,i.stroke(),i.restore(),de(n,{aniso:8})}function Ef(s,t,e,n,i){let r=n||256,{c:o,g:a}=he(r,r),l=Se[t]||Se.red,c=Ze(7788),h=a.createRadialGradient(r*.44,r*.38,r*.04,r*.5,r*.55,r*.78);h.addColorStop(0,hn(1777445,l,.34)),h.addColorStop(.55,hn(1251100,l,.24)),h.addColorStop(1,"#0A0D11"),a.fillStyle=h,cn(a,3,3,r-6,r-6,r*.14),a.fill(),a.strokeStyle="rgba(214,180,124,.85)",a.lineWidth=r*.018,cn(a,r*.035,r*.035,r*.93,r*.93,r*.125),a.stroke(),a.strokeStyle=Cn(l,.9),a.lineWidth=r*.01,cn(a,r*.062,r*.062,r*.876,r*.876,r*.105),a.stroke(),a.strokeStyle="rgba(226,196,146,.24)",a.lineWidth=r*.004,cn(a,r*.086,r*.086,r*.828,r*.828,r*.09),a.stroke();for(let _=0;_<22;_++)a.globalAlpha=.03+c()*.05,a.fillStyle=c()>.5?"#FFFFFF":"#000000",a.fillRect(r*(.08+c()*.8),r*(.08+c()*.8),2+c()*7,.8+c());a.globalAlpha=1;let u=a.createRadialGradient(r*.29,r*.26,0,r*.29,r*.26,r*.25);u.addColorStop(0,"rgba(20,12,6,.30)"),u.addColorStop(1,"rgba(20,12,6,0)"),a.fillStyle=u,a.beginPath(),a.arc(r*.29,r*.26,r*.25,0,ft),a.fill();let d=r*(i?i.u:.58),f=r*(i?i.v:.7),g=s==="takeoff"||s==="fly"||s==="fate"||s==="dare";return kl(a,s,d,f-r*.055,r*.3,hn(l,15721164,.55),{engrave:!0,lw:5.2,fill:g}),e&&(a.fillStyle="rgba(236,220,190,.86)",a.font=`600 ${Math.round(r*.082)}px "Songti SC","STSong","SimSun","PingFang SC",serif`,a.textAlign="center",a.textBaseline="middle",a.fillText(e,d,f+r*.115),a.strokeStyle="rgba(212,176,120,.34)",a.lineWidth=1.2,a.beginPath(),a.moveTo(d-r*.07,f+r*.165),a.lineTo(d+r*.07,f+r*.165),a.stroke()),de(o,{aniso:8})}function Tf(){let s=new ji;s.background=new Bt(329482);let t=(e,n,i,r,o,a,l)=>{let c=new wt(e,new ke({color:n,side:Ue}));return c.position.set(i,r,o),a&&(c.rotation.x=a),l&&(c.rotation.y=l),s.add(c),c};return t(new jt(24,14,24),1317924,0,0,0).material.side=qe,t(new Me(18,18),3811096,0,-4.4,0,-Math.PI/2),t(new Me(3.2,3.2),16766106,-4.6,3.2,-2.2,0,Math.PI/2),t(new Me(1.4,1.4),16773330,-4.4,3,-2.4,0,Math.PI/2),t(new Me(4.2,2.6),9418472,5.2,1.4,-4.6,0,-Math.PI/2.2),t(new Me(5,3.2),4086400,5.4,1.2,-4.4,0,-Math.PI/2.2),t(new Me(10,10),2764856,0,6.6,0,Math.PI/2),s}function wf(s=128){let t=s,e=s*2,{c:n,g:i}=he(t,e),r=Ze(9021);i.fillStyle="#6E6257",i.fillRect(0,0,t,e);for(let l=0;l<t;l++){let c=l/t,u=.5+Math.sin(c*Math.PI*9+Math.sin(c*5.1)*.6)*.28,d=Math.round(70+u*90);i.fillStyle=`rgb(${d+14},${d+4},${d-10})`,i.fillRect(l,0,1,e)}let o=i.createLinearGradient(0,0,0,e*.16);o.addColorStop(0,"rgba(10,8,6,.55)"),o.addColorStop(1,"rgba(10,8,6,0)"),i.fillStyle=o,i.fillRect(0,0,t,e*.16);let a=i.createLinearGradient(0,e*.72,0,e);a.addColorStop(0,"rgba(8,6,4,0)"),a.addColorStop(1,"rgba(8,6,4,.45)"),i.fillStyle=a,i.fillRect(0,e*.72,t,e*.28);for(let l=0;l<900;l++)i.globalAlpha=.02+r()*.05,i.fillStyle=r()>.5?"rgba(255,244,224,.9)":"rgba(0,0,0,.8)",i.fillRect(r()*t,r()*e,1,1+r()*2);return i.globalAlpha=1,de(n,{aniso:4})}function Af(s=128){let t=s,{c:e,g:n}=he(t*4,t*2),i=Ze(778899),r=u=>{n.save(),n.translate(u%4*t,Math.floor(u/4)*t)},o=()=>{n.restore()},a=(u,d)=>{for(let f=0;f<u;f++)n.globalAlpha=d*(.3+i()*.7),n.fillStyle=i()>.5?"rgba(255,255,255,.9)":"rgba(0,0,0,.8)",n.fillRect(i()*t,i()*t,1,1+i()*2);n.globalAlpha=1};r(0);let l=n.createLinearGradient(0,0,t,t);l.addColorStop(0,"#232B3A"),l.addColorStop(.55,"#1A1F2A"),l.addColorStop(1,"#3A2A22"),n.fillStyle=l,n.fillRect(0,0,t,t),n.fillStyle="#F0E2C8",n.fillRect(10,12,t-20,5),n.fillStyle="rgba(240,226,200,.72)",n.fillRect(10,21,t-44,2);let c=n.createLinearGradient(14,34,t-14,92);c.addColorStop(0,"#6E93A6"),c.addColorStop(.55,"#C8A46C"),c.addColorStop(1,"#3A2A22"),n.fillStyle=c,n.fillRect(14,34,t-28,58),n.fillStyle="rgba(8,12,18,.55)",n.beginPath(),n.moveTo(14,92),n.lineTo(52,58),n.lineTo(80,92),n.closePath(),n.fill(),n.fillStyle="rgba(250,242,226,.78)",n.fillRect(14,100,t-46,3),n.fillStyle="rgba(232,222,200,.42)",n.fillRect(14,108,t-64,2),n.fillRect(14,114,t-74,2),n.strokeStyle="rgba(214,178,120,.50)",n.lineWidth=1.2,n.strokeRect(6.5,6.5,t-13,t-13),a(160,.05),o(),r(1),n.fillStyle="#E7DCC6",n.fillRect(0,0,t,t),n.fillStyle="rgba(36,30,24,.86)",n.fillRect(8,8,t-16,6),n.fillStyle="rgba(36,30,24,.30)",n.fillRect(8,17,t-16,1.6);for(let u=0;u<3;u++){let d=8+u*((t-16)/3),f=(t-16)/3-5;for(let g=0;g<(u===1?14:20);g++){let _=24+g*4.4;if(_>t-14)break;n.fillStyle="rgba(50,44,36,.36)",n.fillRect(d,_,f*(.55+i()*.45),1.5)}}n.fillStyle="rgba(60,64,66,.80)",n.fillRect(8,t-34,t-16,22),n.fillStyle="rgba(228,214,190,.55)",n.fillRect(10,t-32,t-20,2),a(120,.04),o(),r(2),n.fillStyle="#EBDCC0",n.fillRect(0,0,t,t),n.fillStyle="#7A2E36",n.fillRect(0,0,22,t),n.fillStyle="rgba(30,20,16,.82)",n.fillRect(32,22,t-44,4),n.fillStyle="rgba(46,36,28,.42)",n.fillRect(32,32,t-56,2.4),n.fillRect(32,40,t-66,2.4),n.strokeStyle="rgba(60,46,36,.55)",n.lineWidth=1.4,n.setLineDash([4,4]),n.beginPath(),n.moveTo(t-30,8),n.lineTo(t-30,t-8),n.stroke(),n.setLineDash([]),n.fillStyle="rgba(30,22,18,.86)";for(let u=0;u<12;u++)n.fillRect(t-22+u%6*2.4,18+Math.floor(u/6)*26,1.2,22);n.fillStyle="#7A2E36",n.fillRect(32,t-34,t-74,3),n.fillStyle="rgba(40,30,24,.55)",n.beginPath(),n.arc(t-30,t*.52,4,0,ft),n.fill(),a(90,.04),o(),r(3),l=n.createLinearGradient(0,0,0,t),l.addColorStop(0,"#2B4763"),l.addColorStop(.5,"#B07A4E"),l.addColorStop(.78,"#E8C08A"),l.addColorStop(1,"#7A4A2C"),n.fillStyle=l,n.fillRect(0,0,t,t),n.fillStyle="rgba(255,236,208,.34)";for(let u=0;u<5;u++){let d=t*(.62+u*.06);n.beginPath(),n.ellipse(t*(.2+i()*.6),d,t*(.16+i()*.14),t*.035,0,0,ft),n.fill()}n.fillStyle="rgba(18,22,26,.88)",n.beginPath(),n.moveTo(28,44),n.lineTo(72,56),n.lineTo(40,64),n.lineTo(36,56),n.lineTo(28,44),n.closePath(),n.fill(),n.strokeStyle="rgba(214,180,124,.75)",n.lineWidth=1.4,n.strokeRect(t-42,10,30,34),n.fillStyle="rgba(240,226,198,.85)",n.fillRect(t-39,13,24,28),n.fillStyle="rgba(36,30,24,.55)",n.fillRect(10,t-30,46,2),n.fillRect(10,t-22,38,2),n.fillRect(10,t-14,42,2),n.strokeStyle="rgba(250,244,232,.55)",n.lineWidth=1.2,n.strokeRect(3.5,3.5,t-7,t-7),a(110,.05),o(),r(4),l=n.createRadialGradient(t*.58,t*.44,2,t*.5,t*.5,t*.85),l.addColorStop(0,"#C08A50"),l.addColorStop(.34,"#7A5334"),l.addColorStop(.66,"#3A3040"),l.addColorStop(1,"#161C26"),n.fillStyle=l,n.fillRect(0,0,t,t);let h=n.createLinearGradient(0,t,t,0);h.addColorStop(0,"rgba(255,196,120,.30)"),h.addColorStop(.55,"rgba(255,196,120,.06)"),h.addColorStop(1,"rgba(255,196,120,0)"),n.fillStyle=h,n.fillRect(0,0,t,t);for(let u=0;u<30;u++){let d=i()*t,f=i()*t,g=2+i()*9,_=n.createRadialGradient(d,f,0,d,f,g);_.addColorStop(0,"rgba(255,214,150,.85)"),_.addColorStop(.45,"rgba(255,186,110,.30)"),_.addColorStop(1,"rgba(255,170,90,0)"),n.fillStyle=_,n.beginPath(),n.arc(d,f,g,0,ft),n.fill()}n.fillStyle="rgba(250,242,228,.94)",n.beginPath(),n.moveTo(t*.42,t*.58),n.lineTo(t*.72,t*.44),n.lineTo(t*.56,t*.62),n.lineTo(t*.51,t*.58),n.closePath(),n.fill(),n.strokeStyle="rgba(255,248,232,.34)",n.lineWidth=3,n.strokeRect(4,4,t-8,t-8),a(120,.04),o(),r(5),n.fillStyle="#2A2724",n.fillRect(0,0,t,t),n.fillStyle="#171513",n.fillRect(6,6,t-12,t-12),n.fillStyle="rgba(226,214,190,.92)",n.fillRect(14,30,t-28,50),n.fillStyle="rgba(58,50,42,.8)",n.fillRect(18,34,t-36,4),n.fillStyle="rgba(58,50,42,.55)",n.fillRect(18,43,t-52,2.4),n.fillRect(18,49,t-62,2.4);for(let u of[t*.34,t*.66])n.fillStyle="#0E0D0C",n.beginPath(),n.arc(u,16,10,0,ft),n.fill(),n.fillStyle="#5A5046",n.beginPath(),n.arc(u,16,5,0,ft),n.fill(),n.fillStyle="#C9BDA8",n.beginPath(),n.arc(u,16,2,0,ft),n.fill();n.fillStyle="#8E8476",n.fillRect(14,88,t-28,24),n.fillStyle="rgba(255,246,232,.30)",n.fillRect(14,88,t-28,2);for(let[u,d]of[[10,10],[t-10,10],[10,t-10],[t-10,t-10]])n.fillStyle="#6E665A",n.beginPath(),n.arc(u,d,2.6,0,ft),n.fill();a(80,.05),o(),r(6),l=n.createLinearGradient(0,0,t,t),l.addColorStop(0,"#22262B"),l.addColorStop(1,"#111418"),n.fillStyle=l,n.fillRect(0,0,t,t);for(let u=8;u<t-8;u+=6)for(let d=8+u/6%2*3;d<t-8;d+=6)n.fillStyle="rgba(4,6,8,.75)",n.beginPath(),n.arc(d,u,1.8,0,ft),n.fill(),n.fillStyle="rgba(255,240,214,.10)",n.beginPath(),n.arc(d-.6,u-.7,1,0,ft),n.fill();n.strokeStyle="rgba(206,172,116,.82)",n.lineWidth=3,n.beginPath(),n.arc(t*.5,t*.5,t*.32,0,ft),n.stroke(),n.strokeStyle="rgba(20,16,12,.55)",n.lineWidth=1.4,n.beginPath(),n.arc(t*.5,t*.5,t*.4,0,ft),n.stroke(),a(90,.04),o(),r(7),n.fillStyle="#EFE3CC",n.fillRect(0,0,t,t),n.fillStyle="rgba(90,60,50,.95)",n.fillRect(0,0,t,2);for(let u=20;u<t-8;u+=9)n.fillStyle="rgba(78,112,140,.30)",n.fillRect(12,u,t-22,1);return n.fillStyle="rgba(150,60,60,.38)",n.fillRect(0,10,1.6,t-10),n.fillStyle="rgba(78,72,64,.42)",n.fillRect(t*.55,t-14,12,2),a(100,.03),o(),de(e,{aniso:8})}function Rf(){if(zl)return zl;let s=64,{c:t,g:e}=he(s,s),n=s/2,i=e.createRadialGradient(n,n,0,n,n,n);return i.addColorStop(0,"rgba(255,246,232,.55)"),i.addColorStop(.45,"rgba(255,238,216,.20)"),i.addColorStop(1,"rgba(255,238,216,0)"),e.fillStyle=i,e.beginPath(),e.arc(n,n,n,0,ft),e.fill(),zl=de(t),zl}function Cf(){if(Hl)return Hl;let s=32,t=64,{c:e,g:n}=he(s,t),i=n.createLinearGradient(0,t,0,0);return i.addColorStop(0,"rgba(255,150,60,.95)"),i.addColorStop(.45,"rgba(255,206,120,.95)"),i.addColorStop(.8,"rgba(255,246,214,.95)"),i.addColorStop(1,"rgba(255,246,214,0)"),n.fillStyle=i,n.beginPath(),n.moveTo(s*.5,2),n.bezierCurveTo(s*.86,t*.34,s*.82,t*.82,s*.5,t*.96),n.bezierCurveTo(s*.18,t*.82,s*.14,t*.34,s*.5,2),n.closePath(),n.fill(),Hl=de(e),Hl}function Mi(s){let t=[],e=[],n=[],i=new R,r=new Qt;for(let{geo:a,matrix:l}of s){let c=a.index?a.toNonIndexed():a.clone();l&&c.applyMatrix4(l);let h=c.getAttribute("position"),u=c.getAttribute("normal"),d=c.getAttribute("uv");for(let f=0;f<h.count;f++)t.push(h.getX(f),h.getY(f),h.getZ(f)),u&&e.push(u.getX(f),u.getY(f),u.getZ(f)),d?n.push(d.getX(f),d.getY(f)):n.push(0,0);c.dispose()}let o=new ve;return o.setAttribute("position",new $t(t,3)),e.length&&o.setAttribute("normal",new $t(e,3)),o.setAttribute("uv",new $t(n,2)),e.length||o.computeVertexNormals(),o}function Vh(s){let t=[],e=[],n=[],i=[],r=new be;for(let a of s){let l=a.geo.index?a.geo.toNonIndexed():a.geo.clone(),c=a.matrix;c&&l.applyMatrix4(c);let h=l.getAttribute("position"),u=l.getAttribute("normal"),d=l.getAttribute("uv"),f=a.color||[1,1,1];for(let g=0;g<h.count;g++)t.push(h.getX(g),h.getY(g),h.getZ(g)),u?e.push(u.getX(g),u.getY(g),u.getZ(g)):e.push(0,1,0),d?n.push(d.getX(g),d.getY(g)):n.push(.5,.5),i.push(f[0],f[1],f[2]);l.dispose()}let o=new ve;return o.setAttribute("position",new $t(t,3)),o.setAttribute("normal",new $t(e,3)),o.setAttribute("uv",new $t(n,2)),o.setAttribute("color",new $t(i,3)),r.position.set(0,0,0),o}function Xl(s){let t=[],e=[],n=[],i=new R,r=new R,o=new R,a=ys(dr),l=(a[0]+a[2])/2,c=(a[1]+a[3])/2;function h(d,f,g,_,m,p){i.subVectors(f,d),r.subVectors(g,d),o.crossVectors(i,r).normalize();let M=[0,1,2,0,2,3],S=[d,f,g,_];for(let x of M){let T=S[x];t.push(T.x,T.y,T.z);let A=m[x];e.push(A[0],A[1]),n.push(p[0],p[1],p[2])}}for(let d of s){let f=Math.cos(d.rot),g=Math.sin(d.rot),_=d.w/2,m=d.d/2,p=(tt,lt,st)=>new R(d.x+tt*f+lt*g,st,d.z-tt*g+lt*f),M=Math.max(.006,Math.min(d.w,d.d)*(d.bevel===void 0?.1:d.bevel)),S=M*.95,x=_-M,T=m-M,A=d.top,P=d.top-S,C=d.uv[0],b=d.uv[1],v=d.uv[2],I=d.uv[3],F=(v-C)*.012,N=(I-b)*.012,G=[1,1,1],H=[.84,.84,.84];h(p(-x,T,A),p(x,T,A),p(x,-T,A),p(-x,-T,A),[[C+F,b+N],[v-F,b+N],[v-F,I-N],[C+F,I-N]],G),h(p(-_,m,P),p(_,m,P),p(x,T,A),p(-x,T,A),[[C,I],[v,I],[v-F,I-N],[C+F,I-N]],H),h(p(-x,-T,A),p(x,-T,A),p(_,-m,P),p(-_,-m,P),[[C+F,b+N],[v-F,b+N],[v,b],[C,b]],H),h(p(x,-T,A),p(x,T,A),p(_,m,P),p(_,-m,P),[[v-F,b+N],[v-F,I-N],[v,I],[v,b]],H),h(p(-_,-m,P),p(-_,m,P),p(-x,T,A),p(-x,-T,A),[[C,b],[C,I],[C+F,I-N],[C+F,b+N]],H);let V=l,$=c,U=[[V,$],[V,$],[V,$],[V,$]];h(p(-_,m,A),p(-_,m,d.bottom),p(_,m,d.bottom),p(_,m,A),U,d.side),h(p(_,m,A),p(_,m,d.bottom),p(_,-m,d.bottom),p(_,-m,A),U,d.side),h(p(_,-m,A),p(_,-m,d.bottom),p(-_,-m,d.bottom),p(-_,-m,A),U,d.side),h(p(-_,-m,A),p(-_,-m,d.bottom),p(-_,m,d.bottom),p(-_,m,A),U,d.side)}let u=new ve;return u.setAttribute("position",new $t(t,3)),u.setAttribute("uv",new $t(e,2)),u.setAttribute("color",new $t(n,3)),u.computeVertexNormals(),u}function If(s){let e=new jt(s,s,s,6,6,6),n=s/2,i=s*.13,r=n-i,o=e.getAttribute("position"),a=e.getAttribute("normal"),l=new R,c=new R,h=new R,u=(_,m,p)=>_<m?m:_>p?p:_;for(let _=0;_<o.count;_++)l.fromBufferAttribute(o,_),c.set(u(l.x,-r,r),u(l.y,-r,r),u(l.z,-r,r)),h.copy(l).sub(c),h.lengthSq()>1e-12&&(h.normalize(),l.copy(c).addScaledVector(h,i),o.setXYZ(_,l.x,l.y,l.z),a.setXYZ(_,h.x,h.y,h.z));o.needsUpdate=!0,a.needsUpdate=!0;let d=e.getAttribute("uv"),f=e.index,g=new Set;for(let _=0;_<6;_++){let m=jn[_],p=(m-1)%3,M=Math.floor((m-1)/3),S=e.groups[_];for(let x=S.start;x<S.start+S.count;x++){let T=f.getX(x);g.has(T)||(g.add(T),d.setXY(T,(p+d.getX(T))/3,(1-M+d.getY(T))/2))}}return d.needsUpdate=!0,e.computeBoundingSphere(),e}var kh=null,Gh=null;function wx(){return kh||(kh=Vl(256)),kh}function Ax(){return Gh||(Gh=mr(128)),Gh}function Df(s,t){let e=new me,n=.46,i=.3,r=.075,o=[0,.022,-n/2],a=[0,.05,n/2],l=[-i/2,.002,n/2-.07],c=[i/2,.002,n/2-.07],h=[0,-r,n/2-.02],u=[0,.18,n/2-.005],d=[0,.028,.02],f=(U,tt,lt,st,xt)=>{U.push(...lt,...st,...xt);for(let Nt of[lt,st,xt])tt.push(Pf(.5+Nt[0]/(i*1.45)),Pf(.5+Nt[2]/(n*1.2)))},g=[],_=[];f(g,_,o,l,d),f(g,_,o,d,c),f(g,_,d,l,a),f(g,_,d,a,c);let m=[],p=[];f(m,p,o,h,d),f(m,p,d,h,a),f(m,p,a,h,u);let M=(U,tt)=>{let lt=new ve;return lt.setAttribute("position",new $t(U,3)),lt.setAttribute("uv",new $t(tt,2)),lt.computeVertexNormals(),lt},S=wx(),x=Ax(),T=new qt({map:S.map,normalMap:S.normal,normalScale:new ot(Wt.paper.normalScale,Wt.paper.normalScale),color:s,roughness:Wt.paper.roughness,metalness:Wt.paper.metalness,side:Ue,envMapIntensity:Wt.paper.envMapIntensity}),A=new qt({map:x.map,normalMap:x.normal,roughnessMap:x.rough,normalScale:new ot(.35,.35),color:t,roughness:Wt.brass.roughness,metalness:Wt.brass.metalness,envMapIntensity:Wt.brass.envMapIntensity}),P=M(g,_),C=M(m,p),b=Mi([{geo:P},{geo:C}]);P.dispose(),C.dispose();let v=new wt(b,T);v.castShadow=!0,v.receiveShadow=!0;let I=new jt(.016,.012,n*.62),F=new Vt().makeTranslation(0,.033,.03),N=new we(.02,10,7),G=new Vt().makeTranslation(0,.005,-n/2+.022),H=Mi([{geo:I,matrix:F},{geo:N,matrix:G}]);I.dispose(),N.dispose();let V=new wt(H,A);V.castShadow=!0;let $=new me;return $.rotation.set(-.045,0,.16),$.add(v),$.add(V),e.add($),{group:e,setColor(U,tt){T.color.set(U),tt!==void 0&&A.color.set(tt)},dispose(){b.dispose(),H.dispose(),T.dispose(),A.dispose()}}}function Pf(s){return s<0?0:s>1?1:s}function Lf(){let s=new me;s.name="hand",s.visible=!1,s.scale.setScalar(.82);let t=uf(256),e=hf(128),n=new qt({vertexColors:!0,map:t.palm.map,color:16777215,roughness:.6,metalness:0,normalMap:t.palm.normal,normalScale:new ot(.85,.85),roughnessMap:t.palm.rough,envMapIntensity:.45}),i=new qt({map:t.finger.map,color:16777215,roughness:.6,metalness:0,normalMap:t.finger.normal,normalScale:new ot(.8,.8),roughnessMap:t.finger.rough,envMapIntensity:.45}),r=new qt({color:16311262,roughness:.22,metalness:0,envMapIntensity:1.3,transparent:!0,opacity:.95}),o=new qt({color:1907481,roughness:.88,metalness:.02,normalMap:e.normal,normalScale:new ot(.4,.4),envMapIntensity:.35}),a=new qt({color:11569751,roughness:.3,metalness:.88,envMapIntensity:1.3}),l=new R(0,1,0),c=new Ie,h=new R,u=new R,d=new Vt,f=(it,Ft,L,W,dt,bt)=>(c.setFromUnitVectors(l,it),d.compose(h.set(Ft,L,W),c,u.set(bt,dt,bt)),d.clone()),g=(it,Ft,L,W)=>(d.compose(h.set(it,Ft,L),c.identity(),u.set(W,W,W)),d.clone()),_=new we(1,12,10),m=[1,.99,.98],p=[1,.94,.9],M=[.9,.84,.8],S=[.95,.9,.87],x=[],T=(it,Ft,L,W,dt,bt,at)=>{let j=new Vt().compose(new R(it,Ft,L),new Ie,new R(W,dt,bt));x.push({geo:_,matrix:j,color:at})};T(0,.006,.012,.134,.052,.132,m),T(0,-.002,.112,.116,.046,.064,M),T(.084,-.002,-.045,.08,.05,.094,p),T(-.086,-.004,.012,.052,.04,.092,M),T(0,.028,-.108,.134,.032,.046,M),T(0,.047,-.002,.056,.012,.104,p),T(0,.051,-.024,.09,.01,.082,p);for(let it of[-.096,-.032,.032,.096])T(it,.034,-.13,.03,.013,.032,p);let A=new te(.108,.114,.078,16,1),P=new Vt().makeRotationX(Math.PI/2);P.setPosition(0,-.002,.214),x.push({geo:A,matrix:P,color:S});for(let it of[.176,.252]){let Ft=new te(.114,.114,.01,16,1),L=new Vt().makeRotationX(Math.PI/2);L.setPosition(0,-.002,it),x.push({geo:Ft,matrix:L,color:S})}let C=Vh(x);x.forEach(it=>{it.geo!==_&&it.geo.dispose()});let b=new wt(C,n);b.castShadow=!0,b.receiveShadow=!0,s.add(b);let v=new te(.36,.5,1,8,1,!0),I=[{x:-.098,l0:.077,l1:.059,l2:.048,w:.052,sp:-.04,ph:0,st:.86},{x:-.033,l0:.082,l1:.062,l2:.053,w:.054,sp:-.015,ph:.035,st:1.04},{x:.033,l0:.079,l1:.06,l2:.051,w:.053,sp:.015,ph:.07,st:1},{x:.098,l0:.069,l1:.053,l2:.043,w:.046,sp:.04,ph:.105,st:.82}],F=new gi(v,i,4),N=new gi(v,i,4),G=new gi(v,i,4),H=new gi(_,i,16);for(let it of[F,N,G,H])it.castShadow=!0,it.receiveShadow=!0,it.frustumCulled=!1,it.instanceMatrix.setUsage(Ml),s.add(it);let V=new we(1,8,6),$=new gi(V,r,4);$.castShadow=!0,$.frustumCulled=!1,$.instanceMatrix.setUsage(Ml),s.add($);let U=new be,tt=new R,lt=new R,st=new R,xt=-.128,Nt=.018;function It(it){let Ft=it<0?0:it>1?1:it;for(let L=0;L<4;L++){let W=I[L],dt=Math.max(0,Math.min(1,Ft*W.st+(W.ph-.05))),bt=.1+.4*dt,at=bt+.2+.62*dt,j=at+.16+.72*dt,Ct=W.x,Yt=Nt,fe=xt,ne=lt.set(Math.sin(W.sp),-Math.sin(bt),-Math.cos(bt)).normalize(),Ge=st.set(Math.sin(W.sp)*1.2,-Math.sin(at),-Math.cos(at)).normalize(),Le=tt.set(Math.sin(W.sp)*1.4,-Math.sin(j),-Math.cos(j)).normalize();U.position.set(Ct+ne.x*W.l0/2,Yt+ne.y*W.l0/2,fe+ne.z*W.l0/2),U.quaternion.setFromUnitVectors(l,ne),U.scale.set(W.w,W.l0,W.w),U.updateMatrix(),F.setMatrixAt(L,U.matrix);let Ms=Ct+ne.x*W.l0,Pn=Yt+ne.y*W.l0,ki=fe+ne.z*W.l0;U.position.set(Ms+Ge.x*W.l1/2,Pn+Ge.y*W.l1/2,ki+Ge.z*W.l1/2),U.quaternion.setFromUnitVectors(l,Ge),U.scale.set(W.w*.86,W.l1,W.w*.86),U.updateMatrix(),N.setMatrixAt(L,U.matrix);let Gi=Ms+Ge.x*W.l1,Vi=Pn+Ge.y*W.l1,ni=ki+Ge.z*W.l1;U.position.set(Gi+Le.x*W.l2/2,Vi+Le.y*W.l2/2,ni+Le.z*W.l2/2),U.quaternion.setFromUnitVectors(l,Le),U.scale.set(W.w*.7,W.l2,W.w*.7),U.updateMatrix(),G.setMatrixAt(L,U.matrix);let vo=Gi+Le.x*W.l2,Ss=Vi+Le.y*W.l2,Mo=ni+Le.z*W.l2,Wi=W.w*.54,bs=(tc,ec,nc,ic,xr)=>{U.position.set(ec,nc,ic),U.quaternion.identity(),U.scale.set(xr,xr,xr),U.updateMatrix(),H.setMatrixAt(tc,U.matrix)};bs(L*4,Ct,Yt,fe,Wi),bs(L*4+1,Ms,Pn,ki,Wi*.88),bs(L*4+2,Gi,Vi,ni,Wi*.78),bs(L*4+3,vo,Ss,Mo,Wi*.66),U.position.set(Gi+Le.x*W.l2*.58,Vi+Le.y*W.l2*.58+W.w*.42,ni+Le.z*W.l2*.58),U.quaternion.setFromUnitVectors(l,l),U.scale.set(W.w*.64,W.w*.13,W.l2*.82),U.updateMatrix(),$.setMatrixAt(L,U.matrix)}F.instanceMatrix.needsUpdate=!0,N.instanceMatrix.needsUpdate=!0,G.instanceMatrix.needsUpdate=!0,H.instanceMatrix.needsUpdate=!0,$.instanceMatrix.needsUpdate=!0}let At=new me;At.position.set(-.112,-.006,-.052);let k=.064,J=new R(0,0,-1),yt=[];yt.push({geo:v,matrix:f(J,0,0,-.053,.106,k)}),yt.push({geo:_,matrix:g(0,0,.004,.034)});let Tt=Mi(yt),St=new wt(Tt,i);St.castShadow=!0,St.receiveShadow=!0,At.add(St);let Kt=new me;Kt.position.set(0,0,-.1);let ue=[];ue.push({geo:v,matrix:f(J,0,0,-.044,.088,k*.88)}),ue.push({geo:_,matrix:g(0,0,0,.028)}),ue.push({geo:_,matrix:g(0,0,-.084,.024)});let D=Mi(ue),rt=new wt(D,i);rt.castShadow=!0,rt.receiveShadow=!0,Kt.add(rt);let et=new we(1,8,6),Q=new wt(et,r);Q.scale.set(k*.52,k*.11,.056),Q.position.set(0,k*.44,-.05),Kt.add(Q),At.add(Kt),s.add(At);let K=[],mt=new te(.15,.108,1.7,14,1),ct=new Vt().makeRotationX(Math.PI/2);ct.setPosition(0,-.012,1.14),K.push({geo:mt,matrix:ct});let gt=new te(.112,.118,.06,14,1),Jt=new Vt().makeRotationX(Math.PI/2);Jt.setPosition(0,-.006,.295),K.push({geo:gt,matrix:Jt});let Xt=Mi(K);mt.dispose(),gt.dispose();let w=new wt(Xt,o);w.castShadow=!0,w.receiveShadow=!0,s.add(w);let y=[],B=.072,Y=.011,nt=.052,Z=.116,Dt=.3;for(let[it,Ft,L,W]of[[0,-nt/2,B,Y],[0,nt/2,B,Y],[-B/2,0,Y,nt],[B/2,0,Y,nt]]){let dt=new jt(L,.01,W);y.push({geo:dt,matrix:new Vt().makeTranslation(it,Z,Dt+Ft)})}let pt=new te(.0055,.0055,B*.82,8),Pt=new Vt().makeRotationZ(Math.PI/2);Pt.setPosition(0,Z+.006,Dt),y.push({geo:pt,matrix:Pt});for(let it of[-.062,.062]){let Ft=new we(.011,8,6);y.push({geo:Ft,matrix:new Vt().makeTranslation(it,.104,.3)})}let Lt=new jt(.085,.016,.06);y.push({geo:Lt,matrix:new Vt().makeTranslation(0,.122,.66)});let ht=new jt(.03,.024,.07);y.push({geo:ht,matrix:new Vt().makeTranslation(0,.13,.66)});let Mt=Mi(y);y.forEach(it=>it.geo.dispose());let Ht=new wt(Mt,a);Ht.castShadow=!0,s.add(Ht);function Ot(it){let Ft=it<0?0:it>1?1:it;It(Ft),At.rotation.set(-.32-.55*Ft,.55+.42*Ft,.1+.18*Ft),Kt.rotation.x=-.3-.75*Ft}return Ot(0),{group:s,setGrip:Ot,gripLocal:new R(.02,-.215,-.165),textures:[t.palm.map,t.palm.normal,t.palm.rough,t.finger.map,t.finger.normal,t.finger.rough,e.normal,e.rough],dispose(){C.dispose(),v.dispose(),_.dispose(),V.dispose(),Tt.dispose(),D.dispose(),et.dispose(),Xt.dispose(),Mt.dispose(),n.dispose(),i.dispose(),r.dispose(),o.dispose(),a.dispose(),s.clear()}}}function ql(s,t){let e=new wt(new Me(s,s),new ke({map:yf(),transparent:!0,opacity:t===void 0?.5:t,depthWrite:!1,color:0}));return e.rotation.x=-Math.PI/2,e.position.y=.006,e}function gr(s,t){let e=new wt(new Me(s,s),new ke({map:Hi(),transparent:!0,opacity:0,depthWrite:!1,blending:Ye,color:t,fog:!1,toneMapped:!1}));return e.rotation.x=-Math.PI/2,e}function Ff(s){let t=new wt(new Me(s,s),new ke({map:Mf(),transparent:!0,opacity:0,depthWrite:!1,blending:Ye,color:16767138,fog:!1,toneMapped:!1}));return t.rotation.x=-Math.PI/2,t.position.y=.01,t}function Uf(s){let t=new me;t.visible=!1;let e=new ke({map:s,transparent:!0,opacity:.36,depthWrite:!1,blending:Ye,color:16771272,fog:!1,toneMapped:!1}),n=[];for(let i=0;i<10;i++){let r=new Me(.045,2.4),o=new wt(r,e),a=i/10*Math.PI*2+i%3*.3,l=.55+i%4*.24;o.position.set(Math.cos(a)*l,.45+i%5*.22,-2.2+i%3*1.3),o.rotation.z=(i%2?1:-1)*.06,t.add(o),n.push(o)}return{group:t,update(i,r){if(r)for(let o of n)o.position.z+=i*.0065,o.position.z>3.4&&(o.position.z-=6.2)},dispose(){n.forEach(i=>i.geometry.dispose()),e.dispose()}}}var Wh=null,Xh=null;function Rx(){return Wh||(Wh=Gl(13616826,128)),Wh}function Cx(){return Xh||(Xh=mr(96)),Xh}function Nf(){let s=new me,t=Rx(),e=Cx(),n={fur:new qt({map:t.map,normalMap:t.normal,normalScale:new ot(.85,.85),color:9071180,roughness:Wt.felt.roughness,metalness:0,envMapIntensity:.35}),furDark:new qt({map:t.map,normalMap:t.normal,normalScale:new ot(.7,.7),color:7098682,roughness:.96,metalness:0,envMapIntensity:.3}),cream:new qt({map:t.map,color:15259323,roughness:.9,metalness:0,envMapIntensity:.35}),ink:new qt({color:1314832,roughness:.22,metalness:.15,envMapIntensity:.9}),hat:new qt({map:t.map,normalMap:t.normal,color:2438222,roughness:.86,metalness:.02,envMapIntensity:.4}),band:new qt({map:e.map,normalMap:e.normal,roughnessMap:e.rough,color:13213795,roughness:Wt.brass.roughness,metalness:Wt.brass.metalness,envMapIntensity:Wt.brass.envMapIntensity}),scarf:new qt({map:t.map,normalMap:t.normal,color:9321275,roughness:.94,metalness:0,envMapIntensity:.3})},i={},r=new be,o=(l,c,h,u,d,f,g)=>{r.position.set(h,u,d),r.rotation.set(f&&f[0]||0,f&&f[1]||0,f&&f[2]||0),r.scale.set(g?g[0]:1,g?g[1]:1,g?g[2]:1),r.updateMatrix(),(i[l]=i[l]||[]).push({geo:c,matrix:r.matrix.clone()})};o("fur",new we(.135,14,10),0,.155,0),o("fur",new we(.125,14,10),0,.375,0),o("cream",new we(.062,12,9),0,.345,-.1),o("ink",new we(.019,10,8),0,.368,-.152),o("ink",new we(.017,8,6),-.05,.42,-.116),o("ink",new we(.017,8,6),.05,.42,-.116),o("furDark",new we(.047,12,9),-.082,.462,.004),o("furDark",new we(.047,12,9),.082,.462,.004),o("fur",new $s(.028,.085,3,8),-.128,.185,0,[0,0,.55]),o("fur",new $s(.028,.085,3,8),.128,.185,0,[0,0,-.55]),o("furDark",new we(.05,10,8),-.062,.042,-.018),o("furDark",new we(.05,10,8),.062,.042,-.018),o("scarf",new Xe(.118,.032,7,18),0,.268,0,[Math.PI/2,0,0]),o("scarf",new jt(.07,.1,.026),.095,.215,.05,[.2,.1,-.2]),o("hat",new te(.098,.106,.058,16,1),0,.468,.012),o("band",new te(.104,.104,.012,18,1),0,.443,.012),o("hat",new we(.062,14,9),0,.474,-.062,null,[1.04,.17,.52]),o("band",new Xe(.026,.008,5,14),0,.468,-.092,[-.5,0,0]);let a=[];for(let l of Object.keys(i)){let c=i[l],h=Px(c),u=new wt(h,n[l]);u.castShadow=!0,u.receiveShadow=!0,s.add(u),a.push(h),c.forEach(d=>d.geo.dispose())}return s.position.y=ps,s.rotation.y=Math.PI+Bi*Ne,s.scale.setScalar(.001),s.visible=!1,{group:s,setOutfit(l){l&&(l.fur!==void 0&&n.fur.color.set(l.fur),l.furDark!==void 0&&n.furDark.color.set(l.furDark),l.hat!==void 0&&n.hat.color.set(l.hat),l.band!==void 0&&n.band.color.set(l.band),l.scarf!==void 0&&n.scarf.color.set(l.scarf))},setVisible(l){s.visible=!!l},dispose(){a.forEach(l=>l.dispose()),Object.keys(n).forEach(l=>n[l].dispose())}}}function Px(s){let t=[],e=[],n=[];for(let{geo:r,matrix:o}of s){let a=r.index?r.toNonIndexed():r.clone();a.applyMatrix4(o);let l=a.getAttribute("position"),c=a.getAttribute("normal"),h=a.getAttribute("uv");for(let u=0;u<l.count;u++)t.push(l.getX(u),l.getY(u),l.getZ(u)),c&&e.push(c.getX(u),c.getY(u),c.getZ(u)),h?n.push(h.getX(u),h.getY(u)):n.push(0,0);a.dispose()}let i=new ve;return i.setAttribute("position",new $t(t,3)),e.length?i.setAttribute("normal",new $t(e,3)):i.computeVertexNormals(),i.setAttribute("uv",new $t(n,2)),i}function qh(s){let t=Number(s);return isFinite(t)?Math.min(1.5,Math.max(.8,t)):1}function Yh(s){let t=qh(s),e=t<=1?1/t:1-.6*(t-1);return Math.min(1.4,Math.max(.7,e))}var Yl=class{constructor(t={}){this.min=t.min||.8,this.max=t.max||1.5,this.tau=t.tau||110,this.target=1,this.value=1,this.active=!0,this.instant=!1}set(t){let e=Number(t);return isFinite(e)&&(this.target=Math.min(this.max,Math.max(this.min,e))),this.instant&&(this.value=this.target),this.target}by(t){let e=Number(t);return this.set(this.target*(isFinite(e)&&e>0?e:1))}reset(){return this.set(1)}setActive(t){let e=!!t;return e===this.active?this.active:(this.active=e,this.instant&&(this.value=this.want()),this.active)}setInstant(t){return this.instant=!!t,this.instant&&(this.value=this.want()),this.instant}want(){return this.active?this.target:1}step(t){let e=this.want();if(this.instant||!(t>0))return this.value=e,this.value;let n=1-Math.exp(-t/this.tau),i=this.value+(e-this.value)*n;return this.value=Math.abs(e-i)<8e-4?e:i,this.value}info(){return{value:+this.value.toFixed(3),target:+this.target.toFixed(3),min:this.min,max:this.max,active:this.active,instant:this.instant,radiusFactor:+Yh(this.value).toFixed(3)}}};var Zl=class{constructor(t,e={}){this.camera=t,this.runAnim=e.runAnim||((n,i)=>(i(1),Promise.resolve())),this.aspect=1,this.lockState=null,this.shakeUntil=0,this.shakeAmp=0,this.state={center:new R(0,.05,.24),nx:0,ny:0,radius:12,elev:58,azim:0,fov:42},this._right=new R,this._up=new R,this._proj=new R,this._look=new R,this.zoom=new Yl,this._lastApplyAt=0}setZoom(t){return this.zoom.set(qh(t))}zoomBy(t){return this.zoom.by(t)}resetZoom(){return this.zoom.reset()}setZoomActive(t){return this.zoom.setActive(t)}setZoomReduced(t){return this.zoom.setInstant(t)}get zoomValue(){return this.zoom.value}zoomInfo(){return this.zoom.info()}setAspect(t){this.aspect=Math.max(.2,t||1),this.camera.aspect=this.aspect,this.camera.updateProjectionMatrix()}camPosFrom(t,e,n,i){let r=n*Ne,o=i*Ne;return new R(t.x+e*Math.cos(r)*Math.sin(o),t.y+e*Math.sin(r),t.z+e*Math.cos(r)*Math.cos(o))}apply(){let t=this.camera,e=typeof performance!="undefined"&&performance.now?performance.now():Date.now(),n=this._lastApplyAt?Math.min(80,Math.max(0,e-this._lastApplyAt)):16;if(this._lastApplyAt=e,this.lockState){t.position.copy(this.lockState.pos),t.quaternion.copy(this.lockState.quat),t.fov!==this.lockState.fov&&(t.fov=this.lockState.fov,t.updateProjectionMatrix()),this._applyShake(),t.updateMatrixWorld(!0);return}let i=this.state,r=Yh(this.zoom.step(n));t.fov!==i.fov&&(t.fov=i.fov,t.updateProjectionMatrix());let o=this._look.copy(i.center);for(let a=0;a<3&&(t.position.copy(this.camPosFrom(o,i.radius*r,i.elev,i.azim)),t.lookAt(o),t.updateMatrixWorld(!0),!(i.nx===0&&i.ny===0));a++){this._proj.copy(i.center).project(t);let c=t.position.distanceTo(i.center)*Math.tan(i.fov*Ne/2),h=c*this.aspect;this._right.setFromMatrixColumn(t.matrixWorld,0),this._up.setFromMatrixColumn(t.matrixWorld,1),o.addScaledVector(this._right,(this._proj.x-i.nx)*h),o.addScaledVector(this._up,(this._proj.y-i.ny)*c)}t.position.copy(this.camPosFrom(o,i.radius*r,i.elev,i.azim)),t.lookAt(o),this._applyShake(),t.updateMatrixWorld(!0)}_applyShake(){if(!this.shakeAmp)return;if(performance.now()>this.shakeUntil){this.shakeAmp=0;return}let t=this.shakeAmp;this.camera.position.x+=(Math.random()-.5)*t,this.camera.position.y+=(Math.random()-.5)*t,this.camera.position.z+=(Math.random()-.5)*t}shake(t,e){this.shakeUntil=performance.now()+Math.max(1,t),this.shakeAmp=e}lock(){this.lockState={pos:this.camera.position.clone(),quat:this.camera.quaternion.clone(),fov:this.camera.fov}}unlock(){this.lockState=null}get locked(){return!!this.lockState}snapshotTarget(){return{center:this.state.center.clone(),nx:this.state.nx,ny:this.state.ny,radius:this.state.radius,elev:this.state.elev,azim:this.state.azim,fov:this.state.fov}}snap(t){let e=this.state;e.center.copy(t.center),e.nx=t.nx,e.ny=t.ny,e.radius=t.radius,e.elev=t.elev,e.azim=t.azim,e.fov=t.fov,this.lockState=null,this.apply()}animate(t,e,n){let i=this.snapshotTarget();return this.lockState=null,this.runAnim(t,r=>{let o=xs(re(r,0,1)),a=this.state;a.center.copy(n?n(o):e.center),a.nx=ae(i.nx,e.nx,o),a.ny=ae(i.ny,e.ny,o),a.radius=ae(i.radius,e.radius,o),a.elev=ae(i.elev,e.elev,o),a.azim=ae(i.azim,e.azim,o),a.fov=ae(i.fov,e.fov,o),this.apply()})}distForCover(t,e,n){let i=n*Ne,r=2*Math.atan(Math.tan(i/2)*this.aspect);return t/Math.tan(r/2)/re(e,.1,1)}ndcOf(t){let e=t.clone().project(this.camera);return{x:+e.x.toFixed(5),y:+e.y.toFixed(5)}}};function Zh(s){let t=/^hangar:(red|yellow|blue|green):(\d+)$/.exec(s||"");if(t)return{type:"hangar",color:t[1],slot:Number(t[2])};let e=/^ring:(\d+)$/.exec(s||"");if(e)return{type:"ring",n:Number(e[1])};let n=/^home:(red|yellow|blue|green):goal$/.exec(s||"");if(n)return{type:"goal",color:n[1]};let i=/^home:(red|yellow|blue|green):(\d+)$/.exec(s||"");return i?{type:"home",color:i[1],step:Number(i[2])}:null}function Si(s){let t=Zh(s)||{type:"ring",n:0};if(t.type==="ring"){let r=Qn(t.n);return{x:cr*Math.sin(r),y:ms,z:-cr*Math.cos(r),yaw:-Math.PI/2-r,parsed:t}}if(t.type==="home"){let r=Qn(vi[t.color]),o=Rl-t.step*Cl;return{x:o*Math.sin(r),y:Jn-.006+Oi,z:-o*Math.cos(r),yaw:Math.PI-r,parsed:t}}if(t.type==="goal")return{x:0,y:ms+.045,z:0,yaw:Math.PI,parsed:t};let e=hr[t.color]*Ne,n=t.slot%2===0?-.2:.2,i=t.slot<2?-.2:.2;return{x:Kn*Math.sin(e)+(n*Math.cos(e)+i*Math.sin(e)),y:an+.05+Oi,z:-Kn*Math.cos(e)+(-n*Math.sin(e)+i*Math.cos(e)),yaw:-e-Math.PI,parsed:t}}function Ix(s,t,e){let n=Si(s),i=Math.max(1,e||1),r=re(t||0,0,i-1);if(i<=1)return n;if(n.parsed.type==="goal"){let l=r/i*ft+.6;return{...n,x:Math.cos(l)*.16,z:Math.sin(l)*.16,yaw:Math.PI+l}}if(n.parsed.type==="hangar")return n;let o=r/i*ft+.7,a=n.parsed.type==="home"?.052:.062;return{...n,x:n.x+Math.cos(o)*a,z:n.z+Math.sin(o)*a}}function Dx(s){let t=Zh(s);if(!t)return{x:0,z:0};if(t.type==="ring"){let e=Qn(t.n);return{x:Math.cos(e),z:Math.sin(e)}}if(t.type==="home"){let e=Qn(vi[t.color]);return{x:-Math.sin(e),z:Math.cos(e)}}if(t.type==="hangar"){let e=hr[t.color]*Ne;return{x:Math.sin(e),z:-Math.cos(e)}}return{x:0,z:0}}function Lx(s,t,e,n){let i=0;Math.abs(e)+Math.abs(n)>1e-6&&(i=Math.atan2(e,-n));let r=Math.cos(i),o=Math.sin(i),a=s*r+t*o,l=-s*o+t*r;return{theta:i,tx:-a,tz:-l}}function _o(s){let t=Si(s),e=Dx(s);return Lx(t.x,t.z,e.x,e.z)}function $h(s,t,e){return{theta:s.theta+Ul(s.theta,t.theta)*e,tx:s.tx+(t.tx-s.tx)*e,tz:s.tz+(t.tz-s.tz)*e}}var Fx={takeoff:1,move:1,jump:1,fly:1};function Jh(s){return!!(s&&Fx[s.type])}function Of(s){if(!s)return null;if(s.type==="takeoff")return s.path&&s.path[0]||null;if(s.type==="move"){let t=s.path&&s.path[0],e=Zh(t);return e?e.type==="ring"?"ring:"+Dl(e.n-1):e.type==="home"?e.step>0?"home:"+e.color+":"+(e.step-1):"ring:"+vi[e.color]:e.type==="goal"?"home:"+e.color+":4":null:null}return(s.type==="jump"||s.type==="fly")&&s.from||null}function xo(s){if(!s)return null;if(s.type==="takeoff"){let t=s.path||[];return t[t.length-1]||null}if(s.type==="move"){let t=s.path||[];return t[t.length-1]||null}return s.to||null}function Bf(s){let t={};for(let i of s||[])t[i.squareId]=(t[i.squareId]||0)+1;let e={},n={};for(let i of s||[]){let r=e[i.squareId]||0;e[i.squareId]=r+1,n[i.id]=Ix(i.squareId,r,t[i.squareId])}return n}var Kh=3.3,ei=new R(zi.x,zi.y,zi.z),$l=new R(.834,.64,.863),_r=new R(0,ms,0),sn={enterMs:260,descendMs:80,closeMs:110,liftMs:260,throwMs:130,exitMs:330,releaseAt:840,total:2380},$e={step:1/240,g:8.6,rest:[.47,.42,.37],tan:[.74,.7,.66],airDrag:.18,spinDamp:.45,rollFriction:2.7,boundR:2.78,maxActive:1.54,settleMs:320,restPad:.3,minEnd:1.18};function Ux(){let s=typeof navigator!="undefined"?navigator:{},t=s.userAgent||"",e=typeof window!="undefined"&&window.devicePixelRatio||1;if(/Android|iPhone|iPad|iPod|Mobile/i.test(t))return e>=2?"high":"medium";let n=s.deviceMemory||8,i=s.hardwareConcurrency||8;return n<=4||i<=4?"medium":"high"}var Kl=class{constructor(t,e,n={}){this.host=t,this.canvas=e,this.reduced=!!n.reduced,this._shadowOpt=n.shadows!==!1,this.adapt=n.adapt!==!1,this.quality=n.quality&&ln[n.quality]?n.quality:Ux(),this.shadows=this._shadowOpt&&ln[this.quality].shadow>0,this.theme=n.theme&&fs[n.theme]?n.theme:"cloud",this.heat=0,this.turn="a",this.colors={a:"red",b:"yellow"},this.planes=new Map,this.pieces=[],this.anims=[],this.dimK=1,this.dieValue=1,this._dieYaw=.22,this._toss=null,this._hand=null,this.stageRise=0,this.stageId=null,this.viewport={w:0,h:0},this.ready=!1,this.onReady=null,this.onResize=null,this._last=0,this._raf=0,this._paused=!1,this._inFrame=!1,this._v=new R,this._v2=new R,this._right=new R,this._up=new R,this._upY=new R(0,1,0),this._axis=new R,this._q1=new Ie,this._q2=new Ie,this._planesDirty=!0,this._tex=[],this.lockProbeId=null,this.perf={phase:"boot",frames:0,sum:0,max:0,long25:0,long50:0,since:0,updateSum:0,renderSum:0,phases:{}},this.lockStats={samples:0,maxAbsX:0,maxAbsY:0,reset(){this.samples=0,this.maxAbsX=0,this.maxAbsY=0}},this.lastCalls=0,this.lastTris=0,this._elevK=0,this._fxTime=0,this._dustCount=ln[this.quality].dust,this._dustBase=null,this._winTex={},this._wallTex={},this._overlayTex={},this._hubTex={},this._buildRenderer(),this._buildScene(),this._buildEnvironment(),this._buildLights(),this._buildCabin(),this._buildTable(),this._buildCabinDetail(),this._buildBoard(),this._buildStage(),this._buildDie(),this._buildHand(),this._buildPlanesLayer(),this._buildAtmosphere(),this._buildProps(),this._buildComfort(),this._buildFx(),this._bindResize(),this._bindVisibility(),this.applyTheme(this.theme,!0),this.applyHeat(0),this.applyTurn("a",this.colors),this._applyQuality(),this.resize(),this.renderNow(),this._startLoop()}_buildRenderer(){let t=window.devicePixelRatio||1,e=this.quality!=="low";this.renderer=new Tl({canvas:this.canvas,antialias:e,alpha:!1,powerPreference:"high-performance",stencil:!1,depth:!0}),this.renderer.outputColorSpace=Ve,this.renderer.toneMapping=Na,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=this.shadows,this.renderer.shadowMap.type=Ra,this.useAA=e,this._aniso=Math.min(8,this.renderer.capabilities.getMaxAnisotropy()),this._wood=ff(15128258,512),this._felt=Gl(15261906,256),this._brass=mr(256);for(let n of[this._wood,this._felt,this._brass])for(let i of["map","normal","rough"]){let r=n[i];r&&(r.wrapS=r.wrapT=fi,r.needsUpdate=!0)}this._tex.push(this._wood.map,this._wood.normal,this._wood.rough,this._felt.map,this._felt.normal,this._felt.rough,this._brass.map,this._brass.normal,this._brass.rough)}_buildScene(){this.scene=new ji,this.scene.background=new Bt(329741),this.camera=new We(42,1,.05,240),this.rig=new Zl(this.camera,{runAnim:(t,e)=>this.runAnim(t,e)})}_buildEnvironment(){try{let t=new rr(this.renderer),e=Tf(),n=t.fromScene(e,.04,.1,100);this.envRT=n,this.envTex=n.texture,this.scene.environment=this.envTex,this.scene.environmentIntensity=.55,e.traverse(i=>{i.geometry&&i.geometry.dispose(),i.material&&i.material.dispose()}),t.dispose()}catch(t){console.warn("[board3d] PMREM failed:",t&&t.message?t.message:t),this.envTex=null}}_buildLights(){let t=vs(this.theme);this.hemi=new oo(t.light.hemiSky,t.light.hemiGround,t.light.hemiInt),this.scene.add(this.hemi),this.ambient=new lo(16777215,.055),this.scene.add(this.ambient),this.key=new Ui(t.light.key,t.light.keyInt),this.key.position.set(-3.4,5.6,-2.2),this.key.castShadow=this.shadows,this.key.shadow.mapSize.set(ln[this.quality].shadow,ln[this.quality].shadow),this.key.shadow.camera.left=-6.5,this.key.shadow.camera.right=6.5,this.key.shadow.camera.top=6.5,this.key.shadow.camera.bottom=-6.5,this.key.shadow.camera.near=.5,this.key.shadow.camera.far=26,this.key.shadow.bias=-6e-4,this.key.shadow.normalBias=.015,this.key.shadow.radius=3,this.scene.add(this.key),this.keyTarget=new be,this.scene.add(this.keyTarget),this.key.target=this.keyTarget,this.rim=new Ui(t.light.rim,t.light.rimInt),this.rim.position.set(4.6,3.2,-3.4),this.scene.add(this.rim),this.fill=new Ui(t.light.fill,t.light.fillInt),this.fill.position.set(.4,2.4,6),this.scene.add(this.fill),this.wallWash=new Ui(t.light.rim,t.light.rimInt*.52),this.wallWash.position.set(.8,3.4,3.2),this.wallWash.target.position.set(.4,1,_t.wallZ),this.scene.add(this.wallWash),this.scene.add(this.wallWash.target),this.lamp=new Fi(t.light.lamp,t.light.lampInt,t.light.lampDist,2),this.lamp.position.set(_t.lamp.x,_t.lamp.y-.12,_t.lamp.z+.16),this.scene.add(this.lamp)}_buildCabin(){let t=new me;this.scene.add(t),this.cabinGroup=t,this.wallMat=new qt({color:16777215,roughness:.88,metalness:.02,envMapIntensity:.25});let e=new wt(new Me(_t.wallW,_t.wallH),this.wallMat);e.position.set(0,_t.wallBottom+_t.wallH/2,_t.wallZ),e.receiveShadow=!1,t.add(e),this.wallMesh=e;let n=new wt(new jt(_t.wallW*.46,.03,.03),this._brassMat());n.position.set(-1.2,_t.window.y+_t.window.h/2+.26,_t.wallZ+.035),t.add(n),this.wallTrim=n,this.windowMat=new ke({map:null,fog:!1,color:15003127});let i=Math.min(_t.window.w,_t.window.h)*.3,r=Nx(_t.window.w,_t.window.h,i),o=new wt(r,this.windowMat);o.position.set(_t.window.x,_t.window.y,_t.window.z),t.add(o),this.windowMesh=o,this._winGeo=r,this.glassMat=new so({color:12571876,roughness:Wt.glass.roughness,metalness:Wt.glass.metalness,transparent:!0,opacity:.16,envMapIntensity:Wt.glass.envMapIntensity,depthWrite:!1,side:Ue,clearcoat:1,clearcoatRoughness:.15});let a=new wt(r,this.glassMat);a.position.set(_t.window.x,_t.window.y,_t.window.z+.012),t.add(a),this.glassMesh=a;let l=_t.window.w+.26,c=_t.window.h+.26,h=i+.13,u=new Nn;u.moveTo(-l/2+h,-c/2),u.lineTo(l/2-h,-c/2),u.quadraticCurveTo(l/2,-c/2,l/2,-c/2+h),u.lineTo(l/2,c/2-h),u.quadraticCurveTo(l/2,c/2,l/2-h,c/2),u.lineTo(-l/2+h,c/2),u.quadraticCurveTo(-l/2,c/2,-l/2,c/2-h),u.lineTo(-l/2,-c/2+h),u.quadraticCurveTo(-l/2,-c/2,-l/2+h,-c/2);let d=new Ii,f=_t.window.w,g=_t.window.h,_=i;d.moveTo(-f/2+_,-g/2),d.lineTo(f/2-_,-g/2),d.quadraticCurveTo(f/2,-g/2,f/2,-g/2+_),d.lineTo(f/2,g/2-_),d.quadraticCurveTo(f/2,g/2,f/2-_,g/2),d.lineTo(-f/2+_,g/2),d.quadraticCurveTo(-f/2,g/2,-f/2,g/2-_),d.lineTo(-f/2,-g/2+_),d.quadraticCurveTo(-f/2,-g/2,-f/2+_,-g/2),u.holes.push(d);let m=new is(u,{depth:.06,bevelEnabled:!0,bevelThickness:.016,bevelSize:.016,bevelSegments:2,curveSegments:8,steps:1}),p=new wt(m,this._brassMat());p.position.set(_t.window.x,_t.window.y,_t.window.z+.03),p.castShadow=!1,t.add(p),this.windowFrame=p;let M=_t.window.h*_t.shade;this.shadeMat=new qt({map:this._felt.map,normalMap:this._felt.normal,color:2367002,roughness:Wt.felt.roughness,metalness:0,envMapIntensity:.2});let S=new wt(new Me(_t.window.w+.2,M),this.shadeMat);S.position.set(_t.window.x,_t.window.y+_t.window.h/2-M/2+.02,_t.window.z+.02),t.add(S),this.shadeMesh=S;let x=new wt(new te(.016,.016,_t.window.w+.22,8,1),this._brassMat());x.rotation.z=Math.PI/2,x.position.set(_t.window.x,_t.window.y+_t.window.h/2-M+.02,_t.window.z+.025),t.add(x);let T=this._brassMat(),A=new te(.055,.055,.022,14),P=new Vt().makeRotationX(Math.PI/2);P.setPosition(_t.lamp.x,_t.lamp.y,_t.wallZ+.055);let C=new te(.014,.014,.3,8),b=new Vt().makeRotationX(Math.PI/2);b.setPosition(_t.lamp.x,_t.lamp.y,_t.wallZ+.2);let v=new es(.125,.16,18,1,!0),I=new Vt().makeTranslation(_t.lamp.x,_t.lamp.y+.01,_t.lamp.z),F=Mi([{geo:A,matrix:P},{geo:C,matrix:b},{geo:v,matrix:I}]);A.dispose(),C.dispose(),v.dispose();let N=new wt(F,T);N.castShadow=!1,t.add(N),this.lampMesh=N,this.bulbMat=new ke({color:15320988,toneMapped:!1,fog:!1});let G=new wt(new we(.038,12,9),this.bulbMat);G.position.set(_t.lamp.x,_t.lamp.y-.055,_t.lamp.z),t.add(G),this.bulb=G,this.lampGlow=new Un(new Tn({map:Hi(),color:16763274,transparent:!0,opacity:.42,blending:Ye,depthWrite:!1,depthTest:!0,fog:!1,toneMapped:!1})),this.lampGlow.scale.set(1.9,1.9,1),this.lampGlow.position.set(_t.lamp.x,_t.lamp.y-.05,_t.lamp.z+.02),t.add(this.lampGlow),this.winGlow=new Un(new Tn({map:Hi(),color:10471152,transparent:!0,opacity:.22,blending:Ye,depthWrite:!1,fog:!1,toneMapped:!1})),this.winGlow.scale.set(3.6,2.6,1),this.winGlow.position.set(_t.window.x,_t.window.y,_t.window.z+.16),t.add(this.winGlow),this.floorMat=new qt({color:724240,roughness:.92,metalness:.02,envMapIntensity:.2});let H=new wt(new Me(26,16),this.floorMat);H.rotation.x=-Math.PI/2,H.position.set(0,_t.floorY,-2),H.receiveShadow=!0,t.add(H),this.floor=H}_brassMat(){return this._brassMaterial||(this._brassMaterial=new qt({map:this._brass.map,normalMap:this._brass.normal,roughnessMap:this._brass.rough,color:11569751,roughness:Wt.brass.roughness,metalness:Wt.brass.metalness,envMapIntensity:Wt.brass.envMapIntensity})),this._brassMaterial}_buildTable(){this.world=new me,this.scene.add(this.world),this.woodMat=new qt({map:this._wood.map,normalMap:this._wood.normal,roughnessMap:this._wood.rough,normalScale:new ot(Wt.walnut.normalScale,Wt.walnut.normalScale),color:15391947,roughness:Wt.walnut.roughness,metalness:Wt.walnut.metalness,envMapIntensity:Wt.walnut.envMapIntensity}),this._wood.map.repeat.set(.16,.16),this._wood.normal.repeat.set(.16,.16),this._wood.rough.repeat.set(.16,.16);let t=vn.w,e=vn.d,n=vn.r,i=new Nn;i.moveTo(-t/2+n,-e/2),i.lineTo(t/2-n,-e/2),i.quadraticCurveTo(t/2,-e/2,t/2,-e/2+n),i.lineTo(t/2,e/2-n),i.quadraticCurveTo(t/2,e/2,t/2-n,e/2),i.lineTo(-t/2+n,e/2),i.quadraticCurveTo(-t/2,e/2,-t/2,e/2-n),i.lineTo(-t/2,-e/2+n),i.quadraticCurveTo(-t/2,-e/2,-t/2+n,-e/2);let r=new is(i,{depth:vn.h,bevelEnabled:!0,bevelThickness:.03,bevelSize:.03,bevelSegments:2,curveSegments:8,steps:1});r.rotateX(-Math.PI/2),r.computeBoundingBox();let o=new wt(r,this.woodMat);o.position.set(0,-r.boundingBox.max.y,vn.z),o.receiveShadow=!0,this.tableMesh=o,this.world.add(o);let a=Jl(vn.w-.16,vn.d-.16,vn.r-.05);a.holes.push(zf(vn.w-.22,vn.d-.22,vn.r-.07));let l=new wt(new _i(a,10),this._brassMat());l.rotation.x=-Math.PI/2,l.position.set(0,.0018,vn.z),this.world.add(l),this.tableEdge=l;let c=Jl(je.w,je.d,je.r);this.feltMat=new qt({map:this._felt.map,normalMap:this._felt.normal,roughnessMap:this._felt.rough,normalScale:new ot(Wt.felt.normalScale,Wt.felt.normalScale),color:4612716,roughness:Wt.felt.roughness,metalness:0,envMapIntensity:Wt.felt.envMapIntensity}),this._felt.map.repeat.set(1/1.35,1/1.35),this._felt.normal.repeat.set(1/1.35,1/1.35),this._felt.rough.repeat.set(1/1.35,1/1.35),this.felt=new wt(new _i(c,12),this.feltMat),this.felt.rotation.x=-Math.PI/2,this.felt.position.set(0,.0045,je.z),this.felt.receiveShadow=!0,this.world.add(this.felt),this.matOverMat=new ke({map:null,transparent:!0,opacity:1,depthWrite:!1,fog:!1}),this.over=new wt(new Me(je.w,je.d),this.matOverMat),this.over.rotation.x=-Math.PI/2,this.over.position.set(0,.0075,je.z),this.world.add(this.over);let h=Jl(je.w+.26,je.d+.26,je.r+.1),u=zf(je.w+.06,je.d+.06,je.r+.04);h.holes.push(u);let d=new wt(new _i(h,10),this._brassMat());d.rotation.x=-Math.PI/2,d.position.set(0,.0035,je.z),this.world.add(d),this.inlay=d,this.boardGroup=new me,this.world.add(this.boardGroup),this._buildCup(this.world)}_buildCup(t){let e=new qt({color:14997702,roughness:.24,metalness:0,envMapIntensity:1.15}),n=new qt({color:2363913,roughness:.2,metalness:0,envMapIntensity:.9}),i=this._brassMat(),r=[],o=(_,m,p,M,S)=>{let x=new Vt().makeRotationX(S||0);x.setPosition(m,p,M),r.push({geo:_,matrix:x})};o(new te(.335,.315,.022,32),0,.012,0),o(new te(.148,.112,.215,26,1,!0),0,.132,0);let a=new Xe(.082,.017,7,16,Math.PI*1.25),l=new Vt().makeRotationZ(-.5);l.setPosition(.155,.145,0),r.push({geo:a,matrix:l});let c=Mi(r);r.forEach(_=>_.geo.dispose());let h=new wt(c,e);h.castShadow=!0,h.receiveShadow=!0;let u=new Jr(.13,24);u.rotateX(-Math.PI/2);let d=new wt(u,n);d.position.y=.212;let f=new wt(new Xe(.148,.011,6,26),i);f.rotation.x=-Math.PI/2,f.position.y=.24;let g=new me;g.add(h,d,f),g.position.set(-1.72,.0045,4.28),g.rotation.y=.42,g.scale.setScalar(2),t.add(g),this.cupGroup=g}_buildCabinDetail(){let t=this.cabinGroup;if(!t)return;this.binMat=new qt({color:1581355,roughness:.84,metalness:.04,envMapIntensity:.22});let e=new wt(new jt(De.bin.w,De.bin.h,De.bin.d),this.binMat);e.position.set(0,De.bin.y,_t.wallZ+De.bin.inset),e.receiveShadow=!1,t.add(e),this.bin=e;let n=new wt(new jt(De.bin.w*.985,.022,.02),this._brassMat());n.position.set(0,De.bin.y-De.bin.h/2+.026,_t.wallZ+De.bin.inset+De.bin.d/2),t.add(n),this.binLatch=n,this.stripMat=new ke({color:De.strip.color,transparent:!0,opacity:.42,toneMapped:!1,fog:!1}),this.strip=new wt(new jt(De.strip.w,De.strip.h,De.strip.d),this.stripMat),this.strip.position.set(0,De.strip.y,_t.wallZ+.36),t.add(this.strip),this.binGlow=new Un(new Tn({map:Hi(),color:16765600,transparent:!0,opacity:.13,blending:Ye,depthWrite:!1,depthTest:!0,fog:!1,toneMapped:!1})),this.binGlow.scale.set(10.5,1.5,1),this.binGlow.position.set(0,De.strip.y-.02,_t.wallZ+.42),t.add(this.binGlow),this.curtainTex=wf(96),this._tex.push(this.curtainTex),this.curtainMat=new qt({map:this.curtainTex,color:9075304,roughness:.96,metalness:0,envMapIntensity:.25,side:Ue});let i=De.curtain.w,r=De.curtain.h;this.curtains=[];for(let a of[-1,1]){let l=new me,c=_t.window.x+a*(_t.window.w/2+De.curtain.off),h=_t.window.y+_t.window.h/2+.1;l.position.set(c,h,_t.window.z+.055);let u=new wt(new Me(i,r,5,1),this.curtainMat);u.position.y=-r/2,u.castShadow=!1,l.add(u),l.userData.baseY=0,t.add(l),this.curtains.push(l),this._tex.push(this.curtainTex)}let o=new wt(new te(.014,.014,_t.window.w+.75,8,1),this._brassMat());o.rotation.z=Math.PI/2,o.position.set(_t.window.x,_t.window.y+_t.window.h/2+.115,_t.window.z+.06),t.add(o),this.curtainRod=o;for(let a of[-1,1]){let l=new wt(new we(.032,8,6),this._brassMat());l.position.set(_t.window.x+a*(_t.window.w/2+.38),_t.window.y+_t.window.h/2+.115,_t.window.z+.06),t.add(l)}}_buildProps(){let t=Uh,e=Vl(256),n=Af(128);this.propPaper=e,this.propAtlas=n,this._tex.push(e.map,e.normal,n);let i=new me;this.world.add(i),this.propGroup=i,this.propAnchors={},this.propMatteMat=new qt({map:e.map,normalMap:e.normal,normalScale:new ot(.45,.45),vertexColors:!0,roughness:.7,metalness:.03,envMapIntensity:.34}),this.propPaperMat=new qt({map:e.map,normalMap:e.normal,normalScale:new ot(Wt.paper.normalScale,Wt.paper.normalScale),color:14471354,roughness:Wt.paper.roughness,metalness:0,envMapIntensity:Wt.paper.envMapIntensity}),this.propPrintMat=new qt({map:n,roughness:.82,metalness:.02,envMapIntensity:.31,side:Ue}),this.propClothMat=new qt({map:this._felt.map,normalMap:this._felt.normal,normalScale:new ot(1.1,1.1),color:6433332,roughness:Wt.felt.roughness,metalness:0,envMapIntensity:Wt.felt.envMapIntensity}),this.propLeafMat=new qt({color:4414804,roughness:.76,metalness:.02,envMapIntensity:.4,side:Ue}),this.propDarkMat=new qt({map:this._felt.map,color:2366487,roughness:.76,metalness:.05,envMapIntensity:.35}),this.ceramicMat=new qt({color:13221548,roughness:.32,metalness:0,envMapIntensity:.88}),this.teaMat=new qt({color:6696975,roughness:.24,metalness:0,envMapIntensity:.72}),this.lampShadeMat=new qt({color:12749400,emissive:16751184,emissiveIntensity:.42,roughness:.52,metalness:.35,envMapIntensity:Wt.brass.envMapIntensity,side:Ue});let r=new be,o={matte:[],paper:[],print:[],brass:[],cloth:[],leaf:[],dark:[]},a=(st,xt,Nt,It,At,k,J)=>{r.position.set(Nt,It,At),r.rotation.set(k&&k[0]||0,k&&k[1]||0,k&&k[2]||0),r.scale.set(1,1,1),r.updateMatrix(),o[st].push({geo:xt,matrix:r.matrix.clone(),color:J})},l=(st,xt)=>{let Nt=xt%4,It=Math.floor(xt/4),At=Nt/4,k=(Nt+1)/4,J=1-(It+1)/2,yt=1-It/2,Tt=st.getAttribute("uv");for(let St=0;St<Tt.count;St++)Tt.setXY(St,At+Tt.getX(St)*(k-At),J+Tt.getY(St)*(yt-J));return Tt.needsUpdate=!0,st},c=(st,xt,Nt,It,At,k,J)=>{a("print",l(new Me(st,xt),Nt),It,At,k,J)},h=(st,xt,Nt,It,At,k,J,yt)=>{let Tt=[0,Nt,0];a("matte",new jt(It,.009,At),st,J+.0045,xt,Tt,yt),a("paper",new jt(It-.016,k-.018,At-.014),st,J+k/2,xt,Tt),a("matte",new jt(It,.009,At),st,J+k-.0045,xt,Tt,yt)},u=t.books;h(u.x,u.z,u.rot,.58,.42,.078,.006,[.3,.36,.3]),h(u.x+.01,u.z-.005,u.rot-.1,.53,.38,.062,.084,[.46,.2,.22]),h(u.x-.008,u.z+.004,u.rot+.07,.46,.33,.05,.146,[.21,.25,.34]);let d=.196;a("matte",new jt(.32,.01,.4),u.x+.02,d+.005,u.z+.01,[0,u.rot-.18,0],[.14,.13,.12]),c(.31,.39,0,u.x+.02,d+.011,u.z+.01,[-Math.PI/2,u.rot-.18,0]),c(.19,.13,3,u.x-.18,.145,u.z+.205,[-1.16,u.rot-.5,0]);let f=t.plant;a("matte",new te(.112,.088,.17,18,1),f.x,.091,f.z,null,[.42,.28,.21]),a("matte",new te(.118,.118,.02,18,1),f.x,.183,f.z,null,[.36,.24,.18]),a("matte",new te(.1,.1,.012,16,1),f.x,.189,f.z,null,[.12,.09,.06]);let g=new Nn;g.moveTo(0,0),g.bezierCurveTo(.062,.05,.07,.2,0,.33),g.bezierCurveTo(-.07,.2,-.062,.05,0,0);let _=new _i(g,4);for(let st=0;st<10;st++){let xt=st/10*Math.PI*2+.35,Nt=.88+st%4*.16;r.position.set(f.x+Math.cos(xt)*.04,.2,f.z+Math.sin(xt)*.04),r.rotation.set(-1.16+st%3*.17,xt+Math.PI/2,0),r.scale.set(Nt,Nt,Nt),r.updateMatrix(),o.leaf.push({geo:_.clone(),matrix:r.matrix.clone()})}a("leaf",_.clone(),f.x,.215,f.z,[-1.45,.4,0]),_.dispose(),this.propAnchors.plant=this._anchor(f.x,.2,f.z);let m=t.lamp;a("brass",new te(.12,.148,.03,22,1),m.x,.021,m.z),a("brass",new te(.017,.023,.4,10,1),m.x,.235,m.z),a("brass",new we(.03,10,8),m.x,.445,m.z),a("brass",new te(.013,.015,.3,8,1),m.x+.055,.52,m.z+.115,[.95,0,-.36]),a("brass",new te(.052,.07,.022,14,1),m.x+.135,.575,m.z+.225);let p=new wt(new es(.152,.205,22,1,!0),this.lampShadeMat);p.position.set(m.x+.132,.472,m.z+.222),p.rotation.z=-.16,p.rotation.x=.1,p.castShadow=!1,i.add(p),this.deskShade=p,this.deskGlow=new Un(new Tn({map:Hi(),color:16763016,transparent:!0,opacity:.38,blending:Ye,depthWrite:!1,fog:!1,toneMapped:!1})),this.deskGlow.scale.set(.85,.85,1),this.deskGlow.position.set(m.x+.132,.435,m.z+.222),i.add(this.deskGlow);let M=vs(this.theme);this.deskPool=gr(2.2,M.light.lamp),this.deskPool.position.set(m.x+.11,.0078,m.z+.24),this.deskPool.material.opacity=.12,this.deskPool.renderOrder=1,i.add(this.deskPool),this.deskLight=new Fi(16758903,2,4.2,2),this.deskLight.position.set(m.x+.12,.43,m.z+.2),this.scene.add(this.deskLight),this.propAnchors.lamp=this._anchor(m.x,.42,m.z);let S=t.candle;a("brass",new te(.086,.1,.02,16,1),S.x,.016,S.z),a("brass",new te(.024,.032,.095,10,1),S.x,.072,S.z),a("brass",new te(.052,.035,.032,14,1),S.x,.132,S.z),a("matte",new te(.04,.042,.22,14,1),S.x,.258,S.z,null,[.93,.86,.72]),a("matte",new te(.022,.026,.013,10,1),S.x,.373,S.z,null,[.86,.78,.64]),a("dark",new te(.0038,.0038,.022,6,1),S.x,.388,S.z),this.flame=new Un(new Tn({map:Cf(),color:16769712,transparent:!0,opacity:.95,blending:Ye,depthWrite:!1,fog:!1,toneMapped:!1})),this.flame.scale.set(.055,.125,1),this.flame.position.set(S.x,.435,S.z),i.add(this.flame),this.candleGlow=new Un(new Tn({map:Hi(),color:16754784,transparent:!0,opacity:.22,blending:Ye,depthWrite:!1,fog:!1,toneMapped:!1})),this.candleGlow.scale.set(.7,.7,1),this.candleGlow.position.set(S.x,.41,S.z),i.add(this.candleGlow),this.candleLight=new Fi(16751184,1.05,2.8,2),this.candleLight.position.set(S.x,.46,S.z),this.scene.add(this.candleLight),this.propAnchors.candle=this._anchor(S.x,.36,S.z);let x=t.photo;a("brass",new jt(.345,.405,.014),x.x,.215,x.z,[-.15,x.rot,0]),a("brass",new jt(.335,.03,.055),x.x,.02,x.z+.014,[0,x.rot,0]),a("brass",new jt(.026,.285,.012),x.x,.175,x.z-.045,[.3,x.rot,0]),c(.278,.332,4,x.x+Math.sin(x.rot)*.016,.218,x.z+Math.cos(x.rot)*.016,[-.15,x.rot,0]),this.propAnchors.photo=this._anchor(x.x,.2,x.z);let T=t.speaker;a("dark",new jt(.255,.072,.175),T.x,.046,T.z,[0,T.rot,0]),a("brass",new te(.017,.017,.016,10,1),T.x,.036,T.z+.1,[Math.PI/2,0,0]),a("brass",new te(.04,.04,.008,12,1),T.x-.085,.008,T.z,[0,T.rot,0]),c(.225,.148,6,T.x,.083,T.z,[-Math.PI/2,T.rot,0]);let A=t.cassette;a("dark",new jt(.335,.03,.215),A.x,.021,A.z,[0,A.rot,0]),c(.31,.19,5,A.x,.037,A.z,[-Math.PI/2,A.rot,0]),this.propAnchors.speaker=this._anchor(T.x,.1,T.z);let P=t.newspaper;if(a("paper",new jt(.56,.006,.4),P.x,.009,P.z,[0,P.rot,0]),c(.545,.385,1,P.x,.0125,P.z,[-Math.PI/2,P.rot,0]),this.cupGroup){let st=this.cupGroup.clone();st.position.set(t.cup2.x,.0045,t.cup2.z),st.rotation.set(0,-.85,0),st.scale.setScalar(t.cup2.s),st.children[1]&&(st.children[1].material=this.teaMat),this.world.add(st),this.cup2=st}let C=t.notebook;a("dark",new jt(.84,.018,.56),C.x,.015,C.z,[0,C.rot,0]),a("paper",new jt(.8,.022,.53),C.x,.033,C.z,[0,C.rot,0]),a("dark",new jt(.026,.006,.5),C.x,.0455,C.z,[0,C.rot,0]);let b=l(new Me(.355,.487),7);a("print",b,C.x-.195*Math.cos(C.rot),.0465,C.z+.195*Math.sin(C.rot),[-Math.PI/2,C.rot-.03,0]);let v=l(new Me(.355,.487),7);a("print",v,C.x+.195*Math.cos(C.rot),.0465,C.z-.195*Math.sin(C.rot),[-Math.PI/2,C.rot+.02,0]),a("cloth",new jt(.022,.003,.16),C.x+.01,.0485,C.z+.32,[0,C.rot+.12,0]);let I=C.rot-.62;a("brass",new te(.0085,.0085,.21,8,1),C.x+.17,.056,C.z+.02,[Math.PI/2,I,0]),a("dark",new es(.0095,.038,8,1),C.x+.17+Math.sin(I)*.12,.056,C.z+.02+Math.cos(I)*.12,[Math.PI/2,I,0]);let F=t.glasses,N=C.x-.2,G=C.z+.035;for(let st of[-1,1])a("brass",new Xe(.045,.0042,6,14),N+st*.05,.056,G,[-Math.PI/2,C.rot,0]),a("brass",new jt(.095,.005,.006),N+st*.078,.056,G-.048,[0,C.rot,0]);a("brass",new jt(.022,.0045,.006),N,.056,G+.004,[0,C.rot,0]),this.propAnchors.glasses=this._anchor(N,.06,G),this.propAnchors.notebook=this._anchor(C.x,.05,C.z);let H=t.tickets;c(.2,.078,2,H.x,.012,H.z,[-Math.PI/2,H.rot,0]),c(.2,.078,2,H.x+.13,.0125,H.z+.075,[-Math.PI/2,H.rot+.42,0]),c(.2,.078,2,H.x-.1,.0128,H.z+.1,[-Math.PI/2,H.rot-.28,0]);let V=t.cards;c(.19,.074,2,V.x,.012,V.z,[-Math.PI/2,V.rot,0]),c(.19,.074,2,V.x-.11,.0126,V.z+.09,[-Math.PI/2,V.rot+.5,0]);let $=t.keys;a("brass",new Xe(.052,.007,6,18),$.x,.016,$.z,[-Math.PI/2,$.rot,0]);for(let st of[-1,1]){let xt=$.rot+(st>0?.34:-.42),Nt=$.x+Math.sin(xt)*.075,It=$.z+Math.cos(xt)*.075;a("brass",new Xe(.019,.0045,5,10),Nt,.016,It,[-Math.PI/2,xt,0]);let At=$.x+Math.sin(xt)*.125,k=$.z+Math.cos(xt)*.125;a("brass",new jt(.01,.007,.085),At,.016,k,[0,xt,0]),a("brass",new jt(.026,.008,.016),At+Math.sin(xt)*.048,.016,k+Math.cos(xt)*.048,[0,xt,0]),a("brass",new jt(.018,.008,.012),At+Math.sin(xt)*.03,.016,k+Math.cos(xt)*.03,[0,xt+.4,0])}this.propAnchors.keys=this._anchor($.x,.05,$.z);let U=t.tray;a("matte",new te(.345,.325,.038,30,1),U.x,.025,U.z,null,[.26,.17,.11]),a("matte",new te(.3,.3,.012,26,1),U.x,.046,U.z,null,[.15,.21,.18]),a("brass",new Xe(.318,.02,8,34),U.x,.052,U.z,[-Math.PI/2,0,0]),this.propAnchors.tray=this._anchor(U.x,.05,U.z);let tt=t.blanket;a("cloth",new jt(.84,.085,.6),tt.x,.05,tt.z,[0,tt.rot,0]),a("cloth",new jt(.76,.07,.53),tt.x+.035,.126,tt.z+.022,[0,tt.rot-.08,0]),a("cloth",new jt(.66,.055,.46),tt.x+.055,.188,tt.z+.04,[0,tt.rot-.15,0]),a("cloth",new te(.048,.048,.66,10,1),tt.x+.04,.23,tt.z+.2,[0,tt.rot-.1,Math.PI/2]),this.propAnchors.blanket=this._anchor(tt.x,.14,tt.z);let lt=(st,xt,Nt)=>{let It=o[st];if(!It.length)return null;let At=Vh(It);It.forEach(J=>J.geo.dispose());let k=new wt(At,xt);return k.castShadow=!!Nt,k.receiveShadow=!0,i.add(k),k};this.propMatteMesh=lt("matte",this.propMatteMat,!0),this.propPaperMesh=lt("paper",this.propPaperMat,!1),this.propPrintMesh=lt("print",this.propPrintMat,!1),this.propBrassMesh=lt("brass",this._brassMat(),!0),this.propClothMesh=lt("cloth",this.propClothMat,!0),this.propLeafMesh=lt("leaf",this.propLeafMat,!1),this.propDarkMesh=lt("dark",this.propDarkMat,!1)}_anchor(t,e,n){let i=new me;return i.position.set(t,e,n),this.propGroup.add(i),i}_buildComfort(){let t=Uh.cup,e=.5;this.steamBase=new R(t.x,e,t.z),this.steam=[];let n=Rf();for(let l=0;l<3;l++){let c=new Un(new Tn({map:n,color:16773854,transparent:!0,opacity:.1,depthWrite:!1,fog:!1,toneMapped:!1}));c.scale.set(.1,.16,1),c.position.copy(this.steamBase),c.material.rotation=(l-1)*.4,this.scene.add(c),this.steam.push(c)}let i=De.motes,r=new Float32Array(i*3),o=[];for(let l=0;l<i;l++)r[l*3]=_t.window.x+(Math.random()-.5)*2.6,r[l*3+1]=.25+Math.random()*1.5,r[l*3+2]=_t.window.z+.25+Math.random()*.5,o.push(Math.random()*6.28,.4+Math.random()*.8);let a=new ve;a.setAttribute("position",new Oe(r,3)),this.moteBase=r.slice(),this.moteSeed=o,this.moteMat=new ts({size:.03,map:Hh(),color:12572918,transparent:!0,opacity:.42,depthWrite:!1,blending:Ye,sizeAttenuation:!0,fog:!0,toneMapped:!1}),this.motes=new Zs(a,this.moteMat),this.motes.frustumCulled=!1,this.scene.add(this.motes),this._applyPropsQuality()}_applyPropsQuality(){let t=ln[this.quality],e=!!t.props&&!!t.env;this.propGroup&&(this.propGroup.visible=!!t.props),this.steam&&this.steam.forEach(n=>{n.visible=!!t.steam}),this.motes&&(this.motes.visible=!!t.motes),this.deskLight&&(this.deskLight.intensity=e?2.2:0),this.candleLight&&(this.candleLight.intensity=e?.9:0),this.deskGlow&&(this.deskGlow.visible=!!t.props),this.candleGlow&&(this.candleGlow.visible=!!t.props),this.flame&&(this.flame.visible=!!t.props)}_updateAmbient(t,e){let n=ln[this.quality],i=!!n.props&&!!n.env;if(n.steam&&this.steam){let r=this.steam.length;for(let o=0;o<r;o++){let a=this.steam[o],l=(t*16e-5+o/r)%1,c=l*.62;a.position.set(this.steamBase.x+Math.sin(l*6.2+o*2.1)*(.02+l*.05),this.steamBase.y+c,this.steamBase.z+Math.cos(l*5.1+o*1.7)*(.015+l*.04));let h=.09+l*.3;a.scale.set(h,h*1.6,1),a.material.opacity=Math.sin(l*Math.PI)*.13,a.material.rotation=(o-1)*.4+Math.sin(t*6e-4+o)*.12}}if(n.props&&this.flame){let r=.5+.5*Math.sin(t*.0125),o=.5+.5*Math.sin(t*.021+1.7);this.flame.scale.set(.046+r*.012,.105+o*.028,1),this.flame.material.opacity=.82+r*.16,this.candleGlow&&(this.candleGlow.material.opacity=.18+o*.07,this.candleGlow.scale.set(.58+r*.08,.58+r*.08,1)),this.candleLight&&i&&(this.candleLight.intensity=.85+r*.28)}if(n.props&&this.deskShade){let r=.5+.5*Math.sin(t*.0013+.6);this.lampShadeMat.emissiveIntensity=.26+r*.1,this.deskGlow&&(this.deskGlow.material.opacity=.26+r*.08),this.deskLight&&i&&(this.deskLight.intensity=2+r*.45)}if(this.lamp&&this._lampBase){let r=.5+.5*Math.sin(t*9e-4),o=Math.sin(t*.031)>.988?.94:1;this.lamp.intensity=this._lampBase*(.965+r*.045)*o}if(this.curtains)for(let r=0;r<this.curtains.length;r++){let o=this.curtains[r],a=r===0?1:-1;o.rotation.z=Math.sin(t*55e-5+r*1.9)*.012*a,o.rotation.x=Math.sin(t*41e-5+r*.7)*.006}if(this.windowMat){let r=.5+.5*Math.sin(t*21e-5);this.windowMat.color.setRGB(.9+r*.06,.93+r*.04,1),this.winGlow&&(this.winGlow.material.opacity=.18+r*.07)}if(n.motes&&this.motes){let r=this.motes.geometry.getAttribute("position"),o=this.moteBase,a=this.moteSeed,l=Math.min(De.motes,r.count);for(let c=0;c<l;c++){let h=a[c*2],u=a[c*2+1];r.setX(c,o[c*3]+Math.sin(t*22e-5*u+h)*.18),r.setY(c,o[c*3+1]+Math.sin(t*35e-5*u+h*1.3)*.1),r.setZ(c,o[c*3+2]+Math.cos(t*26e-5*u+h)*.1)}r.needsUpdate=!0}}_buildBoard(){let t=vs(this.theme),e=df();this._tex.push(e.tex),this.atlasTex=e.tex,this.atlasPlain=e,this.flyMode=!1,this.boardTopMat=new qt({map:pf(15260875),roughness:Wt.walnut.roughness+.03,metalness:Wt.walnut.metalness,normalMap:this._wood.normal.clone(),normalScale:new ot(2.2,2.2),color:16777215,envMapIntensity:.6}),this._tex.push(this.boardTopMat.map,this.boardTopMat.normalMap),this.boardTopMat.normalMap.repeat.set(3,3),this.boardTopMat.normalMap.wrapS=this.boardTopMat.normalMap.wrapT=fi,this.boardTopMat.normalMap.needsUpdate=!0,this.boardSideMat=new qt({map:this._wood.map,normalMap:this._wood.normal,color:7097139,roughness:.62,metalness:.04,envMapIntensity:.45});let n=new wt(new te(Kh,Kh-.05,.035,96,1),[this.boardSideMat,this.boardTopMat,this.boardSideMat]);n.position.y=.0205,n.receiveShadow=!0,this.boardGroup.add(n),this.disc=n;let i=new wt(new Xe(Kh-.012,.036,8,96),this._brassMat());i.rotation.x=-Math.PI/2,i.position.y=.03,i.castShadow=!0,this.boardGroup.add(i),this.discRim=i,this.tileMat=new qt({map:e.tex,vertexColors:!0,roughness:Wt.enamel.roughness,metalness:Wt.enamel.metalness,envMapIntensity:Wt.enamel.envMapIntensity});let r=[],o=[],a=[];for(let f=0;f<lr;f++){let g=Qn(f),_=_s(f),m=Ll(f),p=ti(Se[_]).map(M=>M/255*.46);r.push({x:cr*Math.sin(g),z:-cr*Math.cos(g),rot:-Math.PI/2-g,w:Ph,d:Ph,top:Jn,bottom:an,uv:ys(Bl(m,_)),side:p,n:f,kind:m,color:_})}for(let f of Mn){let g=Qn(vi[f]),_=ti(Se[f]).map(m=>m/255*.38);for(let m=0;m<tf;m++){let p=Rl-m*Cl;o.push({x:p*Math.sin(g),z:-p*Math.cos(g),rot:-g-Math.PI,w:Ih,d:Ih,top:Jn-.004,bottom:an,uv:ys(Nl+Mn.indexOf(f)),side:_,color:f,step:m})}}for(let f of Mn){let g=hr[f]*Ne,_=ti(Se[f]).map(p=>p/255*.32);a.push({x:Kn*Math.sin(g),z:-Kn*Math.cos(g),rot:-g-Math.PI,w:.94,d:.94,top:an+.03,bottom:an,uv:ys(dr),side:_.map(p=>p*.8),color:f,plate:!0});let m=ti(Se[f]).map(p=>p/255*.4);for(let[p,M]of[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]])a.push({x:Kn*Math.sin(g)+(p*Math.cos(g)+M*Math.sin(g)),z:-Kn*Math.cos(g)+(-p*Math.sin(g)+M*Math.cos(g)),rot:-g-Math.PI,w:.28,d:.28,top:an+.06,bottom:an+.03,uv:ys(Ol+Mn.indexOf(f)),side:m,color:f,pad:!0})}this.ringMesh=new wt(Xl(r.concat(o)),this.tileMat),this.ringMesh.receiveShadow=!0,this.ringMesh.castShadow=!0,this.boardGroup.add(this.ringMesh),this.padMesh=new wt(Xl(a),this.tileMat),this.padMesh.receiveShadow=!0,this.boardGroup.add(this.padMesh),this.hubGroup=new me,this.hubSideMat=new qt({map:this._wood.map,normalMap:this._wood.normal,color:4862496,roughness:.6,metalness:.04,envMapIntensity:.4}),this.hubTopMat=new qt({map:null,roughness:.34,metalness:Wt.brass.metalness,color:t.hub.top,envMapIntensity:Wt.brass.envMapIntensity}),this.hubStarMat=new qt({color:t.hub.star,roughness:.28,metalness:Wt.brass.metalness,envMapIntensity:Wt.brass.envMapIntensity}),this.hubRingMat=this._brassMat();let l=new wt(new te(An.r,An.r+.07,An.h,48,1),[this.hubSideMat,this.hubTopMat,this.hubSideMat]);l.position.y=An.h/2,l.castShadow=this.shadows,l.receiveShadow=!0,this.hubGroup.add(l);let c=new wt(new Xe(An.ringR,.03,8,56),this.hubRingMat);c.rotation.x=-Math.PI/2,c.position.y=.012,this.hubGroup.add(c),this.hubHalo=new wt(new Xe(.315,.014,6,44),this.hubRingMat),this.hubHalo.rotation.x=-Math.PI/2,this.hubHalo.position.y=An.h+.1,this.hubGroup.add(this.hubHalo);let h=new Nn;for(let f=0;f<10;f++){let g=f%2===0?An.starR:An.starR*.44,_=-Math.PI/2+f*Math.PI/5,m=Math.cos(_)*g,p=Math.sin(_)*g;f===0?h.moveTo(m,p):h.lineTo(m,p)}h.closePath();let u=new is(h,{depth:.03,bevelEnabled:!0,bevelThickness:.006,bevelSize:.006,bevelSegments:1,curveSegments:1});u.rotateX(-Math.PI/2),this.hubStar=new wt(u,this.hubStarMat),this.hubStar.position.y=An.h+.014,this.hubStar.castShadow=this.shadows,this.hubGroup.add(this.hubStar),this.hubGlow=gr(.96,t.hub.glow),this.hubGlow.position.y=An.h+.055,this.hubGlow.material.opacity=.22,this.hubGroup.add(this.hubGlow),this.hubGroup.position.y=.038,this.boardGroup.add(this.hubGroup),this.targetGlow=gr(.9,16763274),this.targetGlow.position.y=Jn+.012,this.targetGlow.visible=!1,this.boardGroup.add(this.targetGlow),this.turnBeacon=new me;let d=new wt(new Xe(.46,.026,8,40),new ke({color:Se.red,transparent:!0,opacity:.7,blending:Ye,depthWrite:!1,fog:!1,toneMapped:!1}));d.rotation.x=-Math.PI/2,d.position.y=Jn+.02,this.turnBeacon.add(d),this._beaconRing=d,this.boardGroup.add(this.turnBeacon)}_buildStage(){this.stageGroup=new me,this.stageGroup.position.set(0,an,0),this.stageGroup.visible=!1,this.scene.add(this.stageGroup),this.stageGlow=gr(.8,16767392),this.stageGlow.position.y=ps+.008,this.stageGlow.material.opacity=.18,this.stageGroup.add(this.stageGlow),this.stageLight=new Fi(16763796,0,6,2),this.stageLight.position.set(.06,2.25,.28),this.scene.add(this.stageLight),this.stageTile=null,this.bear=Nf(),this.bearSeat=new me,this.bearSeat.position.set(gs.x,0,gs.z),this.bearSeat.scale.setScalar(gs.s),this.bearSeat.add(this.bear.group),this.stageGroup.add(this.bearSeat),this.stageShadow=ql(1.5,0),this.stageShadow.visible=!1,this.scene.add(this.stageShadow),this.ripple=Ff(1.1),this.scene.add(this.ripple),this.streaks=Uf(vf()),this.scene.add(this.streaks.group)}_buildDie(){let t=mf(128);this._tex.push(t.tex),this.dieMat=new qt({map:t.tex,roughness:.38,metalness:.05,envMapIntensity:.9}),this.die=new wt(If(Pl),this.dieMat),this.die.castShadow=this.shadows,this.die.receiveShadow=!0,this.scene.add(this.die),this.dieShadow=ql(.5,.55),this.dieShadow.position.y=fr+.004,this.scene.add(this.dieShadow),this.placeDie(1)}_buildHand(){if(this._hand=Lf(),this._hand.textures)for(let t of this._hand.textures)this._tex.push(t);this.scene.add(this._hand.group)}_buildPlanesLayer(){this.planeLayer=new me,this.scene.add(this.planeLayer)}_buildAtmosphere(){let t=ln.high.dust,e=new Float32Array(t*3),n=[];for(let r=0;r<t;r++){let o=Math.random()*Math.PI*2,a=.6+Math.random()*4.6;e[r*3]=Math.cos(o)*a*.9,e[r*3+1]=.25+Math.random()*3.1,e[r*3+2]=-2.4+Math.sin(o)*a*.7,n.push(Math.random()*1e3,.3+Math.random()*.9,Math.random()*Math.PI*2)}let i=new ve;i.setAttribute("position",new Oe(e,3)),this._dustBase=e.slice(),this.dustMat=new ts({size:.042,map:Hh(),color:16767400,transparent:!0,opacity:.62,depthWrite:!1,blending:Ye,sizeAttenuation:!0,fog:!0,toneMapped:!1}),this.dust=new Zs(i,this.dustMat),this.dust.frustumCulled=!1,this._dustSeed=n,this.scene.add(this.dust),this._applyDustQuality()}_applyDustQuality(){if(!this.dust)return;let t=ln[this.quality].dust;this._dustCount=Math.min(t,ln.high.dust),this.dust.geometry.setDrawRange(0,this._dustCount),this.dust.visible=this._dustCount>0}_updateDust(t){if(!this.dust.visible||!this._dustBase)return;let e=this.dust.geometry.getAttribute("position"),n=this._dustCount,i=this._dustBase,r=this._dustSeed;for(let o=0;o<n;o++){let a=r[o*3+1],l=r[o*3+2],c=t*8e-5*a;e.setX(o,i[o*3]+Math.sin(c+l)*.055),e.setY(o,i[o*3+1]+Math.sin(c*.8+l)*.045),e.setZ(o,i[o*3+2]+Math.cos(c*.7+l)*.035)}e.needsUpdate=!0}_buildFx(){this.fxMat=new _n({uniforms:{uTime:{value:0},uAspect:{value:1},uVig:{value:.62},uGrain:{value:.055}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:["varying vec2 vUv;","uniform float uTime; uniform float uAspect; uniform float uVig; uniform float uGrain;","float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }","void main(){","  vec2 p = vUv - 0.5; p.x *= uAspect;","  float r = length(p) * 1.5;","  float v = smoothstep(0.40, 1.02, r) * uVig;","  float n = hash(floor(vUv * vec2(1440.0, 2304.0)) + floor(uTime * 24.0));","  float g = max(0.0, n - 0.70) * uGrain;","  vec3 col = vec3(0.92, 0.90, 0.86) * g;","  float a = clamp(v + g * 0.7, 0.0, 0.94);","  gl_FragColor = vec4(col, a);","}"].join(`
`),transparent:!0,depthTest:!1,depthWrite:!1,premultipliedAlpha:!0,blending:di}),this.fxQuad=new wt(new Me(2,2),this.fxMat),this.fxQuad.frustumCulled=!1,this.fxQuad.renderOrder=999,this.scene.add(this.fxQuad)}setQuality(t){return!ln[t]||t===this.quality?this.quality:(this.quality=t,this._applyQuality(),this.resize(),this.requestRender(),this.quality)}_applyQuality(){let t=ln[this.quality];this.shadows=this._shadowOpt&&t.shadow>0,this.renderer.shadowMap.enabled=this.shadows,this.key&&(this.key.castShadow=this.shadows,this.shadows&&this.key.shadow.mapSize.x!==t.shadow&&(this.key.shadow.mapSize.set(t.shadow,t.shadow),this.key.shadow.map&&(this.key.shadow.map.dispose(),this.key.shadow.map=null))),this._applyDustQuality(),this._applyPropsQuality(),this.fxMat&&(this.fxMat.uniforms.uGrain.value=t.grain?.055:0,this.fxMat.uniforms.uVig.value=t.glow?.66:.46,this.fxQuad.visible=t.grain||t.glow),this.lampGlow&&(this.lampGlow.visible=t.bloom),this.winGlow&&(this.winGlow.visible=t.bloom),this.hubGlow&&(this.hubGlow.visible=t.glow),this.stageGlow&&(this.stageGlow.visible=t.glow),this.scene&&(this.scene.environment=t.env&&this.envTex?this.envTex:null)}_bindResize(){this._onWinResize=()=>this.resize(),window.addEventListener("resize",this._onWinResize,{passive:!0}),window.ResizeObserver&&(this._ro=new ResizeObserver(()=>this.resize()),this._ro.observe(this.host))}_bindVisibility(){this._onVis=()=>{document.hidden?(this._paused=!0,this._raf&&(cancelAnimationFrame(this._raf),this._raf=0)):(this._paused=!1,this._last=0,this.reduced?this.requestRender():this._startLoop())},document.addEventListener("visibilitychange",this._onVis)}resize(){let t=Math.round(this.host.clientWidth||this.canvas.clientWidth||window.innerWidth||0),e=Math.round(this.host.clientHeight||this.canvas.clientHeight||window.innerHeight||0);if(t<2||e<2)return!1;this.viewport={w:t,h:e};let n=ln[this.quality],i=Math.min(window.devicePixelRatio||1,n.dpr);if(this.renderer.setPixelRatio(i),this.renderer.setSize(t,e,!1),this.rig.setAspect(t/e),this.fxMat&&(this.fxMat.uniforms.uAspect.value=t/e,this._fxAspectBase=t/e),this.onResize)try{this.onResize(t,e)}catch(r){console.warn("[board3d] onResize",r)}return this.requestRender(),!0}runAnim(t,e){return this.reduced?(e(1),Promise.resolve()):new Promise(n=>{this.anims.push({t:0,ms:Math.max(1,t),fn:e,resolve:n})})}flushAnims(){let t=this.anims.slice();this.anims.length=0;for(let e of t){try{e.fn(1)}catch(n){console.warn("[board3d] anim flush",n)}e.resolve()}this.requestRender()}_tickAnims(t){for(let e=this.anims.length-1;e>=0;e--){let n=this.anims[e];n.t+=t;let i=re(n.t/n.ms,0,1);try{n.fn(i,n.t)}catch(r){console.warn("[board3d] anim",r)}i>=1&&(this.anims.splice(e,1),n.resolve())}}_startLoop(){if(this.reduced||this._paused||this._raf)return;let t=e=>{if(this._raf=0,!(this._paused||this.reduced)){try{this._frame(e)}catch(n){console.warn("[board3d] frame error:",n&&n.message?n.message:n)}!this._paused&&!this.reduced&&(this._raf=requestAnimationFrame(t))}};this._raf=requestAnimationFrame(t)}requestRender(){if(!this._inFrame){if(this.reduced){if(this._raf)return;this._raf=requestAnimationFrame(t=>{this._raf=0,!this._paused&&this._frame(t,!0)});return}this._startLoop()}}renderNow(){this._frame(performance.now(),!0)}setReduced(t){this.reduced=!!t,this.reduced?(this.flushAnims(),this._raf&&(cancelAnimationFrame(this._raf),this._raf=0),this.renderNow()):(this._last=0,this._startLoop())}_frame(t,e){this._inFrame=!0;try{this._frameInner(t,e)}finally{this._inFrame=!1}}_frameInner(t,e){this._last||(this._last=t);let n=Math.max(0,t-this._last);this._last=t;let i=Math.min(120,n),r=performance.now();if(this._tickAnims(i),!this.reduced){if(this._updateDust(t),this._updateAmbient(t,i),this.bear.group.visible&&(this.bear.group.position.y=ps+Math.sin(t*.0032)*.012,this.bear.group.rotation.z=Math.sin(t*.0016)*.03),this._beaconRing){let l=1+Math.sin(t*.0024)*.08;this._beaconRing.scale.setScalar(l),this._beaconRing.material.opacity=.5+Math.sin(t*.0024)*.18}this.hubStar&&(this.hubStar.rotation.y=t*42e-5,this.hubHalo.position.y=An.h+.1+Math.sin(t*.0016)*.018,this.hubHalo.rotation.z=t*6e-4,this.hubGlow.material.opacity=.2+Math.sin(t*.0022)*.06),this.lampGlow&&(this.lampGlow.material.opacity=.5+Math.sin(t*.0011)*.07),this.streaks.update(i,this.streaks.group.visible),this.fxMat&&this.fxQuad.visible&&(this._fxTime+=i,this.fxMat.uniforms.uTime.value=this._fxTime*.001)}this.updatePlaneTransforms(),this.rig.apply(),this._applyCineCamera(t,n),this._updateLockProbe();let o=performance.now();this.renderer.render(this.scene,this.camera);let a=performance.now();this.lastCalls=this.renderer.info.render.calls,this.lastTris=this.renderer.info.render.triangles,this.perf.frames++,this.perf.sum+=n,this.perf.max=Math.max(this.perf.max,n),n>25&&this.perf.long25++,n>50&&this.perf.long50++,this.perf.updateSum+=o-r,this.perf.renderSum+=a-o,!this.reduced&&!e&&this._adaptCheck(n),!this.ready&&this.viewport.w>0&&this.viewport.h>0&&(this.ready=!0,this.onReady&&this.onReady())}_applyCineCamera(t,e){let n=this.rig,i=this.camera,r=n.state;Math.abs(r.fov-42)<.01&&(i.position.sub(r.center).multiplyScalar(Rn.lensK).add(r.center),i.fov=Rn.fov,i.updateProjectionMatrix());let a=!n.locked&&Math.abs(r.azim)<.01&&r.elev>Rn.overviewElevMin?1:0,l=this.reduced?1:re(1-Math.exp(-(e||16)/150),.05,.85);if(this._elevK+=(a-this._elevK)*l,this._elevK>.002){let c=(58-Rn.elev)*Ne*this._elevK;this._right.setFromMatrixColumn(i.matrixWorld,0),this._v2.copy(i.position).sub(r.center).applyAxisAngle(this._right,c),i.position.copy(r.center).add(this._v2),this._q1.setFromAxisAngle(this._right,c),i.quaternion.premultiply(this._q1)}if(!this.reduced&&this._elevK>.02&&(this.perf.phase==="idle"||this.perf.phase==="win"||this.perf.phase==="boot")){let c=Math.sin(t*13e-5)*Rn.drift.x+Math.sin(t*71e-6+1.3)*Rn.drift.x*.45,h=Math.sin(t*19e-5+1.7)*Rn.drift.y;this._right.setFromMatrixColumn(i.matrixWorld,0),this._up.setFromMatrixColumn(i.matrixWorld,1),i.position.addScaledVector(this._right,c).addScaledVector(this._up,h),this._q1.setFromAxisAngle(this._up,Math.sin(t*11e-5)*Rn.drift.yaw),i.quaternion.premultiply(this._q1)}i.updateMatrixWorld(!0)}_adaptCheck(t){if(!this.adapt||this.quality==="low"||(this._adaptTimer=(this._adaptTimer||0)+t,this._adaptTimer<1500))return;let e=this.perf.sum/Math.max(1,this.perf.frames);if(this._adaptTimer=0,this._slowWindows=e>26?(this._slowWindows||0)+1:0,this._slowWindows>=2){this._slowWindows=0;let n=this.quality==="high"?"medium":"low";this.setQuality(n),console.info("[board3d] auto quality → "+n)}}_updateLockProbe(){if(!this.lockProbeId||this.perf.phase!=="fly")return;let t=this.planes.get(this.lockProbeId);if(!t)return;let e=this.rig.ndcOf(t.group.position);this.lockStats.samples++,this.lockStats.maxAbsX=Math.max(this.lockStats.maxAbsX,Math.abs(e.x)),this.lockStats.maxAbsY=Math.max(this.lockStats.maxAbsY,Math.abs(e.y))}_themeAssets(t){return this._winTex[t.id]||(this._winTex[t.id]=gf(t.window),this._wallTex[t.id]=_f(t.wallTint,512),this._overlayTex[t.id]=Sf(t.overlay,je,512),this._hubTex[t.id]=bf(t.hub,256),this._floorTex=this._floorTex||{},this._floorTex[t.id]=xf(t.floor),this._tex.push(this._winTex[t.id],this._wallTex[t.id],this._overlayTex[t.id],this._hubTex[t.id],this._floorTex[t.id])),{win:this._winTex[t.id],wall:this._wallTex[t.id],overlay:this._overlayTex[t.id],hub:this._hubTex[t.id],floor:this._floorTex[t.id]}}applyTheme(t,e){let n=vs(t);this.theme=n.id,this.host.setAttribute("data-3d-theme",n.id);let i=this._themeAssets(n);this.scene.background.set(n.ink),this.scene.fog=new Wr(n.fog,n.fogDensity),this.renderer.toneMappingExposure=n.exposure,this.scene.environment&&(this.scene.environmentIntensity=n.light.env),this.hemi&&(this.hemi.color.set(n.light.hemiSky),this.hemi.groundColor.set(n.light.hemiGround),this.hemi.intensity=n.light.hemiInt),this.key&&(this.key.color.set(n.light.key),this.key.intensity=n.light.keyInt),this.rim&&(this.rim.color.set(n.light.rim),this.rim.intensity=n.light.rimInt),this.fill&&(this.fill.color.set(n.light.fill),this.fill.intensity=n.light.fillInt),this.wallWash&&(this.wallWash.color.set(n.light.rim),this.wallWash.intensity=n.light.rimInt*.52),this.lamp&&(this.lamp.color.set(n.light.lamp),this.lamp.intensity=n.light.lampInt,this.lamp.distance=n.light.lampDist),this.woodMat&&this.woodMat.color.set(n.tableTint),this.feltMat&&this.feltMat.color.set(n.feltTint),this.boardTopMat&&this.boardTopMat.color.set(n.boardTint),this.boardSideMat&&this.boardSideMat.color.set(n.brass).multiplyScalar(.38),this._brassMaterial&&(this._brassMaterial.color.set(n.brass),this._brassMaterial.roughness=n.brassRough),this.hubTopMat&&(this.hubTopMat.map=i.hub,this.hubTopMat.color.set(16777215),this.hubTopMat.needsUpdate=!0),this.hubStarMat&&this.hubStarMat.color.set(n.hub.star),this.hubGlow&&this.hubGlow.material.color.set(n.hub.glow),this.wallMat&&(this.wallMat.map=i.wall,this.wallMat.color.set(16777215),this.wallMat.needsUpdate=!0),this.windowMat&&(this.windowMat.map=i.win,this.windowMat.needsUpdate=!0),this.glassMat&&this.glassMat.color.set(n.light.rim),this.shadeMat&&this.shadeMat.color.set(n.feltTint).multiplyScalar(.42),this.floorMat&&(i.floor?(this.floorMat.map=i.floor,this.floorMat.color.set(16777215),this.floorMat.needsUpdate=!0):this.floorMat.color.set(n.floor)),this.bulbMat&&this.bulbMat.color.set(n.light.lamp),this.binMat&&this.binMat.color.set(n.wallTint).multiplyScalar(.6),this.stripMat&&this.stripMat.color.set(n.light.lamp),this.binGlow&&this.binGlow.material.color.set(n.light.lamp),this.curtainMat&&this.curtainMat.color.set(n.feltTint).multiplyScalar(1.25).lerp(new Bt(14865078),.25),this.binLatch&&this._brassMaterial&&(this.binLatch.material=this._brassMaterial),this.propClothMat&&this.propClothMat.color.set(n.bear.scarf).multiplyScalar(.72),this.deskPool&&this.deskPool.material.color.set(n.light.lamp),this.lampShadeMat&&(this.lampShadeMat.color.set(n.light.lamp).multiplyScalar(.62),this.lampShadeMat.emissive.set(n.light.lamp)),this.deskLight&&this.deskLight.color.set(n.light.lamp),this.deskGlow&&this.deskGlow.material.color.set(n.light.lamp),this.candleLight&&this.candleLight.color.set(n.light.lamp),this.candleGlow&&this.candleGlow.material.color.set(n.light.lamp),this.flame&&this.flame.material.color.set(n.light.lamp).lerp(new Bt(16773848),.55),this.moteMat&&this.moteMat.color.set(n.light.rim),this.propLeafMat&&this.propLeafMat.color.set(n.id==="paper"?6056778:n.id==="star"?4873826:5139298),this.steam&&this.steam.forEach(r=>r.material.color.set(n.light.lamp).lerp(new Bt(16774374),.7)),this.stageLight&&this.stageLight.color.set(n.light.key),this.lampGlow&&this.lampGlow.material.color.set(n.light.lamp),this.winGlow&&this.winGlow.material.color.set(n.light.rim),this.matOverMat&&this.matOverMat.map!==i.overlay&&(this.matOverMat.map=i.overlay,this.matOverMat.needsUpdate=!0),this.dustMat&&(this.dustMat.color.set(n.dust),this.dustMat.opacity=n.dustOpacity),this.bear&&this.bear.setOutfit(n.bear),this.setDim(this.dimK),this.applyHeat(this.heat),this.requestRender()}applyHeat(t){let e=re(Number(t)||0,0,100);if(this.heat=e,!this.lamp)return;let n=vs(this.theme),i=e/100,r=new Bt(n.heatCool).lerp(new Bt(n.heatWarm),i);this.lamp.color.copy(r),this.lamp.intensity=n.light.lampInt*(.85+i*.5),this._lampBase=this.lamp.intensity,this.hubGlow&&this.hubGlow.material.color.copy(new Bt(n.hub.glow).lerp(r,i*.6)),this.stageGlow&&this.stageGlow.material.color.copy(new Bt(n.heatWarm)),this.requestRender()}applyTurn(t,e){this.turn=t==="b"?"b":"a",e&&(this.colors={a:e.a||"red",b:e.b||"yellow"});let n=Se[this.colors[this.turn]]||Se.red;if(this._beaconRing){this._beaconRing.material.color.set(n);let i=hr[this.colors[this.turn]]*Ne;this.turnBeacon.position.set(Kn*Math.sin(i),0,-Kn*Math.cos(i)),this.turnBeacon.visible=!0}this.requestRender()}setDim(t){let e=re(t,.1,1);this.dimK=e;let n=vs(this.theme),i=ae(.26,1,e);this.tileMat&&this.tileMat.color.setRGB(i,i,i),this.boardTopMat&&this.boardTopMat.color.copy(new Bt(n.boardTint).multiplyScalar(ae(.4,1,e))),this.boardSideMat&&this.boardSideMat.color.copy(new Bt(n.boardTint).multiplyScalar(ae(.34,.85,e))),this.woodMat&&this.woodMat.color.copy(new Bt(n.tableTint).multiplyScalar(ae(.52,1,e))),this.feltMat&&this.feltMat.color.copy(new Bt(n.feltTint).multiplyScalar(ae(.58,1,e))),this.matOverMat&&(this.matOverMat.opacity=ae(.62,1,e)),this.requestRender()}_accentFor(t){return t==="red"?15255976:t==="yellow"?15258536:t==="blue"?13161184:13162696}_createPlane(t){let e=t.color||"red",n=Df(Se[e]||Se.red,this._accentFor(e)),i=ql(.6,.5),r=gr(.62,Se[e]||Se.red);return r.material.opacity=.1,this.planeLayer.add(n.group),this.planeLayer.add(i),this.planeLayer.add(r),{id:t.id,color:e,playerId:t.playerId||String(t.id).charAt(0),plane:n,group:n.group,shadow:i,glow:r,local:new R,localYaw:0,fixedYaw:0,mode:"board",tileTopY:Jn,piece:t}}ensurePlane(t,e,n){let i=this.planes.get(t);return i||(i=this._createPlane({id:t,color:e||"red",playerId:n||String(t).charAt(0)}),this.planes.set(t,i),i)}_removePlane(t){let e=this.planes.get(t);e&&(this.planeLayer.remove(e.group),this.planeLayer.remove(e.shadow),this.planeLayer.remove(e.glow),e.plane.dispose(),e.shadow.geometry.dispose(),e.shadow.material.dispose(),e.glow.geometry.dispose(),e.glow.material.dispose(),this.planes.delete(t))}setPieces(t,e,n){let i=Array.isArray(t)?t:[];this.pieces=i.map(a=>({id:a.id,color:a.color||"red",playerId:a.playerId||String(a.id).charAt(0),squareId:a.squareId||"hangar:red:0",arrived:!!a.arrived,stackGroupId:a.stackGroupId||null}));let r={};for(let a of this.pieces)r[a.id]=!0;for(let a of Array.from(this.planes.keys()))r[a]||this._removePlane(a);let o=Bf(this.pieces);for(let a of this.pieces){let l=this.planes.get(a.id);l||(l=this._createPlane(a),this.planes.set(a.id,l)),l.color!==a.color&&(l.color=a.color,l.playerId=a.playerId,l.plane.setColor(Se[a.color]||Se.red,this._accentFor(a.color)),l.glow.material.color.set(Se[a.color]||Se.red));let c=o[a.id]||Si(a.squareId);l.local.set(c.x,c.y,c.z),l.localYaw=c.yaw,l.tileTopY=c.y-Oi,l.mode="board",l.piece=a,l.group.visible=!0,l.group.scale.setScalar(1),l.shadow.visible=!0,this._applyPlaneLocal(l)}e&&(this.turn=e==="b"?"b":"a"),n&&(this.colors={a:n.a||"red",b:n.b||"yellow"}),this._planesDirty=!0,this.updatePlaneTransforms(),this.requestRender()}_applyPlaneLocal(t){t.group.position.copy(t.local),t.group.rotation.set(0,t.localYaw,0)}setPlaneToSquare(t,e,n={}){let i=this.planes.get(t);if(!i)return null;let r=Si(e);return i.local.set(r.x,r.y,r.z),i.localYaw=r.yaw,i.tileTopY=r.y-Oi,i.mode="board",n.visible!==!1&&(i.group.visible=!0,i.group.scale.setScalar(1),i.shadow.visible=!0),this._applyPlaneLocal(i),this.updatePlaneTransforms(),this.requestRender(),i}setPlaneLocal(t,e){let n=this.planes.get(t);return n?(n.local.set(e.x,e.y,e.z),n.localYaw=e.yaw,n.mode="board",this._applyPlaneLocal(n),this.updatePlaneTransforms(),this.requestRender(),n):null}fixPlane(t){let e=this.planes.get(t);return e?(e.fixedYaw=this.boardGroup.rotation.y+e.localYaw,e.mode="fixed",e.group.position.copy(_r),e.group.rotation.set(0,e.fixedYaw,0),e.group.visible=!0,e.group.scale.setScalar(1),e.shadow.visible=!0,this.updatePlaneTransforms(),this.requestRender(),e):null}hidePlane(t){let e=this.planes.get(t);e&&(e.mode="hidden",e.group.visible=!1,e.shadow.visible=!1,e.glow.material.opacity=0,this.requestRender())}updatePlaneTransforms(){if(this.planes.size)for(let t of this.planes.values()){if(t.mode==="board")this._v.copy(t.local),this.boardGroup.localToWorld(this._v),t.group.position.copy(this._v),t.group.rotation.set(0,this.boardGroup.rotation.y+t.localYaw,0),t.shadow.position.set(this._v.x,.008,this._v.z),t.shadow.visible=t.group.visible,t.glow.position.set(this._v.x,t.tileTopY+.012,this._v.z);else if(t.mode==="fixed")t.group.position.copy(_r),t.group.rotation.set(0,t.fixedYaw,0),t.shadow.position.set(_r.x,.008,_r.z),t.shadow.visible=!0,t.glow.position.set(_r.x,Jn+.012,_r.z);else{t.group.visible=!1,t.shadow.visible=!1,t.glow.material.opacity=0;continue}let e=t.playerId===this.turn,n=t.mode==="fixed"?.95:e?this.reduced?.5:.55:.07;t.glow.material.opacity+=(n-t.glow.material.opacity)*.16}}boardPose(){return{theta:this.boardGroup.rotation.y,tx:this.boardGroup.position.x,tz:this.boardGroup.position.z}}applyPose(t){this.boardGroup.rotation.y=t.theta,this.boardGroup.position.set(t.tx,0,t.tz),this.boardGroup.updateMatrixWorld(!0),this.updatePlaneTransforms(),this.requestRender()}setTargetGlow(t,e){if(!t){this.targetGlow.visible=!1;return}let n=Si(t);this.targetGlow.position.set(n.x,n.y-Oi+.012,n.z),this.targetGlow.visible=!0,this.targetGlow.material.opacity=e===void 0?.75:e,this.requestRender()}pulseTargetGlow(t){let e=performance.now(),n=i=>{let r=re((i-e)/t,0,1);this.targetGlow.material.opacity=.35+.5*Math.sin(r*Math.PI),r<1?requestAnimationFrame(n):this.targetGlow.material.opacity=.65};requestAnimationFrame(n)}setStreaks(t){this.streaks.group.visible=!!(t&&!this.reduced),this.requestRender()}setFlyMode(t){this.flyMode=!!t,this.requestRender()}playRipple(t){if(this.ripple.position.set(0,.012,0),this.ripple.visible=!0,this.ripple.scale.setScalar(.4),this.ripple.material.opacity=.55,this.reduced||t)return this.ripple.material.opacity=.2,this.requestRender(),Promise.resolve();let e=performance.now();return new Promise(n=>{let i=r=>{let o=re((r-e)/520,0,1),a=Fl(o);this.ripple.scale.setScalar(.4+a*2.2),this.ripple.material.opacity=.55*(1-o),this.requestRender(),o<1?requestAnimationFrame(i):(this.ripple.visible=!1,n())};requestAnimationFrame(i)})}setStageSquare(t){this.stageTile&&(this.stageGroup.remove(this.stageTile),this.stageTile.geometry.dispose(),this.stageTile=null),this.stageId=t,this.stageTileMat&&(this.stageTex&&(this.stageTex.dispose(),this.stageTex=null),this.stageTileMat.dispose());let e=t?/^home:(red|yellow|blue|green):(?:(\d+)|goal)$/.exec(t):null,n,i,r;if(e)r=e[1],i="entry",n=ti(Se[r]).map(a=>a/255*.46);else if(t&&/^ring:(\d+)$/.test(t)){let a=Number(/^ring:(\d+)$/.exec(t)[1]);r=_s(a),i=Ll(a),n=ti(Se[r]).map(l=>l/255*.46)}else r="red",i="ring",n=[.14,.12,.16];this.stageTex=Ef(i,r,of[i]||"",256,ef),this._tex.push(this.stageTex),this.stageTileMat=new qt({map:this.stageTex,vertexColors:!0,roughness:Wt.enamel.roughness+.03,metalness:Wt.enamel.metalness,envMapIntensity:.9});let o=Xl([{x:0,z:0,rot:Bi*Ne,w:Dh,d:Dh,top:ps,bottom:0,uv:[0,0,1,1],side:n}]);this.stageTile=new wt(o,this.stageTileMat),this.stageTile.castShadow=this.shadows,this.stageTile.receiveShadow=!0,this.stageGroup.add(this.stageTile),this.bearSeat&&(this.bearSeat.position.set(gs.x,0,gs.z),this.bearSeat.scale.setScalar(gs.s))}setStageVisible(t){this.stageGroup.visible=!!t,this.stageShadow.visible=!!t,this.stageLight&&(this.stageLight.intensity=t?8.5:0),t||this.bear.setVisible(!1),this.requestRender()}setStageRise(t){this.stageRise=t,this.stageGroup.position.y=an+t,this.stageShadow.position.set(0,.006,0),this.requestRender()}setBearVisible(t){this.bear.setVisible(!!t),this.requestRender()}dieFaceNormal(t){let e=jn.indexOf(t),n=new R;return e===0?n.set(1,0,0):e===1?n.set(-1,0,0):e===2?n.set(0,1,0):e===3?n.set(0,-1,0):e===4?n.set(0,0,1):n.set(0,0,-1),n}dieSettleQuat(t,e){let n=new Ie().setFromUnitVectors(this.dieFaceNormal(t),this._upY),i=e===void 0?this._dieYaw:e;return new Ie().setFromAxisAngle(this._upY,i).multiply(n)}_dieExtent(t){let e=t.x,n=t.y,i=t.z,r=t.w;return Pl*.5*(Math.abs(2*(e*n+r*i))+Math.abs(1-2*(e*e+i*i))+Math.abs(2*(n*i-r*e)))}_dieShadowAt(){let t=this.die.position.y,e=Math.max(0,t-ei.y);this.dieShadow.position.set(this.die.position.x,fr+.004,this.die.position.z),this.dieShadow.scale.setScalar(re(1.02-e*.3,.55,1.08)),this.dieShadow.material.opacity=re(.52-e*.2,.1,.52)}setDieVisible(t){let e=!!t;this.die.visible=e,this.dieShadow.visible=e,this.requestRender()}placeDie(t){let e=re(Number(t)||1,1,6);this.dieValue=e,this.die.visible=!0,this.dieShadow.visible=!0,this.die.position.copy(ei),this.die.quaternion.copy(this.dieSettleQuat(e)),this._dieShadowAt(),!this._toss&&this._hand&&(this._hand.group.visible=!1),this.requestRender()}dieDebug(){let e=new Vt().makeRotationFromQuaternion(this.die.quaternion).elements,n=[[e[1],jn[0]],[-e[1],jn[1]],[e[5],jn[2]],[-e[5],jn[3]],[e[9],jn[4]],[-e[9],jn[5]]],i=n[0];for(let r=1;r<n.length;r++)n[r][0]>i[0]&&(i=n[r]);return{value:this.dieValue,top:i[1],up:+i[0].toFixed(4),pos:[+this.die.position.x.toFixed(4),+this.die.position.y.toFixed(4),+this.die.position.z.toFixed(4)],atHome:+this.die.position.distanceTo(ei).toFixed(4),hand:!!(this._hand&&this._hand.group.visible),tossing:!!this._toss,t:this._toss?Math.round(this._toss.animT||0):null,wall:this._toss?Math.round(performance.now()-this._toss.startedAt):null,phase:this._toss&&this._toss.phase||""}}_handQuat(t,e,n){return new Ie().setFromEuler(new gn(e,t,n,"YXZ"))}_handPoseForDie(t,e,n,i){let r=this._handQuat(e,n,i),o=this._hand.gripLocal.clone().applyQuaternion(r);return{p:t.clone().sub(o),q:r}}_poseLerp(t,e,n,i){return i=i||{p:new R,q:new Ie},i.p.lerpVectors(t.p,e.p,n),i.q.copy(t.q).slerp(e.q,n),i}_handAt(t){let e=this._toss;if(!e)return null;let n=e.poses,i=c=>1-Math.pow(1-re(c,0,1),3),r=c=>{let h=re(c,0,1);return h<.5?4*h*h*h:1-Math.pow(-2*h+2,3)/2},o=c=>Math.pow(re(c,0,1),2.2);if(t<=e.enterMs)return this._poseLerp(n.start,n.hover,i(t/e.enterMs),e.hp);if(t<=e.enterMs+e.descendMs)return this._poseLerp(n.hover,n.grip,r((t-e.enterMs)/e.descendMs),e.hp);let a=e.enterMs+e.descendMs+e.closeMs;if(t<=a)return this._poseLerp(n.grip,n.grip,0,e.hp);if(t<=e.liftEnd)return this._poseLerp(n.grip,n.lift,r((t-a)/e.liftMs),e.hp);if(t<=e.releaseAt)return this._poseLerp(n.lift,n.rel,o((t-e.liftEnd)/e.throwMs),e.hp);let l=e.releaseAt+120;return t<=l?this._poseLerp(n.rel,n.follow,i((t-e.releaseAt)/120),e.hp):t<=e.exitEnd?this._poseLerp(n.follow,n.exit,i((t-l)/Math.max(1,e.exitMs-120)),e.hp):null}_gripAt(t){let e=this._toss,n=e.enterMs+e.descendMs;return t<n?0:t<n+e.closeMs?(t-n)/e.closeMs:t<e.releaseAt?1:1-re((t-e.releaseAt)/150,0,1)}_simulateToss(t){let e=$e.step,n=Math.ceil(($e.maxActive+.02)/e),i=new Float32Array(n*3),r=new Float32Array(n*4),o=[$l.x,$l.y,$l.z],a=-.382,l=1.5,c=-.396,h=18.8,u=9.4,d=-13.6,f={x:t.x,y:t.y,z:t.z,w:t.w},g=this._mulberry(11),_=[],m=0,p=0,M=0,S=new Ie;for(let F=0;F<=n;F++){let N=F*e;i[F*3]=o[0],i[F*3+1]=o[1],i[F*3+2]=o[2],r[F*4]=f.x,r[F*4+1]=f.y,r[F*4+2]=f.z,r[F*4+3]=f.w,M=F+1;let G=1-$e.airDrag*e;a*=G,c*=G,l-=$e.g*e,o[0]+=a*e,o[1]+=l*e,o[2]+=c*e;let H=.5*(-h*f.x-u*f.y-d*f.z)*e,V=.5*(h*f.w+u*f.z-d*f.y)*e,$=.5*(-h*f.y+u*f.w+d*f.x)*e,U=.5*(h*f.x+u*f.y+d*f.z)*e;f.x+=H,f.y+=V,f.z+=$,f.w+=U;let tt=Math.sqrt(f.x*f.x+f.y*f.y+f.z*f.z+f.w*f.w)||1;f.x/=tt,f.y/=tt,f.z/=tt,f.w/=tt;let lt=1-$e.spinDamp*e;h*=lt,u*=lt,d*=lt,S.set(f.x,f.y,f.z,f.w);let st=this._dieExtent(S),xt=fr+st,Nt=Math.sqrt(o[0]*o[0]+o[2]*o[2]);if(Nt>$e.boundR){let It=-o[0]/Nt,At=-o[2]/Nt,k=a*It+c*At;k<0&&(a-=1.7*k*It,c-=1.7*k*At,o[0]=It*-$e.boundR,o[2]=At*-$e.boundR,h+=(g()-.5)*4,u+=(g()-.5)*3,d+=(g()-.5)*4)}if(o[1]<=xt){if(o[1]=xt,l<0){let It=-l,At=Math.min(_.length,2);if(It>.55){l=It*($e.rest[At]+(g()-.5)*.04);let k=$e.tan[At]+(g()-.5)*.05,J=(g()-.5)*9*Ne,yt=Math.cos(J),Tt=Math.sin(J),St=a*yt-c*Tt,Kt=a*Tt+c*yt;a=St*k,c=Kt*k,h=h*.72+(g()-.5)*7,u=u*.6+(g()-.5)*5,d=d*.72+(g()-.5)*7,_.push({t:+N.toFixed(3),speed:+It.toFixed(2)})}else l=0,p++}else l=0,p++;if(p>0){let It=Math.sqrt(a*a+c*c);if(It>1e-4){let k=Math.min(It,$e.rollFriction*e);a-=a/It*k,c-=c/It*k}let At=1-2.2*e;h*=At,u*=At,d*=At,!m&&It<.05&&Math.abs(h)+Math.abs(u)+Math.abs(d)<1.6&&(m=N)}}if(m&&N>m+.06)break}let x=m?re(m+$e.restPad,$e.minEnd,$e.maxActive):$e.maxActive,T=Math.max(0,x-$e.settleMs/1e3),A=Math.min(M-1,Math.round(T/e)),P=new Ie(r[A*4],r[A*4+1],r[A*4+2],r[A*4+3]),C=new R(i[A*3],i[A*3+1],i[A*3+2]),b=null,v=this._dieYaw,I=1e9;for(let F=0;F<4;F++){let N=.22+F*Math.PI/2,G=this.dieSettleQuat(this.dieValue,N),H=P.angleTo(G);H<I&&(I=H,v=N,b=G)}return this._dieYaw=v,{posArr:i,quatArr:r,n:M,impacts:_,restAt:m,settleStart:T,settleEnd:x,startP:C,startQ:P,targetQ:b,settleAngle:+(I/Ne).toFixed(1)}}_mulberry(t){let e=t>>>0;return function(){e=e+1831565813|0;let n=Math.imul(e^e>>>15,1|e);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}_beginToss(t){let e=this._hand;if(!e)return null;this.die.visible=!0,this.dieShadow.visible=!0,e.group.visible=!0,e.setGrip(0);let n=this.die.quaternion.clone();this.die.position.copy(ei),this.die.quaternion.copy(n);let i=ei.clone().add(new R(.02,.17,.04)),r={hover:this._handPoseForDie(i,1.95,-.12,.35),grip:this._handPoseForDie(ei,1.95,-.1,.4),lift:this._handPoseForDie(new R(.76,.48,.78),1.95,-.05,.45),rel:this._handPoseForDie($l,1.9,-.55,.55)};r.start={p:r.hover.p.clone().add(new R(1.95,.02,-.62)),q:r.hover.q.clone()},r.follow={p:r.rel.p.clone().add(new R(.06,.12,.02)),q:this._handQuat(1.78,-.62,.5)},r.exit={p:r.rel.p.clone().add(new R(1.35,.55,.45)),q:this._handQuat(1.2,.4,-.16)};let o=r.grip.q.clone().invert().multiply(n),a=r.rel.q.clone().multiply(o),l={enterMs:sn.enterMs,descendMs:sn.descendMs,closeMs:sn.closeMs,liftMs:sn.liftMs,throwMs:sn.throwMs,exitMs:sn.exitMs,liftEnd:sn.enterMs+sn.descendMs+sn.closeMs+sn.liftMs,releaseAt:sn.releaseAt,exitEnd:sn.releaseAt+sn.exitMs,total:sn.total,poses:r,dieLocalQ:o,hp:{p:new R,q:new Ie},phase:"enter",sndRelease:!1,impactIdx:0,startedAt:performance.now()};return l.phys=this._simulateToss(a),l.settleStartAbs=l.releaseAt+l.phys.settleStart*1e3,l.settleEndAbs=l.releaseAt+l.phys.settleEnd*1e3,l.total=Math.max(sn.total,Math.ceil(l.settleEndAbs)+20),this._toss=l,this._tossFrame(0,null),l}_tossFrame(t,e){let n=this._toss;if(!n)return;let i=this._handAt(t);if(i?(n.hp.p.copy(i.p),n.hp.q.copy(i.q),this._hand.group.position.copy(i.p),this._hand.group.quaternion.copy(i.q),this._hand.setGrip(this._gripAt(t)),this._hand.group.visible=!0):this._hand.group.visible=!1,n.phase=t<n.liftEnd-n.liftMs?"enter":t<n.releaseAt?"carry":"throw",n.animT=t,t<n.releaseAt){let r=n.enterMs+n.descendMs+n.closeMs;t<r?(this.die.position.copy(ei),this.die.quaternion.copy(n.poses.grip.q).multiply(n.dieLocalQ)):(this.die.position.copy(n.hp.p),this._v.copy(this._hand.gripLocal).applyQuaternion(n.hp.q),this.die.position.add(this._v),this.die.quaternion.copy(n.hp.q).multiply(n.dieLocalQ))}else if(this._diePhysAt(t),e&&!n.sndRelease&&(n.sndRelease=!0,e.onRelease&&e.onRelease()),e){let r=n.phys;for(;n.impactIdx<r.impacts.length&&t>=n.releaseAt+r.impacts[n.impactIdx].t*1e3;){let o=r.impacts[n.impactIdx];n.impactIdx++,e.onImpact&&e.onImpact(o.t,o.speed)}}this._dieShadowAt()}_diePhysAt(t){let e=this._toss,n=e.phys,i=Math.max(0,t-e.releaseAt)/1e3,r=$e.step;if(i>=n.settleEnd){this.die.position.copy(ei),this.die.quaternion.copy(n.targetQ);return}if(i>=n.settleStart){let u=re((i-n.settleStart)/(n.settleEnd-n.settleStart),0,1),d=ur(0,1,u),f=ur(.05,1,u);this.die.quaternion.copy(n.startQ).slerp(n.targetQ,f),this.die.position.x=ae(n.startP.x,ei.x,d),this.die.position.z=ae(n.startP.z,ei.z,d),this.die.position.y=fr+this._dieExtent(this.die.quaternion);return}let o=i/r,a=Math.min(n.n-2,Math.max(0,Math.floor(o))),l=re(o-a,0,1),c=n.posArr,h=n.quatArr;this.die.position.set(ae(c[a*3],c[(a+1)*3],l),ae(c[a*3+1],c[(a+1)*3+1],l),ae(c[a*3+2],c[(a+1)*3+2],l)),this._q2.set(h[a*4],h[a*4+1],h[a*4+2],h[a*4+3]),this._q1.set(h[(a+1)*4],h[(a+1)*4+1],h[(a+1)*4+2],h[(a+1)*4+3]),this.die.quaternion.copy(this._q2).slerp(this._q1,l)}_endToss(t){this._toss=null,this._hand&&(this._hand.group.visible=!1,this._hand.setGrip(0)),this.placeDie(t),this.requestRender()}tossDie(t,e,n){let i=re(Number(t)||1,1,6);if(this.dieValue=i,this.reduced||e)return this._endToss(i),Promise.resolve();let r=this._beginToss(i);if(!r)return this._endToss(i),Promise.resolve();let o=n||{};return this.runAnim(r.total,(a,l)=>{let c=!(typeof l=="number"&&isFinite(l)),h=c?r.total:l;this._tossFrame(h,c?null:o),h>=r.settleEndAbs-1&&o.onSettle&&(r.sndSettle||(r.sndSettle=!0,o.onSettle()))}).then(()=>this._endToss(i))}markPhase(t){this.perf.frames>0&&this.perf.phase&&(this.perf.phases[this.perf.phase]={frames:this.perf.frames,avgMs:+(this.perf.sum/this.perf.frames).toFixed(2),maxMs:+this.perf.max.toFixed(2),long25:this.perf.long25,long50:this.perf.long50,ms:+(performance.now()-this.perf.since).toFixed(0),calls:this.lastCalls,tris:this.lastTris,updateMs:+(this.perf.updateSum/this.perf.frames).toFixed(2),renderMs:+(this.perf.renderSum/this.perf.frames).toFixed(2)}),this.perf.phase=t,this.perf.frames=0,this.perf.sum=0,this.perf.max=0,this.perf.long25=0,this.perf.long50=0,this.perf.updateSum=0,this.perf.renderSum=0,this.perf.since=performance.now()}debugSnapshot(){let t=this.perf.frames>0?{frames:this.perf.frames,avgMs:+(this.perf.sum/this.perf.frames).toFixed(2),maxMs:+this.perf.max.toFixed(2),long25:this.perf.long25,long50:this.perf.long50,long25Ratio:+(this.perf.long25/this.perf.frames).toFixed(3),fps:+(this.perf.frames*1e3/Math.max(1,performance.now()-this.perf.since)).toFixed(1),updateMs:+(this.perf.updateSum/this.perf.frames).toFixed(2),renderMs:+(this.perf.renderSum/this.perf.frames).toFixed(2),ms:+(performance.now()-this.perf.since).toFixed(0)}:null,e=this.planes.get("a:0")||this.planes.values().next().value,n={camera:{pos:this.camera.position.toArray().map(r=>+r.toFixed(4)),fov:+this.camera.fov.toFixed(2),rigFov:+this.rig.state.fov.toFixed(2),elev:+this.rig.state.elev.toFixed(2),elevTuned:+this._elevK.toFixed(3),locked:this.rig.locked},board:{theta:+this.boardGroup.rotation.y.toFixed(5),tx:+this.boardGroup.position.x.toFixed(5),tz:+this.boardGroup.position.z.toFixed(5)},lock:{samples:this.lockStats.samples,maxAbsX:+this.lockStats.maxAbsX.toFixed(5),maxAbsY:+this.lockStats.maxAbsY.toFixed(5)},stage:{visible:this.stageGroup.visible,rise:+this.stageRise.toFixed(3),bear:+this.bear.group.scale.x.toFixed(3)},die:this.dieDebug(),streaks:this.streaks.group.visible};if(e){let r=this.rig.ndcOf(e.group.position);n.plane={id:e.id,world:e.group.position.toArray().map(o=>+o.toFixed(4)),ndc:[+r.x.toFixed(5),+r.y.toFixed(5)]}}let i=this.renderer.getPixelRatio();return{phase:this.perf.phase,current:t,phases:this.perf.phases,render:{calls:this.lastCalls,triangles:this.lastTris,cssPx:this.viewport.w*this.viewport.h,pixels:Math.round(this.viewport.w*this.viewport.h*i*i)},quality:this.quality,dpr:i,shadows:this.renderer.shadowMap.enabled,antialias:this.useAA,viewport:this.viewport,cinematic:{toneMapping:this.renderer.toneMapping,exposure:this.renderer.toneMappingExposure,env:this.scene.environment?"pmrem":"off",envIntensity:this.scene.environmentIntensity,dust:this._dustCount,fx:this.fxQuad?{vignette:this.fxMat.uniforms.uVig.value,grain:this.fxMat.uniforms.uGrain.value}:null,lens:{fov:Rn.fov,elev:Rn.elev,lensK:+Rn.lensK.toFixed(4)}},probe:n}}dispose(){this._raf&&(cancelAnimationFrame(this._raf),this._raf=0),this._paused=!0,this._ro&&(this._ro.disconnect(),this._ro=null),this._onWinResize&&window.removeEventListener("resize",this._onWinResize),this._onVis&&document.removeEventListener("visibilitychange",this._onVis);let t=e=>{if(e){if(Array.isArray(e)){e.forEach(t);return}e.dispose()}};if(this.scene.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&t(e.material)}),this._tex.forEach(e=>{try{e.dispose()}catch(n){}}),this.envRT)try{this.envRT.dispose()}catch(e){}try{this.renderer.dispose()}catch(e){}try{let e=this.renderer.getContext&&this.renderer.getContext(),n=e&&e.getExtension("WEBGL_lose_context");n&&n.loseContext()}catch(e){}this.planes.clear(),this.anims.length=0,this._toss=null,this._hand=null}};function Jl(s,t,e){let n=new Nn,i=s/2,r=t/2,o=Math.min(e,i,r);return n.moveTo(-i+o,-r),n.lineTo(i-o,-r),n.quadraticCurveTo(i,-r,i,-r+o),n.lineTo(i,r-o),n.quadraticCurveTo(i,r,i-o,r),n.lineTo(-i+o,r),n.quadraticCurveTo(-i,r,-i,r-o),n.lineTo(-i,-r+o),n.quadraticCurveTo(-i,-r,-i+o,-r),n}function zf(s,t,e){let n=new Ii,i=s/2,r=t/2,o=Math.min(e,i,r);return n.moveTo(-i+o,-r),n.lineTo(i-o,-r),n.quadraticCurveTo(i,-r,i,-r+o),n.lineTo(i,r-o),n.quadraticCurveTo(i,r,i-o,r),n.lineTo(-i+o,r),n.quadraticCurveTo(-i,r,-i,r-o),n.lineTo(-i,-r+o),n.quadraticCurveTo(-i,-r,-i+o,-r),n}function Nx(s,t,e){let n=new _i(Jl(s,t,e),12),i=n.getAttribute("position"),r=new Float32Array(i.count*2);for(let o=0;o<i.count;o++)r[o*2]=(i.getX(o)+s/2)/s,r[o*2+1]=(i.getY(o)+t/2)/t;return n.setAttribute("uv",new Oe(r,2)),n}var cS=new R(zi.x,zi.y,zi.z),Qh=class{constructor(){this.on=!1,this.ctx=null,this.master=null}setOn(t){this.on=!!t,this.on&&this._ensure()}_ensure(){if(typeof window=="undefined")return null;let t=window.AudioContext||window.webkitAudioContext;if(!t)return null;try{this.ctx||(this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=.14,this.master.connect(this.ctx.destination)),this.ctx.state==="suspended"&&this.ctx.resume&&this.ctx.resume().catch(()=>{})}catch(e){this.ctx=null}return this.ctx}_tone(t,e,n,i,r,o){let a=this.ctx,l=a.currentTime+(o||0),c=a.createOscillator(),h=a.createGain();c.type=i||"sine",c.frequency.setValueAtTime(t,l),e&&e!==t&&c.frequency.exponentialRampToValueAtTime(Math.max(30,e),l+n),h.gain.setValueAtTime(1e-4,l),h.gain.exponentialRampToValueAtTime(Math.max(2e-4,r),l+.012),h.gain.exponentialRampToValueAtTime(1e-4,l+n),c.connect(h),h.connect(this.master),c.start(l),c.stop(l+n+.02)}_noise(t,e){let n=this.ctx,i=Math.max(1,Math.floor(n.sampleRate*t)),r=n.createBuffer(1,i,n.sampleRate),o=r.getChannelData(0);for(let h=0;h<i;h++)o[h]=(Math.random()*2-1)*(1-h/i);let a=n.createBufferSource();a.buffer=r;let l=n.createGain();l.gain.value=e;let c=n.createBiquadFilter();c.type="bandpass",c.frequency.value=1200,a.connect(c),c.connect(l),l.connect(this.master),a.start()}_can(){return this.on&&this.ctx}dice(){if(this._can())try{this._noise(.18,.16),this._tone(220,90,.14,"triangle",.1)}catch(t){}}diceLand(t){if(this._can())try{let e=re(Number(t)||0,0,1),n=.05+.11*e;this._noise(.05,n),this._tone(190-40*e,90,.085,"triangle",n*.9)}catch(e){}}whoosh(){if(this._can())try{this._noise(.22,.1)}catch(t){}}tick(){if(this._can())try{this._tone(520,420,.05,"sine",.025)}catch(t){}}land(){if(this._can())try{this._tone(150,70,.18,"sine",.16),this._noise(.08,.08)}catch(t){}}bear(){if(this._can())try{this._tone(660,660,.12,"sine",.08),this._tone(990,990,.16,"sine",.06,.1)}catch(t){}}capture(){if(this._can())try{this._noise(.24,.18),this._tone(300,60,.22,"sawtooth",.08)}catch(t){}}win(){if(this._can())try{[523,659,784,1046].forEach((t,e)=>this._tone(t,t,.3,"sine",.07,e*.11))}catch(t){}}},Ql=class{constructor(t,e={}){this.scene=t,this.host=e.host||t.host,this.reduced=!!e.reduced,this.stageAim=e.stageAim||{nx:0,ny:.15},this.phase="boot",this.busy=!1,this.holding=!1,this.cellCtx=null,this.lastState=null,this.lastView=null,this._queue=Promise.resolve(),this._instantNext=!1,this._skipRequested=!1,this._skipUntilIdle=!1,this._fitPending=!1,this._movingPieceId=null,this._lastSquare=null,this.targetSquare=null,this.sfx=new Qh,this.sfx.setOn(!!e.sound),this.scene.lockProbeId=null,this.scene.applyPose({theta:0,tx:0,tz:0}),this.scene.rig.snap(this._overview()),this._setPhase("idle")}setState(t,e){this.lastState=t||this.lastState,this.lastView=e||this.lastView}setSound(t){this.sfx.setOn(t)}setReduced(t){let e=!!t;e!==this.reduced&&(this.reduced=e,this.scene.setReduced(e),e?(this._instantNext=!0,this.scene.flushAnims(),this.scene.setFlyMode(!1),this.busy||(this.holding=!1,this.cellCtx=null,this.scene.setStageVisible(!1),this.scene.setDim(1),this.scene.setTargetGlow(null),this.scene.setStreaks(!1),this.scene.applyPose({theta:0,tx:0,tz:0}),this.scene.rig.snap(this._overview()),this._setPhase("idle"),this._instantNext=!1)):(this._instantNext=!1,this.scene.rig.snap(this.scene.rig.snapshotTarget())))}play(t,e){let n=Array.isArray(t)?t.filter(Boolean):[],i=()=>this._run(n,e||{}).catch(r=>{console.warn("[board3d] play error:",r&&r.message?r.message:r),this.holding=!1,this._setPhase("idle")}).finally(()=>{if(this.busy=!1,this._instantNext=!1,this._skipRequested=!1,this.phase==="idle"&&!this.holding&&(this._skipUntilIdle=!1),!this.holding&&this.phase==="idle")try{this.handleResize()}catch(r){}});return this.busy=!0,this._queue=this._queue.then(i,i),this._queue}skip(){this._skipRequested=!0,this._skipUntilIdle=!0,this.scene.flushAnims(),this._instantNext=!0,this.busy||(this.holding||this.phase!=="idle"?this.returnToOverview().catch(()=>{}):(this._instantNext=!1,this._skipUntilIdle=!1,this._skipRequested=!1))}_setPhase(t){this.phase=t,this.host&&this.host.setAttribute("data-3d-phase",t),this.scene.markPhase(t)}_anim(t,e){if(this._instantNext||this._skipUntilIdle||this.reduced){try{e(1)}catch(n){console.warn("[board3d] anim instant",n)}return this.scene.requestRender(),Promise.resolve()}return this.scene.runAnim(t,e)}_animateCamera(t,e,n){return this._instantNext||this._skipUntilIdle||this.reduced?(this.scene.rig.snap(e),Promise.resolve()):this.scene.rig.animate(t,e,n)}_playerOf(t){return String(t||"").charAt(0)==="b"?"b":"a"}_colorFor(t){let e=this.lastState;if(e&&Array.isArray(e.pieces)){let i=e.pieces.find(r=>r.id===t);if(i&&i.color)return i.color}let n=this._playerOf(t);return e&&e.colors&&e.colors[n]?e.colors[n]:n==="b"?"yellow":"red"}_squareOf(t){let e=this.lastState;if(e&&Array.isArray(e.pieces)){let n=e.pieces.find(i=>i.id===t);if(n)return n.squareId}return null}_overview(){let t=this.scene.rig.distForCover(3.7,nf,42),e={center:new R(0,.05,.24),nx:0,ny:0,radius:t,elev:58,azim:0,fov:42};return e.ny=this._centerBias(e),e}_centerBias(t){let e=this.scene.rig,n=this.scene.camera,i=this.scene.boardGroup,r=n.position.constructor,o=e.snapshotTarget(),a=e.lockState,l=1e9,c=-1e9;try{e.lockState=null,e.snap({center:t.center.clone(),nx:t.nx,ny:0,radius:t.radius,elev:t.elev,azim:t.azim,fov:t.fov});for(let h=0;h<24;h++){let u=h/24*ft,d=i.localToWorld(new r(Math.cos(u)*3.3,.035,Math.sin(u)*3.3)).project(n);d.y<l&&(l=d.y),d.y>c&&(c=d.y)}}catch(h){l=0,c=0}finally{e.snap(o),e.lockState=a}return!isFinite(l)||!isFinite(c)?0:+re(-(l+c)/2,-.12,.12).toFixed(4)}handleResize(){let t={idle:1,win:1,boot:1};if(this.busy||this.holding||!t[this.phase]){this._fitPending=!0;return}this._fitPending=!1,this.scene.applyPose({theta:0,tx:0,tz:0}),this.scene.rig.snap(this._overview())}_focus(){return{center:new R(0,ms,0),nx:0,ny:0,radius:3.05,elev:33,azim:0,fov:42}}_roll(){let t=this.scene.rig.aspect||1,e=re(.657/Math.max(.35,t),1,1.32);return{center:new R(.76,.29,.64),nx:0,ny:0,radius:3.95*e,elev:50,azim:7,fov:42}}_land(){return{center:new R(0,.12,0),nx:0,ny:.02,radius:4.05,elev:46,azim:0,fov:42}}_stage(){return{center:new R(0,an+Il+.34,0),nx:this.stageAim.nx,ny:this.stageAim.ny,radius:this.scene.rig.distForCover(.4,.52,42),elev:45,azim:Bi,fov:42}}async _runReduced(t){this.scene.setFlyMode(!1),this.scene.setDieVisible(!0);let e=t.find(i=>i.type==="dice");e&&this.scene.placeDie(e.die);let n=t.filter(Jh);for(let i of n){let r=i.pieceId,o=xo(i);r&&o&&this.scene.setPlaneToSquare(r,o)}if(!n.length){let i=this._squareOf(this._movingPieceId);i&&this.scene.setPlaneToSquare(this._movingPieceId,i)}this._setPhase("idle")}async _run(t,e){if(this.reduced)return this._runReduced(t);this.holding&&await this.returnToOverview();let n=t.find(M=>M.type==="dice"),i=t.filter(Jh),r=t.find(M=>M.type==="prompt"&&M.prompt),o=t.find(M=>M.type==="minigame"),a=t.find(M=>M.type==="capture"),l=t.find(M=>M.type==="stack"),c=t.find(M=>M.type==="win"),h=t.find(M=>M.type==="ledger"),u=t.find(M=>M.type==="safe");if(n){if(!i.length&&!r&&!o&&!c&&!h&&!u&&!this.reduced){await this._phaseRollQuick(n);return}if(await this._phaseRoll(n),!i.length&&!r&&!o&&!c){await this.returnToOverview();return}}if(!i.length){let M=r&&r.prompt;if(c||M&&M.kind==="ending"){await this._phaseWin();return}if(h||u){await this.returnToOverview();return}this._setPhase("idle");return}let d=i[0],f=d.pieceId||a&&a.attackerId;if(!f)return;this.scene.setDieVisible(!1),this._movingPieceId=f,this.scene.ensurePlane(f,this._colorFor(f),this._playerOf(f)),this.targetSquare=xo(i[i.length-1]);let g=this._originFor(d,f);await this._phaseFocus(f,g),this._setPhase("fly"),this.scene.fixPlane(f),this.scene.setFlyMode(!0),this.scene.lockProbeId=f,this.scene.lockStats.reset(),this.scene.setStreaks(!0),this.sfx.whoosh();let _=g;for(let M of i)_=await this._animateMotion(M,_,f);this._lastSquare=_,this.scene.setStreaks(!1),await this._phaseLand(f,_),a&&await this._phaseCapture(a,_),l&&(this.scene.setTargetGlow(_,.8),await this._phaseStack(l));let m=r&&r.prompt;if(!!(m&&m.kind==="ending")||c&&!m){await this._phaseWin();return}if(r||o){await this._phaseCell(f,_),(this._instantNext||this.reduced)&&await this.returnToOverview(f,_);return}await this.returnToOverview(f,_)}_originFor(t,e){let n=Of(t);if(n)return n;let i=this._squareOf(e);return i||t.path&&t.path[0]||"ring:0"}async _phaseRoll(t){this._setPhase("roll");let e=re(Number(t.die)||1,1,6);if(this.reduced){this.scene.placeDie(e);return}this.scene.setDieVisible(!0),this.sfx.whoosh();let n=this._animateCamera(560,this._roll()),i=this.scene.tossDie(e,this._instantNext||this._skipUntilIdle,{onRelease:()=>this.sfx.dice(),onImpact:(r,o)=>this.sfx.diceLand(o),onSettle:()=>this.sfx.tick()});await Promise.all([n,i])}async _phaseRollQuick(t){this._setPhase("roll");let e=re(Number(t.die)||1,1,6);this.scene.setDieVisible(!0),this.scene.placeDie(e),this.sfx&&this.sfx.diceLand&&this.sfx.diceLand(.12),!this._instantNext&&!this._skipUntilIdle&&await new Promise(n=>setTimeout(n,260)),this._setPhase("idle")}async _phaseFocus(t,e){this._setPhase("focus");let n=_o(e),i=this._focus();if(this.scene.setPlaneToSquare(t,e),this.scene.setTargetGlow(e,.5),this.scene.reduced){this.scene.applyPose(n),this.scene.rig.snap(i);return}let r=this.scene.boardPose(),o=this.scene.rig.snapshotTarget();await this._animateCamera(950,i,l=>{let c=$h(r,n,l);this.scene.applyPose(c);let h=this.scene.planes.get(t);if(!h)return i.center.clone();let u=h.local.clone();return this.scene.boardGroup.localToWorld(u),u}),this.scene.applyPose(n);let a=this.scene.planes.get(t);a&&(this.scene.rig.state.center.copy(a.group.position),this.scene.rig.apply())}async _slideTo(t,e){let n=this.scene.boardPose();if(this.scene.reduced){this.scene.applyPose(t);return}await this._anim(e,i=>{let r=xs(re(i,0,1));this.scene.applyPose($h(n,t,r))}),this.scene.applyPose(t)}async _animateMotion(t,e,n){if(t.type==="move"){let i=(t.path||[]).slice();for(let r of i){this.scene.setTargetGlow(r,.5);let o=String(r).indexOf("home:")===0?190:165;await this._slideTo(_o(r),o),e=r,this.sfx.tick()}return e}if(t.type==="takeoff"){let i=xo(t)||e,r=this.scene.planes.get(n);return r&&r.group.scale.setScalar(.82),this.scene.setTargetGlow(i,.55),await this._slideTo(_o(i),900),r&&r.group.scale.setScalar(1),this.sfx.whoosh(),i}if(t.type==="jump"||t.type==="fly"){let i=xo(t)||e;return this.scene.setTargetGlow(i,.8),await this._slideTo(_o(i),t.type==="jump"?540:840),this.sfx.whoosh(),i}return e}async _phaseLand(t,e){if(this._setPhase("land"),this.scene.setFlyMode(!1),this.scene.rig.unlock(),this.scene.lockProbeId=null,this.scene.setPlaneToSquare(t,e),this.scene.setTargetGlow(e,.7),this.scene.playRipple(this._instantNext||this._skipUntilIdle),this.sfx.land(),this.scene.reduced){this.scene.rig.snap(this._land());return}await this._animateCamera(460,this._land()),this._instantNext||this.scene.pulseTargetGlow(380)}async _phaseStack(t){this._setPhase("stack"),this._instantNext||this.scene.pulseTargetGlow(520);let e=t&&t.pieceIds||[];for(let n of e){let i=this.scene.planes.get(n);i&&i.group.scale.setScalar(1.14)}if(!this.scene.reduced){await this._anim(320,n=>{let i=1+Math.sin(n*Math.PI)*.14;for(let r of e){let o=this.scene.planes.get(r);o&&o.group.scale.setScalar(i)}});for(let n of e){let i=this.scene.planes.get(n);i&&i.group.scale.setScalar(1)}}}async _phaseCapture(t,e){this._setPhase("capture"),this.scene.rig.shake(320,.06),this.sfx.capture();let n=t&&t.victimIds||[];for(let i of n){let r=this._colorFor(i),o=this.scene.ensurePlane(i,r,this._playerOf(i)),a=Si(e);o.local.set(a.x,a.y,a.z),o.localYaw=a.yaw,o.mode="board",o.group.visible=!0,o.group.scale.setScalar(1),this.scene._applyPlaneLocal(o),this.scene.updatePlaneTransforms();let l=this._squareOf(i)||"hangar:"+r+":0",c=Si(l);if(this.scene.reduced){this.scene.setPlaneToSquare(i,l);continue}await this._anim(700,h=>{let u=xs(re(h,0,1));o.local.set(ae(a.x,c.x,u),ae(a.y,c.y,u)+Math.sin(h*Math.PI)*.55,ae(a.z,c.z,u)),o.localYaw=a.yaw+u*5,o.group.scale.setScalar(1-u*.35),this.scene._applyPlaneLocal(o),this.scene.updatePlaneTransforms()}),this.scene.hidePlane(i)}}async _phaseCell(t,e){if(this.scene.reduced){await this.returnToOverview(t,e);return}this._setPhase("cell45"),this.scene.setDim(.18),this.scene.setStageSquare(e),this.scene.stageShadow.position.set(0,.004,0),this.scene.stageShadow.material.opacity=0,this.scene.stageShadow.scale.setScalar(1),this.scene.setStageRise(0),this.scene.setStageVisible(!0),this.scene.setBearVisible(!1),this.scene.bear.group.scale.setScalar(.001),this.scene.bear.group.rotation.y=Math.PI+Bi*Ne,this.scene.hidePlane(t),this.scene.setTargetGlow(null);let n=this._stage(),i=this.scene.rig.snapshotTarget(),r=this._animateCamera(900,n,l=>new R(0,ae(i.center.y,n.center.y,l),0)),o=this._anim(900,l=>{let c=xs(re(l,0,1));this.scene.setDim(ae(1,.18,ur(0,.75,l))),this.scene.setStageRise(ae(0,Il,c)),this.scene.stageShadow.material.opacity=ae(0,.5,ur(.2,1,l)),this.scene.stageShadow.scale.setScalar(ae(1,.7,c))});await Promise.all([r,o]),this.scene.setDim(.18),this.scene.setStageRise(Il),this.scene.rig.snap(n),this.scene.setBearVisible(!0),this._setPhase("bear"),this.sfx.bear();let a=Math.PI+Bi*Ne;await this._anim(560,l=>{let c=l<.6?Fl(l/.6)*1.14:1.14-(l-.6)/.4*.14;this.scene.bear.group.scale.setScalar(re(c,.001,1.15)),this.scene.bear.group.rotation.y=a+Math.sin(l*Math.PI*2)*.06}),this.scene.bear.group.scale.setScalar(1),this.scene.bear.group.rotation.y=a,this.scene.setBearVisible(!0),this.cellCtx={pieceId:t,square:e},this.holding=!0,this._setPhase("bear")}async _phaseWin(){if(await this.returnToOverview(this._movingPieceId,this._lastSquare),this.reduced){this._setPhase("idle");return}this._setPhase("win"),this.sfx.win(),this.scene.setTargetGlow(null),this.scene.setDim(1),this.scene.requestRender()}async returnToOverview(t,e){let n=this.cellCtx,i=t||n&&n.pieceId||this._movingPieceId,r=e||n&&n.square||this._lastSquare||(i?this._squareOf(i):null);this.cellCtx=null,this.holding=!1,this.scene.lockProbeId=null,this.scene.setStreaks(!1),this.scene.setFlyMode(!1),this.scene.setTargetGlow(null),this.scene.setBearVisible(!1),this.scene.bear.group.scale.setScalar(.001),this.scene.setStageVisible(!1),this.scene.setStageRise(0),this.scene.setDim(1),this._setPhase("return"),this.targetSquare=null;let o=this.scene.boardPose(),a=Ul(o.theta,0),l=this.scene.rig.snapshotTarget(),c=this._overview();if(this.scene.reduced||await this._anim(700,h=>{let u=xs(re(h,0,1));this.scene.applyPose({theta:o.theta+a*u,tx:o.tx*(1-u),tz:o.tz*(1-u)});let d=this.scene.rig.state;d.center.lerpVectors(l.center,c.center,u),d.nx=ae(l.nx,c.nx,u),d.ny=ae(l.ny,c.ny,u),d.radius=ae(l.radius,c.radius,u),d.elev=ae(l.elev,c.elev,u),d.azim=ae(l.azim,c.azim,u),d.fov=ae(l.fov,c.fov,u),this.scene.rig.apply()}),this.scene.applyPose({theta:0,tx:0,tz:0}),i&&r&&this.scene.setPlaneToSquare(i,r),this.scene.setDieVisible(!0),this.scene.rig.snap(this._overview()),this._setPhase("idle"),this._fitPending){this._fitPending=!1;try{this.handleResize()}catch(h){}}}debug(){return{phase:this.phase,busy:this.busy,holding:this.holding,reduced:this.reduced,target:this.targetSquare,lastSquare:this._lastSquare,cell:this.cellCtx?{...this.cellCtx}:null,movingPiece:this._movingPieceId,die:this.scene&&this.scene.dieDebug?this.scene.dieDebug():null}}dispose(){this._queue=Promise.resolve(),this.busy=!1,this.holding=!1,this.cellCtx=null,this.scene=null,this.host=null}};var Ox=["data-3d-phase","data-3d-ready","data-3d-reduced","data-3d-theme","data-3d-mode","data-3d-fallback","data-3d-zoom","data-3d-zoom-value","data-3d-zoom-lock"],oe=null;function yo(){return typeof window!="undefined"?window:typeof globalThis!="undefined"?globalThis:null}function Hf(s){if(s&&fs[s])return s;try{let t=yo()&&yo().App,e=t&&t.Themes&&t.Themes.get?t.Themes.get():null;if(e&&fs[e])return e}catch(t){}return"cloud"}function Bx(){try{let t=document.createElement("canvas").getContext("webgl2");if(!t)return!1;let e=t.getExtension("WEBGL_lose_context");return e&&e.loseContext(),!0}catch(s){return!1}}var jh=class{constructor(t,e){this.host=t,this.opts=e||{},this.reduced=!!this.opts.reduced,this.theme=Hf(this.opts.theme),this.mode=this.opts.mode==="long"?"long":"quick",this.state=null,this.view=null,this.pending=null,this._busy=!1,this._dieValue=1,this.scene=null,this.director=null,this.layer=null,this.canvas=null,this.ready=!1,this._hostPositionSet=!1,this._hostOldPosition="",this._refitTimer=0,this._zoomPumpUntil=0}async init(){let t=this.host,e=document.createElement("div");e.className="board3d-layer",e.setAttribute("data-test","board3d-layer"),e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;";let n=window.getComputedStyle?window.getComputedStyle(t):null;n&&n.position==="static"&&(this._hostOldPosition=t.style.position||"",t.style.position="relative",this._hostPositionSet=!0);let i=document.createElement("canvas");return i.className="board3d-canvas",i.setAttribute("data-test","board3d-canvas"),i.setAttribute("aria-hidden","true"),i.style.cssText="position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none;",e.appendChild(i),t.appendChild(e),t.removeAttribute("data-3d-fallback"),this.layer=e,this.canvas=i,this.scene=new Kl(t,i,{reduced:this.reduced,theme:this.theme,quality:this.opts.quality||void 0,shadows:this.opts.shadows!==!1,adapt:this.opts.adapt!==!1}),this.scene.rig&&this.scene.rig.setZoomReduced(this.reduced),this.scene.onReady=()=>this._onReady(),this.scene.ready&&this._onReady(),this.director=new Ql(this.scene,{host:t,reduced:this.reduced,sound:!!this.opts.sound,stageAim:this.opts.stageAim||{nx:0,ny:.15}}),this._hookZoomPhase(),this.scene.onResize=()=>{this.director&&this.director.handleResize(),this._fitNeeded=!0,this._fitTimer&&clearTimeout(this._fitTimer),this._fitTimer=setTimeout(()=>{this._fitTimer=0,this.director&&this.director.handleResize()},450)},this._sizeW=0,this._sizeH=0,this._fitNeeded=!1,this._sizeTimer=setInterval(()=>{if(!this.scene||!this.director)return;let r=t.clientWidth,o=t.clientHeight;if(!r||!o)return;(r!==this._sizeW||o!==this._sizeH)&&(this._sizeW=r,this._sizeH=o,this.scene.resize(),this._fitNeeded=!0),(this._fitNeeded||this.director._fitPending)&&!this.director.busy&&!this.director.holding&&(this._fitNeeded=!1,this.director.handleResize())},350),typeof requestAnimationFrame=="function"&&requestAnimationFrame(()=>{if(this.scene){this.scene.resize();try{this.director.handleResize()}catch(r){}}}),t.setAttribute("data-3d-reduced",this.reduced?"1":"0"),t.setAttribute("data-3d-theme",this.theme),t.setAttribute("data-3d-mode",this.mode),t.setAttribute("data-3d-phase","idle"),this._syncZoomHost(),this.opts.state?this.setState(this.opts.state,this.opts.view):this._applyDefaultPieces(),this}_onReady(){this.ready||(this.ready=!0,this.host.setAttribute("data-3d-ready","1"))}_viewFor(t){if(!t)return null;try{let e=yo()&&yo().App;if(e&&e.Flight&&e.Flight.view)return e.Flight.view(t,{reduced:this.reduced})}catch(e){}return null}_pieces(t){return(t&&t.pieces||[]).map(e=>({id:e.id,color:e.color||"red",playerId:e.playerId||String(e.id).charAt(0),squareId:e.squareId||"hangar:red:0",arrived:!!e.arrived,stackGroupId:e.stackGroupId||null}))}_dieOf(t){if(!t)return this._dieValue||1;if(t.rollContext&&t.rollContext.die)return t.rollContext.die;let e=t.awaiting;if(e&&e.type==="choose-piece"&&e.die)return e.die;let n=t.log||[];for(let i=n.length-1;i>=0;i--)if(n[i]&&n[i].kind==="roll"&&n[i].die)return n[i].die;return this._dieValue||1}_applyDefaultPieces(){let t=[{id:"a:0",color:"red",playerId:"a",squareId:"hangar:red:0"},{id:"a:1",color:"red",playerId:"a",squareId:"hangar:red:1"},{id:"b:0",color:"yellow",playerId:"b",squareId:"hangar:yellow:0"},{id:"b:1",color:"yellow",playerId:"b",squareId:"hangar:yellow:1"}];this.scene&&(this.scene.setPieces(this.mode==="long"?t.concat([{id:"a:2",color:"red",playerId:"a",squareId:"hangar:red:2"},{id:"a:3",color:"red",playerId:"a",squareId:"hangar:red:3"},{id:"b:2",color:"yellow",playerId:"b",squareId:"hangar:yellow:2"},{id:"b:3",color:"yellow",playerId:"b",squareId:"hangar:yellow:3"}]):t,"a",{a:"red",b:"yellow"}),this.scene.placeDie(1))}setState(t,e){if(!t)return this._applyDefaultPieces(),!1;this.state=t,this.view=e||this._viewFor(t),this.director&&this.director.setState(t,e||this.view);let n=this._pieces(t),i=t.turn==="b"?"b":"a",r=t.colors||{a:"red",b:"yellow"},o=this._dieOf(t);if(this._dieValue=o,!this.scene)return!1;let a=this.view&&this.view.meta?this.view.meta.heat:t.meta?t.meta.heat:0;return this.scene.applyHeat(a),this.scene.applyTurn(i,r),this.scene.placeDie(o),this._busy||this.director&&this.director.holding?this.pending={pieces:n,turn:i,colors:r}:(this.scene.setPieces(n,i,r),this.pending=null),!0}_flushPending(){if(!this.pending||!this.scene||this.director&&this.director.holding)return;let t=this.pending;this.pending=null,this.scene.setPieces(t.pieces,t.turn,t.colors)}play(t,e){if(!this.director)return Promise.resolve();this._busy=!0;let n=()=>{this._busy=!1,(!this.director||!this.director.holding)&&this._flushPending()},i=this.director.play(t,e);return i.then(n,n),i}setTheme(t){return this.theme=Hf(t),this.scene&&this.scene.applyTheme(this.theme),this.host.setAttribute("data-3d-theme",this.theme),!0}setReduced(t){if(this.reduced=!!t,this.host.setAttribute("data-3d-reduced",this.reduced?"1":"0"),this.director?this.director.setReduced(this.reduced):this.scene&&this.scene.setReduced(this.reduced),this.scene&&this.scene.rig&&(this.scene.rig.setZoomReduced(this.reduced),this._syncZoomHost(),this.reduced))try{this.scene.renderNow()}catch(e){}return!0}setSound(t){return this.director&&this.director.setSound(!!t),!0}skip(){return this.director&&this.director.skip(),!0}_hookZoomPhase(){let t=this.director;if(!t||t.__zoomHooked)return;t.__zoomHooked=!0;let e=t._setPhase.bind(t);t._setPhase=n=>{e(n),this._onPhase(n)},this._onPhase(t.phase)}_onPhase(t){let e=t==="idle"||t==="boot";this.scene&&this.scene.rig&&this.scene.rig.setZoomActive(e),this.host&&this.host.setAttribute("data-3d-zoom-lock",e?"0":"1"),this._syncZoomHost(),e&&this._zoomPump()}_syncZoomHost(){let t=this.scene&&this.scene.rig;if(!t||!this.host||typeof t.zoomInfo!="function")return;let e=t.zoomInfo();this.host.setAttribute("data-3d-zoom",Number(e.target).toFixed(2)),this.host.setAttribute("data-3d-zoom-value",Number(e.value).toFixed(2))}canZoom(){let t=this.director;return!this.ready||!this.scene||!t||this._busy||t.busy||t.holding?!1:t.phase==="idle"||t.phase==="boot"}zoomInfo(){let t=this.scene&&this.scene.rig;if(!t||typeof t.zoomInfo!="function")return null;let e=t.zoomInfo();return e.can=this.canZoom(),e}setZoom(t){if(!this.canZoom()||!this.scene||!this.scene.rig)return!1;let e=this.scene.rig.setZoom(t);return this._zoomChanged(),e}zoomBy(t){if(!this.canZoom()||!this.scene||!this.scene.rig)return!1;let e=this.scene.rig.zoomBy(t);return this._zoomChanged(),e}resetZoom(){if(!this.canZoom()||!this.scene||!this.scene.rig)return!1;let t=this.scene.rig.resetZoom();return this._zoomChanged(),t}_zoomChanged(){if(this._syncZoomHost(),this.reduced)try{this.scene.renderNow()}catch(t){}this._zoomPump(),this._refitTimer&&clearTimeout(this._refitTimer),this._refitTimer=setTimeout(()=>{if(this._refitTimer=0,this._syncZoomHost(),!!this.canZoom()){try{this.director.handleResize()}catch(t){}if(this._syncZoomHost(),this.reduced)try{this.scene.renderNow()}catch(t){}}},160)}_zoomPump(){if(this.reduced||!this.scene)return;let t=typeof performance!="undefined"&&performance.now?performance.now():Date.now();if(t<this._zoomPumpUntil)return;this._zoomPumpUntil=t+700;let e=()=>{if(!this.scene)return;try{this.scene.requestRender()}catch(i){}(typeof performance!="undefined"&&performance.now?performance.now():Date.now())<this._zoomPumpUntil?requestAnimationFrame(e):this._zoomPumpUntil=0};try{requestAnimationFrame(e)}catch(n){this._zoomPumpUntil=0}}returnToOverview(){if(!this.director)return Promise.resolve(!1);let t=this.director;return t.returnToOverview().then(()=>(t.holding||this._flushPending(),!0),()=>!1)}unmount(){if(this._fitTimer&&(clearTimeout(this._fitTimer),this._fitTimer=0),this._refitTimer&&(clearTimeout(this._refitTimer),this._refitTimer=0),this._sizeTimer&&(clearInterval(this._sizeTimer),this._sizeTimer=0),this.director){try{this.director.dispose()}catch(t){}this.director=null}if(this.scene){try{this.scene.dispose()}catch(t){}this.scene=null}return this.layer&&this.layer.parentNode&&this.layer.parentNode.removeChild(this.layer),this.layer=null,this.canvas=null,this._hostPositionSet&&(this.host.style.position=this._hostOldPosition,this._hostPositionSet=!1),Ox.forEach(t=>this.host.removeAttribute(t)),!0}_debug(){let t=this.director?this.director.debug():{},e=this.scene?this.scene.debugSnapshot():{},n=e.current||null,i=this.scene&&this.scene.rig,r=i&&typeof i.zoomInfo=="function"?i.zoomInfo():{value:1,target:1,min:.8,max:1.5,active:!0,instant:!1,radiusFactor:1};return r.can=this.canZoom(),{version:Al,ready:!!this.ready,mounted:!0,phase:t.phase||e.phase||"boot",zoom:r,pieces:this._pieces(this.state).map(o=>({id:o.id,color:o.color,playerId:o.playerId,squareId:o.squareId,arrived:o.arrived})),target:t.target!=null?t.target:this.director?this.director._lastSquare:null,fps:n?n.fps:0,drawCalls:e.render?e.render.calls:0,triangles:e.render?e.render.triangles:0,dpr:e.dpr||0,quality:e.quality||"high",reduced:this.reduced,theme:this.theme,heat:this.scene?this.scene.heat:0,turn:this.scene?this.scene.turn:null,mode:this.mode,busy:!!t.busy,holding:!!t.holding,cell:t.cell||null,probe:e.probe||null,perf:e,three:"180"}}};function zx(){if(typeof document=="undefined")return;let s=document.querySelector('[data-test="board3d-legend-panel"]');!s||s.querySelector('[data-test="board3d-legend-row"]')||s.insertAdjacentHTML("beforeend",tu.legendRows())}async function Hx(s,t){if(!s||typeof document=="undefined")return null;if(oe){try{oe.unmount()}catch(n){}oe=null}if(!Bx()){try{s.setAttribute("data-3d-fallback","no-webgl2")}catch(n){}return null}let e=null;try{return e=new jh(s,t||{}),await e.init(),oe=e,zx(),e}catch(n){console.warn("[board3d] mount failed:",n&&n.message?n.message:n);try{e&&e.unmount()}catch(i){}try{s.setAttribute("data-3d-fallback","mount-failed")}catch(i){}return null}}var tu={version:Al,legendRows(){let s=[["真","真心话","抽一张真心话"],["敢","大冒险","抽一张大冒险"],["触","靠近","抽一张靠近的题"],["缘","命运","两张挑一张"],["温","温度计","小游戏·温度计"],["轮","转盘","小游戏·转盘"],["起","起飞","全在机坪时任意点数起飞"],["飞","飞点","向前 12 格"],["停","禁跳","这一格不跳"],["归","进航","进自己的航线"],["·","普通格","不抽题，走过去"]],t={0:'<div class="v6-l3h2" style="margin:4px 0 1px;font-size:9.5px;color:#F3C077">内容格</div>',6:'<div class="v6-l3h2" style="margin:4px 0 1px;font-size:9.5px;color:#F3C077">走法格</div>',10:'<div class="v6-l3h2" style="margin:4px 0 1px;font-size:9.5px;color:#F3C077">其它</div>'},e=n=>String(n).replace(/[&<>"]/g,i=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[i]);return s.map((n,i)=>(t[i]||"")+'<div class="v6-l3r" data-test="board3d-legend-row"><b>'+e(n[0])+"</b><span>"+e(n[1])+" · "+e(n[2])+"</span></div>").join("")},get mounted(){return!!oe},get threeRevision(){return"180"},mount:Hx,setState(s,t){return oe?oe.setState(s,t):!1},play(s,t){return oe?oe.play(s,t):Promise.resolve()},setTheme(s){return oe?oe.setTheme(s):!1},setReduced(s){return oe?oe.setReduced(s):!1},setSound(s){return oe?oe.setSound(s):!1},skip(){return oe?oe.skip():!1},canZoom(){return oe?oe.canZoom():!1},setZoom(s){return oe?oe.setZoom(s):!1},zoomBy(s){return oe?oe.zoomBy(s):!1},resetZoom(){return oe?oe.resetZoom():!1},zoomInfo(){return oe?oe.zoomInfo():null},returnToOverview(){return oe?oe.returnToOverview():Promise.resolve(!1)},unmount(){if(!oe)return!1;try{oe.unmount()}catch(s){}return oe=null,!0},_debug(){return oe?oe._debug():{version:Al,ready:!1,mounted:!1,phase:"boot",pieces:[],target:null,fps:0,drawCalls:0}},_current(){return oe}},jl=yo();jl&&(jl.App=jl.App||{},jl.App.Board3D=tu);var pS=tu;})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
