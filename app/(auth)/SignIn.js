import React, { useState } from "react";
import { Alert, Image, Pressable, Text, TextInput, View, KeyboardAvoidingView } from "react-native";
import {Link, useRouter} from "expo-router";

import { supabase } from "@lib/supabase";
import { useAuth } from "@context/auth";
import Page from "@components/page";
import {useOAuth} from "@clerk/clerk-expo";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth()
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      signIn(data.user.user_metadata)
      router.push("/(hadeeth)")
    }
    setLoading(false);
  }

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleSignInWithGooglePress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
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
      <KeyboardAvoidingView>
        <View className="flex justify-between px-4 sm:mx-auto sm:w-full sm:max-w-md py-8 sm:rounded-lg sm:px-10 w-full h-full">
          <View className="flex items-center pt-16">
            <View className="bg-[#F5EFD2] w-[115] h-[115] flex items-center justify-center rotate-[-43deg]">
              <Image
                source={require("../../assets/muslim.png")}
                style={{
                  resizeMode: "contain",
                  height: 70,
                  width: 70,
                  display: "flex",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                  transform: [{ rotate: "43deg" }],
                }}
              />
            </View>

            <View className="mt-16">
              <TextInput
                label="Email"
                leftIcon={{ type: "font-awesome", name: "envelope" }}
                onChangeText={(text) => setEmail(text)}
                value={email}
                className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email"
                autoCapitalize={"none"}
              />
            </View>
            <View className="mt-4">
              {/*<Image source={require("../assets/envelope.png")} style={{ width: 20, height: 20 }}/>*/}
              <TextInput
                label="Password"
                leftIcon={{ type: "font-awesome", name: "lock" }}
                onChangeText={(text) => setPassword(text)}
                className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={password}
                secureTextEntry={true}
                placeholder="Password"
                autoCapitalize={"none"}
              />
              <View className="flex items-end mt-2">
                <Link href={"ResetPassword"}>
                  <Text className="underline text-xs">Forgot Password ?</Text>
                </Link>
              </View>
            </View>
            <View className="mt-6 mb-4">
              <Pressable
                className="flex flex-row items-center justify-center py-3 px-5 w-64 rounded-xl bg-[#1EAB53] border-transparent"
                disabled={loading}
                onPress={() => signInWithEmail()}
              >
                <Text></Text>
                <Text className="text-sm font-bold text-center text-white uppercase basis-11/12">
                  Login
                </Text>
                {/*<Image*/}
                {/*  source={require("../../assets/enter.png")}*/}
                {/*  style={{ width: 22, height: 22 }}*/}
                {/*/>*/}
              </Pressable>
            </View>
            <View className="flex flex-row items-center px-12">
              <View className="flex-1 h-[1] bg-gray-200"/>
              <View>
                <Text style={{width: 50, textAlign: 'center'}}>or</Text>
              </View>
              <View className="flex-1 h-[1] bg-gray-200"/>
            </View>
            <View className="mt-6 mb-4">
              <Pressable
                className="space-x-2 flex flex-row items-center justify-center py-3 px-5 w-64 rounded-xl border border-gray-300"
                disabled={loading}
                onPress={handleSignInWithGooglePress}
              >
                <Image source={require("@assets/google.png")} style={{ width: 22, height: 22 }} />
                <Text className="text-sm text-center text-black">
                  Google
                </Text>
              </Pressable>
            </View>
            <Link href={'/(hadeeth)'} className="px-4 py-2">Skip for now</Link>
          </View>
          <View className="flex items-center">
            <View className="mt-5">
              <Text>No account yet?</Text>
            </View>
            <View className="mt-2">
              <Link href={"SignUp"}>
                <Text className="underline font-bold">Sign Up</Text>
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Page>
  );
}