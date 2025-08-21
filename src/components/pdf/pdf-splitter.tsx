'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, Download, Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setSplitPdfUrl(null);
      setError(null);
    }
  };

  const parsePageRanges = (rangeStr: string, maxPages: number): number[] => {
    const pages: Set<number> = new Set();
    const ranges = rangeStr.split(',');
    
    for (const range of ranges) {
      const trimmedRange = range.trim();
      if (trimmedRange.includes('-')) {
        const [start, end] = trimmedRange.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end) && start <= end && start > 0 && end <= maxPages) {
          for (let i = start; i <= end; i++) {
            pages.add(i - 1); // convert to 0-based index
          }
        } else {
            throw new Error(`Invalid range: "${trimmedRange}". Pages must be between 1 and ${maxPages}.`);
        }
      } else {
        const pageNum = Number(trimmedRange);
        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= maxPages) {
          pages.add(pageNum - 1); // convert to 0-based index
        } else {
             throw new Error(`Invalid page number: "${trimmedRange}". Must be between 1 and ${maxPages}.`);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || !pageRange) {
      setError('Please upload a file and specify the pages to extract.');
      return;
    }

    setIsSplitting(true);
    setSplitPdfUrl(null);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();
      
      const pageIndices = parsePageRanges(pageRange, totalPages);

      if (pageIndices.length === 0) {
        throw new Error('No valid pages selected to extract.');
      }
      
      const newPdfDoc = await PDFDocument.create();
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach((page) => newPdfDoc.addPage(page));
      
      const newPdfBytes = await newPdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setSplitPdfUrl(url);

    } catch (err: any) {
      console.error('Error splitting PDF:', err);
      setError(err.message || 'An error occurred while splitting the PDF.');
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Upload your PDF</CardTitle>
        <CardDescription>Select the PDF you want to split.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        { !file ? (
             <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-8 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Drag and drop your file here, or click to browse.</p>
                <Input id="pdf-upload" type="file" className="sr-only" onChange={handleFileChange} accept="application/pdf" />
                <Label htmlFor="pdf-upload" className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    Browse File
                </Label>
            </div>
        ) : (
             <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={() => setFile(null)}>Change File</Button>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="page-range">Pages to Extract</Label>
                    <Input 
                        id="page-range"
                        placeholder="e.g., 1, 3-5, 8"
                        value={pageRange}
                        onChange={(e) => setPageRange(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        Enter page numbers or ranges separated by commas.
                    </p>
                </div>
            </div>
        )}
       
        <Button onClick={handleSplit} disabled={isSplitting || !file || !pageRange} className="w-full">
          {isSplitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Splitting...
            </>
          ) : (
            <>
             <Scissors className="mr-2 h-4 w-4" /> Split PDF
            </>
          )}
        </Button>
      </CardContent>
       {error && (
        <CardFooter>
            <Alert variant="destructive" className="w-full">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </CardFooter>
      )}
      {splitPdfUrl && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <h3 className="text-lg font-semibold">Split Successful!</h3>
            <p className="mb-4 text-sm text-muted-foreground">Your new PDF is ready for download.</p>
            <a href={splitPdfUrl} download={`${file?.name.replace('.pdf', '') || 'split'}-pages.pdf`}>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Split PDF
              </Button>
            </a>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
