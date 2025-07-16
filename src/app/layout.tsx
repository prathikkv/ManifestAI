import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import PWARegistration from "@/components/PWARegistration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ManifestAI - Turn Dreams Into Reality",
  description: "AI-powered manifestation platform for busy professionals. Quick habit tracking, voice journaling, and smart vision boards in 30 seconds.",
  keywords: "manifestation, dreams, goals, AI coaching, vision board, personal development, law of attraction, habit tracker, productivity, mobile app",
  authors: [{ name: "ManifestAI Team" }],
  creator: "ManifestAI",
  publisher: "ManifestAI",
  applicationName: "ManifestAI",
  generator: "Next.js",
  category: "productivity",
  classification: "Productivity & Self-Help",
  
  // PWA Meta Tags
  manifest: "/manifest.json",
  
  // Apple PWA Meta Tags
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ManifestAI",
    startupImage: [
      {
        url: "/icons/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/icons/apple-splash-1668-2388.png", 
        media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/icons/apple-splash-1536-2048.png",
        media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/icons/apple-splash-1284-2778.png",
        media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      },
      {
        url: "/icons/apple-splash-1170-2532.png",
        media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      },
      {
        url: "/icons/apple-splash-1125-2436.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      },
      {
        url: "/icons/apple-splash-828-1792.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/icons/apple-splash-750-1334.png",
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/icons/apple-splash-640-1136.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      }
    ]
  },
  
  // Open Graph for social sharing
  openGraph: {
    type: "website",
    siteName: "ManifestAI",
    title: "ManifestAI - Turn Dreams Into Reality",
    description: "AI-powered manifestation platform for busy professionals. Track habits, create vision boards, and achieve goals in minutes, not hours.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ManifestAI - Manifestation Platform"
      }
    ]
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "ManifestAI - Turn Dreams Into Reality", 
    description: "AI-powered manifestation platform for busy professionals. Track habits, create vision boards, and achieve goals in minutes, not hours.",
    images: ["/twitter-image.png"]
  },
  
  // Additional Meta
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "ManifestAI",
    "application-name": "ManifestAI",
    "msapplication-TileColor": "#3B82F6",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#3B82F6"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3B82F6" },
    { media: "(prefers-color-scheme: dark)", color: "#1E40AF" }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileImage" content="/icons/ms-tile-150x150.png" />
        <meta name="msapplication-square70x70logo" content="/icons/ms-tile-70x70.png" />
        <meta name="msapplication-square150x150logo" content="/icons/ms-tile-150x150.png" />
        <meta name="msapplication-wide310x150logo" content="/icons/ms-tile-310x150.png" />
        <meta name="msapplication-square310x310logo" content="/icons/ms-tile-310x310.png" />
        
        {/* Prevent zoom on input focus for better mobile UX */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <div className="min-h-screen bg-background text-foreground antialiased">
            {children}
          </div>
          
          {/* PWA Service Worker Registration */}
          <PWARegistration />
        </ClerkProvider>
      </body>
    </html>
  );
}