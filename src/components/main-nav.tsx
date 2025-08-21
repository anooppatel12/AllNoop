
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  FileText,
  Hash,
  Home,
  Image as ImageIcon,
  MessageSquare,
  Video,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const links = [
  { href: '/', label: 'Home', icon: Home },
  {
    href: '/hashtag-generator',
    label: 'Hashtag Generator',
    icon: Hash,
  },
  { href: '#', label: 'Calculators', icon: Calculator },
  { href: '#', label: 'PDF Tools', icon: FileText },
  { href: '#', label: 'Image Editor', icon: ImageIcon },
  { href: '#', label: 'Video Downloader', icon: Video },
  { href: '#', label: 'Contact', icon: MessageSquare },
];

export function MainNav() {
  const pathname = usePathname();

  // Normalize pathname to match href
  const currentPath = pathname === '/' ? '/hashtag-generator' : pathname;

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.label}>
          <SidebarMenuButton
            asChild
            isActive={currentPath === link.href || (pathname === '/' && link.href === '/hashtag-generator')}
            tooltip={link.label}
          >
            <Link href={link.href === '/hashtag-generator' ? '/' : link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
