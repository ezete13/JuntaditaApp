self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("juntadita-cache").then((cache) => {
        return cache.addAll([
          "/",
          "/index.html",
          "/css/bootstrap.css",
          "/css/custom.css",
          "/js/app.js",
          "/assets/img/LogoJuntadita.webp"
        ]);
      })
    );
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  