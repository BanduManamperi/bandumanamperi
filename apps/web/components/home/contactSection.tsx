'use client';

import React, { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Mail, Phone, MapPin, Facebook, Instagram, ExternalLink } from "lucide-react";
import posthog from "posthog-js";
import { CONTACT_FORM_ENABLED } from "@/lib/contact-form";
import { motion } from "framer-motion";

interface ContactSectionProps {
    nowShowing?: {
        name: string;
        endDate: string;
    };
}

const ENQUIRY_OPTIONS = [
    "Exhibition",
    "Commission",
    "Framing & Restoration",
    "Press",
    "Studio Visit",
    "Other",
];

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatEndDate(iso: string) {
    const [, m, d] = iso.split("-").map(Number);
    return `${d} ${MONTHS_SHORT[m - 1]}`;
}

const ContactSection = ({ nowShowing }: ContactSectionProps) => {
    const [formData, setFormData] = useState({ name: "", email: "", enquiry: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, subject: formData.enquiry || "Homepage inquiry" }),
            });
            if (!res.ok) {
                toast.error("Something went wrong", { description: "Please try again or email directly." });
                return;
            }
            toast.success("Message sent", { description: "I'll get back to you soon." });
            posthog.capture("contact_form_home_submitted", { message_length: formData.message.length });
            posthog.identify(formData.email, { email: formData.email, name: formData.name });
            setFormData({ name: "", email: "", enquiry: "", message: "" });
        } catch {
            toast.error("Something went wrong", { description: "Please try again or email directly." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="h-full flex items-center bg-background overflow-hidden">
            <div className="w-full px-10 md:px-20 lg:px-32 xl:px-44 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* ── Left: info ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
                            Get in touch
                        </p>

                        <h2 className="font-heading text-[clamp(3rem,6vw,5rem)] font-bold leading-none tracking-tight text-foreground">
                            Contact
                        </h2>

                        <p className="mt-6 text-base text-muted-foreground font-light leading-relaxed max-w-sm">
                            For exhibitions, commissions, framing and restoration, or a studio visit — I'd be glad to hear from you.
                        </p>

                        {/* Contact rows */}
                        <div className="mt-8 border-t border-border">
                            <a
                                href="mailto:bandumanamperi@yahoo.com"
                                className="group flex items-start gap-4 py-4 border-b border-border hover:text-foreground transition-colors"
                            >
                                <Mail className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">Email</p>
                                    <p className="text-sm text-foreground">bandumanamperi@yahoo.com</p>
                                </div>
                            </a>
                            <a
                                href="tel:+94773672789"
                                className="group flex items-start gap-4 py-4 border-b border-border hover:text-foreground transition-colors"
                            >
                                <Phone className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">Phone & WhatsApp</p>
                                    <p className="text-sm text-foreground">+94 77 367 2789</p>
                                </div>
                            </a>
                            <div className="flex items-start gap-4 py-4 border-b border-border">
                                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">Studio</p>
                                    <p className="text-sm text-foreground">Bandaragama, Sri Lanka</p>
                                </div>
                            </div>
                        </div>

                        {/* Now showing pill */}
                        {nowShowing && (
                            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0" />
                                <span className="text-muted-foreground">Now showing:</span>
                                <span className="font-medium text-foreground">{nowShowing.name}</span>
                                <span className="text-muted-foreground">until {formatEndDate(nowShowing.endDate)}</span>
                            </div>
                        )}

                        {/* Social links */}
                        <div className="mt-6 flex items-center gap-5">
                            <a
                                href="https://www.facebook.com/bandu.manamperi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => posthog.capture("social_link_clicked", { platform: "facebook", source: "homepage_contact_section" })}
                                aria-label="Facebook"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href="https://www.instagram.com/bandu_manamperi/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => posthog.capture("social_link_clicked", { platform: "instagram", source: "homepage_contact_section" })}
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a
                                href="https://theertha.org/artists/bandu-manamperi/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => posthog.capture("social_link_clicked", { platform: "theertha_collective", source: "homepage_contact_section" })}
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Theertha
                            </a>
                        </div>
                    </motion.div>

                    {/* ── Right: form ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="bg-card rounded-2xl p-8"
                    >
                        <h3 className="font-heading text-2xl font-semibold text-foreground mb-6">
                            Send a message
                        </h3>

                        {CONTACT_FORM_ENABLED ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-11 rounded-lg bg-muted border border-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-border transition-colors"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-11 rounded-lg bg-muted border border-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-border transition-colors"
                                    />
                                </div>

                                {/* Enquiry */}
                                <div>
                                    <label htmlFor="enquiry" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                                        Enquiry
                                    </label>
                                    <select
                                        id="enquiry"
                                        name="enquiry"
                                        value={formData.enquiry}
                                        onChange={handleChange}
                                        className="w-full h-11 rounded-lg bg-muted border border-transparent px-4 text-sm text-foreground focus:outline-none focus:border-border transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Exhibition · Commission · Framing · Press</option>
                                        {ENQUIRY_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className="w-full rounded-lg bg-muted border border-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-border transition-colors resize-none"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 rounded-lg bg-foreground text-background text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isSubmitting ? "Sending…" : (
                                        <>
                                            Send message
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>The message form is not yet available.</p>
                                <p>
                                    Please reach out directly at{" "}
                                    <a href="mailto:bandumanamperi@yahoo.com" className="text-foreground underline underline-offset-2">
                                        bandumanamperi@yahoo.com
                                    </a>
                                </p>
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;
