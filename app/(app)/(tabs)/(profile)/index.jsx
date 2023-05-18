import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TouchableHighlight, Share
} from "react-native";
import { Link } from 'expo-router'

import Page from "@components/page";
import {ArrowLeft, Bookmark, FileText, LogOut, Settings, Users} from "lucide-react-native";
import {useAuth} from "@context/auth";

export default function Profile() {
  const { user } = useAuth()

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Salam, download the best app for hadith for free now at https://myhadeeth.com',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <Page class="bg-white">
      <ScrollView className="py-4">
        <View className="flex sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
          {/*<Link href={'/(setting)'} asChild>*/}
          {/*  <Pressable className="px-6 py-2">*/}
          {/*    <ArrowLeft color="black" size={25}/>*/}
          {/*  </Pressable>*/}
          {/*</Link>*/}
          <View className="px-6 py-6">
            <View className="gap-6 items-center flex flex-row">
              <Image class source={{ uri: user.profileImageUrl }} style={{ width: 80, height: 80, borderRadius: 100 }} />
              <View className="flex">
                <Text className="font-semibold text-2xl mb-2 text-gray-800">{user.fullName}</Text>
                <Text className="text-gray-500">{user.primaryEmailAddress.emailAddress}</Text>
              </View>
            </View>
            <View className="border-b border-b-gray-300 mt-8"></View>
            <View className="mt-4">
              <Link href="/saved" asChild>
                <TouchableHighlight underlayColor="#f9fafb">
                  <View className="space-x-4 flex flex-row items-center py-2 my-1">
                    <Bookmark color="black" size={20}/>
                    <Text className="text-lg">Saved</Text>
                  </View>
                </TouchableHighlight>
              </Link>
              <Link href="/notes" asChild>
                <TouchableHighlight underlayColor="#f9fafb">
                  <View className="space-x-4 flex flex-row items-center py-2 my-1">
                    <FileText color="black" size={20}/>
                    <Text className="text-lg">Notes</Text>
                  </View>
                </TouchableHighlight>
              </Link>
              <TouchableHighlight underlayColor="#f9fafb" onPress={onShare}>
                <View className="space-x-4 flex flex-row items-center py-2 my-1">
                  <Users color="black" size={20}/>
                  <Text className="text-lg">Tell your friend</Text>
                </View>
              </TouchableHighlight>
              <Link href="/settings" asChild>
                <TouchableHighlight underlayColor="#f9fafb">
                  <View className="space-x-4 flex flex-row items-center py-2 my-1">
                    <Settings color="black" size={20}/>
                    <Text className="text-lg">Settings</Text>
                  </View>
                </TouchableHighlight>
              </Link>
              <Link href="/notes" asChild>
                <TouchableHighlight underlayColor="#f9fafb">
                  <View className="space-x-4 flex flex-row items-center py-2 my-1">
                    <LogOut color="red" size={20}/>
                    <Text className="text-lg text-red-600">Logout</Text>
                  </View>
                </TouchableHighlight>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}