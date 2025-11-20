import { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { authClient } from "@/lib/auth-client";
import Page from '@/app/components/page'

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await authClient.signIn.email({
      email,
      password
    })

    console.log(res)
  };

  return (
    <Page edges={['top']} className="bg-gray-100">
      <View className="p-10 gap-4 flex flex-col justify-center w-full h-full">
        <TextInput
          placeholder="Email"
          className="p-4 border rounded-lg lowercase"
          autoComplete="off"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          spellCheck={false}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          className="p-4 border rounded-lg lowercase"
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    </Page>
  );
}