import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { AntDesign } from '@expo/vector-icons';
import { User } from "lucide-react-native";

const header = ({ user }) => {

  return (
    <View className="bg-white">
      <View className="flex flex-row justify-between items-center py-6 shadow-lg rounded-b-2xl rounded-bl-2xl bg-[#EDEEC0] overflow-hidden">
        {user ? (
          <View className="pl-6 flex flex-row">
            <View className="w-12 h-12 mr-2 bg-white rounded-full flex items-center justify-center">
              <User color="black"/>
            </View>
            <View>
              <Text className="text-xl">
                Assalamualaikum,
              </Text>
              <Text className="font-bold">
                {user}
              </Text>
            </View>
          </View>
        ) : (
          <Link href={"SignIn"}>
            <View className="pl-6 flex flex-row">
              <View className="w-12 h-12 mr-2 bg-white rounded-full flex items-center justify-center">
                <User color="black"/>
              </View>
              <View>
                <Text className="text-xl">
                  Assalamualaikum,
                </Text>
                <Text className="font-bold">
                  Guest user
                </Text>
              </View>
            </View>
          </Link>
        )}
        <View className="flex flex-row items-center">
          <Link href="/modal" className="py-2 px-8">
              <AntDesign name="search1" size={20} color="black" />
              {/* <Image source={require("@assets/search.png")} style={{ width: 16, height: 20 }} /> */}
          </Link>
        </View>
      </View>
    </View>
  )
}

export default header