"use client";

import { QrCode } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="border-t py-2 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 py-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <QrCode className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="text-xl font-bold">Only Menu</span>
            </div>
            <p className="text-muted-foreground">Transforming cafes with smart QR menu solutions.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t py-4 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Only Menu - All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
