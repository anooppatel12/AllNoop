
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MemeGenerator() {
  const { toast } = useToast();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [topText, setTopText] = useState('Top Text');
  const [bottomText, setBottomText] = useState('Bottom Text');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas dimensions to match image
      const aspectRatio = image.width / image.height;
      const maxWidth = 800;
      canvas.width = Math.min(image.width, maxWidth);
      canvas.height = canvas.width / aspectRatio;

      // Draw the image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Style the text
      const fontSize = canvas.width / 12;
      ctx.font = `bold ${fontSize}px Impact`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize / 20;
      ctx.textAlign = 'center';

      // Draw top text
      ctx.textBaseline = 'top';
      const topY = 10;
      ctx.strokeText(topText, canvas.width / 2, topY);
      ctx.fillText(topText, canvas.width / 2, topY);

      // Draw bottom text
      ctx.textBaseline = 'bottom';
      const bottomY = canvas.height - 10;
      ctx.strokeText(bottomText, canvas.width / 2, bottomY);
      ctx.fillText(bottomText, canvas.width / 2, bottomY);
    }
  }, [image, topText, bottomText]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File', description: 'Please upload an image file.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => setImage(img);
        img.onerror = () => toast({ variant: 'destructive', title: 'Error', description: 'Could not load the image file.' });
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Create Your Meme</CardTitle>
        <CardDescription>Upload an image and add your captions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!image ? (
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-8 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Upload an image to start</p>
            <Input id="image-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
            <Label htmlFor="image-upload" className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Browse Image
            </Label>
          </div>
        ) : (
          <div className="flex justify-center">
            <canvas ref={canvasRef} className="max-w-full rounded-md border" />
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="top-text">Top Text</Label>
            <Input id="top-text" value={topText} onChange={(e) => setTopText(e.target.value)} disabled={!image} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bottom-text">Bottom Text</Label>
            <Input id="bottom-text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} disabled={!image} />
          </div>
        </div>
      </CardContent>
      {image && (
        <CardFooter>
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download Meme
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
