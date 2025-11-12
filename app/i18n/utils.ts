const DEFAULT_LANGUAGE = 'ms';

type Language = 'en' | 'ms' | 'ar';

interface TranslatableItem {
  [key: string]: string;
}

export default function getTranslation(item: TranslatableItem | undefined, currentLang: Language): string | undefined {
  if (item && item?.[currentLang]) {
    return item?.[currentLang];
  }
  return item?.[DEFAULT_LANGUAGE];
}