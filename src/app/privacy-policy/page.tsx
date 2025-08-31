
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Privacy Policy for AllNoop
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
            Welcome to AllNoop ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website, allnoop.com (the "Site"). This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information when you use our Service.
          </p>
          <p>
            By accessing or using our Site, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms, please do not access the site. We may update this Privacy Policy from time to time, and we will notify you of any changes by posting the new policy on this page.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>2. Information We Collect and How We Use It</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Our core philosophy is to collect as little personal data as possible. Our services are designed to function without requiring you to create an account or provide personal information. Here's a breakdown of the data we handle:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-semibold">User-Provided Data (Files & Text):</span> For our PDF, Image, and other content tools, any files you upload or text you input are processed on our servers or directly within your browser. We are strongly committed to your privacy and do not store or review your content. **All uploaded files and data are automatically and permanently deleted from our servers within one hour of processing.** This ensures your information remains confidential.
            </li>
            <li>
              <span className="font-semibold">Contact Information:</span> If you choose to contact us via our contact form, we collect your name and email address. This information is used solely to respond to your inquiries, feedback, or support requests. We do not use this information for marketing purposes or share it with third parties.
            </li>
            <li>
              <span className="font-semibold">Analytics Data (Non-Personal):</span> We use industry-standard analytics services (like Google Analytics) to collect non-personally identifiable information. This includes your browser type, device type, operating system, pages visited, time spent on pages, and general geographic location (e.g., city, country). This aggregated data helps us understand user behavior, identify popular tools, and improve the overall user experience on our Site. This information cannot be used to identify you personally.
            </li>
          </ul>
        </CardContent>
      </Card>
       <Card className="mt-8">
        <CardHeader>
          <CardTitle>3. Third-Party Advertising and Cookies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            To keep our services free, we partner with third-party advertising companies, such as Google AdSense, to serve ads when you visit the Site. These companies may use cookies and similar technologies to collect information about your visits to this and other websites to provide advertisements about goods and services of interest to you.
          </p>
          <p>
            Specifically, Google's use of the DoubleClick DART cookie enables it and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the <a href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Ad and Content Network privacy policy</a>.
          </p>
           <p>
            You can choose to disable or selectively turn off our cookies or third-party cookies in your browser settings. However, this can affect how you are able to interact with our Site as well as other websites.
          </p>
        </CardContent>
      </Card>
      
       <Card className="mt-8">
        <CardHeader>
          <CardTitle>4. Data Security and User Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We implement administrative and technical measures designed to protect your information. While we have taken reasonable steps to secure the information you provide to us, please be aware that no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
           <p>
            Our commitment to privacy means we hold minimal data. For any questions or concerns about this policy or your data, please contact us through our Contact page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
