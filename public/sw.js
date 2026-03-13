const CACHE_NAME = 'fileshare-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: handle share target POST and serve cached assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle Share Target API POST
  if (url.pathname === '/share-target' && event.request.method === 'POST') {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const files = formData.getAll('files');

        if (files.length > 0) {
          // Re-upload files to our server API
          const uploadData = new FormData();
          for (const file of files) {
            if (file instanceof File && file.size > 0) {
              uploadData.append('files', file);
            }
          }

          try {
            await fetch('/api/upload', {
              method: 'POST',
              body: uploadData
            });
          } catch (e) {
            // Upload failed, user will see files page anyway
          }
        }

        // Redirect to the main page
        return Response.redirect('/?shared=1', 303);
      })()
    );
    return;
  }

  // For navigation and static assets, try network first, fallback to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
    return;
  }

  // Other requests: network first
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
