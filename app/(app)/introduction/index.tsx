import React, { useEffect } from 'react'
import Page from '@/app/components/page'
import Header from "../../components/header";
import {useRouter} from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import SHARED_TEXT from "../../i18n";
import {useTranslation} from "react-i18next";

export default function Introduction() {
  const { t, i18n } = useTranslation();
  const router = useRouter()

  const pdfURL = {
    ms: "https://myway.my/intro-malay.pdf",
    en: "https://myway.my/intro.pdf"
  }[i18n.language]

  useEffect(() => {
    openPdf();
  }, []);

  const openPdf = async () => {
    await WebBrowser.openBrowserAsync(pdfURL);
    router.back();
  };

  return (
    <Page edges={['top']}>
      <Header title={t(SHARED_TEXT.INTRO_TITLE)} onPressButton={() => router.back()}/>
    </Page>
  )
}