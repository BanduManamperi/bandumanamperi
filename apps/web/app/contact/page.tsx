"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import posthog from "posthog-js";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                }),
            });
            await res.json().catch(() => ({}));

            if (!res.ok) {
                setStatus("error");
                return;
            }

            setStatus("success");
            posthog.capture("contact_form_submitted", {
                subject: formData.subject,
                message_length: formData.message.length,
                source: "contact_page",
            });
            posthog.identify(formData.email, {
                email: formData.email,
                name: formData.name,
            });
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setStatus("idle"), 3000);
        } catch {
            setStatus("error");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-24 md:pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-6 lg:px-12">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
                            Get in Touch
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
                            Contact
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
                            For inquiries about artworks, exhibitions, restoration services, or collaborations
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-12 lg:gap-16">
                        {/* Contact Information */}
                        <div className="md:col-span-2 space-y-12">
                            <div>
                                <h2 className="text-2xl font-light mb-8">Information</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <Mail className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">
                                                Email
                                            </p>
                                            <a 
                                                href="mailto:info@bandumanamperi.com"
                                                className="text-foreground hover:text-muted-foreground transition-colors"
                                            >
                                                info@bandumanamperi.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Phone className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">
                                                Phone
                                            </p>
                                            <a 
                                                href="tel:+94123456789"
                                                className="text-foreground hover:text-muted-foreground transition-colors"
                                            >
                                                +94 12 345 6789
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">
                                                Studio
                                            </p>
                                            <p className="text-foreground">
                                                Colombo, Sri Lanka
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Studio Hours */}
                            <div>
                                <h3 className="text-lg font-light mb-4">Studio Hours</h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>Monday - Friday: 10:00 AM - 6:00 PM</p>
                                    <p>Saturday: By Appointment</p>
                                    <p>Sunday: Closed</p>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div>
                                <h3 className="text-lg font-light mb-4">Follow</h3>
                                <div className="flex gap-4">
                                    <a 
                                        href="#" 
                                        className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wider"
                                    >
                                        Instagram
                                    </a>
                                    <a 
                                        href="#" 
                                        className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wider"
                                    >
                                        Facebook
                                    </a>
                                    <a 
                                        href="#" 
                                        className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wider"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-3">
                            <h2 className="text-2xl font-light mb-8">Send a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:border-foreground transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:border-foreground transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:border-foreground transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === "sending"}
                                    className="inline-flex items-center gap-3 px-8 py-3 text-sm tracking-widest uppercase border border-border text-foreground hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === "sending" ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                {status === "success" && (
                                    <p className="text-sm text-foreground">
                                        Thank you for your message. We'll get back to you soon.
                                    </p>
                                )}

                                {status === "error" && (
                                    <p className="text-sm text-red-600">
                                        Something went wrong. Please try again.
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContactPage;

