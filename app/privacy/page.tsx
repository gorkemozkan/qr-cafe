import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for QR Cafe - Smart QR Menu Solutions for Cafes & Restaurants",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            <strong>Last Updated: January 2025</strong>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">1. Introduction</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            QR Cafe ("we", "us", "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our QR code menu management platform.
          </p>
          <p className="mb-4 leading-relaxed text-muted-foreground">By using QR Cafe, you consent to the data practices described in this policy.</p>

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
          <p className="mb-4 leading-relaxed text-muted-foreground">You have the right to:</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>
              <strong>Access:</strong> View your personal information and account data
            </li>
            <li>
              <strong>Update:</strong> Modify your account information and preferences
            </li>
            <li>
              <strong>Delete:</strong> Request deletion of your account and associated data
            </li>
            <li>
              <strong>Export:</strong> Download your menu data and content
            </li>
          </ul>

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
            <p className="text-sm text-muted-foreground">
              <strong>Effective Date:</strong> January 2025
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This Privacy Policy is part of our Terms of Service. By using QR Cafe, you acknowledge that you have read and understand this Privacy Policy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
