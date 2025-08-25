
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
  Users,
  Video,
  VenetianMask,
  Keyboard,
  Quote,
  Gamepad2,
  QrCode,
  MessageCircle,
  Lock,
  Baseline,
  BookOpenCheck,
  Search,
  VideoIcon,
  ShieldCheck,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { DownloaderLink } from '@/features/downloader/DownloaderLink';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/hashtag-generator', label: 'Hashtag Generator', icon: Hash },
  { href: '/tools/keyword-analyzer', label: 'Keyword Analyzer', icon: Search },
  { href: '/tools/plagiarism-checker', label: 'Plagiarism Checker', icon: ShieldCheck },
  { href: '/calculators', label: 'Calculators', icon: Calculator },
  { href: '/pdf-tools', label: 'PDF Tools', icon: FileText },
  { href: '/image-editor', label: 'Image Editor', icon: ImageIcon },
  { href: '/tools/text-formatter', label: 'Text Formatter', icon: Baseline },
  { href: '/tools/qrcode', label: 'QR Code Tools', icon: QrCode },
  { href: '/tools/password-generator', label: 'Password Generator', icon: Lock },
  {
    href: '/study',
    label: 'Study / Work',
    icon: BookOpenCheck,
  },
  { href: '/fun-tools/meme-generator', label: 'Meme Generator', icon: VenetianMask },
  { href: '/fun-tools/fake-message-generator', label: 'Fake Message Generator', icon: MessageCircle },
  { href: '/fun-tools/typing-speed-test', label: 'Typing Speed Test', icon: Keyboard },
  { href: '/fun-tools/random-joke-quote-generator', label: 'Joke/Quote Generator', icon: Quote },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/chat', label: 'P2P Chat', icon: Users },
  { href: '/video-room', label: 'Video Room', icon: VideoIcon },
  { href: '/contact', label: 'Contact', icon: MessageSquare },
];

export function MainNav() {
  const pathname = usePathname();
  const isDownloaderEnabled = process.env.NEXT_PUBLIC_ENABLE_VIDEO_DOWNLOADER === 'true';

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.label}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/')}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
       {isDownloaderEnabled && (
         <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/tools/downloader'}
              tooltip="Video Downloader"
            >
              <Link href="/tools/downloader">
                <Video />
                <span>Video Downloader</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
       )}
    </SidebarMenu>
  );
}
