'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, Loader2, Download, Text, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Highlighter, Underline, Strikethrough } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

type EditorTool = 'text' | 'highlight' | 'underline' | 'strikethrough';

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
    shape: 'rect' | 'line';
    x: number;
    y: number;
    width: number;
    height: number;
    color: { r: number, g: number, b: number };
    opacity: number;
}

type EditorObject = TextObject | ShapeObject;


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

  // Text tool options
  const [textToAdd, setTextToAdd] = useState<string>('Your Text');
  const [fontSize, setFontSize] = useState<number>(24);
  const [font, setFont] = useState<string>('Helvetica');
  const [color, setColor] = useState<string>('#000000');

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
            // pdf-lib's y-origin is bottom-left, canvas is top-left.
            context.fillText(obj.text, obj.x * zoom, viewport.height - (obj.y * zoom));
          } else if (obj.type === 'shape') {
            context.fillStyle = `rgba(${obj.color.r * 255}, ${obj.color.g * 255}, ${obj.color.b * 255}, ${obj.opacity})`;
            context.strokeStyle = `rgba(${obj.color.r * 255}, ${obj.color.g * 255}, ${obj.color.b * 255}, ${obj.opacity})`;
            context.lineWidth = obj.height * zoom;
            const canvasY = viewport.height - (obj.y * zoom);

            if(obj.shape === 'rect') {
                context.fillRect(obj.x * zoom, canvasY, obj.width * zoom, obj.height * zoom);
            } else if (obj.shape === 'line') {
                context.beginPath();
                context.moveTo(obj.x * zoom, canvasY);
                context.lineTo((obj.x + obj.width) * zoom, canvasY);
                context.stroke();
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

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
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
    } else {
        setIsDrawing(true);
        setStartPos({ x: coords.x, y: coords.y });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    // We don't draw a preview for simplicity, but this is where you'd implement it
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    setIsDrawing(false);
    
    const endCoords = getCanvasCoordinates(event);
    if (!endCoords) return;
    
    const newShape: ShapeObject = {
        id: objectIdCounter,
        type: 'shape',
        shape: currentTool === 'highlight' ? 'rect' : 'line',
        x: Math.min(startPos.x, endCoords.x),
        y: startPos.y, // Keep the y position from the start of the drag
        width: Math.abs(endCoords.x - startPos.x),
        height: currentTool === 'highlight' ? 14 : 1, // thickness
        color: currentTool === 'highlight' ? { r: 1, g: 1, b: 0 } : { r: 0, g: 0, b: 0 },
        opacity: currentTool === 'highlight' ? 0.3 : 1.0,
        pageIndex: currentPage - 1,
    };
    
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
                } else if (obj.shape === 'line') {
                    page.drawLine({
                        start: { x: obj.x, y: obj.y - obj.height / 2 },
                        end: { x: obj.x + obj.width, y: obj.y - obj.height / 2 },
                        thickness: obj.height,
                        color: rgb(obj.color.r, obj.color.g, obj.color.b),
                        opacity: obj.opacity
                    })
                }
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
                    <div className="flex gap-2">
                        <ToolButton tool="text"><Text/></ToolButton>
                        <ToolButton tool="highlight"><Highlighter/></ToolButton>
                        <ToolButton tool="underline"><Underline/></ToolButton>
                        <ToolButton tool="strikethrough"><Strikethrough/></ToolButton>
                    </div>

                    {currentTool === 'text' && (
                        <div className="p-4 border rounded-md space-y-4 animate-in fade-in-50">
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="font-size">Size</Label>
                                    <Input id="font-size" type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="color-picker">Color</Label>
                                    <Input id="color-picker" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="p-1"/>
                                </div>
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
                            'cursor-crosshair': currentTool !== 'text'
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
