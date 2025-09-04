import { FC } from "react";
import NextLink from "next/link";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const Header: FC = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <div className="flex items-center space-x-2">
            <QrCode className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="text-2xl font-bold">QR Cafe</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <NextLink href="/admin/auth/login" className="hidden md:inline-flex">
              <Button variant="outline">Sign In</Button>
            </NextLink>
            <Button asChild>
              <NextLink href="/admin/auth/signup">Get Started</NextLink>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
