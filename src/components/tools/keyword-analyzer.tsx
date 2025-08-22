'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { analyzeKeywordAction } from '@/app/actions';
import type { AnalyzeKeywordOutput } from '@/ai/flows/analyze-keyword';
import { Loader2, Sparkles, TrendingUp, Users, Lightbulb, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

const FormSchema = z.object({
  keyword: z.string().min(2, {
    message: 'Keyword must be at least 2 characters.',
  }),
});

export function KeywordAnalyzer() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeKeywordOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      keyword: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    const result = await analyzeKeywordAction({ keyword: data.keyword });
    if (result.error) {
      setError(result.error);
    } else {
      setAnalysis(result.analysis || null);
    }

    setIsLoading(false);
  }
  
  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${title} copied to clipboard!` });
  };

  return (
    <>
      <Card className="mt-8">
        <CardHeader>
            <CardTitle>Analyze a Keyword</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Keyword or Hashtag</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 'AI in marketing', '#sustainablefashion'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analyze
              </Button>
            </form>
          </Form>
        </CardContent>
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
                <CardTitle>Analysis for "{form.getValues('keyword')}"</CardTitle>
                <CardDescription>Here are the AI-powered insights for your keyword.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Search Volume</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analysis.searchVolume}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Competition</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analysis.competition}</div>
                        </CardContent>
                    </Card>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Related Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                    {analysis.relatedKeywords.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleCopy(tag, 'Keyword')}
                      >
                        {tag}
                      </Badge>
                    ))}
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Content Ideas</h3>
                    <div className="space-y-2">
                        {analysis.contentIdeas.map((idea, index) => (
                           <div key={index} className="flex items-center justify-between rounded-lg border bg-background p-3">
                                <p className="text-sm">{idea}</p>
                                <Button variant="ghost" size="icon" onClick={() => handleCopy(idea, 'Content Idea')}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                           </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
      )}
    </>
  );
}
