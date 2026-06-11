import defaultLocale from './locales/ms.json'

interface SharedTextType {
  [key: string]: string;
}

// Map every translation key to itself, so t(SHARED_TEXT.X) resolves by key.
const SHARED_TEXT: SharedTextType = {}

for (const key of Object.keys(defaultLocale)) {
  SHARED_TEXT[key] = key;
}

export default SHARED_TEXT