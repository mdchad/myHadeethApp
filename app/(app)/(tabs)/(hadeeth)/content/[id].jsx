import { useSearchParams } from "expo-router"
import { Text, View, ScrollView, Share } from "react-native"
import hadeeths from '@data/hadeeths.json'
import { TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Bookmark, Share as ShareIcon } from "lucide-react-native";
import { TouchableHighlight } from "react-native";

import hadeethsBukhari from "@data/hadeethsBukhari";
import hadeethsBukhari2 from "@data/hadeethsBukhari2";

const hadeethContent = () => {
    const { chapterTitle, categoriesId } = useSearchParams();

    const [hadeeth, setHadeeth] = useState(null)
    const [book, setBook] = useState(null)

    useEffect(() => {
        setHadeeth(hadeethsBukhari.filter(hadeeth => hadeeth.volume_id === categoriesId))
    }, [categoriesId])

    function onShare(hadeeth) {
        const message = `\n${hadeeth.content.ar}\n\n ${hadeeth.content.ms}\n\n\n${hadeeth.book_title.ms}\n\n\nwww.myhadeeth.com.my`;

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
            <View className="bg-gray-100 flex items-center px-6">
                {/*<Header user={user.full_name} /> */}
                <View>
                    {/* <Text className="text-center text-3xl mb-2 font-semibold" style={{ fontFamily: 'Traditional_ArabicBold' }}>{hadeeth ? hadeeth[0]?.title.ar : ''}</Text> */}
                    <Text className="text-center text-lg font-semibold py-4">{hadeeth ? hadeeth[0]?.volume_title.ms : ''}</Text>
                </View>

                <View className="space-y-6">
                    {hadeeth?.map(hadeeth => {
                        return (
                            <View className="px-4 py-6 space-y-4 rounded-xl bg-white" key={hadeeth.id}>
                                {/*<Text className="mb-4 text-right text-2xl" selectable={true} style={{ fontFamily: 'Traditional_ArabicRegular'}}>{hadeeth.content.ar}</Text>*/}
                                <TextInput className="text-gray-800 text-right text-3xl" style={{ fontFamily: 'Traditional_ArabicRegular' }} scrollEnabled={false} readOnly multiline value={hadeeth.content.ar} />
                                <TextInput className="text-gray-800 text-xl overflow-hidden leading-loose" scrollEnabled={false} readOnly multiline value={hadeeth.content.ms} />
                                <View className="flex flex-row justify-end items-center">
                                    <TouchableHighlight
                                        className="p-2"
                                        underlayColor="#f9fafb"
                                        onPress={() => onSave(hadeeth)}

                                    >
                                        <Bookmark color="black" size={24} />
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
