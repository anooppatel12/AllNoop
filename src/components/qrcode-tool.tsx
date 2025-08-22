
'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import QrScanner from 'react-qr-scanner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Camera, CameraOff, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function QrCodeTool() {
  const { toast } = useToast();
  const [text, setText] = useState('https://firebase.google.com/');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const handleDownload = () => {
    const canvas = document.querySelector('#qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleScan = (data: any) => {
    if (data) {
      setScanResult(data.text);
      setIsScanning(false);
      toast({ title: 'QR Code Scanned!', description: data.text });
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    if(err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
        setHasCameraPermission(false);
    }
    toast({ variant: 'destructive', title: 'Scan Error', description: 'Could not scan QR code. Please ensure your camera is enabled and the code is clearly visible.' });
  };
  
  const startStopScan = () => {
    if(!isScanning){
        setScanResult(null);
        checkCameraPermission();
    }
    setIsScanning(!isScanning);
  };
  
  const checkCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCameraPermission(false);
          return;
      }
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          // Stop the stream immediately, we only need to know if permission is granted.
          stream.getTracks().forEach(track => track.stop());
      } catch (error) {
          setHasCameraPermission(false);
      }
  };

  useEffect(() => {
    // Clean up scanner when component unmounts or tab changes
    return () => {
        setIsScanning(false);
    };
  }, []);

  return (
    <Tabs defaultValue="generator" className="mt-8 w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="generator">Generator</TabsTrigger>
        <TabsTrigger value="scanner">Scanner</TabsTrigger>
      </TabsList>
      <TabsContent value="generator">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Generator</CardTitle>
            <CardDescription>Enter text or a URL to generate a QR code.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="qr-text">Text to Encode</Label>
              <Textarea
                id="qr-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-center justify-center rounded-lg bg-white p-4">
              {text ? (
                <QRCode id="qr-code-canvas" value={text} size={256} level={'H'} includeMargin={true} />
              ) : (
                <div className="h-[288px] w-[288px] flex items-center justify-center bg-gray-100 text-muted-foreground rounded-md">
                  Enter text to see QR code
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownload} disabled={!text} className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download QR Code
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="scanner">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Scanner</CardTitle>
            <CardDescription>Use your camera to scan a QR code.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg border bg-muted">
                {isScanning ? (
                    <>
                        <QrScanner
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: '100%' }}
                            constraints={{ video: { facingMode: "environment" } }}
                        />
                         <div className="absolute inset-0 border-4 border-primary/50 pointer-events-none" />
                    </>
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
                        <Camera className="h-16 w-16" />
                        <p className="mt-2">{hasCameraPermission === false ? "Camera access denied." : "Camera is off"}</p>
                    </div>
                )}
             </div>
             {hasCameraPermission === false && (
                <Alert variant="destructive">
                    <CameraOff className="h-4 w-4" />
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>Please enable camera permissions in your browser settings to use the scanner.</AlertDescription>
                </Alert>
             )}
            <Button onClick={startStopScan} className="w-full" disabled={hasCameraPermission === false}>
                {isScanning ? <CameraOff className="mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
                {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </Button>
          </CardContent>
          {scanResult && (
             <CardFooter>
                <div className="w-full space-y-2">
                    <Label>Last Scan Result:</Label>
                    <div className="flex items-center gap-2">
                        <Input value={scanResult} readOnly className="flex-1"/>
                        <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(scanResult)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardFooter>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
}
