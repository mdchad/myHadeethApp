import { Share } from 'react-native';

export const shareHadith = async (hadith) => {
  let formattedMessage = '';

  hadith.content.forEach((item) => {
    formattedMessage += `\n${item.ar}\n\n ${item.ms}\n\n\n`;
  });

  formattedMessage += `${hadith.book_title.ms}\n\nhttps://myway.my`;

  try {
    await Share.share({ message: formattedMessage });
  } catch (error) {
    console.log('Error sharing:', error);
  }
}; 