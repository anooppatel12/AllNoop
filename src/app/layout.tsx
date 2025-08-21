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
  SidebarRail,
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
        <link href="https://fonts.googleapis.com/css2?family=Homemade+Apple&display=swap" rel="stylesheet" />

      </head>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <div className="relative flex min-h-screen">
              <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground">
                <SidebarRail />
                <SidebarHeader>
                  <Button variant="ghost" className="flex w-full items-center justify-center gap-2 px-2 text-lg font-semibold group-data-[collapsible=icon]:justify-center">
                    <Shapes className="h-6 w-6 shrink-0 text-primary" />
                    <span className="font-headline group-data-[collapsible=icon]:hidden">OmniTool</span>
                  </Button>
                </SidebarHeader>
                <SidebarContent>
                  <MainNav />
                </SidebarContent>
                <SidebarFooter className="p-4 text-sm">
                  <div className="flex flex-col items-center gap-2 group-data-[collapsible=icon]:items-center">
                     <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                      <FileQuestion className="h-4 w-4 shrink-0" /> <span className="group-data-[collapsible=icon]:hidden">About</span>
                    </Link>
                     <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                      <Lock className="h-4 w-4 shrink-0" /> <span className="group-data-[collapsible=icon]:hidden">Privacy Policy</span>
                    </Link>
                     <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                      <Shield className="h-4 w-4 shrink-0" /> <span className="group-data-[collapsible=icon]:hidden">Terms & Conditions</span>
                    </Link>
                  </div>
                </SidebarFooter>
              </Sidebar>
              <div className="flex-1 flex flex-col h-screen">
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
