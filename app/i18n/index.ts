import defaultLocale from './locales/ms.json'

interface SharedTextType {
  [key: string]: string;
}

let SHARED_TEXT: SharedTextType = { ...defaultLocale }

for (let key in SHARED_TEXT) {
  if (SHARED_TEXT.hasOwnProperty(key)) {
    SHARED_TEXT[key] = key;
  }
}

export default SHARED_TEXT