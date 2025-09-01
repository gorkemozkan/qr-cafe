import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Contact() {
  return (
    <section id="contact" className="py-20 px-4" aria-labelledby="contact-heading">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-16">
          <h2 
            id="contact-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Get in Touch
          </h2>
          <p className="text-xl text-muted-foreground">
            Have questions? We'd love to hear from you.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <address className="not-italic">
            <h3 className="text-2xl font-semibold mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Email</h4>
                <a 
                  href="mailto:hello@qrcafe.com" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@qrcafe.com
                </a>
              </div>
              <div>
                <h4 className="font-medium">Phone</h4>
                <a 
                  href="tel:+15551234567" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <div>
                <h4 className="font-medium">Address</h4>
                <p className="text-muted-foreground">
                  123 Cafe Street
                  <br />
                  Coffee City, CC 12345
                </p>
              </div>
            </div>
          </address>

          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" type="text" placeholder="Your name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="your@email.com" required />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Your message..."
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
