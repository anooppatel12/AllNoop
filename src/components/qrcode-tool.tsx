
'use client';

import { useState } from 'react';
import QRCode from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export function QrCodeTool() {
  const [text, setText] = useState('https://allnoop.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [level, setLevel] = useState<ErrorCorrectionLevel>('L');
  const [logo, setLogo] = useState<string | null>(null);

  const handleDownload = () => {
    const canvas = document.querySelector('#qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'custom-qrcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        // It's recommended to use higher error correction with a logo
        if (level === 'L') {
            setLevel('H');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const qrCodeOptions = {
    value: text,
    size: 256,
    fgColor: fgColor,
    bgColor: bgColor,
    level: level,
    renderAs: "canvas" as const,
    includeMargin: true,
    imageSettings: logo ? {
        src: logo,
        height: 48,
        width: 48,
        excavate: true,
    } : undefined
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>Enter text or a URL to generate a QR code.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="qr-text">Text to Encode</Label>
              <Textarea
                id="qr-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="fg-color">Foreground Color</Label>
                    <Input id="fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="p-1"/>
                 </div>
                  <div className="space-y-2">
                    <Label htmlFor="bg-color">Background Color</Label>
                    <Input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-1"/>
                 </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="level">Error Correction Level</Label>
                <Select value={level} onValueChange={(v: ErrorCorrectionLevel) => setLevel(v)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="L">Low (best for simple codes)</SelectItem>
                        <SelectItem value="M">Medium</SelectItem>
                        <SelectItem value="Q">Quartile</SelectItem>
                        <SelectItem value="H">High (best with logos)</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label>Logo (Optional)</Label>
                <div className="flex gap-2">
                    <Input id="logo-upload" type="file" onChange={handleLogoUpload} accept="image/png, image/jpeg, image/svg+xml" className="sr-only" />
                    <Label htmlFor="logo-upload" className="w-full">
                       <Button asChild className="w-full cursor-pointer"><p><Upload className="mr-2"/>Upload Logo</p></Button>
                    </Label>
                    <Button variant="outline" onClick={() => setLogo(null)} disabled={!logo}>Remove</Button>
                </div>
                <p className="text-xs text-muted-foreground">For best results, use a square image.</p>
             </div>
        </div>
        <div className="flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-4">
          {text ? (
            <QRCode id="qr-code-canvas" {...qrCodeOptions} />
          ) : (
            <div className="h-[288px] w-[288px] flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-muted-foreground rounded-md">
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
  );
}
