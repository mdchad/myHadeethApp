import defaultLocale from './locales/ms.json'

export async function getLocales(locale, appTheme) {
  const baseTranslationUrl = `./locales/${locale}.json`

  const getBasedTranslations = () =>
    locale === 'ms'
      ? Promise.resolve(defaultLocale)
      : fetch(baseTranslationUrl)
        .then((r) => r.json())
        .catch(() => defaultLocale)

  const baseTranslations = await Promise.all([
    getBasedTranslations()
  ])

  return {
    ...baseTranslations,
  }
}

let SHARED_TEXT = { ...defaultLocale}

export function setRootText(newVal) {
  Object.assign(SHARED_TEXT, newVal)
}

export default SHARED_TEXT