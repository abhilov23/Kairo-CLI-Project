import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SessionProvider from "@/components/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kairo.dev"),
  title: {
    default: "Kairo — Your AI teammate in the terminal",
    template: "%s — Kairo",
  },
  description:
    "Kairo brings AI-powered code review, debugging, and architecture to your terminal. No tabs. No context switching. Just you and your AI teammate.",
  keywords: [
    "AI CLI", "developer tools", "terminal AI", "command line",
    "kairo", "AI-powered terminal", "code review", "AI coding assistant",
  ],
  openGraph: {
    title: "Kairo — Your AI teammate in the terminal",
    description:
      "Kairo brings AI-powered code review, debugging, and architecture to your terminal. No tabs. No context switching. Just you and your AI teammate.",
    type: "website",
    siteName: "Kairo",
    images: "/opengraph-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kairo — Your AI teammate in the terminal",
    description:
      "Kairo brings AI-powered code review, debugging, and architecture to your terminal. No tabs. No context switching. Just you and your AI teammate.",
    images: "/opengraph-image.png",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('kairo-theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  }
                  document.documentElement.className = (
                    '${geistSans.variable} ${geistMono.variable} ' +
                    theme + ' h-full antialiased'
                  );
                  document.documentElement.style.colorScheme = theme;
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
