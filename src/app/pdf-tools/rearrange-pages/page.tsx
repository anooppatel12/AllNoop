
import { PdfRearranger } from '@/components/pdf/pdf-rearranger';

export default function RearrangePagesPage() {
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Rearrange PDF Pages
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Drag and drop the page thumbnails below to change their order.
        </p>
      </div>

      <PdfRearranger />
    </div>
  );
}
