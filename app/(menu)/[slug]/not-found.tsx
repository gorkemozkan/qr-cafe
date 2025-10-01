"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="text-center border-2 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Menu Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Oops! We couldn't find the menu you're looking for. It might have been moved, deleted, or the QR code
              might be outdated.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Try scanning a different QR code or contact the restaurant staff.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="animate-fade-in-up delay-100">
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="animate-fade-in-up delay-200"
                >
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
