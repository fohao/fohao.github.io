"use strict";const CACHE_NAME="szcache",RESOURCES=[["index.html","update.js"],["manifest.json","favicon.png","icon.png"]];var lastCheckUpdateTime=0;function getResKey(s){var c=(c=registration.scope)||location.origin,s=s.url.substring(c.length);return s=""==(s="/"==s.substring(0,1)?s.substring(1):s)||"/"==s||s.startsWith("#")||s.startsWith("?v=")||s.startsWith("?_=")?"index.html":s}async function reloadAll(){return caches.open(CACHE_NAME).then(l=>{l.keys().then(function(s){s.forEach(function(s,c,r){if(s){var h=s.url.split("/").pop();-1===RESOURCES[1].indexOf(h)&&l.delete(s)}})});var r=registration.scope;RESOURCES[0].forEach(c=>{fetch(r+c).then(s=>{l.put(r+c,s.clone());"index.html"==c&&l.put(r,s.clone())})})}).catch(s=>{caches.delete(CACHE_NAME)})}async function checkUpdate(){try{var s=registration.scope+"update.js",c=await fetch(s,{cache:"reload"}),r=await c.text();if(!r||!r.match(/^\d+$/))return;var h=await caches.open(CACHE_NAME);if(!(c=await h.match(s)))return h.put(s,new Response(r)),void 0;var l=await c.text();l!=r&&reloadAll()}catch(s){}}self.addEventListener("fetch",s=>{if("GET"===s.request.method){var c=getResKey(s.request);if(-1!==RESOURCES[1].indexOf(c))return cacheOnly(s);if(-1!==RESOURCES[0].indexOf(c)){if("index.html"==c){c=+new Date;if(36e5<c-lastCheckUpdateTime){lastCheckUpdateTime=c;checkUpdate()}}return cacheFirst(s)}}});self.addEventListener("message",s=>{"skipWaiting"===s.data&&self.skipWaiting()});self.addEventListener("install",s=>s.waitUntil(self.skipWaiting()));self.addEventListener("activate",function(s){return s.waitUntil(async function(){await reloadAll();await self.clients.claim()}())});function cacheOnly(c){return c.respondWith(caches.open(CACHE_NAME).then(s=>s.match(c.request)))}function cacheFirst(r){return r.respondWith(caches.open(CACHE_NAME).then(c=>c.match(r.request).then(s=>s||fetch(r.request).then(s=>{c.put(r.request,s.clone());return s}))))}