import { PdfSplitter } from '@/components/pdf/pdf-splitter';

export default function ExtractPagesPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Extract Pages
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Create a new PDF from selected pages of another.
        </p>
      </div>

      <PdfSplitter />
    </div>
  );
}
