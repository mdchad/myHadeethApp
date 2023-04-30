import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import {User} from "lucide-react-native";

const header = ({ user }) => {

  return (
    <View className="flex flex-row justify-between items-center px-6 py-6 shadow-lg rounded-b-2xl rounded-bl-2xl bg-[#EDEEC0] overflow-hidden">
      {user ? (
        <View className="flex flex-row">
          <View className="w-12 h-12 mr-2 bg-white rounded-full flex items-center justify-center">
            <User color="black"/>
          </View>
          <View>
            <Text className="mb-1 text-xl">
              Assalamualaikum,
            </Text>
            <Text className="font-bold">
              {user ? user : 'Guest user'}
            </Text>
          </View>
        </View>
      ) : (
        <Link href={"SignIn"}>
          <View className="flex flex-row">
            <View className="w-12 h-12 mr-2 bg-white rounded-full flex items-center justify-center">
              <User color="black"/>
            </View>
            <View>
              <Text className="mb-1 text-xl">
                Assalamualaikum,
              </Text>
              <Text className="font-bold">
                {user ? user : 'Guest user'}
              </Text>
            </View>
          </View>
        </Link>
      )}
      <Link href="/modal">
        <View className="flex flex-row items-center">
          <AntDesign name="search1" size={16} color="black" />
          {/* <Image source={require("@assets/search.png")} style={{ width: 16, height: 20 }} /> */}
        </View>
      </Link>
    </View>
  )
}

export default header