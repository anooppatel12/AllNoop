
'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, GitCompareArrows, ChevronLeft, ChevronRight } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import diff_match_patch from 'diff-match-patch';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export function PdfComparer() {
  const { toast } = useToast();
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [diffs, setDiffs] = useState<any[] | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resetState = () => {
    setFileA(null);
    setFileB(null);
    setIsProcessing(false);
    setError(null);
    setPdfDoc(null);
    setDiffs(null);
    setNumPages(0);
    setCurrentPage(1);
  };
  
  const renderPage = useCallback(async (pageNumber: number, pdf: pdfjs.PDFDocumentProxy, pageDiffs: any[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const context = canvas.getContext('2d');
        if (!context) return;

        await page.render({ canvasContext: context, viewport }).promise;

        const textContent = await page.getTextContent();
        const textItems = textContent.items;
        
        let currentTextIndex = 0;
        
        for (const diff of pageDiffs) {
            const op = diff[0]; // -1 for delete, 1 for insert, 0 for equal
            const text = diff[1];
            
            if (op === 0) { // equal
                currentTextIndex += text.length;
                continue;
            }

            const textToHighlight = text;
            let startIndex = 0;
            
            while(startIndex < textItems.length) {
                const item = textItems[startIndex] as any;
                if(currentTextIndex < item.offset) {
                    startIndex++;
                    continue;
                }
                
                const itemEndOffset = item.offset + item.str.length;
                
                if (currentTextIndex < itemEndOffset) {
                    const localIndex = currentTextIndex - item.offset;
                    const remainingItemText = item.str.substring(localIndex);
                    
                    const highlightIndex = remainingItemText.indexOf(textToHighlight);
                    
                    if(highlightIndex !== -1) {
                         const preText = remainingItemText.substring(0, highlightIndex);
                         const preTextWidth = (context.measureText(preText).width / item.str.length) * item.width;
                         const highlightWidth = (context.measureText(textToHighlight).width / item.str.length) * item.width;

                         context.fillStyle = op === 1 ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
                         const tx = viewport.transform;
                         const textX = item.transform[4] + preTextWidth;
                         const textY = item.transform[5];
                         
                         context.fillRect(textX, textY - item.height, highlightWidth, item.height * 1.2);
                         
                         currentTextIndex += text.length;
                         break;
                    }
                }
                 startIndex++;
            }
        }
        
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error rendering page', description: e.message });
    }
  }, [toast]);


  const handleCompare = async () => {
    if (!fileA || !fileB) {
      setError('Please upload both PDF files.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const dmp = new diff_match_patch();
      const pdfABytes = await fileA.arrayBuffer();
      const pdfBBytes = await fileB.arrayBuffer();
      
      const pdfADoc = await pdfjs.getDocument({ data: pdfABytes }).promise;
      const pdfBDoc = await pdfjs.getDocument({ data: pdfBBytes }).promise;
      
      setPdfDoc(pdfADoc);
      const maxPages = Math.max(pdfADoc.numPages, pdfBDoc.numPages);
      setNumPages(maxPages);
      
      const allDiffs = [];
      for(let i = 1; i <= maxPages; i++){
          const textA = i <= pdfADoc.numPages ? (await (await pdfADoc.getPage(i)).getTextContent()).items.map((it: any) => it.str).join('') : '';
          const textB = i <= pdfBDoc.numPages ? (await (await pdfBDoc.getPage(i)).getTextContent()).items.map((it: any) => it.str).join('') : '';
          const pageDiffs = dmp.diff_main(textA, textB);
          dmp.diff_cleanupSemantic(pageDiffs);
          allDiffs.push(pageDiffs);
      }
      
      setDiffs(allDiffs);
      renderPage(1, pdfADoc, allDiffs[0]);

    } catch (err: any) {
      setError(err.message || 'An error occurred during comparison.');
    } finally {
      setIsProcessing(false);
    }
  };
  
   const changePage = (offset: number) => {
    const newPage = currentPage + offset;
    if (newPage > 0 && newPage <= numPages && pdfDoc && diffs) {
      setCurrentPage(newPage);
      renderPage(newPage, pdfDoc, diffs[newPage - 1]);
    }
  };

  const FileUploader = ({ file, setFile, title }: { file: File | null, setFile: (f: File | null) => void, title: string }) => (
     <div className="flex-1">
        <h3 className="mb-2 font-semibold text-center">{title}</h3>
        {!file ? (
             <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-6 text-center">
                <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                <Input id={`pdf-upload-${title}`} type="file" className="sr-only" onChange={(e) => e.target.files && setFile(e.target.files[0])} accept="application/pdf" />
                <Label htmlFor={`pdf-upload-${title}`} className="mt-2 text-sm text-primary underline cursor-pointer">
                    Browse PDF
                </Label>
            </div>
        ): (
             <div className="flex items-center justify-between rounded-md border p-2">
                <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                    <p className="text-sm font-medium truncate">{file.name}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Change</Button>
            </div>
        )}
     </div>
  );

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Upload PDF Files</CardTitle>
        <CardDescription>Select the two PDF files you want to compare.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
            <FileUploader file={fileA} setFile={setFileA} title="Original PDF (A)" />
            <div className="my-4 md:my-0">
                <GitCompareArrows className="h-8 w-8 text-muted-foreground" />
            </div>
            <FileUploader file={fileB} setFile={setFileB} title="Modified PDF (B)" />
        </div>
        
        <Button onClick={handleCompare} disabled={isProcessing || !fileA || !fileB} className="w-full">
          {isProcessing ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Comparing...</>
          ) : (
            'Compare PDFs'
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
      {pdfDoc && (
        <CardFooter className="flex-col gap-4">
           <div className="flex items-center justify-center gap-4 p-2 border-b bg-background w-full">
                <Button variant="outline" size="icon" onClick={() => changePage(-1)} disabled={currentPage <= 1}>
                    <ChevronLeft/>
                </Button>
                <span>Page {currentPage} of {numPages}</span>
                <Button variant="outline" size="icon" onClick={() => changePage(1)} disabled={currentPage >= numPages}>
                    <ChevronRight/>
                </Button>
            </div>
            <div className="w-full overflow-auto border rounded-md">
                <canvas ref={canvasRef} />
            </div>
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500/50"></div><span>Added to PDF B</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500/50"></div><span>Removed from PDF B</span></div>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
