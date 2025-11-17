import symbolArabic from "../shared/symbolUtils";
import { Text } from "react-native";

interface SpecialTextProps {
  className?: string;
  text: string;
}

function SpecialText({ text, className }: SpecialTextProps) {
  function containsSpecialSymbol(str) {
    return symbolArabic.some(symbol => str.includes(symbol));
  }

  const segments = text.split(/([ ,.!?;:"()]+)/).map((segment, index) => {
    if (containsSpecialSymbol(segment.trim())) {
      // Apply symbol font if segment contains special symbols
      return <Text key={index} className="font-arabic-symbols">{segment}</Text>;
    } else {
      // Otherwise, use the default font
      return <Text key={index} className="font-bold">{segment}</Text>;
    }
  });

  return <Text className="text-royal-blue-950 dark:text-white font-semibold">{segments}</Text>;
}

export default SpecialText