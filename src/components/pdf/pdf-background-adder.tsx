
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, Download, Layers, Image as ImageIcon, X } from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : null;
}

export function PdfBackgroundAdder() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [backgroundType, setBackgroundType] = useState<'color' | 'image'>('color');
  const [backgroundColor, setBackgroundColor] = useState('#add8e6');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setPdfFile(null);
    setImageFile(null);
    setResultUrl(null);
    setError(null);
    setIsProcessing(false);
  }

  const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      resetState();
      setPdfFile(event.target.files[0]);
    }
  };
  
   const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleAddBackground = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file.');
      return;
    }
    if (backgroundType === 'image' && !imageFile) {
      setError('Please upload an image file for the background.');
      return;
    }

    setIsProcessing(true);
    setResultUrl(null);
    setError(null);

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      if (backgroundType === 'color') {
        const colorRgb = hexToRgb(backgroundColor);
        if (!colorRgb) {
            throw new Error('Invalid hex color format.');
        }
        for (const page of pages) {
          const { width, height } = page.getSize();
          page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
            // To ensure it's in the background, we need to move it down.
            // The content stream is drawn in order. We prepend to draw it first.
            prepend: true
          });
        }
      } else if (backgroundType === 'image' && imageFile) {
        const imageBytes = await imageFile.arrayBuffer();
        const backgroundImage = imageFile.type === 'image/png' 
            ? await pdfDoc.embedPng(imageBytes) 
            : await pdfDoc.embedJpg(imageBytes);
        
         for (const page of pages) {
          const { width, height } = page.getSize();
          const imageDims = backgroundImage.scaleToFit(width, height);
          page.drawImage(backgroundImage, {
            x: (width / 2) - (imageDims.width / 2),
            y: (height / 2) - (imageDims.height / 2),
            width: imageDims.width,
            height: imageDims.height,
            prepend: true
          });
        }
      }
      
      const newPdfBytes = await pdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);

    } catch (err: any) {
      console.error('Error adding background:', err);
      setError(err.message || 'An error occurred. The PDF might be password-protected or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Add Background</CardTitle>
        <CardDescription>Upload your PDF and configure the background.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        { !pdfFile ? (
             <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-8 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Upload the main PDF document.</p>
                <Input id="pdf-upload" type="file" className="sr-only" onChange={handlePdfFileChange} accept="application/pdf" />
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
                        <p className="text-sm font-medium">{pdfFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                </div>
                <Button variant="ghost" onClick={resetState}>Change File</Button>
              </div>

              <Tabs value={backgroundType} onValueChange={(v) => setBackgroundType(v as 'color' | 'image')} className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="color">Color Background</TabsTrigger>
                    <TabsTrigger value="image">Image Background</TabsTrigger>
                </TabsList>
                <TabsContent value="color" className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="background-color">Background Color</Label>
                        <Input id="background-color" type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
                    </div>
                </TabsContent>
                <TabsContent value="image" className="mt-4 space-y-4">
                    {!imageFile ? (
                         <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-4 text-center">
                            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Upload the background image.</p>
                            <Input id="image-upload" type="file" className="sr-only" onChange={handleImageFileChange} accept="image/png, image/jpeg" />
                            <Label htmlFor="image-upload" className="mt-2 text-sm text-primary underline cursor-pointer">
                                Browse Image
                            </Label>
                        </div>
                    ) : (
                         <div className="flex items-center justify-between rounded-md border p-2">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="h-6 w-6 text-primary" />
                                <p className="text-sm font-medium">{imageFile.name}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setImageFile(null)}><X className="h-4 w-4"/></Button>
                        </div>
                    )}
                </TabsContent>
              </Tabs>
            </div>
        )}
       
        <Button onClick={handleAddBackground} disabled={isProcessing || !pdfFile} className="w-full">
          {isProcessing ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying Background...</>
          ) : (
            <><Layers className="mr-2 h-4 w-4" /> Add Background</>
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
            <h3 className="text-lg font-semibold">Background Added!</h3>
            <p className="mb-4 text-sm text-muted-foreground">Your updated PDF is ready for download.</p>
            <a href={resultUrl} download={`${pdfFile?.name.replace('.pdf', '') || 'background'}.pdf`}>
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
