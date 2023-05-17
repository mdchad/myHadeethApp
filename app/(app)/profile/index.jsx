import React from "react";
import {
  View,
  Text,
  ScrollView,
} from "react-native";

import Page from "@components/page";

export default function Profile() {
  return (
    <Page class="bg-gray-100">
      <ScrollView className="py-4">
        <View className="px-4 bg-gray-100 flex sm:mx-auto sm:w-full sm:max-w-md w-full h-full">
          <Text>Hello world</Text>
        </View>
      </ScrollView>
    </Page>
  );
}