"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Personalize from "@contentstack/personalize-edge-sdk";


// Generate or get a persistent anonymous userId
const getAnonymousUserId = () => {
  if (typeof window !== "undefined") {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("userId", userId);
    }
    return userId;
  }
  return null;
};

// Context setup
const PersonalizationContext = createContext({
  isInitialized: false,
  personalizationSDK: undefined,
  audience: "default",
  setAudience: () => {},
});

export const usePersonalization = () => useContext(PersonalizationContext);

export const PersonalizationProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [personalizationSDK, setPersonalizationSDK] = useState();
  const [audience, setAudience] = useState("default");
   const [experiences, setExperiences] = useState([]);

  const initializePersonalizationSDK = async () => {
    try {
      const projectUID = "6894b77c4070cbfd1edd782e";
      const userId = "9c8335ef-c4b8-42d5-9805-b20ba1b4a756"; // ✅ anonymous user ID
      const edgeApiUrl = "https://personalize-edge.contentstack.com";

      if (!projectUID || !userId) throw new Error("Missing required config");

      if (edgeApiUrl) Personalize.setEdgeApiUrl(edgeApiUrl);

      const personalize = await Personalize.init(projectUID, { userId });
      setPersonalizationSDK(personalize);
      setIsInitialized(true);
    } catch (e) {
      console.error("Personalization SDK init error:", e);
    }
  };
    useEffect(() => {
    initializePersonalizationSDK();
  }, []);
// console.log(personalizationSDK);

 // Fetch experiences after SDK is ready
  useEffect(() => {
    const fetchExperiences = async () => {
      if (personalizationSDK) {
        try {
          const data = await personalizationSDK.getExperiences();
          // console.log("Fetched experiences:", data);
          setExperiences(data);
        } catch (error) {
          console.error("Error fetching experiences:", error);
        }
      }
    };

    fetchExperiences();
  }, [personalizationSDK]);

  // console.log("Expr",experiences)
  // Update variant in SDK when audience changes
// useEffect(() => {
//   if (personalizationSDK && audience) {
//     // Try setVariants if setVariantAliases does not exist
//     if (typeof personalizationSDK.setVariantAliases === "function") {
//       personalizationSDK.setVariantAliases([audience]);
//     } else if (typeof personalizationSDK.setVariants === "function") {
//       personalizationSDK.setVariants([audience]);
//     } else {
//       console.warn("No method to set variants on personalizationSDK");
//     }
//   }
// }, [personalizationSDK, audience]);
    return (
    <PersonalizationContext.Provider
      value={{
        isInitialized,
        personalizationSDK,
        audience,
        setAudience,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
};


