
import { ChatRoom } from '@/components/chat/chat-room';

export default function ChatRoomPage({ params }: { params: { roomId: string } }) {
  return <ChatRoom roomId={params.roomId} />;
}
