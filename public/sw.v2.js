"use strict";

var cacheStorageKey = "SPv0-";

const CORE = [
    "/",
    "index.html",
];

function parseURL(url) {
    let tmp = url.substr(url.indexOf("//") + 2);
    let host = tmp.substr(0, tmp.indexOf("/"));
    let tmp2 = tmp.substr(tmp.indexOf("/"));
    let qm = tmp2.indexOf("?");
    let path, queryParam;
    if (qm < 0) {
        path = tmp2;
        queryParam = undefined;
    } else {
        path = tmp2.substr(0, qm);
        queryParam = tmp2.substr(qm);
    }

    return {
        path,
        host,
        queryParam,
    };
}

function cacheFirst(request, key) {
    return caches.open(key).then((cache) => {
        return cache.match(request, { ignoreSearch: true, ignoreVary: true }).then((response) => {
            return (
                response ||
                fetch(request).then((response) => {
                    if (response.ok) cache.put(request, response.clone());
                    return response;
                })
            );
        });
    });
}

function cacheOrOnline(request, key) {
    return caches.open(key).then((cache) => {
        return cache.match(request, { ignoreSearch: true, ignoreVary: true }).then((response) => {
            return response || fetch(request);
        });
    });
}

function onlineFirst(request, key) {
    return caches.open(key).then((cache) => {
        const offlineFetch = () => {
            return cache.match(request).then((response) => {
                return response;
            });
        };
        if (!navigator.onLine) return offlineFetch;
        return fetch(request)
            .then((response) => {
                if (response.ok) cache.put(request, response.clone());
                return response;
            })
            .catch(offlineFetch);
    });
}

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheStorageKey + "Main").then(function (cache) {
            return cache.addAll(CORE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("fetch", async function (e) {
    const urlParsed = parseURL(e.request.url);
    const currentUrlParsed = parseURL(self.location.href);
    // const urlOri = e.request.url;
    if (e.request.url.startsWith("http")) {
        if (urlParsed.host === "res.realtvop.eu.org") {
            e.respondWith(cacheFirst(e.request, cacheStorageKey + "res"));
            return;
        } else /* if (urlParsed.path.endsWith(".json")) {
            return;
        } else */ if (urlParsed.host == currentUrlParsed.host) {
            e.respondWith(onlineFirst(e.request, cacheStorageKey + "Main"));
            return;
        } else return;
    }
    return;
});
self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheNames) => {
                            return !cacheNames.startsWith(cacheStorageKey);
                        })
                        .map((cacheNames) => {
                            return caches.delete(cacheNames);
                        })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});