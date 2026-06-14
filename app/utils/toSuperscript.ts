type SuperscriptType = 'text' | 'reference';

type SuperscriptMap = {
  [key: string]: string;
};

const toSuperscript = (str: string, type: SuperscriptType): string | undefined => {
  const superscripts: SuperscriptMap = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹'
  }

  if (type === 'text') {
    return str.replace(/\[(\d+)\]/g, (match, p1: string) => {
      return p1
        .split('')
        .map((char: string) => superscripts[char] || char)
        .join('')
    })
  }

  if (type === 'reference') {
    return str
      .toLowerCase()
      .split('')
      .map((char) => superscripts[char] || char)
      .join('')
  }
}

export default toSuperscript;