import { View, Text, TouchableWithoutFeedback, Keyboard, Image, ScrollView, useWindowDimensions, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import {useRouter } from 'expo-router'
import books from '@data/books.json'
import initials from "initialism";
import {TouchableHighlight} from "react-native-gesture-handler";
import Header from '@components/header';
import {useAuth} from "../../../../context/auth";

const Hadeeth = () => {
    const { user } = useAuth();
    const router = useRouter()
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);

    function onTriggerPress(id, title) {
        console.log(id, title)
        router.push(`(hadeeth)/category/${id}?title=${title}`)
    }

    const Item = ({ title, id }) => (
          <View className="bg-white mb-4 rounded-xl">
              <TouchableHighlight onPress={() => onTriggerPress(id, title)} underlayColor="#f9fafb" className="rounded-xl w-full">
                  <View className="space-x-3 flex flex-row font-xl p-3 items-center">
                      <View className="bg-[#dad873] rounded-xl w-12 h-12 flex items-center justify-center">
                          <Text className="text-white font-bold">{initials(title, 2)}</Text>
                      </View>
                      <Text style={styles.title}>{title}</Text>
                  </View>
              </TouchableHighlight >
          </View>
    );

    return (
      <>
        <Header user={user}></Header>
        <View className="flex-1 bg-gray-100">
          <View className="mb-4">
              <FlatList
                data={books}
                renderItem={({ item }) => <Item title={item.title} id={item.id} />}
                keyExtractor={item => item.id}
                className="p-4 h-full"
              />
          </View>
        </View>
      </>
    );
};

const makeStyles = fontScale => StyleSheet.create({
    safeAreaViewContainer: {
        minWidth: '100%',
        minHeight: '100%',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    boxContainer: {
        paddingHorizontal: 36,
        paddingVertical: 36,
        alignItems: 'center',
        backgroundColor: '#D0D0D0',
        width: '100%',
        height: '100%',
    },
    sectionTitle: {
        fontSize: 50 / fontScale, // divide the font size by the font scale
        fontWeight: '600',
    },
    imageTop: {
        height: 200,
        width: 300,
    },
    imageBot: {
        height: 200,
        width: 300,
        marginTop: 20,
    },
    item: {
        padding: 3,
        marginVertical: 8,
        marginHorizontal: 16,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
    },
});

export default Hadeeth