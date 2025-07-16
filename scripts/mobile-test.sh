#!/bin/bash

# Mobile Testing Helper Script
echo "🚀 ManifestAI Mobile Testing Setup"
echo "=================================="

# Get local IP address
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

if [ -z "$LOCAL_IP" ]; then
    echo "❌ Could not detect local IP address"
    echo "Manual check: Run 'ifconfig' and look for your WiFi adapter IP"
    exit 1
fi

echo "📱 Your mobile testing URL:"
echo "http://$LOCAL_IP:3333"
echo ""
echo "📋 Quick Testing Steps:"
echo "1. Ensure your phone is on the same WiFi network"
echo "2. Open the URL above in your mobile browser"
echo "3. For PWA installation:"
echo "   - iOS: Safari → Share → Add to Home Screen"
echo "   - Android: Chrome → Menu → Add to Home Screen"
echo ""
echo "🔍 Troubleshooting:"
echo "- If connection fails, check firewall settings"
echo "- Make sure dev server is running: npm run dev:mobile"
echo "- Try different network adapter if available"
echo ""

# Check if development server is running
if lsof -ti:3333 > /dev/null 2>&1; then
    echo "✅ Development server is running on port 3333"
else
    echo "⚠️  Development server not detected on port 3333"
    echo "Run: npm run dev:mobile"
fi

echo ""
echo "🎯 Ready for mobile testing!"