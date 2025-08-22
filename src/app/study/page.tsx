
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpenCheck, FileText, Code, GraduationCap } from 'lucide-react';

const studyTools = [
    {
        name: 'Markdown to HTML Previewer',
        description: 'Write Markdown and see the live HTML preview.',
        icon: FileText,
        href: '/study/markdown-previewer',
    },
    {
        name: 'Quiz & Flashcard Creator',
        description: 'Create and share study sets with quizzes.',
        icon: BookOpenCheck,
        href: '/study/quiz-creator',
    },
    {
        name: 'Resume/CV Builder',
        description: 'Create a professional resume. (Coming Soon)',
        icon: GraduationCap,
        href: '#',
    },
    {
        name: 'Online Compiler',
        description: 'Run C, C++, and Python code online. (Coming Soon)',
        icon: Code,
        href: '#',
    },
];

export default function StudyWorkPage() {
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Study & Work Tools
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          A collection of tools to boost your productivity and learning.
        </p>
      </div>

       <div className="mt-12">
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studyTools.map((tool) => (
                <Link href={tool.href} key={tool.name} className="group">
                <Card className="h-full transition-all group-hover:border-primary group-hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <tool.icon className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>{tool.name}</CardTitle>
                            <CardDescription className="mt-1">{tool.description}</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
                </Link>
            ))}
            </div>
      </div>
    </div>
  );
}
