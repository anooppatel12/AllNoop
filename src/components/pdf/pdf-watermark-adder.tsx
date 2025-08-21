
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, Download, Stamp, Image as ImageIcon, X } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '../ui/slider';

export function PdfWatermarkAdder() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(50);
  
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

  const handleAddWatermark = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file.');
      return;
    }
    if (watermarkType === 'image' && !imageFile) {
      setError('Please upload an image file for the watermark.');
      return;
    }

    setIsProcessing(true);
    setResultUrl(null);
    setError(null);

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      if (watermarkType === 'text') {
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        for (const page of pages) {
          const { width, height } = page.getSize();
          page.drawText(watermarkText, {
            x: width / 2 - (watermarkText.length * fontSize) / 4,
            y: height / 2,
            font: helveticaFont,
            size: fontSize,
            color: rgb(0.5, 0.5, 0.5),
            opacity: opacity,
            rotate: degrees(45),
          });
        }
      } else if (watermarkType === 'image' && imageFile) {
        const imageBytes = await imageFile.arrayBuffer();
        const watermarkImage = imageFile.type === 'image/png' 
            ? await pdfDoc.embedPng(imageBytes) 
            : await pdfDoc.embedJpg(imageBytes);
        
        const imageDims = watermarkImage.scale(0.5);

         for (const page of pages) {
          const { width, height } = page.getSize();
          page.drawImage(watermarkImage, {
            x: width / 2 - imageDims.width / 2,
            y: height / 2 - imageDims.height / 2,
            width: imageDims.width,
            height: imageDims.height,
            opacity: opacity,
          });
        }
      }
      
      const newPdfBytes = await pdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);

    } catch (err: any) {
      console.error('Error adding watermark:', err);
      setError(err.message || 'An error occurred. The PDF might be password-protected or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Add Watermark</CardTitle>
        <CardDescription>Upload your PDF and configure the watermark.</CardDescription>
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

              <Tabs value={watermarkType} onValueChange={(v) => setWatermarkType(v as 'text' | 'image')} className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Text Watermark</TabsTrigger>
                    <TabsTrigger value="image">Image Watermark</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="watermark-text">Watermark Text</Label>
                        <Input id="watermark-text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Font Size: {fontSize}px</Label>
                        <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={10} max={150} step={5} />
                    </div>
                </TabsContent>
                <TabsContent value="image" className="mt-4 space-y-4">
                    {!imageFile ? (
                         <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-4 text-center">
                            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Upload the watermark image.</p>
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
              <div className="space-y-2 mt-4">
                <Label>Opacity: {Math.round(opacity * 100)}%</Label>
                <Slider value={[opacity]} onValueChange={([v]) => setOpacity(v)} min={0.1} max={1} step={0.1} />
              </div>
            </div>
        )}
       
        <Button onClick={handleAddWatermark} disabled={isProcessing || !pdfFile} className="w-full">
          {isProcessing ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying Watermark...</>
          ) : (
            <><Stamp className="mr-2 h-4 w-4" /> Add Watermark</>
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
            <h3 className="text-lg font-semibold">Watermark Added!</h3>
            <p className="mb-4 text-sm text-muted-foreground">Your watermarked PDF is ready for download.</p>
            <a href={resultUrl} download={`${pdfFile?.name.replace('.pdf', '') || 'watermarked'}.pdf`}>
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
