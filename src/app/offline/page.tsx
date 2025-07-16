'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Heart, Zap } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Check initial connection status
    setIsOnline(navigator.onLine);

    // Listen for connection changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    
    try {
      // Try to reload the page
      window.location.reload();
    } catch (error) {
      console.log('Retry failed:', error);
    }
  };

  const offlineAffirmations = [
    "I am productive and focused, even offline.",
    "My goals don't depend on wifi connection.",
    "I have everything I need within me right now.",
    "This moment of disconnection brings inner connection.",
    "I use this time to reflect and plan my next moves."
  ];

  const randomAffirmation = offlineAffirmations[Math.floor(Math.random() * offlineAffirmations.length)];

  if (isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-4">You're Back Online!</h1>
          <p className="text-green-600 mb-6">
            Your connection has been restored. Redirecting you back to your dashboard...
          </p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-8">
        {/* Offline Icon */}
        <div className="relative">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-2">
            <WifiOff className="w-10 h-10 text-slate-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full animate-pulse" />
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">You're Offline</h1>
          <p className="text-slate-600">
            No worries! ManifestAI works offline too. Your progress is always with you.
          </p>
        </div>

        {/* Offline Features */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center justify-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Available Offline
          </h3>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              View your existing habits and goals
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              Log habit completions (syncs when online)
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              Read saved affirmations and quotes
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              Write in your journal (saves locally)
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              View your vision boards
            </div>
          </div>
        </div>

        {/* Offline Affirmation */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 mr-2" />
            <span className="font-semibold">Offline Affirmation</span>
          </div>
          <p className="italic text-center leading-relaxed">
            "{randomAffirmation}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            disabled={retryCount >= 3}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${retryCount > 0 ? 'animate-spin' : ''}`} />
            {retryCount >= 3 ? 'Check Your Connection' : 'Try Again'}
          </button>
          
          <button
            onClick={() => window.location.href = '/habits'}
            className="w-full bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Continue Offline
          </button>
        </div>

        {/* Connection Tips */}
        <div className="text-xs text-slate-500 space-y-1">
          <p>💡 Tip: Your offline actions will sync automatically when you reconnect</p>
          <p>📱 Add ManifestAI to your home screen for the best offline experience</p>
        </div>
      </div>
    </div>
  );
}