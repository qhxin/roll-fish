var staticRollFish = "roll-fish-$VERSION$";

var assets = '$ASSETS_ARR$';

self.addEventListener("install", installEvent => {
  self.skipWaiting();
  
  installEvent.waitUntil(
    caches.open(staticRollFish).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [staticRollFish];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {

          console.log('remove cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(function(resp) {
      if (resp) {
        console.log('hit cache', resp.url);
      } else {
        console.log('miss cache', fetchEvent.request.url);
      }
      return resp || fetch(fetchEvent.request).then(function(response) {
        return caches.open(staticRollFish).then(function(cache) {
          if (fetchEvent.request.url.indexOf('http') === 0) {
            cache.put(fetchEvent.request, response.clone());
          }
          return response;
        });
      });
    })
  );
});