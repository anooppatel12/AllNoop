
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
            Welcome to AllNoop ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy applies to the AllNoop website and governs our data collection, processing, and usage practices. It also describes your choices regarding use, access, and correction of your personal information.
          </p>
          <p>
            By using the website, you consent to the data practices described in this Privacy Policy. If you do not agree with the data practices described in this Privacy Policy, you should not use the website. We encourage you to review this policy periodically to stay informed about how we are protecting your information.
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
                <span className="font-semibold">Uploaded Data:</span> For our PDF and Image tools, the files you upload are processed on our servers or directly in your browser. We are committed to your privacy, so we do not store your files permanently. All uploaded files are automatically deleted from our servers within one hour of processing. This client-side approach ensures your data remains secure and private.
            </li>
             <li>
                <span className="font-semibold">Usage Data:</span> We may automatically collect information about your device and how you use the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site. This information is used for analytical purposes to improve our services and is not linked to any personal identifiers.
            </li>
             <li>
                <span className="font-semibold">Contact Information:</span> If you choose to contact us via our contact form, we collect your name and email address in order to respond to your inquiry. This information is used solely for communication purposes and is not shared with third parties.
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
            <li>Understand and analyze how you use our website to enhance user experience.</li>
            <li>Develop new products, services, features, and functionality.</li>
            <li>Communicate with you, either directly or through one of our partners, for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site and ensure the security of our platform.</li>
          </ul>
        </CardContent>
      </Card>
      
       <Card className="mt-8">
        <CardHeader>
          <CardTitle>4. Third-Party Advertising</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We may use third-party advertising companies, such as Google AdSense, to serve ads when you visit the Site. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
          </p>
          <p>
            Google's use of the DART cookie enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
