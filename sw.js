/* 情侣升温游戏 · V18 Service Worker（纯静态文件，无构建）
 * V18 说明：缓存版本升到 v18-1；以后改 index/图标/sw 策略时记得 bump CACHE。
 *
 * 策略：
 *  - install：预缓存应用外壳（逐个 allSettled，单个失败不阻塞安装），skipWaiting 立刻待命；
 *  - activate：清掉旧版本缓存 + clients.claim() 接管已打开的页面；
 *  - fetch：
 *      · 只接管同源 GET，跨域 / 非 GET 直接放行交给浏览器默认行为；
 *      · 页面导航（打开页面 / 刷新）走 network-first —— 保证发新版本后用户不会锁死在旧缓存；
 *      · 其它静态资源走 cache-first，未命中时联网并后台回填缓存。
 * 站内没有运行时接口请求，所以这里不需要任何网络数据同步逻辑。
 */
var CACHE = 'couple-game-v18-1';

/* 预缓存清单（相对路径：dev 服务根目录 = 构建产物目录，GitHub Pages 子目录也能用） */
var PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
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
      /* 用 allSettled：某个图标 404 也不让整个安装失败 */
      return Promise.allSettled(
        PRECACHE.map(function (rel) {
          return cache.add(new Request(absUrl(rel), { cache: 'reload' }));
        })
      );
    }).then(function () {
      return self.skipWaiting();
    }).catch(function () {
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
  if (!req || req.method !== 'GET') return;          /* 非 GET 放行 */

  var url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return; /* data:/blob:/chrome-extension: 放行 */
  if (url.origin !== self.location.origin) return;                     /* 跨域放行 */

  /* 页面导航：网络优先，失败回退缓存的 index.html（永不锁死在旧版） */
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(networkFirst(req));
    return;
  }

  /* 静态资源：缓存优先 + 后台回填 */
  event.respondWith(cacheFirst(req));
});

function networkFirst(req) {
  return fetch(req).then(function (res) {
    /* 只缓存正常响应；顺手把最新首页写回缓存，离线也能开 */
    if (res && res.ok && res.type === 'basic') {
      var copy = res.clone();
      caches.open(CACHE).then(function (cache) {
        cache.put(absUrl(INDEX_KEY), copy);
      }).catch(function () {});
    }
    return res;
  }).catch(function () {
    return caches.match(absUrl(INDEX_KEY)).then(function (hit) {
      if (hit) return hit;
      return caches.match(absUrl('./')).then(function (rootHit) {
        if (rootHit) return rootHit;
        /* 极端情况：缓存也被清空，给一个可读的离线提示页（仍然不联网） */
        return new Response(
          '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">'
            + '<meta name="viewport" content="width=device-width,initial-scale=1">'
            + '<title>离线</title></head><body style="font-family:sans-serif;text-align:center;padding:48px 20px">'
            + '<div style="font-size:40px">📴</div>'
            + '<h2>现在没有网络</h2>'
            + '<p style="color:#888">联网后再打开一次，之后就能离线玩了</p></body></html>',
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
        }).catch(function () {});
      }
      return res;
    });
  });
}
