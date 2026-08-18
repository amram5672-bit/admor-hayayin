
const CACHE='admor-hayayin-phone-v2';
const LOCAL=[
 './',
 './index.html',
 './manifest.webmanifest',
 './event.json',
 './sw.js'
];
const REMOTE=[
 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(async c=>{
   await c.addAll(LOCAL);
   for(const u of REMOTE){try{await c.add(u)}catch(e){}}
 }));
 self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
 self.clients.claim();
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET') return;
 event.respondWith(caches.match(event.request).then(cached=>{
   if(cached)return cached;
   return fetch(event.request).then(resp=>{
     const copy=resp.clone();
     caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});
     return resp;
   }).catch(()=>caches.match('./index.html'));
 }));
});
