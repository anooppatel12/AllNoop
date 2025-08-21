
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Privacy Policy
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>1. Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Welcome to OmniTool. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>2. Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
                <span className="font-semibold">Uploaded Data:</span> For our PDF and Image tools, the files you upload are processed on our servers or directly in your browser. We do not store your files permanently. All uploaded files are automatically deleted from our servers within one hour of processing.
            </li>
             <li>
                <span className="font-semibold">Usage Data:</span> We may automatically collect information about your device and how you use the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site.
            </li>
          </ul>
        </CardContent>
      </Card>
       <Card className="mt-8">
        <CardHeader>
          <CardTitle>3. Use of Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
          </p>
           <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and maintain our website.</li>
            <li>Improve, personalize, and expand our website.</li>
            <li>Understand and analyze how you use our website.</li>
            <li>Develop new products, services, features, and functionality.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
