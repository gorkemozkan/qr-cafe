import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section
      className="py-20 px-4 bg-primary text-primary-foreground"
      aria-labelledby="cta-heading"
    >
      <div className="container mx-auto text-center">
        <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Transform Your Cafe?
        </h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto opacity-90">
          Join thousands of cafes already using QR Cafe to modernize their
          operations and enhance customer experience.
        </p>
        <p className="text-sm mb-8 max-w-2xl mx-auto opacity-75">
          ✨ Customer Analytics and Real-time Updates coming soon!
        </p>
        <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
          Start Your Free Trial
        </Button>
      </div>
    </section>
  );
}
