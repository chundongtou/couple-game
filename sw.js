/* 今晚飞行棋 V6 · Service Worker 模板
 *
 * ⚠️ 本文件是**模板**，不要直接部署；仓库根的 `sw.js` 由
 *    `python tools/rebuild/build_app.py` 读本文件生成（占位符替换）。
 *    构建写入：couple-flight-v6-abe63301 / abe63301 / [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/cards.6e682ef2.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
]
 *
 * 策略（与 V5 保持一致，只换版本与清单）：
 *  - install：预缓存应用外壳 + 题库 + 图标（Promise.allSettled，单个 404 不阻塞安装），
 *             随后 self.skipWaiting() 立刻待命；
 *  - activate：删除非当前 CACHE 的旧缓存 + clients.claim() 接管已打开页面；
 *  - fetch：
 *      · 只接管同源 GET；跨域 / 非 GET / data: blob: 直接放行交给浏览器；
 *      · 页面导航（打开 / 刷新）走 network-first + 12s 超时 —— 发新版本后不会被旧缓存锁死；
 *      · 其它静态资源走 cache-first，未命中时联网并后台回填。
 *  - 更新提示沿用 app/src/ui/pwa.js 的「新版本已就绪」toast（本文件不弹任何 UI）。
 *
 * 发版：CACHE 版本 = "couple-flight-v6-" + 构建时 index.html 的 sha256 前 8 位，
 *       内容一变版本自动变，老用户下次打开即拿到新 SW。**禁止手改 sw.js。**
 */
var CACHE = 'couple-flight-v6-abe63301';
var BUILD = 'abe63301';

/* 预缓存清单：相对路径，根目录 = 构建产物目录（GitHub Pages 子路径同样可用）。
 * 构建时生成：'./' + index + manifest + assets/cards.<hash>.js + PWA 图标。
 * assets/board.js（3D 棋盘，511KB）**不进预缓存**，属于可选特性，走 cache-first 运行时缓存。 */
var PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/cards.6e682ef2.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

var INDEX_KEY = './index.html';

function absUrl(rel) {
  try {
    return new URL(rel, self.registration.scope).href;
  } catch (e) {
    return rel;
  }
}

function offlinePage(what) {
  return new Response(
    '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">'
      + '<meta name="viewport" content="width=device-width,initial-scale=1">'
      + '<title>离线</title></head><body style="font-family:sans-serif;text-align:center;padding:48px 20px;background:#08060F;color:#FBF3E7">'
      + '<div style="font-size:40px">⌂</div>'
      + '<h2>' + (what || '这一页') + '现在没有网络</h2>'
      + '<p style="color:#C9B6CE">联网后再打开一次，之后就能离线玩了</p></body></html>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 200 }
  );
}

/* ---------- install：预缓存外壳 ---------- */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // 用 allSettled：某个图标 404 也不让整个安装失败
      return Promise.allSettled(
        PRECACHE.map(function (rel) {
          return cache.add(new Request(absUrl(rel), { cache: 'reload' }));
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })["catch"](function () {
      return self.skipWaiting();
    })
  );
});

/* ---------- activate：清旧缓存 + 接管页面 ---------- */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE) return caches.delete(key);
          return null;
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ---------- fetch ---------- */
self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (!req || req.method !== 'GET') return;                           // 非 GET 放行

  var url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;  // data:/blob: 等放行
  if (url.origin !== self.location.origin) return;                    // 跨域放行

  // 页面导航：网络优先，失败回退缓存的 index
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(networkFirst(req));
    return;
  }

  // 静态资源：缓存优先 + 后台回填
  event.respondWith(cacheFirst(req));
});

function fetchWithTimeout(req, ms) {
  return new Promise(function (resolve, reject) {
    var timer = setTimeout(function () { reject(new Error('sw-fetch-timeout')); }, ms || 12000);
    fetch(req).then(function (res) {
      clearTimeout(timer);
      resolve(res);
    }, function (err) {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function networkFirst(req) {
  return fetchWithTimeout(req, 12000).then(function (res) {
    // 只缓存正常响应；写回统一存到 './index.html' 这个 key，避免 query/hash 变体各自占一份
    if (res && res.ok && res.type === 'basic') {
      var copy = res.clone();
      caches.open(CACHE).then(function (cache) {
        cache.put(absUrl(INDEX_KEY), copy);
      })["catch"](function () {});
    }
    return res;
  })["catch"](function () {
    return caches.match(absUrl(INDEX_KEY)).then(function (hit) {
      if (hit) return hit;
      return caches.match(absUrl('./')).then(function (rootHit) {
        if (rootHit) return rootHit;
        return offlinePage('首页');
      });
    });
  });
}

function cacheFirst(req) {
  return caches.match(req).then(function (hit) {
    if (hit) return hit;
    return fetch(req).then(function (res) {
      if (res && (res.ok || res.type === 'opaque')) {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) {
          cache.put(req, copy);
        })["catch"](function () {});
      }
      return res;
    });
  });
}
