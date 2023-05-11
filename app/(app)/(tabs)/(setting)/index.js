import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Alert,
    Pressable,
    Text,
    TextInput,
    SafeAreaView,
    Image,
    ScrollView,
} from "react-native";

import Toast from "react-native-root-toast";
import * as Updates from 'expo-updates';
import Page from "@components/page";
import { LogIn, Smartphone } from "lucide-react-native";
import { Link, useRouter } from "expo-router";
import { TouchableHighlight } from "react-native-gesture-handler";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const tokenCache = {
    getToken(key) {
        try {
            return SecureStore.getItemAsync(key);
        } catch (err) {
            return null;
        }
    },
    saveToken(key, value) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch (err) {
            return null;
        }
    },
};

export default function Settings() {
    const router = useRouter()

    const { isLoaded, isSignedIn, signOut } = useAuth();

    const triggerUpdate = async () => {
        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                await Updates.fetchUpdateAsync();
                // await Updates.reloadAsync();
                alert('An update is available. Restart your app to apply the update.')
                // Updates.reloadAsync();
            }
        } catch (e) {
            // handle or log error
            console.log(e.message)
        }
    }

    const handleSignOut = async () => {
        await signOut();

        router.push('/(hadeeth)')
    }

    return (
        <Page class="bg-gray-100">
            <ScrollView className="py-4">
                <View className="px-4 bg-gray-100 flex sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
                    <View className="bg-white py-2 px-4 rounded-xl flex">
                        <View className="space-x-5 py-5 w-full flex flex-row items-center border-b border-gray-300">
                            <Image
                                source={require("@assets/comment.png")}
                                style={{ height: 20, width: 20 }}
                            />
                            <Text className="text-[16px]">Help and Feedback</Text>
                        </View>
                        <View className="space-x-5 py-4 w-full flex flex-row items-center border-b border-gray-300">
                            <Image
                                source={require("@assets/info.png")}
                                style={{ height: 20, width: 20 }}
                            />
                            <Text className="text-[16px]">About</Text>
                        </View>
                        <TouchableHighlight onPress={triggerUpdate} className="w-full bg-white py-5" underlayColor="#f9fafb">
                            <View className="space-x-5 w-full flex flex-row items-center">
                                <Smartphone color={'black'} size={20} />
                                <Text className="text-[16px]">Update App</Text>
                            </View>
                        </TouchableHighlight>
                    </View>

                    <SignedIn>
                        <View className="bg-white rounded-xl flex mt-4">
                            <TouchableHighlight onPress={() => handleSignOut()} className="w-full bg-white rounded-xl" underlayColor="#f9fafb">
                                <View className="space-x-5 px-4 py-5 flex flex-row items-center w-full">
                                    <LogIn color="black" size={20} />
                                    <Text className="text-[16px]">Logout</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </SignedIn>

                    <SignedOut>
                        <View className="bg-white rounded-xl flex mt-4">
                            <TouchableHighlight onPress={() => router.push('/SignIn')} className="w-full bg-white rounded-xl" underlayColor="#f9fafb">
                                <View className="space-x-5 px-4 py-5 flex flex-row items-center w-full">
                                    <LogIn color="black" size={20} />
                                    <Text className="text-[16px]">Login</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </SignedOut>
                </View>
            </ScrollView>
        </Page>
    );
}