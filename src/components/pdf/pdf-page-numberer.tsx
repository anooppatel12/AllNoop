
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, Download, ListOrdered } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export function PdfPageNumberer() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [pageRange, setPageRange] = useState('all');
  const [format, setFormat] = useState('{page}');
  const [fontSize, setFontSize] = useState(12);
  const [position, setPosition] = useState<Position>('bottom-center');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setResultUrl(null);
      setError(null);
    }
  };
  
  const parsePageRanges = (rangeStr: string, maxPages: number): number[] => {
    if (rangeStr.trim().toLowerCase() === 'all') {
      return Array.from({ length: maxPages }, (_, i) => i);
    }
    const pages: Set<number> = new Set();
    const ranges = rangeStr.split(',');
    for (const range of ranges) {
      const trimmedRange = range.trim();
      if (trimmedRange.includes('-')) {
        const [start, end] = trimmedRange.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end) && start <= end && start > 0 && end <= maxPages) {
          for (let i = start; i <= end; i++) pages.add(i - 1);
        } else {
          throw new Error(`Invalid range: "${trimmedRange}". Pages must be between 1 and ${maxPages}.`);
        }
      } else {
        const pageNum = Number(trimmedRange);
        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= maxPages) {
          pages.add(pageNum - 1);
        } else {
          throw new Error(`Invalid page number: "${trimmedRange}". Must be between 1 and ${maxPages}.`);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleAddNumbers = async () => {
    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }

    setIsProcessing(true);
    setResultUrl(null);
    setError(null);

    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const totalPages = pdfDoc.getPageCount();
      const pageIndices = parsePageRanges(pageRange, totalPages);
      
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const pageIndex of pageIndices) {
        const page = pdfDoc.getPage(pageIndex);
        const { width, height } = page.getSize();
        
        const pageNumberText = format
          .replace('{page}', String(pageIndex + 1))
          .replace('{totalPages}', String(totalPages));
          
        const textWidth = helveticaFont.widthOfTextAtSize(pageNumberText, fontSize);
        const textHeight = helveticaFont.heightAtSize(fontSize);
        
        let x = 0;
        let y = 0;
        const margin = 30;

        switch(position) {
          case 'top-left':       x = margin; y = height - textHeight - margin; break;
          case 'top-center':     x = width / 2 - textWidth / 2; y = height - textHeight - margin; break;
          case 'top-right':      x = width - textWidth - margin; y = height - textHeight - margin; break;
          case 'bottom-left':    x = margin; y = margin; break;
          case 'bottom-center':  x = width / 2 - textWidth / 2; y = margin; break;
          case 'bottom-right':   x = width - textWidth - margin; y = margin; break;
        }

        page.drawText(pageNumberText, {
          x,
          y,
          font: helveticaFont,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
      }

      const newPdfBytes = await pdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Numbering Options</CardTitle>
        <CardDescription>Upload a PDF and configure the numbering settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        { !file ? (
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-8 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Upload your PDF document.</p>
            <Input id="pdf-upload" type="file" className="sr-only" onChange={handleFileChange} accept="application/pdf" />
            <Label htmlFor="pdf-upload" className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Browse PDF
            </Label>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setFile(null)}>Change File</Button>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Select value={position} onValueChange={(v: Position) => setPosition(v)}>
                        <SelectTrigger id="position"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bottom-center">Bottom Center</SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            <SelectItem value="top-center">Top Center</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="page-range">Page Range</Label>
                    <Input id="page-range" value={pageRange} onChange={(e) => setPageRange(e.target.value)} placeholder="e.g., all, 1, 3-5, 8" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Input id="format" value={format} onChange={(e) => setFormat(e.target.value)} placeholder="Use {page} and {totalPages}" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Input id="font-size" type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} />
                </div>
            </div>
          </div>
        )}
       
        <Button onClick={handleAddNumbers} disabled={isProcessing || !file} className="w-full">
          {isProcessing ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Numbers...</>
          ) : (
            <><ListOrdered className="mr-2 h-4 w-4" /> Add Page Numbers</>
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
      {resultUrl && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <h3 className="text-lg font-semibold">Page Numbers Added!</h3>
            <p className="mb-4 text-sm text-muted-foreground">Your updated PDF is ready for download.</p>
            <a href={resultUrl} download={`${file?.name.replace('.pdf', '') || 'numbered'}.pdf`}>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </a>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
