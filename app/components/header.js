import { View, Text, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { AntDesign } from '@expo/vector-icons';
import { SearchIcon, User } from "lucide-react-native";

const header = ({ user }) => {

    return (
        <View className="bg-gray-100">
            <View className="flex flex-row justify-between items-center py-6 shadow-lg rounded-b-2xl rounded-bl-2xl bg-[#EDEEC0] overflow-hidden">
                <View className="pl-6 flex flex-row">
                    <View className="w-12 h-12 mr-2 bg-white rounded-full flex items-center justify-center">
                        {user ? (
                            <Image source={{ uri: user.profileImageUrl }} style={{ width: 32, height: 32, borderRadius: 16 }} />
                        ) :
                            <User color="black" />
                        }
                    </View>
                    <View>
                        <Text className="text-xl">
                            Assalamualaikum,
                        </Text>
                        <Text className="font-bold">
                            {user ? user.fullName : "Guest"}
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row items-center">
                    <Link href="/modal" className="py-2 pr-6">
                        <SearchIcon size={20} color="black" />
                        {/* <Image source={require("@assets/search.png")} style={{ width: 16, height: 20 }} /> */}
                    </Link>
                </View>
            </View>
        </View>
    )
}

export default header