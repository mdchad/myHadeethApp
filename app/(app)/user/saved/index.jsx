import { View, Text, ScrollView, Image, TouchableHighlight } from 'react-native'
import React, {useEffect, useState} from 'react'
import Page from '@components/page'
import {db} from "../../../../db/client";
import {bookmarks} from "../../../../db/schema";

const Saved = () => {
  const [bookmarksData, setBookmarksData] = useState([])
  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    try {
      const data = await db.select().from(bookmarks)

      data.forEach(item => {
        item.bookTitle = JSON.parse(item.bookTitle);
        item.chapterMetaData = JSON.parse(item.chapterMetaData);
        item.chapterTitle = JSON.parse(item.chapterTitle);
        item.chapterTransliteration = JSON.parse(item.chapterTransliteration);
        item.content = JSON.parse(item.content);
        item.volumeTitle = JSON.parse(item.volumeTitle);
      });

      setBookmarksData(data)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Page class="bg-white">
      <ScrollView className="py-4">
        <View className="flex sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
          <View className="py-6">
            <Text>Hoiiii</Text>
            { !!bookmarksData.length > 0 ? (
              <Text>{bookmarksData[0].content[0].ms}</Text>
            ) : <Text>Hoiiii</Text>}
          </View>
        </View>
      </ScrollView>
    </Page>
  )
}

export default Saved
