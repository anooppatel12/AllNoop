
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Terms & Conditions
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>1. Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            By using OmniTool (the "Site"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>2. Use License</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on OmniTool's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-decimal pl-6 space-y-2">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on OmniTool's website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by OmniTool at any time.</p>
        </CardContent>
      </Card>
       <Card className="mt-8">
        <CardHeader>
          <CardTitle>3. Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            The materials on OmniTool's website are provided on an 'as is' basis. OmniTool makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
