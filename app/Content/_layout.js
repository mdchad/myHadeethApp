import { Slot, Stack, Tabs, useRouter } from "expo-router";
import Search, { SearchBar } from "../search";
import { Image, Keyboard, SafeAreaView, Text, TouchableWithoutFeedback, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { supabase } from "@lib/supabase";
import { useState, useEffect } from "react";
import { useAuth } from "@context/auth";
import Header from '@components/header';

export default function Layout() {
    return (
        <View className="flex-1">
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        paddingVertical: 10,
                        width: 'auto',
                    },
                    tabBarLabelStyle: {
                        // fontSize: 12,
                        margin: 0,
                        paddingTop: 0,
                        paddingBottom: 5,

                    }
                }}
            >
                <Tabs.Screen
                    name="Hadeeth"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <FontAwesome5 name="book" size={16} color={focused ? 'tomato' : 'gray'} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="Prayers"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <FontAwesome5 name="mosque" size={16} color={focused ? 'tomato' : 'gray'} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="Home"
                    options={{
                        tabBarShowLabelabel: false,
                        tabBarIcon: ({ focused }) => (
                            <FontAwesome5 name="home" size={30} color={focused ? 'tomato' : 'gray'} />
                        ),
                        // tabBarStyle: {
                        //     paddingVertical: 10,
                        //     width: 'auto',
                        //     height: 60,
                        // },
                    }}
                />

                <Tabs.Screen
                    name="Qibla"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <FontAwesome5 name="compass" size={16} color={focused ? 'tomato' : 'gray'} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="Settings"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <FontAwesome5 name="cog" size={16} color={focused ? 'tomato' : 'gray'} />
                        ),
                    }}
                />
            </Tabs>
            <StatusBar style="auto" />
        </View>
    )
}