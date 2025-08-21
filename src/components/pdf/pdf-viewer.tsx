'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText } from 'lucide-react';

export function PdfViewer() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setFileName(file.name);
    } else {
      setPdfUrl(null);
      setFileName(null);
      alert('Please select a valid PDF file.');
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Upload your PDF</CardTitle>
        <CardDescription>Select a PDF file from your computer to view it below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-8 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Drag and drop your file here, or click to browse.</p>
          <Input id="pdf-upload" type="file" className="sr-only" onChange={handleFileChange} accept="application/pdf" />
          <Label htmlFor="pdf-upload" className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            Browse File
          </Label>
          {fileName && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-foreground">
                <FileText className="h-4 w-4" />
                <span>{fileName}</span>
            </div>
          )}
        </div>
        
        {pdfUrl && (
          <div className="aspect-h-4 aspect-w-3 w-full">
            <embed src={pdfUrl} type="application/pdf" className="h-full w-full min-h-[800px] rounded-md border" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
