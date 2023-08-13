import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TouchableHighlight, Share, Alert
} from "react-native";
import {Link, useRouter} from 'expo-router'

import Page from "@components/page";
import {ArrowLeft, Bookmark, FileText, LogIn, LogOut, Settings, User, Users} from "lucide-react-native";
import {useAuth} from "@context/auth";
import {SignedIn, SignedOut} from "@clerk/clerk-expo";
import Markdown from "react-native-markdown-display";

const copy = `# h1 Heading 8-)

**This is some bold text!**

This is normal text
`;

export default function Profile() {
  const { isLoaded, user, signOut } = useAuth();
  const router = useRouter()

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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.log(e)
    }

    router.push('/(hadeeth)')
  }

  return (
    <Page class="bg-white">
      <ScrollView className="py-4">
        <View className="flex sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
          {/*<Link href={'/(setting)'} asChild>*/}
          {/*  <Pressable className="px-6 py-2">*/}
          {/*    <ArrowLeft color="black" size={25}/>*/}
          {/*  </Pressable>*/}
          {/*</Link>*/}
          <View className="py-6">
            <View className="px-6 gap-6 items-center flex flex-row">
              { user ? (
                <Image class source={{ uri: user.profileImageUrl }} style={{ width: 80, height: 80, borderRadius: 100 }} />
              ) : (
                <View className="rounded-full flex items-center justify-center h-20 w-20 bg-gray-200">
                  <User color="black" />
                </View>
              )}
              <View className="flex">
                { user ? (
                  <>
                    <Text className="font-semibold text-2xl mb-2 text-gray-800">{user.fullName}</Text>
                    <Text className="text-gray-500">{user.primaryEmailAddress.emailAddress}</Text>
                  </>
                ) : (
                  <Text className="font-semibold text-2xl mb-2 text-gray-800">Guest</Text>
                  // <Text className="text-gray-500">{user.primaryEmailAddress.emailAddress}</Text>
                )}
              </View>
            </View>
            <View className="border-b border-b-gray-300 mx-6 mt-8"></View>
            <View className="mt-4">
              <Link href="/saved" asChild>
                <TouchableHighlight underlayColor="#f9fafb">
                  <View className="px-6 space-x-4 flex flex-row items-center py-2 my-1">
                    <Bookmark color="black" size={20}/>
                    <Text className="text-lg">Saved</Text>
                  </View>
                </TouchableHighlight>
              </Link>
              <Link href="/notes" asChild>
                <TouchableHighlight underlayColor="#f9fafb">
                  <View className="px-6 space-x-4 flex flex-row items-center py-2 my-1">
                    <FileText color="black" size={20}/>
                    <Text className="text-lg">Notes</Text>
                  </View>
                </TouchableHighlight>
              </Link>
              <TouchableHighlight underlayColor="#f9fafb" onPress={onShare}>
                <View className="px-6 space-x-4 flex flex-row items-center py-2 my-1">
                  <Users color="black" size={20}/>
                  <Text className="text-lg">Tell your friend</Text>
                </View>
              </TouchableHighlight>
              <Link href="/settings" asChild>
                <TouchableHighlight underlayColor="#f9fafb">
                  <View className="px-6 space-x-4 flex flex-row items-center py-2 my-1">
                    <Settings color="black" size={20}/>
                    <Text className="text-lg">Settings</Text>
                  </View>
                </TouchableHighlight>
              </Link>
              <SignedIn>
                <View className="bg-white rounded-xl flex">
                  <TouchableHighlight onPress={() => handleSignOut()} className="w-full bg-white rounded-xl" underlayColor="#f9fafb">
                    <View className="space-x-4 px-6 py-2 flex flex-row items-center w-full">
                      <LogOut color="red" size={20} />
                      <Text className="text-lg text-red-600">Logout</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </SignedIn>
              <SignedOut>
                <View className="bg-white rounded-xl flex">
                  <TouchableHighlight onPress={() => router.push('/SignIn')} className="w-full bg-white rounded-xl" underlayColor="#f9fafb">
                    <View className="space-x-4 px-6 py-2 flex flex-row items-center w-full">
                      <LogIn color="black" size={20} />
                      <Text className="text-lg">Login</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </SignedOut>
              {/* <Markdown>
                {copy}
              </Markdown> */}
              {/*<Link href="/logout" asChild>*/}
              {/*  <TouchableHighlight underlayColor="#f9fafb">*/}
              {/*    <View className="px-6 space-x-4 flex flex-row items-center py-2 my-1">*/}
              {/*      <LogOut color="red" size={20}/>*/}
              {/*      <Text className="text-lg text-red-600">Logout</Text>*/}
              {/*    </View>*/}
              {/*  </TouchableHighlight>*/}
              {/*</Link>*/}
            </View>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}