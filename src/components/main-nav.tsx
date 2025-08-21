
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
  { href: '/', label: 'Hashtag Generator', icon: Hash },
  { href: '/calculators', label: 'Calculators', icon: Calculator },
  { href: '/pdf-tools', label: 'PDF Tools', icon: FileText },
  { href: '/image-editor', label: 'Image Editor', icon: ImageIcon },
  { href: '/video-downloader', label: 'Video Downloader', icon: Video },
  { href: '/contact', label: 'Contact', icon: MessageSquare },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.label}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
