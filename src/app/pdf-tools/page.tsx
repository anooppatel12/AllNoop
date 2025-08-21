import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { View, Combine, Split, Minimize2, FileUp, FileDown, Scissors, RotateCw } from 'lucide-react';

const pdfTools = [
    {
        name: 'PDF Viewer',
        description: 'View a PDF online without downloading it.',
        icon: View,
        href: '#',
    },
    {
        name: 'Merge PDF',
        description: 'Combine multiple PDF files into one single document.',
        icon: Combine,
        href: '#',
    },
    {
        name: 'Split PDF',
        description: 'Divide a large PDF into multiple smaller files.',
        icon: Split,
        href: '#',
    },
    {
        name: 'Compress PDF',
        description: 'Reduce the file size of your PDF documents.',
        icon: Minimize2,
        href: '#',
    },
    {
        name: 'Convert to PDF',
        description: 'Convert Word, Excel, PowerPoint, or images to PDF.',
        icon: FileUp,
        href: '#',
    },
    {
        name: 'Convert from PDF',
        description: 'Convert PDFs to Word, Excel, PowerPoint, or images.',
        icon: FileDown,
        href: '#',
    },
    {
        name: 'Extract Pages',
        description: 'Create a new PDF from selected pages of another.',
        icon: Scissors,
        href: '#',
    },
    {
        name: 'Rotate PDF',
        description: 'Rotate single or all pages in your PDF document.',
        icon: RotateCw,
        href: '#',
    },
];

export default function PdfToolsPage() {
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          PDF Tools
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          A suite of tools to help you manage and manipulate your PDF files with ease.
        </p>
      </div>

       <div className="mt-12">
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pdfTools.map((tool) => (
                <Link href={tool.href} key={tool.name} className="group">
                <Card className="h-full transition-all group-hover:border-primary group-hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <tool.icon className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>{tool.name}</CardTitle>
                            <CardDescription className="mt-1">{tool.description}</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
                </Link>
            ))}
            </div>
      </div>
    </div>
  );
}
