import {View, Text, Image, TextInput, Pressable} from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import {ChevronLeftCircle, SearchIcon, User} from "lucide-react-native";

function Header({ title, onPressButton, search, rounded = true}) {
    console.log(onPressButton)
    return (
        <View className="bg-gray-100">
            <View className={`flex ${rounded && 'rounded-b-2xl'} py-6 shadow-lg bg-royal-blue overflow-hidden`}>
                <View className="flex flex-row w-full justify-center relative">
                    {onPressButton && (
                        <Pressable
                          className="border-transparent absolute left-5"
                          onPress={onPressButton}
                        >
                            <ChevronLeftCircle color={'white'} size={28}></ChevronLeftCircle>
                        </Pressable>
                    )}
                    <Text className="text-white text-xl font-semibold">{title}</Text>
                    {/*<View className="w-12 h-12 mr-2 bg-white rounded-full flex items-center justify-center">*/}
                    {/*    {user ? (*/}
                    {/*        <Image source={{ uri: user.profileImageUrl }} style={{ width: 32, height: 32, borderRadius: 16 }} />*/}
                    {/*    ) :*/}
                    {/*        <User color="black" />*/}
                    {/*    }*/}
                    {/*</View>*/}
                    {/*<View>*/}
                    {/*    <Text className="text-xl">*/}
                    {/*        Assalamualaikum,*/}
                    {/*    </Text>*/}
                    {/*    <Text className="font-bold">*/}
                    {/*        {user ? user.fullName : "Guest"}*/}
                    {/*    </Text>*/}
                    {/*</View>*/}
                </View>
                {search && (
                    <View className="mt-4 px-6 w-full">
                        <View className="bg-white rounded-2xl shadow w-full">
                            <TextInput
                              className="px-4 py-2"
                              placeholder="Search for Hadith, Books, Etc"
                              onChangeText={(text) => search(text)}
                            />
                        </View>
                    </View>
                  )
                }
                {/*<View className="flex flex-row items-center">*/}
                {/*    <Link href="/modal" className="py-2 pr-6">*/}
                {/*        <SearchIcon size={20} color="black" />*/}
                {/*        /!* <Image source={require("@assets/search.png")} style={{ width: 16, height: 20 }} /> *!/*/}
                {/*    </Link>*/}
                {/*</View>*/}
            </View>
        </View>
    )
}

export default Header