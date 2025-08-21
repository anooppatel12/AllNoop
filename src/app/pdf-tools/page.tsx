
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { View, Combine, Split, Minimize2, FileUp, FileDown, Scissors, RotateCw, ScanText, FileImage, Stamp, ListOrdered, Layers, Move, FileMinus2, Lock, Unlock, FileText as FileTextIcon, Edit, GitCompareArrows } from 'lucide-react';

const pdfTools = [
    {
        name: 'PDF Viewer',
        description: 'View a PDF online without downloading it.',
        icon: View,
        href: '/pdf-tools/viewer',
    },
     {
        name: 'PDF Editor',
        description: 'Add text, shapes, signatures, and highlights to a PDF.',
        icon: Edit,
        href: '/pdf-tools/edit',
    },
    {
        name: 'Merge PDF',
        description: 'Combine multiple PDF files into one single document.',
        icon: Combine,
        href: '/pdf-tools/merge',
    },
    {
        name: 'Split PDF',
        description: 'Divide a large PDF into multiple smaller files.',
        icon: Split,
        href: '/pdf-tools/split',
    },
    {
        name: 'Compress PDF',
        description: 'Reduce the file size of your PDF documents.',
        icon: Minimize2,
        href: '/pdf-tools/compress',
    },
    {
        name: 'Images to PDF',
        description: 'Convert JPG, PNG, and other images to a PDF file.',
        icon: FileUp,
        href: '/pdf-tools/convert-to-pdf',
    },
    {
        name: 'Convert from PDF',
        description: 'Convert PDFs to Word, Excel, or images. (Coming Soon)',
        icon: FileDown,
        href: '/pdf-tools/convert-from-pdf',
    },
    {
        name: 'Extract Pages',
        description: 'Create a new PDF from selected pages of another.',
        icon: Scissors,
        href: '/pdf-tools/extract-pages',
    },
    {
        name: 'Rotate PDF',
        description: 'Rotate single or all pages in your PDF document.',
        icon: RotateCw,
        href: '/pdf-tools/rotate',
    },
];

const advancedPdfTools = [
    {
        name: 'Compare PDFs',
        description: 'Highlight the differences between two PDF files.',
        icon: GitCompareArrows,
        href: '/pdf-tools/compare',
    },
    {
        name: 'Extract Images from PDF',
        description: 'Extract all images from a PDF file.',
        icon: FileImage,
        href: '/pdf-tools/extract-images',
    },
    {
        name: 'Add Watermark',
        description: 'Add a text or image watermark to your PDF.',
        icon: Stamp,
        href: '/pdf-tools/add-watermark',
    },
    {
        name: 'Add Page Numbers',
        description: 'Insert page numbers into your PDF.',
        icon: ListOrdered,
        href: '/pdf-tools/add-page-numbers',
    },
    {
        name: 'Add Background',
        description: 'Add a color or image background.',
        icon: Layers,
        href: '/pdf-tools/add-background',
    },
    {
        name: 'Rearrange Pages',
        description: 'Drag and drop to reorder pages in a PDF.',
        icon: Move,
        href: '/pdf-tools/rearrange-pages',
    },
    {
        name: 'Delete Pages',
        description: 'Remove specific pages from a PDF file.',
        icon: FileMinus2,
        href: '/pdf-tools/delete-pages',
    },
    {
        name: 'Protect PDF',
        description: 'Add a password to protect your PDF.',
        icon: Lock,
        href: '/pdf-tools/protect',
    },
    {
        name: 'Unlock PDF',
        description: 'Remove a password from a PDF.',
        icon: Unlock,
        href: '/pdf-tools/unlock',
    },
]

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
            <h2 className="font-headline text-2xl font-bold">Basic Tools</h2>
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
       <div className="mt-12">
            <h2 className="font-headline text-2xl font-bold">Advanced Tools</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {advancedPdfTools.map((tool) => (
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
