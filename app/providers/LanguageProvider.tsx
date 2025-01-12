import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getLocale, setLocale } from "app/language/i18n";

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<string>(() => getLocale());

  // Ensure the state initializes correctly from persistent storage
  useEffect(() => {
    const savedLanguage = getLocale();
    console.log("savedLanguage", savedLanguage);
    setLanguage(savedLanguage);
  }, [language]);

  const setLanguage = (lang: string) => {
    setLocale(lang);
    setLanguageState(lang); // Update state to trigger re-render
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
