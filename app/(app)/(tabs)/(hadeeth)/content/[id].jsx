import React, { useEffect, useState } from "react";
import { Text, View, Share, TextInput, TouchableHighlight, ActivityIndicator, FlatList } from "react-native";
import {useRouter, useSearchParams} from "expo-router";
import {Bookmark, Heart, Share as ShareIcon, Share2} from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import hadeeths from "@data/hadeethsV2";
import Header from "../../../../components/header";

const HADEETH_STORAGE_KEY = "HadeethStorage";

function toSuperscript(str, type) {
    const superscripts = {
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹',
    };

    if (type === 'text') {
        str = str.replace(/\[(\d+)\]/g, (match, p1) => {
            return p1.split('').map(char => superscripts[char] || char).join('');
        });

        return str;
    }

    if (type === 'reference') {
        return str.toLowerCase().split('').map(char => superscripts[char] || char).join('');
    }
}

const HadeethItem = React.memo(({ hadeeth, onShare, onSave }) => (
  <View key={hadeeth.id}>
    {/*{hadeeth?.chapter_title?.ms && <Text className="text-gray-800 mb-4 mt-6 ml-2">{toSuperscript(hadeeth?.chapter_title?.ms, 'text')}</Text> }*/}
    <View className="space-y-8 bg-white mb-4 border border-royal-blue">
        <View className="px-4 py-6">
            <TextInput
                className="text-gray-800 text-right text-3xl"
                style={{ fontFamily: 'Traditional_ArabicRegular' }}
                scrollEnabled={false}
                readOnly
                multiline
                value={hadeeth.content.ar}
            />
            <TextInput
                className="text-gray-800 text-lg overflow-hidden leading-loose"
                scrollEnabled={false}
                readOnly
                multiline
                style={{ fontFamily: 'KFGQPC_Regular' }}
                value={toSuperscript(hadeeth.content.ms, 'text')}
            />
            {!!hadeeth.footnotes.length && (
                <View className="flex space-y-2 pt-2 border-t border-t-gray-500">
                    {hadeeth.footnotes.map(footnote => {
                        return (
                            <Text key={footnote.number}>
                                <Text className="text-xs">{toSuperscript(footnote.number, 'reference')}&nbsp;</Text>
                                <Text className="text-xs text-gray-800">{footnote.text}</Text>
                            </Text>
                        )
                    })}
                </View>
            )}
        </View>
        <View className="flex flex-row justify-end items-center bg-royal-blue">
            <TouchableHighlight
                className="p-1"
                underlayColor="#333"
                onPress={() => onShare(hadeeth)}
            >
                <Share2 color="white" absoluteStrokeWidth={2} size={16} />
            </TouchableHighlight>
            <TouchableHighlight
              className="p-1"
              underlayColor="#333"
              onPress={() => onSave(hadeeth)}
            >
                <Heart color="white" absoluteStrokeWidth={2} size={16} />
            </TouchableHighlight>
            <TouchableHighlight
                className="p-1"
                underlayColor="#333"
                onPress={() => onSave(hadeeth)}
            >
                <Bookmark color="white" absoluteStrokeWidth={2} size={16} />
            </TouchableHighlight>
        </View>
    </View>
  </View>
));

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(`${HADEETH_STORAGE_KEY}:${key}`, JSON.stringify(value));
    } catch (error) {
        console.error("Error saving data to AsyncStorage", error);
    }
}

const retrieveData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(`${HADEETH_STORAGE_KEY}:${key}`);
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (error) {
        console.error("Error retrieving data from AsyncStorage", error);
    }
    return null;
}

const HadeethContent = () => {
    const { volumeId, hadeethId } = useSearchParams();
    const [hadeeth, setHadeeth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()

    useEffect(() => {
        const fetchHadeeth = async () => {
            if (hadeethId) { // search function to find a specific hadith
                const filteredData = hadeeths.filter(h => h.id === hadeethId);
                setHadeeth(filteredData);
            } else {
                let cachedData = await retrieveData(volumeId);

                if (cachedData) {
                    setHadeeth(cachedData);
                } else {
                    const filteredData = hadeeths.filter(h => h.volume_id === volumeId);
                    setHadeeth(filteredData);
                    storeData(volumeId, filteredData);
                }
            }

            setIsLoading(false);  // Set loading state to false once data is fetched
        };

        fetchHadeeth();
    }, [volumeId]);

    const onShare = (hadeeth) => {
        const message = `\n${hadeeth.content.ar}\n\n ${hadeeth.content.ms}\n\n\n${hadeeth.book_title.ms}\n\n\nwww.myhadeeth.com.my`;
        Share.share({ message })
            .then(result => {
                // ... existing logic
            })
            .catch(error => {
                console.log('Error sharing:', error);
            });
    };

    const onSave = () => {
        // Implement save logic if needed
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
      <>
        <Header
          title={hadeeth[0]?.book_title?.ms}
          onPressButton={() => router.push(`(hadeeth)/volume/${hadeeth[0].book_id}?title=${hadeeth[0].book_title.ms}`)}
        />
        <View className="flex-1 p-4 pb-0 bg-white">
            <View className="flex items-end border-b border-b-royal-blue mb-3">
                <Text className="text-lg font-semibold text-royal-blue">{hadeeth ? hadeeth[0]?.volume_title.ms : ''}</Text>
            </View>
            <View className="flex-1">
                <FlatList
                    data={hadeeth}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <HadeethItem key={item.id} hadeeth={item} onShare={onShare} onSave={onSave} />}
                    contentContainerStyle={{ paddingHorizontal: 6 }}
                    style={{ paddingRight: 5, marginRight: -10 }}
                />
            </View>
        </View >
      </>
    );
};

export default HadeethContent;
