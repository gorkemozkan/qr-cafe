import { Coffee, QrCode } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <QrCode className="h-6 w-6 text-primary" aria-hidden="true" />

              <span className="text-xl font-bold">QR Cafe</span>
            </div>
            <p className="text-muted-foreground">
              Transforming cafes with smart QR menu solutions.
            </p>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} QR Cafe | developer@ozgorkem.com
          </p>
        </div>
      </div>
    </footer>
  );
}
