import { type Metadata } from "next";
import BackButton from "@/components/common/BackButton";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Only Menu - Smart QR Menu Solutions for Cafes & Restaurants",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <BackButton />
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">1. Introduction</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Only Menu ("we", "us", "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you use our QR code menu management platform.
          </p>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            By using Only Menu, you consent to the data practices described in this policy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">2. Information We Collect</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">2.1 Information You Provide Directly</h3>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            <strong>Account Information:</strong>
          </p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Email address (required for account creation)</li>
            <li>Password (encrypted and securely stored)</li>
            <li>Account preferences and settings</li>
          </ul>

          <p className="mb-4 leading-relaxed text-muted-foreground">
            <strong>Business Information:</strong>
          </p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Cafe/restaurant name and details</li>
            <li>Business description</li>
            <li>Contact information</li>
            <li>Location details</li>
            <li>Operational preferences</li>
          </ul>

          <p className="mb-4 leading-relaxed text-muted-foreground">
            <strong>Menu Content:</strong>
          </p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Category names and descriptions</li>
            <li>Product names, descriptions, and prices</li>
            <li>Product images and logos</li>
            <li>Menu organization and structure</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">2.2 Information Collected Automatically</h3>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            <strong>Technical Information:</strong>
          </p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Operating system</li>
            <li>Access times and dates</li>
            <li>Pages viewed and features used</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">3. How We Use Your Information</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">3.1 Primary Services</h3>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Account Management:</strong> Create, maintain, and secure your account
            </li>
            <li>
              <strong>Menu Generation:</strong> Create and display your digital menus and QR codes
            </li>
            <li>
              <strong>File Storage:</strong> Store and serve your uploaded images and logos
            </li>
            <li>
              <strong>Service Delivery:</strong> Provide core platform functionality
            </li>
            <li>
              <strong>Customer Support:</strong> Respond to your inquiries and provide assistance
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">4. Third-Party Service Providers</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">We use the following third-party services:</p>

          <p className="mb-4 leading-relaxed text-muted-foreground">
            <strong>Supabase:</strong>
          </p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Purpose: Database storage, authentication, file storage</li>
            <li>Data shared: Account information, menu data, uploaded files</li>
            <li>Privacy policy: https://supabase.com/privacy</li>
          </ul>

          <p className="mb-4 leading-relaxed text-muted-foreground">
            <strong>Cloudflare Turnstile:</strong>
          </p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Purpose: Bot protection and CAPTCHA verification</li>
            <li>Data shared: Browser information, IP address</li>
            <li>Privacy policy: https://www.cloudflare.com/privacy/</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">5. Data Security</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">We implement industry-standard security measures:</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Encryption:</strong> Data is encrypted in transit and at rest
            </li>
            <li>
              <strong>Authentication:</strong> Secure user authentication systems
            </li>
            <li>
              <strong>Access Controls:</strong> Restricted access to user data
            </li>
            <li>
              <strong>Regular Security Audits:</strong> Ongoing security assessments
            </li>
            <li>
              <strong>Secure Infrastructure:</strong> Protected servers and databases
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">6. Your Privacy Rights</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            As a user located in the European Union, you have specific rights under the General Data Protection Regulation (GDPR). You have the right
            to:
          </p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Access:</strong> View your personal information and account data
            </li>
            <li>
              <strong>Rectification:</strong> Update your account information and preferences
            </li>
            <li>
              <strong>Erasure ("Right to be Forgotten"):</strong> Request deletion of your account and associated data
            </li>
            <li>
              <strong>Data Portability:</strong> Download your menu data and content in a structured format
            </li>
            <li>
              <strong>Restriction of Processing:</strong> Limit how we process your data
            </li>
            <li>
              <strong>Object to Processing:</strong> Object to certain types of data processing
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">6.1 Exercising Your GDPR Rights</h3>
          <p className="mb-4 leading-relaxed text-muted-foreground">You can exercise your GDPR rights directly through our platform:</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Data Export:</strong> Access your GDPR Compliance page in your account settings to download all your data
            </li>
            <li>
              <strong>Data Deletion:</strong> Use the GDPR Compliance page to permanently delete your account and all associated data
            </li>
            <li>
              <strong>Account Access:</strong> Log into your account to view and modify your personal information
            </li>
          </ul>
          <p className="mb-4 leading-relaxed text-muted-foreground">To access these features:</p>
          <ol className="mb-4 space-y-2 text-muted-foreground list-decimal list-inside">
            <li>Log in to your Only Menu account</li>
            <li>Click on your user menu (top-right corner)</li>
            <li>Select "GDPR Compliance" from the dropdown menu</li>
            <li>Choose whether you want to export or delete your data</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">7. Contact Information</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">For privacy-related questions or concerns:</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Email:</strong> developer@ozgorkem.com
            </li>
            <li>
              <strong>Subject Line:</strong> Include "Privacy Policy" in your subject line
            </li>
            <li>
              <strong>Response Time:</strong> We aim to respond within 48 hours
            </li>
          </ul>

          <div className="border-t mt-8 pt-8">
            <p className="text-sm text-muted-foreground mt-2">
              This Privacy Policy is part of our Terms of Service. By using Only Menu, you acknowledge that you have read and understand this Privacy
              Policy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
