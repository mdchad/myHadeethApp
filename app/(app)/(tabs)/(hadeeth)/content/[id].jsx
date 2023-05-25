import { useSearchParams } from "expo-router"
import { Text, View, ScrollView, Share } from "react-native"
import hadeeths from '@data/hadeeths.json'
import {TextInput} from "react-native";
import React, {useEffect, useState} from "react";
import {Bookmark, Share as ShareIcon} from "lucide-react-native";
import {TouchableHighlight} from "react-native";
let he = require('he');

const hadeethContent = () => {
  const { chapterTitle, chapterId } = useSearchParams();
  const [hadeeth, setHadeeth] = useState(null)

  useEffect(() => {
    setHadeeth(hadeeths.filter(h => h.chapter_id === chapterId))
  }, [chapterId])

  function onShare(hadeeth) {
    const message = `\n${hadeeth.content.ar}\n\n ${hadeeth.content.ms}\n\n\n${hadeeth.book_title}\n\n\nwww.myhadeeth.com.my`;

    Share.share({
      message: message,
    })
      .then(result => {
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log(`Shared with activity type: ${result.activityType}`);
          } else {
            console.log('Shared');
          }
        } else if (result.action === Share.dismissedAction) {
          console.log('Dismissed');
        }
      })
      .catch(error => {
        console.log('Error sharing:', error);
      });
  }

  function onSave() {
    return null
  }

  return (
    <ScrollView>
      <View className="bg-gray-100 flex items-center px-6 pt-6 space-y-12">
        {/*<Header user={user.full_name} /> */}
        <View>
          <Text className="text-center text-3xl mb-2 font-semibold" style={{ fontFamily: 'Traditional_ArabicBold'}}>{hadeeth ? hadeeth[0]?.title.ar : ''}</Text>
          <Text className="text-center text-lg font-semibold">{hadeeth ? hadeeth[0]?.title.ms : ''}</Text>
        </View>

        {/* create a next and prev chapter */}
        <View className="mt-4 space-y-6">
          {hadeeth?.map(hadeeth => {
            return (
              <View className="px-4 py-6 space-y-4 rounded-xl bg-white" key={hadeeth.id}>
                {/*<Text className="mb-4 text-right text-2xl" selectable={true} style={{ fontFamily: 'Traditional_ArabicRegular'}}>{hadeeth.content.ar}</Text>*/}
                <TextInput className="text-gray-800 text-right text-3xl" style={{ fontFamily: 'Traditional_ArabicRegular'}} scrollEnabled={false} readOnly multiline value={hadeeth.content.ar} />
                <TextInput className="text-gray-800 text-xl overflow-hidden" scrollEnabled={false} readOnly multiline value={hadeeth.content.ms} />
                <View className="flex flex-row justify-end items-center">
                  <TouchableHighlight
                    className="p-2"
                    underlayColor="#f9fafb"
                    onPress={() => onSave(hadeeth)}

                  >
                    <Bookmark color="black" size={24}/>
                  </TouchableHighlight>

                  <TouchableHighlight
                    className="p-2"
                    underlayColor="#f9fafb"
                    onPress={() => onShare(hadeeth)}
                  >
                    <ShareIcon color="black" size={24} />
                  </TouchableHighlight>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}

export default hadeethContent
