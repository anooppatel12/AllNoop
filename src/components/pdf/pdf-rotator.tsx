'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, Download, RotateCw } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function PdfRotator() {
  const [file, setFile] = useState<File | null>(null);
  const [pagesToRotate, setPagesToRotate] = useState('all');
  const [rotationAngle, setRotationAngle] = useState<'90' | '180' | '270'>('90');
  const [isRotating, setIsRotating] = useState(false);
  const [rotatedPdfUrl, setRotatedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setRotatedPdfUrl(null);
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

  const handleRotate = async () => {
    if (!file) {
      setError('Please upload a file to rotate.');
      return;
    }

    setIsRotating(true);
    setRotatedPdfUrl(null);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();

      const pageIndices = parsePageRanges(pagesToRotate, totalPages);
      
      if (pageIndices.length === 0) {
        throw new Error('No valid pages selected to rotate.');
      }

      const angle = parseInt(rotationAngle, 10);

      for (const pageIndex of pageIndices) {
        const page = pdfDoc.getPage(pageIndex);
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + angle));
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setRotatedPdfUrl(url);

    } catch (err: any) {
      console.error('Error rotating PDF:', err);
      setError(err.message || 'An error occurred while rotating the PDF.');
    } finally {
      setIsRotating(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Rotate PDF</CardTitle>
        <CardDescription>Upload a PDF, choose pages and rotation angle.</CardDescription>
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
                <Button variant="ghost" onClick={() => { setFile(null); setRotatedPdfUrl(null); setError(null); }}>Change File</Button>
              </div>
            
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="page-rotate">Pages to Rotate</Label>
                    <Input 
                        id="page-rotate"
                        placeholder="e.g., all, 1, 3-5, 8"
                        value={pagesToRotate}
                        onChange={(e) => setPagesToRotate(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Rotation Angle</Label>
                    <RadioGroup value={rotationAngle} onValueChange={(v: '90' | '180' | '270') => setRotationAngle(v)} className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="90" id="r90" /><Label htmlFor="r90">90°</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="180" id="r180" /><Label htmlFor="r180">180°</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="270" id="r270" /><Label htmlFor="r270">270°</Label></div>
                    </RadioGroup>
                </div>
              </div>
            </div>
        )}
       
        <Button onClick={handleRotate} disabled={isRotating || !file} className="w-full">
          {isRotating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Rotating...</>
          ) : (
            <><RotateCw className="mr-2 h-4 w-4" /> Rotate PDF</>
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
      {rotatedPdfUrl && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <h3 className="text-lg font-semibold">Rotation Successful!</h3>
            <p className="mb-4 text-sm text-muted-foreground">Your rotated PDF is ready.</p>
            <a href={rotatedPdfUrl} download={`${file?.name.replace('.pdf', '') || 'rotated'}.pdf`}>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Rotated PDF
              </Button>
            </a>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
