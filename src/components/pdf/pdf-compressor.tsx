'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, Download, Minimize2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<{ url: string; originalSize: number; newSize: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setError('Please upload a file to compress.');
      return;
    }

    setIsCompressing(true);
    setResult(null);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { 
        // This option can sometimes help by not immediately parsing all objects
        updateMetadata: false 
      });
      
      // The main compression comes from re-saving the document, 
      // which pdf-lib optimizes by removing unused objects.
      const compressedPdfBytes = await pdfDoc.save();

      const originalSize = file.size;
      const newSize = compressedPdfBytes.length;

      if (newSize >= originalSize) {
        setError("Could not reduce file size. The document may already be optimized.");
        setIsCompressing(false);
        return;
      }

      const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setResult({ url, originalSize, newSize });

    } catch (err: any) {
      console.error('Error compressing PDF:', err);
      setError(err.message || 'An error occurred while compressing the PDF. The file might be corrupted or password-protected.');
    } finally {
      setIsCompressing(false);
    }
  };
  
  const getReductionPercent = () => {
      if(!result) return 0;
      return ((result.originalSize - result.newSize) / result.originalSize) * 100;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Upload your PDF</CardTitle>
        <CardDescription>Select the PDF you want to compress.</CardDescription>
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
        )}
       
        <Button onClick={handleCompress} disabled={isCompressing || !file} className="w-full">
          {isCompressing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compressing...
            </>
          ) : (
            <>
             <Minimize2 className="mr-2 h-4 w-4" /> Compress PDF
            </>
          )}
        </Button>
      </CardContent>
       {error && (
        <CardFooter>
            <Alert variant="destructive" className="w-full">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Compression Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </CardFooter>
      )}
      {result && (
        <CardFooter>
          <div className="w-full rounded-lg bg-muted p-4 text-center">
            <h3 className="text-lg font-semibold">Compression Successful!</h3>
            <p className="text-4xl font-bold text-primary">
                {getReductionPercent().toFixed(2)}%
            </p>
            <p className="text-sm text-muted-foreground mb-4">
               File size reduced from {(result.originalSize / 1024 / 1024).toFixed(2)} MB
               to {(result.newSize / 1024 / 1024).toFixed(2)} MB
            </p>
            <a href={result.url} download={`${file?.name.replace('.pdf', '') || 'compressed'}.pdf`}>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Compressed PDF
              </Button>
            </a>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
