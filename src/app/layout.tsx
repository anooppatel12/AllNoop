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
import { Shapes, Info, Lock, FileText } from 'lucide-react';
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
            <div className="flex min-h-screen w-full flex-col bg-background md:flex-row">
              <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground">
                <SidebarHeader>
                  <Button variant="ghost" asChild className="flex w-full items-center justify-center gap-2 px-2 text-lg font-semibold group-data-[collapsible=icon]:justify-center">
                    <Link href="/">
                      <Shapes className="h-6 w-6 shrink-0 text-primary" />
                      <span className="font-headline group-data-[collapsible=icon]:hidden">OmniTool</span>
                    </Link>
                  </Button>
                </SidebarHeader>
                <SidebarContent>
                  <MainNav />
                </SidebarContent>
                <SidebarFooter>
                   <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="About">
                        <Link href="#">
                            <Info />
                            <span className="group-data-[collapsible=icon]:hidden">About</span>
                        </Link>
                      </SidebarMenuButton>
                   </SidebarMenuItem>
                   <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Privacy Policy">
                        <Link href="#">
                            <Lock />
                            <span className="group-data-[collapsible=icon]:hidden">Privacy Policy</span>
                        </Link>
                      </SidebarMenuButton>
                   </SidebarMenuItem>
                   <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Terms & Conditions">
                        <Link href="#">
                            <FileText />
                            <span className="group-data-[collapsible=icon]:hidden">Terms & Conditions</span>
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
