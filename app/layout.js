import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PHProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stylebot - Your Personal Men's Stylist",
  description: "AI-powered outfit recommendations for men. Get styled for any occasion in seconds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <PHProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
          <footer className="w-full text-center py-8 px-6 text-xs text-gray-400 border-t border-gray-100 mt-12">
            <p className="mb-2">
              Stylebot uses AI to suggest outfits. Suggestions are for inspiration only and do not constitute professional styling advice.
            </p>
            <p className="mb-2">
              This site contains affiliate links. We may earn a small commission if you purchase through our links, at no extra cost to you.
            </p>
            <p>
              <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>
              {' · '}
              <a href="/terms" className="underline hover:text-gray-600">Terms of Use</a>
            </p>
          </footer>
        </body>
      </PHProvider>
    </html>
  );
}