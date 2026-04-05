'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CONTACT_FORM_ENABLED } from "@/lib/contact-form";
import { ContactFormUnavailable } from "@/components/contact/contact-form-unavailable";

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
                    subject: "Contact from website",
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
            setFormData({ name: "", email: "", message: "" });
        } catch {
            toast.error("Something went wrong", {
                description: "Please try again or email directly.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="flex-1 w-full py-20 bg-gallery-black text-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <span className="section-title text-gallery-gray inline-block">Get in Touch</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
                        Connect With Bandu
                    </h2>
                    <p className="text-gallery-gray">
                        For exhibition inquiries, commissions, performances, or to discuss Bandu Manamperi&apos;s work,
                        {CONTACT_FORM_ENABLED
                            ? " please reach out using the form below."
                            : " please get in touch using the contact details below."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                    <div className="md:col-span-2 space-y-8">
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-serif mb-2">Contact Information</h3>
                            <p className="text-gallery-gray mb-6">
                                Feel free to reach out through any of the following channels:
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium uppercase tracking-wider text-gallery-gray mb-1">
                                        Email
                                    </h4>
                                    <p>bandumanamperi@yahoo.com</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium uppercase tracking-wider text-gallery-gray mb-1">
                                        Gallery Representation
                                    </h4>
                                    <p>Theertha International Artists&apos; Collective</p>
                                    <p className="text-gallery-gray">Colombo, Sri Lanka</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium uppercase tracking-wider text-gallery-gray mb-1">
                                        Location
                                    </h4>
                                    <p>Colombo</p>
                                    <p className="text-gallery-gray">Sri Lanka</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        {CONTACT_FORM_ENABLED ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm">
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm">
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="bg-white/5 border-white/10 text-white resize-none"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto bg-white text-gallery-black hover:bg-gray-100 px-8"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                        ) : (
                        <ContactFormUnavailable variant="gallery" />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
