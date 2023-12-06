import React from 'react'
import { StyleSheet } from 'react-native'
import Page from '@components/page'
import { WebView } from 'react-native-webview';
import Header from "../../components/header";
import {useRouter} from "expo-router";
import Pdf from "react-native-pdf";
import SHARED_TEXT from "../../i18n";
import {useTranslation} from "react-i18next";

export default function Introduction() {
  const { t, i18n } = useTranslation();
  const pdfURL= {
    ms: "https://my-way-web.vercel.app/intro-malay.pdf",
    en: "https://my-way-web.vercel.app/intro.pdf"
  }[i18n.language]
  const router = useRouter()

  return (
    <Page>
      <Header title={t(SHARED_TEXT.INTRO_TITLE)} onPressButton={() => router.back()}/>
      <Pdf
        trustAllCerts={false}
        source={{ uri: pdfURL, cache: true }}
        style={{ flex: 1 }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`number of pages: ${numberOfPages}`);
        }}
      />
    </Page>
  )
}