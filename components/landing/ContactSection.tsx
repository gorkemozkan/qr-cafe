"use client";

import { FC, useState } from "react";
import { Mail, MessageSquare, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ContactSection: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden" aria-labelledby="contact-heading">
      <div className="absolute inset-0">
        <div
          className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-700/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-orange-300/20 to-orange-500/20 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-lg opacity-50 animate-pulse" />
                <div className="relative bg-white dark:bg-gray-900 rounded-full p-4 shadow-2xl">
                  <MessageSquare className="h-8 w-8 text-orange-600 animate-pulse" />
                </div>
              </div>
            </div>

            <h2 id="contact-heading" className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              Get in <span className="bg-gradient-to-r from-orange-400 via-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">Touch</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have questions about QR Cafe? We'd love to help you transform your cafe's menu experience.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-md opacity-50 animate-pulse" />
                    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-full p-2">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Send us a message</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="transition-all duration-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="transition-all duration-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="transition-all duration-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="transition-all duration-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                      placeholder="Tell us about your cafe and how we can help..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full group text-lg py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin mr-2 h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-transform duration-300 hover:scale-105 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Email Us</h4>
                      <p className="text-gray-600 dark:text-gray-400">Get in touch via email</p>
                    </div>
                  </div>
                  <p className="text-orange-600 dark:text-orange-400 font-medium">developer@ozgorkem.com</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-transform duration-300 hover:scale-105 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Response Time</h4>
                      <p className="text-gray-600 dark:text-gray-400">We typically respond within</p>
                    </div>
                  </div>
                  <p className="text-orange-600 dark:text-orange-400 font-medium">24 hours</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-transform duration-300 hover:scale-105 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Support</h4>
                      <p className="text-gray-600 dark:text-gray-400">Questions about features or pricing</p>
                    </div>
                  </div>
                  <p className="text-orange-600 dark:text-orange-400 font-medium">Always happy to help</p>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-orange-600/10 rounded-2xl blur-xl opacity-100" />
                <div className="relative bg-orange-50/80 dark:bg-orange-950/20 backdrop-blur-sm border border-orange-200 dark:border-orange-800 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Questions?</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong className="text-orange-600">Free plan:</strong> Perfect for single cafe locations
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong className="text-orange-600">Pro plan:</strong> Unlimited cafes + advanced features
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong className="text-orange-600">Setup:</strong> Get your QR menu live in minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
