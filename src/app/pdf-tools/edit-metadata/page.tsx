
import { PdfMetadataEditor } from '@/components/pdf/pdf-metadata-editor';

export default function EditMetadataPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Edit PDF Metadata
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          View and edit the metadata of your PDF file, such as title, author, and subject.
        </p>
      </div>

      <PdfMetadataEditor />
    </div>
  );
}
