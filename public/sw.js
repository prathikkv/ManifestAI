// ManifestAI Service Worker - Offline First Strategy
// Enables app to work without internet for core features

const CACHE_NAME = 'manifestai-v1.0.0';
const OFFLINE_URL = '/offline';

// Core files that should always be cached
const CORE_CACHE_FILES = [
  '/',
  '/dashboard',
  '/habits',
  '/affirmations',
  '/journal',
  '/offline',
  '/manifest.json',
  // Core scripts and styles will be added automatically by Next.js
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  '/api/habits',
  '/api/affirmations',
  '/api/user',
  '/api/dreams'
];

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('ManifestAI Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching core files...');
        return cache.addAll(CORE_CACHE_FILES);
      })
      .then(() => {
        // Take control immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('ManifestAI Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - network first for API, cache first for static files
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(handleStaticRequest(request));
});

// Network-first strategy for API requests
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, cache the response
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache for:', request.url);
    
    // Fall back to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline data if available
    return createOfflineApiResponse(request);
  }
}

// Handle navigation requests with fallback to offline page
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Fall back to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match(OFFLINE_URL);
  }
}

// Cache-first strategy for static assets
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Failed to load:', request.url);
    
    // Return a fallback for images
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="#999">Image Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Create offline API responses for core functionality
function createOfflineApiResponse(request) {
  const url = new URL(request.url);
  
  // Return cached habits data
  if (url.pathname.includes('/habits')) {
    return new Response(JSON.stringify({
      success: false,
      offline: true,
      message: 'You are offline. Data will sync when connected.',
      data: []
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }
  
  // Return cached affirmations
  if (url.pathname.includes('/affirmations')) {
    const offlineAffirmations = [
      "I am capable of achieving my goals, even offline.",
      "My potential is unlimited, with or without internet.",
      "I stay focused and productive in any situation.",
      "I am resilient and adaptable to any circumstance."
    ];
    
    return new Response(JSON.stringify({
      success: true,
      offline: true,
      data: {
        text: offlineAffirmations[Math.floor(Math.random() * offlineAffirmations.length)],
        category: 'offline-motivation'
      }
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }
  
  // Default offline response
  return new Response(JSON.stringify({
    success: false,
    offline: true,
    message: 'This feature requires an internet connection.'
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 503
  });
}

// Background sync for queued actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'habit-sync') {
    event.waitUntil(syncHabits());
  }
  
  if (event.tag === 'journal-sync') {
    event.waitUntil(syncJournalEntries());
  }
});

// Sync queued habit completions
async function syncHabits() {
  try {
    // Get queued habit data from IndexedDB
    const queuedHabits = await getQueuedData('habits');
    
    for (const habit of queuedHabits) {
      try {
        await fetch('/api/habits/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(habit)
        });
        
        // Remove from queue after successful sync
        await removeFromQueue('habits', habit.id);
      } catch (error) {
        console.log('Failed to sync habit:', habit.id);
      }
    }
  } catch (error) {
    console.log('Habit sync failed:', error);
  }
}

// Sync queued journal entries
async function syncJournalEntries() {
  try {
    const queuedEntries = await getQueuedData('journal');
    
    for (const entry of queuedEntries) {
      try {
        await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        });
        
        await removeFromQueue('journal', entry.id);
      } catch (error) {
        console.log('Failed to sync journal entry:', entry.id);
      }
    }
  } catch (error) {
    console.log('Journal sync failed:', error);
  }
}

// Helper functions for IndexedDB queue management
async function getQueuedData(type) {
  // Simplified - in real implementation, use IndexedDB
  return [];
}

async function removeFromQueue(type, id) {
  // Simplified - in real implementation, remove from IndexedDB
  console.log(`Removed ${type} ${id} from sync queue`);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge.png',
    vibrate: [200, 100, 200],
    data: data.data,
    actions: data.actions || [
      {
        action: 'complete',
        title: '✅ Mark Complete',
        icon: '/icons/check.png'
      },
      {
        action: 'snooze',
        title: '⏰ Remind Later',
        icon: '/icons/snooze.png'
      }
    ],
    requireInteraction: true,
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();
  
  let targetUrl = '/dashboard';
  
  if (event.action === 'complete') {
    // Handle habit completion
    targetUrl = `/habits/quick?complete=${event.notification.data?.habitId}`;
  } else if (event.action === 'snooze') {
    // Reschedule notification
    scheduleSnoozeNotification(event.notification.data);
    return;
  } else if (event.notification.data?.url) {
    targetUrl = event.notification.data.url;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clients) => {
      // Check if there's already a window open
      for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
          client.focus();
          client.navigate(targetUrl);
          return;
        }
      }
      
      // Open new window
      return self.clients.openWindow(targetUrl);
    })
  );
});

// Schedule snooze notification
function scheduleSnoozeNotification(data) {
  // In a real implementation, this would use the Notification API
  // or communicate with the main app to reschedule
  console.log('Snoozing notification for:', data);
}