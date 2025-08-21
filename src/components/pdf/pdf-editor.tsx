'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, Loader2, Download, Text, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Highlighter, Underline, Strikethrough, Square, Circle, Minus, ArrowRight, Pen, Image as ImageIcon, Smile } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFImage } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type EditorTool = 'text' | 'highlight' | 'underline' | 'strikethrough' | 'square' | 'circle' | 'line' | 'arrow' | 'signature' | 'sticker';

type BaseObject = {
  id: number;
  pageIndex: number;
}

type TextObject = BaseObject & {
  type: 'text';
  text: string;
  x: number;
  y: number;
  font: string;
  size: number;
  color: { r: number, g: number, b: number };
};

type ShapeObject = BaseObject & {
    type: 'shape';
    shape: 'rect' | 'line' | 'square' | 'circle' | 'arrow';
    x: number;
    y: number;
    width: number;
    height: number;
    color: { r: number, g: number, b: number };
    opacity: number;
    endX?: number;
    endY?: number;
    thickness?: number;
}

type ImageObject = BaseObject & {
    type: 'image';
    bytes: Uint8Array;
    x: number;
    y: number;
    width: number;
    height: number;
}

type EditorObject = TextObject | ShapeObject | ImageObject;


// Sample Emojis as base64
const emojis = {
  '😊': 'data:image/png;base64,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',
  '😂': 'data:image/png;base64,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',
};

