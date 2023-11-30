import React from 'react'
import { View, ScrollView, SafeAreaView, Text, StyleSheet } from 'react-native'
import Page from '@components/page'
import { WebView } from 'react-native-webview';
import Header from "../../components/header";
import {useRouter} from "expo-router";

export default function Hadth40() {
  const yourPdfURL="https://my-way-web.vercel.app/hadis40.pdf"
  const pdfUri = `https://docs.google.com/gview?embedded=true&url=${yourPdfURL}`
  const router = useRouter()

  return (
    <Page>
      <Header title="Hadis 40" onPressButton={() => router.back()}/>
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
    marginBottom: 20
  },
});