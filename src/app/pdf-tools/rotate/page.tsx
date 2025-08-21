import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RotatePdfPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Rotate PDF
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Rotate single or all pages in your PDF document.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This feature is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
