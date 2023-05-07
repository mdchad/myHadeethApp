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
import {Info, LogIn, LogOut, MessageSquare, Smartphone} from "lucide-react-native";
import {Link, useRouter} from "expo-router";
import {TouchableHighlight} from "react-native-gesture-handler";
import {useAuth} from "../../../../context/auth";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);
  const router = useRouter()
  const { signOut } = useAuth()


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
        // await Updates.reloadAsync();
        alert('An update is available. Restart your app to apply the update.')
        // Updates.reloadAsync();
      }
    } catch (e) {
      // handle or log error
      console.log(e.message)
    }
  }

  async function onSignOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert(error.message);
    } else {
      signOut()
    }
  }

  return (
    // use class instead of className because it will turn it into style property
    <Page class="bg-gray-100">
      <View className="px-6 pt-12 bg-gray-100 flex sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
        <View className="bg-white py-2 px-8 rounded-xl flex">
          <View className="space-x-3 py-5 w-full flex flex-row items-center border-b border-gray-300">
            <MessageSquare color="black" size={20}/>
            <Text className="text-[16px]">Help and Feedback</Text>
          </View>
          <View className="space-x-3 py-5 w-full flex flex-row items-center border-b border-gray-300">
            <Info color="black" size={20}/>
            <Text className="text-[16px]">About</Text>
          </View>
          <TouchableHighlight onPress={triggerUpdate} className="w-full bg-white py-5" underlayColor="#f9fafb">
            <View className="space-x-3 w-full flex flex-row items-center">
              <Smartphone color={'black'} size={20} />
              <Text className="text-[16px]">Update App</Text>
            </View>
          </TouchableHighlight>
        </View>
        {session ? (
          <View className="bg-white rounded-xl flex mt-4">
            <TouchableHighlight onPress={onSignOut} className="w-full bg-white rounded-xl" underlayColor="#f9fafb">
              <View className="space-x-3 px-8 py-5 flex flex-row items-center w-full">
                <LogOut color="black" size={20}/>
                <Text className="text-[16px]">Sign Out</Text>
              </View>
            </TouchableHighlight>
          </View>
        ): (
        <View className="bg-white rounded-xl flex mt-4">
          <TouchableHighlight onPress={() => router.push('/SignIn')} className="w-full bg-white rounded-xl" underlayColor="#f9fafb">
            <View className="space-x-3 px-8 py-5 flex flex-row items-center w-full">
              <LogIn color="black" size={20}/>
              <Text className="text-[16px]">Login</Text>
            </View>
          </TouchableHighlight>
        </View>
        )}
      </View>
    </Page>
  );
}