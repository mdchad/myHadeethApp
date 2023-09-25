import { View, Text, useWindowDimensions, StyleSheet, FlatList, ImageBackground } from 'react-native'
import React from 'react'
import {useRouter } from 'expo-router'
import books from '@data/books.json'
import initials from "initialism";
import {TouchableHighlight} from "react-native-gesture-handler";
import Header from '@components/header';
import {useAuth} from "../../../../context/auth";
import {ArrowRight, Bookmark, Heart, Share2} from "lucide-react-native";

function Hadeeth() {
    const { user } = useAuth();
    const router = useRouter()
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);

    function onTriggerPress(id, title) {
        router.push(`(hadeeth)/volume/${id}?title=${title}`)
    }

    function Item({ title, id }) {
        const words = title.split(' ');

        const firstWord = words[0];
        const remainingWords = words.slice(1).join(' ');

        return (
            <View className="w-[48%] mr-4 bg-white">
                <TouchableHighlight onPress={() => onTriggerPress(id, title)} underlayColor="#f9fafb" className="rounded-xl w-full">
                    <View>
                        <View className="flex items-center p-8">
                          <Text className="text-lg text-royal-blue">{firstWord}</Text>
                          <Text className="text-lg text-royal-blue">{remainingWords}</Text>
                        </View>
                        <View className="bg-royal-blue w-full p-1 flex flex-row justify-between">
                            <View className="flex flex-row">
                                <Share2 color="white" size={15} absoluteStrokeWidth={2} className="mr-1" />
                                <Heart color="white" size={15} absoluteStrokeWidth={2} className="mr-1" />
                                <Bookmark color="white" size={15} absoluteStrokeWidth={2} className="mr-1" />
                            </View>
                            <View className="flex flex-row items-center">
                                <Text className="text-white text-xs mr-1">View More</Text>
                                <ArrowRight color="white" size={12} />
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    return (
      <>
        <Header user={user} title={'Books of hadith'}></Header>
        <View className="flex-1 bg-gray-100">
            <ImageBackground source={require("@assets/book-background.png")} resizeMode="cover" style={{ flex: 1, justifyContent: 'end', alignItems: 'end' }}>
              <View className="mb-4 mt-4">
                <FlatList
                    data={books}
                    renderItem={({ item }) => <Item title={item.title} id={item.id} />}
                    keyExtractor={item => item.id}
                    className="h-full"
                    numColumns={2}
                    columnWrapperStyle={{
                        flex: 1,
                        width: '100%',
                        padding: 14
                    }}
                />
              </View>
            </ImageBackground>
        </View>
      </>
    );
}

const makeStyles = fontScale => StyleSheet.create({
    safeAreaViewContainer: {
        minWidth: '100%',
        minHeight: '100%',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    boxContainer: {
        paddingHorizontal: 36,
        paddingVertical: 36,
        alignItems: 'center',
        backgroundColor: '#D0D0D0',
        width: '100%',
        height: '100%',
    },
    sectionTitle: {
        fontSize: 50 / fontScale, // divide the font size by the font scale
        fontWeight: '600',
    },
    imageTop: {
        height: 200,
        width: 300,
    },
    imageBot: {
        height: 200,
        width: 300,
        marginTop: 20,
    },
    item: {
        padding: 3,
        marginVertical: 8,
        marginHorizontal: 16,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default Hadeeth