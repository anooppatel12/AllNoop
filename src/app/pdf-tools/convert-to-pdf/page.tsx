import { PdfFromImageConverter } from '@/components/pdf/pdf-from-image-converter';

export default function ConvertToPdfPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Convert Images to PDF
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Upload JPG, PNG, or other image files to create a single PDF document.
        </p>
      </div>

      <PdfFromImageConverter />
    </div>
  );
}
