const staticRollFish = "roll-fish-v1";
// TODO assets list
const assets = [
  "/",
  "/index.html",
  "/static/css/main.ec2afee5.css",
  "/static/js/main.fe2d5aea.js",
  "/db/inami.db",
  "/db/sql-wasm.js",
  "/db/sql-wasm.wasm",
  "/logo192.png",
  "/logo512.png",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticRollFish).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener('fetch', (fetchEvent) => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then((res) => {
            return res || fetch(fetchEvent.request);
        })
    );
});