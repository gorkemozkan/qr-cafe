import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Coffee } from "lucide-react";
import NextLink from "next/link";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav
          className="flex items-center justify-between"
          aria-label="Main navigation"
        >
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-primary" aria-hidden="true" />
            <span className="text-2xl font-bold">QR Cafe</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <NextLink href="/admin/auth" className="hidden md:inline-flex">
              <Button variant="outline">Sign In</Button>
            </NextLink>
            <Button asChild>
              <NextLink href="/admin/auth">Get Started</NextLink>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
