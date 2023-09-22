import React, { useState, useEffect } from "react";
import { Alert, Image, Pressable, Text, TextInput, View, KeyboardAvoidingView, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";

import Page from "@components/page";
import { Users } from "lucide-react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useSignIn } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@context/useWarmUpBrowser";
import { TouchableHighlight } from "react-native";
import {trpc} from "../../../utils/trpc";
import {useAuth} from "@context/auth";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
    const router = useRouter();
    const { signIn, setActive, isLoaded } = useSignIn();
    const { user } = useAuth()


    const { mutate } = trpc.users.create.useMutation({
        async onSuccess(data) {
            console.log('data', data)
            // await utils.users.all.invalidate();
        },

        async onError() {
            console.log('error something wrong with TRPC')
        }
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useWarmUpBrowser();

    useEffect(() =>{
        if (user) {
            mutate({
                email: user.primaryEmailAddress.emailAddress
            })
        }
    }, [user])

    const onSignInPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignIn = await signIn.create({
                identifier: email,
                password,
            });
            // This is an important step,
            // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId });

            router.push("/(hadeeth)")
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const handleSignInWithGooglePress = React.useCallback(async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

            if (createdSessionId) {
                await setActive({ session: createdSessionId });
                router.push("/(hadeeth)")
            } else {
                // Modify this code to use signIn or signUp to set this missing requirements you set in your dashboard.
                throw new Error("There are unmet requirements, modifiy this else to handle them")

            }
        } catch (err) {
            console.log(JSON.stringify(err, null, 2));
            console.log("error signing in", err);
        }
    }, []);

    return (
        <Page>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <KeyboardAvoidingView>
                    <View className="bg-royal-blue flex justify-between px-6 py-8 h-full">
                        <View className="flex items-center mb-50 my-auto">
                            <View className="flex items-center justify-center rounded-full w-32 h-32 mb-10">
                                <Image source={require("@assets/splash-3.png")} style={{ width: 250, height: 250 }} />
                                {/*<Users color={'black'} size={36} />*/}
                            </View>

                            <View className="mt-10 w-full">
                                <Text className="font-bold text-md pb-2 text-white">Email</Text>
                                <TextInput
                                    label="Email"
                                    leftIcon={{ type: "font-awesome", name: "envelope" }}
                                    onChangeText={(text) => setEmail(text)}
                                    value={email}
                                    className="bg-white block w-full appearance-none rounded-md border border-gray-300 px-5 py-3 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Email"
                                    autoCapitalize={"none"}
                                />
                            </View>
                            <View className="mt-4 w-full">
                                <Text className="font-bold text-md pb-2 text-white">Password</Text>
                                <TextInput
                                    label="Password"
                                    leftIcon={{ type: "font-awesome", name: "lock" }}
                                    onChangeText={(text) => setPassword(text)}
                                    className="bg-white block w-full appearance-none rounded-md border border-gray-300 px-5 py-3 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    value={password}
                                    secureTextEntry={true}
                                    placeholder="Password"
                                    autoCapitalize={"none"}
                                />
                            </View>

                            <View className="mt-8">
                                <Pressable
                                    className="bg-white flex flex-row items-center justify-center py-3 px-5 w-56 rounded-lg border-transparent"
                                    disabled={!isLoaded}
                                    onPress={() => onSignInPress()}
                                >
                                    <Text></Text>
                                    <Text className="text-sm font-bold text-center uppercase basis-11/12">
                                        Login
                                    </Text>
                                </Pressable>
                            </View>

                            <View className="flex flex-row items-center px-16 py-6">
                                <View className="flex-1 h-[1] bg-white" />
                                <View>
                                    <Text className="text-white" style={{ width: 50, textAlign: 'center' }}>or</Text>
                                </View>
                                <View className="flex-1 h-[1] bg-white" />
                            </View>

                            <View className="mb-4">
                                <TouchableHighlight
                                    className=""
                                    disabled={!isLoaded}
                                    underlayColor="#f9fafb"
                                    onPress={handleSignInWithGooglePress}
                                >
                                    <View className="bg-white space-x-2 flex flex-row items-center justify-center py-3 px-5 w-56 rounded-xl border border-gray-300">
                                        <Image source={require("@assets/google.png")} style={{ width: 22, height: 22 }} />
                                        <Text className="text-sm text-center">
                                           Sign in with Google
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                                {/*<SignInWithOAuth />*/}
                            </View>
                            <Link href={'/'} className="px-4 py-2 text-white">Skip for now</Link>
                        </View>
                        <View className="flex flex-row justify-between">
                            <View className="mt-2">
                                <Link href={"SignUp"}>
                                    <Text className="text-white">Sign Up</Text>
                                </Link>
                            </View>
                            <View className="mt-2">
                                <Link href={"ResetPassword"}>
                                    <Text className="text-white">Forgot Password</Text>
                                </Link>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </Page>
    );
}