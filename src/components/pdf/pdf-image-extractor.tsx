
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, Download, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { PDFDocument, PDFImage, PDFName, PDFObject, PDFRawStream } from 'pdf-lib';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface ExtractedImage {
  url: string;
  type: 'jpeg' | 'png' | 'unknown';
  index: number;
}

// Helper to convert Uint8Array to base64
function uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export function PdfImageExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setExtractedImages([]);
      setError(null);
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    setIsExtracting(true);
    setExtractedImages([]);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { 
        ignoreEncryption: true,
      });
      const images: ExtractedImage[] = [];
      let imageIndex = 0;

      const pages = pdfDoc.getPages();
      for (const page of pages) {
          const resources = page.node.Resources();
          if (!resources) continue;

          const xobjects = resources.lookup(PDFName.of('XObject'));
          if (!xobjects || !('entries' in xobjects)) continue;

          for (const [key, value] of xobjects.entries()) {
              const stream = pdfDoc.context.lookup(value) as PDFRawStream;
              
              if (stream?.dict?.get(PDFName.of('Subtype')) === PDFName.of('Image')) {
                  const imageBytes = stream.contents;
                  const base64 = uint8ArrayToBase64(imageBytes);
                  
                  // Attempt to determine image type
                  let imageType: 'jpeg' | 'png' | 'unknown' = 'unknown';
                  const filter = stream.dict.get(PDFName.of('Filter'));
                  if (filter === PDFName.of('DCTDecode')) {
                      imageType = 'jpeg';
                  } else if (filter === PDFName.of('FlateDecode')) {
                      // This could be PNG or other formats. PNG is a good guess.
                      imageType = 'png';
                  }

                  images.push({
                      url: `data:image/${imageType === 'unknown' ? 'octet-stream' : imageType};base64,${base64}`,
                      type: imageType,
                      index: imageIndex++,
                  });
              }
          }
      }
      
      if (images.length === 0) {
        setError("No extractable images found in this PDF.");
      }

      setExtractedImages(images);
    } catch (err: any) {
      console.error('Error extracting images from PDF:', err);
      setError(err.message || 'An error occurred while extracting images. The file might be corrupted or password-protected.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Upload your PDF</CardTitle>
        <CardDescription>Select the PDF from which you want to extract images.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        { !file ? (
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-8 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Drag and drop your file here, or click to browse.</p>
            <Input id="pdf-upload" type="file" className="sr-only" onChange={handleFileChange} accept="application/pdf" />
            <Label htmlFor="pdf-upload" className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
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
       
        <Button onClick={handleExtract} disabled={isExtracting || !file} className="w-full">
          {isExtracting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extracting...</>
          ) : (
            <><ImageIcon className="mr-2 h-4 w-4" /> Extract Images</>
          )}
        </Button>
      </CardContent>
      {error && (
        <CardFooter>
          <Alert variant="destructive" className="w-full">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Extraction Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardFooter>
      )}
      {extractedImages.length > 0 && (
        <CardFooter className="flex-col items-start gap-4">
          <h3 className="text-lg font-semibold">Extracted Images ({extractedImages.length})</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {extractedImages.map((image) => (
              <div key={image.index} className="group relative rounded-md border">
                <img src={image.url} alt={`Extracted image ${image.index + 1}`} className="aspect-square w-full rounded-md object-contain"/>
                <a
                  href={image.url}
                  download={`image_${image.index + 1}.${image.type === 'unknown' ? 'bin' : image.type}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Download className="h-8 w-8 text-white" />
                </a>
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
