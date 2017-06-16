const log = (...args) => console.info('--- sw:', ...args)

// Preload config
const ORIGIN =
  location.protocol + '//' + location.hostname + ':' + location.port
const CACHE_VERSION = 'v1'
const PRELOAD_FILES = [ORIGIN + '/static/1024kb.jpg']

log('started', CACHE_VERSION)

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(PRELOAD_FILES)
    })
  )
})

// Kick off SW on first activate
self.addEventListener('activate', event => {
  log('activated')
  event.waitUntil(self.clients.claim())
})

// Return cache
self.addEventListener('fetch', event => {
  // log('fetch:', event.request.url)
  event.respondWith(
    caches.match(event.request).then(response => {
      if (!!response) {
        log('return cache: for', event.request.url)
      }
      return response || fetch(event.request)
    })
  )
})
