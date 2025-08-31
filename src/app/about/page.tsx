
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Target, Users, Puzzle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          About AllNoop
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Empowering your digital life with a comprehensive suite of free, intuitive, and powerful online tools. Welcome to your all-in-one productivity and creativity hub.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target /> Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            At AllNoop, our mission is to democratize digital productivity by providing a comprehensive and user-friendly suite of tools that are accessible to everyone, completely free of charge. We believe that powerful utilities shouldn't be locked behind expensive subscriptions or complicated software. Our platform is designed to empower students, professionals, creators, and everyday users to tackle a wide range of digital tasks with ease and efficiency.
          </p>
          <p>
            We are committed to building a single, reliable destination for everything from complex financial calculations and scientific computations to creative content generation and essential file management. Our focus is on intuitive design, robust functionality, and, most importantly, user privacy. By prioritizing client-side processing for sensitive tasks and maintaining a transparent data policy, we strive to be a toolkit you can trust.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Puzzle /> What We Offer</CardTitle>
          <CardDescription>A diverse collection of utilities designed for every aspect of your digital life.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">Calculators Hub:</span> A vast array of calculators for finance, health, academics, and specialized fields like physics and chemistry. Each tool is designed for accuracy and simplicity, helping you get the numbers you need, fast.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">PDF Tools Suite:</span> Merge, split, compress, edit, and manage your PDF files effortlessly. Our tools prioritize your privacy by performing most operations directly in your browser, ensuring your documents remain secure.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">Image Editor & Tools:</span> From simple crops and resizing to AI-powered background removal, our image editor provides the essential features you need for quick photo edits without the complexity of professional software.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">AI Content Generation:</span> Spark creativity with our AI-driven tools. Generate trending hashtags for social media, get engaging captions for your posts, analyze keywords for SEO, or check your text for plagiarism.</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">Developer & Study Tools:</span> Boost your productivity with utilities like our Markdown previewer, QR code generator, and text formatter, designed for developers, writers, and students.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span><span className="font-semibold">Fun & Games:</span> Take a break with our collection of mini-games, quizzes, and fun generators. Challenge your mind with Sudoku, test your typing speed, or find out your "main character" energy.</span>
                </li>
            </ul>
        </CardContent>
      </Card>
      
       <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users /> Our Team & Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            AllNoop was born from a simple idea: what if all the small, essential web tools you use daily were available in one reliable place? Our team is a small but passionate group of developers, designers, and content creators dedicated to building high-quality, user-centric applications. We are driven by a commitment to quality, accessibility, and continuous improvement.
          </p>
          <p>
             We listen to our users and are constantly working to add new tools and enhance existing ones based on your feedback. Our platform is a work in progress, and we are excited to have you join us on this journey. Thank you for choosing AllNoop!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
