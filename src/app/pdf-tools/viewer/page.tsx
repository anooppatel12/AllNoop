import { PdfViewer } from '@/components/pdf/pdf-viewer';

export default function ViewPdfPage() {
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          PDF Viewer
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          View a PDF online without downloading it. Your file stays on your device.
        </p>
      </div>

      <PdfViewer />
    </div>
  );
}
