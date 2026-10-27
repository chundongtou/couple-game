/* 升温夜航 · V3 Service Worker（纯静态文件，无构建）
 *
 * 策略：
 *  - install：预缓存应用外壳（Promise.allSettled，单个失败不阻塞安装），skipWaiting 立刻待命；
 *  - activate：删除旧版本缓存 + clients.claim() 接管已打开的页面；
 *  - fetch：
 *      · 只接管同源 GET，跨域 / 非 GET 直接放行交给浏览器默认行为；
 *      · 页面导航（打开 / 刷新）走 network-first —— 发新版本后不会被旧缓存锁死；
 *      · 其它静态资源走 cache-first，未命中时联网并后台回填。
 * 站内是单文件应用，没有运行时接口请求，不需要任何网络数据同步逻辑。
 *
 * 发版注意：改了 app/ 或静态资源后，把 CACHE 版本号 +1（couple-voyage-v1 → v2），
 * 老用户下次打开会拿到新 SW 并提示「新版本已就绪」。
 */
var CACHE = 'couple-voyage-v1';

/* 预缓存清单：相对路径，dev 服务根目录 = 构建产物目录，GitHub Pages 子路径同样可用 */
var PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

var INDEX_KEY = './index.html';

function absUrl(rel) {
  try {
    return new URL(rel, self.registration.scope).href;
  } catch (e) {
    return rel;
  }
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

  // 页面导航：网络优先，失败回退缓存的 index.html
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(networkFirst(req));
    return;
  }

  // 静态资源：缓存优先 + 后台回填
  event.respondWith(cacheFirst(req));
});

function networkFirst(req) {
  return fetch(req).then(function (res) {
    // 只缓存正常响应；顺手把最新首页写回缓存，离线也能打开
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
        // 极端情况：缓存也被清空，给一个可读的离线提示页（仍然不联网）
        return new Response(
          '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">'
            + '<meta name="viewport" content="width=device-width,initial-scale=1">'
            + '<title>离线</title></head><body style="font-family:sans-serif;text-align:center;padding:48px 20px;background:#070411;color:#f7f1ff">'
            + '<div style="font-size:40px">☾</div>'
            + '<h2>现在没有网络</h2>'
            + '<p style="color:#b3a6c9">联网后再打开一次，之后就能离线夜航了</p></body></html>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
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
