
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
            By accessing and using AllNoop (the "Site"), you accept and agree to be bound by the terms and provision of this agreement. These Terms apply to all visitors, users, and others who access or use the Service. If you disagree with any part of the terms, then you may not access the Site. Your access to and use of the Service is also conditioned on your acceptance of and compliance with our Privacy Policy.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>2. Use of Our Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            AllNoop grants you a non-exclusive, non-transferable, revocable license to use our tools and information for your personal, non-commercial use only, in accordance with these Terms. Under this license you may not:
          </p>
          <ul className="list-decimal pl-6 space-y-2">
            <li>Modify, copy, or create derivative works from the materials or underlying code;</li>
            <li>Use the materials for any commercial purpose, or for any public display without prior written consent;</li>
            <li>Attempt to decompile, reverse engineer, or otherwise attempt to discover the source code of any software contained on AllNoop's website;</li>
            <li>Use any automated system, such as "robots," "spiders," or "offline readers," to access the Site in a manner that sends more request messages to the AllNoop servers than a human can reasonably produce in the same period by using a conventional on-line web browser;</li>
            <li>Remove any copyright or other proprietary notations from the materials.</li>
          </ul>
          <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by AllNoop at any time. All content, trademarks, service marks, trade names, logos, and intellectual property are owned by AllNoop.</p>
        </CardContent>
      </Card>
       <Card className="mt-8">
        <CardHeader>
          <CardTitle>3. User-Generated Content and Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            You are solely responsible for the content, including files and data, that you upload, process, or generate using our tools. You affirm, represent, and warrant that you own or have the necessary licenses, rights, consents, and permissions to use and authorize AllNoop to use all patent, trademark, trade secret, copyright or other proprietary rights in and to any and all user submissions to enable inclusion and use of the submissions in the manner contemplated by the Site and these Terms.
          </p>
           <p>
            AllNoop does not store your files permanently. All uploaded files are automatically deleted from our servers within one hour. We do not claim any ownership rights over the content you provide.
          </p>
        </CardContent>
      </Card>
      
       <Card className="mt-8">
        <CardHeader>
          <CardTitle>4. Disclaimer of Warranties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            The materials and tools on AllNoop's website are provided on an 'as is' basis. AllNoop makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p>
            Further, AllNoop does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site. All tools are for informational purposes only and should not be used as a substitute for professional advice.
          </p>
        </CardContent>
      </Card>
       <Card className="mt-8">
        <CardHeader>
          <CardTitle>5. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            In no event shall AllNoop or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AllNoop's website, even if AllNoop or an AllNoop authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </CardContent>
      </Card>
        <Card className="mt-8">
        <CardHeader>
          <CardTitle>6. Governing Law & Changes to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Any claim relating to AllNoop's website shall be governed by the laws of our operating jurisdiction without regard to its conflict of law provisions.
          </p>
           <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms and Conditions on this page. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
