
import { MarkdownPreviewer } from '@/components/study/markdown-previewer';

export default function MarkdownPreviewerPage() {
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Markdown to HTML Previewer
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Write Markdown on the left and see the rendered HTML on the right.
        </p>
      </div>

      <MarkdownPreviewer />
    </div>
  );
}
