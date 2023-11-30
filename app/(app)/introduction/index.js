import React from 'react'
import { StyleSheet } from 'react-native'
import Page from '@components/page'
import { WebView } from 'react-native-webview';
import Header from "../../components/header";
import {useRouter} from "expo-router";

export default function Introduction() {
  const yourPdfURL="https://my-way-web.vercel.app/intro.pdf"
  const pdfUri = `https://docs.google.com/gview?embedded=true&url=${yourPdfURL}`
  const router = useRouter()

  return (
    <Page>
      <Header title="Introduction" onPressButton={() => router.back()}/>
      <WebView
        style={styles.container}
        source={{ uri: pdfUri }}
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