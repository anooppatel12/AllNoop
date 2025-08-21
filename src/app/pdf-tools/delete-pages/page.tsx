
import { PdfDeleter } from '@/components/pdf/pdf-deleter';

export default function DeletePagesPage() {
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Delete PDF Pages
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Select and remove one or more pages from your PDF document.
        </p>
      </div>

      <PdfDeleter />
    </div>
  );
}
