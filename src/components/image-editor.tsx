'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Download, Trash2, Wand2, RefreshCw, Crop, Wand, Check, X, Undo2, Redo2, UserSquare } from 'lucide-react';
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
type Filter = 'none' | 'grayscale' | 'sepia' | 'invert' | 'noisy' | 'stripe';
type EditHistory = {
    image: HTMLImageElement;
    filter: Filter;
};

export function ImageEditor() {
  const { toast } = useToast();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [editedImage, setEditedImage] = useState<HTMLImageElement | null>(null);
  
  const [history, setHistory] = useState<EditHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [currentTool, setCurrentTool] = useState<Tool>('ai');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState<'remove' | 'replace' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('A beautiful beach');
  
  // Cropping state
  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  const [startCropPos, setStartCropPos] = useState<{x: number, y: number} | null>(null);
  const [isAspectRatioLocked, setIsAspectRatioLocked] = useState(false);
  
  // Filter state
  const [currentFilter, setCurrentFilter] = useState<Filter>('none');
  
  const updateHistory = (newImage: HTMLImageElement, newFilter: Filter = 'none') => {
      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, { image: newImage, filter: newFilter }]);
      setHistoryIndex(newHistory.length);
  };
  
  const undo = () => {
      if (historyIndex > 0) {
          setHistoryIndex(prev => prev - 1);
      }
  };
  
  const redo = () => {
      if (historyIndex < history.length - 1) {
          setHistoryIndex(prev => prev + 1);
      }
  };
  
  useEffect(() => {
      if (historyIndex >= 0 && history[historyIndex]) {
          const { image: stateImage, filter: stateFilter } = history[historyIndex];
          setEditedImage(stateImage);
          setCurrentFilter(stateFilter);
      } else if (image) {
          setEditedImage(image);
          setCurrentFilter('none');
      }
  }, [historyIndex, history, image]);

  const drawImage = useCallback((img: HTMLImageElement, filter: Filter = 'none') => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    context.filter = 'none';
    if (['grayscale', 'sepia', 'invert'].includes(filter)) {
        context.filter = `${filter}(1)`;
    }
    
    context.drawImage(img, 0, 0);
    context.filter = 'none'; // Reset filter after drawing

    if(filter === 'noisy') {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 50;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }
        context.putImageData(imageData, 0, 0);
    } else if (filter === 'stripe') {
        for (let i = 0; i < canvas.height; i += 10) {
            context.fillStyle = 'rgba(0, 0, 0, 0.1)';
            context.fillRect(0, i, canvas.width, 5);
        }
    }

  }, []);

  useEffect(() => {
    const imgToDraw = editedImage || image;
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
  }, [image, editedImage, currentFilter, drawImage]);

  const resetAll = () => {
    setImage(null);
    setEditedImage(null);
    setIsProcessing(false);
    setError(null);
    setPrompt('A beautiful beach');
    setCurrentTool('ai');
    setIsCropping(false);
    setCropRect(null);
    setStartCropPos(null);
    setIsAspectRatioLocked(false);
    setCurrentFilter('none');
    setHistory([]);
    setHistoryIndex(-1);
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
        img.onload = () => {
            setImage(img);
            setEditedImage(img);
            updateHistory(img);
        };
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
      const imgToProcess = editedImage || image;
      if (!imgToProcess) return;
      
      setIsProcessing(true);
      setProcessingAction(action);
      setError(null);
      
      const canvas = document.createElement('canvas');
      canvas.width = imgToProcess.width;
      canvas.height = imgToProcess.height;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;
      ctx.drawImage(imgToProcess, 0, 0);
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
            updateHistory(img);
          };
          img.src = result.image;
        }
      } catch (e: any) {
        setError(e.message);
        toast({ variant: 'destructive', title: 'Error', description: e.message });
      } finally {
        setIsProcessing(false);
        setProcessingAction(null);
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
      
      let width = Math.abs(currentX - startCropPos.x);
      let height = Math.abs(currentY - startCropPos.y);

      if (isAspectRatioLocked) {
        width = height = Math.max(width, height);
      }
      
      const newRect = {
        x: Math.min(startCropPos.x, currentX),
        y: Math.min(startCropPos.y, currentY),
        width: width,
        height: height,
      };
       if(currentX < startCropPos.x) {
        newRect.x = startCropPos.x - width;
      }
      if(currentY < startCropPos.y) {
        newRect.y = startCropPos.y - height;
      }
      
      const imgToDraw = editedImage || image;
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

      let width = Math.abs(endX - startCropPos.x);
      let height = Math.abs(endY - startCropPos.y);
      
      if (isAspectRatioLocked) {
        width = height = Math.max(width, height);
      }
      
      const finalRect = {
        x: Math.min(startCropPos.x, endX),
        y: Math.min(startCropPos.y, endY),
        width: width,
        height: height,
      };

      if(endX < startCropPos.x) {
        finalRect.x = startCropPos.x - width;
      }
      if(endY < startCropPos.y) {
        finalRect.y = startCropPos.y - height;
      }
      
      setCropRect(finalRect);
      setStartCropPos(null);
  };
  
  const applyCrop = () => {
    if (!cropRect) return;
    const canvas = canvasRef.current;
    const imgToCrop = editedImage || image;
    if (!canvas || !imgToCrop) return;
    
    // Scale cropRect from canvas size to image size
    const scaleX = imgToCrop.width / canvas.width;
    const scaleY = imgToCrop.height / canvas.height;
    
    const sourceX = cropRect.x * scaleX;
    const sourceY = cropRect.y * scaleY;
    const sourceWidth = cropRect.width * scaleX;
    const sourceHeight = cropRect.height * scaleY;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    tempCanvas.width = sourceWidth;
    tempCanvas.height = sourceHeight;
    
    tempCtx.drawImage(imgToCrop, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
    
    const newImage = new Image();
    newImage.onload = () => {
        setEditedImage(newImage);
        updateHistory(newImage);
    }
    newImage.src = tempCanvas.toDataURL();
    
    cancelCrop();
  };

  const cancelCrop = () => {
    setIsCropping(false);
    setCropRect(null);
    setStartCropPos(null);
    setIsAspectRatioLocked(false);
    const imgToDraw = editedImage || image;
    if (imgToDraw) drawImage(imgToDraw, currentFilter);
  };
  
  const applyFilter = (filter: Filter) => {
    const canvas = canvasRef.current;
    const imgToFilter = image; // Always apply filters to the original image
    if (!canvas || !imgToFilter) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    if(!tempCtx) return;

    tempCanvas.width = imgToFilter.width;
    tempCanvas.height = imgToFilter.height;
    
    tempCtx.filter = 'none';
    if (['grayscale', 'sepia', 'invert'].includes(filter)) {
      tempCtx.filter = `${filter}(1)`;
    }
    tempCtx.drawImage(imgToFilter, 0, 0);
    tempCtx.filter = 'none';

    if (filter === 'noisy') {
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 50;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }
        tempCtx.putImageData(imageData, 0, 0);
    } else if (filter === 'stripe') {
        for (let i = 0; i < tempCanvas.height; i += 10) {
            tempCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            tempCtx.fillRect(0, i, tempCanvas.width, 5);
        }
    }
    
    const newImage = new Image();
    newImage.onload = () => {
        setEditedImage(newImage);
        setCurrentFilter('none'); // The filter is baked in, so reset preview filter
        updateHistory(newImage);
    };
    newImage.src = tempCanvas.toDataURL();
  };


  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <div className="w-full md:w-80 border-b md:border-r p-4 space-y-6 overflow-y-auto">
        <h2 className="text-xl font-bold">Image Editor</h2>
        
        {image ? (
            <div className="space-y-6">
                 <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-center gap-2">
                      <Button onClick={undo} disabled={historyIndex <= 0} variant="outline" size="icon"><Undo2 /></Button>
                      <Button onClick={redo} disabled={historyIndex >= history.length - 1} variant="outline" size="icon"><Redo2 /></Button>
                    </div>
                </div>
                <Tabs value={currentTool} onValueChange={(v) => setCurrentTool(v as Tool)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="ai"><Wand2 className="w-4 h-4 mr-2"/>AI Tools</TabsTrigger>
                    <TabsTrigger value="crop"><Crop className="w-4 h-4 mr-2"/>Crop</TabsTrigger>
                    <TabsTrigger value="filters"><Wand className="w-4 h-4 mr-2"/>Filters</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ai" className="mt-4 p-4 border rounded-lg space-y-4">
                     <Button onClick={() => handleAiAction('remove')} className="w-full" disabled={isProcessing}>
                        {isProcessing && processingAction === 'remove' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4" />}
                        Remove Background
                    </Button>
                    <div className="space-y-2">
                        <Label htmlFor="bg-prompt">Replace Background Prompt:</Label>
                        <Input id="bg-prompt" placeholder="e.g. A beautiful beach" value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isProcessing}/>
                    </div>
                    <Button onClick={() => handleAiAction('replace')} className="w-full" disabled={isProcessing}>
                        {isProcessing && processingAction === 'replace' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                        Replace Background
                    </Button>
                  </TabsContent>
                   <TabsContent value="crop" className="mt-4 p-4 border rounded-lg space-y-4">
                      {!isCropping ? (
                        <div className="space-y-2">
                            <Button onClick={() => { setIsCropping(true); setIsAspectRatioLocked(false); }} className="w-full">
                                <Crop className="mr-2 h-4 w-4"/> Freeform Crop
                            </Button>
                            <Button onClick={() => { setIsCropping(true); setIsAspectRatioLocked(true); }} className="w-full">
                                <UserSquare className="mr-2 h-4 w-4"/> Profile Picture (1:1)
                            </Button>
                        </div>
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
                  <TabsContent value="filters" className="mt-4 p-4 border rounded-lg grid grid-cols-2 gap-2">
                      <Button onClick={() => applyFilter('grayscale')} variant="outline">Grayscale</Button>
                      <Button onClick={() => applyFilter('sepia')} variant="outline">Sepia</Button>
                      <Button onClick={() => applyFilter('invert')} variant="outline">Invert</Button>
                      <Button onClick={() => applyFilter('noisy')} variant="outline">Noisy</Button>
                      <Button onClick={() => applyFilter('stripe')} variant="outline">Stripe</Button>
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
