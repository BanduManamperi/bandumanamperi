import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="text-2xl font-semibold hover:text-primary transition-colors inline-block"
                        >
                            Bandu Manamperi
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Contemporary artist exploring identity, body, and social constructs through performance art, sculpture, and visual works.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-4">
                        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
                            Navigation
                        </h3>
                        <nav className="flex flex-col space-y-3">
                            <Link
                                href="#work"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Work
                            </Link>
                            <Link
                                href="#about"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href="#contact"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Contact
                            </Link>
                            <Link
                                href="/artworks"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                All Artworks
                            </Link>
                        </nav>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
                            Connect
                        </h3>
                        <nav className="flex flex-col space-y-3">
                            <a
                                href="https://www.facebook.com/bandu.manamperi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <Facebook className="w-4 h-4" />
                                <span>Facebook</span>
                                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <a
                                href="https://www.instagram.com/bandu_manamperi/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <Instagram className="w-4 h-4" />
                                <span>Instagram</span>
                                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <a
                                href="https://theertha.org/artists/bandu-manamperi/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <span>Theertha Collective</span>
                                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
                            Contact
                        </h3>
                        <div className="flex flex-col space-y-3 text-sm">
                            <a
                                href="mailto:bandumanamperi@yahoo.com"
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                <span>bandumanamperi@yahoo.com</span>
                            </a>
                            <div className="flex items-start gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p>Colombo, Sri Lanka</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-muted-foreground text-center md:text-left">
                            © {currentYear} Bandu Manamperi. All rights reserved.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Performance & Visual Artist
                        </p>
                    </div>
                    <hr className="my-6 border-border" />
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                        <span>2026</span>
                        <a
                            href="https://rashodkorala.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                        >
                            Designed & developed by Rashod Korala
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
