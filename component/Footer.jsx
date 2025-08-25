'use client';

import React, { useEffect, useState } from 'react';
import { getSingleEntry } from '../service/entry';
import { useLanguage } from '../context/Languagecontext';

const Footer = () => {
    const [footer, setFooter] = useState(null);
    const { locale } = useLanguage();
    // console.log("Locale being used:", locale); // Should log the current locale
    useEffect(() => {
        const fetchFooter = async () => {
            try {
                const entry = await getSingleEntry('footer', locale);
                setFooter(entry);
            } catch (error) {
                console.error('Error fetching footer entry:', error);
            }
        };

        fetchFooter();
    }, [locale]);

    if (!footer) return null;

    const links = footer.modular_blocks
        .filter((block) => block.links)
        .map((block) => block.links);

    const socialLinks = footer.modular_blocks
        .filter((block) => block.social_links)
        .map((block) => block.social_links);

    return (
        <footer className="bg-gray-900 text-white px-6 pt-12 pb-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left Section: Logo, Title, Description */}
                <div className="space-y-4">
                    {footer.logo?.url && (
                        <img
                            src={footer.logo.url}
                            alt={footer.logo.title || 'Logo'}
                            width={60}
                            height={60}
                            className="rounded"
                        />
                    )}
                    <h2 className="text-2xl font-bold">{footer.title}</h2>
                    <p className="text-sm text-gray-400">{footer.description}</p>
                </div>

                {/* Center Section: Useful Links */}
                {links.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Useful Links</h4>
                        <ul className="space-y-3">
                            {links.map((link, idx) => (
                                <li key={idx}>
                                    <a
                                        href={link.url}
                                        className="hover:text-white text-gray-300 transition"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {socialLinks.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                        <ul className="space-y-4">
                            {socialLinks.map((social, idx) => (
                                <li key={idx}>
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-gray-300 hover:text-white transition"
                                    >
                                        {social.icon?.url && (
                                            <img
                                                src={social.icon.url}
                                                alt={social.icon.title || 'Icon'}
                                                width={24}
                                                height={24}
                                                className="object-contain"
                                            />
                                        )}
                                        <span className="text-base">{social.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>

            {/* Centered Copyright */}
            <div className="mt-12 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
                {footer.copyright || `© ${new Date().getFullYear()} All rights reserved.`}
            </div>
        </footer>
    );
};

export default Footer;
