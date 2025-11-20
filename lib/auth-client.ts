import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";
import { expoClient } from "@better-auth/expo/client";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  fetchOptions: {
    headers: {
      'User-Agent': 'MyWayApp/1.0.0'
    },
  },
  plugins: [
    // anonymousClient(),
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storagePrefix: Constants.expoConfig?.scheme as string,
      storage: SecureStore,
    })
  ],
});
