'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Facebook, Instagram, ExternalLink } from "lucide-react";
import posthog from "posthog-js";
import { CONTACT_FORM_ENABLED } from "@/lib/contact-form";
import { ContactFormUnavailable } from "@/components/contact/contact-form-unavailable";
import { motion } from "framer-motion";

const ContactSection = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, subject: "Homepage inquiry" }),
            });
            if (!res.ok) {
                toast.error("Something went wrong", { description: "Please try again or email directly." });
                return;
            }
            toast.success("Message sent", { description: "I'll get back to you soon." });
            posthog.capture("contact_form_home_submitted", { message_length: formData.message.length });
            posthog.identify(formData.email, { email: formData.email, name: formData.name });
            setFormData({ name: "", email: "", message: "" });
        } catch {
            toast.error("Something went wrong", { description: "Please try again or email directly." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="h-full flex items-center bg-background">
            <div className="max-w-7xl mx-auto w-full px-8 lg:px-20 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* ── Left: headline + contact details ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                            Get in Touch
                        </p>
                        <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,6rem)] font-normal leading-none tracking-tight text-foreground mb-8">
                            Contact
                        </h2>

                        <div className="w-12 h-px bg-foreground/20 mb-8" />

                        {/* Email */}
                        <a
                            href="mailto:bandumanamperi@yahoo.com"
                            className="block text-base font-light text-foreground hover:text-muted-foreground transition-colors duration-300 mb-1"
                        >
                            bandumanamperi@yahoo.com
                        </a>
                        <p className="text-xs text-muted-foreground/60 font-light mb-10">
                            Colombo, Sri Lanka
                        </p>

                        {/* Social links */}
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Facebook", href: "https://www.facebook.com/bandu.manamperi", icon: Facebook, id: "facebook" },
                                { label: "Instagram", href: "https://www.instagram.com/bandu_manamperi/", icon: Instagram, id: "instagram" },
                                { label: "Theertha Collective", href: "https://theertha.org/artists/bandu-manamperi/", icon: ExternalLink, id: "theertha_collective" },
                            ].map(({ label, href, icon: Icon, id }) => (
                                <a
                                    key={id}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-foreground transition-colors duration-300 group w-fit"
                                    onClick={() => posthog.capture("social_link_clicked", { platform: id, source: "homepage_contact_section" })}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {label}
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Right: form ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        {CONTACT_FORM_ENABLED ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
                                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className="h-10 rounded-none border-border/60 focus:border-foreground bg-transparent" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className="h-10 rounded-none border-border/60 focus:border-foreground bg-transparent" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                                    <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Tell me about your inquiry..." className="resize-none rounded-none border-border/60 focus:border-foreground bg-transparent" />
                                </div>
                                <Button type="submit" disabled={isSubmitting} className="rounded-none px-8 gap-2">
                                    {isSubmitting ? "Sending..." : <><Send className="w-4 h-4" /> Send</>}
                                </Button>
                            </form>
                        ) : (
                            <ContactFormUnavailable title="Message form" className="h-full" />
                        )}
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;
