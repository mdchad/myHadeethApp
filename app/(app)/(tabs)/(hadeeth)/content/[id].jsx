import { useSearchParams } from "expo-router"
import { Alert, Share, View, ScrollView, Button, Text, Pressable } from 'react-native';
import hadeeths from '@data/hadeeths.json'
import { Share2 } from "lucide-react-native";

const hadeethContent = () => {
    const { chapterTitle, chapterId } = useSearchParams();
    console.log(chapterTitle, chapterId)

    // find all hadeeths base on chapter id
    const selectedHadeeth = hadeeths.filter(hadeeth => hadeeth.chapterId === chapterId);
    // console.log(selectedHadeeth)

    // get content
    const selectedContent = selectedHadeeth.map(hadeeth => hadeeth.content);
    // console.log(selectedContent);

    // // craft message 
    // const shareMessage = `${chapterTitle ? JSON.parse(chapterTitle).ms : ''}\n ${chapterTitle ? JSON.parse(chapterTitle).ar : ''} \n\n ${selectedContent ? selectedContent.ar : ''} \n\n ${selectedContent ? selectedContent.ms : ''} \n\n Send from myHadeeth App`;

    const onShare = () => {
        const message = shareMessage;

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
    };

    return (
        <View style={{ flex: 1 }} className="">
            <ScrollView className="p-4">
                <Text className="text-center text-2xl mb-2 font-bold" style={{ fontFamily: 'Traditional_Arabic' }}>{chapterTitle ? JSON.parse(chapterTitle).ar : ''}</Text>
                <Text className="text-center text-lg">{chapterTitle ? JSON.parse(chapterTitle).ms : ''}</Text>

                {/* create a next and prev chapter */}
                <View className="flex-1 h-full mb-4">
                    {hadeeths?.map(hadeeth => {
                        if (hadeeth.chapter_id === chapterId) {

                            return (
                                <View key={hadeeth.id}>
                                    <Text className="mb-4 text-right" selectable={true} style={{ fontFamily: 'ScheherazadeNew_400Regular' }}>{hadeeth.content.ar}</Text>
                                    <Text className="mb-4" selectable={true}>{hadeeth.content.ms}</Text>
                                </View>
                            )
                        }
                    })}
                </View>
            </ScrollView>

            <View className="p-4 flex items-center justify-end flex-row space-x-5 bg-slate-200">
                {/* <Text>testing</Text> */}

                <Pressable className="flex items-center justify-end flex-row space-x-3">
                    <Share2 color="black" size={20} />
                </Pressable>
            </View>
        </View>
    )
}

export default hadeethContent
