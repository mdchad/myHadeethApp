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

import { supabase } from "@lib/supabase";
import Toast from "react-native-root-toast";
import * as Updates from 'expo-updates';
import Page from "@components/page";
import {LogIn, Smartphone} from "lucide-react-native";
import {Link} from "expo-router";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      getProfile();
    }
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) {
        throw new Error("No user on the session!");
      }

      const { data, error, status } = await supabase
        .from("users")
        .select(`full_name`)
        .eq("id", session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.full_name);
        setEmail(session.user.email);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) {
        throw new Error("No user on the session!");
      }

      const updates = {
        id: session?.user.id,
        ...(username && { full_name: username }),
        ...(email && { email }),
        ...(password && { password }),
        updated_at: new Date(),
      };

      const { error, data } = await supabase.from("users").upsert(updates);

      if (error) {
        throw error;
      } else {
        Toast.show("Successfully updated", {
          duration: Toast.durations.LONG,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const triggerUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
        alert('An update is available. Restart your app to apply the update.')
        // Updates.reloadAsync();
      }
    } catch (e) {
      // handle or log error
      console.log(e.message)
    }
  }

  return (
    <Page>
      <View className="pt-12 flex justify-between sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
        {session && (
          <View className="flex items-center">
            <Text className="font-bold text-[36px] w-52 text-center">
                Profile Settings
              </Text>
              <View className="mt-9">
                <TextInput
                  label="Username"
                  style={{ color: "black" }}
                  onChangeText={(text) => setUsername(text)}
                  value={username}
                  className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  autoCapitalize={"none"}
                  autoComplete={"username"}
                />
              </View>
              <View className="mt-4">
                {/*<Image source={require("../assets/envelope.png")} style={{ width: 20, height: 20 }}/>*/}
                <TextInput
                  label="Email"
                  onChangeText={(text) => setEmail(text)}
                  className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  style={{ color: "black" }}
                  value={email}
                  placeholder="Email"
                  autoCapitalize={"none"}
                  autoComplete={"email"}
                />
              </View>
              <View className="mt-4">
                {/*<Image source={require("../assets/envelope.png")} style={{ width: 20, height: 20 }}/>*/}
                <TextInput
                  label="Password"
                  onChangeText={(text) => setPassword(text)}
                  style={{ color: "black" }}
                  className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  value={password}
                  secureTextEntry={true}
                  placeholder="Password"
                  autoCapitalize={"none"}
                />
              </View>
              <View className="mt-8">
                <Pressable
                  className="flex flex-row items-center justify-center py-3 px-5 w-64 rounded-xl bg-[#1EAB53] border-transparent"
                  disabled={loading}
                  onPress={() => updateProfile()}
                >
                  <Text></Text>
                  <Text className="text-sm font-bold text-center text-white uppercase basis-11/12">
                    Update
                  </Text>
                </Pressable>
              </View>
              <View className="mt-5">
                <Pressable
                  className="flex flex-row items-center justify-center py-3 px-5 w-64 rounded-xl border border-[#1EAB53]"
                  disabled={loading}
                  onPress={() => supabase.auth.signOut()}
                >
                  <Text></Text>
                  <Text className="text-sm text-center uppercase basis-11/12">
                    Sign Out
                  </Text>
                </Pressable>
              </View>
              <View className="px-16 w-full flex flex-row justify-between items-center mt-8">
                <Text className="text-[16px]">Help and Feedback</Text>
                <Image
                  source={require("@assets/comment.png")}
                  style={{ height: 20, width: 20 }}
                />
              </View>
              <View className="px-16 mt-5 w-full flex flex-row justify-between items-center">
                <View>
                  <Text className="text-[16px]">About</Text>
                </View>

                <View>
                  <Image
                    source={require("@assets/info.png")}
                    style={{ height: 20, width: 20 }}
                  />
                </View>
              </View>

              <View className="px-16 mt-5 w-full flex flex-row justify-between items-center">
                <View>
                  <Pressable onPress={triggerUpdate}>
                    <Text className="text-[16px]">Update App</Text>
                  </Pressable>
                </View>

                <View>
                  <Smartphone color={'black'} size={18} />
                </View>
              </View>
          </View>
        )}
        {!session && (
          <View className="flex items-center">
            <View className="px-16 w-full flex flex-row justify-between items-center mt-8">
              <Text className="text-[16px]">Help and Feedback</Text>
              <Image
                source={require("@assets/comment.png")}
                style={{ height: 20, width: 20 }}
              />
            </View>
            <View className="px-16 mt-5 w-full flex flex-row justify-between items-center">
              <View>
                <Text className="text-[16px]">About</Text>
              </View>

              <View>
                <Image
                  source={require("@assets/info.png")}
                  style={{ height: 20, width: 20 }}
                />
              </View>
            </View>

            <View className="px-16 mt-5 w-full flex flex-row justify-between items-center">
              <View>
                <Pressable onPress={triggerUpdate}>
                  <Text className="text-[16px]">Update App</Text>
                </Pressable>
              </View>

              <View>
                <Smartphone color={'black'} size={18} />
              </View>
            </View>
          </View>
        )}

        { !session && (
          <View className="px-8 flex justify-center items-end w-full mb-6">
            <Link href={"SignIn"}>
              <Text className="text-lg font-bold">Login</Text>
              <LogIn color="black"/>
            </Link>
          </View>
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
