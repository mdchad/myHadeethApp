import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
  useWindowDimensions,
  StyleSheet
} from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import Page from '@components/page'
// import Header from '@components/header';

const Home = () => {
  const { fontScale } = useWindowDimensions()
  const styles = makeStyles(fontScale)

  return (
    <Page class="bg-white">
      <View className="flex-1 flex space-y-3 bg-white">
        <ScrollView>
          <View className="p-3 flex items-center space-y-10">
            <View className="mx-5 space-y-5">
              <Text
                className={`text-${
                  100 / fontScale
                } font-bold text-center leading-none tracking-tight mx-5`}
                style={styles.sectionTitle}
              >
                Hadeeth of the Day
              </Text>

              <View className="bg-[#DAD8734D] space-y-3 p-5 rounded-md">
                <Text className="font-bold">Sahih Muslim - Kitab Faraid</Text>
                <Text>
                  L(1614) حَدَّثَنَا يَحْيَى بْنُ يَحْيَى، وَأَبُو بَكْرِ بْنُ
                  أَبِي شَيْبَةَ، وَإِسْحَاقُ بْنُ إِبْرَاهِيمَ، وَاللَّفْظُ
                  لِيَحْيَى، قَالَ يَحْيَى: أَخْبَرَنَا، وقَالَ الْآخَرَانِ:
                  حَدَّثَنَا ابْنُ عُيَيْنَةَ، عَنِ الزُّهْرِيِّ، عَنْ عَلِيِّ
                  بْنِ حُسَيْنٍ، عَنْ عَمْرِو بْنِ عُثْمَانَ، عَنْ أُسَامَةَ
                  بْنِ زَيْدٍ، أَنَّ النَّبِيَّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ،
                  قَالَ: لَا يَرِثُ الْمُسْلِمُ الْكَافِرَ، وَلَا يَرِثُ
                  الْكَافِرُ
                </Text>
              </View>

              <View className="flex flex-row space-x-3 self-end">
                <Text>Bookmark this hadeeth</Text>
                <FontAwesome5 name="bookmark" size={16} color="black" />
              </View>
            </View>

            <View className="flex items-center justify-center">
              <Text className="text-2xl text-center">
                EXPLORE RELATED HADEETH
              </Text>

              <View className="">
                <View className="flex flex-row justify-between space-x-6">
                  <View className="flex items-center">
                    <View className="mt-4 w-16 h-16 bg-[#D9D9D9] rounded-md"></View>
                    <Text className="mt-1 uppercase text-xs">Sadqah</Text>
                  </View>
                  <View className="flex items-center">
                    <View className="mt-4 w-16 h-16 bg-[#D9D9D9] rounded-md"></View>
                    <Text className="mt-1 uppercase text-xs">Prayer</Text>
                  </View>
                  <View className="flex items-center">
                    <View className="mt-4 w-16 h-16 bg-[#D9D9D9] rounded-md"></View>
                    <Text className="mt-1 uppercase text-xs">Family</Text>
                  </View>
                  <View className="flex items-center">
                    <View className="mt-4 w-16 h-16 bg-[#D9D9D9] rounded-md"></View>
                    <Text className="mt-1 uppercase text-xs">Lifestyle</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* <Link href="Content/Hadeeth/1">Hadeeth 1</Link> */}
            {/* <Link href="Content/Hadeeth/2">Hadeeth 2</Link> */}
          </View>
        </ScrollView>
      </View>
    </Page>
  )
}

const makeStyles = (fontScale) =>
  StyleSheet.create({
    safeAreaViewContainer: {
      minWidth: '100%',
      minHeight: '100%',
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center'
    },
    screenContainer: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 20
    },
    boxContainer: {
      paddingHorizontal: 36,
      paddingVertical: 36,
      alignItems: 'center',
      backgroundColor: '#D0D0D0',
      width: '100%',
      height: '100%'
    },
    sectionTitle: {
      fontSize: 50 / fontScale, // divide the font size by the font scale
      fontWeight: '600'
    },
    imageTop: {
      height: 200,
      width: 300
    },
    imageBot: {
      height: 200,
      width: 300,
      marginTop: 20
    }
  })

export default Home
