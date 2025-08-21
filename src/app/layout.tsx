import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/main-nav';
import { Shapes, FileQuestion, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import { AppHeader } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'OmniTool',
  description: 'An all-in-one toolkit with calculators, PDF and image tools, downloaders, and AI content generators.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <div className="min-h-screen">
              <Sidebar collapsible="offcanvas" className="bg-sidebar text-sidebar-foreground">
                <SidebarHeader>
                  <Button variant="ghost" className="flex w-full items-center justify-start gap-2 px-2 text-lg font-semibold">
                    <Shapes className="h-6 w-6 text-primary" />
                    <span className="font-headline">OmniTool</span>
                  </Button>
                </SidebarHeader>
                <SidebarContent>
                  <MainNav />
                </SidebarContent>
                <SidebarFooter className="p-4 text-sm">
                  <div className="flex flex-col gap-2">
                     <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                      <FileQuestion className="h-4 w-4" /> About
                    </Link>
                     <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                      <Lock className="h-4 w-4" /> Privacy Policy
                    </Link>
                     <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                      <Shield className="h-4 w-4" /> Terms & Conditions
                    </Link>
                  </div>
                </SidebarFooter>
              </Sidebar>
              <SidebarInset>
                <AppHeader />
                <main className="h-[calc(100vh-4rem)] overflow-y-auto">
                  {children}
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
