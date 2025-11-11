//THIS FILE NEEDS TO OVERWRITE THE EXISTING ONE IN CLOUD RUN'S SOURCE CODE IN ORDER FOR iOS DEVICES TO WORK
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// service-workers.js

const TARGET_URL_PREFIX = 'https://generativelanguage.googleapis.com';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(self.clients.claim());
});

/**
 * The fetch event listener now serves one purpose: proxying requests to the
 * target API through the backend to securely attach the API key.
 * It also includes a workaround for iOS by buffering the request body.
 */
self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;

  if (!requestUrl.startsWith(TARGET_URL_PREFIX)) {
    // For requests not targeting the API, do nothing.
    return;
  }

  event.respondWith((async () => {
    try {
      const remainingPathAndQuery = requestUrl.substring(TARGET_URL_PREFIX.length);
      const proxyUrl = `${self.location.origin}/api-proxy${remainingPathAndQuery}`;
      
      console.log(`Service Worker (fetch): Intercepting request to ${requestUrl}`);
      console.log(`Service Worker (fetch): Proxying to ${proxyUrl}`);
      
      // WORKAROUND for iOS/WebKit: Buffer the request body to prevent issues with streaming.
      const body = await event.request.arrayBuffer();

      const proxyRequest = new Request(proxyUrl, {
        method: event.request.method,
        headers: event.request.headers,
        body: body,
      });

      return await fetch(proxyRequest);
      
    } catch (error) {
      console.error(`Service Worker (fetch): Error proxying request to ${requestUrl}.`, error);
      return new Response(
        JSON.stringify({ error: 'Proxying failed', details: error.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  })());
});
