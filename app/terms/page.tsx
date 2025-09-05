import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for QR Cafe - Smart QR Menu Solutions for Cafes & Restaurants",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            <strong>Last Updated: January 2025</strong>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">1. Agreement to Terms</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            By accessing and using QR Cafe ("Service", "Platform", "we", "us", "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these
            Terms, please do not use our Service.
          </p>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            QR Cafe is a digital menu management platform that allows cafes and restaurants to create, manage, and display QR code-based menus for their customers.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">2. Description of Service</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">QR Cafe provides:</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Digital menu creation and management tools</li>
            <li>QR code generation for contactless menu access</li>
            <li>Multi-cafe management capabilities</li>
            <li>Category and product organization</li>
            <li>Mobile-optimized menu displays</li>
            <li>File storage for logos and product images</li>
            <li>Real-time menu updates</li>
            <li>Analytics and reporting (when available)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">3. User Accounts</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">3.1 Account Creation</h3>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>You must provide accurate, current, and complete information when creating an account</li>
            <li>You must maintain and update your account information</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You must immediately notify us of any unauthorized use of your account</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">3.2 Account Responsibilities</h3>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>You are solely responsible for all activities that occur under your account</li>
            <li>You must not share your account credentials with others</li>
            <li>You must use a strong password that meets our security requirements</li>
            <li>You must not create multiple accounts for the same business entity</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">4. Acceptable Use</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">4.1 Permitted Uses</h3>
          <p className="mb-4 leading-relaxed text-muted-foreground">You may use QR Cafe to:</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Create and manage digital menus for your legitimate food service business</li>
            <li>Upload logos and product images that you own or have rights to use</li>
            <li>Generate QR codes for your menu displays</li>
            <li>Manage multiple cafe locations under your account</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">4.2 Prohibited Uses</h3>
          <p className="mb-4 leading-relaxed text-muted-foreground">You may not:</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Upload content that is offensive, defamatory, or inappropriate</li>
            <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
            <li>Use the Service to distribute spam or malicious content</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Upload copyrighted material without permission</li>
            <li>Use the Service to compete with or replicate our platform</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">5. Limitation of Liability</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>WE PROVIDE THE SERVICE "AS IS" WITHOUT WARRANTIES</li>
            <li>WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES</li>
            <li>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE LAST 12 MONTHS</li>
            <li>WE ARE NOT LIABLE for business interruption, lost profits, or data loss</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">6. Contact Information</h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">For questions about these Terms, contact us at:</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Email: developer@ozgorkem.com</li>
            <li>Service: QR Cafe Platform</li>
          </ul>

          <div className="border-t mt-8 pt-8">
            <p className="text-sm text-muted-foreground">
              <strong>Effective Date:</strong> January 2025
            </p>
            <p className="text-sm text-muted-foreground mt-2">By using QR Cafe, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
