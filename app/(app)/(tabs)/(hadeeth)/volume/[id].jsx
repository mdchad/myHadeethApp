import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableHighlight, ActivityIndicator, ImageBackground } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../../../components/header";
import {ArrowRight, Bookmark, Heart, Share2} from "lucide-react-native";
import {useQuery} from "@tanstack/react-query";


const HadithVolumeItem = ({ item, onPress, index }) => (
    <TouchableHighlight onPress={() => onPress(item)} underlayColor="#f9fafb" style={{ marginVertical: 6, borderRadius: 10, overflow: 'hidden' }}>
        <View className="bg-white flex flex-row w-full">
            <View className="bg-black p-2 flex justify-center">
                <View className="bg-white">
                    <ImageBackground source={require("@assets/volume-number.png")} resizeMode="cover" style={{ height: 35, width: 30, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>{index}</Text>
                    </ImageBackground>
                </View>
            </View>
            <View className="p-4 flex flex-col w-0 flex-grow justify-between">
                <View className="flex flex-row justify-between items-end">
                    <Text className="text-royal-blue text-[14px] flex-shrink capitalize ">{item.title.ms}</Text>
                    <View className="flex flex-row items-end ml-1">
                        <Text className="text-royal-blue text-xs mr-1">View more</Text>
                        <ArrowRight color="black" size={14} />
                    </View>
                </View>
                <View className="pt-1 flex flex-row justify-between items-center border-t-0.5 border-t-black mt-1">
                    <Text className="text-xs flex-shrink capitalize">{item?.transliteration?.ms}</Text>
                    <View className="flex flex-row">
                        <Share2 color="black" size={15} className="mr-1" />
                        <Heart color="black" size={15} className="mr-1" />
                        <Bookmark color="black" size={15} className="mr-1" />
                    </View>
                </View>
            </View>
        </View>
    </TouchableHighlight>
);

function HadithVolume() {
    const { id, title } = useLocalSearchParams();
    const router = useRouter();

    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['volumes', id],
        queryFn: async () => {
            const res = await fetch(`https://my-way-web.vercel.app/api/books/${id}` , {
                method: 'GET',
            });
            const result = await res.json()
            console.log('bihhh', result)
            return result.data
        }
    });

    const onPressHadith = (volume) => {
        router.push({
            pathname: `/(hadeeth)/content`,
            params: {
                volumeId: volume.id,
                bookId: volume.book_id,
            }
        });
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
        <Header title={title} onPressButton={() => router.push("/(hadeeth)")}/>
        <View style={{ flex: 1, backgroundColor: 'gray-100', paddingHorizontal: 16, paddingTop: 16 }}>
            <FlatList
                className="space-y-6"
                data={data}
                renderItem={({ item, index }) => <HadithVolumeItem item={item} index={index + 1} onPress={onPressHadith} />}
                keyExtractor={item => item.id.toString()}
                style={{ paddingRight: 10, marginRight: -10 }}
            />
        </View>
      </>
    );
};

export default HadithVolume;
