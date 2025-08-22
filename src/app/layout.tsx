
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/main-nav';
import { Info, Lock, FileText } from 'lucide-react';
import Link from 'next/link';
import { AppHeader } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { CustomCursor } from '@/components/ui/custom-cursor';
import { Logo } from '@/components/ui/logo';
import { Inter, Space_Grotesk, Homemade_Apple } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
})

const homemadeApple = Homemade_Apple({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-homemade-apple',
})


const defaultUrl = 'https://allnoop.com'; // Replace with your actual domain

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: 'AllNoop: Free Online Tools for Every Need',
    template: '%s | AllNoop',
  },
  description: 'Your all-in-one toolkit with free online calculators, PDF and image editors, password generators, AI content tools, and much more. AllNoop makes your digital life easier.',
  keywords: ['online tools', 'free tools', 'calculator', 'pdf editor', 'image editor', 'password generator', 'qr code generator', 'Allnoop', 'allnoop.com'],
  openGraph: {
    title: 'AllNoop: Free Online Tools for Every Need',
    description: 'The ultimate suite of free online utilities. Calculators, PDF tools, image editing, AI generators, and more, all in one place.',
    url: defaultUrl,
    siteName: 'AllNoop',
    images: [
      {
        url: `${defaultUrl}/og-image.png`, // Update with your actual OG image path
        width: 1200,
        height: 630,
        alt: 'AllNoop - Free Online Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AllNoop: Free Online Tools for Every Need',
    description: 'Discover a powerful collection of free online tools on AllNoop. From calculators to creative AI, we have everything you need.',
    // creator: '@yourtwitterhandle', // Add your Twitter handle
    images: [`${defaultUrl}/og-image.png`], // Update with your actual OG image path
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: defaultUrl,
  name: 'AllNoop',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${defaultUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={cn("font-body antialiased", inter.variable, spaceGrotesk.variable, homemadeApple.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CustomCursor />
          <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col bg-background md:flex-row">
              <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground">
                <SidebarHeader>
                  <Button variant="ghost" asChild className="flex w-full items-center justify-center gap-2 px-2 text-lg font-semibold group-data-[collapsible=icon]:justify-center">
                    <Link href="/">
                      <Logo className="h-6 w-6 shrink-0 text-primary" />
                      <span className="font-headline group-data-[collapsible=icon]:hidden">AllNoop</span>
                    </Link>
                  </Button>
                </SidebarHeader>
                <SidebarContent>
                  <MainNav />
                </SidebarContent>
                <SidebarFooter>
                   <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="About">
                        <Link href="/about">
                            <Info />
                            <span className="group-data-[collapsible=icon]:hidden">About</span>
                        </Link>
                      </SidebarMenuButton>
                   </SidebarMenuItem>
                   <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Privacy Policy">
                        <Link href="/privacy-policy">
                            <Lock />
                            <span className="group-data-[collapsible=icon]:hidden">Privacy Policy</span>
                        </Link>
                      </SidebarMenuButton>
                   </SidebarMenuItem>
                   <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Terms &amp; Conditions">
                        <Link href="/terms-and-conditions">
                            <FileText />
                            <span className="group-data-[collapsible=icon]:hidden">Terms &amp; Conditions</span>
                        </Link>
                      </SidebarMenuButton>
                   </SidebarMenuItem>
                </SidebarFooter>
              </Sidebar>
              <div className="flex flex-1 flex-col h-screen max-h-screen">
                  <AppHeader />
                  <main className="flex-1 overflow-y-auto">
                    {children}
                  </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
