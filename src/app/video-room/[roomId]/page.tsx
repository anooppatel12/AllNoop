
import { VideoRoom } from '@/components/video/video-room';

export default function VideoConferencePage({ params }: { params: { roomId: string } }) {
  return <VideoRoom roomId={params.roomId} />;
}
