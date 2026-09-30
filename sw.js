const CACHE='preventicloud-v26-runtime';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
  const req=event.request; if(req.method!=='GET')return;
  const url=new URL(req.url); if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){event.respondWith((async()=>{try{return await fetch(req,{cache:'no-store'})}catch(_){return (await caches.match('/'))||(await caches.match('/index.html'))||Response.error()}})());return}
  if(['script','style','image','font','manifest'].includes(req.destination)){event.respondWith((async()=>{const cache=await caches.open(CACHE);const hit=await cache.match(req);const network=fetch(req).then(res=>{if(res.ok)cache.put(req,res.clone());return res}).catch(()=>null);return hit||(await network)||Response.error()})())}
});
