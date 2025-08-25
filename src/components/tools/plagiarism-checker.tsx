'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { checkPlagiarismAction } from '@/app/actions';
import { PlagiarismOutput } from '@/ai/flows/plagiarism-checker';
import { Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function PlagiarismChecker() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PlagiarismOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!text.trim()) {
      setError('Please enter some text to check.');
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    const result = await checkPlagiarismAction({ text });
    if (result.error) {
      setError(result.error);
    } else {
      setAnalysis(result.analysis || null);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Content to Check</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            rows={15}
            className="text-base"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleCheck} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-4 w-4" />
            )}
            Check Plagiarism
          </Button>
        </CardFooter>
      </Card>
      
      {error && (
        <Alert variant="destructive" className="mt-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysis && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Plagiarism Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                      <span>Unique Content</span>
                      <span className="text-green-500">{analysis.uniquePercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={analysis.uniquePercentage} className="h-3 [&>*]:bg-green-500" />
              </div>
               <div className="space-y-2">
                   <div className="flex justify-between text-sm font-medium">
                      <span>Plagiarized Content</span>
                      <span className="text-red-500">{analysis.plagiarizedPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={analysis.plagiarizedPercentage} className="h-3 [&>*]:bg-red-500" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Detailed Report</h3>
              <div className="rounded-lg border bg-background p-4 text-base leading-relaxed max-h-[400px] overflow-y-auto">
                {analysis.sentences.map((sentence, index) => (
                  <span
                    key={index}
                    className={cn(
                      'transition-colors duration-300',
                      sentence.isPlagiarized
                        ? 'bg-red-500/20 text-red-800 dark:text-red-300'
                        : 'bg-green-500/10 text-green-800 dark:text-green-300'
                    )}
                  >
                    {sentence.text}{' '}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Disclaimer: This AI-powered plagiarism checker provides an estimate and is not a substitute for professional services. Results should be reviewed carefully.</p>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
