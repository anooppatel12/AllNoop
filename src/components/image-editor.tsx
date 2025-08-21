'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Download, Trash2, Wand2, RefreshCw, Crop, Wand, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  removeImageBackgroundAction,
  replaceImageBackgroundAction,
} from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { cn } from '@/lib/utils';

type Tool = 'ai' | 'crop' | 'filters';
type Filter = 'none' | 'grayscale' | 'sepia' | 'invert';

export function ImageEditor() {
  const { toast } = useToast();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [editedImage, setEditedImage] = useState<HTMLImageElement | null>(null);
  const [activeImage, setActiveImage] = useState<'original' | 'edited'>('original');
  const [currentTool, setCurrentTool] = useState<Tool>('ai');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('A beautiful beach');
  
  // Cropping state
  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  const [startCropPos, setStartCropPos] = useState<{x: number, y: number} | null>(null);
  
  // Filter state
  const [currentFilter, setCurrentFilter] = useState<Filter>('none');


  const drawImage = useCallback((img: HTMLImageElement, filter: Filter = 'none') => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    if (filter !== 'none') {
        context.filter = `${filter}(1)`;
    } else {
        context.filter = 'none';
    }
    
    context.drawImage(img, 0, 0);
    context.filter = 'none'; // Reset filter after drawing
  }, []);

  useEffect(() => {
    const imgToDraw = activeImage === 'edited' && editedImage ? editedImage : image;
    if (imgToDraw) {
      drawImage(imgToDraw, currentFilter);
    } else {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if(context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [image, editedImage, activeImage, currentFilter, drawImage]);

  const resetAll = () => {
    setImage(null);
    setEditedImage(null);
    setActiveImage('original');
    setIsProcessing(false);
    setError(null);
    setPrompt('A beautiful beach');
    setCurrentTool('ai');
    setIsCropping(false);
    setCropRect(null);
    setStartCropPos(null);
    setCurrentFilter('none');
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
    if (canvas && (image || editedImage)) {
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleAiAction = async (action: 'remove' | 'replace') => {
      const canvas = canvasRef.current;
      const imgToProcess = (activeImage === 'edited' && editedImage) ? editedImage : image;
      if (!imgToProcess || !canvas) return;
      
      setIsProcessing(true);
      setError(null);
      
      // We need to get the image data from the current canvas state to preserve any edits
      const imageDataUrl = canvas.toDataURL();

      try {
        let result;
        if (action === 'remove') {
          result = await removeImageBackgroundAction(imageDataUrl);
        } else {
          result = await replaceImageBackgroundAction({ image: imageDataUrl, prompt });
        }
        
        if (!result) throw new Error('The operation returned an empty result.');
        if (result.error) throw new Error(result.error);
        
        if (result.image) {
          const img = new Image();
          img.onload = () => {
            setEditedImage(img);
            setActiveImage('edited');
            setCurrentFilter('none'); // Reset filter after AI action
          };
          img.src = result.image;
        }
      } catch (e: any) {
        setError(e.message);
        toast({ variant: 'destructive', title: 'Error', description: e.message });
      } finally {
        setIsProcessing(false);
      }
  }

  // Crop Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isCropping) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      setStartCropPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isCropping || !startCropPos) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      
      const newRect = {
        x: Math.min(startCropPos.x, currentX),
        y: Math.min(startCropPos.y, currentY),
        width: Math.abs(currentX - startCropPos.x),
        height: Math.abs(currentY - startCropPos.y),
      };
      
      // Redraw image and then the crop rectangle
      const imgToDraw = activeImage === 'edited' && editedImage ? editedImage : image;
      if(imgToDraw) {
        const ctx = canvas.getContext('2d');
        if(ctx) {
            drawImage(imgToDraw, currentFilter);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.clearRect(newRect.x, newRect.y, newRect.width, newRect.height);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.strokeRect(newRect.x, newRect.y, newRect.width, newRect.height);
        }
      }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isCropping || !startCropPos) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      
      setCropRect({
        x: Math.min(startCropPos.x, endX),
        y: Math.min(startCropPos.y, endY),
        width: Math.abs(endX - startCropPos.x),
        height: Math.abs(endY - startCropPos.y),
      });

      setStartCropPos(null);
  };
  
  const applyCrop = () => {
    if (!cropRect) return;
    const canvas = canvasRef.current;
    const imgToCrop = (activeImage === 'edited' && editedImage) ? editedImage : image;
    if (!canvas || !imgToCrop) return;
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    tempCanvas.width = cropRect.width;
    tempCanvas.height = cropRect.height;
    
    tempCtx.drawImage(imgToCrop, cropRect.x, cropRect.y, cropRect.width, cropRect.height, 0, 0, cropRect.width, cropRect.height);
    
    const newImage = new Image();
    newImage.onload = () => {
        setEditedImage(newImage);
        setActiveImage('edited');
    }
    newImage.src = tempCanvas.toDataURL();
    
    cancelCrop();
  };

  const cancelCrop = () => {
    setIsCropping(false);
    setCropRect(null);
    setStartCropPos(null);
    // Redraw to remove crop rectangle overlay
    const imgToDraw = activeImage === 'edited' && editedImage ? editedImage : image;
    if (imgToDraw) drawImage(imgToDraw, currentFilter);
  };
  
  // Filter Handler
  const applyFilter = (filter: Filter) => {
    setCurrentFilter(filter);
    const canvas = canvasRef.current;
    const imgToFilter = (activeImage === 'edited' && editedImage) ? editedImage : image;
    if (!canvas || !imgToFilter) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if(!tempCtx) return;

    tempCanvas.width = imgToFilter.width;
    tempCanvas.height = imgToFilter.height;
    tempCtx.filter = `${filter}(1)`;
    tempCtx.drawImage(imgToFilter, 0, 0);

    const newImage = new Image();
    newImage.onload = () => {
        setEditedImage(newImage);
        setActiveImage('edited');
    };
    newImage.src = tempCanvas.toDataURL();
    setCurrentFilter('none'); // Reset filter state after applying
  };


  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <div className="w-full md:w-80 border-b md:border-r p-4 space-y-6 overflow-y-auto">
        <h2 className="text-xl font-bold">Image Editor</h2>
        
        {image ? (
            <div className="space-y-6">
                <Tabs value={currentTool} onValueChange={(v) => setCurrentTool(v as Tool)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="ai"><Wand2 className="w-4 h-4 mr-2"/>AI Tools</TabsTrigger>
                    <TabsTrigger value="crop"><Crop className="w-4 h-4 mr-2"/>Crop</TabsTrigger>
                    <TabsTrigger value="filters"><Wand className="w-4 h-4 mr-2"/>Filters</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ai" className="mt-4 p-4 border rounded-lg space-y-4">
                     <Button onClick={() => handleAiAction('remove')} className="w-full" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4" />}
                        Remove Background
                    </Button>
                    <div className="space-y-2">
                        <Label htmlFor="bg-prompt">Replace Background Prompt:</Label>
                        <Input id="bg-prompt" placeholder="e.g. A beautiful beach" value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isProcessing}/>
                    </div>
                    <Button onClick={() => handleAiAction('replace')} className="w-full" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                        Replace Background
                    </Button>
                  </TabsContent>
                   <TabsContent value="crop" className="mt-4 p-4 border rounded-lg space-y-4">
                      {!isCropping ? (
                        <Button onClick={() => setIsCropping(true)} className="w-full">
                            <Crop className="mr-2 h-4 w-4"/> Start Cropping
                        </Button>
                      ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground text-center">Draw a rectangle on the image to crop.</p>
                            <Button onClick={applyCrop} className="w-full" disabled={!cropRect}>
                                <Check className="mr-2 h-4 w-4"/> Apply Crop
                            </Button>
                             <Button onClick={cancelCrop} className="w-full" variant="ghost">
                                <X className="mr-2 h-4 w-4"/> Cancel
                            </Button>
                        </div>
                      )}
                  </TabsContent>
                  <TabsContent value="filters" className="mt-4 p-4 border rounded-lg space-y-2">
                      <Button onClick={() => applyFilter('grayscale')} className="w-full" variant="outline">Grayscale</Button>
                      <Button onClick={() => applyFilter('sepia')} className="w-full" variant="outline">Sepia</Button>
                      <Button onClick={() => applyFilter('invert')} className="w-full" variant="outline">Invert</Button>
                  </TabsContent>
                </Tabs>
                
                <div className='p-4 border rounded-lg space-y-4'>
                    <Button onClick={handleDownload} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Image
                    </Button>
                     <Button onClick={resetAll} className="w-full" variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Start Over
                    </Button>
                </div>

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
                 <canvas 
                    ref={canvasRef} 
                    className={cn("border shadow-md max-w-full max-h-full", {
                      "cursor-crosshair": isCropping,
                    })}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                 />
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
