
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { marked } from 'marked';

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

  const getHtml = () => {
    const rawMarkup = marked(markdown, { 
      gfm: true,
      breaks: true,
    });
    return { __html: rawMarkup };
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
             <CardHeader className="p-2">
                <CardTitle>Preview</CardTitle>
                <CardDescription>See the rendered HTML output.</CardDescription>
            </CardHeader>
            <div
                id="preview"
                dangerouslySetInnerHTML={getHtml()}
                className="prose dark:prose-invert h-[600px] w-full overflow-auto rounded-md border bg-muted p-4"
            />
        </div>
      </CardContent>
    </Card>
  );
}

// Add this to your globals.css or a relevant stylesheet
/*
.prose {
  max-width: none;
}
.prose img {
  max-width: 100%;
}
.prose pre {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
}
.dark .prose pre {
  background-color: #2d2d2d;
}
*/
