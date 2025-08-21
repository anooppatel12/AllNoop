'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Download, Brush, Trash2, Wand2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  removeImageBackgroundAction,
  replaceImageBackgroundAction,
} from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function ImageEditor() {
  const { toast } = useToast();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [editedImage, setEditedImage] = useState<HTMLImageElement | null>(null);
  const [activeImage, setActiveImage] = useState<'original' | 'edited'>('original');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [prompt, setPrompt] = useState<string>('A beautiful beach');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgToDraw = activeImage === 'edited' && editedImage ? editedImage : image;

    if (imgToDraw) {
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = imgToDraw.width;
        canvas.height = imgToDraw.height;
        context.drawImage(imgToDraw, 0, 0);
      }
    } else {
        const context = canvas.getContext('2d');
        if(context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
  }, [image, editedImage, activeImage]);

  const resetAll = () => {
    setImage(null);
    setEditedImage(null);
    setActiveImage('original');
    setIsProcessing(false);
    setError(null);
    setPrompt('A beautiful beach');
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
       if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File', description: 'Please upload an image file.' });
        return;
      }
      resetAll();
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

  const handleRemoveBackground = async () => {
    if (!image) return;
    setIsProcessing(true);
    setError(null);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const result = await removeImageBackgroundAction(canvas.toDataURL());
      if (!result) {
        throw new Error('The operation returned an empty result.');
      }
      if (result.error) {
        setError(result.error);
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      } else if (result.image) {
        const img = new Image();
        img.onload = () => {
          setEditedImage(img);
          setActiveImage('edited');
        };
        img.src = result.image;
      }
    } catch (e: any) {
      setError(e.message);
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReplaceBackground = async () => {
    if (!image) return;
    setIsProcessing(true);
    setError(null);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const result = await replaceImageBackgroundAction({
        image: canvas.toDataURL(),
        prompt: prompt
      });
      if (!result) {
        throw new Error('The operation returned an empty result.');
      }
      if (result.error) {
        setError(result.error);
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      } else if (result.image) {
        const img = new Image();
        img.onload = () => {
          setEditedImage(img);
          setActiveImage('edited');
        };
        img.src = result.image;
      }
    } catch (e: any) {
      setError(e.message);
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      {/* Toolbar */}
      <div className="w-full md:w-80 border-b md:border-r p-4 space-y-6 overflow-y-auto">
        <h2 className="text-xl font-bold">Image Editor</h2>
        
        {image ? (
            <div className="space-y-6">
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">AI Tools</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit" className="mt-4 space-y-4">
                     <div className='p-4 border rounded-lg space-y-4'>
                         <Button onClick={handleRemoveBackground} className="w-full" disabled={isProcessing}>
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4" />}
                            Remove Background
                        </Button>

                        <div className="space-y-2">
                            <Label htmlFor="bg-prompt">Replace Background Prompt:</Label>
                            <Input id="bg-prompt" placeholder="e.g. A beautiful beach" value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isProcessing}/>
                        </div>
                        <Button onClick={handleReplaceBackground} className="w-full" disabled={isProcessing}>
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                            Replace Background
                        </Button>
                     </div>
                  </TabsContent>
                  <TabsContent value="export" className="mt-4 space-y-4">
                     <div className='p-4 border rounded-lg space-y-4'>
                        <Button onClick={handleDownload} className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Download Image
                        </Button>
                     </div>
                  </TabsContent>
                </Tabs>
                <Button onClick={resetAll} className="w-full" variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Start Over
                </Button>
                 {error && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
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
             <div className="flex-1 overflow-auto flex justify-center items-start relative">
                 <canvas ref={canvasRef} className="border shadow-md max-w-full max-h-full" />
                 {editedImage && (
                    <div className="absolute top-2 right-2 flex gap-2">
                        <Button size="sm" variant={activeImage === 'original' ? 'default' : 'secondary'} onClick={() => setActiveImage('original')}>Original</Button>
                        <Button size="sm" variant={activeImage === 'edited' ? 'default' : 'secondary'} onClick={() => setActiveImage('edited')}>Edited</Button>
                    </div>
                 )}
                 {isProcessing && (
                    <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p className="text-muted-foreground">Processing image...</p>
                    </div>
                 )}
             </div>
        )}
      </div>
    </div>
  );
}
