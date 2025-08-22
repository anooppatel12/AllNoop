'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Unicode character maps for fancy text styles
const styles = {
  bold: { a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇' },
  italic: { a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫', k: '𝘬', l: '𝘭', m: '𝘮', n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵', u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻' },
  boldItalic: { a: '𝙖', b: '𝙗', c: '𝙘', d: '𝙙', e: '𝙚', f: '𝙛', g: '𝙜', h: '𝙝', i: '𝙞', j: '𝙟', k: '𝙠', l: '𝙡', m: '𝙢', n: '𝙣', o: '𝙤', p: '𝙥', q: '𝙦', r: '𝙧', s: '𝙨', t: '𝙩', u: '𝙪', v: '𝙫', w: '𝙬', x: '𝙭', y: '𝙮', z: '𝙯' },
  script: { a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: '𝑒', f: '𝒻', g: '𝑔', h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀', l: '𝓁', m: '𝓂', n: '𝓃', o: '𝑜', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊', v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏' },
  boldScript: { a: '𝓪', b: '𝓫', c: '𝓬', d: '𝓭', e: '𝓮', f: '𝓯', g: '𝓰', h: '𝓱', i: '𝓲', j: '𝓳', k: '𝓴', l: '𝓵', m: '𝓶', n: '𝓷', o: '𝓸', p: '𝓹', q: '𝓺', r: '𝓻', s: '𝓼', t: '𝓽', u: '𝓾', v: '𝓿', w: '𝔀', x: '𝔁', y: '𝔂', z: '𝔃' },
  fraktur: { a: '𝔞', b: '𝔟', c: '𝔠', d: '𝔡', e: '𝔢', f: '𝔣', g: '𝔤', h: '𝔥', i: '𝔦', j: '𝔧', k: '𝔨', l: '𝔩', m: '𝔪', n: '𝔫', o: '𝔬', p: '𝔭', q: '𝔮', r: '𝔯', s: '𝔰', t: '𝔱', u: '𝔲', v: '𝔳', w: '𝔴', x: '𝔵', y: '𝔶', z: '𝔷' },
  boldFraktur: { a: '𝖆', b: '𝖇', c: '𝖈', d: '𝖉', e: '𝖊', f: '𝖋', g: '𝖌', h: '𝖍', i: '𝖎', j: '𝖏', k: '𝖐', l: '𝖑', m: '𝖒', n: '𝖓', o: '𝖔', p: '𝖕', q: '𝖖', r: '𝖗', s: '𝖘', t: '𝖙', u: '𝖚', v: '𝖛', w: '𝖜', x: '𝖝', y: '𝖞', z: '𝖟' },
  doubleStruck: { A: '𝔸', B: '𝔹', C: 'ℂ', D: '𝔻', E: '𝔼', F: '𝔽', G: '𝔾', H: 'ℍ', I: '𝕀', J: '𝕁', K: '𝕂', L: '𝕃', M: '𝕄', N: 'ℕ', O: '𝕆', P: 'ℙ', Q: 'ℚ', R: 'ℝ', S: '𝕊', T: '𝕋', U: '𝕌', V: '𝕍', W: '𝕎', X: '𝕏', Y: '𝕐', Z: 'ℤ' },
  monospace: { a: '𝚊', b: '𝚋', c: '𝚌', d: '𝚍', e: '𝚎', f: '𝚏', g: '𝚐', h: '𝚑', i: '𝚒', j: '𝚓', k: '𝚔', l: '𝚕', m: '𝚖', n: '𝚗', o: '𝚘', p: '𝚙', q: '𝚚', r: '𝚛', s: '𝚜', t: '𝚝', u: '𝚞', v: '𝚟', w: '𝚠', x: '𝚡', y: '𝚢', z: '𝚣' },
  superscript: { a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', q: 'ᵠ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ' },
  subscript: { a: 'ₐ', b: 'ᵦ', c: '𝒸', d: '𝒹', e: 'ₑ', f: '𝒻', g: '₉', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ', p: 'ₚ', q: 'ᵩ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', w: '𝓌', x: 'ₓ', y: 'ᵧ', z: '𝓏' },
  inverted: { a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ı', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z' },
  wide: { a: 'ａ', b: 'ｂ', c: 'ｃ', d: 'ｄ', e: 'ｅ', f: 'ｆ', g: 'ｇ', h: 'ｈ', i: 'ｉ', j: 'ｊ', k: 'ｋ', l: 'ｌ', m: 'ｍ', n: 'ｎ', o: 'ｏ', p: 'ｐ', q: 'ｑ', r: 'ｒ', s: 'ｓ', t: 'ｔ', u: 'ｕ', v: 'ｖ', w: 'ｗ', x: 'ｘ', y: 'ｙ', z: 'ｚ' },
  circled: { a: 'ⓐ', b: 'ⓑ', c: 'ⓒ', d: 'ⓓ', e: 'ⓔ', f: 'ⓕ', g: 'ⓖ', h: 'ⓗ', i: 'ⓘ', j: 'ⓙ', k: 'ⓚ', l: 'ⓛ', m: 'ⓜ', n: 'ⓝ', o: 'ⓞ', p: 'ⓟ', q: 'ⓠ', r: 'ⓡ', s: 'ⓢ', t: 'ⓣ', u: 'ⓤ', v: 'ⓥ', w: 'ⓦ', x: 'ⓧ', y: 'ⓨ', z: 'ⓩ' },
  negativeCircled: { A: '🅐', B: '🅑', C: '🅒', D: '🅓', E: '🅔', F: '🅕', G: '🅖', H: '🅗', I: '🅘', J: '🅙', K: '🅚', L: '🅛', M: '🅜', N: '🅝', O: '🅞', P: '🅟', Q: '🅠', R: '🅡', S: '🅢', T: '🅣', U: '🅤', V: '🅥', W: '🅦', X: '🅧', Y: '🅨', Z: '🅩' },
  squared: { a: '🄰', b: '🄱', c: '🄲', d: '🄳', e: '🄴', f: '🄵', g: '🄶', h: '🄷', i: '🄸', j: '🄹', k: '🄺', l: '🄻', m: '🄼', n: '🄽', o: '🄾', p: '🄿', q: '🅀', r: '🅁', s: '🅂', t: '🅃', u: '🅄', v: '🅅', w: '🅆', x: '🅇', y: '🅈', z: '🅉' },
  negativeSquared: { a: '🅰', b: '🅱', c: '🅲', d: '🅳', e: '🅴', f: '🅵', g: '🅶', h: '🅷', i: '🅸', j: '🅹', k: '🅺', l: '🅻', m: '🅼', n: '🅽', o: '🅾', p: '🅿', q: '🆀', r: '🆁', s: '🆂', t: '🆃', u: '🆄', v: '🆅', w: '🆆', x: '🆇', y: '🆈', z: '🆉' },
  strikethrough: 'striking',
  underline: 'underlining',
  doubleUnderline: 'double_underlining',
  slash: 'slashing',
  wavy: 'waving',
  wavyUnderline: 'wavy_underlining',
  dots: 'dotting',
  fire: 'firing',
  magic: 'magicing',
  ladybug: 'ladybugging',
  greek: { a: 'α', b: 'в', c: '¢', d: '∂', e: 'є', f: 'ƒ', g: 'g', h: 'н', i: 'ι', j: 'נ', k: 'к', l: 'ℓ', m: 'м', n: 'η', o: 'σ', p: 'ρ', q: 'q', r: 'я', s: 'ѕ', t: 'т', u: 'υ', v: 'ν', w: 'ω', x: 'χ', y: 'у', z: 'z' },
  arrows: { a: '⇍', b: '⇏', c: '⇎', d: '⇏', e: '⇎', f: '⇍', g: '⇏', h: '⇎', i: '⇏', j: '⇍', k: '⇎', l: '⇍', m: '⇏', n: '⇎', o: '⇏', p: '⇍', q: '⇎', r: '⇍', s: '⇏', t: '⇎', u: '⇏', v: '⇍', w: '⇎', x: '⇍', y: '⇏', z: '⇎' },
  currency: { a: '₳', b: '฿', c: '₵', d: '₫', e: '€', f: '₣', g: '₲', h: '₴', i: 'ł', j: '₭', k: '₭', l: '₤', m: '₥', n: '₦', o: 'Ø', p: '₱', q: 'Q', r: '₹', s: '$', t: '₮', u: 'Ʉ', v: 'V', w: '₩', x: 'Ӿ', y: '¥', z: 'Ƶ' },
  fairy: { a: 'ą', b: 'ɓ', c: 'ć', d: 'ď', e: 'ę', f: 'ƒ', g: 'ģ', h: 'ħ', i: 'į', j: 'ĵ', k: 'ķ', l: 'ł', m: 'm', n: 'ń', o: 'ǫ', p: 'þ', q: 'q', r: 'ř', s: 'ş', t: 'ţ', u: 'ų', v: 'ν', w: 'w', x: 'χ', y: 'y', z: 'ż' },
  hacker: { a: '4', b: '8', c: '(', d: '[)', e: '3', f: '|=', g: '6', h: '#', i: '1', j: '_|', k: '|<', l: '1', m: '|\/|', n: '|\|', o: '0', p: '|D', q: '(,)', r: '|2', s: '5', t: '7', u: '|_|', v: '\/', w: '\/\/', x: '><', y: '`/', z: '2' },
  knight: { a: 'å', b: 'ß', c: 'ç', d: 'Ð', e: 'ê', f: '£', g: 'g', h: 'h', i: 'ï', j: 'j', k: 'k', l: 'l', m: 'm', n: 'ñ', o: 'ð', p: 'þ', q: 'q', r: '®', s: '§', t: '†', u: 'µ', v: 'v', w: 'w', x: 'x', y: '¥', z: 'z' },
  cyrillic: { a: 'а', b: 'б', c: 'ц', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'н', i: 'и', j: 'ј', k: 'к', l: 'л', m: 'м', n: 'п', o: 'о', p: 'р', q: 'я', r: 'г', s: 'ѕ', t: 'т', u: 'ц', v: 'ν', w: 'ш', x: 'х', y: 'у', z: 'з' },
  weird: { a: 'ค', b: '๒', c: 'ς', d: '๔', e: 'є', f: 'Ŧ', g: 'ﻮ', h: 'ђ', i: 'เ', j: 'ן', k: 'к', l: 'ɭ', m: '๓', n: 'ภ', o: '๏', p: 'ק', q: 'ợ', r: 'г', s: 'ร', t: 'Շ', u: 'ย', v: 'ש', w: 'ฬ', x: 'א', y: 'ץ', z: 'չ' },
  squares: { a: '🅲', b: '🅳', c: '🅴', d: '🅵', e: '🅶', f: '🅸', g: '🅹', h: '🅺', i: '🅻', j: '🅼', k: '🅽', l: '🆀', m: '🆁', n: '🆂', o: '🆃', p: '🆄', q: '🆅', r: '🆆', s: '🆇', t: '🆈', u: '🆉', v: '🅰', w: '🅱', x: '🅲', y: '🅳', z: '🅴' },
  paranormal: { a: 'Ḁ', b: 'Ḃ', c: 'Ḅ', d: 'Ḇ', e: 'Ḉ', f: 'Ḋ', g: 'Ḍ', h: 'Ḏ', i: 'Ḑ', j: 'Ḓ', k: 'Ḕ', l: 'Ḗ', m: 'Ḙ', n: 'Ḛ', o: 'Ḝ', p: 'Ḟ', q: 'Ḡ', r: 'Ḣ', s: 'Ḥ', t: 'Ḧ', u: 'Ḩ', v: 'Ḫ', w: 'Ḭ', x: 'Ḯ', y: 'Ḱ', z: 'Ḳ' },
  mathBold: { a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠', h: '𝐡', i: '𝐢', j: '𝐣', k: '𝐤', l: '𝐥', m: '𝐦', n: '𝐧', o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭', u: '𝐮', v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳' },
  // Adding more styles by combining diacritics
  underlineDots: 'underline_dotting',
  heart: 'hearting',
};


// Function to convert text to a specific style
const convertText = (text: string, style: string): string => {
    if (typeof styles[style as keyof typeof styles] === 'string') {
        const effect = styles[style as keyof typeof styles];
        const combiningChars: {[key: string]: string} = {
            'striking': '\u0336',
            'underlining': '\u0332',
            'double_underlining': '\u0333',
            'slashing': '\u0338',
            'waving': '\u034b',
            'wavy_underlining': '\u0330',
            'dotting': '\u0324',
            'firing': '\u0306',
            'magicing': '\u035c',
            'ladybugging': '\u032e',
            'underline_dotting': '\u0323',
            'hearting': '\u032f'
        };
        const combiningChar = combiningChars[effect as string];
        if (combiningChar) {
            return text.split('').join(combiningChar) + combiningChar;
        }
        return text;
    }

  const map = styles[style as keyof typeof styles] as { [key: string]: string };
  return text.split('').map(char => {
      const lowerChar = char.toLowerCase();
      const upperChar = char.toUpperCase();
      if (map[lowerChar]) {
          return map[lowerChar];
      }
      if (map[upperChar]) {
          return map[upperChar];
      }
      return char;
  }).join('');
};


export function TextFormatter() {
  const { toast } = useToast();
  const [text, setText] = useState('Hello World');

  const stats = useMemo(() => {
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    return { characters, words, lines };
  }, [text]);
  
  const styledTexts = useMemo(() => {
    if (!text) return [];
    return Object.keys(styles).map((key) => ({
      name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      text: convertText(text, key),
    }));
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

  const handleCopy = (textToCopy: string, message: string = 'Text copied to clipboard!') => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    toast({ title: message });
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Text Formatter & Analyzer</CardTitle>
        <CardDescription>Format your text, get stats, and generate stylish fonts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text-input">Your Text</Label>
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Paste or type your text here..."
          />
        </div>
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

        <Tabs defaultValue="formatting" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="formatting">Formatting</TabsTrigger>
                <TabsTrigger value="fancy-text">Fancy Text</TabsTrigger>
            </TabsList>
            <TabsContent value="formatting" className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                    <Button onClick={handleUppercase} variant="outline">Uppercase</Button>
                    <Button onClick={handleLowercase} variant="outline">Lowercase</Button>
                    <Button onClick={handleRemoveExtraSpaces} variant="outline">Remove Extra Spaces</Button>
                    <Button onClick={() => handleCopy(text)} variant="outline"><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                    <Button onClick={handleClear} variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Clear</Button>
                </div>
            </TabsContent>
            <TabsContent value="fancy-text" className="mt-4 space-y-4">
                {styledTexts.length === 0 && <p className="text-muted-foreground text-center">Enter some text to see the magic!</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {styledTexts.map(style => (
                        <div key={style.name} className="rounded-lg border p-3 space-y-2">
                            <p className="font-semibold">{style.name}</p>
                            <div className="flex items-center gap-2">
                                <Textarea value={style.text} readOnly rows={2} className="flex-1 bg-muted font-mono" />
                                <Button size="icon" variant="ghost" onClick={() => handleCopy(style.text, `${style.name} text copied!`)}><Copy/></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </TabsContent>
        </Tabs>

      </CardContent>
    </Card>
  );
}
