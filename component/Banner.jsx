'use client';

import React, { useEffect, useState } from 'react';
import { getPersonalizationEntry } from '../service/entry';
import { usePersonalization } from '../context/PersonalizationProvider';
import { useLanguage } from '../context/Languagecontext';

export default function Banner() {
  const [banner, setBanner] = useState(null);
  const { locale } = useLanguage();


  const { personalizationSDK, isInitialized, audience } = usePersonalization();
  
//   console.log("Audience being used:", audience);
//   console.log("Personalization SDK setup:", personalizationSDK);
//   console.log("Is SDK Initialized:", isInitialized);
  

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        if (!personalizationSDK || !isInitialized) return;

        const result = await getPersonalizationEntry(
          'banner',
          personalizationSDK,
          locale,
          [],
          audience
        );

        if (result) setBanner(result);
      } catch (error) {
        console.error('Error fetching personalized banner:', error);
      }
    };

    fetchBanner();
  }, [personalizationSDK, isInitialized, audience,locale]);

  if (!banner) return null;

  return (
    <section className="bg-gray-100 py-10 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{banner.title}</h1>
        <p className="text-lg mb-6">{banner.description}</p>

        {banner.image?.url && (
          <img
            src={banner.image.url}
            alt={banner.image.title || 'Banner image'}
            width={800}
            height={400}
            className="mx-auto rounded-lg"
          />
        )}

        {banner.CTA && banner.CTA.title && banner.CTA.url && (
          <a
            href={banner.CTA.url}
            className="inline-block mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            {banner.CTA.title}
          </a>
        )}
      </div>
    </section>
  );
}
