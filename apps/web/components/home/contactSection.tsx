'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MapPin, Building2, Send, Facebook, Instagram, ExternalLink } from "lucide-react";
import posthog from "posthog-js";

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: "Homepage inquiry",
                    message: formData.message,
                }),
            });

            if (!res.ok) {
                toast.error("Something went wrong", {
                    description: "Please try again or email directly.",
                });
                setIsSubmitting(false);
                return;
            }

            toast.success("Message sent successfully", {
                description: "Thank you for your message. I'll get back to you soon.",
            });
            posthog.capture("contact_form_home_submitted", {
                message_length: formData.message.length,
                source: "homepage_contact_section",
            });
            posthog.identify(formData.email, {
                email: formData.email,
                name: formData.name,
            });
            setFormData({ name: "", email: "", message: "" });
        } catch {
            toast.error("Something went wrong", {
                description: "Please try again or email directly.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // PostHog: Track social link clicks
    const handleSocialLinkClick = (platform: string, url: string) => {
        posthog.capture('social_link_clicked', {
            platform: platform,
            url: url,
            source: 'homepage_contact_section',
        });
    };

    return (
        <section id="contact" className="py-24 md:py-32 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Get in Touch</p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Connect With Bandu
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        For exhibition inquiries, commissions, performances, or to discuss Bandu Manamperi&apos;s work,
                        please reach out using the form below or contact directly.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-2 rounded-lg bg-muted">
                                        <Mail className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-1">
                                            Email
                                        </h4>
                                        <a
                                            href="mailto:bandumanamperi@yahoo.com"
                                            className="text-foreground hover:text-primary transition-colors"
                                        >
                                            bandumanamperi@yahoo.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-2 rounded-lg bg-muted">
                                        <Building2 className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-1">
                                            Gallery Representation
                                        </h4>
                                        <p className="text-foreground">Theertha International Artists&apos; Collective</p>
                                        <p className="text-sm text-muted-foreground">Colombo, Sri Lanka</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-2 rounded-lg bg-muted">
                                        <MapPin className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-1">
                                            Location
                                        </h4>
                                        <p className="text-foreground">Colombo</p>
                                        <p className="text-sm text-muted-foreground">Sri Lanka</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="pt-8 border-t">
                            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
                                Follow
                            </h4>
                            <div className="flex flex-col gap-3">
                                <a
                                    href="https://www.facebook.com/bandu.manamperi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                                    onClick={() => handleSocialLinkClick('facebook', 'https://www.facebook.com/bandu.manamperi')}
                                >
                                    <Facebook className="w-4 h-4" />
                                    <span>Facebook</span>
                                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                                <a
                                    href="https://www.instagram.com/bandu_manamperi/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                                    onClick={() => handleSocialLinkClick('instagram', 'https://www.instagram.com/bandu_manamperi/')}
                                >
                                    <Instagram className="w-4 h-4" />
                                    <span>Instagram</span>
                                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                                <a
                                    href="https://theertha.org/artists/bandu-manamperi/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                                    onClick={() => handleSocialLinkClick('theertha_collective', 'https://theertha.org/artists/bandu-manamperi/')}
                                >
                                    <Building2 className="w-4 h-4" />
                                    <span>Theertha Collective</span>
                                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Name *
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your name"
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email *
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your.email@example.com"
                                        className="h-11"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">
                                    Message *
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    placeholder="Tell me about your inquiry..."
                                    className="resize-none"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                size="lg"
                                className="w-full sm:w-auto min-w-[160px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="mr-2">Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
