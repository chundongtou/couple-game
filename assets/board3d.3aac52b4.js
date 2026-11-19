/*! v8-board3d min:1 */
(()=>{var nu=0,gc=1,iu=2;var _c=1,ao=2,On=3,ei=0,Be=1,He=2,ri=0,ni=1,gn=2,xc=3,yc=4,su=5,gi=100,ru=101,au=102,ou=103,lu=104,cu=200,hu=201,uu=202,du=203,Ca=204,Ia=205,fu=206,pu=207,mu=208,gu=209,_u=210,xu=211,yu=212,vu=213,Mu=214,oo=0,lo=1,co=2,Fi=3,ho=4,uo=5,fo=6,po=7,vc=0,Su=1,bu=2,ai=0,Tu=1,Eu=2,wu=3,mo=4,Au=5,Ru=6,Cu=7;var Mc=300,Vi=301,Wi=302,go=303,_o=304,zr=306,ii=1e3,mi=1001,Pa=1002,mn=1003,Iu=1004;var kr=1005;var nn=1006,xo=1007;var Bn=1008;var An=1009,Sc=1010,bc=1011,Ds=1012,yo=1013,bi=1014,zn=1015,Ls=1016,vo=1017,Mo=1018,Fs=1020,Tc=35902,Ec=35899,wc=1021,Ac=1022,_n=1023,Ms=1026,Us=1027,Rc=1028,So=1029,Cc=1030,bo=1031;var To=1033,Hr=33776,Gr=33777,Vr=33778,Wr=33779,Eo=35840,wo=35841,Ao=35842,Ro=35843,Co=36196,Io=37492,Po=37496,Do=37808,Lo=37809,Fo=37810,Uo=37811,No=37812,Oo=37813,Bo=37814,zo=37815,ko=37816,Ho=37817,Go=37818,Vo=37819,Wo=37820,Xo=37821,qo=36492,Yo=36494,Zo=36495,Jo=36283,$o=36284,Ko=36285,Qo=36286;var lr=2300,Da=2301,Ra=2302,sc=2400,rc=2401,ac=2402;var Pu=3200,Du=3201;var Ic=0,Lu=1,Rn="",Fe="srgb",Ui="srgb-linear",cr="linear",le="srgb";var Li=7680;var oc=519,Fu=512,Uu=513,Nu=514,Pc=515,Ou=516,Bu=517,zu=518,ku=519,La=35044;var Dc="300 es",wn=2e3,hr=2001;var si=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}},ze=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Cl=Math.PI/180,Fa=180/Math.PI;function jn(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ze[s&255]+ze[s>>8&255]+ze[s>>16&255]+ze[s>>24&255]+"-"+ze[t&255]+ze[t>>8&255]+"-"+ze[t>>16&15|64]+ze[t>>24&255]+"-"+ze[e&63|128]+ze[e>>8&255]+"-"+ze[e>>16&255]+ze[e>>24&255]+ze[n&255]+ze[n>>8&255]+ze[n>>16&255]+ze[n>>24&255]).toLowerCase()}function Zt(s,t,e){return Math.max(t,Math.min(e,s))}function pf(s,t){return(s%t+t)%t}function Il(s,t,e){return(1-e)*s+e*t}function Dn(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function he(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var nt=class s{constructor(t=0,e=0){s.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},qe=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=r[a+0],f=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==g){let m=1-o,p=l*d+c*f+h*g+u*_,b=p>=0?1:-1,T=1-p*p;if(T>Number.EPSILON){let A=Math.sqrt(T),w=Math.atan2(A,p*b);m=Math.sin(m*w)/A,o=Math.sin(o*w)/A}let y=o*b;if(l=l*m+d*y,c=c*m+f*y,h=h*m+g*y,u=u*m+_*y,m===1-o){let A=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=A,c*=A,h*=A,u*=A}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,a){let o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-o*f,t[e+2]=c*g+h*f+o*d-l*u,t[e+3]=h*g-o*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),d=l(n/2),f=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>u){let f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>u){let f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Zt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,i=this._y,r=this._z,a=this._w,o=a*t._w+n*t._x+i*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R=class s{constructor(t=0,e=0,n=0){s.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Rh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Rh.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*i-o*n),h=2*(o*e-r*i),u=2*(r*n-a*e);return this.x=e+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=i+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Pl.copy(this).projectOnVector(t),this.sub(Pl)}reflect(t){return this.sub(Pl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Pl=new R,Rh=new qe,Ht=class s{constructor(t,e,n,i,r,a,o,l,c){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c)}set(t,e,n,i,r,a,o,l,c){let h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=i[0],m=i[3],p=i[6],b=i[1],T=i[4],y=i[7],A=i[2],w=i[5],P=i[8];return r[0]=a*_+o*b+l*A,r[3]=a*m+o*T+l*w,r[6]=a*p+o*y+l*P,r[1]=c*_+h*b+u*A,r[4]=c*m+h*T+u*w,r[7]=c*p+h*y+u*P,r[2]=d*_+f*b+g*A,r[5]=d*m+f*T+g*w,r[8]=d*p+f*y+g*P,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,g=e*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=u*_,t[1]=(i*c-h*n)*_,t[2]=(o*n-i*a)*_,t[3]=d*_,t[4]=(h*e-i*l)*_,t[5]=(i*r-o*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-i*c,i*l,-i*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Dl.makeScale(t,e)),this}rotate(t){return this.premultiply(Dl.makeRotation(-t)),this}translate(t,e){return this.premultiply(Dl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Dl=new Ht;function Lc(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function ur(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Hu(){let s=ur("canvas");return s.style.display="block",s}var Ch={};function Ss(s){s in Ch||(Ch[s]=!0,console.warn(s))}function Gu(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Ih=new Ht().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ph=new Ht().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function mf(){let s={enabled:!0,workingColorSpace:Ui,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===le&&(i.r=ti(i.r),i.g=ti(i.g),i.b=ti(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===le&&(i.r=vs(i.r),i.g=vs(i.g),i.b=vs(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Rn?cr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Ss("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Ss("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Ui]:{primaries:t,whitePoint:n,transfer:cr,toXYZ:Ih,fromXYZ:Ph,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Fe},outputColorSpaceConfig:{drawingBufferColorSpace:Fe}},[Fe]:{primaries:t,whitePoint:n,transfer:le,toXYZ:Ih,fromXYZ:Ph,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Fe}}}),s}var ee=mf();function ti(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function vs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var ss,Ua=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement=="undefined")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{ss===void 0&&(ss=ur("canvas")),ss.width=t.width,ss.height=t.height;let i=ss.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=ss}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement!="undefined"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&t instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&t instanceof ImageBitmap){let e=ur("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=ti(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ti(e[n]/255)*255):e[n]=ti(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},gf=0,bs=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gf++}),this.uuid=jn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement!="undefined"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Ll(i[a].image)):r.push(Ll(i[a]))}else r=Ll(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function Ll(s){return typeof HTMLImageElement!="undefined"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&s instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&s instanceof ImageBitmap?Ua.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var _f=0,Fl=new R,$e=class s extends si{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=mi,i=mi,r=nn,a=Bn,o=_n,l=An,c=s.DEFAULT_ANISOTROPY,h=Rn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_f++}),this.uuid=jn(),this.name="",this.source=new bs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new nt(0,0),this.repeat=new nt(1,1),this.center=new nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ht,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Fl).x}get height(){return this.source.getSize(Fl).y}get depth(){return this.source.getSize(Fl).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Mc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ii:t.x=t.x-Math.floor(t.x);break;case mi:t.x=t.x<0?0:1;break;case Pa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ii:t.y=t.y-Math.floor(t.y);break;case mi:t.y=t.y<0?0:1;break;case Pa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};$e.DEFAULT_IMAGE=null;$e.DEFAULT_MAPPING=Mc;$e.DEFAULT_ANISOTROPY=1;var oe=class s{constructor(t=0,e=0,n=0,i=1){s.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let T=(c+1)/2,y=(f+1)/2,A=(p+1)/2,w=(h+d)/4,P=(u+_)/4,D=(g+m)/4;return T>y&&T>A?T<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(T),i=w/n,r=P/n):y>A?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=w/i,r=D/i):A<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(A),n=P/r,i=D/r),this.set(n,i,r,e),this}let b=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-_)/b,this.z=(d-h)/b,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Zt(this.x,t.x,e.x),this.y=Zt(this.y,t.y,e.y),this.z=Zt(this.z,t.z,e.z),this.w=Zt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Zt(this.x,t,e),this.y=Zt(this.y,t,e),this.z=Zt(this.z,t,e),this.w=Zt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Na=class extends si{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:nn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new oe(0,0,t,e),this.scissorTest=!1,this.viewport=new oe(0,0,t,e);let i={width:t,height:e,depth:n.depth},r=new $e(i);this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:nn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new bs(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fn=class extends Na{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},dr=class extends $e{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=mn,this.minFilter=mn,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Oa=class extends $e{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=mn,this.minFilter=mn,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var _i=class{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(bn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(bn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=bn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,bn):bn.fromBufferAttribute(r,a),bn.applyMatrix4(t.matrixWorld),this.expandByPoint(bn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),na.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),na.copy(n.boundingBox)),na.applyMatrix4(t.matrixWorld),this.union(na)}let i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,bn),bn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ks),ia.subVectors(this.max,Ks),rs.subVectors(t.a,Ks),as.subVectors(t.b,Ks),os.subVectors(t.c,Ks),ci.subVectors(as,rs),hi.subVectors(os,as),Ci.subVectors(rs,os);let e=[0,-ci.z,ci.y,0,-hi.z,hi.y,0,-Ci.z,Ci.y,ci.z,0,-ci.x,hi.z,0,-hi.x,Ci.z,0,-Ci.x,-ci.y,ci.x,0,-hi.y,hi.x,0,-Ci.y,Ci.x,0];return!Ul(e,rs,as,os,ia)||(e=[1,0,0,0,1,0,0,0,1],!Ul(e,rs,as,os,ia))?!1:(sa.crossVectors(ci,hi),e=[sa.x,sa.y,sa.z],Ul(e,rs,as,os,ia))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,bn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(bn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Yn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Yn=[new R,new R,new R,new R,new R,new R,new R,new R],bn=new R,na=new _i,rs=new R,as=new R,os=new R,ci=new R,hi=new R,Ci=new R,Ks=new R,ia=new R,sa=new R,Ii=new R;function Ul(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Ii.fromArray(s,r);let o=i.x*Math.abs(Ii.x)+i.y*Math.abs(Ii.y)+i.z*Math.abs(Ii.z),l=t.dot(Ii),c=e.dot(Ii),h=n.dot(Ii);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var xf=new _i,Qs=new R,Nl=new R,Ni=class{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):xf.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Qs.subVectors(t,this.center);let e=Qs.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Qs,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Nl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Qs.copy(t.center).add(Nl)),this.expandByPoint(Qs.copy(t.center).sub(Nl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Zn=new R,Ol=new R,ra=new R,ui=new R,Bl=new R,aa=new R,zl=new R,fr=class{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Zn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Zn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Zn.copy(this.origin).addScaledVector(this.direction,e),Zn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Ol.copy(t).add(e).multiplyScalar(.5),ra.copy(e).sub(t).normalize(),ui.copy(this.origin).sub(Ol);let r=t.distanceTo(e)*.5,a=-this.direction.dot(ra),o=ui.dot(this.direction),l=-ui.dot(ra),c=ui.lengthSq(),h=Math.abs(1-a*a),u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Ol).addScaledVector(ra,d),f}intersectSphere(t,e){Zn.subVectors(t.center,this.origin);let n=Zn.dot(this.direction),i=Zn.dot(Zn)-n*n,r=t.radius*t.radius;if(i>r)return null;let a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,Zn)!==null}intersectTriangle(t,e,n,i,r){Bl.subVectors(e,t),aa.subVectors(n,t),zl.crossVectors(Bl,aa);let a=this.direction.dot(zl),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ui.subVectors(this.origin,t);let l=o*this.direction.dot(aa.crossVectors(ui,aa));if(l<0)return null;let c=o*this.direction.dot(Bl.cross(ui));if(c<0||l+c>a)return null;let h=-o*ui.dot(zl);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},jt=class s{constructor(t,e,n,i,r,a,o,l,c,h,u,d,f,g,_,m){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c,h,u,d,f,g,_,m)}set(t,e,n,i,r,a,o,l,c,h,u,d,f,g,_,m){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,i=1/ls.setFromMatrixColumn(t,0).length(),r=1/ls.setFromMatrixColumn(t,1).length(),a=1/ls.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=a*h,f=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-o*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=a*l}else if(t.order==="YXZ"){let d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d+_*o,e[4]=g*o-f,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=_+d*o,e[10]=a*l}else if(t.order==="ZXY"){let d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d-_*o,e[4]=-a*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=_-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let d=a*h,f=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let d=a*l,f=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){let d=a*l,f=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(yf,t,vf)}lookAt(t,e,n){let i=this.elements;return tn.subVectors(t,e),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),di.crossVectors(n,tn),di.lengthSq()===0&&(Math.abs(n.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),di.crossVectors(n,tn)),di.normalize(),oa.crossVectors(tn,di),i[0]=di.x,i[4]=oa.x,i[8]=tn.x,i[1]=di.y,i[5]=oa.y,i[9]=tn.y,i[2]=di.z,i[6]=oa.z,i[10]=tn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],b=n[3],T=n[7],y=n[11],A=n[15],w=i[0],P=i[4],D=i[8],S=i[12],v=i[1],I=i[5],F=i[9],B=i[13],V=i[2],G=i[6],W=i[10],Q=i[14],z=i[3],ot=i[7],ht=i[11],xt=i[15];return r[0]=a*w+o*v+l*V+c*z,r[4]=a*P+o*I+l*G+c*ot,r[8]=a*D+o*F+l*W+c*ht,r[12]=a*S+o*B+l*Q+c*xt,r[1]=h*w+u*v+d*V+f*z,r[5]=h*P+u*I+d*G+f*ot,r[9]=h*D+u*F+d*W+f*ht,r[13]=h*S+u*B+d*Q+f*xt,r[2]=g*w+_*v+m*V+p*z,r[6]=g*P+_*I+m*G+p*ot,r[10]=g*D+_*F+m*W+p*ht,r[14]=g*S+_*B+m*Q+p*xt,r[3]=b*w+T*v+y*V+A*z,r[7]=b*P+T*I+y*G+A*ot,r[11]=b*D+T*F+y*W+A*ht,r[15]=b*S+T*B+y*Q+A*xt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*l*u-i*c*u-r*o*d+n*c*d+i*o*f-n*l*f)+_*(+e*l*f-e*c*d+r*a*d-i*a*f+i*c*h-r*l*h)+m*(+e*c*u-e*o*f-r*a*u+n*a*f+r*o*h-n*c*h)+p*(-i*o*h-e*l*u+e*o*d+i*a*u-n*a*d+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],b=u*m*c-_*d*c+_*l*f-o*m*f-u*l*p+o*d*p,T=g*d*c-h*m*c-g*l*f+a*m*f+h*l*p-a*d*p,y=h*_*c-g*u*c+g*o*f-a*_*f-h*o*p+a*u*p,A=g*u*l-h*_*l-g*o*d+a*_*d+h*o*m-a*u*m,w=e*b+n*T+i*y+r*A;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let P=1/w;return t[0]=b*P,t[1]=(_*d*r-u*m*r-_*i*f+n*m*f+u*i*p-n*d*p)*P,t[2]=(o*m*r-_*l*r+_*i*c-n*m*c-o*i*p+n*l*p)*P,t[3]=(u*l*r-o*d*r-u*i*c+n*d*c+o*i*f-n*l*f)*P,t[4]=T*P,t[5]=(h*m*r-g*d*r+g*i*f-e*m*f-h*i*p+e*d*p)*P,t[6]=(g*l*r-a*m*r-g*i*c+e*m*c+a*i*p-e*l*p)*P,t[7]=(a*d*r-h*l*r+h*i*c-e*d*c-a*i*f+e*l*f)*P,t[8]=y*P,t[9]=(g*u*r-h*_*r-g*n*f+e*_*f+h*n*p-e*u*p)*P,t[10]=(a*_*r-g*o*r+g*n*c-e*_*c-a*n*p+e*o*p)*P,t[11]=(h*o*r-a*u*r-h*n*c+e*u*c+a*n*f-e*o*f)*P,t[12]=A*P,t[13]=(h*_*i-g*u*i+g*n*d-e*_*d-h*n*m+e*u*m)*P,t[14]=(g*o*i-a*_*i-g*n*l+e*_*l+a*n*m-e*o*m)*P,t[15]=(a*u*i-h*o*i+h*n*l-e*u*l-a*n*d+e*o*d)*P,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,g=r*u,_=a*h,m=a*u,p=o*u,b=l*c,T=l*h,y=l*u,A=n.x,w=n.y,P=n.z;return i[0]=(1-(_+p))*A,i[1]=(f+y)*A,i[2]=(g-T)*A,i[3]=0,i[4]=(f-y)*w,i[5]=(1-(d+p))*w,i[6]=(m+b)*w,i[7]=0,i[8]=(g+T)*P,i[9]=(m-b)*P,i[10]=(1-(d+_))*P,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements,r=ls.set(i[0],i[1],i[2]).length(),a=ls.set(i[4],i[5],i[6]).length(),o=ls.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],Tn.copy(this);let c=1/r,h=1/a,u=1/o;return Tn.elements[0]*=c,Tn.elements[1]*=c,Tn.elements[2]*=c,Tn.elements[4]*=h,Tn.elements[5]*=h,Tn.elements[6]*=h,Tn.elements[8]*=u,Tn.elements[9]*=u,Tn.elements[10]*=u,e.setFromRotationMatrix(Tn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,i,r,a,o=wn,l=!1){let c=this.elements,h=2*r/(e-t),u=2*r/(n-i),d=(e+t)/(e-t),f=(n+i)/(n-i),g,_;if(l)g=r/(a-r),_=a*r/(a-r);else if(o===wn)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===hr)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=wn,l=!1){let c=this.elements,h=2/(e-t),u=2/(n-i),d=-(e+t)/(e-t),f=-(n+i)/(n-i),g,_;if(l)g=1/(a-r),_=a/(a-r);else if(o===wn)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===hr)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},ls=new R,Tn=new jt,yf=new R(0,0,0),vf=new R(1,1,1),di=new R,oa=new R,tn=new R,Dh=new jt,Lh=new qe,sn=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Zt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Dh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Dh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Lh.setFromEuler(this),this.setFromQuaternion(Lh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};sn.DEFAULT_ORDER="XYZ";var pr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Mf=0,Fh=new R,cs=new qe,Jn=new jt,la=new R,js=new R,Sf=new R,bf=new qe,Uh=new R(1,0,0),Nh=new R(0,1,0),Oh=new R(0,0,1),Bh={type:"added"},Tf={type:"removed"},hs={type:"childadded",child:null},kl={type:"childremoved",child:null},Ee=class s extends si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Mf++}),this.uuid=jn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new R,e=new sn,n=new qe,i=new R(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new jt},normalMatrix:{value:new Ht}}),this.matrix=new jt,this.matrixWorld=new jt,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new pr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return cs.setFromAxisAngle(t,e),this.quaternion.multiply(cs),this}rotateOnWorldAxis(t,e){return cs.setFromAxisAngle(t,e),this.quaternion.premultiply(cs),this}rotateX(t){return this.rotateOnAxis(Uh,t)}rotateY(t){return this.rotateOnAxis(Nh,t)}rotateZ(t){return this.rotateOnAxis(Oh,t)}translateOnAxis(t,e){return Fh.copy(t).applyQuaternion(this.quaternion),this.position.add(Fh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Uh,t)}translateY(t){return this.translateOnAxis(Nh,t)}translateZ(t){return this.translateOnAxis(Oh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Jn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?la.copy(t):la.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),js.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Jn.lookAt(js,la,this.up):Jn.lookAt(la,js,this.up),this.quaternion.setFromRotationMatrix(Jn),i&&(Jn.extractRotation(i.matrixWorld),cs.setFromRotationMatrix(Jn),this.quaternion.premultiply(cs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Bh),hs.child=t,this.dispatchEvent(hs),hs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Tf),kl.child=t,this.dispatchEvent(kl),kl.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Jn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Jn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Jn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Bh),hs.child=t,this.dispatchEvent(hs),hs.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(js,t,Sf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(js,bf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];i.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}};Ee.DEFAULT_UP=new R(0,1,0);Ee.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ee.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var En=new R,$n=new R,Hl=new R,Kn=new R,us=new R,ds=new R,zh=new R,Gl=new R,Vl=new R,Wl=new R,Xl=new oe,ql=new oe,Yl=new oe,Qn=class s{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),En.subVectors(t,e),i.cross(En);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){En.subVectors(i,e),$n.subVectors(n,e),Hl.subVectors(t,e);let a=En.dot(En),o=En.dot($n),l=En.dot(Hl),c=$n.dot($n),h=$n.dot(Hl),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Kn)===null?!1:Kn.x>=0&&Kn.y>=0&&Kn.x+Kn.y<=1}static getInterpolation(t,e,n,i,r,a,o,l){return this.getBarycoord(t,e,n,i,Kn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Kn.x),l.addScaledVector(a,Kn.y),l.addScaledVector(o,Kn.z),l)}static getInterpolatedAttribute(t,e,n,i,r,a){return Xl.setScalar(0),ql.setScalar(0),Yl.setScalar(0),Xl.fromBufferAttribute(t,e),ql.fromBufferAttribute(t,n),Yl.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(Xl,r.x),a.addScaledVector(ql,r.y),a.addScaledVector(Yl,r.z),a}static isFrontFacing(t,e,n,i){return En.subVectors(n,e),$n.subVectors(t,e),En.cross($n).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return En.subVectors(this.c,this.b),$n.subVectors(this.a,this.b),En.cross($n).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,a,o;us.subVectors(i,n),ds.subVectors(r,n),Gl.subVectors(t,n);let l=us.dot(Gl),c=ds.dot(Gl);if(l<=0&&c<=0)return e.copy(n);Vl.subVectors(t,i);let h=us.dot(Vl),u=ds.dot(Vl);if(h>=0&&u<=h)return e.copy(i);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(us,a);Wl.subVectors(t,r);let f=us.dot(Wl),g=ds.dot(Wl);if(g>=0&&f<=g)return e.copy(r);let _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(ds,o);let m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return zh.subVectors(r,i),o=(u-h)/(u-h+(f-g)),e.copy(i).addScaledVector(zh,o);let p=1/(m+_+d);return a=_*p,o=d*p,e.copy(n).addScaledVector(us,a).addScaledVector(ds,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Vu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fi={h:0,s:0,l:0},ca={h:0,s:0,l:0};function Zl(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var Lt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Fe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ee.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=ee.workingColorSpace){return this.r=t,this.g=e,this.b=n,ee.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=ee.workingColorSpace){if(t=pf(t,1),e=Zt(e,0,1),n=Zt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Zl(a,r,t+1/3),this.g=Zl(a,r,t),this.b=Zl(a,r,t-1/3)}return ee.colorSpaceToWorking(this,i),this}setStyle(t,e=Fe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Fe){let n=Vu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ti(t.r),this.g=ti(t.g),this.b=ti(t.b),this}copyLinearToSRGB(t){return this.r=vs(t.r),this.g=vs(t.g),this.b=vs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Fe){return ee.workingToColorSpace(ke.copy(this),t),Math.round(Zt(ke.r*255,0,255))*65536+Math.round(Zt(ke.g*255,0,255))*256+Math.round(Zt(ke.b*255,0,255))}getHexString(t=Fe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ee.workingColorSpace){ee.workingToColorSpace(ke.copy(this),e);let n=ke.r,i=ke.g,r=ke.b,a=Math.max(n,i,r),o=Math.min(n,i,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ee.workingColorSpace){return ee.workingToColorSpace(ke.copy(this),e),t.r=ke.r,t.g=ke.g,t.b=ke.b,t}getStyle(t=Fe){ee.workingToColorSpace(ke.copy(this),t);let e=ke.r,n=ke.g,i=ke.b;return t!==Fe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(fi),this.setHSL(fi.h+t,fi.s+e,fi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(fi),t.getHSL(ca);let n=Il(fi.h,ca.h,e),i=Il(fi.s,ca.s,e),r=Il(fi.l,ca.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ke=new Lt;Lt.NAMES=Vu;var Ef=0,Un=class extends si{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=jn(),this.name="",this.type="Material",this.blending=ni,this.side=ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ca,this.blendDst=Ia,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Lt(0,0,0),this.blendAlpha=0,this.depthFunc=Fi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=oc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Li,this.stencilZFail=Li,this.stencilZPass=Li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ni&&(n.blending=this.blending),this.side!==ei&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ca&&(n.blendSrc=this.blendSrc),this.blendDst!==Ia&&(n.blendDst=this.blendDst),this.blendEquation!==gi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Fi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==oc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Li&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Li&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Li&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Oe=class extends Un{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Lt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new sn,this.combine=vc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Re=new R,ha=new nt,wf=0,Ne=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:wf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=La,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ha.fromBufferAttribute(this,e),ha.applyMatrix3(t),this.setXY(e,ha.x,ha.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix3(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyMatrix4(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.applyNormalMatrix(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Re.fromBufferAttribute(this,e),Re.transformDirection(t),this.setXYZ(e,Re.x,Re.y,Re.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Dn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=he(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Dn(e,this.array)),e}setX(t,e){return this.normalized&&(e=he(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Dn(e,this.array)),e}setY(t,e){return this.normalized&&(e=he(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Dn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=he(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Dn(e,this.array)),e}setW(t,e){return this.normalized&&(e=he(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=he(e,this.array),n=he(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=he(e,this.array),n=he(n,this.array),i=he(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=he(e,this.array),n=he(n,this.array),i=he(i,this.array),r=he(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==La&&(t.usage=this.usage),t}};var mr=class extends Ne{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var gr=class extends Ne{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Wt=class extends Ne{constructor(t,e,n){super(new Float32Array(t),e,n)}},Af=0,pn=new jt,Jl=new Ee,fs=new R,en=new _i,tr=new _i,De=new R,_e=class s extends si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Af++}),this.uuid=jn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Lc(t)?gr:mr)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ht().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return pn.makeRotationFromQuaternion(t),this.applyMatrix4(pn),this}rotateX(t){return pn.makeRotationX(t),this.applyMatrix4(pn),this}rotateY(t){return pn.makeRotationY(t),this.applyMatrix4(pn),this}rotateZ(t){return pn.makeRotationZ(t),this.applyMatrix4(pn),this}translate(t,e,n){return pn.makeTranslation(t,e,n),this.applyMatrix4(pn),this}scale(t,e,n){return pn.makeScale(t,e,n),this.applyMatrix4(pn),this}lookAt(t){return Jl.lookAt(t),Jl.updateMatrix(),this.applyMatrix4(Jl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fs).negate(),this.translate(fs.x,fs.y,fs.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,r=t.length;i<r;i++){let a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Wt(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _i);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];en.setFromBufferAttribute(r),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,en.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,en.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(en.min),this.boundingBox.expandByPoint(en.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ni);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){let n=this.boundingSphere.center;if(en.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];tr.setFromBufferAttribute(o),this.morphTargetsRelative?(De.addVectors(en.min,tr.min),en.expandByPoint(De),De.addVectors(en.max,tr.max),en.expandByPoint(De)):(en.expandByPoint(tr.min),en.expandByPoint(tr.max))}en.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)De.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(De));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)De.fromBufferAttribute(o,c),l&&(fs.fromBufferAttribute(t,c),De.add(fs)),i=Math.max(i,n.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ne(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let D=0;D<n.count;D++)o[D]=new R,l[D]=new R;let c=new R,h=new R,u=new R,d=new nt,f=new nt,g=new nt,_=new R,m=new R;function p(D,S,v){c.fromBufferAttribute(n,D),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,v),d.fromBufferAttribute(r,D),f.fromBufferAttribute(r,S),g.fromBufferAttribute(r,v),h.sub(c),u.sub(c),f.sub(d),g.sub(d);let I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(I),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(I),o[D].add(_),o[S].add(_),o[v].add(_),l[D].add(m),l[S].add(m),l[v].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let D=0,S=b.length;D<S;++D){let v=b[D],I=v.start,F=v.count;for(let B=I,V=I+F;B<V;B+=3)p(t.getX(B+0),t.getX(B+1),t.getX(B+2))}let T=new R,y=new R,A=new R,w=new R;function P(D){A.fromBufferAttribute(i,D),w.copy(A);let S=o[D];T.copy(S),T.sub(A.multiplyScalar(A.dot(S))).normalize(),y.crossVectors(w,S);let I=y.dot(l[D])<0?-1:1;a.setXYZW(D,T.x,T.y,T.z,I)}for(let D=0,S=b.length;D<S;++D){let v=b[D],I=v.start,F=v.count;for(let B=I,V=I+F;B<V;B+=3)P(t.getX(B+0)),P(t.getX(B+1)),P(t.getX(B+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ne(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new R,r=new R,a=new R,o=new R,l=new R,c=new R,h=new R,u=new R;if(t)for(let d=0,f=t.count;d<f;d+=3){let g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),f=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new Ne(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let o in i){let l=i[o],c=t(l,n);e.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},kh=new jt,Pi=new fr,ua=new Ni,Hh=new R,da=new R,fa=new R,pa=new R,$l=new R,ma=new R,Gh=new R,ga=new R,Pt=class extends Ee{constructor(t=new _e,e=new Oe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let o=this.morphTargetInfluences;if(r&&o){ma.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&($l.fromBufferAttribute(u,t),a?ma.addScaledVector($l,h):ma.addScaledVector($l.sub(e),h))}e.add(ma)}return e}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ua.copy(n.boundingSphere),ua.applyMatrix4(r),Pi.copy(t.ray).recast(t.near),!(ua.containsPoint(Pi.origin)===!1&&(Pi.intersectSphere(ua,Hh)===null||Pi.origin.distanceToSquared(Hh)>(t.far-t.near)**2))&&(kh.copy(r).invert(),Pi.copy(t.ray).applyMatrix4(kh),!(n.boundingBox!==null&&Pi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Pi)))}_computeIntersections(t,e,n){let i,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=a[m.materialIndex],b=Math.max(m.start,f.start),T=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let y=b,A=T;y<A;y+=3){let w=o.getX(y),P=o.getX(y+1),D=o.getX(y+2);i=_a(this,p,t,n,c,h,u,w,P,D),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let b=o.getX(m),T=o.getX(m+1),y=o.getX(m+2);i=_a(this,a,t,n,c,h,u,b,T,y),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=a[m.materialIndex],b=Math.max(m.start,f.start),T=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let y=b,A=T;y<A;y+=3){let w=y,P=y+1,D=y+2;i=_a(this,p,t,n,c,h,u,w,P,D),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let b=m,T=m+1,y=m+2;i=_a(this,a,t,n,c,h,u,b,T,y),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}};function Rf(s,t,e,n,i,r,a,o){let l;if(t.side===Be?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,t.side===ei,o),l===null)return null;ga.copy(o),ga.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(ga);return c<e.near||c>e.far?null:{distance:c,point:ga.clone(),object:s}}function _a(s,t,e,n,i,r,a,o,l,c){s.getVertexPosition(o,da),s.getVertexPosition(l,fa),s.getVertexPosition(c,pa);let h=Rf(s,t,e,n,da,fa,pa,Gh);if(h){let u=new R;Qn.getBarycoord(Gh,da,fa,pa,u),i&&(h.uv=Qn.getInterpolatedAttribute(i,o,l,c,u,new nt)),r&&(h.uv1=Qn.getInterpolatedAttribute(r,o,l,c,u,new nt)),a&&(h.normal=Qn.getInterpolatedAttribute(a,o,l,c,u,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new R,materialIndex:0};Qn.getNormal(da,fa,pa,d.normal),h.face=d,h.barycoord=u}return h}var Ye=class s extends _e{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};let o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,f=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Wt(c,3)),this.setAttribute("normal",new Wt(h,3)),this.setAttribute("uv",new Wt(u,2));function g(_,m,p,b,T,y,A,w,P,D,S){let v=y/P,I=A/D,F=y/2,B=A/2,V=w/2,G=P+1,W=D+1,Q=0,z=0,ot=new R;for(let ht=0;ht<W;ht++){let xt=ht*I-B;for(let zt=0;zt<G;zt++){let Jt=zt*v-F;ot[_]=Jt*b,ot[m]=xt*T,ot[p]=V,c.push(ot.x,ot.y,ot.z),ot[_]=0,ot[m]=0,ot[p]=w>0?1:-1,h.push(ot.x,ot.y,ot.z),u.push(zt/P),u.push(1-ht/D),Q+=1}}for(let ht=0;ht<D;ht++)for(let xt=0;xt<P;xt++){let zt=d+xt+G*ht,Jt=d+xt+G*(ht+1),ae=d+(xt+1)+G*(ht+1),te=d+(xt+1)+G*ht;l.push(zt,Jt,te),l.push(Jt,ae,te),z+=6}o.addGroup(f,z,S),f+=z,d+=Q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Xi(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ge(s){let t={};for(let e=0;e<s.length;e++){let n=Xi(s[e]);for(let i in n)t[i]=n[i]}return t}function Cf(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Fc(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ee.workingColorSpace}var Wu={clone:Xi,merge:Ge},If=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Pf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,rn=class extends Un{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=If,this.fragmentShader=Pf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Xi(t.uniforms),this.uniformsGroups=Cf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},_r=class extends Ee{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new jt,this.projectionMatrix=new jt,this.projectionMatrixInverse=new jt,this.coordinateSystem=wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},pi=new R,Vh=new nt,Wh=new nt,Ue=class extends _r{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Fa*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Cl*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Fa*2*Math.atan(Math.tan(Cl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){pi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(pi.x,pi.y).multiplyScalar(-t/pi.z),pi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(pi.x,pi.y).multiplyScalar(-t/pi.z)}getViewSize(t,e){return this.getViewBounds(t,Vh,Wh),e.subVectors(Wh,Vh)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Cl*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},ps=-90,ms=1,Ba=class extends Ee{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Ue(ps,ms,t,e);i.layers=this.layers,this.add(i);let r=new Ue(ps,ms,t,e);r.layers=this.layers,this.add(r);let a=new Ue(ps,ms,t,e);a.layers=this.layers,this.add(a);let o=new Ue(ps,ms,t,e);o.layers=this.layers,this.add(o);let l=new Ue(ps,ms,t,e);l.layers=this.layers,this.add(l);let c=new Ue(ps,ms,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,l]=e;for(let c of e)this.remove(c);if(t===wn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===hr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,o),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},xr=class extends $e{constructor(t=[],e=Vi,n,i,r,a,o,l,c,h){super(t,e,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},za=class extends Fn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new xr(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Ye(5,5,5),r=new rn({name:"CubemapFromEquirect",uniforms:Xi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Be,blending:ri});r.uniforms.tEquirect.value=e;let a=new Pt(i,r),o=e.minFilter;return e.minFilter===Bn&&(e.minFilter=nn),new Ba(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}},Se=class extends Ee{constructor(){super(),this.isGroup=!0,this.type="Group"}},Df={type:"move"},Ts=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Se,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Se,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Se,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Df)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Se;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},yr=class s{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Lt(t),this.density=e}clone(){return new s(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var Oi=class extends Ee{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new sn,this.environmentIntensity=1,this.environmentRotation=new sn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},ka=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=La,this.updateRanges=[],this.version=0,this.uuid=jn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Xe=new R,vr=class s{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Xe.fromBufferAttribute(this,e),Xe.applyMatrix4(t),this.setXYZ(e,Xe.x,Xe.y,Xe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Xe.fromBufferAttribute(this,e),Xe.applyNormalMatrix(t),this.setXYZ(e,Xe.x,Xe.y,Xe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Xe.fromBufferAttribute(this,e),Xe.transformDirection(t),this.setXYZ(e,Xe.x,Xe.y,Xe.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Dn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=he(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=he(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=he(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=he(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=he(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Dn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Dn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Dn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Dn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=he(e,this.array),n=he(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=he(e,this.array),n=he(n,this.array),i=he(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=he(e,this.array),n=he(n,this.array),i=he(i,this.array),r=he(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Ne(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new s(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Bi=class extends Un{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Lt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},gs,er=new R,_s=new R,xs=new R,ys=new nt,nr=new nt,Xu=new jt,xa=new R,ir=new R,ya=new R,Xh=new nt,Kl=new nt,qh=new nt,Es=class extends Ee{constructor(t=new Bi){if(super(),this.isSprite=!0,this.type="Sprite",gs===void 0){gs=new _e;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ka(e,5);gs.setIndex([0,1,2,0,2,3]),gs.setAttribute("position",new vr(n,3,0,!1)),gs.setAttribute("uv",new vr(n,2,3,!1))}this.geometry=gs,this.material=t,this.center=new nt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),_s.setFromMatrixScale(this.matrixWorld),Xu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),xs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&_s.multiplyScalar(-xs.z);let n=this.material.rotation,i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));let a=this.center;va(xa.set(-.5,-.5,0),xs,a,_s,i,r),va(ir.set(.5,-.5,0),xs,a,_s,i,r),va(ya.set(.5,.5,0),xs,a,_s,i,r),Xh.set(0,0),Kl.set(1,0),qh.set(1,1);let o=t.ray.intersectTriangle(xa,ir,ya,!1,er);if(o===null&&(va(ir.set(-.5,.5,0),xs,a,_s,i,r),Kl.set(0,1),o=t.ray.intersectTriangle(xa,ya,ir,!1,er),o===null))return;let l=t.ray.origin.distanceTo(er);l<t.near||l>t.far||e.push({distance:l,point:er.clone(),uv:Qn.getInterpolation(er,xa,ir,ya,Xh,Kl,qh,new nt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function va(s,t,e,n,i,r){ys.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(nr.x=r*ys.x-i*ys.y,nr.y=i*ys.x+r*ys.y):nr.copy(ys),s.copy(t),s.x+=nr.x,s.y+=nr.y,s.applyMatrix4(Xu)}var Ql=new R,Lf=new R,Ff=new Ht,Pn=class{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=Ql.subVectors(n,e).cross(Lf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Ql),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Ff.getNormalMatrix(t),i=this.coplanarPoint(Ql).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Di=new Ni,Uf=new nt(.5,.5),Ma=new R,ws=class{constructor(t=new Pn,e=new Pn,n=new Pn,i=new Pn,r=new Pn,a=new Pn){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=wn,n=!1){let i=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],b=r[12],T=r[13],y=r[14],A=r[15];if(i[0].setComponents(c-a,f-h,p-g,A-b).normalize(),i[1].setComponents(c+a,f+h,p+g,A+b).normalize(),i[2].setComponents(c+o,f+u,p+_,A+T).normalize(),i[3].setComponents(c-o,f-u,p-_,A-T).normalize(),n)i[4].setComponents(l,d,m,y).normalize(),i[5].setComponents(c-l,f-d,p-m,A-y).normalize();else if(i[4].setComponents(c-l,f-d,p-m,A-y).normalize(),e===wn)i[5].setComponents(c+l,f+d,p+m,A+y).normalize();else if(e===hr)i[5].setComponents(l,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Di.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Di.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Di)}intersectsSprite(t){Di.center.set(0,0,0);let e=Uf.distanceTo(t.center);return Di.radius=.7071067811865476+e,Di.applyMatrix4(t.matrixWorld),this.intersectsSphere(Di)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(Ma.x=i.normal.x>0?t.max.x:t.min.x,Ma.y=i.normal.y>0?t.max.y:t.min.y,Ma.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Ma)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var As=class extends Un{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Lt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Yh=new jt,lc=new fr,Sa=new Ni,ba=new R,Mr=class extends Ee{constructor(t=new _e,e=new As){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Sa.copy(n.boundingSphere),Sa.applyMatrix4(i),Sa.radius+=r,t.ray.intersectsSphere(Sa)===!1)return;Yh.copy(i).invert(),lc.copy(t.ray).applyMatrix4(Yh);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=d,_=f;g<_;g++){let m=c.getX(g);ba.fromBufferAttribute(u,m),Zh(ba,m,l,i,t,e,this)}}else{let d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,_=f;g<_;g++)ba.fromBufferAttribute(u,g),Zh(ba,g,l,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Zh(s,t,e,n,i,r,a){let o=lc.distanceSqToPoint(s);if(o<e){let l=new R;lc.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var Sr=class extends $e{constructor(t,e,n,i,r,a,o,l,c){super(t,e,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},br=class extends $e{constructor(t,e,n=bi,i,r,a,o=mn,l=mn,c,h=Ms,u=1){if(h!==Ms&&h!==Us)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:u};super(d,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new bs(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Tr=class extends $e{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Rs=class s extends _e{constructor(t=1,e=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:i,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));let a=[],o=[],l=[],c=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,g=n*2+r,_=i+1,m=new R,p=new R;for(let b=0;b<=g;b++){let T=0,y=0,A=0,w=0;if(b<=n){let S=b/n,v=S*Math.PI/2;y=-h-t*Math.cos(v),A=t*Math.sin(v),w=-t*Math.cos(v),T=S*u}else if(b<=n+r){let S=(b-n)/r;y=-h+S*e,A=t,w=0,T=u+S*d}else{let S=(b-n-r)/n,v=S*Math.PI/2;y=h+t*Math.sin(v),A=t*Math.cos(v),w=t*Math.sin(v),T=u+d+S*u}let P=Math.max(0,Math.min(1,T/f)),D=0;b===0?D=.5/i:b===g&&(D=-.5/i);for(let S=0;S<=i;S++){let v=S/i,I=v*Math.PI*2,F=Math.sin(I),B=Math.cos(I);p.x=-A*B,p.y=y,p.z=A*F,o.push(p.x,p.y,p.z),m.set(-A*B,w,A*F),m.normalize(),l.push(m.x,m.y,m.z),c.push(v+D,P)}if(b>0){let S=(b-1)*_;for(let v=0;v<i;v++){let I=S+v,F=S+v+1,B=b*_+v,V=b*_+v+1;a.push(I,F,B),a.push(F,V,B)}}}this.setIndex(a),this.setAttribute("position",new Wt(o,3)),this.setAttribute("normal",new Wt(l,3)),this.setAttribute("uv",new Wt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Er=class s extends _e{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);let r=[],a=[],o=[],l=[],c=new R,h=new nt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let f=n+u/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Wt(a,3)),this.setAttribute("normal",new Wt(o,3)),this.setAttribute("uv",new Wt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Ze=class s extends _e{constructor(t=1,e=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],d=[],f=[],g=0,_=[],m=n/2,p=0;b(),a===!1&&(t>0&&T(!0),e>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new Wt(u,3)),this.setAttribute("normal",new Wt(d,3)),this.setAttribute("uv",new Wt(f,2));function b(){let y=new R,A=new R,w=0,P=(e-t)/n;for(let D=0;D<=r;D++){let S=[],v=D/r,I=v*(e-t)+t;for(let F=0;F<=i;F++){let B=F/i,V=B*l+o,G=Math.sin(V),W=Math.cos(V);A.x=I*G,A.y=-v*n+m,A.z=I*W,u.push(A.x,A.y,A.z),y.set(G,P,W).normalize(),d.push(y.x,y.y,y.z),f.push(B,1-v),S.push(g++)}_.push(S)}for(let D=0;D<i;D++)for(let S=0;S<r;S++){let v=_[S][D],I=_[S+1][D],F=_[S+1][D+1],B=_[S][D+1];(t>0||S!==0)&&(h.push(v,I,B),w+=3),(e>0||S!==r-1)&&(h.push(I,F,B),w+=3)}c.addGroup(p,w,0),p+=w}function T(y){let A=g,w=new nt,P=new R,D=0,S=y===!0?t:e,v=y===!0?1:-1;for(let F=1;F<=i;F++)u.push(0,m*v,0),d.push(0,v,0),f.push(.5,.5),g++;let I=g;for(let F=0;F<=i;F++){let V=F/i*l+o,G=Math.cos(V),W=Math.sin(V);P.x=S*W,P.y=m*v,P.z=S*G,u.push(P.x,P.y,P.z),d.push(0,v,0),w.x=G*.5+.5,w.y=W*.5*v+.5,f.push(w.x,w.y),g++}for(let F=0;F<i;F++){let B=A+F,V=I+F;y===!0?h.push(V,V+1,B):h.push(V+1,V,B),D+=3}c.addGroup(p,D,y===!0?1:2),p+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},wr=class s extends Ze{constructor(t=1,e=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var an=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),i=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);let h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let a=this.getPoint(i),o=this.getPoint(r),l=e||(a.isVector2?new nt:new R);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new R,i=[],r=[],a=[],o=new R,l=new jt;for(let f=0;f<=t;f++){let g=f/t;i[f]=this.getTangentAt(g,new R)}r[0]=new R,a[0]=new R;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(Zt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(Zt(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Cs=class extends an{constructor(t=0,e=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new nt){let n=e,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);let o=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Ha=class extends Cs{constructor(t,e,n,i,r,a){super(t,e,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Uc(){let s=0,t=0,e=0,n=0;function i(r,a,o,l){s=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(r){let a=r*r,o=a*r;return s+t*r+e*a+n*o}}}var Ta=new R,jl=new Uc,tc=new Uc,ec=new Uc,Ga=class extends an{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new R){let n=e,i=this.points,r=i.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(Ta.subVectors(i[0],i[1]).add(i[0]),c=Ta);let u=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(Ta.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Ta),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),jl.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,_,m),tc.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,_,m),ec.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(jl.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),tc.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),ec.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(jl.calc(l),tc.calc(l),ec.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new R().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Jh(s,t,e,n,i){let r=(n-t)*.5,a=(i-e)*.5,o=s*s,l=s*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*s+e}function Nf(s,t){let e=1-s;return e*e*t}function Of(s,t){return 2*(1-s)*s*t}function Bf(s,t){return s*s*t}function ar(s,t,e,n){return Nf(s,t)+Of(s,e)+Bf(s,n)}function zf(s,t){let e=1-s;return e*e*e*t}function kf(s,t){let e=1-s;return 3*e*e*s*t}function Hf(s,t){return 3*(1-s)*s*s*t}function Gf(s,t){return s*s*s*t}function or(s,t,e,n,i){return zf(s,t)+kf(s,e)+Hf(s,n)+Gf(s,i)}var Ar=class extends an{constructor(t=new nt,e=new nt,n=new nt,i=new nt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new nt){let n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(or(t,i.x,r.x,a.x,o.x),or(t,i.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Va=class extends an{constructor(t=new R,e=new R,n=new R,i=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new R){let n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(or(t,i.x,r.x,a.x,o.x),or(t,i.y,r.y,a.y,o.y),or(t,i.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Rr=class extends an{constructor(t=new nt,e=new nt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new nt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new nt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Wa=class extends an{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Cr=class extends an{constructor(t=new nt,e=new nt,n=new nt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new nt){let n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(ar(t,i.x,r.x,a.x),ar(t,i.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Xa=class extends an{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){let n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(ar(t,i.x,r.x,a.x),ar(t,i.y,r.y,a.y),ar(t,i.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ir=class extends an{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new nt){let n=e,i=this.points,r=(i.length-1)*t,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(Jh(o,l.x,c.x,h.x,u.x),Jh(o,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new nt().fromArray(i))}return this}},cc=Object.freeze({__proto__:null,ArcCurve:Ha,CatmullRomCurve3:Ga,CubicBezierCurve:Ar,CubicBezierCurve3:Va,EllipseCurve:Cs,LineCurve:Rr,LineCurve3:Wa,QuadraticBezierCurve:Cr,QuadraticBezierCurve3:Xa,SplineCurve:Ir}),qa=class extends an{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new cc[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,r=this.curves;i<r.length;i++){let a=r[i],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new cc[i.type]().fromJSON(i))}return this}},xi=class extends qa{constructor(t){super(),this.type="Path",this.currentPoint=new nt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Rr(this.currentPoint.clone(),new nt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let r=new Cr(this.currentPoint.clone(),new nt(t,e),new nt(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,a){let o=new Ar(this.currentPoint.clone(),new nt(t,e),new nt(n,i),new nt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Ir(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,i,r,a),this}absarc(t,e,n,i,r,a){return this.absellipse(t,e,n,n,i,r,a),this}ellipse(t,e,n,i,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,r,a,o,l),this}absellipse(t,e,n,i,r,a,o,l){let c=new Cs(t,e,n,i,r,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Nn=class extends xi{constructor(t){super(t),this.uuid=jn(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new xi().fromJSON(i))}return this}};function Vf(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=qu(s,0,i,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Zf(s,t,r,e)),s.length>80*e){o=1/0,l=1/0;let h=-1/0,u=-1/0;for(let d=e;d<i;d+=e){let f=s[d],g=s[d+1];f<o&&(o=f),g<l&&(l=g),f>h&&(h=f),g>u&&(u=g)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return Pr(r,a,e,o,l,c,0),a}function qu(s,t,e,n,i){let r;if(i===rp(s,t,e,n)>0)for(let a=t;a<e;a+=n)r=$h(a/n|0,s[a],s[a+1],r);else for(let a=e-n;a>=t;a-=n)r=$h(a/n|0,s[a],s[a+1],r);return r&&Is(r,r.next)&&(Lr(r),r=r.next),r}function zi(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Is(e,e.next)||Me(e.prev,e,e.next)===0)){if(Lr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Pr(s,t,e,n,i,r,a){if(!s)return;!a&&r&&jf(s,n,i,r);let o=s;for(;s.prev!==s.next;){let l=s.prev,c=s.next;if(r?Xf(s,n,i,r):Wf(s)){t.push(l.i,s.i,c.i),Lr(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=qf(zi(s),t),Pr(s,t,e,n,i,r,2)):a===2&&Yf(s,t,e,n,i,r):Pr(zi(s),t,e,n,i,r,1);break}}}function Wf(s){let t=s.prev,e=s,n=s.next;if(Me(t,e,n)>=0)return!1;let i=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(i,r,a),u=Math.min(o,l,c),d=Math.max(i,r,a),f=Math.max(o,l,c),g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&rr(i,o,r,l,a,c,g.x,g.y)&&Me(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Xf(s,t,e,n){let i=s.prev,r=s,a=s.next;if(Me(i,r,a)>=0)return!1;let o=i.x,l=r.x,c=a.x,h=i.y,u=r.y,d=a.y,f=Math.min(o,l,c),g=Math.min(h,u,d),_=Math.max(o,l,c),m=Math.max(h,u,d),p=hc(f,g,t,e,n),b=hc(_,m,t,e,n),T=s.prevZ,y=s.nextZ;for(;T&&T.z>=p&&y&&y.z<=b;){if(T.x>=f&&T.x<=_&&T.y>=g&&T.y<=m&&T!==i&&T!==a&&rr(o,h,l,u,c,d,T.x,T.y)&&Me(T.prev,T,T.next)>=0||(T=T.prevZ,y.x>=f&&y.x<=_&&y.y>=g&&y.y<=m&&y!==i&&y!==a&&rr(o,h,l,u,c,d,y.x,y.y)&&Me(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;T&&T.z>=p;){if(T.x>=f&&T.x<=_&&T.y>=g&&T.y<=m&&T!==i&&T!==a&&rr(o,h,l,u,c,d,T.x,T.y)&&Me(T.prev,T,T.next)>=0)return!1;T=T.prevZ}for(;y&&y.z<=b;){if(y.x>=f&&y.x<=_&&y.y>=g&&y.y<=m&&y!==i&&y!==a&&rr(o,h,l,u,c,d,y.x,y.y)&&Me(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function qf(s,t){let e=s;do{let n=e.prev,i=e.next.next;!Is(n,i)&&Zu(n,e,e.next,i)&&Dr(n,i)&&Dr(i,n)&&(t.push(n.i,e.i,i.i),Lr(e),Lr(e.next),e=s=i),e=e.next}while(e!==s);return zi(e)}function Yf(s,t,e,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&np(a,o)){let l=Ju(a,o);a=zi(a,a.next),l=zi(l,l.next),Pr(a,t,e,n,i,r,0),Pr(l,t,e,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function Zf(s,t,e,n){let i=[];for(let r=0,a=t.length;r<a;r++){let o=t[r]*n,l=r<a-1?t[r+1]*n:s.length,c=qu(s,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(ep(c))}i.sort(Jf);for(let r=0;r<i.length;r++)e=$f(i[r],e);return e}function Jf(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){let n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function $f(s,t){let e=Kf(s,t);if(!e)return t;let n=Ju(e,s);return zi(n,n.next),zi(e,e.next)}function Kf(s,t){let e=t,n=s.x,i=s.y,r=-1/0,a;if(Is(s,e))return e;do{if(Is(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){let u=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,a=e.x<e.next.x?e:e.next,u===n))return a}e=e.next}while(e!==t);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Yu(i<c?n:r,i,l,c,i<c?r:n,i,e.x,e.y)){let u=Math.abs(i-e.y)/(n-e.x);Dr(e,s)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&Qf(a,e)))&&(a=e,h=u)}e=e.next}while(e!==o);return a}function Qf(s,t){return Me(s.prev,s,t.prev)<0&&Me(t.next,s,s.next)<0}function jf(s,t,e,n){let i=s;do i.z===0&&(i.z=hc(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,tp(i)}function tp(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,e*=2}while(t>1);return s}function hc(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function ep(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function Yu(s,t,e,n,i,r,a,o){return(i-a)*(t-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(i-a)*(n-o)}function rr(s,t,e,n,i,r,a,o){return!(s===a&&t===o)&&Yu(s,t,e,n,i,r,a,o)}function np(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!ip(s,t)&&(Dr(s,t)&&Dr(t,s)&&sp(s,t)&&(Me(s.prev,s,t.prev)||Me(s,t.prev,t))||Is(s,t)&&Me(s.prev,s,s.next)>0&&Me(t.prev,t,t.next)>0)}function Me(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Is(s,t){return s.x===t.x&&s.y===t.y}function Zu(s,t,e,n){let i=wa(Me(s,t,e)),r=wa(Me(s,t,n)),a=wa(Me(e,n,s)),o=wa(Me(e,n,t));return!!(i!==r&&a!==o||i===0&&Ea(s,e,t)||r===0&&Ea(s,n,t)||a===0&&Ea(e,s,n)||o===0&&Ea(e,t,n))}function Ea(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function wa(s){return s>0?1:s<0?-1:0}function ip(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&Zu(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function Dr(s,t){return Me(s.prev,s,s.next)<0?Me(s,t,s.next)>=0&&Me(s,s.prev,t)>=0:Me(s,t,s.prev)<0||Me(s,s.next,t)<0}function sp(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function Ju(s,t){let e=uc(s.i,s.x,s.y),n=uc(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function $h(s,t,e,n){let i=uc(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Lr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function uc(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function rp(s,t,e,n){let i=0;for(let r=t,a=e-n;r<e;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}var dc=class{static triangulate(t,e,n=2){return Vf(t,e,n)}},Ln=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];Kh(t),Qh(n,t);let a=t.length;e.forEach(Kh);for(let l=0;l<e.length;l++)i.push(a),a+=e[l].length,Qh(n,e[l]);let o=dc.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function Kh(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Qh(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var ki=class s extends _e{constructor(t=new Nn([new nt(.5,.5),new nt(-.5,.5),new nt(-.5,-.5),new nt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,i=[],r=[];for(let o=0,l=t.length;o<l;o++){let c=t[o];a(c)}this.setAttribute("position",new Wt(i,3)),this.setAttribute("uv",new Wt(r,2)),this.computeVertexNormals();function a(o){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,b=e.UVGenerator!==void 0?e.UVGenerator:ap,T,y=!1,A,w,P,D;p&&(T=p.getSpacedPoints(h),y=!0,d=!1,A=p.computeFrenetFrames(h,!1),w=new R,P=new R,D=new R),d||(m=0,f=0,g=0,_=0);let S=o.extractPoints(c),v=S.shape,I=S.holes;if(!Ln.isClockWise(v)){v=v.reverse();for(let tt=0,$=I.length;tt<$;tt++){let J=I[tt];Ln.isClockWise(J)&&(I[tt]=J.reverse())}}function B(tt){let J=10000000000000001e-36,Z=tt[0];for(let ut=1;ut<=tt.length;ut++){let it=ut%tt.length,dt=tt[it],Gt=dt.x-Z.x,kt=dt.y-Z.y,E=Gt*Gt+kt*kt,x=Math.max(Math.abs(dt.x),Math.abs(dt.y),Math.abs(Z.x),Math.abs(Z.y)),O=J*x*x;if(E<=O){tt.splice(it,1),ut--;continue}Z=dt}}B(v),I.forEach(B);let V=I.length,G=v;for(let tt=0;tt<V;tt++){let $=I[tt];v=v.concat($)}function W(tt,$,J){return $||console.error("THREE.ExtrudeGeometry: vec does not exist"),tt.clone().addScaledVector($,J)}let Q=v.length;function z(tt,$,J){let Z,ut,it,dt=tt.x-$.x,Gt=tt.y-$.y,kt=J.x-tt.x,E=J.y-tt.y,x=dt*dt+Gt*Gt,O=dt*E-Gt*kt;if(Math.abs(O)>Number.EPSILON){let X=Math.sqrt(x),j=Math.sqrt(kt*kt+E*E),q=$.x-Gt/X,Rt=$.y+dt/X,ct=J.x-E/j,Et=J.y+kt/j,wt=((ct-q)*E-(Et-Rt)*kt)/(dt*E-Gt*kt);Z=q+dt*wt-tt.x,ut=Rt+Gt*wt-tt.y;let st=Z*Z+ut*ut;if(st<=2)return new nt(Z,ut);it=Math.sqrt(st/2)}else{let X=!1;dt>Number.EPSILON?kt>Number.EPSILON&&(X=!0):dt<-Number.EPSILON?kt<-Number.EPSILON&&(X=!0):Math.sign(Gt)===Math.sign(E)&&(X=!0),X?(Z=-Gt,ut=dt,it=Math.sqrt(x)):(Z=dt,ut=Gt,it=Math.sqrt(x/2))}return new nt(Z/it,ut/it)}let ot=[];for(let tt=0,$=G.length,J=$-1,Z=tt+1;tt<$;tt++,J++,Z++)J===$&&(J=0),Z===$&&(Z=0),ot[tt]=z(G[tt],G[J],G[Z]);let ht=[],xt,zt=ot.concat();for(let tt=0,$=V;tt<$;tt++){let J=I[tt];xt=[];for(let Z=0,ut=J.length,it=ut-1,dt=Z+1;Z<ut;Z++,it++,dt++)it===ut&&(it=0),dt===ut&&(dt=0),xt[Z]=z(J[Z],J[it],J[dt]);ht.push(xt),zt=zt.concat(xt)}let Jt;if(m===0)Jt=Ln.triangulateShape(G,I);else{let tt=[],$=[];for(let J=0;J<m;J++){let Z=J/m,ut=f*Math.cos(Z*Math.PI/2),it=g*Math.sin(Z*Math.PI/2)+_;for(let dt=0,Gt=G.length;dt<Gt;dt++){let kt=W(G[dt],ot[dt],it);It(kt.x,kt.y,-ut),Z===0&&tt.push(kt)}for(let dt=0,Gt=V;dt<Gt;dt++){let kt=I[dt];xt=ht[dt];let E=[];for(let x=0,O=kt.length;x<O;x++){let X=W(kt[x],xt[x],it);It(X.x,X.y,-ut),Z===0&&E.push(X)}Z===0&&$.push(E)}}Jt=Ln.triangulateShape(tt,$)}let ae=Jt.length,te=g+_;for(let tt=0;tt<Q;tt++){let $=d?W(v[tt],zt[tt],te):v[tt];y?(P.copy(A.normals[0]).multiplyScalar($.x),w.copy(A.binormals[0]).multiplyScalar($.y),D.copy(T[0]).add(P).add(w),It(D.x,D.y,D.z)):It($.x,$.y,0)}for(let tt=1;tt<=h;tt++)for(let $=0;$<Q;$++){let J=d?W(v[$],zt[$],te):v[$];y?(P.copy(A.normals[tt]).multiplyScalar(J.x),w.copy(A.binormals[tt]).multiplyScalar(J.y),D.copy(T[tt]).add(P).add(w),It(D.x,D.y,D.z)):It(J.x,J.y,u/h*tt)}for(let tt=m-1;tt>=0;tt--){let $=tt/m,J=f*Math.cos($*Math.PI/2),Z=g*Math.sin($*Math.PI/2)+_;for(let ut=0,it=G.length;ut<it;ut++){let dt=W(G[ut],ot[ut],Z);It(dt.x,dt.y,u+J)}for(let ut=0,it=I.length;ut<it;ut++){let dt=I[ut];xt=ht[ut];for(let Gt=0,kt=dt.length;Gt<kt;Gt++){let E=W(dt[Gt],xt[Gt],Z);y?It(E.x,E.y+T[h-1].y,T[h-1].x+J):It(E.x,E.y,u+J)}}}Y(),et();function Y(){let tt=i.length/3;if(d){let $=0,J=Q*$;for(let Z=0;Z<ae;Z++){let ut=Jt[Z];Tt(ut[2]+J,ut[1]+J,ut[0]+J)}$=h+m*2,J=Q*$;for(let Z=0;Z<ae;Z++){let ut=Jt[Z];Tt(ut[0]+J,ut[1]+J,ut[2]+J)}}else{for(let $=0;$<ae;$++){let J=Jt[$];Tt(J[2],J[1],J[0])}for(let $=0;$<ae;$++){let J=Jt[$];Tt(J[0]+Q*h,J[1]+Q*h,J[2]+Q*h)}}n.addGroup(tt,i.length/3-tt,0)}function et(){let tt=i.length/3,$=0;vt(G,$),$+=G.length;for(let J=0,Z=I.length;J<Z;J++){let ut=I[J];vt(ut,$),$+=ut.length}n.addGroup(tt,i.length/3-tt,1)}function vt(tt,$){let J=tt.length;for(;--J>=0;){let Z=J,ut=J-1;ut<0&&(ut=tt.length-1);for(let it=0,dt=h+m*2;it<dt;it++){let Gt=Q*it,kt=Q*(it+1),E=$+Z+Gt,x=$+ut+Gt,O=$+ut+kt,X=$+Z+kt;$t(E,x,O,X)}}}function It(tt,$,J){l.push(tt),l.push($),l.push(J)}function Tt(tt,$,J){fe(tt),fe($),fe(J);let Z=i.length/3,ut=b.generateTopUV(n,i,Z-3,Z-2,Z-1);C(ut[0]),C(ut[1]),C(ut[2])}function $t(tt,$,J,Z){fe(tt),fe($),fe(Z),fe($),fe(J),fe(Z);let ut=i.length/3,it=b.generateSideWallUV(n,i,ut-6,ut-3,ut-2,ut-1);C(it[0]),C(it[1]),C(it[3]),C(it[1]),C(it[2]),C(it[3])}function fe(tt){i.push(l[tt*3+0]),i.push(l[tt*3+1]),i.push(l[tt*3+2])}function C(tt){r.push(tt.x),r.push(tt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return op(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new cc[i.type]().fromJSON(i)),new s(n,t.options)}},ap={generateTopUV:function(s,t,e,n,i){let r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[i*3],h=t[i*3+1];return[new nt(r,a),new nt(o,l),new nt(c,h)]},generateSideWallUV:function(s,t,e,n,i,r){let a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[i*3],f=t[i*3+1],g=t[i*3+2],_=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new nt(a,1-l),new nt(c,1-u),new nt(d,1-g),new nt(_,1-p)]:[new nt(o,1-l),new nt(h,1-u),new nt(f,1-g),new nt(m,1-p)]}};function op(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var be=class s extends _e{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=t/o,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){let b=p*d-a;for(let T=0;T<c;T++){let y=T*u-r;g.push(y,-b,0),_.push(0,0,1),m.push(T/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){let T=b+c*p,y=b+c*(p+1),A=b+1+c*(p+1),w=b+1+c*p;f.push(T,y,w),f.push(y,A,w)}this.setIndex(f),this.setAttribute("position",new Wt(g,3)),this.setAttribute("normal",new Wt(_,3)),this.setAttribute("uv",new Wt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}};var yi=class s extends _e{constructor(t=new Nn([new nt(0,.5),new nt(-.5,-.5),new nt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],i=[],r=[],a=[],o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Wt(i,3)),this.setAttribute("normal",new Wt(r,3)),this.setAttribute("uv",new Wt(a,2));function c(h){let u=i.length/3,d=h.extractPoints(e),f=d.shape,g=d.holes;Ln.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){let b=g[m];Ln.isClockWise(b)===!0&&(g[m]=b.reverse())}let _=Ln.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){let b=g[m];f=f.concat(b)}for(let m=0,p=f.length;m<p;m++){let b=f[m];i.push(b.x,b.y,0),r.push(0,0,1),a.push(b.x,b.y)}for(let m=0,p=_.length;m<p;m++){let b=_[m],T=b[0]+u,y=b[1]+u,A=b[2]+u;n.push(T,y,A),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return lp(e,t)}static fromJSON(t,e){let n=[];for(let i=0,r=t.shapes.length;i<r;i++){let a=e[t.shapes[i]];n.push(a)}return new s(n,t.curveSegments)}};function lp(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){let i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}var Ce=class s extends _e{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new R,d=new R,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){let b=[],T=p/n,y=0;p===0&&a===0?y=.5/e:p===n&&l===Math.PI&&(y=-.5/e);for(let A=0;A<=e;A++){let w=A/e;u.x=-t*Math.cos(i+w*r)*Math.sin(a+T*o),u.y=t*Math.cos(a+T*o),u.z=t*Math.sin(i+w*r)*Math.sin(a+T*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(w+y,1-T),b.push(c++)}h.push(b)}for(let p=0;p<n;p++)for(let b=0;b<e;b++){let T=h[p][b+1],y=h[p][b],A=h[p+1][b],w=h[p+1][b+1];(p!==0||a>0)&&f.push(T,y,w),(p!==n-1||l<Math.PI)&&f.push(y,A,w)}this.setIndex(f),this.setAttribute("position",new Wt(g,3)),this.setAttribute("normal",new Wt(_,3)),this.setAttribute("uv",new Wt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var on=class s extends _e{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);let a=[],o=[],l=[],c=[],h=new R,u=new R,d=new R;for(let f=0;f<=n;f++)for(let g=0;g<=i;g++){let _=g/i*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/i),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=i;g++){let _=(i+1)*f+g-1,m=(i+1)*(f-1)+g-1,p=(i+1)*(f-1)+g,b=(i+1)*f+g;a.push(_,m,b),a.push(m,p,b)}this.setIndex(a),this.setAttribute("position",new Wt(o,3)),this.setAttribute("normal",new Wt(l,3)),this.setAttribute("uv",new Wt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var ie=class extends Un{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Lt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Lt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ic,this.normalScale=new nt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new sn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Fr=class extends ie{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new nt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Zt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Lt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Lt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Lt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var Ya=class extends Un{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Pu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Za=class extends Un{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Aa(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function cp(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}var Hi=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<i)){for(let o=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=e[++n],t<i)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let a=0;a!==i;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Ja=class extends Hi{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:sc,endingEnd:sc}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,a=t+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case rc:r=t,o=2*e-n;break;case ac:r=i.length-2,o=e+i[r]-i[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case rc:a=t,l=2*n-e;break;case ac:a=1,l=n+i[1]-i[0];break;default:a=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-e)/(i-e),_=g*g,m=_*g,p=-d*m+2*d*_-d*g,b=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,T=(-1-f)*m+(1.5+f)*_+.5*g,y=f*m-f*_;for(let A=0;A!==o;++A)r[A]=p*a[h+A]+b*a[c+A]+T*a[l+A]+y*a[u+A];return r}},$a=class extends Hi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(i-e),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}},Ka=class extends Hi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},ln=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Aa(e,this.TimeBufferType),this.values=Aa(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Aa(t.times,Array),values:Aa(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Ka(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new $a(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Ja(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case lr:e=this.InterpolantFactoryMethodDiscrete;break;case Da:e=this.InterpolantFactoryMethodLinear;break;case Ra:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return lr;case this.InterpolantFactoryMethodLinear:return Da;case this.InterpolantFactoryMethodSmooth:return Ra}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,r=0,a=i-1;for(;r!==i&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(i!==void 0&&cp(i))for(let o=0,l=i.length;o!==l;++o){let c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Ra,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(i)l=!0;else{let u=o*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){let _=e[u+g];if(_!==e[d+g]||_!==e[f+g]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let u=o*n,d=a*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}};ln.prototype.ValueTypeName="";ln.prototype.TimeBufferType=Float32Array;ln.prototype.ValueBufferType=Float32Array;ln.prototype.DefaultInterpolation=Da;var vi=class extends ln{constructor(t,e,n){super(t,e,n)}};vi.prototype.ValueTypeName="bool";vi.prototype.ValueBufferType=Array;vi.prototype.DefaultInterpolation=lr;vi.prototype.InterpolantFactoryMethodLinear=void 0;vi.prototype.InterpolantFactoryMethodSmooth=void 0;var Qa=class extends ln{constructor(t,e,n,i){super(t,e,n,i)}};Qa.prototype.ValueTypeName="color";var ja=class extends ln{constructor(t,e,n,i){super(t,e,n,i)}};ja.prototype.ValueTypeName="number";var to=class extends Hi{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(i-e),c=t*o;for(let h=c+o;c!==h;c+=4)qe.slerpFlat(r,0,a,c-o,a,c,l);return r}},Ur=class extends ln{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new to(this.times,this.values,this.getValueSize(),t)}};Ur.prototype.ValueTypeName="quaternion";Ur.prototype.InterpolantFactoryMethodSmooth=void 0;var Mi=class extends ln{constructor(t,e,n){super(t,e,n)}};Mi.prototype.ValueTypeName="string";Mi.prototype.ValueBufferType=Array;Mi.prototype.DefaultInterpolation=lr;Mi.prototype.InterpolantFactoryMethodLinear=void 0;Mi.prototype.InterpolantFactoryMethodSmooth=void 0;var eo=class extends ln{constructor(t,e,n,i){super(t,e,n,i)}};eo.prototype.ValueTypeName="vector";var no=class{constructor(t,e,n){let i=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},$u=new no,io=class{constructor(t){this.manager=t!==void 0?t:$u,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};io.DEFAULT_MATERIAL_NAME="__DEFAULT";var Gi=class extends Ee{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Lt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},Nr=class extends Gi{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Lt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},nc=new jt,jh=new R,tu=new R,so=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new nt(512,512),this.mapType=An,this.map=null,this.mapPass=null,this.matrix=new jt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ws,this._frameExtents=new nt(1,1),this._viewportCount=1,this._viewports=[new oe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;jh.setFromMatrixPosition(t.matrixWorld),e.position.copy(jh),tu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(tu),e.updateMatrixWorld(),nc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(nc,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(nc)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var eu=new jt,sr=new R,ic=new R,fc=class extends so{constructor(){super(new Ue(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new nt(4,2),this._viewportCount=6,this._viewports=[new oe(2,1,1,1),new oe(0,1,1,1),new oe(3,1,1,1),new oe(1,1,1,1),new oe(3,0,1,1),new oe(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),sr.setFromMatrixPosition(t.matrixWorld),n.position.copy(sr),ic.copy(n.position),ic.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ic),n.updateMatrixWorld(),i.makeTranslation(-sr.x,-sr.y,-sr.z),eu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(eu,n.coordinateSystem,n.reversedDepth)}},Ps=class extends Gi{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new fc}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},Or=class extends _r{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,a=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},pc=class extends so{constructor(){super(new Or(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Si=class extends Gi{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ee.DEFAULT_UP),this.updateMatrix(),this.target=new Ee,this.shadow=new pc}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},Br=class extends Gi{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var ro=class extends Ue{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var Nc="\\[\\]\\.:\\/",hp=new RegExp("["+Nc+"]","g"),Oc="[^"+Nc+"]",up="[^"+Nc.replace("\\.","")+"]",dp=/((?:WC+[\/:])*)/.source.replace("WC",Oc),fp=/(WCOD+)?/.source.replace("WCOD",up),pp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Oc),mp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Oc),gp=new RegExp("^"+dp+fp+pp+mp+"$"),_p=["material","materials","bones","map"],mc=class{constructor(t,e,n){let i=n||ge.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ge=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(hp,"")}static parseTrackName(t){let e=gp.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);_p.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=n(o.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let a=t[i];if(a===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ge.Composite=mc;ge.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ge.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ge.prototype.GetterByBindingType=[ge.prototype._getValue_direct,ge.prototype._getValue_array,ge.prototype._getValue_arrayElement,ge.prototype._getValue_toArray];ge.prototype.SetterByBindingTypeAndVersioning=[[ge.prototype._setValue_direct,ge.prototype._setValue_direct_setNeedsUpdate,ge.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ge.prototype._setValue_array,ge.prototype._setValue_array_setNeedsUpdate,ge.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ge.prototype._setValue_arrayElement,ge.prototype._setValue_arrayElement_setNeedsUpdate,ge.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ge.prototype._setValue_fromArray,ge.prototype._setValue_fromArray_setNeedsUpdate,ge.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var fx=new Float32Array(1);function Bc(s,t,e,n){let i=xp(n);switch(e){case wc:return s*t;case Rc:return s*t/i.components*i.byteLength;case So:return s*t/i.components*i.byteLength;case Cc:return s*t*2/i.components*i.byteLength;case bo:return s*t*2/i.components*i.byteLength;case Ac:return s*t*3/i.components*i.byteLength;case _n:return s*t*4/i.components*i.byteLength;case To:return s*t*4/i.components*i.byteLength;case Hr:case Gr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Vr:case Wr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case wo:case Ro:return Math.max(s,16)*Math.max(t,8)/4;case Eo:case Ao:return Math.max(s,8)*Math.max(t,8)/2;case Co:case Io:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Po:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Do:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Lo:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Fo:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Uo:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case No:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Oo:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Bo:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case zo:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case ko:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Ho:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Go:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Vo:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Wo:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Xo:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case qo:case Yo:case Zo:return Math.ceil(s/4)*Math.ceil(t/4)*16;case Jo:case $o:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Ko:case Qo:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function xp(s){switch(s){case An:case Sc:return{byteLength:1,components:1};case Ds:case bc:case Ls:return{byteLength:2,components:1};case vo:case Mo:return{byteLength:2,components:4};case bi:case yo:case zn:return{byteLength:4,components:1};case Tc:case Ec:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window!="undefined"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function vd(){let s=null,t=!1,e=null,n=null;function i(r,a){e(r,a),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function yp(s){let t=new WeakMap;function e(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array!="undefined"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){let h=l.array,u=l.updateRanges;if(s.bindBuffer(c,o),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){let g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){let _=u[f];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var vp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mp=`#ifdef USE_ALPHAHASH
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
#endif`,Sp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ep=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wp=`#ifdef USE_AOMAP
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
#endif`,Ap=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Rp=`#ifdef USE_BATCHING
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
#endif`,Cp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ip=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Lp=`#ifdef USE_IRIDESCENCE
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
#endif`,Fp=`#ifdef USE_BUMPMAP
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
#endif`,Up=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Np=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Op=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,kp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Hp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Vp=`#define PI 3.141592653589793
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
} // validated`,Wp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Xp=`vec3 transformedNormal = objectNormal;
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
#endif`,qp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$p="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Qp=`#ifdef USE_ENVMAP
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
#endif`,jp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,tm=`#ifdef USE_ENVMAP
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
#endif`,em=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nm=`#ifdef USE_ENVMAP
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
#endif`,im=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,am=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,om=`#ifdef USE_GRADIENTMAP
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
}`,lm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,um=`uniform bool receiveShadow;
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
#endif`,dm=`#ifdef USE_ENVMAP
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
#endif`,fm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_m=`PhysicalMaterial material;
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
#endif`,xm=`struct PhysicalMaterial {
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
}`,ym=`
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
#endif`,vm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Mm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Sm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Em=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,wm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Am=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Rm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Cm=`#if defined( USE_POINTS_UV )
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
#endif`,Im=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Pm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Lm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Fm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Um=`#ifdef USE_MORPHTARGETS
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
#endif`,Nm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Om=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Bm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,zm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,km=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gm=`#ifdef USE_NORMALMAP
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
#endif`,Vm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ym=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Zm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Jm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,$m=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Km=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Qm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,jm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,t0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,e0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,n0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,i0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,s0=`float getShadowMask() {
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
}`,r0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,a0=`#ifdef USE_SKINNING
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
#endif`,o0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,l0=`#ifdef USE_SKINNING
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
#endif`,c0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,h0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,u0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,d0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,f0=`#ifdef USE_TRANSMISSION
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
#endif`,p0=`#ifdef USE_TRANSMISSION
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
#endif`,m0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,g0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,x0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,y0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,v0=`uniform sampler2D t2D;
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
}`,M0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,S0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,b0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,T0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,E0=`#include <common>
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
}`,w0=`#if DEPTH_PACKING == 3200
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
}`,A0=`#define DISTANCE
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
}`,R0=`#define DISTANCE
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
}`,C0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,I0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,P0=`uniform float scale;
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
}`,D0=`uniform vec3 diffuse;
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
}`,L0=`#include <common>
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
}`,F0=`uniform vec3 diffuse;
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
}`,U0=`#define LAMBERT
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
}`,N0=`#define LAMBERT
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
}`,O0=`#define MATCAP
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
}`,B0=`#define MATCAP
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
}`,z0=`#define NORMAL
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
}`,k0=`#define NORMAL
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
}`,H0=`#define PHONG
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
}`,G0=`#define PHONG
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
}`,V0=`#define STANDARD
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
}`,W0=`#define STANDARD
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
}`,X0=`#define TOON
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
}`,q0=`#define TOON
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
}`,Y0=`uniform float size;
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
}`,Z0=`uniform vec3 diffuse;
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
}`,J0=`#include <common>
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
}`,$0=`uniform vec3 color;
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
}`,K0=`uniform float rotation;
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
}`,Q0=`uniform vec3 diffuse;
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
}`,Yt={alphahash_fragment:vp,alphahash_pars_fragment:Mp,alphamap_fragment:Sp,alphamap_pars_fragment:bp,alphatest_fragment:Tp,alphatest_pars_fragment:Ep,aomap_fragment:wp,aomap_pars_fragment:Ap,batching_pars_vertex:Rp,batching_vertex:Cp,begin_vertex:Ip,beginnormal_vertex:Pp,bsdfs:Dp,iridescence_fragment:Lp,bumpmap_pars_fragment:Fp,clipping_planes_fragment:Up,clipping_planes_pars_fragment:Np,clipping_planes_pars_vertex:Op,clipping_planes_vertex:Bp,color_fragment:zp,color_pars_fragment:kp,color_pars_vertex:Hp,color_vertex:Gp,common:Vp,cube_uv_reflection_fragment:Wp,defaultnormal_vertex:Xp,displacementmap_pars_vertex:qp,displacementmap_vertex:Yp,emissivemap_fragment:Zp,emissivemap_pars_fragment:Jp,colorspace_fragment:$p,colorspace_pars_fragment:Kp,envmap_fragment:Qp,envmap_common_pars_fragment:jp,envmap_pars_fragment:tm,envmap_pars_vertex:em,envmap_physical_pars_fragment:dm,envmap_vertex:nm,fog_vertex:im,fog_pars_vertex:sm,fog_fragment:rm,fog_pars_fragment:am,gradientmap_pars_fragment:om,lightmap_pars_fragment:lm,lights_lambert_fragment:cm,lights_lambert_pars_fragment:hm,lights_pars_begin:um,lights_toon_fragment:fm,lights_toon_pars_fragment:pm,lights_phong_fragment:mm,lights_phong_pars_fragment:gm,lights_physical_fragment:_m,lights_physical_pars_fragment:xm,lights_fragment_begin:ym,lights_fragment_maps:vm,lights_fragment_end:Mm,logdepthbuf_fragment:Sm,logdepthbuf_pars_fragment:bm,logdepthbuf_pars_vertex:Tm,logdepthbuf_vertex:Em,map_fragment:wm,map_pars_fragment:Am,map_particle_fragment:Rm,map_particle_pars_fragment:Cm,metalnessmap_fragment:Im,metalnessmap_pars_fragment:Pm,morphinstance_vertex:Dm,morphcolor_vertex:Lm,morphnormal_vertex:Fm,morphtarget_pars_vertex:Um,morphtarget_vertex:Nm,normal_fragment_begin:Om,normal_fragment_maps:Bm,normal_pars_fragment:zm,normal_pars_vertex:km,normal_vertex:Hm,normalmap_pars_fragment:Gm,clearcoat_normal_fragment_begin:Vm,clearcoat_normal_fragment_maps:Wm,clearcoat_pars_fragment:Xm,iridescence_pars_fragment:qm,opaque_fragment:Ym,packing:Zm,premultiplied_alpha_fragment:Jm,project_vertex:$m,dithering_fragment:Km,dithering_pars_fragment:Qm,roughnessmap_fragment:jm,roughnessmap_pars_fragment:t0,shadowmap_pars_fragment:e0,shadowmap_pars_vertex:n0,shadowmap_vertex:i0,shadowmask_pars_fragment:s0,skinbase_vertex:r0,skinning_pars_vertex:a0,skinning_vertex:o0,skinnormal_vertex:l0,specularmap_fragment:c0,specularmap_pars_fragment:h0,tonemapping_fragment:u0,tonemapping_pars_fragment:d0,transmission_fragment:f0,transmission_pars_fragment:p0,uv_pars_fragment:m0,uv_pars_vertex:g0,uv_vertex:_0,worldpos_vertex:x0,background_vert:y0,background_frag:v0,backgroundCube_vert:M0,backgroundCube_frag:S0,cube_vert:b0,cube_frag:T0,depth_vert:E0,depth_frag:w0,distanceRGBA_vert:A0,distanceRGBA_frag:R0,equirect_vert:C0,equirect_frag:I0,linedashed_vert:P0,linedashed_frag:D0,meshbasic_vert:L0,meshbasic_frag:F0,meshlambert_vert:U0,meshlambert_frag:N0,meshmatcap_vert:O0,meshmatcap_frag:B0,meshnormal_vert:z0,meshnormal_frag:k0,meshphong_vert:H0,meshphong_frag:G0,meshphysical_vert:V0,meshphysical_frag:W0,meshtoon_vert:X0,meshtoon_frag:q0,points_vert:Y0,points_frag:Z0,shadow_vert:J0,shadow_frag:$0,sprite_vert:K0,sprite_frag:Q0},pt={common:{diffuse:{value:new Lt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ht}},envmap:{envMap:{value:null},envMapRotation:{value:new Ht},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ht}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ht}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ht},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ht},normalScale:{value:new nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ht},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ht}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ht}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ht}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Lt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Lt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0},uvTransform:{value:new Ht}},sprite:{diffuse:{value:new Lt(16777215)},opacity:{value:1},center:{value:new nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}}},kn={basic:{uniforms:Ge([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:Ge([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Lt(0)}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:Ge([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Lt(0)},specular:{value:new Lt(1118481)},shininess:{value:30}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:Ge([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new Lt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:Ge([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new Lt(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:Ge([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:Ge([pt.points,pt.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:Ge([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:Ge([pt.common,pt.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:Ge([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:Ge([pt.sprite,pt.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ht},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ht}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distanceRGBA:{uniforms:Ge([pt.common,pt.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distanceRGBA_vert,fragmentShader:Yt.distanceRGBA_frag},shadow:{uniforms:Ge([pt.lights,pt.fog,{color:{value:new Lt(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};kn.physical={uniforms:Ge([kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ht},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ht},clearcoatNormalScale:{value:new nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ht},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ht},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ht},sheen:{value:0},sheenColor:{value:new Lt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ht},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ht},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ht},transmissionSamplerSize:{value:new nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ht},attenuationDistance:{value:0},attenuationColor:{value:new Lt(0)},specularColor:{value:new Lt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ht},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ht},anisotropyVector:{value:new nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ht}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};var jo={r:0,b:0,g:0},qi=new sn,j0=new jt;function tg(s,t,e,n,i,r,a){let o=new Lt(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(T){let y=T.isScene===!0?T.background:null;return y&&y.isTexture&&(y=(T.backgroundBlurriness>0?e:t).get(y)),y}function _(T){let y=!1,A=g(T);A===null?p(o,l):A&&A.isColor&&(p(A,1),y=!0);let w=s.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(T,y){let A=g(y);A&&(A.isCubeTexture||A.mapping===zr)?(h===void 0&&(h=new Pt(new Ye(1,1,1),new rn({name:"BackgroundCubeMaterial",uniforms:Xi(kn.backgroundCube.uniforms),vertexShader:kn.backgroundCube.vertexShader,fragmentShader:kn.backgroundCube.fragmentShader,side:Be,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,P,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),qi.copy(y.backgroundRotation),qi.x*=-1,qi.y*=-1,qi.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(qi.y*=-1,qi.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(j0.makeRotationFromEuler(qi)),h.material.toneMapped=ee.getTransfer(A.colorSpace)!==le,(u!==A||d!==A.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=A,d=A.version,f=s.toneMapping),h.layers.enableAll(),T.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new Pt(new be(2,2),new rn({name:"BackgroundMaterial",uniforms:Xi(kn.background.uniforms),vertexShader:kn.background.vertexShader,fragmentShader:kn.background.fragmentShader,side:ei,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=ee.getTransfer(A.colorSpace)!==le,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(u!==A||d!==A.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,u=A,d=A.version,f=s.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function p(T,y){T.getRGB(jo,Fc(s)),n.buffers.color.setClear(jo.r,jo.g,jo.b,y,a)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(T,y=1){o.set(T),l=y,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(T){l=T,p(o,l)},render:_,addToRenderList:m,dispose:b}}function eg(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null),r=i,a=!1;function o(v,I,F,B,V){let G=!1,W=u(B,F,I);r!==W&&(r=W,c(r.object)),G=f(v,B,F,V),G&&g(v,B,F,V),V!==null&&t.update(V,s.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,y(v,I,F,B),V!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function l(){return s.createVertexArray()}function c(v){return s.bindVertexArray(v)}function h(v){return s.deleteVertexArray(v)}function u(v,I,F){let B=F.wireframe===!0,V=n[v.id];V===void 0&&(V={},n[v.id]=V);let G=V[I.id];G===void 0&&(G={},V[I.id]=G);let W=G[B];return W===void 0&&(W=d(l()),G[B]=W),W}function d(v){let I=[],F=[],B=[];for(let V=0;V<e;V++)I[V]=0,F[V]=0,B[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:F,attributeDivisors:B,object:v,attributes:{},index:null}}function f(v,I,F,B){let V=r.attributes,G=I.attributes,W=0,Q=F.getAttributes();for(let z in Q)if(Q[z].location>=0){let ht=V[z],xt=G[z];if(xt===void 0&&(z==="instanceMatrix"&&v.instanceMatrix&&(xt=v.instanceMatrix),z==="instanceColor"&&v.instanceColor&&(xt=v.instanceColor)),ht===void 0||ht.attribute!==xt||xt&&ht.data!==xt.data)return!0;W++}return r.attributesNum!==W||r.index!==B}function g(v,I,F,B){let V={},G=I.attributes,W=0,Q=F.getAttributes();for(let z in Q)if(Q[z].location>=0){let ht=G[z];ht===void 0&&(z==="instanceMatrix"&&v.instanceMatrix&&(ht=v.instanceMatrix),z==="instanceColor"&&v.instanceColor&&(ht=v.instanceColor));let xt={};xt.attribute=ht,ht&&ht.data&&(xt.data=ht.data),V[z]=xt,W++}r.attributes=V,r.attributesNum=W,r.index=B}function _(){let v=r.newAttributes;for(let I=0,F=v.length;I<F;I++)v[I]=0}function m(v){p(v,0)}function p(v,I){let F=r.newAttributes,B=r.enabledAttributes,V=r.attributeDivisors;F[v]=1,B[v]===0&&(s.enableVertexAttribArray(v),B[v]=1),V[v]!==I&&(s.vertexAttribDivisor(v,I),V[v]=I)}function b(){let v=r.newAttributes,I=r.enabledAttributes;for(let F=0,B=I.length;F<B;F++)I[F]!==v[F]&&(s.disableVertexAttribArray(F),I[F]=0)}function T(v,I,F,B,V,G,W){W===!0?s.vertexAttribIPointer(v,I,F,V,G):s.vertexAttribPointer(v,I,F,B,V,G)}function y(v,I,F,B){_();let V=B.attributes,G=F.getAttributes(),W=I.defaultAttributeValues;for(let Q in G){let z=G[Q];if(z.location>=0){let ot=V[Q];if(ot===void 0&&(Q==="instanceMatrix"&&v.instanceMatrix&&(ot=v.instanceMatrix),Q==="instanceColor"&&v.instanceColor&&(ot=v.instanceColor)),ot!==void 0){let ht=ot.normalized,xt=ot.itemSize,zt=t.get(ot);if(zt===void 0)continue;let Jt=zt.buffer,ae=zt.type,te=zt.bytesPerElement,Y=ae===s.INT||ae===s.UNSIGNED_INT||ot.gpuType===yo;if(ot.isInterleavedBufferAttribute){let et=ot.data,vt=et.stride,It=ot.offset;if(et.isInstancedInterleavedBuffer){for(let Tt=0;Tt<z.locationSize;Tt++)p(z.location+Tt,et.meshPerAttribute);v.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let Tt=0;Tt<z.locationSize;Tt++)m(z.location+Tt);s.bindBuffer(s.ARRAY_BUFFER,Jt);for(let Tt=0;Tt<z.locationSize;Tt++)T(z.location+Tt,xt/z.locationSize,ae,ht,vt*te,(It+xt/z.locationSize*Tt)*te,Y)}else{if(ot.isInstancedBufferAttribute){for(let et=0;et<z.locationSize;et++)p(z.location+et,ot.meshPerAttribute);v.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let et=0;et<z.locationSize;et++)m(z.location+et);s.bindBuffer(s.ARRAY_BUFFER,Jt);for(let et=0;et<z.locationSize;et++)T(z.location+et,xt/z.locationSize,ae,ht,xt*te,xt/z.locationSize*et*te,Y)}}else if(W!==void 0){let ht=W[Q];if(ht!==void 0)switch(ht.length){case 2:s.vertexAttrib2fv(z.location,ht);break;case 3:s.vertexAttrib3fv(z.location,ht);break;case 4:s.vertexAttrib4fv(z.location,ht);break;default:s.vertexAttrib1fv(z.location,ht)}}}}b()}function A(){D();for(let v in n){let I=n[v];for(let F in I){let B=I[F];for(let V in B)h(B[V].object),delete B[V];delete I[F]}delete n[v]}}function w(v){if(n[v.id]===void 0)return;let I=n[v.id];for(let F in I){let B=I[F];for(let V in B)h(B[V].object),delete B[V];delete I[F]}delete n[v.id]}function P(v){for(let I in n){let F=n[I];if(F[v.id]===void 0)continue;let B=F[v.id];for(let V in B)h(B[V].object),delete B[V];delete F[v.id]}}function D(){S(),a=!0,r!==i&&(r=i,c(r.object))}function S(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:D,resetDefaultState:S,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:m,disableUnusedAttributes:b}}function ng(s,t,e){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function o(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function l(c,h,u,d){if(u===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function ig(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let P=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(P){return!(P!==_n&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){let D=P===Ls&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==An&&n.convert(P)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==zn&&!D)}function l(P){if(P==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),b=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),T=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,w=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:T,maxFragmentUniforms:y,vertexTextures:A,maxSamples:w}}function sg(s){let t=this,e=null,n=0,i=!1,r=!1,a=new Pn,o=new Ht,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{let b=r?0:n,T=b*4,y=p.clippingState||null;l.value=y,y=h(g,d,T,f);for(let A=0;A!==T;++A)y[A]=e[A];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let p=f+_*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let T=0,y=f;T!==_;++T,y+=4)a.copy(u[T]).applyMatrix4(b,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function rg(s){let t=new WeakMap;function e(a,o){return o===go?a.mapping=Vi:o===_o&&(a.mapping=Wi),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===go||o===_o)if(t.has(a)){let l=t.get(a).texture;return e(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new za(l.height);return c.fromEquirectangularTexture(s,a),t.set(a,c),a.addEventListener("dispose",i),e(c.texture,a.mapping)}else return null}}return a}function i(a){let o=a.target;o.removeEventListener("dispose",i);let l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Os=4,Ku=[.125,.215,.35,.446,.526,.582],Ji=20,zc=new Or,Qu=new Lt,kc=null,Hc=0,Gc=0,Vc=!1,Zi=(1+Math.sqrt(5))/2,Ns=1/Zi,ju=[new R(-Zi,Ns,0),new R(Zi,Ns,0),new R(-Ns,0,Zi),new R(Ns,0,Zi),new R(0,Zi,-Ns),new R(0,Zi,Ns),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],ag=new R,zs=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100,r={}){let{size:a=256,position:o=ag}=r;kc=this._renderer.getRenderTarget(),Hc=this._renderer.getActiveCubeFace(),Gc=this._renderer.getActiveMipmapLevel(),Vc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=nd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ed(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(kc,Hc,Gc),this._renderer.xr.enabled=Vc,t.scissorTest=!1,tl(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Vi||t.mapping===Wi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),kc=this._renderer.getRenderTarget(),Hc=this._renderer.getActiveCubeFace(),Gc=this._renderer.getActiveMipmapLevel(),Vc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:nn,minFilter:nn,generateMipmaps:!1,type:Ls,format:_n,colorSpace:Ui,depthBuffer:!1},i=td(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=td(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=og(r)),this._blurMaterial=lg(r,t,e)}return i}_compileMaterial(t){let e=new Pt(this._lodPlanes[0],t);this._renderer.compile(e,zc)}_sceneToCubeUV(t,e,n,i,r){let l=new Ue(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Qu),u.toneMapping=ai,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null));let _=new Oe({name:"PMREM.Background",side:Be,depthWrite:!1,depthTest:!1}),m=new Pt(new Ye,_),p=!1,b=t.background;b?b.isColor&&(_.color.copy(b),t.background=null,p=!0):(_.color.copy(Qu),p=!0);for(let T=0;T<6;T++){let y=T%3;y===0?(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[T],r.y,r.z)):y===1?(l.up.set(0,0,c[T]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[T],r.z)):(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[T]));let A=this._cubeSize;tl(i,y*A,T>2?A:0,A,A),u.setRenderTarget(i),p&&u.render(m,l),u.render(t,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=b}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===Vi||t.mapping===Wi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=nd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ed());let r=i?this._cubemapMaterial:this._equirectMaterial,a=new Pt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let l=this._cubeSize;tl(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,zc)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodPlanes.length;for(let r=1;r<i;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=ju[(i-r-1)%ju.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,i,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",r),this._halfBlur(a,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Pt(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Ji-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Ji;m>Ji&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ji}`);let p=[],b=0;for(let P=0;P<Ji;++P){let D=P/_,S=Math.exp(-D*D/2);p.push(S),P===0?b+=S:P<m&&(b+=2*S)}for(let P=0;P<p.length;P++)p[P]=p[P]/b;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:T}=this;d.dTheta.value=g,d.mipInt.value=T-n;let y=this._sizeLods[i],A=3*y*(i>T-Os?i-T+Os:0),w=4*(this._cubeSize-y);tl(e,A,w,3*y,2*y),l.setRenderTarget(e),l.render(u,zc)}};function og(s){let t=[],e=[],n=[],i=s,r=s-Os+1+Ku.length;for(let a=0;a<r;a++){let o=Math.pow(2,i);e.push(o);let l=1/o;a>s-Os?l=Ku[a-s+Os-1]:a===0&&(l=0),n.push(l);let c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,b=new Float32Array(_*g*f),T=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let w=0;w<f;w++){let P=w%3*2/3-1,D=w>2?0:-1,S=[P,D,0,P+2/3,D,0,P+2/3,D+1,0,P,D,0,P+2/3,D+1,0,P,D+1,0];b.set(S,_*g*w),T.set(d,m*g*w);let v=[w,w,w,w,w,w];y.set(v,p*g*w)}let A=new _e;A.setAttribute("position",new Ne(b,_)),A.setAttribute("uv",new Ne(T,m)),A.setAttribute("faceIndex",new Ne(y,p)),t.push(A),i>Os&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function td(s,t,e){let n=new Fn(s,t,e);return n.texture.mapping=zr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function tl(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function lg(s,t,e){let n=new Float32Array(Ji),i=new R(0,1,0);return new rn({name:"SphericalGaussianBlur",defines:{n:Ji,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:th(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function ed(){return new rn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:th(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function nd(){return new rn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:th(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function th(){return`

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
	`}function cg(s){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){let l=o.mapping,c=l===go||l===_o,h=l===Vi||l===Wi;if(c||h){let u=t.get(o),d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new zs(s)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{let f=o.image;return c&&f&&f.height>0||h&&f&&i(f)?(e===null&&(e=new zs(s)),u=c?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function i(o){let l=0,c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){let l=o.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function hg(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Ss("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function ug(s,t,e,n){let i={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete i[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)t.update(d[f],s.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,g=u.attributes.position,_=0;if(f!==null){let b=f.array;_=f.version;for(let T=0,y=b.length;T<y;T+=3){let A=b[T+0],w=b[T+1],P=b[T+2];d.push(A,w,w,P,P,A)}}else if(g!==void 0){let b=g.array;_=g.version;for(let T=0,y=b.length/3-1;T<y;T+=3){let A=T+0,w=T+1,P=T+2;d.push(A,w,w,P,P,A)}}else return;let m=new(Lc(d)?gr:mr)(d,1);m.version=_;let p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function dg(s,t,e){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){s.drawElements(n,f,r,d*a),e.update(f,n,1)}function c(d,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,d*a,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,_){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/a,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let p=0;for(let b=0;b<g;b++)p+=f[b]*_[b];e.update(p,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function fg(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function pg(s,t,e){let n=new WeakMap,i=new oe;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(o);if(d===void 0||d.count!==u){let S=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],b=o.morphAttributes.color||[],T=0;f===!0&&(T=1),g===!0&&(T=2),_===!0&&(T=3);let y=o.attributes.position.count*T,A=1;y>t.maxTextureSize&&(A=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let w=new Float32Array(y*A*4*u),P=new dr(w,y,A,u);P.type=zn,P.needsUpdate=!0;let D=T*4;for(let v=0;v<u;v++){let I=m[v],F=p[v],B=b[v],V=y*A*4*v;for(let G=0;G<I.count;G++){let W=G*D;f===!0&&(i.fromBufferAttribute(I,G),w[V+W+0]=i.x,w[V+W+1]=i.y,w[V+W+2]=i.z,w[V+W+3]=0),g===!0&&(i.fromBufferAttribute(F,G),w[V+W+4]=i.x,w[V+W+5]=i.y,w[V+W+6]=i.z,w[V+W+7]=0),_===!0&&(i.fromBufferAttribute(B,G),w[V+W+8]=i.x,w[V+W+9]=i.y,w[V+W+10]=i.z,w[V+W+11]=B.itemSize===4?i.w:1)}}d={count:u,texture:P,size:new nt(y,A)},n.set(o,d),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function mg(s,t,e,n){let i=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=t.get(l,h);if(i.get(u)!==c&&(t.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function a(){i=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}var Md=new $e,id=new br(1,1),Sd=new dr,bd=new Oa,Td=new xr,sd=[],rd=[],ad=new Float32Array(16),od=new Float32Array(9),ld=new Float32Array(4);function ks(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=sd[i];if(r===void 0&&(r=new Float32Array(i),sd[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function Ie(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Pe(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function il(s,t){let e=rd[t];e===void 0&&(e=new Int32Array(t),rd[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function gg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function _g(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;s.uniform2fv(this.addr,t),Pe(e,t)}}function xg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ie(e,t))return;s.uniform3fv(this.addr,t),Pe(e,t)}}function yg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;s.uniform4fv(this.addr,t),Pe(e,t)}}function vg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Pe(e,t)}else{if(Ie(e,n))return;ld.set(n),s.uniformMatrix2fv(this.addr,!1,ld),Pe(e,n)}}function Mg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Pe(e,t)}else{if(Ie(e,n))return;od.set(n),s.uniformMatrix3fv(this.addr,!1,od),Pe(e,n)}}function Sg(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Pe(e,t)}else{if(Ie(e,n))return;ad.set(n),s.uniformMatrix4fv(this.addr,!1,ad),Pe(e,n)}}function bg(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Tg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;s.uniform2iv(this.addr,t),Pe(e,t)}}function Eg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;s.uniform3iv(this.addr,t),Pe(e,t)}}function wg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;s.uniform4iv(this.addr,t),Pe(e,t)}}function Ag(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Rg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;s.uniform2uiv(this.addr,t),Pe(e,t)}}function Cg(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;s.uniform3uiv(this.addr,t),Pe(e,t)}}function Ig(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;s.uniform4uiv(this.addr,t),Pe(e,t)}}function Pg(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(id.compareFunction=Pc,r=id):r=Md,e.setTexture2D(t||r,i)}function Dg(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||bd,i)}function Lg(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Td,i)}function Fg(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Sd,i)}function Ug(s){switch(s){case 5126:return gg;case 35664:return _g;case 35665:return xg;case 35666:return yg;case 35674:return vg;case 35675:return Mg;case 35676:return Sg;case 5124:case 35670:return bg;case 35667:case 35671:return Tg;case 35668:case 35672:return Eg;case 35669:case 35673:return wg;case 5125:return Ag;case 36294:return Rg;case 36295:return Cg;case 36296:return Ig;case 35678:case 36198:case 36298:case 36306:case 35682:return Pg;case 35679:case 36299:case 36307:return Dg;case 35680:case 36300:case 36308:case 36293:return Lg;case 36289:case 36303:case 36311:case 36292:return Fg}}function Ng(s,t){s.uniform1fv(this.addr,t)}function Og(s,t){let e=ks(t,this.size,2);s.uniform2fv(this.addr,e)}function Bg(s,t){let e=ks(t,this.size,3);s.uniform3fv(this.addr,e)}function zg(s,t){let e=ks(t,this.size,4);s.uniform4fv(this.addr,e)}function kg(s,t){let e=ks(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Hg(s,t){let e=ks(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Gg(s,t){let e=ks(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Vg(s,t){s.uniform1iv(this.addr,t)}function Wg(s,t){s.uniform2iv(this.addr,t)}function Xg(s,t){s.uniform3iv(this.addr,t)}function qg(s,t){s.uniform4iv(this.addr,t)}function Yg(s,t){s.uniform1uiv(this.addr,t)}function Zg(s,t){s.uniform2uiv(this.addr,t)}function Jg(s,t){s.uniform3uiv(this.addr,t)}function $g(s,t){s.uniform4uiv(this.addr,t)}function Kg(s,t,e){let n=this.cache,i=t.length,r=il(e,i);Ie(n,r)||(s.uniform1iv(this.addr,r),Pe(n,r));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||Md,r[a])}function Qg(s,t,e){let n=this.cache,i=t.length,r=il(e,i);Ie(n,r)||(s.uniform1iv(this.addr,r),Pe(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||bd,r[a])}function jg(s,t,e){let n=this.cache,i=t.length,r=il(e,i);Ie(n,r)||(s.uniform1iv(this.addr,r),Pe(n,r));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||Td,r[a])}function t_(s,t,e){let n=this.cache,i=t.length,r=il(e,i);Ie(n,r)||(s.uniform1iv(this.addr,r),Pe(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||Sd,r[a])}function e_(s){switch(s){case 5126:return Ng;case 35664:return Og;case 35665:return Bg;case 35666:return zg;case 35674:return kg;case 35675:return Hg;case 35676:return Gg;case 5124:case 35670:return Vg;case 35667:case 35671:return Wg;case 35668:case 35672:return Xg;case 35669:case 35673:return qg;case 5125:return Yg;case 36294:return Zg;case 36295:return Jg;case 36296:return $g;case 35678:case 36198:case 36298:case 36306:case 35682:return Kg;case 35679:case 36299:case 36307:return Qg;case 35680:case 36300:case 36308:case 36293:return jg;case 36289:case 36303:case 36311:case 36292:return t_}}var Xc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Ug(e.type)}},qc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=e_(e.type)}},Yc=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,a=i.length;r!==a;++r){let o=i[r];o.setValue(t,e[o.id],n)}}},Wc=/(\w+)(\])?(\[|\.)?/g;function cd(s,t){s.seq.push(t),s.map[t.id]=t}function n_(s,t,e){let n=s.name,i=n.length;for(Wc.lastIndex=0;;){let r=Wc.exec(n),a=Wc.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){cd(e,c===void 0?new Xc(o,s,t):new qc(o,s,t));break}else{let u=e.map[o];u===void 0&&(u=new Yc(o),cd(e,u)),e=u}}}var Bs=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=t.getActiveUniform(e,i),a=t.getUniformLocation(e,r.name);n_(r,a,this)}}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let a=t[i];a.id in e&&n.push(a)}return n}};function hd(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var i_=37297,s_=0;function r_(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var ud=new Ht;function a_(s){ee._getMatrix(ud,ee.workingColorSpace,s);let t=`mat3( ${ud.elements.map(e=>e.toFixed(4))} )`;switch(ee.getTransfer(s)){case cr:return[t,"LinearTransferOETF"];case le:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function dd(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+r_(s.getShaderSource(t),o)}else return r}function o_(s,t){let e=a_(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function l_(s,t){let e;switch(t){case Tu:e="Linear";break;case Eu:e="Reinhard";break;case wu:e="Cineon";break;case mo:e="ACESFilmic";break;case Ru:e="AgX";break;case Cu:e="Neutral";break;case Au:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var el=new R;function c_(){ee.getLuminanceCoefficients(el);let s=el.x.toFixed(4),t=el.y.toFixed(4),e=el.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function h_(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xr).join(`
`)}function u_(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function d_(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),a=r.name,o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function Xr(s){return s!==""}function fd(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function pd(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var f_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zc(s){return s.replace(f_,m_)}var p_=new Map;function m_(s,t){let e=Yt[t];if(e===void 0){let n=p_.get(t);if(n!==void 0)e=Yt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Zc(e)}var g_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function md(s){return s.replace(g_,__)}function __(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function gd(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}function x_(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===_c?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===ao?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===On&&(t="SHADOWMAP_TYPE_VSM"),t}function y_(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Vi:case Wi:t="ENVMAP_TYPE_CUBE";break;case zr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function v_(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Wi:t="ENVMAP_MODE_REFRACTION";break}return t}function M_(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case vc:t="ENVMAP_BLENDING_MULTIPLY";break;case Su:t="ENVMAP_BLENDING_MIX";break;case bu:t="ENVMAP_BLENDING_ADD";break}return t}function S_(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function b_(s,t,e,n){let i=s.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=x_(e),c=y_(e),h=v_(e),u=M_(e),d=S_(e),f=h_(e),g=u_(r),_=i.createProgram(),m,p,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Xr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Xr).join(`
`),p.length>0&&(p+=`
`)):(m=[gd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xr).join(`
`),p=[gd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ai?"#define TONE_MAPPING":"",e.toneMapping!==ai?Yt.tonemapping_pars_fragment:"",e.toneMapping!==ai?l_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,o_("linearToOutputTexel",e.outputColorSpace),c_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Xr).join(`
`)),a=Zc(a),a=fd(a,e),a=pd(a,e),o=Zc(o),o=fd(o,e),o=pd(o,e),a=md(a),o=md(o),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Dc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Dc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let T=b+m+a,y=b+p+o,A=hd(i,i.VERTEX_SHADER,T),w=hd(i,i.FRAGMENT_SHADER,y);i.attachShader(_,A),i.attachShader(_,w),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function P(I){if(s.debug.checkShaderErrors){let F=i.getProgramInfoLog(_)||"",B=i.getShaderInfoLog(A)||"",V=i.getShaderInfoLog(w)||"",G=F.trim(),W=B.trim(),Q=V.trim(),z=!0,ot=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(z=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,A,w);else{let ht=dd(i,A,"vertex"),xt=dd(i,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+G+`
`+ht+`
`+xt)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(W===""||Q==="")&&(ot=!1);ot&&(I.diagnostics={runnable:z,programLog:G,vertexShader:{log:W,prefix:m},fragmentShader:{log:Q,prefix:p}})}i.deleteShader(A),i.deleteShader(w),D=new Bs(i,_),S=d_(i,_)}let D;this.getUniforms=function(){return D===void 0&&P(this),D};let S;this.getAttributes=function(){return S===void 0&&P(this),S};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=i.getProgramParameter(_,i_)),v},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=s_++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=w,this}var T_=0,Jc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new $c(t),e.set(t,n)),n}},$c=class{constructor(t){this.id=T_++,this.code=t,this.usedTimes=0}};function E_(s,t,e,n,i,r,a){let o=new pr,l=new Jc,c=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures,f=i.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,v,I,F,B){let V=F.fog,G=B.geometry,W=S.isMeshStandardMaterial?F.environment:null,Q=(S.isMeshStandardMaterial?e:t).get(S.envMap||W),z=Q&&Q.mapping===zr?Q.image.height:null,ot=g[S.type];S.precision!==null&&(f=i.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));let ht=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,xt=ht!==void 0?ht.length:0,zt=0;G.morphAttributes.position!==void 0&&(zt=1),G.morphAttributes.normal!==void 0&&(zt=2),G.morphAttributes.color!==void 0&&(zt=3);let Jt,ae,te,Y;if(ot){let re=kn[ot];Jt=re.vertexShader,ae=re.fragmentShader}else Jt=S.vertexShader,ae=S.fragmentShader,l.update(S),te=l.getVertexShaderID(S),Y=l.getFragmentShaderID(S);let et=s.getRenderTarget(),vt=s.state.buffers.depth.getReversed(),It=B.isInstancedMesh===!0,Tt=B.isBatchedMesh===!0,$t=!!S.map,fe=!!S.matcap,C=!!Q,tt=!!S.aoMap,$=!!S.lightMap,J=!!S.bumpMap,Z=!!S.normalMap,ut=!!S.displacementMap,it=!!S.emissiveMap,dt=!!S.metalnessMap,Gt=!!S.roughnessMap,kt=S.anisotropy>0,E=S.clearcoat>0,x=S.dispersion>0,O=S.iridescence>0,X=S.sheen>0,j=S.transmission>0,q=kt&&!!S.anisotropyMap,Rt=E&&!!S.clearcoatMap,ct=E&&!!S.clearcoatNormalMap,Et=E&&!!S.clearcoatRoughnessMap,wt=O&&!!S.iridescenceMap,st=O&&!!S.iridescenceThicknessMap,_t=X&&!!S.sheenColorMap,Ot=X&&!!S.sheenRoughnessMap,Ct=!!S.specularMap,mt=!!S.specularColorMap,qt=!!S.specularIntensityMap,L=j&&!!S.transmissionMap,lt=j&&!!S.thicknessMap,ft=!!S.gradientMap,Mt=!!S.alphaMap,rt=S.alphaTest>0,K=!!S.alphaHash,At=!!S.extensions,Vt=ai;S.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Vt=s.toneMapping);let pe={shaderID:ot,shaderType:S.type,shaderName:S.name,vertexShader:Jt,fragmentShader:ae,defines:S.defines,customVertexShaderID:te,customFragmentShaderID:Y,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Tt,batchingColor:Tt&&B._colorsTexture!==null,instancing:It,instancingColor:It&&B.instanceColor!==null,instancingMorph:It&&B.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:et===null?s.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:Ui,alphaToCoverage:!!S.alphaToCoverage,map:$t,matcap:fe,envMap:C,envMapMode:C&&Q.mapping,envMapCubeUVHeight:z,aoMap:tt,lightMap:$,bumpMap:J,normalMap:Z,displacementMap:d&&ut,emissiveMap:it,normalMapObjectSpace:Z&&S.normalMapType===Lu,normalMapTangentSpace:Z&&S.normalMapType===Ic,metalnessMap:dt,roughnessMap:Gt,anisotropy:kt,anisotropyMap:q,clearcoat:E,clearcoatMap:Rt,clearcoatNormalMap:ct,clearcoatRoughnessMap:Et,dispersion:x,iridescence:O,iridescenceMap:wt,iridescenceThicknessMap:st,sheen:X,sheenColorMap:_t,sheenRoughnessMap:Ot,specularMap:Ct,specularColorMap:mt,specularIntensityMap:qt,transmission:j,transmissionMap:L,thicknessMap:lt,gradientMap:ft,opaque:S.transparent===!1&&S.blending===ni&&S.alphaToCoverage===!1,alphaMap:Mt,alphaTest:rt,alphaHash:K,combine:S.combine,mapUv:$t&&_(S.map.channel),aoMapUv:tt&&_(S.aoMap.channel),lightMapUv:$&&_(S.lightMap.channel),bumpMapUv:J&&_(S.bumpMap.channel),normalMapUv:Z&&_(S.normalMap.channel),displacementMapUv:ut&&_(S.displacementMap.channel),emissiveMapUv:it&&_(S.emissiveMap.channel),metalnessMapUv:dt&&_(S.metalnessMap.channel),roughnessMapUv:Gt&&_(S.roughnessMap.channel),anisotropyMapUv:q&&_(S.anisotropyMap.channel),clearcoatMapUv:Rt&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:ct&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Et&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:wt&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:st&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:_t&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:Ot&&_(S.sheenRoughnessMap.channel),specularMapUv:Ct&&_(S.specularMap.channel),specularColorMapUv:mt&&_(S.specularColorMap.channel),specularIntensityMapUv:qt&&_(S.specularIntensityMap.channel),transmissionMapUv:L&&_(S.transmissionMap.channel),thicknessMapUv:lt&&_(S.thicknessMap.channel),alphaMapUv:Mt&&_(S.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(Z||kt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!G.attributes.uv&&($t||Mt),fog:!!V,useFog:S.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:vt,skinning:B.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:xt,morphTextureStride:zt,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&I.length>0,shadowMapType:s.shadowMap.type,toneMapping:Vt,decodeVideoTexture:$t&&S.map.isVideoTexture===!0&&ee.getTransfer(S.map.colorSpace)===le,decodeVideoTextureEmissive:it&&S.emissiveMap.isVideoTexture===!0&&ee.getTransfer(S.emissiveMap.colorSpace)===le,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===He,flipSided:S.side===Be,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:At&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(At&&S.extensions.multiDraw===!0||Tt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return pe.vertexUv1s=c.has(1),pe.vertexUv2s=c.has(2),pe.vertexUv3s=c.has(3),c.clear(),pe}function p(S){let v=[];if(S.shaderID?v.push(S.shaderID):(v.push(S.customVertexShaderID),v.push(S.customFragmentShaderID)),S.defines!==void 0)for(let I in S.defines)v.push(I),v.push(S.defines[I]);return S.isRawShaderMaterial===!1&&(b(v,S),T(v,S),v.push(s.outputColorSpace)),v.push(S.customProgramCacheKey),v.join()}function b(S,v){S.push(v.precision),S.push(v.outputColorSpace),S.push(v.envMapMode),S.push(v.envMapCubeUVHeight),S.push(v.mapUv),S.push(v.alphaMapUv),S.push(v.lightMapUv),S.push(v.aoMapUv),S.push(v.bumpMapUv),S.push(v.normalMapUv),S.push(v.displacementMapUv),S.push(v.emissiveMapUv),S.push(v.metalnessMapUv),S.push(v.roughnessMapUv),S.push(v.anisotropyMapUv),S.push(v.clearcoatMapUv),S.push(v.clearcoatNormalMapUv),S.push(v.clearcoatRoughnessMapUv),S.push(v.iridescenceMapUv),S.push(v.iridescenceThicknessMapUv),S.push(v.sheenColorMapUv),S.push(v.sheenRoughnessMapUv),S.push(v.specularMapUv),S.push(v.specularColorMapUv),S.push(v.specularIntensityMapUv),S.push(v.transmissionMapUv),S.push(v.thicknessMapUv),S.push(v.combine),S.push(v.fogExp2),S.push(v.sizeAttenuation),S.push(v.morphTargetsCount),S.push(v.morphAttributeCount),S.push(v.numDirLights),S.push(v.numPointLights),S.push(v.numSpotLights),S.push(v.numSpotLightMaps),S.push(v.numHemiLights),S.push(v.numRectAreaLights),S.push(v.numDirLightShadows),S.push(v.numPointLightShadows),S.push(v.numSpotLightShadows),S.push(v.numSpotLightShadowsWithMaps),S.push(v.numLightProbes),S.push(v.shadowMapType),S.push(v.toneMapping),S.push(v.numClippingPlanes),S.push(v.numClipIntersection),S.push(v.depthPacking)}function T(S,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),v.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reversedDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),S.push(o.mask)}function y(S){let v=g[S.type],I;if(v){let F=kn[v];I=Wu.clone(F.uniforms)}else I=S.uniforms;return I}function A(S,v){let I;for(let F=0,B=h.length;F<B;F++){let V=h[F];if(V.cacheKey===v){I=V,++I.usedTimes;break}}return I===void 0&&(I=new b_(s,v,S,r),h.push(I)),I}function w(S){if(--S.usedTimes===0){let v=h.indexOf(S);h[v]=h[h.length-1],h.pop(),S.destroy()}}function P(S){l.remove(S)}function D(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:A,releaseProgram:w,releaseShaderCache:P,programs:h,dispose:D}}function w_(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function A_(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function _d(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function xd(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(u,d,f,g,_,m){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},s[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function o(u,d,f,g,_,m){let p=a(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):e.push(p)}function l(u,d,f,g,_,m){let p=a(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||A_),n.length>1&&n.sort(d||_d),i.length>1&&i.sort(d||_d)}function h(){for(let u=t,d=s.length;u<d;u++){let f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:o,unshift:l,finish:h,sort:c}}function R_(){let s=new WeakMap;function t(n,i){let r=s.get(n),a;return r===void 0?(a=new xd,s.set(n,[a])):i>=r.length?(a=new xd,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function C_(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new Lt};break;case"SpotLight":e={position:new R,direction:new R,color:new Lt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new Lt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new Lt,groundColor:new Lt};break;case"RectAreaLight":e={color:new Lt,position:new R,halfWidth:new R,halfHeight:new R};break}return s[t.id]=e,e}}}function I_(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var P_=0;function D_(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function L_(s){let t=new C_,e=I_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);let i=new R,r=new jt,a=new jt;function o(c){let h=0,u=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,b=0,T=0,y=0,A=0,w=0,P=0;c.sort(D_);for(let S=0,v=c.length;S<v;S++){let I=c[S],F=I.color,B=I.intensity,V=I.distance,G=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=F.r*B,u+=F.g*B,d+=F.b*B;else if(I.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(I.sh.coefficients[W],B);P++}else if(I.isDirectionalLight){let W=t.get(I);if(W.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let Q=I.shadow,z=e.get(I);z.shadowIntensity=Q.intensity,z.shadowBias=Q.bias,z.shadowNormalBias=Q.normalBias,z.shadowRadius=Q.radius,z.shadowMapSize=Q.mapSize,n.directionalShadow[f]=z,n.directionalShadowMap[f]=G,n.directionalShadowMatrix[f]=I.shadow.matrix,b++}n.directional[f]=W,f++}else if(I.isSpotLight){let W=t.get(I);W.position.setFromMatrixPosition(I.matrixWorld),W.color.copy(F).multiplyScalar(B),W.distance=V,W.coneCos=Math.cos(I.angle),W.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),W.decay=I.decay,n.spot[_]=W;let Q=I.shadow;if(I.map&&(n.spotLightMap[A]=I.map,A++,Q.updateMatrices(I),I.castShadow&&w++),n.spotLightMatrix[_]=Q.matrix,I.castShadow){let z=e.get(I);z.shadowIntensity=Q.intensity,z.shadowBias=Q.bias,z.shadowNormalBias=Q.normalBias,z.shadowRadius=Q.radius,z.shadowMapSize=Q.mapSize,n.spotShadow[_]=z,n.spotShadowMap[_]=G,y++}_++}else if(I.isRectAreaLight){let W=t.get(I);W.color.copy(F).multiplyScalar(B),W.halfWidth.set(I.width*.5,0,0),W.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=W,m++}else if(I.isPointLight){let W=t.get(I);if(W.color.copy(I.color).multiplyScalar(I.intensity),W.distance=I.distance,W.decay=I.decay,I.castShadow){let Q=I.shadow,z=e.get(I);z.shadowIntensity=Q.intensity,z.shadowBias=Q.bias,z.shadowNormalBias=Q.normalBias,z.shadowRadius=Q.radius,z.shadowMapSize=Q.mapSize,z.shadowCameraNear=Q.camera.near,z.shadowCameraFar=Q.camera.far,n.pointShadow[g]=z,n.pointShadowMap[g]=G,n.pointShadowMatrix[g]=I.shadow.matrix,T++}n.point[g]=W,g++}else if(I.isHemisphereLight){let W=t.get(I);W.skyColor.copy(I.color).multiplyScalar(B),W.groundColor.copy(I.groundColor).multiplyScalar(B),n.hemi[p]=W,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pt.LTC_FLOAT_1,n.rectAreaLTC2=pt.LTC_FLOAT_2):(n.rectAreaLTC1=pt.LTC_HALF_1,n.rectAreaLTC2=pt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let D=n.hash;(D.directionalLength!==f||D.pointLength!==g||D.spotLength!==_||D.rectAreaLength!==m||D.hemiLength!==p||D.numDirectionalShadows!==b||D.numPointShadows!==T||D.numSpotShadows!==y||D.numSpotMaps!==A||D.numLightProbes!==P)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=y+A-w,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=P,D.directionalLength=f,D.pointLength=g,D.spotLength=_,D.rectAreaLength=m,D.hemiLength=p,D.numDirectionalShadows=b,D.numPointShadows=T,D.numSpotShadows=y,D.numSpotMaps=A,D.numLightProbes=P,n.version=P_++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0,m=h.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){let T=c[p];if(T.isDirectionalLight){let y=n.directional[u];y.direction.setFromMatrixPosition(T.matrixWorld),i.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),u++}else if(T.isSpotLight){let y=n.spot[f];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(T.matrixWorld),i.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),f++}else if(T.isRectAreaLight){let y=n.rectArea[g];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(T.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(T.width*.5,0,0),y.halfHeight.set(0,T.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(T.isPointLight){let y=n.point[d];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(m),d++}else if(T.isHemisphereLight){let y=n.hemi[_];y.direction.setFromMatrixPosition(T.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function yd(s){let t=new L_(s),e=[],n=[];function i(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}let c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function F_(s){let t=new WeakMap;function e(i,r=0){let a=t.get(i),o;return a===void 0?(o=new yd(s),t.set(i,[o])):r>=a.length?(o=new yd(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var U_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,N_=`uniform sampler2D shadow_pass;
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
}`;function O_(s,t,e){let n=new ws,i=new nt,r=new nt,a=new oe,o=new Ya({depthPacking:Du}),l=new Za,c={},h=e.maxTextureSize,u={[ei]:Be,[Be]:ei,[He]:He},d=new rn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new nt},radius:{value:4}},vertexShader:U_,fragmentShader:N_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new _e;g.setAttribute("position",new Ne(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Pt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_c;let p=this.type;this.render=function(w,P,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;let S=s.getRenderTarget(),v=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),F=s.state;F.setBlending(ri),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let B=p!==On&&this.type===On,V=p===On&&this.type!==On;for(let G=0,W=w.length;G<W;G++){let Q=w[G],z=Q.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;i.copy(z.mapSize);let ot=z.getFrameExtents();if(i.multiply(ot),r.copy(z.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/ot.x),i.x=r.x*ot.x,z.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/ot.y),i.y=r.y*ot.y,z.mapSize.y=r.y)),z.map===null||B===!0||V===!0){let xt=this.type!==On?{minFilter:mn,magFilter:mn}:{};z.map!==null&&z.map.dispose(),z.map=new Fn(i.x,i.y,xt),z.map.texture.name=Q.name+".shadowMap",z.camera.updateProjectionMatrix()}s.setRenderTarget(z.map),s.clear();let ht=z.getViewportCount();for(let xt=0;xt<ht;xt++){let zt=z.getViewport(xt);a.set(r.x*zt.x,r.y*zt.y,r.x*zt.z,r.y*zt.w),F.viewport(a),z.updateMatrices(Q,xt),n=z.getFrustum(),y(P,D,z.camera,Q,this.type)}z.isPointLightShadow!==!0&&this.type===On&&b(z,D),z.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(S,v,I)};function b(w,P){let D=t.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Fn(i.x,i.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(P,null,D,d,_,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(P,null,D,f,_,null)}function T(w,P,D,S){let v=null,I=D.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(I!==void 0)v=I;else if(v=D.isPointLight===!0?l:o,s.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let F=v.uuid,B=P.uuid,V=c[F];V===void 0&&(V={},c[F]=V);let G=V[B];G===void 0&&(G=v.clone(),V[B]=G,P.addEventListener("dispose",A)),v=G}if(v.visible=P.visible,v.wireframe=P.wireframe,S===On?v.side=P.shadowSide!==null?P.shadowSide:P.side:v.side=P.shadowSide!==null?P.shadowSide:u[P.side],v.alphaMap=P.alphaMap,v.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,v.map=P.map,v.clipShadows=P.clipShadows,v.clippingPlanes=P.clippingPlanes,v.clipIntersection=P.clipIntersection,v.displacementMap=P.displacementMap,v.displacementScale=P.displacementScale,v.displacementBias=P.displacementBias,v.wireframeLinewidth=P.wireframeLinewidth,v.linewidth=P.linewidth,D.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let F=s.properties.get(v);F.light=D}return v}function y(w,P,D,S,v){if(w.visible===!1)return;if(w.layers.test(P.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&v===On)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,w.matrixWorld);let B=t.update(w),V=w.material;if(Array.isArray(V)){let G=B.groups;for(let W=0,Q=G.length;W<Q;W++){let z=G[W],ot=V[z.materialIndex];if(ot&&ot.visible){let ht=T(w,ot,S,v);w.onBeforeShadow(s,w,P,D,B,ht,z),s.renderBufferDirect(D,null,B,ht,w,z),w.onAfterShadow(s,w,P,D,B,ht,z)}}}else if(V.visible){let G=T(w,V,S,v);w.onBeforeShadow(s,w,P,D,B,G,null),s.renderBufferDirect(D,null,B,G,w,null),w.onAfterShadow(s,w,P,D,B,G,null)}}let F=w.children;for(let B=0,V=F.length;B<V;B++)y(F[B],P,D,S,v)}function A(w){w.target.removeEventListener("dispose",A);for(let D in c){let S=c[D],v=w.target.uuid;v in S&&(S[v].dispose(),delete S[v])}}}var B_={[oo]:lo,[co]:fo,[ho]:po,[Fi]:uo,[lo]:oo,[fo]:co,[po]:ho,[uo]:Fi};function z_(s,t){function e(){let L=!1,lt=new oe,ft=null,Mt=new oe(0,0,0,0);return{setMask:function(rt){ft!==rt&&!L&&(s.colorMask(rt,rt,rt,rt),ft=rt)},setLocked:function(rt){L=rt},setClear:function(rt,K,At,Vt,pe){pe===!0&&(rt*=Vt,K*=Vt,At*=Vt),lt.set(rt,K,At,Vt),Mt.equals(lt)===!1&&(s.clearColor(rt,K,At,Vt),Mt.copy(lt))},reset:function(){L=!1,ft=null,Mt.set(-1,0,0,0)}}}function n(){let L=!1,lt=!1,ft=null,Mt=null,rt=null;return{setReversed:function(K){if(lt!==K){let At=t.get("EXT_clip_control");K?At.clipControlEXT(At.LOWER_LEFT_EXT,At.ZERO_TO_ONE_EXT):At.clipControlEXT(At.LOWER_LEFT_EXT,At.NEGATIVE_ONE_TO_ONE_EXT),lt=K;let Vt=rt;rt=null,this.setClear(Vt)}},getReversed:function(){return lt},setTest:function(K){K?et(s.DEPTH_TEST):vt(s.DEPTH_TEST)},setMask:function(K){ft!==K&&!L&&(s.depthMask(K),ft=K)},setFunc:function(K){if(lt&&(K=B_[K]),Mt!==K){switch(K){case oo:s.depthFunc(s.NEVER);break;case lo:s.depthFunc(s.ALWAYS);break;case co:s.depthFunc(s.LESS);break;case Fi:s.depthFunc(s.LEQUAL);break;case ho:s.depthFunc(s.EQUAL);break;case uo:s.depthFunc(s.GEQUAL);break;case fo:s.depthFunc(s.GREATER);break;case po:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Mt=K}},setLocked:function(K){L=K},setClear:function(K){rt!==K&&(lt&&(K=1-K),s.clearDepth(K),rt=K)},reset:function(){L=!1,ft=null,Mt=null,rt=null,lt=!1}}}function i(){let L=!1,lt=null,ft=null,Mt=null,rt=null,K=null,At=null,Vt=null,pe=null;return{setTest:function(re){L||(re?et(s.STENCIL_TEST):vt(s.STENCIL_TEST))},setMask:function(re){lt!==re&&!L&&(s.stencilMask(re),lt=re)},setFunc:function(re,qn,In){(ft!==re||Mt!==qn||rt!==In)&&(s.stencilFunc(re,qn,In),ft=re,Mt=qn,rt=In)},setOp:function(re,qn,In){(K!==re||At!==qn||Vt!==In)&&(s.stencilOp(re,qn,In),K=re,At=qn,Vt=In)},setLocked:function(re){L=re},setClear:function(re){pe!==re&&(s.clearStencil(re),pe=re)},reset:function(){L=!1,lt=null,ft=null,Mt=null,rt=null,K=null,At=null,Vt=null,pe=null}}}let r=new e,a=new n,o=new i,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,b=null,T=null,y=null,A=null,w=null,P=new Lt(0,0,0),D=0,S=!1,v=null,I=null,F=null,B=null,V=null,G=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),W=!1,Q=0,z=s.getParameter(s.VERSION);z.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(z)[1]),W=Q>=1):z.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),W=Q>=2);let ot=null,ht={},xt=s.getParameter(s.SCISSOR_BOX),zt=s.getParameter(s.VIEWPORT),Jt=new oe().fromArray(xt),ae=new oe().fromArray(zt);function te(L,lt,ft,Mt){let rt=new Uint8Array(4),K=s.createTexture();s.bindTexture(L,K),s.texParameteri(L,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(L,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let At=0;At<ft;At++)L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY?s.texImage3D(lt,0,s.RGBA,1,1,Mt,0,s.RGBA,s.UNSIGNED_BYTE,rt):s.texImage2D(lt+At,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,rt);return K}let Y={};Y[s.TEXTURE_2D]=te(s.TEXTURE_2D,s.TEXTURE_2D,1),Y[s.TEXTURE_CUBE_MAP]=te(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[s.TEXTURE_2D_ARRAY]=te(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Y[s.TEXTURE_3D]=te(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),et(s.DEPTH_TEST),a.setFunc(Fi),J(!1),Z(gc),et(s.CULL_FACE),tt(ri);function et(L){h[L]!==!0&&(s.enable(L),h[L]=!0)}function vt(L){h[L]!==!1&&(s.disable(L),h[L]=!1)}function It(L,lt){return u[L]!==lt?(s.bindFramebuffer(L,lt),u[L]=lt,L===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=lt),L===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=lt),!0):!1}function Tt(L,lt){let ft=f,Mt=!1;if(L){ft=d.get(lt),ft===void 0&&(ft=[],d.set(lt,ft));let rt=L.textures;if(ft.length!==rt.length||ft[0]!==s.COLOR_ATTACHMENT0){for(let K=0,At=rt.length;K<At;K++)ft[K]=s.COLOR_ATTACHMENT0+K;ft.length=rt.length,Mt=!0}}else ft[0]!==s.BACK&&(ft[0]=s.BACK,Mt=!0);Mt&&s.drawBuffers(ft)}function $t(L){return g!==L?(s.useProgram(L),g=L,!0):!1}let fe={[gi]:s.FUNC_ADD,[ru]:s.FUNC_SUBTRACT,[au]:s.FUNC_REVERSE_SUBTRACT};fe[ou]=s.MIN,fe[lu]=s.MAX;let C={[cu]:s.ZERO,[hu]:s.ONE,[uu]:s.SRC_COLOR,[Ca]:s.SRC_ALPHA,[_u]:s.SRC_ALPHA_SATURATE,[mu]:s.DST_COLOR,[fu]:s.DST_ALPHA,[du]:s.ONE_MINUS_SRC_COLOR,[Ia]:s.ONE_MINUS_SRC_ALPHA,[gu]:s.ONE_MINUS_DST_COLOR,[pu]:s.ONE_MINUS_DST_ALPHA,[xu]:s.CONSTANT_COLOR,[yu]:s.ONE_MINUS_CONSTANT_COLOR,[vu]:s.CONSTANT_ALPHA,[Mu]:s.ONE_MINUS_CONSTANT_ALPHA};function tt(L,lt,ft,Mt,rt,K,At,Vt,pe,re){if(L===ri){_===!0&&(vt(s.BLEND),_=!1);return}if(_===!1&&(et(s.BLEND),_=!0),L!==su){if(L!==m||re!==S){if((p!==gi||y!==gi)&&(s.blendEquation(s.FUNC_ADD),p=gi,y=gi),re)switch(L){case ni:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case gn:s.blendFunc(s.ONE,s.ONE);break;case xc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case yc:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case ni:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case gn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case xc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case yc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}b=null,T=null,A=null,w=null,P.set(0,0,0),D=0,m=L,S=re}return}rt=rt||lt,K=K||ft,At=At||Mt,(lt!==p||rt!==y)&&(s.blendEquationSeparate(fe[lt],fe[rt]),p=lt,y=rt),(ft!==b||Mt!==T||K!==A||At!==w)&&(s.blendFuncSeparate(C[ft],C[Mt],C[K],C[At]),b=ft,T=Mt,A=K,w=At),(Vt.equals(P)===!1||pe!==D)&&(s.blendColor(Vt.r,Vt.g,Vt.b,pe),P.copy(Vt),D=pe),m=L,S=!1}function $(L,lt){L.side===He?vt(s.CULL_FACE):et(s.CULL_FACE);let ft=L.side===Be;lt&&(ft=!ft),J(ft),L.blending===ni&&L.transparent===!1?tt(ri):tt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);let Mt=L.stencilWrite;o.setTest(Mt),Mt&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),it(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?et(s.SAMPLE_ALPHA_TO_COVERAGE):vt(s.SAMPLE_ALPHA_TO_COVERAGE)}function J(L){v!==L&&(L?s.frontFace(s.CW):s.frontFace(s.CCW),v=L)}function Z(L){L!==nu?(et(s.CULL_FACE),L!==I&&(L===gc?s.cullFace(s.BACK):L===iu?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):vt(s.CULL_FACE),I=L}function ut(L){L!==F&&(W&&s.lineWidth(L),F=L)}function it(L,lt,ft){L?(et(s.POLYGON_OFFSET_FILL),(B!==lt||V!==ft)&&(s.polygonOffset(lt,ft),B=lt,V=ft)):vt(s.POLYGON_OFFSET_FILL)}function dt(L){L?et(s.SCISSOR_TEST):vt(s.SCISSOR_TEST)}function Gt(L){L===void 0&&(L=s.TEXTURE0+G-1),ot!==L&&(s.activeTexture(L),ot=L)}function kt(L,lt,ft){ft===void 0&&(ot===null?ft=s.TEXTURE0+G-1:ft=ot);let Mt=ht[ft];Mt===void 0&&(Mt={type:void 0,texture:void 0},ht[ft]=Mt),(Mt.type!==L||Mt.texture!==lt)&&(ot!==ft&&(s.activeTexture(ft),ot=ft),s.bindTexture(L,lt||Y[L]),Mt.type=L,Mt.texture=lt)}function E(){let L=ht[ot];L!==void 0&&L.type!==void 0&&(s.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function x(){try{s.compressedTexImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function O(){try{s.compressedTexImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function X(){try{s.texSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function j(){try{s.texSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{s.compressedTexSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Rt(){try{s.compressedTexSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ct(){try{s.texStorage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Et(){try{s.texStorage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function wt(){try{s.texImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function st(){try{s.texImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function _t(L){Jt.equals(L)===!1&&(s.scissor(L.x,L.y,L.z,L.w),Jt.copy(L))}function Ot(L){ae.equals(L)===!1&&(s.viewport(L.x,L.y,L.z,L.w),ae.copy(L))}function Ct(L,lt){let ft=c.get(lt);ft===void 0&&(ft=new WeakMap,c.set(lt,ft));let Mt=ft.get(L);Mt===void 0&&(Mt=s.getUniformBlockIndex(lt,L.name),ft.set(L,Mt))}function mt(L,lt){let Mt=c.get(lt).get(L);l.get(lt)!==Mt&&(s.uniformBlockBinding(lt,Mt,L.__bindingPointIndex),l.set(lt,Mt))}function qt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},ot=null,ht={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,b=null,T=null,y=null,A=null,w=null,P=new Lt(0,0,0),D=0,S=!1,v=null,I=null,F=null,B=null,V=null,Jt.set(0,0,s.canvas.width,s.canvas.height),ae.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:et,disable:vt,bindFramebuffer:It,drawBuffers:Tt,useProgram:$t,setBlending:tt,setMaterial:$,setFlipSided:J,setCullFace:Z,setLineWidth:ut,setPolygonOffset:it,setScissorTest:dt,activeTexture:Gt,bindTexture:kt,unbindTexture:E,compressedTexImage2D:x,compressedTexImage3D:O,texImage2D:wt,texImage3D:st,updateUBOMapping:Ct,uniformBlockBinding:mt,texStorage2D:ct,texStorage3D:Et,texSubImage2D:X,texSubImage3D:j,compressedTexSubImage2D:q,compressedTexSubImage3D:Rt,scissor:_t,viewport:Ot,reset:qt}}function k_(s,t,e,n,i,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator=="undefined"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new nt,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas!="undefined"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(E){}function g(E,x){return f?new OffscreenCanvas(E,x):ur("canvas")}function _(E,x,O){let X=1,j=kt(E);if((j.width>O||j.height>O)&&(X=O/Math.max(j.width,j.height)),X<1)if(typeof HTMLImageElement!="undefined"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement!="undefined"&&E instanceof HTMLCanvasElement||typeof ImageBitmap!="undefined"&&E instanceof ImageBitmap||typeof VideoFrame!="undefined"&&E instanceof VideoFrame){let q=Math.floor(X*j.width),Rt=Math.floor(X*j.height);u===void 0&&(u=g(q,Rt));let ct=x?g(q,Rt):u;return ct.width=q,ct.height=Rt,ct.getContext("2d").drawImage(E,0,0,q,Rt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+q+"x"+Rt+")."),ct}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),E;return E}function m(E){return E.generateMipmaps}function p(E){s.generateMipmap(E)}function b(E){return E.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?s.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function T(E,x,O,X,j=!1){if(E!==null){if(s[E]!==void 0)return s[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let q=x;if(x===s.RED&&(O===s.FLOAT&&(q=s.R32F),O===s.HALF_FLOAT&&(q=s.R16F),O===s.UNSIGNED_BYTE&&(q=s.R8)),x===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(q=s.R8UI),O===s.UNSIGNED_SHORT&&(q=s.R16UI),O===s.UNSIGNED_INT&&(q=s.R32UI),O===s.BYTE&&(q=s.R8I),O===s.SHORT&&(q=s.R16I),O===s.INT&&(q=s.R32I)),x===s.RG&&(O===s.FLOAT&&(q=s.RG32F),O===s.HALF_FLOAT&&(q=s.RG16F),O===s.UNSIGNED_BYTE&&(q=s.RG8)),x===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(q=s.RG8UI),O===s.UNSIGNED_SHORT&&(q=s.RG16UI),O===s.UNSIGNED_INT&&(q=s.RG32UI),O===s.BYTE&&(q=s.RG8I),O===s.SHORT&&(q=s.RG16I),O===s.INT&&(q=s.RG32I)),x===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(q=s.RGB8UI),O===s.UNSIGNED_SHORT&&(q=s.RGB16UI),O===s.UNSIGNED_INT&&(q=s.RGB32UI),O===s.BYTE&&(q=s.RGB8I),O===s.SHORT&&(q=s.RGB16I),O===s.INT&&(q=s.RGB32I)),x===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(q=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(q=s.RGBA16UI),O===s.UNSIGNED_INT&&(q=s.RGBA32UI),O===s.BYTE&&(q=s.RGBA8I),O===s.SHORT&&(q=s.RGBA16I),O===s.INT&&(q=s.RGBA32I)),x===s.RGB&&(O===s.UNSIGNED_INT_5_9_9_9_REV&&(q=s.RGB9_E5),O===s.UNSIGNED_INT_10F_11F_11F_REV&&(q=s.R11F_G11F_B10F)),x===s.RGBA){let Rt=j?cr:ee.getTransfer(X);O===s.FLOAT&&(q=s.RGBA32F),O===s.HALF_FLOAT&&(q=s.RGBA16F),O===s.UNSIGNED_BYTE&&(q=Rt===le?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT_4_4_4_4&&(q=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(q=s.RGB5_A1)}return(q===s.R16F||q===s.R32F||q===s.RG16F||q===s.RG32F||q===s.RGBA16F||q===s.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function y(E,x){let O;return E?x===null||x===bi||x===Fs?O=s.DEPTH24_STENCIL8:x===zn?O=s.DEPTH32F_STENCIL8:x===Ds&&(O=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===bi||x===Fs?O=s.DEPTH_COMPONENT24:x===zn?O=s.DEPTH_COMPONENT32F:x===Ds&&(O=s.DEPTH_COMPONENT16),O}function A(E,x){return m(E)===!0||E.isFramebufferTexture&&E.minFilter!==mn&&E.minFilter!==nn?Math.log2(Math.max(x.width,x.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?x.mipmaps.length:1}function w(E){let x=E.target;x.removeEventListener("dispose",w),D(x),x.isVideoTexture&&h.delete(x)}function P(E){let x=E.target;x.removeEventListener("dispose",P),v(x)}function D(E){let x=n.get(E);if(x.__webglInit===void 0)return;let O=E.source,X=d.get(O);if(X){let j=X[x.__cacheKey];j.usedTimes--,j.usedTimes===0&&S(E),Object.keys(X).length===0&&d.delete(O)}n.remove(E)}function S(E){let x=n.get(E);s.deleteTexture(x.__webglTexture);let O=E.source,X=d.get(O);delete X[x.__cacheKey],a.memory.textures--}function v(E){let x=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(x.__webglFramebuffer[X]))for(let j=0;j<x.__webglFramebuffer[X].length;j++)s.deleteFramebuffer(x.__webglFramebuffer[X][j]);else s.deleteFramebuffer(x.__webglFramebuffer[X]);x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer[X])}else{if(Array.isArray(x.__webglFramebuffer))for(let X=0;X<x.__webglFramebuffer.length;X++)s.deleteFramebuffer(x.__webglFramebuffer[X]);else s.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&s.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&s.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let X=0;X<x.__webglColorRenderbuffer.length;X++)x.__webglColorRenderbuffer[X]&&s.deleteRenderbuffer(x.__webglColorRenderbuffer[X]);x.__webglDepthRenderbuffer&&s.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let O=E.textures;for(let X=0,j=O.length;X<j;X++){let q=n.get(O[X]);q.__webglTexture&&(s.deleteTexture(q.__webglTexture),a.memory.textures--),n.remove(O[X])}n.remove(E)}let I=0;function F(){I=0}function B(){let E=I;return E>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+i.maxTextures),I+=1,E}function V(E){let x=[];return x.push(E.wrapS),x.push(E.wrapT),x.push(E.wrapR||0),x.push(E.magFilter),x.push(E.minFilter),x.push(E.anisotropy),x.push(E.internalFormat),x.push(E.format),x.push(E.type),x.push(E.generateMipmaps),x.push(E.premultiplyAlpha),x.push(E.flipY),x.push(E.unpackAlignment),x.push(E.colorSpace),x.join()}function G(E,x){let O=n.get(E);if(E.isVideoTexture&&dt(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&O.__version!==E.version){let X=E.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(O,E,x);return}}else E.isExternalTexture&&(O.__webglTexture=E.sourceTexture?E.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+x)}function W(E,x){let O=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){Y(O,E,x);return}e.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+x)}function Q(E,x){let O=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){Y(O,E,x);return}e.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+x)}function z(E,x){let O=n.get(E);if(E.version>0&&O.__version!==E.version){et(O,E,x);return}e.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+x)}let ot={[ii]:s.REPEAT,[mi]:s.CLAMP_TO_EDGE,[Pa]:s.MIRRORED_REPEAT},ht={[mn]:s.NEAREST,[Iu]:s.NEAREST_MIPMAP_NEAREST,[kr]:s.NEAREST_MIPMAP_LINEAR,[nn]:s.LINEAR,[xo]:s.LINEAR_MIPMAP_NEAREST,[Bn]:s.LINEAR_MIPMAP_LINEAR},xt={[Fu]:s.NEVER,[ku]:s.ALWAYS,[Uu]:s.LESS,[Pc]:s.LEQUAL,[Nu]:s.EQUAL,[zu]:s.GEQUAL,[Ou]:s.GREATER,[Bu]:s.NOTEQUAL};function zt(E,x){if(x.type===zn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===nn||x.magFilter===xo||x.magFilter===kr||x.magFilter===Bn||x.minFilter===nn||x.minFilter===xo||x.minFilter===kr||x.minFilter===Bn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(E,s.TEXTURE_WRAP_S,ot[x.wrapS]),s.texParameteri(E,s.TEXTURE_WRAP_T,ot[x.wrapT]),(E===s.TEXTURE_3D||E===s.TEXTURE_2D_ARRAY)&&s.texParameteri(E,s.TEXTURE_WRAP_R,ot[x.wrapR]),s.texParameteri(E,s.TEXTURE_MAG_FILTER,ht[x.magFilter]),s.texParameteri(E,s.TEXTURE_MIN_FILTER,ht[x.minFilter]),x.compareFunction&&(s.texParameteri(E,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(E,s.TEXTURE_COMPARE_FUNC,xt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===mn||x.minFilter!==kr&&x.minFilter!==Bn||x.type===zn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let O=t.get("EXT_texture_filter_anisotropic");s.texParameterf(E,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Jt(E,x){let O=!1;E.__webglInit===void 0&&(E.__webglInit=!0,x.addEventListener("dispose",w));let X=x.source,j=d.get(X);j===void 0&&(j={},d.set(X,j));let q=V(x);if(q!==E.__cacheKey){j[q]===void 0&&(j[q]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,O=!0),j[q].usedTimes++;let Rt=j[E.__cacheKey];Rt!==void 0&&(j[E.__cacheKey].usedTimes--,Rt.usedTimes===0&&S(x)),E.__cacheKey=q,E.__webglTexture=j[q].texture}return O}function ae(E,x,O){return Math.floor(Math.floor(E/O)/x)}function te(E,x,O,X){let q=E.updateRanges;if(q.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,x.width,x.height,O,X,x.data);else{q.sort((st,_t)=>st.start-_t.start);let Rt=0;for(let st=1;st<q.length;st++){let _t=q[Rt],Ot=q[st],Ct=_t.start+_t.count,mt=ae(Ot.start,x.width,4),qt=ae(_t.start,x.width,4);Ot.start<=Ct+1&&mt===qt&&ae(Ot.start+Ot.count-1,x.width,4)===mt?_t.count=Math.max(_t.count,Ot.start+Ot.count-_t.start):(++Rt,q[Rt]=Ot)}q.length=Rt+1;let ct=s.getParameter(s.UNPACK_ROW_LENGTH),Et=s.getParameter(s.UNPACK_SKIP_PIXELS),wt=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,x.width);for(let st=0,_t=q.length;st<_t;st++){let Ot=q[st],Ct=Math.floor(Ot.start/4),mt=Math.ceil(Ot.count/4),qt=Ct%x.width,L=Math.floor(Ct/x.width),lt=mt,ft=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,qt),s.pixelStorei(s.UNPACK_SKIP_ROWS,L),e.texSubImage2D(s.TEXTURE_2D,0,qt,L,lt,ft,O,X,x.data)}E.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,ct),s.pixelStorei(s.UNPACK_SKIP_PIXELS,Et),s.pixelStorei(s.UNPACK_SKIP_ROWS,wt)}}function Y(E,x,O){let X=s.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(X=s.TEXTURE_2D_ARRAY),x.isData3DTexture&&(X=s.TEXTURE_3D);let j=Jt(E,x),q=x.source;e.bindTexture(X,E.__webglTexture,s.TEXTURE0+O);let Rt=n.get(q);if(q.version!==Rt.__version||j===!0){e.activeTexture(s.TEXTURE0+O);let ct=ee.getPrimaries(ee.workingColorSpace),Et=x.colorSpace===Rn?null:ee.getPrimaries(x.colorSpace),wt=x.colorSpace===Rn||ct===Et?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);let st=_(x.image,!1,i.maxTextureSize);st=Gt(x,st);let _t=r.convert(x.format,x.colorSpace),Ot=r.convert(x.type),Ct=T(x.internalFormat,_t,Ot,x.colorSpace,x.isVideoTexture);zt(X,x);let mt,qt=x.mipmaps,L=x.isVideoTexture!==!0,lt=Rt.__version===void 0||j===!0,ft=q.dataReady,Mt=A(x,st);if(x.isDepthTexture)Ct=y(x.format===Us,x.type),lt&&(L?e.texStorage2D(s.TEXTURE_2D,1,Ct,st.width,st.height):e.texImage2D(s.TEXTURE_2D,0,Ct,st.width,st.height,0,_t,Ot,null));else if(x.isDataTexture)if(qt.length>0){L&&lt&&e.texStorage2D(s.TEXTURE_2D,Mt,Ct,qt[0].width,qt[0].height);for(let rt=0,K=qt.length;rt<K;rt++)mt=qt[rt],L?ft&&e.texSubImage2D(s.TEXTURE_2D,rt,0,0,mt.width,mt.height,_t,Ot,mt.data):e.texImage2D(s.TEXTURE_2D,rt,Ct,mt.width,mt.height,0,_t,Ot,mt.data);x.generateMipmaps=!1}else L?(lt&&e.texStorage2D(s.TEXTURE_2D,Mt,Ct,st.width,st.height),ft&&te(x,st,_t,Ot)):e.texImage2D(s.TEXTURE_2D,0,Ct,st.width,st.height,0,_t,Ot,st.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){L&&lt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Mt,Ct,qt[0].width,qt[0].height,st.depth);for(let rt=0,K=qt.length;rt<K;rt++)if(mt=qt[rt],x.format!==_n)if(_t!==null)if(L){if(ft)if(x.layerUpdates.size>0){let At=Bc(mt.width,mt.height,x.format,x.type);for(let Vt of x.layerUpdates){let pe=mt.data.subarray(Vt*At/mt.data.BYTES_PER_ELEMENT,(Vt+1)*At/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,rt,0,0,Vt,mt.width,mt.height,1,_t,pe)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,rt,0,0,0,mt.width,mt.height,st.depth,_t,mt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,rt,Ct,mt.width,mt.height,st.depth,0,mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?ft&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,rt,0,0,0,mt.width,mt.height,st.depth,_t,Ot,mt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,rt,Ct,mt.width,mt.height,st.depth,0,_t,Ot,mt.data)}else{L&&lt&&e.texStorage2D(s.TEXTURE_2D,Mt,Ct,qt[0].width,qt[0].height);for(let rt=0,K=qt.length;rt<K;rt++)mt=qt[rt],x.format!==_n?_t!==null?L?ft&&e.compressedTexSubImage2D(s.TEXTURE_2D,rt,0,0,mt.width,mt.height,_t,mt.data):e.compressedTexImage2D(s.TEXTURE_2D,rt,Ct,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?ft&&e.texSubImage2D(s.TEXTURE_2D,rt,0,0,mt.width,mt.height,_t,Ot,mt.data):e.texImage2D(s.TEXTURE_2D,rt,Ct,mt.width,mt.height,0,_t,Ot,mt.data)}else if(x.isDataArrayTexture)if(L){if(lt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Mt,Ct,st.width,st.height,st.depth),ft)if(x.layerUpdates.size>0){let rt=Bc(st.width,st.height,x.format,x.type);for(let K of x.layerUpdates){let At=st.data.subarray(K*rt/st.data.BYTES_PER_ELEMENT,(K+1)*rt/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,K,st.width,st.height,1,_t,Ot,At)}x.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,_t,Ot,st.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Ct,st.width,st.height,st.depth,0,_t,Ot,st.data);else if(x.isData3DTexture)L?(lt&&e.texStorage3D(s.TEXTURE_3D,Mt,Ct,st.width,st.height,st.depth),ft&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,_t,Ot,st.data)):e.texImage3D(s.TEXTURE_3D,0,Ct,st.width,st.height,st.depth,0,_t,Ot,st.data);else if(x.isFramebufferTexture){if(lt)if(L)e.texStorage2D(s.TEXTURE_2D,Mt,Ct,st.width,st.height);else{let rt=st.width,K=st.height;for(let At=0;At<Mt;At++)e.texImage2D(s.TEXTURE_2D,At,Ct,rt,K,0,_t,Ot,null),rt>>=1,K>>=1}}else if(qt.length>0){if(L&&lt){let rt=kt(qt[0]);e.texStorage2D(s.TEXTURE_2D,Mt,Ct,rt.width,rt.height)}for(let rt=0,K=qt.length;rt<K;rt++)mt=qt[rt],L?ft&&e.texSubImage2D(s.TEXTURE_2D,rt,0,0,_t,Ot,mt):e.texImage2D(s.TEXTURE_2D,rt,Ct,_t,Ot,mt);x.generateMipmaps=!1}else if(L){if(lt){let rt=kt(st);e.texStorage2D(s.TEXTURE_2D,Mt,Ct,rt.width,rt.height)}ft&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,_t,Ot,st)}else e.texImage2D(s.TEXTURE_2D,0,Ct,_t,Ot,st);m(x)&&p(X),Rt.__version=q.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function et(E,x,O){if(x.image.length!==6)return;let X=Jt(E,x),j=x.source;e.bindTexture(s.TEXTURE_CUBE_MAP,E.__webglTexture,s.TEXTURE0+O);let q=n.get(j);if(j.version!==q.__version||X===!0){e.activeTexture(s.TEXTURE0+O);let Rt=ee.getPrimaries(ee.workingColorSpace),ct=x.colorSpace===Rn?null:ee.getPrimaries(x.colorSpace),Et=x.colorSpace===Rn||Rt===ct?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,x.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,x.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);let wt=x.isCompressedTexture||x.image[0].isCompressedTexture,st=x.image[0]&&x.image[0].isDataTexture,_t=[];for(let K=0;K<6;K++)!wt&&!st?_t[K]=_(x.image[K],!0,i.maxCubemapSize):_t[K]=st?x.image[K].image:x.image[K],_t[K]=Gt(x,_t[K]);let Ot=_t[0],Ct=r.convert(x.format,x.colorSpace),mt=r.convert(x.type),qt=T(x.internalFormat,Ct,mt,x.colorSpace),L=x.isVideoTexture!==!0,lt=q.__version===void 0||X===!0,ft=j.dataReady,Mt=A(x,Ot);zt(s.TEXTURE_CUBE_MAP,x);let rt;if(wt){L&&lt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,Mt,qt,Ot.width,Ot.height);for(let K=0;K<6;K++){rt=_t[K].mipmaps;for(let At=0;At<rt.length;At++){let Vt=rt[At];x.format!==_n?Ct!==null?L?ft&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,At,0,0,Vt.width,Vt.height,Ct,Vt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,At,qt,Vt.width,Vt.height,0,Vt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?ft&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,At,0,0,Vt.width,Vt.height,Ct,mt,Vt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,At,qt,Vt.width,Vt.height,0,Ct,mt,Vt.data)}}}else{if(rt=x.mipmaps,L&&lt){rt.length>0&&Mt++;let K=kt(_t[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,Mt,qt,K.width,K.height)}for(let K=0;K<6;K++)if(st){L?ft&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,_t[K].width,_t[K].height,Ct,mt,_t[K].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,qt,_t[K].width,_t[K].height,0,Ct,mt,_t[K].data);for(let At=0;At<rt.length;At++){let pe=rt[At].image[K].image;L?ft&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,At+1,0,0,pe.width,pe.height,Ct,mt,pe.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,At+1,qt,pe.width,pe.height,0,Ct,mt,pe.data)}}else{L?ft&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Ct,mt,_t[K]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,qt,Ct,mt,_t[K]);for(let At=0;At<rt.length;At++){let Vt=rt[At];L?ft&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,At+1,0,0,Ct,mt,Vt.image[K]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+K,At+1,qt,Ct,mt,Vt.image[K])}}}m(x)&&p(s.TEXTURE_CUBE_MAP),q.__version=j.version,x.onUpdate&&x.onUpdate(x)}E.__version=x.version}function vt(E,x,O,X,j,q){let Rt=r.convert(O.format,O.colorSpace),ct=r.convert(O.type),Et=T(O.internalFormat,Rt,ct,O.colorSpace),wt=n.get(x),st=n.get(O);if(st.__renderTarget=x,!wt.__hasExternalTextures){let _t=Math.max(1,x.width>>q),Ot=Math.max(1,x.height>>q);j===s.TEXTURE_3D||j===s.TEXTURE_2D_ARRAY?e.texImage3D(j,q,Et,_t,Ot,x.depth,0,Rt,ct,null):e.texImage2D(j,q,Et,_t,Ot,0,Rt,ct,null)}e.bindFramebuffer(s.FRAMEBUFFER,E),it(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,X,j,st.__webglTexture,0,ut(x)):(j===s.TEXTURE_2D||j>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,X,j,st.__webglTexture,q),e.bindFramebuffer(s.FRAMEBUFFER,null)}function It(E,x,O){if(s.bindRenderbuffer(s.RENDERBUFFER,E),x.depthBuffer){let X=x.depthTexture,j=X&&X.isDepthTexture?X.type:null,q=y(x.stencilBuffer,j),Rt=x.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=ut(x);it(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ct,q,x.width,x.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,ct,q,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,q,x.width,x.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Rt,s.RENDERBUFFER,E)}else{let X=x.textures;for(let j=0;j<X.length;j++){let q=X[j],Rt=r.convert(q.format,q.colorSpace),ct=r.convert(q.type),Et=T(q.internalFormat,Rt,ct,q.colorSpace),wt=ut(x);O&&it(x)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,wt,Et,x.width,x.height):it(x)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,wt,Et,x.width,x.height):s.renderbufferStorage(s.RENDERBUFFER,Et,x.width,x.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Tt(E,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,E),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let X=n.get(x.depthTexture);X.__renderTarget=x,(!X.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),G(x.depthTexture,0);let j=X.__webglTexture,q=ut(x);if(x.depthTexture.format===Ms)it(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,j,0,q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,j,0);else if(x.depthTexture.format===Us)it(x)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,j,0,q):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function $t(E){let x=n.get(E),O=E.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==E.depthTexture){let X=E.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),X){let j=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,X.removeEventListener("dispose",j)};X.addEventListener("dispose",j),x.__depthDisposeCallback=j}x.__boundDepthTexture=X}if(E.depthTexture&&!x.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");let X=E.texture.mipmaps;X&&X.length>0?Tt(x.__webglFramebuffer[0],E):Tt(x.__webglFramebuffer,E)}else if(O){x.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[X]),x.__webglDepthbuffer[X]===void 0)x.__webglDepthbuffer[X]=s.createRenderbuffer(),It(x.__webglDepthbuffer[X],E,!1);else{let j=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,q=x.__webglDepthbuffer[X];s.bindRenderbuffer(s.RENDERBUFFER,q),s.framebufferRenderbuffer(s.FRAMEBUFFER,j,s.RENDERBUFFER,q)}}else{let X=E.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=s.createRenderbuffer(),It(x.__webglDepthbuffer,E,!1);else{let j=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,q=x.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,q),s.framebufferRenderbuffer(s.FRAMEBUFFER,j,s.RENDERBUFFER,q)}}e.bindFramebuffer(s.FRAMEBUFFER,null)}function fe(E,x,O){let X=n.get(E);x!==void 0&&vt(X.__webglFramebuffer,E,E.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&$t(E)}function C(E){let x=E.texture,O=n.get(E),X=n.get(x);E.addEventListener("dispose",P);let j=E.textures,q=E.isWebGLCubeRenderTarget===!0,Rt=j.length>1;if(Rt||(X.__webglTexture===void 0&&(X.__webglTexture=s.createTexture()),X.__version=x.version,a.memory.textures++),q){O.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer[ct]=[];for(let Et=0;Et<x.mipmaps.length;Et++)O.__webglFramebuffer[ct][Et]=s.createFramebuffer()}else O.__webglFramebuffer[ct]=s.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer=[];for(let ct=0;ct<x.mipmaps.length;ct++)O.__webglFramebuffer[ct]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(Rt)for(let ct=0,Et=j.length;ct<Et;ct++){let wt=n.get(j[ct]);wt.__webglTexture===void 0&&(wt.__webglTexture=s.createTexture(),a.memory.textures++)}if(E.samples>0&&it(E)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ct=0;ct<j.length;ct++){let Et=j[ct];O.__webglColorRenderbuffer[ct]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[ct]);let wt=r.convert(Et.format,Et.colorSpace),st=r.convert(Et.type),_t=T(Et.internalFormat,wt,st,Et.colorSpace,E.isXRRenderTarget===!0),Ot=ut(E);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ot,_t,E.width,E.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ct,s.RENDERBUFFER,O.__webglColorRenderbuffer[ct])}s.bindRenderbuffer(s.RENDERBUFFER,null),E.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),It(O.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(q){e.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture),zt(s.TEXTURE_CUBE_MAP,x);for(let ct=0;ct<6;ct++)if(x.mipmaps&&x.mipmaps.length>0)for(let Et=0;Et<x.mipmaps.length;Et++)vt(O.__webglFramebuffer[ct][Et],E,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Et);else vt(O.__webglFramebuffer[ct],E,x,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);m(x)&&p(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Rt){for(let ct=0,Et=j.length;ct<Et;ct++){let wt=j[ct],st=n.get(wt),_t=s.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(_t=E.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(_t,st.__webglTexture),zt(_t,wt),vt(O.__webglFramebuffer,E,wt,s.COLOR_ATTACHMENT0+ct,_t,0),m(wt)&&p(_t)}e.unbindTexture()}else{let ct=s.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(ct=E.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ct,X.__webglTexture),zt(ct,x),x.mipmaps&&x.mipmaps.length>0)for(let Et=0;Et<x.mipmaps.length;Et++)vt(O.__webglFramebuffer[Et],E,x,s.COLOR_ATTACHMENT0,ct,Et);else vt(O.__webglFramebuffer,E,x,s.COLOR_ATTACHMENT0,ct,0);m(x)&&p(ct),e.unbindTexture()}E.depthBuffer&&$t(E)}function tt(E){let x=E.textures;for(let O=0,X=x.length;O<X;O++){let j=x[O];if(m(j)){let q=b(E),Rt=n.get(j).__webglTexture;e.bindTexture(q,Rt),p(q),e.unbindTexture()}}}let $=[],J=[];function Z(E){if(E.samples>0){if(it(E)===!1){let x=E.textures,O=E.width,X=E.height,j=s.COLOR_BUFFER_BIT,q=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Rt=n.get(E),ct=x.length>1;if(ct)for(let wt=0;wt<x.length;wt++)e.bindFramebuffer(s.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+wt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,Rt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+wt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer);let Et=E.texture.mipmaps;Et&&Et.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer);for(let wt=0;wt<x.length;wt++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(j|=s.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(j|=s.STENCIL_BUFFER_BIT)),ct){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Rt.__webglColorRenderbuffer[wt]);let st=n.get(x[wt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,st,0)}s.blitFramebuffer(0,0,O,X,0,0,O,X,j,s.NEAREST),l===!0&&($.length=0,J.length=0,$.push(s.COLOR_ATTACHMENT0+wt),E.depthBuffer&&E.resolveDepthBuffer===!1&&($.push(q),J.push(q),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,J)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,$))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ct)for(let wt=0;wt<x.length;wt++){e.bindFramebuffer(s.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+wt,s.RENDERBUFFER,Rt.__webglColorRenderbuffer[wt]);let st=n.get(x[wt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,Rt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+wt,s.TEXTURE_2D,st,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){let x=E.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[x])}}}function ut(E){return Math.min(i.maxSamples,E.samples)}function it(E){let x=n.get(E);return E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function dt(E){let x=a.render.frame;h.get(E)!==x&&(h.set(E,x),E.update())}function Gt(E,x){let O=E.colorSpace,X=E.format,j=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||O!==Ui&&O!==Rn&&(ee.getTransfer(O)===le?(X!==_n||j!==An)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),x}function kt(E){return typeof HTMLImageElement!="undefined"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame!="undefined"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=F,this.setTexture2D=G,this.setTexture2DArray=W,this.setTexture3D=Q,this.setTextureCube=z,this.rebindTextures=fe,this.setupRenderTarget=C,this.updateRenderTargetMipmap=tt,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=$t,this.setupFrameBufferTexture=vt,this.useMultisampledRTT=it}function H_(s,t){function e(n,i=Rn){let r,a=ee.getTransfer(i);if(n===An)return s.UNSIGNED_BYTE;if(n===vo)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Mo)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Tc)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Ec)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Sc)return s.BYTE;if(n===bc)return s.SHORT;if(n===Ds)return s.UNSIGNED_SHORT;if(n===yo)return s.INT;if(n===bi)return s.UNSIGNED_INT;if(n===zn)return s.FLOAT;if(n===Ls)return s.HALF_FLOAT;if(n===wc)return s.ALPHA;if(n===Ac)return s.RGB;if(n===_n)return s.RGBA;if(n===Ms)return s.DEPTH_COMPONENT;if(n===Us)return s.DEPTH_STENCIL;if(n===Rc)return s.RED;if(n===So)return s.RED_INTEGER;if(n===Cc)return s.RG;if(n===bo)return s.RG_INTEGER;if(n===To)return s.RGBA_INTEGER;if(n===Hr||n===Gr||n===Vr||n===Wr)if(a===le)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Hr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Hr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Gr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Wr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Eo||n===wo||n===Ao||n===Ro)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Eo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===wo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ao)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ro)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Co||n===Io||n===Po)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Co||n===Io)return a===le?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Po)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Do||n===Lo||n===Fo||n===Uo||n===No||n===Oo||n===Bo||n===zo||n===ko||n===Ho||n===Go||n===Vo||n===Wo||n===Xo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Do)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Lo)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Fo)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Uo)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===No)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Oo)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Bo)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===zo)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ko)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ho)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Go)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Vo)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Wo)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Xo)return a===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===qo||n===Yo||n===Zo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===qo)return a===le?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Yo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Zo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Jo||n===$o||n===Ko||n===Qo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Jo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===$o)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ko)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Qo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Fs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}var G_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,V_=`
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

}`,Kc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Tr(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new rn({vertexShader:G_,fragmentShader:V_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Pt(new be(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Qc=class extends si{constructor(t,e){super();let n=this,i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null,_=typeof XRWebGLBinding!="undefined",m=new Kc,p={},b=e.getContextAttributes(),T=null,y=null,A=[],w=[],P=new nt,D=null,S=new Ue;S.viewport=new oe;let v=new Ue;v.viewport=new oe;let I=[S,v],F=new ro,B=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let et=A[Y];return et===void 0&&(et=new Ts,A[Y]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Y){let et=A[Y];return et===void 0&&(et=new Ts,A[Y]=et),et.getGripSpace()},this.getHand=function(Y){let et=A[Y];return et===void 0&&(et=new Ts,A[Y]=et),et.getHandSpace()};function G(Y){let et=w.indexOf(Y.inputSource);if(et===-1)return;let vt=A[et];vt!==void 0&&(vt.update(Y.inputSource,Y.frame,c||a),vt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function W(){i.removeEventListener("select",G),i.removeEventListener("selectstart",G),i.removeEventListener("selectend",G),i.removeEventListener("squeeze",G),i.removeEventListener("squeezestart",G),i.removeEventListener("squeezeend",G),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",Q);for(let Y=0;Y<A.length;Y++){let et=w[Y];et!==null&&(w[Y]=null,A[Y].disconnect(et))}B=null,V=null,m.reset();for(let Y in p)delete p[Y];t.setRenderTarget(T),f=null,d=null,u=null,i=null,y=null,te.stop(),n.isPresenting=!1,t.setPixelRatio(D),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(i,e)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(T=t.getRenderTarget(),i.addEventListener("select",G),i.addEventListener("selectstart",G),i.addEventListener("selectend",G),i.addEventListener("squeeze",G),i.addEventListener("squeezestart",G),i.addEventListener("squeezeend",G),i.addEventListener("end",W),i.addEventListener("inputsourceschange",Q),b.xrCompatible!==!0&&await e.makeXRCompatible(),D=t.getPixelRatio(),t.getSize(P),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let vt=null,It=null,Tt=null;b.depth&&(Tt=b.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,vt=b.stencil?Us:Ms,It=b.stencil?Fs:bi);let $t={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer($t),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Fn(d.textureWidth,d.textureHeight,{format:_n,type:An,depthTexture:new br(d.textureWidth,d.textureHeight,It,void 0,void 0,void 0,void 0,void 0,void 0,vt),stencilBuffer:b.stencil,colorSpace:t.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let vt={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,vt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Fn(f.framebufferWidth,f.framebufferHeight,{format:_n,type:An,colorSpace:t.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),te.setContext(i),te.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Q(Y){for(let et=0;et<Y.removed.length;et++){let vt=Y.removed[et],It=w.indexOf(vt);It>=0&&(w[It]=null,A[It].disconnect(vt))}for(let et=0;et<Y.added.length;et++){let vt=Y.added[et],It=w.indexOf(vt);if(It===-1){for(let $t=0;$t<A.length;$t++)if($t>=w.length){w.push(vt),It=$t;break}else if(w[$t]===null){w[$t]=vt,It=$t;break}if(It===-1)break}let Tt=A[It];Tt&&Tt.connect(vt)}}let z=new R,ot=new R;function ht(Y,et,vt){z.setFromMatrixPosition(et.matrixWorld),ot.setFromMatrixPosition(vt.matrixWorld);let It=z.distanceTo(ot),Tt=et.projectionMatrix.elements,$t=vt.projectionMatrix.elements,fe=Tt[14]/(Tt[10]-1),C=Tt[14]/(Tt[10]+1),tt=(Tt[9]+1)/Tt[5],$=(Tt[9]-1)/Tt[5],J=(Tt[8]-1)/Tt[0],Z=($t[8]+1)/$t[0],ut=fe*J,it=fe*Z,dt=It/(-J+Z),Gt=dt*-J;if(et.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Gt),Y.translateZ(dt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Tt[10]===-1)Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{let kt=fe+dt,E=C+dt,x=ut-Gt,O=it+(It-Gt),X=tt*C/E*kt,j=$*C/E*kt;Y.projectionMatrix.makePerspective(x,O,X,j,kt,E),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function xt(Y,et){et===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(et.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let et=Y.near,vt=Y.far;m.texture!==null&&(m.depthNear>0&&(et=m.depthNear),m.depthFar>0&&(vt=m.depthFar)),F.near=v.near=S.near=et,F.far=v.far=S.far=vt,(B!==F.near||V!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),B=F.near,V=F.far),F.layers.mask=Y.layers.mask|6,S.layers.mask=F.layers.mask&3,v.layers.mask=F.layers.mask&5;let It=Y.parent,Tt=F.cameras;xt(F,It);for(let $t=0;$t<Tt.length;$t++)xt(Tt[$t],It);Tt.length===2?ht(F,S,v):F.projectionMatrix.copy(S.projectionMatrix),zt(Y,F,It)};function zt(Y,et,vt){vt===null?Y.matrix.copy(et.matrixWorld):(Y.matrix.copy(vt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(et.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Fa*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(Y){return p[Y]};let Jt=null;function ae(Y,et){if(h=et.getViewerPose(c||a),g=et,h!==null){let vt=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let It=!1;vt.length!==F.cameras.length&&(F.cameras.length=0,It=!0);for(let C=0;C<vt.length;C++){let tt=vt[C],$=null;if(f!==null)$=f.getViewport(tt);else{let Z=u.getViewSubImage(d,tt);$=Z.viewport,C===0&&(t.setRenderTargetTextures(y,Z.colorTexture,Z.depthStencilTexture),t.setRenderTarget(y))}let J=I[C];J===void 0&&(J=new Ue,J.layers.enable(C),J.viewport=new oe,I[C]=J),J.matrix.fromArray(tt.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(tt.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set($.x,$.y,$.width,$.height),C===0&&(F.matrix.copy(J.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),It===!0&&F.cameras.push(J)}let Tt=i.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let C=u.getDepthInformation(vt[0]);C&&C.isValid&&C.texture&&m.init(C,i.renderState)}if(Tt&&Tt.includes("camera-access")&&_){t.state.unbindTexture(),u=n.getBinding();for(let C=0;C<vt.length;C++){let tt=vt[C].camera;if(tt){let $=p[tt];$||($=new Tr,p[tt]=$);let J=u.getCameraImage(tt);$.sourceTexture=J}}}}for(let vt=0;vt<A.length;vt++){let It=w[vt],Tt=A[vt];It!==null&&Tt!==void 0&&Tt.update(It,et,c||a)}Jt&&Jt(Y,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),g=null}let te=new vd;te.setAnimationLoop(ae),this.setAnimationLoop=function(Y){Jt=Y},this.dispose=function(){}}},Yi=new sn,W_=new jt;function X_(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Fc(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,b,T,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,b,T):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Be&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Be&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let b=t.get(p),T=b.envMap,y=b.envMapRotation;T&&(m.envMap.value=T,Yi.copy(y),Yi.x*=-1,Yi.y*=-1,Yi.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Yi.y*=-1,Yi.z*=-1),m.envMapRotation.value.setFromMatrix4(W_.makeRotationFromEuler(Yi)),m.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,T){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=T*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Be&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let b=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function q_(s,t,e,n){let i={},r={},a=[],o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,T){let y=T.program;n.uniformBlockBinding(b,y)}function c(b,T){let y=i[b.id];y===void 0&&(g(b),y=h(b),i[b.id]=y,b.addEventListener("dispose",m));let A=T.program;n.updateUBOMapping(b,A);let w=t.render.frame;r[b.id]!==w&&(d(b),r[b.id]=w)}function h(b){let T=u();b.__bindingPointIndex=T;let y=s.createBuffer(),A=b.__size,w=b.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,A,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,T,y),y}function u(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){let T=i[b.id],y=b.uniforms,A=b.__cache;s.bindBuffer(s.UNIFORM_BUFFER,T);for(let w=0,P=y.length;w<P;w++){let D=Array.isArray(y[w])?y[w]:[y[w]];for(let S=0,v=D.length;S<v;S++){let I=D[S];if(f(I,w,S,A)===!0){let F=I.__offset,B=Array.isArray(I.value)?I.value:[I.value],V=0;for(let G=0;G<B.length;G++){let W=B[G],Q=_(W);typeof W=="number"||typeof W=="boolean"?(I.__data[0]=W,s.bufferSubData(s.UNIFORM_BUFFER,F+V,I.__data)):W.isMatrix3?(I.__data[0]=W.elements[0],I.__data[1]=W.elements[1],I.__data[2]=W.elements[2],I.__data[3]=0,I.__data[4]=W.elements[3],I.__data[5]=W.elements[4],I.__data[6]=W.elements[5],I.__data[7]=0,I.__data[8]=W.elements[6],I.__data[9]=W.elements[7],I.__data[10]=W.elements[8],I.__data[11]=0):(W.toArray(I.__data,V),V+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,F,I.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(b,T,y,A){let w=b.value,P=T+"_"+y;if(A[P]===void 0)return typeof w=="number"||typeof w=="boolean"?A[P]=w:A[P]=w.clone(),!0;{let D=A[P];if(typeof w=="number"||typeof w=="boolean"){if(D!==w)return A[P]=w,!0}else if(D.equals(w)===!1)return D.copy(w),!0}return!1}function g(b){let T=b.uniforms,y=0,A=16;for(let P=0,D=T.length;P<D;P++){let S=Array.isArray(T[P])?T[P]:[T[P]];for(let v=0,I=S.length;v<I;v++){let F=S[v],B=Array.isArray(F.value)?F.value:[F.value];for(let V=0,G=B.length;V<G;V++){let W=B[V],Q=_(W),z=y%A,ot=z%Q.boundary,ht=z+ot;y+=ot,ht!==0&&A-ht<Q.storage&&(y+=A-ht),F.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=Q.storage}}}let w=y%A;return w>0&&(y+=A-w),b.__size=y,b.__cache={},this}function _(b){let T={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(T.boundary=4,T.storage=4):b.isVector2?(T.boundary=8,T.storage=8):b.isVector3||b.isColor?(T.boundary=16,T.storage=12):b.isVector4?(T.boundary=16,T.storage=16):b.isMatrix3?(T.boundary=48,T.storage=48):b.isMatrix4?(T.boundary=64,T.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),T}function m(b){let T=b.target;T.removeEventListener("dispose",m);let y=a.indexOf(T.__bindingPointIndex);a.splice(y,1),s.deleteBuffer(i[T.id]),delete i[T.id],delete r[T.id]}function p(){for(let b in i)s.deleteBuffer(i[b]);a=[],i={},r={}}return{bind:l,update:c,dispose:p}}var nl=class{constructor(t={}){let{canvas:e=Hu(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext!="undefined"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;let g=new Uint32Array(4),_=new Int32Array(4),m=null,p=null,b=[],T=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ai,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,A=!1;this._outputColorSpace=Fe;let w=0,P=0,D=null,S=-1,v=null,I=new oe,F=new oe,B=null,V=new Lt(0),G=0,W=e.width,Q=e.height,z=1,ot=null,ht=null,xt=new oe(0,0,W,Q),zt=new oe(0,0,W,Q),Jt=!1,ae=new ws,te=!1,Y=!1,et=new jt,vt=new R,It=new oe,Tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},$t=!1;function fe(){return D===null?z:1}let C=n;function tt(M,U){return e.getContext(M,U)}try{let M={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",ft,!1),e.addEventListener("webglcontextrestored",Mt,!1),e.addEventListener("webglcontextcreationerror",rt,!1),C===null){let U="webgl2";if(C=tt(U,M),C===null)throw tt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let $,J,Z,ut,it,dt,Gt,kt,E,x,O,X,j,q,Rt,ct,Et,wt,st,_t,Ot,Ct,mt,qt;function L(){$=new hg(C),$.init(),Ct=new H_(C,$),J=new ig(C,$,t,Ct),Z=new z_(C,$),J.reversedDepthBuffer&&d&&Z.buffers.depth.setReversed(!0),ut=new fg(C),it=new w_,dt=new k_(C,$,Z,it,J,Ct,ut),Gt=new rg(y),kt=new cg(y),E=new yp(C),mt=new eg(C,E),x=new ug(C,E,ut,mt),O=new mg(C,x,E,ut),st=new pg(C,J,dt),ct=new sg(it),X=new E_(y,Gt,kt,$,J,mt,ct),j=new X_(y,it),q=new R_,Rt=new F_($),wt=new tg(y,Gt,kt,Z,O,f,l),Et=new O_(y,O,J),qt=new q_(C,ut,J,Z),_t=new ng(C,$,ut),Ot=new dg(C,$,ut),ut.programs=X.programs,y.capabilities=J,y.extensions=$,y.properties=it,y.renderLists=q,y.shadowMap=Et,y.state=Z,y.info=ut}L();let lt=new Qc(y,C);this.xr=lt,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){let M=$.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=$.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(M){M!==void 0&&(z=M,this.setSize(W,Q,!1))},this.getSize=function(M){return M.set(W,Q)},this.setSize=function(M,U,k=!0){if(lt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=M,Q=U,e.width=Math.floor(M*z),e.height=Math.floor(U*z),k===!0&&(e.style.width=M+"px",e.style.height=U+"px"),this.setViewport(0,0,M,U)},this.getDrawingBufferSize=function(M){return M.set(W*z,Q*z).floor()},this.setDrawingBufferSize=function(M,U,k){W=M,Q=U,z=k,e.width=Math.floor(M*k),e.height=Math.floor(U*k),this.setViewport(0,0,M,U)},this.getCurrentViewport=function(M){return M.copy(I)},this.getViewport=function(M){return M.copy(xt)},this.setViewport=function(M,U,k,H){M.isVector4?xt.set(M.x,M.y,M.z,M.w):xt.set(M,U,k,H),Z.viewport(I.copy(xt).multiplyScalar(z).round())},this.getScissor=function(M){return M.copy(zt)},this.setScissor=function(M,U,k,H){M.isVector4?zt.set(M.x,M.y,M.z,M.w):zt.set(M,U,k,H),Z.scissor(F.copy(zt).multiplyScalar(z).round())},this.getScissorTest=function(){return Jt},this.setScissorTest=function(M){Z.setScissorTest(Jt=M)},this.setOpaqueSort=function(M){ot=M},this.setTransparentSort=function(M){ht=M},this.getClearColor=function(M){return M.copy(wt.getClearColor())},this.setClearColor=function(){wt.setClearColor(...arguments)},this.getClearAlpha=function(){return wt.getClearAlpha()},this.setClearAlpha=function(){wt.setClearAlpha(...arguments)},this.clear=function(M=!0,U=!0,k=!0){let H=0;if(M){let N=!1;if(D!==null){let at=D.texture.format;N=at===To||at===bo||at===So}if(N){let at=D.texture.type,gt=at===An||at===bi||at===Ds||at===Fs||at===vo||at===Mo,bt=wt.getClearColor(),yt=wt.getClearAlpha(),Nt=bt.r,Bt=bt.g,Dt=bt.b;gt?(g[0]=Nt,g[1]=Bt,g[2]=Dt,g[3]=yt,C.clearBufferuiv(C.COLOR,0,g)):(_[0]=Nt,_[1]=Bt,_[2]=Dt,_[3]=yt,C.clearBufferiv(C.COLOR,0,_))}else H|=C.COLOR_BUFFER_BIT}U&&(H|=C.DEPTH_BUFFER_BIT),k&&(H|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ft,!1),e.removeEventListener("webglcontextrestored",Mt,!1),e.removeEventListener("webglcontextcreationerror",rt,!1),wt.dispose(),q.dispose(),Rt.dispose(),it.dispose(),Gt.dispose(),kt.dispose(),O.dispose(),mt.dispose(),qt.dispose(),X.dispose(),lt.dispose(),lt.removeEventListener("sessionstart",In),lt.removeEventListener("sessionend",Sh),Ai.stop()};function ft(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function Mt(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;let M=ut.autoReset,U=Et.enabled,k=Et.autoUpdate,H=Et.needsUpdate,N=Et.type;L(),ut.autoReset=M,Et.enabled=U,Et.autoUpdate=k,Et.needsUpdate=H,Et.type=N}function rt(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function K(M){let U=M.target;U.removeEventListener("dispose",K),At(U)}function At(M){Vt(M),it.remove(M)}function Vt(M){let U=it.get(M).programs;U!==void 0&&(U.forEach(function(k){X.releaseProgram(k)}),M.isShaderMaterial&&X.releaseShaderCache(M))}this.renderBufferDirect=function(M,U,k,H,N,at){U===null&&(U=Tt);let gt=N.isMesh&&N.matrixWorld.determinant()<0,bt=lf(M,U,k,H,N);Z.setMaterial(H,gt);let yt=k.index,Nt=1;if(H.wireframe===!0){if(yt=x.getWireframeAttribute(k),yt===void 0)return;Nt=2}let Bt=k.drawRange,Dt=k.attributes.position,Kt=Bt.start*Nt,ce=(Bt.start+Bt.count)*Nt;at!==null&&(Kt=Math.max(Kt,at.start*Nt),ce=Math.min(ce,(at.start+at.count)*Nt)),yt!==null?(Kt=Math.max(Kt,0),ce=Math.min(ce,yt.count)):Dt!=null&&(Kt=Math.max(Kt,0),ce=Math.min(ce,Dt.count));let Te=ce-Kt;if(Te<0||Te===1/0)return;mt.setup(N,H,bt,k,yt);let me,ue=_t;if(yt!==null&&(me=E.get(yt),ue=Ot,ue.setIndex(me)),N.isMesh)H.wireframe===!0?(Z.setLineWidth(H.wireframeLinewidth*fe()),ue.setMode(C.LINES)):ue.setMode(C.TRIANGLES);else if(N.isLine){let Ut=H.linewidth;Ut===void 0&&(Ut=1),Z.setLineWidth(Ut*fe()),N.isLineSegments?ue.setMode(C.LINES):N.isLineLoop?ue.setMode(C.LINE_LOOP):ue.setMode(C.LINE_STRIP)}else N.isPoints?ue.setMode(C.POINTS):N.isSprite&&ue.setMode(C.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Ss("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ue.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if($.get("WEBGL_multi_draw"))ue.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{let Ut=N._multiDrawStarts,ye=N._multiDrawCounts,ne=N._multiDrawCount,Qe=yt?E.get(yt).bytesPerElement:1,is=it.get(H).currentProgram.getUniforms();for(let je=0;je<ne;je++)is.setValue(C,"_gl_DrawID",je),ue.render(Ut[je]/Qe,ye[je])}else if(N.isInstancedMesh)ue.renderInstances(Kt,Te,N.count);else if(k.isInstancedBufferGeometry){let Ut=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,ye=Math.min(k.instanceCount,Ut);ue.renderInstances(Kt,Te,ye)}else ue.render(Kt,Te)};function pe(M,U,k){M.transparent===!0&&M.side===He&&M.forceSinglePass===!1?(M.side=Be,M.needsUpdate=!0,ea(M,U,k),M.side=ei,M.needsUpdate=!0,ea(M,U,k),M.side=He):ea(M,U,k)}this.compile=function(M,U,k=null){k===null&&(k=M),p=Rt.get(k),p.init(U),T.push(p),k.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),M!==k&&M.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();let H=new Set;return M.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;let at=N.material;if(at)if(Array.isArray(at))for(let gt=0;gt<at.length;gt++){let bt=at[gt];pe(bt,k,N),H.add(bt)}else pe(at,k,N),H.add(at)}),p=T.pop(),H},this.compileAsync=function(M,U,k=null){let H=this.compile(M,U,k);return new Promise(N=>{function at(){if(H.forEach(function(gt){it.get(gt).currentProgram.isReady()&&H.delete(gt)}),H.size===0){N(M);return}setTimeout(at,10)}$.get("KHR_parallel_shader_compile")!==null?at():setTimeout(at,10)})};let re=null;function qn(M){re&&re(M)}function In(){Ai.stop()}function Sh(){Ai.start()}let Ai=new vd;Ai.setAnimationLoop(qn),typeof self!="undefined"&&Ai.setContext(self),this.setAnimationLoop=function(M){re=M,lt.setAnimationLoop(M),M===null?Ai.stop():Ai.start()},lt.addEventListener("sessionstart",In),lt.addEventListener("sessionend",Sh),this.render=function(M,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),lt.enabled===!0&&lt.isPresenting===!0&&(lt.cameraAutoUpdate===!0&&lt.updateCamera(U),U=lt.getCamera()),M.isScene===!0&&M.onBeforeRender(y,M,U,D),p=Rt.get(M,T.length),p.init(U),T.push(p),et.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),ae.setFromProjectionMatrix(et,wn,U.reversedDepth),Y=this.localClippingEnabled,te=ct.init(this.clippingPlanes,Y),m=q.get(M,b.length),m.init(),b.push(m),lt.enabled===!0&&lt.isPresenting===!0){let at=y.xr.getDepthSensingMesh();at!==null&&Al(at,U,-1/0,y.sortObjects)}Al(M,U,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(ot,ht),$t=lt.enabled===!1||lt.isPresenting===!1||lt.hasDepthSensing()===!1,$t&&wt.addToRenderList(m,M),this.info.render.frame++,te===!0&&ct.beginShadows();let k=p.state.shadowsArray;Et.render(k,M,U),te===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();let H=m.opaque,N=m.transmissive;if(p.setupLights(),U.isArrayCamera){let at=U.cameras;if(N.length>0)for(let gt=0,bt=at.length;gt<bt;gt++){let yt=at[gt];Th(H,N,M,yt)}$t&&wt.render(M);for(let gt=0,bt=at.length;gt<bt;gt++){let yt=at[gt];bh(m,M,yt,yt.viewport)}}else N.length>0&&Th(H,N,M,U),$t&&wt.render(M),bh(m,M,U);D!==null&&P===0&&(dt.updateMultisampleRenderTarget(D),dt.updateRenderTargetMipmap(D)),M.isScene===!0&&M.onAfterRender(y,M,U),mt.resetDefaultState(),S=-1,v=null,T.pop(),T.length>0?(p=T[T.length-1],te===!0&&ct.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function Al(M,U,k,H){if(M.visible===!1)return;if(M.layers.test(U.layers)){if(M.isGroup)k=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(U);else if(M.isLight)p.pushLight(M),M.castShadow&&p.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||ae.intersectsSprite(M)){H&&It.setFromMatrixPosition(M.matrixWorld).applyMatrix4(et);let gt=O.update(M),bt=M.material;bt.visible&&m.push(M,gt,bt,k,It.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||ae.intersectsObject(M))){let gt=O.update(M),bt=M.material;if(H&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),It.copy(M.boundingSphere.center)):(gt.boundingSphere===null&&gt.computeBoundingSphere(),It.copy(gt.boundingSphere.center)),It.applyMatrix4(M.matrixWorld).applyMatrix4(et)),Array.isArray(bt)){let yt=gt.groups;for(let Nt=0,Bt=yt.length;Nt<Bt;Nt++){let Dt=yt[Nt],Kt=bt[Dt.materialIndex];Kt&&Kt.visible&&m.push(M,gt,Kt,k,It.z,Dt)}}else bt.visible&&m.push(M,gt,bt,k,It.z,null)}}let at=M.children;for(let gt=0,bt=at.length;gt<bt;gt++)Al(at[gt],U,k,H)}function bh(M,U,k,H){let N=M.opaque,at=M.transmissive,gt=M.transparent;p.setupLightsView(k),te===!0&&ct.setGlobalState(y.clippingPlanes,k),H&&Z.viewport(I.copy(H)),N.length>0&&ta(N,U,k),at.length>0&&ta(at,U,k),gt.length>0&&ta(gt,U,k),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function Th(M,U,k,H){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[H.id]===void 0&&(p.state.transmissionRenderTarget[H.id]=new Fn(1,1,{generateMipmaps:!0,type:$.has("EXT_color_buffer_half_float")||$.has("EXT_color_buffer_float")?Ls:An,minFilter:Bn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ee.workingColorSpace}));let at=p.state.transmissionRenderTarget[H.id],gt=H.viewport||I;at.setSize(gt.z*y.transmissionResolutionScale,gt.w*y.transmissionResolutionScale);let bt=y.getRenderTarget(),yt=y.getActiveCubeFace(),Nt=y.getActiveMipmapLevel();y.setRenderTarget(at),y.getClearColor(V),G=y.getClearAlpha(),G<1&&y.setClearColor(16777215,.5),y.clear(),$t&&wt.render(k);let Bt=y.toneMapping;y.toneMapping=ai;let Dt=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),p.setupLightsView(H),te===!0&&ct.setGlobalState(y.clippingPlanes,H),ta(M,k,H),dt.updateMultisampleRenderTarget(at),dt.updateRenderTargetMipmap(at),$.has("WEBGL_multisampled_render_to_texture")===!1){let Kt=!1;for(let ce=0,Te=U.length;ce<Te;ce++){let me=U[ce],ue=me.object,Ut=me.geometry,ye=me.material,ne=me.group;if(ye.side===He&&ue.layers.test(H.layers)){let Qe=ye.side;ye.side=Be,ye.needsUpdate=!0,Eh(ue,k,H,Ut,ye,ne),ye.side=Qe,ye.needsUpdate=!0,Kt=!0}}Kt===!0&&(dt.updateMultisampleRenderTarget(at),dt.updateRenderTargetMipmap(at))}y.setRenderTarget(bt,yt,Nt),y.setClearColor(V,G),Dt!==void 0&&(H.viewport=Dt),y.toneMapping=Bt}function ta(M,U,k){let H=U.isScene===!0?U.overrideMaterial:null;for(let N=0,at=M.length;N<at;N++){let gt=M[N],bt=gt.object,yt=gt.geometry,Nt=gt.group,Bt=gt.material;Bt.allowOverride===!0&&H!==null&&(Bt=H),bt.layers.test(k.layers)&&Eh(bt,U,k,yt,Bt,Nt)}}function Eh(M,U,k,H,N,at){M.onBeforeRender(y,U,k,H,N,at),M.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),N.onBeforeRender(y,U,k,H,M,at),N.transparent===!0&&N.side===He&&N.forceSinglePass===!1?(N.side=Be,N.needsUpdate=!0,y.renderBufferDirect(k,U,H,N,M,at),N.side=ei,N.needsUpdate=!0,y.renderBufferDirect(k,U,H,N,M,at),N.side=He):y.renderBufferDirect(k,U,H,N,M,at),M.onAfterRender(y,U,k,H,N,at)}function ea(M,U,k){U.isScene!==!0&&(U=Tt);let H=it.get(M),N=p.state.lights,at=p.state.shadowsArray,gt=N.state.version,bt=X.getParameters(M,N.state,at,U,k),yt=X.getProgramCacheKey(bt),Nt=H.programs;H.environment=M.isMeshStandardMaterial?U.environment:null,H.fog=U.fog,H.envMap=(M.isMeshStandardMaterial?kt:Gt).get(M.envMap||H.environment),H.envMapRotation=H.environment!==null&&M.envMap===null?U.environmentRotation:M.envMapRotation,Nt===void 0&&(M.addEventListener("dispose",K),Nt=new Map,H.programs=Nt);let Bt=Nt.get(yt);if(Bt!==void 0){if(H.currentProgram===Bt&&H.lightsStateVersion===gt)return Ah(M,bt),Bt}else bt.uniforms=X.getUniforms(M),M.onBeforeCompile(bt,y),Bt=X.acquireProgram(bt,yt),Nt.set(yt,Bt),H.uniforms=bt.uniforms;let Dt=H.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Dt.clippingPlanes=ct.uniform),Ah(M,bt),H.needsLights=hf(M),H.lightsStateVersion=gt,H.needsLights&&(Dt.ambientLightColor.value=N.state.ambient,Dt.lightProbe.value=N.state.probe,Dt.directionalLights.value=N.state.directional,Dt.directionalLightShadows.value=N.state.directionalShadow,Dt.spotLights.value=N.state.spot,Dt.spotLightShadows.value=N.state.spotShadow,Dt.rectAreaLights.value=N.state.rectArea,Dt.ltc_1.value=N.state.rectAreaLTC1,Dt.ltc_2.value=N.state.rectAreaLTC2,Dt.pointLights.value=N.state.point,Dt.pointLightShadows.value=N.state.pointShadow,Dt.hemisphereLights.value=N.state.hemi,Dt.directionalShadowMap.value=N.state.directionalShadowMap,Dt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Dt.spotShadowMap.value=N.state.spotShadowMap,Dt.spotLightMatrix.value=N.state.spotLightMatrix,Dt.spotLightMap.value=N.state.spotLightMap,Dt.pointShadowMap.value=N.state.pointShadowMap,Dt.pointShadowMatrix.value=N.state.pointShadowMatrix),H.currentProgram=Bt,H.uniformsList=null,Bt}function wh(M){if(M.uniformsList===null){let U=M.currentProgram.getUniforms();M.uniformsList=Bs.seqWithValue(U.seq,M.uniforms)}return M.uniformsList}function Ah(M,U){let k=it.get(M);k.outputColorSpace=U.outputColorSpace,k.batching=U.batching,k.batchingColor=U.batchingColor,k.instancing=U.instancing,k.instancingColor=U.instancingColor,k.instancingMorph=U.instancingMorph,k.skinning=U.skinning,k.morphTargets=U.morphTargets,k.morphNormals=U.morphNormals,k.morphColors=U.morphColors,k.morphTargetsCount=U.morphTargetsCount,k.numClippingPlanes=U.numClippingPlanes,k.numIntersection=U.numClipIntersection,k.vertexAlphas=U.vertexAlphas,k.vertexTangents=U.vertexTangents,k.toneMapping=U.toneMapping}function lf(M,U,k,H,N){U.isScene!==!0&&(U=Tt),dt.resetTextureUnits();let at=U.fog,gt=H.isMeshStandardMaterial?U.environment:null,bt=D===null?y.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:Ui,yt=(H.isMeshStandardMaterial?kt:Gt).get(H.envMap||gt),Nt=H.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Bt=!!k.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Dt=!!k.morphAttributes.position,Kt=!!k.morphAttributes.normal,ce=!!k.morphAttributes.color,Te=ai;H.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(Te=y.toneMapping);let me=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ue=me!==void 0?me.length:0,Ut=it.get(H),ye=p.state.lights;if(te===!0&&(Y===!0||M!==v)){let We=M===v&&H.id===S;ct.setState(H,M,We)}let ne=!1;H.version===Ut.__version?(Ut.needsLights&&Ut.lightsStateVersion!==ye.state.version||Ut.outputColorSpace!==bt||N.isBatchedMesh&&Ut.batching===!1||!N.isBatchedMesh&&Ut.batching===!0||N.isBatchedMesh&&Ut.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Ut.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Ut.instancing===!1||!N.isInstancedMesh&&Ut.instancing===!0||N.isSkinnedMesh&&Ut.skinning===!1||!N.isSkinnedMesh&&Ut.skinning===!0||N.isInstancedMesh&&Ut.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Ut.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Ut.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Ut.instancingMorph===!1&&N.morphTexture!==null||Ut.envMap!==yt||H.fog===!0&&Ut.fog!==at||Ut.numClippingPlanes!==void 0&&(Ut.numClippingPlanes!==ct.numPlanes||Ut.numIntersection!==ct.numIntersection)||Ut.vertexAlphas!==Nt||Ut.vertexTangents!==Bt||Ut.morphTargets!==Dt||Ut.morphNormals!==Kt||Ut.morphColors!==ce||Ut.toneMapping!==Te||Ut.morphTargetsCount!==ue)&&(ne=!0):(ne=!0,Ut.__version=H.version);let Qe=Ut.currentProgram;ne===!0&&(Qe=ea(H,U,N));let is=!1,je=!1,$s=!1,ve=Qe.getUniforms(),dn=Ut.uniforms;if(Z.useProgram(Qe.program)&&(is=!0,je=!0,$s=!0),H.id!==S&&(S=H.id,je=!0),is||v!==M){Z.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),ve.setValue(C,"projectionMatrix",M.projectionMatrix),ve.setValue(C,"viewMatrix",M.matrixWorldInverse);let Je=ve.map.cameraPosition;Je!==void 0&&Je.setValue(C,vt.setFromMatrixPosition(M.matrixWorld)),J.logarithmicDepthBuffer&&ve.setValue(C,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ve.setValue(C,"isOrthographic",M.isOrthographicCamera===!0),v!==M&&(v=M,je=!0,$s=!0)}if(N.isSkinnedMesh){ve.setOptional(C,N,"bindMatrix"),ve.setOptional(C,N,"bindMatrixInverse");let We=N.skeleton;We&&(We.boneTexture===null&&We.computeBoneTexture(),ve.setValue(C,"boneTexture",We.boneTexture,dt))}N.isBatchedMesh&&(ve.setOptional(C,N,"batchingTexture"),ve.setValue(C,"batchingTexture",N._matricesTexture,dt),ve.setOptional(C,N,"batchingIdTexture"),ve.setValue(C,"batchingIdTexture",N._indirectTexture,dt),ve.setOptional(C,N,"batchingColorTexture"),N._colorsTexture!==null&&ve.setValue(C,"batchingColorTexture",N._colorsTexture,dt));let fn=k.morphAttributes;if((fn.position!==void 0||fn.normal!==void 0||fn.color!==void 0)&&st.update(N,k,Qe),(je||Ut.receiveShadow!==N.receiveShadow)&&(Ut.receiveShadow=N.receiveShadow,ve.setValue(C,"receiveShadow",N.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(dn.envMap.value=yt,dn.flipEnvMap.value=yt.isCubeTexture&&yt.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&U.environment!==null&&(dn.envMapIntensity.value=U.environmentIntensity),je&&(ve.setValue(C,"toneMappingExposure",y.toneMappingExposure),Ut.needsLights&&cf(dn,$s),at&&H.fog===!0&&j.refreshFogUniforms(dn,at),j.refreshMaterialUniforms(dn,H,z,Q,p.state.transmissionRenderTarget[M.id]),Bs.upload(C,wh(Ut),dn,dt)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Bs.upload(C,wh(Ut),dn,dt),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ve.setValue(C,"center",N.center),ve.setValue(C,"modelViewMatrix",N.modelViewMatrix),ve.setValue(C,"normalMatrix",N.normalMatrix),ve.setValue(C,"modelMatrix",N.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){let We=H.uniformsGroups;for(let Je=0,Rl=We.length;Je<Rl;Je++){let Ri=We[Je];qt.update(Ri,Qe),qt.bind(Ri,Qe)}}return Qe}function cf(M,U){M.ambientLightColor.needsUpdate=U,M.lightProbe.needsUpdate=U,M.directionalLights.needsUpdate=U,M.directionalLightShadows.needsUpdate=U,M.pointLights.needsUpdate=U,M.pointLightShadows.needsUpdate=U,M.spotLights.needsUpdate=U,M.spotLightShadows.needsUpdate=U,M.rectAreaLights.needsUpdate=U,M.hemisphereLights.needsUpdate=U}function hf(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(M,U,k){let H=it.get(M);H.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),it.get(M.texture).__webglTexture=U,it.get(M.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:k,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,U){let k=it.get(M);k.__webglFramebuffer=U,k.__useDefaultFramebuffer=U===void 0};let uf=C.createFramebuffer();this.setRenderTarget=function(M,U=0,k=0){D=M,w=U,P=k;let H=!0,N=null,at=!1,gt=!1;if(M){let yt=it.get(M);if(yt.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(C.FRAMEBUFFER,null),H=!1;else if(yt.__webglFramebuffer===void 0)dt.setupRenderTarget(M);else if(yt.__hasExternalTextures)dt.rebindTextures(M,it.get(M.texture).__webglTexture,it.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let Dt=M.depthTexture;if(yt.__boundDepthTexture!==Dt){if(Dt!==null&&it.has(Dt)&&(M.width!==Dt.image.width||M.height!==Dt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");dt.setupDepthRenderbuffer(M)}}let Nt=M.texture;(Nt.isData3DTexture||Nt.isDataArrayTexture||Nt.isCompressedArrayTexture)&&(gt=!0);let Bt=it.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Bt[U])?N=Bt[U][k]:N=Bt[U],at=!0):M.samples>0&&dt.useMultisampledRTT(M)===!1?N=it.get(M).__webglMultisampledFramebuffer:Array.isArray(Bt)?N=Bt[k]:N=Bt,I.copy(M.viewport),F.copy(M.scissor),B=M.scissorTest}else I.copy(xt).multiplyScalar(z).floor(),F.copy(zt).multiplyScalar(z).floor(),B=Jt;if(k!==0&&(N=uf),Z.bindFramebuffer(C.FRAMEBUFFER,N)&&H&&Z.drawBuffers(M,N),Z.viewport(I),Z.scissor(F),Z.setScissorTest(B),at){let yt=it.get(M.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+U,yt.__webglTexture,k)}else if(gt){let yt=U;for(let Nt=0;Nt<M.textures.length;Nt++){let Bt=it.get(M.textures[Nt]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+Nt,Bt.__webglTexture,k,yt)}}else if(M!==null&&k!==0){let yt=it.get(M.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,yt.__webglTexture,k)}S=-1},this.readRenderTargetPixels=function(M,U,k,H,N,at,gt,bt=0){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let yt=it.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&gt!==void 0&&(yt=yt[gt]),yt){Z.bindFramebuffer(C.FRAMEBUFFER,yt);try{let Nt=M.textures[bt],Bt=Nt.format,Dt=Nt.type;if(!J.textureFormatReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!J.textureTypeReadable(Dt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=M.width-H&&k>=0&&k<=M.height-N&&(M.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+bt),C.readPixels(U,k,H,N,Ct.convert(Bt),Ct.convert(Dt),at))}finally{let Nt=D!==null?it.get(D).__webglFramebuffer:null;Z.bindFramebuffer(C.FRAMEBUFFER,Nt)}}},this.readRenderTargetPixelsAsync=async function(M,U,k,H,N,at,gt,bt=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let yt=it.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&gt!==void 0&&(yt=yt[gt]),yt)if(U>=0&&U<=M.width-H&&k>=0&&k<=M.height-N){Z.bindFramebuffer(C.FRAMEBUFFER,yt);let Nt=M.textures[bt],Bt=Nt.format,Dt=Nt.type;if(!J.textureFormatReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!J.textureTypeReadable(Dt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Kt=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,Kt),C.bufferData(C.PIXEL_PACK_BUFFER,at.byteLength,C.STREAM_READ),M.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+bt),C.readPixels(U,k,H,N,Ct.convert(Bt),Ct.convert(Dt),0);let ce=D!==null?it.get(D).__webglFramebuffer:null;Z.bindFramebuffer(C.FRAMEBUFFER,ce);let Te=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await Gu(C,Te,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,Kt),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,at),C.deleteBuffer(Kt),C.deleteSync(Te),at}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,U=null,k=0){let H=Math.pow(2,-k),N=Math.floor(M.image.width*H),at=Math.floor(M.image.height*H),gt=U!==null?U.x:0,bt=U!==null?U.y:0;dt.setTexture2D(M,0),C.copyTexSubImage2D(C.TEXTURE_2D,k,0,0,gt,bt,N,at),Z.unbindTexture()};let df=C.createFramebuffer(),ff=C.createFramebuffer();this.copyTextureToTexture=function(M,U,k=null,H=null,N=0,at=null){at===null&&(N!==0?(Ss("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),at=N,N=0):at=0);let gt,bt,yt,Nt,Bt,Dt,Kt,ce,Te,me=M.isCompressedTexture?M.mipmaps[at]:M.image;if(k!==null)gt=k.max.x-k.min.x,bt=k.max.y-k.min.y,yt=k.isBox3?k.max.z-k.min.z:1,Nt=k.min.x,Bt=k.min.y,Dt=k.isBox3?k.min.z:0;else{let fn=Math.pow(2,-N);gt=Math.floor(me.width*fn),bt=Math.floor(me.height*fn),M.isDataArrayTexture?yt=me.depth:M.isData3DTexture?yt=Math.floor(me.depth*fn):yt=1,Nt=0,Bt=0,Dt=0}H!==null?(Kt=H.x,ce=H.y,Te=H.z):(Kt=0,ce=0,Te=0);let ue=Ct.convert(U.format),Ut=Ct.convert(U.type),ye;U.isData3DTexture?(dt.setTexture3D(U,0),ye=C.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(dt.setTexture2DArray(U,0),ye=C.TEXTURE_2D_ARRAY):(dt.setTexture2D(U,0),ye=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,U.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,U.unpackAlignment);let ne=C.getParameter(C.UNPACK_ROW_LENGTH),Qe=C.getParameter(C.UNPACK_IMAGE_HEIGHT),is=C.getParameter(C.UNPACK_SKIP_PIXELS),je=C.getParameter(C.UNPACK_SKIP_ROWS),$s=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,me.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,me.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Nt),C.pixelStorei(C.UNPACK_SKIP_ROWS,Bt),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Dt);let ve=M.isDataArrayTexture||M.isData3DTexture,dn=U.isDataArrayTexture||U.isData3DTexture;if(M.isDepthTexture){let fn=it.get(M),We=it.get(U),Je=it.get(fn.__renderTarget),Rl=it.get(We.__renderTarget);Z.bindFramebuffer(C.READ_FRAMEBUFFER,Je.__webglFramebuffer),Z.bindFramebuffer(C.DRAW_FRAMEBUFFER,Rl.__webglFramebuffer);for(let Ri=0;Ri<yt;Ri++)ve&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,it.get(M).__webglTexture,N,Dt+Ri),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,it.get(U).__webglTexture,at,Te+Ri)),C.blitFramebuffer(Nt,Bt,gt,bt,Kt,ce,gt,bt,C.DEPTH_BUFFER_BIT,C.NEAREST);Z.bindFramebuffer(C.READ_FRAMEBUFFER,null),Z.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(N!==0||M.isRenderTargetTexture||it.has(M)){let fn=it.get(M),We=it.get(U);Z.bindFramebuffer(C.READ_FRAMEBUFFER,df),Z.bindFramebuffer(C.DRAW_FRAMEBUFFER,ff);for(let Je=0;Je<yt;Je++)ve?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,fn.__webglTexture,N,Dt+Je):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,fn.__webglTexture,N),dn?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,We.__webglTexture,at,Te+Je):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,We.__webglTexture,at),N!==0?C.blitFramebuffer(Nt,Bt,gt,bt,Kt,ce,gt,bt,C.COLOR_BUFFER_BIT,C.NEAREST):dn?C.copyTexSubImage3D(ye,at,Kt,ce,Te+Je,Nt,Bt,gt,bt):C.copyTexSubImage2D(ye,at,Kt,ce,Nt,Bt,gt,bt);Z.bindFramebuffer(C.READ_FRAMEBUFFER,null),Z.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else dn?M.isDataTexture||M.isData3DTexture?C.texSubImage3D(ye,at,Kt,ce,Te,gt,bt,yt,ue,Ut,me.data):U.isCompressedArrayTexture?C.compressedTexSubImage3D(ye,at,Kt,ce,Te,gt,bt,yt,ue,me.data):C.texSubImage3D(ye,at,Kt,ce,Te,gt,bt,yt,ue,Ut,me):M.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,at,Kt,ce,gt,bt,ue,Ut,me.data):M.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,at,Kt,ce,me.width,me.height,ue,me.data):C.texSubImage2D(C.TEXTURE_2D,at,Kt,ce,gt,bt,ue,Ut,me);C.pixelStorei(C.UNPACK_ROW_LENGTH,ne),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Qe),C.pixelStorei(C.UNPACK_SKIP_PIXELS,is),C.pixelStorei(C.UNPACK_SKIP_ROWS,je),C.pixelStorei(C.UNPACK_SKIP_IMAGES,$s),at===0&&U.generateMipmaps&&C.generateMipmap(ye),Z.unbindTexture()},this.initRenderTarget=function(M){it.get(M).__webglFramebuffer===void 0&&dt.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?dt.setTextureCube(M,0):M.isData3DTexture?dt.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?dt.setTexture2DArray(M,0):dt.setTexture2D(M,0),Z.unbindTexture()},this.resetState=function(){w=0,P=0,D=null,Z.reset(),mt.reset()},typeof __THREE_DEVTOOLS__!="undefined"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ee._getDrawingBufferColorSpace(t),e.unpackColorSpace=ee._getUnpackColorSpace()}};var sl="v9-cinematic-1",Le=Math.PI/180,Ft=Math.PI*2,Gs=52,Vs=3.06,eh=.34,Ki=.085,Ke=.02,Gn=Ke+Ki;var Ed=5,rl=2.46,al=.4,nh=.3,Vn=1.95,Ti=.095,Qi=Gn+Ti,qr=.34,ol=1.5,Ei=24,ih=.42,ji={x:-.072,z:-.1,s:.84},wd={u:.58,v:.7},Ad=1.015,cn={w:11.4,d:12.6,h:.2,r:.55,z:1.8},Ve={w:9.6,d:9.4,r:.3,z:.6},St={wallZ:-4.66,wallW:30,wallH:12,wallBottom:-.34,window:{x:1.02,y:.78,w:2.15,h:1.18,z:-4.6},shade:.34,lamp:{x:-2.1,y:.88,z:-4.3},floorY:-.34},xn={r:.44,h:.1,ringR:.6,starR:.2},hn=["red","yellow","blue","green"],sh={red:0,yellow:13,blue:26,green:39},oi={red:50,yellow:11,blue:24,green:37},Ws={red:31,yellow:121,blue:211,green:301},Rd=[5,29],Cd={1:"truth",2:"truth",5:"truth",9:"truth",12:"truth",16:"truth",17:"truth",23:"truth",25:"truth",28:"truth",31:"truth",38:"truth",42:"truth",43:"truth",51:"truth",4:"dare",6:"dare",15:"dare",18:"dare",19:"dare",22:"dare",27:"dare",30:"dare",32:"dare",35:"dare",41:"dare",44:"dare",45:"dare",48:"dare",49:"dare",3:"touch",8:"touch",21:"touch",29:"touch",34:"touch",47:"touch",10:"thermo",36:"thermo",14:"wheel",40:"wheel"};Rd.forEach(s=>{Cd[s]="fate"});var de={red:13194314,yellow:14131786,blue:6193072,green:6066034};var Id={takeoff:"起飞",fly:"飞点",forbid:"禁跳",fate:"命运",entry:"进航",truth:"真心话",dare:"敢做",touch:"触碰",thermo:"温度计",wheel:"转盘",ring:"普通"},ll=s=>(s%Gs+Gs)%Gs,ts=s=>hn[(s%4+4)%4],Y_=s=>sh[ts(s)]===s,Z_=s=>ll(sh[ts(s)]+20)===s,J_=s=>ll(sh[ts(s)]+48)===s,$_=s=>hn.some(t=>oi[t]===s);function cl(s){return Y_(s)?"takeoff":Z_(s)?"fly":J_(s)?"forbid":Rd.indexOf(s)>=0?"fate":$_(s)?"entry":Cd[s]||"ring"}var Wn=s=>s*Ft/Gs,xe=(s,t,e)=>s<t?t:s>e?e:s,se=(s,t,e)=>s+(t-s)*e,es=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,Yr=s=>1-Math.pow(1-s,3),Xs=(s,t,e)=>{let n=xe((e-s)/(t-s),0,1);return n*n*(3-2*n)};function hl(s,t){return((t-s+Math.PI)%Ft+Ft)%Ft-Math.PI}var rh=["takeoff","fly","forbid","fate","entry","truth","dare","touch","thermo","wheel","ring"],qs=0,ul=45,dl=49,Pd=53,Hn=8,Dd=64,fl=(s,t)=>1+Math.max(0,rh.indexOf(s))*4+Math.max(0,hn.indexOf(t)),ns=s=>{let t=s%Hn,e=Math.floor(s/Hn);return[t/Hn,1-(e+1)/Hn,(t+1)/Hn,1-e/Hn]},pl=[3,4,1,6,2,5],Xt={walnut:{roughness:.55,metalness:.05,normalScale:.65,envMapIntensity:.55},brass:{roughness:.32,metalness:.85,envMapIntensity:1.25},felt:{roughness:.95,metalness:0,normalScale:1.15,envMapIntensity:.3},paper:{roughness:.8,metalness:0,normalScale:.45,envMapIntensity:.45},enamel:{roughness:.42,metalness:.06,envMapIntensity:.8},glass:{roughness:.12,metalness:0,envMapIntensity:1.4}},yn={fov:38,elev:50,overviewElevMin:56,lensK:Math.tan(21*Math.PI/180)/Math.tan(19*Math.PI/180),drift:{x:.055,y:.038,yaw:.0011,fov:.1}},vn={high:{dpr:2,shadow:2048,dust:110,glow:!0,grain:!0,env:!0,bloom:!0},medium:{dpr:1.5,shadow:1024,dust:64,glow:!0,grain:!1,env:!0,bloom:!1},low:{dpr:1,shadow:0,dust:28,glow:!1,grain:!1,env:!1,bloom:!1}},$i={cloud:{id:"cloud",label:"云海机舱",exposure:1.28,ink:329741,fog:661024,fogDensity:.0155,light:{hemiSky:7311540,hemiGround:1314828,hemiInt:.58,key:16760960,keyInt:4.1,rim:9418472,rimInt:1.45,fill:11453142,fillInt:.46,lamp:16756838,lampInt:24,lampDist:11,env:.72},tableTint:15391947,feltTint:6193034,boardTint:14864570,brass:11569751,brassRough:.3,felt:{base:"#3E5A64",base2:"#22343C",weave:"#6F8E96"},overlay:{vig:"rgba(2,5,9,.92)",pool:"rgba(255,178,104,.17)",rim:"rgba(232,190,128,.26)"},hub:{top:14725740,side:5913634,star:16179126,glow:16760944},window:{top:"#071422",mid:"#173E58",low:"#6E93A6",cloud:"#C8DCE6",moon:"#F6EAD2",moonX:.68,moonY:.26,moonR:.048,stars:.28,glare:.34},wallTint:3031639,floor:658962,dust:16767400,dustOpacity:.55,heatCool:9418472,heatWarm:16754784,bear:{fur:10255194,furDark:8019010,hat:2833496,band:13805417,scarf:10109506}},star:{id:"star",label:"星轨夜航",exposure:1.16,ink:263435,fog:461334,fogDensity:.0145,light:{hemiSky:7042228,hemiGround:1051924,hemiInt:.52,key:16760458,keyInt:3.8,rim:9677055,rimInt:1.65,fill:10463448,fillInt:.42,lamp:16756339,lampInt:21,lampDist:10,env:.66},tableTint:14866642,feltTint:5791104,boardTint:14470328,brass:11109724,brassRough:.28,felt:{base:"#333A5A",base2:"#1B1E33",weave:"#5D6690"},overlay:{vig:"rgba(1,2,7,.93)",pool:"rgba(255,174,115,.15)",rim:"rgba(214,196,150,.24)"},hub:{top:14267516,side:4863312,star:16049094,glow:16758906},window:{top:"#03030C",mid:"#0E1230",low:"#2A3560",cloud:"#5A6690",moon:"#F0E9FF",moonX:.7,moonY:.24,moonR:.05,stars:1,glare:.22},wallTint:2502216,floor:460556,dust:14472959,dustOpacity:.45,heatCool:9414911,heatWarm:16752832,bear:{fur:9338012,furDark:7233404,hat:3353943,band:13095146,scarf:9200796}},paper:{id:"paper",label:"纸月夜航",exposure:1.26,ink:657414,fog:1445897,fogDensity:.016,light:{hemiSky:13150602,hemiGround:1840140,hemiInt:.62,key:16763796,keyInt:4.3,rim:12101780,rimInt:1.05,fill:14205090,fillInt:.52,lamp:16758904,lampInt:25,lampDist:11,env:.72},tableTint:15785155,feltTint:8283458,boardTint:15125928,brass:12621149,brassRough:.36,felt:{base:"#6A5334",base2:"#3C2C19",weave:"#9A7A4C"},overlay:{vig:"rgba(8,5,2,.92)",pool:"rgba(255,178,104,.22)",rim:"rgba(240,206,150,.30)"},hub:{top:15252082,side:6044190,star:16771520,glow:16760434},window:{top:"#2A1A10",mid:"#6E4326",low:"#D0A070",cloud:"#F0D2A8",moon:"#FFE6BE",moonX:.62,moonY:.3,moonR:.058,stars:.1,glare:.42},wallTint:3812382,floor:722949,dust:16765856,dustOpacity:.5,heatCool:13215876,heatWarm:16751181,bear:{fur:10386520,furDark:8282178,hat:7623738,band:15784110,scarf:10372152}}};function Ys(s){return $i[s]||$i.cloud}function we(s,t){let e=document.createElement("canvas");return e.width=s,e.height=t,{c:e,g:e.getContext("2d")}}function Ae(s,t={}){let e=new Sr(s);return e.colorSpace=t.srgb===!1?Rn:Fe,e.anisotropy=t.aniso||4,e.needsUpdate=!0,e.generateMipmaps=!0,e.minFilter=Bn,e.magFilter=nn,t.repeat&&(e.wrapS=e.wrapT=ii,e.repeat.set(t.repeat[0],t.repeat[1])),e}function Mn(s,t,e,n,i,r){let a=Math.min(r,n/2,i/2);s.beginPath(),s.moveTo(t+a,e),s.arcTo(t+n,e,t+n,e+i,a),s.arcTo(t+n,e+i,t,e+i,a),s.arcTo(t,e+i,t,e,a),s.arcTo(t,e,t+n,e,a),s.closePath()}function Xn(s){return[s>>16&255,s>>8&255,s&255]}function Sn(s,t){let[e,n,i]=Xn(s);return t===void 0?`rgb(${e},${n},${i})`:`rgba(${e},${n},${i},${t})`}function un(s,t,e){let n=Xn(s),i=Xn(t);return`rgb(${Math.round(n[0]+(i[0]-n[0])*e)},${Math.round(n[1]+(i[1]-n[1])*e)},${Math.round(n[2]+(i[2]-n[2])*e)})`}function Cn(s){let t=s||1;return()=>(t=t*16807%2147483647,t/2147483647)}function gl(s,t=2){let e=s.width,n=s.height,i=s.getContext("2d").getImageData(0,0,e,n).data,{c:r,g:a}=we(e,n),o=a.createImageData(e,n),l=(h,u)=>i[((u%n+n)%n*e+(h%e+e)%e)*4],c=Math.max(.2,t);for(let h=0;h<n;h++)for(let u=0;u<e;u++){let d=(l(u+1,h)-l(u-1,h))/255,f=(l(u,h+1)-l(u,h-1))/255,g=-d*c,_=f*c,m=1,p=Math.hypot(g,_,m)||1,b=(h*e+u)*4;o.data[b]=(g/p*.5+.5)*255,o.data[b+1]=(_/p*.5+.5)*255,o.data[b+2]=(m/p*.5+.5)*255,o.data[b+3]=255}return a.putImageData(o,0,0),r}var ah=null,oh=null,lh=null;var ch=null;function Ld(s,t){if(s.beginPath(),t==="takeoff"||t==="fly")s.moveTo(16,64),s.lineTo(84,20),s.lineTo(60,82),s.lineTo(46,56),s.closePath(),s.moveTo(46,56),s.lineTo(84,20),t==="fly"&&(s.moveTo(8,34),s.lineTo(30,34),s.moveTo(4,44),s.lineTo(24,44),s.moveTo(10,54),s.lineTo(26,54));else if(t==="forbid")s.arc(50,50,32,0,Ft),s.moveTo(28,72),s.lineTo(72,28);else if(t==="fate")s.moveTo(50,8),s.quadraticCurveTo(54,44,92,50),s.quadraticCurveTo(54,56,50,92),s.quadraticCurveTo(46,56,8,50),s.quadraticCurveTo(46,44,50,8),s.closePath();else if(t==="entry")s.moveTo(20,18),s.lineTo(20,82),s.moveTo(20,18),s.lineTo(64,18),s.moveTo(20,82),s.lineTo(64,82),s.moveTo(64,18),s.lineTo(64,82),s.moveTo(50,50),s.lineTo(82,50),s.moveTo(70,38),s.lineTo(82,50),s.lineTo(70,62);else if(t==="truth")s.moveTo(18,26),s.lineTo(82,26),s.quadraticCurveTo(90,26,90,34),s.lineTo(90,62),s.quadraticCurveTo(90,70,82,70),s.lineTo(48,70),s.lineTo(30,86),s.lineTo(32,70),s.lineTo(18,70),s.quadraticCurveTo(10,70,10,62),s.lineTo(10,34),s.quadraticCurveTo(10,26,18,26),s.closePath(),s.moveTo(50,60),s.bezierCurveTo(50,56,44,52,40,56),s.bezierCurveTo(36,60,40,66,50,72),s.bezierCurveTo(60,66,64,60,60,56),s.bezierCurveTo(56,52,50,56,50,60),s.closePath();else if(t==="dare")s.moveTo(50,8),s.bezierCurveTo(60,30,74,34,72,54),s.bezierCurveTo(70,76,58,90,50,92),s.bezierCurveTo(42,90,30,78,30,60),s.bezierCurveTo(30,48,38,44,40,54),s.bezierCurveTo(42,62,50,46,50,8),s.closePath();else if(t==="touch")s.arc(38,52,18,0,Ft),s.arc(62,52,18,0,Ft),s.moveTo(50,22),s.lineTo(50,34),s.moveTo(38,30),s.lineTo(44,39),s.moveTo(62,30),s.lineTo(56,39);else if(t==="thermo")s.moveTo(44,16),s.lineTo(44,66),s.moveTo(56,16),s.lineTo(56,66),s.moveTo(44,16),s.quadraticCurveTo(50,8,56,16),s.arc(50,74,12,0,Ft),s.moveTo(60,30),s.lineTo(68,30),s.moveTo(60,44),s.lineTo(68,44),s.moveTo(60,58),s.lineTo(68,58);else if(t==="wheel"){s.arc(50,50,32,0,Ft),s.arc(50,50,7,0,Ft);for(let e=0;e<8;e++){let n=e/8*Ft;s.moveTo(50+Math.cos(n)*9,50+Math.sin(n)*9),s.lineTo(50+Math.cos(n)*30,50+Math.sin(n)*30)}}else s.arc(50,50,26,0,Ft),s.arc(50,50,10,0,Ft)}function ml(s,t,e,n,i,r,a={}){let o=i/100;s.save(),s.translate(e-i/2,n-i/2),s.scale(o,o),s.lineCap="round",s.lineJoin="round";let l=a.fill!==!1;a.engrave&&(s.save(),s.translate(0,1.6),s.strokeStyle="rgba(4,6,9,.55)",s.fillStyle="rgba(4,6,9,.5)",s.lineWidth=a.lw||5.2,Ld(s,t),l?s.fill():s.stroke(),s.restore()),s.strokeStyle=r,s.fillStyle=r,s.lineWidth=a.lw||4.6,Ld(s,t),l&&s.fill(),s.stroke(),s.restore()}function Fd(s={}){let t=Dd,e=t*Hn,n=s.aniso||8,{c:i,g:r}=we(e,e);r.clearRect(0,0,e,e);let a=c=>[c%Hn*t,Math.floor(c/Hn)*t],o=Cn(90210);{let[c,h]=a(qs),u=r.createLinearGradient(c,h,c,h+t);u.addColorStop(0,"#2C3138"),u.addColorStop(1,"#12151A"),r.fillStyle=u,r.fillRect(c,h,t,t)}{let[c,h]=a(Pd);r.fillStyle="#FFFFFF",r.fillRect(c,h,t,t)}let l=(c,h,u,d)=>{let f=de[d];r.save(),r.translate(c,h);let g=r.createRadialGradient(t*.42,t*.36,t*.06,t*.5,t*.55,t*.78);g.addColorStop(0,un(2304048,f,.34)),g.addColorStop(.55,un(1580324,f,.24)),g.addColorStop(1,"#101317"),r.fillStyle=g,Mn(r,1.5,1.5,t-3,t-3,t*.17),r.fill(),r.lineWidth=1.7,r.strokeStyle=Sn(f,.92),Mn(r,2.6,2.6,t-5.2,t-5.2,t*.15),r.stroke(),r.lineWidth=.8,r.strokeStyle="rgba(226,196,146,.28)",Mn(r,5.2,5.2,t-10.4,t-10.4,t*.12),r.stroke(),r.fillStyle="rgba(236,206,158,.34)";for(let[m,p]of[[6.4,6.4],[t-6.4,6.4],[6.4,t-6.4],[t-6.4,t-6.4]])r.beginPath(),r.arc(m,p,.85,0,Ft),r.fill();for(let m=0;m<7;m++){r.globalAlpha=.03+o()*.05,r.fillStyle=o()>.5?"#FFFFFF":"#000000";let p=2+o()*7,b=.5+o()*1.2;r.fillRect(6+o()*(t-14),6+o()*(t-14),p,b)}r.globalAlpha=1;let _=r.createLinearGradient(2,2,t*.7,t*.7);_.addColorStop(0,"rgba(255,238,210,.16)"),_.addColorStop(.4,"rgba(255,238,210,.03)"),_.addColorStop(1,"rgba(255,238,210,0)"),r.fillStyle=_,Mn(r,3,3,t-6,t-6,t*.15),r.fill(),r.restore()};return rh.forEach(c=>{hn.forEach(h=>{let[u,d]=a(fl(c,h));l(u,d,c,h);let f=un(de[h],15721164,.52),g=c==="takeoff"||c==="fly"||c==="fate"||c==="dare";ml(r,c,u+t/2,d+t*.505,t*.56,f,{engrave:!0,lw:5.4,fill:g})})}),hn.forEach((c,h)=>{let[u,d]=a(ul+h);r.save(),r.translate(u,d);let f=r.createLinearGradient(0,0,0,t);f.addColorStop(0,"#B7A47C"),f.addColorStop(1,"#77613F"),r.fillStyle=f,Mn(r,1.5,1.5,t-3,t-3,t*.16),r.fill(),r.lineWidth=1.7,r.strokeStyle=Sn(de[c],.85),Mn(r,2.6,2.6,t-5.2,t-5.2,t*.15),r.stroke(),r.strokeStyle="rgba(90,64,32,.42)",r.lineWidth=.9,Mn(r,5.2,5.2,t-10.4,t-10.4,t*.11),r.stroke(),ml(r,"entry",t/2,t*.5,t*.54,un(13149806,de[c],.3),{engrave:!0,lw:5.6,fill:!1}),r.restore()}),hn.forEach((c,h)=>{let[u,d]=a(dl+h);r.save(),r.translate(u,d);let f=r.createRadialGradient(t*.45,t*.4,2,t*.5,t*.5,t*.8);f.addColorStop(0,"#242A31"),f.addColorStop(1,"#0D1014"),r.fillStyle=f,Mn(r,1.5,1.5,t-3,t-3,t*.2),r.fill(),r.strokeStyle=Sn(de[c],.8),r.lineWidth=1.8,r.beginPath(),r.arc(t/2,t/2,t*.3,0,Ft),r.stroke(),ml(r,"fly",t/2,t*.5,t*.42,un(de[c],15721164,.35),{engrave:!0,lw:6,fill:!0}),r.restore()}),{canvas:i,tex:Ae(i,{aniso:n})}}function Ud(s,t=512){let e=t,n=Math.round(e/4),{c:i,g:r}=we(e,e),a=un(3022098,s,.22);r.fillStyle=a,r.fillRect(0,0,e,e);let o=Cn(4711);r.save(),r.translate(e*.18,e*.42);for(let d=0;d<46;d++){let f=20+d*(e/46)*1.15;r.beginPath();for(let g=0;g<=e*1.4;g+=6){let _=Math.sin(g/e*Ft*1.5+d*.7)*(2+d*.12),m=-f+_;g===0?r.moveTo(g,m):r.lineTo(g,m)}r.strokeStyle=d%3===0?"rgba(12,7,4,.42)":"rgba(86,58,36,.25)",r.lineWidth=d%5===0?2.4:1.1,r.stroke()}r.restore();for(let d=0;d<260;d++){let f=o()*e,g=o()*e;r.globalAlpha=.05+o()*.12,r.fillStyle=o()>.55?"rgba(10,6,3,.8)":"rgba(150,110,70,.6)",r.fillRect(f,g,1+o()*2.4,.6+o()*1.1)}r.globalAlpha=1;for(let d=0;d<18;d++){let f=d/18*e;r.globalAlpha=.06+o()*.1,r.strokeStyle=o()>.5?"#0B0704":"#7A5536",r.lineWidth=.8+o()*1.4,r.beginPath();for(let g=0;g<=e;g+=8){let _=f+Math.sin(g/e*Ft*2+d)*2;g===0?r.moveTo(g,_):r.lineTo(g,_)}r.stroke()}r.globalAlpha=1;let l=we(e,e);l.g.drawImage(i,0,0);let c=gl(l.c,5),h=we(Math.round(e/2),Math.round(e/2));h.g.drawImage(i,0,0,h.c.width,h.c.height);let u=h.g.getImageData(0,0,h.c.width,h.c.height);for(let d=0;d<u.data.length;d+=4){let g=200+(1-(u.data[d]*.3+u.data[d+1]*.6+u.data[d+2]*.1)/255)*55;u.data[d]=u.data[d+1]=u.data[d+2]=g}return h.g.putImageData(u,0,0),{map:Ae(i,{aniso:8}),normal:Ae(c,{srgb:!1,aniso:8}),rough:Ae(h.c,{srgb:!1,aniso:4})}}function _l(s,t=256){let e=t,{c:n,g:i}=we(e,e),r=Cn(1307);i.fillStyle=un(4869714,s,.42),i.fillRect(0,0,e,e);let a=8,o=e/a;for(let u=0;u<o;u++)for(let d=0;d<o;d++)i.globalAlpha=.05+r()*.08,i.fillStyle=r()>.5?"#FFFFFF":"#000000",i.fillRect(d*a,u*a,a,a);i.globalAlpha=1;for(let u=0;u<o;u++)i.globalAlpha=.2,i.strokeStyle="rgba(255,255,255,.35)",i.lineWidth=1,i.beginPath(),i.moveTo(0,u*a+.5),i.lineTo(e,u*a+.5),i.stroke(),i.globalAlpha=.14,i.strokeStyle="rgba(0,0,0,.5)",i.beginPath(),i.moveTo(u*a+.5,0),i.lineTo(u*a+.5,e),i.stroke();i.globalAlpha=1;for(let u=0;u<420;u++){i.globalAlpha=.05+r()*.09,i.strokeStyle=r()>.5?"rgba(255,245,230,.8)":"rgba(0,0,0,.7)",i.lineWidth=.8;let d=r()*e,f=r()*e,g=r()*Math.PI;i.beginPath(),i.moveTo(d,f),i.lineTo(d+Math.cos(g)*2.2,f+Math.sin(g)*2.2),i.stroke()}i.globalAlpha=1;for(let u=0;u<6;u++){let d=r()*e,f=r()*e,g=e*(.15+r()*.25),_=i.createRadialGradient(d,f,0,d,f,g);_.addColorStop(0,u%2?"rgba(255,255,255,.035)":"rgba(0,0,0,.06)"),_.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=_,i.beginPath(),i.arc(d,f,g,0,Ft),i.fill()}let l=we(e,e);l.g.drawImage(n,0,0);let c=gl(l.c,2.2),h=we(64,64);h.g.fillStyle="rgb(238,238,238)",h.g.fillRect(0,0,64,64),h.g.globalAlpha=.25;for(let u=0;u<120;u++)h.g.fillStyle=r()>.5?"#FFFFFF":"#D8D8D8",h.g.fillRect(r()*64,r()*64,1.5,1.5);return h.g.globalAlpha=1,{map:Ae(n,{aniso:8}),normal:Ae(c,{srgb:!1,aniso:8}),rough:Ae(h.c,{srgb:!1})}}function Zs(s=256){let t=s,{c:e,g:n}=we(t,t),i=Cn(77003),r=n.createLinearGradient(0,0,0,t);r.addColorStop(0,"#C79B63"),r.addColorStop(.45,"#A87F4D"),r.addColorStop(1,"#7C5A32"),n.fillStyle=r,n.fillRect(0,0,t,t);for(let h=0;h<900;h++){let u=i()*t;n.globalAlpha=.04+i()*.1,n.strokeStyle=i()>.45?"rgba(255,240,210,.9)":"rgba(40,24,10,.9)",n.lineWidth=.6+i()*1.2,n.beginPath(),n.moveTo(0,u),n.lineTo(t,u+(i()-.5)*1.5),n.stroke()}n.globalAlpha=1;for(let h=0;h<7;h++){let u=i()*t,d=i()*t,f=t*(.05+i()*.14),g=n.createRadialGradient(u,d,0,u,d,f);g.addColorStop(0,h%2?"rgba(50,30,12,.20)":"rgba(255,228,180,.10)"),g.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=g,n.beginPath(),n.arc(u,d,f,0,Ft),n.fill()}let a=we(t,t);a.g.drawImage(e,0,0);let o=gl(a.c,1.4),l=we(128,128);l.g.drawImage(e,0,0,128,128);let c=l.g.getImageData(0,0,128,128);for(let h=0;h<c.data.length;h+=4){let u=118+c.data[h]/255*40;c.data[h]=c.data[h+1]=c.data[h+2]=u}return l.g.putImageData(c,0,0),{map:Ae(e,{aniso:8}),normal:Ae(o,{srgb:!1,aniso:8}),rough:Ae(l.c,{srgb:!1})}}function Nd(s=256){let t=s,{c:e,g:n}=we(t,t),i=Cn(5150),r=n.createLinearGradient(0,0,t,t);r.addColorStop(0,"#F3E6D0"),r.addColorStop(.55,"#EADCC2"),r.addColorStop(1,"#DCCBAB"),n.fillStyle=r,n.fillRect(0,0,t,t);for(let c=0;c<900;c++){n.globalAlpha=.03+i()*.05,n.strokeStyle=i()>.5?"rgba(255,255,255,.9)":"rgba(120,92,58,.8)",n.lineWidth=.6;let h=i()*t,u=i()*t,d=i()*Math.PI;n.beginPath(),n.moveTo(h,u),n.lineTo(h+Math.cos(d)*3.4,u+Math.sin(d)*3.4),n.stroke()}n.globalAlpha=1;let a=n.createLinearGradient(t*.47,0,t*.53,0);a.addColorStop(0,"rgba(130,100,64,0)"),a.addColorStop(.45,"rgba(130,100,64,.24)"),a.addColorStop(.5,"rgba(255,252,244,.55)"),a.addColorStop(.56,"rgba(130,100,64,.22)"),a.addColorStop(1,"rgba(130,100,64,0)"),n.fillStyle=a,n.fillRect(t*.47,0,t*.06,t),n.globalAlpha=.18,n.strokeStyle="rgba(120,92,58,.9)",n.lineWidth=1.2,n.beginPath(),n.moveTo(0,t*.72),n.lineTo(t,t*.72),n.stroke(),n.globalAlpha=1;let o=we(t,t);o.g.drawImage(e,0,0);let l=gl(o.c,1.6);return{map:Ae(e,{aniso:8}),normal:Ae(l,{srgb:!1,aniso:8})}}function Od(s){let{c:e,g:n}=we(768,768),i=768/2,r=Cn(20260119);n.fillStyle=un(2759184,s,.16),n.fillRect(0,0,768,768),n.save(),n.translate(i,i);for(let l=0;l<70;l++){let c=8+l*(i/70)*1.18;n.beginPath();for(let h=0;h<=Ft+.02;h+=.03){let u=Math.sin(h*7+l*.8)*(1.6+l*.08),d=Math.cos(h)*(c+u),f=Math.sin(h)*(c+u);h===0?n.moveTo(d,f):n.lineTo(d,f)}n.strokeStyle=l%3===0?"rgba(10,6,3,.34)":"rgba(96,66,42,.22)",n.lineWidth=l%6===0?2.2:1,n.stroke()}n.restore();for(let l=0;l<2400;l++){let c=r()*Ft,h=Math.sqrt(r())*i;n.globalAlpha=.04+r()*.09,n.fillStyle=r()>.5?"rgba(0,0,0,.7)":"rgba(150,110,72,.55)",n.fillRect(i+Math.cos(c)*h,i+Math.sin(c)*h,1+r()*2,.6+r()*1)}n.globalAlpha=1;let a=n.createRadialGradient(i,i,i*.78,i,i,i);a.addColorStop(0,"rgba(0,0,0,0)"),a.addColorStop(1,"rgba(0,0,0,.55)"),n.fillStyle=a,n.beginPath(),n.arc(i,i,i,0,Ft),n.fill(),n.strokeStyle="rgba(200,160,102,.62)",n.lineWidth=5,n.beginPath(),n.arc(i,i,i*.955,0,Ft),n.stroke(),n.strokeStyle="rgba(30,18,8,.55)",n.lineWidth=2,n.beginPath(),n.arc(i,i,i*.935,0,Ft),n.stroke(),n.strokeStyle="rgba(214,176,116,.30)",n.lineWidth=3,n.beginPath(),n.arc(i,i,i*.7,0,Ft),n.stroke();for(let l of hn){let c=Wn(oi[l])+Math.PI;n.strokeStyle="rgba(206,168,110,.26)",n.lineWidth=2,n.beginPath(),n.moveTo(i+Math.cos(c)*i*.12,i+Math.sin(c)*i*.12),n.lineTo(i+Math.cos(c)*i*.66,i+Math.sin(c)*i*.66),n.stroke()}let o=n.createRadialGradient(i,i,0,i,i,i*.2);return o.addColorStop(0,"rgba(240,212,160,.85)"),o.addColorStop(.55,"rgba(190,146,86,.55)"),o.addColorStop(1,"rgba(120,82,40,0)"),n.fillStyle=o,n.beginPath(),n.arc(i,i,i*.2,0,Ft),n.fill(),n.strokeStyle="rgba(238,206,152,.62)",n.lineWidth=2.4,n.beginPath(),n.arc(i,i,i*.155,0,Ft),n.stroke(),Ae(e,{aniso:8})}function Bd(s=128){let t=s,{c:e,g:n}=we(t*3,t*2),i={1:[[.5,.5]],2:[[.28,.28],[.72,.72]],3:[[.26,.26],[.5,.5],[.74,.74]],4:[[.28,.28],[.72,.28],[.28,.72],[.72,.72]],5:[[.28,.28],[.72,.28],[.5,.5],[.28,.72],[.72,.72]],6:[[.28,.24],[.72,.24],[.28,.5],[.72,.5],[.28,.76],[.72,.76]]};for(let r=1;r<=6;r++){let a=(r-1)%3,o=Math.floor((r-1)/3),l=a*t,c=o*t;n.save(),n.translate(l,c);let h=n.createLinearGradient(0,0,t,t);h.addColorStop(0,"#F6ECD8"),h.addColorStop(.5,"#E8D9C0"),h.addColorStop(1,"#D3BEA0"),n.fillStyle=h,n.fillRect(0,0,t,t),n.strokeStyle="rgba(160,120,64,.55)",n.lineWidth=t*.022,n.strokeRect(t*.035,t*.035,t*.93,t*.93),n.strokeStyle="rgba(255,250,238,.5)",n.lineWidth=t*.012,n.strokeRect(t*.065,t*.065,t*.87,t*.87);for(let[u,d]of i[r]){let f=u*t,g=d*t,_=t*.071,m=n.createRadialGradient(f-_*.3,g-_*.3,0,f,g,_);m.addColorStop(0,"#14100C"),m.addColorStop(.7,"#2A2118"),m.addColorStop(1,"#4A3A28"),n.fillStyle=m,n.beginPath(),n.arc(f,g,_,0,Ft),n.fill(),n.strokeStyle="rgba(255,246,228,.28)",n.lineWidth=t*.008,n.beginPath(),n.arc(f,g,_*1.05,.4,Math.PI*1.1),n.stroke()}n.restore()}return{tex:Ae(e,{aniso:8}),cols:3,rows:2}}function zd(s){let{c:e,g:n}=we(512,512),i=Cn(881),r=n.createLinearGradient(0,0,0,512);r.addColorStop(0,s.top),r.addColorStop(.45,s.mid),r.addColorStop(.68,s.low),r.addColorStop(.78,un(14206632,16770752,.3)),r.addColorStop(1,"#0A0F16"),n.fillStyle=r,n.fillRect(0,0,512,512);let a=Math.round(240*(s.stars||0));if(a>0){for(let _=0;_<a;_++){let m=i()*512,p=i()*512*.55,b=.25+i()*.75;n.fillStyle=`rgba(235,236,255,${b})`,n.beginPath(),n.arc(m,p,i()>.92?1.6:.8,0,Ft),n.fill()}n.strokeStyle="rgba(190,200,255,.14)",n.lineWidth=1;for(let _=0;_<5;_++)n.beginPath(),n.arc(512*.72,512*1.35,512*(.55+_*.07),-2.1,-1.25),n.stroke()}let o=s.moonX*512,l=s.moonY*512,c=s.moonR*512,h=n.createRadialGradient(o,l,c*.4,o,l,c*6);h.addColorStop(0,Sn(16772040,.55)),h.addColorStop(.35,Sn(16768168,.16)),h.addColorStop(1,"rgba(255,220,168,0)"),n.fillStyle=h,n.beginPath(),n.arc(o,l,c*6,0,Ft),n.fill(),n.fillStyle=s.moon,n.beginPath(),n.arc(o,l,c,0,Ft),n.fill(),n.globalAlpha=.18,n.fillStyle="#B9A98C",n.beginPath(),n.arc(o-c*.3,l+c*.2,c*.22,0,Ft),n.fill(),n.beginPath(),n.arc(o+c*.35,l-c*.25,c*.16,0,Ft),n.fill(),n.globalAlpha=1;let u=s.cloud;for(let _=0;_<40;_++){let m=512*(.6+i()*.34),p=i()*512*1.2-512*.1,b=512*(.05+i()*.13),T=n.createRadialGradient(p,m,0,p,m,b);T.addColorStop(0,Sn(u,.42)),T.addColorStop(.6,Sn(u,.18)),T.addColorStop(1,Sn(u,0)),n.fillStyle=T,n.beginPath(),n.ellipse(p,m,b*1.9,b*.62,0,0,Ft),n.fill()}let d=n.createLinearGradient(o,l,o,512*.9);d.addColorStop(0,"rgba(255,232,196,.22)"),d.addColorStop(1,"rgba(255,232,196,0)"),n.fillStyle=d,n.beginPath(),n.moveTo(o-c*1.2,l),n.lineTo(o+c*1.2,l),n.lineTo(o+c*5,512*.9),n.lineTo(o-c*5,512*.9),n.closePath(),n.fill();let f=n.createLinearGradient(0,0,512,512);f.addColorStop(0,"rgba(255,255,255,.10)"),f.addColorStop(.32,"rgba(255,255,255,0)"),f.addColorStop(1,"rgba(0,0,0,.30)"),n.fillStyle=f,n.fillRect(0,0,512,512);let g=n.createRadialGradient(512*.5,512*.55,512*.2,512*.5,512*.55,512*.72);return g.addColorStop(0,"rgba(0,0,0,0)"),g.addColorStop(1,"rgba(0,4,8,.55)"),n.fillStyle=g,n.fillRect(0,0,512,512),Ae(e,{aniso:4})}function kd(s,t=512){let e=t,{c:n,g:i}=we(e,e),r=Cn(31337);i.fillStyle=un(1712682,s,.55),i.fillRect(0,0,e,e);for(let a=0;a<4;a++){let o=a*128;i.fillStyle="rgba(0,0,0,.34)",i.fillRect(o,0,3,e),i.fillStyle="rgba(255,238,208,.075)",i.fillRect(o+3,0,1.5,e)}for(let a of[96,320]){let o=i.createLinearGradient(0,a,0,a+6);o.addColorStop(0,"rgba(196,156,100,.55)"),o.addColorStop(.5,"rgba(232,196,140,.30)"),o.addColorStop(1,"rgba(20,14,8,.35)"),i.fillStyle=o,i.fillRect(0,a,e,6)}for(let a=0;a<2600;a++)i.globalAlpha=.025+r()*.05,i.fillStyle=r()>.5?"rgba(255,255,255,.8)":"rgba(0,0,0,.9)",i.fillRect(r()*e,r()*e,1+r()*2,1+r());i.globalAlpha=1;for(let a=0;a<6;a++){let o=r()*e,l=r()*e,c=e*(.1+r()*.24),h=i.createRadialGradient(o,l,0,o,l,c);h.addColorStop(0,r()>.5?"rgba(0,0,0,.16)":"rgba(255,220,170,.05)"),h.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=h,i.beginPath(),i.arc(o,l,c,0,Ft),i.fill()}return Ae(n,{aniso:4,repeat:[3,1]})}function xl(s,t){let{c:e,g:n}=we(s,s),i=s/2,r=n.createRadialGradient(i,i,0,i,i,i);return t.forEach(([a,o])=>r.addColorStop(a,o)),n.fillStyle=r,n.fillRect(0,0,s,s),Ae(e)}function Hd(){return ah||(ah=xl(128,[[0,"rgba(0,0,0,.62)"],[.42,"rgba(0,0,0,.34)"],[.78,"rgba(0,0,0,.10)"],[1,"rgba(0,0,0,0)"]])),ah}function Zr(){return oh||(oh=xl(128,[[0,"rgba(255,240,214,.95)"],[.3,"rgba(255,204,136,.48)"],[.65,"rgba(255,186,110,.14)"],[1,"rgba(255,186,110,0)"]])),oh}function Gd(){return lh||(lh=xl(64,[[0,"rgba(255,246,232,.9)"],[.38,"rgba(255,226,190,.38)"],[1,"rgba(255,226,190,0)"]])),lh}function Vd(){let{c:t,g:e}=we(128,128),n=128/2,i=e.createRadialGradient(n,n,n*.45,n,n,n*.98);return i.addColorStop(0,"rgba(255,214,150,0)"),i.addColorStop(.62,"rgba(255,222,168,.85)"),i.addColorStop(1,"rgba(255,214,150,0)"),e.fillStyle=i,e.beginPath(),e.arc(n,n,n,0,Ft),e.fill(),Ae(t)}function Wd(){return ch||(ch=xl(32,[[0,"rgba(255,244,220,.95)"],[.4,"rgba(255,220,170,.35)"],[1,"rgba(255,220,170,0)"]])),ch}function Xd(s,t,e=512){let n=e,{c:i,g:r}=we(n,n),a=t.w,o=t.d,l=p=>p/a*n,c=Cn(606),h=r.createRadialGradient(0,0,l(a*.3),0,0,l(a*.62));h.addColorStop(0,"rgba(0,0,0,0)"),h.addColorStop(.45,s.vig.replace(/[\d.]+\)$/,"0.18)")),h.addColorStop(1,s.vig.replace(/[\d.]+\)$/,"0.60)")),r.save(),r.translate(n/2,n/2),r.scale(1,a/o),r.fillStyle=h,r.beginPath(),r.arc(0,0,l(a*.78),0,Ft),r.fill(),r.restore();let u=r.createRadialGradient(n*.34,n*.42,l(.3),n*.34,n*.42,l(4));u.addColorStop(0,s.pool),u.addColorStop(.5,s.pool.replace(/[\d.]+\)$/,"0.10)")),u.addColorStop(1,"rgba(255,178,104,0)"),r.save(),r.translate(n/2,n/2),r.scale(1,a/o),r.fillStyle=u,r.beginPath(),r.arc(0,0,l(4.4),0,Ft),r.fill(),r.restore();let d=r.createRadialGradient(0,0,l(3.2),0,0,l(3.62));d.addColorStop(0,"rgba(0,0,0,0)"),d.addColorStop(.25,"rgba(0,0,0,.34)"),d.addColorStop(.62,"rgba(0,0,0,.20)"),d.addColorStop(1,"rgba(0,0,0,0)"),r.save(),r.translate(n/2,n/2),r.scale(1,a/o),r.fillStyle=d,r.beginPath(),r.arc(0,0,l(3.62),0,Ft),r.fill(),r.restore(),r.save(),r.translate(n/2,n/2),r.scale(1,a/o),r.strokeStyle=s.rim,r.lineWidth=2,r.beginPath(),r.arc(0,0,l(3.92),0,Ft),r.stroke(),r.restore();let f=r.createLinearGradient(n*.05,0,n*.9,n);f.addColorStop(0,"rgba(255,238,210,.10)"),f.addColorStop(.4,"rgba(255,238,210,.035)"),f.addColorStop(1,"rgba(255,238,210,0)"),r.fillStyle=f,r.fillRect(0,0,n,n);let g=r.createLinearGradient(0,0,0,n*.42);g.addColorStop(0,"rgba(3,6,10,.55)"),g.addColorStop(.6,"rgba(3,6,10,.18)"),g.addColorStop(1,"rgba(3,6,10,0)"),r.fillStyle=g,r.fillRect(0,0,n,n*.42);let _=r.createLinearGradient(0,n,0,n*.7);_.addColorStop(0,"rgba(255,196,132,.12)"),_.addColorStop(1,"rgba(255,196,132,0)"),r.fillStyle=_,r.fillRect(0,n*.7,n,n*.3);for(let p=0;p<9;p++){let b=c()*n,T=c()*n,y=n*(.03+c()*.09),A=r.createRadialGradient(b,T,0,b,T,y);A.addColorStop(0,p%2?"rgba(255,255,255,.020)":"rgba(0,0,0,.045)"),A.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=A,r.beginPath(),r.arc(b,T,y,0,Ft),r.fill()}r.globalCompositeOperation="destination-in",r.save(),r.translate(n/2,n/2),r.scale(1,a/o);let m=r.createRadialGradient(0,0,l(a*.34),0,0,l(a*.53));return m.addColorStop(0,"rgba(0,0,0,1)"),m.addColorStop(.82,"rgba(0,0,0,.96)"),m.addColorStop(.94,"rgba(0,0,0,.55)"),m.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=m,r.beginPath(),r.arc(0,0,l(a*.53),0,Ft),r.fill(),r.restore(),r.globalCompositeOperation="source-over",Ae(i,{aniso:4})}function qd(s,t=256){let e=t,{c:n,g:i}=we(e,e),r=e/2,a=i.createRadialGradient(r*.85,r*.72,r*.05,r,r,r);a.addColorStop(0,"#FFF4DC"),a.addColorStop(.4,Sn(s.top)),a.addColorStop(1,Sn(s.side)),i.fillStyle=a,i.beginPath(),i.arc(r,r,r,0,Ft),i.fill();let o=Cn(99);for(let h=0;h<260;h++){i.globalAlpha=.04+o()*.08,i.strokeStyle=o()>.5?"rgba(255,248,230,.8)":"rgba(60,36,12,.7)",i.lineWidth=.7;let u=o()*e;i.beginPath(),i.moveTo(0,u),i.lineTo(e,u+(o()-.5)*2),i.stroke()}i.globalAlpha=1,i.strokeStyle="rgba(70,42,16,.40)",i.lineWidth=2.4,i.beginPath(),i.arc(r,r,r*.86,0,Ft),i.stroke(),i.strokeStyle="rgba(255,250,236,.55)",i.lineWidth=1.8,i.beginPath(),i.arc(r,r,r*.78,0,Ft),i.stroke(),i.save(),i.translate(r,r);let l=()=>{i.beginPath();for(let h=0;h<10;h++){let u=h%2===0?r*.52:r*.22,d=-Math.PI/2+h*Math.PI/5,f=Math.cos(d)*u,g=Math.sin(d)*u;h===0?i.moveTo(f,g):i.lineTo(f,g)}i.closePath()};l(),i.fillStyle="rgba(58,34,12,.32)",i.fill(),i.translate(0,-1.6),l();let c=i.createLinearGradient(-r*.5,-r*.5,r*.5,r*.5);return c.addColorStop(0,"#FFFFFF"),c.addColorStop(1,Sn(s.star)),i.fillStyle=c,i.fill(),i.strokeStyle="rgba(255,250,236,.55)",i.lineWidth=1.4,i.stroke(),i.restore(),Ae(n,{aniso:8})}function Yd(s,t,e,n,i){let r=n||256,{c:a,g:o}=we(r,r),l=de[t]||de.red,c=Cn(7788),h=o.createRadialGradient(r*.44,r*.38,r*.04,r*.5,r*.55,r*.78);h.addColorStop(0,un(1777445,l,.34)),h.addColorStop(.55,un(1251100,l,.24)),h.addColorStop(1,"#0A0D11"),o.fillStyle=h,Mn(o,3,3,r-6,r-6,r*.14),o.fill(),o.strokeStyle="rgba(214,180,124,.85)",o.lineWidth=r*.018,Mn(o,r*.035,r*.035,r*.93,r*.93,r*.125),o.stroke(),o.strokeStyle=Sn(l,.9),o.lineWidth=r*.01,Mn(o,r*.062,r*.062,r*.876,r*.876,r*.105),o.stroke(),o.strokeStyle="rgba(226,196,146,.24)",o.lineWidth=r*.004,Mn(o,r*.086,r*.086,r*.828,r*.828,r*.09),o.stroke();for(let _=0;_<22;_++)o.globalAlpha=.03+c()*.05,o.fillStyle=c()>.5?"#FFFFFF":"#000000",o.fillRect(r*(.08+c()*.8),r*(.08+c()*.8),2+c()*7,.8+c());o.globalAlpha=1;let u=o.createRadialGradient(r*.29,r*.26,0,r*.29,r*.26,r*.25);u.addColorStop(0,"rgba(20,12,6,.30)"),u.addColorStop(1,"rgba(20,12,6,0)"),o.fillStyle=u,o.beginPath(),o.arc(r*.29,r*.26,r*.25,0,Ft),o.fill();let d=r*(i?i.u:.58),f=r*(i?i.v:.7),g=s==="takeoff"||s==="fly"||s==="fate"||s==="dare";return ml(o,s,d,f-r*.055,r*.3,un(l,15721164,.55),{engrave:!0,lw:5.2,fill:g}),e&&(o.fillStyle="rgba(236,220,190,.86)",o.font=`600 ${Math.round(r*.082)}px "Songti SC","STSong","SimSun","PingFang SC",serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(e,d,f+r*.115),o.strokeStyle="rgba(212,176,120,.34)",o.lineWidth=1.2,o.beginPath(),o.moveTo(d-r*.07,f+r*.165),o.lineTo(d+r*.07,f+r*.165),o.stroke()),Ae(a,{aniso:8})}function Zd(){let s=new Oi;s.background=new Lt(329482);let t=(e,n,i,r,a,o,l)=>{let c=new Pt(e,new Oe({color:n,side:He}));return c.position.set(i,r,a),o&&(c.rotation.x=o),l&&(c.rotation.y=l),s.add(c),c};return t(new Ye(24,14,24),1317924,0,0,0).material.side=Be,t(new be(18,18),3811096,0,-4.4,0,-Math.PI/2),t(new be(3.2,3.2),16766106,-4.6,3.2,-2.2,0,Math.PI/2),t(new be(1.4,1.4),16773330,-4.4,3,-2.4,0,Math.PI/2),t(new be(4.2,2.6),9418472,5.2,1.4,-4.6,0,-Math.PI/2.2),t(new be(5,3.2),4086400,5.4,1.2,-4.4,0,-Math.PI/2.2),t(new be(10,10),2764856,0,6.6,0,Math.PI/2),s}function Jr(s){let t=[],e=[],n=[],i=new R,r=new Ht;for(let{geo:o,matrix:l}of s){let c=o.index?o.toNonIndexed():o.clone();l&&c.applyMatrix4(l);let h=c.getAttribute("position"),u=c.getAttribute("normal"),d=c.getAttribute("uv");for(let f=0;f<h.count;f++)t.push(h.getX(f),h.getY(f),h.getZ(f)),u&&e.push(u.getX(f),u.getY(f),u.getZ(f)),d?n.push(d.getX(f),d.getY(f)):n.push(0,0);c.dispose()}let a=new _e;return a.setAttribute("position",new Wt(t,3)),e.length&&a.setAttribute("normal",new Wt(e,3)),a.setAttribute("uv",new Wt(n,2)),e.length||a.computeVertexNormals(),a}function yl(s){let t=[],e=[],n=[],i=new R,r=new R,a=new R,o=ns(qs),l=(o[0]+o[2])/2,c=(o[1]+o[3])/2;function h(d,f,g,_,m,p){i.subVectors(f,d),r.subVectors(g,d),a.crossVectors(i,r).normalize();let b=[0,1,2,0,2,3],T=[d,f,g,_];for(let y of b){let A=T[y];t.push(A.x,A.y,A.z);let w=m[y];e.push(w[0],w[1]),n.push(p[0],p[1],p[2])}}for(let d of s){let f=Math.cos(d.rot),g=Math.sin(d.rot),_=d.w/2,m=d.d/2,p=(ot,ht,xt)=>new R(d.x+ot*f+ht*g,xt,d.z-ot*g+ht*f),b=Math.max(.006,Math.min(d.w,d.d)*(d.bevel===void 0?.1:d.bevel)),T=b*.95,y=_-b,A=m-b,w=d.top,P=d.top-T,D=d.uv[0],S=d.uv[1],v=d.uv[2],I=d.uv[3],F=(v-D)*.012,B=(I-S)*.012,V=[1,1,1],G=[.84,.84,.84];h(p(-y,A,w),p(y,A,w),p(y,-A,w),p(-y,-A,w),[[D+F,S+B],[v-F,S+B],[v-F,I-B],[D+F,I-B]],V),h(p(-_,m,P),p(_,m,P),p(y,A,w),p(-y,A,w),[[D,I],[v,I],[v-F,I-B],[D+F,I-B]],G),h(p(-y,-A,w),p(y,-A,w),p(_,-m,P),p(-_,-m,P),[[D+F,S+B],[v-F,S+B],[v,S],[D,S]],G),h(p(y,-A,w),p(y,A,w),p(_,m,P),p(_,-m,P),[[v-F,S+B],[v-F,I-B],[v,I],[v,S]],G),h(p(-_,-m,P),p(-_,m,P),p(-y,A,w),p(-y,-A,w),[[D,S],[D,I],[D+F,I-B],[D+F,S+B]],G);let W=l,Q=c,z=[[W,Q],[W,Q],[W,Q],[W,Q]];h(p(-_,m,w),p(-_,m,d.bottom),p(_,m,d.bottom),p(_,m,w),z,d.side),h(p(_,m,w),p(_,m,d.bottom),p(_,-m,d.bottom),p(_,-m,w),z,d.side),h(p(_,-m,w),p(_,-m,d.bottom),p(-_,-m,d.bottom),p(-_,-m,w),z,d.side),h(p(-_,-m,w),p(-_,-m,d.bottom),p(-_,m,d.bottom),p(-_,m,w),z,d.side)}let u=new _e;return u.setAttribute("position",new Wt(t,3)),u.setAttribute("uv",new Wt(e,2)),u.setAttribute("color",new Wt(n,3)),u.computeVertexNormals(),u}function $d(s){let t=new Ye(s,s,s),e=t.getAttribute("uv");for(let n=0;n<6;n++){let i=pl[n],r=(i-1)%3,a=Math.floor((i-1)/3);for(let o=0;o<4;o++){let l=n*4+o,c=e.getX(l)===1?1:0,h=e.getY(l)===1?1:0;e.setXY(l,(r+c)/3,(1-a+h)/2)}}return e.needsUpdate=!0,t}var hh=null,uh=null;function Q_(){return hh||(hh=Nd(256)),hh}function j_(){return uh||(uh=Zs(128)),uh}function Kd(s,t){let e=new Se,n=.46,i=.3,r=.075,a=[0,.022,-n/2],o=[0,.05,n/2],l=[-i/2,.002,n/2-.07],c=[i/2,.002,n/2-.07],h=[0,-r,n/2-.02],u=[0,.18,n/2-.005],d=[0,.028,.02],f=(z,ot,ht,xt,zt)=>{z.push(...ht,...xt,...zt);for(let Jt of[ht,xt,zt])ot.push(Jd(.5+Jt[0]/(i*1.45)),Jd(.5+Jt[2]/(n*1.2)))},g=[],_=[];f(g,_,a,l,d),f(g,_,a,d,c),f(g,_,d,l,o),f(g,_,d,o,c);let m=[],p=[];f(m,p,a,h,d),f(m,p,d,h,o),f(m,p,o,h,u);let b=(z,ot)=>{let ht=new _e;return ht.setAttribute("position",new Wt(z,3)),ht.setAttribute("uv",new Wt(ot,2)),ht.computeVertexNormals(),ht},T=Q_(),y=j_(),A=new ie({map:T.map,normalMap:T.normal,normalScale:new nt(Xt.paper.normalScale,Xt.paper.normalScale),color:s,roughness:Xt.paper.roughness,metalness:Xt.paper.metalness,side:He,envMapIntensity:Xt.paper.envMapIntensity}),w=new ie({map:y.map,normalMap:y.normal,roughnessMap:y.rough,normalScale:new nt(.35,.35),color:t,roughness:Xt.brass.roughness,metalness:Xt.brass.metalness,envMapIntensity:Xt.brass.envMapIntensity}),P=b(g,_),D=b(m,p),S=Jr([{geo:P},{geo:D}]);P.dispose(),D.dispose();let v=new Pt(S,A);v.castShadow=!0,v.receiveShadow=!0;let I=new Ye(.016,.012,n*.62),F=new jt().makeTranslation(0,.033,.03),B=new Ce(.02,10,7),V=new jt().makeTranslation(0,.005,-n/2+.022),G=Jr([{geo:I,matrix:F},{geo:B,matrix:V}]);I.dispose(),B.dispose();let W=new Pt(G,w);W.castShadow=!0;let Q=new Se;return Q.rotation.set(-.045,0,.16),Q.add(v),Q.add(W),e.add(Q),{group:e,setColor(z,ot){A.color.set(z),ot!==void 0&&w.color.set(ot)},dispose(){S.dispose(),G.dispose(),A.dispose(),w.dispose()}}}function Jd(s){return s<0?0:s>1?1:s}function vl(s,t){let e=new Pt(new be(s,s),new Oe({map:Hd(),transparent:!0,opacity:t===void 0?.5:t,depthWrite:!1,color:0}));return e.rotation.x=-Math.PI/2,e.position.y=.006,e}function $r(s,t){let e=new Pt(new be(s,s),new Oe({map:Zr(),transparent:!0,opacity:0,depthWrite:!1,blending:gn,color:t,fog:!1,toneMapped:!1}));return e.rotation.x=-Math.PI/2,e}function Qd(s){let t=new Pt(new be(s,s),new Oe({map:Vd(),transparent:!0,opacity:0,depthWrite:!1,blending:gn,color:16767138,fog:!1,toneMapped:!1}));return t.rotation.x=-Math.PI/2,t.position.y=.01,t}function jd(s){let t=new Se;t.visible=!1;let e=new Oe({map:s,transparent:!0,opacity:.36,depthWrite:!1,blending:gn,color:16771272,fog:!1,toneMapped:!1}),n=[];for(let i=0;i<10;i++){let r=new be(.045,2.4),a=new Pt(r,e),o=i/10*Math.PI*2+i%3*.3,l=.55+i%4*.24;a.position.set(Math.cos(o)*l,.45+i%5*.22,-2.2+i%3*1.3),a.rotation.z=(i%2?1:-1)*.06,t.add(a),n.push(a)}return{group:t,update(i,r){if(r)for(let a of n)a.position.z+=i*.0065,a.position.z>3.4&&(a.position.z-=6.2)},dispose(){n.forEach(i=>i.geometry.dispose()),e.dispose()}}}var dh=null,fh=null;function tx(){return dh||(dh=_l(13616826,128)),dh}function ex(){return fh||(fh=Zs(96)),fh}function tf(){let s=new Se,t=tx(),e=ex(),n={fur:new ie({map:t.map,normalMap:t.normal,normalScale:new nt(.85,.85),color:9071180,roughness:Xt.felt.roughness,metalness:0,envMapIntensity:.35}),furDark:new ie({map:t.map,normalMap:t.normal,normalScale:new nt(.7,.7),color:7098682,roughness:.96,metalness:0,envMapIntensity:.3}),cream:new ie({map:t.map,color:15259323,roughness:.9,metalness:0,envMapIntensity:.35}),ink:new ie({color:1314832,roughness:.22,metalness:.15,envMapIntensity:.9}),hat:new ie({map:t.map,normalMap:t.normal,color:2438222,roughness:.86,metalness:.02,envMapIntensity:.4}),band:new ie({map:e.map,normalMap:e.normal,roughnessMap:e.rough,color:13213795,roughness:Xt.brass.roughness,metalness:Xt.brass.metalness,envMapIntensity:Xt.brass.envMapIntensity}),scarf:new ie({map:t.map,normalMap:t.normal,color:9321275,roughness:.94,metalness:0,envMapIntensity:.3})},i={},r=new Ee,a=(l,c,h,u,d,f,g)=>{r.position.set(h,u,d),r.rotation.set(f&&f[0]||0,f&&f[1]||0,f&&f[2]||0),r.scale.set(g?g[0]:1,g?g[1]:1,g?g[2]:1),r.updateMatrix(),(i[l]=i[l]||[]).push({geo:c,matrix:r.matrix.clone()})};a("fur",new Ce(.135,14,10),0,.155,0),a("fur",new Ce(.125,14,10),0,.375,0),a("cream",new Ce(.062,12,9),0,.345,-.1),a("ink",new Ce(.019,10,8),0,.368,-.152),a("ink",new Ce(.017,8,6),-.05,.42,-.116),a("ink",new Ce(.017,8,6),.05,.42,-.116),a("furDark",new Ce(.047,12,9),-.082,.462,.004),a("furDark",new Ce(.047,12,9),.082,.462,.004),a("fur",new Rs(.028,.085,3,8),-.128,.185,0,[0,0,.55]),a("fur",new Rs(.028,.085,3,8),.128,.185,0,[0,0,-.55]),a("furDark",new Ce(.05,10,8),-.062,.042,-.018),a("furDark",new Ce(.05,10,8),.062,.042,-.018),a("scarf",new on(.118,.032,7,18),0,.268,0,[Math.PI/2,0,0]),a("scarf",new Ye(.07,.1,.026),.095,.215,.05,[.2,.1,-.2]),a("hat",new Ze(.098,.106,.058,16,1),0,.468,.012),a("band",new Ze(.104,.104,.012,18,1),0,.443,.012),a("hat",new Ce(.062,14,9),0,.474,-.062,null,[1.04,.17,.52]),a("band",new on(.026,.008,5,14),0,.468,-.092,[-.5,0,0]);let o=[];for(let l of Object.keys(i)){let c=i[l],h=nx(c),u=new Pt(h,n[l]);u.castShadow=!0,u.receiveShadow=!0,s.add(u),o.push(h),c.forEach(d=>d.geo.dispose())}return s.position.y=Ki,s.rotation.y=Math.PI+Ei*Le,s.scale.setScalar(.001),s.visible=!1,{group:s,setOutfit(l){l&&(l.fur!==void 0&&n.fur.color.set(l.fur),l.furDark!==void 0&&n.furDark.color.set(l.furDark),l.hat!==void 0&&n.hat.color.set(l.hat),l.band!==void 0&&n.band.color.set(l.band),l.scarf!==void 0&&n.scarf.color.set(l.scarf))},setVisible(l){s.visible=!!l},dispose(){o.forEach(l=>l.dispose()),Object.keys(n).forEach(l=>n[l].dispose())}}}function nx(s){let t=[],e=[],n=[];for(let{geo:r,matrix:a}of s){let o=r.index?r.toNonIndexed():r.clone();o.applyMatrix4(a);let l=o.getAttribute("position"),c=o.getAttribute("normal"),h=o.getAttribute("uv");for(let u=0;u<l.count;u++)t.push(l.getX(u),l.getY(u),l.getZ(u)),c&&e.push(c.getX(u),c.getY(u),c.getZ(u)),h?n.push(h.getX(u),h.getY(u)):n.push(0,0);o.dispose()}let i=new _e;return i.setAttribute("position",new Wt(t,3)),e.length?i.setAttribute("normal",new Wt(e,3)):i.computeVertexNormals(),i.setAttribute("uv",new Wt(n,2)),i}function ph(s){let t=Number(s);return isFinite(t)?Math.min(1.5,Math.max(.8,t)):1}function mh(s){let t=ph(s),e=t<=1?1/t:1-.6*(t-1);return Math.min(1.4,Math.max(.7,e))}var Ml=class{constructor(t={}){this.min=t.min||.8,this.max=t.max||1.5,this.tau=t.tau||110,this.target=1,this.value=1,this.active=!0,this.instant=!1}set(t){let e=Number(t);return isFinite(e)&&(this.target=Math.min(this.max,Math.max(this.min,e))),this.instant&&(this.value=this.target),this.target}by(t){let e=Number(t);return this.set(this.target*(isFinite(e)&&e>0?e:1))}reset(){return this.set(1)}setActive(t){let e=!!t;return e===this.active?this.active:(this.active=e,this.instant&&(this.value=this.want()),this.active)}setInstant(t){return this.instant=!!t,this.instant&&(this.value=this.want()),this.instant}want(){return this.active?this.target:1}step(t){let e=this.want();if(this.instant||!(t>0))return this.value=e,this.value;let n=1-Math.exp(-t/this.tau),i=this.value+(e-this.value)*n;return this.value=Math.abs(e-i)<8e-4?e:i,this.value}info(){return{value:+this.value.toFixed(3),target:+this.target.toFixed(3),min:this.min,max:this.max,active:this.active,instant:this.instant,radiusFactor:+mh(this.value).toFixed(3)}}};var Sl=class{constructor(t,e={}){this.camera=t,this.runAnim=e.runAnim||((n,i)=>(i(1),Promise.resolve())),this.aspect=1,this.lockState=null,this.shakeUntil=0,this.shakeAmp=0,this.state={center:new R(0,.05,.24),nx:0,ny:0,radius:12,elev:58,azim:0,fov:42},this._right=new R,this._up=new R,this._proj=new R,this._look=new R,this.zoom=new Ml,this._lastApplyAt=0}setZoom(t){return this.zoom.set(ph(t))}zoomBy(t){return this.zoom.by(t)}resetZoom(){return this.zoom.reset()}setZoomActive(t){return this.zoom.setActive(t)}setZoomReduced(t){return this.zoom.setInstant(t)}get zoomValue(){return this.zoom.value}zoomInfo(){return this.zoom.info()}setAspect(t){this.aspect=Math.max(.2,t||1),this.camera.aspect=this.aspect,this.camera.updateProjectionMatrix()}camPosFrom(t,e,n,i){let r=n*Le,a=i*Le;return new R(t.x+e*Math.cos(r)*Math.sin(a),t.y+e*Math.sin(r),t.z+e*Math.cos(r)*Math.cos(a))}apply(){let t=this.camera,e=typeof performance!="undefined"&&performance.now?performance.now():Date.now(),n=this._lastApplyAt?Math.min(80,Math.max(0,e-this._lastApplyAt)):16;if(this._lastApplyAt=e,this.lockState){t.position.copy(this.lockState.pos),t.quaternion.copy(this.lockState.quat),t.fov!==this.lockState.fov&&(t.fov=this.lockState.fov,t.updateProjectionMatrix()),this._applyShake(),t.updateMatrixWorld(!0);return}let i=this.state,r=mh(this.zoom.step(n));t.fov!==i.fov&&(t.fov=i.fov,t.updateProjectionMatrix());let a=this._look.copy(i.center);for(let o=0;o<3&&(t.position.copy(this.camPosFrom(a,i.radius*r,i.elev,i.azim)),t.lookAt(a),t.updateMatrixWorld(!0),!(i.nx===0&&i.ny===0));o++){this._proj.copy(i.center).project(t);let c=t.position.distanceTo(i.center)*Math.tan(i.fov*Le/2),h=c*this.aspect;this._right.setFromMatrixColumn(t.matrixWorld,0),this._up.setFromMatrixColumn(t.matrixWorld,1),a.addScaledVector(this._right,(this._proj.x-i.nx)*h),a.addScaledVector(this._up,(this._proj.y-i.ny)*c)}t.position.copy(this.camPosFrom(a,i.radius*r,i.elev,i.azim)),t.lookAt(a),this._applyShake(),t.updateMatrixWorld(!0)}_applyShake(){if(!this.shakeAmp)return;if(performance.now()>this.shakeUntil){this.shakeAmp=0;return}let t=this.shakeAmp;this.camera.position.x+=(Math.random()-.5)*t,this.camera.position.y+=(Math.random()-.5)*t,this.camera.position.z+=(Math.random()-.5)*t}shake(t,e){this.shakeUntil=performance.now()+Math.max(1,t),this.shakeAmp=e}lock(){this.lockState={pos:this.camera.position.clone(),quat:this.camera.quaternion.clone(),fov:this.camera.fov}}unlock(){this.lockState=null}get locked(){return!!this.lockState}snapshotTarget(){return{center:this.state.center.clone(),nx:this.state.nx,ny:this.state.ny,radius:this.state.radius,elev:this.state.elev,azim:this.state.azim,fov:this.state.fov}}snap(t){let e=this.state;e.center.copy(t.center),e.nx=t.nx,e.ny=t.ny,e.radius=t.radius,e.elev=t.elev,e.azim=t.azim,e.fov=t.fov,this.lockState=null,this.apply()}animate(t,e,n){let i=this.snapshotTarget();return this.lockState=null,this.runAnim(t,r=>{let a=es(xe(r,0,1)),o=this.state;o.center.copy(n?n(a):e.center),o.nx=se(i.nx,e.nx,a),o.ny=se(i.ny,e.ny,a),o.radius=se(i.radius,e.radius,a),o.elev=se(i.elev,e.elev,a),o.azim=se(i.azim,e.azim,a),o.fov=se(i.fov,e.fov,a),this.apply()})}distForCover(t,e,n){let i=n*Le,r=2*Math.atan(Math.tan(i/2)*this.aspect);return t/Math.tan(r/2)/xe(e,.1,1)}ndcOf(t){let e=t.clone().project(this.camera);return{x:+e.x.toFixed(5),y:+e.y.toFixed(5)}}};function gh(s){let t=/^hangar:(red|yellow|blue|green):(\d+)$/.exec(s||"");if(t)return{type:"hangar",color:t[1],slot:Number(t[2])};let e=/^ring:(\d+)$/.exec(s||"");if(e)return{type:"ring",n:Number(e[1])};let n=/^home:(red|yellow|blue|green):goal$/.exec(s||"");if(n)return{type:"goal",color:n[1]};let i=/^home:(red|yellow|blue|green):(\d+)$/.exec(s||"");return i?{type:"home",color:i[1],step:Number(i[2])}:null}function li(s){let t=gh(s)||{type:"ring",n:0};if(t.type==="ring"){let r=Wn(t.n);return{x:Vs*Math.sin(r),y:Qi,z:-Vs*Math.cos(r),yaw:-Math.PI/2-r,parsed:t}}if(t.type==="home"){let r=Wn(oi[t.color]),a=rl-t.step*al;return{x:a*Math.sin(r),y:Gn-.006+Ti,z:-a*Math.cos(r),yaw:Math.PI-r,parsed:t}}if(t.type==="goal")return{x:0,y:Qi+.045,z:0,yaw:Math.PI,parsed:t};let e=Ws[t.color]*Le,n=t.slot%2===0?-.2:.2,i=t.slot<2?-.2:.2;return{x:Vn*Math.sin(e)+(n*Math.cos(e)+i*Math.sin(e)),y:Ke+.05+Ti,z:-Vn*Math.cos(e)+(-n*Math.sin(e)+i*Math.cos(e)),yaw:-e-Math.PI,parsed:t}}function ix(s,t,e){let n=li(s),i=Math.max(1,e||1),r=xe(t||0,0,i-1);if(i<=1)return n;if(n.parsed.type==="goal"){let l=r/i*Ft+.6;return{...n,x:Math.cos(l)*.16,z:Math.sin(l)*.16,yaw:Math.PI+l}}if(n.parsed.type==="hangar")return n;let a=r/i*Ft+.7,o=n.parsed.type==="home"?.052:.062;return{...n,x:n.x+Math.cos(a)*o,z:n.z+Math.sin(a)*o}}function sx(s){let t=gh(s);if(!t)return{x:0,z:0};if(t.type==="ring"){let e=Wn(t.n);return{x:Math.cos(e),z:Math.sin(e)}}if(t.type==="home"){let e=Wn(oi[t.color]);return{x:-Math.sin(e),z:Math.cos(e)}}if(t.type==="hangar"){let e=Ws[t.color]*Le;return{x:Math.sin(e),z:-Math.cos(e)}}return{x:0,z:0}}function rx(s,t,e,n){let i=0;Math.abs(e)+Math.abs(n)>1e-6&&(i=Math.atan2(e,-n));let r=Math.cos(i),a=Math.sin(i),o=s*r+t*a,l=-s*a+t*r;return{theta:i,tx:-o,tz:-l}}function Kr(s){let t=li(s),e=sx(s);return rx(t.x,t.z,e.x,e.z)}function _h(s,t,e){return{theta:s.theta+hl(s.theta,t.theta)*e,tx:s.tx+(t.tx-s.tx)*e,tz:s.tz+(t.tz-s.tz)*e}}var ax={takeoff:1,move:1,jump:1,fly:1};function xh(s){return!!(s&&ax[s.type])}function ef(s){if(!s)return null;if(s.type==="takeoff")return s.path&&s.path[0]||null;if(s.type==="move"){let t=s.path&&s.path[0],e=gh(t);return e?e.type==="ring"?"ring:"+ll(e.n-1):e.type==="home"?e.step>0?"home:"+e.color+":"+(e.step-1):"ring:"+oi[e.color]:e.type==="goal"?"home:"+e.color+":4":null:null}return(s.type==="jump"||s.type==="fly")&&s.from||null}function Qr(s){if(!s)return null;if(s.type==="takeoff"){let t=s.path||[];return t[t.length-1]||null}if(s.type==="move"){let t=s.path||[];return t[t.length-1]||null}return s.to||null}function nf(s){let t={};for(let i of s||[])t[i.squareId]=(t[i.squareId]||0)+1;let e={},n={};for(let i of s||[]){let r=e[i.squareId]||0;e[i.squareId]=r+1,n[i.id]=ix(i.squareId,r,t[i.squareId])}return n}var yh=3.3,wi=new R(1.62,qr/2+.004,3.02),sf=new R(.9,2.7,2.2),Js=new R(0,Qi,0);function ox(){let s=typeof navigator!="undefined"?navigator:{},t=s.userAgent||"";if(/Android|iPhone|iPad|iPod|Mobile/i.test(t))return"medium";let e=s.deviceMemory||8,n=s.hardwareConcurrency||8;return e<=4||n<=4?"medium":"high"}var Tl=class{constructor(t,e,n={}){this.host=t,this.canvas=e,this.reduced=!!n.reduced,this._shadowOpt=n.shadows!==!1,this.adapt=n.adapt!==!1,this.quality=n.quality&&vn[n.quality]?n.quality:ox(),this.shadows=this._shadowOpt&&vn[this.quality].shadow>0,this.theme=n.theme&&$i[n.theme]?n.theme:"cloud",this.heat=0,this.turn="a",this.colors={a:"red",b:"yellow"},this.planes=new Map,this.pieces=[],this.anims=[],this.dimK=1,this.dieValue=1,this.stageRise=0,this.stageId=null,this.viewport={w:0,h:0},this.ready=!1,this.onReady=null,this.onResize=null,this._last=0,this._raf=0,this._paused=!1,this._inFrame=!1,this._v=new R,this._v2=new R,this._right=new R,this._up=new R,this._axis=new R,this._q1=new qe,this._q2=new qe,this._planesDirty=!0,this._tex=[],this.lockProbeId=null,this.perf={phase:"boot",frames:0,sum:0,max:0,long25:0,long50:0,since:0,updateSum:0,renderSum:0,phases:{}},this.lockStats={samples:0,maxAbsX:0,maxAbsY:0,reset(){this.samples=0,this.maxAbsX=0,this.maxAbsY=0}},this.lastCalls=0,this.lastTris=0,this._elevK=0,this._fxTime=0,this._dustCount=vn[this.quality].dust,this._dustBase=null,this._winTex={},this._wallTex={},this._overlayTex={},this._hubTex={},this._buildRenderer(),this._buildScene(),this._buildEnvironment(),this._buildLights(),this._buildCabin(),this._buildTable(),this._buildBoard(),this._buildStage(),this._buildDie(),this._buildPlanesLayer(),this._buildAtmosphere(),this._buildFx(),this._bindResize(),this._bindVisibility(),this.applyTheme(this.theme,!0),this.applyHeat(0),this.applyTurn("a",this.colors),this._applyQuality(),this.resize(),this.renderNow(),this._startLoop()}_buildRenderer(){let e=(window.devicePixelRatio||1)<2;this.renderer=new nl({canvas:this.canvas,antialias:e,alpha:!1,powerPreference:"high-performance",stencil:!1,depth:!0}),this.renderer.outputColorSpace=Fe,this.renderer.toneMapping=mo,this.renderer.toneMappingExposure=1,this.renderer.shadowMap.enabled=this.shadows,this.renderer.shadowMap.type=ao,this.useAA=e,this._aniso=Math.min(8,this.renderer.capabilities.getMaxAnisotropy()),this._wood=Ud(15128258,512),this._felt=_l(15261906,256),this._brass=Zs(256);for(let n of[this._wood,this._felt,this._brass])for(let i of["map","normal","rough"]){let r=n[i];r&&(r.wrapS=r.wrapT=ii,r.needsUpdate=!0)}this._tex.push(this._wood.map,this._wood.normal,this._wood.rough,this._felt.map,this._felt.normal,this._felt.rough,this._brass.map,this._brass.normal,this._brass.rough)}_buildScene(){this.scene=new Oi,this.scene.background=new Lt(329741),this.camera=new Ue(42,1,.05,240),this.rig=new Sl(this.camera,{runAnim:(t,e)=>this.runAnim(t,e)})}_buildEnvironment(){try{let t=new zs(this.renderer),e=Zd(),n=t.fromScene(e,.04,.1,100);this.envRT=n,this.envTex=n.texture,this.scene.environment=this.envTex,this.scene.environmentIntensity=.55,e.traverse(i=>{i.geometry&&i.geometry.dispose(),i.material&&i.material.dispose()}),t.dispose()}catch(t){console.warn("[board3d] PMREM failed:",t&&t.message?t.message:t),this.envTex=null}}_buildLights(){let t=Ys(this.theme);this.hemi=new Nr(t.light.hemiSky,t.light.hemiGround,t.light.hemiInt),this.scene.add(this.hemi),this.ambient=new Br(16777215,.055),this.scene.add(this.ambient),this.key=new Si(t.light.key,t.light.keyInt),this.key.position.set(-3.4,5.6,-2.2),this.key.castShadow=this.shadows,this.key.shadow.mapSize.set(vn[this.quality].shadow,vn[this.quality].shadow),this.key.shadow.camera.left=-6.5,this.key.shadow.camera.right=6.5,this.key.shadow.camera.top=6.5,this.key.shadow.camera.bottom=-6.5,this.key.shadow.camera.near=.5,this.key.shadow.camera.far=26,this.key.shadow.bias=-6e-4,this.key.shadow.normalBias=.015,this.key.shadow.radius=3,this.scene.add(this.key),this.keyTarget=new Ee,this.scene.add(this.keyTarget),this.key.target=this.keyTarget,this.rim=new Si(t.light.rim,t.light.rimInt),this.rim.position.set(4.6,3.2,-3.4),this.scene.add(this.rim),this.fill=new Si(t.light.fill,t.light.fillInt),this.fill.position.set(.4,2.4,6),this.scene.add(this.fill),this.wallWash=new Si(t.light.rim,t.light.rimInt*.52),this.wallWash.position.set(.8,3.4,3.2),this.wallWash.target.position.set(.4,1,St.wallZ),this.scene.add(this.wallWash),this.scene.add(this.wallWash.target),this.lamp=new Ps(t.light.lamp,t.light.lampInt,t.light.lampDist,2),this.lamp.position.set(St.lamp.x,St.lamp.y-.12,St.lamp.z+.16),this.scene.add(this.lamp)}_buildCabin(){let t=new Se;this.scene.add(t),this.cabinGroup=t,this.wallMat=new ie({color:16777215,roughness:.88,metalness:.02,envMapIntensity:.25});let e=new Pt(new be(St.wallW,St.wallH),this.wallMat);e.position.set(0,St.wallBottom+St.wallH/2,St.wallZ),e.receiveShadow=!1,t.add(e),this.wallMesh=e;let n=new Pt(new Ye(St.wallW*.46,.03,.03),this._brassMat());n.position.set(-1.2,St.window.y+St.window.h/2+.26,St.wallZ+.035),t.add(n),this.wallTrim=n,this.windowMat=new Oe({map:null,fog:!1,color:15003127});let i=Math.min(St.window.w,St.window.h)*.3,r=lx(St.window.w,St.window.h,i),a=new Pt(r,this.windowMat);a.position.set(St.window.x,St.window.y,St.window.z),t.add(a),this.windowMesh=a,this._winGeo=r,this.glassMat=new Fr({color:12571876,roughness:Xt.glass.roughness,metalness:Xt.glass.metalness,transparent:!0,opacity:.16,envMapIntensity:Xt.glass.envMapIntensity,depthWrite:!1,side:He,clearcoat:1,clearcoatRoughness:.15});let o=new Pt(r,this.glassMat);o.position.set(St.window.x,St.window.y,St.window.z+.012),t.add(o),this.glassMesh=o;let l=St.window.w+.26,c=St.window.h+.26,h=i+.13,u=new Nn;u.moveTo(-l/2+h,-c/2),u.lineTo(l/2-h,-c/2),u.quadraticCurveTo(l/2,-c/2,l/2,-c/2+h),u.lineTo(l/2,c/2-h),u.quadraticCurveTo(l/2,c/2,l/2-h,c/2),u.lineTo(-l/2+h,c/2),u.quadraticCurveTo(-l/2,c/2,-l/2,c/2-h),u.lineTo(-l/2,-c/2+h),u.quadraticCurveTo(-l/2,-c/2,-l/2+h,-c/2);let d=new xi,f=St.window.w,g=St.window.h,_=i;d.moveTo(-f/2+_,-g/2),d.lineTo(f/2-_,-g/2),d.quadraticCurveTo(f/2,-g/2,f/2,-g/2+_),d.lineTo(f/2,g/2-_),d.quadraticCurveTo(f/2,g/2,f/2-_,g/2),d.lineTo(-f/2+_,g/2),d.quadraticCurveTo(-f/2,g/2,-f/2,g/2-_),d.lineTo(-f/2,-g/2+_),d.quadraticCurveTo(-f/2,-g/2,-f/2+_,-g/2),u.holes.push(d);let m=new ki(u,{depth:.06,bevelEnabled:!0,bevelThickness:.016,bevelSize:.016,bevelSegments:2,curveSegments:8,steps:1}),p=new Pt(m,this._brassMat());p.position.set(St.window.x,St.window.y,St.window.z+.03),p.castShadow=!1,t.add(p),this.windowFrame=p;let b=St.window.h*St.shade;this.shadeMat=new ie({map:this._felt.map,normalMap:this._felt.normal,color:2367002,roughness:Xt.felt.roughness,metalness:0,envMapIntensity:.2});let T=new Pt(new be(St.window.w+.2,b),this.shadeMat);T.position.set(St.window.x,St.window.y+St.window.h/2-b/2+.02,St.window.z+.02),t.add(T),this.shadeMesh=T;let y=new Pt(new Ze(.016,.016,St.window.w+.22,8,1),this._brassMat());y.rotation.z=Math.PI/2,y.position.set(St.window.x,St.window.y+St.window.h/2-b+.02,St.window.z+.025),t.add(y);let A=this._brassMat(),w=new Ze(.055,.055,.022,14),P=new jt().makeRotationX(Math.PI/2);P.setPosition(St.lamp.x,St.lamp.y,St.wallZ+.055);let D=new Ze(.014,.014,.3,8),S=new jt().makeRotationX(Math.PI/2);S.setPosition(St.lamp.x,St.lamp.y,St.wallZ+.2);let v=new wr(.125,.16,18,1,!0),I=new jt().makeTranslation(St.lamp.x,St.lamp.y+.01,St.lamp.z),F=Jr([{geo:w,matrix:P},{geo:D,matrix:S},{geo:v,matrix:I}]);w.dispose(),D.dispose(),v.dispose();let B=new Pt(F,A);B.castShadow=!1,t.add(B),this.lampMesh=B,this.bulbMat=new Oe({color:16769972,toneMapped:!1,fog:!1});let V=new Pt(new Ce(.038,12,9),this.bulbMat);V.position.set(St.lamp.x,St.lamp.y-.055,St.lamp.z),t.add(V),this.bulb=V,this.lampGlow=new Es(new Bi({map:Zr(),color:16763274,transparent:!0,opacity:.55,blending:gn,depthWrite:!1,depthTest:!0,fog:!1,toneMapped:!1})),this.lampGlow.scale.set(1.9,1.9,1),this.lampGlow.position.set(St.lamp.x,St.lamp.y-.05,St.lamp.z+.02),t.add(this.lampGlow),this.winGlow=new Es(new Bi({map:Zr(),color:10471152,transparent:!0,opacity:.22,blending:gn,depthWrite:!1,fog:!1,toneMapped:!1})),this.winGlow.scale.set(3.6,2.6,1),this.winGlow.position.set(St.window.x,St.window.y,St.window.z+.16),t.add(this.winGlow),this.floorMat=new ie({color:724240,roughness:.92,metalness:.02,envMapIntensity:.2});let G=new Pt(new be(26,16),this.floorMat);G.rotation.x=-Math.PI/2,G.position.set(0,St.floorY,-2),G.receiveShadow=!0,t.add(G),this.floor=G}_brassMat(){return this._brassMaterial||(this._brassMaterial=new ie({map:this._brass.map,normalMap:this._brass.normal,roughnessMap:this._brass.rough,color:11569751,roughness:Xt.brass.roughness,metalness:Xt.brass.metalness,envMapIntensity:Xt.brass.envMapIntensity})),this._brassMaterial}_buildTable(){this.world=new Se,this.scene.add(this.world),this.woodMat=new ie({map:this._wood.map,normalMap:this._wood.normal,roughnessMap:this._wood.rough,normalScale:new nt(Xt.walnut.normalScale,Xt.walnut.normalScale),color:15391947,roughness:Xt.walnut.roughness,metalness:Xt.walnut.metalness,envMapIntensity:Xt.walnut.envMapIntensity}),this._wood.map.repeat.set(.16,.16),this._wood.normal.repeat.set(.16,.16),this._wood.rough.repeat.set(.16,.16);let t=cn.w,e=cn.d,n=cn.r,i=new Nn;i.moveTo(-t/2+n,-e/2),i.lineTo(t/2-n,-e/2),i.quadraticCurveTo(t/2,-e/2,t/2,-e/2+n),i.lineTo(t/2,e/2-n),i.quadraticCurveTo(t/2,e/2,t/2-n,e/2),i.lineTo(-t/2+n,e/2),i.quadraticCurveTo(-t/2,e/2,-t/2,e/2-n),i.lineTo(-t/2,-e/2+n),i.quadraticCurveTo(-t/2,-e/2,-t/2+n,-e/2);let r=new ki(i,{depth:cn.h,bevelEnabled:!0,bevelThickness:.03,bevelSize:.03,bevelSegments:2,curveSegments:8,steps:1});r.rotateX(-Math.PI/2),r.computeBoundingBox();let a=new Pt(r,this.woodMat);a.position.set(0,-r.boundingBox.max.y,cn.z),a.receiveShadow=!0,this.tableMesh=a,this.world.add(a);let o=bl(cn.w-.16,cn.d-.16,cn.r-.05);o.holes.push(rf(cn.w-.22,cn.d-.22,cn.r-.07));let l=new Pt(new yi(o,10),this._brassMat());l.rotation.x=-Math.PI/2,l.position.set(0,.0018,cn.z),this.world.add(l),this.tableEdge=l;let c=bl(Ve.w,Ve.d,Ve.r);this.feltMat=new ie({map:this._felt.map,normalMap:this._felt.normal,roughnessMap:this._felt.rough,normalScale:new nt(Xt.felt.normalScale,Xt.felt.normalScale),color:4612716,roughness:Xt.felt.roughness,metalness:0,envMapIntensity:Xt.felt.envMapIntensity}),this._felt.map.repeat.set(1/1.35,1/1.35),this._felt.normal.repeat.set(1/1.35,1/1.35),this._felt.rough.repeat.set(1/1.35,1/1.35),this.felt=new Pt(new yi(c,12),this.feltMat),this.felt.rotation.x=-Math.PI/2,this.felt.position.set(0,.0045,Ve.z),this.felt.receiveShadow=!0,this.world.add(this.felt),this.matOverMat=new Oe({map:null,transparent:!0,opacity:1,depthWrite:!1,fog:!1}),this.over=new Pt(new be(Ve.w,Ve.d),this.matOverMat),this.over.rotation.x=-Math.PI/2,this.over.position.set(0,.0075,Ve.z),this.world.add(this.over);let h=bl(Ve.w+.26,Ve.d+.26,Ve.r+.1),u=rf(Ve.w+.06,Ve.d+.06,Ve.r+.04);h.holes.push(u);let d=new Pt(new yi(h,10),this._brassMat());d.rotation.x=-Math.PI/2,d.position.set(0,.0035,Ve.z),this.world.add(d),this.inlay=d,this.boardGroup=new Se,this.world.add(this.boardGroup),this._buildCup(this.world)}_buildCup(t){let e=new ie({color:14997702,roughness:.24,metalness:0,envMapIntensity:1.15}),n=new ie({color:2363913,roughness:.2,metalness:0,envMapIntensity:.9}),i=this._brassMat(),r=[],a=(_,m,p,b,T)=>{let y=new jt().makeRotationX(T||0);y.setPosition(m,p,b),r.push({geo:_,matrix:y})};a(new Ze(.335,.315,.022,32),0,.012,0),a(new Ze(.148,.112,.215,26,1,!0),0,.132,0);let o=new on(.082,.017,7,16,Math.PI*1.25),l=new jt().makeRotationZ(-.5);l.setPosition(.155,.145,0),r.push({geo:o,matrix:l});let c=Jr(r);r.forEach(_=>_.geo.dispose());let h=new Pt(c,e);h.castShadow=!0,h.receiveShadow=!0;let u=new Er(.13,24);u.rotateX(-Math.PI/2);let d=new Pt(u,n);d.position.y=.212;let f=new Pt(new on(.148,.011,6,26),i);f.rotation.x=-Math.PI/2,f.position.y=.24;let g=new Se;g.add(h,d,f),g.position.set(-1.72,.0045,4.28),g.rotation.y=.42,g.scale.setScalar(2),t.add(g),this.cupGroup=g}_buildBoard(){let t=Ys(this.theme),e=Fd();this._tex.push(e.tex),this.atlasTex=e.tex,this.atlasPlain=e,this.flyMode=!1,this.boardTopMat=new ie({map:Od(15260875),roughness:Xt.walnut.roughness+.03,metalness:Xt.walnut.metalness,normalMap:this._wood.normal.clone(),normalScale:new nt(2.2,2.2),color:16777215,envMapIntensity:.6}),this._tex.push(this.boardTopMat.map,this.boardTopMat.normalMap),this.boardTopMat.normalMap.repeat.set(3,3),this.boardTopMat.normalMap.wrapS=this.boardTopMat.normalMap.wrapT=ii,this.boardTopMat.normalMap.needsUpdate=!0,this.boardSideMat=new ie({map:this._wood.map,normalMap:this._wood.normal,color:7097139,roughness:.62,metalness:.04,envMapIntensity:.45});let n=new Pt(new Ze(yh,yh-.05,.035,96,1),[this.boardSideMat,this.boardTopMat,this.boardSideMat]);n.position.y=.0205,n.receiveShadow=!0,this.boardGroup.add(n),this.disc=n;let i=new Pt(new on(yh-.012,.036,8,96),this._brassMat());i.rotation.x=-Math.PI/2,i.position.y=.03,i.castShadow=!0,this.boardGroup.add(i),this.discRim=i,this.tileMat=new ie({map:e.tex,vertexColors:!0,roughness:Xt.enamel.roughness,metalness:Xt.enamel.metalness,envMapIntensity:Xt.enamel.envMapIntensity});let r=[],a=[],o=[];for(let f=0;f<Gs;f++){let g=Wn(f),_=ts(f),m=cl(f),p=Xn(de[_]).map(b=>b/255*.46);r.push({x:Vs*Math.sin(g),z:-Vs*Math.cos(g),rot:-Math.PI/2-g,w:eh,d:eh,top:Gn,bottom:Ke,uv:ns(fl(m,_)),side:p,n:f,kind:m,color:_})}for(let f of hn){let g=Wn(oi[f]),_=Xn(de[f]).map(m=>m/255*.38);for(let m=0;m<Ed;m++){let p=rl-m*al;a.push({x:p*Math.sin(g),z:-p*Math.cos(g),rot:-g-Math.PI,w:nh,d:nh,top:Gn-.004,bottom:Ke,uv:ns(ul+hn.indexOf(f)),side:_,color:f,step:m})}}for(let f of hn){let g=Ws[f]*Le,_=Xn(de[f]).map(p=>p/255*.32);o.push({x:Vn*Math.sin(g),z:-Vn*Math.cos(g),rot:-g-Math.PI,w:.94,d:.94,top:Ke+.03,bottom:Ke,uv:ns(qs),side:_.map(p=>p*.8),color:f,plate:!0});let m=Xn(de[f]).map(p=>p/255*.4);for(let[p,b]of[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]])o.push({x:Vn*Math.sin(g)+(p*Math.cos(g)+b*Math.sin(g)),z:-Vn*Math.cos(g)+(-p*Math.sin(g)+b*Math.cos(g)),rot:-g-Math.PI,w:.28,d:.28,top:Ke+.06,bottom:Ke+.03,uv:ns(dl+hn.indexOf(f)),side:m,color:f,pad:!0})}this.ringMesh=new Pt(yl(r.concat(a)),this.tileMat),this.ringMesh.receiveShadow=!0,this.ringMesh.castShadow=!0,this.boardGroup.add(this.ringMesh),this.padMesh=new Pt(yl(o),this.tileMat),this.padMesh.receiveShadow=!0,this.boardGroup.add(this.padMesh),this.hubGroup=new Se,this.hubSideMat=new ie({map:this._wood.map,normalMap:this._wood.normal,color:4862496,roughness:.6,metalness:.04,envMapIntensity:.4}),this.hubTopMat=new ie({map:null,roughness:.34,metalness:Xt.brass.metalness,color:t.hub.top,envMapIntensity:Xt.brass.envMapIntensity}),this.hubStarMat=new ie({color:t.hub.star,roughness:.28,metalness:Xt.brass.metalness,envMapIntensity:Xt.brass.envMapIntensity}),this.hubRingMat=this._brassMat();let l=new Pt(new Ze(xn.r,xn.r+.07,xn.h,48,1),[this.hubSideMat,this.hubTopMat,this.hubSideMat]);l.position.y=xn.h/2,l.castShadow=this.shadows,l.receiveShadow=!0,this.hubGroup.add(l);let c=new Pt(new on(xn.ringR,.03,8,56),this.hubRingMat);c.rotation.x=-Math.PI/2,c.position.y=.012,this.hubGroup.add(c),this.hubHalo=new Pt(new on(.315,.014,6,44),this.hubRingMat),this.hubHalo.rotation.x=-Math.PI/2,this.hubHalo.position.y=xn.h+.1,this.hubGroup.add(this.hubHalo);let h=new Nn;for(let f=0;f<10;f++){let g=f%2===0?xn.starR:xn.starR*.44,_=-Math.PI/2+f*Math.PI/5,m=Math.cos(_)*g,p=Math.sin(_)*g;f===0?h.moveTo(m,p):h.lineTo(m,p)}h.closePath();let u=new ki(h,{depth:.03,bevelEnabled:!0,bevelThickness:.006,bevelSize:.006,bevelSegments:1,curveSegments:1});u.rotateX(-Math.PI/2),this.hubStar=new Pt(u,this.hubStarMat),this.hubStar.position.y=xn.h+.014,this.hubStar.castShadow=this.shadows,this.hubGroup.add(this.hubStar),this.hubGlow=$r(.96,t.hub.glow),this.hubGlow.position.y=xn.h+.055,this.hubGlow.material.opacity=.22,this.hubGroup.add(this.hubGlow),this.hubGroup.position.y=.038,this.boardGroup.add(this.hubGroup),this.targetGlow=$r(.9,16763274),this.targetGlow.position.y=Gn+.012,this.targetGlow.visible=!1,this.boardGroup.add(this.targetGlow),this.turnBeacon=new Se;let d=new Pt(new on(.46,.026,8,40),new Oe({color:de.red,transparent:!0,opacity:.7,blending:gn,depthWrite:!1,fog:!1,toneMapped:!1}));d.rotation.x=-Math.PI/2,d.position.y=Gn+.02,this.turnBeacon.add(d),this._beaconRing=d,this.boardGroup.add(this.turnBeacon)}_buildStage(){this.stageGroup=new Se,this.stageGroup.position.set(0,Ke,0),this.stageGroup.visible=!1,this.scene.add(this.stageGroup),this.stageGlow=$r(.8,16767392),this.stageGlow.position.y=Ki+.008,this.stageGlow.material.opacity=.18,this.stageGroup.add(this.stageGlow),this.stageLight=new Ps(16763796,0,6,2),this.stageLight.position.set(.06,2.25,.28),this.scene.add(this.stageLight),this.stageTile=null,this.bear=tf(),this.bearSeat=new Se,this.bearSeat.position.set(ji.x,0,ji.z),this.bearSeat.scale.setScalar(ji.s),this.bearSeat.add(this.bear.group),this.stageGroup.add(this.bearSeat),this.stageShadow=vl(1.5,0),this.stageShadow.visible=!1,this.scene.add(this.stageShadow),this.ripple=Qd(1.1),this.scene.add(this.ripple),this.streaks=jd(Gd()),this.scene.add(this.streaks.group)}_buildDie(){let t=Bd(128);this._tex.push(t.tex),this.dieMat=new ie({map:t.tex,roughness:.38,metalness:.05,envMapIntensity:.9}),this.die=new Pt($d(qr),this.dieMat),this.die.castShadow=this.shadows,this.die.receiveShadow=!0,this.scene.add(this.die),this.dieShadow=vl(.5,.55),this.scene.add(this.dieShadow),this.placeDie(1)}_buildPlanesLayer(){this.planeLayer=new Se,this.scene.add(this.planeLayer)}_buildAtmosphere(){let t=vn.high.dust,e=new Float32Array(t*3),n=[];for(let r=0;r<t;r++){let a=Math.random()*Math.PI*2,o=.6+Math.random()*4.6;e[r*3]=Math.cos(a)*o*.9,e[r*3+1]=.25+Math.random()*3.1,e[r*3+2]=-2.4+Math.sin(a)*o*.7,n.push(Math.random()*1e3,.3+Math.random()*.9,Math.random()*Math.PI*2)}let i=new _e;i.setAttribute("position",new Ne(e,3)),this._dustBase=e.slice(),this.dustMat=new As({size:.042,map:Wd(),color:16767400,transparent:!0,opacity:.62,depthWrite:!1,blending:gn,sizeAttenuation:!0,fog:!0,toneMapped:!1}),this.dust=new Mr(i,this.dustMat),this.dust.frustumCulled=!1,this._dustSeed=n,this.scene.add(this.dust),this._applyDustQuality()}_applyDustQuality(){if(!this.dust)return;let t=vn[this.quality].dust;this._dustCount=Math.min(t,vn.high.dust),this.dust.geometry.setDrawRange(0,this._dustCount),this.dust.visible=this._dustCount>0}_updateDust(t){if(!this.dust.visible||!this._dustBase)return;let e=this.dust.geometry.getAttribute("position"),n=this._dustCount,i=this._dustBase,r=this._dustSeed;for(let a=0;a<n;a++){let o=r[a*3+1],l=r[a*3+2],c=t*8e-5*o;e.setX(a,i[a*3]+Math.sin(c+l)*.055),e.setY(a,i[a*3+1]+Math.sin(c*.8+l)*.045),e.setZ(a,i[a*3+2]+Math.cos(c*.7+l)*.035)}e.needsUpdate=!0}_buildFx(){this.fxMat=new rn({uniforms:{uTime:{value:0},uAspect:{value:1},uVig:{value:.55},uGrain:{value:.055}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:["varying vec2 vUv;","uniform float uTime; uniform float uAspect; uniform float uVig; uniform float uGrain;","float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }","void main(){","  vec2 p = vUv - 0.5; p.x *= uAspect;","  float r = length(p) * 1.5;","  float v = smoothstep(0.40, 1.02, r) * uVig;","  float n = hash(floor(vUv * vec2(1440.0, 2304.0)) + floor(uTime * 24.0));","  float g = max(0.0, n - 0.70) * uGrain;","  vec3 col = vec3(0.92, 0.90, 0.86) * g;","  float a = clamp(v + g * 0.7, 0.0, 0.94);","  gl_FragColor = vec4(col, a);","}"].join(`
`),transparent:!0,depthTest:!1,depthWrite:!1,premultipliedAlpha:!0,blending:ni}),this.fxQuad=new Pt(new be(2,2),this.fxMat),this.fxQuad.frustumCulled=!1,this.fxQuad.renderOrder=999,this.scene.add(this.fxQuad)}setQuality(t){return!vn[t]||t===this.quality?this.quality:(this.quality=t,this._applyQuality(),this.resize(),this.requestRender(),this.quality)}_applyQuality(){let t=vn[this.quality];this.shadows=this._shadowOpt&&t.shadow>0,this.renderer.shadowMap.enabled=this.shadows,this.key&&(this.key.castShadow=this.shadows,this.shadows&&this.key.shadow.mapSize.x!==t.shadow&&(this.key.shadow.mapSize.set(t.shadow,t.shadow),this.key.shadow.map&&(this.key.shadow.map.dispose(),this.key.shadow.map=null))),this._applyDustQuality(),this.fxMat&&(this.fxMat.uniforms.uGrain.value=t.grain?.055:0,this.fxMat.uniforms.uVig.value=t.glow?.58:.42,this.fxQuad.visible=t.grain||t.glow),this.lampGlow&&(this.lampGlow.visible=t.bloom),this.winGlow&&(this.winGlow.visible=t.bloom),this.hubGlow&&(this.hubGlow.visible=t.glow),this.stageGlow&&(this.stageGlow.visible=t.glow),this.scene&&(this.scene.environment=t.env&&this.envTex?this.envTex:null)}_bindResize(){this._onWinResize=()=>this.resize(),window.addEventListener("resize",this._onWinResize,{passive:!0}),window.ResizeObserver&&(this._ro=new ResizeObserver(()=>this.resize()),this._ro.observe(this.host))}_bindVisibility(){this._onVis=()=>{document.hidden?(this._paused=!0,this._raf&&(cancelAnimationFrame(this._raf),this._raf=0)):(this._paused=!1,this._last=0,this.reduced?this.requestRender():this._startLoop())},document.addEventListener("visibilitychange",this._onVis)}resize(){let t=Math.round(this.host.clientWidth||this.canvas.clientWidth||window.innerWidth||0),e=Math.round(this.host.clientHeight||this.canvas.clientHeight||window.innerHeight||0);if(t<2||e<2)return!1;this.viewport={w:t,h:e};let n=vn[this.quality],i=Math.min(window.devicePixelRatio||1,n.dpr);if(this.renderer.setPixelRatio(i),this.renderer.setSize(t,e,!1),this.rig.setAspect(t/e),this.fxMat&&(this.fxMat.uniforms.uAspect.value=t/e,this._fxAspectBase=t/e),this.onResize)try{this.onResize(t,e)}catch(r){console.warn("[board3d] onResize",r)}return this.requestRender(),!0}runAnim(t,e){return this.reduced?(e(1),Promise.resolve()):new Promise(n=>{this.anims.push({t:0,ms:Math.max(1,t),fn:e,resolve:n})})}flushAnims(){let t=this.anims.slice();this.anims.length=0;for(let e of t){try{e.fn(1)}catch(n){console.warn("[board3d] anim flush",n)}e.resolve()}this.requestRender()}_tickAnims(t){for(let e=this.anims.length-1;e>=0;e--){let n=this.anims[e];n.t+=t;let i=xe(n.t/n.ms,0,1);try{n.fn(i,n.t)}catch(r){console.warn("[board3d] anim",r)}i>=1&&(this.anims.splice(e,1),n.resolve())}}_startLoop(){if(this.reduced||this._paused||this._raf)return;let t=e=>{if(this._raf=0,!(this._paused||this.reduced)){try{this._frame(e)}catch(n){console.warn("[board3d] frame error:",n&&n.message?n.message:n)}!this._paused&&!this.reduced&&(this._raf=requestAnimationFrame(t))}};this._raf=requestAnimationFrame(t)}requestRender(){if(!this._inFrame){if(this.reduced){if(this._raf)return;this._raf=requestAnimationFrame(t=>{this._raf=0,!this._paused&&this._frame(t,!0)});return}this._startLoop()}}renderNow(){this._frame(performance.now(),!0)}setReduced(t){this.reduced=!!t,this.reduced?(this.flushAnims(),this._raf&&(cancelAnimationFrame(this._raf),this._raf=0),this.renderNow()):(this._last=0,this._startLoop())}_frame(t,e){this._inFrame=!0;try{this._frameInner(t,e)}finally{this._inFrame=!1}}_frameInner(t,e){this._last||(this._last=t);let n=Math.max(0,t-this._last);this._last=t;let i=Math.min(120,n),r=performance.now();if(this._tickAnims(i),!this.reduced){if(this._updateDust(t),this.bear.group.visible&&(this.bear.group.position.y=Ki+Math.sin(t*.0032)*.012,this.bear.group.rotation.z=Math.sin(t*.0016)*.03),this._beaconRing){let l=1+Math.sin(t*.0024)*.08;this._beaconRing.scale.setScalar(l),this._beaconRing.material.opacity=.5+Math.sin(t*.0024)*.18}this.hubStar&&(this.hubStar.rotation.y=t*42e-5,this.hubHalo.position.y=xn.h+.1+Math.sin(t*.0016)*.018,this.hubHalo.rotation.z=t*6e-4,this.hubGlow.material.opacity=.2+Math.sin(t*.0022)*.06),this.lampGlow&&(this.lampGlow.material.opacity=.5+Math.sin(t*.0011)*.07),this.streaks.update(i,this.streaks.group.visible),this.fxMat&&this.fxQuad.visible&&(this._fxTime+=i,this.fxMat.uniforms.uTime.value=this._fxTime*.001)}this.updatePlaneTransforms(),this.rig.apply(),this._applyCineCamera(t,n),this._updateLockProbe();let a=performance.now();this.renderer.render(this.scene,this.camera);let o=performance.now();this.lastCalls=this.renderer.info.render.calls,this.lastTris=this.renderer.info.render.triangles,this.perf.frames++,this.perf.sum+=n,this.perf.max=Math.max(this.perf.max,n),n>25&&this.perf.long25++,n>50&&this.perf.long50++,this.perf.updateSum+=a-r,this.perf.renderSum+=o-a,!this.reduced&&!e&&this._adaptCheck(n),!this.ready&&this.viewport.w>0&&this.viewport.h>0&&(this.ready=!0,this.onReady&&this.onReady())}_applyCineCamera(t,e){let n=this.rig,i=this.camera,r=n.state;Math.abs(r.fov-42)<.01&&(i.position.sub(r.center).multiplyScalar(yn.lensK).add(r.center),i.fov=yn.fov,i.updateProjectionMatrix());let o=!n.locked&&Math.abs(r.azim)<.01&&r.elev>yn.overviewElevMin?1:0,l=this.reduced?1:xe(1-Math.exp(-(e||16)/150),.05,.85);if(this._elevK+=(o-this._elevK)*l,this._elevK>.002){let c=(58-yn.elev)*Le*this._elevK;this._right.setFromMatrixColumn(i.matrixWorld,0),this._v2.copy(i.position).sub(r.center).applyAxisAngle(this._right,c),i.position.copy(r.center).add(this._v2),this._q1.setFromAxisAngle(this._right,c),i.quaternion.premultiply(this._q1)}if(!this.reduced&&this._elevK>.02&&(this.perf.phase==="idle"||this.perf.phase==="win"||this.perf.phase==="boot")){let c=Math.sin(t*13e-5)*yn.drift.x+Math.sin(t*71e-6+1.3)*yn.drift.x*.45,h=Math.sin(t*19e-5+1.7)*yn.drift.y;this._right.setFromMatrixColumn(i.matrixWorld,0),this._up.setFromMatrixColumn(i.matrixWorld,1),i.position.addScaledVector(this._right,c).addScaledVector(this._up,h),this._q1.setFromAxisAngle(this._up,Math.sin(t*11e-5)*yn.drift.yaw),i.quaternion.premultiply(this._q1)}i.updateMatrixWorld(!0)}_adaptCheck(t){if(!this.adapt||this.quality==="low"||(this._adaptTimer=(this._adaptTimer||0)+t,this._adaptTimer<1500))return;let e=this.perf.sum/Math.max(1,this.perf.frames);if(this._adaptTimer=0,this._slowWindows=e>26?(this._slowWindows||0)+1:0,this._slowWindows>=2){this._slowWindows=0;let n=this.quality==="high"?"medium":"low";this.setQuality(n),console.info("[board3d] auto quality → "+n)}}_updateLockProbe(){if(!this.lockProbeId||this.perf.phase!=="fly")return;let t=this.planes.get(this.lockProbeId);if(!t)return;let e=this.rig.ndcOf(t.group.position);this.lockStats.samples++,this.lockStats.maxAbsX=Math.max(this.lockStats.maxAbsX,Math.abs(e.x)),this.lockStats.maxAbsY=Math.max(this.lockStats.maxAbsY,Math.abs(e.y))}_themeAssets(t){return this._winTex[t.id]||(this._winTex[t.id]=zd(t.window),this._wallTex[t.id]=kd(t.wallTint,512),this._overlayTex[t.id]=Xd(t.overlay,Ve,512),this._hubTex[t.id]=qd(t.hub,256),this._tex.push(this._winTex[t.id],this._wallTex[t.id],this._overlayTex[t.id],this._hubTex[t.id])),{win:this._winTex[t.id],wall:this._wallTex[t.id],overlay:this._overlayTex[t.id],hub:this._hubTex[t.id]}}applyTheme(t,e){let n=Ys(t);this.theme=n.id,this.host.setAttribute("data-3d-theme",n.id);let i=this._themeAssets(n);this.scene.background.set(n.ink),this.scene.fog=new yr(n.fog,n.fogDensity),this.renderer.toneMappingExposure=n.exposure,this.scene.environment&&(this.scene.environmentIntensity=n.light.env),this.hemi&&(this.hemi.color.set(n.light.hemiSky),this.hemi.groundColor.set(n.light.hemiGround),this.hemi.intensity=n.light.hemiInt),this.key&&(this.key.color.set(n.light.key),this.key.intensity=n.light.keyInt),this.rim&&(this.rim.color.set(n.light.rim),this.rim.intensity=n.light.rimInt),this.fill&&(this.fill.color.set(n.light.fill),this.fill.intensity=n.light.fillInt),this.wallWash&&(this.wallWash.color.set(n.light.rim),this.wallWash.intensity=n.light.rimInt*.52),this.lamp&&(this.lamp.color.set(n.light.lamp),this.lamp.intensity=n.light.lampInt,this.lamp.distance=n.light.lampDist),this.woodMat&&this.woodMat.color.set(n.tableTint),this.feltMat&&this.feltMat.color.set(n.feltTint),this.boardTopMat&&this.boardTopMat.color.set(n.boardTint),this.boardSideMat&&this.boardSideMat.color.set(n.brass).multiplyScalar(.38),this._brassMaterial&&(this._brassMaterial.color.set(n.brass),this._brassMaterial.roughness=n.brassRough),this.hubTopMat&&(this.hubTopMat.map=i.hub,this.hubTopMat.color.set(16777215),this.hubTopMat.needsUpdate=!0),this.hubStarMat&&this.hubStarMat.color.set(n.hub.star),this.hubGlow&&this.hubGlow.material.color.set(n.hub.glow),this.wallMat&&(this.wallMat.map=i.wall,this.wallMat.color.set(16777215),this.wallMat.needsUpdate=!0),this.windowMat&&(this.windowMat.map=i.win,this.windowMat.needsUpdate=!0),this.glassMat&&this.glassMat.color.set(n.light.rim),this.shadeMat&&this.shadeMat.color.set(n.feltTint).multiplyScalar(.42),this.floorMat&&this.floorMat.color.set(n.floor),this.bulbMat&&this.bulbMat.color.set(n.light.lamp),this.stageLight&&this.stageLight.color.set(n.light.key),this.lampGlow&&this.lampGlow.material.color.set(n.light.lamp),this.winGlow&&this.winGlow.material.color.set(n.light.rim),this.matOverMat&&this.matOverMat.map!==i.overlay&&(this.matOverMat.map=i.overlay,this.matOverMat.needsUpdate=!0),this.dustMat&&(this.dustMat.color.set(n.dust),this.dustMat.opacity=n.dustOpacity),this.bear&&this.bear.setOutfit(n.bear),this.setDim(this.dimK),this.applyHeat(this.heat),this.requestRender()}applyHeat(t){let e=xe(Number(t)||0,0,100);if(this.heat=e,!this.lamp)return;let n=Ys(this.theme),i=e/100,r=new Lt(n.heatCool).lerp(new Lt(n.heatWarm),i);this.lamp.color.copy(r),this.lamp.intensity=n.light.lampInt*(.85+i*.5),this.hubGlow&&this.hubGlow.material.color.copy(new Lt(n.hub.glow).lerp(r,i*.6)),this.stageGlow&&this.stageGlow.material.color.copy(new Lt(n.heatWarm)),this.requestRender()}applyTurn(t,e){this.turn=t==="b"?"b":"a",e&&(this.colors={a:e.a||"red",b:e.b||"yellow"});let n=de[this.colors[this.turn]]||de.red;if(this._beaconRing){this._beaconRing.material.color.set(n);let i=Ws[this.colors[this.turn]]*Le;this.turnBeacon.position.set(Vn*Math.sin(i),0,-Vn*Math.cos(i)),this.turnBeacon.visible=!0}this.requestRender()}setDim(t){let e=xe(t,.1,1);this.dimK=e;let n=Ys(this.theme),i=se(.26,1,e);this.tileMat&&this.tileMat.color.setRGB(i,i,i),this.boardTopMat&&this.boardTopMat.color.copy(new Lt(n.boardTint).multiplyScalar(se(.4,1,e))),this.boardSideMat&&this.boardSideMat.color.copy(new Lt(n.boardTint).multiplyScalar(se(.34,.85,e))),this.woodMat&&this.woodMat.color.copy(new Lt(n.tableTint).multiplyScalar(se(.52,1,e))),this.feltMat&&this.feltMat.color.copy(new Lt(n.feltTint).multiplyScalar(se(.58,1,e))),this.matOverMat&&(this.matOverMat.opacity=se(.62,1,e)),this.requestRender()}_accentFor(t){return t==="red"?15255976:t==="yellow"?15258536:t==="blue"?13161184:13162696}_createPlane(t){let e=t.color||"red",n=Kd(de[e]||de.red,this._accentFor(e)),i=vl(.6,.5),r=$r(.62,de[e]||de.red);return r.material.opacity=.1,this.planeLayer.add(n.group),this.planeLayer.add(i),this.planeLayer.add(r),{id:t.id,color:e,playerId:t.playerId||String(t.id).charAt(0),plane:n,group:n.group,shadow:i,glow:r,local:new R,localYaw:0,fixedYaw:0,mode:"board",tileTopY:Gn,piece:t}}ensurePlane(t,e,n){let i=this.planes.get(t);return i||(i=this._createPlane({id:t,color:e||"red",playerId:n||String(t).charAt(0)}),this.planes.set(t,i),i)}_removePlane(t){let e=this.planes.get(t);e&&(this.planeLayer.remove(e.group),this.planeLayer.remove(e.shadow),this.planeLayer.remove(e.glow),e.plane.dispose(),e.shadow.geometry.dispose(),e.shadow.material.dispose(),e.glow.geometry.dispose(),e.glow.material.dispose(),this.planes.delete(t))}setPieces(t,e,n){let i=Array.isArray(t)?t:[];this.pieces=i.map(o=>({id:o.id,color:o.color||"red",playerId:o.playerId||String(o.id).charAt(0),squareId:o.squareId||"hangar:red:0",arrived:!!o.arrived,stackGroupId:o.stackGroupId||null}));let r={};for(let o of this.pieces)r[o.id]=!0;for(let o of Array.from(this.planes.keys()))r[o]||this._removePlane(o);let a=nf(this.pieces);for(let o of this.pieces){let l=this.planes.get(o.id);l||(l=this._createPlane(o),this.planes.set(o.id,l)),l.color!==o.color&&(l.color=o.color,l.playerId=o.playerId,l.plane.setColor(de[o.color]||de.red,this._accentFor(o.color)),l.glow.material.color.set(de[o.color]||de.red));let c=a[o.id]||li(o.squareId);l.local.set(c.x,c.y,c.z),l.localYaw=c.yaw,l.tileTopY=c.y-Ti,l.mode="board",l.piece=o,l.group.visible=!0,l.group.scale.setScalar(1),l.shadow.visible=!0,this._applyPlaneLocal(l)}e&&(this.turn=e==="b"?"b":"a"),n&&(this.colors={a:n.a||"red",b:n.b||"yellow"}),this._planesDirty=!0,this.updatePlaneTransforms(),this.requestRender()}_applyPlaneLocal(t){t.group.position.copy(t.local),t.group.rotation.set(0,t.localYaw,0)}setPlaneToSquare(t,e,n={}){let i=this.planes.get(t);if(!i)return null;let r=li(e);return i.local.set(r.x,r.y,r.z),i.localYaw=r.yaw,i.tileTopY=r.y-Ti,i.mode="board",n.visible!==!1&&(i.group.visible=!0,i.group.scale.setScalar(1),i.shadow.visible=!0),this._applyPlaneLocal(i),this.updatePlaneTransforms(),this.requestRender(),i}setPlaneLocal(t,e){let n=this.planes.get(t);return n?(n.local.set(e.x,e.y,e.z),n.localYaw=e.yaw,n.mode="board",this._applyPlaneLocal(n),this.updatePlaneTransforms(),this.requestRender(),n):null}fixPlane(t){let e=this.planes.get(t);return e?(e.fixedYaw=this.boardGroup.rotation.y+e.localYaw,e.mode="fixed",e.group.position.copy(Js),e.group.rotation.set(0,e.fixedYaw,0),e.group.visible=!0,e.group.scale.setScalar(1),e.shadow.visible=!0,this.updatePlaneTransforms(),this.requestRender(),e):null}hidePlane(t){let e=this.planes.get(t);e&&(e.mode="hidden",e.group.visible=!1,e.shadow.visible=!1,e.glow.material.opacity=0,this.requestRender())}updatePlaneTransforms(){if(this.planes.size)for(let t of this.planes.values()){if(t.mode==="board")this._v.copy(t.local),this.boardGroup.localToWorld(this._v),t.group.position.copy(this._v),t.group.rotation.set(0,this.boardGroup.rotation.y+t.localYaw,0),t.shadow.position.set(this._v.x,.008,this._v.z),t.shadow.visible=t.group.visible,t.glow.position.set(this._v.x,t.tileTopY+.012,this._v.z);else if(t.mode==="fixed")t.group.position.copy(Js),t.group.rotation.set(0,t.fixedYaw,0),t.shadow.position.set(Js.x,.008,Js.z),t.shadow.visible=!0,t.glow.position.set(Js.x,Gn+.012,Js.z);else{t.group.visible=!1,t.shadow.visible=!1,t.glow.material.opacity=0;continue}let e=t.playerId===this.turn,n=t.mode==="fixed"?.95:e?this.reduced?.5:.55:.07;t.glow.material.opacity+=(n-t.glow.material.opacity)*.16}}boardPose(){return{theta:this.boardGroup.rotation.y,tx:this.boardGroup.position.x,tz:this.boardGroup.position.z}}applyPose(t){this.boardGroup.rotation.y=t.theta,this.boardGroup.position.set(t.tx,0,t.tz),this.boardGroup.updateMatrixWorld(!0),this.updatePlaneTransforms(),this.requestRender()}setTargetGlow(t,e){if(!t){this.targetGlow.visible=!1;return}let n=li(t);this.targetGlow.position.set(n.x,n.y-Ti+.012,n.z),this.targetGlow.visible=!0,this.targetGlow.material.opacity=e===void 0?.75:e,this.requestRender()}pulseTargetGlow(t){let e=performance.now(),n=i=>{let r=xe((i-e)/t,0,1);this.targetGlow.material.opacity=.35+.5*Math.sin(r*Math.PI),r<1?requestAnimationFrame(n):this.targetGlow.material.opacity=.65};requestAnimationFrame(n)}setStreaks(t){this.streaks.group.visible=!!(t&&!this.reduced),this.requestRender()}setFlyMode(t){this.flyMode=!!t,this.requestRender()}playRipple(t){if(this.ripple.position.set(0,.012,0),this.ripple.visible=!0,this.ripple.scale.setScalar(.4),this.ripple.material.opacity=.55,this.reduced||t)return this.ripple.material.opacity=.2,this.requestRender(),Promise.resolve();let e=performance.now();return new Promise(n=>{let i=r=>{let a=xe((r-e)/520,0,1),o=Yr(a);this.ripple.scale.setScalar(.4+o*2.2),this.ripple.material.opacity=.55*(1-a),this.requestRender(),a<1?requestAnimationFrame(i):(this.ripple.visible=!1,n())};requestAnimationFrame(i)})}setStageSquare(t){this.stageTile&&(this.stageGroup.remove(this.stageTile),this.stageTile.geometry.dispose(),this.stageTile=null),this.stageId=t,this.stageTileMat&&(this.stageTex&&(this.stageTex.dispose(),this.stageTex=null),this.stageTileMat.dispose());let e=t?/^home:(red|yellow|blue|green):(?:(\d+)|goal)$/.exec(t):null,n,i,r;if(e)r=e[1],i="entry",n=Xn(de[r]).map(o=>o/255*.46);else if(t&&/^ring:(\d+)$/.test(t)){let o=Number(/^ring:(\d+)$/.exec(t)[1]);r=ts(o),i=cl(o),n=Xn(de[r]).map(l=>l/255*.46)}else r="red",i="ring",n=[.14,.12,.16];this.stageTex=Yd(i,r,Id[i]||"",256,wd),this._tex.push(this.stageTex),this.stageTileMat=new ie({map:this.stageTex,vertexColors:!0,roughness:Xt.enamel.roughness+.03,metalness:Xt.enamel.metalness,envMapIntensity:.9});let a=yl([{x:0,z:0,rot:Ei*Le,w:ih,d:ih,top:Ki,bottom:0,uv:[0,0,1,1],side:n}]);this.stageTile=new Pt(a,this.stageTileMat),this.stageTile.castShadow=this.shadows,this.stageTile.receiveShadow=!0,this.stageGroup.add(this.stageTile),this.bearSeat&&(this.bearSeat.position.set(ji.x,0,ji.z),this.bearSeat.scale.setScalar(ji.s))}setStageVisible(t){this.stageGroup.visible=!!t,this.stageShadow.visible=!!t,this.stageLight&&(this.stageLight.intensity=t?8.5:0),t||this.bear.setVisible(!1),this.requestRender()}setStageRise(t){this.stageRise=t,this.stageGroup.position.y=Ke+t,this.stageShadow.position.set(0,.006,0),this.requestRender()}setBearVisible(t){this.bear.setVisible(!!t),this.requestRender()}dieFaceNormal(t){let e=pl.indexOf(t),n=new R;return e===0?n.set(1,0,0):e===1?n.set(-1,0,0):e===2?n.set(0,1,0):e===3?n.set(0,-1,0):e===4?n.set(0,0,1):n.set(0,0,-1),n}dieSettleQuat(t){let e=new R(.34,.86,.38).normalize(),n=new qe().setFromUnitVectors(this.dieFaceNormal(t),e),i=new qe().setFromAxisAngle(e,.22);return n.multiply(i)}placeDie(t){let e=xe(Number(t)||1,1,6);this.dieValue=e,this.die.position.copy(wi),this.die.quaternion.copy(this.dieSettleQuat(e)),this.dieShadow.position.set(wi.x,.008,wi.z),this.dieShadow.scale.setScalar(1),this.dieShadow.material.opacity=.5,this.requestRender()}tossDie(t,e){let n=xe(Number(t)||1,1,6);if(this.dieValue=n,this.reduced||e)return this.placeDie(n),Promise.resolve();let i=new qe().setFromEuler(new sn(.7,1.9,.4)),r=this.dieSettleQuat(n),a=this._axis.set(.42,.87,.26).normalize();return this.runAnim(1080,o=>{let l=Yr(Math.min(1,o/.62)),c=1-l,h=Math.abs(Math.sin(o*Math.PI*3.1))*(1-o)*.36;this.die.position.set(se(sf.x,wi.x,l),wi.y+c*2.4+h,se(sf.z,wi.z,l)),this._q1.copy(i).multiply(this._q2.setFromAxisAngle(a,(1-Xs(.5,1,o))*7.5)),this.die.quaternion.copy(this._q1),this.die.quaternion.slerp(r,Xs(.58,1,o)),this.dieShadow.position.set(this.die.position.x,.008,this.die.position.z),this.dieShadow.scale.setScalar(xe(1.15-(this.die.position.y-wi.y)*.4,.5,1.2)),this.dieShadow.material.opacity=xe(.5-(this.die.position.y-wi.y)*.18,.12,.5)}).then(()=>{this.placeDie(n)})}markPhase(t){this.perf.frames>0&&this.perf.phase&&(this.perf.phases[this.perf.phase]={frames:this.perf.frames,avgMs:+(this.perf.sum/this.perf.frames).toFixed(2),maxMs:+this.perf.max.toFixed(2),long25:this.perf.long25,long50:this.perf.long50,ms:+(performance.now()-this.perf.since).toFixed(0),calls:this.lastCalls,tris:this.lastTris,updateMs:+(this.perf.updateSum/this.perf.frames).toFixed(2),renderMs:+(this.perf.renderSum/this.perf.frames).toFixed(2)}),this.perf.phase=t,this.perf.frames=0,this.perf.sum=0,this.perf.max=0,this.perf.long25=0,this.perf.long50=0,this.perf.updateSum=0,this.perf.renderSum=0,this.perf.since=performance.now()}debugSnapshot(){let t=this.perf.frames>0?{frames:this.perf.frames,avgMs:+(this.perf.sum/this.perf.frames).toFixed(2),maxMs:+this.perf.max.toFixed(2),long25:this.perf.long25,long50:this.perf.long50,long25Ratio:+(this.perf.long25/this.perf.frames).toFixed(3),fps:+(this.perf.frames*1e3/Math.max(1,performance.now()-this.perf.since)).toFixed(1),updateMs:+(this.perf.updateSum/this.perf.frames).toFixed(2),renderMs:+(this.perf.renderSum/this.perf.frames).toFixed(2),ms:+(performance.now()-this.perf.since).toFixed(0)}:null,e=this.planes.get("a:0")||this.planes.values().next().value,n={camera:{pos:this.camera.position.toArray().map(r=>+r.toFixed(4)),fov:+this.camera.fov.toFixed(2),rigFov:+this.rig.state.fov.toFixed(2),elev:+this.rig.state.elev.toFixed(2),elevTuned:+this._elevK.toFixed(3),locked:this.rig.locked},board:{theta:+this.boardGroup.rotation.y.toFixed(5),tx:+this.boardGroup.position.x.toFixed(5),tz:+this.boardGroup.position.z.toFixed(5)},lock:{samples:this.lockStats.samples,maxAbsX:+this.lockStats.maxAbsX.toFixed(5),maxAbsY:+this.lockStats.maxAbsY.toFixed(5)},stage:{visible:this.stageGroup.visible,rise:+this.stageRise.toFixed(3),bear:+this.bear.group.scale.x.toFixed(3)},streaks:this.streaks.group.visible};if(e){let r=this.rig.ndcOf(e.group.position);n.plane={id:e.id,world:e.group.position.toArray().map(a=>+a.toFixed(4)),ndc:[+r.x.toFixed(5),+r.y.toFixed(5)]}}let i=this.renderer.getPixelRatio();return{phase:this.perf.phase,current:t,phases:this.perf.phases,render:{calls:this.lastCalls,triangles:this.lastTris,cssPx:this.viewport.w*this.viewport.h,pixels:Math.round(this.viewport.w*this.viewport.h*i*i)},quality:this.quality,dpr:i,shadows:this.renderer.shadowMap.enabled,antialias:this.useAA,viewport:this.viewport,cinematic:{toneMapping:this.renderer.toneMapping,exposure:this.renderer.toneMappingExposure,env:this.scene.environment?"pmrem":"off",envIntensity:this.scene.environmentIntensity,dust:this._dustCount,fx:this.fxQuad?{vignette:this.fxMat.uniforms.uVig.value,grain:this.fxMat.uniforms.uGrain.value}:null,lens:{fov:yn.fov,elev:yn.elev,lensK:+yn.lensK.toFixed(4)}},probe:n}}dispose(){this._raf&&(cancelAnimationFrame(this._raf),this._raf=0),this._paused=!0,this._ro&&(this._ro.disconnect(),this._ro=null),this._onWinResize&&window.removeEventListener("resize",this._onWinResize),this._onVis&&document.removeEventListener("visibilitychange",this._onVis);let t=e=>{if(e){if(Array.isArray(e)){e.forEach(t);return}e.dispose()}};if(this.scene.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&t(e.material)}),this._tex.forEach(e=>{try{e.dispose()}catch(n){}}),this.envRT)try{this.envRT.dispose()}catch(e){}try{this.renderer.dispose()}catch(e){}try{let e=this.renderer.getContext&&this.renderer.getContext(),n=e&&e.getExtension("WEBGL_lose_context");n&&n.loseContext()}catch(e){}this.planes.clear(),this.anims.length=0}};function bl(s,t,e){let n=new Nn,i=s/2,r=t/2,a=Math.min(e,i,r);return n.moveTo(-i+a,-r),n.lineTo(i-a,-r),n.quadraticCurveTo(i,-r,i,-r+a),n.lineTo(i,r-a),n.quadraticCurveTo(i,r,i-a,r),n.lineTo(-i+a,r),n.quadraticCurveTo(-i,r,-i,r-a),n.lineTo(-i,-r+a),n.quadraticCurveTo(-i,-r,-i+a,-r),n}function rf(s,t,e){let n=new xi,i=s/2,r=t/2,a=Math.min(e,i,r);return n.moveTo(-i+a,-r),n.lineTo(i-a,-r),n.quadraticCurveTo(i,-r,i,-r+a),n.lineTo(i,r-a),n.quadraticCurveTo(i,r,i-a,r),n.lineTo(-i+a,r),n.quadraticCurveTo(-i,r,-i,r-a),n.lineTo(-i,-r+a),n.quadraticCurveTo(-i,-r,-i+a,-r),n}function lx(s,t,e){let n=new yi(bl(s,t,e),12),i=n.getAttribute("position"),r=new Float32Array(i.count*2);for(let a=0;a<i.count;a++)r[a*2]=(i.getX(a)+s/2)/s,r[a*2+1]=(i.getY(a)+t/2)/t;return n.setAttribute("uv",new Ne(r,2)),n}var cx=new R(1.62,qr/2+.002,3.02),vh=class{constructor(){this.on=!1,this.ctx=null,this.master=null}setOn(t){this.on=!!t,this.on&&this._ensure()}_ensure(){if(typeof window=="undefined")return null;let t=window.AudioContext||window.webkitAudioContext;if(!t)return null;try{this.ctx||(this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=.14,this.master.connect(this.ctx.destination)),this.ctx.state==="suspended"&&this.ctx.resume&&this.ctx.resume().catch(()=>{})}catch(e){this.ctx=null}return this.ctx}_tone(t,e,n,i,r,a){let o=this.ctx,l=o.currentTime+(a||0),c=o.createOscillator(),h=o.createGain();c.type=i||"sine",c.frequency.setValueAtTime(t,l),e&&e!==t&&c.frequency.exponentialRampToValueAtTime(Math.max(30,e),l+n),h.gain.setValueAtTime(1e-4,l),h.gain.exponentialRampToValueAtTime(Math.max(2e-4,r),l+.012),h.gain.exponentialRampToValueAtTime(1e-4,l+n),c.connect(h),h.connect(this.master),c.start(l),c.stop(l+n+.02)}_noise(t,e){let n=this.ctx,i=Math.max(1,Math.floor(n.sampleRate*t)),r=n.createBuffer(1,i,n.sampleRate),a=r.getChannelData(0);for(let h=0;h<i;h++)a[h]=(Math.random()*2-1)*(1-h/i);let o=n.createBufferSource();o.buffer=r;let l=n.createGain();l.gain.value=e;let c=n.createBiquadFilter();c.type="bandpass",c.frequency.value=1200,o.connect(c),c.connect(l),l.connect(this.master),o.start()}_can(){return this.on&&this.ctx}dice(){if(this._can())try{this._noise(.18,.16),this._tone(220,90,.14,"triangle",.1)}catch(t){}}whoosh(){if(this._can())try{this._noise(.22,.1)}catch(t){}}tick(){if(this._can())try{this._tone(520,420,.05,"sine",.025)}catch(t){}}land(){if(this._can())try{this._tone(150,70,.18,"sine",.16),this._noise(.08,.08)}catch(t){}}bear(){if(this._can())try{this._tone(660,660,.12,"sine",.08),this._tone(990,990,.16,"sine",.06,.1)}catch(t){}}capture(){if(this._can())try{this._noise(.24,.18),this._tone(300,60,.22,"sawtooth",.08)}catch(t){}}win(){if(this._can())try{[523,659,784,1046].forEach((t,e)=>this._tone(t,t,.3,"sine",.07,e*.11))}catch(t){}}},El=class{constructor(t,e={}){this.scene=t,this.host=e.host||t.host,this.reduced=!!e.reduced,this.stageAim=e.stageAim||{nx:0,ny:.15},this.phase="boot",this.busy=!1,this.holding=!1,this.cellCtx=null,this.lastState=null,this.lastView=null,this._queue=Promise.resolve(),this._instantNext=!1,this._skipRequested=!1,this._skipUntilIdle=!1,this._fitPending=!1,this._movingPieceId=null,this._lastSquare=null,this.targetSquare=null,this.sfx=new vh,this.sfx.setOn(!!e.sound),this.scene.lockProbeId=null,this.scene.applyPose({theta:0,tx:0,tz:0}),this.scene.rig.snap(this._overview()),this._setPhase("idle")}setState(t,e){this.lastState=t||this.lastState,this.lastView=e||this.lastView}setSound(t){this.sfx.setOn(t)}setReduced(t){let e=!!t;e!==this.reduced&&(this.reduced=e,this.scene.setReduced(e),e?(this._instantNext=!0,this.scene.flushAnims(),this.scene.setFlyMode(!1),this.busy||(this.holding=!1,this.cellCtx=null,this.scene.setStageVisible(!1),this.scene.setDim(1),this.scene.setTargetGlow(null),this.scene.setStreaks(!1),this.scene.applyPose({theta:0,tx:0,tz:0}),this.scene.rig.snap(this._overview()),this._setPhase("idle"),this._instantNext=!1)):(this._instantNext=!1,this.scene.rig.snap(this.scene.rig.snapshotTarget())))}play(t,e){let n=Array.isArray(t)?t.filter(Boolean):[],i=()=>this._run(n,e||{}).catch(r=>{console.warn("[board3d] play error:",r&&r.message?r.message:r),this.holding=!1,this._setPhase("idle")}).finally(()=>{if(this.busy=!1,this._instantNext=!1,this._skipRequested=!1,this.phase==="idle"&&!this.holding&&(this._skipUntilIdle=!1),!this.holding&&this.phase==="idle")try{this.handleResize()}catch(r){}});return this.busy=!0,this._queue=this._queue.then(i,i),this._queue}skip(){this._skipRequested=!0,this._skipUntilIdle=!0,this.scene.flushAnims(),this._instantNext=!0,this.busy||(this.holding||this.phase!=="idle"?this.returnToOverview().catch(()=>{}):(this._instantNext=!1,this._skipUntilIdle=!1,this._skipRequested=!1))}_setPhase(t){this.phase=t,this.host&&this.host.setAttribute("data-3d-phase",t),this.scene.markPhase(t)}_anim(t,e){if(this._instantNext||this._skipUntilIdle||this.reduced){try{e(1)}catch(n){console.warn("[board3d] anim instant",n)}return this.scene.requestRender(),Promise.resolve()}return this.scene.runAnim(t,e)}_animateCamera(t,e,n){return this._instantNext||this._skipUntilIdle||this.reduced?(this.scene.rig.snap(e),Promise.resolve()):this.scene.rig.animate(t,e,n)}_playerOf(t){return String(t||"").charAt(0)==="b"?"b":"a"}_colorFor(t){let e=this.lastState;if(e&&Array.isArray(e.pieces)){let i=e.pieces.find(r=>r.id===t);if(i&&i.color)return i.color}let n=this._playerOf(t);return e&&e.colors&&e.colors[n]?e.colors[n]:n==="b"?"yellow":"red"}_squareOf(t){let e=this.lastState;if(e&&Array.isArray(e.pieces)){let n=e.pieces.find(i=>i.id===t);if(n)return n.squareId}return null}_overview(){let t=this.scene.rig.distForCover(3.7,Ad,42),e={center:new R(0,.05,.24),nx:0,ny:0,radius:t,elev:58,azim:0,fov:42};return e.ny=this._centerBias(e),e}_centerBias(t){let e=this.scene.rig,n=this.scene.camera,i=this.scene.boardGroup,r=n.position.constructor,a=e.snapshotTarget(),o=e.lockState,l=1e9,c=-1e9;try{e.lockState=null,e.snap({center:t.center.clone(),nx:t.nx,ny:0,radius:t.radius,elev:t.elev,azim:t.azim,fov:t.fov});for(let h=0;h<24;h++){let u=h/24*Ft,d=i.localToWorld(new r(Math.cos(u)*3.3,.035,Math.sin(u)*3.3)).project(n);d.y<l&&(l=d.y),d.y>c&&(c=d.y)}}catch(h){l=0,c=0}finally{e.snap(a),e.lockState=o}return!isFinite(l)||!isFinite(c)?0:+xe(-(l+c)/2,-.12,.12).toFixed(4)}handleResize(){let t={idle:1,win:1,boot:1};if(this.busy||this.holding||!t[this.phase]){this._fitPending=!0;return}this._fitPending=!1,this.scene.applyPose({theta:0,tx:0,tz:0}),this.scene.rig.snap(this._overview())}_focus(){return{center:new R(0,Qi,0),nx:0,ny:0,radius:3.05,elev:33,azim:0,fov:42}}_roll(){return{center:cx.clone(),nx:0,ny:-.02,radius:3.2,elev:44,azim:10,fov:42}}_land(){return{center:new R(0,.12,0),nx:0,ny:.02,radius:4.05,elev:46,azim:0,fov:42}}_stage(){return{center:new R(0,Ke+ol+.34,0),nx:this.stageAim.nx,ny:this.stageAim.ny,radius:this.scene.rig.distForCover(.4,.52,42),elev:45,azim:Ei,fov:42}}async _runReduced(t){this.scene.setFlyMode(!1);let e=t.find(i=>i.type==="dice");e&&this.scene.placeDie(e.die);let n=t.filter(xh);for(let i of n){let r=i.pieceId,a=Qr(i);r&&a&&this.scene.setPlaneToSquare(r,a)}if(!n.length){let i=this._squareOf(this._movingPieceId);i&&this.scene.setPlaneToSquare(this._movingPieceId,i)}this._setPhase("idle")}async _run(t,e){if(this.reduced)return this._runReduced(t);this.holding&&await this.returnToOverview();let n=t.find(b=>b.type==="dice"),i=t.filter(xh),r=t.find(b=>b.type==="prompt"&&b.prompt),a=t.find(b=>b.type==="minigame"),o=t.find(b=>b.type==="capture"),l=t.find(b=>b.type==="stack"),c=t.find(b=>b.type==="win"),h=t.find(b=>b.type==="ledger"),u=t.find(b=>b.type==="safe");if(n&&(await this._phaseRoll(n),!i.length&&!r&&!a&&!c)){await this.returnToOverview();return}if(!i.length){let b=r&&r.prompt;if(c||b&&b.kind==="ending"){await this._phaseWin();return}if(h||u){await this.returnToOverview();return}this._setPhase("idle");return}let d=i[0],f=d.pieceId||o&&o.attackerId;if(!f)return;this._movingPieceId=f,this.scene.ensurePlane(f,this._colorFor(f),this._playerOf(f)),this.targetSquare=Qr(i[i.length-1]);let g=this._originFor(d,f);await this._phaseFocus(f,g),this._setPhase("fly"),this.scene.fixPlane(f),this.scene.setFlyMode(!0),this.scene.lockProbeId=f,this.scene.lockStats.reset(),this.scene.setStreaks(!0),this.sfx.whoosh();let _=g;for(let b of i)_=await this._animateMotion(b,_,f);this._lastSquare=_,this.scene.setStreaks(!1),await this._phaseLand(f,_),o&&await this._phaseCapture(o,_),l&&(this.scene.setTargetGlow(_,.8),await this._phaseStack(l));let m=r&&r.prompt;if(!!(m&&m.kind==="ending")||c&&!m){await this._phaseWin();return}if(r||a){await this._phaseCell(f,_),(this._instantNext||this.reduced)&&await this.returnToOverview(f,_);return}await this.returnToOverview(f,_)}_originFor(t,e){let n=ef(t);if(n)return n;let i=this._squareOf(e);return i||t.path&&t.path[0]||"ring:0"}async _phaseRoll(t){this._setPhase("roll");let e=xe(Number(t.die)||1,1,6);if(this.reduced){this.scene.placeDie(e);return}await this._animateCamera(620,this._roll()),this.sfx.dice(),await this.scene.tossDie(e,this._instantNext||this._skipUntilIdle)}async _phaseFocus(t,e){this._setPhase("focus");let n=Kr(e),i=this._focus();if(this.scene.setPlaneToSquare(t,e),this.scene.setTargetGlow(e,.5),this.scene.reduced){this.scene.applyPose(n),this.scene.rig.snap(i);return}let r=this.scene.boardPose(),a=this.scene.rig.snapshotTarget();await this._animateCamera(950,i,l=>{let c=_h(r,n,l);this.scene.applyPose(c);let h=this.scene.planes.get(t);if(!h)return i.center.clone();let u=h.local.clone();return this.scene.boardGroup.localToWorld(u),u}),this.scene.applyPose(n);let o=this.scene.planes.get(t);o&&(this.scene.rig.state.center.copy(o.group.position),this.scene.rig.apply())}async _slideTo(t,e){let n=this.scene.boardPose();if(this.scene.reduced){this.scene.applyPose(t);return}await this._anim(e,i=>{let r=es(xe(i,0,1));this.scene.applyPose(_h(n,t,r))}),this.scene.applyPose(t)}async _animateMotion(t,e,n){if(t.type==="move"){let i=(t.path||[]).slice();for(let r of i){this.scene.setTargetGlow(r,.5);let a=String(r).indexOf("home:")===0?190:165;await this._slideTo(Kr(r),a),e=r,this.sfx.tick()}return e}if(t.type==="takeoff"){let i=Qr(t)||e,r=this.scene.planes.get(n);return r&&r.group.scale.setScalar(.82),this.scene.setTargetGlow(i,.55),await this._slideTo(Kr(i),900),r&&r.group.scale.setScalar(1),this.sfx.whoosh(),i}if(t.type==="jump"||t.type==="fly"){let i=Qr(t)||e;return this.scene.setTargetGlow(i,.8),await this._slideTo(Kr(i),t.type==="jump"?540:840),this.sfx.whoosh(),i}return e}async _phaseLand(t,e){if(this._setPhase("land"),this.scene.setFlyMode(!1),this.scene.rig.unlock(),this.scene.lockProbeId=null,this.scene.setPlaneToSquare(t,e),this.scene.setTargetGlow(e,.7),this.scene.playRipple(this._instantNext||this._skipUntilIdle),this.sfx.land(),this.scene.reduced){this.scene.rig.snap(this._land());return}await this._animateCamera(460,this._land()),this._instantNext||this.scene.pulseTargetGlow(380)}async _phaseStack(t){this._setPhase("stack"),this._instantNext||this.scene.pulseTargetGlow(520);let e=t&&t.pieceIds||[];for(let n of e){let i=this.scene.planes.get(n);i&&i.group.scale.setScalar(1.14)}if(!this.scene.reduced){await this._anim(320,n=>{let i=1+Math.sin(n*Math.PI)*.14;for(let r of e){let a=this.scene.planes.get(r);a&&a.group.scale.setScalar(i)}});for(let n of e){let i=this.scene.planes.get(n);i&&i.group.scale.setScalar(1)}}}async _phaseCapture(t,e){this._setPhase("capture"),this.scene.rig.shake(320,.06),this.sfx.capture();let n=t&&t.victimIds||[];for(let i of n){let r=this._colorFor(i),a=this.scene.ensurePlane(i,r,this._playerOf(i)),o=li(e);a.local.set(o.x,o.y,o.z),a.localYaw=o.yaw,a.mode="board",a.group.visible=!0,a.group.scale.setScalar(1),this.scene._applyPlaneLocal(a),this.scene.updatePlaneTransforms();let l=this._squareOf(i)||"hangar:"+r+":0",c=li(l);if(this.scene.reduced){this.scene.setPlaneToSquare(i,l);continue}await this._anim(700,h=>{let u=es(xe(h,0,1));a.local.set(se(o.x,c.x,u),se(o.y,c.y,u)+Math.sin(h*Math.PI)*.55,se(o.z,c.z,u)),a.localYaw=o.yaw+u*5,a.group.scale.setScalar(1-u*.35),this.scene._applyPlaneLocal(a),this.scene.updatePlaneTransforms()}),this.scene.hidePlane(i)}}async _phaseCell(t,e){if(this.scene.reduced){await this.returnToOverview(t,e);return}this._setPhase("cell45"),this.scene.setDim(.18),this.scene.setStageSquare(e),this.scene.stageShadow.position.set(0,.004,0),this.scene.stageShadow.material.opacity=0,this.scene.stageShadow.scale.setScalar(1),this.scene.setStageRise(0),this.scene.setStageVisible(!0),this.scene.setBearVisible(!1),this.scene.bear.group.scale.setScalar(.001),this.scene.bear.group.rotation.y=Math.PI+Ei*Le,this.scene.hidePlane(t),this.scene.setTargetGlow(null);let n=this._stage(),i=this.scene.rig.snapshotTarget(),r=this._animateCamera(900,n,l=>new R(0,se(i.center.y,n.center.y,l),0)),a=this._anim(900,l=>{let c=es(xe(l,0,1));this.scene.setDim(se(1,.18,Xs(0,.75,l))),this.scene.setStageRise(se(0,ol,c)),this.scene.stageShadow.material.opacity=se(0,.5,Xs(.2,1,l)),this.scene.stageShadow.scale.setScalar(se(1,.7,c))});await Promise.all([r,a]),this.scene.setDim(.18),this.scene.setStageRise(ol),this.scene.rig.snap(n),this.scene.setBearVisible(!0),this._setPhase("bear"),this.sfx.bear();let o=Math.PI+Ei*Le;await this._anim(560,l=>{let c=l<.6?Yr(l/.6)*1.14:1.14-(l-.6)/.4*.14;this.scene.bear.group.scale.setScalar(xe(c,.001,1.15)),this.scene.bear.group.rotation.y=o+Math.sin(l*Math.PI*2)*.06}),this.scene.bear.group.scale.setScalar(1),this.scene.bear.group.rotation.y=o,this.scene.setBearVisible(!0),this.cellCtx={pieceId:t,square:e},this.holding=!0,this._setPhase("bear")}async _phaseWin(){if(await this.returnToOverview(this._movingPieceId,this._lastSquare),this.reduced){this._setPhase("idle");return}this._setPhase("win"),this.sfx.win(),this.scene.setTargetGlow(null),this.scene.setDim(1),this.scene.requestRender()}async returnToOverview(t,e){let n=this.cellCtx,i=t||n&&n.pieceId||this._movingPieceId,r=e||n&&n.square||this._lastSquare||(i?this._squareOf(i):null);this.cellCtx=null,this.holding=!1,this.scene.lockProbeId=null,this.scene.setStreaks(!1),this.scene.setFlyMode(!1),this.scene.setTargetGlow(null),this.scene.setBearVisible(!1),this.scene.bear.group.scale.setScalar(.001),this.scene.setStageVisible(!1),this.scene.setStageRise(0),this.scene.setDim(1),this._setPhase("return"),this.targetSquare=null;let a=this.scene.boardPose(),o=hl(a.theta,0),l=this.scene.rig.snapshotTarget(),c=this._overview();if(this.scene.reduced||await this._anim(700,h=>{let u=es(xe(h,0,1));this.scene.applyPose({theta:a.theta+o*u,tx:a.tx*(1-u),tz:a.tz*(1-u)});let d=this.scene.rig.state;d.center.lerpVectors(l.center,c.center,u),d.nx=se(l.nx,c.nx,u),d.ny=se(l.ny,c.ny,u),d.radius=se(l.radius,c.radius,u),d.elev=se(l.elev,c.elev,u),d.azim=se(l.azim,c.azim,u),d.fov=se(l.fov,c.fov,u),this.scene.rig.apply()}),this.scene.applyPose({theta:0,tx:0,tz:0}),i&&r&&this.scene.setPlaneToSquare(i,r),this.scene.rig.snap(this._overview()),this._setPhase("idle"),this._fitPending){this._fitPending=!1;try{this.handleResize()}catch(h){}}}debug(){return{phase:this.phase,busy:this.busy,holding:this.holding,reduced:this.reduced,target:this.targetSquare,lastSquare:this._lastSquare,cell:this.cellCtx?{...this.cellCtx}:null,movingPiece:this._movingPieceId}}dispose(){this._queue=Promise.resolve(),this.busy=!1,this.holding=!1,this.cellCtx=null,this.scene=null,this.host=null}};var hx=["data-3d-phase","data-3d-ready","data-3d-reduced","data-3d-theme","data-3d-mode","data-3d-fallback","data-3d-zoom","data-3d-zoom-value","data-3d-zoom-lock"],Qt=null;function jr(){return typeof window!="undefined"?window:typeof globalThis!="undefined"?globalThis:null}function af(s){if(s&&$i[s])return s;try{let t=jr()&&jr().App,e=t&&t.Themes&&t.Themes.get?t.Themes.get():null;if(e&&$i[e])return e}catch(t){}return"cloud"}function ux(){try{let t=document.createElement("canvas").getContext("webgl2");if(!t)return!1;let e=t.getExtension("WEBGL_lose_context");return e&&e.loseContext(),!0}catch(s){return!1}}var Mh=class{constructor(t,e){this.host=t,this.opts=e||{},this.reduced=!!this.opts.reduced,this.theme=af(this.opts.theme),this.mode=this.opts.mode==="long"?"long":"quick",this.state=null,this.view=null,this.pending=null,this._busy=!1,this._dieValue=1,this.scene=null,this.director=null,this.layer=null,this.canvas=null,this.ready=!1,this._hostPositionSet=!1,this._hostOldPosition="",this._refitTimer=0,this._zoomPumpUntil=0}async init(){let t=this.host,e=document.createElement("div");e.className="board3d-layer",e.setAttribute("data-test","board3d-layer"),e.setAttribute("aria-hidden","true"),e.style.cssText="position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;";let n=window.getComputedStyle?window.getComputedStyle(t):null;n&&n.position==="static"&&(this._hostOldPosition=t.style.position||"",t.style.position="relative",this._hostPositionSet=!0);let i=document.createElement("canvas");return i.className="board3d-canvas",i.setAttribute("data-test","board3d-canvas"),i.setAttribute("aria-hidden","true"),i.style.cssText="position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none;",e.appendChild(i),t.appendChild(e),t.removeAttribute("data-3d-fallback"),this.layer=e,this.canvas=i,this.scene=new Tl(t,i,{reduced:this.reduced,theme:this.theme,shadows:this.opts.shadows!==!1,adapt:this.opts.adapt!==!1}),this.scene.rig&&this.scene.rig.setZoomReduced(this.reduced),this.scene.onReady=()=>this._onReady(),this.scene.ready&&this._onReady(),this.director=new El(this.scene,{host:t,reduced:this.reduced,sound:!!this.opts.sound,stageAim:this.opts.stageAim||{nx:0,ny:.15}}),this._hookZoomPhase(),this.scene.onResize=()=>{this.director&&this.director.handleResize(),this._fitNeeded=!0,this._fitTimer&&clearTimeout(this._fitTimer),this._fitTimer=setTimeout(()=>{this._fitTimer=0,this.director&&this.director.handleResize()},450)},this._sizeW=0,this._sizeH=0,this._fitNeeded=!1,this._sizeTimer=setInterval(()=>{if(!this.scene||!this.director)return;let r=t.clientWidth,a=t.clientHeight;if(!r||!a)return;(r!==this._sizeW||a!==this._sizeH)&&(this._sizeW=r,this._sizeH=a,this.scene.resize(),this._fitNeeded=!0),(this._fitNeeded||this.director._fitPending)&&!this.director.busy&&!this.director.holding&&(this._fitNeeded=!1,this.director.handleResize())},350),typeof requestAnimationFrame=="function"&&requestAnimationFrame(()=>{if(this.scene){this.scene.resize();try{this.director.handleResize()}catch(r){}}}),t.setAttribute("data-3d-reduced",this.reduced?"1":"0"),t.setAttribute("data-3d-theme",this.theme),t.setAttribute("data-3d-mode",this.mode),t.setAttribute("data-3d-phase","idle"),this._syncZoomHost(),this.opts.state?this.setState(this.opts.state,this.opts.view):this._applyDefaultPieces(),this}_onReady(){this.ready||(this.ready=!0,this.host.setAttribute("data-3d-ready","1"))}_viewFor(t){if(!t)return null;try{let e=jr()&&jr().App;if(e&&e.Flight&&e.Flight.view)return e.Flight.view(t,{reduced:this.reduced})}catch(e){}return null}_pieces(t){return(t&&t.pieces||[]).map(e=>({id:e.id,color:e.color||"red",playerId:e.playerId||String(e.id).charAt(0),squareId:e.squareId||"hangar:red:0",arrived:!!e.arrived,stackGroupId:e.stackGroupId||null}))}_dieOf(t){if(!t)return this._dieValue||1;if(t.rollContext&&t.rollContext.die)return t.rollContext.die;let e=t.awaiting;if(e&&e.type==="choose-piece"&&e.die)return e.die;let n=t.log||[];for(let i=n.length-1;i>=0;i--)if(n[i]&&n[i].kind==="roll"&&n[i].die)return n[i].die;return this._dieValue||1}_applyDefaultPieces(){let t=[{id:"a:0",color:"red",playerId:"a",squareId:"hangar:red:0"},{id:"a:1",color:"red",playerId:"a",squareId:"hangar:red:1"},{id:"b:0",color:"yellow",playerId:"b",squareId:"hangar:yellow:0"},{id:"b:1",color:"yellow",playerId:"b",squareId:"hangar:yellow:1"}];this.scene&&(this.scene.setPieces(this.mode==="long"?t.concat([{id:"a:2",color:"red",playerId:"a",squareId:"hangar:red:2"},{id:"a:3",color:"red",playerId:"a",squareId:"hangar:red:3"},{id:"b:2",color:"yellow",playerId:"b",squareId:"hangar:yellow:2"},{id:"b:3",color:"yellow",playerId:"b",squareId:"hangar:yellow:3"}]):t,"a",{a:"red",b:"yellow"}),this.scene.placeDie(1))}setState(t,e){if(!t)return this._applyDefaultPieces(),!1;this.state=t,this.view=e||this._viewFor(t),this.director&&this.director.setState(t,e||this.view);let n=this._pieces(t),i=t.turn==="b"?"b":"a",r=t.colors||{a:"red",b:"yellow"},a=this._dieOf(t);if(this._dieValue=a,!this.scene)return!1;let o=this.view&&this.view.meta?this.view.meta.heat:t.meta?t.meta.heat:0;return this.scene.applyHeat(o),this.scene.applyTurn(i,r),this.scene.placeDie(a),this._busy||this.director&&this.director.holding?this.pending={pieces:n,turn:i,colors:r}:(this.scene.setPieces(n,i,r),this.pending=null),!0}_flushPending(){if(!this.pending||!this.scene||this.director&&this.director.holding)return;let t=this.pending;this.pending=null,this.scene.setPieces(t.pieces,t.turn,t.colors)}play(t,e){if(!this.director)return Promise.resolve();this._busy=!0;let n=()=>{this._busy=!1,(!this.director||!this.director.holding)&&this._flushPending()},i=this.director.play(t,e);return i.then(n,n),i}setTheme(t){return this.theme=af(t),this.scene&&this.scene.applyTheme(this.theme),this.host.setAttribute("data-3d-theme",this.theme),!0}setReduced(t){if(this.reduced=!!t,this.host.setAttribute("data-3d-reduced",this.reduced?"1":"0"),this.director?this.director.setReduced(this.reduced):this.scene&&this.scene.setReduced(this.reduced),this.scene&&this.scene.rig&&(this.scene.rig.setZoomReduced(this.reduced),this._syncZoomHost(),this.reduced))try{this.scene.renderNow()}catch(e){}return!0}setSound(t){return this.director&&this.director.setSound(!!t),!0}skip(){return this.director&&this.director.skip(),!0}_hookZoomPhase(){let t=this.director;if(!t||t.__zoomHooked)return;t.__zoomHooked=!0;let e=t._setPhase.bind(t);t._setPhase=n=>{e(n),this._onPhase(n)},this._onPhase(t.phase)}_onPhase(t){let e=t==="idle"||t==="boot";this.scene&&this.scene.rig&&this.scene.rig.setZoomActive(e),this.host&&this.host.setAttribute("data-3d-zoom-lock",e?"0":"1"),this._syncZoomHost(),e&&this._zoomPump()}_syncZoomHost(){let t=this.scene&&this.scene.rig;if(!t||!this.host||typeof t.zoomInfo!="function")return;let e=t.zoomInfo();this.host.setAttribute("data-3d-zoom",Number(e.target).toFixed(2)),this.host.setAttribute("data-3d-zoom-value",Number(e.value).toFixed(2))}canZoom(){let t=this.director;return!this.ready||!this.scene||!t||this._busy||t.busy||t.holding?!1:t.phase==="idle"||t.phase==="boot"}zoomInfo(){let t=this.scene&&this.scene.rig;if(!t||typeof t.zoomInfo!="function")return null;let e=t.zoomInfo();return e.can=this.canZoom(),e}setZoom(t){if(!this.canZoom()||!this.scene||!this.scene.rig)return!1;let e=this.scene.rig.setZoom(t);return this._zoomChanged(),e}zoomBy(t){if(!this.canZoom()||!this.scene||!this.scene.rig)return!1;let e=this.scene.rig.zoomBy(t);return this._zoomChanged(),e}resetZoom(){if(!this.canZoom()||!this.scene||!this.scene.rig)return!1;let t=this.scene.rig.resetZoom();return this._zoomChanged(),t}_zoomChanged(){if(this._syncZoomHost(),this.reduced)try{this.scene.renderNow()}catch(t){}this._zoomPump(),this._refitTimer&&clearTimeout(this._refitTimer),this._refitTimer=setTimeout(()=>{if(this._refitTimer=0,this._syncZoomHost(),!!this.canZoom()){try{this.director.handleResize()}catch(t){}if(this._syncZoomHost(),this.reduced)try{this.scene.renderNow()}catch(t){}}},160)}_zoomPump(){if(this.reduced||!this.scene)return;let t=typeof performance!="undefined"&&performance.now?performance.now():Date.now();if(t<this._zoomPumpUntil)return;this._zoomPumpUntil=t+700;let e=()=>{if(!this.scene)return;try{this.scene.requestRender()}catch(i){}(typeof performance!="undefined"&&performance.now?performance.now():Date.now())<this._zoomPumpUntil?requestAnimationFrame(e):this._zoomPumpUntil=0};try{requestAnimationFrame(e)}catch(n){this._zoomPumpUntil=0}}returnToOverview(){if(!this.director)return Promise.resolve(!1);let t=this.director;return t.returnToOverview().then(()=>(t.holding||this._flushPending(),!0),()=>!1)}unmount(){if(this._fitTimer&&(clearTimeout(this._fitTimer),this._fitTimer=0),this._refitTimer&&(clearTimeout(this._refitTimer),this._refitTimer=0),this._sizeTimer&&(clearInterval(this._sizeTimer),this._sizeTimer=0),this.director){try{this.director.dispose()}catch(t){}this.director=null}if(this.scene){try{this.scene.dispose()}catch(t){}this.scene=null}return this.layer&&this.layer.parentNode&&this.layer.parentNode.removeChild(this.layer),this.layer=null,this.canvas=null,this._hostPositionSet&&(this.host.style.position=this._hostOldPosition,this._hostPositionSet=!1),hx.forEach(t=>this.host.removeAttribute(t)),!0}_debug(){let t=this.director?this.director.debug():{},e=this.scene?this.scene.debugSnapshot():{},n=e.current||null,i=this.scene&&this.scene.rig,r=i&&typeof i.zoomInfo=="function"?i.zoomInfo():{value:1,target:1,min:.8,max:1.5,active:!0,instant:!1,radiusFactor:1};return r.can=this.canZoom(),{version:sl,ready:!!this.ready,mounted:!0,phase:t.phase||e.phase||"boot",zoom:r,pieces:this._pieces(this.state).map(a=>({id:a.id,color:a.color,playerId:a.playerId,squareId:a.squareId,arrived:a.arrived})),target:t.target!=null?t.target:this.director?this.director._lastSquare:null,fps:n?n.fps:0,drawCalls:e.render?e.render.calls:0,triangles:e.render?e.render.triangles:0,dpr:e.dpr||0,quality:e.quality||"high",reduced:this.reduced,theme:this.theme,heat:this.scene?this.scene.heat:0,turn:this.scene?this.scene.turn:null,mode:this.mode,busy:!!t.busy,holding:!!t.holding,cell:t.cell||null,probe:e.probe||null,perf:e,three:"180"}}};async function dx(s,t){if(!s||typeof document=="undefined")return null;if(Qt){try{Qt.unmount()}catch(n){}Qt=null}if(!ux()){try{s.setAttribute("data-3d-fallback","no-webgl2")}catch(n){}return null}let e=null;try{return e=new Mh(s,t||{}),await e.init(),Qt=e,e}catch(n){console.warn("[board3d] mount failed:",n&&n.message?n.message:n);try{e&&e.unmount()}catch(i){}try{s.setAttribute("data-3d-fallback","mount-failed")}catch(i){}return null}}var of={version:sl,get mounted(){return!!Qt},get threeRevision(){return"180"},mount:dx,setState(s,t){return Qt?Qt.setState(s,t):!1},play(s,t){return Qt?Qt.play(s,t):Promise.resolve()},setTheme(s){return Qt?Qt.setTheme(s):!1},setReduced(s){return Qt?Qt.setReduced(s):!1},setSound(s){return Qt?Qt.setSound(s):!1},skip(){return Qt?Qt.skip():!1},canZoom(){return Qt?Qt.canZoom():!1},setZoom(s){return Qt?Qt.setZoom(s):!1},zoomBy(s){return Qt?Qt.zoomBy(s):!1},resetZoom(){return Qt?Qt.resetZoom():!1},zoomInfo(){return Qt?Qt.zoomInfo():null},returnToOverview(){return Qt?Qt.returnToOverview():Promise.resolve(!1)},unmount(){if(!Qt)return!1;try{Qt.unmount()}catch(s){}return Qt=null,!0},_debug(){return Qt?Qt._debug():{version:sl,ready:!1,mounted:!1,phase:"boot",pieces:[],target:null,fps:0,drawCalls:0}},_current(){return Qt}},wl=jr();wl&&(wl.App=wl.App||{},wl.App.Board3D=of);var GM=of;})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
