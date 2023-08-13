import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Share, TextInput, TouchableHighlight, ActivityIndicator, FlatList } from "react-native";
import { Link, useSearchParams } from "expo-router";
import { Bookmark, Share as ShareIcon } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import hadeethsBukhari from "@data/hadeethsBukhari";
import { Button } from "react-native-web";

const HADEETH_STORAGE_KEY = "HadeethStorage";

const HadeethItem = React.memo(({ hadeeth, onShare, onSave }) => (
    <View className="px-4 py-6 space-y-4 rounded-xl bg-white mb-4">
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
            value={hadeeth.content.ms}
        />
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
    const { categoriesId } = useSearchParams();
    const [hadeeth, setHadeeth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHadeeth = async () => {
            let cachedData = await retrieveData(categoriesId);

            if (cachedData) {
                setHadeeth(cachedData);
            } else {
                const filteredData = hadeethsBukhari.filter(h => h.volume_id === categoriesId);
                setHadeeth(filteredData);
                storeData(categoriesId, filteredData);
            }

            setIsLoading(false);  // Set loading state to false once data is fetched
        };

        fetchHadeeth();
    }, [categoriesId]);

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

    // console.log(hadeeth)

    return (
        // <ScrollView>
        <View className="flex-1 p-4 pb-0">
            <Text className="text-center text-lg font-semibold py-4">{hadeeth ? hadeeth[0]?.volume_title.ms : ''}</Text>
            
            {/* <Link replace href="/category/ad6a2cc8-f34b-476b-9b7e-6756a3b7d43e">Back</Link> */}

            <View className="flex-1">
                <FlatList
                    data={hadeeth}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <HadeethItem key={item.id} hadeeth={item} onShare={onShare} onSave={onSave} />}
                    contentContainerStyle={{ paddingHorizontal: 6 }}
                />
            </View>
        </View >
        // </ScrollView>
    );
};

export default HadeethContent;
