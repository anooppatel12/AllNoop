
import { ChatLobby } from '@/components/chat/chat-lobby';

export default function ChatPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Secure Peer-to-Peer Chat
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Create a private chat room and share the link with a friend to start a secure, end-to-end encrypted conversation directly in your browser.
        </p>
      </div>

      <ChatLobby />
    </div>
  );
}
