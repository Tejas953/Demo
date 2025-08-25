import { Contentstack_stack } from "../contentstack-config/Deliverysdk";
import * as Contentstack from "contentstack";

const addEditableTags = Contentstack.Utils.addEditableTags;


// ✅ Function to extract variant IDs from personalization SDK
export function deserializeVariantIds(personalizationSDK) {
    try {
        if (!personalizationSDK) return ''
        return personalizationSDK.getVariantAliases().join(',')
    } catch (err) {
        console.error('Error while deserializing variant ids : ', err)
        return ''
    }
}
/**
 * Fetch a single entry from Contentstack (non-personalized).
 */
export const getSingleEntry = async (
    content_type_uid,
    locale = "en-us",
    ref = []
) => {
    try {
        const response = await Contentstack_stack.ContentType(content_type_uid)
            .Query()
            .language(locale)
            .includeEmbeddedItems([])
            .includeReference(ref)
            .toJSON()
            .find();

        const [entry] = response[0];

        if (!entry)
            throw new Error(`No entry found for content type: ${content_type_uid}`);

        addEditableTags(entry, content_type_uid, true, locale);

        return entry;
    } catch (error) {
        console.error("Error fetching single entry:", error);
        throw error;
    }
};




/**
 * Fetch a personalized entry using the Personalize SDK.
 */
// export const getPersonalizationEntry = async (
//     content_type_uid,
//     personalizationSDK,
//     locale = "en",
//     ref = [],
//     audience
// ) => {
//     try {
//         console.log("Fetching personalized entry for audience:", audience);
//         console.log("Using locale:", locale);
//         const [data] = await Contentstack_stack.ContentType(content_type_uid)
//             .Query()
//             .language(locale)
//             .includeFallback() // Includes fallback if no variant is found
//             .includeEmbeddedItems([])
//             .variants(audience) // 👈 correct use
//             .toJSON()
//             .find();

//         addEditableTags(data[0], content_type_uid, true, locale);

//         return data[0];
//     } catch (error) {
//         console.error("Error fetching personalized entry:", error);
//         throw error;
//     }
// };


export const getPersonalizationEntry = async (
  content_type_uid,
  personalizationSDK,
  locale = "en-us",
  ref = [],
  audience
) => {
  try {
    // console.log("Fetching personalized entry | locale:", locale, "| audience:", audience);

    // Step 1: Try locale + audience
    const [entries] = await Contentstack_stack.ContentType(content_type_uid)

      .Query()
      .language(locale)
      .variants(audience)
      .includeEmbeddedItems([])
      .toJSON()
      .find();

    if (entries?.length) {
      addEditableTags(entries[0], content_type_uid, true, locale);
      return entries[0];
    }

    // Step 2: Try master locale + audience
    const masterLocale = "en-us";
    if (locale !== masterLocale) {
    //   console.log("Fallback → master locale + variant:", masterLocale, audience);
      const [masterEntries] = await Contentstack_stack.ContentType(content_type_uid)
        .Query()
        .language(masterLocale)
        .variants(audience)
        .includeEmbeddedItems([])
        .toJSON()
        .find();

      if (masterEntries?.length) {
        addEditableTags(masterEntries[0], content_type_uid, true, masterLocale);
        return masterEntries[0];
      }
    }

    // Step 3: Final fallback → default variant
    // console.log("Fallback → default variant (no localized/variant match)");
    const [fallbackEntries] = await Contentstack_stack.ContentType(content_type_uid)
      .Query()
      .language(locale)
      .includeFallback()
      .includeEmbeddedItems([])
      .toJSON()
      .find();

    if (fallbackEntries?.length) {
      addEditableTags(fallbackEntries[0], content_type_uid, true, locale);
      return fallbackEntries[0];
    }

    throw new Error("No entry found in any fallback sequence.");
  } catch (error) {
    console.error("Error fetching personalized entry:", error);
    throw error;
  }
};



/**
 * Fetch all entries of a content type.
 */
export const getAllEntries = async (
    content_type_uid,
    locale = "en",
    ref = []
) => {
    try {
        const response = await Contentstack_stack.ContentType(content_type_uid)
            .Query()
            .language(locale)
            .includeEmbeddedItems([])
            .includeReference(ref)
            .toJSON()
            .find();

        const entries = response[0];

        if (!entries || entries.length === 0)
            throw new Error(`No entries found for content type: ${content_type_uid}`);

        entries.forEach((entry) => {
            addEditableTags(entry, content_type_uid, true, locale);
        });

        return entries;
    } catch (error) {
        console.error("Error fetching all entries:", error);
        throw error;
    }
};
