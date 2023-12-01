import React from 'react'
import { StyleSheet } from 'react-native'
import Page from '@components/page'
import { WebView } from 'react-native-webview';
import Header from "../../components/header";
import {useRouter} from "expo-router";
import Pdf from "react-native-pdf";

export default function Introduction() {
  const pdfURL="https://my-way-web.vercel.app/intro.pdf"
  const router = useRouter()

  return (
    <Page>
      <Header title="Introduction" onPressButton={() => router.back()}/>
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

const styles = StyleSheet.create({
  container: {
    height: 500,
    marginBottom: 50
  },
});