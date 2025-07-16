'use client';

import { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWARegistration() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show install prompt after user has used the app for a bit
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('pwa-install-dismissed')) {
          setShowInstallPrompt(true);
        }
      }, 30000); // Show after 30 seconds
    };

    // Handle app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
    };

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial online status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstalled]);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('✅ Service Worker registered successfully:', registration.scope);

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify user
              showUpdateNotification();
            }
          });
        }
      });

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60000); // Check every minute

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  };

  const showUpdateNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ManifestAI Update Available', {
        body: 'A new version of ManifestAI is available. Refresh to update.',
        icon: '/icons/icon-192x192.png',
        tag: 'update-available'
      });
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted PWA install');
      } else {
        console.log('❌ User dismissed PWA install');
        localStorage.setItem('pwa-install-dismissed', 'true');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('PWA install error:', error);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        
        // Show welcome notification
        new Notification('Welcome to ManifestAI! 🌟', {
          body: 'You\'ll now receive helpful reminders to stay on track with your goals.',
          icon: '/icons/icon-192x192.png',
          tag: 'welcome'
        });
      }
    }
  };

  // Auto-request notification permission after user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      requestNotificationPermission();
      document.removeEventListener('click', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    return () => document.removeEventListener('click', handleUserInteraction);
  }, []);

  return (
    <>
      {/* PWA Install Prompt */}
      {showInstallPrompt && deferredPrompt && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  Install ManifestAI
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Add to your home screen for quick access and offline use!
                </p>
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={handleInstallClick}
                    className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Install</span>
                  </button>
                  <button
                    onClick={handleDismissInstall}
                    className="text-gray-500 text-xs hover:text-gray-700 transition-colors"
                  >
                    Not now
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismissInstall}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white text-center py-2 text-sm font-medium">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>You're offline - Changes will sync when connected</span>
          </div>
        </div>
      )}

      {/* Online Status Recovery */}
      {isOnline && typeof window !== 'undefined' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle connection recovery
              window.addEventListener('online', function() {
                // Trigger data sync
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                  navigator.serviceWorker.controller.postMessage({
                    type: 'SYNC_DATA'
                  });
                }
                
                // Show brief success message
                const toast = document.createElement('div');
                toast.innerHTML = '✅ Back online - Syncing data...';
                toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#10B981;color:white;padding:12px 16px;border-radius:8px;font-size:14px;z-index:1000;box-shadow:0 4px 12px rgba(0,0,0,0.15)';
                document.body.appendChild(toast);
                
                setTimeout(() => {
                  toast.remove();
                }, 3000);
              });
            `
          }}
        />
      )}
    </>
  );
}