
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          About AllNoop
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Your All-in-One Digital Toolkit for everyday productivity and creativity.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            At AllNoop, our mission is to provide a comprehensive and user-friendly suite of tools that empower users to tackle a wide range of digital tasks with ease and efficiency. We believe that powerful tools should be accessible to everyone, which is why we've brought together a diverse collection of calculators, PDF utilities, image editors, and content generators into one seamless platform.
          </p>
          <p>
            Whether you're a student managing your coursework, a professional handling documents, a content creator looking for inspiration, or just someone who needs to make a quick calculation, AllNoop is designed to be your go-to resource. We are committed to maintaining a high-quality, free-to-use service, supported by non-intrusive advertising to keep the platform running. Our focus is on continuous improvement, regularly adding new tools and enhancing existing ones based on user feedback.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>What We Offer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">Calculators Hub:</span> A vast array of calculators for finance, health, academics, and more, designed for accuracy and ease of use.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">PDF Tools Suite:</span> Merge, split, compress, edit, and manipulate your PDF files effortlessly with our secure, client-side processing tools.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">Image Editor Suite:</span> From simple crops to AI-powered background removal, our image editor has you covered for all your basic photo editing needs.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">AI Content Generation:</span> Spark creativity with our hashtag and caption generators, designed for modern social media engagement.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">User-Focused Design:</span> A clean, modern, and responsive interface that works beautifully on both desktop and mobile devices, ensuring a seamless experience for all users.</span>
                </li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}

