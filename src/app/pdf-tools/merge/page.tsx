import { PdfMerger } from '@/components/pdf/pdf-merger';

export default function MergePdfPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Merge PDF
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Combine multiple PDF files into one single document.
        </p>
      </div>

      <PdfMerger />
    </div>
  );
}
