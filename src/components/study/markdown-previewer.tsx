
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { marked } from 'marked';

const defaultMarkdown = `
# Welcome to the Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`javascript
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
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
