'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, Loader2, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import pdf from 'pdf-parse/lib/pdf-parse';

export function PdfTextExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setExtractedText(null);
      setError(null);
    }
  };
  
  const handleCopy = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleExtract = async () => {
    if (!file) {
      setError('Please upload a file to extract text from.');
      return;
    }

    setIsExtracting(true);
    setExtractedText(null);
    setError(null);

    try {
        const arrayBuffer = await file.arrayBuffer();
        const data = await pdf(arrayBuffer);
        if (data.text.trim().length > 0) {
            setExtractedText(data.text);
        } else {
            setError("No text could be extracted. This might be a scanned (image-based) PDF, which is not supported by this tool.");
        }
    } catch (err) {
        console.error("Error extracting text: ", err);
        setError("An error occurred while parsing the PDF. The file may be corrupt or protected.");
    } finally {
        setIsExtracting(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Upload PDF</CardTitle>
        <CardDescription>Select the PDF you want to extract text from.</CardDescription>
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
       
        <Button onClick={handleExtract} disabled={isExtracting || !file} className="w-full">
          {isExtracting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extracting...</>
          ) : (
            'Extract Text'
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
      {extractedText && (
        <CardFooter className="flex-col gap-4">
            <div className="relative w-full">
                <Textarea
                    readOnly
                    value={extractedText}
                    className="h-64 w-full"
                    placeholder="Extracted text will appear here."
                />
                 <Button size="icon" variant="ghost" className="absolute right-2 top-2" onClick={handleCopy}>
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
