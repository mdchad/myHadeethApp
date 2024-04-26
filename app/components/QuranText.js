import { Text } from "react-native";

function QuranText({ text }) {
  const regex = /([\uFD3F].*?[\uFD3E])/; // These are the Unicode points for the Arabic brackets
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('\uFD3F') && part.endsWith('\uFD3E')) {
      // Remove the special brackets and apply a different style
      return (
        <Text key={index}>
          <Text>{part.slice(0, 1)}</Text>
          <Text style={{ fontFamily: "uthmanic_hafs" }}>{part.slice(1, -1)}</Text>
          <Text>{part.slice(-1)}</Text>
        </Text>
      )
    }
    // Render the rest of the text normally
    return <Text key={index} className="font-arabic">{part}</Text>;
  })
}

export default QuranText