
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash2 } from 'lucide-react';

export function TextFormatter() {
  const { toast } = useToast();
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    return { characters, words, lines };
  }, [text]);

  const handleUppercase = () => {
    setText(text.toUpperCase());
  };

  const handleLowercase = () => {
    setText(text.toLowerCase());
  };

  const handleRemoveExtraSpaces = () => {
    setText(text.replace(/\s+/g, ' ').trim());
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: 'Text copied to clipboard!' });
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Text Formatter & Analyzer</CardTitle>
        <CardDescription>Format your text and get stats like word and character count.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">Your Text</Label>
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Paste or type your text here..."
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleUppercase} variant="outline">Uppercase</Button>
          <Button onClick={handleLowercase} variant="outline">Lowercase</Button>
          <Button onClick={handleRemoveExtraSpaces} variant="outline">Remove Extra Spaces</Button>
          <Button onClick={handleCopy} variant="outline"><Copy className="mr-2 h-4 w-4" /> Copy</Button>
          <Button onClick={handleClear} variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Clear</Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full rounded-lg bg-muted p-4 text-center">
            <div className="grid grid-cols-3 gap-4">
                 <div>
                    <p className="text-sm font-semibold text-muted-foreground">Characters</p>
                    <p className="text-2xl font-bold">{stats.characters}</p>
                </div>
                 <div>
                    <p className="text-sm font-semibold text-muted-foreground">Words</p>
                    <p className="text-2xl font-bold">{stats.words}</p>
                </div>
                 <div>
                    <p className="text-sm font-semibold text-muted-foreground">Lines</p>
                    <p className="text-2xl font-bold">{stats.lines}</p>
                </div>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}
