import React, { useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../../lib/supabase";
import Toast from 'react-native-root-toast'
import { Link } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function SignUp() {
    const { isLoaded, signUp, setActive } = useSignUp();

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState("");
    const router = useRouter()

    // start the sign up process.
    const onSignUpPress = async () => {
        if (!isLoaded) {
            return;
        }

        // check if passwords match.
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match.");
            return;
        }

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress,
                password,
            });

            // send the email.
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            // change the UI to our pending section.
            setPendingVerification(true);
        } catch (err) {
            Alert.alert(err.errors[0].message);
            console.error(JSON.stringify(err, null, 2));
        }
    };

    // This verifies the user using email code that is delivered.
    const onPressVerify = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            await setActive({ session: completeSignUp.createdSessionId });

            router.push("/(hadeeth)")
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View>
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

                            {!pendingVerification && (
                                <>
                                    <View className="mt-9">
                                        {/*<Image source={require("../assets/envelope.png")} style={{ width: 20, height: 20 }}/>*/}
                                        <TextInput
                                            label="First Name"
                                            leftIcon={{ type: "font-awesome", name: "lock" }}
                                            onChangeText={(text) => setFirstName(text)}
                                            className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            value={firstName}
                                            placeholder="First Name"
                                            autoCapitalize={"words"}
                                        />
                                    </View>
                                    <View className="mt-4">
                                        {/*<Image source={require("../assets/envelope.png")} style={{ width: 20, height: 20 }}/>*/}
                                        <TextInput
                                            label="Last Name"
                                            leftIcon={{ type: "font-awesome", name: "lock" }}
                                            onChangeText={(text) => setLastName(text)}
                                            className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            value={lastName}
                                            placeholder="Last Name"
                                            autoCapitalize={"words"}
                                        />
                                    </View>
                                    <View className="mt-4">
                                        {/*<Image source={require("../assets/envelope.png")} style={{ width: 20, height: 20 }}/>*/}
                                        <TextInput
                                            label="Email"
                                            leftIcon={{ type: "font-awesome", name: "lock" }}
                                            onChangeText={(text) => setEmailAddress(text)}
                                            className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            value={emailAddress}
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
                                            disabled={!isLoaded}
                                            onPress={() => onSignUpPress()}
                                        >
                                            <Text></Text>
                                            <Text className="text-sm font-bold text-center text-white uppercase basis-11/12">
                                                Sign Up
                                            </Text>
                                        </Pressable>
                                    </View>
                                </>
                            )}

                            {pendingVerification && (
                                <View className="mt-9">
                                    <TextInput
                                        value={code}
                                        placeholder="Code..."
                                        onChangeText={(code) => setCode(code)}
                                        className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />

                                    <Pressable
                                        className="flex flex-row items-center justify-center py-3 px-5 w-64 rounded-xl bg-[#1EAB53] border-transparent mt-3"
                                        disabled={!isLoaded}
                                        onPress={() => onPressVerify()}
                                    >
                                        <Text></Text>
                                        <Text className="text-sm font-bold text-center text-white uppercase basis-11/12">
                                            Verify Email
                                        </Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}