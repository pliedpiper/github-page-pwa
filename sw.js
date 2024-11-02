// Service Worker Setup
var GHPATH = '/github-page-pwa';
var APP_PREFIX = 'gppwa_';
var VERSION = 'version_002';
var URLS = [    
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/css/styles.css`,
  `${GHPATH}/img/icon.png`,
  `${GHPATH}/sw.js`
];

var CACHE_NAME = APP_PREFIX + VERSION;
self.addEventListener('fetch', function (e) {
  console.log('Fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { 
        console.log('Responding with cache : ' + e.request.url);
        return request;
      } else {       
        console.log('File is not cached, fetching : ' + e.request.url);
        return fetch(e.request);
      }
    })
  );
});

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Installing cache : ' + CACHE_NAME);
      return cache.addAll(URLS);
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('Deleting cache : ' + keyList[i]);
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});

// Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
  const nightModeSlider = document.getElementById('night-mode');
  const brightnessSlider = document.getElementById('brightness');

  nightModeSlider.addEventListener('input', function() {
    // Map slider value (0 to 100) to hue and saturation
    const value = nightModeSlider.value;
    const hue = (value / 100) * 60; // 0 to 60 degrees
    const saturation = (value / 100) * 100; // 0% to 100%
    const lightness = 100 - (value / 100) * 10; // 100% to 90%

    document.body.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });

  brightnessSlider.addEventListener('input', function() {
    const value = brightnessSlider.value;
    const brightness = 0.3 + (value / 100) * 0.7; // 0.3 to 1

    document.body.style.filter = `brightness(${brightness})`;
  });
});
