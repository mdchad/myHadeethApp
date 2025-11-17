/**
 * Font size configuration for hadith reading
 * Provides consistent font sizes across Arabic and Latin scripts
 */

export interface FontSizeStyle {
  size: string
  leading: string
  tracking: string
}

export const latinFontSizes: FontSizeStyle[] = [
  { size: 'text-xs', leading: 'leading-relaxed', tracking: 'tracking-wide' },
  { size: 'text-sm', leading: 'leading-relaxed', tracking: 'tracking-wide' },
  {
    size: 'text-base',
    leading: 'leading-relaxed',
    tracking: 'tracking-normal'
  },
  {
    size: 'text-lg',
    leading: 'leading-relaxed',
    tracking: 'tracking-normal'
  },
  {
    size: 'text-xl',
    leading: 'leading-relaxed',
    tracking: 'tracking-tighter'
  }
]

export const arabicFontSizes: FontSizeStyle[] = [
  { size: 'text-base', leading: 'leading-8', tracking: 'tracking-normal' },
  { size: 'text-lg', leading: 'leading-9', tracking: 'tracking-normal' },
  { size: 'text-xl', leading: 'leading-10', tracking: 'tracking-normal' },
  { size: 'text-2xl', leading: 'leading-10', tracking: 'tracking-normal' },
  {
    size: 'text-3xl',
    leading: 'leading-relaxed',
    tracking: 'tracking-normal'
  }
]

/**
 * Helper function to get font size class names
 */
export const getFontSizeClasses = (
  fontSizes: FontSizeStyle[],
  fontSizeIndex: number
): string => {
  const config = fontSizes[fontSizeIndex]
  return `${config.size} ${config.leading} ${config.tracking}`
}
