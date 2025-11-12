import { Text } from "react-native";

function determineDirection(text) {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text) ? 'rtl' : 'ltr';
}

function QuranText({ text, special = false, font = "arabic-regular" }) {
  const regex = /([\uFD3F].*?[\uFD3E])/; // These are the Unicode points for the Arabic brackets
  const parts = text.split(regex);

  // Map old font names to new Tailwind class names
  const fontClassMap = {
    'arabic_regular': 'font-arabic-regular',
    'arabic_symbols': 'font-arabic-symbols',
    'arabic_bold': 'font-arabic-bold',
    'uthmanic_hafs': 'font-uthmanic-hafs',
    'arabic-regular': 'font-arabic-regular',
    'arabic-symbols': 'font-arabic-symbols',
    'arabic-bold': 'font-arabic-bold',
    'uthmanic-hafs': 'font-uthmanic-hafs',
  };

  const getFontClass = (fontName) => fontClassMap[fontName] || 'font-arabic-regular';

  return parts.map((part, index) => {
    const direction = determineDirection(part);
    // const style = { textAlign: direction === 'rtl' ? 'right' : 'left', writingDirection: direction === 'rtl' ? 'rtl' : 'ltr' };

    if (part.startsWith('\uFD3F') && part.endsWith('\uFD3E')) {
      // Remove the special brackets and apply a different style
      if (special) {
        return (
          <Text key={index}>
            <Text className="font-arabic-regular">{part.slice(-1)}</Text>
            <Text className="font-uthmanic-hafs">{part.slice(1, -1)}</Text>
            <Text className="font-arabic-regular">{part.slice(0, 1)}</Text>
          </Text>
        )
      }

      return (
        <Text key={index} >
          <Text className="font-arabic-regular">{part.slice(0, 1)}</Text>
          <Text className="font-uthmanic-hafs">{part.slice(1, -1)}</Text>
          <Text className="font-arabic-regular">{part.slice(-1)}</Text>
        </Text>
      )
    }
    // Render the rest of the text normally
    return <Text key={index} className={getFontClass(font)}>{part}</Text>;
  })
}

export default QuranText