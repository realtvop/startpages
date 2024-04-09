"use strict";

var cacheStorageKey = "SPv0-";

const CORE = [
    "/",
    "/index.html",
    "/icons/favicon.ico",
    "/icons/favicon.png",
    "/mainsest.json",
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
                    if (response.ok || response.type === "opaque") cache.put(request, response.clone());
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
            return cache.match(request, { ignoreSearch: true, ignoreVary: true }).then((response) => {
                return response;
            });
        };
        if (!navigator.onLine) return offlineFetch();
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
    if (e.request.url.startsWith("http")) {
        if (urlParsed.path.endsWith("sw.v2.js") || (urlParsed.path.endsWith(".json") && !urlParsed.path.endsWith("manifest.json")) || (urlParsed.host === "corsproxy.io" && urlParsed.queryParam.startsWith("?https://api.weatherapi.com")) || urlParsed.host === "weatherapi.realtvop.eu.org") {
            return;
        } else if (urlParsed.host === "res.realtvop.eu.org" || urlParsed.host === "res.realtvop.top") {
            e.respondWith(cacheFirst(e.request, cacheStorageKey + "Res"));
            return;
        } else if (urlParsed.host == currentUrlParsed.host) {
            e.respondWith(cacheFirst(e.request, cacheStorageKey + "Main"));
            return;
        } else {
            e.respondWith(cacheFirst(e.request, cacheStorageKey + "ExternalRes"));
            return;
        };
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

self.addEventListener('message', event => {
    const evtAct = event.data.action;
    if (!evtAct) return;
    if (evtAct === "update") {
        const assets = JSON.parse(JSON.stringify(CORE));
        for (const asset of event.data.assets) assets.push(`/assets/${asset}`);

        caches.delete(cacheStorageKey + "Main");
        caches.open(cacheStorageKey + "Main").then(function (cache) {
            return cache.addAll(assets);
        });
    }
});