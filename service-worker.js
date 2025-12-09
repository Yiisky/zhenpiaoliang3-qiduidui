// 定义缓存名称
const CACHE_NAME = '戚怼怼芒信-v1.0';

// 需要缓存的文件列表
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 安装service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('已打开缓存');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求并返回缓存内容
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，则返回缓存内容
        if (response) {
          return response;
        }
        
        // 否则从网络获取
        return fetch(event.request).then(
          response => {
            // 检查是否为有效响应
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应
            const responseToCache = response.clone();
            
            // 将新资源添加到缓存
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          }
        );
      })
  );
});
