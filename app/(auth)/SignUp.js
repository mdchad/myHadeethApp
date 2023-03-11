import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";
import Toast from 'react-native-root-toast'
import { Link } from "expo-router";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      error,
      data: { user: createdUser },
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: username,
        }
      }
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      if (createdUser) {
        Toast.show('Successfully sign up', {
          duration: Toast.durations.LONG,
        });
      }
    }
    setLoading(false);
  }

  return (
    <SafeAreaView>
      <View className="w-full h-full">
        <Link href={"SignIn"}
          className="m-6 w-64"
        >
          <Image
            source={require("../../assets/back-arrow.png")}
            style={{ width: 30, height: 30 }}
          />
        </Link>
        <View className="flex items-center justify-center sm:mx-auto sm:w-full sm:max-w-md w-full">
          <Text className="font-bold text-[36px] w-52 text-center">
            Create Account
          </Text>
          <View className="mt-9">
            <TextInput
              label="Username"
              leftIcon={{ type: "font-awesome", name: "envelope" }}
              onChangeText={(text) => setUsername(text)}
              value={username}
              className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Username"
              autoCapitalize={"none"}
            />
          </View>
          <View className="mt-4">
            {/*<Image source={require("../assets/envelope.png")} style={{ width: 20, height: 20 }}/>*/}
            <TextInput
              label="Email"
              leftIcon={{ type: "font-awesome", name: "lock" }}
              onChangeText={(text) => setEmail(text)}
              className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={email}
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
              className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize={"none"}
            />
          </View>
          <View className="mt-4">
            {/*<Image source={require("../assets/envelope.png")} style={{ width: 20, height: 20 }}/>*/}
            <TextInput
              label="Password"
              leftIcon={{ type: "font-awesome", name: "lock" }}
              onChangeText={(text) => setConfirmPassword(text)}
              className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={confirmPassword}
              secureTextEntry={true}
              placeholder="Confirm Password"
              autoCapitalize={"none"}
            />
          </View>
          <View className="mt-8 mb-4">
            <Pressable
              className="flex flex-row items-center justify-center py-3 px-5 w-64 rounded-xl bg-[#1EAB53] border-transparent"
              disabled={loading}
              onPress={() => signUpWithEmail()}
            >
              <Text></Text>
              <Text className="text-sm font-bold text-center text-white uppercase basis-11/12">
                Sign Up
              </Text>
            </Pressable>
          </View>
          {/*<Text className="text-sm text-center mb-4">or continue with</Text>*/}
          {/*<View>*/}
          {/*  <Pressable*/}
          {/*    className="flex flex-row items-center justify-center py-3 px-5 w-64 rounded-xl border border-[#1EAB53]"*/}
          {/*    disabled={loading}*/}
          {/*    onPress={() => signUpWithEmail()}*/}
          {/*  >*/}
          {/*    <Text className="text-sm text-center mr-2">Google</Text>*/}
          {/*    <Image*/}
          {/*      source={require("../assets/google.png")}*/}
          {/*      style={{ width: 17, height: 19 }}*/}
          {/*    />*/}
          {/*  </Pressable>*/}
          {/*</View>*/}
        </View>
      </View>
    </SafeAreaView>
  );
}