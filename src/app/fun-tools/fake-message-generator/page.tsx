
import { FakeMessageGenerator } from '@/components/fun-tools/fake-message-generator';

export default function FakeMessageGeneratorPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Fake Message Generator
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Create realistic-looking (but fake!) SMS and email conversations for fun, social media, or pranks.
        </p>
      </div>

      <FakeMessageGenerator />
    </div>
  );
}
