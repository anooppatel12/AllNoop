
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, Download, Unlock } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export function PdfUnlocker() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      resetState();
      setFile(event.target.files[0]);
    }
  };

  const handleUnlockPdf = async () => {
    setError(null);
    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }
    if (!password) {
      setError('Please enter the password to unlock this PDF.');
      return;
    }

    setIsProcessing(true);
    setResultUrl(null);

    try {
      const pdfBytes = await file.arrayBuffer();
      // Load the PDF with the provided password
      const pdfDoc = await PDFDocument.load(pdfBytes, {
          password: password,
      });

      // Saving the document without encryption options removes the password
      const newPdfBytes = await pdfDoc.save();

      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);

    } catch (err: any) {
      console.error('Error unlocking PDF:', err);
      if (err.message.includes('password')) {
         setError('Incorrect password. Please try again.');
      } else {
        setError(err.message || 'An error occurred. The PDF might be corrupted or not encrypted.');
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  const resetState = () => {
      setFile(null);
      setPassword('');
      setIsProcessing(false);
      setResultUrl(null);
      setError(null);
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Unlock Your PDF</CardTitle>
        <CardDescription>Upload your encrypted PDF and provide the password to remove it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        { !file ? (
             <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-8 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Upload the PDF to unlock.</p>
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
                <div className="mt-4 space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter PDF password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
        )}
       
        <Button onClick={handleUnlockPdf} disabled={isProcessing || !file} className="w-full">
          {isProcessing ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Unlocking PDF...</>
          ) : (
            <><Unlock className="mr-2 h-4 w-4" /> Unlock PDF</>
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
            <h3 className="text-lg font-semibold">PDF Unlocked!</h3>
            <p className="mb-4 text-sm text-muted-foreground">Your decrypted PDF is ready for download.</p>
            <a href={resultUrl} download={`${file?.name.replace('.pdf', '') || 'unlocked'}.pdf`}>
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
