import defaultLocale from './locales/ms.json'

export async function getLocales(locale) {
  const getBasedTranslations = (lang) => {
    return {
      en: require('./locales/en.json'),
      ms: require('./locales/ms.json')
    }[lang]
  }

  const baseTranslations = getBasedTranslations(locale)

  return {
    ...baseTranslations,
  }
}

let SHARED_TEXT = { ...defaultLocale}

export function setRootText(newVal) {
  Object.assign(SHARED_TEXT, newVal)
}

export default SHARED_TEXT