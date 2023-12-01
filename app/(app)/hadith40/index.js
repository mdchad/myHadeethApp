import React from 'react'
import { StyleSheet } from 'react-native'
import Page from '@components/page'
import Header from '../../components/header'
import { useRouter } from 'expo-router'
import Pdf from 'react-native-pdf'
import SHARED_TEXT from '../../i18n'

export default function Hadith40() {
  const yourPdfURL = 'https://my-way-web.vercel.app/hadis40.pdf'
  const router = useRouter()

  return (
    <Page>
      <Header
        title={SHARED_TEXT.HADITHS_FORTY_TITLE}
        onPressButton={() => router.back()}
      />
      <Pdf
        trustAllCerts={false}
        source={{ uri: yourPdfURL, cache: true }}
        style={{ flex: 1 }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`number of pages: ${numberOfPages}`)
        }}
      />
    </Page>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 500,
    marginBottom: 20
  }
})
