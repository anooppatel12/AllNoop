'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
         <SidebarTrigger />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
