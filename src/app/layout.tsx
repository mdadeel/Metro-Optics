import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "@/components/error-boundary";
import QueryProvider from "@/lib/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Metro Optics - Bangladesh's Premier Optical Shop | Eyeglasses, Sunglasses & Contact Lenses",
  description: "Shop premium eyeglasses, sunglasses, and contact lenses in Bangladesh. Authentic international brands like Ray-Ban, Oakley, Gucci. Free eye testing, home delivery, and 7-day returns.",
  keywords: ["Metro Optics", "optical shop Bangladesh", "eyeglasses Bangladesh", "sunglasses Bangladesh", "contact lenses", "Ray-Ban Bangladesh", "Oakley Bangladesh", "eye test Dhaka", "glasses online Bangladesh"],
  authors: [{ name: "Metro Optics Team" }],
  // icons: {
  //   icon: "/favicon.ico",
  //   apple: "/apple-touch-icon.png",
  // },
  openGraph: {
    title: "Metro Optics - Bangladesh's Premier Optical Shop",
    description: "Shop premium eyewear in Bangladesh. Authentic international brands, free eye testing, and home delivery nationwide.",
    url: "https://metrooptics.com",
    siteName: "Metro Optics",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Metro Optics Premium Eyewear Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metro Optics - Bangladesh's Premier Optical Shop",
    description: "Shop premium eyewear in Bangladesh. Authentic brands, free eye testing, and home delivery.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ErrorBoundary>
          <QueryProvider>
            <CartProvider>
              <FavoritesProvider>
                <AuthProvider>
                  {children}
                  <Toaster />
                </AuthProvider>
              </FavoritesProvider>
            </CartProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
