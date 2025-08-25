'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSingleEntry } from '../service/entry';
import { usePersonalization } from '../context/PersonalizationProvider';
import { useLanguage } from '../context/Languagecontext';

const Header = () => {
    const [header, setHeader] = useState(null);
    const { audience, setAudience } = usePersonalization();
    const { locale, setLocale } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const entry = await getSingleEntry('header', locale);
                setHeader(entry);
            } catch (error) {
                console.error('Error fetching header entry:', error);
            }
        };

        fetchData();
    }, [locale]);
    // console.log("Audience being used:", audience); // Should log the UID, not the label

    if (!header) return null;

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-teal-500 via-emerald-400 to-lime-300 shadow-md border-b border-gray-200">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                {header.logo?.url && (
                    <img
                        src={header.logo.url}
                        alt={header.logo.title || "Logo"}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                )}
                <h1 className="text-lg font-bold text-white tracking-tight">
                    {header.title || 'Site Title'}
                </h1>
            </div>

            {/* Nav */}
            <nav className="ml-10">
                <ul className="flex items-center space-x-9">
                    {header.navigation?.map((item, index) => (
                        <li key={index}>
                            <Link href={item.navigation?.url || '#'}>
                                <span className="text-white hover:text-black font-semibold transition duration-200">
                                    {item.navigation?.title || 'Link'}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Language Selector */}
            <div className="ml-6">
                <label className="text-white mr-2">Language:</label>
                <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value)}
                    className="px-2 py-1 rounded text-black"
                >
                    <option value="en-us">English</option>
                    <option value="es">Spanish</option>
                    <option value="ja">Japanese</option>
                    <option value="mr-in">Marathi</option>
                </select>
            </div>

            {/* Dropdown */}
            <div className="ml-6">
                <label className="text-white mr-2">Audience:</label>
                <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="px-2 py-1 rounded text-black"
                >
                    <option value="default">Default</option>
                    <option value="cs12ba679e091b0ebc">Adventure</option>      
                    <option value="csef64df57dae035a7">Relaxation</option>    
                    <option value="csf64df57dae035a7">Family</option> 
            
                </select>
            </div>
        </header>
    );
};

export default Header;
