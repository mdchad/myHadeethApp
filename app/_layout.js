import {Slot, Stack, useSegments} from "expo-router";
import { Provider } from "@context/auth";
import { ClerkProvider, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "../utils/cache";
import Constants from "expo-constants";

export default function Root() {
  return (
    // Setup the auth context and render our layout inside of it.
    <ClerkProvider publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <Provider>
        <Slot />
      </Provider>
    </ClerkProvider>
  );
}