export function PdfEditor() {
  const { toast } = useToast();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pdfjsDoc, setPdfjsDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Tool states
  const [currentTool, setCurrentTool] = useState<EditorTool>('text');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);

  // Tool options
  const [textToAdd, setTextToAdd] = useState<string>('Your Text');
  const [fontSize, setFontSize] = useState<number>(24);
  const [font, setFont] = useState<string>('Helvetica');
  const [color, setColor] = useState<string>('#000000');
  
  const [signature, setSignature] = useState<string | null>(null); // base64
  const [sticker, setSticker] = useState<string | null>(null); // base64

  const [objects, setObjects] = useState<EditorObject[]>([]);
  
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objectIdCounter, setObjectIdCounter] = useState(0);


  const renderPage = useCallback(async (pageNumber: number) => {
    if (!pdfjsDoc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsProcessing(true);
    try {
      const page = await pdfjsDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: zoom });

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const context = canvas.getContext('2d');
      if (!context) return;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      
      await page.render(renderContext).promise;

      // Draw added objects on top
      const pageObjects = objects.filter(o => o.pageIndex === pageNumber - 1);
      for (const obj of pageObjects) {
          if(obj.type === 'text') {
            context.fillStyle = `rgb(${obj.color.r * 255}, ${obj.color.g * 255}, ${obj.color.b * 255})`;
            context.font = `${obj.size * zoom}px ${obj.font}`;
            context.fillText(obj.text, obj.x * zoom, viewport.height - (obj.y * zoom));
          } else if (obj.type === 'shape') {
            context.fillStyle = `rgba(${obj.color.r * 255}, ${obj.color.g * 255}, ${obj.color.b * 255}, ${obj.opacity})`;
            context.strokeStyle = `rgba(${obj.color.r * 255}, ${obj.color.g * 255}, ${obj.color.b * 255}, ${obj.opacity})`;
            
            if(obj.shape === 'rect' || obj.shape === 'square') {
                const canvasY = viewport.height - (obj.y * zoom);
                context.fillRect(obj.x * zoom, canvasY, obj.width * zoom, obj.height * zoom);
            } else if (obj.shape === 'line' || obj.shape === 'arrow') {
                context.lineWidth = (obj.thickness || 1) * zoom;
                context.beginPath();
                context.moveTo(obj.x * zoom, viewport.height - (obj.y * zoom));
                context.lineTo((obj.endX || 0) * zoom, viewport.height - (obj.endY || 0) * zoom);
                context.stroke();

                if(obj.shape === 'arrow' && obj.endX && obj.endY) {
                    const angle = Math.atan2((obj.endY - obj.y), (obj.endX - obj.x));
                    const headlen = 10;
                    context.beginPath();
                    context.moveTo(obj.endX * zoom, viewport.height - obj.endY * zoom);
                    context.lineTo(
                        (obj.endX - headlen * Math.cos(angle - Math.PI / 6)) * zoom, 
                        viewport.height - ((obj.endY - headlen * Math.sin(angle - Math.PI / 6)) * zoom)
                    );
                    context.moveTo(obj.endX * zoom, viewport.height - obj.endY * zoom);
                    context.lineTo(
                        (obj.endX - headlen * Math.cos(angle + Math.PI / 6)) * zoom,
                        viewport.height - ((obj.endY - headlen * Math.sin(angle + Math.PI / 6)) * zoom)
                    );
                    context.stroke();
                }

            } else if(obj.shape === 'circle') {
                const radius = obj.width / 2;
                context.beginPath();
                context.arc((obj.x + radius) * zoom, viewport.height - ((obj.y - radius) * zoom), radius * zoom, 0, 2 * Math.PI, false);
                context.fill();
            }
          } else if (obj.type === 'image') {
              const image = new Image();
              image.src = `data:image/png;base64,${btoa(String.fromCharCode(...obj.bytes))}`;
              image.onload = () => {
                context.drawImage(image, obj.x * zoom, viewport.height - (obj.y * zoom) - (obj.height * zoom), obj.width * zoom, obj.height * zoom);
              }
          }
      }

    } catch (e: any) {
        toast({variant: 'destructive', title: 'Error rendering page', description: e.message});
    } finally {
      setIsProcessing(false);
    }
  }, [pdfjsDoc, objects, zoom, toast]);

  useEffect(() => {
    if (pdfjsDoc) {
      renderPage(currentPage);
    }
  }, [pdfjsDoc, currentPage, renderPage, zoom, objects]);
  

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPdfFile(file);
      setIsProcessing(true);
      try {
        const pdfBytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(pdfBytes);
        const pdfjsDocProxy = await pdfjs.getDocument({ data: pdfBytes }).promise;
        setPdfDoc(doc);
        setPdfjsDoc(pdfjsDocProxy);
        setNumPages(doc.getPageCount());
        setCurrentPage(1);
        setObjects([]);
      } catch (e: any) {
          toast({variant: 'destructive', title: 'Error loading PDF', description: e.message});
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
   const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left);
      const y = (event.clientY - rect.top);
      // Convert to PDF coordinates (scaled)
      return { x: x / zoom, y: (canvas.height - y) / zoom, canvasY: y / zoom };
  };

  const handleMouseDown = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(event);
    if (!coords) return;
    
    if (currentTool === 'text') {
        const newTextObject: TextObject = {
            id: objectIdCounter,
            type: 'text',
            text: textToAdd,
            x: coords.x, y: coords.y,
            font, size: fontSize,
            color: hexToRgb(color) || {r: 0, g: 0, b: 0},
            pageIndex: currentPage - 1
        };
        setObjectIdCounter(prev => prev + 1);
        setObjects(prev => [...prev, newTextObject]);
    } else if (currentTool === 'signature' && signature) {
        const signatureBytes = Uint8Array.from(atob(signature.split(',')[1]), c => c.charCodeAt(0));
        const newImageObject: ImageObject = {
            id: objectIdCounter,
            type: 'image',
            bytes: signatureBytes,
            x: coords.x, y: coords.y,
            width: 150, height: 75, // default size
            pageIndex: currentPage - 1
        };
        setObjectIdCounter(prev => prev + 1);
        setObjects(prev => [...prev, newImageObject]);
    } else if (currentTool === 'sticker' && sticker) {
        const stickerBytes = Uint8Array.from(atob(sticker.split(',')[1]), c => c.charCodeAt(0));
         const newImageObject: ImageObject = {
            id: objectIdCounter,
            type: 'image',
            bytes: stickerBytes,
            x: coords.x, y: coords.y,
            width: 50, height: 50, // default size
            pageIndex: currentPage - 1
        };
        setObjectIdCounter(prev => prev + 1);
        setObjects(prev => [...prev, newImageObject]);
        setSticker(null); // Deselect sticker after placing
    } else {
        setIsDrawing(true);
        setStartPos({ x: coords.x, y: coords.y });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    setIsDrawing(false);
    
    const endCoords = getCanvasCoordinates(event);
    if (!endCoords) return;

    let newShape: ShapeObject;

    const baseShape = {
        id: objectIdCounter,
        type: 'shape' as const,
        x: Math.min(startPos.x, endCoords.x),
        y: Math.max(startPos.y, endCoords.y),
        width: Math.abs(endCoords.x - startPos.x),
        height: Math.abs(endCoords.y - startPos.y),
        pageIndex: currentPage - 1,
    }
    
    switch(currentTool) {
        case 'highlight':
            newShape = { ...baseShape, shape: 'rect', color: { r: 1, g: 1, b: 0 }, opacity: 0.3, y: startPos.y, height: 14 };
            break;
        case 'underline':
             newShape = { ...baseShape, shape: 'line', color: {r: 0, g: 0, b: 0}, opacity: 1.0, endX: endCoords.x, endY: startPos.y, thickness: 1, y: startPos.y, x: startPos.x };
            break;
        case 'strikethrough':
             newShape = { ...baseShape, shape: 'line', color: {r: 0, g: 0, b: 0}, opacity: 1.0, endX: endCoords.x, endY: startPos.y, thickness: 1, y: startPos.y, x: startPos.x };
            break;
        case 'square':
            const size = Math.max(baseShape.width, baseShape.height);
            newShape = { ...baseShape, shape: 'square', width: size, height: size, color: hexToRgb(color) || {r: 0, g: 0, b: 0}, opacity: 1 };
            break;
        case 'circle':
             const radius = Math.max(baseShape.width, baseShape.height);
             newShape = { ...baseShape, shape: 'circle', width: radius, height: radius, color: hexToRgb(color) || {r: 0, g: 0, b: 0}, opacity: 1 };
            break;
        case 'line':
             newShape = { ...baseShape, shape: 'line', endX: endCoords.x, endY: endCoords.y, x: startPos.x, y: startPos.y, thickness: 2, color: hexToRgb(color) || {r: 0, g: 0, b: 0}, opacity: 1.0 };
            break;
        case 'arrow':
             newShape = { ...baseShape, shape: 'arrow', endX: endCoords.x, endY: endCoords.y, x: startPos.x, y: startPos.y, thickness: 2, color: hexToRgb(color) || {r: 0, g: 0, b: 0}, opacity: 1.0 };
            break;
        default:
            setStartPos(null);
            return;
    }
    
    setObjectIdCounter(prev => prev + 1);
    setObjects(prev => [...prev, newShape]);
    setStartPos(null);
  };
  
   const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : null;
  };

  const handleSave = async () => {
    if (!pdfDoc) return;
    setIsProcessing(true);
    try {
        const fontCache: {[key: string]: PDFFont} = {};
        const imageCache: {[key: string]: PDFImage} = {};
        
        for(const obj of objects) {
            const page = pdfDoc.getPage(obj.pageIndex);
            
            if(obj.type === 'text') {
                if(!fontCache[obj.font]) {
                  fontCache[obj.font] = await pdfDoc.embedFont(obj.font as StandardFonts);
                }
                const embeddedFont = fontCache[obj.font];
                
                page.drawText(obj.text, {
                    x: obj.x,
                    y: obj.y,
                    font: embeddedFont,
                    size: obj.size,
                    color: rgb(obj.color.r, obj.color.g, obj.color.b),
                });
            } else if (obj.type === 'shape') {
                if(obj.shape === 'rect') {
                     page.drawRectangle({
                        x: obj.x,
                        y: obj.y - (obj.height / 2),
                        width: obj.width,
                        height: obj.height,
                        color: rgb(obj.color.r, obj.color.g, obj.color.b),
                        opacity: obj.opacity
                    });
                } else if (obj.shape === 'square') {
                    page.drawSquare({
                        x: obj.x,
                        y: obj.y - obj.height,
                        size: obj.width,
                        color: rgb(obj.color.r, obj.color.g, obj.color.b),
                        opacity: obj.opacity
                    });
                } else if (obj.shape === 'circle') {
                    page.drawCircle({
                        x: obj.x + (obj.width / 2),
                        y: obj.y - (obj.height / 2),
                        size: obj.width / 2,
                        color: rgb(obj.color.r, obj.color.g, obj.color.b),
                        opacity: obj.opacity
                    });
                } else if (obj.shape === 'line' || obj.shape === 'arrow') {
                    page.drawLine({
                        start: { x: obj.x, y: obj.y },
                        end: { x: obj.endX!, y: obj.endY! },
                        thickness: obj.thickness,
                        color: rgb(obj.color.r, obj.color.g, obj.color.b),
                        opacity: obj.opacity
                    });
                    if(obj.shape === 'arrow') {
                        const angle = Math.atan2((obj.endY! - obj.y), (obj.endX! - obj.x));
                        const headlen = 10;
                        const p1_x = obj.endX! - headlen * Math.cos(angle - Math.PI / 6);
                        const p1_y = obj.endY! - headlen * Math.sin(angle - Math.PI / 6);
                        const p2_x = obj.endX! - headlen * Math.cos(angle + Math.PI / 6);
                        const p2_y = obj.endY! - headlen * Math.sin(angle + Math.PI / 6);
                        page.drawLine({start: {x: obj.endX!, y: obj.endY!}, end: {x: p1_x, y: p1_y}, thickness: obj.thickness, color: rgb(obj.color.r, obj.color.g, obj.color.b), opacity: obj.opacity});
                        page.drawLine({start: {x: obj.endX!, y: obj.endY!}, end: {x: p2_x, y: p2_y}, thickness: obj.thickness, color: rgb(obj.color.r, obj.color.g, obj.color.b), opacity: obj.opacity});
                    }
                }
            } else if (obj.type === 'image') {
                const key = btoa(String.fromCharCode(...obj.bytes));
                if(!imageCache[key]) {
                    imageCache[key] = await pdfDoc.embedPng(obj.bytes);
                }
                const embeddedImage = imageCache[key];
                 page.drawImage(embeddedImage, {
                    x: obj.x,
                    y: obj.y - obj.height,
                    width: obj.width,
                    height: obj.height,
                });
            }
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pdfFile?.name.replace('.pdf', '') || 'edited'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        
    } catch(e: any) {
        toast({variant: 'destructive', title: 'Error saving PDF', description: e.message});
    } finally {
        setIsProcessing(false);
    }
  };
  
  const ToolButton = ({ tool, children }: { tool: EditorTool, children: React.ReactNode }) => (
    <Button
        variant={currentTool === tool ? 'default' : 'outline'}
        size="icon"
        onClick={() => setCurrentTool(tool)}
        aria-label={tool}
    >
        {children}
    </Button>
  )

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
        {/* Toolbar */}
        <div className="w-full md:w-80 border-b md:border-r p-4 space-y-6 overflow-y-auto">
            <h2 className="text-xl font-bold">PDF Editor</h2>
            
            {pdfFile ? (
              <>
                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Tools</h3>
                    <div className="flex flex-wrap gap-2">
                        <ToolButton tool="text"><Text/></ToolButton>
                        <ToolButton tool="highlight"><Highlighter/></ToolButton>
                        <ToolButton tool="underline"><Underline/></ToolButton>
                        <ToolButton tool="strikethrough"><Strikethrough/></ToolButton>
                        <ToolButton tool="square"><Square/></ToolButton>
                        <ToolButton tool="circle"><Circle/></ToolButton>
                        <ToolButton tool="line"><Minus/></ToolButton>
                        <ToolButton tool="arrow"><ArrowRight/></ToolButton>
                        <SignatureDialog setSignature={setSignature} setCurrentTool={setCurrentTool} currentTool={currentTool} />
                        <StickerDialog setSticker={setSticker} setCurrentTool={setCurrentTool} currentTool={currentTool} />
                    </div>

                    {(currentTool === 'text' || currentTool === 'square' || currentTool === 'circle' || currentTool === 'line' || currentTool === 'arrow') && (
                        <div className="p-4 border rounded-md space-y-4 animate-in fade-in-50">
                            {currentTool === 'text' ? (
                                <>
                                <div className="space-y-2">
                                    <Label htmlFor="text-input">Text</Label>
                                    <Input id="text-input" value={textToAdd} onChange={(e) => setTextToAdd(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="font-select">Font</Label>
                                    <Select value={font} onValueChange={setFont}>
                                        <SelectTrigger id="font-select"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={StandardFonts.Helvetica}>Helvetica</SelectItem>
                                            <SelectItem value={StandardFonts.TimesRoman}>Times New Roman</SelectItem>
                                            <SelectItem value={StandardFonts.Courier}>Courier</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="font-size">Size</Label>
                                    <Input id="font-size" type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} />
                                </div>
                                </>
                            ) : null}

                            <div className="space-y-2">
                                <Label htmlFor="color-picker">Color</Label>
                                <Input id="color-picker" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="p-1"/>
                            </div>
                        </div>
                    )}
                </div>

                <Button onClick={handleSave} disabled={isProcessing} className="w-full">
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4" />}
                    Save & Download
                </Button>
              </>
            ) : (
                <p className="text-sm text-muted-foreground">Upload a PDF to start editing.</p>
            )}

        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-muted/40">
            {!pdfFile ? (
                 <div className="flex-1 flex items-center justify-center p-8">
                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/50 p-12 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-sm text-muted-foreground">Upload your PDF to begin editing</p>
                        <Input id="pdf-upload" type="file" className="sr-only" onChange={handleFileChange} accept="application/pdf" />
                        <Label htmlFor="pdf-upload" className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                            Browse PDF
                        </Label>
                    </div>
                 </div>
            ) : (
                <>
                 <div className="flex items-center justify-center gap-4 p-2 border-b bg-background">
                     <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1 || isProcessing}><ChevronLeft/></Button>
                     <span>Page {currentPage} of {numPages}</span>
                     <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages || isProcessing}><ChevronRight/></Button>
                     <div className="w-px h-6 bg-border mx-2"></div>
                     <Button variant="outline" size="icon" onClick={() => setZoom(z => z - 0.2)} disabled={isProcessing}><ZoomOut/></Button>
                     <span>{Math.round(zoom * 100)}%</span>
                     <Button variant="outline" size="icon" onClick={() => setZoom(z => z + 0.2)} disabled={isProcessing}><ZoomIn/></Button>
                 </div>
                 <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
                     <canvas 
                        ref={canvasRef} 
                        className={cn("border shadow-md", {
                            'cursor-text': currentTool === 'text',
                            'cursor-crosshair': currentTool !== 'text' && currentTool !== 'signature' && currentTool !== 'sticker',
                            'cursor-copy': currentTool === 'signature' || currentTool === 'sticker'
                        })}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                     ></canvas>
                 </div>
                </>
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
