import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Switch
} from "react-native";

import * as Updates from 'expo-updates';
import Page from "@components/page";
import {BellRing, Hourglass, Info, LogIn, MessageSquare, Smartphone, User} from "lucide-react-native";
import { Link, useRouter } from "expo-router";
import { TouchableHighlight } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import { View as MotiView, AnimatePresence } from 'moti';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/header";


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
    const [isEnabled, setIsEnabled] = useState(false);
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('time');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            setShow(false);
            // for iOS, add a button that closes the picker
        }
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const triggerUpdate = async () => {
        try {
            await AsyncStorage.clear();
            AsyncStorage.getAllKeys()
              .then(keys => AsyncStorage.multiRemove(keys))
              .then(() => console.log('success'));
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

    return (
        <Page class="bg-gray-100">
            <ScrollView className="py-4">
                <View className="px-4 bg-gray-100 flex sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
                    <View className="bg-white rounded-xl flex">
                        <View className="bg-white rounded-xl space-x-3 px-4 py-2 flex flex-row items-center justify-between w-full">
                            <View className="space-x-3 items-center flex flex-row">
                                <BellRing color="black" size={20} />
                                <Text className="text-lg">Notification</Text>
                            </View>
                            <Switch
                              trackColor={{false: '#d1d5db', true: '#5BC236'}}
                              thumbColor={isEnabled ? '#FFF' : '#f4f3f4'}
                              ios_backgroundColor="#d1d5db"
                              onValueChange={toggleSwitch}
                              value={isEnabled}
                            />
                        </View>
                        {
                            isEnabled && (
                                <View
                                  className="bg-white rounded-xl space-x-3 px-4 py-2 flex flex-row items-center justify-between w-full">
                                    <View className="w-full space-x-3 justify-between items-center flex flex-row">
                                        <View className="space-x-3 items-center flex flex-row">
                                            <Hourglass color="black" size={20} />
                                            <Text className="text-lg">Daily hadith time</Text>
                                        </View>
                                        {/*<View>*/}
                                        {/*    <DateTimePicker*/}
                                        {/*      testID="dateTimePicker"*/}
                                        {/*      value={date}*/}
                                        {/*      mode={mode}*/}
                                        {/*      is24Hour={true}*/}
                                        {/*    />*/}
                                        {/*</View>*/}
                                    </View>
                                </View>
                          )
                        }
                    </View>
                    <Text className="ml-5 mb-4 mt-2 text-gray-600">Show hadith notification daily</Text>
                    <View className="bg-white rounded-xl flex">

                        <View className="mx-5 space-x-3 py-3 flex flex-row items-center border-b border-gray-300">
                            <MessageSquare size={20} color={'black'} />
                            <Text className="text-lg">Help and Feedback</Text>
                        </View>
                        <View className="mx-5 space-x-3 py-3 flex flex-row items-center border-b border-gray-300">
                            <Info size={20} color={'black'} />
                            <Text className="text-lg">About</Text>
                        </View>
                        <TouchableHighlight onPress={triggerUpdate} className="rounded-b-xl bg-white" underlayColor="#f9fafb">
                            <View className="mx-5 py-3 space-x-3 flex flex-row items-center">
                                <Smartphone color={'black'} size={20} />
                                <Text className="text-lg">Update App</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </ScrollView>
        </Page>
    );
}