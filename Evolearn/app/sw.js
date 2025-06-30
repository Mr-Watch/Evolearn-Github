self.addEventListener("fetch", function (event) {
  let request = event.request;
  event.respondWith(
    fetch(request)
      .then(function (response) {
        let copy = response.clone();
        event.waitUntil(
          caches.open("app").then(async function (cache) {
            try {
              return await cache.put(request, copy);
            } catch (error) { }
          })
        );
        return response;
      })
      .catch(async function (_) {
        const response = await caches.match(request);
        return response;
      })
  );
});
