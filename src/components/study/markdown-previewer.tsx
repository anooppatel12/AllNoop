'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { marked } from 'marked';
import { Button } from '../ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const defaultMarkdown = `
# Welcome to the OmniTool Markdown Previewer!

## Your All-in-One Digital Toolkit

This previewer helps you write and visualize your Markdown content in real-time.

### Key Features of OmniTool:

- **Calculators**: A wide range of calculators for every need.
- **PDF Tools**: Merge, split, compress, and edit PDFs.
- **Image Editor**: Edit images with ease.
- **AI Content Generation**: Get creative with AI-powered tools.

Here's an example of a code block:

\`\`\`jsx
function OmniToolComponent() {
  return (
    <div>
      <h1>Welcome to OmniTool!</h1>
    </div>
  );
}
\`\`\`

You can make text **bold**, _italic_, or **_both_**.

> OmniTool is designed to be your go-to resource for a variety of digital tasks.

Check out our features:
1.  Hashtag Generator
2.  Calculators
3.  PDF & Image Tools

[Visit OmniTool's Homepage](/)

![OmniTool Logo](https://placehold.co/150x50.png?text=OmniTool)
`;


export function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const { toast } = useToast();

  const rawHtml = useMemo(() => {
    return marked(markdown, { 
      gfm: true,
      breaks: true,
    });
  }, [markdown]);

  const handleCopyHtml = () => {
      navigator.clipboard.writeText(rawHtml)
        .then(() => {
            toast({ title: 'HTML copied to clipboard!' });
        })
        .catch(err => {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to copy HTML to clipboard.' });
        });
  };

  return (
    <Card className="mt-8">
      <CardContent className="p-0 md:grid md:grid-cols-2">
        <div className="p-4">
            <CardHeader className="p-2">
                <CardTitle>Markdown</CardTitle>
                <CardDescription>Enter your Markdown text here.</CardDescription>
            </CardHeader>
            <Textarea
                id="editor"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="h-[600px] font-mono"
            />
        </div>
        <div className="p-4 border-t md:border-l md:border-t-0">
             <CardHeader className="flex flex-row items-center justify-between p-2">
                <div>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>See the rendered HTML output.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={handleCopyHtml}>
                    <Copy className="h-5 w-5" />
                    <span className="sr-only">Copy HTML</span>
                </Button>
            </CardHeader>
            <div
                id="preview"
                dangerouslySetInnerHTML={{ __html: rawHtml }}
                className="prose dark:prose-invert h-[600px] w-full overflow-auto rounded-md border bg-muted p-4"
            />
        </div>
      </CardContent>
    </Card>
  );
}
