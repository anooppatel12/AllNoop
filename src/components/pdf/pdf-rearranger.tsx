
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, Download, Move } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface PagePreview {
  id: number;
  dataUrl: string;
}

export function PdfRearranger() {
  const [file, setFile] = useState<File | null>(null);
  const [pagePreviews, setPagePreviews] = useState<PagePreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const resetState = () => {
    setFile(null);
    setPagePreviews([]);
    setResultUrl(null);
    setError(null);
    setIsProcessing(false);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      resetState();
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      await generatePreviews(selectedFile);
    }
  };

  const generatePreviews = async (pdfFile: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const numPages = pdfDoc.getPageCount();
      const previews: PagePreview[] = [];

      for (let i = 0; i < numPages; i++) {
        const tempDoc = await PDFDocument.create();
        const [copiedPage] = await tempDoc.copyPages(pdfDoc, [i]);
        tempDoc.addPage(copiedPage);
        const tempBytes = await tempDoc.saveAsBase64({ dataUri: true });
        previews.push({ id: i, dataUrl: tempBytes });
      }
      setPagePreviews(previews);
    } catch (err: any) {
      setError(err.message || "Failed to load PDF previews. The file might be corrupted or protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newPagePreviews = [...pagePreviews];
    const draggedItemContent = newPagePreviews.splice(dragItem.current, 1)[0];
    newPagePreviews.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setPagePreviews(newPagePreviews);
  };
  
  const handleSaveChanges = async () => {
      if (!file) {
        setError('Original PDF file not found.');
        return;
      }
      setIsProcessing(true);
      setError(null);
      setResultUrl(null);

      try {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const newPdfDoc = await PDFDocument.create();
        
        const pageIndices = pagePreviews.map(p => p.id);
        const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
        
        for (const page of copiedPages) {
            newPdfDoc.addPage(page);
        }

        const newPdfBytes = await newPdfDoc.save();
        const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setResultUrl(url);

      } catch (err: any) {
        setError(err.message || "Failed to save the reordered PDF.");
      } finally {
        setIsProcessing(false);
      }
  }


  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Upload PDF</CardTitle>
        <CardDescription>Select the PDF document you want to reorder.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        { !file ? (
             <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-8 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Upload the PDF document.</p>
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
                <Button variant="ghost" onClick={resetState}>Change File</Button>
              </div>
            </div>
        )}
       
       {isProcessing && pagePreviews.length === 0 && (
         <div className="flex items-center justify-center gap-2">
           <Loader2 className="h-6 w-6 animate-spin" />
           <p>Generating Previews...</p>
         </div>
       )}

       {pagePreviews.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {pagePreviews.map((page, index) => (
                <div 
                    key={page.id}
                    className="relative cursor-grab rounded-md border-2 border-transparent bg-muted p-1 transition-all hover:border-primary focus:border-primary focus:outline-none"
                    draggable
                    onDragStart={() => dragItem.current = index}
                    onDragEnter={() => dragOverItem.current = index}
                    onDragEnd={handleDragSort}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <div className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {index + 1}
                    </div>
                    <object data={page.dataUrl} type="application/pdf" className="pointer-events-none aspect-[7/10] w-full" />
                </div>
            ))}
          </div>
       )}

        {pagePreviews.length > 0 && (
            <Button onClick={handleSaveChanges} disabled={isProcessing} className="w-full">
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Save Reordered PDF
            </Button>
        )}
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
            <h3 className="text-lg font-semibold">PDF Reordered!</h3>
            <p className="mb-4 text-sm text-muted-foreground">Your updated PDF is ready for download.</p>
            <a href={resultUrl} download={`${file?.name.replace('.pdf', '') || 'reordered'}.pdf`}>
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
