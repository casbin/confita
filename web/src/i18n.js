import i18n from 'i18next'
import zh from './locales/zh/data.json'
import en from './locales/en/data.json'

const resources = {
  en: en,
  zh: zh,
};

i18n
  .init({
    lng: "en",

    resources: resources,

    keySeparator: false,

    interpolation: {
      escapeValue: false
    },
    
    saveMissing: true,
  })

export default i18n;