// Cross-Platform Testing Script for ManifestAI
// Run this in browser console to verify platform compatibility

console.log('🌐 Cross-Platform Compatibility Test');
console.log('===================================');

// 1. Viewport and Layout Tests
function testViewport() {
  console.log('\n📱 Viewport Tests:');
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = window.devicePixelRatio || 1;
  
  console.log(`Screen: ${width}x${height} (DPR: ${ratio})`);
  
  if (width < 768) {
    console.log('✅ Mobile layout should be active');
  } else if (width < 1024) {
    console.log('✅ Tablet layout should be active');
  } else {
    console.log('✅ Desktop layout should be active');
  }
  
  // Test responsive breakpoints
  const mobileBreakpoint = window.matchMedia('(max-width: 767px)');
  const tabletBreakpoint = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
  const desktopBreakpoint = window.matchMedia('(min-width: 1024px)');
  
  console.log('Breakpoint matches:');
  console.log(`  Mobile: ${mobileBreakpoint.matches}`);
  console.log(`  Tablet: ${tabletBreakpoint.matches}`);
  console.log(`  Desktop: ${desktopBreakpoint.matches}`);
}

// 2. Touch and Input Tests
function testInputCapabilities() {
  console.log('\n👆 Input Capability Tests:');
  
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hasPointer = 'onpointerdown' in window;
  const hasMouse = window.matchMedia('(hover: hover)').matches;
  
  console.log(`Touch support: ${hasTouch ? '✅' : '❌'}`);
  console.log(`Pointer events: ${hasPointer ? '✅' : '❌'}`);
  console.log(`Mouse hover: ${hasMouse ? '✅' : '❌'}`);
  
  // Test touch target sizes
  const buttons = document.querySelectorAll('button');
  console.log(`\nTouch target test (${buttons.length} buttons found):`);
  
  buttons.forEach((button, index) => {
    const rect = button.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const isAccessible = size >= 44; // Apple's minimum
    
    if (index < 5) { // Only log first 5 to avoid spam
      console.log(`  Button ${index + 1}: ${size.toFixed(0)}px ${isAccessible ? '✅' : '❌'}`);
    }
  });
}

// 3. PWA Feature Tests
function testPWAFeatures() {
  console.log('\n📱 PWA Feature Tests:');
  
  // Manifest
  const manifest = document.querySelector('link[rel="manifest"]');
  console.log(`Manifest: ${manifest ? '✅ Found' : '❌ Missing'}`);
  
  // Service Worker
  const swSupported = 'serviceWorker' in navigator;
  console.log(`Service Worker API: ${swSupported ? '✅ Supported' : '❌ Not supported'}`);
  
  // Icons
  const icons = document.querySelectorAll('link[rel*="icon"]');
  console.log(`App icons: ${icons.length > 0 ? '✅ Found' : '❌ Missing'} (${icons.length} total)`);
  
  // Install prompt capability
  const installPromptSupported = 'onbeforeinstallprompt' in window;
  console.log(`Install prompt: ${installPromptSupported ? '✅ Supported' : '❌ Not supported'}`);
  
  // Standalone mode detection
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  console.log(`Running standalone: ${isStandalone ? '✅ Yes' : '❌ No'}`);
}

// 4. Performance Tests
function testPerformance() {
  console.log('\n⚡ Performance Tests:');
  
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const domReady = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      
      console.log(`Page load time: ${loadTime.toFixed(0)}ms`);
      console.log(`DOM ready time: ${domReady.toFixed(0)}ms`);
      
      // Core Web Vitals approximation
      console.log('Core Web Vitals:');
      console.log(`  Load time: ${loadTime < 2500 ? '✅' : '❌'} (${loadTime.toFixed(0)}ms)`);
    }
    
    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = performance.memory;
      const memoryMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
      console.log(`Memory usage: ${memoryMB}MB`);
    }
  }
}

// 5. Feature Detection Tests
function testFeatureSupport() {
  console.log('\n🔧 Feature Support Tests:');
  
  const features = {
    'CSS Grid': 'grid' in document.createElement('div').style,
    'CSS Flexbox': 'flex' in document.createElement('div').style,
    'CSS Custom Properties': window.CSS && CSS.supports('color', 'var(--test)'),
    'Local Storage': 'localStorage' in window,
    'Session Storage': 'sessionStorage' in window,
    'Geolocation': 'geolocation' in navigator,
    'Push Notifications': 'PushManager' in window,
    'Web Workers': 'Worker' in window,
    'WebRTC': 'RTCPeerConnection' in window
  };
  
  Object.entries(features).forEach(([feature, supported]) => {
    console.log(`${feature}: ${supported ? '✅' : '❌'}`);
  });
}

// 6. Browser Detection
function testBrowserInfo() {
  console.log('\n🌐 Browser Information:');
  
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let platform = 'Unknown';
  
  // Detect browser
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  
  // Detect platform
  if (ua.includes('iPhone') || ua.includes('iPad')) platform = 'iOS';
  else if (ua.includes('Android')) platform = 'Android';
  else if (ua.includes('Mac')) platform = 'macOS';
  else if (ua.includes('Windows')) platform = 'Windows';
  else if (ua.includes('Linux')) platform = 'Linux';
  
  console.log(`Browser: ${browser}`);
  console.log(`Platform: ${platform}`);
  console.log(`User Agent: ${ua}`);
}

// Run all tests
function runAllTests() {
  console.clear();
  testBrowserInfo();
  testViewport();
  testInputCapabilities();
  testPWAFeatures();
  testPerformance();
  testFeatureSupport();
  
  console.log('\n🎯 Test Complete!');
  console.log('Copy results for compatibility documentation.');
}

// Auto-run tests
runAllTests();

// Export for manual use
window.crossPlatformTest = {
  runAll: runAllTests,
  viewport: testViewport,
  input: testInputCapabilities,
  pwa: testPWAFeatures,
  performance: testPerformance,
  features: testFeatureSupport,
  browser: testBrowserInfo
};