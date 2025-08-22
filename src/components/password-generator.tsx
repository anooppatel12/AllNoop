
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const checkPasswordStrength = (password: string) => {
  let score = 0;
  const length = password.length;

  if (length >= 8) score++;
  if (length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if(length === 0) return { score: 0, label: 'Empty', color: 'bg-gray-400' };
  if(length < 8) return { score: 1, label: 'Very Weak', color: 'bg-red-500' };

  switch (score) {
    case 0:
    case 1:
    case 2:
      return { score: 2, label: 'Weak', color: 'bg-orange-500' };
    case 3:
      return { score: 3, label: 'Medium', color: 'bg-yellow-500' };
    case 4:
      return { score: 4, label: 'Strong', color: 'bg-blue-500' };
    case 5:
    case 6:
      return { score: 5, label: 'Very Strong', color: 'bg-green-500' };
    default:
      return { score: 0, label: 'Empty', color: 'bg-gray-400' };
  }
};


export function PasswordGeneratorTool() {
  const { toast } = useToast();
  
  // Generator state
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  
  // Checker state
  const [passwordToCheck, setPasswordToCheck] = useState('');
  const [strength, setStrength] = useState(checkPasswordStrength(''));

  const generatePassword = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charSet = '';
    if (includeUppercase) charSet += uppercaseChars;
    if (includeLowercase) charSet += lowercaseChars;
    if (includeNumbers) charSet += numberChars;
    if (includeSymbols) charSet += symbolChars;

    if (charSet === '') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select at least one character type.',
      });
      setGeneratedPassword('');
      return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      password += charSet[randomIndex];
    }
    setGeneratedPassword(password);
  };
  
  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);


  const handleCopyToClipboard = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    setHasCopied(true);
    toast({ title: 'Password copied to clipboard!' });
    setTimeout(() => setHasCopied(false), 2000);
  };
  
  useEffect(() => {
      setStrength(checkPasswordStrength(passwordToCheck));
  }, [passwordToCheck])

  return (
    <Tabs defaultValue="generator" className="mt-8 w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="generator">Password Generator</TabsTrigger>
        <TabsTrigger value="checker">Strength Checker</TabsTrigger>
      </TabsList>
      <TabsContent value="generator">
        <Card>
          <CardHeader>
            <CardTitle>Generate a Secure Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
                <Input value={generatedPassword} readOnly className="pr-10 h-12 text-lg"/>
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={handleCopyToClipboard}>
                    {hasCopied ? <Check className="text-green-500"/> : <Copy/>}
                </Button>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label>Password Length</Label>
                    <span className="font-bold text-primary text-lg">{length}</span>
                </div>
                <Slider value={[length]} onValueChange={([val]) => setLength(val)} min={8} max={64} step={1} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(checked) => setIncludeUppercase(Boolean(checked))} />
                    <Label htmlFor="uppercase">Include Uppercase (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={(checked) => setIncludeLowercase(Boolean(checked))} />
                    <Label htmlFor="lowercase">Include Lowercase (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(checked) => setIncludeNumbers(Boolean(checked))} />
                    <Label htmlFor="numbers">Include Numbers (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(checked) => setIncludeSymbols(Boolean(checked))} />
                    <Label htmlFor="symbols">Include Symbols (!@#$)</Label>
                </div>
            </div>
          </CardContent>
           <CardFooter>
                <Button onClick={generatePassword} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4"/>
                    Generate New Password
                </Button>
           </CardFooter>
        </Card>
      </TabsContent>
       <TabsContent value="checker">
        <Card>
          <CardHeader>
            <CardTitle>Check Password Strength</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="password-check">Password to Check</Label>
                <Input id="password-check" type="password" value={passwordToCheck} onChange={(e) => setPasswordToCheck(e.target.value)} />
             </div>
             <div>
                <Progress value={(strength.score / 5) * 100} className={cn("h-3", strength.color)} />
                <p className={cn("text-sm font-bold text-right mt-2", strength.color.replace('bg-','text-'))}>{strength.label}</p>
             </div>
          </CardContent>
        </Card>
       </TabsContent>
    </Tabs>
  );
}
