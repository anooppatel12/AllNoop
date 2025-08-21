
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Download, Brush } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ImageEditor() {
  const { toast } = useToast();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
      }
    }
  }, [image]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
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
    if (canvas && image) {
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      {/* Toolbar */}
      <div className="w-full md:w-80 border-b md:border-r p-4 space-y-6 overflow-y-auto">
        <h2 className="text-xl font-bold">Image Editor</h2>
        
        {image ? (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Tools</h3>
                <p className="text-sm text-muted-foreground">More editing tools coming soon!</p>
                 <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                </Button>
            </div>
        ) : (
             <p className="text-sm text-muted-foreground">Upload an image to start editing.</p>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-muted/40 p-4">
        {!image ? (
             <div className="flex-1 flex items-center justify-center">
                <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-12 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">Upload your image to begin</p>
                    <Input id="image-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                    <Label htmlFor="image-upload" className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                        Browse Image
                    </Label>
                </div>
             </div>
        ) : (
             <div className="flex-1 overflow-auto flex justify-center items-start">
                 <canvas ref={canvasRef} className="border shadow-md max-w-full max-h-full" />
             </div>
        )}
      </div>
    </div>
  );
}
