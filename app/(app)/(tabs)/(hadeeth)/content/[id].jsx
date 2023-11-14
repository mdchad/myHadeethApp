import React from "react";
import { Text, View, Share, TextInput, TouchableHighlight, ActivityIndicator, FlatList } from "react-native";
import {useRouter, useLocalSearchParams } from "expo-router";
import {Bookmark, Heart, Share as ShareIcon, Share2} from "lucide-react-native";
import Header from "../../../../components/header";
import {useQuery} from "@tanstack/react-query";


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

const HadithItem = React.memo(({ hadith, onShare, onSave }) => (
  <View key={hadith.id}>
    {/*{hadith?.chapter_title?.ms && <Text className="text-gray-800 mb-4 mt-6 ml-2">{toSuperscript(hadith?.chapter_title?.ms, 'text')}</Text> }*/}
    <View className="space-y-8 bg-white mb-4 border border-royal-blue">
        <View className="px-4 py-6">
            <TextInput
                className="text-gray-800 text-right text-3xl"
                style={{ fontFamily: 'Traditional_ArabicRegular' }}
                scrollEnabled={false}
                readOnly
                multiline
                value={hadith.content.ar}
            />
            <TextInput
                className="text-gray-800 pb-4 text-lg overflow-hidden leading-loose"
                scrollEnabled={false}
                readOnly
                multiline
                style={{ fontFamily: 'KFGQPC_Regular' }}
                value={toSuperscript(hadith.content.ms, 'text')}
            />
            {!!hadith.footnotes.length && (
                <View className="flex space-y-2 pt-2 border-t border-t-gray-500">
                    {hadith.footnotes.map(footnote => {
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
                onPress={() => onShare(hadith)}
            >
                <Share2 color="white" absoluteStrokeWidth={2} size={16} />
            </TouchableHighlight>
            <TouchableHighlight
              className="p-1"
              underlayColor="#333"
              onPress={() => onSave(hadith)}
            >
                <Heart color="white" absoluteStrokeWidth={2} size={16} />
            </TouchableHighlight>
            <TouchableHighlight
                className="p-1"
                underlayColor="#333"
                onPress={() => onSave(hadith)}
            >
                <Bookmark color="white" absoluteStrokeWidth={2} size={16} />
            </TouchableHighlight>
        </View>
    </View>
  </View>
));

function HadithContent() {
    const { volumeId, bookId } = useLocalSearchParams();
    const router = useRouter()

    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['volumes', id],
        queryFn: async () => {
            const res = await fetch(`https://my-way-web.vercel.app/api/books/${bookId}/${volumeId}` , {
                method: 'GET',
            });
            const result = await res.json()
            console.log('bihhh', result)
            return result.data
        }
    });

    const onShare = (hadith) => {
        const message = `\n${hadith.content.ar}\n\n ${hadith.content.ms}\n\n\n${hadith.book_title.ms}\n\n\nwww.myhadeeth.com.my`;
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
          title={data[0]?.book_title?.ms}
          onPressButton={() => router.push(`(hadeeth)/volume/${data[0].book_id}?title=${data[0].book_title.ms}`)}
        />
        <View className="flex-1 p-4 pb-0 bg-white">
            <View className="flex items-end border-b border-b-royal-blue mb-3">
                <Text className="text-lg font-semibold text-royal-blue">{data ? data[0]?.volume_title.ms : ''}</Text>
            </View>
            <View className="flex-1">
                <FlatList
                    data={data}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <HadithItem key={item.id} hadith={item} onShare={onShare} onSave={onSave} />}
                    contentContainerStyle={{ paddingHorizontal: 6 }}
                    style={{ paddingRight: 5, marginRight: -10 }}
                />
            </View>
        </View >
      </>
    );
};

export default HadithContent;
