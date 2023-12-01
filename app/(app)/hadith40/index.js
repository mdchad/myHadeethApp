import React from 'react'
import { View, ScrollView, SafeAreaView, Text, StyleSheet } from 'react-native'
import Page from '@components/page'
import { WebView } from 'react-native-webview';
import Header from "../../components/header";
import {useRouter} from "expo-router";
import Pdf from "react-native-pdf";

export default function Hadith40() {
  const yourPdfURL="https://my-way-web.vercel.app/hadis40.pdf"
  const router = useRouter()

  return (
    <Page>
      <Header title="Hadis 40" onPressButton={() => router.back()}/>
      <Pdf
        trustAllCerts={false}
        source={{ uri: yourPdfURL, cache: true }}
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
    marginBottom: 20
  },
});