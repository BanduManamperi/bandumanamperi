'use client';

import React, { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import posthog from "posthog-js";
import { CONTACT_FORM_ENABLED } from "@/lib/contact-form";
import { STUDIO_HOST, STUDIO_MAPS, STUDIO_URL } from "@/lib/studio";
import { Spread, belowStandfirst, footStandfirst, rightPageBleed } from "@/components/sheet/spread";

interface ContactSectionProps {
    /** Spread position, so page numbers stay sequential when Events is hidden. */
    index: number;
    headingLevel?: "h1" | "h2";
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

const ContactSection = ({ index, headingLevel = "h2", nowShowing }: ContactSectionProps) => {
    const Heading = headingLevel;
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

    const field =
        "w-full border-0 border-b border-border bg-transparent px-0 py-2 text-[0.9375rem] text-foreground focus:border-foreground focus:outline-none focus:ring-0 transition-colors";
    const fieldLabel = "block text-[0.75rem] text-muted-foreground";
    const textLink =
        "text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

    const trackSocial = (platform: string) =>
        posthog.capture("social_link_clicked", { platform, source: "homepage_contact_section" });

    return (
        <Spread index={index}>
            <div id="contact" className="h-full">
                <div className="grid min-h-full grid-cols-1 gap-y-10 py-6 lg:grid-cols-12 lg:gap-x-[clamp(1.5rem,3vw,3.5rem)] lg:py-8">

                    {/* Left page: how to reach him */}
                    <div className="flex min-w-0 flex-col lg:col-span-5 lg:h-full lg:overflow-y-auto xl:col-span-4">
                        <Heading
                            className="font-display text-[clamp(3rem,4.8vw,6rem)] font-light leading-[0.95] tracking-[-0.02em] text-foreground"
                        >
                            Contact
                        </Heading>

                        <p className={`${footStandfirst} max-w-[30rem] text-[0.9375rem] leading-[1.6] text-foreground/80`}>
                            For enquiries concerning artworks, exhibitions, studio visits, or any
                            other matter.
                        </p>

                        <dl className={`${belowStandfirst} grid max-w-[30rem] grid-cols-[6.5rem_1fr] gap-x-4 gap-y-3 text-[0.8125rem] leading-[1.5]`}>
                            <dt className="text-muted-foreground">Email</dt>
                            <dd><a href="mailto:bandumanamperi@yahoo.com" className={textLink}>bandumanamperi@yahoo.com</a></dd>

                            <dt className="text-muted-foreground">Phone</dt>
                            <dd><a href="tel:+94773672789" className={textLink}>+94 77 367 2789</a> <span className="text-muted-foreground">(WhatsApp)</span></dd>

                            <dt className="text-muted-foreground">Studio</dt>
                            <dd><a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" className={textLink}>{STUDIO_HOST}</a></dd>

                            <dt className="text-muted-foreground">Visit</dt>
                            <dd className="flex flex-wrap gap-x-4 gap-y-1">
                                <span className="text-foreground">Bandaragama, Sri Lanka</span>
                                <a href={STUDIO_MAPS.google} target="_blank" rel="noopener noreferrer" className={textLink}>Google Maps</a>
                                <a href={STUDIO_MAPS.apple} target="_blank" rel="noopener noreferrer" className={textLink}>Apple Maps</a>
                            </dd>

                            <dt className="text-muted-foreground">Elsewhere</dt>
                            <dd className="flex flex-wrap gap-x-4 gap-y-1">
                                <a href="https://www.instagram.com/bandu_manamperi/" target="_blank" rel="noopener noreferrer" className={textLink} onClick={() => trackSocial("instagram")}>Instagram</a>
                                <a href="https://www.facebook.com/bandu.manamperi" target="_blank" rel="noopener noreferrer" className={textLink} onClick={() => trackSocial("facebook")}>Facebook</a>
                                <a href="https://theertha.org/artists/bandu-manamperi/" target="_blank" rel="noopener noreferrer" className={textLink} onClick={() => trackSocial("theertha_collective")}>Theertha</a>
                            </dd>

                            {nowShowing && (
                                <>
                                    <dt className="text-muted-foreground">Now showing</dt>
                                    <dd className="text-foreground">
                                        {nowShowing.name}, until {formatEndDate(nowShowing.endDate)}
                                    </dd>
                                </>
                            )}
                        </dl>
                    </div>

                    {/* Right page: the message form, or a performance still while the form is off */}
                    {CONTACT_FORM_ENABLED ? (
                        <div className="flex min-w-0 flex-col justify-end lg:col-span-7 lg:h-full xl:col-span-8">
                            <form onSubmit={handleSubmit} className="grid max-w-[44rem] grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className={fieldLabel}>Name</label>
                                    <input id="name" name="name" value={formData.name} onChange={handleChange} required className={field} />
                                </div>
                                <div>
                                    <label htmlFor="email" className={fieldLabel}>Email</label>
                                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className={field} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="enquiry" className={fieldLabel}>About</label>
                                    <select id="enquiry" name="enquiry" value={formData.enquiry} onChange={handleChange} className={`${field} cursor-pointer appearance-none`}>
                                        <option value="" disabled>Choose a topic</option>
                                        {ENQUIRY_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="message" className={fieldLabel}>Message</label>
                                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className={`${field} resize-none`} />
                                </div>
                                <div className="sm:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="h-11 rounded-[2px] bg-foreground px-6 text-[0.8125rem] text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Sending…" : "Send message"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <figure className={rightPageBleed}>
                            <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--sheet-rule)] lg:aspect-auto lg:flex-1 grayscale">
                                <Image
                                    src="/Iron Man.jpg"
                                    alt="Bandu Manamperi ironing a white cloth on a street in front of the Old Parliament building in Colombo"
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                                />
                            </div>
                            <figcaption className="mt-2 text-[0.6875rem] text-muted-foreground">
                                Iron Man, performance
                            </figcaption>
                        </figure>
                    )}

                </div>
            </div>
        </Spread>
    );
};

export default ContactSection;
