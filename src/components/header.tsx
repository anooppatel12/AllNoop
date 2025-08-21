'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';

export function AppHeader() {
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end">
      {isClient && isMobile && (
        <div className="sm:hidden">
          <SidebarTrigger />
        </div>
      )}
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
