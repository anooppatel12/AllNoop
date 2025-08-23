'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Download, Trash2, Wand2, RefreshCw, Crop, Wand, Check, X, Undo2, Redo2, UserSquare, Brush, Ratio } from 'lucide-react';
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
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Pen, Smile, Text, Highlighter, Underline, Strikethrough, Square, Circle, Minus, ArrowRight, Image as ImageIcon } from 'lucide-react';


type Tool = 'ai' | 'crop' | 'filters' | 'adjust';
type AdjustTool = 'erase' | 'restore';
type Filter = 'none' | 'grayscale' | 'sepia' | 'invert' | 'noisy' | 'stripe';
type ExportFormat = 'png' | 'jpeg';

type EditHistory = {
    image: HTMLImageElement;
    filter: Filter;
};

// Sample Emojis as base64
const emojis = {
  '😊': 'data:image/png;base64,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',
  '😂': 'data:image/png;base64,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',
};

export function ImageEditor() {
  const { toast } = useToast();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [editedImage, setEditedImage] = useState<HTMLImageElement | null>(null);
  
  const [history, setHistory] = useState<EditHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [currentTool, setCurrentTool] = useState<Tool>('ai');
  const [currentAdjustTool, setCurrentAdjustTool] = useState<AdjustTool>('erase');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState<'remove' | 'replace' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('A beautiful beach');
  
  // Cropping state
  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  const [startCropPos, setStartCropPos] = useState<{x: number, y: number} | null>(null);
  const [isCropAspectRatioLocked, setIsCropAspectRatioLocked] = useState(false);
  
  // Filter state
  const [currentFilter, setCurrentFilter] = useState<Filter>('none');
  
  // Brush state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);

  // Export state
  const [resizeWidth, setResizeWidth] = useState<number>(0);
  const [resizeHeight, setResizeHeight] = useState<number>(0);
  const [isResizeAspectRatioLocked, setIsResizeAspectRatioLocked] = useState(true);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [jpegQuality, setJpegQuality] = useState(0.9);
  
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
          setHistoryIndex(prev => prev - 1);
      }
  };
  
  useEffect(() => {
      if (historyIndex >= 0 && history[historyIndex]) {
          const { image: stateImage, filter: stateFilter } = history[historyIndex];
          setEditedImage(stateImage);
          if(stateImage){
            setResizeWidth(stateImage.width);
            setResizeHeight(stateImage.height);
          }
          setCurrentFilter(stateFilter);
      } else if (image) {
          setEditedImage(image);
          setResizeWidth(image.width);
          setResizeHeight(image.height);
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
    setIsCropAspectRatioLocked(false);
    setCurrentFilter('none');
    setHistory([]);
    setHistoryIndex(-1);
    setResizeWidth(0);
    setResizeHeight(0);
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
            setResizeWidth(img.width);
            setResizeHeight(img.height);
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
    const imgToDownload = editedImage || image;
    if (!imgToDownload) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if(!tempCtx) return;

    tempCanvas.width = resizeWidth;
    tempCanvas.height = resizeHeight;

    tempCtx.drawImage(imgToDownload, 0, 0, resizeWidth, resizeHeight);

    const link = document.createElement('a');
    link.download = `edited-image.${exportFormat}`;
    link.href = tempCanvas.toDataURL(`image/${exportFormat}`, exportFormat === 'jpeg' ? jpegQuality : undefined);
    link.click();
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

  // Crop and Brush Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      
      if (currentTool === 'crop') {
        if (!isCropping) return;
        setStartCropPos(pos);
      } else if (currentTool === 'adjust') {
        setIsDrawing(true);
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const currentPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      if (currentTool === 'crop') {
        if (!isCropping || !startCropPos) return;
      
        let width = Math.abs(currentPos.x - startCropPos.x);
        let height = Math.abs(currentPos.y - startCropPos.y);

        if (isCropAspectRatioLocked) {
            width = height = Math.max(width, height);
        }
        
        const newRect = {
            x: Math.min(startCropPos.x, currentPos.x),
            y: Math.min(startCropPos.y, currentPos.y),
            width: width,
            height: height,
        };
        if(currentPos.x < startCropPos.x) {
            newRect.x = startCropPos.x - width;
        }
        if(currentPos.y < startCropPos.y) {
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
      } else if (currentTool === 'adjust') {
         if (!isDrawing) return;
         const ctx = canvas.getContext('2d');
         if (!ctx) return;
         ctx.lineTo(currentPos.x, currentPos.y);
         ctx.strokeStyle = 'red'; // visual indicator
         ctx.lineWidth = brushSize;
         ctx.lineCap = 'round';
         ctx.lineJoin = 'round';
         
         if (currentAdjustTool === 'erase') {
            ctx.globalCompositeOperation = 'destination-out';
         } else { // restore
            ctx.globalCompositeOperation = 'source-over';
         }
         ctx.stroke();
         ctx.globalCompositeOperation = 'source-over'; // reset
      }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (currentTool === 'crop') {
        if (!isCropping || !startCropPos) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        let width = Math.abs(endX - startCropPos.x);
        let height = Math.abs(endY - startCropPos.y);
        
        if (isCropAspectRatioLocked) {
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
      } else if (currentTool === 'adjust') {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        const imgToEdit = editedImage;
        if (!canvas || !imgToEdit) return;

        const newImage = new Image();
        newImage.onload = () => {
          setEditedImage(newImage);
          updateHistory(newImage);
        };
        newImage.src = canvas.toDataURL();
      }
  };
  
  const applyCrop = () => {
    if (!cropRect) return;
    const canvas = canvasRef.current;
    const imgToCrop = editedImage || image;
    if (!canvas || !imgToCrop) return;
    
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
    setIsCropAspectRatioLocked(false);
    const imgToDraw = editedImage || image;
    if (imgToDraw) drawImage(imgToDraw, currentFilter);
  };
  
  const applyFilter = (filter: Filter) => {
    const canvas = canvasRef.current;
    const imgToFilter = image;
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
        setCurrentFilter('none');
        updateHistory(newImage);
    };
    newImage.src = tempCanvas.toDataURL();
  };
  
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    setResizeWidth(newWidth);
    if(isResizeAspectRatioLocked && image){
      const aspectRatio = image.width / image.height;
      setResizeHeight(Math.round(newWidth / aspectRatio));
    }
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    setResizeHeight(newHeight);
    if(isResizeAspectRatioLocked && image){
      const aspectRatio = image.width / image.height;
      setResizeWidth(Math.round(newHeight * aspectRatio));
    }
  }


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
                      <Button onClick={resetAll} variant="destructive" size="icon"><RefreshCw /></Button>
                    </div>
                </div>
                <Tabs value={currentTool} onValueChange={(v) => setCurrentTool(v as Tool)} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="ai"><Wand2/></TabsTrigger>
                    <TabsTrigger value="crop"><Crop/></TabsTrigger>
                    <TabsTrigger value="filters"><Wand/></TabsTrigger>
                    <TabsTrigger value="adjust"><Brush/></TabsTrigger>
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
                            <Button onClick={() => { setIsCropping(true); setIsCropAspectRatioLocked(false); }} className="w-full">
                                <Crop className="mr-2 h-4 w-4"/> Freeform Crop
                            </Button>
                            <Button onClick={() => { setIsCropping(true); setIsCropAspectRatioLocked(true); }} className="w-full">
                                <UserSquare className="mr-2 h-4 w-4"/> Square (1:1)
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
                   <TabsContent value="adjust" className="mt-4 p-4 border rounded-lg space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <Button onClick={() => setCurrentAdjustTool('erase')} variant={currentAdjustTool === 'erase' ? 'default' : 'outline'}>Erase</Button>
                            <Button onClick={() => setCurrentAdjustTool('restore')} variant={currentAdjustTool === 'restore' ? 'default' : 'outline'}>Restore</Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Brush Size: {brushSize}px</Label>
                            <Slider defaultValue={[brushSize]} max={100} min={5} step={1} onValueChange={([v]) => setBrushSize(v)} />
                        </div>
                        <p className="text-xs text-muted-foreground">Draw on the image to erase or restore parts. Note: This tool works best on images with transparent backgrounds.</p>
                  </TabsContent>
                </Tabs>
                
                <div className="p-4 border rounded-lg space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Export</h3>
                      <div className="space-y-2">
                          <Label>Resize</Label>
                          <div className="flex items-center gap-2">
                              <Input type="number" placeholder="Width" value={resizeWidth} onChange={handleWidthChange}/>
                              <Ratio className={cn("h-6 w-6 cursor-pointer", isResizeAspectRatioLocked ? "text-primary": "text-muted-foreground")} onClick={() => setIsResizeAspectRatioLocked(prev => !prev)}/>
                              <Input type="number" placeholder="Height" value={resizeHeight} onChange={handleHeightChange}/>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <Label>Format</Label>
                          <Select value={exportFormat} onValueChange={(v: ExportFormat) => setExportFormat(v)}>
                              <SelectTrigger><SelectValue/></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="png">PNG</SelectItem>
                                  <SelectItem value="jpeg">JPEG</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      {exportFormat === 'jpeg' && (
                          <div className="space-y-2">
                              <Label>Quality: {Math.round(jpegQuality * 100)}%</Label>
                              <Slider value={[jpegQuality]} onValueChange={([v]) => setJpegQuality(v)} min={0.1} max={1} step={0.1} />
                          </div>
                      )}
                       <Button onClick={handleDownload} className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download Image
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
                      "cursor-crosshair": isCropping || currentTool === 'adjust',
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


function SignatureDialog({ setSignature, setCurrentTool, currentTool }: { setSignature: (sig: string | null) => void, setCurrentTool: (tool: EditorTool) => void, currentTool: EditorTool }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [typedSignature, setTypedSignature] = useState('');
    const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = signatureCanvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        
        setIsDrawing(true);
        const pos = getPos(e, canvas);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = signatureCanvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        const pos = getPos(e, canvas);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };
    
     const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        const touch = "touches" in e ? e.touches[0] : null;
        return {
            x: (touch ? touch.clientX : (e as React.MouseEvent).clientX) - rect.left,
            y: (touch ? touch.clientY : (e as React.MouseEvent).clientY) - rect.top
        };
    };

    const stopDrawing = () => setIsDrawing(false);

    const clearSignature = () => {
        const canvas = signatureCanvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleSaveSignature = (type: 'draw' | 'type' | 'upload', data?: string) => {
        if (type === 'draw') {
            const canvas = signatureCanvasRef.current;
            if(!canvas) return;
            const dataUrl = canvas.toDataURL('image/png');
            setSignature(dataUrl);
        } else if (type === 'type') {
            // Create a canvas to draw the typed signature
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 150;
            const ctx = canvas.getContext('2d');
            if(!ctx) return;
            ctx.font = '50px "Homemade Apple", cursive';
            ctx.fillText(typedSignature, 20, 80);
            setSignature(canvas.toDataURL('image/png'));
        } else if(type === 'upload' && data){
            setSignature(data);
        }
        
        setCurrentTool('signature');
        setDialogOpen(false);
    };
    
    const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]){
            const reader = new FileReader();
            reader.onload = (event) => {
                if(event.target && typeof event.target.result === 'string'){
                    handleSaveSignature('upload', event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant={currentTool === 'signature' ? 'default' : 'outline'} size="icon" aria-label="Signature">
                    <Pen/>
                </Button>
            </DialogTrigger>
            <DialogContent onOpenAutoFocus={(e) => {
                const canvas = signatureCanvasRef.current;
                if(canvas) {
                    const ctx = canvas.getContext('2d');
                    if(ctx) {
                        ctx.strokeStyle = '#000000';
                        ctx.lineWidth = 2;
                    }
                }
            }}>
                <DialogHeader>
                    <DialogTitle>Add Signature</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="draw" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="draw">Draw</TabsTrigger>
                        <TabsTrigger value="type">Type</TabsTrigger>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="draw" className="mt-4">
                        <canvas 
                            ref={signatureCanvasRef} 
                            width="400" 
                            height="150" 
                            className="border rounded-md bg-white"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseOut={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="ghost" onClick={clearSignature}>Clear</Button>
                            <Button onClick={() => handleSaveSignature('draw')}>Save Signature</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="type" className="mt-4 space-y-4">
                        <Input 
                            placeholder="Type your name" 
                            value={typedSignature} 
                            onChange={(e) => setTypedSignature(e.target.value)} 
                            className="font-[Homemade_Apple] text-2xl h-12"
                            style={{fontFamily: "'Homemade Apple', cursive"}}
                        />
                        <div className="mt-4 flex justify-end">
                            <Button onClick={() => handleSaveSignature('type')} disabled={!typedSignature}>Save Signature</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="upload" className="mt-4">
                        <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-8 text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-sm text-muted-foreground">Upload an image of your signature.</p>
                            <Input id="sig-upload" type="file" className="sr-only" onChange={handleSignatureUpload} accept="image/png, image/jpeg" />
                            <Label htmlFor="sig-upload" className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                                Browse Image
                            </Label>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}


function StickerDialog({ setSticker, setCurrentTool, currentTool }: { setSticker: (sticker: string | null) => void, setCurrentTool: (tool: EditorTool) => void, currentTool: EditorTool }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    
    const selectSticker = (emoji: string) => {
        setSticker(emoji);
        setCurrentTool('sticker');
        setDialogOpen(false);
    };

    return (
         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant={currentTool === 'sticker' ? 'default' : 'outline'} size="icon" aria-label="Sticker">
                    <Smile/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Choose a Sticker</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-4">
                    {Object.entries(emojis).map(([text, dataUrl]) => (
                        <Button
                            key={text}
                            variant="outline"
                            className="h-20 w-20 text-4xl"
                            onClick={() => selectSticker(dataUrl)}
                        >
                        <img src={dataUrl} alt={text} />
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
