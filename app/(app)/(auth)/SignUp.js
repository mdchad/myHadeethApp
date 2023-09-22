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
import Toast from 'react-native-root-toast'
import { Link } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Page from "@components/page";
import {ArrowLeftCircle, ChevronLeft} from "lucide-react-native";

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

    function onPressBack() {
        router.push('SignIn')
    }

    return (
        <Page>
            <View className="bg-royal-blue flex justify-between px-6 py-8 h-full w-full">
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="flex items-center justify-center w-full h-full flex-1 my-auto">
                        <View className="pb-2 flex flex-row justify-start items-end border-b-2 border-b-white w-full">
                            <Pressable onPress={onPressBack} className="p-0 flex items-end">
                                <ChevronLeft color="white" size={28} />
                            </Pressable>
                            <Text className="ml-2 text-white text-xl">
                                Create Account
                            </Text>
                        </View>

                        {!pendingVerification && (
                            <>
                                <View className="mt-9 w-full">
                                    <Text className="font-bold text-md pb-2 text-white">First Name</Text>
                                    <TextInput
                                        label="First Name"
                                        leftIcon={{ type: "font-awesome", name: "lock" }}
                                        onChangeText={(text) => setFirstName(text)}
                                        className="bg-white block w-full appearance-none rounded-md border border-gray-300 px-5 py-3 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        value={firstName}
                                        placeholder="First Name"
                                        autoCapitalize={"words"}
                                    />
                                </View>
                                <View className="mt-4 w-full">
                                    <Text className="font-bold text-md pb-2 text-white">Last Name</Text>
                                    <TextInput
                                        label="Last Name"
                                        leftIcon={{ type: "font-awesome", name: "lock" }}
                                        onChangeText={(text) => setLastName(text)}
                                        className="bg-white block w-full appearance-none rounded-md border border-gray-300 px-5 py-3 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        value={lastName}
                                        placeholder="Last Name"
                                        autoCapitalize={"words"}
                                    />
                                </View>
                                <View className="mt-4 w-full">
                                    <Text className="font-bold text-md pb-2 text-white">Email</Text>
                                    <TextInput
                                        label="Email"
                                        leftIcon={{ type: "font-awesome", name: "lock" }}
                                        onChangeText={(text) => setEmailAddress(text)}
                                        className="bg-white block w-full appearance-none rounded-md border border-gray-300 px-5 py-3 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        value={emailAddress}
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
                                <View className="mt-4 w-full">
                                    <Text className="font-bold text-md pb-2 text-white">Confirm Password</Text>
                                    <TextInput
                                        label="Password"
                                        leftIcon={{ type: "font-awesome", name: "lock" }}
                                        onChangeText={(text) => setConfirmPassword(text)}
                                        className="bg-white block w-full appearance-none rounded-md border border-gray-300 px-5 py-3 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        value={confirmPassword}
                                        secureTextEntry={true}
                                        placeholder="Confirm Password"
                                        autoCapitalize={"none"}
                                    />
                                </View>
                                <View className="mt-8 mb-4 w-full flex items-center">
                                    <Pressable
                                        className="bg-white flex flex-row items-center justify-center py-3 px-5 w-48 rounded-md border-transparent"
                                        disabled={!isLoaded}
                                        onPress={() => onSignUpPress()}
                                    >
                                        <Text></Text>
                                        <Text className="text-sm font-bold text-center basis-11/12">
                                            Sign Up
                                        </Text>
                                    </Pressable>
                                </View>
                            </>
                        )}

                        <View className="flex flex-row">
                            <Text className="text-white">Already have an account?</Text>
                            <Link href={'SignIn'} className="text-white"> Login Here</Link>
                        </View>

                        {pendingVerification && (
                            <View className="mt-9">
                                <TextInput
                                    value={code}
                                    placeholder="Code..."
                                    onChangeText={(code) => setCode(code)}
                                    className="block w-64 appearance-none rounded-xl border border-gray-300 px-5 py-3 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                </ScrollView>
            </View>
        </Page>
    );
}