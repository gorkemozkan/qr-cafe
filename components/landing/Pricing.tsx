import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "$9",
    description: "Perfect for small cafes",
    features: ["1 QR Menu", "Up to 50 items", "Email support"],
    popular: false,
    cta: "Get Started",
    variant: "outline" as const,
  },
  {
    name: "Professional",
    price: "$29",
    description: "Most popular choice",
    features: [
      "5 QR Menus",
      "Unlimited items",
      "Priority support",
      "Custom branding",
    ],
    popular: true,
    cta: "Get Started",
    variant: "default" as const,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For large chains",
    features: [
      "Unlimited QR Menus",
      "Multi-location support",
      "API access",
      "24/7 phone support",
      "White-label solution",
    ],
    popular: false,
    cta: "Contact Sales",
    variant: "outline" as const,
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-20 px-4"
      aria-labelledby="pricing-heading"
    >
      <div className="container mx-auto">
        <header className="text-center mb-16">
          <h2
            id="pricing-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your cafe size and needs. No hidden fees.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.popular ? "border-primary" : ""}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold">
                  {plan.price}
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full mr-3"
                        aria-hidden="true"
                      ></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.variant}>
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
