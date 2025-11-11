import { Share } from 'react-native';
import i18n from 'i18next';

export const shareHadith = async (hadith) => {
  const deepLink = `myway://hadith/${hadith._id}`;
  const message = i18n.t('SHARE_HADITH_MESSAGE');
  const formattedMessage = `${message}\n\n${deepLink}`;

  try {
    await Share.share({
      message: formattedMessage,
      url: deepLink // iOS will use this if available
    });
  } catch (error) {
    console.log('Error sharing:', error);
  }
}; 