import { createContext, useContext, useState, useMemo } from 'react';
import messages from '../i18n/messages';

const LanguageContext = createContext();

/**
 * Supported languages:
 *   'en'  – English
 *   'mr'  – Marathi (मराठी)
 */
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('app_language') || 'en'
  );

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = useMemo(() => {
    return (key, vars = {}) => {
      const parts = key.split('.');
      let msg = messages[language] || messages.en;
      for (const p of parts) {
        msg = msg?.[p];
        if (!msg) break;
      }
      if (typeof msg === 'string') {
        return msg.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
      }
      return msg ?? key;
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  const [fallbackLanguage, setFallbackLanguage] = useState(
    () => localStorage.getItem('app_language') || 'en'
  );

  const fallbackChangeLanguage = (lang) => {
    setFallbackLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  const fallbackT = useMemo(() => {
    return (key, vars = {}) => {
      const parts = key.split('.');
      let msg = messages[fallbackLanguage] || messages.en;
      for (const part of parts) {
        msg = msg?.[part];
        if (!msg) break;
      }
      if (typeof msg === 'string') {
        return msg.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`);
      }
      return msg ?? key;
    };
  }, [fallbackLanguage]);

  return context || {
    language: fallbackLanguage,
    changeLanguage: fallbackChangeLanguage,
    t: fallbackT,
  };
};

export const useTranslation = () => {
  const { t } = useContext(LanguageContext);
  return { t };
};
