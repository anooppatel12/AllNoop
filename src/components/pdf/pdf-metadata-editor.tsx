
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, Download, FilePenLine } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Textarea } from '../ui/textarea';

interface Metadata {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
}

export function PdfMetadataEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setFile(null);
    setMetadata(null);
    setResultUrl(null);
    setError(null);
    setIsProcessing(false);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      resetState();
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      
      setIsProcessing(true);
      try {
        const pdfBytes = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes, { updateMetadata: false });
        
        setMetadata({
          title: pdfDoc.getTitle() ?? '',
          author: pdfDoc.getAuthor() ?? '',
          subject: pdfDoc.getSubject() ?? '',
          keywords: pdfDoc.getKeywords() ?? '',
          creator: pdfDoc.getCreator() ?? '',
          producer: pdfDoc.getProducer() ?? '',
        });

      } catch (err: any) {
        setError(err.message || "Failed to read PDF metadata. The file may be corrupted or protected.");
        setMetadata(null);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleMetadataChange = (field: keyof Metadata, value: string) => {
    if (metadata) {
      setMetadata({ ...metadata, [field]: value });
    }
  };

  const handleSaveChanges = async () => {
    if (!file || !metadata) {
      setError('No file or metadata to save.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResultUrl(null);

    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      pdfDoc.setTitle(metadata.title);
      pdfDoc.setAuthor(metadata.author);
      pdfDoc.setSubject(metadata.subject);
      pdfDoc.setKeywords(metadata.keywords.split(',').map(k => k.trim()));
      pdfDoc.setCreator(metadata.creator);
      // Producer is often read-only, but we can try.
      pdfDoc.setProducer(metadata.producer);
      
      const newPdfBytes = await pdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);

    } catch (err: any) {
      setError(err.message || "Failed to save the modified PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>PDF Properties</CardTitle>
        <CardDescription>Upload a PDF to view and edit its metadata.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file ? (
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
              <Button variant="ghost" onClick={resetState}>Change File</Button>
            </div>
            
            {isProcessing && !metadata && <div className="text-center p-4"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></div>}
            
            {metadata && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-50">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={metadata.title} onChange={(e) => handleMetadataChange('title', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input id="author" value={metadata.author} onChange={(e) => handleMetadataChange('author', e.target.value)} />
                    </div>
                     <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Textarea id="subject" value={metadata.subject} onChange={(e) => handleMetadataChange('subject', e.target.value)} />
                    </div>
                     <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                        <Input id="keywords" value={metadata.keywords} onChange={(e) => handleMetadataChange('keywords', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="creator">Creator</Label>
                        <Input id="creator" value={metadata.creator} onChange={(e) => handleMetadataChange('creator', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="producer">Producer</Label>
                        <Input id="producer" value={metadata.producer} onChange={(e) => handleMetadataChange('producer', e.target.value)} />
                    </div>
                </div>
            )}
          </div>
        )}

        {metadata && (
          <Button onClick={handleSaveChanges} disabled={isProcessing} className="w-full">
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FilePenLine className="mr-2 h-4 w-4" />}
            Save Changes & Download
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
            <h3 className="text-lg font-semibold">Metadata Updated!</h3>
            <p className="mb-4 text-sm text-muted-foreground">Your modified PDF is ready for download.</p>
            <a href={resultUrl} download={`${file?.name.replace('.pdf', '') || 'metadata-edited'}.pdf`}>
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
