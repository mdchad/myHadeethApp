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
import {Info, LogIn, MessageSquare, Smartphone, User} from "lucide-react-native";
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

    function onPressProfile() {
        router.push('/profile')
    }

    return (
        <Page class="bg-gray-100">
            <ScrollView className="py-4">
                <View className="px-4 bg-gray-100 flex sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
                    <View className="bg-white rounded-xl flex">
                        {/*<SignedIn>*/}
                        {/*    <TouchableHighlight onPress={onPressProfile} className="bg-white rounded-t-xl" underlayColor="#f9fafb">*/}
                        {/*        <View className="mx-5 space-x-3 py-5 flex flex-row items-center border-b border-gray-300">*/}
                        {/*            <User color={'black'} size={20} />*/}
                        {/*            <Text className="text-[16px]">Profile</Text>*/}
                        {/*        </View>*/}
                        {/*    </TouchableHighlight>*/}
                        {/*</SignedIn>*/}
                        <View className="mx-5 space-x-3 py-5 flex flex-row items-center border-b border-gray-300">
                            <MessageSquare size={20} color={'black'} />
                            <Text className="text-[16px]">Help and Feedback</Text>
                        </View>
                        <View className="mx-5 space-x-3 py-5 flex flex-row items-center border-b border-gray-300">
                            <Info size={20} color={'black'} />
                            <Text className="text-[16px]">About</Text>
                        </View>
                        <TouchableHighlight onPress={triggerUpdate} className="rounded-b-xl bg-white" underlayColor="#f9fafb">
                            <View className="mx-5 py-5 space-x-3 flex flex-row items-center">
                                <Smartphone color={'black'} size={20} />
                                <Text className="text-[16px]">Update App</Text>
                            </View>
                        </TouchableHighlight>
                    </View>

                    {/*<SignedIn>*/}
                    {/*    <View className="bg-white rounded-xl flex mt-4">*/}
                    {/*        <TouchableHighlight onPress={() => handleSignOut()} className="w-full bg-white rounded-xl" underlayColor="#f9fafb">*/}
                    {/*            <View className="space-x-3 px-5 py-5 flex flex-row items-center w-full">*/}
                    {/*                <LogIn color="black" size={20} />*/}
                    {/*                <Text className="text-[16px]">Logout</Text>*/}
                    {/*            </View>*/}
                    {/*        </TouchableHighlight>*/}
                    {/*    </View>*/}
                    {/*</SignedIn>*/}

                    <SignedOut>
                        <View className="bg-white rounded-xl flex mt-4">
                            <TouchableHighlight onPress={() => router.push('/SignIn')} className="w-full bg-white rounded-xl" underlayColor="#f9fafb">
                                <View className="space-x-3 px-4 py-5 flex flex-row items-center w-full">
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